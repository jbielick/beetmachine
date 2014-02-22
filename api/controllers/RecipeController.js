/**
 * RecipeController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
	_config: {},
	open: function(req, res) {
		Recipe.findOne(req.param('id')).done(function(err, recipe) {
			Group.find({recipe_id: recipe.id}).done(function(err, groups) {
				recipe.groups = groups;
				res.view('home/index', {recipe: recipe});
			});
		});
	}
};
