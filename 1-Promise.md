# 异步编程
这是一块重要+重点和难点的东西

## 并发(concurrency)和并行(parallelism)区别
> 面试题：并发与并行的区别？


# Promise
> 涉及面试题：Promise 的特点是什么，分别有什么优缺点？什么是 Promise 链？Promise 构造函数执行和 then 函数执行有什么区别？

Promise 翻译过来就是承诺的意思，这个承诺会在未来有一个确切的答复，并且该承诺有三种状态，分别是：

- 等待中（pending）
- 完成了 （resolved）
- 拒绝了（rejected）

这个承诺一旦从等待状态变成为其他状态就永远不能更改状态了，也就是说一旦状态变为 resolved 后，就不能再次改变
~~~js
new Promise((resolve,reject)=>{
    resolve('success');
    //无效
    reject('reject')
})
~~~
当我们在构造 Promise 的时候，构造函数内部的代码是立即执行的
~~~js
new Promise((resolve,reject)=>{
    console.log('new Promise')
    resolve('success')
})
console.log('finifsh')
// new Promise -> finifsh
~~~

Promise实现了链式调用，也就是说每次调用then之后返回的都是一个Promise,并且是一个全新的Promise,原因也是因为状态不可变。如果你在then中使用了return,那么return的值会被Promise.resolve()包装
~~~js
Promise.resolve(1)
  .then(res => {
    console.log(res) // => 1
    return 2 // 包装成 Promise.resolve(2)
  })
  .then(res => {
    console.log(res) // => 2
  })
~~~
当然，Promise也很好地解决了回调地狱的问题，可以把之前的回调地狱例子改写为如下代码：
~~~js
ajax(url)
    .then(res=>{
        console.log(res)
        return ajax(url1)
    }).then(res=>{
        console.log(res)
        return ajax(url2)
    }).then(res=>console.log(res))
~~~
前面都是在讲述Promise的一些优点和特点，其实它也是存在一些缺点的，比如无法取消Promise,错误需要通过回调函数捕获。



## Promise对象
### Promise的含义
Promise是一个对象，从它可以获取异步操作的消息。Promise提供统一的API,各种异步操作都可以用同样的方法进行处理。

Promise对象有以下两个特点：
- 对象的状态不受外界影响。Promise对象代表一个异步操作，有三种状态：Pending(进行中)、Resolved(已完成)和Rejectd(已失败)。只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态。
- 一旦状态改变，就不会再变，任何时候都可以得到这个结果。Promise对象的状态改变，只有两种可能：从Pending变为Resolved和从Pending变为Rejected.只要这两种情况发生，状态就会凝固，会一直保持这个结果。如果改变已经发生了，你再对Promise对象添加回调函数，也会立即得到这个结果。这与事件(Event)完全不同，事件的特点是，如果你错过了它，再去监听，是得不到结果的。

Promise缺点：
- 无法取消Promise,一旦新建它就会立即执行，无法中途取消。
- 如果不设置回调函数，Promise内部抛出的错误，不会反应到外部。
- 当处于Pending状态时，无法得知目前进展到哪一个阶段(刚刚开始还是即将完成)。

如果某些事件不断地反复发生，一般来说，使用stream模式是比部署Promise更好的选择。

### 基本用法
ES6规定，Promise对象是一个构造函数，用来生成Promise实例。

下面创造一个Promise实例：
~~~js
var promise = new Promise(function(resolve,reject){
    //...some code
    if(/*异步操作成功*/){
        resolve(value);
    }else{
        reject(error);
    }
});
~~~

Promise构造函数接受一个函数作为参数，该函数的两个参数分别是resolve和reject。它们是两个函数，由JS引擎提供，不用自己部署。

resolve函数的作用是，将Promise对象的状态从"未完成"变为"成功"（即从Pending变为Resolve），在异步操作成功时调用，并将异步操作的结果，作为参数传递出去；reject函数的作用是，将Promise对象的状态从"未完成"变为"失败"(即从Pendding变为Rejected)，在异步操作失败时调用，并将异步操作报出的错误，作为参数传递出去。

