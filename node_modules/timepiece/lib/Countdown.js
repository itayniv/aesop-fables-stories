var inherits  = require('inherits');
var Timepiece = require('./Timepiece.js');

inherits(Countdown, Timepiece);

function Countdown(from) {
  Timepiece.call(this);

  // number of seconds to count down from. Is set to 60 seconds by default.
  // values are coerced into integers.
  this.from = (typeof from == 'undefined' ? 60 : coerceInteger(from));
  this.remaining = this.from;

  this.on('tick', function decrement() {
    --this.remaining;
    this.isFinished();
  });
}

/**
 * Stop timer & emit 'finish' event, if `remaining` is <= 0
 * Otherwise, do nothing.
 */
Countdown.prototype.isFinished = function() {
  if (this.remaining <= 0) {
    this.stop();
    this.emit('finish');
  }
};

/**
 * If the timer is already running, do nothing.
 * Otherwise, reset 'from' to the value you pass in.
 * But do not start the timer.
 */
Countdown.prototype.set = function(from) {
  if (!this.isActive()) {
    this.from = coerceInteger(from);
    this.remaining = this.from;
  }
  // TODO: emit an event if you try to set an already-running timer?
};

/**
 * Whether or not the timer is running this method:
 * - stops the timer
 * - resets 'remaining' to its original value, 'from'
 * - does NOT start the countdown again.
 */
Countdown.prototype.reset = function() {
  // clean up after itself, by using the `once` method instead of `on`
  this.once('stop', function setFromOnceStopped() {
    this.remaining = this.from;
  });
  this.stop();
};

// alias for `#start`
Countdown.prototype.resume = function() {
  this.start();
};

// alias for `#stop`
Countdown.prototype.pause = function() {
  this.stop();
};

function coerceInteger(val) {
  return parseInt(val, 10);
}

module.exports = Countdown;
