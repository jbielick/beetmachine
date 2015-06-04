window.App = window.App || {};

var groove = new Groove();

App.PadView = Backbone.View.extend({

  className: 'small-4 large-4 columns',

  template: _.template($('#padTemplate').html(), {variable: 'pad'}),

  events: {
    'click': 'play',
    'dragover': 'stop',
    'dragenter': 'stop',
    'drop': 'onDropFile'
  },

  initialize: function(options) {

    this.listenTo(this.model, 'change', this.render, this);

    this.render();
  },

  onDropFile: function(e) {
    var e = e.originalEvent;

    var objectUrl = window.URL.createObjectURL(e.dataTransfer.files[0]);

    e.preventDefault();
    e.stopPropagation();

    this.load(objectUrl);
  },

  load: function(objectUrl) {
    var _this = this;
    groove.createNode(objectUrl)
      .then(function(node) {
        _this.node = node;
        _this.trigger('loaded', _this);
        _this.model.set('src', objectUrl);
      });
  },

  stop: function(event) {
    event.preventDefault();
    event.stopPropagation();
  },

  play: function() {
    var _this = this;

    this.$el.addClass('active');

    if (this.node) {
      this.node.play();
    }

    setTimeout(function() {
      _this.$el.removeClass('active');
    }, 100);
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
  }

});