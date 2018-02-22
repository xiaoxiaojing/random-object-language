const _ = require('lodash')
const {DNE} = require('./constants')
const {LanguageError} = require('./error')

module.exports = {
  empty: async function () {
    return new DNE()
  },

  assigned: async function ({path, FF}) {
    return FF.value
  },

  number: async function ({path, FF}) {
    const {integer, range} = FF
    const {gt, gte, lt, lte} = range || {gt: -Infinity, lt: Infinity}
    let min = gte || gt
    let max = lte || lt

    // Get a random number in the range
    if (integer) {
      return parseInt(_.random(min, max))
    }
    return _.random(min, max)
  },

  enum: async function ({path, FF}) {
    const {values, weights = []} = FF

    if (!_.isArray(values) || !_.isArray(weights)) {
      throw new LanguageError('values or weights must be an Array')
    }

    const filledWeights = _.fill(Array(_.size(values)), 1)
    const newWeights = _.assign([], filledWeights, weights)

    let randomArray = []
    _.forEach(values, (value, index) => {
      randomArray = _.concat(randomArray, _.fill(Array(newWeights[index]), value))
    })
    const randomIndex = _.random(0, _.size(randomArray) - 1)
    return randomArray[randomIndex]
  }
}
