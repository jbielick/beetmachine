'use strict';

var api = require('./controllers/api'),
    index = require('./controllers'),
    users = require('./controllers/users'),
    session = require('./controllers/session'),
    middleware = require('./middleware');
/**
 * Application routes
 */
module.exports = function(app) {
  
  function createRestfulResource(resource) {
    var controller = require('./controllers/' + resource);
    app.route('/api/' + resource)
        .post(controller.create)
        .get(controller.index);
      app.route('/api/' + resource + '/:id')
        .get(controller.show)
        .put(controller.update)
        .delete(controller.delete);
  };

  var restfulResources = [
      'sounds',
      'groups',
      'recipes'
      // 'patterns'
    ],
    controllers = {};

  restfulResources.forEach(createRestfulResource);

  app.route('/api/session')
    .post(session.login)
    .delete(session.logout);

  // All undefined api routes should return a 404
  app.route('/api/*')
    .get(function(req, res) {
      res.send(404);
    });

  // All other routes to use Angular routing in app/scripts/app.js
  app.route('/partials/*')
    .get(index.partials);
  app.route('/*')
    .get( middleware.setUserCookie, index.index);
};