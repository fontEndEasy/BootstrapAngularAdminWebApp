// ============================== signinController.js =================================
(function() {
    angular.module('app')
        .controller('NewPassWordCtrl', NewPassWordCtrl);

    // 手动注入依赖
    NewPassWordCtrl.$inject = ['$scope', '$state', 'NewPassWordFactory','$stateParams','$http'];

    // 登录控制器
    function NewPassWordCtrl($scope, $state, NewPassWordFactory,$stateParams,$http) {
        var smsid=$stateParams.smsid;
        var phone=$stateParams.phone;
        var ranCode=$stateParams.ranCode;

        $scope.reset=function(){
            if(!$scope.password){
                $scope.signinError='请填写密码';
                return $scope.signinForm.password.isNull = true;
            }

            if(!$scope.rePassword){
                $scope.signinError='请再次填写密码';
                return $scope.signinForm.rePassword.isNull = true;
            }

            if($scope.password!=$scope.rePassword){
                $scope.signinError='两次输入密码不一致';
                return $scope.signinForm.rePassword.isNull = true;
            }

            if ($scope.password.length < 6 || $scope.password.length > 16) {
                $scope.signinError="密码的长度应该在6-16个字符之间";
                return $scope.signinForm.rePassword.isNull = true;
            }
            for (var R = 0; R < $scope.password.length; R++) {
                var aI = $scope.password.charCodeAt(R);
                if (aI > 65248 || aI == 12288) {
                    $scope.signinError="请勿使用全角字符";
                    return $scope.signinForm.rePassword.isNull = true;
                }
            }
            if (/[\u4e00-\u9fa5]/.test($scope.password)) {
                $scope.signinError="请勿使用中文";
                return $scope.signinForm.rePassword.isNull = true;
            }
            if (!/^([\w\~\!\@\#\$\%\^\&\*\(\)\+\`\-\=\[\]\\\{\}\|\;\'\:\"\,\.\/\<\>\?]{6,16})$/.test($scope.password)) {
                $scope.signinError="6-16位字符（字母、数字、特殊符号），区分大小写";
                return $scope.signinForm.rePassword.isNull = true;
            }

            if(!smsid||!phone||!ranCode){
                $scope.signinError='链接不合法';
            }

            $http.post(app.api.shared.resetPassword, {
                access_token:app.url.access_token,
                phone:phone,
                userType:6,
                smsid:smsid,
                ranCode:ranCode,
                password:$scope.password
            }).
            success(function(data, status, headers, config) {
                if(data.resultCode==1){
                    $state.go('resetSuccess');
                }
                else{
                    $scope.signinError = response.resultMsg;
                    $scope.signinForm.isError = true;
                }
            }).
            error(function(data, status, headers, config) {
                $scope.signinError = response.resultMsg;
                $scope.signinForm.isError = true;
            });

        }

    }
})();
