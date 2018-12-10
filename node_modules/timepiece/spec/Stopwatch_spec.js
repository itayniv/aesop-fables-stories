var assert = require('assert');

var Stopwatch = require('../').Stopwatch;

describe('Stopwatch', function() {
  describe('initial settings', function() {
    var s = new Stopwatch();
    it('starts at 0', function() {
      assert.equal(s.elapsed, 0);
    });
    it('is not running', function() {
      assert(!s.isActive());
    });
    it('emits a tick event every 1 second', function() {
      assert.equal(s.ms, 1000);
    });
  });

  describe('#start', function() {
    var s = new Stopwatch();
    context('checking conditions before calling "#start"', function() {
      it('is not active', function() {
        assert(!s.isActive());
      });
      it('does not have a timestamp', function() {
        assert(!s.hasOwnProperty('timestamp'));
      });
      it('has 0 elapsed time', function() {
        assert.equal(s.elapsed, 0);
      });
    });
    context('after calling "#start"', function() {
      var started = false;
      s.on('start', function hasStarted() {
        started = true;
      });
      before('start timer', function() {
        s.start();
      });
      it('emits the start event', function() {
        assert(started);
      });
      it('is active', function() {
        assert(s.isActive());
      });
      it('does have a timestamp', function() {
        assert(s.hasOwnProperty('timestamp'));
      });
      it('has some elapsed time', function() {
        s.updateElapsed();
        assert(s.elapsed > 0);
      });
    });
  });

  describe('#stop', function() {
    var s = new Stopwatch();
    before('start timer', function() {
      s.start();
    });
    context('checking conditions before calling "#stop"', function() {
      it('is active', function() {
        assert(s.isActive());
      });
      it('does have a timestamp', function() {
        assert(s.hasOwnProperty('timestamp'));
      });
      it('has some elapsed time', function(done) {
        setTimeout(function waitMoment() {
          s.updateElapsed();
          assert(s.elapsed > 0);
          done();
        }, 500);
      });
    });
    context('after calling "#stop"', function() {
      var stopped = false;
      s.on('stop', function hasStopped() {
        stopped = true;
      });
      before('stop the timer', function() {
        s.stop();
      });
      it('emits the stop event', function() {
        assert(stopped);
      });
      it('is not active', function() {
        assert(!s.isActive());
      });
      it('does not have a timestamp', function() {
        assert(!s.hasOwnProperty('timestamp'));
      });
      it('has 0.5 seconds elapsed time', function() {
        assert.equal(s.elapsed, 0.5);
      });
    });
  });

  describe('scenario: simply start & check elapsed', function() {
    var s = new Stopwatch();
    var testInterval = 1800;
    before('start timer', function() {
      s.start();
    });
    it('has started', function() {
      assert(s.isActive());
    });
    it('has 1.8 seconds', function(done) {
      setTimeout(function checkAfterInterval() {
        s.updateElapsed();
        assert.equal(s.elapsed, 1.8);
        done();
      }, testInterval);
    });
    it('has 3.6 seconds', function(done) {
      setTimeout(function checkAfterInterval() {
        s.updateElapsed();
        assert.equal(s.elapsed, 3.6);
        done();
      }, testInterval);
    });
    it('has 5.4 seconds', function(done) {
      setTimeout(function checkAfterInterval() {
        s.updateElapsed();
        assert.equal(s.elapsed, 5.4);
        done();
      }, testInterval);
    });
    it('stops', function() {
      s.stop();
      assert(!s.isActive());
    });
  });

  describe('scenario: splits and laps', function() {
    var s = new Stopwatch();
    var testInterval = 1000;
    context('splitting 1 second after starting', function() {
      before('start timer', function() {
        s.start();
      });
      it('splits after 1 second', function(done) {
        setTimeout(function splitAtInterval() {
          s.split();
          assert(s.isActive());
          done();
        }, testInterval);
      });
      it('has 1.00 seconds as elapsed time', function() {
        assert.strictEqual(s.elapsed, 1.00);
      });
      it('has this split time', function() {
        assert.deepEqual(s.laps, [1.00]);
      });
    });

    context('run for 1.00 second and split again', function() {
      it('splits after 1.0 second', function(done) {
        setTimeout(function splitAtInterval() {
          s.split();
          assert(s.isActive());
          done();
        }, testInterval);
      });
      it('now has 2.00 seconds as elapsed time', function() {
        assert.strictEqual(s.elapsed, 2.00);
      });
      it('has these split times', function() {
        assert.deepEqual(s.laps, [1.00, 2.00]);
      });
    });
  });

  describe('scenario: starting, stopping & resetting', function() {
    var s = new Stopwatch();
    var testInterval = 1500;

    context('stopping 1.5 seconds after starting', function() {
      before('start timer', function() {
        s.start();
      });
      it('stops after 1.5 seconds', function(done) {
        setTimeout(function stopAtInterval() {
          s.stop();
          assert(!s.isActive());
          done();
        }, testInterval);
      });
      it('has 1.50 seconds as elapsed time', function() {
        assert.strictEqual(s.elapsed, 1.50);
      });
    });

    context('reset: run for 1.50 seconds and stop', function() {
      // wait before starting again
      it('stops for 0.5 seconds', function(done) {
        setTimeout(function wait() {
          assert(!s.isActive());
          done();
        }, 500);
      });
      it('starts afterwards', function() {
        s.start();
        assert(s.isActive());
      });
      it('stops after another 1.5 seconds', function(done) {
        setTimeout(function stopAtInterval() {
          s.stop();
          assert(!s.isActive());
          done();
        }, testInterval);
      });
      it('has 1.50 seconds as elapsed time', function() {
        // evidence the stopwatch resets its 'elapsed' time property
        // on call to '#stop'
        assert.strictEqual(s.elapsed, 1.50);
      });
    });
  });
});
