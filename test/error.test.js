const generateObj = require('../index')

describe('FO has LanguageError', () => {
  it('should throw error: LanguageError, range must be defined', async () => {
    const FO = {
      'field_1': {
        '$type': 'number'
      }
    }
    await expect(generateObj()(FO)).rejects.toThrow()
  })
})

describe('FO has LanguageError', () => {
  it('should throw error: LanguageError, range must has attribute: gt/gte, lt/lte', async () => {
    const FO = {
      'field_1': {
        '$type': 'number',
        'range': {}
      }
    }
    await expect(generateObj()(FO)).rejects.toThrow()
  })
})

describe('FO has LanguageError', () => {
  it('should throw error: LanguageError, generators is not exist', async () => {
    const FO = {
      'field_1': {
        '$type': 'other'
      }
    }
    await expect(generateObj()(FO)).rejects.toThrow()
  })
})

describe('FO has LanguageError', () => {
  it('should throw error: LanguageError, values or weights must be an Array', async () => {
    const FO = {
      'field_1': {
        '$type': 'enum'
      }
    }
    await expect(generateObj()(FO)).rejects.toThrow()
  })
})

describe('FO has LanguageError', () => {
  it('should throw error: LanguageError, Any leaf field must be a Free Field', async () => {
    const FO = {
      'field_1': {}
    }
    await expect(generateObj()(FO)).rejects.toThrow()
  })
})

describe('FO has LanguageError', () => {
  it('should throw error: LanguageError, dependsOn must be an array', async () => {
    const FO = {
      'field_1': {
        '$type': 'assigned',
        'value': 'Alice'
      },
      'field_2': {
        '$type': 'dependant',
        'dependsOn': 'field_1',
        'map': [
          ['Alice', {$type: 'DNE'}]
        ]
      }
    }
    await expect(generateObj()(FO)).rejects.toThrow()
  })
})

describe('FO has LanguageError', () => {
  it('should throw error: LanguageError, The value of dependsOn must be path of a Free Field', async () => {
    const FO = {
      'field_1': {
        '$type': 'assigned',
        'value': 'Alice'
      },
      'field_2': {
        '$type': 'dependant',
        'dependsOn': ['field_3'],
        'map': [
          ['Alice', {$type: 'DNE'}]
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
        'dependsOn': ['field_1'],
        'map': [
          ['Alice', {
            '$type': 'dependant',
            'dependsOn': ['field_2']
          }]
        ]
      }
    }
    await expect(generateObj()(FO)).rejects.toThrow()
  })
})

describe('FO has dependant FF', () => {
  it('should throw error: LoopbackError, possibleFF is not a FF', async () => {
    const FO = {
      'field_2': {
        '$type': 'dependant',
        'dependsOn': ['field_1'],
        'map': [
          ['test']
        ],
        'default': {$type: 'DNE'}
      },
      'field_1': {
        '$type': 'assigned',
        'value': 'test'
      }
    }
    await expect(generateObj()(FO)).rejects.toThrow()
  })
})
