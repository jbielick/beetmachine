var assert = require('assert')
  , tests
  , Sample = geddy.model.Sample;

tests = {

  'after': function (next) {
    // cleanup DB
    Sample.remove({}, function (err, data) {
      if (err) { throw err; }
      next();
    });
  }

, 'simple test if the model saves without a error': function (next) {
    var sample = Sample.create({});
    sample.save(function (err, data) {
      assert.equal(err, null);
      next();
    });
  }

, 'test stub, replace with your own passing test': function () {
    assert.equal(true, false);
  }

};

module.exports = tests;
