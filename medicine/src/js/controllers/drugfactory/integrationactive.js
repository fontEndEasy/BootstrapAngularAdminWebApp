'use strict';
app.controller('IntegrationActive', function($rootScope, $scope, $state, $http, $compile, utils, modal) {
    var datable;
    //获取表格
    function setTable() {
        var data = {};

        function dataTable(data) {
            if (datable) { //表格是否已经初始化
                datable.fnClearTable(); //清理表格数据
            }
            datable = $('#lookstrategyactive-table').dataTable({
                "language": app.lang.datatables.translation,
                "ordering": false,
                "bInfo": false,
                "bLengthChange": false,
                "searching": false,
                "bDestroy": true, //可重新初始化
                "lengthMenu": [10, 15, 20, 30, 40, 50, 100],
                "data": data,
                "fnFooterCallback": function(nFoot, aData, iStart, iEnd, aiDisplay) {
                    $("#chainactive-table input[name='checkall']").prop("checked", false);
                    $("#chainactive-table tr input[type='checkbox']").each(function() {
                        $(this).prop("checked", false);
                    });
                },
                "columns": [{
                    "data": function(set, state, dt) {
                        return set.drug_store.name;
                    }
                }, {
                    "data": function(set, state, dt) {
                        return set.goods.title;
                    }
                }, {
                    "data": function(set, state, dt) {
                        return typeof set['start_date'] != "undefined" ? set['start_date'] : "-";
                    },
                    "orderable": false,
                    "searchable": false
                }, {
                    "data": function(set, state, dt) {
                        return typeof set['end_date'] != "undefined" ? set['end_date'] : "-";
                    },
                    "orderable": false,
                    "searchable": false
                }, {
                    "data": function(set, state, dt) {
                        return set.state_join.title;
                    },
                    "orderable": false,
                    "searchable": false
                }]
            });
        }


        $http.post(app.url.select_c_JF_STORE_JOIN, data).then(function(resp) {
            dataTable(resp.data.info_list);
        });
    }

    setTable();


});
