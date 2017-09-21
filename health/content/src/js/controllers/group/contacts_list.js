'use strict';

app.controller('ContactsList', ['$rootScope', '$scope', '$state', '$timeout', '$http', 'utils', 'Doctor', '$stateParams',
    function ($rootScope, $scope, $state, $timeout, $http, utils, Doctor, $stateParams) {

    var url = app.url.yiliao.getDoctors, // 后台API路径
        data = null,
        deptId = $scope.curDepartmentId || utils.localData('curDepartmentId'),
        groupId = utils.localData('curGroupId'),
        //curIndex = $stateParams.id.split('?')[0];
        curIndex = $stateParams.id.split('/')[0];


    if (curIndex === 'idx_0' || deptId === 'idx_0') {
        $scope.curDepartmentId = 'idx_0';
            url = app.url.yiliao.searchDoctor;
        var param = {
            groupId: groupId,
            status: 'S'
        };
    } else if (curIndex === 'idx_1' || deptId === 'idx_1') {
        $scope.curDepartmentId = 'idx_1';
        url = app.url.yiliao.getUndistributed;
        var param = {
            groupId: groupId
        };
    } else if (curIndex === 'idx_2' || deptId === 'idx_2') {
        $scope.curDepartmentId = 'idx_2';
        url = app.url.yiliao.searchDoctor;
        var param = {
            groupId: groupId,
            status: 'I'
        };
    } else if (curIndex === 'idx_3' || deptId === 'idx_3') {
        $scope.curDepartmentId = 'idx_3';
        url = app.url.yiliao.searchDoctor;
        var param = {
            groupId: groupId,
            status: 'J'
        };
    } else {
        url = app.url.yiliao.getDoctors;
        if (!deptId) return;
        var param = {
            groupId: groupId,
            departmentId: deptId
        };
    }

    if($rootScope.isSearch){
        var param = {};
        url = app.url.yiliao.searchDoctorByKeyWord;
        param['groupId'] = groupId;
        param['keyword'] = $rootScope.keyword;
    }


    if ($rootScope.pageName !== 'list_pass') {
        utils.localData('page_index', null);
        utils.localData('page_start', null);
        //utils.localData('page_length', null);
        $scope.pageName = 'list_pass';
        //$rootScope.scrollTop = 0;
    }

    // 查看某一信息
    $scope.seeDetails = function (id) {
        if (id) {
            $('#doctor_details').removeClass('hide');
            $rootScope.winVisable = true;
            Doctor.addData(id);
        }
    };

/*    // 查看某一信息
    $scope.seeDetails = function (id) {
        if (id || id == '0') {
            $state.go('app.contacts.list.details');
        }
    };*/

    ////////////////////////////////////////////////////////////

    // 初始化表格
    var doctorList, dTable;
    function initTable() {
        var name,
            _index,
            _start,
            isSearch = false,
            searchTimes = 0,
            //index = utils.localData('page_index') * 1 || 1,
            //start = utils.localData('page_start') * 1 || 0,
            index = 1,
            start = 0,
            length = utils.localData('page_length') * 1 || 10;

        var setTable = function () {
            if($rootScope.isSearch){
                doctorList = $('#searchList');
            }else{
                doctorList = $('#contactsList');
            }
            dTable = doctorList.dataTable({
                "draw": index,
                "displayStart": start,
                "lengthMenu": [5, 10, 15, 20, 30, 40, 50, 100],
                "pageLength": length,
                "bServerSide": true,
                "sAjaxSource": url,
                "fnServerData": function (sSource, aoData, fnCallback) {
                    param.pageIndex = index - 1;
                    param.pageSize = aoData[4]['value'];
                    param.access_token = app.url.access_token;
                    $http({
                        "method": "post",
                        "url": sSource,
                        "data": param
                    }).then(function (resp) {
                        resp = resp.data.data;
                        for (var i = 0; i < resp.pageData.length; i++) {
                            utils.extendHash(resp.pageData[i], ["doctor", "contactWay", "remarks", "departmentFullName"]);
                            utils.extendHash(resp.pageData[i].doctor, ["name", "departments", "position", "doctorNum", "skill", "introduction", "telephone"]);
                        }
                        resp.start = resp.start;
                        resp.recordsTotal = resp.total;
                        resp.recordsFiltered = resp.total;
                        resp.length = resp.pageSize;
                        resp.data = resp.pageData;
                        fnCallback(resp);
                        $scope.loading = false;
                        $rootScope.loaded = true;
                    });
                },
                "searching": false,
                "language": app.lang.datatables.translation,
                "createdRow": function (nRow, aData, iDataIndex) {
                    var a_link = $(nRow).find('.a-link');
                    a_link.click(function(){
                        $scope.seeDetails(aData.doctorId);
                    });
                },
                "columns": !$rootScope.isSearch ? [{
                    "orderable": false,
                    "render": function (set, status, dt) {
                        if (dt.doctor && dt.doctor.headPicFilePath) {
                            var path = dt.doctor.headPicFilePath;
                        } else {
                            var path = 'src/img/a0.jpg';
                        }
                        return '<img class="a-link" src="' + path + '"/>';
                    }
                }, {
                    "data": "doctor.name",
                    "orderable": false,
                    "searchable": false,
                    "render": function (set, status, dt) {
                        return '<a class="a-link">' + dt.doctor.name + '</a>';
                    }
                }, {
                    "data": "doctor.doctorNum",
                    "orderable": false,
                    "searchable": false
                }, {
                    "data": "doctor.position",
                    "orderable": false,
                    "searchable": false
                }, {
                    "data": "doctor.telephone",
                    "orderable": false,
                    "searchable": false
                }, {
                    "data": "contactWay",
                    "orderable": false,
                    "searchable": false
                }, {
                    "data": "remarks",
                    "orderable": false,
                    "searchable": false
                }] : [{
                    "orderable": false,
                    "render": function (set, status, dt) {
                        if (dt.doctor && dt.doctor.headPicFilePath) {
                            var path = dt.doctor.headPicFilePath;
                        } else {
                            var path = 'src/img/a0.jpg';
                        }
                        return '<img class="a-link" src="' + path + '"/>';
                    }
                }, {
                    "data": "doctor.name",
                    "orderable": false,
                    "searchable": false,
                    "render": function (set, status, dt) {
                        return '<a class="a-link">' + dt.doctor.name + '</a>';
                    }
                }, {
                    "data": "departmentFullName",
                    "orderable": false,
                    "searchable": false
                }, {
                    "data": "doctor.position",
                    "orderable": false,
                    "searchable": false
                }, {
                    "data": "doctor.telephone",
                    "orderable": false,
                    "searchable": false
                }, {
                    "data": "contactWay",
                    "orderable": false,
                    "searchable": false
                }, {
                    "data": "remarks",
                    "orderable": false,
                    "searchable": false
                }]
            });

            var search_form = $('#group_search_form');
            if($rootScope.isSearch){
                var wrapper = $('#searchList_wrapper');
            }else{
                var wrapper = $('#contactsList_wrapper');
            }

            function setSearchBar(){
                var keyIpt = $('#key_ipt');
                var table_warp = search_form.appendTo(wrapper.children(".row:nth-child(1)")
                    .children(".col-sm-6:nth-child(1)").next());


                var timer = 0,
                    tmpKey = 'not empty!!!!!!!!!!',
                    curLine = $('.cur-line'),
                    curBkLine = $('.cur-back-line');

                keyIpt.val($rootScope.keyword);
                keyIpt.focus(function(){
                    if($('.cur-line').length !== 0){
                        curLine = $('.cur-line');
                        curBkLine = $('.cur-back-line');
                    }
                    curLine.removeClass('cur-line');
                    curBkLine.removeClass('cur-back-line');
                    timer = setInterval(function(){
                        var val = $.trim(keyIpt.val());
                        $rootScope.keyword = val;
                        if(tmpKey !== val && /\S+/.test(val)){
                            $rootScope.keyword = tmpKey = val;
                            $rootScope.isSearch = true;
                            /*                if (curBkLine.length === 0) {
                             curLine = $('.cur-line');
                             curBkLine = $('.cur-back-line');
                             }
                             curLine.removeClass('cur-line');
                             curBkLine.removeClass('cur-back-line');
                             $rootScope.keyword = tmpKey = val;
                             $rootScope.isSearch = true;
                             utils.localData('tmpKey', tmpKey);
                             $rootScope.loaded = false;
                             $state.go('app.contacts.list', {id: tmpKey}, {reload: false});*/
                        }else if(!val && val != '0'){
                            $rootScope.loaded = true;
                            tmpKey = 'not empty!!!!!!!!!!';
                            $rootScope.isSearch = false;
                        }
                    }, 100);
                });
                keyIpt.blur(function(){
                    clearInterval(timer);
                    if(!$rootScope.isSearch){
                        curLine.addClass('cur-line');
                        curBkLine.addClass('cur-back-line');
                        $state.go('app.contacts.list',{id:$rootScope.curDepartmentId},{reload:false});
                    }
                });

                if($rootScope.keyword){
                    keyIpt.trigger('focus');
                }

                $scope.submit = function(){
                    var val = $.trim(keyIpt.val());
                    $rootScope.keyword = tmpKey = val;
                    $rootScope.isSearch = true;
                    utils.localData('tmpKey', tmpKey);
                    $rootScope.loaded = false;
                    $state.go('app.contacts.list',{id:tmpKey + '_' + new Date().getTime()},{reload:false});
                };
            }

            // 表格事件处理,init-初始化完成,length-改变每页长度,page-翻页,search-搜索
            dTable.off().on('init.dt', function () {
                doctorList.find('tr[data-id=' + $rootScope.curRowId + ']').addClass('currentRow');
                setSearchBar();
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
                utils.localData('page_index', index);
                utils.localData('page_start', start);
                setTable();
            });
        };

        setTable();
    }

    initTable();

}]);