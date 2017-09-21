'use strict';

app.controller('CheckListUndone', function ($rootScope, $scope, $state, $timeout, $http, utils) {
    var url = app.url.admin.check.getDoctors, // 后台API路径
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
    $scope.seeDetails = function (id) {
        $rootScope.scrollTop = body.scrollTop() || html.scrollTop();
        if (id) {
            $rootScope.details = {};
            $rootScope.details.id = id;
            $state.go('app.check_edit');
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
            doctorList = $('#doctorList_undone');
            dTable = doctorList.dataTable({
                "draw": index,
                "displayStart": start,
                "lengthMenu": [5, 10, 15, 20, 30, 40, 50, 100],
                "pageLength": length,
                "bServerSide": true,
                "sAjaxSource": url,
                "fnServerData": function (sSource, aoData, fnCallback) {
                    $http({
                        method: 'post',
                        "url": sSource,
                        "data": {
                            //aoData: JSON.stringify(aoData),
                            status: 2,
                            name: name,
                            pageIndex: index - 1,
                            pageSize: aoData[4]['value'],
                            access_token: app.url.access_token
                        }
                    }).then(function (resp) {
                        var _dt = resp.data.data;
                        utils.extendHash(_dt.pageData, ["doctorNum", "title", "hospital", "name", "telephone", "remark", "licenseExpire", "licenseNum", "userId", "departments", "createTime"]);
                        resp.start = _dt.start;
                        resp.recordsTotal = _dt.total;
                        resp.recordsFiltered = _dt.total;
                        resp.length = _dt.pageSize;
                        resp.data = _dt.pageData;
                        fnCallback(resp);

                        // 更新界面中的数据
                        $('#check_undo').html(resp.recordsTotal);
                        utils.localData('check_undo', resp.recordsTotal);
                    });
                },
                //"searching": false,
                "language": app.lang.datatables.translation,
                "createdRow": function (nRow, aData, iDataIndex) {
                    $(nRow).attr('data-id', aData['userId']).click(aData, function (param, e) {
                        $scope.seeDetails(param.data.userId);
                        $('.currentRow').removeClass('currentRow');
                        $rootScope.curRowId = $(this).data('id');
                        $rootScope.curDoctorPic = param.data.headPicFileName || 'src/img/a0.jpg';
                        utils.localData('curDoctorPic', param.data.headPicFileName || 'src/img/a0.jpg');
                    });
                },
                "columns": [{
                    "orderable": false,
                    "render": function (set, status, dt) {
                        if (dt.headPicFileName) {
                            var path = dt.headPicFileName;
                        } else {
                            var path = 'src/img/a0.jpg';
                        }
                        return '<img src="' + path + '"/>';
                    }
                }, {
                    "data": "name",
                    "orderable": false
                }, {
                    "data": "hospital",
                    "orderable": false,
                    "searchable": false
                }, {
                    "data": "departments",
                    "orderable": false,
                    "searchable": false
                }, {
                    "data": "title",
                    "orderable": false,
                    "searchable": false
                }, {
                    "data": "telephone",
                    "orderable": false,
                    "searchable": false
                }, {
                    "data": "createTime",
                    "orderable": false,
                    "searchable": false,
                    "render": function (set, status, dt) {
                        if (dt.createTime.length !== 0 && dt.createTime) {
                            return utils.dateFormat(dt.createTime, 'yyyy年MM月dd日, hh点mm分');
                        }else{
                            return '';
                        }
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


