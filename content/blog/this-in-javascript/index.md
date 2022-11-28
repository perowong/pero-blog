---
title: How "this" works in JavaScript
date: "2022-07-02"
description: "🤖 \"this\" is always a mystery in js..."
banner: "https://static2.overio.space/this-in-javascript.png"
---

## 1) What's `this`？

The key word `this` is a current module or current function's context, it automatically resolves to an object or scope depending on the context at which was defined.

Let's consider a similar scenario in word use in English, e.g `run`. Run is a single word that could mean many different things depending on the context.

* “I will run home” – means to move quickly on foot
* “She ran the 1500m” – means to run in a race
* “He is running for president” – means vying for an official position
* “The app is running” – means the software application is still open and active
* “Go for a run” – means running as a form of exercise

So, we could visit different context when we use different functions, which means we use different `this` to call the same function, it will return different result.

### 1.1) `this` context?

When used in a function, the this keyword simply points to an object to which it is bound. It answers the question of where it should get some value or data from:

```js
// A function with a "this" reference
function alert() { 
  console.log(this.name + ' is calling'); 
}
```

In the function above, the this keyword is referring to an object to which it is bound so it gets the "name" property from there.

But how do you know which object the function is bound to? How do you find out what this is referring to?

To do so, we need to take a detailed look at how functions are bound to objects.

Before we process to next part, we should tell `regular function` and `arrow function` apart, which has some difference when using `this`.

## 2) The Binding RULE of `this` in the `regular function`

There are generally four kinds of bindings:

* Default Binding
* Implicit Binding
* Explicit Binding
* Constructor Call Binding

**`FIRST PRINCIPLE`**: If it's a regular function, the `this` reference is up to the context **`when` the function was `CALLED`**.

### 2.1) Default Binding

* Non-strict mode: If a function is a standalone, unattached function, then the `this` reference the function housing resolves to the global scope (Browser is the `Window`, and NodeJS is the `Global`).
* Strict mode: The `this` reference is set to `undefined`, cause that the `this` is not allowed to resolve to global in the strict mode.

Let take a look at this:

```js
var name = 'pero';

var hello = {
  name: 'wong',
  foo: function () {
    // 'use strict'
    console.log(this.name);
  }
}

var bar = hello.foo;

bar(); // there
```

In the Non-strict mode, it will output pero. Because there is `window.bar()` actually, and it's `this` resolves to the global.

And in the strict mode, it will throw error like "TypeError: undefined is not an object (evaluating 'this.name')"


### 2.2) Implicit Binding

Another scenario to look out for is whether the function is attached to an object (its context) **at the call site.**

According to the binding rule in JavaScript, a function can use an object as its context only if that object is bound to it at the call site. This form of binding is known as `implicit binding`.

e.g. The sayHi is attached to the person object, when the sayHi function was called, `this` is implicitly bound to person. So the output is "Hello, wong".

```js
var name = 'pero';
var person = {
  name: 'wong',
  sayHi: sayHi
};

function sayHi() {
  console.log('Hello,', this.name); // Hello, wong
}

person.sayHi();
```

Let's look at another example:

```js
function alert() { 
  console.log(this.age + ' years old'); 
}

const myObj = {
  age: 22,
  alert: alert,
  nestedObj: {
    age: 26,
    alert: alert
  }
}

myObj.alert(); // `this` is bound to `myObj` -- 22 years old
myObj.nestedObj.alert(); // `this` is bound to `nestedObj` -- 26 years old
```

Here, because alert is ultimately being called from nestedObj, this is implicitly bound to nestedObj instead of myObj.

An easy way to figure out which object this is implicitly bound to is to look at which object is to the left of the dot (.)

> Let's consider another case:

```js
var name = 'pero';
var person = {
  name: 'wong',
  sayHi: sayHi
};

function sayHi() {
  console.log(this); // { name: 'wong', sayHi: Fn }
  setTimeout(function () {
    console.log('Hello,', this.name); // Hello, pero
  });
}

person.sayHi();
```

Q: why `this` refers to global?  
A: Do you remember the **`FIRST PRINCIPLE`**? The `this` reference is up to the context **`when` the function was CALLED.** So when the second console.log was execute, it's context is not in the person.sayHi, it's in the global.

### 2.3) Explicit Binding

If we want to force a function to use an object as its context without putting a property function reference on the object, how could we do?  

There are two utilities: `call`, `apply`

Along with a couple other set of utility functions, these two utilities are available to all functions in JavaScript via the [[Prototype]] mechanism.

```js
fun.call(this, arg1, arg2, ...)
fun.apply(this, [arg1, arg2, ...])
```

To explicitly bind a function call to a context, you simply have to invoke the call() on that function and pass in the context object as parameter. e.g.
```js
var person = {
  name: 'pero'
}

function changeWork(company, work) {
  this.company = company;
  this.work = work;
}

changeWork.call(person, 'Google', 'UE');
console.log(person.work); // UE

changeWork.apply(person, ['Amazon', 'SE']);
console.log(person.work); // SE
```

Tips: If we pass primitive types (number, string, boolean) when using call and apply, `this` will be convert to object.

```js
function getThisType() {
  console.log('this is ', this, typeof this);
}

getThisType.call(1); // this is Number {1} object
getThisType.apply('pero'); // this is String {'pero'} object
getThisType.call(true); // this is Boolean {true} object
```

### 2.4) Constructor Call Binding

When a function is invoked with the new keyword in front of it, otherwise known as a constructor call, the following things occur:

1. A brand new object is created (or constructed)
2. The newly constructed object's proto is [[Prototype]]-linked to the function that constructed it
3. The newly constructed object is set as the this binding for that function call
4. Execute the the constructor function
5. Return the newly constructed object

```js
function study(name) {
  this.name = name
}

const studyDay = new study('pero')
console.log(studyDay) // { name: 'pero' }
console.log(studyDay.name) // pero
```

## 3) The difference of `this` in the `arrow function`

The 2) we make sense the `this` reference of the regular function, and what the difference between regular function and arrow function?

Remember the first principle of the this reference of the regular function?

In the arrow function, the **`FIRST PRINCIPLE`** is known as: If it's a arrow function, the `this` reference is up to the context **`where` the function is `DEFINED`**.

We know that arrow function don't have itself  `this`, so the `this` reference is determined by where the arrow function.

Do you remember the oddly case aforementioned?

```js{9-11}
var name = 'pero';
var person = {
  name: 'wong',
  sayHi: sayHi
};

function sayHi() {
  console.log(this); // { name: 'wong', sayHi: Fn }
-  setTimeout(function () {
-    console.log('Hello,', this.name); // Hello, pero
-  });
+  setTimeout(() => {
+    console.log('Hello,', this.name); // Hello, wong
+  });
}

person.sayHi();
```

And what will happened if we change the regular function to arrow function in the setTimeout.

Yes, it will output "hello, wong".

---

If you have any question about this article, you can reach me on [Twitter](https://twitter.com/Perowong).  
Be sure to check out my [blog](https://i.overio.space) for more JavaScript and programming related content.
