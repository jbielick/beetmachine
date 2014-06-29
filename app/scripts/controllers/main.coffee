'use strict'

angular.module('beetmachineApp')
  .controller 'MainCtrl', ($scope, $http) ->
    console.log """
       _               _                        _     _            
      | |__   ___  ___| |_ _ __ ___   __ _  ___| |__ (_)_ __   ___
      | '_ \\ / _ \\/ _ \\ __| '_ ` _ \\ / _` |/ __| '_ \\| | '_ \\ / _ \\
      | |_) |  __/  __/ |_| | | | | | (_| | (__| | | | | | | |  __/
      |_.__/ \\___|\\___|\\__|_| |_| |_|\\__,_|\\___|_| |_|_|_| |_|\\___|

      |  First rule in roadside beet sales, 
      |  put the most attractive beets on top. 
      |  The ones that make you pull the car 
      |  over and go, "Wow, I need this beet 
      |  right now." Those are the money beets.
    """