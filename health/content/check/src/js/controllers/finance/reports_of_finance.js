'use strict';

app.controller('ReportsOfFinance', ['$rootScope', '$scope', '$state', '$timeout', '$http', 'utils', '$stateParams', 'modal',
    function ($rootScope, $scope, $state, $timeout, $http, utils, $stateParams, modal) {
    var name = $stateParams.name;
    if (name === 'group') {
        var url = app.url.finance.gSettleYMList;
        $scope.reports_name = '集团结算报表';
        $scope.isGroup = true;
        $scope.isDoctor = false;
        $scope.isSalesclerk = false;
    } else if (name === 'doctor') {
        var url = app.url.finance.dSettleYMList;
        $scope.reports_name = '医生结算报表';
        $scope.isGroup = false;
        $scope.isDoctor = true;
        $scope.isSalesclerk = false;
    } else{
        var url = app.url.finance.settleYMList;
        $scope.reports_name = '店员结算报表';
        $scope.isGroup = false;
        $scope.isDoctor = false;
        $scope.isSalesclerk = true;
    }

    $scope.canExport = false;

    // 查看某一信息
    $scope.seeDetails = function (month) {
        if (month) {
            $state.go('app.settlement_of_finance', {name: name, date: month}, {reload: false})
        }
    };

    // 导出报表(Excel)
    $scope.export = function () {
        if(!date){
            modal.toast.warn('没有可导出项！');
            return;
        }
        $scope.action_url = app.url.finance.downExcel + '?access_token=' + app.url.access_token + '&id=' + date + '&pageIndex=' + (index - 1) + '&pageSize=' + length;
    };

    ////////////////////////////////////////////////////////////

    // 初始化表格
    var table, dTable, keyWord,
        index, length;
    function initTable() {
        var name, start = 0;

        index = 1;
        length = utils.localData('page_length') * 1 || 10;
        var setTable = function () {
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
                    $http({
                        "method": "post",
                        "url": sSource,
                        "data": {
                            pageIndex: index - 1,
                            pageSize: aoData[4]['value'],
                            access_token: app.url.access_token
                        }
                    }).then(function (resp) {
                        resp = resp.data.data;
                        for (var i = 0; i < resp.pageData.length; i++) {
                            utils.extendHash(resp.pageData[i], ["name", "status", "unsettlemoney", "settledMoney", "settleTime"]);
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
                "language": app.lang.datatables.translation,
                "createdRow": function (nRow, aData, iDataIndex) {
                    var btn = $(nRow).find('button');
                    $scope.canExport = true;
                    btn.click(function(){
                        if(!aData.month){
                            modal.toast.warn('缺少记录id');
                            return;
                        }
                        //$scope.seeDetails(new Date(aData.month).getMonth() + 1);
                        $scope.seeDetails(aData.month);
                    });
                },
                "columns": $scope.isGroup ? [{
                    "data": "month",
                    "orderable": false,
                }, {
                    "data": "noSettleMoney",
                    "orderable": false,
                    "render": function (set, status, dt) {
                        return (set / 100).toFixed(2);
                    }
                }, {
                    "data": "settledMoney",
                    "orderable": false,
                    "render": function (set, status, dt) {
                        return (set / 100).toFixed(2);
                    }
                }, {
                    "data": "status",
                    "orderable": false,
                    "render": function (set, status, dt) {
                        if(set === 2){
                            return '<button class="btn btn-primary">去结算</button>';
                        }else{
                            return '<button class="btn btn-info mrr-10">查询</button>';
                        }
                    }
                }] : $scope.isDoctor ? [{
                    "data": "month",
                    "orderable": false,
                }, {
                    "data": "noSettleMoney",
                    "orderable": false,
                    "render": function (set, status, dt) {
                        return (set / 100).toFixed(2);
                    }
                }, {
                    "data": "settledMoney",
                    "orderable": false,
                    "render": function (set, status, dt) {
                        return (set / 100).toFixed(2);
                    }
                }, {
                    "data": "status",
                    "orderable": false,
                    "render": function (set, status, dt) {
/*                        var date = new Date(dt.createTime),
                            now = new Date(),
                            dY = date.getFullYear(),
                            dM = date.getMonth() + 1,
                            nY = now.getFullYear(),
                            nM = now.getMonth() + 1;

                        if((nY == dY && (nM === dM || nM - dM > 1)) || (nY > dY && dM < 12)){
                            return '<button class="btn btn-info">查询</button>';
                        }else{
                            return '<button class="btn btn-primary">去结算</button>';
                        }*/

                        if (set === 2) {
                            return '<button class="btn btn-primary">去结算</button>';
                        } else {
                            return '<button class="btn btn-info mrr-10">查询</button>';
                        }
                    }
                }] : [{
                    "data": "month",
                    "orderable": false,
                }, {
                    "data": "noSettleMoney",
                    "orderable": false,
                    "render": function (set, status, dt) {
                        return (set / 100).toFixed(2);
                    }
                }, {
                    "data": "settledMoney",
                    "orderable": false,
                    "render": function (set, status, dt) {
                        return (set / 100).toFixed(2);
                    }
                }, {
                    "data": "status",
                    "orderable": false,
                    "render": function (set, status, dt) {
                        if (set === 2) {
                            return '<button class="btn btn-primary">去结算</button>';
                        } else {
                            return '<button class="btn btn-info mrr-10">查询</button>';
                        }
                    }
                }]
            });

            var table_of_group_filter = $('#table_of_group_filter'),
                _form = $('<form></form>'),
                _lbl = table_of_group_filter.addClass('group-search').children('label').append(_i),
                _i = $('<i ng-show="loaded" class="fa icon-magnifier"></i>'),
                _ipt = _lbl.find('input').attr('placeholder', '搜索...').attr('autocomplete', 'off'),
                _timer = 0,
                _temp = '',
                isSearching = false;

            table_of_group_filter.append(_form);
            _form.append(_lbl);
            _lbl.html('').append(_ipt).append(_i);
            _ipt.focus(function () {
                _timer = setInterval(function () {
                    var val = $.trim(_ipt.val());
                    if (val) {
                        isSearching = true;
                        _i.removeClass('icon-magnifier').addClass('fa-times-circle');
                        keyWord = _temp = val;
                    } else {
                        isSearching = false;
                        _i.removeClass('fa-times-circle').addClass('icon-magnifier');
                        if (_temp && !val) {
                            $scope.searching = false;
                            keyWord = _temp = '';
                            start = length * (index - 1);
                            dTable.fnDestroy();

                            param = {
                                groupId: groupId,
                                parentId: 0
                            };
                            url = app.url.yiliao.searchDoctor;
                            initTable();
                        }
                    }
                }, 100);
            });
            _ipt.blur(function () {
                clearInterval(_timer);
            });
            _i.click(function () {
                isSearching = false;
                keyWord = _temp = '';
                _ipt.trigger('submit');
                _ipt.val('');
                _i.removeClass('fa-times-circle').addClass('icon-magnifier');
                start = length * (index - 1);
                dTable.fnDestroy();

                param = {
                    groupId: groupId,
                    parentId: 0
                };
                url = app.url.yiliao.searchDoctor;
                dTable.fnDestroy();
                initTable();
            });
            _ipt.val(keyWord).trigger('focus');

            function submit(){
                $scope.searching = true;

                param = {
                    groupId: groupId,
                    keyword: keyWord
                };
                url = app.url.yiliao.searchDoctor;
                dTable.fnDestroy();
                initTable();
            }

            utils.keyHandler(_ipt, {
                'key13': submit
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
                if (!isSearching) {
                    index = settings._iDisplayStart / length + 1;
                }
            });
        };

        setTable();
    }

    initTable();

}]);