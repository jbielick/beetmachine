var async = require('async');


var Groups = function () {
  this.respondsWith = ['json'];

  this.index = function (req, resp, params) {
    var _this = this;
    if (params.recipe_id) {
      geddy.model.Recipe.first(params.recipe_id, function(err, recipe) {
        if (err) throw err;
          recipe.getGroups(function(err, groups) {
            _this.respond(groups);
          });
      })
    } else {
      geddy.model.Group.all(function(err, groups) {
        if (err) throw err;
        _this.respond(groups);
      });
    }
  };

  this.create = function (req, resp, params) {
    var _this = this,
        i = 0,
        items = [],
        modelName = geddy.inflection.singularize(this.name);

    if (typeof params[0] !== 'undefined') {
      while (params[i]) {
        if (params.recipe_id) {
          params[i].recipe_id = params.recipe_id;
        }
        items.push(geddy.model[modelName].create(params[i]));
        i++;
      }
    } else {
      items.push(geddy.model[modelName].create(params));
    }

    async.map(items, function(item, callback) {
      item.save(callback);
    }, function(err, models) {
      if (models.constructor === Array && models.length === 1) {
        returnData = models[0];
      } else {
        returnData = models;
      }
      _this.respond(returnData);
    });
  };

  this.show = function (req, resp, params) {
    var _this = this;
    geddy.model.Group.first(params.id, function(err, group) {
      if (err) throw Error('Could not find group');
      _this.respond(group);
    });
  };

  this.update = function (req, resp, params) {
    // Save the resource, then display the item page
    this.redirect({controller: this.name, id: params.id});
  };

  this.remove = function (req, resp, params) {
    this.respond({params: params});
  };

};

exports.Groups = Groups;

