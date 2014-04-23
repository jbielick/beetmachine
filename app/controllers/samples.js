var Samples = function () {
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.index = function (req, resp, params) {
    var self = this;

    geddy.model.Sample.all(function(err, samples) {
      if (err) {
        throw err;
      }
      self.respondWith(samples, {type:'Sample'});
    });
  };

  this.add = function (req, resp, params) {
    this.respond({params: params});
  };

  this.create = function (req, resp, params) {
    var self = this
      , sample = geddy.model.Sample.create(params);

    if (!sample.isValid()) {
      this.respondWith(sample);
    }
    else {
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
      }
      else {
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
