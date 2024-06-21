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
      });
    }

    // Gọi hàm đệ quy với danh sách danh mục
    processCategories($scope.categories, null);

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
  $http.get(URL_API + "quat").then(function (response) {
    $scope.quats = response.data;
    $scope.totalQuats = $scope.quats.length;
  }, function (error) {
    console.error('Error occurred:', error);
  });
});

app.controller('detailQuatController', function ($scope, $http, $routeParams) {
  $http.get(URL_API + "quat/" + $routeParams.id).then(function (response) {
    $scope.quat = response.data;
    if (response.data.listAnh && response.data.listAnh.length > 0) {
      $scope.firstImage = response.data.listAnh[0];
    }

    $scope.thongTinSP = response.data.thongTinSP;
    $scope.thongTinSPthunhatvathuhai = $scope.thongTinSP.slice(0, 2);

    $scope.thongTinSPconlai = $scope.thongTinSP.slice(2);
    }, function (error) {
    console.error('Error occurred:', error);
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
