---
title: Why Fiber
date: "2022-01-29"
description: Fiber 解决了什么问题，是怎么解决的？
---

React发布v16时，对v15核心算法的reconciliation进行了重构，并命名为之React Fiber

那么为什么react团队要对架构进行重构？Fiber又是什么？我们从v15存在的瓶颈说起

### 1）Fiber要解决的问题是什么



#### 1.1）这些问题是怎么引起的

为什么会有这些问题

### 2）对应的解决方案是什么

### 3）What's Fiber

"Fiber is a plain object, that has a one to one relationship, manage the work for an instance. So it keeps the track of which instance is for using property state node, it also keeps the track of its relationships to other fibers in the tree."

Fiber是一种数据结构，是一个链表结构，用于跟踪

#### 3.1）Fiber是怎么设计的

#### 3.2）Fiber为什么要设计成链表树

