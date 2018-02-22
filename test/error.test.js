const generateObj = require('../index')

describe('FO has LanguageError', () => {
  it('should throw error: LanguageError', async () => {
    const FO = {
      'field_1': {
        '$type': 'other'
      }
    }
    await expect(generateObj()(FO)).rejects.toThrow()
  })
})

describe('FO has LanguageError', () => {
  it('should throw error: LanguageError', async () => {
    const FO = {
      'field_1': {
        '$type': 'enum'
      }
    }
    await expect(generateObj()(FO)).rejects.toThrow()
  })
})

describe('FO has LanguageError', () => {
  it('should throw error: LanguageError', async () => {
    const FO = {
      'field_1': {
        '$type': 'assigned',
        'value': 'Alice'
      },
      'field_2': {
        '$type': 'dependant',
        'dependsOn': 'field_1',
        'map': [
          [1, 'Alice', {}]
        ]
      }
    }
    await expect(generateObj()(FO)).rejects.toThrow()
  })
})

describe('FO has cyclic dependence', () => {
  it('should throw error: LoopbackError', async () => {
    const FO = {
      'field_1': {
        '$type': 'assigned',
        'values': 'Alice'
      },
      'field_2': {
        '$type': 'dependant',
        'dependsOn': 'field_1',
        'map': [
          [1, 'Alice', {
            '$type': 'dependant',
            'dependsOn': ['field_2']
          }]
        ]
      }
    }
    await expect(generateObj()(FO)).rejects.toThrow()
  })
})
