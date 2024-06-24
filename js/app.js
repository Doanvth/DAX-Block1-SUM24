var app = angular.module("myApp", ["ngRoute"]);

app.config(function ($routeProvider) {
    $routeProvider
    .when("/", {
      templateUrl: "trangchu.html",
      controller: "homeController",
    })
    .when("/quat", {
      templateUrl: "quat.html",
      controller: "quatController"
    })
    .when("/detailQuat/:id", {
      templateUrl: "detailquat.html",
      controller: "detailQuatController"
    })
    .when("/noi", {
      templateUrl: "noi.html",
      controller: "noiController"
    })    
    .when("/detailNoi/:id",{
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
    .when("/bottle", {
            templateUrl: "bottle.html",
            controller: "bottleCtrl",
        })
        .when("/bottle/:id", {
            templateUrl: "bottle-detail.html",
            controller: "bottleCtrl",
        })
    .when("/stove", {
      templateUrl: "bep.html",
      controller: "stoveController",
    })
    .when("/detailstove/:id", {
      templateUrl: "detail_stove.html",
      controller: "detailStoveController",
    })
    .when("/cayNuocNongLanh", {
      templateUrl: "cayNuocNongLanh.html",
      controller: "CayNuocNongLanhController"
    })
      .when("/cayNuocNongLanh/:productId", {
        templateUrl: "detailCayNuocNongLanh.html",
        controller: "cayNuocNongLanhDetailController"
      })
      .when("/mayxaydanang", {
        templateUrl: "mayxaydanang.html",
        controller: "mayxayController"
      })
      .when("/detailmayxay/:id", {
        templateUrl: "detailmayxay.html",
        controller: "detailMayxayController"
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

  $http.get(URL_API + "brandsStove").then(
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

app.controller('mayxayController', function ($scope, MayxayService, BrandMayxayService, giamayxayService, chatlieuService, soluongcoiService, congsuatService) {
  MayxayService.getCategoriesMayXay().then(function (response) {
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
  BrandMayxayService.getBrandMayXay().then(function (response) {
    $scope.brand = response.data;
  });
  giamayxayService.getGiaMayXay().then(function (response) {
    $scope.giamayxay = response.data;
  });
  chatlieuService.getChatlieucoi().then(function (response) {
    $scope.chatlieu = response.data;
  });
  soluongcoiService.getSoluongcoi().then(function (response) {
    $scope.soluongcoi = response.data;
  });
  congsuatService.getCongsuat().then(function (response) {
    $scope.congsuat = response.data;
  });
});

app.controller('detailMayxayController', function ($scope, $http, $routeParams, $location) {
  $http({
    method: "GET",
    url: URL_API + "categoriesmayxay"
  }).then(function (response) {
    var danhMucMayXay = response.data;
    console.log(danhMucMayXay);
    if (Array.isArray(danhMucMayXay)) {
      danhMucMayXay.forEach(function (danhmuc) {
        var products = danhmuc.productmayxay;
        console.log(products);
        if (Array.isArray(products)) {
          products.forEach(function (p) {
            if (p.id == $routeParams.id) {
              $scope.product = p;
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