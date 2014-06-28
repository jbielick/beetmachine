var async = require('async');
var multiparty = require('multiparty');
var Grid = require('gridfs-stream');
var ObjectID = require('mongodb').ObjectID;

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
    var self = this,
        form = new multiparty.Form(),
        gfs = Grid(geddy.model.Sample.adapter.client._db, require('mongodb'));
    // var _this = this,
    //     sound = geddy.model.Sound.create(params);
    // sound.save(function(err, data) {
    //   if (err) throw err;
    //   _this.respond(data);
    // });

    form.on('part', function(part) {
      var writestream = gfs.createWriteStream({
        filename: part.filename
      });
      writestream.on('close', function (file) {
        self.respond(file, {format: 'json'});
      });
      part.pipe(writestream);
    });
    form.on('error', function(err) {
      // self.respond({error: err}, {format: 'json'});
    });
    form.on('close', function(err) {
      // self.respond({error: err}, {format: 'json'});
    });

    form.parse(req);
  };

  this.show = function (req, res, params) {
    var self = this,
        criteria = {_id: new ObjectID(params.id)},
        gfs = Grid(geddy.model.Sample.adapter.client._db, require('mongodb'));

    gfs.files.find(criteria).toArray(function (err, files) {
      if (err) throw new Error(err);
      if (files.length === 0) throw new geddy.errors.NotFoundError();
      self.respond(files[0], {format: 'json'});
    });
  };

  this.file = function(req, res, params) {
    var self = this,
        criteria = {_id: new ObjectID(params.id)},
        gfs = Grid(geddy.model.Sample.adapter.client._db, require('mongodb'));

    gfs.exist(criteria, function(err, found) {
      if (err) throw new Error(err);
      if (found) {
        gfs.files.find(criteria).toArray(function (err, files) {
          if (err) throw new Error(err);
          var meta = files[0];
          var readstream = gfs.createReadStream(criteria);
          res.resp.setHeader('Content-Disposition', 'inline; filename="' + meta.filename + '"');
          readstream.pipe(res.resp);
        });
      } else {
        throw new geddy.errors.NotFoundError();
      }
    });
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
    var self = this;

    geddy.model.Sound.first(params.id, function(err, sound) {
      if (err) {
        throw err;
      }
      if (!sound) {
        throw new geddy.errors.BadRequestError();
      }
      else {
        geddy.model.Sound.remove(params.id, function(err) {
          if (err) {
            throw err;
          }
          self.respondWith(sound);
        });
      }
    });
  };

};

exports.Sounds = Sounds;