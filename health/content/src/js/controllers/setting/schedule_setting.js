'use strict';

app.controller('ScheduleSetting', function ($rootScope, $scope, $state, $http, $compile, utils, uiLoad, JQ_CONFIG, modal) {
    var data = null,
        cnt_list = $('#cnt_list'),
        items = cnt_list.find('.list-group-item'),
        dt = null,
        groupId = utils.localData('curGroupId'),
        fixDt = [],
        fixDtLen,
        tempTimeForFree,
        tempPrice,
        tempStartTime,
        tempEndTime;

    $scope.formData = {};
    $scope.loading = true;

    $scope.formData.paramTime = [];
    $scope.formData.paramPrice = [];

    uiLoad.load(JQ_CONFIG.dateTimePicker).then(function () {
        var start_time = $("#start_time").datetimepicker({
            format: "hh:ii",
            initialDate: new Date(),
            startView: 1,
            minView: 0,
            minuteStep: 5,
            autoclose: true,
            keyboardNavigation: false,
            pickerPosition: "bottom-right",
            todayBtn: false,
            language: 'zh-CN'
        }).on('show', function (e) {
            //console.log(e.handleObj.handler(e.handleObj.guid));
            $('.datetimepicker').find('thead th').css({'height': 0, 'padding': 0, 'font-size': 0});
        })/*.on('changeDate', function(){
         end_time.datetimepicker('setStartDate',$(this).val());
         })*/;
        var end_time = $("#end_time").datetimepicker({
            format: "hh:ii",
            initialDate: new Date(),
            startView: 1,
            minView: 0,
            minuteStep: 5,
            autoclose: true,
            keyboardNavigation: false,
            pickerPosition: "bottom-right",
            todayBtn: false,
            language: 'zh-CN'
        }).on('show', function (e) {
            //start_time.datetimepicker('setEndDate',$(this).val());
        });
    });

    $http({
        url: app.url.yiliao.getHasSetPrice,
        data: {
            access_token: app.url.access_token,
            groupId: groupId
        },
        method: 'post'
    }).then(function (resp) {
        if (resp.data.resultCode === 1 && resp.data.data) {
            var dt = resp.data.data;
            var _len = dt.length;
            if (_len) {
                tempTimeForFree = $scope.formData.taskForFree = dt[0].taskDuration / 3600;
            }else{
                tempTimeForFree = $scope.formData.taskForFree = 0;
            }

            fixDt = [];
            for (var i = 0; i < _len; i++) {
                if (dt[i].doctor) {
                    fixDt.push({
                        id: dt[i].doctor.doctorId,
                        name: dt[i].doctor.name,
                        departments: dt[i].doctor.departments
                    });
                }
            }
            fixDtLen = fixDt.length;
            makeList(fixDt);
        }
    });


    $http({
        url: app.url.yiliao.getGroupInfo,
        method: 'post',
        data: {
            access_token: app.url.access_token,
            id: groupId
        }
    }).then(function (resp) {
        if (resp.data.resultCode === 1) {
            tempStartTime = $scope.formData.startTime = resp.data.data.config.dutyStartTime;
            tempEndTime = $scope.formData.endTime = resp.data.data.config.dutyEndTime;
            tempPrice = $scope.formData.priceForTask = resp.data.data.outpatientPrice / 100;
        } else {
            modal.toast.warn('保存失败！' + resp.data.resultMsg, 5000);
        }
    });

    function pickData() {
        // 创建通讯录列表数据
        var databox = new DataBox('data_res', {
            hasCheck: true,
            allCheck: true,
            leafCheck: false,
            multiple: true,
            allHaveArr: true,
            self: false,
            cover: false,
            //unionSelect: true,
            selectView: true,
            arrType: [1, 0],
            search: {
                url: app.url.yiliao.searchDoctorByKeyWord,
                param: {
                    access_token: app.url.access_token,
                    groupId: groupId,
                    keyword: 'name',
                    pageSize: 10000,
                    pageIndex: 0
                },
                dataKey: {
                    name: 'doctor.name',
                    id: 'doctorId',
                    union: 'departmentId',
                    dataSet: 'data.pageData'
                },
                keyName: 'keyword',
                unwind: false
            },
            data: {
                url: app.url.yiliao.getAllData,
                param: {
                    access_token: app.url.access_token,
                    groupId: groupId
                }
            },
            async: {
                url: app.url.yiliao.getDepartmentDoctor,
                dataKey: {
                    departmentId: 'id'
                },
                data: {
                    access_token: app.url.access_token,
                    groupId: groupId,
                    status: 'C',
                    type: 1
                },
                dataName: '',
                target: {
                    data: '',
                    dataKey: {
                        id: 'id',
                        name: 'name'
                    }
                }
            },
            titles: {
                main: '选择值班医生',
                searchKey: '医生姓名',
                label: '已选择医生'
            },
            icons: {
                arrow: 'fa fa-caret-right/fa fa-caret-down',
                check: 'fa fa-check/fa fa-square',
                root: 'fa fa-hospital-o cfblue',
                branch: 'fa fa-h-square cfblue',
                leaf: 'fa fa-user-md dcolor',
                head: 'headPicFileName'
            },
            root: {
                selectable: false,
                name: utils.localData('curGroupName'),
                id: 0
            },
            extra: [{
                name: '未分配',
                id: 'idx_0',
                parentId: 0,
                subList: [],
                url: app.url.yiliao.getUndistributed,
                dataName: 'pageData',
                target: {
                    data: 'doctor',
                    dataKey: {
                        id: 'doctorId',
                        name: 'name'
                    }
                },
                param: {
                    access_token: app.url.access_token,
                    groupId: groupId,
                    pageIndex: 0,
                    pageSize: 10000
                },
                icon: 'fa fa-bookmark'
            }],
            fixdata: fixDt,
            response: makeList,
            datakey: {
                id: 'id',
                name: 'name',
                sub: 'subList'
            },
            info: {
                name: 'name',
                id: 'id',
                pid: 'parentId',
                dpt: 'departments',
                description: 'description',
                param: 'param',
                icon: 'icon',
                url: 'url',
                isExtra: 'isExtra',
                target: 'target'
            },
            callback: function () { }
        });
    }

    $scope.addData = function () {
        pickData();
    };

    $scope.saveData = function () {
        var timeForFree = $scope.formData.taskForFree * 1;
        var _bool = !isNaN(timeForFree) && tempTimeForFree !== timeForFree;
        if(_bool || ids.length != fixDtLen || (!$scope.formData.taskForFree && ids.length > 0)) {
            tempTimeForFree = timeForFree;

            if (ids.length === 0 && timeForFree){
                $scope.formData.taskForFree = 0;
                //modal.toast.warn('“免费值班名单”不能为空！');
                //return;
            }else{
                if(Math.ceil(timeForFree) > timeForFree){
                    modal.toast.warn('“免费值班时间”必须为整数！');
                    return;
                }
            }
            if (ids.length > 0 && isNaN(timeForFree)) {
                modal.toast.warn('“免费值班时间”格式必须为有效数值！');
            } else if (ids.length > 0 && (!timeForFree || timeForFree < 1)) {
                modal.toast.warn('“免费值班时间”不能少于1小时！');
            } else {
                if (!timeForFree) {
                    timeForFree = 0;
                }
                if(Math.ceil(timeForFree) > timeForFree){
                    modal.toast.warn('“免费值班时间”必须为整数！');
                    return;
                }
                if (ids.length === 0) {
                    $scope.formData.paramTime = [];
                } else {
                    $scope.formData.paramTime = [];
                    for (var i = 0; i < ids.length; i++) {
                        $scope.formData.paramTime.push({
                            doctorId: ids[i],
                            taskDuration: timeForFree * 3600
                        });
                    }
                }

                $http.get(app.url.yiliao.setTaskTimeLong + '?' + utils.serialize({
                        access_token: app.url.access_token,
                        groupId: groupId,
                        entries: $scope.formData.paramTime
                    })).then(function (resp) {
                    if (resp.data.resultCode === 1) {
                        modal.toast.success('“免费值班”设置成功！');
                    } else {
                        //modal.toast.warn('“值班名单”设置失败！' + resp.data.resultMsg, 10000);
                    }
                });
            }
        }else{
            modal.toast.warn('未作任何变更，无需保存！');
        }

        var priceForTask = $scope.formData.priceForTask * 1;
        if(tempPrice != priceForTask) {
            tempPrice = priceForTask;
            if(isNaN(priceForTask) || !$scope.formData.priceForTask){
                modal.toast.warn('“值班价格”格式必须为有效数值！');
            } else if ($scope.formData.priceForTask && $scope.formData.priceForTask < 1) {
                modal.toast.warn('单价不能小于1元，请重新填写！');
            } else if ($scope.formData.priceForTask) {
                $http.get(app.url.yiliao.setOutpatientPrice + '?' + utils.serialize({
                        access_token: app.url.access_token,
                        groupId: groupId,
                        outpatientPrice: $scope.formData.priceForTask * 100
                        //entries:$scope.formData.paramPrice
                    })).then(function (resp) {
                    if (resp.data.resultCode === 1) {
                        modal.toast.success('“值班价格”设置成功！');
                    } else {
                        modal.toast.warn('“值班价格”设置失败！' + resp.data.resultMsg);
                    }
                });
            }
        }
        if(tempStartTime != $scope.formData.startTime || tempEndTime != $scope.formData.endTime) {
            tempStartTime = $scope.formData.startTime;
            tempEndTime = $scope.formData.endTime;
            if ($scope.formData.startTime || $scope.formData.endTime) {
                if ($scope.formData.startTime) {
                    if (!$scope.formData.endTime) {
                        modal.toast.warn('请设置值班结束时间！');
                        return;
                    }
                } else if ($scope.formData.endTime) {
                    if (!$scope.formData.startTime) {
                        modal.toast.warn('请设置值班起始时间！');
                        return;
                    }
                }
                $http({
                    url: app.url.yiliao.updateDutyTime,
                    method: 'post',
                    data: {
                        access_token: app.url.access_token,
                        groupId: groupId,
                        dutyStartTime: $scope.formData.startTime,
                        dutyEndTime: $scope.formData.endTime
                    }
                }).then(function (resp) {
                    if (resp.data.resultCode === 1) {
                        modal.toast.success('“有效值班时间”设置成功！');
                    } else {
                        modal.toast.warn('“有效值班时间”设置失败！' + resp.data.resultMsg);
                    }
                });
            }
        }
    };

    var ids = [];

    function makeList(dt) {
        fixDt = dt;
        ids = [];

        $scope.formData.paramTime = [];
        $scope.formData.paramPrice = [];

        var labContainer = $('#lab_container');
        labContainer.html('');
        for (var i = 0; i < dt.length; i++) {
            ids.push(dt[i].id);
            var iDiv = $('<div></div>');
            var iEle = $('<i class="fa fa-times"></i>');
            //iDiv.append(iEle).append('<h3>'+ dt[i].name +'</h3>').append('科室：').append('<span>'+ (dt[i].departments || "--") +'</span>');
            iDiv.append(iEle).append('<h3>' + dt[i].name + '</h3>');
            labContainer.append(iDiv);
            iEle.on('click', dt[i].id, function (e) {
                var idx = ids.indexOf(e.data);
                if (idx !== -1) {
                    ids.splice(idx, 1);
                    fixDt.splice(idx, 1);
                    $(this).parent().remove();
                }
            });
        }
    }
});
