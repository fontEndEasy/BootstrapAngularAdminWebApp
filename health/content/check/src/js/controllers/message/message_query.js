'use strict';

app.controller('MessageQuery', ['$scope', '$http', '$state', '$rootScope', 'utils', 'uiLoad', 'JQ_CONFIG', '$compile',
    function ($scope, $http, $state, $rootScope, utils, uiLoad, JQ_CONFIG, $compile) {

        $scope.formData = {};
        $scope.viewData = {
            phone: 15435040504,
            content: "看到飒风斯洛伐克将索科洛夫近代史看来发生纠纷 是老骥伏枥说分级萨克斯说的",
            time: '2015-10-12 23:34:23'
        };
        $scope.showResult = false;
        $scope.hasResult = false;


        var doctorList, dTable;
        // 提交并更新数据
        $scope.submit = function () {
            if(dTable){
                dTable.fnDestroy();
            }

            // 初始化表格
            function initTable() {
                var name,
                    _index,
                    _start,
                    isSearch = false,
                    searchTimes = 0,
                    index = utils.localData('page_index') * 1 || 1,
                    start = utils.localData('page_start') * 1 || 0,
                    length = utils.localData('page_length') * 1 || 100;

                var setTable = function () {
                    doctorList = $('#message_table');
                    dTable = doctorList.dataTable({
                        "draw": index,
                        "displayStart": start,
                        "lengthMenu": [5, 10, 15, 20, 30, 40, 50, 100],
                        "pageLength": length,
                        "bServerSide": true,
                        "sAjaxSource": app.url.msg.find,
                        "fnServerData": function (sSource, aoData, fnCallback) {
                            $http({
                                method: 'post',
                                "url": sSource,
                                "data": {
                                    status: 2,
                                    name: name,
                                    pageIndex: index - 1,
                                    pageSize: aoData[4]['value'],
                                    access_token: app.url.access_token,
                                    toPhone: $scope.formData.phone,
                                    content: $scope.formData.content
                                }
                            }).then(function (resp) {
                                $scope.showResult = true;
                                if (resp.data.resultCode === 1) {
                                    var _dt = resp.data;
                                    $scope.hasResult = true;
                                    index = aoData[0]['value'];
                                    utils.extendHash(_dt.data, ["id", "content", "toPhone", "createTime"]);
                                    resp.start = _dt.start;
                                    resp.recordsTotal = _dt.total;
                                    resp.recordsFiltered = _dt.total;
                                    resp.length = _dt.pageSize;
                                    resp.data = _dt.data;
                                    fnCallback(resp);
                                }else{
                                    $scope.hasResult = false;
                                }
                            });
                        },
                        paging: false,
                        "searching": false,
                        "language": app.lang.datatables.translation,
                        "columns": [{
                            "data": "userid",
                            "orderable": false,
                            "searchable": false
                        }, {
                            "data": "toPhone",
                            "orderable": false,
                            "searchable": false
                        }, {
                            "data": "content",
                            "orderable": false,
                            "searchable": false
                        }, {
                            "data": "createTime",
                            "orderable": false,
                            "searchable": false,
                            "render": function(set, status, dt){
                                return utils.dateFormat(dt.createTime, 'yyyy年MM月dd日，hh点mm分');
                            }
                        }]
                    });

                    // 表格事件处理,init-初始化完成,length-改变每页长度,page-翻页,search-搜索
                    dTable.off().on('length.dt', function (e, settings, len) {
                        index = 1;
                        start = 0;
                        length = len;
                        dTable.fnDestroy();
                        setTable();
                        utils.localData('page_length', length);
                    }).on('page.dt', function (e, settings) {
                        index = settings._iDisplayStart / length + 1;
                        start = length * (index - 1);
                        dTable.fnDestroy();
                        $rootScope.scrollTop = html.scrollTop() ? 103 : 152;
                        utils.localData('page_index', index);
                        utils.localData('page_start', start);
                        setTable();
                    });
                };

                setTable();

            }

            initTable();

        };
    }
]);
