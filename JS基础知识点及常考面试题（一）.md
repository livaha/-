> 学习自YCK的《前端面试之道》
### 原始(Primitive)类型
+ 面试题：原始类型有哪几种？null是对象吗？

```答： 在JS中，存在6种原始值，分别是：boolean,null,undefined,number,string,symbol```

原始类型存储的都是值，是没有函数可以调用的，比如```undefined.toString()```；

这时你会问```'1'.toString()```是可以用的呀~其实这种情况下，'1'已经不是原始类型了，而是被强制转换成了String类型也就是对象类型，所以可以调用```toString```函数。

除了必要的情况下强转换类型以外，原始类型还有些坑。
其中JS的```number```类型是浮点类型的，在使用中会遇到某些Bug,比如```0.1+0.2!==0.3```。```string```类型是不可变的，无论你在```string```类型上调用何种方法，都不会对值有改变。

对于```null```来说，很多人认为他是个对象类型，其实这是错误的。虽然```typeof null```会输出```object```,但是这只是 JS 存在的一个悠久 Bug。在 JS 的最初版本中使用的是 32 位系统，为了性能考虑使用低位存储变量的类型信息，000 开头代表是对象，然而 null 表示为全零，所以将它错误的判断为 object 。虽然现在的内部类型判断代码已经改变了，但是对于这个 Bug 却是一直流传下来。


### 对象(Object)类型
+ 面试题：对象类型和原始类型的不同之处？函数参数是对象会发生什么问题？

```答：在JS中，除了原始类型那么其他的都是对象类型。对象类型和原始类型不同的是，原始类型存储的是值，对象类型存储的是地址（指针）。当你创建了一个对象类型的时候，计算机会在内存中帮我们开辟一个空间来存放值，但是我们需要找到这个空间，这个空间会拥有一个地址（指针）```


