(function() {
  define('databehavior', (function(_this) {
    return function() {
      return {
        events: {
          'click [data-behavior]': 'delegateBehavior'
        },
        delegateBehavior: function(e) {
          var behavior;
          behavior = $(e.target).data("behavior");
          if (this[behavior] != null) {
            return this[behavior].call(this, e);
          }
        }
      };
    };
  })(this));

}).call(this);
