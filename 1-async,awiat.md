## Generator函数的语法
### 1.简介
基本概念
Generator函数是ES6提供的一种异步编程解决方案，语法行为与传统函数完全不同。
Generator 函数有多种理解角度。语法上，首先可以把它理解成，Generator函数是一个状态机，封装了多个内部状态。

执行Generator函数会返回一个遍历器对象，也就是说，Generator函数除了状态机，还是一个遍历器对象生成函数。返回的遍历器对象，可以依次遍历Generator函数内部的每一个状态。

Generator函数是一个普通函数，但是有两个特征。一是function关键字与函数名之间有一个星号；二是，函数体内部使用yield表达式，定义不同的内部状态（yield在英语里的意思就是'产出'）。

~~~js
function *helloWordGenerator(){
    yield 'hello';
    yield 'world';
    return 'ending';
}
var hw = helloWordGenerator();
~~~
上面代码定义了一个Generator函数helloWordGenerator，它内部有两个yield表达式（hello和world），即该函数有三个状态：hello,world和return语句（结束执行）。

然后，Generator函数的调用方法与普通函数一样，也是在函数名后面加上一对圆括号。不同的是，调用Generator函数后，该函数并不执行，返回的也不是函数运行结果，而是一个指向内部状态的指针对象，也就是遍历器对象(Iterator Object)。

下一步，必须调用遍历器对象的next方法，使得指针移向下一个状态。也就是说，每次调用next方法，内部指针就从函数头部或上一次停下来的地方开始执行，直到遇到下一个yield表达式（或return语句）为止。换言之，Generator函数是分段执行的，yield表达式(或return语句)为止。换言之，Generator函数是分段执行的，yield表达式是暂停执行的标记，而next方法可恢复执行。
~~~js
hw.next()
//{value:'hello',done:false}
hw.next()
//{value:'world',done:false}
hw.next()
//{value:'ending',done:true}
hw.next()
//{value:undefined,done:true}
~~~
上面代码一共调用了四次next方法。

第一次调用，Generator 函数开始执行，直到遇到第一个yield表达式为止。next方法返回一个对象，它的value属性就是当前yield表达式的值hello，done属性的值false，表示遍历还没有结束。

第二次调用，Generator 函数从上次yield表达式停下的地方，一直执行到下一个yield表达式。next方法返回的对象的value属性就是当前yield表达式的值world，done属性的值false，表示遍历还没有结束。

第三次调用，Generator 函数从上次yield表达式停下的地方，一直执行到return语句（如果没有return语句，就执行到函数结束）。next方法返回的对象的value属性，就是紧跟在return语句后面的表达式的值（如果没有return语句，则value属性的值为undefined），done属性的值true，表示遍历已经结束。

第四次调用，此时 Generator 函数已经运行完毕，next方法返回对象的value属性为undefined，done属性为true。以后再调用next方法，返回的都是这个值。

总结一下，调用 Generator 函数，返回一个遍历器对象，代表 Generator 函数的内部指针。以后，每次调用遍历器对象的next方法，就会返回一个有着value和done两个属性的对象。value属性表示当前的内部状态的值，是yield表达式后面那个表达式的值；done属性是一个布尔值，表示是否遍历结束。

ES6 没有规定，function关键字与函数名之间的星号，写在哪个位置。这导致下面的写法都能通过。
~~~js
function * foo(x, y) { ··· }
function *foo(x, y) { ··· }
function* foo(x, y) { ··· }
function*foo(x, y) { ··· }
~~~
由于 Generator 函数仍然是普通函数，所以一般的写法是上面的第三种，即星号紧跟在function关键字后面。本书也采用这种写法。

### yield表达式
由于 Generator 函数返回的遍历器对象，只有调用next方法才会遍历下一个内部状态，所以其实提供了一种可以暂停执行的函数。yield表达式就是暂停标志。

