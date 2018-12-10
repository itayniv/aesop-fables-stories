var inherits  = require('inherits');
var Timepiece = require('./Timepiece.js');

inherits(Stopwatch, Timepiece);

/**
 * Treat this variable like a class-level constant.
 * It is the number of digits after the decimal point.
 * It should be greater than 0 && no greater than 2.
 * Don't expect accuracy to the millisecond.
 */
var PRECISION = 2;

function Stopwatch() {
  Timepiece.call(this);

  this.elapsed = 0;
  this.laps = [];

  this.on('start', function onStart() {
    if (!this.hasTimestamp()) {
      this.createTimestamp();
    }
  });
  this.on('stop', function onStop() {
    this.once('update', function overwriteTimestamp() {
      this.reset();
    });
    this.updateElapsed();
  });
  this.on('split', function onSplit() {
    this.addSplit();
    this.updateElapsed();
  });
}

Stopwatch.prototype.hasTimestamp = function() {
  return this.hasOwnProperty('timestamp');
};

Stopwatch.prototype.createTimestamp = function() {
  this.timestamp = new Date();
};

Stopwatch.prototype.updateElapsed = function() {
  var diff = getDiff(this.timestamp);
  this.elapsed = processTimestamp(diff);
  this.emit('update');
};

Stopwatch.prototype.reset = function() {
  delete this.timestamp;
  this.emit('reset');
};

Stopwatch.prototype.split = function() {
  this.emit('split');
};

Stopwatch.prototype.addSplit = function() {
  var diff = getDiff(this.timestamp);
  this.laps.push(processTimestamp(diff));
};

/**
 * - convert milliseconds to seconds
 * - convert to a string version of the number, specified to `PRECISION`
 *   digits after the decimal point.
 *   `PRECISION` is a variable local to this Stopwatch file.
 * - convert back to a floating point number
 * @param t, elapsed time in milliseconds
 * @return, elapsed time in seconds
 */
function processTimestamp(t) {
  return parseFloat((t / 1000).toPrecision(PRECISION));
}

/**
 * Calculate the time difference between right now and the passed in time
 * Both are assumed to be a count of milliseconds since Unix time epoch
 * @param timestamp, usually the timestamp of an object
 * @return, the amount of time between now and the timestamp, in milliseconds
 */
function getDiff(timestamp) {
  return new Date() - timestamp;
}

module.exports = Stopwatch;
