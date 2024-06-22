var app = angular.module("myApp", ["ngRoute"]);

app.config(function ($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl: "trangchu.html",
        controller: "homeController",
    })
    .when("/bottle/", {
      templateUrl: "bottle.html",
      controller: "bottleCtrl"
    })
    .when("/bottle/:id", {
      templateUrl: "bottle-detail.html",
      controller: "bottleCtrl"
    });
});
let URL_API = "http://localhost:3000/";

app.controller("bottleCtrl", function ($scope, $http) {
    $scope.getBottleData = function () {
        $http.get(URL_API + "bottles").then(
            function (success) {
                $scope.bottles = success.data;

                $scope.bottleBrands = $scope.bottles.brands;
                $scope.bottleBudgets = $scope.bottles.budgets;
                $scope.bottleCapacities = $scope.bottles.capacities;
                $scope.bottleMadeAt = $scope.bottles.made_at;
                $scope.bottleProducts = $scope.bottles.products;
                $scope.bottleHotCategories = $scope.bottles.hot_categories;
                $scope.bottleCategories = $scope.bottles.categories;

            },
            function (error) {
                console.log("Error: ", error);
            }
        );
    };
});
