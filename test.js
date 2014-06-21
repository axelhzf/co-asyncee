var expect = require("chai").expect;
var co = require("co");
var Asyncee = require("./index");

describe("Asyncee", function () {
  var ee;
  var gen1;
  var gen2;
  var gen3;

  function wait (milis) {
    milis = milis || 1;
    return function (cb) {
      setTimeout(function () {
        cb();
      }, milis);
    }
  }

  beforeEach(function () {
    ee = new Asyncee();

    gen1 = function* gen1 (param) {
      yield wait(20);
      var result = param || "A";
      return result;
    };

    gen2 = function* gen2 () {
      yield wait(10);
      return "B";
    };

    gen3 = function* gen3 () {
      yield wait(1);
      return "C";
    }
  });

  it("should wait until all events end", function (done) {
    co(function* () {
      ee.on("event1", gen1)
        .on("event1", gen2)
        .on("event2", gen3);

      var result = yield ee.emit("event1");

      expect(result).to.eql(["A", "B"]);
    })(done);
  });

  it("should remove a listener", function (done) {
    co(function* () {
      ee.on("event1", gen1)
        .on("event1", gen2)
        .on("event2", gen3);
      ee.off("event1", gen2);

      var result = yield ee.emit("event1");

      expect(result).to.eql(["A"]);
    })(done);
  });

  it("should remove all listener", function (done) {
    co(function* () {
      ee.on("event1", gen1)
        .on("event1", gen2)
        .on("event2", gen3);
      ee.off("event1");

      var result = yield ee.emit("event1");

      expect(result).to.eql([]);
    })(done);
  });

  it("should call listeners in parallel", function (done) {
    co(function* () {
      ee.on("event1", gen1)
        .on("event1", gen2)
        .on("event1", gen3);

      ee.concurrency = 1;
      var result = yield ee.emit("event1");

      expect(result).to.eql(["A", "B", "C"]);
    })(done);
  });

  it("should call an event once", function (done) {
    co(function* () {
      ee.on("event1", gen1)
        .once("event1", gen2);

      var result = yield ee.emit("event1");
      expect(result).to.eql(["A", "B"]);

      var result = yield ee.emit("event1");
      expect(result).to.eql(["A"]);

    })(done);
  });

  it("should pass emit parameters to listeners", function (done) {
    co(function* () {
      ee.on("event1", gen1)
        .on("event1", gen2)
        .once("event2", gen1);

      var result = yield ee.emit("event1", "param1");
      expect(result).to.eql(["param1", "B"]);

      result = yield ee.emit("event2", "param2");
      expect(result).to.eql(["param2"]);

    })(done);
  });

});