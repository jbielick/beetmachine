var async = require('async');
var mongoose = require('mongoose');
var Group = mongoose.model('Group');

exports.index = function (req, res) {
  var _this = this;
  if (req.params.recipe_id) {
    Recipe.findById(req.params.recipe_id, function(err, recipe) {
      if (err) throw err;
        recipe.getGroups(function(err, groups) {
          res.json(groups);
        });
    })
  } else {
    Group.all(function(err, groups) {
      if (err) throw err;
      res.json(groups);
    });
  }
};

exports.create = function (req, res) {
  var _this = this,
      i = 0,
      items = [];

  if (typeof req.params[0] !== 'undefined') {
    while (params[i]) {
      if (req.params.recipe_id) {
        req.params[i].recipe_id = req.params.recipe_id;
      }
      items.push(Group.create(req.params[i]));
      i++;
    }
  } else {
    items.push(Group.create(req.params));
  }

  async.map(items, function(item, callback) {
    item.save(callback);
  }, function(err, models) {
    if (models.constructor === Array && models.length === 1) {
      returnData = models[0];
    } else {
      returnData = models;
    }
    res.json(returnData);
  });
};

exports.show = function (req, res) {
  var _this = this;
  Group.findById(params.id, function(err, group) {
    if (err) throw Error('Could not find group');
    res.json(group);
  });
};

exports.update = function (req, res) {
  var _this = this,
      i = 0,
      items = [];

  if (typeof params[0] !== 'undefined') {
    while (params[i]) {
      if (req.params.group_id) {
        req.params[i].group_id = req.params.group_id;
      }
      items.push(Group.create(req.params[i]));
      i++;
    }
  } else {
    items.push(Group.create(req.params));
  }

  async.map(items, function(item, callback) {
    item.save(callback);
  }, function(err, models) {
    res.json(models);
  });
};

this.delete = function (req, res) {
  res.json(null);
};

