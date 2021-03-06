const generateObj = require('../index')

describe('FO is {}', () => {
  it('should be {}', async () => {
    const FO = {}
    await expect(generateObj()(FO)).resolves.toEqual({})
  })
})

describe('FO only has empty FF', () => {
  it('should be {}', async () => {
    const FO = {
      'field_1': {
        '$type': 'DNE'
      }
    }
    await expect(generateObj()(FO)).resolves.toEqual({})
  })
})

describe('FO only has assigned FF, which value is test', () => {
  it('should be {"field_1": "test"}', async () => {
    const FO = {
      'field_1': {
        '$type': 'assigned',
        'value': 'test'
      }
    }
    await expect(generateObj()(FO)).resolves.toEqual({'field_1': 'test'})
  })
})

describe('FO only has number FF', () => {
  it('should be in the range of 1 to 10', async () => {
    const FO = {
      'field_1': {
        '$type': 'number',
        'range': {
          'lt': 3,
          'gt': 1
        }
      }
    }
    return generateObj()(FO).then(result => {
      expect(result['field_1']).toBeGreaterThan(1)
      expect(result['field_1']).toBeLessThan(3)
    })
  })
})

describe('FO only has number FF, which is integer', () => {
  it('should be 4', async () => {
    const FO = {
      'field_1': {
        '$type': 'number',
        'integer': true,
        'range': {
          lt: 3,
          gt: 1
        }
      }
    }
    return generateObj()(FO).then(result => {
      expect(result['field_1']).toBe(2)
    })
  })
})

describe('FO only has enum FF, which value is [Alice, Bob, Li]', () => {
  it('should be Alice or Bob or Li', async () => {
    const FO = {
      'field_1': {
        '$type': 'enum',
        'values': ['Alice', 'Bob', 'Li']
      }
    }
    return generateObj()(FO).then(result => {
      expect(['Alice', 'Bob', 'Li']).toEqual(expect.arrayContaining([result['field_1']]))
    })
  })
})

describe('FO has child node', () => {
  it('should be ', async () => {
    const FO = {
      'field_1': {
        'field_2': {
          '$type': 'assigned',
          'value': 'Alice'
        }
      }
    }
    await expect(generateObj()(FO)).resolves.toEqual({'field_1': {'field_2': 'Alice'}})
  })
})
