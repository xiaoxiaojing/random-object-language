const generateObj = require('../index')

describe('FO is {}', () => {
  it('should be {}', async () => {
    const FO = {}
    await expect(generateObj()(FO)).resolves.toEqual({})
  })
})

describe("FO is {'fileds': 'test', 'filedsArray': [1, 2], 'filedsObject': {'test': 1}, 'filedsNull': null}", () => {
  it("should be {'fileds': 'test', 'filedsArray': [1, 2], 'filedsObject': {'test': 1}}", async () => {
    const FO = {'fileds': 'test', 'filedsArray': [1, 2], 'filedsObject': {'test': 1}, 'filedsNull': null}
    await expect(generateObj()(FO)).resolves.toEqual({'fileds': 'test', 'filedsArray': [1, 2], 'filedsObject': {'test': 1}})
  })
})

describe('FO only has empty FF', () => {
  it('should be {}', async () => {
    const FO = {
      'field_1': {
        '$type': 'empty',
        'value': 'some concrete value'
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
        '$type': 'number'
      }
    }
    return generateObj()(FO).then(result => {
      expect(result['field_1']).toBe(Infinity)
    })
  })
})

describe('FO only has number FF', () => {
  it('should be in the range of 1 to 10', async () => {
    const FO = {
      'field_1': {
        '$type': 'number',
        'integer': true,
        'range': {
          lt: 4.9,
          gt: 4
        }
      }
    }
    return generateObj()(FO).then(result => {
      expect(result['field_1']).toBeGreaterThanOrEqual(4)
    })
  })
})

describe('FO only has number FF, which value is in the range of 1 to 10', () => {
  it('should be in the range of 1 to 10', async () => {
    const FO = {
      'field_1': {
        '$type': 'number',
        'range': {
          'lt': 1,
          'gt': 10
        }
      }
    }
    return generateObj()(FO).then(result => {
      expect(result['field_1']).toBeGreaterThanOrEqual(1)
      expect(result['field_1']).toBeLessThanOrEqual(10)
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
