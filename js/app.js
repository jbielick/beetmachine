window.App = window.App || {};


var PAD_KEYCODES = [
  117, 105, 111,
  106, 107, 108,
  109, 44, 46
];
var RECORD_CHAR = 82;
var PLAYPAUSE_CHAR = 32;

App.AppView = Backbone.View.extend({

  el: 'body',

  events: {
    'keypress': 'onKeyPress'
  },

  initialize: function() {

    this.pads = new Backbone.Collection(_.map(_.range(9), function(i) {
      return {number: i};
    }));

    this.padViews = this.pads.map(function(pad) {
      var view = new App.PadView({model: pad});
      this.listenTo(view, 'loaded', function(view) {
        this.display.log('Pad ' + view.model.get('number') + ' loaded.');
      }, this);
      return view;
    }, this);

    this.$('.pads').append(_.map(this.padViews, function(view) {
      return view.el;
    }));

    this.mapKeys();

    this.walk();

    this.display = new App.DisplayView();

    this.display.log('App is Ready');
  },

  onKeyPress: function(event) {

    if (typeof this.keyMap[event.which] !== 'undefined') {
      this.padViews[this.keyMap[event.which]].play();
    }

  },

  mapKeys: function() {
    this.keyMap = {};

    PAD_KEYCODES.forEach(function(keyCode, i) {
      this.keyMap[keyCode] = i;
    }, this);
  },

  walk: function() {
    this.padViews.forEach(function(padView, i) {
      setTimeout(function() {
        padView.play();
      }, i * 50);
    });
  }

});