var app = angular.module("myApp", ["ngRoute"]);

app.config(function ($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "trangchu.html",
      controller: "homeController",
    })
    .when("/stove", {
      templateUrl: "bep.html",
      controller: "stoveController",
    });
});

let URL_API = "http://localhost:3000/";

app.controller("stoveController", function ($scope, $http) {
  $http.get(URL_API + "stove").then(
    function (response) {
      console.log(response.data);
      $scope.stove = response.data;
    },
    function (response) {
      console.log("Error connect db");
    }
  )
});



app.directive('showMoreItem', function () {
  return {
      restrict: 'C',
      link: function (scope, element, attrs) {
          element.on('click', function () {
              var hiddenItems = document.querySelectorAll('.item-hidden');
              hiddenItems.forEach(item => {
                  item.classList.remove('item-hidden');
              });
              angular.element(element).css('display', 'none');
              var dontShowMoreButton = document.querySelector('.dont-show-more-item');
              angular.element(dontShowMoreButton).css('display', 'flex');
          });
      }
  };
});

app.directive('dontShowMoreItem', function () {
  return {
      restrict: 'C',
      link: function (scope, element, attrs) {
          element.on('click', function () {
              var hiddenItems = document.querySelectorAll('.shead-brand-item');
              hiddenItems.forEach((item, index) => {
                  if (index >= 17) {
                      item.classList.add('item-hidden');
                  }
              });
              angular.element(element).css('display', 'none');
              var showMoreButton = document.querySelector('.show-more-item');
              angular.element(showMoreButton).css('display', 'flex');
          });
      }
  };
});

