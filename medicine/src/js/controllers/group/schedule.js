'use strict';

app.directive('slideBar', function () {
    return {
        link: function (scope, element, attrs) {
            function expand() {
                element.removeClass('sch-slide-bar-hide').
                    addClass('sch-slide-bar-show').height("100%");
            }

            function collapse() {
                element.removeClass('sch-slide-bar-show').
                    addClass('sch-slide-bar-hide').height("100%");
            }

            scope.$watch(attrs.collapse, function (shouldCollapse) {
                if (shouldCollapse) {
                    collapse();
                } else {
                    expand();
                }
            });
        }
    }
});

app.controller('ScheduleCtrl', ['$rootScope', '$scope', '$http', '$log', 'utils', '$state', '$modal', 'toaster',
    function ($rootScope, $scope, $http, $log, utils, $state, $modal, toaster) {
        $scope.isCollapsed = true;
        var curGroupId = localStorage.getItem('curGroupId');
        $scope.depDocs = null;
        var doctorId = localStorage.getItem('user_id');
        var access_token = localStorage.getItem('access_token');

        var contacts = new Tree('sch_cnt_list', {
            hasCheck: false,
            allCheck: false,
            multiple: false,
            allHaveArr: false,
            self: true,
            search: false,
            arrType: [1,0],
            data: {
                url: app.url.yiliao.getAllData,
                param: {
                    access_token: app.url.access_token,
                    groupId: curGroupId
                }
            },
            datakey: {
                id: 'id',
                name: 'name',
                sub: 'subList'
            },
            info: {
                name: 'name',
                id: 'id',
                pid: 'department',
                description: 'description'
            },
            events: {
                click: forward
            },
            callback: function () {
                var cnt_list = $('#sch_cnt_list');
                var curDepartment = cnt_list.find('.cnt-list-warp').first();
                curDepartment.find('dt').first().addClass('cur-line').trigger('click');
            }
        });

        function forward(info) {
            $scope.isCollapsed = true;
            var id = info.id;
            var name = info.name;
            $scope.currentDepartName = name;
            $scope.currentDepartId = id;
            $scope.$apply();


            //获取部门下面医生的数据
            $http.post(app.url.yiliao.getDepDocs, {
                "access_token": access_token,
                "departmentId": id.toString()
            }).
                success(function (data, status, headers, config) {
                    if (data.resultCode == 1) {
                        $scope.depDocs = [];
                        var _depDocs = [];
                        for (var i = 0; i < data.data.pageData.length; i++) {
                            var _docInfo = {
                                name: data.data.pageData[i].doctor.name,
                                position: data.data.pageData[i].doctor.position,
                                doctorId: data.data.pageData[i].doctor.doctorId,
                                headPicFilePath: data.data.pageData[i].doctor.headPicFilePath || 'src/img/a0.jpg'
                            };
                            _depDocs.push(_docInfo);
                            $scope.depDocs = _depDocs;
                        }
                    }
                    else {
                        console.log(data.resultMsg);
                    }

                }).
                error(function (data, status, headers, config) {
                    console.log(data);
                });

            $scope.getOnlineId = function (weekday, stage) {
                if ($scope.depData.clinicDate == undefined) {
                } else {
                    var filtered = $scope.depData.clinicDate.filter(function (item, index, array) {
                        return item.week == weekday && item.period == stage;
                    });
                    if (filtered.length > 0) {
                        return filtered[0].onlineId;
                    } else {
                        return null;
                    }
                }
            }
            //获取部门下面的值班数据
            $scope.getOnlines = function () {
                $http.post(app.url.yiliao.getDptSchedule, {
                    "access_token": access_token,
                    "departmentId": id.toString()
                }).
                    success(function (data, status, headers, config) {
                        $scope.depData = data.data;
                        $scope.filterSchedule = function (weekday, stage) {
                            if ($scope.depData.clinicDate == undefined) {
                            } else {
                                var filtered = $scope.depData.clinicDate.filter(function (item, index, array) {
                                    return item.week == weekday && item.period == stage;
                                });
                                if (filtered.length > 0) {
                                    return filtered[0].doctors;
                                } else {
                                    return null;
                                }
                            }

                        }
                    }).
                    error(function (data, status, headers, config) {
                        alert(data);
                    });
            };

            $scope.getOnlines();
            // 右侧滑动框的状态
            $scope.collapse = function () {
                $scope.isCollapsed = true;
            }


            $scope.weekdays = [1, 2, 3, 4, 5, 6, 7];
            $scope.dataStages = [1, 2, 3];
            $scope.startTime = null;
            $scope.endTime = null;
            $scope.minTime = null;
            $scope.maxTime = null;
            $scope.tdClick = function ($event, weekday, stage) {
                if ($event.currentTarget == $event.target) {
                    if ($scope.isCollapsed == false) {
                        $scope.isCollapsed = true;
                    } else {
                        $log.log(weekday + stage);
                        $scope.currentWeekday = weekday;

                        $scope.currentStage = stage;
                        if ($scope.depDocs == null) {
                            return;
                        }
                        for (var i = 0; i < $scope.depDocs.length; i++) {
                            $scope.depDocs[i].check = false;
                        }
                        ;

                        if (stage == 1) {
                            $scope.startTime = new Date();
                            $scope.startTime.setHours(9);
                            $scope.startTime.setMinutes(0);
                            $scope.startTime.setMilliseconds(0);

                            $scope.endTime = new Date();
                            $scope.endTime.setHours(12);
                            $scope.endTime.setMinutes(0);
                            $scope.endTime.setMilliseconds(0);
                        } else if (stage == 2) {
                            $scope.startTime = new Date();
                            $scope.startTime.setHours(12);
                            $scope.startTime.setMinutes(0);
                            $scope.startTime.setMilliseconds(0);

                            $scope.endTime = new Date();
                            $scope.endTime.setHours(19);
                            $scope.endTime.setMinutes(0);
                            $scope.endTime.setMilliseconds(0);
                        } else if (stage == 3) {
                            $scope.startTime = new Date();
                            $scope.startTime.setHours(19);
                            $scope.startTime.setMinutes(0);
                            $scope.startTime.setMilliseconds(0);
                            $scope.endTime = new Date();
                            $scope.endTime.setHours(24);
                            $scope.endTime.setMinutes(0);
                            $scope.endTime.setMilliseconds(0);
                        }


                        $scope.isCollapsed = false;
                    }
                    $event.stopPropagation();
                }


            }

            //timepicker
            $scope.mytime = new Date();

            $scope.hstep = 1;
            $scope.mstep = 10;

            //删除单个医生
            $scope.closeTab = function ($event, weekday, stage, doctorId, doctorName) {
                if ($event.currentTarget == $event.target) {
                    var delModal = $modal.open({
                        templateUrl: 'delDocOnline.html',
                        controller: 'delDocOnlineCtrl',
                        size: 'sm',
                        resolve: {
                            item: function () {
                                return doctorName;
                            }
                        }
                    });

                    delModal.result.then(function (status) {
                        if (status == 'ok') {
                            // var filtered = $scope.depData.clinicDate.filter(function(item, index, array) {
                            //   return item.week == weekday && item.period == stage;
                            // });
                            // var onlineId = filtered[0].onlineId;

                            $http.post(app.url.yiliao.deleteOnline, {
                                "access_token": access_token,
                                "doctorId": doctorId,
                                "departmentId": $scope.currentDepartId,
                                "period": stage,
                                "week": weekday
                            }).
                                success(function (data, status, headers, config) {
                                    if (data.resultCode == 1) {
                                        $scope.getOnlines();
                                    }
                                }).
                                error(function (data, status, headers, config) {
                                    console.log(data);
                                });
                        }
                    }, function () {
                        $log.info('removeModal dismissed at: ' + new Date());
                    });

                }
                ;
                $event.stopPropagation();
            };


            app.controller('delDocOnlineCtrl', ['$scope', '$modalInstance', 'item', '$http', function ($scope, $modalInstance, item, $http) {
                $scope.doctorName = item;
                $scope.ok = function () {
                    $modalInstance.close('ok');
                };

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            }]);

            function checkTime(i) {
                if (i < 10) {
                    i = "0" + i
                }
                return i.toString();
            }

            $scope.translateWeekday = function (weekday) {
                switch (weekday) {
                    case 1:
                        return '星期一';
                    case 2:
                        return '星期二';
                    case 3:
                        return '星期三';
                    case 4:
                        return '星期四';
                    case 5:
                        return '星期五';
                    case 6:
                        return '星期六';
                    case 7:
                        return '星期天';
                }
            };

            $scope.translateStage = function (stage) {
                switch (stage) {
                    case 1:
                        return '上午';
                    case 2:
                        return '下午';
                    case 3:
                        return '晚上';
                }
            };
            $scope.submit = function () {
                var startTime = checkTime($scope.startTime.getHours()) + checkTime($scope.startTime.getMinutes());
                var endTime = checkTime($scope.endTime.getHours()) + checkTime($scope.endTime.getMinutes());
                var checkDocs = $scope.depDocs.filter(function (item, index, array) {
                    if (item.check != undefined && item.check == true) {
                        item.startTime = startTime;
                        item.endTime = endTime;
                        return item;
                    }
                });
                var doctors = [];
                for (var i = 0; i < checkDocs.length; i++) {
                    var doctor = {
                        "doctorId": checkDocs[i].doctorId,
                        "doctorName": checkDocs[i].name,
                        "startTime": checkDocs[i].startTime,
                        "endTime": checkDocs[i].endTime
                    }
                    doctors.push(doctor);
                }

                if (doctors.length > 0) {

                } else {
                    toaster.pop('warning', '', '没有选中医生');
                    return;
                }
                var data = {
                    "departmentId": $scope.currentDepartId,
                    "clinicDate": [{
                        "week": $scope.currentWeekday,
                        "period": $scope.currentStage,
                        "doctors": doctors
                    }]
                };

                $http.post(app.url.yiliao.addOnline, {
                    "data": JSON.stringify(data),
                    "access_token": access_token
                }).success(function (data, status, headers, config) {
                    if (data.resultCode == 1) {
                        toaster.pop('success', '', '提交成功');
                        $scope.isCollapsed = true;
                        $scope.getOnlines();
                    } else {
                        toaster.pop('error', '', '提交失败');
                    }
                }).error(function (data, status, headers, config) {
                    toaster.pop('error', '', '提交失败');
                    console.log(data);
                });
            }
        }
    }
]);