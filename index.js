const _ = require('lodash')
const defaultGenerators = require('./lib/default-generators')
const mapFOToOrderArray = require('./lib/map-FO-to-order-array')
const generateObj = require('./lib/generate-obj')
const {DNT, DEPENDANT_NODE} = require('./lib/constants')
const error = require('./lib/error')

module.exports = function (options = {}) {
  const {
    customGenerators = {}
  } = options

  const generators = _.assign({}, defaultGenerators, customGenerators)

  return async function (FO) {
    const orderFFArray = mapFOToOrderArray(FO)
    return generateObj(orderFFArray, generators)
  }
}

module.exports.DNT = DNT
module.exports.DEPENDANT_NODE = DEPENDANT_NODE
module.exports.error = error
