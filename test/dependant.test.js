const generateObj = require('../index')

// describe('FO only has dependant FF', () => {
//   it('should be {}', async () => {
//     const FO = {
//       'field_2': {
//         '$type': 'dependant',
//         'dependsOn': ['field_1'],
//         'map': [],
//         'default': {$type: 'DNE'}
//       }
//     }
//     await expect(generateObj()(FO)).resolves.toEqual({})
//   })
// })

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
          ['test']
        ],
        'default': {$type: 'DNE'}
      },
      'field_1': {
        '$type': 'assigned',
        'value': 'test'
      }
    }
    await expect(generateObj()(FO)).resolves.toEqual({field_1: 'test'})
  })
})
//
// describe('FO has dependant FF', () => {
//   it('should be {field_1: test1}', async () => {
//     const FO = {
//       'field_2': {
//         '$type': 'dependant',
//         'dependsOn': ['field_1'],
//         'map': [
//           ['test1', 'test2']
//         ],
//         'default': {$type: 'DNE'}
//       },
//       'field_1': {
//         '$type': 'assigned',
//         'value': 'test1'
//       }
//     }
//     await expect(generateObj()(FO)).resolves.toEqual({field_1: 'test1', field_2: 'test2'})
//   })
// })
//
// describe('FO has dependant FF', () => {
//   it('should be {}', async () => {
//     const FO = {
//       'field_2': {
//         '$type': 'dependant',
//         'dependsOn': ['field_1'],
//         'map': [
//           ['test1', {$type: 'assigned', value: 'test2'}]
//         ],
//         'default': {$type: 'DNE'}
//       },
//       'field_1': {
//         '$type': 'assigned',
//         'value': 'test1'
//       }
//     }
//     await expect(generateObj()(FO)).resolves.toEqual({field_1: 'test1', 'field_2': 'test2'})
//   })
// })
//
// describe('FO has dependant FF', () => {
//   it("should be {field_1: 'test1', 'field_2': 'test2', 'field_3': ['test2']}", async () => {
//     const FO = {
//       'field_2': {
//         '$type': 'dependant',
//         'dependsOn': ['field_1', 'field_3'],
//         'map': [
//           ['test1', ['test2'], {$type: 'assigned', value: 'test2'}]
//         ],
//         'default': {$type: 'DNE'}
//       },
//       'field_1': {
//         '$type': 'assigned',
//         'value': 'test1'
//       },
//       'field_3': {
//         '$type': 'assigned',
//         'value': ['test2']
//       }
//     }
//     await expect(generateObj()(FO)).resolves.toEqual({field_1: 'test1', 'field_2': 'test2', 'field_3': ['test2']})
//   })
// })