![](https://user-gold-cdn.xitu.io/2020/3/9/170bd500ce61cf5e?w=261&h=188&f=png&s=6008)
如上图，变量a和b的存放地址相同，修改了b的同时，也修改了a，即2个变量值都发生了改变。



+ 接下来看函数参数是对象的情况
![](https://user-gold-cdn.xitu.io/2020/3/9/170bd5e6e87ced2d?w=280&h=319&f=png&s=21453)
你知道为什么p1,p2的打印为什么是这样的吗？

- 1 首先，函数传参是传递对象指针的副本
- 2 到函数内部修改参数属性这步，p1的值也被修改了
- 3 当我们重新为person分配了一个对象时，实际person拥有了一个新的地址(指针)，也就和p1没有任何关系了，导致了最终两个变量的值是不同的。

### typeof vs instanceof
+ 面试题：typeof是否能正确判断类型？instanceof能正确判断对象的原理是什么？


```typeof```对于原始类型来说，除了null都可以显示正确的类型


![](https://user-gold-cdn.xitu.io/2020/3/9/170bd725f4857bef?w=245&h=166&f=png&s=8178)

```typeof```对于对象来说，除了函数都会显示object,所以说```typeof```并不能判断变量是什么类型

![](https://user-gold-cdn.xitu.io/2020/3/9/170bd73cbe8faac2?w=235&h=122&f=png&s=5624)

- 如果我们想判断一个对象的正确类型，这时候可以考虑使用```instanceof```,因为内部机制是通过原型链来判断的。

![](https://user-gold-cdn.xitu.io/2020/3/11/170c8c730cf141d0?w=362&h=304&f=png&s=19329)
对于原始类型来说，你想直接通过```instanceof```来判断类型是不行的，所以```instanceof``` 也不是百分之百可信的。

### 类型转换
> 涉及面试题：该知识点常在笔试题中见到，熟悉了转换规则就不惧怕此类题目了。

在JS中类型转换只有三种情况，分别是：
+ 转换为布尔值
+ 转换为数字
+ 转换为字符串

先来看一个类型转换表格
![](https://user-gold-cdn.xitu.io/2020/3/11/170c8de91f21c84c?w=639&h=499&f=png&s=152261)

#### 对象转原始类型
对象在转换类型的时候，会调用内置的[[ToPrimitive]]函数，对于该函数来说，算法逻辑一般来说如下：
+ 如果已经是原始类型了，那就不需要转换了
- 调用```x.valueOf()```,如果转换为基础类型了，就返回转换的值
-　调用```x.toString()```,如果转换为基础类型，就返回转换的值
- 如果都没有返回原始类型，就会报错
当然你也可以重写```Symbol.toPrimitive```,该方法在转原始类型时调用优先级最高。
```
let a = {
  valueOf() {
    return 0
  },
  toString() {
    return '1'
  },
  [Symbol.toPrimitive]() {
    return 2
  }
}
1+a //3
```

##### 类型转换还不懂可以看一下文章[ToPrimitive解释类型转换](https://juejin.im/post/5e699e3c6fb9a07ca24f6540)
#### valueOf和toString

![](https://user-gold-cdn.xitu.io/2020/3/11/170c9343253a1139?w=692&h=564&f=png&s=55019)
> 隐式转换时对象都先调用valueOf，如果不为基本数据类型。在调用toString
只有Date类型new Date先调用toString,后调用valueOf
Symbol不能隐式转换，只能显示转换


#### 显式转换和隐式转换
##### 隐式转换
 
+ 1.undefined与null相等，但不恒等（===）

![](https://user-gold-cdn.xitu.io/2020/3/11/170c93d1b8fc3557?w=188&h=85&f=png&s=2734)

+ 2.一个是number一个是string时，会尝试将string转换为number

![](https://user-gold-cdn.xitu.io/2020/3/11/170c93dd2ae8392b?w=138&h=85&f=png&s=2221)
+ 3.隐式转换将boolean转换为number，0或1

![](https://user-gold-cdn.xitu.io/2020/3/11/170c93e15c93d9cc?w=157&h=190&f=png&s=4487)
+ 4.隐式转换将Object转换成number或string，取决于另外一个对比量的类型

+ 5.对于0、空字符串的判断，建议使用 “===” 。

![](https://user-gold-cdn.xitu.io/2020/3/11/170c93e83567767a?w=162&h=95&f=png&s=2199)

+ 6.“==”会对不同类型值进行类型转换再判断，“===”则不会。它会先判断两边的值类型，类型不匹配时直接为false。


##### 显示转换
显示转换一般指使用Number、String和Boolean三个构造函数，手动将各种类型的值，转换成数字、字符串或者布尔值。
```Number：
Number('1234') // 1234
Number('1234abcd') // NaN
Number('') // 0
Number(true) // 1
Number(null) // 0
Number(undefined) // NaN
 
String：
 
String(1234)  // "1234"
String('abcd')  // "abcd"
String(true)  // "true"
String(undefined) // "undefined"
String(null)  // "null"
 

Boolean：
 
Boolean(0)  // false
Boolean(undefined)  // false
Boolean(null)  // false
Boolean(NaN)  // false
Boolean('')  // false
```


### 四则运算符
#### 加法运算符
加法运算符不同于其他几个运算符，它有以下几个特点：
- 运算中其中一方为字符串，那么就会把另一方也转换为字符串
-　如果一方不是字符串或者数字，那么会将它转换为数字或者字符串
```
1+'1'  //'11' 
true+true //2
4+[1,2,3] //'41,2,3'
```
如果你对于答案有疑问的话，请看解析：

+ 对于第一行代码来说，触发特点一，所以将数字 1 转换为字符串，得到结果 '11'
+ 对于第二行代码来说，触发特点二，所以将 true 转为数字 1
+ 对于第三行代码来说，触发特点二，所以将数组通过 toString 转为字符串 1,2,3，得到结果 41,2,3

另外对于加法还需要注意这个表达式 'a' + + 'b'

![](https://user-gold-cdn.xitu.io/2020/3/12/170cdbe36391b79f?w=158&h=49&f=png&s=1730)

因为 + 'b' 等于 NaN,所以结果为'aNaN',你可能会在一些代码中看到过 + '1'的形式来快速获取number类型。

那么对于除了加法的运算符来说，只要其中一方是数字，那么另一方就会被转为数字
```
4 * '3' // 12
4 * [] // 0
4 * [1, 2] // NaN
```


#### 比较运算符
- 如果是对象，就通过toPrimitive转换对象
-　如果是字符串，就通过unicode字符索引来比较
```
let a = {
  valueOf() {
    return 0
  },
  toString() {
    return '1'
  }
}
a>-1 //true
```
以上代码中，因为a是对象，所以会通过valueOf转换为原始类型再比较值。


### this
> 涉及面试题：如何正确判断this?箭头函数的this是什么？

this 是很多人会混淆的概念，但是其实它一点都不难，只是网上很多文章把简单的东西说复杂了。在这一小节中，你一定会彻底明白 this 这个概念的。

我们先来看几个函数调用的场景
```
function foo(){
    console.log(this.a)
}
var a = 1;
foo();

const obj = {
    a:2,
    foo:foo
}
obj.foo();

const c = new foo()


```
接下来我们一个个分析上面几个场景
- 对于直接调用foo来说，不管foo函数被放在什么地方，this一定是window
- 对于obj.foo()来说，我们只需要记住，谁调用了函数，谁就是this,所以在这个场景下foo函数中的this就是obj对象
-　对于new的方式来说，this被永远绑定在了c上面，不会被任何方式改变this

说完了以上几种情况，其实很多代码中的this应该没什么问题了，下面让我们看看箭头函数中的this

```
function a(){
    return () =>{
        return () =>{
            console.log(this)
        }
    }
}
console.log(a()()()) //打印出的是window
```
首先箭头函数其实是没有 this 的，箭头函数中的 this 只取决包裹箭头函数的第一个普通函数的 this。在这个例子中，因为包裹箭头函数的第一个普通函数是 a，所以此时的 this 是 window。另外对箭头函数使用 bind 这类函数是无效的。

##### bind
最后种情况也就是 bind 这些改变上下文的 API 了，对于这些函数来说，this 取决于第一个参数，如果第一个参数为空，那么就是 window。

那么说到 bind，不知道大家是否考虑过，如果对一个函数进行多次 bind，那么上下文会是什么呢？

```
let a = {}
let fn = function(){
    console.log(this)
}
fn.bind().bind(a) // =>?
```
如果你认为输出结果是a，那你就错了，其实我们可以把上述代码转换成另一种形式
```
//fn.bind().bind(a) 等于
let fn2 = function fn1(){
    return function(){
        return fn.apply()
    }.apply(a)
}
fn2()
```
可以从上述代码中发现，不管我们给函数 bind 几次，fn 中的 this 永远由第一次 bind 决定，所以结果永远是 window。

```
let a ={name:'sdf'}
function foo(){
    console.log(this.name)
}
foo.bind(a)() //'sdf'
```
以上就是 this 的规则了，但是可能会发生多个规则同时出现的情况，这时候不同的规则之间会根据优先级最高的来决定 this 最终指向哪里。

首先，new 的方式优先级最高，接下来是 bind 这些函数，然后是 obj.foo() 这种调用方式，最后是 foo 这种调用方式，同时，箭头函数的 this 一旦被绑定，就不会再被任何方式所改变。

如果你还是觉得有点绕，那么就看以下的这张流程图吧，图中的流程只针对于单个规则。


![](https://user-gold-cdn.xitu.io/2020/3/12/170ce03fee7d3c0f?w=744&h=531&f=png&s=62015)




