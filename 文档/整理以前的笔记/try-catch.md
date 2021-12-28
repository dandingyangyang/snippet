<!--
 * @Descripttion: 
 * @Author: yangxia
 * @Date: 2021-12-09 11:51:29
-->
# try-catch

## 一.try-catch返回值问题
1、finally一定会比try里面的return先执行，也就是finally最终肯定会在return之前执行

2、如果在执行finally的时候发现finally里面有return。那么try里面的return就不管用了，直接return了finally里面的值了（谁先return谁有效）。

3、在finally里面想改变try里面的return值？不行。因为try里面的return值在执行try的时候就缓存了。如果finally里面没有return，而try里面有return，那么try里面return的值是在执行finally之前就缓存好的。而不是在执行完finally之后去调用的执行结果。

4、finally虽然不能改变try里面的return值，但是可以改变finally里面的return值，也可以改变外面变量的值。

```javascript
const result = this.test();
console.log('this.a', this.a);
console.log('result', result);
test() {
    this.a = 1;
    let r = 0;
    try {
        this.a = 2;
        console.log(this.a);
return this.a;
    } finally {
        console.log('finally’);
        this.a = 3;
            // return this.a;
    }
}
```

结果：
```javascript
2 
finally  // 说明即使try里面return了finally还是会执行
this.a 3 // 说明 在finally里面可以改变外面的值，只是不能改变try里面的
result 2 // 说明try里面的return被缓存了，finally没办法改变try里面的return

// 如果把finally里面的return注释放开，那么结果会变成：
2 
finally  
this.a 3
result 3 // 说明finally里面直接return了，try里面的return被拦截了，没有生效
```

## 二.try-catch捕捉错误问题

异步操作过程中的错误try——catch是无法捕捉到的，因为同步代码已经执行完了，异步回调里面的代码产生的错误，try-catch就捕捉不到了。

不过使用

```javascript
//  promise.catch 或者
try{  
    var a = aswait test() 
} catch(e) {
    console.log(e)
}
```

可以捕捉到异步错误