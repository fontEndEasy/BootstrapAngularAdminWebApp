'use strict';

app.controller('EvaluationByFinace', function($rootScope, $scope, $state, $http, utils, $modal, Doctor) {
    var dataTest = [{
        'id': 1,
        'name': '张三',
        'orders': 123,
        'income': 3000
    }, {
        'id': 2,
        'name': '李四',
        'orders': 13,
        'income': 1000
    }, {
        'id': 3,
        'name': '广五',
        'orders': 32,
        'income': 2000
    }];
    var ordersTest = {
        name: '张三',
        income: 3000,
        orders: [{
            'orderId': 10011256644563,
            'orderType': '电话咨询',
            'patientName': '王晓霞',
            'patientPhone': 13913965689,
            'orderTime': '2015-10-13 18:23',
            'orderAmount': 1000,
        }, {
            'orderId': 20011256644563,
            'orderType': '药费',
            'patientName': '李强',
            'patientPhone': 15913965689,
            'orderTime': '2015-10-11 18:23',
            'orderAmount': 2000,
        }]
    }

    // 查看某一信息
    $scope.seeDetails = function(id) {
        if (id) {
            $('#doctor_details').removeClass('hide');
            $rootScope.winVisable = true;
            Doctor.addData(id);
        }
    };

    // 初始化表格
    function initTable() {
        var index = 1,
            start = 0,
            length = 10,
            idx = 0,
            size = 50,
            num = 0;

        var setTable = function() {
            var dTable = $('#evaluationByFinace').dataTable({
                "language": app.lang.datatables.translation,
                "ordering": false,
                "searching": false,
                //"bLengthChange":false,

                "bAutoWidth": false, //自动计算宽度
                "draw": index,
                "displayStart": start,
                "lengthMenu": [10, 15, 20, 30, 40, 50, 100],
                "pageLength": length,
                "bServerSide": true,
                "sAjaxSource": app.urlRoot + 'group/stat/orderMoney',
                "fnServerData": function(sSource, aoData, fnCallback) {
                    num = 1;
                    idx = index - 1;
                    $.ajax({
                        "type": "post",
                        "url": sSource,
                        "dataType": "json",
                        "data": {
                            access_token: app.url.access_token,
                            groupId: localStorage.getItem('curGroupId'),
                            doctorId: null,
                            pageIndex: index - 1,
                            pageSize: aoData[4]['value']
                        },
                        "success": function(resp) {
                            console.log(resp);
                            var data = {};
                            data.recordsTotal = resp.data.total;
                            data.recordsFiltered = resp.data.total;
                            data.length = resp.data.pageSize;
                            data.data = resp.data.pageData;
                            for (var i = 0; i < data.data.length; i++) {
                                utils.extendHash(data.data[i], ["name", "amount", "hospital", "departments", "title", "money"]);
                            }
                            size = aoData[4]['value'];
                            fnCallback(data);
                        }
                    });
                },
                aoColumns: [{
                    "orderable": false,
                    "render": function(set, status, dt) {
                        return '<span class="text-num">' + (idx * size + num) + '</span>';
                    },
                    "searchable": false
                }, {
                    "orderable": false,
                    "render": function(set, status, dt) {
                        if (dt.headPicFileName) {
                            var path = dt.headPicFileName;
                        } else {
                            var path = 'src/img/a0.jpg';
                        }
                        return '<img class="a-link" src="' + path + '"/></a>';
                    },
                    "searchable": false
                }, {
                    "orderable": false,
                    "searchable": false,
                    "render": function(set, status, dt) {
                        return '<a class="a-link">' + dt.name + '</a>';
                    }
                }, {
                    data: 'hospital'
                }, {
                    data: 'departments'
                }, {
                    data: 'title'
                }, {
                    data: 'amount'
                }, {
                    data: 'money',
                    "orderable": true
                }, {
                    data: null,
                    "defaultContent": "<button class='btn btn-primary'>查 询</button>"
                }],
                "createdRow": function(nRow, aData, iDataIndex) {
                    var a_link = $(nRow).find('.a-link');
                    a_link.click(function() {
                        $scope.seeDetails(aData.id);
                    });
                    $(nRow).on('click', 'button', function() {
                        showPop(aData);
                    });
                    num++;
                }
            });

            // 表格事件处理,init-初始化完成,length-改变每页长度,page-翻页,search-搜索
            dTable.off().on('page.dt', function(e, settings) {
                length = settings._iDisplayLength;
                index = settings._iDisplayStart / length + 1;
                start = length * (index - 1);
                dTable.fnDestroy();
                setTable();
            }).on('length.dt', function(e, settings, len) {
                index = 1;
                start = 0;
                length = len;
                dTable.fnDestroy();
                setTable();
            });

        };
        setTable();
    }

    initTable();

    function showPop(docterData) {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'myModalContent.html',
            controller: 'getOrdersCtrl',
            size: 'lg',
            resolve: {
                docterData: function() {
                    return docterData;
                }
            }
        });
    };

});

