
/* 
深度拷贝相关：
  对象深拷贝：
    1. JSON.stringify()之后再JSON.parse。
      此方法仅在原对象包含可序列化值类型且没有任何循环引用时才有效。不可序列化类型值包括：函数，undefined等。Date这种序列化之后只剩时间信息，parse之后丢失了很多信息。具体可以看MDN：https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
    2. 递归进行深拷贝

浅拷贝相关：
  对象浅拷贝
    1. Object.assign
    2. ...  拓展运算符
  数组浅拷贝：
  1. array.concat()
  2. array.slice(0)
*/

// 1. 深拷贝
function deepCopy1(from) {
    if (typeof from !== 'object') {
      return from;
    }
    let to = Array.isArray(from) ? [] : {};
    // 或者用Object.keys直接获取自身的可遍历属性。这里注意如果外层是for...in，内部需要搭配hasOwnProperty才能获取到自身的可遍历属性
    for (let key in from) {
      if (typeof from[key] !== 'object') {
        // 为什么不直接使用source.hasOwnProperty(key)呢？
        // 因为JavaScript 并没有保护 hasOwnProperty 属性名，因此某个对象是有可能自己定义了一个hasOwnProperty的属性
        if (Object.prototype.hasOwnProperty.call(from, key)) {
          // 直接to[key]=from[key]只能拿到值，拿不到存取器属性定义
          Object.defineProperty(
            to,
            key,
            Object.getOwnPropertyDescriptor(from, key)
          )
        }
      } else {
        to[key] = deepCopy1(from[key]);
      }
    }
    return to;
  }
  
  // 直接用object.assign()
  function deepCopy2(obj) {
    if(typeof obj !== 'object') return obj;
    let result = Array.isArray(obj) ? [] : {};
    Object.keys(obj).forEach((key) => {
        result[key] = deepCopy(obj[key]);
        // 不需要判断了
        // if(typeof obj[key] === 'object') {
        //     result[key] = deepCopy(obj[key]);
        // } else {
        //     result[key] = obj[key];
        // }
    });
    return result;
  }
  
  /** 
   * 2. extend 一个对象
  */
  
  function extend() {
    let target = arguments[0];
    if (!target || typeof target !== 'object') {
      return;
    }
    for(let i = 1; i<arguments.length; i++) {
      let source = arguments[i];
      for(key in source) {
        // 那为什么不直接使用source.hasOwnProperty(source[key])呢？
        // 因为JavaScript 并没有保护 hasOwnProperty 属性名，因此某个对象是有可能自己定义了一个hasOwnProperty的属性
        if(Object.prototype.hasOwnProperty.call(source, key)) {
          Object.defineProperty(
            target,
            key,
            Object.getOwnPropertyDescriptor(source, key)
          )
          // target[key] = source[key];
        }
      }
    }
    return target;
  }
  
  /** 
   * 3. 手写call apply bind函数
   * 使用 fn1.call(obj, query1, query2);
  */
  
  Function.prototype.myCall = function(context) {
    const ctx = context || window;
    // 这里的this 就是 fn1;
    ctx.func = this;
    // 获取参数
    let args = Array.from(arguments).slice(1);
    // 以对象的形式调用func，是为了把this绑定成ctx
    const result = ctx.func(...args);
    delete ctx.func;
    return result;
  }
  
  Function.prototype.myApply = function(context) {
    const ctx = context || window;
    // 这里的this 就是 fn1;
    ctx.func = this;
    // 以对象的形式调用func，是为了把this绑定成ctx
    const result = arguments[1] ? ctx.func(...arguments[1]) : ctx.func();
    delete ctx.func;
    return result;
  }
  
  Function.prototype.bind = function(context) {
    const ctx = context || window;
    ctx.func = this;
    // 获取实参，用于将bind函数参数以及返回函数的参数进行合并
    const args1 = Array.from(arguments).slice(1);
    return function () {
      const arg = args1.concat(Array.from(arguments));
      const result = arg.length > 0 ? ctx.func(...arg) : ctx.func();
      delete ctx.func;
      return result;
    }
  }
  
  /**
   * 节流和防抖
   */
  // 节流：前面的绑定没执行的话，本次绑定就不生效
  function throttle(delay, action) {
    let last = 0;
    return function() {
      let now = +new Date();
      if(now - last > delay) {
        action.apply(null, arguments);
        last = now;
      }
    }
  }
  
  // 防抖：让前面的绑定失效，从这次开始计时
  function debounce(delay, action) {
    let id = 0;
    return function() {
      const ctx = this;
      const arg = arguments;
      if (id) {
        window.clearTimeout(id);
        id = 0;
      }
      // setTimeout 里面的 arguments 会变，所以需要存下外面的 arguments
      id = setTimeout(() => {
        action.apply(ctx, arg);
      }, delay);
    }
  }
  
  /**
   * curry
   * 注意：console.dir  可以看到一个函数以目录形式展示的具体信息
  */
  
  function curry(fn, ...arg) {
    if(arg.length >= fn.length) {
      return fn(...arg);
    }
    return function(...arg2) {
      return curry(fn, ...arg, ...arg2);
    }
  }
  
  // 3. 封装cookie使用
  class Cookie {
    set(name, value , options = {}) {
      let cookie = '';
      const {expires, maxAge, path, domain, secure} = options;
      if(name && value) {
        cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
        expires && (cookie += `;expires=${options.expires}`);
        maxAge && (cookie += `;max-age=${options.maxAge}`);
        path && (cookie += `;path=${options.path}`);
        domain && (cookie += `;domain=${options.domain}`);
        secure && (cookie += `;secure`);
      }
      document.cookie = cookie;
      return cookie;
    }
    getCookiesObj() {
      let obj = {};
      const cookies = document.cookie.split(';');
      cookies.forEach((item) => {
        const info = item.split('=');
        const key = info[0];
        const value = info[1];
        key && value && (obj[key] = value);
      });
      return obj;
    }
    get(name) {
      const allCookies = this.getCookiesObj();
      return allCookies[name] || null;
    }
    // 另一种使用正则匹配的方式
    getCookieValue(name) {
      // reg可以用字符串模板，也可以用字符串拼接
      // reg = "(^|[^;]*)\\s*" + name + "\\s*=\\s*([^;]+)\\s*";
      let result = document.cookie.match(`(^|[^;]*)\\s*${name}\\s*=\\s*([^;]+)\\s*`)
      return result ? result.pop() : ""
    }
    
    remove(name) {
      const value = this.get(name);
      if (value) {
        // document.cookie = xxx 一次只能对一个cookie进行更新
        document.cookie = `${name}=;max-age=0`;
      }
    }
    clear() {
      const allCookies = this.getCookiesObj();
      for(let key in allCookies) {
        // document.cookie = xxx 一次只能对一个cookie进行更新
        document.cookie = `${key}=;max-age=0`;
      }
    }
  }
  
  // 4. 手写ajax
  /** 
   * XMLHttpRequest.readyState
   *  0 UNSENT              代理被创建，但尚未调用 open() 方法
   *  1 OPENED              open() 方法已经被调用
   *  2 HEADERS_RECEIVED    send() 方法已经被调用，并且头部和状态已经可获得
   *  3 LOADING             下载中； responseText 属性已经包含部分数据
   *  4 DONE                下载操作已完成
   * 
   * XMLHttpRequest.status 表示服务器回应的 HTTP 状态码 200
   * XMLHttpRequest.onreadystatechange
   * XMLHttpRequest.responseText
   * XMLHttpRequest.setRequestHeader() 用于设置请求头，该方法必须在open()之后,send()之前调用
   * * XMLHttpRequest.timeout   设置超时时间，该属性必须在open()之后,send()之前设置
   * XMLHttpRequest.getResponseHeader()
   * XMLHttpRequest.getAllResponseHeaders()
  */
  
  function ajaxGet() {
    let xhr = new XMLHttpRequest();
    // 第三个参数true 代表异步。第四个和第五个参数是传用户名和密码，一般不用
    xhr.open('GET', 'https://www.jianshu.com/p/2e64ec9a5a49', true); 
    xhr.setRequestHeader('x-id', 1);
    xhr.onreadystatechange = () => {
      if(xhr.readyState === 4) {
        if(xhr.status >= 200 && xhr.status < 300) {
          let result = xhr.responseText;
          console.log(result);
        }
      }
    }
    xhr.send();
  }
  
  function ajaxPost() {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://www.jianshu.com/p/2e64ec9a5a49');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    let name = encodeURIComponent('xiahong');
    let passport = encodeURIComponent('abc');
    let data = `name=${name}&passport=${passport}`;
    xhr.send(data);
    /** 
     * 或者使用application/json 
     * xhr.setRequestHeader('Content-Type', 'application/json');
     * xhr.send(JSON.stringify({
     *    name: xxx,
     *    passport: xxx
     * }));
    */
  }
  
  // 封装一下请求，返回promise格式
  function formatData(data) {
    if(!data) {
      return null;
    }
    let obj = {};
    if(typeof data === 'string') {
      const infos = data.split('&');
      infos.forEach(info => {
        const key = info.split('=')[0];
        const value = info.split('=')[1];
        obj[key] = value;
      })
    } else {
      obj = data;
    }
    return obj;
  }
  function obj2string(obj) {
    let arr = [];
    for(let key in obj) {
      arr.push(`${key}=${obj[key]}`);
    }
    return arr.join('&');
  }
  function ajax({url, method, data, async = true, timeout}) {
    return new Promise((resolve, reject) => {
      xhr = new XMLHttpRequest();
      const _data = formatData(data);
      xhr.onreadystatechange = () => {
        if(xhr.readyState === 4) {
          if(xhr.status >= 200 && xhr.status < 300) {
            resolve(xhr.responseText);
          } else {
            reject(xhr);
          }
        }
      }
      
      const isGet = method.toLowerCase() === 'get';
      if (isGet && _data) {
        url += '?' + obj2string(_data);
      }
      xhr.open(method, url, async);
      xhr.timeout = timeout;
      if(isGet) {
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send();
      } else {
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(_data);
      }
    });
  }
  
  // 5. 手写promise
  function isFunction(fn) {
    return typeof fn === 'function';
  }
  
