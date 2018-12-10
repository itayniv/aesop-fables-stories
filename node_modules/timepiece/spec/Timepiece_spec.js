var assert = require('assert');

var Timepiece = require('../').Timepiece;

describe('Timepiece', function() {

  describe('inheriting prototype methods from EventEmitter', function() {
    var t = new Timepiece();
    var EventEmitter = require('events').EventEmitter;

    describe('constructors', function() {
      it('constructor of the child object is Timepiece', function() {
        assert.equal(t.constructor, Timepiece);
      });

      it('super-constructor of Timepiece is the EventEmitter', function() {
        assert.equal(t.constructor.super_, EventEmitter);
      });
    });

    describe('prototypes', function() {

      it('prototype of a Timepiece object is the prototype of Timepiece', function() {
        assert.equal(Object.getPrototypeOf(t), Timepiece.prototype);
      });

      it('prototype of the prototype of a Timepiece object is the prototype of EventEmitter', function() {
        assert.equal(
          Object.getPrototypeOf(Object.getPrototypeOf(t)),
          EventEmitter.prototype
        );
      });

    });
  });

  describe('#isActive', function() {
    it('returns true if the ticker is running', function() {
      var t = new Timepiece();
      t.start();
      assert(t.isActive());
    });
    it('returns false if the ticker is not running', function() {
      var t = new Timepiece();
      assert(!t.isActive());
    });
  });

  describe('#start', function() {

    it('emits a "start" event', function() {
      var t = new Timepiece();

      var started = false;
      t.once('start', function() {
        started = true;
      });

      t.start();
      assert(started);
      t.stop();
    });
    context('when timer is not running', function() {
      var t = new Timepiece();

      var started = false;
      t.once('start', function() {
        started = true;
      });

      it('starts the timer', function() {
        t.start();
        assert(t.isActive());
        t.stop();
      });
    });
  });

  describe('#stop', function() {

    it('emits a "stop" event', function() {
      var t = new Timepiece();
      var fired = false;
      t.once('stop', function() {
        fired = true;
      });
      t.stop();
      assert(fired);
    });

    context('when timer is already running', function() {
      var t = new Timepiece();

      before('setup: start the timer', function() {
        t.start();
      });
      it('stops the timer', function() {
        t.stop();
        assert(!t.isActive());
      });
    });
  });

  describe('#set', function() {

    context('whether or not the timer is running', function() {
      var t = new Timepiece();

      var wasSet = false;
      t.once('set', function() {
        wasSet = true;
      });

      before('set a new value for ms', function() {
        t.set(1234);
      });

      it('emits a "set" event', function() {
        assert(wasSet);
      });
      it('sets a new value of the "ms" property', function() {
        assert.equal(t.ms, 1234);
      });
    });
    context('if timer is already running', function() {
      var t = new Timepiece();
      var timesStarted = 0;
      var timesStopped = 0;

      t.on('start', function() {
        timesStarted++;
      });
      t.on('stop', function() {
        timesStopped++;
      });

      before('start me up!', function() {
        t.start();
      });
      after('hammer time!', function() {
        t.stop();
      });

      it('setup: confirm the timer is running', function() {
        assert(t.isActive());
      });
      it('emits a "start" event', function() {
        t.set(800);
        // this is set to 2 b/c of `#set` on previous line and `#start` in
        // the `before` block
        assert.equal(timesStarted, 2);
      });
      it('emits a "stop" event', function() {
        assert.equal(timesStopped, 1);
      });
    });
  });

});
