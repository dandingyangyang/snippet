<!--
 * @Descripttion: 
 * @Author: yangxia
 * @Date: 2021-12-06 20:10:24
-->

# 一.npm脚本和变量

## 1. npm 脚本有pre和post两个钩子

```shell
"prebuild": "echo I run before the build script",
"build": "cross-env NODE_ENV=production webpack",
"postbuild": "echo I run after the build script"
"install": "echo 333",
"uninstall": "echo 4444”
```

a. 当执行npm run build的时候，prebuild和postbuild也会自动执行

b. 当执行npm install的时候，会在默认操作（安装项目所有依赖）基础上执行我们定义的"install": "echo 333"
当执行npm uninstall的时候，会在默认操作（安装项目所有依赖）基础上执行我们定义的”uninstall": "echo 444”

注意：&& 是串行执行，&是并发执行。 && 可以使用 pre钩子和post钩子代替，因为他们都是有先后顺序的

## 2. 简写形式：四个常用的npm脚本有简写形式，其他的没有简写形式

```shell
# npm run start
npm start
# npm run stop
npm stop
# npm run test
npm test
# npm run stop && npm run restart && npm run start
npm restart
```

## 2. 变量

npm 脚本有一个非常强大的功能，就是可以使用 npm 的内部变量

首先，通过npm_package_前缀，npm 脚本可以拿到package.json里面的字段。比如，下面是一个package.json

```javascript
{
  "name": "foo", 
  "version": "1.2.5",
  "scripts": {
    "view": "node view.js"
  },
  "repository": {
    "type": "git",
    "url": "xxx"
  }
}
```

那么，变量npm_package_name返回foo，变量npm_package_version返回1.2.5, npm_package_repository_type返回git

```javascript
// view.js
console.log(process.env.npm_package_name); // foo
console.log(process.env.npm_package_version); // 1.2.5
```

上面代码中，我们通过环境变量process.env对象，拿到package.json的字段值。

如果是 Bash 脚本，可以用$npm_package_name和$npm_package_version取到这两个值。

PS:  npm run server abc --proxyAPI  中的proxyAPI会被注入npm_config_*里面，可通过process.env.npm_config_proxyAPI获取，取得的值是true。

注意：一个是npm_config_\*，一个是npm_package_\*

下面附赠是一些node进程相关的信息获取
|  命令   | 含义  |
|  ----  | ----  |
| process.env  | 和环境相关的变量 |
| process.argv  | process.argv 属性返回一个数组，其中包含当启动 Node.js 进程时传入的命令行参数 |
| process.argv0  | process.argv0 属性保存当 Node.js 启动时传入的 argv[0] 的原始值的只读副本。也就是说返回的是'node', 而process.argv[0]返回的是node可执行程序的路径 |
| process.execArgv  | 输入 node --harmony script.js --version 返回的是['--harmony’] |
| process.cwd()  | node执行的目录 |
| __dirname  | 源代码文件所在的目录。cwd是procees的一个方法，是全局的。__dirname 和 __filename 是module模块的方法，不同的模块返回的值不一样 |

例子：

```shell
test=1  node --harmony script.js --version

process.env.test  // 1

process.argv  //  ['/usr/local/bin/node', 'script.js', '--version']

process.argv0  //  node

process.execArgv  //  ['--harmony’]
```

# 二. package.json和package.lock

## 1. 关于packge.json的bin字段

(1) node_modules/.bin/目录下的文件都是一些命令的软连接文件，在运行npm 命令的时候，npm会把node_modules/.bin/目录加入系统path，在运行结束之后将这个目录移除系统Path。所以node_modules/.bin/目录下的命令都可以直接在npm script脚本里面直接使用，而不需要申明命令路径

(2) package.json 对象里的files字段表示的是在npm publish的时候需要上传到npm上的内容

package.json里面有几个依赖字段：``dependencies``，``devDependencies``,``peerDependencies``, ``optionalDependencies``， ``bundleDependencies``5个。[参开资料](https://juejin.cn/post/6844903501882097677)

|  命令   | 含义  |
|  ----  | ----  |
| peerDependencies  | 同等依赖，或者叫同伴依赖，用于指定当前包（也就是你写的包）兼容的宿主版本 |
| optionalDependencies  | 可选依赖，如果有一些依赖包即使安装失败，项目仍然能够运行或者希望npm继续运行 |
| bundledDependencies  | 一个包含依赖包名的数组对象，在发布时会将这个对象中的包打包到最终的发布包里。需要在devDependencies或dependencies声明过，否则打包会报错 |

## 2. 关于package.lock的requires和dependencies

To clarify: "requires" reflects dependencies from 'package.json' file, while "dependencies" reflects actually installed dependencies in node_modules folder of this dependency. All dependencies are installed in root node_modules by default, but if there is a conflict, they are installed in node_modules of that specific dependency.