// 当不确定aaa是否是promise时，【注意】let a = Promise.resolve(aaa) 可以把aaa转成一个promise对象a，使用a.then(() => {})顺序执行某些东西
  class MyPromise {
    constructor(fn) {
      if (!isFunction(fn)) {
        throw new TypeError('need a function');
      }
      this.status = 'pending';
      this.onFulfilledCallbacks = [];
      this.onRejectedCallbacks = [];
      this.value = '';
      this.reason = '';
  
      this.resolve = this.resolve.bind(this);
      this.reject = this.reject.bind(this);
      this.then = this.then.bind(this);
      this.catch = this.catch.bind(this);
      try {
        fn.call(this, this.resolve, this.reject);
      } catch (error) {
        this.reject(error);
      }
    }
    resolve(value) {
      if (this.status === 'pending') {
        this.status = 'fulfilled';
        this.value = value;
        this.onFulfilledCallbacks.forEach(fn => {
          if (isFunction(fn)) {
            fn(value);
          }
        });
      }
    }
    reject(message) {
      if (this.status === 'pending') {
        this.status = 'rejected';
        this.reason = message;
        this.onRejectedCallbacks.forEach(fn => {
          if(isFunction(fn)) {
            fn(message);
          }
        });
      }
    }
    then(onFulfilled, onRejected) {
      onFulfilled = isFunction(onFulfilled) ? onFulfilled : function(data) {
        return data;
      }
      onRejected = isFunction(onRejected) ? onRejected : function(message) {
        return message;
      }
      if(this.status === 'fulfilled') {
        return new MyPromise((resolve, reject) => {
          try {
            const x = onFulfilled(this.value);
            if(x instanceof MyPromise) {
              x.then(resolve, reject);
            } else {
              resolve(x);
            }
          } catch (err) {
            reject(err);
          }
        })
      }
      if(this.status === 'rejected') {
        return new MyPromise((resolve, reject) => {
          try {
            const x = onRejected(this.reason);
            if(x instanceof MyPromise) {
              x.then(resolve, reject);
            } else {
              resolve(x);
            }
          } catch (err) {
            reject(err);
          }
        });
      }
      if (this.status === 'pending') {
        return new MyPromise((resolve, reject) => {
          this.onFulfilledCallbacks.push(() => {
            try {
              const x = onFulfilled(this.value);
              if (x instanceof MyPromise) {
                x.then(resolve, reject);
              } else {
                resolve(x);
              }
            } catch (err) {
              reject(err);
            }
          });
          this.onRejectedCallbacks.push(() => {
            try {
              const x = onRejected(this.reason);
              if(x instanceof MyPromise) {
                x.then(resolve, reject);
              } else {
                resolve(x);
              }
            } catch (err) {
              reject(err);
            }
          });
        });
      }
    }
    catch (fn) {
      return this.then(null, fn);
    }
    finally(callback) {
      // promise 的 finally 只是不管成功还是失败都会执行而已，而不一定会永远最后执行
      const P = this.constructor;
      return this.then(
        // 不直接使用Promise.resolve而是使用P.resolve 是为了兼容哪些低版本的polyfill，这些polyfill可能不叫Promise，可能叫MyPromise
        value => P.resolve(callback(value)).then(() => value),
        // 之所以要用P.resolve 是考虑到callback可能是一个异步函数，并且希望等callback执行完再接着执行
        reason => P.resolve(callback(reason)).then(() => { throw reason})
      );
    }
    static all(arr) {
      return new MyPromise((resolve, reject) => {
        try {
          let length = arr.length;
          let result = [];
          arr.forEach((item, index) => {
            if(item instanceof MyPromise) {
              item.then((value) => {
                result[index] = value;
                if (--length === 0) {
                  resolve(result);
                }
              });
            }
            if (isFunction(item)) {
              const value = item();
              result[index] = value;
              if(--length === 0) {
                resolve(result);
              }
            }
          });
        } catch (err) {
          reject(err);
        }
      });
    }
    static race(arr) {
      return new MyPromise((resolve, reject) => {
        try {
          arr.forEach((item) => {
            if (item instanceof MyPromise) {
              item.then(resolve, reject);
            }
            if(isFunction(item)) {
              const value = item();
              resolve(value);
            }
          });
        } catch (err) {
          reject(err);
        }
      });
    }
  }
  
  // compose函数
  function compose(fnArr) {
    if (!Array.isArray(fnArr)) {
      throw new TypeError('middlewares stack must be an array!');
    }
    for (let fn in fnArr) {
      if (typeof fn !== 'function') {
        throw new TypeError('Middleware must be composed of functions!');
      }
    }
    return (ctx, cb) => {
      let index = -1;
      function dispatch(i) {
        if(i<= index) {
          return Promise.reject(new Error('next() called multiple times'));
        }
        index = i;
        const fn = fnArr[i];
        if(i === fnArr.length) fn = cb;
        if(!fn) return Promise.resolve();
        try {
          return Promise.resolve(fn(ctx, function next() {
            dispatch(i+1);
          }));
        } catch(e) {
          return Promise.reject(e);
        }
      }
      return dispatch(0);
    }
  }
  
  // http://muyiy.cn/question/program/88.html
  convert = (list) => {
    const result = [];
    // 不一定要一步到位，可以先存下id到data的映射
    const obj = list.reduce((res, data) => {
      res[data.id] = data;
      return res;
    }, {});
    list.forEach(item => {
      if (item.parentId === 0) {
        result.push(item);
      } else {
        const parent = obj[item.parentId];
        parent.children = parent.children || [];
        parent.children.push(item);
      }
    })
    return result;
  }
  // 递归
  convert = (source, parentId = '0') => {
    let tree = [];
    source.forEach((item) => {
      if(item.parentId === parentId) {
        item.children = convert(source, item[id]);
        tree.push(item);
      }
    });
    return tree;
  }
  
  // 获取 url 上的 query
  function queryString1(str) {
    const arr = str.split('?')[1];
    if (!arr) return {};
    const validPart = arr.split('#')[0];
    if (!validPart) return {};
    const pairs = validPart.split('&');
    let obj = pairs.reduce((pre, item) => {
       const key = item.split('=')[0];  
       const value = item.split('=')[1];  
       pre[key] = value;
       return pre;
    }, {});
    return obj
  }
  
  function queryString2(str) {
    const obj = {};
    str.replace(/([^?=&#]+)=([^=?&#]+)/g, (match, key, value) => {
      obj[key] = value;
    });
    return obj;
  }
  
  // 实现instanceOf
  function instanceof1(instance, constructor) {
    return constructor.prototype.isPrototypeOf(instance)
  }
  
  function instanceof2(instance, constructor) {
    while (instance.__proto__) {
      if (instance.__proto__ === constructor.prototype) {
        return true;
      }
      instance = instance.__proto__;
    }
    return false;
  }
  
  // setTimeout 实现setInterval
  function setInterval (fn, time) {
    let id = 0;
    // 其实这里好像需要一进来就执行下 fn();
    function circle() {
      if (id) {
        clearTimeout(id);
        id = 0;
      }
      id = setTimeout(() => {
        fn();
        circle();
      }, time);
    }
    circle();
    return function clearInterval() {
      clearTimeout(id);
    }
  }
  
  // setInterval 实现 setTimeout
  function setTimeout(fn, time) {
    let id = setInterval(() => {
      fn();
      clearInterval(id);
    }, time);
    return function() {
      clearInterval(id);
    }
  }
  
  // 合并区间算法 如 [[1,2], [2, 4], [6, 9]] ===> [[1, 4], [6, 9]]
  function merge(arr) {
    return arr.reduce((pre, item) => {
      const length = pre.length;
      const last = pre[length - 1] || [];
      const stable = pre.slice(0, -1);
      let result;
      if (last[last.length - 1] == item[0]) {
        result = stable.concat([[last[0], item[item.length - 1]]]);
      } else {
        result = pre.concat([item]);
      }
      return result;
    }, []);
  }
  
  // sleep
  function sleep(time) {
    return new Promise(resolve => {
      setTimeout(resolve, time);
    });
  }

  // 迭代器 https://es6.ruanyifeng.com/#docs/iterator
  const makeIterator = (arr) => {
    let index = 0;
    return {
      next: () => {
        return {
          done: index < arr.length ? false : true,
          value: arr[index++]
        }
      }
    }
  }
  const it = makeIterator(['人月', '神话']);
  console.log(it.next()); // { value: "人月", done: false }
  console.log(it.next()); // { value: "神话", done: false }
  console.log(it.next()); // {value: undefined, done: true }
  
  
  