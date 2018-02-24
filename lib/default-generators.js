const _ = require('lodash')
const {DNE} = require('./constants')
const {LanguageError} = require('./error')

module.exports = {
  DNE: async function () {
    return new DNE()
  },

  assigned: async function ({path, FF}) {
    return FF.value
  },

  number: async function ({path, FF}) {
    const {integer, range} = FF

    if (!range) {
      throw new LanguageError(`range must be defined`)
    }

    const {gt, gte, lt, lte} = range
    let min = gte || (integer && gt ? gt + 1 : gt)
    let max = lte || (integer && lt ? lt - 1 : lt)

    if (min === undefined || max === undefined) {
      throw new LanguageError(`range must has attribute: gt/gte, lt/lte`)
    }

    return _.random(min, max, !integer)
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
