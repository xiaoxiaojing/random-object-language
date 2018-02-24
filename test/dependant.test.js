const generateObj = require('../index')

describe('FO only has dependant FF', () => {
  it("should be {field_1: 'test', field_2: 'test'}", async () => {
    const FO = {
      'field_1': {
        '$type': 'assigned',
        'value': 'test'
      },
      'field_2': {
        '$type': 'dependant',
        'dependsOn': ['field_1'],
        'map': [
          ['test', {$type: 'assigned', value: 'test'}]
        ],
        'default': {$type: 'DNE'}
      }
    }
    await expect(generateObj()(FO)).resolves.toEqual({field_1: 'test', field_2: 'test'})
  })
})

describe('FO has dependant FF', () => {
  it('should be default', async () => {
    const FO = {
      'field_2': {
        '$type': 'dependant',
        'dependsOn': ['field_1'],
        'map': [
          ['test', {$type: 'assigned', value: 'test2'}]
        ],
        'default': {$type: 'DNE'}
      },
      'field_1': {
        '$type': 'assigned',
        'value': 'test1'
      }
    }
    await expect(generateObj()(FO)).resolves.toEqual({field_1: 'test1'})
  })
})

describe('FO has dependant FF', () => {
  it('should be default', async () => {
    const FO = {
      'field_2': {
        '$type': 'dependant',
        'dependsOn': ['field_1'],
        'map': [
          ['test', {$type: 'assigned', value: 'test2'}]
        ]
      },
      'field_1': {
        '$type': 'assigned',
        'value': 'test1'
      }
    }
    await expect(generateObj()(FO)).resolves.toEqual({field_1: 'test1'})
  })
})
