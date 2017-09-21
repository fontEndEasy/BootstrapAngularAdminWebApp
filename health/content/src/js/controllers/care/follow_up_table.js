'use strict';
//日程题库
app.controller('FollowUpTableCtrl', function($rootScope, $scope, $state, $http, $compile, utils, $modal, toaster) {

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
                tmpType: 2
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
        console.log(info.id);
        $scope.diseaseNameSelected = info.name;
        $http.post(app.yiliao + 'pack/followReForm/findFollowUpTemplates', {
            access_token: app.url.access_token,
            groupId: app.url.groupId(),
            categoryId: info.id
        }).
        then(function(rpn) {
            if (rpn.data.resultCode === 1) {
                dataTable(rpn.data.data);
            } else {
                toaster.pop('error', null, rpn.data.resultMsg);
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
                    data: null,
                    title: "编号",
                    createdCell: function(nTd, sData, oData, iRow, iCol) {
                        var startnum = this.api().page() * (this.api().page.info().length);
                        $(nTd).html(iRow + 1 + startnum);
                    }
                }, {
                    data: 'name'
                }, {
                    data: null,
                    "defaultContent": "<button class='btn btn-xs btn-primary text-xs view'>详情</button>  <button class='btn btn-xs btn-danger text-xs del'>删除</button>"
                }],
                "createdRow": function(nRow, aData, iDataIndex) {
                    $(nRow).on('click', 'button.view', function() {
                        $state.go('app.new_follow_up', {
                            planId: aData.id
                        });
                    });
                    $(nRow).on('click', 'button.del', function() {

                        $http.post(app.url.care.deleteFollowUpTemplate, {
                            access_token: app.url.access_token,
                            tmplateId: aData.id
                        }).
                        then(function(rpn) {
                            if (rpn.data.resultCode === 1) {
                                toaster.pop('error', null, '删除成功');
                                setTable(info);
                            } else {
                                toaster.pop('error', null, rpn.data.resultMsg);
                            }

                        });
                    });
                }
            });
        }
    };

    // 添加随访
    $scope.addFollow = function(data) {

        $state.go('app.new_follow_up');
        // var modalInstance = $modal.open({
        //     animation: true,
        //     templateUrl: 'viewPopCtrl.html',
        //     controller: 'viewPopCtrl',
        //     size: 'lg'
        // });
    };

    // 查看随访详情
    function getView(data) {

        console.log(data);
        var viewData = {};

        //获取题库详情数据
        $http.post(app.yiliao + 'pack/care/queryCareTemplateItemDetailByCare', {
            access_token: app.url.access_token,
            templateId: data.templateId
        }).
        then(function(rpn) {
            console.log(rpn.data);

            viewData = {
                name: data.careName,
                info: null,
            }

            if (rpn.data.resultCode === 1) {

                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'myModalContent.html',
                    controller: 'ifonPopCtrl',
                    size: ['100', '30'],
                    resolve: {
                        viewData: function() {
                            return rpn.data.data;
                        }
                    }
                });

            } else {
                toaster.pop('error', null, rpn.data.resultMsg);
            }
        });
    };
})

