# Symbol
> 保证每个属性的名字都是独一无二的，从根本上防止属性名的冲突。
~~~js
let s = Symbol();
typeof s;
~~~
上面代码中，变量s是一个独一无二的值。typeof运算符的结果，表明变量s是Symbol数据类型，而不是字符串之类的其他类型。

注意，Symbol函数前不能使用new命令，否则会报错。这是因为生成的 Symbol 是一个原始类型的值，不是对象。也就是说，由于 Symbol 值不是对象，所以不能添加属性。基本上，它是一种类似于字符串的数据类型。

Symbol函数可以接受一个字符串作为参数，表示对 Symbol 实例的描述，主要是为了在控制台显示，或者转为字符串时，比较容易区分。
~~~js
let s1 = Symbol('foo');
let s2 = Symbol('bar');

s1 // Symbol(foo)
s2 // Symbol(bar)

s1.toString() // "Symbol(foo)"
s2.toString() // "Symbol(bar)"

~~~

上面代码中，s1和s2是两个 Symbol 值。如果不加参数，它们在控制台的输出都是Symbol()，不利于区分。有了参数以后，就等于为它们加上了描述，输出的时候就能够分清，到底是哪一个值。

如果 Symbol 的参数是一个对象，就会调用该对象的toString方法，将其转为字符串，然后才生成一个 Symbol 值。
~~~js
const obj = {
    toString(){
        return 'abc';
    }
};
const sym = Symbol(obj);
sym
~~~
注意，Symbol函数的参数只是表示对当前 Symbol 值的描述，因此相同参数的Symbol函数的返回值是不相等的。

~~~js
//没有参数的情况
let s1 = Symbol();
let s2 = Symbol();

s1 === s2 //false

//有参数的情况
let s1 = Symbol('foo');
let s2 = Symbol('foo');

s1 === s2 //false
~~~
上面代码中，s1和s2都是Symbol函数的返回值，而且参数相同，但是它们是不相等的。

Symbol值不能与其他类型的值进行运算，会报错
~~~js
let sym = Symbol('My symbol');

'your symbol is ' + sym;
// TypeError: can't convert symbol to string
`your symbol is ${sym}`
// TypeError: can't convert symbol to string
~~~

但是，Symbol值可以显示转为字符串
~~~js
let sym = Symbol('My symbol');
String(sym) //'Symbol(My symbol)'
sym.toString()  //'Symbol(My symbol)'
~~~

另外，Symbol值也可以转为布尔值，但是不能转为数值
~~~js
let sym = Symbol();
Boolean(sym) //true
!sym //false

if(sym){
    //...
}

Number(sym) // TypeError
sym+2  // TypeError
~~~

## Symbol.prototype.description
创建Symbol的时候，可以添加一个描述。
~~~js
const sym = Symbol('foo');
~~~
上面代码中，sym的描述就是字符串foo.

但是，读取这个描述需要将Symbol显式转为字符串，即下面的写法。
~~~js
const sym = Symbol('foo');

String(sym) //'Symbol(foo)'
sym.toString() //'Symbol(foo)'
~~~
上面的用法不是很方便。ES2019提供了一个实例属性description,直接返回Symbol的描述。
~~~js
const sym = Symbol('foo');
sym.description //'foo'
~~~

## 3.作为属性名的Symbol
由于每一个Symbol值都是不相等的，这意味着Symbol值可以作为标识符，用于对象的属性名，就能保证不会出现同名的属性。这对于一个对象由多个模块构成的情况非常有用，能防止某一个键被不小心改写或覆盖。
~~~js
let mySymbol = Symbol();

//第一种写法
let a = {};
a[mySymbol] = 'Hello';

//第二种写法
let a = {
    [mySymbol]:'Hello';
}

//第三种写法
let a = {};
Object.defineProperty(a,mySymbol,{value:'Hello!'});

//以上写法都得到同样结果
a[mySymbol] //'Hello'
~~~
上面代码通过方括号结构和Object.defineProperty，将对象的属性名指定为一个Symbol值。

注意，Symbol值作为对象属性名时，不能用点运算符。
~~~js
const mySymbol = Symbol();
const a = {};

a.mySymbol = 'Hello';
a[mySymbol] //undefined
a['mySymbol'] //'Hello'
~~~
上面代码中，因为点运算符后面总是字符串，所以不会读取mySymbol作为标识名所指代的那个值，导致a的属性名实际上是一个字符串，而不是一个 Symbol 值。

同理，在对象的内部，使用 Symbol 值定义属性时，Symbol 值必须放在方括号之中。
~~~js
let s = Symbol();

~~~