Promise实例生成以后，可以用then方法分别指定Resolved状态和Reject状态的回调函数。
~~~js
Promise.then(function(value){
    //success
},function(error){
    //failure
})
~~~

then方法可以接受两个回调函数作为参数。第一个回调函数是Promise对象的状态变为Resolved时调用，第二个回调函数是Promise对象的状态变为Reject时调用。其中，第二个函数是可选的，不一定要提供。这两个函数都接受Promise对象传出的值作为参数。

下面是Promise对象的简单例子：
~~~js
function timeout(ms){
    return new Promise((resolve,reject)=>{
        setTimeout(resolve,ms,'done')
    })
}
timeout(100).then((value)=>{
    console.log(value);
})
~~~
上面代码中，timeout方法返回一个Promise实例，表示一段时间以后才会发生的结果。过了指定时间(ms参数)以后，Promise实例的状态变为Resolved，就会触发then方法绑定的回调函数。

Promise新建后就会立即执行
~~~js
let promise = new Promise(function(resolve,reject){
    console.log('Promise');
    resolve();
})

promise.then(function(){
    console.log('Resolved.');
})

console.log('Hi!');
// Promise
// Hi!
// Resolved
~~~
上面代码中，Promise新建后立即执行，所以首先输出的是Promise,然后then方法指定的回调函数，将在当前脚本所有同步任务执行完才会执行，所以Resolved最后输出。

下面是异步加载图片的例子。
~~~js
function loadImageAsync(url){
    return new Promise(function(resolve,reject){
        var image = new Image();
        image.onload  = function(){
            resolve(image);
        }
        image.onerror = function(){
            reject(new Error('Could not load image at ' + url))
        }
        image.src = url;
    })
}
~~~

下面是一个用Promise对象实现的Ajax操作的例子
~~~js
var getJSON = function(url){
    var promise = new Promise(function(resolve,reject){
        var client = new XMLHttpRequest();
        client.open("GET",url);
        client.onreadystatechange = handle;
        client.responseType = 'json';
        client.setRequestHeader("Accept","application/json");
        client.send();

        function handler(){
            if(this.readyState !== 4){
                return;
            }
            if(this.status === 200){
                resolve(this.response);
            }else{
                reject(new Error(this.statusText));
            }
        }
    })
    return promise;
}

getJSON("/posts.json").then(function(json){
    console.log('Contents:'+json);
},function(error){
    console.log('出错了',error);
})
~~~
上面代码中，getJSON是对XMLHttpRequest对象的封装，用于发出一个针对JSON数据的HTTP请求，并且返回一个Promise对象。需要注意的是，在getJSON内部，resolve函数和reject函数调用时，都带有参数。

如果调用resolve函数和reject函数时带有参数，那么它们的参数会被传递给回调函数。reject函数的参数除了正常的值以外，还可能是另一个Promise实例，表示异步操作的结果有可能是一个值，也有可能是另一个异步操作，比如像下面这样：
~~~js
var p1 = new Promise(function(resolve,reject){
    //...
})
var p2 = new Promise(function(resolve,reject){
    //...
    resolve(p1);
})
~~~
上面代码中，p1和p2都是Promise的实例，但是p2的resolve方法将p1作为参数，即一个异步操作的结果是返回另一个异步操作。

注意，这时p1的状态就会传递给p2,也就是说，p1的状态决定了p2的状态。如果p1的状态是Pending,那么p2的回调函数就会等待p1的状态改变；如果p1的状态已经是Resolved或Rejected，那么p2的回调函数将会立刻执行。
~~~js
var p1 = new Promise(function(resolve,reject){
    setTimeout(()=>reject(new Error('fail')),3000)
})
var p2 = new Promise(function(resolve,reject){
    setTimeout(()=>resolve(p1),1000)
})

p2
  .then(result=>console.log(result))
  .catch(error=>console.log(error))
  //Error:fail
~~~
上面代码中，p1是一个Promise，3秒之后变为rejected。p2的状态在1秒之后改变，resolve方法返回的是p1。由于p2返回的是另一个 Promise，导致p2自己的状态无效了，由p1的状态决定p2的状态。所以，后面的then语句都变成针对后者（p1）。又过了2秒，p1变为rejected，导致触发catch方法指定的回调函数。

