//https://javascript.info/call-apply-decorators

function slow(x) {
  // there can be a heavy CPU-intensive job here
  //我们假设这里是一段非常吃CPU的代码
  console.log(`Called with ${x}`);
  return x;
}

//装饰函数，接受一个function类型的变量作为参数
function cachingDecorator(func) {
	//创建一个map
  let cache = new Map();

	//返回一个function，该function接受一个x作为参数
  return function(x) {
	  //如果map中存在这个键，那么就直接从map中取出对应的值
	  //然后返回
    if (cache.has(x)) {    // if there's such key in 
		console.log("return from cache");
      return cache.get(x); // read the result from it
    }
	//如果缓存中没有对应的值，就调用被装饰的函数本身来求值
    let result = func(x);  // otherwise call func
	//讲求得的值存入缓存
    cache.set(x, result);  // and cache (remember) the result
	//返回求得的值
    return result;
  };
}

//获得一个装饰后的函数
slow = cachingDecorator(slow);

console.log( slow(1) ); // slow(1) is cached and the result returned
console.log( "Again: " + slow(1) ); // slow(1) result returned from cache

console.log( slow(2) ); // slow(2) is cached and the result returned
console.log( "Again: " + slow(2) ); // slow(2) result returned from cache