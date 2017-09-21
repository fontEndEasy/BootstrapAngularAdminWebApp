(function() {
    angular.module('app')
        .controller('TimeEditorCtrl', TimeEditorCtrl)
        .controller('TimeEditorCtrlModalInstanceCtrl', TimeEditorCtrlModalInstanceCtrl);

    TimeEditorCtrl.$inject = ['$scope', '$uibModal', 'moment'];

    function TimeEditorCtrl($scope, $uibModal, moment) {

        $scope.open = function(date, callBackParam) {
            console.log(date, 343434);
            if (!date)
                date = new Date();
            else
                date = moment(date).unix() * 1000;;

            var modalInstance = $uibModal.open({
                templateUrl: 'TimeEditorCtrlBox.html',
                controller: 'TimeEditorCtrlModalInstanceCtrl',
                size: 'md',
                resolve: {
                    data: {
                        date: date,
                        maxDate: $scope.maxDate,
                        minDate: $scope.minDate,
                        minuteStep: $scope.minuteStep,
                        hourStep: $scope.hourStep
                    }
                }
            });

            modalInstance.result.then(function(selectedItem) {
                if ($scope.callBack && callBackParam)
                    $scope.callBack(selectedItem, callBackParam);
                else if ($scope.callBack)
                    $scope.callBack(selectedItem);
                else
                    $scope.date = selectedItem;
            });

        };

    };

    TimeEditorCtrlModalInstanceCtrl.$inject = ['$scope', '$uibModalInstance', 'toaster', 'data'];

    function TimeEditorCtrlModalInstanceCtrl($scope, $uibModalInstance, toaster, data) {
        console.log(data);
        $scope.data = data;

        // 关闭弹窗
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.ok = function() {
            $uibModalInstance.close(data.date);
        };


    }

})();
