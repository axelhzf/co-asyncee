# co-asyncee

EventEmitter using generators

```js
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

var result = eventEmitter.emit("event1"); //result = ["A", "B"];
```

By defaults all listeners run in parallel. The execution can be limited by using `concurrency` option.

```js
var eventEmitter = new Asyncee();
eventEmitter.concurrency = 1;
```