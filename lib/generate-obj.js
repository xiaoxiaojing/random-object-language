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
    const {dependsOn, map: mapValues, default: defaultValue} = stableFF

    const valuesOfdependant = dependsOn.map((path) => _.get(obj, path) || null)
    const dependsOnFF = _.find(mapValues, mapValue => {
      return _.isEqual(mapValue.slice(0, -1), valuesOfdependant)
    })

    stableFF = dependsOnFF ? _.last(dependsOnFF) : (defaultValue || {$type: 'DNE'})
  }
  return stableFF
}
