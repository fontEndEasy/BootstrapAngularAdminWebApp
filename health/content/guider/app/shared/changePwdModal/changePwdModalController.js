(function() {
    angular.module('app')
        .controller('ChangePwdModalInstanceCtrl', ChangePwdModalInstanceCtrl);

    ChangePwdModalInstanceCtrl.$inject = ['$scope', '$uibModalInstance', 'toaster', '$http'];

    function ChangePwdModalInstanceCtrl($scope, $uibModalInstance, toaster, $http) {
        $scope.ok = function () {
            $scope.errorInfo='';
            if(!$scope.curPassword){
                return $scope.errorInfo='当前密码不能为空';
            }
            if(!$scope.newPassword){
                return $scope.errorInfo='新密码不能为空';
            }
            if(!$scope.reNewPassword){
                return $scope.errorInfo='确定密码不能为空';
            }
            if($scope.newPassword!=$scope.reNewPassword){
                return $scope.errorInfo='两次输入的密码不相同';
            }
            $http.post(app.api.shared.updatePassword, {
                access_token: localStorage['guider_access_token'],
                newPassword:$scope.newPassword,
                oldPassword:$scope.curPassword,
                userId:JSON.parse(localStorage.getItem('user')).id
            }).
            success(function(data, status, headers, config) {
                if (data.resultCode == 1) {
                    toaster.pop('success', null,'密码修改成功');
                    $uibModalInstance.close();
                } else {
                    toaster.pop('error', null, data.resultMsg);
                }
            }).
            error(function(data, status, headers, config) {
                toaster.pop('error', null, data.resultMsg);
            });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }

})();