遍历器对象的next方法的运行逻辑如下。
+ 1.遇到yield表达式，就暂停执行后面的操作，并将紧跟在yield后面的那个表达式的值，作为返回的对象的value属性值。
+ 2.下一次调用next方法时，再继续往下执行，直至遇到下一个yield表达式。
+ 3.如果没有再遇到新的yield表达式，就一直运行到函数结束，直到return语句为止，并将return语句后面的表达式的值，作为返回的对象的value属性值。
+ 4.如果该函数没有return语句，则返回的对象的value属性值为undefined.

需要注意的是，yield表达式后面的表达式，只有当调用next方法、内部指针指向该语句时才会执行，因此等于为JavaScript提供了手动的惰性求值的语法功能。
~~~js
function* gen(){
    yield 123+345;
}
~~~
上面代码中，yield后面的表达式123+345,不会立即求值，只会next方法将指针多到这一句时，才会求值。

yield表达式与return语句既有相似之处，也有区别。相似之处在于，都能返回紧跟在语句后面的那个表达式的值。区别在于每次遇到yield，函数暂停执行，下一次再从该位置继续向后执行，而return语句不具备位置记忆的功能。一个函数里面，只能执行一次（或者说一个）return语句，但是可以执行多次（或者说多个）yield表达式。正常函数只能返回一个值，因为只能执行一次return；Generator 函数可以返回一系列的值，因为可以有任意多个yield。从另一个角度看，也可以说 Generator 生成了一系列的值，这也就是它的名称的来历（英语中，generator 这个词是“生成器”的意思）。

Generator函数可以不用yield表达式，这时就变成了一个单纯的暂缓执行函数。
~~~js
function* f(){
    console.log('执行了')
}
var generator = f();

setTimeout(function(){
    generator.next()
},2000)
~~~

上面代码中，函数f如果是普通函数，在为变量generator赋值时就会执行。但是，函数f是一个 Generator 函数，就变成只有调用next方法时，函数f才会执行。

另外需要注意，yield表达式只能用在 Generator 函数里面，用在其他地方都会报错。
~~~js
(function (){
  yield 1;
})()
// SyntaxError: Unexpected number
~~~
上面代码在一个普通函数中使用yield表达式，结果产生一个句法错误。
下面是另外一个例子。
~~~js
var arr = [1,[[2,3],4],[5,6]];
var flat = function* (a){
    a.forEach(function(item){
        if(typeof item !== 'number'){
            yield* flat(item);
        }else{
            yield item;
        }
    })
}

for(var f of flat(arr)){
    console.log(f)
}
~~~
上面代码也会产生句法错误，因为forEach方法的参数是一个普通函数，但是在里面使用了yield表达式（这个函数里面还使用了yield*表达式，详细介绍见后文）。一种修改方法是改用for循环。
~~~js
var arr = [1,[[2,3],4],[5,6]];
var flat = function* (a){
    var length = a.length;
    for(var i = 0;i < length;i++){
        var item = a[i];
        if(typeof item !== 'number'){
            yield* flat(item);
        }else{
            yield item;
        }
    }
}
for(var f of flat(arr)){
    console.log(f);
}
// 1, 2, 3, 4, 5, 6
~~~
另外，yield表达式如果用在另一个表达式之中，必须放在圆括号里面。
~~~js
function* demo() {
  console.log('Hello' + yield); // SyntaxError
  console.log('Hello' + yield 123); // SyntaxError

  console.log('Hello' + (yield)); // OK
  console.log('Hello' + (yield 123)); // OK
}
~~~
yield表达式用作函数参数或放在赋值表达式的右边，可以不加括号。
~~~js
function* demo(){
    foo(yield 'a',yield 'b');//ok
    let input = yield;//ok
}
~~~


## Generator函数的异步应用
异步编程对 JavaScript 语言太重要。Javascript 语言的执行环境是“单线程”的，如果没有异步编程，根本没法用，非卡死不可。本章主要介绍 Generator 函数如何完成异步操作。
### 传统方法
ES6诞生以前，异步编程的方法，大概有下面四种。
- 回调函数
- 事件监听
- 发布、订阅
- Promise对象

Generator函数将JavaScript异步编程带入了一个全新的阶段。

