'use strict';
//健康关怀列表
app.controller('CarePlanListCtrl', function($rootScope, $scope, $state, $http, $compile, utils, modal, toaster) {
    console.log(1);
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
        // if (info.id != 0) {
        //     return;
        // }
        // if (!info.id && info.id != 0) {
        //     return toaster.pop('error', null, '缺少参数：病种ID');
        // }

        $http.post(app.yiliao + 'pack/care/queryCareTemplate', {
            access_token: app.url.access_token,
            categoryId: info.id,
            tmpType: 1,
            groupId: app.url.groupId()
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
                "lengthMenu": [10, 15, 20, 30, 40, 50, 100],

                data: data,
                columns: [{
                    data: 'careName',
                    "defaultContent": '/'
                }, {
                    data: 'price',
                    "render": function(set, status, dt) {
                        return dt.price / 100;
                    }
                }, {
                    data: null,
                    "defaultContent": "<button class='btn btn-xs btn-primary text-xs'>详情</button>"
                }],
                "createdRow": function(nRow, aData, iDataIndex) {
                    $(nRow).on('click', 'button', function() {
                        console.log(aData.templateId);
                        $state.go('app.edit_plan', {
                            planId: aData.templateId
                        });
                    });
                }
            });
        }
    };

    $scope.newPlan = function() {
        $state.go('app.new_plan');
    }
});

//关怀计划列表
app.controller('CarePlanLibraryCtrl', function($scope, $state, $http, toaster) {
    // console.log(1);

    //生成病种树
    var contacts = new Tree('CarePlanLibraryTree', {
        hasCheck: false,
        allCheck: false,
        multiple: false,
        allHaveArr: false,
        self: true,
        search: false,
        arrType: [1, 0],
        data: {
            url: app.yiliao + 'group/stat/getDiseaseTypeTree4CareNew',
            param: {
                access_token: app.url.access_token,
                groupId: app.url.groupId()
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

    function treeClick(info) {
        $scope.diseaseName = info.name;
        setTable(info.id);
    };

    $scope.diseaseTypeId = '';
    $scope.diseaseName = '';
    $scope.pageIndex = 1;
    $scope.pageSize = 10;

    function setTable(diseaseTypeId, pageIndex, pageSize) {

        $http.post(app.urlRoot + 'designer/getCarePlans', {
            access_token: app.url.access_token,
            groupId: app.url.groupId(),
            diseaseTypeId: diseaseTypeId || $scope.diseaseTypeId || '',
            pageIndex: pageIndex - 1 || $scope.pageIndex - 1 || 0,
            pageSize: pageSize || $scope.pageSize || 10
        }).
        then(function(rpn) {
            rpn = rpn.data;
            if (rpn.resultCode === 1) {

                $scope.planList = rpn.data.pageData;
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

    // 删除
    $scope.enable = function(planId, status) {
        $http.post(app.yiliao + 'designer/enable', {
            access_token: app.url.access_token,
            carePlanId: planId,
            status: status
        }).
        then(function(rpn) {
            rpn = rpn.data;
            if (rpn.resultCode === 1) {
                var tip = '成功禁用';
                if (status == 1)
                    tip = '成功启用';
                toaster.pop('success', null, tip);
                setTable();
            } else if (rpn.resultMsg) {
                toaster.pop('error', null, rpn.resultMsg);
            } else {
                toaster.pop('error', null, '接口出错');
            };
        });
    };
});
