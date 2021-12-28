<!--
 * @Descripttion: 
 * @Author: yangxia
 * @Date: 2021-12-09 14:25:12
-->
[参考文档：eslint和prettier关系](https://zhuanlan.zhihu.com/p/80574300)

eslint 主要解决2种问题

- 代码质量问题：使用方式有可能有问题(problematic patterns)
- 代码风格问题：风格不符合一定规则 (doesn’t adhere to certain style guidelines)

prettier主要解决eslint的第2个问题：代码风格问题。

与prettier相关的有2个eslint插件：

- eslint-config-prettier: disable掉eslint中代码风格问题的rule(方便给prettier接手)
- eslint-plugin-prettier: 将 prettier 的 rules 以插件的形式加入到 ESLint 里面，然后prettier报错就和eslint其他报错一样，归结到了eslint的报错范围内

最终可以使用

```javascript
// .eslintrc
{
  "extends": ["plugin:prettier/recommended"]
}
```
