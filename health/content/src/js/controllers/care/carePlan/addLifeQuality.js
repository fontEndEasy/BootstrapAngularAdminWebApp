(function() {
    angular.module('app')
        .factory('AddLifeQualityFtory', AddLifeQualityFtory)

    // 手动注入依赖
    AddLifeQualityFtory.$inject = ['$http', '$modal'];

    function AddLifeQualityFtory($http, $modal) {
        return {
            open: openModel
        };

        function openModel(lifeQualityData, callBack) {

            if (!lifeQualityData) lifeQualityData = {};

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: function() {
                    var isChack = window.location.href.indexOf('/check/');
                    if (isChack != -1)
                        return '../src/tpl/care/carePlan/addLifeQuality.html';
                    else
                        return 'src/tpl/care/carePlan/addLifeQuality.html';
                }(),
                controller: 'AddLifeQualityCtrl',
                size: 'lg',
                resolve: {
                    lifeQualityData: function() {
                        return lifeQualityData;
                    }
                }
            });
            modalInstance.result.then(function(lifeQualityData) {
                if (callBack)
                    callBack(lifeQualityData);
            });
        };

    };

    angular.module('app')
        .controller('AddLifeQualityCtrl', AddLifeQualityCtrl)

    function AddLifeQualityCtrl($scope, $http, $modal, $modalInstance, toaster, lifeQualityData) {
        $scope.selectItem = {};

        if (lifeQualityData) {
            $scope.selectItem = lifeQualityData.lifeScaleItem;
            $scope.lifeQualityData = lifeQualityData;
        }

        // 取消
        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };

        // 保存
        $scope.ok = function() {
            if (!$scope.selectItem.lifeScaleId)
                return toaster.pop('error', null, '请选择生活量表');
            submitLifeQualityData($scope.selectItem);
        };

        // 选择生活量表
        $scope.selectLifeQuality = function(item) {
            $scope.selectItem = {
                lifeScaleId: item.lifeScaleId
            };
        };

        // 提交生活量表
        function submitLifeQualityData(data) {

            var param = {
                access_token: app.url.access_token,
                sendTime: $scope.lifeQualityData.sendTime,
                carePlanId: $scope.lifeQualityData.carePlanId,

                schedulePlanId: $scope.lifeQualityData.schedulePlanId,
                dateSeq: $scope.lifeQualityData.dateSeq,
                jsonData: JSON.stringify({
                    lifeScaleId: data.lifeScaleId
                })
            };

            if ($scope.lifeQualityData.id)
                param.id = $scope.lifeQualityData.id;

            $http.post(app.urlRoot + 'designer/saveLifeScaleItem', param)
                .then(function(rpn) {
                    rpn = rpn.data;
                    if (rpn && rpn.resultCode == 1) {
                        toaster.pop('success', null, '添加成功');
                        $modalInstance.close(rpn.data);
                    } else if (rpn && rpn.resultMsg) {
                        toaster.pop('error', null, rpn.resultMsg);
                    } else {
                        toaster.pop('error', null, '获取计划数据出错');
                        console.error(rpn);
                    };
                });
        };

        //生成病种树
        function setTree() {
            var contacts = new Tree('lifeQualityLibraryTree', {
                hasCheck: false,
                allCheck: false,
                multiple: false,
                allHaveArr: false,
                self: true,
                search: false,
                arrType: [1, 0],
                data: {
                    url: app.yiliao + 'group/stat/getNewDiseaseTypeTree',
                    param: {
                        access_token: app.url.access_token,
                        groupId: app.url.groupId(),
                        tmpType: 1
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
                root: {
                    selectable: true,
                    name: '全部',
                    id: null
                },
                events: {
                    click: treeClick
                },
                callback: function() {
                    var dts = contacts.tree.find('dt');
                    // 默认获取root 全部 的数据
                    if (dts && dts.eq(0) && dts.eq(0).data() && dts.eq(0).data().info)
                        treeClick(dts.eq(0).data().info);
                }
            });
        };

        setTimeout(setTree, 0);

        function treeClick(info) {
            $scope.diseaseName = info.name;
            setTable(info.id);
        };

        $scope.diseaseTypeId = '';
        $scope.diseaseName = '';
        $scope.pageIndex = 1;
        $scope.pageSize = 10;

        function setTable(diseaseTypeId, pageIndex, pageSize) {

            $http.post(app.yiliao + 'designer/findLifeScaleIncludePlatform', {
                access_token: app.url.access_token,
                groupId: app.url.groupId(),
                diseaseTypeId: diseaseTypeId || $scope.diseaseTypeId || '',
                pageIndex: pageIndex - 1 || $scope.pageIndex - 1 || 0,
                pageSize: pageSize || $scope.pageSize || 10
            }).
            then(function(rpn) {
                rpn = rpn.data;
                if (rpn.resultCode === 1) {

                    $scope.surveyList = rpn.data.pageData;
                    $scope.page_count = rpn.data.total;

                } else if (rpn.resultMsg) {
                    toaster.pop('error', null, rpn.resultMsg);
                } else {
                    toaster.pop('error', null, '接口出错');
                };
            });
        };
        $scope.setTable = setTable;
        $scope.pageChanged = function() {
            setTable();
        };



    };

})();
