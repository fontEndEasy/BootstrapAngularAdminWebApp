'use strict';
//日程题库
app.controller('ReserveSfScheduleCtrl', function($rootScope, $scope, $state, $http, $compile, utils, $modal, toaster) {

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
                access_token: app.url.access_token || localStorage.getItem('check_access_token'),
                //groupId: localStorage.getItem('curGroupId'),
                tmpType: 4
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

        $http.post(app.url.care.queryCareTemplateItem, {
            access_token: app.url.access_token || localStorage.getItem('check_access_token'),
            categoryId: info.id,
            type: 2
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
        $http.post(app.url.care.findCareTemplateById, {
            access_token: app.url.access_token || localStorage.getItem('check_access_token'),
            careId: data.ghnrId,
            type: 2
        }).
        then(function(rpn) {
            if (rpn.data.resultCode === 1) {

                //拼接问题详情
                viewData = {
                    ghnrId: data.ghnrId,
                    ghnrContent: data.ghnrContent,
                    answerTemplates: rpn.data.data.answerTemplates
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
