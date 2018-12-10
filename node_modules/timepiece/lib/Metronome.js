var inherits  = require('inherits');
var Timepiece = require('./Timepiece.js');

// Treat these like class-level constants. Do not change.
// I'm not sure of the best way to make constants work in ES5...
var SEC_PER_MIN = 60;   // seconds per minute
var MS_PER_SEC  = 1000; // milliseconds per second
var MS_PER_MIN  = SEC_PER_MIN * MS_PER_SEC; // milliseconds per minute

inherits(Metronome, Timepiece);

function Metronome(bpm) {
  Timepiece.call(this);

  if (typeof bpm == 'undefined') {
    // By default, `this.ms` is set in `Timepiece` constructor.
    this.bpm = Metronome.toBPM(this.ms);
  } else {
    this.set(bpm);
  }
}

/**
 * It's more intuitive to set a metronome by `bpm` rather than amount of time
 * needed for one beat (`ms`).
 * Set a new value for `ms` and `bpm`, based on the bpm.
 * Emit a 'set' event.
 * @param bpm, beats per minute
 */
Metronome.prototype.set = function(bpm) {
  this.bpm = bpm;
  this.ms  = Metronome.fromBPM(bpm);
  this.emit('set');
};

/**
 * Convert beats per minute to the number of milliseconds in one beat
 * @param bpm, the musical beats per minute. like a real metronome
 * @return, the duration of one beat, in milliseconds
 */
Metronome.fromBPM = function(bpm) {
  return MS_PER_MIN / bpm;
};

/**
 * Convert milliseconds to beats per minute
 * @param ms, how long it takes to complete one beat, in milliseconds
 * @return, the beats per minute, or `bpm`
 */
Metronome.toBPM = function(ms) {
  return MS_PER_MIN / ms;
};

module.exports = Metronome;
