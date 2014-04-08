(function() {
  'use strict';
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['jquery', 'underscore', 'backbone', 'text!/js/templates/sequence.ejs'], function($, _, Backbone, SequenceTemplate) {
    var SLOT_CLASSES, SLOT_COL_CLASSES, SLOT_LABEL_CLASSES, SequenceView;
    SLOT_LABEL_CLASSES = 'slot slot-label';
    SLOT_COL_CLASSES = 'col col-1';
    SLOT_CLASSES = 'slot';
    return SequenceView = (function(_super) {
      __extends(SequenceView, _super);

      function SequenceView() {
        return SequenceView.__super__.constructor.apply(this, arguments);
      }

      SequenceView.prototype.template = _.template(SequenceTemplate);

      SequenceView.prototype.el = '.sequence';

      SequenceView.prototype.initialize = function(options) {
        this.app = options.app;
        return this.buildSequence();
      };

      SequenceView.prototype.buildSequence = function() {
        var cols, column, html, row, rows;
        column = 0;
        cols = [];
        while (column < 13) {
          row = 0;
          cols[column] = $("<div class=\"" + SLOT_COL_CLASSES + "\">");
          rows = [];
          while (row < 8) {
            if (column === 0) {
              html = "<div class=\"" + SLOT_CLASSES + "\">Group " + (row + 1) + "</div>";
            } else {
              html = "<div class=\"" + SLOT_CLASSES + "\">&nbsp;</div>";
            }
            rows.push($(html));
            row++;
          }
          cols[column].append(rows);
          column++;
        }
        return this.$el.append(cols);
      };

      return SequenceView;

    })(Backbone.View);
  });

}).call(this);
