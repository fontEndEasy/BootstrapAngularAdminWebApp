'use strict';
app.controller('Chainsalestable', function ($rootScope, $scope, $state, $http, $compile, utils, modal) {
     // 初始化表格
    var doctorList, dTable,param = {};
    doctorList = $('#chainsalestable-table');

    function initTable() {
        var url = "src/data/integration.json?_"+$.now();
        var setTable = function (){
            param.access_token = app.url.access_token;
            if(typeof doctorList.dataTable !== 'function') return;
            dTable = doctorList.dataTable({
                "bServerSide": true,
                "bPaginate":false,
                "searching":false,
                "bInfo":false,
                "sAjaxSource": url,
                "bLengthChange": false,  
                "language": app.lang.datatables.translation,
                "fnServerData": function (sSource, aoData, fnCallback) {
                    $http({
                        "method": "get",
                        "url": sSource,
                        "data": param
                    }).then(function (resp) {
                        fnCallback(resp);
                    });
                },
                "columns": [
                    {
                        "data": "datetime",
                        "orderable":false
                        ,
                        "render": function (set, status, dt) {
                            var str = '';
                            if (dt.datetime) {
                                str += '<a class="group-info text-info">' + dt.datetime + '</a>';
                            }
                            return str;
                        }
                    },
                    {
                        "data": "sales",
                        "orderable": false,
                        "render": function (set, status, dt) {
                            var str = '';
                            if (dt.fintegration) {
                                str += '<span class="text-primary">' + dt.fintegration + '</span>';
                            }
                            return str;
                        }
                    }, 
                    {
                        "data": "unit",
                        "orderable": false,
                        "render": function (set, status, dt) {
                            var str = '';
                            if (dt.dintegration) {
                                str += '<span class="text-primary">' + dt.dintegration + '</span>';
                            }
                            return str;
                        }
                    }, 
                    {
                        "data": "zbcc",
                        "orderable": false,
                        "render": function (set, status, dt) {
                            var str = '';
                            if (dt.dintegration) {
                                str += '<span class="text-primary">' + dt.dintegration + '</span>';
                            }
                            return str;
                        }
                    }
                    , 
                    {
                        "data": "dzcc",
                        "orderable": false,
                        "render": function (set, status, dt) {
                            var str = '';
                            if (dt.dintegration) {
                                str += '<span class="text-primary">' + dt.dintegration + '</span>';
                            }
                            return str;
                        }
                    }
                    , 
                    {
                        "data": "dycc",
                        "orderable": false,
                        "render": function (set, status, dt) {
                            var str = '';
                            if (dt.dintegration) {
                                str += '<span class="text-primary">' + dt.dintegration + '</span>';
                            }
                            return str;
                        }
                    }
                    , 
                    {
                        "data": "cert_status",
                        "orderable": false,
                        "render": function (set, status, dt) {
                            var str = '';
                            if (dt.dintegration) {
                                str += '<span class="text-primary">' + dt.dintegration + '</span>';
                            }
                            return str;
                        }
                    }
                ]
            });

        }

        setTable();
    }
    initTable();
});
