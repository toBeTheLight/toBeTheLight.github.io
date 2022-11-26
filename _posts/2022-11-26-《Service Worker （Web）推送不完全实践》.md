---
layout: post
title:  "Service Worker （Web）推送不完全实践"
categories: 实践
tags:  ServiceWorker WebPush
author: toBeTheLight
---

* content
{:toc}








以下实践结论来自 windows 平台 Edge 浏览器与 mac 平台 Chrome 浏览器

## 事件

```js
// worker.js
self.addEventListener("install", (event) => {
  self.skipWaiting()
})
self.addEventListener('activate', (event) => {
  event.waitUntil(() => {})
})


self.addEventListener('push', (event) => {
  event.waitUntil(() => {})
})
self.addEventListener('sync', (event) => {
  event.waitUntil(() => {})
})
```

代码所包含的四个事件中，install 与 activate 事件是 service worker 的生命周期事件。

event.waitUntil 方法也是很重要的方法。

install：install 事件发生在 worker 被安装或更新时，然后进入等待状态，在某个时机进入激活中，避免与旧的已激活的 worker 冲突。调用 skipWaiting 可跳过等待。

activate：activate 事件表示当前 worker 已经正式工作。

push：push 事件是 web-push 能力的服务消息推送事件。重点之一。

sync：sync 则是由页面客户端发起的，我们可以用来做一定的推送能力。重点之一。



### Web Push

web push 是依赖于浏览器客户端的推送能力，由浏览器厂商提供（大概）。可以在用户发起订阅后，在未打开过（大概）站点的情况下收到推送消息。

```js
// client 部分，worker 为 serviceWorker.register 注册后的实例
const pushSubscription = worker.pushManager
    .subscribe({
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
      userVisibleOnly: true
    })
fetch('/server', pushSubscription)
```

subscribe 的参数 applicationServerKey 为服务生成的公钥，完成订阅后 pushSubscription 中会包含分配的 endpoint 信息。

然后需要将此 pushSubscription 信息提交给使用者的服务，在服务中使用相关信息进行消息推送，请参考其他文章。

endpoint 在 Edge 中为 https://wns2-sg2p.notify.windows.com/xxxxxxxxxxxx，在 chrome 中为 google 的 gcm 地址，后者有众所周知的连不上的问题。

如果需要使用浏览器的 web push 能力需要向厂商申请，需要进一步调研。

### Sync

我们尝试其他方式进行。

sync 如名是用来做同步的。需要客户端代码发起同步注册：
```js
worker.sync.register('sync-name')
```

然后已注册的 worker 即会触发 sync 事件。此时 worker 内需要进行轮询、长链接等方式进行消息获取，并调用通知进行展示，示例代码如下：

```js
// worker.js 
self.addEventListener('sync', (event) => {
  function poll () {
    fetch('/data-server/').then(res => {
      self.registration.showNotification('来自轮询的消息', { body: res.data })
      setTimeout(() => {
        poll()
      }, 30 * 1000)
    })
  }
  poll()
}
```

看到这里可能会觉得为什么需要在 sync 中进行轮询，为什么不在 worker 中直接轮询？

实践发现 service-worker 在 tab 或浏览器退出后很快就会被回收，执行停止，这个时间最多也就 十几秒。

event.waitUntil 接受一个 promise，会告诉事件分发器事件仍然在进行，通知避免浏览器终止 worker 线程的执行，为了延长 worker 线程存活时间，我们将 poll 包装成一个不执行 resolve 的 promise 即可延长存活时间。
测试得在在关闭浏览器或页签后，最多执行了 3 分钟左右（同时，出现了一个现象，及 worker 在 5 分钟后又激活了一轮，但是 poll 里用来做标记的 id 变了）。并未达到长期存活的效果。

