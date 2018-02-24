const language = require('../index')

const FO = {
  'field_4': {
    '$type': 'dependant',
    'dependsOn': ['field_1'],
    'map': [
      [1, 1, {'$type': 'number', 'range': {'gte': 2, 'lt': 9}}],
      [2, 2, {'$type': 'enum', 'values': ['a', 'b', 'c']}],
      [3, 'some concrete value', {'$type': 'assigned', 'value': 'God'}],
      [4, {'name': 'Alice'}, {'$type': 'assigned', 'value': 'Girl'}]
      // [5, 4, {
      //   '$type': 'dependant',
      //   'dependsOn': ['field_4']
      // }]
    ],
    'default': {'$type': 'empty'}
  },
  'field_2': {
    '$type': 'number',
    'integer': true,
    'range': {'gt': 1, 'lte': 10}
  },
  'field_3': {
    'field_3_1': {
      '$type': 'enum',
      'values': [1, 3, 'Bob', {'name': 'Alice'}],
      'weights': [2, 2, 1, 4]
    }
  }
}

async function test () {
  const OPT = await language()(FO)
  console.log(OPT)
}
test()
