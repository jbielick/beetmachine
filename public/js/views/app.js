(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['jquery', 'underscore', 'backbone', 'deepmodel', 'ligaments', 'module', 'async', 'routes/app', 'views/pads', 'views/display', 'views/transport', 'views/sequence', 'views/pattern.ui', 'models/recipe', 'collections/group'], function($, _, Backbone, deepmodel, ligaments, module, async, Router, Pads, Display, Transport, Sequence, PatternUIView, RecipeModel, GroupCollection) {
    var APP_EL_SELECTOR, AppView, DEFAULT_KEYCODES, PLAYPAUSE_CHAR, RECORD_CHAR;
    DEFAULT_KEYCODES = [54, 55, 56, 57, 89, 85, 73, 79, 72, 74, 75, 76, 78, 77, 188, 190];
    RECORD_CHAR = 82;
    PLAYPAUSE_CHAR = 32;
    APP_EL_SELECTOR = 'body';
    AppView = (function(_super) {
      __extends(AppView, _super);

      function AppView() {
        return AppView.__super__.constructor.apply(this, arguments);
      }

      AppView.prototype.el = APP_EL_SELECTOR;

      AppView.prototype.initialize = function() {
        var i, keyCode, _i, _len;
        window.App = this;
        this.current = {};
        this.recipe = new RecipeModel(module.config().recipe);
        this.router = new Router({
          app: this
        });
        (this.display = new Display({
          app: this
        })).log('Please Wait...');
        this.transport = new Transport({
          app: this
        });
        this.pattern = new PatternUIView({
          app: this
        });
        this.groups = new GroupCollection({
          position: 1
        }, {
          app: this
        });
        this.pads = new Pads({
          app: this
        });
        this.sequence = new Sequence({
          app: this
        });
        this.UIModel = new (Backbone.DeepModel.extend());
        this.keyMap = {};
        async.series([
          (function(_this) {
            return function(callback) {
              if (_this.recipe.get('id')) {
                return _this.open(_this.recipe, function() {
                  return callback(null, true);
                });
              } else {
                return callback(null, false);
              }
            };
          })(this)
        ], (function(_this) {
          return function(err, opened) {
            _this._selectGroupAt(0);
            return _this.pattern._selectPatternAt(0);
          };
        })(this));
        for (i = _i = 0, _len = DEFAULT_KEYCODES.length; _i < _len; i = ++_i) {
          keyCode = DEFAULT_KEYCODES[i];
          this.keyMap[keyCode] = i;
        }
        return this.display.log('Ready');
      };

      AppView.prototype.events = {
        'click [data-behavior]': 'delegateBehavior',
        'keypress': 'keyPressDelegate',
        'keydown': 'keyDownDelegate',
        'keyup': 'keyUpDelegate'
      };

      AppView.prototype.delegateBehavior = function(e) {
        var behavior, meta;
        behavior = $(e.currentTarget).data('behavior');
        meta = $(e.currentTarget).data('meta');
        if ((behavior != null) && _.isFunction(this[behavior])) {
          return this[behavior].call(this, e, meta);
        }
      };

      AppView.prototype.selectGroup = function(e, number) {
        return this._selectGroup(number);
      };

      AppView.prototype._selectGroupAt = function(idx) {
        return this._selectGroup(this.groups.at(0).get('position'));
      };

      AppView.prototype._selectGroup = function(groupNumber) {
        this.current.group = this.groups.findWhere({
          position: groupNumber
        });
        return this.pads.render(groupNumber);
      };

      AppView.prototype.open = function(recipe, callback) {
        var _this;
        _this = this;
        this.display.log("Loading " + (this.recipe.get('name')) + "...");
        return this.groups.fetchRecursive(this, this.recipe, (function(_this) {
          return function(err, fetched) {
            callback.call(_this);
            return _this.display.log("Recipe \"" + (_this.recipe.get('name')) + "\" Loaded");
          };
        })(this));
      };

      AppView.prototype.save = function(e) {
        var _this;
        _this = this;
        return async.waterfall([
          (function(_this) {
            return function(recipeSavedCallback) {
              return _this.recipe.save({}, {
                success: function(savedRecipe) {
                  return async.each(_this.groups.models, function(group, eachGroupSavedCallback) {
                    return group.save({
                      recipe_id: savedRecipe.id
                    }, {
                      success: (function(_this) {
                        return function(savedGroup) {
                          return async.parallel([
                            function(cbSample) {
                              return async.each(group.samples.models, function(sample, eachSampleSavedCallback) {
                                return sample.save({
                                  groupId: group.id
                                }, {
                                  success: function(savedSample) {
                                    return eachSampleSavedCallback(null, savedSample);
                                  },
                                  error: function(err) {
                                    return eachSampleSavedCallback(err);
                                  }
                                });
                              }, function(err) {
                                if (err) {
                                  cbSample(err);
                                }
                                return cbSample(null);
                              });
                            }, function(cbPattern) {
                              return async.each(group.patterns.models, function(pattern, eachPatternSavedCallback) {
                                return pattern.save({
                                  groupId: group.id
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
        ], (function(_this) {
          return function(err, results) {
            if (err) {
              throw new Error(err);
            }
            _this.router.navigate("recipe/" + (_this.recipe.get('id')), {
              silent: true
            });
            return _this.display.log("Recipe \"" + (_this.recipe.get('name')) + "\" Saved");
          };
        })(this));
      };

      AppView.prototype.toJSON = function(e) {
        var recipe;
        recipe = this.recipe.toJSON();
        recipe.groups = [];
        this.groups.each((function(_this) {
          return function(group) {
            var groupAttributes;
            groupAttributes = group.toJSON();
            groupAttributes.samples = [];
            group.samples.each(function(sample) {
              return groupAttributes.samples.push(sample.toJSON());
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
        if (this.keyMap[e.which] != null) {
          this.pressing = e.which;
          return pad = (_ref = this.current.pads[this.keyMap[e.which]]) != null ? _ref.trigger('press') : void 0;
        }
      };

      AppView.prototype.keyUpDelegate = function(e) {
        var pad, _ref;
        if (e.which === this.pressing) {
          return pad = (_ref = this.current.pads[this.keyMap[e.which]]) != null ? _ref.trigger('release') : void 0;
        }
      };

      return AppView;

    })(Backbone.View);
    return new AppView();
  });

}).call(this);
