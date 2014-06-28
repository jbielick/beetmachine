var CreateRecipes = function () {
  this.up = function (next) {
    var def = function (t) {
          t.column('name', 'string');
          t.column('bpm', 'number');
          t.column('duration', 'number');
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
    this.createTable('recipe', def, callback);
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
    this.dropTable('recipe', callback);
  };
};

exports.CreateRecipes = CreateRecipes;
