---
layout: post
title:  "Object api"
categories: JavaScript Object
tags:  study
---

* content
{:toc}  
今天谈到了这些问题，发现认识比较片面。  
研究Object的部分ES5 API。可能会提到部分ES6内容。




# Object
[Object MDN API](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object)
## 属性描述符
即描述对象属性特性的描述符
### 四个特性描述符
1. `value` 值
1. `writable` 只读性
2. `enumerable` 可枚举性
3. `configurable` 可配置性(属性的删除与重新配置)

`value`默认为`undefined`  
在使用`Object.create()`和`Object.defineProperty`时`writable`、`enumerable`、`configurable`默认均为`false`

### 两个访问器
1. `get` 不可与`value`同时使用，会由属性的读取触发。
2. `set` 不可与`writable`同时使用，会由属性的写入触发。

将会在其他的api中介绍属性描述符的用法

## 对象的创建与属性修改

### Object.create()
`Object.create(proto, [ propertiesObject ])`  
此api的作用是以`proto`为原型，以`propertiesObject`中**自有属性**(不包含`propertiesObject`的原型上的属性，包含所有不可枚举属性)为属性创建一个新的对象。
```js
// 非严格模式下运行，严格模式下会抛出异常
const proto = {
  saySize () {
    console.log(this.size)
  }
}
const propertiesObject = {
  size: {
    enumerable: false,
    configurable: false,
    value: 'large'
  },
  color: {
    writable: true,
    enumerable: true,
    configurable: true,
    value: 'red'
 }
}
let newObj = Object.create(proto, propertiesObject)

// 原型
newObj.saySize()
// "large"

// writable
newObj.size = 'small'
newObj.color = 'green'
console.log(newObj.size, newObj.color)
// "large,green"

// enumerbale
for(key in newObj){
  console.log(key)
}
// "color"
// "saySize"
delete newObj.size
// false
delete newObj.color
// true
```
1. 上述代码中的`proto`使用`Fun.prototype`即可实现原型链的继承。  
2. 那么要怎样才能枚举出`enumerable:false`的属性呢？

### Object.defineProperty()
`Object.defineProperty(obj, prop, descriptor)`  
此api允许修改或向`obj`添加属性  
`obj`为目标对象，`prop`为要修改或添加的属性，`descriptor`为属性描述符
```js
let tempObj1 = {}
Object.defineProperty(tempObj, 'name', {
  value: 'temp',
  writable: false,
  enumerable: true,
  configurable: false
})
console.log(tempObj)
// Object {name: "temp"}

// 抛出异常
Object.defineProperty(tempObj, 'name', {
  value: temp,
  writable: true
})
```
对于`configurable： false`的属性禁止修改属性描述符，会抛出异常。

```js
let tempObj2 = {_name: 'temp2'}
Object.defineProperty(tempObj2, 'name', {
  get () {
    return `名字为${this._name}`
  },
  set (value) {
    console.log(`新名字为${value}`)
  }
})
console.log(tempObj2.name)
// "名字为temp2"
tempObj2.name = 'temp2.0'
// "新名字为temp2.0"
```
可以观察到 读属性值与 写属性值分别触发了`get`和`set`属性访问器。:smirk:  
*代码中所用到的"\`名字为${this.\_name}`" 为es6模板字符串，实现拼串*

### Object.defineProperties()
`Object.defineProperties(obj, props)`  
此api方便了属性的批量修改，第二个参数与`Object.create()`的第二个参数结构相同。
```js
let tempObj3 = {name:'temp'}
Object.defineProperties(tempObj3, {
  name: {
    value: 'newTemp',
    writable: true
  },
  color: {
    value: 'red',
    writable: true,
    enumerable: true
  }
})
console.log(tempObj3)
// Object {name: "newTemp", color: "red"}
```
## 对象属性的检测与检索
我们也看到了对于`enumerable:false`的属性是不可枚举的。甚至ES6中还有“隐蔽性”更高的`Symbol()`可以作为属性键。那么怎么才能正确的检测与获取对象的属性呢？

我们先创建一个对象用于实验后续的所有方法。  
原型和自身都各包含三种属性：`enumerable: false`,`enumerable: true`,`Symbol()`
```js
const proto = Object.create(null, {
  supTrue: {
    value: 'value1',
  enumerable: true
},
supFalse: {
  value: 'value2',
    enumerable: false
  }
})
proto[Symbol('supSymbol')] = 'supSymbol'
console.log(proto)
// {
//  supTrue: "value",
//  Symbol(supSymbol): "supSymbol",
//  supFalse: "value2"
// }
let obj = Object.create(proto, {
  ownTrue: {
    value: 'value1',
    enumerable: true
},
ownFalse: {
    value: 'value2',
    enumerable: false
  }
})
obj[Symbol('ownSymbol')] = 'ownSymbol'
// ok，obj可用
```

### for-in
```js
for (const key in obj) {
	console.log(key)
}
// subTrue, ownTrue
```
可以看到`for in`枚举了包括原型链在内的所有可枚举属性

### Object.keys()
```js
Object.keys(obj)
// ["ownTrue"]
```
可以看到返回了一个只包含自身可枚举属性键的数组。

### Object.getOwnPropertyNames()
```js
Object.getOwnPropertyNames(obj)
// ["ownTrue", "ownFalse"]
```
可以看到返回了一个包含自身所有非`symbol`的属性键的数组。  
由此也可以看到`symbol`类型的属性的“隐蔽性”

### Object.getOwnPropertySymbols()

针对 获取`symbol`可使用此方法。

### Reflect.ownKeys()
虽然这个不是`Object`的方法
但是可以用来获取自身所有属性键
```js
Reflect.ownKeys(obj)
// ["ownTrue", "ownFalse", Symbol(ownSymbol)]
```

## 把对象关起来

按照权限从大到小排列

### Object.preventExtensions()
作用：将对象变的不可扩展，不可添加新的属性。
### Object.seal()

作用：将对象“密封”，不可添加新属性，属性的`configurable`置为`false`，`writable`为`true`的属性仍然可以被重新赋值。  
权限：仅可对`writable`为`true`的属性进行赋值。
### Object.freeze()
作用：完全“锁死”，不能做任何修改。  
权限：0。

需要注意的是，上述三个api都是对原有对象的操作，并不会返回一个新的对象。
```js
let obj = {}
Object.preventExtensions(obj) === obj // true
Object.seal(obj) === obj // true
Object.freeze(obj) === obj // true
```
可以说`writable`,`configurable`这些属性描述符是针对对象的属性做出的限制或者说保护。  
那么`Object.seal()`,`Object.preventExtensions()`,`Object.freeze()`就是对对象本身做出限制或者保护。
同时我们也知道在ES6中使用`const`可以声明一个"常量"，但是要注意的是`const`确保的只是指针的不可更改。比如：
```js
const obj = {key: 'value1'}
obj.key = 'value2' // 可完成
obj = {key2: 'value2'} // 更改指针，抛出异常
```
此时就可以使用上述三个把对象关起来的api。
