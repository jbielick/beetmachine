var mongoose = require('mongoose');
var Recipe = mongoose.model('Recipe');
var async = require('async');

exports.index = function (req, resp, params) {
  var _this = this;
  Recipe.all({}, function(err, data) {
    if (err) throw err;
    res.json(data);
  });
};

exports.create = function (req, resp, params) {
  var _this = this,
      recipe = Recipe.create(params);
  recipe.save(function(err, data) {
    if (err) throw err;
    res.json(data);
  });
};

exports.show = function (req, resp, params) {

  // Recipe.findOne(req.param('id')).done(function(err, recipe) {
  //   if (err) return res.json(err);
  //   Group.find({recipe_id: recipe.id}).done(function(err, groups) {
  //     if (err) return res.json(err);
  //     var queries = [];
  //     _.each(groups, function(group) {
  //       queries[group.id] = function(cb) {Pattern.find({group_id: group.id}).exec(cb)};
  //     });
  //     async.auto(queries, function(err, results) {
  //       _.each(groups, function(group) {
  //         group.patterns = results[group.id] || [];
  //         recipe.groups = groups;
  //         res.view('home/index', {recipe: recipe});
  //       });
  //     });
  //   });
  // });
  // this.respond({params: params});
  var _this = this;
  Recipe.findById(params.id, function(err, recipe) {
    if (err) throw Error('An error occurred.');
    if (!recipe) res.status(404).send('Not Found');
    res.json(recipe);
  });
};

exports.update = function (req, resp, params) {
  var _this = this;
  Recipe.findById(params.id, function(err, recipe) {
    recipe.updateProperties(params);
    recipe.save(function(err, recipe) {
      res.json(recipe);
    });
  });
};

exports.delete = function (req, resp, params) {
  var _this = this;
  if (!params.id) {
    this.status(204);
  }
  Recipe.remove(params.id, function(err, data) {
    if (err) throw err;
    res.json(null, {statusCode: 200});
  });
};