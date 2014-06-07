var Samples = function () {
  this.respondsWith = ['json'];

  this.index = function (req, resp, params) {
    var self = this;




    // var text = new Buffer('Hello World!');

    // this.grid.put(text, 'test', 'w', function(err){
    //     if(err) throw new Error(err);
    // });

    // this.grid.get('test', function(err,data){
    //   if (err) throw new Error(err);
    //   self.respond(data.toString(), {format: 'json'});
    // });

    geddy.model.Sample.all(function(err, samples) {
      if (err) {
        throw err;
      }
      self.respondWith(samples, {type:'Sample'});
    });
  };

  this.add = function (req, res, params) {
    this.respond({params: params});
  };

  this.create = function (req, res, params) {
    console.log('create');
    var self = this,
        sample = geddy.model.Sample.create(params);

    if (!sample.isValid()) {
      this.respondWith(sample);
    } else {
      sample.save(function(err, data) {
        if (err) {
          throw err;
        }
        self.respondWith(sample, {status: err});
      });
    }

  };

  this.show = function (req, resp, params) {
    var self = this;

    geddy.model.Sample.first(params.id, function(err, sample) {
      if (err) {
        throw err;
      }
      if (!sample) {
        throw new geddy.errors.NotFoundError();
      } else {
        self.respondWith(sample);
      }
    });
  };

  this.edit = function (req, resp, params) {
    var self = this;

    geddy.model.Sample.first(params.id, function(err, sample) {
      if (err) {
        throw err;
      }
      if (!sample) {
        throw new geddy.errors.BadRequestError();
      }
      else {
        self.respondWith(sample);
      }
    });
  };

  this.update = function (req, resp, params) {
    var self = this;

    geddy.model.Sample.first(params.id, function(err, sample) {
      if (err) {
        throw err;
      }
      sample.updateProperties(params);

      if (!sample.isValid()) {
        self.respondWith(sample);
      }
      else {
        sample.save(function(err, data) {
          if (err) {
            throw err;
          }
          self.respondWith(sample, {status: err});
        });
      }
    });
  };

  this.remove = function (req, resp, params) {
    var self = this;

    geddy.model.Sample.first(params.id, function(err, sample) {
      if (err) {
        throw err;
      }
      if (!sample) {
        throw new geddy.errors.BadRequestError();
      }
      else {
        geddy.model.Sample.remove(params.id, function(err) {
          if (err) {
            throw err;
          }
          self.respondWith(sample);
        });
      }
    });
  };

};

exports.Samples = Samples;
