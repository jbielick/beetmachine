(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['jquery', 'underscore', 'backbone', 'module', 'routes/app', 'views/pads', 'views/display', 'views/transport', 'views/sequence', 'views/pattern', 'models/recipe'], function($, _, Backbone, module, Router, Pads, Display, Transport, Sequence, Pattern, RecipeModel) {
    var AppView;
    AppView = (function(_super) {
      __extends(AppView, _super);

      function AppView() {
        return AppView.__super__.constructor.apply(this, arguments);
      }

      AppView.prototype.el = 'body';

      AppView.prototype.initialize = function() {
        var defaultKeys;
        this.router = new Router({
          app: this
        });
        this.display = new Display({
          parent: this
        });
        this.transport = new Transport({
          parent: this
        });
        this.pads = new Pads({
          parent: this
        });
        this.sequence = new Sequence({
          parent: this
        });
        this.recipe = new RecipeModel;
        this.keyMap = {};
        defaultKeys = '6789yuiohjklnm,.';
        _.each(defaultKeys, (function(_this) {
          return function(key, i) {
            return _this.keyMap[key.charCodeAt(0)] = i;
          };
        })(this));
        this.display.log('Ready');
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
        this.recipe.set('groups', this.pads.groups.toJSON());
        return console.log(this.recipe.toJSON());
      };

      AppView.prototype.keyDownDelegate = function(e) {
        var key, prevent;
        key = String.fromCharCode(e.keyCode);
        if (key === 'R' && e.ctrlKey) {
          this.transport.record();
          return prevent = true;
        } else if (key === ' ') {
          this.transport.play();
          return prevent = true;
        } else if (_.indexOf([1, '1', '2', '3', '4', '5', '6', '7', '8'], key) > 0 && e.ctrlKey) {
          prevent = true;
          this.pads.render(key);
          if (prevent) {
            return e.preventDefault();
          }
        }
      };

      AppView.prototype.keyPressDelegate = function(e) {
        var pad;
        if (this.keyMap[e.charCode] != null) {
          this.pressing = e.charCode;
          pad = this.pads.currentPads[this.keyMap[e.charCode]];
          if (pad) {
            return pad.trigger('press');
          }
        }
      };

      AppView.prototype.keyUpDelegate = function(e) {
        var pad;
        if (e.charCode = this.pressing) {
          pad = this.pads.currentPads[this.keyMap[e.charCode]];
          if (pad) {
            return pad.trigger('release');
          }
        }
      };

      return AppView;

    })(Backbone.View);
    return new AppView();
  });

}).call(this);
