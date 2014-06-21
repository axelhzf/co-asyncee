# co-asyncee

EventEmitter using generators

```js
var co = require("co");
var Asyncee = require("co-asyncee");
var eventEmitter = new Asyncee();

eventEmitter.on("event1", function* () {
    yield someThunk();
    return "A";
});
eventEmitter.once("event1", function* () {
    yield someThunk();
    return "B";
});

co(function *() {
    var result = yield eventEmitter.emit("event1");
    // result = ["A", "B"];
})();

```

`emit` send parameters to listeners

```js
var co = require("co");
var Asyncee = require("co-asyncee");
var eventEmitter = new Asyncee();

eventEmitter.on("event1", function* (arg1) {
    yield someThunk();
    return arg1;
});

co(function *() {
    var result = yield eventEmitter.emit("event1", "param1");
    // result = ["param1"];
})();
```

By defaults all listeners run in parallel. The execution can be limited by using `concurrency` option.

```js
var eventEmitter = new Asyncee();
eventEmitter.concurrency = 1;
```