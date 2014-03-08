var assert = require('assert')
  , tests
  , Recipe = geddy.model.Recipe;

tests = {

  'after': function (next) {
    // cleanup DB
    Recipe.remove({}, function (err, data) {
      if (err) { throw err; }
      next();
    });
  }

, 'simple test if the model saves without a error': function (next) {
    var recipe = Recipe.create({});
    recipe.save(function (err, data) {
      assert.equal(err, null);
      next();
    });
  }

, 'test stub, replace with your own passing test': function () {
    assert.equal(true, false);
  }

};

module.exports = tests;
