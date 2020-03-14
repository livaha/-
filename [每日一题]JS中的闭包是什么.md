> 1.什么是「闭包」。
2.「闭包」的作用是什么。

```
var local = '变量';
function foo(){
    console.log(local)
}
//在函数内部可以访问local变量
```

假设上面三行代码在一个立即执行函数中,三行代码中，有一个局部变量 local，有一个函数 foo，foo 里面可以访问到 local 变量。

好了这就是一个闭包：

「函数」和「函数内部能访问到的变量」（也叫环境）的总和，就是一个闭包。 

就这么简单。

有的同学就疑惑了，闭包这么简单么？

「我听说闭包是需要函数套函数，然后 return 一个函数的呀！」

比如这样：
```
function foo(){
    var local = 1;
    function bar(){
        local++;
        return local;
    }
    return bar;
}
```
这里面确实有闭包，local变量和bar函数就组成了一个闭包(Closure)。

#### 为什么要函数套函数呢？
是因为需要局部变量，所以才把local放在一个函数里，如果不把local放在一个函数里，local就是一个全局变量了，达不到使用闭包的目的--隐藏变量（等会会讲）。

这就是为什么上面要说[运行在一个立即执行函数中]。
有些人看到[闭包这个名字]，就一定觉得要用什么包起来才行。其实这是翻译问题，闭包的原文是Closure，跟[包]没有任何关系。

所以函数套函数只是为了造出一个局部变更，跟闭包无关。

为什么要return bar呢？
因为如果不return，你就无法使用这个闭包。把return bar改成window.bar=bar也是一样的，只要让外面可以访问到这个bar函数就行了。

所以return bar只是为了bar能被使用，也跟闭包无关。

### 闭包的作用
闭包常常用来[间接访问一个变量]，换句话说，[隐藏一个变量]。

假设我们在做一个游戏，在写其中关于[还剩几条命]的代码。

如果不用闭包，你可以直接用一个全局变量：
```
window.lives = 30 //还有三十条命
```
这样看起来很不妥。万一不小心把这个值改成 -1 了怎么办。所以我们不能让别人「直接访问」这个变量。怎么办呢？

用局部变量。

但是用局部变量别人又访问不到，怎么办呢？

暴露一个访问器（函数），让别人可以「间接访问」。

代码如下：
```
!function(){
    var lives = 50;
    window.奖励一条命 = function(){
        lives += 1;
    }
    window.死了一条命 = function(){
        lives -= 1;
    }
}()
```
简明起见，我用了中文 :)

那么在其他的 JS 文件，就可以使用 window.奖励一条命() 来涨命，使用 window.死一条命() 来让角色掉一条命。

看到闭包在哪了吗？

