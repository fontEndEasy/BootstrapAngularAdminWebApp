'use strict';

app.controller('GroupCheckList', function ($rootScope, $scope, $state, $timeout, $http, utils, $stateParams, modal) {
    var url = app.url.admin.check.groupApplyList, // 后台API路径
        data = null,
        html = $('html'),
        body = $('body'),
        status = 'A',
        table_id = "list_unCheck",
        type = $stateParams.type,
        page = $stateParams.page.split('_')[1];

    $scope.tabs = {};
    $scope.tabs.active = [false, false, false];

    function setActive(idx){
        for(var i=0; i<$scope.tabs.active.length; i++){
            if(i === idx){
                $scope.tabs.active[i] = true;
            }else{
                $scope.tabs.active[i] = false;
            }
        }
    }

    if(type){
        switch (type){
            case 'un_check':
                setActive(0);
                table_id = "list_unCheck";
                break;
            case 'pass':
                setActive(1);
                table_id = "list_passed";
                break;
            case 'no_pass':
                setActive(2);
                table_id = "list_noPass";
                break;
            default:break;
        }
    }

    $scope.tabs.unCheck = function(){
        table_id = "list_unCheck";
        status = 'A';
        $state.go('app.check.group.check_list', {type: 'un_check', page: 'page_' + page});
    };
    $scope.tabs.passed = function(){
        table_id = "list_passed";
        status = 'P';
        $state.go('app.check.group.check_list', {type: 'pass', page: 'page_' + page});
    };
    $scope.tabs.noPass = function(){
        table_id = "list_noPass";
        status = 'NP';
        $state.go('app.check.group.check_list', {type: 'no_pass', page: 'page_' + page});
    };

    if ($rootScope.pageName !== 'list_undone') {
        utils.localData('page_index', null);
        utils.localData('page_start', null);
        $rootScope.pageName = 'list_undone';
        $rootScope.scrollTop = 0;
    }

    // 编辑某一审核信息
    $scope.seeDetails = function (id) {
        //$rootScope.scrollTop = body.scrollTop() || html.scrollTop();
        if (id) {
            $rootScope.details = {};
            $rootScope.details.id = id;
            if(type){
                switch (type){
                    case 'un_check':
                        $state.go('app.check.group.check_view', {id: id});
                        break;
                    case 'pass':
                        $state.go('app.check.group.details_view', {id: id});
                        break;
                    case 'no_pass':
                        $state.go('app.check.group.details_view', {id: id});
                        break;
                    default:break;
                }
            }
        }
    };

    ////////////////////////////////////////////////////////////

    // 初始化表格
    var doctorList, dTable, setTable;

    function initTable() {
        var name,
            _index,
            _start,
            isSearch = false,
            searchTimes = 0,
        //index = utils.localData('page_index') * 1 || 1,
        //start = utils.localData('page_start') * 1 || 0,
            index = page * 1 || 1,
            length = utils.localData('page_length') * 1 || 50,
            start = (index - 1) * length || 0;

        setTable = function () {
            doctorList = $('#' + table_id);
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
                            access_token: app.url.access_token,
                            status: status,
                            groupName: name,
                            pageIndex: index - 1,
                            pageSize: aoData[4]['value']
                        }
                    }).then(function (resp) {
                        var _dt = resp.data.data;
                        index = aoData[0]['value'];
                        if(_dt && _dt.pageData) {
                            utils.extendHash(_dt.pageData[0], ["groupName", "applyDoctorName", "telephone", "hospitalName", "level", "applyDate", "auditDate"]);
                            resp.start = _dt.start;
                            resp.recordsTotal = _dt.total;
                            resp.recordsFiltered = _dt.total;
                            resp.length = _dt.pageSize;
                            resp.data = _dt.pageData;
                            fnCallback(resp);

                            if (type === 'un_check') {
                                $rootScope.isChecking = true;
                                utils.localData('isChecking', 'true');

                                // 更新界面中的数据
                                $('#group_check').html(resp.recordsTotal);
                                utils.localData('group_check', resp.recordsTotal);
                            }else{
                                $rootScope.isChecking = false;
                                utils.localData('isChecking', null);
                            }
                        }else{
                            modal.toast.warn(resp.data.resultMsg);
                        }

                    });
                },
                //"searching": false,
                "language": app.lang.datatables.translation,
                "createdRow": function (nRow, aData, iDataIndex) {
                    $(nRow).click(aData, function(param, e){
                        $rootScope.groupInfo = {
                            groupId: aData.id,
                            name: aData.name,
                            introduction: aData.introduction,
                            logo: aData.groupIconPath,
                            skill: aData.diseaseName
                        };
                        if(aData.id){
                            utils.localData('curId', aData.id);
                            $scope.seeDetails(aData.id);
                        }else{
                            utils.localData('curId', aData.groupApplyId);
                            $scope.seeDetails(aData.groupApplyId);
                        }
                    });

                },
                "columns": type === 'un_check' ? [{
                    "orderable": false,
                    "render": function (set, status, dt) {
                        if (dt.logoUrl) {
                            var path = dt.logoUrl;
                        } else {
                            var path = 'src/img/logoDefault.jpg';
                        }
                        return '<a class="group-info"><img src="' + path  + '"/></a>';
                    }
                }, {
                    "data": "groupName",
                    "orderable": false
                }, {
                    "data": "applyDoctorName",
                    "orderable": false,
                    "searchable": false,
                    "render": function (set, status, dt) {
                        var str = '';
                        if (set) {
                            str += '<span>' + set + '</span>';
                        }
                        if (dt.title && dt.title) {
                            str += '<br/><span>' + dt.title + '</span>';
                        }
                        return str;
                    }
                }, {
                    "data": "hospitalName",
                    "orderable": false,
                    "render": function (set, status, dt) {
                        var str = '';
                        if (set) {
                            str += '<span>' + set + '</span>';
                        }
                        if (dt.level) {
                            str += '<br/><span>' + dt.level + '</span>';
                        }
                        return str;
                    }
                }, {
                    "data": "telephone",
                    "orderable": false,
                    "searchable": false
                }, {
                    "data": "applyDate",
                    "orderable": false,
                    "searchable": false,
                    "render": function (set, status, dt) {
                        if (set) {
                            return utils.dateFormat(set, 'yyyy年MM月dd日，hh点mm分');
                        }else{
                            return '';
                        }
                    }
                }] : type === 'pass' ? [{
                    "orderable": false,
                    "render": function (set, status, dt) {
                        if (dt.logoUrl) {
                            var path = dt.logoUrl;
                        } else {
                            var path = 'src/img/logoDefault.jpg';
                        }
                        return '<a class="group-info"><img src="' + path + '"/></a>';
                    }
                }, {
                    "data": "groupName",
                    "orderable": false
                }, {
                    "data": "applyDoctorName",
                    "orderable": false,
                    "searchable": false,
                    "render": function (set, status, dt) {
                        var str = '';
                        if (set) {
                            str += '<span>' + set + '</span>';
                        }
                        if (dt.title && dt.title) {
                            str += '<br/><span>' + dt.title + '</span>';
                        }
                        return str;
                    }
                }, {
                    "data": "hospitalName",
                    "orderable": false,
                    "render": function (set, status, dt) {
                        var str = '';
                        if (set) {
                            str += '<span>' + set + '</span>';
                        }
                        if (dt.level) {
                            str += '<br/><span>' + dt.level + '</span>';
                        }
                        return str;
                    }
                }, {
                    "data": "telephone",
                    "orderable": false,
                    "searchable": false
                }] : [{
                    "orderable": false,
                    "render": function (set, status, dt) {
                        if (dt.logoUrl) {
                            var path = dt.logoUrl;
                        } else {
                            var path = 'src/img/logoDefault.jpg';
                        }
                        return '<a class="group-info"><img src="' + path + '"/></a>';
                    }
                }, {
                    "data": "groupName",
                    "orderable": false
                }, {
                    "data": "applyDoctorName",
                    "orderable": false,
                    "searchable": false,
                    "render": function (set, status, dt) {
                        var str = '';
                        if (set) {
                            str += '<span>' + set + '</span>';
                        }
                        if (dt.title && dt.title) {
                            str += '<br/><span>' + dt.title + '</span>';
                        }
                        return str;
                    }
                }, {
                    "data": "hospitalName",
                    "orderable": false,
                    "render": function (set, status, dt) {
                        var str = '';
                        if (set) {
                            str += '<span>' + set + '</span>';
                        }
                        if (dt.level) {
                            str += '<br/><span>' + dt.level + '</span>';
                        }
                        return str;
                    }
                }, {
                    "data": "telephone",
                    "orderable": false,
                    "searchable": false
                }, {
                    "data": "applyDate",
                    "orderable": false,
                    "searchable": false,
                    "render": function (set, status, dt) {
                        if (set) {
                            return utils.dateFormat(set, 'yyyy年MM月dd日，hh点mm分');
                        }else{
                            return '';
                        }
                    }
                }, {
                    "data": "auditDate",
                    "orderable": false,
                    "searchable": false,
                    "render": function (set, status, dt) {
                        if (set) {
                            return utils.dateFormat(set, 'yyyy年MM月dd日，hh点mm分');
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
                page = 1;
            }).on('length.dt', function (e, settings, len) {
                page = index = 1;
                start = 0;
                length = len;
                dTable.fnDestroy();
                setTable();
                utils.localData('page_length', length);
            }).on('page.dt', function (e, settings) {
                page = index = settings._iDisplayStart / length + 1;
                start = length * (index - 1);
                dTable.fnDestroy();
                //$rootScope.scrollTop = html.scrollTop() ? 103 : 152;
                //utils.localData('page_index', index);
                //utils.localData('page_start', start);
                //setTable();

                if(type){
                    switch (type){
                        case 'un_check':
                            $state.go('app.check.group.with_v_list', {type: 'un_check', page: 'page_' + page});
                            break;
                        case 'pass':
                            $state.go('app.check.group.with_v_list', {type: 'pass', page: 'page_' + page});
                            break;
                        case 'no_pass':
                            $state.go('app.check.group.with_v_list', {type: 'no_pass', page: 'page_' + page});
                            break;
                        default:break;
                    }
                }
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
                    page = index = 1;
                    start = 0;
                } else {
                    if (searchTimes > 0) {
                        searchTimes = 0;
                        page = index = _index;
                        start = _start;
                        dTable.fnDestroy();
                        setTable();
                    }
                }
            });
        };

        setTable();
    }

    var timer = setInterval(function(){
        if(!dTable){
            clearInterval(timer);
            initTable();
        }
    }, 100);

    //initTable();
});