var assert = require('assert')
  , tests
  , Template = geddy.model.Template;

tests = {

  'after': function (next) {
    // cleanup DB
    Template.remove({}, function (err, data) {
      if (err) { throw err; }
      next();
    });
  }

, 'simple test if the model saves without a error': function (next) {
    var template = Template.create({});
    template.save(function (err, data) {
      assert.equal(err, null);
      next();
    });
  }

, 'test stub, replace with your own passing test': function () {
    assert.equal(true, false);
  }

};

module.exports = tests;
