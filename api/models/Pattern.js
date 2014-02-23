/**
 * Document: Pattern
 *
 * @module      :: Model
 * @description :: Pattern model belongs to a group. Up to 16 patterns per group. Includes subdocument array of triggers.
 * @docs				:: http://sailsjs.org/#!documentation/models
 */

/**
 * Subdocument: Triggers
 *
 * @description :: a hash of tick keys with values which are an array of models describing a pad trigger.
 * @attributes 	:: .vel velocity of the trigger, .sound the numerically indexed sound within the group to trigger, .len length of trigger
 * @docs				:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {
		group_id: 'string',
		name: 'string',
		positions: 'array',
		length: 'integer',
		triggers: {
			type: 'json',
			defaultsTo: {}
		}
	}

};
