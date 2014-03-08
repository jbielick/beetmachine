var CreatePatterns = function () {
  this.up = function (next) {
    var def = function (t) {
          t.column('name', 'string');
          t.column('groupId', 'string');
          t.column('positions', 'object');
          t.column('length', 'int');
          t.column('triggers', 'object');
        }
      , callback = function (err, data) {
          if (err) {
            throw err;
          }
          else {
            next();
          }
        };
    this.createTable('pattern', def, callback);
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
    this.dropTable('pattern', callback);
  };
};

exports.CreatePatterns = CreatePatterns;
