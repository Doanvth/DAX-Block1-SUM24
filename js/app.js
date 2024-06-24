var app = angular.module("myApp", ["ngRoute"]);

app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "trangchu.html",
            controller: "homeController",
        })
        .when("/bottle/", {
            templateUrl: "bottle.html",
            controller: "bottleCtrl",
        })
        .when("/bottle/:id", {
            templateUrl: "bottle-detail.html",
            controller: "bottleCtrl",
        });
});
let URL_API = "http://localhost:3000/";

app.controller("bottleCtrl", function ($scope, $http, $routeParams) {
    let bottleID = $routeParams.id;
    $scope.getBottleData = function () {
        $http.get(URL_API + "bottles").then(
            function (success) {
                $scope.bottles = success.data;
            },
            function (error) {
                console.log("Error: ", error);
            }
        );
    };
    $scope.getDataByID = function () {
        $http.get(URL_API + "bottles").then(
            function (success) {
                $scope.bottles = success.data;
                $scope.bottles.products.forEach((bottle) => {
                    if (bottle.id == bottleID) {
                        $scope.bottle = bottle;
                        $scope.mainImg = $scope.bottle.image;
                    }
                });
            },
            function (error) {
                console.log("Error: ", error);
            }
        );
    };
    if (bottleID) {
        $scope.getDataByID();
    } else {
        $scope.getBottleData();
    }

    //carousel settings
    $scope.carouselCtrl = 1;
    $scope.next = function () {
        $scope.carouselCtrl = $scope.carouselCtrl + 1;
        if ($scope.carouselCtrl >= $scope.mainImg.img.length) {
            $scope.carouselCtrl = 0;
        }
    };
    $scope.prev = function () {
        $scope.carouselCtrl = $scope.carouselCtrl - 1;
        if ($scope.carouselCtrl < 0) {
            $scope.carouselCtrl = $scope.mainImg.img.length - 1;
        }
    };
    $scope.slideBtn = function (index) {
        $scope.carouselCtrl = index;
    };
    $scope.statusBtn = function (index) {
        if ($scope.carouselCtrl == index) {
            return true;
        } else {
            return false;
        }
    };
});
