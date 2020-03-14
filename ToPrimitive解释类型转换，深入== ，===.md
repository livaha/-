摘自https://www.jianshu.com/p/ace2c71bec3b

理解ToPrimitive操作，就能理解JS中的有点迷的```==```操作了
```
//以下是有点奇怪的 ==
"0" == false; // true
false == 0; // true
false == ""; // true
false == []; // true
"" == 0; // true
"" == []; // true
0 == []; // true
```
### ToPrimitive 操作
抽象操作 ToPrimitive（参见 ES5 规范 9.1 节）会首先（通过内部操作 DefaultValue，参见 ES5 规范 8.12.8 节）检查该值是否有 valueOf() 方法。

如果有并且返回基本类型值，就使用该值进行强制类型转换。如果没有就使用 toString() 的返回值（如果存在）来进行强制类型转换。
如果 valueOf() 和 toString() 均不返回基本类型值，会产生 TypeError 错误。

### 什么是 ToNumber
true 转换为 1， false 转换为 0。 undefined 转换为 NaN， null 转换为 0。ToNumber 对字符串的处理基本遵循数字常量的相关规则 / 语法。
处理失败时返回 NaN（处理数字常量失败时会产生语法错误）。不同之处是 ToNumber 对以 0 开头的十六进制数并不按十六进制处理（而是按十进制）

### == 和 ===
== 允许在相等比较中进行强制类型转换，而 === 不允许。
实际上 == 和 === 都会检查操作数的类型。区别在于操作数类型不同时它们的处理方式不同。
### 特别情况

![](https://user-gold-cdn.xitu.io/2020/3/12/170cca9258e21a8c?w=196&h=86&f=png&s=3284)

ES5 规范 11.9.3.1 的最后定义了对象（包括函数和数组）的宽松相等（==）：两个对象指向同一个值时即视为相等，不发生强制类型转换。
在比较两个对象的时候， == 和 === 的工作原理是一样的。

### == 比较不同类型时发生了什么
+ 显然会进行类型转换
+ 基本数据类型都转为数字
+ 对象类型进行ToPrimitive操作

转换的优先级是 布尔>字符串>对象

最终他们都会转为数字类型（因为基本数据类型都会转为数字类型，对象的转换优先级最低，轮到对象进行转换的时候，另外一个需要转换的操作数早就转为数字了，如果ToPrimitive操作返回的结果非数字，那么要进行==操作的两个操作数的类型依然不同，ToPrimitive操作返回的结果还需要转为数字）

#### 举个例子，布尔值和字符串比较：
```
false == 'abc' //false
//转换的优先级是  布尔>字符串，所以false先转为数字得到0
//现在相当于比较 0 === 'abc',操作数的类型还是不同，继续类型转换
//'abc'转为数字，Number('abc') 得到NaN
// 0 == NaN 结果false
```

#### 布尔值和对象比较
```
false == [] //true
//转换的优先级是 布尔>对象，所以false先转为数字得到0
//现在相当于比较 0 == []，操作数的类型还是不同，继续类型转换
//[]是对象，进行ToPrimitive操作，得到空字符，
//现在相当于比较 0 == '',操作数的类型还是不同，继续类型转换
//空字符是基本数据类型，转为数字，Number('') 得到0
// 0 == 0 结果为true
```
#### null和undefined
这里引出另外一个问题：包装类型（看最后）
null和undefined不会进行转换，null只会==undefined或者自身，undefined同样
```
null == null //true
null == undefiend //true
undefined == undefined //true
```

#### []和{}
因为2个对象进行宽松或严格相等时，不进行类型转换，两个对象指向同一个值时即视为相等
```
[] == {} //false
//对象和基本数据类型进行宽松比较时，对象发生了什么？
//当对象是[]
[].valueOf() //还是一个对象
[].toString() //'' 一个空字符串
Number('') //0

//当对象是[2,3]
[2,3].valueOf() //还是一个对象
[2,3].toString() //"2,3"
Number("2,3") //NaN

//当对象是[null]
[null].valueOf() //还是一个对象
[null].toString() //''
Number([null]) //0

/*
 也许你认为 [null].toString() 返回的不是 ""
 但是如果不这样处理的话又能怎样呢？
 有人也许会觉得既然 String(null) 返回 "null"
 所以 String([null]) 也应该返回 "null"。
 确实有道理，实际上这是 String([..]) 规则的问题。
 又或者根本就不应该将数组转换为字符串？
 但这样一来又会导致很多其他问题
*/

//当对象是{}
({}).valueOf()  //还是一个对象
({}).toString() //"[object Object]" 
Number("[object Object]") //NaN
```

#### >,<,<=
这属于抽象关系比较
比较双方首先调用ToPrimitive,如果结果出现非字符串，就根据ToNumber规则将双方强制类型转换为数字来进行比较。

实际上javascript中 <= 是‘不大于’的意思（a<=b被处理为b<a,然后将结果反转。）即a<=b,处理为!(b<a)。

相等比较有严格相等，关系比较却没有”严格关系比较“。也就是说如果要避免 a < b 中发生隐式强制类型转换，我们只能确保 a 和 b 为相同的类型，除此之外别无他法。


### 包装类型
基本数据类型：number,string,boolean都有包装类型，这是为了让这些基本数据类型可以方便地调用一些常用的方法，比如toString,valueOf等等

但是null和undefined没有对应的包装类型，所以null和undefined不能够被封装，
Object(null)和Object()均返回一个常规对象。
“拆封”，即“打开”封装对象（如 new String("abc")），返回其中的基本数据类型值（"abc"）。

以上说的和 == 有什么关系？
因为 == 中的 ToPromitive 强制类型转换也会发生拆封，这大概就是很多人错误地认为 == 不进行类型判断的原因（我猜的）

```
var a = "abc";
var b = Object( a ); // 和new String( a )一样
a === b; // false
a == b; // true
```

Object(null) 和 Object() 均返回一个常规对象，没法拆封。
```
var a = null;
var b = Object( a ); // 和Object()一样
a == b; // false
var c = undefined;
var d = Object( c ); // 和Object()一样
c == d; // false
var e = NaN;
var f = Object( e ); // 和new Number( e )一样
e == f; // false
```