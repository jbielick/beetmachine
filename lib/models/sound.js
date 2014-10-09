'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
/**
 * Sound Schema
 */
var SoundSchema = new Schema({
  name: String,
  src: String
});

mongoose.model('Sound', SoundSchema);


  // this.belongsTo('Recipes');
  // this.hasMany('Samples');

  // this.defineProperties({
  //   'name': {type: 'string'},
  //   'groupId': {type: 'string'},
  //   'src': {type: 'string'}
  // });