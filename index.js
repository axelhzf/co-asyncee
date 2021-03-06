var parallel = require("co-parallel");
var co = require("co");

var slice = Array.prototype.slice;

module.exports = Asyncee;

function Asyncee (options) {
  options || (options = {});
  this._events = {};
  this.concurrency = options.concurrency;
}

function isGeneratorFunction (obj) {
  return obj && obj.constructor !== null && obj.constructor.name === "GeneratorFunction";
}

Asyncee.prototype.on = function (type, generator) {
  if (!isGeneratorFunction(generator)) {
    throw(new Error("Not a generator function"));
  }
  if (!this._events[type]) {
    this._events[type] = [];
  }

  this._events[type].push(generator);
  return this;
};

Asyncee.prototype.off = function (type, generator) {
  if (!this._events) {
    return;
  }

  if (!generator) {
    this._events[type] = [];
  } else {
    var fns = this._events[type];
    var i = fns.indexOf(generator);
    if (i < 0) {
      return this;
    }
    fns.splice(i, 1);
    return this;
  }
}

Asyncee.prototype.emit = function (type) {
  var self = this;
  var args = slice.call(arguments).slice(1);

  return function (cb) {
    var listeners = self._events[type];
    if (!listeners || listeners.length === 0) return cb(null, []);

    co(function* () {
      var fns = listeners.map(function (fn) {
        return fn.apply(null, args);
      });
      return yield parallel(fns, this.concurrency);
    })(cb);
  }
};

Asyncee.prototype.once = function (type, generator) {
  var self = this;
  var fn = function *() {
    var result = yield generator.apply(null, slice.call(arguments));
    self.off(type, fn);
    return result;
  };
  self.on(type, fn);
  return this;
};