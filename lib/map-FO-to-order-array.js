const _ = require('lodash')
const {DEPENDANT_NODE} = require('./constants')
const {LoopbackError, LanguageError} = require('./error')

module.exports = function buildRelationArray (FO) {
  const FFArray = buildFFArray(FO)
  const [relation, nonRelation] = _.partition(FFArray, ([path, FF]) => FF && FF.$type === DEPENDANT_NODE)
  const relationArray = _.flatten(relation.map(([path, FF]) => resolveDependantFF(path, FF)))
  const graph = buildGraph(nonRelation, relationArray)
  return buildOrderArray(FFArray, graph)
}

/**
 * using non-recursive BFS(Breadth-First-Search), to get all the leaf nodes and its paths
 * @param  {object} FO - origin object
 * @return {array[]} [[path, FF]]
 */
function buildFFArray (FO) {
  const originFO = FO
  if (!originFO || !_.size(originFO)) return []

  const FFArray = []

  let pathStack = _.keys(originFO)

  while (_.size(pathStack)) {
    const nodePath = pathStack.shift()
    const node = _.get(FO, nodePath)

    if (!_.isPlainObject(node) || _.size(node) <= 0) {
      throw new LanguageError('Any leaf field must be a Free Field')
    }

    if (_.has(node, '$type')) {
      // if it's leaf node, add [nodePath, node] to the result array
      FFArray.push([nodePath, node])
    } else {
      // if not, get the path of all child nodes, and add those path to stack
      const childStack = _.keys(node).map((childPath) => `${nodePath}.${childPath}`)
      pathStack = childStack.concat(pathStack)
    }
  }

  return FFArray
}

/**
 * using non-recursive BFS, resolve the node which $type is 'dependant'
 * @param  {string} path
 * @param  {object} FF
 * @return {array[]}    [[path, dependentPath]]
 */
function resolveDependantFF (path, FF) {
  const dependantArray = []
  const FFStack = [FF]
  while (_.size(FFStack)) {
    const {dependsOn, map: mapArray, default: defaultValue} = FFStack.pop()

    // Add dependencies to the dependantArray
    if (!_.isArray(dependsOn)) {
      throw new LanguageError(`dependsOn must be an array`)
    } else {
      dependantArray.push(...dependsOn.map((dependsOnItem) => [path, dependsOnItem]))
    }

    // find items that have dependencies from mapArray and defaultValue
    const possibleValue = _.filter(_.map(mapArray, _.last).concat(defaultValue))
    possibleValue.forEach((possibleFF) => {
      if (!possibleFF || !possibleFF.$type) {
        throw new LanguageError(`possibleFF is not a FF`)
      }

      if (possibleFF.$type === DEPENDANT_NODE) {
        FFStack.push(possibleFF)
      }
    })
  }
  return _.uniqWith(dependantArray, _.isEqual)
}

function buildGraph (nonRelation, relationArray) {
  const graph = new G()
  nonRelation.forEach(([path]) => {
    graph.insertVertex(path)
  })

  relationArray.forEach(([path, dependsOnPath]) => {
    graph.updateVertex(path, {shouldAddIndegree: true})
    graph.updateVertex(dependsOnPath, {edge: path})
  })

  return graph
}

function buildOrderArray (FFArray, graph) {
  const FFArrayObj = _.reduce(FFArray, (result, [path, FF]) => {
    result[path] = FF
    return result
  }, {})

  const orderFFArray = []
  let vertex = graph.getVertex()
  while (vertex) {
    if (!_.isPlainObject(FFArrayObj[vertex.id])) {
      throw new LanguageError('The value of dependsOn must be path of a Free Field')
    }

    orderFFArray.push({
      path: vertex.id,
      FF: FFArrayObj[vertex.id]
    })

    vertex = graph.getVertex()
  }

  if (!vertex && !graph.isEmpty()) {
    throw new LoopbackError('Graph has look back')
  }

  return orderFFArray
}

class G {
  constructor () {
    this.nodes = {}
  }

  isEmpty () {
    return _.size(this.nodes) === 0
  }

  getVertex () {
    const node = _.find(this.nodes, (node) => node.indegree === 0)
    if (node) {
      this.removeVertex(node)
      return node
    }
  }

  insertVertex (id) {
    this.nodes[id] = {
      id,
      indegree: 0,
      edges: []
    }
  }

  removeVertex (node) {
    const {id, edges} = node
    edges.forEach((path) => {
      this.nodes[path].indegree--
    })
    this.nodes = _.omit(this.nodes, id)
  }

  updateVertex (id, {shouldAddIndegree, edge}) {
    if (!this.nodes[id]) {
      this.insertVertex(id)
    }

    const oldV = this.nodes[id]
    this.nodes[id] = _.assign({}, oldV, {
      indegree: shouldAddIndegree ? oldV.indegree + 1 : oldV.indegree,
      edges: edge ? oldV.edges.concat(edge) : oldV.edges
    })
  }
}
