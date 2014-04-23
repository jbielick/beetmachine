var CreateSamples = function () {
  this.up = function (next) {
    var def = function (t) {
          t.column('soundId', 'string');
          t.column('in', 'number');
          t.column('out', 'number');
        }
      , callback = function (err, data) {
          if (err) {
            throw err;
          }
          else {
            next();
          }
        };
    this.createTable('sample', def, callback);
  };

  this.down = function (next) {
    var callback = function (err, data) {
          if (err) {
            throw err;
          }
          else {
            next();
          }
        };
    this.dropTable('sample', callback);
  };
};

exports.CreateSamples = CreateSamples;
