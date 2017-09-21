// ============================== signinController.js =================================
(function() {
    angular.module('app')
        .controller('ResetPassWordCtrl', ResetPassWordCtrl);

    // 手动注入依赖
    ResetPassWordCtrl.$inject = ['$scope', '$state', 'ResetPassWordFactory','$http'];

    // 登录控制器
    function ResetPassWordCtrl($scope, $state, ResetPassWordFactory,$http) {
        $scope.getCodeText='获取验证码';
        $scope.smsid=null;
        $scope.getCode = function() {
            if (!$scope.telephone) {
                $scope.signinError='请填写手机号码';
                return $scope.signinForm.userName.isNull = true;
            }
            $scope.signinError='';

            var params={
                phone:$scope.telephone,
                userType:6
            };
            ResetPassWordFactory.getRanCode(params).then(thenFc);

            function thenFc(response) {
                if (response.resultCode === 1) {
                    var i=3;
                    $scope.smsid=response.data.smsid;
                    $scope.isTiming=true;
                    var timer=setInterval(function(){
                        i--;
                        $scope.getCodeText='等待('+i+')';
                        if(i===0){
                            clearInterval(timer);
                            $scope.getCodeText='获取验证码';
                            $scope.isTiming=false;
                        }
                        $scope.$apply('getCodeText');
                    },1000);
                } else if (response.resultMsg) {
                    $scope.signinError = response.resultMsg;
                    $scope.signinForm.isError = true;
                }
            }
        };


        $scope.next=function(){
            if (!$scope.telephone) {
                $scope.signinError='请填写手机号码';
                return $scope.signinForm.userName.isNull = true;
            }
            if (!$scope.code) {
                $scope.signinError='请填写验证码';
                return $scope.signinForm.code.isNull = true;
            }
            if (!$scope.smsid) {
                $scope.signinError='请重新获取验证码';
                return $scope.signinForm.code.isNull = true;
            }
            $http.post(app.api.shared.verifyResetPassword, {
                access_token:app.url.access_token,
                phone:$scope.telephone,
                userType:6,
                smsid:$scope.smsid,
                ranCode:$scope.code
            }).
            success(function(data, status, headers, config) {
                if(data.resultCode==1){
                    $state.go('newPassWord',{smsid:$scope.smsid,ranCode:$scope.code,phone:$scope.telephone});
                }
                else{
                    $scope.signinError = data.resultMsg;
                    $scope.signinForm.isError = true;
                }
            }).
            error(function(data, status, headers, config) {
                $scope.signinError = data.resultMsg;
                $scope.signinForm.isError = true;
            });
        };
    };

})();
