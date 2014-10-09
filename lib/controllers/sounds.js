var mongoose = require('mongoose');
var Sound = mongoose.model('Sound');
var Group = mongoose.model('Group');
var async = require('async');
var multiparty = require('multiparty');
var Grid = require('gridfs-stream');
var gfs = Grid(Sound.db, require('mongodb'));
var ObjectID = require('mongodb').ObjectID;

exports.index = function (req, res) {
  var _this = this;
  if (req.params.group_id) {
    Group.findById(req.params.group_id, function(err, group) {
      if (err) throw err;
        group.getSounds(function(err, sounds) {
          res.json(sounds);
        });
    })
  } else {
    Sound.all(function(err, sounds) {
      if (err) throw err;
      res.json(sounds);
    });
  }
};

exports.create = function (req, res) {
  var self = this,
      form = new multiparty.Form();
  // var _this = this,
  //     sound = Sound.create(req.params);
  // sound.save(function(err, data) {
  //   if (err) throw err;
  //   res.send(data);
  // });

  form.on('part', function(part) {
    var writestream = gfs.createWriteStream({
      filename: part.filename
    });
    writestream.on('close', function (file) {
      console.log('writestream close');
      res.json(file);
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

exports.show = function (req, res) {
  var self = this,
      criteria = {_id: new ObjectID(req.params.id)};
  gfs.exist(criteria, function(err, found) {
    if (err) throw new Error(err);
    if (found) {
      gfs.files.find(criteria).toArray(function (err, files) {
        if (err) throw new Error(err);
        var meta = files[0];
        var readstream = gfs.createReadStream(criteria);
        res.set('Content-Disposition', 'inline; filename="'+meta.filename+'"');
        readstream.pipe(res);
      });
    } else {
      res.send(404);
    }
  });
};

exports.update = function (req, res) {
  var _this = this,
      i = 0,
      items = [];

  if (!req.params.id) {
    while (req.params[i]) {
      if (req.params.groupId) {
        req.params[i].groupId = req.params.groupId;
      }
      items.push(Sound.create(req.params[i]));
      i++;
    }
  } else {
    var sound;
    if (req.params.id) {
      Sound.findById(req.params.id, function(err, sound) {
        if (err) throw err;
        sound.updateProperties(req.params);
        sound.save(function(err, sound) {
          if (err) throw err;
          return res.json(sound);
        });
      });
    } else {
      sound = Sound.create(req.params);
    }
    items.push(sound);
  }

  async.map(items, function(item, callback) {
    item.save(callback);
  }, function(err, models) {
    if (err) throw new Error(err);
    if (req.params.id) {
      res.json(models[0]);
    } else {
      res.json(models);
    }
  });
};

exports.delete = function (req, res) {
  var self = this;

  Sound.findById(req.params.id, function(err, sound) {
    if (err) {
      throw err;
    }
    if (!sound) {
      res.send(400);
    }
    else {
      Sound.delete(req.params.id, function(err) {
        if (err) {
          throw err;
        }
        res.json(sound);
      });
    }
  });
};