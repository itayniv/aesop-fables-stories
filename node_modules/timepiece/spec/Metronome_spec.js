var assert = require('assert');

var Metronome = require('../').Metronome;

describe('Metronome', function() {

  describe('initial settings', function() {
    context('by default:', function() {
      var m = new Metronome();
      it('bpm is 60', function() {
        assert.equal(m.bpm, 60);
      });
      it('one beat is set to 1000 ms', function() {
        assert.equal(m.ms, 1000);
      });
      it('is not running', function() {
        assert(!m.isActive());
      });
    });
    context('customizing settings', function() {
      var m = new Metronome(100);
      it('sets bpm to 100 at initialization', function() {
        assert.equal(m.bpm, 100);
      });
      it('thereby, sets one beat to 600 ms', function() {
        assert.equal(m.ms, 600);
      });
      it('is not running', function() {
        assert(!m.isActive());
      });
    });
  });

  describe('.fromBPM', function() {
    context('when tempo is 30 bpm', function() {
      it('one beat is 2000 milliseconds', function() {
        assert.equal(Metronome.fromBPM(30), 2000);
      });
    });
    context('when tempo is 60 bpm', function() {
      it('one beat is 1000 milliseconds', function() {
        assert.equal(Metronome.fromBPM(60), 1000);
      });
    });
    context('when tempo is 120 bpm', function() {
      it('one beat is 500 milliseconds', function() {
        assert.equal(Metronome.fromBPM(120), 500);
      });
    });
  });

  describe('.toBPM', function() {
    context('when one beat is 2000 milliseconds', function() {
      it('returns tempo of 30 bpm', function() {
        assert.equal(Metronome.toBPM(2000), 30);
      });
    });
    context('when one beat is 1000 milliseconds', function() {
      it('returns tempo of 60 bpm', function() {
        assert.equal(Metronome.toBPM(1000), 60);
      });
    });
    context('when one beat is 500 milliseconds', function() {
      it('returns tempo of 120 bpm', function() {
        assert.equal(Metronome.toBPM(500), 120);
      });
    });
  });

  describe('changing the tempo', function() {

    context('states after a tempo change', function() {
      var m = new Metronome();

      // Metronome#set interprets the parameter as `bpm` instead of `ms`.

      beforeEach(function setNewBPM() {
        m.set(75);
      });

      afterEach(function resetBPM() {
        m.set(60);
      });

      it('bpm is 75', function() {
        assert.equal(m.bpm, 75);
      });
      it('one beat is set to 800 ms', function() {
        assert.equal(m.ms, 800);
      });
    });

    context('metronome states during tempo changes', function() {
      var m = new Metronome();
      // Artificially set time between assertions.
      // This is to emulate a simple scenario.
      // Typically, if you make Mocha wait longer than 2000 ms, it will give up.
      // But there are command-line options for Mocha to increase the limit.
      var msForTesting = 1000;

      before('set to 120 & start', function() {
        m.set(120);
        m.start();
      });

      context('starting at 120 bpm', function() {
        it('bpm is 120', function(done) {
          setTimeout(function() {
            assert.equal(m.bpm, 120);
            // Ensure that the timeout is respected by calling
            // `done` inside the callback to `setTimeout`.
            // Otherwise, the test suite will move on to evaluate the wrong
            // assertion under the wrong `it` block & provide false positives.
            done();
          }, msForTesting);
        });
        it('one beat is set to 500 ms', function(done) {
          setTimeout(function() {
            assert.equal(m.ms, 500);
            done();
          }, msForTesting);
        });
      });

      context('setting back to 60 bpm', function() {
        it('bpm is 60', function(done) {
          m.set(60);
          setTimeout(function() {
            assert.equal(m.bpm, 60);
            done();
          }, msForTesting);
        });
        it('one beat is set to 1000 ms', function(done) {
          m.set(60);
          setTimeout(function() {
            assert.equal(m.ms, 1000);
            done();
          }, msForTesting);
        });
      });

      context('stopping metronome', function() {
        it('deletes the ticker property from the metronome', function(done) {
          setTimeout(function() {
            m.stop();
            assert(!m.hasOwnProperty('ticker'));
            done();
          }, msForTesting);
        });
      });
    });

  });
});
