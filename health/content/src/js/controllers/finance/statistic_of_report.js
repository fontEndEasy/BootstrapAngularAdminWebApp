'use strict';

app.controller('StatisticOfReport', ['$rootScope', '$scope', '$state', '$timeout', '$http', 'utils',
    function ($rootScope, $scope, $state, $timeout, $http, utils) {

    var groupId = utils.localData('curGroupId'),
        url = app.url.finance.gIncomeListNew;

    var param = {
        groupId: groupId
    };

    //$rootScope.canBack = true;

    // 查看某一信息
    $scope.seeDetails = function (date) {
        if (date) {
            $state.go('app.reports_of_finance', {name: 'group', date: date}, {reload: false})
        }
    };

    // 返回上一页
    $scope.goBack = function () {
        window.history.back();
    };

    ////////////////////////////////////////////////////////////////////////////////

    // 初始化表格
    var table, dTable;
    function initTable() {
        var index = 1,
            start = 0,
            length = utils.localData('page_length') * 1 || 10;

        var setTable = function () {
            table = $('#table_of_group');
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
                        for (var i = 0; i < resp.pageData.length; i++) {
                            utils.extendHash(resp.pageData[i], ["keyYM", "totalNum", "totalMoney"]);
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
                    btn.click(function(){
                        $scope.seeDetails(aData.month);
                    });
                },
                "columns": [{
                    "data": "month",
                    "orderable": false,
                    "searchable": false
                }, {
                    "data": "totalNum",
                    "orderable": false,
                    "searchable": false
                }, {
                    "data": "totalMoney",
                    "orderable": false,
                    "searchable": false,
                    "render": function (set, status, dt) {
                        return (set / 100).toFixed(2);
                    }
                }, {
                    "orderable": false,
                    "searchable": false,
                    "render": function (set, status, dt) {
                        return '<button class="btn btn-info">查询记录</button>';
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
                if (!isSearching) {
                    index = settings._iDisplayStart / length + 1;
                }
            });
        };

        setTable();
    }

    initTable();

}]);