var assert = require('assert')
  , tests
  , Sound = geddy.model.Sound;

tests = {

  'after': function (next) {
    // cleanup DB
    Sound.remove({}, function (err, data) {
      if (err) { throw err; }
      next();
    });
  }

, 'simple test if the model saves without a error': function (next) {
    var sound = Sound.create({});
    sound.save(function (err, data) {
      assert.equal(err, null);
      next();
    });
  }

, 'test stub, replace with your own passing test': function () {
    assert.equal(true, false);
  }

};

module.exports = tests;
