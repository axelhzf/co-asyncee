# co-asyncee

EventEmitter using generators

```js
var Asyncee = require("co-asyncee");
var ee = new Asyncee();

ee.on("event1", function* () {
    yield someThunk();
    return "A";
});
ee.once("event1", function* () {
    yield someThunk();
    return "B";
});

var result = ee.emit("event1"); //result = ["A", "B"];
```

By defaults all listeners run in parallel. The execution can be limited by using `concurrency` option.

```js
var Asyncee = require("co-asyncee");
var ee = new Asyncee();
ee.concurrency = 1;
```