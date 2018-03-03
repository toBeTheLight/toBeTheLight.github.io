---
layout: post
title:  "Vue源码 day03 _initState执行流程"
categories: 源码阅读 Vue
tags: Vue源码
author: toBeTheLight
---

* content
{:toc}  
本章主要看一下day02中提到的initState，并找到vue实现动态响应和各个数据关联的重点`defineReactive`、`Dep`、`new Watcher`函数。在看完day02提到的`vm.$mount()`，再回来看这几个函数。




# initState
`src/core/instance/state.js`

## 代码

针对各配置属性进行了动态响应的设置
```js
function initState (vm: Component) {
  // 应该是watchers监听队列，做数据绑定的东西
  vm._watchers = []
  const opts = vm.$options
  // 有props 初始化prop
  if (opts.props) initProps(vm, opts.props)
  // 有methods 初始化methods
  if (opts.methods) initMethods(vm, opts.methods)
  if (opts.data) {
    // 有data 初始化data
    initData(vm)
  } else {
    // 无则对_date进行observe，其实就是给data默认值{}
    observe(vm._data = {}, true /* asRootData */)
  }
  // 有computed 则初始化computed
  if (opts.computed) initComputed(vm, opts.computed)
  // firefox 对象原型有watch属性，做排除
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch)
  }
}
```
其实就是对各个配置属性的初始化
1. initProps
2. initMethods
3. initData
4. initComputed
5. initWatch
我们先简单的看一下这几函数

## 1.initProps
```js
function initProps (vm: Component, propsOptions: Object) {
  const propsData = vm.$options.propsData || {}
  const props = vm._props = {}
  // 使用数组缓存prop键避免使用动态的对象来遍历props
  const keys = vm.$options._propKeys = []
  const isRoot = !vm.$parent
  // 根组件好像不能传入props，但是可以内部定义props的值，
  // 所以还是要进行处理的，就是这么用不太好吧。
  // root instance props should be converted
  observerState.shouldConvert = isRoot
  // 遍历对props中的值进行处理
  for (const key in propsOptions) {
    keys.push(key)
    // 对值进行处理，包括类型检查和默认缺省值处理
    const value = validateProp(key, propsOptions, propsData, vm)
    /* istanbul ignore else */
    /* 此处删掉了
     * 1. 开发环境中对保留属性的判断
     * 2. 子组件内直接修改prop的警告
     */
    // 对props进行动态响应设置
    defineReactive(props, key, value)
    if (!(key in vm)) {
      proxy(vm, `_props`, key)
    }
  }
  observerState.shouldConvert = true
}
```
重点是`defineReactive(props, key, value)`
要看下defineReactive。

## 2. initMethods
```js
function initMethods (vm: Component, methods: Object) {
  const props = vm.$options.props
  // 遍历处理methods
  for (const key in methods) {
    /* 此处删除了对methods的一些检查
     * 1. method值为null 警告
     * 2. method键与props键重复 警告
     * 3. method键与vue内置方法键重复 警告
     */
    /*
     * 虽然你是个null 我还是要给你个默认值啊
     * 有值则将vm作为this绑定给methods[key]赋值与vm[key]
     * 内部使用的是闭包加call/apply
     * 原因见此: https://stackoverflow.com/questions/17638305/why-is-bind-slower-than-a-closure
     */ 
    vm[key] = methods[key] == null ? noop : bind(methods[key], vm)
  }
}
```

## 3.initData
```js
function initData (vm: Component) {
  let data = vm.$options.data
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {}
  // 此处删除了对data的类型监测，data不是对象会变成{}
  // proxy data on instance
  const keys = Object.keys(data)
  const props = vm.$options.props
  const methods = vm.$options.methods
  let i = keys.length
  while (i--) {
    const key = keys[i]
    /*
     * 此处删除了对data的验证
     * 1. 是否与methods重复
     * 2. 是否与props重复
     * 3. 是否可能是保留属性
     */
    // 不是保留属性则进行set、get
    if (!isReserved(key)) {
      proxy(vm, `_data`, key)
    }
  }
  // observe data
  observe(data, true /* asRootData */)
}
```
重点是`observe(data, true /* asRootData */)`
等下看下observe。

## 4. initComputed
```js
function initComputed (vm: Component, computed: Object) {
  const watchers = vm._computedWatchers = Object.create(null)
  const isSSR = isServerRendering()
  for (const key in computed) {
    const userDef = computed[key]
    const getter = typeof userDef === 'function' ? userDef : userDef.get
    // 此处删除了对计算属性getter必须的验证
    // 创建watcher
    if (!isSSR) {
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      )
    }
    if (!(key in vm)) {
      // 创建createComputedGetter并替代get
      defineComputed(vm, key, userDef)
    }
    // 此处删除了computed属性在data和props中属性重复的检测
  }
}
```
应该是基于watch的。然后对computed的get方法做了基于watch的重写。
等下看下Watcher构造函数和createComputedGetter方法

## 5. initWatch
```js
function initWatch (vm: Component, watch: Object) {
  for (const key in watch) {
    const handler = watch[key]
    if (Array.isArray(handler)) {
      for (let i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i])
      }
    } else {
      createWatcher(vm, key, handler)
    }
  }
}
```
对watch创建watcher

# 流程总结

1. initProps -> defineReactive -> new Dep
2. initMethods -> method.bind(vm)
3. initData -> observe -> new Observer -> 对对象和数组类型进行不同 defineReactive
4. initComputed -> new Watcher 和 defineComputed -> createComputedGetter
5. initWatch -> createWatcher -> vm.$watch -> new Watcher

从中我们可以看到关键在于`defineReactive`、`Dep`、`observe`、`new Watcher`部分。
我们看完day02中提到的`vm.$mount()`再来看这几个函数。

# 补充
1. initProps中`isRoot = !vm.$parent`判断原因不清楚
2. 对于Boolean类型的props，不传入具体值，或传入与key同名字符串同样合法，且值会为true，如`<component have />`，`<component :have="'have'"/>`
3. 使用闭包 + call/apply 比bind更快的[原因](https://stackoverflow.com/questions/17638305/why-is-bind-slower-than-a-closure)