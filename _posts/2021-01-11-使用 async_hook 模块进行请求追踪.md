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

v8.x.x 下的 async_hooks 主要有两部分组成，一个是 AsyncHook 用以追踪生命周期，一个是 AsyncResource 用于创建异步资源。

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

那么，我们就可以通过 init 钩子函数，通过异步资源创建上下文 `triggerAsyncId`（父）到当前异步资源 `asyncId`（子）这种指向关系，将异步调用串联起来，拿到一棵完整的调用树，通过回调函数（即上述代码的 fn）中 `executionAsyncId()` 获取到执行当前回调的异步资源的 `asyncId`，从而追查到调用的源头。

同时，我们也需要注意到一点，init 是**异步资源创建**的钩子，不是**异步回调函数创建**的钩子，只会在异步资源创建的时候执行一次，这会在实际使用的时候带来什么问题呢？

## 追踪服务请求

出于异常排查和数据分析的目的，希望在我们 Ada 架构的 Node.js 服务中，将服务器收到的由客户端发来的请求中的请求头中的 request-id 自动添加到发往中后台服务的每个请求的请求头中。

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
    // 将父节点的存储与当前异步资源共享 
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
  console.log('requestId', requestId)
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
    // 模拟一些其他耗时操作
    await timeout()
    // 获取当前请求的 request-id 写入存储
    cache[executionAsyncId()].requestId = req.headers['request-id']
    // 发送一个请求
    http.request('http://www.baidu.com', (res) => {})
    res.write('hello\n')
    res.end()
  })
  .listen(3000)
```

执行代码并**发送一次测试**，发现已经可以正确获取到 `request-id`。

### 陷阱

但是这是有问题的，像我们前面提到的，异步资源有复用的可能，特别是对类似于 TCP 这种由 C/C++ 部分创建的异步资源，即对于多次请求可能会使用同一个 TCP 异步资源，即多次请求，初始的 init 钩子函数只执行一次，多次请求的调用链追踪可能会追踪到同一个 triggerAsyncId，导致当多并发且读写存储的操作前有耗时不固定的操作情况下，先到达服务器的请求存储的值会被后到达服务器的请求复写掉，使得获取到错误的值。这时，我们需要确保每次读写前，JS 都能进入一个全新的异步资源上下文，即获得一个全新的 asyncId。需要我们将调用链存储的部分做如下修改：

```js
// 将存储的初始化提取为一个独立的方法
async function cacheInit () {
  // 利用 await 操作使得，await 后的代码进入一个全新的异步上下文
  await Promise.resolve()
  cache[executionAsyncId()] = {}
}
// init hook 不再进行初始化
const hook = createHook({
  init (asyncId, type, triggerAsyncId, resource) {
    // 判断调用链存储对象是否已经初始化
    if (!cache[triggerAsyncId]) {
      return fs.appendFileSync('log.out', `未使用 cacheInit 方法进行初始化`)
    }
    // 将父节点的存储与当前异步资源共享 
    cache[asyncId] = cache[triggerAsyncId]
  }
})
// 在处理请求时，首先调用 cacheInit 方法
http
  .createServer(async (req, res) => {
    // cacheInit 的调用放在存储的读写之前即可
    await cacheInit()
    // 模拟一些其他耗时操作
    await timeout()
    // 略
  })
```

### NodeJs v14

这种使用 `await Promise.resolve()` 创建全新异步上下文的方式看起来总有些 “歪门邪道” 的感觉。好在 NodeJs v9.x.x 版本中提供了创建异步上下文的官方实现方式。且更好的是，在 NodeJs v14.x.x 直接提供了异步调用链数据存储的官方实现，它可以直接帮你完成调用关系追踪和数据管理的工作！！API 就不再详细介绍，我们直接改造我们之前的实现。

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