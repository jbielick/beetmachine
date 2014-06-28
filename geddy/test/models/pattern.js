var assert = require('assert')
  , tests
  , Pattern = geddy.model.Pattern;

tests = {

  'after': function (next) {
    // cleanup DB
    Pattern.remove({}, function (err, data) {
      if (err) { throw err; }
      next();
    });
  }

, 'simple test if the model saves without a error': function (next) {
    var pattern = Pattern.create({});
    pattern.save(function (err, data) {
      assert.equal(err, null);
      next();
    });
  }

, 'test stub, replace with your own passing test': function () {
    assert.equal(true, false);
  }

};

module.exports = tests;
