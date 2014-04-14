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

    if (!params.id) {
      while (params[i]) {
        if (params.groupId) {
          params[i].groupId = params.groupId;
        }
        items.push(geddy.model[modelName].create(params[i]));
        i++;
      }
    } else {
      var sound;
      if (params.id) {
        geddy.model.Sound.first({id: params.id}, function(err, sound) {
          if (err) throw err;
          sound.updateProperties(params);
          sound.save(function(err, sound) {
            if (err) throw err;
            return _this.respond(sound)
          });
        });
      } else {
        sound = geddy.model[modelName].create(params);
      }
      items.push(sound);
    }

    async.map(items, function(item, callback) {
      item.save(callback);
    }, function(err, models) {
      if (err) throw new Error(err)
      if (params.id) {
        _this.respond(models[0]);
      } else {
        _this.respond(models);
      }
    });
  };

  this.remove = function (req, resp, params) {
    this.respond({params: params});
  };

};

exports.Sounds = Sounds;

