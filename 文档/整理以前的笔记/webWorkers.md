<!--
 * @Description: 
 * @Author: yangxia
 * @Date: 2021-12-31 15:15:04
-->

[参考文档](https://juejin.cn/post/6844904198639714311)

web workers 分为三种

1. dedicated workers 专用worker,用于一个页面
就是默认的worker
```
let worker  = new Worker("dw-ping-pong.js")
```

2. shared worker 共享worker，同源的多个页面共享

3. service worker
本质上充当 Web 应用程序与浏览器之间的代理服务器，也可以在网络可用时作为浏览器和网络间的代理。它们旨在（除其他之外）使得能够创建有效的离线体验，拦截网络请求并基于网络是否可用以及更新的资源是否驻留在服务器上来采取适当的动作。