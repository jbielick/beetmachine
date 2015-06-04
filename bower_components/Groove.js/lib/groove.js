var __hasProp = {}.hasOwnProperty,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

(function(root) {
  var Deferred, Groove;
  Groove = (function() {
    var Node;

    function Groove(options) {
      if (options == null) {
        options = {
          sampleRate: 48000
        };
      }
      this.sampleRate = options.sampleRate;
      this.context = this.getAudioContext();
    }

    Groove.prototype.getAudioContext = function() {
      if (root.webkitAudioContext) {
        return new root.webkitAudioContext();
      }
      if (root.AudioContext) {
        return new root.AudioContext();
      }
      throw new Error('No Audio Context Support');
    };

    Groove.prototype.createNode = function(src) {
      var node;
      if (src) {
        node = new Node(this.context, src);
        return node.load(src);
      } else {
        return new Node(this.context);
      }
    };

    Groove.prototype.connectNode = function(node) {};

    Groove.defer = function() {
      return new Deferred();
    };

    Node = (function() {
      function Node(context, src) {
        this.context = context;
        this.src = src;
        this.nodes = [];
        this.effects = [];
      }

      Node.prototype._effectMappings = {
        reverb: {
          method: 'createConvolver'
        },
        lowpass: {
          method: 'createBiquadFilter'
        },
        pan: {
          method: 'createPanner'
        },
        gain: {
          method: 'createGain'
        },
        compressor: {
          method: 'createDynamicsCompressor'
        }
      };

      Node.prototype.load = function(src) {
        var deferred, xhr;
        deferred = new Deferred();
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
            });
          };
        })(this);
        xhr.send();
        return deferred.promise;
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

    return Groove;

  })();
  Deferred = (function() {
    var Promise;

    function Deferred() {
      this.thens = [];
      this.catches = [];
      this.finallys = [];
      this.promise = new Promise(this);
    }

    Deferred.prototype.resolve = function() {
      var finallyCb, thenCb, _i, _j, _len, _len1, _ref, _ref1, _results;
      this.resolved = Array.prototype.slice.call(arguments);
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
      this.rejected = Array.prototype.slice.call(arguments);
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

    Promise = (function() {
      function Promise(deferred) {
        this.deferred = deferred;
        this["finally"] = __bind(this["finally"], this);
        this["catch"] = __bind(this["catch"], this);
        this.then = __bind(this.then, this);
      }

      Promise.prototype.then = function(cb) {
        this.deferred.thens.push(cb);
        if (this.deferred.resolved) {
          return cb.apply(this.deferred, this.deferred.resolved);
        }
      };

      Promise.prototype["catch"] = function(cb) {
        this.deferredcatches.push(cb);
        if (this.deferred.rejected) {
          return cb.apply(this.deferred, this.deferred.rejected);
        }
      };

      Promise.prototype["finally"] = function(cb) {
        this.deferred.finallys.push(cb);
        if (this.deferred.resolved || this.deferred.rejected) {
          return cb.apply(this.deferred, this.deferred.resolved || this.deferred.rejected);
        }
      };

      return Promise;

    })();

    return Deferred;

  })();
  if ((typeof module !== "undefined" && module !== null) && typeof moule === 'object') {
    module.exports = Groove;
  } else if ((typeof define !== "undefined" && define !== null) && typeof dfine === 'function') {
    define('Groove', [], Groove);
  }
  return root.Groove = Groove;
})(this);
