'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
/**
 * Sound Schema
 */
var RecipeSchema = new Schema({
  name: {type: 'string', required: true},
  bpm: Number,
  duration: Number,
  master: {}
});

mongoose.model('Recipe', RecipeSchema);


  // this.belongsTo('Recipes');
  // this.hasMany('Samples');

  // this.defineProperties({
  //   'name': {type: 'string'},
  //   'groupId': {type: 'string'},
  //   'src': {type: 'string'}
  // });