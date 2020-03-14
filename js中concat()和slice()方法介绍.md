#### 1.concat()

concat()方法用于连接两个或者多个数组。

该方法不会改变现有的数组，而仅仅会返回被连接数组的一个副本。
```
var arr = ['arr'];
var arr2 = new Array(3);
arr2[0] = 'aaa';
arr2[1] = 'bbb';
arr2[2] = 'ccc';
arr = arr.concat(arr2);
console.log(arr);
//打印结果 ["arr", "aaa", "bbb", "ccc"]
```

#### 2.slice()
slice()方法从已有的数组中返回选定的元素。
```
var arr = new Array(3);
arr[0] = 'aaa';
arr[1] = 'bbb';
arr[2] = 'ccc';
arr[3] = 'ddd';
var arr2 = arr.slice(0,3);//取arr数组下标>=0<3的数据赋值给arr2
console.log(arr2);
//打印["aaa", "bbb", "ccc"]
```

-----
转载于:https://www.cnblogs.com/chunyansong/p/9098725.html