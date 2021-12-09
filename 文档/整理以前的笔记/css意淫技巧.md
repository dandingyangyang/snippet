<!--
 * @Descripttion: 
 * @Author: yangxia
 * @Date: 2021-12-07 15:49:36
-->

1. box-shadow有时候可以用filter: drop-shadow代替

2. 
```css
/* 不受padding影响 */
position: absolute
/* 会受padding影响   */
float:  right
```

3. 父元素height是auto，子元素height：100%的问题

当父元素高度为auto，其中一个子元素a高度撑开父元素，另一个子元素b希望自己高度为父元素高度的时候，如果只写height：100%；
那么b的高度 将会是0；

解决办法：
对父元素设置position: relative; 对 b元素设置position：absolute; height：100%; 
貌似这个height：100%要在 绝对定位的时候生效，普通文档流中不生效 。

4. height：100% 和 height : inherit

[文章](https://www.zhangxinxu.com/study/201502/height-100-height-inherit.html)
   
我们非常熟悉的: 当父容器position值为static的时候，子元素 定位为absolute；height设置为100%，那么他会相对于祖先元素中第一个position为 非 static的元素开始定位

我们不熟悉的是:当height为inherit的时候 ，高度为父元素的100%(不管他的父元素是什么定位)

5. css的transform动画被移除了UI线程，所以执行css 的transition：transform的时候不被js线程影响

6. 注意 .child:nth-of-type(2) 不能选中同一父元素下第2个拥有child类的元素这一点很多人误解。

nth-of-type 里面有个“type”，就表示是以元素类型为选择标准的，不是以类为选择标准，类只能是在type的基础上进行多一层的筛选。

.child:nth-of-type(2) 会选中：同一父元素下 第二个p 或者第二个div，并且 这个元素还要有.child类。

所以说class类只是在type的基础上添加了一层筛选条件，而不是直接筛选所有类型子元素里面第二个有class类的元素。

7. 保证元素宽高比
(1) 使用canvas
(2) 或者 height：0； padding-bottom：50%

8. before after默认是内联元素

9. outline 不会象border那样影响元素的尺寸或者位置，outline不占据空间

10. 最好对input的font-size， color等属性直接写上确认值，因为input 框对于这些属性有自己的默认值，不会像div那样继承父元素的值，所以最好是写死就行了

11. -webkit-text-fill-color和color有同样功能，都是指定文字颜色，不过-webkit-text-fill-color优先级更高，一般会配合-webkit-text-stroke或者-webkit-background-clip:text使用