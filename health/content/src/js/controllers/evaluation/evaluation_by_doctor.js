'use strict';

app.controller('EvaluationByDoctor', function ($rootScope, $scope, $state, $http, utils, $modal, Doctor) {
    var url = app.url.yiliao.inviteDoctor, // 后台API路径
        data = null,
        html = $('html'),
        body = $('body'),
        groupId = utils.localData('curGroupId');

    if ($rootScope.pageName !== 'list_pass') {
        utils.localData('page_index', null);
        utils.localData('page_start', null);
        $rootScope.pageName = 'list_pass';
        $rootScope.scrollTop = 0;
    }

    // 查看邀请列表信息
    $scope.seeInvitationList = function (id) {
        if (id || id == '0') {
            $state.go('app.doctor_list', {id: id}, {reload: false});
        }
    };

    // 查看某一信息
    $scope.seeDetails = function (id) {
        if (id) {
            $('#doctor_details').removeClass('hide');
            $rootScope.winVisable = true;
            Doctor.addData(id);
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
            index = 1,
            start = 0,
            length = utils.localData('page_length') * 1 || 20,
            num = 0,
            size = 20,
            idx = 0;

        var setTable = function () {
            doctorList = $('#evaluationByDoctor');
            dTable = doctorList.dataTable({
                "draw": index,
                "displayStart": start,
                "lengthMenu": [5, 10, 15, 20, 30, 40, 50, 100],
                "pageLength": length,
                "bServerSide": true,
                "sAjaxSource": url,
                "fnServerData": function (sSource, aoData, fnCallback) {
                    num = 1;
                    idx = index -1;
                    $.ajax({
                        "type": "post",
                        "url": sSource,
                        "dataType": "json",
                        "data": {
                            access_token: app.url.access_token,
                            groupId: groupId,
                            pageIndex: index - 1,
                            pageSize: aoData[4]['value']
                        },
                        "success": function (resp) {
                            index = aoData[0]['value'];
                            for (var i = 0; i < resp.data.pageData.length; i++) {
                                utils.extendHash(resp.data.pageData[i], ["name", "value", "title", "departments", "hospital", "telephone"]);
                            }
                            resp.start = resp.data.start;
                            resp.recordsTotal = resp.data.total;
                            resp.recordsFiltered = resp.data.total;
                            resp.length = resp.data.pageSize;
                            resp.data = resp.data.pageData;
                            size = aoData[4]['value'];
                            $scope.loading = false;
                            fnCallback(resp);
                        }
                    });
                },
                "searching": false,
                "language": app.lang.datatables.translation,
                "createdRow": function (nRow, aData, iDataIndex) {
                    var a_link = $(nRow).find('.a-link');
                    var detail_link = $(nRow).find('.detail-link');
                    a_link.click(function(e){
                        var evt = e || window.event;
                        evt.stopPropagation();
                        $scope.seeDetails(aData.id);
                    });
                    /*detail_link.click(function(e){
                        var evt = e || window.event;
                        evt.stopPropagation();
                        //$scope.seeDetails(aData.id);
                    });*/
                    $(nRow).on('click', 'button', function () {
                        //$('.currentRow').removeClass('currentRow');
                        $rootScope.curDoctorId = aData.id;
                        $rootScope.curDoctorName = aData.name;
                        utils.localData('curDoctorId', aData.id);
                        utils.localData('curDoctorName', aData.name);
                        //$scope.seeInvitationList(param.data.id);
                        showPop(aData);
                    });
                    num++;
                },
                "columns": [{
                    "orderable": false,
                    "render": function (set, status, dt) {
                        return '<span class="text-num">' + (idx * size + num) + '</span>';
                    },
                    "searchable": false
                }, {
                    "orderable": false,
                    "render": function (set, status, dt) {
                        if (dt.headPicFileName) {
                            var path = dt.headPicFileName;
                        } else {
                            var path = 'src/img/a0.jpg';
                        }
                        return '<img class="a-link" src="' + path + '"/></a>';
                    },
                    "searchable": false
                }, {
                    "orderable": false,
                    "searchable": false,
                    "render": function (set, status, dt) {
                        return '<a class="a-link">' + dt.name + '</a>';
                    }
                }, {
                    "data": "hospital",
                    "orderable": false
                }, {
                    "data": "departments",
                    "orderable": false
                }, {
                    "data": "title",
                    "orderable": false
                }, {
                    "data": "value",
                    "orderable": false,
                    "searchable": false
                }, {
                    "data": null,
                    "orderable": false,
                    "searchable": false,
                    "render": function (set, status, dt) {
                        return '<button class="detail-link btn btn-primary">查 询</button>';
                    }
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
                utils.localData('page_length', len);
            }).on('page.dt', function (e, settings) {
                index = settings._iDisplayStart / length + 1;
                start = length * (index - 1);
                dTable.fnDestroy();
                //$rootScope.scrollTop = html.scrollTop() ? 103 : 152;
                //utils.localData('page_index', index);
                //utils.localData('page_start', start);
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

    function showPop(data) {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'invitedDoctor_list.html',
            controller: 'invitedDoctorList',
            size: 'lg',
            resolve: {
                item: function() {
                    return data;
                }
            }
        });
    }
});

app.controller('invitedDoctorList', function ($rootScope, $scope, $state, $http, utils, $modalInstance, Doctor) {
    setTimeout(function() {
        var url = app.url.yiliao.inviteDoctor, // 后台API路径
            data = null,
            html = $('html'),
            body = $('body'),
            groupId = utils.localData('curGroupId'),
            doctorId = ($scope.curDoctorId || $scope.curDoctorId == '0') ? $scope.curDoctorId : utils.localData('curDoctorId'),
            curDoctorName = $scope.curDoctorName || utils.localData('curDoctorName');

        $scope.viewData = {};
        $scope.viewData.curDoctorName = (curDoctorName && curDoctorName.constructor == Array) ? 'XXX' : curDoctorName;

        if ($rootScope.pageName !== 'list_pass') {
            utils.localData('page_index', null);
            utils.localData('page_start', null);
            $rootScope.pageName = 'list_pass';
            $rootScope.scrollTop = 0;
        }

        // 查看某一信息
        $scope.seeDetails = function (id) {
            if (id) {
                $('#doctor_details').removeClass('hide');
                $rootScope.winVisable = true;
                Doctor.addData(id);
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
                length = utils.localData('page_length') * 1 || 5;

            var setTable = function () {
                doctorList = $('#inviteDoctorList');
                dTable = doctorList.dataTable({
                    "draw": index,
                    "displayStart": start,
                    "lengthMenu": [5, 10, 15, 20, 30, 40, 50, 100],
                    "pageLength": length,
                    "bServerSide": true,
                    "sAjaxSource": url,
                    "fnServerData": function (sSource, aoData, fnCallback) {
                        $.ajax({
                            "type": "post",
                            "url": sSource,
                            "dataType": "json",
                            "data": {
                                access_token: app.url.access_token,
                                groupId: groupId,
                                doctorId: doctorId,
                                pageIndex: index - 1,
                                pageSize: aoData[4]['value']
                            },
                            "success": function (resp) {
                                for (var i = 0; i < resp.data.pageData.length; i++) {
                                    utils.extendHash(resp.data.pageData[i], ["name", "hospital", "title", "departments", "telephone", "time"]);
                                }
                                resp.start = resp.data.start;
                                resp.recordsTotal = resp.data.total;
                                resp.recordsFiltered = resp.data.total;
                                resp.length = resp.data.pageSize;
                                resp.data = resp.data.pageData;
                                fnCallback(resp);
                                $scope.loading = false;
                            }
                        });
                    },
                    "searching": false,
                    "language": app.lang.datatables.translation,
                    "createdRow": function (nRow, aData, iDataIndex) {
                        var a_link = $(nRow).find('.a-link');
                        a_link.click(function (e) {
                            var evt = e || window.event;
                            evt.stopPropagation();
                            $scope.seeDetails(aData.id);
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
                            return '<img class="a-link" src="' + path + '"/></a>';
                        },
                        "searchable": false
                    }, {
                        "orderable": false,
                        "searchable": false,
                        "render": function (set, status, dt) {
                            return '<a class="a-link">' + dt.name + '</a>';
                        }
                    }, {
                        "data": "title",
                        "orderable": false,
                        "searchable": false
                    }, {
                        "data": "departments",
                        "orderable": false,
                        "searchable": false
                    }, {
                        "data": "hospital",
                        "orderable": false,
                        "searchable": false
                    }, {
                        "data": "telephone",
                        "orderable": false,
                        "searchable": false
                    }, {
                        "data": "time",
                        "orderable": false,
                        "searchable": false
                    }]
                });

                // 表格事件处理,init-初始化完成,length-改变每页长度,page-翻页,search-搜索
                dTable.off().on('length.dt', function(e, settings, len) {
                    index = 1;
                    start = 0;
                    length = len;
                    dTable.fnDestroy();
                    setTable();
                }).on('page.dt', function(e, settings) {
                    index = settings._iDisplayStart / length + 1;
                    start = length * (index - 1);
                    dTable.fnDestroy();
                    setTable();
                });
            };

            setTable();

        }

        initTable();

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    },1);
});