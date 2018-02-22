const _ = require('lodash')
const defaultGenerators = require('./lib/default-generators')
const mapFOToOrderArray = require('./lib/map-FO-to-order-array')
const generateObj = require('./lib/generate-obj')

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
