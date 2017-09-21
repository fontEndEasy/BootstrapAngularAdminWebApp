'use strict';

app.directive('doctorDetails', ['uiLoad', 'JQ_CONFIG', '$document', '$scope', '$compile',
    function (uiLoad, JQ_CONFIG, $document, $scope, $compile) {
        return {
            restrict: 'AEC',
            templateUrl: 'src/tpl/directives/doctor_details.html',
            //replace: true,
            //transclude: true,
            //controller: 'AppCtrl',
            link: function (scope, el, attr) {
                //scope.$apply();
                scope.$watch(
                    function (scope) {
                        // watch the 'compile' expression for changes
                        return scope.$eval(attrs.compile);
                    },
                    function (value) {
                        // when the 'compile' expression changes
                        // assign it into the current DOM
                        el.html(value);
                        // compile the new DOM and link it to the current
                        // scope.
                        // NOTE: we only compile .childNodes so that
                        // we don't get into infinite loop compiling ourselves
                        $compile(el.contents())(scope);
                    }
                );
            }
        };
    }
]);
app.controller('ContactsList', ['$rootScope', '$scope', '$state', '$timeout', '$http', 'utils', 'Doctor',
    function ($rootScope, $scope, $state, $timeout, $http, utils, Doctor) {
    var url = app.url.yiliao.getDoctors, // 后台API路径
        data = null,
        html = $('html'),
        body = $('body'),
        deptId = $scope.curDepartmentId || utils.localData('curDepartmentId'),
        groupId = utils.localData('curGroupId');

    if ($scope.curIndex === 'idx_0') {
        url = app.url.yiliao.searchDoctor;
        var param = {
            groupId: groupId,
            status: 'S'
        };
    } else if ($scope.curIndex === 'idx_1') {
        url = app.url.yiliao.getUndistributed;
        var param = {
            groupId: groupId
        };
    } else if ($scope.curIndex === 'idx_2') {
        url = app.url.yiliao.searchDoctor;
        var param = {
            groupId: groupId,
            status: 'I'
        };
    } else {
        url = app.url.yiliao.getDoctors;
        if (!deptId) return;
        var param = {
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

    // 查看某一信息
    $scope.seeDetails = function (id) {
        if (id || id == '0') {
            $state.go('app.contacts.list.details');
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
            //index = utils.localData('page_index') * 1 || 1,
            //start = utils.localData('page_start') * 1 || 0,
            index = 1,
            start = 0,
            length = utils.localData('page_length') * 1 || 50;

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
                        index = aoData[0]['value'];
                        for (var i = 0; i < resp.pageData.length; i++) {
                            utils.extendHash(resp.pageData[i], ["doctor", "contactWay", "remarks", "departmentFullName"]);
                            utils.extendHash(resp.pageData[i].doctor, ["name", "departments", "position", "doctorNum", "skill", "introduction"]);
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
                        //$scope.seeDetails(aData.doctorId);

                        $('.currentRow').removeClass('currentRow');
                        $rootScope.curRowId = $(this).data('id');
                        $rootScope.curDoctorXId = aData.id;
                        $rootScope.groupDoctorId = aData.groupDoctorId;
                        $rootScope.doctorInfo = {
                            id: aData.doctorId,
                            name: aData.doctor.name,
                            contactWay: aData.contactWay,
                            remarks: aData.remarks,
                            headPicFile: aData.doctor.headPicFilePath ? aData.doctor.headPicFilePath : 'src/img/a0.jpg',
                            status: aData.status,
                            departmentFullName: aData.departmentFullName,
                            relation: aData.invite ? aData.invite.inviteMsg : null
                        };
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
                        return '<img class="a-link" src="' + path + '"/></a>';
                    }
                }, {
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
                        return '<img src="' + path + '"/>';
                    }
                }, {
                    "data": "doctor.name",
                    "orderable": false,
                    "searchable": false
                }, {
                    "data": "departmentFullName",
                    "orderable": false,
                    "searchable": false
                }, {
                    "data": "doctor.position",
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

            // 表格事件处理,init-初始化完成,length-改变每页长度,page-翻页,search-搜索
            dTable.off().on('init.dt', function () {
                //html.scrollTop($rootScope.scrollTop);
                //body.scrollTop($rootScope.scrollTop);
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

}]);