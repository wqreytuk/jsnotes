//task 1

//要求实现一个spy装饰器，该装饰器能够保存方法每次调用时传入的参数


function work(a, b) {
  alert( a + b ); // work is an arbitrary function or method
}

work = spy(work);

work(1, 2); // 3
work(4, 5); // 9

for (let args of work.calls) {
  alert( 'call:' + args.join() ); // "call:1,2", "call:4,5"
}

function spy(func) {

  function wrapper(...args) {
    // using ...args instead of arguments to store "real" array in wrapper.calls
	//每次调用的时候，将参数数组push到call这个properties中
    wrapper.calls.push(args);
	//然后使用call forwarding将调用转发到原始的被装饰的函数
    return func.apply(this, args);
  }
	//为了保存参数，该方法需要一个properties，按照题目要求
	//该properties的名称为call，我们给他设置上，初始化为空数组
  wrapper.calls = [];

  return wrapper;
}


//task2
//该任务要求写出一个装饰器，该装饰器能够为一个function设置一个cd（cold down)时间
//也就是说该任务会在ms毫秒内被挂起，直到时间到达，调用function

//形象一点的说法，该装饰器就像一个秘书，电话一直在往里拨打，但是直到
//ms时间到了之后，秘书才会接起当前打入的电话，然后转给boss(function)


/*
上面我们提到的这个debounce，在实操中有一个非常实用的应用场景
用户每次输入的字符我们都发送给服务端，这样的话，发送请求的次数会过于频繁
如果我们可以使用debounce来对其进行装饰，那么我们就可以在用户停止输入
1000ms后再向服务端发送请求
*/
