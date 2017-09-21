(function() {
    angular.module('app')
        .controller('HierarchicalSelectCtrl', HierarchicalSelectCtrl)
        .controller('HierarchicalSelectCtrlModalInstanceCtrl', HierarchicalSelectCtrlModalInstanceCtrl);

    HierarchicalSelectCtrl.$inject = ['$scope', '$uibModal'];

    function HierarchicalSelectCtrl($scope, $uibModal, $log) {
        $scope.open = function(url, title) {
            var data = {};
            var modalInstance = $uibModal.open({
                templateUrl: 'hierarchicalSelectBox.html',
                controller: 'HierarchicalSelectCtrlModalInstanceCtrl',
                keyboard: false,
                backdrop: 'static',
                size: 'lg',
                resolve: {
                    data: {
                        url: url,
                        selectData: $scope.data,
                        title: title
                    }
                }

            });
            modalInstance.result.then(function(selectedItem) {
                $scope.data = selectedItem;
            });
        };


    };

    HierarchicalSelectCtrlModalInstanceCtrl.$inject = ['$scope', '$uibModalInstance', '$state', '$http', 'data'];

    function HierarchicalSelectCtrlModalInstanceCtrl($scope, $uibModalInstance, $state, $http, data) {
        console.log(data);

        $scope.title = data.title;

        $scope.selectData = data.selectData || [];

        getData(0, 1);

        function getData(parentId, type) {

            var param = {
                parentId: parentId
            };

            $http.post(data.url, param)
                .then(getListsComplete)
                .catch(getListsFailed);

            function getListsComplete(response) {
                if (response.data.resultCode == 1) {
                    if (type == 1) {
                        $scope.list1 = response.data.data;
                        $scope.list2 = [];
                        $scope.list3 = [];
                    } else if (type == 2) {
                        $scope.list2 = response.data.data;
                        $scope.list3 = [];
                    } else if (type == 3) {
                        $scope.list3 = response.data.data;
                    }
                }
            };

            // 检测错误
            function getListsFailed(error) {

                console.warn('请求失败.' + error.data);
            };

        }

        $scope.getData = getData;


        $scope.cancel = function(argument) {
            $uibModalInstance.dismiss('cancel');
        }


        $scope.select = function(item) {
            if ($scope.checkSelect(item.id)) {
                for (var i = 0; i < $scope.selectData.length; i++) {
                    if (item.id == $scope.selectData[i].id) {
                        $scope.selectData.splice(i, 1);
                        break;
                    }
                }
            } else {
                $scope.selectData.push(item);
            }
        };

        $scope.checkSelect = function(itemId) {
            for (var i = 0; i < $scope.selectData.length; i++) {
                if (itemId == $scope.selectData[i].id)
                    return true;
            }
            return false;
        };

        $scope.sure = function() {
            $uibModalInstance.close($scope.selectData);
        }


        $scope.addSelectedClass = function(index, type) {

            var list = [];

            if (type == 1) {
                list = $scope.list1;
            } else if (type == 2) {
                list = $scope.list2;
            } else if (type == 3) {
                list = $scope.list3;
            }

            for (var i = 0; i < list.length; i++) {
                if (index == i) {
                    list[i].isSelected = true;
                } else {
                    list[i].isSelected = false;
                }

            }
        }

    }

})();
