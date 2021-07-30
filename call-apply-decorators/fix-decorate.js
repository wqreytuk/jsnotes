//https://javascript.info/call-apply-decorators


//我们可以使用func.call(context, ...args)来进行修正
//这种方式允许我们显式的指定this
/*
func.call(context, arg1, arg2, ...)

context为显式指定的this，后面的是不定长参数
func为我们要调用的对象（context）的方法
*/

//如下例子进行说明
/******
function sayHi() {
  alert(this.name);
}

let user = { name: "John" };
let admin = { name: "Admin" };

// use call to pass different objects as "this"
//给call传入不同的对象，sayHi方法就会产生不同的输出
//因为this被显式指定为了参数中的对象，this.name也会随之变更为user.name和admin.name
sayHi.call( user ); // John
sayHi.call( admin ); // Admin
******/

//下面是一个传参的例子
/******
function say(phrase) {
  alert(this.name + ': ' + phrase);
}

let user = { name: "John" };

// user becomes this, and "Hello" becomes the first argument
//this被指定为user, this.name即John，phrase就是参数-》Hello
say.call( user, "Hello" ); // John: Hello
******/

//对与wrong-decorate.js的修改

// we'll make worker.slow caching
let worker = {
  someMethod() {
    return 1;
  },

//worker对象的slow方法
  slow(x) {
    // scary CPU-heavy task here、、
	
	//假设下面是吃CPU的操作
    console.log("Called with " + x);
	//用自己的参数x乘以了worker对象的另一个方法的返回值
	//然后将结果返回
    return x * this.someMethod(); // (*)
  }
};

// same code as before
//函数装饰器，接收一个函数作为参数
function cachingDecorator(func) {
	//创建map对象
  let cache = new Map();
  //返回一个方法，该方法接收一个x作为参数
  return function(x) {
	  //判断缓存中是否有这个键，有就直接返回其在map中对应的值
    if (cache.has(x)) {
      return cache.get(x);
    }
	//没有就使用被装饰的函数求值
	//这里的this就是调用装饰器生成的函数的那个对象，也就是86行的worker
    let result = func.call(this, x); // (**)
	//将新求得的值和键放入map中，然后返回求得的值
    cache.set(x, result);
    return result;
  };
}

alert( worker.slow(1) ); // the original method works

worker.slow = cachingDecorator(worker.slow); // now make it caching

alert( worker.slow(2) ); // Whoops! Error: Cannot read property 'someMethod' of undefined
//上面这一行会报错
/*
VM64:15 Uncaught TypeError: this.someMethod is not a function
    at slow (<anonymous>:15:21)
    at Object.slow (<anonymous>:31:18)
    at <anonymous>:42:15
*/
//报错的原因在于slow函数在装饰其中被调用时，也就是上面的第35行
//是没有this的，因为它的调用形式为func(x)，只有使用worker.slow的时候，this才有意义
//因此这里的this就是undefined，就报出了无法找到someMethod方法的错误
/*形如下面这种调用方式，肯定是会报错的
let func = worker.slow;
func(2);
*/