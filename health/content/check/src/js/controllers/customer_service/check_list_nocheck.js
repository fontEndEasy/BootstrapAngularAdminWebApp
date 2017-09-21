'use strict';

app.controller('CheckListNoCheck', function ($rootScope, $scope, $state, $timeout, $http, $compile, utils) {
    var url = app.url.admin.check.getDoctors, // 后台API路径
        data = null,
        html = $('html'),
        body = $('body');

    if ($rootScope.pageName !== 'list_nopass') {
        utils.localData('page_index', null);
        utils.localData('page_start', null);
        //utils.localData('page_length', null);
        $rootScope.pageName = 'list_nopass';
        $rootScope.scrollTop = 0;
    }

    // 查看某一审核信息
    $scope.seeDetails = function (id) {
        $rootScope.scrollTop = body.scrollTop() || html.scrollTop();
        if (id) {
            $rootScope.details = {};
            $rootScope.details.id = id;
            $state.go('app.check_nocheck_view');
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
            doctorList = $('#doctorList_nocheck');
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
                            status: 7,
                            name: name,
                            pageIndex: index - 1,
                            pageSize: aoData[4]['value'],
                            access_token: app.url.access_token
                        }
                    }).then(function (resp) {
                        var _dt = resp.data.data;
                        for (var i = 0; i < _dt.pageData.length; i++) {
                            utils.extendHash(_dt.pageData[i], ["doctor", "name", "telephone", "headPicFileName", "createTime"]);
                            utils.extendHash(_dt.pageData[i].doctor, ["title", "hospital","departments"]);
                        }
                        resp.start = _dt.start;
                        resp.recordsTotal = _dt.total;
                        resp.recordsFiltered = _dt.total;
                        resp.length = _dt.pageSize;
                        resp.data = _dt.pageData;
                        fnCallback(resp);

                        // 更新界面中的数据
                        $('#check_nocheck').html(_dt.total);
                        utils.localData('check_nocheck', _dt.total);
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

                        // 数据做本地保存，解决API未返回部分医生数据问题
                        utils.localData('hospital', param.data.doctor.hospital || '--');
                        utils.localData('departments', param.data.doctor.departments || '--');
                        utils.localData('title', param.data.doctor.title || '--');
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
                    "data": "doctor.hospital",
                    "orderable": false,
                    "searchable": false
                }, {
                    "data": "doctor.departments",
                    "orderable": false,
                    "searchable": false
                }, {
                    "data": "doctor.title",
                    "orderable": false,
                    "searchable": false
                }, {
                    "data": "telephone",
                    "orderable": false
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