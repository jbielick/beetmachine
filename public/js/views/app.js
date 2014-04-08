(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['jquery', 'underscore', 'backbone', 'deepmodel', 'ligaments', 'module', 'async', 'routes/app', 'views/pads', 'views/display', 'views/transport', 'views/sequence', 'views/pattern', 'models/recipe'], function($, _, Backbone, deepmodel, ligaments, module, async, Router, Pads, Display, Transport, Sequence, Pattern, RecipeModel) {
    var APP_EL_SELECTOR, AppView, DEFAULT_KEYS, PLAYPAUSE_CHAR, RECORD_CHAR;
    DEFAULT_KEYS = '6789yuiohjklnm,.'.split('');
    RECORD_CHAR = 'R';
    PLAYPAUSE_CHAR = ' ';
    APP_EL_SELECTOR = 'body';
    AppView = (function(_super) {
      __extends(AppView, _super);

      function AppView() {
        return AppView.__super__.constructor.apply(this, arguments);
      }

      AppView.prototype.el = APP_EL_SELECTOR;

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
        this.UIModel = new (Backbone.DeepModel.extend());
        this.ligament = new Backbone.Ligaments({
          model: this.UIModel,
          view: this,
          bindings: {
            'pattern.zoom': {
              cast: [parseFloat, 10]
            }
          }
        });
        this.keyMap = {};
        this.listenForUIEvents();
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

      AppView.prototype.listenForUIEvents = function() {
        return this.listenTo(this.UIModel, 'change:pattern.zoom', function(model, value) {
          return this.pads.currentGroup.currentPattern.view.el.style.width = "" + (value * 100) + "%";
        });
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
        return async.waterfall([
          (function(_this) {
            return function(recipeSavedCallback) {
              return _this.recipe.save({}, {
                success: function(savedRecipe) {
                  return async.each(_this.pads.groups.models, function(group, eachGroupSavedCallback) {
                    return group.save({
                      recipe_id: savedRecipe.id
                    }, {
                      success: (function(_this) {
                        return function(savedGroup) {
                          return async.parallel([
                            function(cbSound) {
                              return async.each(group.sounds.models, function(sound, eachSoundSavedCallback) {
                                return sound.save({
                                  group_id: group.id
                                }, {
                                  success: function(savedSound) {
                                    return eachSoundSavedCallback(null, savedSound);
                                  },
                                  error: function(err) {
                                    return eachSoundSavedCallback(err);
                                  }
                                });
                              }, function(err) {
                                if (err) {
                                  cbSound(err);
                                }
                                return cbSound(null);
                              });
                            }, function(cbPattern) {
                              return async.each(group.patterns.models, function(pattern, eachPatternSavedCallback) {
                                return pattern.save({
                                  group_id: group.id
                                }, {
                                  success: function(savedPattern) {
                                    return eachPatternSavedCallback(null, savedPattern);
                                  },
                                  error: function(err) {
                                    return eachPatternSavedCallback(err);
                                  }
                                });
                              }, function(err) {
                                if (err) {
                                  cbPattern(err);
                                }
                                return cbPattern(null);
                              });
                            }
                          ], function(err) {
                            if (err) {
                              eachGroupSavedCallback(err);
                            }
                            return eachGroupSavedCallback(null);
                          });
                        };
                      })(this)
                    });
                  }, function(err) {
                    return recipeSavedCallback(null);
                  });
                },
                error: function(err) {
                  return recipeSavedCallback(err);
                }
              });
            };
          })(this)
        ], function(err, recipe) {
          if (err) {
            throw new Error(err);
          }
          return console.log('SUCCESS');
        });
      };

      AppView.prototype.toJSON = function(e) {
        var recipe;
        recipe = this.recipe.toJSON();
        recipe.groups = [];
        this.pads.groups.each((function(_this) {
          return function(group) {
            var groupAttributes;
            groupAttributes = group.toJSON();
            groupAttributes.sounds = [];
            group.sounds.each(function(sound) {
              return groupAttributes.sounds.push(sound.toJSON());
            });
            groupAttributes.patterns = [];
            group.patterns.each(function(pattern) {
              return groupAttributes.patterns.push(pattern.toJSON());
            });
            return recipe.groups.push(groupAttributes);
          };
        })(this));
        return console.log(recipe);
      };

      AppView.prototype.keyDownDelegate = function(e) {
        var char, prevent;
        char = String.fromCharCode(e.keyCode);
        if (char === RECORD_CHAR && e.ctrlKey) {
          this.transport.record();
          prevent = true;
        } else if (char === PLAYPAUSE_CHAR) {
          this.transport.play();
          prevent = true;
        } else if (_.indexOf([1, '1', '2', '3', '4', '5', '6', '7', '8'], char) > 0 && e.ctrlKey) {
          prevent = true;
          this.pads.render(char);
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
