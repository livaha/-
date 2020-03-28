/**
 * 来自木易杨 https://muyiy.cn/question/js/2.html
 *第 2 题：['1', '2', '3'].map(parseInt) what & why ?
 */

 console.log(['1','2','3'].map(parseInt))
 //me  1,2,3
 //right    [1,NaN,NaN]

 console.log(['1','2','3','4','5','6','7','10'].map((item,index)=>{
     return parseInt(item,index)
 }))
 //right  [ 1, NaN, NaN, NaN, NaN, NaN, NaN, 7 ]
//parseInt(1,0)  10进制的1
//parseInt(2,1)  1进制的没有，都表示NaN
//parseInt(3,2)  2进制的3 不存在
//parseInt(4,3)
//parseInt(5,4)
//parseInt(6,5)
//parseInt(7,6)
//parseInt(10,7)  7进制的10？


console.log(['10','10','10','10','10','10'].map((item,index)=>{
    return parseInt(item,index)
}))
//[ 10, NaN, 2, 3, 4, 5 ]
//parseInt(10,0)  10进制的1
//parseInt(10,1)  1进制的没有，都表示NaN
//parseInt(10,2)  2进制的10 存在=2
//parseInt(10,3)  
//parseInt(10,4)


//如果想要正确写出，则应该在parseInt里加参数
console.log(['2','10','3','202','10','10'].map((item,index)=>{
    return parseInt(item,10)
}))
//-----------正确 ！

//或者   上下2选其一
console.log(['2','10','3','202','10','10'].map((item,index)=>{
    return Number(item)
}))

//-----------正确 ！


