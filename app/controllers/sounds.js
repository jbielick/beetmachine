var async = require('async');

var Sounds = function () {
  this.respondsWith = ['json'];

  this.index = function (req, resp, params) {
    var _this = this;
    if (params.group_id) {
      geddy.model.Group.first(params.group_id, function(err, group) {
        if (err) throw err;
          group.getSounds(function(err, sounds) {
            _this.respond(sounds);
          });
      })
    } else {
      geddy.model.Sound.all(function(err, sounds) {
        if (err) throw err;
        _this.respond(sounds);
      });
    }
  };

  this.create = function (req, resp, params) {
    var _this = this,
        sound = geddy.model.Sound.create(params);
    sound.save(function(err, data) {
      if (err) throw err;
      _this.respond(data);
    });
  };

  this.show = function (req, resp, params) {
    this.respond({params: params});
  };

  this.update = function (req, resp, params) {
    var _this = this,
        i = 0,
        items = [],
        modelName = geddy.inflection.singularize(this.name);

    if (typeof params[0] !== 'undefined') {
      while (params[i]) {
        if (params.group_id) {
          params[i].group_id = params.group_id;
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
      _this.respond(models);
    });
  };

  this.remove = function (req, resp, params) {
    this.respond({params: params});
  };

};

exports.Sounds = Sounds;

