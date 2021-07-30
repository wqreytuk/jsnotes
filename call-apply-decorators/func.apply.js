//https://javascript.info/call-apply-decorators


//func.apply(context, args)
//func.apply可以代替func.call

/*
func.call和func.apply的唯一区别就是他们的参数不同
前者是不定长参数
后者是一个array-like类型的参数，像数组但并不是真正的数组

func.call(context, ...args);
func.apply(context, args);

也就是说，func.apply只接受一个数组作为第二个参数，你不能像使用func.call一样
			func.call(context, 1,2,3)
		而是func.apply(context, [1,2,3])
		
实际操作中，func.apply用得更多一些，因为javascript引擎针对数组的优化也要更多一些
*/

//这里我们要引入一个名词，叫做call forwarding
//也就是上面的func.call和func.apply，就是把参数以及context（this）一起传递给另一个函数的操作
//下面这种写法是call forwarding最简单的形式
/****
let wrapper = function() {
  return func.apply(this, arguments);
};
****/

//下面让我们来改进一下之前的hash函数，使其能够将任意数量的参数连在一起
//因为arguments并不是一个真正的数组，因此我们不能使用arr.join函数
//这个操作叫做“方法借用”，因为我们借了arr.join，也就是[].join，然后我们使用
//func.call将arguments作为context
//因为arr.join的实现就是this[0]+','+this[1]+','...（以,作为默认的连接符）直到this.length到达长度
/****
function hash() {
  return( [].join.call(arguments) ); // 1,2
}
****/


//一般来讲，用装饰器装饰之后的函数替换之前的函数是安全的
//只有在一种情况下会出现问题，那就是原始函数拥有自己的properties
//装饰器只是包裹了原来的方法，但是他不会保存原来方法的properties
//我们可以通过https://javascript.info/proxy#proxy-apply来实现保存原始function的properties