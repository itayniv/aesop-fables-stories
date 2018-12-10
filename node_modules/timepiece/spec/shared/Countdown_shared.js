// shared stuff for Countdown

var assert = require('assert');

/**
 * Some shared examples for `#stop` and `#pause` methods.
 * `#pause` is an alias for `#stop`.
 * @param c, instance of the Countdown class
 * @param mtd, [String]. Name of the property on `c` which is the method to test
 */
module.exports.behaviorForStop = function(c, mtd) {
  context('when timer is already running', function() {
    before('setup: start the timer', function() {
      c.start();
    });
    it('stops the countdown', function() {
      c[mtd]();
      assert(!c.isActive());
    });
    it('remembers where it started from', function() {
      c[mtd]();
      assert.equal(c.from, 60);
    });
  });
};
