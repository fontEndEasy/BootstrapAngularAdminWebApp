(function() {
    angular.module('app')
        .controller('PatientInfoDailogCtrl', PatientInfoDailogCtrl)
        .controller('PatientInfoDailogModalInstanceCtrl', PatientInfoDailogModalInstanceCtrl);

    PatientInfoDailogCtrl.$inject = ['$scope', '$uibModal', '$ocLazyLoad'];

    function PatientInfoDailogCtrl($scope, $uibModal, $ocLazyLoad) {
        $scope.open = function(userId, orderId, gId) {
            var modalInstance = $uibModal.open({
                templateUrl: 'patientInfoDailogBox.html',
                controller: 'PatientInfoDailogModalInstanceCtrl',
                size: 'md',
                resolve: {
                    data: {
                        userId: userId,
                        orderId: orderId,
                        gId: gId
                    }
                }
            });

        };

        $ocLazyLoad.load([
            // make call
            'app/shared/make_call/makeCallController.js',
            'app/shared/make_call/makeCallService.js',
        ])

    };

    PatientInfoDailogModalInstanceCtrl.$inject = ['$scope', '$uibModalInstance', 'toaster', 'data', 'PatientInfoDailogFtory', 'MakeCallFactory', 'Lightbox'];

    function PatientInfoDailogModalInstanceCtrl($scope, $uibModalInstance, toaster, data, PatientInfoDailogFtory, MakeCallFactory, Lightbox) {

        $scope.makeCall = function(fromTel, toTel) {
            MakeCallFactory.open(fromTel, toTel);
        }

        // 获取用户数据
        var user = JSON.parse(localStorage['user']);
        $scope.user = user;

        // 关闭弹窗
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };

        // 获取用户和病情资料
        findOrderDiseaseAndRemark(data.userId, data.orderId, data.gId)

        function findOrderDiseaseAndRemark(userId, orderId, gId) {
            var param = {
                access_token: localStorage['guider_access_token'],
                userId: userId
            }

            if (orderId) {
                param.orderId = orderId
            } else if (gId) {
                param.gId = gId
            } else {
                return toaster.pop('error', null, '信息获取失败');
            }

            PatientInfoDailogFtory
                .findOrderDiseaseAndRemark(param)
                .then(thenFc)

            function thenFc(response) {
                console.log(response);
                if (response) {
                    $scope.patientInfo = response;
                } else {
                    toaster.pop('error', null, '信息获取失败');
                }
            }
        }


        // 获取备注
        // getRemarks(data.id);

        // function getRemarks(userId) {
        //     var param = {
        //         access_token: localStorage['guider_access_token'],
        //         userId: userId
        //     }

        //     PatientInfoDailogFtory
        //         .getRemarks(param)
        //         .then(thenFc)

        //     function thenFc(response) {
        //         $scope.data.remarks = response;

        //     }
        // }

        // 修改备注
        $scope.setRemarks = function(value) {

            $scope.remarksIsloading = true;
            var param = {
                access_token: localStorage['guider_access_token'],
                userId: data.userId,
                remarks: value
            }

            PatientInfoDailogFtory
                .setRemarks(param)
                .then(thenFc)

            function thenFc(response) {
                $scope.remarksIsloading = false;
                if (response) {
                    toaster.pop('success', null, '修改成功');
                } else {
                    toaster.pop('error', null, '修改失败');
                }
            }
        };
        // 放大图片
        $scope.openLightboxModal = function(item, index) {
            Lightbox.openModal(item, index);
        };
    }

})();