![](https://user-gold-cdn.xitu.io/2020/3/13/170d1e23680678fe?w=720&h=397&f=png&s=199252)

我们重新来审视一下闭包的代码：

![](https://user-gold-cdn.xitu.io/2020/3/13/170d1e3c6aa5c8f6?w=689&h=394&f=png&s=190284)
第一句是变量声明，第二句是函数声明，第三句是 console.log。

每一句我都学过，为什么合起来我就看不出来是闭包？

我告诉你答案，你根本不需要知道闭包这个概念，一样可以使用闭包！

闭包是 JS 函数作用域的副产品。

换句话说，正是由于 JS 的函数内部可以使用函数外部的变量，所以这段代码正好符合了闭包的定义。而不是 JS 故意要使用闭包。

很多编程语言也支持闭包，另外有一些语言则不支持闭包。

只要你懂了 JS 的作用域，你自然而然就懂了闭包，即使你不知道那就是闭包！

### 所谓闭包的作用
  让外部访问函数内部变量成为可能；

  局部变量会常驻在内存中；

  可以避免使用全局变量，防止全局变量污染；

### 闭包的应用场景
#### 例子1
```
function funA(){
    var a = 10;
    return function(){
        console.log(a);
    }
}
var b = funA();
b(); //10
```
#### 例子2
```
function outFun(){
    var i = 0;
    function inFun(){
        i++;
        console.log(i);
    }
    return inFun();
}
var inner = outFun();
//每次外部函数执行的时候，外部函数的地址不同，都会重新创建一个新的地址
inner();
inner();
inner();
var inner2 = outerFun();
inner2();
inner2();
inner2();
//1 2 3 1 2 3 
```

#### 例子3
```
var i = 0;
function outFun(){
    function inFun(){
        i++;
        console.log(i);
    }
    return inFun();
}
var inner1 = outFun();
var inner2 = outFun();
inner1();
inner2();
inner1();
inner2();
//1 2 3 4
```

#### 例子4
```
function outFun(){
    var i = 0;
    function inFun(){
        i++;
        console.log(i);
    }
    return inFun();
}
var inner1 = outFun();
var inner2 = outFun();
inner1();
inner2();
inner1();
inner2();
//1 1 2 2
```

#### 例子5
```
function fn(){
    var a = 3;
    return function(){
        return ++a;
    }
}
alert(fn()()) //4
alert(fn()()) //4
```

#### 例子6
```
(function(){
    var m = 0;
    function getM(){
        return m;
    }
    function seta(val){
        m = val;
    }
    window.g = getM;
    window.f = seta;
})();
f(100);
console.info(g()); //100
//闭包找到的是同一地址中父级函数中对应变量最终的值
```
#### 例子7
```
function a(){
    var i = 0;
    function b(){
        alert(++i);
    }
    return b;
}
var c = a();
c();//1
c();//2
```

#### 例子8
```
var add = function f(x){
    var sum = 1;
    var tmp = function(x){
        sum = sum + x;
        console.log('tmpfun:',sum)
        return tmp;
    }
    tmp.toString = function(){
        console.log('tostr:',sum)
        return sum;
    }
    return tmp;
}
alert(add(1)(2)(3));
//tmpfun: 3
//tmpfun: 6
//tostr: 6
//6 (alert)
```

#### 例子9
```
var lis = document.getElementsByTagName("li");
for(var i = 0;i < lis.length;i++){
    (function(i){
      lis[i].onclick = function(){
        console.log(i);
      }
    })(i); //事件处理函数中闭包的写法
}
```

#### 例子10
```
function m1(){
     var x = 1;
     return function(){
          console.log(++x);
     }
}
 
m1()();   //2
m1()();   //2
m1()();   //2
 
var m2 = m1();
m2();   //2
m2();   //3
m2();   //4
```
##### 解析 tip
m1()()多次是因为都是重新执行函数，重新开辟的空间,
这关于堆栈运行机制和作用域问题.

m1()()执行完后，没有变量或函数对其引用，被垃圾回收了,

m2获取了m1的闭包，根据作用域链维护了引用关系，不会对m1的闭包进行垃圾回收。

所以除非m2这个引用去除，m1的闭包会一直保存在内存中.

垃圾回收可以看看，标记计数和引用删除.

#### 例子11
```
var fn = (function(){
    var i = 10;
    function fn(){
        console.log(++i);
    }
    return fn;
})()
fn();//11
fn();//12
```

#### 例子12
```
function love1(){
     var num = 223;
     var me1 = function() {
           console.log(num);
     }
     num++;
     return me1;
}
var loveme1 = love1();
loveme1();   //输出224
```

#### 例子13
```
function fun(n,o){
    console.log(o);
    return{
        fun:function(m){
            return fun(m,n);
        }
    };
}
var a = fun(0);//undefined
a.fun(1);//0
a.fun(2);//0
a.fun(3);//0
var b = fun(0).fun(1).fun(2).fun(3);//undefined 0 1 2
var c = fun(0).fun(1) // undefined 0
c.fun(2); //1
c.fun(3); //1

```


#### 例子14
```
function fn(){
    var arr = [];
    for(var i = 0;i < 5; i++){
        arr[i] = function(){
            return i;
        }
        console.log(arr[i]())
    }
    
for(var i = 0,len = list.length;i < len; i++){
    console.log(list[i]());
}
    return arr;
}
var list = fn();
for(var i = 0,len = list.length;i < len; i++){
    console.log(list[i]());
}//5 5 5 5 5 
```

#### 例子15
```
function fn(){
  var arr = [];
  for(var i = 0;i < 5;i ++){
	arr[i] = (function(i){
		return function (){
			return i;
		};
	})(i);
  }
  return arr;
}
var list = fn();
for(var i = 0,len = list.length;i < len ; i ++){
  console.log(list[i]());
}  //0 1 2 3 4
```

-----------
参考自：
- [「每日一题」JS 中的闭包是什么？](https://zhuanlan.zhihu.com/p/22486908)

- [闭包，看这一篇就够了——带你看透闭包的本质，百发百中](https://blog.csdn.net/weixin_43586120/article/details/89456183)

