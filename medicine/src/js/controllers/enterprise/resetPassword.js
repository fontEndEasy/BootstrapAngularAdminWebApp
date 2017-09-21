'use strict';

// 登录控制器
app.controller('forgotpwdCtrl', ['$scope', '$http', '$state', '$cookieStore', 'utils',
  function($scope, $http, $state, $cookieStore, utils) {
    $scope.getSmsBT = "获取验证码";
    $scope.preResetPassword = function () {
        $scope.getSmsBTState = true;
        $http.post(app.url.preResetPassword,{
          phone:$scope.phone,
          userType:5
        }).
        success(function (data) {
            if(data.resultCode === 1){
                $scope.smsid = data.data.smsid;
                $scope.resetPwdState = true;
                $scope.phoneState = true;
                console.log(data.data.smsid);
                $scope.getSmsBT = 160;
                var getSms = setInterval(function () {
                    $scope.$apply(function () {
                        $scope.getSmsBT -- ;
                        if($scope.getSmsBT==0){
                            $scope.getSmsBT='获取验证码';
                            $scope.getSmsBTState = false;
                            clearInterval(getSms);
                        }
                    });
                },1000)
            }else{
                $scope.getSmsBTState = false;
                $scope.authError = data.resultMsg;
            }
        }).
        error(function(data) {
            $scope.getSmsBTState = false;
            $scope.authError = '服务器错误！';
        });
    };
    $scope.resetPassword = function () {
      $http.post(app.url.resetPassword,{
          phone:$scope.phone,
          userType:5,
          smsid:$scope.smsid,
          ranCode:$scope.code,
          password:$scope.pwd
        }).
        success(function (data) {
            console.log(data);
            if (data.resultCode === 1) {
              $scope.success = '立即登录';
              return $scope.authError = '修改成功！';
            };
            $scope.authError = data.resultMsg;
        }).
        error(function(data) {
            $scope.authError = data.resultMsg;
        });
    };
  }
]);