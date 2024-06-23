var app = angular.module("myApp", ["ngRoute"]);

app.config(function ($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "trangchu.html",
      controller: "homeController"
    })
    .when("/quat", {
      templateUrl: "quat.html",
      controller: "quatController"
    })
    .when("/detailQuat/:id", {
      templateUrl: "detailquat.html",
      controller: "detailQuatController"
    })
});

let URL_API = "http://localhost:3000/"

app.controller('quatController', function ($scope, $http) {
  $http.get(URL_API + "categories").then(function (response) {
    $scope.categories = response.data;
    $scope.productsByCategory = {};
    $scope.Product = {}
    // Hàm đệ quy để duyệt qua các danh mục và sản phẩm
    function processCategories(categories, parentId) {
      categories.forEach(function (category) {
        // Lưu trữ sản phẩm theo danh mục
        if (category.products) {
          category.products.forEach(function (product) {
            $scope.productsByCategory[product.id] = {
              product: product,
              categoryId: parentId
            };
          });
        }


        // Nếu có danh mục con, gọi đệ quy
        if (category.subcategories) {
          processCategories(category.subcategories, category.id);
        }

        console.log($scope.subcategory);

      });
    }

    // Gọi hàm đệ quy với danh sách danh mục
    processCategories($scope.categories, null);

    // Function to flatten categories and products
    function flattenCategories(categories) {
      var products = [];
      categories.forEach(function (category) {
        if (category.products) {
          products = products.concat(category.products);
        }
        if (category.subcategories) {
          products = products.concat(flattenCategories(category.subcategories));
        }
        
      });
      return products;
    }
    $scope.Product = flattenCategories($scope.categories)


  }, function (error) {
    console.error('Error occurred:', error);
  });
  $http.get(URL_API + "brands").then(function (response) {
    $scope.brands = response.data;
    $scope.productsByBrand = {};

    // Hàm đệ quy để duyệt qua các danh mục và sản phẩm
    function processbrands(brands, parentId) {
      brands.forEach(function (brand) {
        // Lưu trữ sản phẩm theo danh mục
        if (brand.products) {
          brand.products.forEach(function (product) {
            $scope.productsBybrand[product.id] = {
              product: product,
              brandId: parentId
            };
          });
        }

        // Nếu có danh mục con, gọi đệ quy
        if (brand.subbrands) {
          processBrands(brand.subbrands, brand.id);
        }
      });
    }

    // Gọi hàm đệ quy với danh sách danh mục
    processbrands($scope.brands, null);

  }, function (error) {
    console.error('Error occurred:', error);
  });
  // $http.get(URL_API + "quat").then(function (response) {
  //   $scope.quats = response.data;
  //   $scope.totalQuats = $scope.quats.length;
  // }, function (error) {
  //   console.error('Error occurred:', error);
  // });
});

app.controller('detailQuatController', function ($scope, $http, $routeParams) {
  $http.get(URL_API + "categories").then(function (response) {
    var categories = response.data;

    if (Array.isArray(categories)) {
      categories.forEach(function (category) {
        var subcategories = category.subcategories;
        if (Array.isArray(subcategories)) {
          subcategories.forEach(function (subcategory) {
            var products = subcategory.products;
            if (Array.isArray(products)) {
              products.forEach(function (product) {
                if (product.id == $routeParams.id) {
                  $scope.quat = product;

                  if (product.listAnh && product.listAnh.length > 0) {
                    $scope.firstImage = product.listAnh[0];
                  }

                  $scope.thongTinSP = product.thongTinSP;
                  $scope.thongTinSPthunhatvathuhai = $scope.thongTinSP.slice(0, 2);

                  $scope.thongTinSPconlai = $scope.thongTinSP.slice(2);
                  
                  console.log($scope.quat.thongTinSP);
                }
              });
            }
          });
        }
      });
    } else {
      console.log("Dữ liệu danh mục quạt không hợp lệ.");
    }
    $scope.isCollapsed = true; 

    $scope.toggleCollapse = function () {
      $scope.isCollapsed = !$scope.isCollapsed; 
    };
  });
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

app.directive('quantityControl', function () {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var btnMinus = element[0].querySelector('#btnMinus');
      var btnPlus = element[0].querySelector('#btnPlus');
      var txtQty = element[0].querySelector('#txtQty');

      btnMinus.addEventListener('click', function () {
        var currentValue = parseInt(txtQty.value);
        if (!isNaN(currentValue) && currentValue > 1) {
          txtQty.value = currentValue - 1;
        }
      });

      btnPlus.addEventListener('click', function () {
        var currentValue = parseInt(txtQty.value);
        if (!isNaN(currentValue)) {
          txtQty.value = currentValue + 1;
        }
      });
    }
  };
});
