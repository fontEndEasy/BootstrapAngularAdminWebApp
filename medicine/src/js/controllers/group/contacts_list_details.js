'use strict';

app.controller('ContactsListDetails', function ($rootScope, $scope, $state, $timeout, $http, utils, $stateParams) {
    var container = $('#dialog_container'),
        html = $('html'),
        doctorId = $scope.doctorInfo.id,
        groupId = utils.localData('curGroupId'),
        deptId = $scope.curDepartmentId || utils.localData('curDepartmentId');

    if (!doctorId) {
        return;
    }

    $scope.isNormal = false;
    $scope.isQuit = true;

    if ($scope.doctorInfo.status === 'I') {
        $scope.isNormal = false;
        $scope.isQuit = true;
    } else if ($scope.doctorInfo.status === 'C') {
        $scope.isNormal = true;
        if (deptId) {
            $scope.isQuit = false;
        }
    } else if ($scope.doctorInfo.status === 'S') {
        $scope.isNormal = false;
        $scope.isQuit = true;
    } else {
        if (deptId) {
            $scope.isNormal = true;
            $scope.isQuit = false;
        } else {
            $scope.isNormal = false;
            $scope.isQuit = true;
        }
    }

    html.css('overflow', 'hidden');

    $scope.viewData = {};
    $scope.formData = {};
    $scope.viewData.headPicFile = $scope.doctorInfo.headPicFile;
    $scope.viewData.name = $scope.doctorInfo.name || '--';
    $scope.viewData.departmentFullName = $scope.doctorInfo.departmentFullName || '--';
    $scope.viewData.relation = $scope.doctorInfo.relation || '--';
    $scope.formData.contactWay = $scope.doctorInfo.contactWay;
    $scope.formData.remarks = $scope.doctorInfo.remarks;

    $scope.tabs = {};
    $scope.tabs.select = function(){
        if($scope.imgs) {
            $scope.isLoading = false;
            return;
        }
        // 获取医生证件图片
        $scope.isLoading = true;
        $http.get(app.url.upload.getCertPath + '?' + $.param({
                userId: doctorId,
                access_token: app.url.access_token
            })
        ).then(function (dt) {
                dt = dt.data.data;
                if (dt && dt.length > 0) {
                    $scope.imgs = dt;
                } else {
                    $scope.imgs = false;
                }
                $scope.isLoading = false;
            });
    };

    $scope.tabs.otherInfo = function(){
        $scope.viewData.inviteCode = 'http://112.74.208.140/appInvite/joinToGroup.html?groupId=' + groupId + '&doctorId=' + doctorId;
        $scope.isLoading = false;
        if($scope.info) {
            $scope.isLoading = false;
            return;
        }
        $scope.isLoading = true;
        // 获取医生其它信息
        $http({
            url: app.url.yiliao.getUserDetail,
            data: {
                userId: doctorId,
                access_token: app.url.access_token
            },
            method: 'post'
        }).then(function (dt) {
            dt = dt.data.data;
            if (dt && dt.length > 0) {
                $scope.info = dt;
            } else {
                $scope.info = false;
            }
            $scope.isLoading = false;
        });
    };

    var ttl, dpt, hsp;
    // 获取医生职业信息
    $http({
        url: app.url.doctor.getWork,
        method: 'post',
        data: {
            access_token: app.url.access_token,
            userId: doctorId
        }
    }).then(function (resp) {
        if (resp.data.resultCode === 1 && resp.data.data) {
            var dt = resp.data.data;
            ttl = dt.title || '--';
            dpt = dt.departments || '--';
            hsp = dt.hospital || '--';
            $scope.viewData.info = ttl + ' / ' + dpt + ' / ' + hsp;
        } else {
            $scope.viewData.info = '-- / -- / -- ';
        }
    }, function (x) {
        console.error(x.statusText);
    });

    // 获取医生简介
    $http({
        url: app.url.doctor.getIntro,
        method: 'post',
        data: {
            access_token: app.url.access_token,
            userId: doctorId
        }
    }).then(function (resp) {
        if (resp.data.resultCode === 1 && resp.data.data) {
            var dt = resp.data.data;
            $scope.viewData.introduction = dt.introduction || '--';
            $scope.viewData.skill = dt.skill || '--';
        } else {
            $scope.viewData.introduction = '--';
            $scope.viewData.skill = '--';
        }
    }, function (x) {
        console.error(x.statusText);
    });

    if (deptId) {
        // 获取值班表
        $http({
            url: app.url.yiliao.getSchedule,
            method: 'post',
            data: {
                access_token: app.url.access_token,
                doctorId: doctorId
            }
        }).then(function (resp) {
            if (resp.data.resultCode === 1 && resp.data.data.online) {
                var dt = resp.data.data.online;
                createSchedule(dt);
            } else {
                createSchedule(null);
            }
        }, function (x) {
            console.error(x.statusText);
        });
    } else {
        createSchedule(null);
    }

    function createSchedule(dt) {
        var times = [[], [], []];
        if (dt) {
            var dates = dt,
                m = 0,
                n = 0;
            if (dates) {
                for (var i = 0; i < dates.length; i++) {
                    m = dates[i].period * 1;
                    n = dates[i].week * 1;
                    if (dates[i].startTime && dates[i].endTime) {
                        var start = dates[i].startTime.substr(0, 2) + ':' + dates[i].startTime.substr(2, 2);
                        var end = dates[i].endTime.substr(0, 2) + ':' + dates[i].endTime.substr(2, 2);
                        times[m - 1][n % 7] = start + '-' + end;
                    }
                }
            }
        }

        /*    var times = [['09:00-11:30',
         '09:00-11:30',
         '',
         '09:00-11:30',
         '',
         '09:00-11:30',
         '09:00-11:30',
         ],['14:00-15:30',
         '',
         '14:00-16:30',
         '',
         '13:00-15:30',
         '15:00-18:30',
         '',
         ],['',
         '19:30-21:30',
         '',
         '',
         '18:50-22:30',
         '',
         '19:00-20:40',
         ]];*/
        var days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        var table = $('<table></table>');
        var thead = $('<thead></thead>');
        var tbody = $('<tbody></tbody>');
        for (var i = 0; i < 4; i++) {
            var tr = $('<tr></tr>');
            for (var j = 0; j < 7; j++) {
                var td = $('<td></td>');
                if (i === 0) {
                    td.html(days[j]);
                } else {
                    if (times[i - 1]) {
                        if (times[i - 1][j]) {
                            td.html(times[i - 1][j]);
                        } else {
                            td.html('&nbsp;');
                        }
                    } else {
                        td.html('&nbsp;');
                    }
                }
                tr.append(td);
            }
            if (i === 0) {
                thead.append(tr);
            } else {
                tbody.append(tr);
            }
        }
        table.append(thead).append(tbody);
        $('#duty_schedule').html('').append(table);
    };

    // 查找医生
    $scope.query = function () {
        doIt();
    };

    // 分派科室
    $scope.apportion = function (id) {
        $state.go('app.contacts.list.apportion');
    };

    // 离职
    $scope.quit = function (id) {
        $state.go('app.contacts.list.quit');
    };

    // 保存医生信息
    $scope.save = function () {
        $http({
            url: app.url.yiliao.updateDoctor,
            method: 'post',
            data: {
                access_token: app.url.access_token,
                id: $scope.groupDoctorId,
                contactWay: $scope.formData.contactWay || '--',
                remarks: $scope.formData.remarks || '--'
            }
        }).then(function (resp) {
            if (resp.data.resultCode === 1) {
                if($rootScope.isSearch){
                    $state.go('app.contacts.list', {id: $rootScope.keyword || utils.localData('tmpKey')}, {reload: false});
                }else{
                    $state.go('app.contacts.list', {id: $scope.curDepartmentId}, {reload: true});
                }
                html.css('overflow', 'auto');
            }
        }, function (x) {
            console.error(x.statusText);
        });
    };

    // 模态框退出
    $scope.cancel = function () {
        container.prev().remove();
        container.remove();
        //window.history.back();
        //$state.go('app.contacts.list');
        //console.log($stateParams)
        if($rootScope.isSearch){
            $state.go('app.contacts.list', {id: $rootScope.keyword || utils.localData('tmpKey')}, {reload: false});
        }else{
            $state.go('app.contacts.list', {id: $scope.curDepartmentId}, {reload: false});
        }
        html.css('overflow', 'auto');
    };

});