/**
 * Template
 *
 * @module      :: Model
 * @description :: A template of a sound model instance with fx and other attributes to be imported into a group
 *              		within one's project
 * @docs				:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {
		name: 'string',
		src: 'string',
		pad: 'integer',
		keyCode: 'integer',
		user_id: 'string',
		fx: {
			type: 'json',
			defaultsTo: {}
		}
	}

};
