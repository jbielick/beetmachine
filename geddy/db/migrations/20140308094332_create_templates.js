var CreateTemplates = function () {
  this.up = function (next) {
    var def = function (t) {
          t.column('name', 'string');
          t.column('src', 'string');
          t.column('pad', 'int');
          t.column('keyCode', 'int');
          t.column('userId', 'string');
          t.column('fx', 'object');
        }
      , callback = function (err, data) {
          if (err) {
            throw err;
          }
          else {
            next();
          }
        };
    this.createTable('template', def, callback);
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
    this.dropTable('template', callback);
  };
};

exports.CreateTemplates = CreateTemplates;
