var async = require('async');

var Patterns = function () {
  this.respondsWith = ['json'];

  this.index = function (req, resp, params) {
    var _this = this;
    if (params.group_id) {
      geddy.model.Group.first(params.group_id, function(err, group) {
        if (err) throw err;
        if (!group) _this.respond({})
          group.getPatterns(function(err, patterns) {
            _this.respond(patterns);
          });
      })
    } else {
      geddy.model.Pattern.all(function(err, patterns) {
        if (err) throw err;
        _this.respond(patterns);
      });
    }
  };

  this.add = function (req, resp, params) {
    this.respond({params: params});
  };

  this.create = function (req, resp, params) {
    var _this = this,
        i = 0,
        patterns = [];

    if (typeof params[0] !== 'undefined') {
      while (params[i]) {
        if (params.group_id) {
          params[i].group_id = params.group_id;
        }
        patterns.push(geddy.model.Pattern.create(params[i]));
        i++;
      }
    } else {
      patterns.push(geddy.model.Pattern.create(params));
    }

    async.map(patterns, function(item, callback) {
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
    if (params.id) {
      geddy.model.Pattern.first({id: params.id}, function(err, pattern) {
        if (err) throw new Error("Server Error");
        if (!pattern) _this.respond(404);
        _this.respond(pattern);
      });
    } else {
      this.respond(404);
    }
  };

  this.edit = function (req, resp, params) {
    this.respond({params: params});
  };

  this.update = function (req, resp, params) {
    var _this = this;
    geddy.model.Pattern.first(params.id, function(err, pattern) {
      pattern.updateProperties(params);
      pattern.save(function(err, pattern) {
        _this.respond(pattern);
      });
    });
  };

  this.remove = function (req, resp, params) {
    this.respond({params: params});
  };

};

exports.Patterns = Patterns;

