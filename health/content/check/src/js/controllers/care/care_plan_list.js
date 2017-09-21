'use strict';
//健康关怀列表
app.controller('CarePlanListCtrl', function($rootScope, $scope, $state, $http, $compile, utils, modal, toaster) {

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
            url: app.url.care.getDiseaseTypeTree,
            param: {
                access_token:  app.url.access_token || localStorage.getItem('check_access_token'),
                //groupId: localStorage.getItem('curGroupId'),
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
        console.log(info.id);
        $scope.diseaseNameSelected = info.name;
        //选中父节点 root 例外
        // if (info.id != 0) {
        //     return;
        // }
        // if (!info.id && info.id != 0) {
        //     return toaster.pop('error', null, '缺少参数：病种ID');
        // }

        $http.post(app.url.care.queryCareTemplate, {
            access_token:  app.url.access_token || localStorage.getItem('check_access_token'),
            categoryId: info.id,
            tmpType: 1,
            //groupId: localStorage.getItem('curGroupId')
        }).
        then(function(rpn) {
            console.log(rpn.data);
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
