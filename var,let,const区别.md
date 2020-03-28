
> 面试题：什么是提升？什么是暂时性死区？var,let,const区别？

什么是提升(hoisting)？
~~~
console.log(a);//undefined
var a = 2;
~~~
上述代码中，虽然变量未被声明，但我们却可以使用这个未声明的变量，这种情况叫做提升，并且提升的是声明。

上述代码相当于
~~~
var a ;
console.log(a);//undefined
a = 2;
~~~

接下来再看一个例子
~~~
var a = 10;
var a ;
console.log(a);//10
~~~
这个例子可以这么来看:
~~~
var a;
var a;
a = 10;
console.log(a);
~~~

到这里为止，我们已经了解了var声明的变量会发生提升的情况，其实不仅变量会提升，函数也会被提升。
~~~
console.log(a);// f ab(){}
function a(){};
var a = 1;
~~~
对于上述代码，打印结果会是 f a() {},即使变量声明在函数之后，这也说明了函数会被提升，并且优先于变量提升。

我们再来看一个例子：
~~~
var a = 1
let b = 1
const c = 1
console.log(window.b) // undefined
console.log(window.c) // undefined

function test(){
  console.log(a)
  let a
}
test()
~~~
在全局作用域下使用let和const声明变量，变量并不会被挂载到window上，这一点就和var声明有了区别。

再者，当我们在声明a之前如果使用了a，就会出现报错的情况。

你可能会认为这里出现了提升的情况，但是因为某些原因导致不能访问。

首先报错的原因是因为存在暂时性死区，我们不能在声明前就使用变量，这也是let和const优于var的一点。然后这里你认为的提升和var的提升是有区别的，虽然变量在编译的环节中被告知在这块作用域中可以访问，但是访问是受限制的。

那么到这里，想必大家也都明白 var、let 及 const 区别了，不知道你是否会有这么一个疑问，为什么要存在提升这个事情呢，其实提升存在的根本原因就是为了解决函数间互相调用的情况

~~~
function test1(){
    test2()
}
function test2(){
    test1()
}
~~~
假如不存在提升这个情况，那么就实现不了上述的代码，因为不可能存在 test1 在 test2 前面然后 test2 又在 test1 前面。

那么最后我们总结下这小节的内容：
- 函数提升优先于变量提升，函数提升会把整个函数挪到作用域顶部，变量提升只会把声明挪到作用域顶部
- var存在提升，我们能在声明之前使用。let,const因为暂时性死区原因，不能在声明前使用
- var 在全局作用域下声明变量会导致变量挂载在window上，其他两者不会
- let和const作用基本一致，但是后者声明的变量不能再次赋值


## 原型继承和Class继承
> 原型如何实现继承？Class如何实现继承？Class本质是什么？

首先先来讲下class,其实在JS中并不存在类，class只是语法糖，本质还是函数。
~~~
class Person{}
Person instanceof Function //true
~~~
在上一章节中我们讲解了原型的知识点，在这一小节中我们将会使用分别使用原型和class的方式来实现继承。

### 组合继承
组合继承是最常用的继承方式
~~~js
function Parent(value){
    this.val = value
}
Parent.prototype.getValue = function(){
    console.log(this.val)
}
function Child(value){
    Parent.call(this,value)
}
Child.prototype = new Parent()

const child = new Child(1)

child.getValue()//1
child instanceof Parent//true
~~~

以上继承的方式核心是在子类的构造函数中通过Parent.call(this)继承父类的属性，然后改变子类的原型为new Parent()来继承父类的函数。

这种继承方式优点在于构造函数可以传参，不会与父类引用属性共享，可以复用父类的函数，但是也存在一个缺点就是在继承父类函数的时候调用了父类构造函数，导致子类的原型上多了不需要的父类属性，存在内存上的浪费。

## 寄生组合继承
这种继承方式对组合继承进行了优化，组合继承缺点在于继承父类函数时调用了构造函数，我们只需要优化这点就行了。
~~~js
function Parent(value){
    this.val = value;
}
Parent.prototype.getValue = function(){
    console.log(this.val)
}
function Child(value){
    Parent.call(this.value)
}
Child.prototype = Object.create(Parent.prototype,{
    constructor:{
        value:Child,
        enumerable:false,
        writable:true,
        configurable:true
    }
})
const child = new Child(1)

