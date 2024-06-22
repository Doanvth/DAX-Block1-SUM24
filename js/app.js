var app = angular.module("myApp", ["ngRoute"]);

app.config(function ($routeProvider) {
  $routeProvider
    // .when("/", {
    //   templateUrl: "trangchu.html",
    //   controller: "homeController",
    // })
    .when("/", {
      templateUrl: "bep.html",
      controller: "stoveController",
    })
    .when("/detailstove/:id", {
      templateUrl: "detail_stove.html",
      controller: "detailStoveController",
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
  );

  $http.get(URL_API + "brands").then(
    function (response) {
      $scope.brands = response.data;
      console.log(response.data);
    },
    function (response) {
      console.log("Error connect db");
    }
  );
});

app.controller(
  "detailStoveController",
  function ($scope, $http, $routeParams, $location) {
    $http.get(URL_API + "stove/").then(
      function (response) {
        var cate = response.data;

        if (Array.isArray(cate)) {
          cate.forEach(function (sub) {
            var sub = sub.subcategories;
            console.log(sub);
            if (Array.isArray(sub)) {
              sub.forEach(function (products) {
                var products = products.products;
                console.log(products);
                if (Array.isArray(products)) {
                  products.forEach(function (product) {
                    if (product.id == $routeParams.id) {
                      $scope.product = product;
                      console.log($scope.product);
                    }
                  });
                }
              });
            }
          });
        } else {
          console.log("Dữ liệu danh mục nồi không hợp lệ.");
        }
      },
      function (response) {
        console.log("Error connect db");
      }
    );
  }
);

app.directive("showMoreItem", function () {
  return {
    restrict: "C",
    link: function (scope, element, attrs) {
      element.on("click", function () {
        var hiddenItems = document.querySelectorAll(".item-hidden");
        hiddenItems.forEach((item) => {
          item.classList.remove("item-hidden");
        });
        angular.element(element).css("display", "none");
        var dontShowMoreButton = document.querySelector(".dont-show-more-item");
        angular.element(dontShowMoreButton).css("display", "flex");
      });
    },
  };
});

app.directive("dontShowMoreItem", function () {
  return {
    restrict: "C",
    link: function (scope, element, attrs) {
      element.on("click", function () {
        var hiddenItems = document.querySelectorAll(".shead-brand-item");
        hiddenItems.forEach((item, index) => {
          if (index >= 17) {
            item.classList.add("item-hidden");
          }
        });
        angular.element(element).css("display", "none");
        var showMoreButton = document.querySelector(".show-more-item");
        angular.element(showMoreButton).css("display", "flex");
      });
    },
  };
});
