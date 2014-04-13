var async = require('async');

var Recipes = function () {
  this.respondsWith = ['json'];

  this.index = function (req, resp, params) {
    var _this = this;
    geddy.model.Recipe.all({}, function(err, data) {
      if (err) throw err;
      _this.respond(data);
    });
  };

  // this.add = function (req, resp, params) {
  //   this.respond({params: params});
  // };

  this.create = function (req, resp, params) {
    var _this = this,
        recipe = geddy.model.Recipe.create(params);
    recipe.save(function(err, data) {
      if (err) throw err;
      _this.respond(data);
    });
  };

  this.show = function (req, resp, params) {

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
    geddy.model.Recipe.first(params.id, function(err, recipe) {
      if (err) throw Error('An error occurred.');
      if (!recipe) throw geddy.errors.NotFoundError();
      _this.respond(recipe);
    });
  };

  this.edit = function (req, resp, params) {
    this.respond({params: params});
  };

  this.update = function (req, resp, params) {
    var _this = this;
    geddy.model.Recipe.first(params.id, function(err, recipe) {
      recipe.updateProperties(params);
      recipe.save(function(err, recipe) {
        _this.respond(recipe);
      });
    });
  };

  this.remove = function (req, resp, params) {
    var _this = this;
    if (!params.id) {
      this.output(204);
    }
    geddy.model.Recipe.remove(params.id, function(err, data) {
      if (err) throw err;
      _this.respond(null, {statusCode: 200});
    });
  };

};

exports.Recipes = Recipes;

