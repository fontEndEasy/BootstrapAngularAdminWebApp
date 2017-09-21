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
    $scope.viewData.groupProfit = $scope.doctorInfo.groupProfit || '0';
    $scope.viewData.parentProfit = $scope.doctorInfo.parentProfit || '0';
    $scope.formData.contactWay = $scope.doctorInfo.contactWay;
    $scope.formData.remarks = $scope.doctorInfo.remarks;

    $scope.tabs = {};
    $scope.tabs.select = function () {
        if ($scope.imgs) {
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

    $scope.tabs.setProfit = function () {
        var list_wrapper = $('#cnt_list_department'),
            parentId = null;

        if (!$scope.groupProfit && $scope.groupProfit !== 0) {
            $scope.formData.groupProfit = 0;
        } else {
            $scope.formData.groupProfit = $scope.groupProfit;
        }
        if (!$scope.parentProfit && $scope.parentProfit !== 0) {
            $scope.formData.parentProfit = 0;
        } else {
            $scope.formData.parentProfit = $scope.parentProfit;
        }

        if (!$scope.formData.parentProfit) {
            $scope.formData.parentProfit = 0;
        }

        if ($scope.targetDoctorParentId == 0) {
            $scope.hasSuper = false;
            $scope.formData.parentProfit = 0;
        }

        // 初始化通讯录列表
        var contacts = new Tree('cnt_list_relationship', {
            hasCheck: true,
            multiple: false,
            self: true,
            arrType: [1,1,1,0],
            data: {
                url: app.url.yiliao.getProfitTree,
                param: {
                    access_token: app.url.access_token,
                    groupId: groupId
                }
            },
            async: false,
            icons: {
                arrow: 'fa fa-caret-right/fa fa-caret-down',
                check: 'fa fa-check',
                root: 'fa fa-hospital-o tomato',
                branch: 'fa fa-user-md tomato',
                leaf: 'fa fa-user-md tomato'
            },
            info: {
                name: 'name',
                id: 'id',
                pid: 'parentId',
                description: 'description'
            },
            datakey: {
                id: 'id',
                name: 'name',
                sub: 'children'
            },
            events: {
                click: check
            },
            callback: function () {
                var dts = contacts.tree.find('dt');
                var curDt = null;
                for (var i = 0; i < dts.length; i++) {
                    if (dts.eq(i).data('info').id === $scope.targetDoctorParentId) {
                        curDt = dts.eq(i);
                        break;
                    }
                }
                if (curDt) {
                    curDt.trigger('click');
                }
            }
        });


        function check(info) {

            if ($scope.targetDoctorId == info.id) {
                list_wrapper.html('');
                modal.toast.warn('不能选择自己！');
                contacts.setCheck(info.id);
                return;
            }

            var dts = contacts.tree.find('dt');
            var curDt = null;
            for (var i = 0; i < dts.length; i++) {
                if (dts.eq(i).data('info').id == $scope.targetDoctorId) {
                    curDt = dts.eq(i);
                    break;
                }
            }
            dts = curDt.parent().children('dd').find('dt');
            for (var i = 0; i < dts.length; i++) {
                if (dts.eq(i).data('info').id == info.id) {
                    list_wrapper.html('');
                    modal.toast.warn('不能选择自己的下级！');
                    contacts.setCheck(info.id);
                    $scope.hasSuper = false;
                    return;
                }
            }

            var target = $(contacts.getTargets());
            if (target.length === 0) {
                parentId = null;
                list_wrapper.html('');
                return;
            }
            var _info = target.data('info');
            var span = $('<span class="label-btn btn-info"></span>');
            var i = $('<i class="fa fa-times"></i>');
            //$scope.formData.id = info.id;

            parentId = info.id;
            list_wrapper.html('');
            list_wrapper.html(span.html(info.name).append(i));
            i.click(function () {
                contacts.setCheck(info.id);
                list_wrapper.html('');
                parentId = null;
                $scope.hasSuper = false;
            });
            $scope.hasSuper = true;
        }


        // 执行操作
        $scope.saveProfit = function () {
            if ($scope.formData.groupProfit > 100 || $scope.formData.superProfit > 100) {
                modal.toast.warn('抽成比例不能大于100');
                return;
            }
            if (!$scope.formData.superProfit) {
                $scope.formData.superProfit = 0;
            }
            if (!parentId) {
                parentId = 0;
                $scope.formData.superProfit = 0;
            }
            // 设置抽成关系
            var param = {
                access_token: app.url.access_token,
                groupId: groupId,
                parentId: parentId,
                id: $scope.targetDoctorId
            };
            $http({
                url: app.url.yiliao.updateProfitRelation,
                method: 'post',
                data: param
            }).then(function (resp) {
                if (resp.data.resultCode === 1) {
                    console.log("设置抽成关系成功！");

                    // 修改抽成比例
                    param = {
                        access_token: app.url.access_token,
                        groupId: groupId,
                        id: $scope.targetDoctorId,
                        groupProfit: $scope.formData.groupProfit,
                        parentProfit: $scope.formData.superProfit
                    };
                    $http({
                        url: app.url.yiliao.updateProfit,
                        method: 'post',
                        data: param
                    }).then(function (resp) {
                        if (resp.data.resultCode === 1) {
                            console.log("修改抽成比例成功！");
                            $state.go('app.relationship.list', {id: $scope.curDepartmentId}, {reload: true});
                            html.css('overflow', 'auto');
                        } else {
                            modal.toast.warn('修改抽成比例失败！ (' + resp.data.resultMsg + ')');
                        }
                    }, function (x) {
                        console.error(x.statusText);
                    });
                } else {
                    modal.toast.warn('设置抽成关系失败！ (' + resp.data.resultMsg + ')');
                }
            }, function (x) {
                console.error(x.statusText);
            });
        };
    };

    $scope.tabs.otherInfo = function () {
        $scope.viewData.inviteCode = 'http://112.74.208.140/appInvite/joinToGroup.html?groupId=' + groupId + '&doctorId=' + doctorId;
        $scope.isLoading = false;
        if ($scope.info) {
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
                if ($rootScope.isSearch) {
                    $state.go('app.contacts.list', {id: $rootScope.keyword || utils.localData('tmpKey')}, {reload: false});
                } else {
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
        if ($rootScope.isSearch) {
            $state.go('app.contacts.list', {id: $rootScope.keyword || utils.localData('tmpKey')}, {reload: false});
        } else {
            $state.go('app.contacts.list', {id: $scope.curDepartmentId}, {reload: false});
        }
        html.css('overflow', 'auto');
    };

});