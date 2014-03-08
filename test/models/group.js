var assert = require('assert')
  , tests
  , Group = geddy.model.Group;

tests = {

  'after': function (next) {
    // cleanup DB
    Group.remove({}, function (err, data) {
      if (err) { throw err; }
      next();
    });
  }

, 'simple test if the model saves without a error': function (next) {
    var group = Group.create({});
    group.save(function (err, data) {
      assert.equal(err, null);
      next();
    });
  }

, 'test stub, replace with your own passing test': function () {
    assert.equal(true, false);
  }

};

module.exports = tests;
