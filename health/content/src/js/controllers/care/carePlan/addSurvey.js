(function() {
    angular.module('app')
        .factory('AddSurveyFtory', AddSurveyFtory)

    // 手动注入依赖
    AddSurveyFtory.$inject = ['$http', '$modal'];

    function AddSurveyFtory($http, $modal) {
        return {
            open: openModel
        };

        function openModel(surveyData, callBack) {

            if (!surveyData) surveyData = {};

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: function() {
                    var isChack = window.location.href.indexOf('/check/');
                    if (isChack != -1)
                        return '../src/tpl/care/carePlan/addSurvey.html';
                    else
                        return 'src/tpl/care/carePlan/addSurvey.html';
                }(),
                controller: 'AddSurveyCtrl',
                size: 'lg',
                resolve: {
                    surveyData: function() {
                        return surveyData;
                    }
                }
            });
            modalInstance.result.then(function(surveyData) {
                if (callBack)
                    callBack(surveyData);
            });
        };

    };

    angular.module('app')
        .controller('AddSurveyCtrl', AddSurveyCtrl)

    function AddSurveyCtrl($scope, $http, $modal, $modalInstance, toaster, surveyData) {
        $scope.selectItem = {};

        if (surveyData) {
            $scope.selectItem = surveyData.surveyItem;
            $scope.surveyData = surveyData;
        }

        // 取消
        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };

        // 保存
        $scope.ok = function() {
            if (!$scope.selectItem.surveyId)
                return toaster.pop('error', null, '请选择调查表');
            submitsurveyData($scope.selectItem);
        };

        // 选择调查表
        $scope.selectLifeQuality = function(item) {
            $scope.selectItem = {
                surveyId: item.surveyId
            };
        };

        // 提交调查表
        function submitsurveyData(data) {

            var param = {
                access_token: app.url.access_token,
                sendTime: $scope.surveyData.sendTime,
                carePlanId: $scope.surveyData.carePlanId,

                schedulePlanId: $scope.surveyData.schedulePlanId,
                dateSeq: $scope.surveyData.dateSeq,
                jsonData: JSON.stringify({
                    surveyId: data.surveyId
                })
            };

            if ($scope.surveyData.id)
                param.id = $scope.surveyData.id;

            $http.post(app.urlRoot + 'designer/saveSurveyItem', param)
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
                        tmpType: 6
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

            $http.post(app.yiliao + 'designer/findSurveysIncludePlatform', {
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
