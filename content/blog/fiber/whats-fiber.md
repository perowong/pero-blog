---
title: What's Fiber
date: "2022-02-04"
description: Fiber 具体是如何设计的，如何实现的
---

上一篇 [Why Fiber](https://perowong.space/fiber/why-fiber) 我们聊了 Fiber 解决了什么问题，以及解题的基本思路。我们继续看看，Fiber 具体是如何设计的。  
我们先看 Lin Clark 在 React Conf 上介绍什么是 Fiber 时说的一段话：

“Fiber is a plain object, that has a one to one relationship, manage the work for an instance. So it keeps the track of which instance is for using property state node, it also keeps the track of its relationships to other fibers in the tree.”  
看到这，大概知道，Fiber 其实是一个数据结构，需要记录节点和节点之间的关系。

我们回到 React 设计的元概念上：

```
ui = f(data)
```

即：渲染一个 React App，其本质上就是在调用一个函数，只不过这个函数还会调用其里面的其他函数，形成调用栈。  
通过 [Why Fiber](https://perowong.space/fiber/why-fiber) 我们了解到，JS 引擎自身的函数调用栈，我们无法控制，只能一条路走到黑。  
Fiber 要实现的就是能打断调用栈（call stack）及手动操纵栈帧（stack frame），进而能实现如下目标：

- pause work and come back to it later（暂停工作，并且能之后回到暂停的地方）
- assign priority to different types of work（安排不同类型工作的优先级）
- reuse previously completed work（之前已经处理完的工作单元，可以得到重用）
- abort work if it's no longer needed（如果后续的工作不再需要做，工作可以直接被终止）

### Structure of Fiber

我们先看 Fiber 的最最基础的原子形态。Fiber 被定义为一个数据结构，一个包含 component、input、output 等信息的 JavaScript object  
一个 Fiber 单元，既和 stack frame 相对应，也和组件的实例相对应  
我们具体看几个关键的字段（以下只是 Fiber 的一部分字段）

```js
{
  type,
  key,
  child,
  sibling,
  return,
  pendingProps,
  memoizedProps,
  pendingWorkPriority,
  alternate,
  output
}
```

##### `type` and `key`

type 跟 React Element 的 type 是相对应的，对于 composite component 来说，其类型为 function component 或者 class component  
对于 host components (div, span, etc.)，其类型就是对应名的字符串  
key 是给 reconciler 在协调过程中，决定该 fiber 是否要复用

##### `child`, `sibling` and `return`

这 3 个字段会指向其他 fiber，描述了组件递归树 fiber 之间的关系  
child 对应的是组件 render 函数 return 返回的值，看这个例子

```js
function Parent() {
  return <Child />
}
```

Parent 的 child，指向 Child 组件  
当组件 render 函数返回多个值的时候，这时候就需要 sibling 来描述 fiber 之间的关系，比如

```js
function Parent() {
  return [<Child1 />, <Child2 />]
}
```

对于 Parent 来说，其 child 指向 Child1 组件  
然后 Child1 的 sibling，指向 Child2 组件

在实际递归过程中，子节点运算完后，应该回到父节点。在 fiber 设计中，节点有一个 return 属性，指向父节点  
如果一个 fiber 节点，有多个子节点，那么其下面的所有子节点都会指向该 fiber 节点，比如对于上面这个例子来说，Child1 和 Child2 的 return 都指向 Parent

这样，所有 fiber 之间的关系，就可以通过 child, sibling, return 给描述出来了，构成一个 fiber node 的 linked list

我们再来看一个例子，有如下组件：
```js
function B1() {
  return [<C1 />, <C2 />]
}

function B2() {
  return [<B3 />, <C4 />, <C5 />]
}

function A1() {
  return [<B1 />, <B2 />]
}
```

其对应的 fiber 结构是这样的（具体如何递归遍历，稍后会分析）
![fiber-linked-node](./assets/fiber-linked-node.png)

##### `pendingProps` and `memoizedProps`

从 React 组件的定义上讲，props 都是函数的参数。对于 pendingProps，是在函数执行之前，即将要改变的 props  
而 memoizedProps 为上次执行后的 props  
特别的，如果 pendingProps 等于 memoizedProps，那么表明该 fiber 上一次的 output 输出可以被复用，而不用再次计算，从而阻止了不必要的运算工作

##### `pendingWorkPriority`



### Fiber 的工作原理

Still under construction...
