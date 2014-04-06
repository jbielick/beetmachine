(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['jquery', 'underscore', 'backbone', 'deepmodel', 'ligaments', 'module', 'routes/app', 'views/pads', 'views/display', 'views/transport', 'views/sequence', 'views/pattern', 'models/recipe'], function($, _, Backbone, deepmodel, ligaments, module, Router, Pads, Display, Transport, Sequence, Pattern, RecipeModel) {
    var AppView, DEFAULT_KEYS;
    DEFAULT_KEYS = '6789yuiohjklnm,.'.split('');
    AppView = (function(_super) {
      __extends(AppView, _super);

      function AppView() {
        return AppView.__super__.constructor.apply(this, arguments);
      }

      AppView.prototype.el = 'body';

      AppView.prototype.initialize = function() {
        var i, key, _i, _len;
        this.recipe = new RecipeModel;
        this.router = new Router({
          app: this
        });
        (this.display = new Display({
          app: this
        })).log('Ready');
        this.transport = new Transport({
          app: this
        });
        this.pads = new Pads({
          app: this
        });
        this.sequence = new Sequence({
          app: this
        });
        this.UI = new Backbone.DeepModel.extend();
        this.ligament = new Backbone.Ligaments({
          model: this.UI,
          view: this
        });
        this.keyMap = {};
        for (i = _i = 0, _len = DEFAULT_KEYS.length; _i < _len; i = ++_i) {
          key = DEFAULT_KEYS[i];
          this.keyMap[key.charCodeAt(0)] = i;
        }
        if (!_.isEmpty(module.config().recipe)) {
          return this.open(module.config().recipe, {
            parse: true
          });
        }
      };

      AppView.prototype.events = {
        'click [data-behavior]': 'delegateBehavior',
        'keypress': 'keyPressDelegate',
        'keydown': 'keyDownDelegate',
        'keyup': 'keyUpDelegate'
      };

      AppView.prototype.delegateBehavior = function(e) {
        var behavior;
        behavior = $(e.currentTarget).data('behavior');
        if ((behavior != null) && _.isFunction(this[behavior])) {
          return this[behavior](e);
        }
      };

      AppView.prototype.selectGroup = function(e) {
        var $target;
        $target = $(e.currentTarget);
        return this.pads.render($target.data('meta'));
      };

      AppView.prototype.open = function(recipe) {
        this.recipe = recipe;
        if (recipe.groups.length > 0) {
          this.pads.groups.reset(recipe.groups);
        }
        if (recipe.keyMap) {
          return this.keyMap = _.extend(this.keyMap, recipe.keyMap);
        }
      };

      AppView.prototype.save = function(e) {
        var _this;
        _this = this;
        console.log(this.recipe.toJSON());
        return this.recipe.save({}, {
          success: function(recipe) {
            return _this.pads.groups.each(function(group) {
              return group.save({
                recipe_id: recipe.id
              }, {
                success: function(groupSaved) {
                  group.patterns.each(function(pattern) {
                    return pattern.save({
                      group_id: groupSaved.id
                    });
                  });
                  return group.sounds.each(function(sound) {
                    return sound.save({
                      group_id: groupSaved.id
                    });
                  });
                }
              });
            });
          }
        });
      };

      AppView.prototype.keyDownDelegate = function(e) {
        var key, prevent;
        key = String.fromCharCode(e.keyCode);
        if (key === 'R' && e.ctrlKey) {
          this.transport.record();
          prevent = true;
        } else if (key === ' ') {
          this.transport.play();
          prevent = true;
        } else if (_.indexOf([1, '1', '2', '3', '4', '5', '6', '7', '8'], key) > 0 && e.ctrlKey) {
          prevent = true;
          this.pads.render(key);
        }
        if (prevent) {
          return e.preventDefault();
        }
      };

      AppView.prototype.keyPressDelegate = function(e) {
        var pad, _ref;
        if (this.keyMap[e.charCode] != null) {
          this.pressing = e.charCode;
          return pad = (_ref = this.pads.currentPads[this.keyMap[e.charCode]]) != null ? _ref.trigger('press') : void 0;
        }
      };

      AppView.prototype.keyUpDelegate = function(e) {
        var pad, _ref;
        if (e.charCode === this.pressing) {
          return pad = (_ref = this.pads.currentPads[this.keyMap[e.charCode]]) != null ? _ref.trigger('release') : void 0;
        }
      };

      return AppView;

    })(Backbone.View);
    return new AppView();
  });

}).call(this);
