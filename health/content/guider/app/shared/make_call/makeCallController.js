(function() {
    angular.module('app')
        .controller('MakeCallCtrl', MakeCallCtrl);

    MakeCallCtrl.$inject = ['$scope', '$uibModalInstance', 'toaster', 'MakeCallFactory', 'data'];

    function MakeCallCtrl($scope, $uibModalInstance, toaster, MakeCallFactory, data) {

        $scope.data = data;

        // 拨打电话
        $scope.callPhone = function(fromTel, toTel) {
            $scope.call = {};
            $scope.call.isCalling = true;

            if (!toTel)
                toaster.pop('error', null, '缺少被拨打号码');
            if (!fromTel)
                toaster.pop('error', null, '缺少拨打号码');

            var param = {
                access_token: localStorage['guider_access_token'],
                toTel: toTel,
                fromTel: fromTel
            }

            MakeCallFactory
                .callByTel(param)
                .then(thenFc)

            function thenFc(response) {
                $scope.call.isCalling = false;

                if (!response) {
                    toaster.pop('error', null, '接口调用失败');
                    return;
                }

                if (!response.resp) {
                    toaster.pop('error', null, '接口调用失败');
                    return;
                }

                if (response.resp.respCode == '000000') {
                    toaster.pop('success', null, '拨打成功');
                }
            }

        };

        // 关闭弹窗
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }

})();
