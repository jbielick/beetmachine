(function() {
  var __hasProp = {}.hasOwnProperty,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  (function(root) {
    var Groove, _slice;
    _slice = Array.prototype.slice;
    Groove = (function() {
      var Bus, Deferred, Node, Promise;

      function Groove(context, options) {
        this.context = context;
        if (options == null) {
          options = {
            sampleRate: 48000
          };
        }
        this.sampleRate = options.sampleRate;
        if (!this.context) {
          this.context = this.getAudioContext();
        }
      }

      Groove.prototype.getAudioContext = function() {
        var AudioCtx;
        AudioCtx = root.AudioContext || root.webkitAudioContext;
        if (AudioCtx) {
          return new AudioCtx();
        } else {
          throw new Error('Environment lacks WebAudio API Support');
        }
      };

      Groove.prototype.get = function(src) {
        var node;
        if (src) {
          node = new Groove.Node(this.context, src);
          return node.load(src);
        } else {
          return new Groove.Node(this.context);
        }
      };

      Groove.prototype.createBus = function(inputs, effects) {
        return new Groove.Bus(this.context, inputs, effects);
      };

      Groove.defer = function() {
        return new Groove.Deferred();
      };

      Groove.Bus = Bus = (function() {
        function Bus(context, nodes, effectNodes) {
          this.context = context;
          this.nodes = nodes != null ? nodes : [];
          this.effectNodes = effectNodes != null ? effectNodes : [];
          this.input = this.context.createGain();
          this.output = this.context.createGain();
          this.route();
        }

        Bus.prototype.inject = function(nodes, idx) {
          idx || (idx = this.effectNodes.length);
          if (typeof nodes.constructor === Array) {
            return this.effectNodes.splice.apply(this.effectNodes, [idx, 0].concat(nodes));
          } else {
            return this.effectNodes.splice(idx, 0, nodes);
          }
        };

        Bus.prototype.route = function() {
          var last, node, _i, _len, _ref;
          this.input.disconnect();
          _ref = this.nodes;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            node = _ref[_i];
            node.connect(this.input);
          }
          last = this.renderEffects(this.input);
          return last.connect(this.output);
        };

        Bus.prototype.renderEffects = function(input) {
          var effect, last, _i, _len, _ref;
          last = input;
          _ref = this.effectNodes;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            effect = _ref[_i];
            last.connect(effect) && (last = effect);
          }
          return last;
        };

        Bus.prototype.disconnect = function() {
          return this.output.disconnect();
        };

        Bus.prototype.connect = function(node) {
          return this.output.connect(node);
        };

        return Bus;

      })();

      Groove.Node = Node = (function() {
        function Node(context, type, src) {
          this.context = context;
          this.src = src;
          this.input = this.context.createGain();
          this.output = this.context.createGain();
        }

        Node.prototype.connect = function(node) {
          return this.output.connect(node);
        };

        Node.prototype.load = function(src) {
          var deferred, xhr;
          this.src = src;
          deferred = new Groove.Deferred();
          this.ready = false;
          xhr = new root.XMLHttpRequest();
          xhr.open('GET', src, true);
          xhr.responseType = 'arraybuffer';
          xhr.onload = (function(_this) {
            return function(e) {
              return _this.context.decodeAudioData(xhr.response, function(buffer) {
                _this.buffer = buffer;
                _this.ready = true;
                return deferred.resolve(_this);
              }, function(err) {
                return deferred.reject(err);
              });
            };
          })(this);
          xhr.send();
          return deferred.promise;
        };

        Node.prototype.pipe = function() {
          var args, node, _i, _len, _results;
          args = _slice.call(arguments);
          if (args.length === 1 && args[0] instanceof Groove) {
            return this.connect(args[0].context.destination);
          } else {
            _results = [];
            for (_i = 0, _len = args.length; _i < _len; _i++) {
              node = args[_i];
              _results.push(this.connect(node));
            }
            return _results;
          }
        };

        Node.prototype.play = function(delay) {
          var rendered, sound;
          if (delay == null) {
            delay = 0;
          }
          if (!this.ready) {
            throw new Error("Buffer hasn't loaded yet.");
          }
          sound = this.context.createBufferSource();
          sound.buffer = this.buffer;
          rendered = this.renderEffects(sound);
          rendered.connect(this.context.destination);
          return sound.start(delay);
        };

        Node.prototype.addEffect = function(type, params) {
          var node;
          if (!this._effectMappings[type]) {
            throw new Error("Unknown effect: " + type);
          }
          if (!this.context[this._effectMappings[type].method]) {
            throw new Error("'" + type + "' not implemented for " + this.context);
          }
          node = this.context[this._effectMappings[type].method]();
          this.effects[type] = node;
          this.nodes << node;
          return this;
        };

        Node.prototype.renderEffects = function(sound) {
          var currentNode, effectNode, effectNodeName, _ref;
          currentNode = sound;
          _ref = this.effects;
          for (effectNodeName in _ref) {
            if (!__hasProp.call(_ref, effectNodeName)) continue;
            effectNode = _ref[effectNodeName];
            currentNode.connect(effectNode);
            currentNode = effectNode;
          }
          return currentNode;
        };

        return Node;

      })();

      Groove.Deferred = Deferred = (function() {
        function Deferred() {
          this.thens = [];
          this.catches = [];
          this.finallys = [];
          this.promise = new Groove.Promise(this);
        }

        Deferred.prototype.resolve = function() {
          var finallyCb, thenCb, _i, _j, _len, _len1, _ref, _ref1, _results;
          this.resolved = _slice.call(arguments);
          _ref = this.thens;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            thenCb = _ref[_i];
            thenCb.apply(this, arguments);
          }
          _ref1 = this.finallys;
          _results = [];
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            finallyCb = _ref1[_j];
            _results.push(finallyCb.apply(this, arguments));
          }
          return _results;
        };

        Deferred.prototype.reject = function() {
          var catchCb, finallyCb, _i, _j, _len, _len1, _ref, _ref1, _results;
          this.rejected = _slice.call(arguments);
          _ref = this.catches;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            catchCb = _ref[_i];
            catchCb.apply(this, arguments);
          }
          _ref1 = this.finallys;
          _results = [];
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            finallyCb = _ref1[_j];
            _results.push(finallyCb.apply(this, arguments));
          }
          return _results;
        };

        return Deferred;

      })();

      Groove.Promise = Promise = (function() {
        function Promise(deferred) {
          this.deferred = deferred;
          this["finally"] = __bind(this["finally"], this);
          this["catch"] = __bind(this["catch"], this);
          this.then = __bind(this.then, this);
        }

        Promise.prototype.then = function(cb) {
          this.deferred.thens.push(cb);
          if (this.deferred.resolved) {
            cb.apply(this.deferred, this.deferred.resolved);
          }
          return this;
        };

        Promise.prototype["catch"] = function(cb) {
          this.deferred.catches.push(cb);
          if (this.deferred.rejected) {
            cb.apply(this.deferred, this.deferred.rejected);
          }
          return this;
        };

        Promise.prototype["finally"] = function(cb) {
          this.deferred.finallys.push(cb);
          if (this.deferred.resolved || this.deferred.rejected) {
            cb.apply(this.deferred, this.deferred.resolved || this.deferred.rejected);
          }
          return this;
        };

        return Promise;

      })();

      return Groove;

    })();
    if ((typeof module !== "undefined" && module !== null) && typeof moule === 'object') {
      module.exports = Groove;
    } else if ((typeof define !== "undefined" && define !== null) && typeof dfine === 'function') {
      define('Groove', [], Groove);
    }
    return root.Groove = Groove;
  })(this);

}).call(this);
