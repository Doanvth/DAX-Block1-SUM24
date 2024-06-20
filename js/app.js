var app = angular.module("myApp", ["ngRoute"]);

app.config(function ($routeProvider) {
    $routeProvider
      .when("/", {
        templateUrl: "trangchu.html",
        controller: "homeController"
  });
});