child.getValue()//1
child instanceof Parent//true
~~~

## Class 继承
以上两种方式都是通过原型去解决的，在ES6中，我们可以使用class去实现继承，并且实现起来很简单
~~~js
class Parent{
    constructor(value){
        this.val = value
    }
    getValue(){
        console.log(this.val)
    }
}
class Child extends Parent{
    constructor(value){
        super(value)
        this.val = value
    }
}
let child = new Child(1)
child.getValue()//1
child instanceof Parent//true
~~~
class实现继承的核心在于使用extends表明继承自哪个父类，并且在子类构造函数中必须调用super,因为这段代码可以看成Parent.call(this.value)

当然，JS中并不存在类，class的本质就是函数。

## 模块化
> 面试题：为什么要使用模块化？都有哪几种方式可以实现模块化，各有什么特点？

模块化的好处：
-　解决命名冲突
-　提供复用性
-　提高代码可维护性

### 立即执行函数
在早期，使用立即执行函数实现模块化是常见的手段，通过函数作用域解决了命名冲突，污染全局作用域的问题
~~~js
(function(gloVar){
    gloVar.test = function(){}
    //...声明各种变量、函数都不会污染全局作用域
})(gloVar)
~~~

### AMD和CMD
鉴于目前这两种实现方式已经很少见到，所以不再对具体特性细聊，只需要了解这两者是如何使用的。
~~~js
// AMD
define(['./a', './b'], function(a, b) {
  // 加载模块完毕可以使用
  a.do()
  b.do()
})
// CMD
define(function(require, exports, module) {
  // 加载模块
  // 可以把 require 写在函数体的任意地方实现延迟加载
  var a = require('./a')
  a.doSomething()
})
~~~

### CommonJS
CommonJS最早是Node在使用，目前也仍然广泛使用，比如在Webpack中你就能见到它，当然目前在Node中的模块管理已经和CommonJS有一些区别了。
~~~js
//a.js
module.exports = {
    a:1
}
//or
exports.a = 1;

//b.js
var module = require('./a.js')
module.a
~~~
因为 CommonJS 还是会使用到的，所以这里会对一些疑难点进行解析

先说 require 吧
~~~js
var module = require('./a.js')
module.a
//这里其实就是包装了一层立即执行函数，这样就不会污染全局变量了
//重要的是module这里，module是Node独有的一个变量
module.exports = {
    a:1
}

//module基本实现
var module = {
    id:'xxx',
    exports:{}
}
//这个是为什么exports和module.exports用法相似的原因
var exports = module.exports
var load = function(module){
    var load = function(module){
        //导出的东西
        var a = 1
        module.exports = a
        return module.exports
    }
}
//然后当我require的时候去找到独特的id,
//然后将要使用的东西用立即执行函数包装下
~~~
另外虽然 exports 和 module.exports 用法相似，但是不能对 exports 直接赋值。因为 var exports = module.exports 这句代码表明了 exports 和 module.exports 享有相同地址，通过改变对象的属性值会对两者都起效，但是如果直接对 exports 赋值就会导致两者不再指向同一个内存地址，修改并不会对 module.exports 起效。

### ES Module
ES Module 是原生实现的模块化方案，与 CommonJS 有以下几个区别

+ CommonJS 支持动态导入，也就是 require(${path}/xx.js)，后者目前不支持，但是已有提案
+ CommonJS 是同步导入，因为用于服务端，文件都在本地，同步导入即使卡住主线程影响也不大。而后者是异步导入，因为用于浏览器，需要下载文件，如果也采用同步导入会对渲染有很大影响
+ CommonJS 在导出时都是值拷贝，就算导出的值变了，导入的值也不会改变，所以如果想更新值，必须重新导入一次。但是 ES Module 采用实时绑定的方式，导入导出的值都指向同一个内存地址，所以导入值会跟随导出值变化
ES Module 会编译成 require/exports 来执行的
~~~
// 引入模块 API
import XXX from './a.js'
import { XXX } from './a.js'
// 导出模块 API
export function a() {}
export default function() {}
~~~

## Proxy

## map,filter,reduce
> 面试题： map,filter,reduce各自有什么作用？
map作用是生成一个新数组，遍历原数组，将每个元素拿出来做一些变换然后放入到新数组中
~~~js
[1,2,3].map(v=>v+1)//[2,3,4]
~~~