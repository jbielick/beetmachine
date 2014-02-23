/**
 * Document: Group
 *
 * @module      :: Model
 * @description :: Group is a bucket of (max) 16 sounds (samples) or instruments (mutable synth items). 
 *              		Up to 16 patterns may belong to a group. A group may contain an fx subdocument
 * @docs				:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {
		recipe_id: 'string',
		position: 'integer',
		name: 'string',
		sounds: {
			type: 'json',
			defaultsTo: {}
		},
		fx: {
			type: 'json',
			defaultsTo: {}
		}
	}

};
