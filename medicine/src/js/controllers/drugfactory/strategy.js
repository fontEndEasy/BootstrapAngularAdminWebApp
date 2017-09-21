'use strict';
app.controller('Strategy', function($rootScope, $scope, $state, $http, $compile, utils, modal) {
    // 初始化表格
    var doctorList, dTable, param = {};
    doctorList = $('#strategy-table');

    $rootScope.$on('lister_strategy_list', function(evet, data) {
        initTable();
    });

    function initTable() {
        var url = app.url.select_default_c_YQTGCL;
        var setTable = function() {
            param.access_token = app.url.access_token;
            if (typeof doctorList.dataTable !== 'function') return;
            if (typeof doctorList != "undefined") doctorList.dataTable().fnDestroy(); //清空表格缓存数据
            dTable = doctorList.dataTable({
                "bServerSide":  true,
                "bPaginate": false,
                "bDestory": true,
                "searching": false,
                "bInfo": false,
                "sAjaxSource": url,
                "language": app.lang.datatables.translation,
                "fnServerData": function(sSource, aoData, fnCallback) {
                    $http({
                        "method": "get",
                        "url": sSource,
                        "data": param
                    }).then(function(resp) {
                        console.log(resp);
                        var data = {};
                        data.start = 0;
                        data.recordsTotal = resp.data.total;
                        data.recordsFiltered = resp.data.total;
                        data.length = resp.data.total;
                        var tmp = {};
                        $.each(resp.data.list_datas, function(index, item) {
                            if (item.name == "默认推广策略") {
                                tmp = resp.data.list_datas.splice(index, 1);
                                return false;
                            }
                        });
                        resp.data.list_datas.unshift(tmp[0])
                        data.data = resp.data.list_datas;
                        fnCallback(data);
                    });
                },
                "columns": [{
                    "data":   "name",
                    "orderable": false,
                    "render": function(set, status, dt) {
                        var str = '';
                        if (dt.name) {
                            str += '<a class="group-info" data-id="' + dt.id + '">' + dt.name + '</a>';
                        }
                        return str;
                    }
                }, {
                    //     "data": "ydpe",
                    //     "orderable": false,
                    //     "render": function(set, status, dt) {
                    //         var str = '';
                    //         if (dt.ydpe) {
                    //             str += '<span>' + dt.ydpe + '</span>';
                    //         }
                    //         return str;
                    //     }
                    // }, {
                    "data": "dptgf",
                    "orderable": false,
                    "render": function(set, status, dt) {
                        var str = '';
                        if (dt.dptgf) {
                            str += '<span>' + dt.dptgf + '</span>';
                        }
                        return str;
                    }
                }],
                "createdRow": function(nRow, aData, iDataIndex) {
                    $(nRow).on('click', function() {
                        $state.go('app.strategy.edit_strategy', {
                            type: 'edit',
                            id: aData.id
                        });
                    });

                }
            });

        }
        setTable();
    }

    setTimeout(function() {
        initTable();
    }, 300);

});
