"use strict"

angular.module("beetmachine").factory "User", [
  '$resource', ($resource) ->
    $resource "/api/users/:id",
      id: "@id"
    ,
      special:
        method: 'DELETE'
      update:
        method: "PUT"
        params: {}

      get:
        method: "GET"
        params:
          id: "me"
]