'use strict';
app.controller('FeedbackUndone', function ($rootScope, $scope, $state, $timeout, $http, utils) {
    var url = app.url.feedback.query, // 后台API路径
        data = null,
        html = $('html'),
        body = $('body');

    if ($rootScope.pageName !== 'feedback') {
        utils.localData('page_index', null);
        utils.localData('page_start', null);
        //utils.localData('page_length', null);
        $rootScope.pageName = 'feedback';
        $rootScope.scrollTop = 0;
    }

    // 查看某一反馈信息
    $scope.seeDetails = function (id) {
        $rootScope.scrollTop = body.scrollTop() || html.scrollTop();
        if (id) {
            $rootScope.details = {};
            $rootScope.details.id = id;
            $state.go('app.feedback_view');
        }
    };
    ////////////////////////////////////////////////////////////

    // 初始化表格
    var doctorList, dTable;

    function initTable() {
        var index = utils.localData('page_index') * 1 || 1,
            start = utils.localData('page_start') * 1 || 0,
            length = utils.localData('page_length') * 1 || 50;

        var setTable = function () {
            doctorList = $('#feedbackList');
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
                            pageIndex: index - 1,
                            pageSize: aoData[4]['value'],
                            access_token: app.url.access_token
                        }
                    }).then(function (resp) {
                        var _dt = resp.data.data;
                        utils.extendHash(_dt.pageData, ["userId", "userName", "clientVersion", "content", "phoneSystem", "phoneModel", "createTime"]);
                        resp.start = _dt.start;
                        resp.recordsTotal = _dt.total;
                        resp.recordsFiltered = _dt.total;
                        resp.length = _dt.pageSize;
                        resp.data = _dt.pageData;
                        fnCallback(resp);

                        // 更新界面中的数据
                        $('#feedback_undo').html(resp.recordsTotal);
                        utils.localData('feedback_undo', resp.recordsTotal);
                    });
                },
                "searching": false,
                "language": app.lang.datatables.translation,
                "createdRow": function (nRow, aData, iDataIndex) {
                    $(nRow).attr('data-id', aData['_id']).click(aData['_id'], function (param, e) {
                        $scope.seeDetails(param.data);
                        $('.currentRow').removeClass('currentRow');
                        $rootScope.curRowId = $(this).data('id');
                    });
                },
                "columns": [{
                    "data": "userName",
                    "orderable": false
                }, {
                    "data": "clientVersion",
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
                    "render": function (o) {
                        return DataRender.DateTime(o);
                    }
                }]
            });

            // 表格事件处理,init-初始化完成,length-改变每页长度,page-翻页,search-搜索
            dTable.off().on('init.dt', function () {
                html.scrollTop($rootScope.scrollTop);
                body.scrollTop($rootScope.scrollTop);
                doctorList.find('tr[data-id=' + $rootScope.curRowId + ']').addClass('currentRow');
                $('.input-sm').trigger('focus');
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
            });
        };

        setTable();

    }

    initTable();

});

