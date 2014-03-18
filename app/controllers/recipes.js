var Recipes = function () {
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.index = function (req, resp, params) {
    this.respond({params: params});
  };

  this.add = function (req, resp, params) {
    this.respond({params: params});
  };

  this.create = function (req, resp, params) {
    // Save the resource, then display index page
    this.redirect({controller: this.name});
  };

  this.show = function (req, resp, params) {
    var async = require('async'); 

    Recipe.findOne(req.param('id')).done(function(err, recipe) {
      if (err) return res.json(err);
      Group.find({recipe_id: recipe.id}).done(function(err, groups) {
        if (err) return res.json(err);
        var queries = [];
        _.each(groups, function(group) {
          queries[group.id] = function(cb) {Pattern.find({group_id: group.id}).exec(cb)};
        });
        async.auto(queries, function(err, results) {
          _.each(groups, function(group) {
            group.patterns = results[group.id] || [];
            recipe.groups = groups;
            res.view('home/index', {recipe: recipe});
          });
        });
      });
    });
    this.respond({params: params});
  };

  this.edit = function (req, resp, params) {
    this.respond({params: params});
  };

  this.update = function (req, resp, params) {
    // Save the resource, then display the item page
    this.redirect({controller: this.name, id: params.id});
  };

  this.remove = function (req, resp, params) {
    this.respond({params: params});
  };

};

exports.Recipes = Recipes;

