/*
 * @Descripttion: 
 * @Author: yangxia
 * @Date: 2021-12-16 16:31:19
 */
function deepCopy1(from) {
    if(typeof from !== 'object') {
        return from;
    }
    let to = Array.isArray(from) ? [] : {};
    for(let key in from) {
        if(typeof from[key] !== 'object') {
            if(Object.prototype.hasOwnProperty.call(from, key)) {
                Object.defineProperty(to, key, Object.getOwnPropertyDescriptor(from, key))
            }
        } else {
            to[key] = deepCopy1(from[key])
        }
    }
    return to;
}

function extend() {
    let target = argumnets[0];
    if(!target || typeof target !== 'object') {
        return;
    }
    for(let i = 1; i < arguments.length; i++) {
        Object.keys(arguments[i]).forEach(key => {
            target[key] = arguments[i][key]
        });
    }
    return target;
}

Function.prototype.mycall = function(context) {
    const ctx = context || window;
    ctx.func = this;
    const args = Array.from(arguments).slice(1);
    const result = ctx.func(...args);
    delete ctx.func;
    return result;
}

Function.prototype.myApply = function(context) {
    const ctx = context || window;
    ctx.func = this;
    const args = Array.from(arguments).slice(1);
    const result = ctx.func(...args);
    delete ctx.func;
    return result;
}

Function.prototype.mybind = function(context) {
    const ctx = context || winwow;
    ctx.func = this;
    const arg1 = [...arguments];
    return function() {
        const arg2 = [...arguments].concat(arg1);
        const result = ctx.func(...arg2);
        delete ctx.func
        return result;
    }
}

function throttle(delay, action) {
    let last = 0;
    return function() {
        let now = +new Date();
        if (now - last > delay) {
            action.apply(null, arguments);
            last = now;
        }
    }
}

function debounce(delay, action) {
    let id = 0;
    return function() {
        const ctx = this;
        const arg = arguments;
        if (id) {
            window.clearTimeout(id);
        }
        id = setTimeout(() => {
            delay.apply(ctx, arg)
        }, delay);
    }
}

function curry(fn, ...arr) {
    if (arr.length >= fn.length) {
        return fn(...arr)
    }
    return function(...arr2) {
        return curry(fn, ...arr, ...arr2)
    }
}

function debounce(time, fn) {
    let id = 0;
    return function() {
        const ctx = this;
        const arg = arguments;
        if (id) {
            clearTimeout(id);
            id = 0;
        }
        id = setTimeout(function() {
            fn.apply(ctx, arg);
        }, time);
    }
}

function curry(fn, ...arg) {
    if(arg.length >= fn.length) {
        return fn(...arg);
    }
    return function(...arg2) {
        curry(fn, ...arg, ...arg2)
    }
}

class Cookie {
    set(name, value, options = {}) {
        let cookie = '';
        if (name && value) {
            cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
            expires && (cookie += `;expires=${options.expires}`);
            maxAge && (cookie += `;max-age=${options.maxAge}`);
            path && (cookie += `;path=${options.path}`);
            domain && (cookie += `;domain=${options.domain}`);
            sucure && (cookie += `;secure`);
            document.cookie = cookie;
            return cookie;
        }
    }

    getCookieObj() {
        let obj = {};
        const cookies = document.cookies.split(';');
        cookies.forEach(item => {
            const info = item.split('=');
            const key = info[0];
            const calue = info[1];
            key && value && (obj[key] = value)
        });
        return obj;
    }

    get(name) {
        const all = this.getCookieObj();
        return all[name] || null;
    }

    remove(name) {
        document.cookie = `${name}=;max-age=0`;
    }

    clear() {
        const all = this.getCookieObj();

        for(let co of all) {
            document.cookie = `${co}=;max-age=0`;
        }
    }

}

function ajaxGet() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://www.baidu.com', true);
    xhr.setRequestHeader('x-id', 1);
    xhr.onreadystatechange = () => {
        if(xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) {
            let result = xhr.responseText;
            console.log(result);
        }
    }
    xhr.send();
}

function ajaxPost() {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://www.baidu.com', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    let name = encodeURIComponent('xiahong');
    let passport = encodeURIComponent('abc');
    let data = `name=${name}&passport=${passport}`;
    xhr.onreadystatechange = () => {
        if(xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) {
            let result = xhr.responseText;
            console.log(result);
        }
    }
    xhr.send(data);
}

const sleep = function (time) {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    });
}

function isFunction(fn) {
    return Object.prototype.toString.call(fn).slice(8, -1) === 'Function';
}

class MyPromise {
    constructor(fn) {
        if(!isFunction(fn)) {
            throw new TypeError('need a function')
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
        } catch(e) {
            this.reject(e);
        }
    }