//添加随访
app.controller('viewPopCtrl', function($rootScope, $scope, $modalInstance, $state, $http, utils, toaster) {
    $scope.viewName = "添加随访"
    var care_plan_disease = null;
    //生成病种树
    function setTree(argument) {
        var contacts = new Tree('sch_list', {
            hasCheck: false,
            arrType: [0, 0],
            data: {
                url: app.yiliao + 'base/getDiseaseTree'
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
                click: setTable
            },
            callback: function() {
                var dts = contacts.tree.find('dt');
                //默认获取等一个子节点数据
                for (var i = 0; i < dts.length; i++) {
                    if (dts.eq(i).data().info.leaf) {
                        setTable(dts.eq(i).data().info);
                        return;
                    }
                }
            }
        });
        var datable = null;
        setTable({});
        //获取表格
        function setTable(info) {
            $scope.diseaseNameSelected = info.name;
            //选择父节点
            if (!info.leaf) {
                return;
            }
            if (!info.id) {
                return toaster.pop('error', null, '缺少参数：病种ID');
            }
            $http.post(app.yiliao + 'pack/care/queryCareTemplateItem', {
                access_token: app.url.access_token,
                categoryId: info.id,
                type: 5
            }).
            then(function(rpn) {
                console.log(rpn.data);
                if (rpn.data.resultCode === 1) {
                    dataTable(rpn.data.data);
                } else {
                    toaster.pop('error', null, rpn.data.resultMsg);
                }

            });

            function dataTable(data) {
                if (datable) { //表格是否已经初始化
                    datable.fnClearTable(); //清理表格数据
                }
                datable = $('#listDatable').dataTable({
                    "language": app.lang.datatables.translation,
                    "ordering": false,
                    "searching": false,
                    "bDestroy": true, //可重新初始化
                    "lengthMenu": [10, 15, 20, 30, 40, 50, 100],
                    "bLengthChange": false,

                    data: data,
                    columns: [{
                        data: null,
                        title: "编号",
                        createdCell: function(nTd, sData, oData, iRow, iCol) {
                            var startnum = this.api().page() * (this.api().page.info().length);
                            $(nTd).html(iRow + 1 + startnum);
                        }
                    }, {
                        data: 'ghnrContent'
                    }, {
                        data: null,
                        "defaultContent": "<button class='btn btn-primary text-xs btn-xs'>添加</button>"
                    }],
                    "createdRow": function(nRow, aData, iDataIndex) {
                        $(nRow).on('click', 'button', function() {
                            addFollow(aData);
                        });
                    }
                });
            };

            function addFollow(data) {
                console.log(data);
                $http.post(app.yiliao + 'pack/care/saveCareTemplateByCare', {
                    access_token: app.url.access_token,
                    categoryId: info.id,
                    type: 2,
                    groupId: app.url.groupId(),
                    careName: data.ghnrContent,
                    cares: [
                        data.ghnrId
                    ]
                }).
                then(function(rpn) {
                    console.log(rpn.data);
                    if (rpn.data.resultCode === 1) {
                        toaster.pop('success', null, '添加成功');
                    } else {
                        toaster.pop('error', null, rpn.data.resultMsg);
                    }

                });
            }
        };
    }

    $scope.add = function() {
        if (!care_plan_disease) {
            toaster.pop('error', null, '请选择正确的病种');
        } else {
            //初始化量表
            if ($rootScope.care_plan_depots) {
                $rootScope.care_plan_depots = {
                    depot1: [],
                    depot2: [],
                    depot3: [],
                    depot4: []
                }
            }
            $rootScope.care_plan_disease = care_plan_disease;
            $modalInstance.dismiss('cancel');
        }
    }

    setTimeout(setTree, 0);

    $scope.cancel = function() {
        // 添加随机数刷新页面
        $state.go('app.follow_up_table', {
            planId: Math.round(Math.random() * 9000)
        });
        // $scope.$apply();
        $modalInstance.dismiss('cancel');
    };
});

//详情弹窗
app.controller('ifonPopCtrl', function($rootScope, $scope, $modalInstance, $sce, $state, $http, utils, toaster, viewData) {

    //处理html
    $scope.setHtml = function(str) {
        str = str.replace(/\([^\)]*\)/g, " ( <input class='text-base' type='text' placeholder='答案' > ) ");
        var reg = new RegExp("\n", "g");
        str = str.replace(reg, "</br>");
        return $sce.trustAsHtml(str);
    }

    $scope.viewData = viewData;
    console.log($scope.viewData);

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

    $scope.delete = function() {
        console.log(viewData.templateId);
        $http.post(app.yiliao + 'pack/care/deleteCareTempateByCare', {
            access_token: app.url.access_token,
            templateId: viewData.templateId
        }).
        then(function(rpn) {
            if (rpn.data.resultCode === 1) {
                $modalInstance.dismiss('cancel');
                $state.go('app.follow_up_table', {
                    planId: Math.round(Math.random() * 9000)
                });
                toaster.pop('success', null, '删除成功');
            } else {
                toaster.pop('error', null, rpn.data.resultMsg);
            }

        });
    };
});


//关怀计划列表
app.controller('FollowUpLibraryCtrl', function($scope, $state, $http, toaster) {
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
            url: app.yiliao + 'group/stat/getDiseaseTypeTree4Follow',
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

        $http.post(app.urlRoot + 'designer/getFollowPlans', {
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
