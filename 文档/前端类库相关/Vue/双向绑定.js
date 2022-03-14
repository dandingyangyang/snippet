/*
 * @Description: 
 * @Author: yangxia
 * @Date: 2022-03-02 14:22:07
 */

/**
 * 1. 使用Object.defineProperty
 */
class Depth {
    constructor() {
        this.subs = [];
    }
    addSub(watcher) {
        this.subs.push(watcher);
    }
    notify() {
        this.subs.forEach(watcher => watcher.update());
    }
    depend() {
        if (Depth.target) {
            this.addSub(Depth.target);
            Depth.target = null;
        }
    }
}

class Watcher {
    constructor(fn) {
        this.fn = fn;
        this.get()
    }
    get() {
        Depth.target = this;
        this.fn();
    }
    update() {
        this.fn();
    }
}

class Observer {
    constructor(obj) {
        this.value = obj;
        this._obj_ = {};
        this.walk(obj);
        return this._obj_;
    }

    walk() {
        const keys = Object.keys(this.value);
        for (let i = 0; i < keys.length; i++) {
            const val = this.value[keys[i]];
            this.defineReactive(this._obj_, keys[i], val);
        }
    }

    defineReactive(obj, key, val) {
        let dep = new Depth();
        const property = Object.getOwnPropertyDescriptor(obj, key)
        const getter = property && property.get
        const setter = property && property.set
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get: function() {
                const value = getter ? getter.call(obj) : val;
                if (Depth.target) {
                    // 把 watcher 加入 依赖列表
                    dep.depend()
                }
                return value;
            },
            set: function(newVal) {
                const value = getter ? getter.call(obj) : val;
                if (newVal === value) {
                    return;
                }
                if (setter) {
                    setter.call(obj, newVal)
                } else {
                    val = newVal;
                }
                dep.notify()
            }
        })
    }
}

/**
 * 2. 使用Proxy实现
 */

class Depth {
    constructor() {
        this.subs = [];
    }
    addSub(watcher) {
        this.subs.push(watcher);
    }
    notify() {
        this.subs.forEach(watcher => watcher.update());
    }
    depend() {
        if (Depth.target) {
            this.addSub(Depth.target);
            Depth.target = null;
        }
    }
}

class Watcher {
    constructor(fn) {
        this.fn = fn;
        this.get()
    }
    get() {
        Depth.target = this;
        this.fn();
    }
    update() {
        this.fn();
    }
}

class Observer {
    proxy;
    constructor(obj) {
        this.value = obj;
        this.walk();
        return this.proxy;
    }

    walk() {
        let deps = {};
        this.proxy = new Proxy(this.value, {
            get: function(target, key, receiver) {
                deps[key] = deps[key] || new Depth();
                if (Depth.target) {
                    deps[key].depend();
                }
                return Reflect.get(target, key, receiver);
            },
            set: function(target, key, value, receiver) {
                const oldVal = Reflect.get(target, key, receiver);
                if (oldVal === value) {
                    return true;
                }
                Reflect.set(target, key, value, receiver);
                deps[key].notify();
                // 返回false貌似也没啥问题，但是严格模式下返回false会报错
                return true;
            }
        })
    }
}

/**
 *  测试代码
 */

let data = { a: 1, b: 2 };
let observer = new Observer(data);
let watcher = new Watcher(() => {
    console.log('get data.a:', data.a);
});
// 触发变化, 查看watcher是否会执行回调
data.a = 2;


/**
 * Proxy 对于 Object.defineProperty 的优势
 * 1. proxy 可以监听整个对象，而Object.defineProperty只能监听属性
 * 2. Proxy 可以直接监听数组的变化，V2版本是通过重写数组方法（push、pop等）实现监听新加入的元素
 * 3. Proxy的拦截方式更加全面，apply、ownKeys、deleteProperty、has 等等是 Object.defineProperty 不具备的；
 * 
 * 
 * Proxy 的劣势
 * 1. Object.defineProperty兼容性更好，支持IE9。而 Proxy 存在浏览器兼容性问题,而且无法用 polyfill 磨平，因此 Vue 的作者才声明需要等到下个大版本( 3.0 )才能用 Proxy 重写。
 */