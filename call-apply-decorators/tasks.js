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