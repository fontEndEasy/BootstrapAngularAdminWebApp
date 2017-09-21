'use strict';

app.controller('OrderQuery', function ($rootScope, $scope, $state, $timeout, $http, utils, $stateParams, modal) {
    var url = app.url.order.findOrder,
        data = null;


    // 查看订单详情
    $scope.seeDetails = function (id) {
        if (id) {
            $('#list_wrapper').addClass('none');
            $state.go('app.order_query.order_details', {id: id}, {});
        }
    };

    ////////////////////////////////////////////////////////////

    // 初始化表格
    var doctorList, dTable, setTable, keyword, index = 1;

    function initTable() {
        var start = 0,
            length = 20;

        setTable = function () {
            doctorList = $('#order_list_got');
            dTable = doctorList.dataTable({
                "draw": index,
                "displayStart": start,
                "lengthMenu": [5, 10, 15, 20, 30, 40, 50, 100],
                "pageLength": length,
                "bServerSide": true,
                "sAjaxSource": url,
                "fnServerData": function (sSource, aoData, fnCallback) {
                    $http({
                        "method": "post",
                        "url": sSource,
                        "data": {
                            diseaseTel: keyword,
                            pageIndex: index - 1,
                            pageSize: aoData[4]['value'],
                            access_token: app.url.access_token
                        }
                    }).then(function (resp) {
                        var _dt = resp.data.data;
                        for (var i = 0; i < _dt.pageData.length; i++) {
                            utils.extendHash(_dt.pageData, ["doctorVo", "nurseVo", "userVo", "orderType", "userName", "orderStatus", "telephone", "patientName"]);
                            utils.extendHash(_dt.pageData[i].doctorVo, ["doctorName", "telephone"]);
                            utils.extendHash(_dt.pageData[i].nurseVo, ["name", "telephone"]);
                            utils.extendHash(_dt.pageData[i].userVo, ["userName"]);
                        }

                        resp.start = _dt.start;
                        resp.recordsTotal = _dt.total;
                        resp.recordsFiltered = _dt.total;
                        resp.length = _dt.pageSize;
                        resp.data = _dt.pageData;
                        fnCallback(resp);
                        if(_dt.total > 0){
                            $scope.hasResult = true;
                        }else{
                            $scope.hasResult = false;
                            $scope.queryResult = '没有找到相关数据！';
                        }
                    });
                },
                "searching": false,
                "language": app.lang.datatables.translation,
                "createdRow": function (nRow, aData, iDataIndex) {
                    $(nRow).attr('data-id', aData['userId']).click(aData, function (param, e) {
                        if(param.data.orderType != '6'){
                            modal.toast.warn('目前只能查看护士订单！');
                        }else{
                            $scope.seeDetails(param.data.orderId);
                        }
                    });
                },
                "columns": [{
                    "data": "orderNo",
                    "orderable": false
                }, {
                    "data": "orderType",
                    "orderable": false,
                    "render": function(dt, e, data){
                        return dt == '1' ? '咨询套餐' : dt == '2' ? '报到套餐' : dt == '3' ? '门诊套餐' : dt == '4' ? '健康关怀套餐' : dt == '5' ? '随访套餐' : '直通车套餐';
                    }
                }, {
                    "orderable": false,
                    "render": function(dt, e, data){
                        if(data.doctorVo && data.doctorVo.doctorName){
                            return data.doctorVo.doctorName;
                        }else if(data.nurseVo && data.nurseVo.name){
                            return data.nurseVo.name;
                        }else{
                            return '';
                        }
                    }
                }, {
                    "data": "doctorVo.telephone",
                    "orderable": false
                }, {
                    "data": "userVo.userName",
                    "orderable": false
                }, {
                    "data": "patientName",
                    "orderable": false
                }, {
                    "data": "telephone",
                    "orderable": false
                }, {
                    "data": "orderStatus",
                    "orderable": false,
                    "render": function(dt, e, data){
                        return dt == '2' ? '待支付' : dt == '3' ? '已支付' : dt == '4' ? '已完成' : dt == '5' ? '已取消' : dt == '6' ? '进行中' : dt == '10' ? '预约成功' : '';
                    }
                }]
            });

            // 表格事件处理,init-初始化完成,length-改变每页长度,page-翻页,search-搜索
            dTable.off().on('init.dt', function () {
                $('.input-sm').trigger('focus');
            }).on('length.dt', function (e, settings, len) {
                index = 1;
                start = 0;
                length = len;
                dTable.fnDestroy();
                setTable();
                utils.localData('page_length', len);
            }).on('page.dt', function (e, settings) {
                index = settings._iDisplayStart / length + 1;
                start = length * (index - 1);
                dTable.fnDestroy();
                utils.localData('page_index', index);
                utils.localData('page_start', start);
                setTable();
            });
        };
    }

    initTable();

    $scope.search = function () {
        if(!$scope.keyword && $scope.keyword != '0'){
            return;
        }
        keyword = $scope.keyword;
        if(dTable){
            dTable.fnDestroy();
        }
        $scope.queryResult = '';
        index = 1;
        setTable();
    }

});