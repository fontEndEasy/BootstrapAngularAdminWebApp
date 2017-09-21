'use strict';

// 注册控制器
app.controller('SignupFormController', ['$scope', '$http', '$state',
  function($scope, $http, $state) {
    $scope.user = {};
    $scope.authError = null;
    $scope.signup = function() {
      $http.post(app.url.signup, {
        number: $scope.user.name,
        password: $scope.user.password
      }).then(function(response) {
        if (response.data.code == 1) {
          $state.go('access.signin');
        } else {
          $scope.authError = '注册失败！';
        }
      }, function(x) {
        $scope.authError = '服务器错误！';
      });
    };
  }
]);