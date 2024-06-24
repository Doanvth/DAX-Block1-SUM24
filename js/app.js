var app = angular.module("myApp", ["ngRoute"]);

app.config(function ($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "trangchu.html",
      // controller: "homeController"
    })
    .when("/noi", {
      templateUrl: "noi.html",
      controller: "noiController"
    })
    .when("/detailNoi/:id", {
      templateUrl: "detailNoi.html",
      controller: "detailNoiController"
    })
    .when("/lovisong", {
      templateUrl: "lovisong.html",
      controller: "lovisongController"
    })
    .when("/detailLovisong/:id", {
      templateUrl: "detailLovisong.html",
      controller: "detailLovisongController"
    })
});

let URL_API = "http://localhost:3000/"
app.service('NoiService', function ($http) {
  this.getCategoriesNoi = function () {
    return $http({
      method: "GET",
      url: URL_API + "danhmucnoi",
    }).catch(function (error) {
      console.error('API call error:', error);
      throw error;
    });
  };
});

app.service('BrandService', function ($http) {
  this.getBrandNoi = function () {
    return $http({
      method: "GET",
      url: URL_API + "brandNoi",
    }).catch(function (error) {
      console.error('API call error:', error);
      throw error;
    });
  };
});

app.service('madeInNoiService', function ($http) {
  this.getMadeInNoi = function () {
    return $http({
      method: "GET",
      url: URL_API + "madeInNoi",
    }).catch(function (error) {
      console.error('API call error:', error);
      throw error;
    });
  };
});

app.service('LovisongService', function ($http) {
  this.getLovisong = function () {
    return $http({
      method: "GET",
      url: URL_API + "LoViSong",
    }).catch(function (error) {
      console.error('API call error:', error);
      throw error;
    });
  };
});

app.controller('noiController', function ($scope, NoiService, BrandService, madeInNoiService) {
  NoiService.getCategoriesNoi().then(function (response) {
    $scope.categories = response.data;
    $scope.productsByCategory = {};

    function processCategories(categories, parentId) {
      categories.forEach(function (category) {
        if (category.potType) {
          category.potType.forEach(function (subCategory) {
            if (subCategory.products) {
              subCategory.products.forEach(function (product) {
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
  }).catch(function (error) {
    $scope.error = 'Error occurred: ' + error.message;
    console.error('Error occurred:', error);
  });
  BrandService.getBrandNoi().then(function (response) {
    $scope.brand = response.data;
  });
  madeInNoiService.getMadeInNoi().then(function (response) {
    $scope.madeIn = response.data;
  });
});

app.controller('detailNoiController', function ($scope, $http, $routeParams, $location) {
  $http({
    method: "GET",
    url: URL_API + "danhmucnoi"
  }).then(function (response) {
    var danhMucNoi = response.data;

    if (Array.isArray(danhMucNoi)) {
      danhMucNoi.forEach(function (danhmuc) {
        var potType = danhmuc.potType;
        if (Array.isArray(potType)) {
          potType.forEach(function (type) {
            var products = type.products;
            if (Array.isArray(products)) {
              products.forEach(function (product) {
                if (product.id == $routeParams.id) {
                  $scope.product = product;
                }
              });
            }
          });
        }
      });
    } else {
      console.log("Dữ liệu danh mục nồi không hợp lệ.");
    }

  }).catch(function (error) {
    console.log("Lỗi khi tải danh mục nồi:", error);
  });

});

app.controller('lovisongController', function ($scope, LovisongService) {
  LovisongService.getLovisong().then(function (response) {
    $scope.categories = response.data;
    $scope.productsByCategory = {};

    function processCategories(categories, parentId) {
      categories.forEach(function (products) {
        $scope.products = products.Product;
      });
      categories.forEach(function (categori) {
        if (categori.CatagoryLoViSong) {
          categori.CatagoryLoViSong.forEach(function (inforLVS) {
            $scope.madeInLVS = inforLVS.Production;
            $scope.brandLVS = inforLVS.Brand;
            $scope.priceLVS = inforLVS.Price;
            $scope.cateLVS = inforLVS.Categories;
          })
        }




      })
    }
    processCategories($scope.categories, null);
  }).catch(function (error) {
    $scope.error = 'Error occurred: ' + error.message;
    console.error('Error occurred:', error);
  });
});

app.controller('detailLovisongController', function ($scope, $http, $routeParams, $location) {
  $http({
    method: "GET",
    url: URL_API + "LoViSong"
  }).then(function (response) {
    var data  = response.data;
    if (Array.isArray(data)) {
      data.forEach(function (item) {
        if (item.Product && Array.isArray(item.Product)) {
          var products = item.Product;
          products.forEach(function(product){
            if(product.id == $routeParams.id){
              $scope.product = product;
              console.log($scope.product)
            }
          })
        }
      });
    }
    


  }).catch(function (error) {
    console.log("Lỗi khi tải danh mục lò vi sóng:", error);
  });

});
