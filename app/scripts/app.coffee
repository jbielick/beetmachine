'use strict'

angular.module('beetmachine', [
  'mm.foundation',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
])
.config([
  '$routeProvider', '$locationProvider', '$httpProvider',
  ($routeProvider, $locationProvider, $httpProvider) ->

    $routeProvider
      .when '/',
        templateUrl: 'partials/main'
        controller: 'MainCtrl'
      .when '/login',
        templateUrl: 'partials/login'
        controller: 'LoginCtrl'
      .when '/signup', 
        templateUrl: 'partials/signup'
        controller: 'SignupCtrl'
      .when '/settings',
        templateUrl: 'partials/settings'
        controller: 'SettingsCtrl'
        authenticate: true
      .otherwise
        redirectTo: '/'

    $locationProvider.html5Mode true

    $httpProvider.defaults.headers['Content-Type'] =
      $httpProvider.defaults.headers['Accept'] = 
      'application/json'

    $httpProvider.interceptors.push [
      '$q', '$location', '$log', 
      ($q, $location, $log) ->
        responseError: (response) ->
          if response.status is 401
            $location.path '/login'
            $q.reject response
          else if response.status is 0
            $log.error('Check Internet Connection')
          else
            $q.reject response
    ]
])
.run([
  '$rootScope', '$location', 'Auth', '$window',
  ($rootScope, $location, Auth, $window) ->
    connectivityModal = null
    angular.element($window)
      .on 'offLine', (e) ->
        $rootScope.online = false
        connectivityModal.close
      .on 'onLine', (e) ->
        $rootScope.online = true
        connectivityModal = {}
    # Redirect to login if route requires auth and you're not logged in
    $rootScope.$on '$routeChangeStart', (event, next) ->
      $location.path '/login'  if next.authenticate and not Auth.isLoggedIn()
])