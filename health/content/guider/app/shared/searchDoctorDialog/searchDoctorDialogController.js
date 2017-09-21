(function() {
    angular.module('app')
        .controller('SearchDoctorDialogCtrl', SearchDoctorDialogCtrl)
        .controller('SearchDoctorDialogModalInstanceCtrl', SearchDoctorDialogModalInstanceCtrl);

    SearchDoctorDialogCtrl.$inject = ['$scope', '$uibModal'];

    function SearchDoctorDialogCtrl($scope, $uibModal) {
        $scope.open = function(gId, callback) {
            var modalInstance = $uibModal.open({
                templateUrl: 'searchDoctorDialogBox.html',
                controller: 'SearchDoctorDialogModalInstanceCtrl',
                size: 'xl',
                resolve: {
                    data: {
                        gId: gId
                    }
                }
            });

            modalInstance.result.then(function(returnMsg) {
                if (callback) {
                    callback();
                }
            }, function() {
                if (callback) {
                    callback();
                }
            });

        };

    };

    SearchDoctorDialogModalInstanceCtrl.$inject = ['$scope', '$uibModalInstance', 'SearchDoctorDialogFtory', 'toaster', 'data', '$http'];

    function SearchDoctorDialogModalInstanceCtrl($scope, $uibModalInstance, SearchDoctorDialogFtory, toaster, data, $http) {
        //checkbox选项
        $scope.gId = data.gId;

        $scope.checkStatus = {
            isCity: true,
            isHospital: false,
            isTitle: true
        };

        $scope.$watchCollection('checkStatus', function(newValue, oldValue) {
            if (newValue !== oldValue) {
                findDocsByCheckBox($scope.checkStatus);
            }

        });
        findDocsByCheckBox($scope.checkStatus);

        function findDocsByCheckBox(param) {
            $http.post(app.api.doctor.findDoctors, {
                access_token: localStorage['guider_access_token'],
                isCity: param.isCity,
                isHospital: param.isHospital,
                isTitle: param.isTitle,
                pageIndex: 0,
                pageSize: 9999,
                guideOrderId: $scope.gId
            }).
            success(function(data, status, headers, config) {
                if (data.resultCode == 1) {
                    $scope.rowCollection = data.data.pageData;
                    $scope.displayedCollection = [].concat($scope.rowCollection);
                } else {
                    toaster.pop('error', null, data.resultMsg);
                }
            }).
            error(function(data, status, headers, config) {
                toaster.pop('error', null, data.resultMsg);
            });
        }


        // 关闭弹窗
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
            console.log($scope.goRunning);
            if ($scope.goRunning)
                $scope.goRunning();

        };

        $scope.clearKeyWord=function(){
            $scope.keyWord='';
        };

        //按回车键搜索
        $scope.pressEnter=function($event){
            if($event.keyCode==13){
                $scope.searchByKeyWord();
            }
        };

        $scope.searchByKeyWord=function(){
            if($scope.keyWord==''){
                $scope.checkStatus = {
                    isCity: true,
                    isHospital: false,
                    isTitle: true
                };
            }
            else{
                $scope.checkStatus = {
                    isCity: false,
                    isHospital: false,
                    isTitle: false
                };

                $http.post(app.api.doctor.findDoctorsFromKeyWord, {
                    access_token: localStorage['guider_access_token'],
                    keyWord: $scope.keyWord,
                    pageIndex: 0,
                    pageSize: 9999,
                }).
                success(function(data, status, headers, config) {
                    if (data.resultCode == 1) {
                        $scope.rowCollection = data.data.pageData;
                        $scope.displayedCollection = [].concat($scope.rowCollection);
                    } else {
                        toaster.pop('error', null, data.resultMsg);
                    }
                }).
                error(function(data, status, headers, config) {
                    toaster.pop('error', null, data.resultMsg);
                });
            }


        }


    }

})();
