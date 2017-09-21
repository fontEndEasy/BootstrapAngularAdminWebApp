(function() {
    angular.module('app')
        .factory('ChooseDepartmentFactory', ChooseDepartmentFactory);

    // 手动注入依赖
    ChooseDepartmentFactory.$inject = ['$http', '$modal'];

    function ChooseDepartmentFactory($http, $modal) {
        return {
            open: openModel
        };

        // 打开选择窗口
        function openModel(callback) {
            var modalInstance = $modal.open({
                templateUrl: function() {
                    var isChack = window.location.href.indexOf('/check/');
                    if (isChack != -1)
                        return '../components/chooseDepartment/chooseDepartmentView.html';
                    else
                        return 'components/chooseDepartment/chooseDepartmentView.html';
                }(),
                controller: 'ChooseDepartmentCtrl',
                size: 'md'
            });

            modalInstance.result.then(function(department) {
                if (callback)
                    callback(department);
            });
        }

    };

    angular.module('app')
        .controller('ChooseDepartmentCtrl', ChooseDepartmentCtrl);

    function ChooseDepartmentCtrl($http, $modalInstance, $scope) {
        var department = {
            departmentLableName: '',
            departmentLable: ''
        }

        //生成病种树
        function setTree(argument) {
            var contacts = new Tree('sch_cnt_list', {
                hasCheck: false,
                allCheck: false,
                multiple: false,
                allHaveArr: false,
                self: true,
                search: false,
                arrType: [0, 0],
                data: {
                    url: app.url.yiliao.getTypeByParent,
                    param: {
                        access_token: app.url.access_token,
                        parentId: null
                    }
                },
                datakey: {
                    id: 'id',
                    name: 'name',
                    sub: 'children'
                },
                info: {
                    name: 'name',
                    id: 'id',
                    pid: 'department',
                    leaf: 'leaf'
                },
                events: {
                    click: select
                },
                callback: function() {
                    // alert(1);
                }
            });

            function select(info) {
                department.departmentLable = info.id;
                department.departmentLableName = info.name;
            }
        }

        $scope.add = function() {
            $modalInstance.close(department);
        }

        setTimeout(setTree, 0);

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    };

})();
