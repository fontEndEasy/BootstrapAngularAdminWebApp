'use strict';
//调查表列表
app.controller('SurveyLibraryCtrl', function($scope, $state, $http, toaster) {
    // console.log(1);

    //生成病种树
    var contacts = new Tree('sch_cnt_list', {
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
            treeClick(dts.eq(0).data().info);
        }
    });

    function treeClick(info) {
        $scope.diseaseName = info.name;
        setTable(info.id);
    };

    $scope.diseaseTypeId = '';
    $scope.diseaseName = '';
    $scope.pageIndex = 1;
    $scope.pageSize = 10;

    // 获取列表
    function setTable(diseaseTypeId, pageIndex, pageSize) {

        $http.post(app.yiliao + 'designer/findSurveys', {
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
                $scope.page_count = Math.ceil(rpn.data.total / $scope.pageSize);

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

    // 删除
    $scope.removeItem = function(surveyId, version) {
        $http.post(app.yiliao + 'designer/deleteSurvey', {
            access_token: app.url.access_token,
            surveyId: surveyId,
            version: version
        }).
        then(function(rpn) {
            rpn = rpn.data;
            if (rpn.resultCode === 1) {
                toaster.pop('success', null, '删除成功');
                setTable();
            } else if (rpn.resultMsg) {
                toaster.pop('error', null, rpn.resultMsg);
            } else {
                toaster.pop('error', null, '接口出错');
            };
        });
    };
});
