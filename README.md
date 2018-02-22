# Random Object Language
* version: 1.0.0
* The realization of the [Random Object Language](https://github.com/zhaoyao91/random-object-language) standard

## Interface
```
/**
 * @param  {object} options - 用于扩展FO的对象
 * @param  {object} options.customGenerators - （每个函数：(FF, FO, path) => Promise<value>）
 * @param  {object} FO - 有自由度的对象
 * @return {object} obj - 无自由度的对象
 */
options => FO => obj
```

## Logic
1. 第一次遍历FO，找出dependant关系
  - 如果有回环，直接报错
  - 如果没有，输出dependant关系（一个有序数组）：[path1:FF1, path2: FF2, path3: F3,...,]

2. 遍历dependant关系数组，得到对应的值
  - 获取数组的值，并调用对应的customGenerator，获取value
  - 如果value是DNE，不做任何操作
  - 如果value不是DNE，设置新对象的值
