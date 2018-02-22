const generateObj = require('../index')

describe('FO only has dependant FF', () => {
  it('should be {}', async () => {
    const FO = {
      'field_2': {
        '$type': 'dependant',
        'dependsOn': 'field_1',
        'map': [],
        'default': {$type: 'empty'}
      }
    }
    await expect(generateObj()(FO)).resolves.toEqual({})
  })
})

describe('FO has dependant FF', () => {
  it('should be {field_1: test1}', async () => {
    const FO = {
      'field_2': {
        '$type': 'dependant',
        'dependsOn': 'field_1',
        'map': [
          [1, 'test', {$type: 'assigned', value: 'test2'}]
        ],
        'default': {$type: 'empty'}
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
  it('should be {}', async () => {
    const FO = {
      'field_2': {
        '$type': 'dependant',
        'dependsOn': 'field_1',
        'map': [
          [1, 'test1', {$type: 'assigned', value: 'test2'}]
        ],
        'default': {$type: 'empty'}
      },
      'field_1': {
        '$type': 'assigned',
        'value': 'test1'
      }
    }
    await expect(generateObj()(FO)).resolves.toEqual({field_1: 'test1', 'field_2': 'test2'})
  })
})

describe('FO has dependant FF', () => {
  it('should be {}', async () => {
    const FO = {
      'field_2': {
        '$type': 'dependant',
        'dependsOn': ['field_1'],
        'map': [
          [1, 'test1', {$type: 'assigned', value: 'test2'}]
        ],
        'default': {$type: 'empty'}
      },
      'field_1': {
        '$type': 'assigned',
        'value': 'test1'
      }
    }
    await expect(generateObj()(FO)).resolves.toEqual({field_1: 'test1', 'field_2': 'test2'})
  })
})
