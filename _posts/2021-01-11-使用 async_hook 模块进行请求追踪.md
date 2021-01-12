---
layout: post
title:  "使用 async_hook 模块进行请求追踪"
categories: 实践
tags:  Node.js async_hook 追踪
author: toBeTheLight
---

* content
{:toc}
async_hooks 模块在 v8.0.0 版本正式加入 Node.js 的实验性 API。我们也是在 v8.x.x 版本下投入生产环境进行使用。

那么什么是 async_hooks 呢？

> async_hooks 提供了追踪异步资源的 API，这种异步资源是具有关联回调的对象。

简而言之，Async Hook 可以用来追踪异步回调。那么如何使用这种追踪能力，使用的过程中又有什么问题呢？




## 认识 Async hooks

v8.x.x 版本下的 async_hooks 主要有两部分组成，一个是 AsyncHook 用以追踪生命周期，一个是 AsyncResource 用于创建异步资源。

```js
const { createHook, AsyncResource, executionAsyncId } = require('async_hooks')

const hook = createHook({
  init (asyncId, type, triggerAsyncId, resource) {},
  before (asyncId) {},
  after (asyncId) {},
  destroy (asyncId) {}
})
hook.enable()

function fn () {
  console.log(executionAsyncId())
}

const asyncResource = new AsyncResource('demo')
asyncResource.run(fn)
asyncResource.run(fn)
asyncResource.emitDestroy()
```
上面这段代码的含义和执行结果是：
  1. 创建一个包含在每个异步操作的 init、before、after、destroy 声明周期执行的钩子函数的 hooks 实例。
  2. 启用这个 hooks 实例。
  3. 手动创建一个类型为 `demo` 的异步资源。此时触发了 init 钩子，异步资源 id 为 `asyncId`，类型为 `type`（即 demo），异步资源的创建上下文 id 为 `triggerAsyncId`，异步资源为 `resource`。
  4. 使用此异步资源执行 `fn` 函数两次，此时会触发 before 两次、after 两次，异步资源 id 为 `asyncId`，此 `asyncId` 与 `fn` 函数内通过 `executionAsyncId` 取到的值相同。
  5. 手动触发 destroy 生命周期钩子。

像我们常用的 async\await、promise 语法或请求这些异步操作的背后都是一个个的异步资源，也会触发这些生命周期钩子函数。

那么，我们就可以通过 init 钩子函数，通过异步资源创建上下文 `triggerAsyncId`（父）向当前异步资源 `asyncId`（子）这种指向关系，将异步调用串联起来，拿到一棵完整的调用树，通过回调函数（即上述代码的 fn）中 `executionAsyncId()` 获取到执行当前回调的异步资源的 `asyncId`，从调用链上追查到调用的源头。

同时，我们也需要注意到一点，init 是**异步资源创建**的钩子，不是**异步回调函数创建**的钩子，只会在异步资源创建的时候执行一次，这会在实际使用的时候带来什么问题呢？

## 追踪服务请求

出于异常排查和数据分析的目的，希望在我们 Ada 架构的 Node.js 服务中，将服务器收到的由客户端发来请求的请求头中的 request-id 自动添加到发往中后台服务的每个请求的请求头中。

简单设计如下：
1. 通过中间件解析请求头中 request-id，添加到当前异步调用链对应的存储上。
2. 改写 http、https 模块的 request 方法，在回调中获取当前的调用链对应存储中的 request-id。

示例代码如下：
```js
const http = require('http')
const { createHook, executionAsyncId } = require('async_hooks')
const fs = require('fs')

// 追踪调用链并创建调用链存储对象
const cache = {}
const hook = createHook({
  init (asyncId, type, triggerAsyncId, resource) {
    if (type === 'TickObject') return
    // 由于在 Node.js 中 console.log 也是异步行为，会导致触发 init 钩子，所以我们只能通过同步方法记录日志
    fs.appendFileSync('log.out', `init ${type}(${asyncId}: trigger: ${triggerAsyncId})\n`);
    // 判断调用链存储对象是否已经初始化
    if (!cache[triggerAsyncId]) {
      cache[triggerAsyncId] = {}
    }
    // 将父节点的存储与当前异步资源通过引用共享
    cache[asyncId] = cache[triggerAsyncId]
  }
})
hook.enable()

// 改写 http
const httpRequest = http.request
http.request = (options, callback) => {
  const client = httpRequest(options, callback)
  // 获取当前请求所属异步资源对应存储的 request-id 写入 header
  const requestId = cache[executionAsyncId()].requestId
  console.log('cache', cache[executionAsyncId()])
  client.setHeader('request-id', requestId)

  return client
}

function timeout () {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, Math.random() * 1000)
  })
}
// 创建服务
http
  .createServer(async (req, res) => {
    // 获取当前请求的 request-id 写入存储
    cache[executionAsyncId()].requestId = req.headers['request-id']
    // 模拟一些其他耗时操作
    await timeout()
    // 发送一个请求
    http.request('http://www.baidu.com', (res) => {})
    res.write('hello\n')
    res.end()
  })
  .listen(3000)
```

执行代码并**发送一次测试**，发现已经可以正确获取到 `request-id`。

### 陷阱

> 同时，我们也需要注意到一点，init 是**异步资源创建**的钩子，不是**异步回调函数创建**的钩子，只会在异步资源创建的时候执行一次。

