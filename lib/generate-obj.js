const _ = require('lodash')
const {DNE} = require('./constants')
const {LanguageError} = require('./error')

module.exports = async function (FFArray, generators) {
  let obj = {}
  for (let i = 0, len = FFArray.length; i < len; i++) {
    const {path, FF} = FFArray[i]
    const resolvedFF = resolveFF(FF, obj)

    if (!generators[resolvedFF.$type]) {
      throw new LanguageError(`this method:${resolvedFF.$type} is not defined`)
    }

    const value = await generators[resolvedFF.$type]({path, FF: resolvedFF})
    if (!(value instanceof DNE)) {
      obj = _.set(obj, path, value)
    }
  }
  return obj
}

/**
 * resolve FF
 * @param  {object} FF
 * @param  {object} obj
 * @return {object}
 */
function resolveFF (FF, obj) {
  let stableFF = FF

  while (stableFF.$type === 'dependant') {
    const {dependsOn, map: mapValue, default: defaultValue} = stableFF

    let valuesOfdependant = []
    if (_.isArray(dependsOn)) {
      valuesOfdependant.push(...dependsOn.map((path) => _.get(obj, path)))
    } else {
      valuesOfdependant.push(_.get(obj, dependsOn))
    }

    const dependsOnFF = _.find(mapValue, ([index, value]) => {
      return _.find(valuesOfdependant, (v) => _.isEqual(value, v))
    })

    stableFF = dependsOnFF ? dependsOnFF[2] : defaultValue

    if (!stableFF.$type) {
      throw new LanguageError(`this item of map must be FF`)
    }
  }
  return stableFF
}
