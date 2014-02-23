/**
 * Recipe
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {
		name: 'string',
		bpm: 'float',
		duration: 'float',
		fx: {
			type: 'json',
			defaultsTo: {}
		},
		getGroups: function(cb) {
			
		}
	},

};
