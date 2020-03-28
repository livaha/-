在这一章节中我们继续来了解 JS 的一些常考和容易混乱的基础知识点。

### == vs ===
> 涉及面试题： == 和 === 有什么区别？

对于 == 来说，如果对比双方的类型不一样的话，就会进行类型转换，另有一篇讲的更容易理解：[ToPrimitive解释类型转换，深入== ，===](https://juejin.im/post/5e699e3c6fb9a07ca24f6540)

假如我们需要对比x和y是否相同 ，就会进行如下判断流程：
+ 首先会判断两者类型是否相同。相同的话就是比大小了
+ 类型不同的话，就会进行类型转换
+ 判断是否在对比null和undefined，是的话批回true
+ 判断两者类型是否为string和number,是的话就会将字符串转换为number
```
1 == '1'
      ↓
1 ==  1
```

+ 判断其中一方是否为boolean,是的话就会把boolean转为number再进行判断
```
'1' == true
        ↓
'1' ==  1
        ↓
 1  ==  1
```
+ 判断其中一方是否为object且另一方为string,number或者symbol,是的话就会把object转为原始类型再进行判断
```
'1' == { name: 'asdf' }
        ↓
'1' == '[object Object]'
```


> 思考题：看完了上面的步骤，对于 [] == ![] 你是否能正确写出答案呢？ 

答案为true
解析：
- ==中，左右两边都需要转换为数字然后进行比较。
- []转换为数字为0.
- ![]首先是转换为布尔值，由于[]作为一个引用类型转换为布尔转换为布尔值为true
- 因此![]为false，进而再转换为数字，变为0
- 0==0，为true

对于 === 来说就简单多了，就是判断两者类型和值是否相同。


### 闭包
> 涉及面试题：什么是闭包？

闭包的定义其实很简单：函数 A 内部有一个函数 B，函数 B 可以访问到函数 A 中的变量，那么函数 B 就是闭包。

```
function A(){
    let a = 1;
    window.B = function(){
        console.log(a)
    }
}
A()
B() //1
```
很多人对于闭包的解释可能是函数嵌套了函数，然后返回一个函数。其实这个解释是不完整的，就比如我上面这个例子就可以反驳这个观点。

在 JS 中，闭包存在的意义就是让我们可以间接访问函数内部的变量。

> 经典面试题：循环中使用闭包解决'var'定义函数的问题

```
for(var i = 1;i <= 5;i++){
    setTimeout(function timer(){
      console.log(i);  
    },i*1000)
}
```
首先因为```setTimeout```是个异步函数，所以会先把循环全部执行完毕，这时候i就是6了，所以会输出一堆6。

解决办法有3种，第一种是使用闭包的方式
```
for(var i = 1;i <= 5;i++){
    (function(j){
        setTimeout(function timer(){
            console.log(j)
        },j*1000)
    })(i)
}
```
在上述代码中，我们首先使用了立即执行函数将i传入函数内部，这个时候值就被固定在了参数j上面不会改变，当下次执行timer这个闭包的时候，就可以使用外部函数的变量j，从而达到目的。

第二种就是使用setTimeout的第三个参数，这个参数会被当成timer函数的参数传入。
```
for(var i = 1;i <= 5; i++){
    setTimeout(
        function timer(j){
            console.log(j)
        },
        i*1000,
        i
    )
}
```


第二种就是使用let定义i来解决问题，这也是最为推荐的方式
```
for (let i = 1; i <= 5; i++) {
  setTimeout(function timer() {
    console.log(i)
  }, i * 1000)
}
```

深入了解可参考：[「每日一题」JS 中的闭包是什么？](https://juejin.im/post/5e6ae94ae51d4526d90d262a)


### 深浅拷贝
> 涉及面试题：什么是浅拷贝？如何实现浅拷贝？什么是深拷贝？如何实现深拷贝？

对象类型在赋值的过程中其实是复制了地址，从而会导致改变了一方其他也都被改变的情况。通常在开发中我们不希望出现这样的问题，我们可以使用浅拷贝来解决这个情况。

```
let a = {
    age:1
}
let b = a;
a.age = 2;
console.log(b.age);//2
```

#### 浅拷贝
首先可以通过```Object.assign```来解决这个问题，很多人认为这个函数是用来深拷贝的。其实并不是，```Object.assign```只会拷贝所有的属性值到新的对象中，如果属性值是对象的话，拷贝的是地址，所以并不是深拷贝。

```
let a = {
    age:1
}
let b = Object.assign({},a);
a.age = 2;
console.log(b.age);//1
```

另外我们还可以通过展开运算符```...```来实现浅拷贝
```
let a = {
    age:1
}
let b = {...a};
a.age = 2;
console.log(b.age);//1
```
通常浅拷贝能解决大部分问题，但当我们遇到如下情况就可能需要使用到深拷贝了
```
let a = {
    age:1,
    jobs:{
        first:'FE'
    }
}
let b = {...a};
a.jobs.first = 'aa';
console.log(b.jobs.first);//aa
```
浅拷贝只解决了第一层的问题，如果接下去的值中还有对象的话，那么就又回到最开始的话题了，两者享有相同的地址。要解决这个问题，就要用到深拷贝了。

#### 深拷贝
这个问题通常可以通过```JSON.parse(JSON.stringify(object))```来解决
```
let a = {
    age:1,
    jobs:{
        first:'cook'
    }
}
let b = JSON.parse(JSON.stringify(a));
a.jobs.first = 'web';
console.log(b.jobs.first);//'cook'
```
但是该方法也是有局限性的：
- 会忽略 undefined
- 会忽略 symbol
- 不能序列化函数
-　不能解决循环引用的对象

```
let obj = {
  a: 1,
  b: {
    c: 2,
    d: 3,
  },
}
obj.c = obj.b
obj.e = obj.a
obj.b.c = obj.c
obj.b.d = obj.b
obj.b.e = obj.b.c
let newObj = JSON.parse(JSON.stringify(obj))
console.log(newObj)
```
如果你有这么一个循环引用对象，你会发现并不能通过该方法实现深拷贝

不想往下写了，建议看[JavaScript专题之深浅拷贝](https://juejin.im/post/5e6c44096fb9a07ca80ac1e5)


