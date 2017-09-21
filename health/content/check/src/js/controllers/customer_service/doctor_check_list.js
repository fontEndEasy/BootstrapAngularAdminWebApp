'use strict';

app.controller('CheckList', function ($rootScope, $scope, $state, $timeout, $http, utils, $stateParams) {
    var url = app.url.admin.check.getDoctors, // 后台API路径
        data = null,
        html = $('html'),
        body = $('body'),
        status = 2,
        table_id = "list_unCheck",
        type = $stateParams.type,
        page = $stateParams.page.split('_')[1];

    $scope.tabs = {};
    $scope.tabs.active = [false, false, false, false];

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
            case 'un_auth':
                setActive(3);
                table_id = "list_unAuth";
            break;
            default:break;
        }
    }

    $scope.tabs.unCheck = function(){
        table_id = "list_unCheck";
        status = 2;
        $state.go('app.check.doctor.check_list', {type: 'un_check', page: 'page_' + page});
    };
    $scope.tabs.passed = function(){
        table_id = "list_passed";
        status = 1;
        $state.go('app.check.doctor.check_list', {type: 'pass', page: 'page_' + page});
    };
    $scope.tabs.noPass = function(){
        table_id = "list_noPass";
        status = 3;
        $state.go('app.check.doctor.check_list', {type: 'no_pass', page: 'page_' + page});
    };
    $scope.tabs.unAuth = function(){
        table_id = "list_unAuth";
        status = 7;
        $state.go('app.check.doctor.check_list', {type: 'un_auth', page: 'page_' + page});
    };

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
            if(type){
                switch (type){
                    case 'un_check':
                        $state.go('app.check_edit');
                        break;
                    case 'pass':
                        $state.go('app.check_pass_view');
                        break;
                    case 'no_pass':
                        $state.go('app.check_nopass_view');
                        break;
                    case 'un_auth':
                        $state.go('app.check_nocheck_view');
                        break;
                    default:break;
                }
                //$scope.$apply();
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
                        method: 'post',
                        "url": sSource,
                        "data": {
                            //aoData: JSON.stringify(aoData),
                            status: status,
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
                        if(type === 'un_check'){
                            $('#doctor_check').html(resp.recordsTotal);
                            utils.localData('doctor_check', resp.recordsTotal);
                        }
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
                page = 1;
            }).on('length.dt', function (e, settings, len) {
                page = index = 1;
                start = 0;
                length = len;
                dTable.fnDestroy();
                setTable();
                utils.localData('page_length', length);

                /*if(type){
                    switch (type){
                        case 'un_check':
                            $state.go('app.check.doctor.check_list', {type: 'un_check', page: 'page_' + page});
                            break;
                        case 'pass':
                            $state.go('app.check.doctor.check_list', {type: 'pass', page: 'page_' + page});
                            break;
                        case 'no_pass':
                            $state.go('app.check.doctor.check_list', {type: 'no_pass', page: 'page_' + page});
                            break;
                        case 'un_auth':
                            $state.go('app.check.doctor.check_list', {type: 'un_auth', page: 'page_' + page});
                            break;
                        default:break;
                    }
                }*/
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
                            $state.go('app.check.doctor.check_list', {type: 'un_check', page: 'page_' + page});
                            break;
                        case 'pass':
                            $state.go('app.check.doctor.check_list', {type: 'pass', page: 'page_' + page});
                            break;
                        case 'no_pass':
                            $state.go('app.check.doctor.check_list', {type: 'no_pass', page: 'page_' + page});
                            break;
                        case 'un_auth':
                            $state.go('app.check.doctor.check_list', {type: 'un_auth', page: 'page_' + page});
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


