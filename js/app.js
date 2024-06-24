var app = angular.module("myApp", ["ngRoute"]);

app.config(function ($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "trangchu.html",
      controller: "homeController"
    })
    .when("/cayNuocNongLanh", {
      templateUrl: "cayNuocNongLanh.html",
      controller: "CayNuocNongLanhController"
    })
    .when("/cayNuocNongLanh/:productId", {
      templateUrl: "detailCayNuocNongLanh.html",
      controller: "cayNuocNongLanhDetailController"
    });
});

let URL_API = "http://localhost:3000/";

app.controller("CayNuocNongLanhController", function ($scope, $http, $location) {
  $http({
    method: "GET",
    url: URL_API + "CatagoryCayNuocNongLanh"
  }).then(function (response) {
    $scope.data = response.data[0];
  });

  $scope.showProductDetails = function (productId) {
    $location.path('/cayNuocNongLanh/' + productId);
  };
});

app.controller("cayNuocNongLanhDetailController", function ($scope, $http, $routeParams) {
  let productId = $routeParams.productId;

  $http.get(URL_API + "CatagoryCayNuocNongLanh")
    .then(function (response) {
      $scope.data = response.data[0];
      $scope.data.Categories.forEach(function (category) {
        if (category.Product) {
          $scope.selectedProduct = category.Product.find(product => product.id == productId);
          if ($scope.selectedProduct) return;
        }
      });
    });
});
// app.directive('showMoreItem', function () {
//   return {
//     restrict: 'C',
//     link: function (scope, element, attrs) {
//       element.on('click', function () {
//         var hiddenItems = document.querySelectorAll('.item-hidden');
//         hiddenItems.forEach(item => {
//           item.classList.remove('item-hidden');
//         });
//         angular.element(element).css('display', 'none');
//         var dontShowMoreButton = document.querySelector('.dont-show-more-item');
//         angular.element(dontShowMoreButton).css('display', 'flex');
//       });
//     }
//   };
// });

// app.directive('dontShowMoreItem', function () {
//   return {
//     restrict: 'C',
//     link: function (scope, element, attrs) {
//       element.on('click', function () {
//         var hiddenItems = document.querySelectorAll('.shead-brand-item');
//         hiddenItems.forEach((item, index) => {
//           if (index >= 17) {
//             item.classList.add('item-hidden');
//           }
//         });
//         angular.element(element).css('display', 'none');
//         var showMoreButton = document.querySelector('.show-more-item');
//         angular.element(showMoreButton).css('display', 'flex');
//       });
//     }
//   };
// });