### Promise.prototype.then()
Promise实例具有then方法，也就是说，then方法是定义在原型对象Promise.prototype上的，它的作用是为Promise实例添加状态改变时的回调函数。前面说过，then方法的第一个参数是Resolved状态的回调函数，第二个参数（可选）是Rejected状态的回调函数。

then方法返回的是一个新的Promise实例（注意，不是原来那个Promise实例）。因此可以采用链式写法，即then方法后面再调用另一个then方法。
~~~js
getJSON('/posts.json').then(function(json){
    return json.post;
}).then(function(post)){
    //...
}
~~~
上面的代码使用then方法，依次指定了两个回调函数。第一个回调函数完成以后，会将返回结果作为参数，传入第二个回调函数。

采用链式的then,可以指定一组按照次序调用的回调函数。这时，前一个回调函数，有可能返回的还是一个Promise对象（即有异步操作），这时后一个回调函数，就会等待该Promise对象的状态发生变化，才会被调用。
~~~js
getJSON('/post/1.json').then(function(post){
    return getJSON(post.commentURL);
}).then(function funcA(comments){
    console.log('Resolved:',comments);
},function funcB(err){
    console.log('Rejected:',err);
})
~~~
上面代码中，第一个then方法指定的回调函数，返回的是另一个Promise对象。这时，第二个then方法指定的回调函数，就会等这个新的Promise对象状态发生。如果变为Resolved，就调用funcA,如果状态变为Rejected，就调用funcB.

如果采用箭头函数，上面的代码可以变得更简洁：
~~~js
getJSON('/post/1.json').then(
    post=>getJSON(post.commentURL)
).then(
    comments=>console.log('Resolved:',comments),
    err=>console.log('Rejected:',err)
)
~~~

### Promise.prototype.catch()
Promise.prototype.catch方法是.then(null,rejection)的别名，用于指定发生错误的回调函数。
~~~js
getJSON('/posts.json').then(function(posts){
    //...
}).catch(function(error){
    //处理getJSON和前一个回调函数运行时发生的错误
    console.log('error!',error);
})
~~~
上面代码中，getJSON方法返回一个Promise对象，如果该对象状态变为Resolved,则会调用then方法指定的回调函数；如果异步操作抛出错误，状态就会变为Rejected,就会调用catch方法指定的回调函数，处理这个错误。另外，then方法指定的回调函数，如果运行中抛出错误，也会被catch方法捕获。
~~~js
p.then((val)=>console.log('fulfilled:',val))
 .catch((err)=>console.log('rejected',err));

//等同于
p.then((val)=>console.log('fulfilled:',val))
 .then(null,(err)=>console.log('rejected:',err))
~~~

下面是一个例子：
~~~js
var promise = new Promise(function(resolve,reject){
    throw new Error('test')
});
promise.catch(function(error){
    console.log(error)
})
~~~
上面代码中，promise抛出一个错误，就被catch方法指定的回调函数捕获。注意，上面的写法与下面两种写法是等人的。
~~~js
//方法1
var promise = new Promise(function(resolve,reject){
    try{
        throw new Error('test');
    }catch(e){
        reject(e);
    }
});
promise.catch(function(error){
    console.log(error);
})
//方法2
var promise = new Promise(function(resolve,reject){
    reject(new Error('test'))
});
promise.catch(function(error){
    console.log(error)
})
~~~
比较上面两种写法，可以发现reject方法的作用，等同于抛出错误。

如果Promise状态已经变成Resolved，再抛出错误是无效的。
~~~js
var promise = new Promise(function(resolve, reject) {
  resolve('ok');
  throw new Error('test');
});
promise
  .then(function(value) { console.log(value) })
  .catch(function(error) { console.log(error) });
// ok
~~~
上面代码中，Promise 在resolve语句后面，再抛出错误，不会被捕获，等于没有抛出。因为 Promise 的状态一旦改变，就永久保持该状态，不会再变了。

Promise 对象的错误具有“冒泡”性质，会一直向后传递，直到被捕获为止。也就是说，错误总是会被下一个catch语句捕获。

...