    resolve(value) {
        if (this.status === 'pending') {
            this.value = value;
            this.status = 'resolved';
            this.onFulfilledCallbacks.forEach(fn => {
                if(isFunction(fn)) {
                    fn(this.value)
                }
            });
        }
    }
    reject(reason) {
        if(this.status === 'pending') {
            this.reason = reason;
            this.status = 'rejected';
            this.onRejectedCallbacks.forEach(fn => {
                if(isFunction(fn)) {
                    fn.apply(this, reason)
                }
            })
        }
    }
    then(onFulfilled, onRejected) {
        onFulfilled = isFunction(onFulfilled) ? onFulfilled : null;
        onRejected = isFunction(onRejected) ? onRejected : null;

        if(this.status === 'resolved') {
            return new MyPromise((resolve, reject) => {
                try {
                    const x = onFulfilled(this.value);
                    if(x instanceof MyPromise) {
                        x.then(resolve, reject);
                    } else {
                        return resolve(x);
                    }
                } catch(error) {
                    reject(error);
                }
            });
        }
        if(this.status === 'rejectd') {
            return new MyPromise((resolve, reject) => {
                try {
                    const x = onRejected(this.reason);
                    if (x instanceof MyPromise) {
                        x.then(resolve, reject);
                    } else {
                        resolve(x);
                    }
                } catch(e) {
                    reject(e);
                }
            });
        }
        if(this.status === 'pending') {
            return new MyPromise((resolve, reject) => {
                this.onFulfilledCallbacks.push(() => {
                    try {
                        const x = onFulfilled(this.value);
                        if (x instanceof MyPromise) {
                            x.then(resolve, reject);
                        } else {
                            resolve(x)
                        }
                    } catch(e) {
                        reject(e);
                    }
                });
                this.onRejectedCallbacks.push(() => {
                    try {
                        const x = onRejected(this.reason);
                        if (x instanceof MyPromise) {
                            x.then(resolve, reject)
                        } else {
                            resolve(x);
                        }
                    } catch(e) {
                        reject(x);
                    }
                });
            })
        }
    }
    catch(fn) {
        return this.then(null, fn)
    }
    finally(fn) {
        this.then(fn, fn)
    }
    static all(arr) {
        return new MyPromise((resolve, reject) => {
            try {
                let result = [];
                let count = arr.length;
                for(let i = 0; i < arr.length; i++) {
                    if (arr[i] instanceof MyPromise) {
                        arr[i].then((value) => {
                            count--;
                            result[i] = value;
                            if (count <= 0) {
                               resolve(result);
                            }
                        })
                    } else if(isFunction(arr[i])){
                        const data = arr[i].apply(null);
                        count--;
                        result[i] = data;
                        if (count <= 0) {
                            resolve(result)
                        }
                    } else {
                        count--;
                        result[i] = data;
                        if (count <= 0) {
                            resolve(result)
                        }
                    }
                }
            } catch(e) {
                reject(e);
            }
        });
    }
    static race(arr) {
        return new MyPromise((resolve, reject) => {
            arr.forEach((item,index) => {

            });
        });
    }
}


function compose(fnArr) {
    if (!Array.isArray(fnArr)) {
        throw new TypeError('middlewares stack must be array')
    }
    for(let fn of fnArr) {
        if(typeof fn !== 'function') {
            throw new TypeError('middlewares must be composed of function');
        }
    }
    return function(ctx, cb) {
        let index = -1;
        function dispatch(i) {
            if (i <= index) {
                return Promise.reject(new Error('next() called mutiple times'));
            }
            index = i;
            const fn = fnArr[i];
            if (i === fnArr.length) fn = cb;
            if (!fn) return Promise.resolve;
            try {
                return Promise.resolve(fn(ctx, function next() {
                    return dispatch(i+1);
                }))
            } catch(e) {
                Promise.reject(e)
            }
        }
        return dispatch(0)
    }
}

function queryString(str) {
    const pairs = str.split('?')[1].split('&');
    let obj = {};
    for(let pair of pairs) {
        const [key, value] = pair.split('=')
        obj[key] = value;
    }
    return obj;
}

function reverseList(head) {
    let pre, next, current;
    current = head;
    while(current) {
        next = current.next;
        current.next = pre;
        pre = current;
        current = next;
    }
    return pre;
}

function maxDepth(root) {
    if (!root) return 0;
    return Math.max(maxDepth(root.left), maxDepth(root.right)) + 1;
}

function isBalanced(root) {
    if (!root) return true;
    if (Math.abs(maxDepth(root.left) - maxDepth(root.right)) > 1) {
        return false;
    }
    return isBalanced(root.left) && isBalanced(root.right);
}

function longestUnivaluePath(root) {
    let result = 0;
    function dfs(root) {
        if(!root) return 0;
        const left = dfs(root.left);
        const right = dfs(root.right);
        const val = root.val;
        let data = 0;
        if (root.left && root.left.val === val) {
            data = left;
        }
        if (root.right && root.right.val === val) {
            data += right;
        }
        result = Math.max(result, data);
        return Math.max(left, right) + 1;
    }
    dfs(root);
    return result
}

function instanceof1(instance, constructor) {
    return constructor.prototype.isPrototypeOf(instance)
}

function instanceof2(instance, constructor) {
    while(instance.__proto__) {
        if(instance.__proto__ === constructor.ptoyotype) {
            return true;
        }
        instance = instance.__proto__;
    }
    return false;
}

// setTimeout 实现setInterval
function setInterval1(fn, time) {
    let id = 0;
    function loop() {
        id = setTimeout(() => {
            fn();
            loop();
        }, time);
    }
    loop();
    return function(id) {
        clearTimeout(id);
    }
}

// setInterval 实现 setTimeout
function setTimeout1(fn, time) {
    let id = setInterval(() => {
        fn();
        clearInterval(id);
    }, time);
    return () => {
        clearInterval(id);
    }
}

// 合并区间算法 如 [[1,2], [2, 4], [6, 9]] ===> [[1, 4], [6, 9]]
function merge(arr) {
    return arr.reduce((pre, item) => {
        if (pre.length && item[0] <= pre[pre.length - 1][1]) {
            const last = pre.pop();
            pre.push([last[0], item [1]])
        } else {
            pre.push(item)
        }
        return pre;
    }, []);
}

function convert(list) {
    const result = [];
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
    });
    return result;
}

function convert(source, parentId = '0') {
    let tree = [];
    source.forEach(item => {
        if (item.parentId === parentId) {
            tree.push(item);
            item.children = convert(source, item.id);
        }
    });
    return tree;
}



