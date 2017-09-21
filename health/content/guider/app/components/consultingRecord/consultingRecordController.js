(function() {
    angular.module('app')
        .controller('consultingRecordCtrl', consultingRecordCtrl)
        .controller('ConsultingRecordModalInstanceCtrl', ConsultingRecordModalInstanceCtrl);

    consultingRecordCtrl.$inject = ['$scope', '$uibModal', '$log', '$stateParams', '$state'];

    function consultingRecordCtrl($scope, $uibModal, $log, $stateParams, $state) {

        if (!$stateParams.orderId)
            return $state.go('order.myOrder');

        var data = {};
        var modalInstance = $uibModal.open({
            templateUrl: 'consultingRecordBox.html',
            controller: 'ConsultingRecordModalInstanceCtrl',
            keyboard: false,
            backdrop: 'static',
            size: 'lg',
            resolve: {
                data: {
                    orderId: $stateParams.orderId
                }
            }

        });

    };

    ConsultingRecordModalInstanceCtrl.$inject = ['$scope', '$uibModalInstance', '$state', 'toaster', 'ConsultingRecordFactory', 'data'];

    function ConsultingRecordModalInstanceCtrl($scope, $uibModalInstance, $state, toaster, ConsultingRecordFactory, data) {

        $scope.cancel = function(argument) {
            $uibModalInstance.dismiss('cancel');
            $state.go('order.myOrder');
        }

        findByPatientAndDoctor(data.orderId);

        function findByPatientAndDoctor(orderId) {

            $scope.findByPatientAndDoctorLoading = true;

            var param = {
                access_token: localStorage['guider_access_token'],
                orderId: orderId
            }

            ConsultingRecordFactory
                .findByPatientAndDoctor(param)
                .then(thenFc)

            function thenFc(response) {
                $scope.findByPatientAndDoctorLoading = false;
                if (response.resultCode == 1) {
                    $scope.recordList = response.data;
                    console.log($scope.recordList)
                } else if (response.resultMsg) {
                    toaster.pop('error', null, response.resultMsg);
                } else {
                    toaster.pop('error', null, '接口调用失败');
                }


            }
        }

    }

})();
