'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
/**
 * Group Schema
 */
var GroupSchema = new Schema({
  name: String,
  position: Number,
  fx: {},
  mute: {type: Boolean, default: false},
  solo: {type: Boolean, default: false}
});

GroupSchema.methods = {
  getSounds: function(cb) {
    var Sound = mongoose.model('Sound');
    Sound.find({groupId: this.id}, function(err, sounds) {
      if (!err) {
        cb(err);
      } else {
        cb(null, sounds);
      }
    });
  }
};

mongoose.model('Group', GroupSchema);


  // this.belongsTo('Recipes');
  // this.hasMany('Patterns');
  // this.hasMany('Samples');

  // this.defineProperties({
  //   name: {type: 'string'},
  //   recipeId: {type: 'string'},
  //   position: {type: 'int'},
  //   fx: {type: 'object'},
  //   mute: {type: 'boolean'},
  //   solo: {type: 'boolean'}
  // });
