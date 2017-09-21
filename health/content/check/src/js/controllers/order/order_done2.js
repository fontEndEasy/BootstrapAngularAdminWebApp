'use strict';

app.controller('OrderDone', function ($rootScope, $scope, $state, $timeout, $http, utils, modal) {
    var url = app.url.order.findOrder, // 后台API路径
        data = null,
        html = $('html'),
        body = $('body');

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

    ////////////////////////////////////////////////////////////

    // 初始化表格
    var doctorList, dTable;

    function initTable() {
        var name,
            _index,
            _start,
            isSearch = false,
            searchTimes = 0,
            index = utils.localData('page_index') * 1 || 1,
            start = utils.localData('page_start') * 1 || 0,
            length = utils.localData('page_length') * 1 || 50;

        var setTable = function () {
            doctorList = $('#orderList_undone');
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
                            orderStatus: 3,
                            pageIndex: index - 1,
                            pageSize: aoData[4]['value'],
                            access_token: app.url.access_token
                        }
                    }).then(function (resp) {
                        var _dt = resp.data.data;
                        index = aoData[0]['value'];
                        for (var i = 0; i < _dt.pageData.length; i++) {
                            utils.extendHash(_dt.pageData[i], ["doctorVo", "userVo", "doctorGroup", "doctorName", "userName", "relation", "patientName", "sex", "age", "telephone", "topPath"]);
                            utils.extendHash(_dt.pageData[i].doctorVo, ["doctorPath", "doctorName", "title"]);
                            utils.extendHash(_dt.pageData[i].userVo, ["userName", "headPriPath"]);
                        }
                        resp.start = _dt.start;
                        resp.recordsTotal = _dt.total;
                        resp.recordsFiltered = _dt.total;
                        resp.length = _dt.pageSize;
                        resp.data = _dt.pageData;
                        fnCallback(resp);

                        // 更新界面中的数据
                        $('#order_done').html(resp.recordsTotal);
                        utils.localData('order_done', resp.recordsTotal);
                    });
                },
                "searching": false,
                "language": app.lang.datatables.translation,
                "createdRow": function (nRow, aData, iDataIndex) {
                    $(nRow).attr('data-id', aData['userId']).find('.btn').click(aData['orderId'], function (param, e) {
                        var _this = $(this);
                        $scope.seeDetails(param.data, function () {
                            _this.removeClass('btn-success').addClass('disabled');
                        });
                    });
                },
                "columns": [{
                    "data": "orderId",
                    "orderable": false
                }, {
                    "data": "doctorVo.doctorName",
                    "orderable": false
                }, {
                    "orderable": false,
                    "render": function (set, status, dt) {
                        if (dt.doctorVo && dt.doctorVo.length != 0) {
                            var path = dt.doctorVo.doctorPath;
                        } else {
                            var path = 'src/img/a0.jpg';
                        }
                        return '<img src="' + path + '"/>';
                    },
                    "searchable": false
                }, {
                    "orderable": false,
                    "render": function (set, status, dt) {
                        return '<button class="btn btn-success"> 拨 打 </button>';
                    },
                    "searchable": false
                }, {
                    "orderable": false,
                    "render": function (set, status, dt) {
                        if (dt.topPath && dt.topPath.length != 0) {
                            var path = dt.topPath;
                        } else {
                            var path = 'src/img/a0.jpg';
                        }
                        return '<img src="' + path + '"/>';
                    },
                    "searchable": false
                }, {
                    "data": "patientName",
                    "orderable": false,
                    "searchable": false
                }, {
                    "data": "relation",
                    "orderable": false,
                    "searchable": false
                }, {
                    "data": "sex",
                    "orderable": false,
                    "searchable": false,
                    "render": function (set, status, dt) {
                        if (dt.sex) {
                            return dt.sex == 1 ? '男' : dt.sex == 2 ? '女' : dt.sex == 3 ? '保密' : '';
                        }
                    }
                }, {
                    "data": "age",
                    "orderable": false,
                    "searchable": false
                }, {
                    "data": "userVo.userName",
                    "orderable": false
                }]
            });

            // 表格事件处理,init-初始化完成,length-改变每页长度,page-翻页,search-搜索
            dTable.off().on('init.dt', function () {
                html.scrollTop($rootScope.scrollTop);
                body.scrollTop($rootScope.scrollTop);
                doctorList.find('tr[data-id=' + $rootScope.curRowId + ']').addClass('currentRow');
            }).on('length.dt', function (e, settings, len) {
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
            }).on('search.dt', function (e, settings) {
                if (settings.oPreviousSearch.sSearch) {
                    isSearch = true;
                    searchTimes++;
                    _index = settings._iDisplayStart / settings._iDisplayLength + 1;
                    _start = settings._iDisplayStart;
                    name = settings.oPreviousSearch.sSearch;
                } else {
                    isSearch = false;
                    name = null;
                }
                if (isSearch) {
                    index = 1;
                    start = 0;
                } else {
                    if (searchTimes > 0) {
                        searchTimes = 0;
                        index = _index;
                        start = _start;
                        dTable.fnDestroy();
                        setTable();
                    }
                }
            });
        };

        setTable();

    }

    initTable();

});