### 基本概念
#### 异步
所谓异步，简单说就是一个任务不是连续完成的，可以理解成该任务被人为分成两段，先执行第一段，然后转而执行其他任务，等做好了准备，再回过头执行第二段。

比如，有一个任务是读取文件进行处理，任务的第一段是向操作系统发出请求，要求读取文件。然后，程序执行其他任务，等到操作系统返回文件，再接着执行任务的第二段（处理文件）。这种不连续的执行，就叫做异步。

相应地，连续的执行就叫做同步。由于是连续执行，不能插入其他任务，所以操作系统从硬盘读取文件的这段时间，程序只能干等着。

#### 回调函数
JavaScript 语言对异步编程的实现，就是回调函数。所谓回调函数，就是把任务的第二段单独写在一个函数里面，等到重新执行这个任务的时候，就直接调用这个函数。回调函数的英语名字callback，直译过来就是"重新调用"。

读取文件进行处理，是这样写的。
~~~js
fs.readFile('/etc/passwd','utf-8',function(err,data){
    if(err) throw err;
    console.log(data);
})
~~~
上面代码中，readFile函数的第三个参数，就是回调函数，也就是任务的第二段。等到操作系统返回了/etc/passwd这个文件以后，回调函数才会执行。

一个有趣的问题是，为什么 Node 约定，回调函数的第一个参数，必须是错误对象err（如果没有错误，该参数就是null）？

原因是执行分成两段，第一段执行完以后，任务所在的上下文环境就已经结束了。在这以后抛出的错误，原来的上下文环境已经无法捕捉，只能当作参数，传入第二段。

### Promise
回调函数本身没有问题，它的问题出现在多个回调函数嵌套。假定读取A文件之后，再读取B文件，代码如下
~~~js
fs.readFile(fileA,'utf-8',function(err,data){
    fs.readFile(fileB,'utf-8',function(err,data){
        //...
    })
})
~~~
不难想象，如果依次读取两个以上的文件，就会出现多重嵌套。代码不是纵向发展，而是横向发展，很快就会乱成一团，无法管理。因为多个异步操作形成了强耦合，只要有一个操作需要修改，它的上层回调函数和下层回调函数，可能都要跟着修改。这种情况就称为"回调函数地狱"（callback hell）。

Promise对象就是为了解决这个问题而提出的，它不是新的语法功能，而是一种新的写法，允许将回调函数的嵌套，改成链式调用。采用Promise，连续读取多个文件，写法如下
~~~js
var readFile = require('fs-readfile-promise');

readFile(fileA)
.then(function(data){
    console.log(data.toString());
})
.then(function(){
    return readFile(fileB)
})
.then(function(data){
    console.log(data.toString())
})
.catch(function(err){
    console.log(err);
})
~~~
上面代码中，我使用了fs-readfile-promise模块，它的作用就是返回一个 Promise 版本的readFile函数。Promise 提供then方法加载回调函数，catch方法捕捉执行过程中抛出的错误。

可以看到，Promise 的写法只是回调函数的改进，使用then方法以后，异步任务的两段执行看得更清楚了，除此以外，并无新意。

Promise 的最大问题是代码冗余，原来的任务被 Promise 包装了一下，不管什么操作，一眼看去都是一堆then，原来的语义变得很不清楚。

那么，有没有更好的写法呢？

### Generator函数
#### 协程
传统的编程语言，早有异步编程的解决方案（其实是多任务的解决方案）。
其中有一种叫做'协程'(coroutine),意思是多个线程互相协作，完成异步任务。

协程有点像函数，又有点像线程。它的运行流程大致如下。
第一步，协程A开始执行。
第二步，协程A执行到一半，进入暂停，执行权转移到协程B。
第三步，（一段时间后）协程B交还执行权。
第四步，协程A恢复执行。

上面流程的协程A，就是异步任务，因为它分成两段（或多段）执行。

举例来说，读取文件的协程写法如下。
~~~js
function *asyncJob(){
    //...其他代码
    var f = yield readFile(fileA);
    //...其他代码
}
~~~
上面代码的函数asyncJob是一个协程，它的奥妙就在其中的yield命令。
它表示执行到此处，执行权将交给其他协程。也就是说，yield命令是异步两个阶段的分界线。

