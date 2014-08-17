'use strict'

angular.module('beetmachine')
  .controller 'MainCtrl', ($scope, $http) ->
    $scope.range = (n) ->
      Array(n)
    console.log """
       _               _                        _     _            
      | |__   ___  ___| |_ _ __ ___   __ _  ___| |__ (_)_ __   ___
      | '_ \\ / _ \\/ _ \\ __| '_ ` _ \\ / _` |/ __| '_ \\| | '_ \\ / _ \\
      | |_) |  __/  __/ |_| | | | | | (_| | (__| | | | | | | |  __/
      |_.__/ \\___|\\___|\\__|_| |_| |_|\\__,_|\\___|_| |_|_|_| |_|\\___|

      |  First rule in roadside beet sales, 
      |  put the most attractive beets on top. 
    """