// ============================== signinController.js =================================
(function() {
    angular.module('app')
        .controller('SigninCtrl', SigninCtrl);

    // 手动注入依赖
    SigninCtrl.$inject = ['$scope', '$state', 'SigninFactory'];

    // 登录控制器
    function SigninCtrl($scope, $state, SigninFactory) {

        $scope.isSingnin = false;
        $scope.signin = function() {

            $scope.signinForm.userName.isNull = false;
            $scope.signinForm.userPassWord.isNull = false;
            $scope.signinForm.isError = false;

            if (!$scope.userName) {
                console.log($scope.signinForm.userName)
                return $scope.signinForm.userName.isNull = true;
            }

            if (!$scope.userPassWord) {
                return $scope.signinForm.userPassWord.isNull = true;
            }

            if (!$scope.signinForm.$valid) {
                return $scope.signinForm.isError = true;
            }

            $scope.isSingnin = true;

            var param = {
                telephone: $scope.userName,
                password: $scope.userPassWord,
                userType: 6
            }

            SigninFactory
                .getData(param)
                .then(thenFc)

            function thenFc(response) {
                if (response.resultCode === 1) {

                    var user = {
                        id: response.data.user.userId,
                        name: response.data.user.name,
                        headPicFileName: response.data.user.headPicFileName,
                        telephone: response.data.user.telephone
                    }
                    localStorage['guider_access_token'] = response.data.access_token;
                    localStorage["user"] = JSON.stringify(user);
                    return $state.go('order.home');

                } else if (response.resultMsg) {

                    $scope.signinError = response.resultMsg;
                    $scope.signinForm.isError = true;
                }

                return $scope.isSingnin = false;
            }
        };
    };

})();
