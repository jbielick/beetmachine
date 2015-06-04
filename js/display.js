window.App = window.App || {};


App.DisplayView = Backbone.View.extend({

  el: '#display',

  template: _.template($('#displayTemplate').html(), null, {variable: 'state'}),

  initialize: function() {
    this.state = new Backbone.Model;

    this.listenTo(this.state, 'change:message', this.render);
  },

  log: function(message) {
    this.state.set('message', message);
  },

  render: function() {
    this.$el.html(this.template(this.state.toJSON()));
  }

});