//https://javascript.info/call-apply-decorators#throttle-decorator



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

let f = debounce(alert, 1000);

f("a");
setTimeout( () => f("b"), 200);
setTimeout( () => f("c"), 500);
// debounced function waits 1000ms after the last call and then runs: alert("c")


//设置cd时间，这个要怎么实现呢?
//每次被调用的时候就需要重置cd
//关键是怎么判断cd满没满
//感觉使用定时器没办法实现啊，因为在定时器时间到达之前，可能会有另一个调用过来
//而且是在cd时间内过来的，这时候cd就需要重置，上一个使用定时器设置的
//调用就变成错误的了
//clearTimtou可以解决这个问题，我们可以在有调用进来的时候将上一个定时器
//清除，这样就可以避免在错误的时间内被调用
function debounce(func, ms) {
  let wrapper = function(...args) {
      if(wrapper.timeout != null) 
        clearTimeout(wrapper.timeout);
      wrapper.timeout = setTimeout(() => (func.apply(this, args)), ms);
  }
  wrapper.timeout = null;
  return wrapper;
}



//少写了一个任务，上一个任务其实是任务3，任务2是延迟装饰器，很简单
//不在这里写了

//task4
//节流阀装饰器
//这个装饰器在实际中也是有实用价值的，比如说我们在鼠标移动动的时候需要更新dom
//我们在鼠标第一次移动的时候会立即更新dom来给用户反馈，然后当鼠标接着还在移动的时候
//我们就不会再更新dom了，直到鼠标停下来静止100ms之后，我们才会更新dom
//也就是说我们只处理鼠标最后的位置，一直更新dom的话对性能的浪费就太严重了


function f(a) {
  console.log(a);
}

// f1000 passes calls to f at maximum once per 1000 ms
let f1000 = throttle(f, 3000);

f1000(1); // shows 1
f1000(2); // (throttling, 1000ms not out yet)
f1000(3); // (throttling, 1000ms not out yet)

// when 1000 ms time out...
// ...outputs 3, intermediate value 2 was ignored
function throttle(func, ms) {
  let wrapper = function() {
    if(wrapper.first) {
      func.apply(this, arguments);
      wrapper.first = false;
    } else {
      if(wrapper.timeout != null)
        clearTimeout(wrapper.timeout);
        wrapper.timeout = setTimeout(function() {
          func.apply(this, arguments);
          wrapper.first = true
        }, ms);
    }
  }
  wrapper.first = true;
  wrapper.timeout = null;
  return wrapper;
}


//官方答案
//我对题目的理解有误，这一章真的很难懂
//题目的意思是，每ms间隔调用一次func，在此间隔期间，不管你调用了多少次func，都是没有响应的
//装饰器只会记录下来你调用func时传入的参数，然后在定时器时间到达之后，使用保存下来的参数去调用func
function throttle(func, ms) {

  //其实这个装饰器我有点没太看明白，他把变量声明在了装饰器中
  //但是返回的function却可以正常使用这些局部变量，就很迷，感觉跟其他高级语言的差别有点太大了
  
  let isThrottled = false,
      savedArgs,
      savedThis;
  
  function wrapper() {
      //在cd时间内，不接受任何调用，只是把参数保存下来
      if (isThrottled) { // (2)
        savedArgs = arguments;
        savedThis = this;
        return;
      }
      isThrottled = true;
  
      func.apply(this, arguments); // (1)
  
      setTimeout(function() {
      isThrottled = false; // (3)
      if (savedArgs) {
          //注意这里有一个坑，apply是进行了一个call forwarding
          //因此不要把这里理解成一个递归调用，apply是立即返回的，它不会阻塞
          //而且这段代码也不会在这里执行，他只是定时器第一个参数（function）中的一段代码
          //到定时器时间到了之后才会执行
          console.log(Date.now())
          wrapper.apply(savedThis, savedArgs);
          savedArgs = savedThis = null;
          console.log(Date.now())
      }
      }, ms);
  }
  
  ret