但是上面的代码是有问题的，像前面介绍 `async_hooks` 模块时的代码演示的那样，可以使用一个异步资源不断的执行不同的函数，即异步资源有复用的可能，特别是对类似于 TCP 这种由 C/C++ 部分创建的异步资源，即多次请求可能会使用同一个 TCP 异步资源，从而使得这种情况下多次请求 init 钩子函数只会执行一次，导致多次请求的调用链追踪会追踪到同一个 triggerAsyncId。

我们将上面的代码做如下修改，来进行一次验证。
存储初始化部分将 `triggerAsyncId` 保存下来，方便观察异步调用的追踪关系：
```js
    if (!cache[triggerAsyncId]) {
      cache[triggerAsyncId] = {
        id: triggerAsyncId
      }
    }
```
timeout 函数改为先进行一次长耗时再进行一次短耗时操作：
```js
function timeout () {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, [1000, 5000].pop())
  })
}
```
重启服务后，使用 postman （不用 curl 是因为 curl 每次请求结束会关闭连接，导致不能复现）连续的发送两次请求，可以观察到以下输出：
```sh
{ id: 1, requestId: '第二次请求的id' }
{ id: 1, requestId: '第二次请求的id' }
```
发现在多并发且写读存储的操作间有耗时不固定的其他操作情况下，先到达服务器的请求存储的值会被后到达服务器的请求复写掉，使得前者获取到错误的值。当然，你可以保证在写和读之间不插入其他的耗时操作，但在复杂的服务中这种保障方式明显是不可靠的。这时，我们就需要使每次读写前，JS 都能进入一个全新的异步资源上下文，即获得一个全新的 asyncId。需要我们将调用链存储的部分做以下几方面修改：

```js
const http = require('http')
const { createHook, executionAsyncId } = require('async_hooks')
const fs = require('fs')
const cache = {}

const httpRequest = http.request
http.request = (options, callback) => {
  const client = httpRequest(options, callback)
  const requestId = cache[executionAsyncId()].requestId
  console.log('cache', cache[executionAsyncId()])
  client.setHeader('request-id', requestId)

  return client
}

// 将存储的初始化提取为一个独立的方法
async function cacheInit (callback) {
  // 利用 await 操作使得 await 后的代码进入一个全新的异步上下文
  await Promise.resolve()
  cache[executionAsyncId()] = {}
  // 使用 callback 执行的方式，使得后续操作都会追踪到这个新的异步上下文
  return callback()
}

const hook = createHook({
  init (asyncId, type, triggerAsyncId, resource) {
    if (!cache[triggerAsyncId]) {
      // init hook 不再进行初始化
      return fs.appendFileSync('log.out', `未使用 cacheInit 方法进行初始化`)
    }
    cache[asyncId] = cache[triggerAsyncId]
  }
})
hook.enable()

function timeout () {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, [1000, 5000].pop())
  })
}

http
.createServer(async (req, res) => {
  // 将后续操作作为 callback 传入 cacheInit
  await cacheInit(async function fn() {
    cache[executionAsyncId()].requestId = req.headers['request-id']
    await timeout()
    http.request('http://www.baidu.com', (res) => {})
    res.write('hello\n')
    res.end()
  })
})
.listen(3000)
```

值的一提的是，这种使用 callback 的方式与 koajs 的中间件非常的契合。
```js
async function middleware (ctx, next) {
  await Promise.resolve()
  cache[executionAsyncId()] = {}
  return next()
}
```

### NodeJs v14

这种使用 `await Promise.resolve()` 创建全新异步上下文的方式看起来总有些 “歪门邪道” 的感觉。好在 NodeJs v9.x.x 版本中提供了创建异步上下文的官方实现方式 `asyncResource.runInAsyncScope`。且更好的是，在 NodeJs v14.x.x 直接提供了异步调用链数据存储的官方实现，它可以直接帮你完成调用关系追踪和数据管理的工作！！API 就不再详细介绍，我们直接改造我们之前的实现。

```js
const { AsyncLocalStorage } = require('async_hooks')
// 直接创建一个 asyncLocalStorage 存储实例，不再需要管理 async 生命周期钩子
const asyncLocalStorage = new AsyncLocalStorage()
const storage = {
  enable (callback) {
    // 使用 run 方法创建全新的存储，且需要让后续操作作为 run 方法的回调执行，以使用全新的异步资源上下文
    asyncLocalStorage.run({}, callback)
  },
  get (key) {
    return asyncLocalStorage.getStore()[key]
  },
  set (key, value) {
    asyncLocalStorage.getStore()[key] = value
  }
}

// 改写 http
const httpRequest = http.request
http.request = (options, callback) => {
  const client = httpRequest(options, callback)
  // 获取异步资源存储的 request-id 写入 header
  client.setHeader('request-id', storage.get('requestId'))

  return client
}

// 使用
http
  .createServer((req, res) => {
    storage.enable(async function () {
      // 获取当前请求的 request-id 写入存储
      storage.set('requestId', req.headers['request-id'])
      http.request('http://www.baidu.com', (res) => {})
      res.write('hello\n')
      res.end()
    })
  })
  .listen(3000)
```
可以看到，官方设计的 `asyncLocalStorage.run` API和我们之前的修改在模式上也很契合。

于是，在 Node.js v14.x.x 版本下，使用 async_hooks 模块进行请求追踪的功能很轻易的就实现了。