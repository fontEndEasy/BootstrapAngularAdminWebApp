'use strict';

app.controller('SettlementOfFinance', ['$rootScope', '$scope', '$state', '$timeout', '$http', 'utils', '$stateParams', 'modal',
    function ($rootScope, $scope, $state, $timeout, $http, utils, $stateParams, modal) {
        var name = $stateParams.name,
            date = $stateParams.date,
            datas = null, allHaveBankAccount = true,userType;

        if (name === 'group') {
            var url = app.url.finance.gSettleMList;
            var settleUrl = app.url.finance.groupSettle;
            var param = {
                //userType: 1,
                month: date
            };
            $scope.reports_name = '集团结算报表详情';
            $scope.isGroup = true;
            $scope.isDoctor = false;
            $scope.isSalesclerk = false;
            userType = 1;
        } else if(name === 'doctor') {
            var url = app.url.finance.dSettleMList;
            var settleUrl = app.url.finance.doctorSettle;
            var param = {
                //userType: 2,
                month: date
            };
            $scope.reports_name = '医生结算报表详情';
            $scope.isGroup = false;
            $scope.isDoctor = true;
            $scope.isSalesclerk = false;
            userType = 2;
        } else {
            var url = app.url.finance.settleMList;
            var settleUrl = app.url.finance.settle;
            var param = {
                //userType: 2,
                month: date
            };
            $scope.reports_name = '店员结算报表详情';
            $scope.isGroup = false;
            $scope.isDoctor = false;
            $scope.isSalesclerk = true;
            //userType = 2;
        }

        $scope.canSettle = false;
        $scope.canExport = false;

        // 查看某一信息
        $scope.settle = function (dt, flg) {
            var param = [];
            var ttl = '';
            param.settleMoney = dt.noSettleMoney;
            if(typeof dt === 'boolean'){
                ttl = '您确定要进行批量结算吗？';
                if(bool_arr.indexOf(false) !== -1){
                    modal.toast.warn('存在没有银行卡号的记录，不能进行批量结算！');
                    return;
                }
            }else{
                ttl = '<table style="width:100%"><tbody>' +
                    '<tr><td class="w50 p-5 pr-10 text-right">待结算金额</td><td class="pl-10 text-left">' + (dt.monthMoney / 100).toFixed(2) + ' 元</td></tr>' +
                    //'<tr><td class="p-5 pr-10 text-right">当月退款金额</td><td class="pl-10 text-left">' + 0 + ' 元</td></tr>' +
                    '<tr><td class="p-5 pr-10 text-right">扣减金额</td><td class="pl-10 text-left">' + 0 + ' 元</td></tr>' +
                    '<tr class="text-primary"><td class="p-5 pr-10 text-right">实际结算金额</td><td class="pl-10 text-left">'+ (dt.noSettleMoney / 100).toFixed(2) +' 元</td></tr>' +
                    '</tbody></table>';
            }

            if (dt.id) {
                if(!flg){
                    modal.prompt('报表结算',ttl);
                }else {
                    modal.confirm('报表结算', ttl, function () {
                        $http({
                            url: settleUrl,
                            method: 'post',
                            data: {
                                access_token: app.url.access_token,
                                id: dt.id,
                                settleMoney: dt.noSettleMoney,
                                expandMoney: 0,
                            }
                        }).then(function (resp) {
                            if (resp.data.resultCode == '1' && resp.data.data.result) {
                                if (resp.data.data.noBankCardIds && resp.data.data.noBankCardIds.length > 0) {
                                    if (resp.data.data.noBankCardIds.length < ids.length) {
                                        modal.toast.warn('部分记录结算失败，缺少银行卡号！');
                                        dTable.fnDestroy();
                                        initTable();
                                    } else {
                                        modal.toast.error('所有记录结算失败，缺少银行卡号！');
                                    }
                                } else {
                                    modal.toast.success('结算成功！');
                                    dTable.fnDestroy();
                                    initTable();
                                }
                            } else {
                                if (resp.data.resultMsg) {
                                    modal.toast.warn((resp.data.resultMsg).replace(/^\d+/, ''));
                                } else {
                                    modal.toast.error('结算失败！');
                                }
                            }
                        });
                    });
                }
            }else{
                modal.toast.warn('没有可结算的记录！');
            }
        };

        // 导出报表
        $scope.export = function () {
            if (name === 'group') {
                var type = 12;
            }else{
                var type = 11;
            }
            $scope.action_url = app.url.finance.downExcel + '?access_token=' + app.url.access_token + '&month=' + date + '&type=' + type + '&pageIndex=' + (index - 1) + '&pageSize=' + length;
        };

        // 返回上一页
        $scope.goBack = function () {
            window.history.back();
        };

        ////////////////////////////////////////////////////////////

        // 初始化表格
        var table, dTable, keyWord,
            index, length, id_arr = [], bool_arr = [],
            STATUS_SETTLED = 2;

        function initTable() {
            var start = 0;

            index = 1;
            length = utils.localData('page_length') * 1 || 10
            $scope.canSettle = false;

            var setTable = function () {
                var canCheckAll = false;
                if($scope.isGroup){
                    table = $('#table_of_group');
                }else if($scope.isDoctor){
                    table = $('#table_of_doctor');
                }else{
                    table = $('#table_of_salesclerk');
                }
                dTable = table.dataTable({
                    "draw": index,
                    "displayStart": start,
                    "lengthMenu": [5, 10, 15, 20, 30, 40, 50, 100],
                    "pageLength": length,
                    "bServerSide": true,
                    "sAjaxSource": url,
                    "fnServerData": function (sSource, aoData, fnCallback) {
                        param.pageIndex = index - 1;
                        param.pageSize = aoData[4]['value'];
                        param.access_token = app.url.access_token;
                        $http({
                            "method": "post",
                            "url": sSource,
                            "data": param
                        }).then(function (resp) {
                            resp = resp.data.data;
                            datas = resp.pageData;
                            for (var i = 0; i < resp.pageData.length; i++) {
                                utils.extendHash(resp.pageData[i], ["groupName", "userName", "userRealName", "personNo", "subBankName", "bankName", "bankNo", "noSettleMoney", "actualMoney", "telephone", "status"]);
                            }
                            resp.start = resp.start;
                            resp.recordsTotal = resp.total;
                            resp.recordsFiltered = resp.total;
                            resp.length = resp.pageSize;
                            resp.data = resp.pageData;
                            fnCallback(resp);
                            $scope.loading = false;
                            $rootScope.loaded = true;
                        });
                    },
                    "searching": false,
                    "sort": false,
                    "language": app.lang.datatables.translation,
                    "createdRow": function (nRow, aData, iDataIndex) {
                        nRow = $(nRow);
                        var btn = nRow.find('button');
                        var ipt = nRow.find('.i-checks input');

                        $scope.canExport = true;

                        btn.click(function(e){
                            var evt = e || window.event;

                            evt.stopPropagation();
                            if(aData.status === 3){
                                $scope.settle(aData, false);
                            }else{
                                $scope.settle(aData, true);
                            }
                        });
                        nRow.click(function(e){
                            var evt = e || window.event,
                                target = evt.target || evt.srcElement;

                            evt.stopPropagation();
                            if(target.nodeName !== 'INPUT' && target.nodeName !== 'I'){
                                ipt.trigger('click');
                            };
                        });
                        //nRow.data('id', aData.id);
                        ipt.data({'status': aData.status, 'id': aData.id, 'hasBankAccount': aData.bankNo.length === 0 ? false : true});
                    },
                    "columns": $scope.isGroup ? [{
                        "data": "userName"
                    }, {
                        "data": "userRealName"
                    }, {
                        "data": "personNo"
                    }, {
                        "data": "bankName"
                    }, {
                        "data": "subBankName"
                    }, {
                        "data": "bankNo"
                    }, {
                        "data": "noSettleMoney",
                        "render": function (set, status, dt) {
                            return (set / 100).toFixed(2);
                        }
                    }, {
                        "data": "actualMoney",
                        "render": function (set, status, dt) {
                            return (set / 100).toFixed(2);
                        }
                    }, {
                        "data": "status",
                        "render": function (set, status, dt) {
                            if (set === 2 && (dt.bankNo && dt.bankNo.length !== 0)) {
                                return '<button class="btn btn-primary">结算</button>';
                            } else if (set === 3) {
                                return '<button class="btn btn-info">查看</button>';
                            } else {
                                return '';
                            }
                        }
                    }] : $scope.isDoctor ?  [{
                        "data": "userName"
                    }, {
                        "data": "telephone"
                    }, {
                        "data": "userRealName"
                    }, {
                        "data": "personNo"
                    }, {
                        "data": "bankName"
                    }, {
                        "data": "subBankName"
                    }, {
                        "data": "bankNo"
                    }, {
                        "data": "noSettleMoney",
                        "render": function (set, status, dt) {
                            return (set / 100).toFixed(2);
                        }
                    }, {
                        "data": "actualMoney",
                        "render": function (set, status, dt) {
                            return (set / 100).toFixed(2);
                        }
                    }, {
                        "data": "status",
                        "render": function (set, status, dt) {
                            if (set === 2) {
                                return '<button class="btn btn-primary">结算</button>';
                            } else if (set === 3) {
                                return '<button class="btn btn-info">查看</button>';
                            } else {
                                return '';
                            }
                        }
                    }] : [{
                        "data": "userName"
                    }, {
                        "data": "userName"
                    }, {
                        "data": "userRealName"
                    }, {
                        "data": "bankName"
                    }, {
                        "data": "subBankName"
                    }, {
                        "data": "bankNo"
                    }, {
                        "data": "bankNo"
                    }, {
                        "data": "noSettleMoney",
                        "render": function (set, status, dt) {
                            return (set / 100).toFixed(2);
                        }
                    }, {
                        "data": "actualMoney",
                        "render": function (set, status, dt) {
                            return (set / 100).toFixed(2);
                        }
                    }, {
                        "data": "status",
                        "render": function (set, status, dt) {
                            if (set === 2) {
                                return '<button class="btn btn-primary">结算</button>';
                            } else if (set === 3) {
                                return '<button class="btn btn-info">查看</button>';
                            } else {
                                return '';
                            }
                        }
                    }]
                });

                // 表格事件处理,init-初始化完成,length-改变每页长度,page-翻页,search-搜索
                dTable.off().on('init.dt', function () {
                    table.find('tr[data-id=' + $rootScope.curRowId + ']').addClass('currentRow');
                }).on('length.dt', function (e, settings, len) {
                    index = 1;
                    start = 0;
                    length = len;
                    dTable.fnDestroy();
                    setTable();
                    utils.localData('page_length', len);
                }).on('page.dt', function (e, settings) {
                    index = settings._iDisplayStart / length + 1;
                });
            };

            setTable();
        }

        initTable();

    }]);