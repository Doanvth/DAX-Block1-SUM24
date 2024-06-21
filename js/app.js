var app = angular.module("myApp", ["ngRoute"]);

app.config(function ($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "trangchu.html",
      controller: "homeController"
    })
    .when("/noi", {
      templateUrl: "noi.html",
      controller: "noiController"
    })
});

let URL_API = "http://localhost:3000/"
app.service('NoiService', function($http) {
  this.getCategoriesNoi = function() {
    return $http({
      method: "GET",
      url: URL_API + "danhmucnoi",
    }).catch(function(error) {
      console.error('API call error:', error);
      throw error; 
    });
  };
});

app.service('BrandService', function($http) {
  this.getBrandNoi = function() {
    return $http({
      method: "GET",
      url: URL_API + "brandNoi",
    }).catch(function(error) {
      console.error('API call error:', error);
      throw error; 
    });
  };
});

app.service('madeInNoiService', function($http) {
  this.getMadeInNoi = function() {
    return $http({
      method: "GET",
      url: URL_API + "madeInNoi",
    }).catch(function(error) {
      console.error('API call error:', error);
      throw error; 
    });
  };
});

app.controller('noiController', function($scope, NoiService, BrandService, madeInNoiService) {
  NoiService.getCategoriesNoi().then(function(response) {
    $scope.categories = response.data;
    $scope.productsByCategory = {};

    function processCategories(categories, parentId) {
      categories.forEach(function(category) {
        if (category.potType) {
          category.potType.forEach(function(subCategory) {
            if (subCategory.products) {
              subCategory.products.forEach(function(product) {
                $scope.productsByCategory[product.name] = {
                  product: product,
                  categoryId: parentId
                };
              });
            }
          });
        }
      });
    }
    processCategories($scope.categories, null);
  }).catch(function(error) {
    $scope.error = 'Error occurred: ' + error.message;
    console.error('Error occurred:', error);
  });
  BrandService.getBrandNoi().then(function(response){
    $scope.brand = response.data;
  });
  madeInNoiService.getMadeInNoi().then(function(response){
    $scope.madeIn = response.data;
  });
});