app.controller('getOrdersCtrl', function($scope, $modalInstance, $http, utils, docterData, Doctor) {
    $scope.docName = docterData.name;
    $scope.docIncome = docterData.money;

    // 查看某一信息
    $scope.seeDetails = function(id) {
        if (id) {
            $('#doctor_details').removeClass('hide');
            $rootScope.winVisable = true;
            Doctor.addData(id);
        }
    };

    // 初始化表格
    function initTable() {
        var index = 1,
            start = 0,
            length = 10;

        var setTable = function() {
            var dTable = $('#ordersTable').dataTable({
                "language": app.lang.datatables.translation,
                "ordering": false,
                "searching": false,
                //"bLengthChange":false,

                "draw": index,
                "displayStart": start,
                "lengthMenu": [10, 15, 20, 30, 40, 50, 100],
                "pageLength": length,
                "bServerSide": true,
                "sAjaxSource": app.urlRoot + 'group/stat/orderMoney',
                "fnServerData": function(sSource, aoData, fnCallback) {
                    $.ajax({
                        "type": "post",
                        "url": sSource,
                        "dataType": "json",
                        "data": {
                            access_token: app.url.access_token,
                            groupId: localStorage.getItem('curGroupId'),
                            doctorId: docterData.id,
                            pageIndex: index - 1,
                            pageSize: aoData[4]['value']
                        },
                        "success": function(resp) {
                            var data = {};
                            data.recordsTotal = resp.data.total;
                            data.recordsFiltered = resp.data.total;
                            data.length = resp.data.pageSize;
                            data.data = resp.data.pageData;
                            console.log(resp);
                            console.log(data);
                            for (var i = 0; i < data.data.length; i++) {
                                utils.extendHash(data.data[i], ["orderNo", "packName", "name", "telephone"]);
                            }
                            fnCallback(data);
                        }
                    });
                },
                aoColumns: [{
                    data: 'orderNo',
                    "defaultContent": ''
                }, {
                    data: 'packName'
                }, {
                    data: 'name',
                    "orderable": false,
                    "searchable": false
                }, {
                    data: 'telephone'
                }, {
                    data: 'time',
                    "render": function(data) { // 返回自定义内容
                        if (data) {
                            return new Date(data).formatTime();
                        }
                        return '';
                    },
                    "orderable": true
                }, {
                    data: 'money'
                }]
            });

            // 表格事件处理,init-初始化完成,length-改变每页长度,page-翻页,search-搜索
            dTable.off().on('page.dt', function(e, settings) {
                length = settings._iDisplayLength;
                index = settings._iDisplayStart / length + 1;
                start = length * (index - 1);
                dTable.fnDestroy();
                setTable();
            }).on('length.dt', function(e, settings, len) {
                index = 1;
                start = 0;
                length = len;
                dTable.fnDestroy();
                setTable();
            });

        };
        setTable();
    }

    setTimeout(initTable, 0);
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});
