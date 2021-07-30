//下面我们来让我们的装饰器更加的具有普适性
//之前的装饰器装饰的函数都只有一个参数
//下面我们来搞一个可以传递多个参数的

//现在我们有下面的一段代码
/*****
let worker = {
  slow(min, max) {
	  //假设下面的代码为吃CPU的操作
    return min + max; // scary CPU-hogger is assumed
  }
};

// should remember same-argument calls
//现在我们需要思考，如何设计出符合要求的装饰器
worker.slow = cachingDecorator(worker.slow);
*****/

/*
在之前的装饰器实现中，我们使用的是map数据结构，但是该结构类型只允许单个的值
作为键
*/

//最具实操性的解决方案就是将多个参数进行hash，使其变为一个唯一的值

//下面是我们的更加强大的装饰器函数：
let worker = {
  slow(min, max) {
    alert(`Called with ${min},${max}`);
    return min + max;
  }
};


//装饰器接收两个函数作为参数，其中第一个是可以变的
//第二个参数是我们自己写的一个hash函数，用于将多个参数转换为一个参数
function cachingDecorator(func, hash) {
  let cache = new Map();
  return function() {
	  //将参数转换为一个key，以适应map数据结构
	  console.log(typeof(arguments));
    let key = hash(arguments); // (*)
    if (cache.has(key)) {
      return cache.get(key);
    }

    let result = func.call(this, ...arguments); // (**)

    cache.set(key, result);
    return result;
  };
}

function hash(args) {
	//hash是摘要的意思，hash算法有多种实现，下面是我们的实现
	//非常简单的摘要，就是把两个参数用,连起来
	//当然我们这里的hash函数还很不完善，因为它只能处理两个参数，
	//多了或者少了都不行，这个跟worker对象中的slow函数有关
  return args[0] + ',' + args[1];
}

worker.slow = cachingDecorator(worker.slow, hash);

alert( worker.slow(3, 5) ); // works
alert( "Again " + worker.slow(3, 5) ); // same (cached)