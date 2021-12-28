<!--
 * @Descripttion: 
 * @Author: yangxia
 * @Date: 2021-12-09 11:39:17
-->
# canvas 和 svg

## 一. svg
viewbox 指的是在viewport里面指定某一部分可视的，类似于将那一部分放大到整个画面上

## 二.canvas
原生js操作的api
canvas  drawImage  getImageData  putImageData restore save

Canvas：可以控制里面的每个细节，用js绘制图像

可以用图片作为数据源，可进行缩放裁剪等。

可以获取修改放置canvas画布里面的数据

暂时还不支持点击

webkitBackingStorePixelRatio会影响图片和成的模糊程度


- Canvas  画每一个图之前最好ctx.beginpath(),结束之后ctx.closePath(). 免得下一个图和上一个图产生连线关系
- Canvas  画每一个图之前最好ctx.save(),结束之后ctx.restore()  也就是在开始之前保存ctx状态，结束之后恢复
- Canvas  非0环绕原则

webGL —— canvas3D