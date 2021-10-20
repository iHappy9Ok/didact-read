## [Build your own React](https://pomb.us/build-your-own-react/)
<Br>
<Br>


babel对jsx的大致转换过程：

​	将标签中的代码替换成 `createElement`，并把标签名、参数和子节点作为参数传入。	 `React.createElement` 验证入参并生成了一个对象。

一个 JSX 元素就是一个带有 `type` 和 `props` 属性的对象

---

creatElement:

生成一个带有type和props的节点对象

---

render：

大致过程，根据element的type创建node节点（根fiber，并将其设置为第一个任务单元），遍历其props添加进node节点中，并且递归它的chidren。

将该element append在container上

---

并发模式：

render过程中的递归是会阻塞主线程的，需要让浏览器有控制权，让其判断是否有更高优先级的任务需要完成。

window.requestIdleCallback(),利用这个原生的方法可以将任务循环交由浏览器控制。（React用的则是scheduler）

nextUnitOfWork：即将执行的任务单元

performUnitWork:  执行每一个任务单元，返回下一个任务单元

```
function workLoop(deadline) {
  let shouldYield = false
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(
      nextUnitOfWork
    )
    shouldYield = deadline.timeRemaining() < 1
  }
  requestIdleCallback(workLoop)
}
requestIdleCallback(workLoop)
```

---

Fiber：

树形结构，组织所有的任务单元

<img src="/Users/jasonlin/workspace/react/didact-read/src/img/image-20211019142744957.png" alt="image-20211019142744957" />
<img src="/Users/jasonlin/workspace/react/didact-read/src/img/image-20211019143118286.png" alt="image-20211019142744957" />


```
consrt newFiber = {
type: element.type,
props: element.props,
parent: Fiber,    //指向parentfiber
child: Fiber，
dom: null  //指向创建的dom节点
alternate： Fiber  //上一个 commit 阶段使用的 fiber 节点）的引用
effectTag： string   //用于commit阶段，标识fiber需要进行的dom操作
}
```

每个fiber完成三件事(performUnitWork)：

1. 把 element 添加到 DOM 上
2. 为该 fiber 节点的子节点新建 fiber，包括建立fiber建的引用关系，目的是为了return
3. 挑出下一个任务单元（child => sibling => uncle）

---

fiber树完全构成，再去渲染dom：

判断nextUnitOfWork是否undefined，

commitRoot ，commitWork

---

diff：

比较render中新接收的element生成的fiber树和上次提交到dom的fiber树（currentRoot）

- 对于新旧节点类型是相同的情况，我们可以复用旧的 DOM，仅修改上面的属性
- 如果类型不同，意味着我们需要创建一个新的 DOM 节点
- 如果类型不同，并且旧节点存在的话，需要把旧节点的 DOM 给移除

*React使用 key 这个属性来优化 reconciliation 过程。比如, key 属性可以用来检测 elements 数组中的子组件是否仅仅是更换了位置。*

---

FC需要注意的地方：

- 函数组件的 fiber 没有 DOM 节点（不需要creatDom）
- 并且子节点由函数运行得来而不是直接从 `props`.children 属性中获取

所以需要在diff的时候判断fiber类型,确定是否要createDom

commitRoot的时候，FC fiber的child需要挂载到上一个具有dom的父节点上。删除的时候，需要找到下一个具有dom节点的fiber删除

-------

useState：

一个FC内可以存在多个hook，didact用数组来存储。

调用useState的时机是FCfiber获取child元素对象的时候，此时会初始化一些全局变量。

setState中收集action，然后更新fiber树，在下一轮runAction

<img src="/Users/jasonlin/workspace/react/didact-read/src/img/image-20211020144029967.png" alt="image-20211019142744957" />




​			



