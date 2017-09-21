'use strict';
//生活量表库
app.controller('QuestionsOfLifeCtrl', function($rootScope, $scope, $state, $http, $compile, utils, $modal, toaster) {

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
            url: app.yiliao + 'group/stat/getDiseaseTypeTree',
            param: {
                access_token: app.url.access_token,
                groupId: app.url.groupId(),
                tmpType: 5
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
            click: setTable
        },
        callback: function() {
            var dts = contacts.tree.find('dt');
            // //默认获取等一个子节点数据
            // for (var i = 0; i < dts.length; i++) {
            //     if (dts.eq(i).data().info.leaf) {
            //         setTable(dts.eq(i).data().info);
            //         return;
            //     }
            // }
            // 默认获取root 全部 的数据
            setTable(dts.eq(0).data().info);
        }
    });

    var datable = null;
    setTable({});
    //获取表格
    function setTable(info) {
        $scope.diseaseNameSelected = info.name;
        //选中父节点 root 例外
        // if (!info.leaf && info.id != 0) {
        //     return;
        // }
        // if (!info.id && info.id != 0) {
        //     return toaster.pop('error', null, '缺少参数：病种ID');
        // }

        $http.post(app.yiliao + 'pack/care/queryCareTemplateItem', {
            access_token: app.url.access_token,
            categoryId: info.id,
            type: 3
        }).
        then(function(rpn) {
            if (rpn.data.resultCode === 1) {
                dataTable(rpn.data.data);
            } else {
                toaster.pop('error', null, '获取失败');
            }

        });

        function dataTable(data) {
            if (datable) { //表格是否已经初始化
                datable.fnClearTable(); //清理表格数据
            }
            datable = $('#planListDatable').dataTable({
                "language": app.lang.datatables.translation,
                "ordering": false,
                "searching": false,
                "bDestroy": true, //可重新初始化
                "lengthMenu": [5, 10, 15, 20, 30, 40, 50, 100],

                data: data,
                columns: [
                    // { data: 'ghnrId' },
                    {
                        data: 'ghnrContent'
                    }, {
                        data: null,
                        "defaultContent": "<button class='btn btn-xs btn-primary text-xs'>详情</button>"
                    }
                ],
                "createdRow": function(nRow, aData, iDataIndex) {
                    $(nRow).on('click', 'button', function() {
                        getView(aData);
                    });
                }
            });
        }
    };

    function getView(data) {

        var viewData = {};

        //获取题库详情数据
        $http.post(app.yiliao + 'pack/care/findCareTemplateById', {
            access_token: app.url.access_token,
            careId: data.ghnrId,
            type: 3
        }).
        then(function(rpn) {
            if (rpn.data.resultCode === 1) {

                //拼接问题详情
                viewData = {
                    ghnrId: data.ghnrId,
                    ghnrContent: data.ghnrContent,
                    answerTemplates: rpn.data.data.answerTemplates,
                    assessResults: rpn.data.data.assessResults
                }
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'myModalContent.html',
                    controller: 'viewPopCtrl',
                    size: ['100', '30'],
                    resolve: {
                        viewData: function() {
                            return viewData;
                        }
                    }
                });

            } else {
                toaster.pop('error', null, '获取失败');
            }
        });
    };
})

//详情弹窗
app.controller('viewPopCtrl', function($rootScope, $scope, $modalInstance, $http, utils, viewData) {

    $scope.viewData = viewData;

    console.log($scope.viewData)

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});

//生活量表列表
app.controller('lifeQualityLibraryCtrl', function($scope, $state, $http, toaster) {
    // console.log(1);

    //生成病种树
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

    function setTable(diseaseTypeId, pageIndex, pageSize) {

        $http.post(app.yiliao + 'designer/findLifeScale', {
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
    $scope.removeItem = function(lifeScaleId, version) {
        $http.post(app.yiliao + 'designer/deleteLifeScale', {
            access_token: app.url.access_token,
            lifeScaleId: lifeScaleId,
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