协程遇到yield命令就暂停，等到执行权返回，再从暂停的地方继续往后执行。它的最大优点，就是代码的写法非常像同步操作，如果去除yield命令，简直一模一样。

#### 协程的Generator函数实现
Generator函数是协程在ES6的实现，最大特点就是可以交出函数的执行权（即暂停执行）。

整个Generator函数就是一个封装的异步任务，或者说是异步任务的容器。异步操作需要暂停的地方，都用yield语句注明。Generator函数的执行方法如下
~~~js
function *gen(x){
    var y = yield x + 2;
    return y;
}
var g = gen(1);
g.next() // {value:3,done:false}
g.next() // {value:undefined,done:true}
~~~
上面代码中，调用Generator函数，会返回一个内部指针（即遍历器）g。
这是Generator函数不同于普通函数的另一个地方，即执行它不会返回结果，返回的是指针对象。
调用指针g的next方法，会移动内部指针（即执行异步任务的第一段），指向第一个遇到的yield语句，上例是执行到x+2为止。

换言之，next方法的作用是分阶段执行Generator函数。每次调用next方法，会返回一个对象，表示当前阶段的信息（value属性和done属性）。value属性是yield语句后面表达式的值，表示当前阶段的值；done属性是一个布尔值，表示Generator函数是否执行完毕，即是否还有下一个阶段。

#### Generator函数的数据交换和错误处理
Generator函数可以暂停执行和恢复执行，这是它能封装任务的根本原因。除此之外，它还有两个特性，使它可以作为异步编程的完整解决方案：函数体内外的数据交换和错误处理机制。

next返回值的value属性，是Generator函数向外输出数据；next方法还可以接受参数，向Generator函数体内输入数据。
~~~js
function *gen(x){
    var y = yield x + 2;
    return y;
}
var g = gen(1);
g.next()  //{value:3,done:false}
g.next(2) //{value:2,done:true}
~~~
上面代码中，第一next方法的value属性，返回表达式x + 2的值3。第二个next方法带有参数2，这个参数可以传入 Generator 函数，作为上个阶段异步任务的返回结果，被函数体内的变量y接收。因此，这一步的value属性，返回的就是2（变量y的值）。

Generator函数内部还可以部署错误处理代码，捕获函数体外抛出的错误。
~~~js
function *gen(x){
    try{
        var y = yield x + 2;
    }catch(e){
        console.log(e);
    }
    return y;
}
var g = gen(1);
g.next();
g.throw('error');
~~~

上面代码的最后一行，Generator 函数体外，使用指针对象的throw方法抛出的错误，可以被函数体内的try...catch代码块捕获。这意味着，出错的代码与处理错误的代码，实现了时间和空间上的分离，这对于异步编程无疑是很重要的。

#### 异步任务的封装
下面看看如何使用Generator函数，执行一个真实的异步任务。
~~~js
var fetch = require('node-fetch');

function *gen(){
    var url = 'https://api.github.com/users/github';
    var result = yield fetch(url);
    console.log(result.bio);
}
~~~
上面代码中，Generator函数封装了一个异步操作，该操作先读取一个远程接口，然后从JSON格式的数据解析信息。就像前面说过的，这段代码非常像同步操作，除了加上了yield命令。

执行这段代码的方法如下
~~~js
var g = gen();
var result = g.next();

result.value.then(function(data){
    return data.json();
}).then(function(data){
    g.next(data);
})
~~~
上面代码中，首先执行Generator函数，获取遍历器对象，然后使用next方法（第二行），执行异步任务的第一阶段。由于Fetch模块返回的是一个Promise对象，因此要用then方法调用下一个next方法。

可以看到，虽然Generator函数将异步操作表示得很简洁，但是流程管理却不方便，即何时执行第一阶段、何时执行第二阶段）。





## async函数
ES2017标准引入了async函数，使得异步操作变得更加方便。
async是Generator函数的语法糖。
