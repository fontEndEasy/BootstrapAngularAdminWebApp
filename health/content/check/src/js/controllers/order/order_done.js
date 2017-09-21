'use strict';

app.controller('OrderDone', function ($rootScope, $scope, $state, $timeout, $http, utils, modal, $modal) {
    var url = app.url.order.findOrder, // 后台API路径
        data = null,
        html = $('html'),
        body = $('body'),
        type = '',
        pack = '',
        status = '',
        name = '',
        phone = '';

    if ($rootScope.pageName !== 'list_undone') {
        utils.localData('page_index', null);
        utils.localData('page_start', null);
        //utils.localData('page_length', null);
        $rootScope.pageName = 'list_undone';
        $rootScope.scrollTop = 0;
    }

    // 编辑某一审核信息
    $scope.seeDetails = function (orderId, callback) {
        if (orderId) {
            $http({
                url: app.url.order.callByOrder,
                method: 'post',
                data: {
                    access_token: app.url.access_token,
                    orderId: orderId
                }
            }).then(function (resp) {
                if (resp.data.resultCode === 1 && resp.data.data.resp.respCode === '000000') {
                    modal.toast.success(resp.data.resultMsg);
                    callback.call();
                } else {
                    modal.toast.error(resp.data.resultMsg);
                }
            });
        }
    };

    // 订单查询
    $scope.queryOrder = function () {
        var orderType = $('#orderType');
        var orderStatus = $('#orderStatus');
        var userName = $('#userName');
        var telephone = $('#telephone');

        if(userName.val()){
            name = userName.val();
        }else{
            name = null;
        }
        if(telephone.val()){
            phone = telephone.val();
        }else{
            phone = null;
        }

        if(orderType.val() == '图文咨询'){
            pack = 1;
            type = 1;
        } else if(orderType.val() == '电话咨询'){
            pack = 2;
            type = 1;
        } else if(orderType.val() == '患者报道'){
            type = 2;
        } else if(orderType.val() == '门诊'){
            type = 3;
        } else if(orderType.val() == '健康关怀'){
            type = 4;
        } else if(orderType.val() == '随访计划'){
            type = 5;
        } else {
            type = '';
        }


        if(orderStatus.val() == '已支付'){
            status = 3;
        } else if(orderStatus.val() == '已完成'){
            status = 4;
        } else if(orderStatus.val() == '已取消'){
            status = 5;
        } else {
            status = '';
        }

        dTable.fnDestroy();
        index = 1;
        start = 0;
        setTable();
    };

    ////////////////////////////////////////////////////////////

    // 初始化表格
    var doctorList, dTable, setTable, index, start, length;

    function initTable() {
        index = utils.localData('page_index') * 1 || 1;
        start = utils.localData('page_start') * 1 || 0;
        length = utils.localData('page_length') * 1 || 50;

        setTable = function () {
            doctorList = $('#orderList_undone');
            dTable = doctorList.dataTable({
                "draw": index,
                "displayStart": start,
                "lengthMenu": [5, 10, 15, 20, 30, 40, 50, 100],
                "pageLength": length,
                "bServerSide": true,
                "sAjaxSource": url,
                "fnServerData": function (sSource, aoData, fnCallback) {
                    var param = {
                        pageIndex: index - 1,
                        pageSize: aoData[4]['value'],
                        access_token: app.url.access_token
                    };
                    if(type){
                        if(type == '1'){
                            param.packType = pack;
                        }else{
                            param.orderType = type;
                        }
                    }
                    if(status){
                        param.orderStatus = status;
                    }else{
                        //param.payType = 2;
                    }
                    //param.payType = 2;
                    if(name){
                        param.userName = name;
                    }
                    if(phone){
                        param.telephone = phone;
                    }
                    $http({
                        "method": "post",
                        "url": sSource,
                        "data": param
                    }).then(function (resp) {
                        var _dt = resp.data.data;
                        for (var i = 0; i < _dt.pageData.length; i++) {
                            utils.extendHash(_dt.pageData[i], ["doctorVo", "userVo", "doctorGroup", "orderType", "money", "relation", "patientName", "orderStatus", "refundStatus", "payTime"]);
                            utils.extendHash(_dt.pageData[i].doctorVo, ["doctorPath", "doctorName"]);
                            utils.extendHash(_dt.pageData[i].userVo, ["userName"]);
                        }
                        resp.start = _dt.start;
                        resp.recordsTotal = _dt.total;
                        resp.recordsFiltered = _dt.total;
                        resp.length = _dt.pageSize;
                        resp.data = _dt.pageData;
                        fnCallback(resp);

                        // 更新界面中的数据
                        if(!status){
                            $('#order_done').html(resp.recordsTotal);
                            utils.localData('order_done', resp.recordsTotal);
                        }
                    });
                },
                "searching": false,
                "language": app.lang.datatables.translation,
                "createdRow": function (nRow, aData, iDataIndex) {
                    $(nRow).on('click', 'button', aData, function (e) {

/*                        $http({
                            url: app.url.order.updateRefundByOrder,
                            method: 'post',
                            data: {
                                access_token: app.url.access_token,
                                orderIds: [e.data.orderId]
                            }
                        }).then(function (resp) {
                            if (resp.data.resultCode == '1') {
                                window.open('url', '退款', 'windowFeatures', false);
                                return;
                                modal.toast.success(resp.data.data);
                                _this.parent().prev().html('已取消');
                                _this.parent().html('已退款');
                                pop_win.dismiss('cancel');
                            } else {
                                modal.toast.warn(resp.data.resultMsg);
                                pop_win.dismiss('cancel');
                            }
                        }, function (resp) {
                            modal.toast.error('服务端请求错误！');
                        });*/

                        ////////////////////////////////////////////////////

                        var _this = $(this);
                        $scope.doIt = function() {
                            $http({
                                //url: app.url.order.updateRefundByOrder,
                                url: 'http://120.24.94.126/health/pack/order/updateRefundByOrder?access_token=3f736d7bf77d4639ba3a8100ef06b93f&orderIds[0]=9993',
                                method: 'post',
                                data: {
                                    access_token: app.url.access_token,
                                    orderId: e.data.orderId
                                }
                            }).then(function (resp) {
                                if (resp.resultCode == '1') {
                                    var dt = resp.data;
                                    document.write(resp.data);
                                    //info.innerHTML = dt.html;
                                } else {
                                    alert(resp.resultMsg);
                                }
                                return;
                                if (resp.data.resultCode == '1') {
                                    modal.toast.success(resp.data.data);
                                    _this.parent().prev().html('已取消');
                                    _this.parent().html('已退款');
                                    pop_win.dismiss('cancel');
                                } else {
                                    modal.toast.warn(resp.data.resultMsg);
                                    pop_win.dismiss('cancel');
                                }
                            }, function (resp) {
                                modal.toast.error('服务端请求错误！');
                            });
                        };


                        var frm_str = '<iframe id="frm_pop" style="width: 980px;height:680px;border:none;"></iframe>'
                        //var frm = document.createElement('iframe');

                        var ids = [9993,10223,10228];

                        $http({
                            url: app.url.order.updateRefundByOrder,
                            data: {
                                access_token: app.url.access_token,
                                //orderIds: ids
                                orderIds: [e.data.orderId]
                            },
                            method: 'post',
                        }).then(function(resp){
                            if (resp.data.resultCode == '1') {
                                modal.confirm('退款操作', frm_str, function(){
                                    dTable.fnDestroy();
                                    setTable();
                                });
                                var frm = document.getElementById('frm_pop');
                                frm.contentWindow.document.write(resp.data.data);
                                /*setTimeout(function(){
                                    $(frm).scrollTop(200);
                                    //frm.contentWindow.scrollTo(0, 200);
                                }, 3000)*/

                            } else {
                                alert(resp.data.resultMsg);
                            }
                        });



                        return;

                        $scope.exit = function() {
                            pop_win.dismiss('cancel');
                        };

                        var pop_win = $modal.open({
                            animation: true,
                            template: '<div class="modal-body text-center text-lg">请先给患者<span class="text-info" title="转账或打款"> [ 退款 ] <i class="glyphicon glyphicon-question-sign text-xs"></i> </span>后再到这里“确认”<span class="text-primary" title="仅是流程操作">[ 退款 ] <i class="glyphicon glyphicon-question-sign text-xs"></i> </span>。</div><div class="modal-footer"><div class="col-md-offset-3 col-md-3"><button class="btn btn-danger w100" type="button" ng-click="doIt()">确 认</button></div><div class="col-md-3"><button class="btn btn-default w100" type="button" ng-click="exit()">取 消</button></div></div>',
                            //controller: 'Refund',
                            size: 'xs',
                            scope: $scope,
                            resolve: {
                                item: function() {
                                    return data;
                                }
                            }
                        });


                    });
                },
                "columns": [{
                    "data": "orderNo",
                    "orderable": false
                }, {
                    "data": "doctorVo.doctorName",
                    "orderable": false
                }, {
                    "data": "patientName",
                    "orderable": false,
                    "searchable": false
                }, {
                    "data": "relation",
                    "orderable": false,
                    "searchable": false
                }, {
                    "data": "userVo.userName",
                    "orderable": false,
                    "searchable": false
                }, {
                    "data": "orderType",
                    "orderable": false,
                    "searchable": false,
                    "render": function (data, setting, dt) {
                        if(data == '1'){
                            if(dt.packType == '1'){
                                return '图文咨询';
                            }else{
                                return '电话咨询';
                            }
                        }else if(data == '2'){
                            return '患者报道';
                        }else if(data == '3'){
                            return '门诊';
                        }else if(data == '4'){
                            return '健康关怀';
                        }else{
                            return '随访计划';
                        }
                    }
                }, {
                    "data": "money",
                    "orderable": false,
                    "searchable": false,
                    "render": function (data) {
                        if(data && data > 0){
                            return data / 100;
                        }else{
                            return '--';
                        }
                    }
                }, {
                    "data": "payTime",
                    "orderable": false,
                    "searchable": false,
                    "render": function (data) {
                        if(data && data.length !== 0){
                            return utils.dateFormat(data, 'yyyy年MM月dd日 hh点mm分');
                        }else{
                            return '--';
                        }
                    }
                }, {
                    "data": "payType",
                    "orderable": false,
                    "searchable": false,
                    "render": function (data) {
                        if(data == '1'){
                            return '微信支付';
                        }else if(data == '2'){
                            return '支付宝';
                        }else{
                            return '未知';
                        }
                    }
                }, {
                    "data": "orderStatus",
                    "orderable": false,
                    "searchable": false,
                    "render": function (data) {
                        if(data == '1'){
                            return '待预约';
                        }else if(data == '2'){
                            return '待支付';
                        }else if(data == '3'){
                            return '已支付';
                        }else if(data == '4'){
                            return '已完成';
                        }else{
                            return '已取消';
                        }
                    }
                }, {
                    "data": 'refundStatus',
                    "orderable": false,
                    "searchable": false,
                    "render": function (data, d, set) {
                        if(data == '3'){
                            return '已退款';
                        }else if(set.orderStatus == '4'){
                            return '<button class="btn btn-info">退 款</button>';
                        }else{
                            return '';
                        }
                    }
                }]
            });

            // 表格事件处理,init-初始化完成,length-改变每页长度,page-翻页,search-搜索
            dTable.off().on('init.dt', function () {
                //html.scrollTop($rootScope.scrollTop);
                //body.scrollTop($rootScope.scrollTop);
                //doctorList.find('tr[data-id=' + $rootScope.curRowId + ']').addClass('currentRow');
            }).on('length.dt', function (e, settings, len) {
                index = 1;
                start = 0;
                length = len;
                //dTable.fnDestroy();
                //setTable();
                utils.localData('page_length', length);
            }).on('page.dt', function (e, settings) {
                index = settings._iDisplayStart / length + 1;
                start = length * (index - 1);
                //dTable.fnDestroy();
                //$rootScope.scrollTop = html.scrollTop() ? 103 : 152;
                utils.localData('page_index', index);
                utils.localData('page_start', start);
                //setTable();
            });
        };

        setTable();

    }

    initTable();

});