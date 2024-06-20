var app = angular.module("myApp", ["ngRoute"]);

app.config(function ($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "trangchu.html",
      controller: "homeController"
    })
    .when("/bottle", {
      templateUrl: "bottle.html",
      controller: "bottleCtrl"
    })
});
let URL_API = "http://localhost:3000/";

app.controller("bottleCtrl", function ($scope, $http) {
  $scope.getBottleData = function () {
    $http.get(URL_API + "bottle").then(function (success) {
      $scope.bottles = success.data;
    }, function (error) {
      console.log("Error: ", error);
    }
    )
  }
})