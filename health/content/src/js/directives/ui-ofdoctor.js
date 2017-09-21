app.directive('doctorDetails', ['uiLoad', 'JQ_CONFIG', '$document', '$http', 'Doctor', '$state', '$stateParams', 'modal',
    function (uiLoad, JQ_CONFIG, $document, $http, Doctor, $state, $stateParams, modal) {
        return {
            restrict: 'E',
            templateUrl: 'src/tpl/directives/doctor_details.html',

            link: function (scope, el, attr) {
                //el.addClass('hide');

                var profitContacts;
                var apportionContacts;
                var firstVisit = false;
                var dataInfo = {};
                var dataProfit = {};
                var dataApportion = {};

                scope.$root.winVisable =false;
                scope.isInit = true;

                function watch(){
                    if(scope.$root) {
                        if (scope.$root.winVisable) {
                            profitContacts = null;
                            apportionContacts = null;
                            firstVisit = true;
                            clearInterval(timer);
                            html.css('overflow', 'hidden');
                            var tab_first = el.find('.tab-container li').first();
                            if (tab_first.hasClass('active')) {
                                //firstVisit = true;
                                scope.tabs.show();
                                firstVisit = false;
                            } else {
                                tab_first.children('a').trigger('click');
                            }
                        }
                    }else{
                        clearInterval(timer);
                    }
                }

                var timer = setInterval(watch, 200);

                scope.tabs = {};
                scope.tabs.tabInfo = {};
                scope.tabs.tabProfit = {};
                scope.tabs.tabApportion = {};
                scope.viewData = {};
                scope.formData = {};
                scope.imgs = false;
                scope.isNormal = false;
                scope.isQuit = true;


                // 分派科室
                scope.apportion = function (id) {
                    //$('#doctor_apportion').removeClass('hide');
                };

                // 离职
                scope.quit = function (id) {
                    scope.$root.quitStatus = true;
                    $('#pop_win').removeClass('hide');
                };

                var data = {},
                    html = $('html');

                scope.tabs.show = function() {
                    if(firstVisit) {
                        Doctor.getAsyncData(function (dt) {
                            if (!dt) {
                                data = {};
                                scope.isQuit = true;
                                scope.viewData = {};
                                scope.isInit = true;
                                scope.isLoading = true;
                                return;
                            }
                            scope.isInit = false;
                            data = dt;

                            scope.targetDoctorId = data.doctorId;

                            scope.viewData.headPicFile = data.headPic;
                            scope.viewData.name = data.name;
                            scope.viewData.info = data.info;
                            scope.viewData.contactWay = data.contactWay || data.telephone;
                            scope.viewData.introduction = data.introduction;
                            scope.viewData.skill = data.skill;
                            scope.viewData.relation = data.relation;
                            scope.viewData.remarks = data.remarks;

                            // 保存标签页中的数据，用于检测是否修改
                            scope.tabs.tabInfo.contactWay = scope.viewData.contactWay;
                            scope.tabs.tabInfo.remarks = scope.viewData.remarks;
                            dataInfo.contactWay = scope.viewData.contactWay;
                            dataInfo.remarks = scope.viewData.remarks;

                            if (data.status === 'I') {
                                scope.isNormal = false;
                                scope.isQuit = true;
                                scope.isApply = false;
                            } else if (data.status === 'C') {
                                scope.isNormal = true;
                                scope.isQuit = false;
                                scope.isApply = false;
                            } else if (data.status === 'S') {
                                scope.isNormal = false;
                                scope.isQuit = true;
                                scope.isApply = false;
                            } else if (data.status === 'J') {
                                scope.isNormal = false;
                                scope.isQuit = true;
                                scope.isApply = true;
                            } else {
                                if (deptId) {
                                    scope.isNormal = true;
                                    scope.isQuit = false;
                                    scope.isApply = false;
                                } else {
                                    scope.isNormal = false;
                                    scope.isQuit = true;
                                    scope.isApply = false;
                                }
                            }

                            var deptId = data.departmentId;

                            if (deptId) {
                                // 获取值班表
                                $http({
                                    url: app.url.yiliao.getSchedule,
                                    method: 'post',
                                    data: {
                                        access_token: app.url.access_token,
                                        doctorId: data.doctorId
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
                        });
                    }

                    scope.apply = function(bool){
                        $http({
                            url: app.url.yiliao.confirmByDoctorApply,
                            method: 'post',
                            data: {
                                access_token: app.url.access_token,
                                id: data.groupDoctorId,
                                approve: bool
                            }
                        }).then(function (resp) {
                            if (resp.data.resultCode === 1) {
                                if(bool){
                                    modal.toast.success('已接受！');
                                    scope.isQuit = false;
                                }else{
                                    modal.toast.success('已拒绝！');
                                }
                                scope.isApply = false;
                            } else {
                                modal.toast.warn(resp.data.resultMsg);
                            }
                        }, function (x) {
                            console.error(x.statusText);
                        });
                    };

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

                    scope.saveDoctorInfo = function(){
                        scope.tabs.tabInfo.contactWay = scope.viewData.contactWay;
                        scope.tabs.tabInfo.remarks = scope.viewData.remarks;
                        var allEqual = true;

                        for(var k in dataInfo){
                            if(dataInfo[k] !== scope.tabs.tabInfo[k]){
                                allEqual = false;
                                break;
                            }
                        }
                        if(allEqual) return true;

                        $http({
                            url: app.url.yiliao.updateDoctor,
                            method: 'post',
                            data: {
                                access_token: app.url.access_token,
                                id: data.groupDoctorId,
                                contactWay: scope.viewData.contactWay,
                                remarks: scope.viewData.remarks
                            }
                        }).then(function (resp) {
                            if (resp.data.resultCode === 1) {
                                modal.toast.success('资料保存成功！');
                            }
                        }, function (x) {
                            console.error(x.statusText);
                        });

                        return true;
                    };
                }

                scope.tabs.select = function(){
                    if(scope.imgs) {
                        scope.isLoading = false;
                        return;
                    }
                    if(!data.doctorId) {
                        scope.isLoading = true;
                        return;
                    }
                    // 获取医生证件图片
                    scope.isLoading = true;
                    $http.get(app.url.doctor.getDoctorFile + '?' + $.param({
                            doctorId: data.doctorId,
                            access_token: app.url.access_token,
                            type: 5
                        })
                    ).then(function (dt) {
                        dt = dt.data.data;
                        if (dt && dt.length > 0) {
                            scope.imgs = [];
                            for(var i=0; i<dt.length; i++){
                                scope.imgs.push(dt[i].url);
                                /*if(dt[i].indexOf('/c1/') != -1){
                                    scope.imgs.push(dt[i]);
                                }*/
                            }
                            //scope.imgs = dt;
                            if(scope.imgs.length === 0){
                                scope.imgs = false;
                            }
                        } else {
                            scope.imgs = false;
                        }
                        scope.isLoading = false;
                    });
                };

                scope.tabs.setProfit = function () {
                    var list_wrapper = $('#cnt_list_department'),
                        profits_tips = $('#profits_tips'),
                        parentId = null,
                        profits = [
                            'formData.clinicParentProfit',
                            'formData.clinicGroupProfit',
                            'formData.textParentProfit',
                            'formData.textGroupProfit',
                            'formData.phoneParentProfit',
                            'formData.phoneGroupProfit',
                            'formData.carePlanParentProfit',
                            'formData.carePlanGroupProfit',
                            'formData.consultationParentProfit',
                            'formData.consultationGroupProfit'
                        ];

                    var watch_profit;
                    function monitor(){
                        watch_profit = scope.$watchGroup(profits, function(newValue, oldValue) {
                            var n = 5;
                            while (n--) {
                                if (((newValue[2 * n + 1] !== undefined) && isNaN(newValue[2 * n + 1] * 1)) || ((newValue[2 * n] !== undefined) && isNaN(newValue[2 * n] * 1))) {
                                    profits_tips.html('抽成比例必须为纯数字！');
                                    scope.settingsForm.$invalid = true;
                                    break;
                                } else {
                                    if ((newValue[2 * n + 1] * 1) > 100 || (newValue[2 * n] * 1) > 100) {
                                        profits_tips.html('单个抽成比例不能大于100%！');
                                        scope.settingsForm.$invalid = true;
                                        break;
                                    } else if ((newValue[2 * n + 1] * 1) < 0 || (newValue[2 * n] * 1) < 0) {
                                        profits_tips.html('单个抽成比例不能小于0！');
                                        scope.settingsForm.$invalid = true;
                                        break;
                                    } else {
                                        if ((newValue[2 * n + 1] * 1) + (newValue[2 * n] * 1) > 100) {
                                            profits_tips.html('集团与上级抽成比例之和不能大于100%！');
                                            scope.settingsForm.$invalid = true;
                                            break;
                                        }else{
                                            profits_tips.html('');
                                            scope.settingsForm.$invalid = false;
                                        }
                                    }
                                }
                            }
                        });
                    }

                    monitor();

/*                    if (!data.groupProfit && data.groupProfit !== 0) {
                        scope.formData.groupProfit = 0;
                    } else {
                        scope.formData.groupProfit = data.groupProfit;
                    }
                    if (!data.parentProfit && data.parentProfit !== 0) {
                        scope.formData.parentProfit = 0;
                    } else {
                        scope.formData.parentProfit = data.parentProfit;
                    }

                    if (!scope.formData.parentProfit) {
                        scope.formData.parentProfit = 0;
                    }*/

                    scope.formData.textGroupProfit = data.textGroupProfit;
                    scope.formData.textParentProfit = data.textParentProfit;
                    scope.formData.phoneGroupProfit = data.phoneGroupProfit;
                    scope.formData.phoneParentProfit = data.phoneParentProfit;
                    scope.formData.carePlanGroupProfit = data.carePlanGroupProfit;
                    scope.formData.carePlanParentProfit = data.carePlanParentProfit;
                    scope.formData.clinicGroupProfit = data.clinicGroupProfit;
                    scope.formData.clinicParentProfit = data.clinicParentProfit;
                    scope.formData.consultationGroupProfit = data.consultationGroupProfit;
                    scope.formData.consultationParentProfit = data.consultationParentProfit;

                    // 保存标签页中的数据，用于检测是否修改
                    dataProfit.textGroupProfit = scope.formData.textGroupProfit;
                    dataProfit.textParentProfit = scope.formData.textParentProfit;
                    dataProfit.phoneGroupProfit = scope.formData.phoneGroupProfit;
                    dataProfit.phoneParentProfit = scope.formData.phoneParentProfit;
                    dataProfit.carePlanGroupProfit = scope.formData.carePlanGroupProfit;
                    dataProfit.carePlanParentProfit = scope.formData.carePlanParentProfit;
                    dataProfit.clinicGroupProfit = scope.formData.clinicGroupProfit;
                    dataProfit.clinicParentProfit = scope.formData.clinicParentProfit;
                    dataProfit.consultationGroupProfit = scope.formData.consultationGroupProfit;
                    dataProfit.consultationParentProfit = scope.formData.consultationParentProfit;
                    scope.tabs.tabProfit.parentId = data.parentId;
                    dataProfit.parentId = data.parentId;

                    scope.viewData.name = data.name;

                    // 初始化通讯录列表
                    if(!profitContacts) {
                        list_wrapper.html('');
                        profitContacts = new Tree('cnt_list_relationship', {
                            hasCheck: true,
                            multiple: false,
                            self: true,
                            arrType: [0, 0],
                            data: {
                                url: app.url.yiliao.getProfitTree,
                                param: {
                                    access_token: app.url.access_token,
                                    groupId: data.groupId
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
                                var dts = profitContacts.tree.find('dt');
                                var curDt = null;
                                for (var i = 0; i < dts.length; i++) {
                                    if (dts.eq(i).data('info').id == data.parentId) {
                                        curDt = dts.eq(i);
                                        break;
                                    }
                                }
                                if (curDt) {
                                    curDt.trigger('click');
                                }
                            }
                        });
                    }

                    function check(info) {
                        if (scope.targetDoctorId == info.id) {
                            list_wrapper.html('');
                            modal.toast.warn('不能选择自己！');
                            //profitContacts.setCheck(info.id);
                            return;
                        }

                        var dts = profitContacts.tree.find('dt');
                        var curDt = null;
                        for (var i = 0; i < dts.length; i++) {
                            if (dts.eq(i).data('info').id == data.doctorId) {
                                curDt = dts.eq(i);
                                break;
                            }
                        }

                        if(curDt){
                            dts = curDt.parent().children('dd').find('dt');
                            for (var i = 0; i < dts.length; i++) {
                                if (dts.eq(i).data('info').id == info.id) {
                                    list_wrapper.html('');
                                    modal.toast.warn('不能选择自己的下级！');
                                    //profitContacts.setCheck(info.id);
                                    scope.hasSuper = false;
                                    return;
                                }
                            }
                        }

                        var target = $(profitContacts.getTargets());
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
                            profitContacts.setCheck(info.id);
                            list_wrapper.html('');
                            parentId = null;
                            scope.hasSuper = false;
                        });
                        scope.tabs.tabProfit.parentId = info.id;
                        scope.hasSuper = true;
                    }


                    // 执行操作
                    scope.saveProfit = function () {
                        if (scope.formData.textGroupProfit > 100 || scope.formData.textParentProfit > 100 ||
                            scope.formData.phoneGroupProfit > 100 || scope.formData.phoneParentProfit > 100 ||
                            scope.formData.carePlanGroupProfit > 100 || scope.formData.carePlanParentProfit > 100 ||
                            scope.formData.clinicGroupProfit > 100 || scope.formData.clinicParentProfit > 100 ||
                            scope.formData.consultationGroupProfit > 100 || scope.formData.consultationParentProfit > 100) {
                            modal.toast.warn('抽成比例不能大于100');
                            return false;
                        }

                        // 设置抽成关系
                        if(dataProfit.parentId != scope.tabs.tabProfit.parentId) {
                            var param = {
                                access_token: app.url.access_token,
                                groupId: data.groupId,
                                parentId: parentId,
                                id: scope.targetDoctorId
                            };
                            $http({
                                url: app.url.yiliao.updateProfitRelation,
                                method: 'post',
                                data: param
                            }).then(function (resp) {
                                if (resp.data.resultCode === 1) {
                                    modal.toast.success('抽成关系设置成功！');
                                } else {
                                    modal.toast.warn('抽成关系设置失败！ (' + resp.data.resultMsg + ')');
                                }
                            }, function (x) {
                                console.error(x.statusText);
                            });
                        }

                        if (dataProfit.textGroupProfit != scope.formData.textGroupProfit || dataProfit.textParentProfit != scope.formData.textParentProfit ||
                            dataProfit.phoneGroupProfit != scope.formData.phoneGroupProfit || dataProfit.phoneParentProfit != scope.formData.phoneParentProfit ||
                            dataProfit.carePlanGroupProfit != scope.formData.carePlanGroupProfit || dataProfit.carePlanParentProfit != scope.formData.carePlanParentProfit ||
                            dataProfit.clinicGroupProfit != scope.formData.clinicGroupProfit || dataProfit.clinicParentProfit != scope.formData.clinicParentProfit ||
                            dataProfit.consultationGroupProfit != scope.formData.consultationGroupProfit || dataProfit.consultationParentProfit != scope.formData.consultationParentProfit){
                            // 修改抽成比例
                            param = {
                                access_token: app.url.access_token,
                                groupId: data.groupId,
                                id: scope.targetDoctorId,
                                textGroupProfit: scope.formData.textGroupProfit,
                                textParentProfit: scope.formData.textParentProfit,
                                phoneGroupProfit: scope.formData.phoneGroupProfit,
                                phoneParentProfit: scope.formData.phoneParentProfit,
                                carePlanGroupProfit: scope.formData.carePlanGroupProfit,
                                carePlanParentProfit: scope.formData.carePlanParentProfit,
                                clinicGroupProfit: scope.formData.clinicGroupProfit,
                                clinicParentProfit: scope.formData.clinicParentProfit,
                                consultationGroupProfit: scope.formData.consultationGroupProfit,
                                consultationParentProfit: scope.formData.consultationParentProfit
                            };
                            $http({
                                url: app.url.yiliao.updateProfit,
                                method: 'post',
                                data: param
                            }).then(function (resp) {
                                if (resp.data.resultCode === 1) {
                                    modal.toast.success('抽成比例保存成功！');
                                } else {
                                    modal.toast.warn('抽成比例修改失败！ (' + resp.data.resultMsg + ')');
                                }
                            }, function (x) {
                                console.error(x.statusText);
                            });
                        }

                        return true;
                    };
                };

                scope.tabs.apportion = function(){
                    var list_wrapper = $('#cnt_list_wrapper');
                    var list_arr = [];
                    if(!data.doctorId) {
                        return;
                    }
                    //data = Doctor.getData();
                    //list_wrapper.html('');

                    scope.viewData.headPicFile = data.headPic;
                    scope.tabs.tabApportion.dptId = 0;
                    dataApportion.dptId = 0;

                    // 初始化通讯录列表
                    if(!apportionContacts) {
                        list_wrapper.html('');
                        apportionContacts = new Tree('cnt_list_apportion', {
                            hasCheck: true,
                            multiple: false,
                            self: true,
                            arrType: [1, 1, 1, 0],
                            data: {
                                url: app.url.yiliao.getAllData,
                                param: {
                                    access_token: app.url.access_token,
                                    groupId: data.groupId
                                }
                            },
                            async: false,
                            icons: {
                                arrow: 'fa fa-caret-right/fa fa-caret-down',
                                check: 'fa fa-check/fa fa-square',
                                root: 'fa fa-hospital-o dcolor',
                                branch: 'fa fa-h-square dcolor',
                                leaf: 'fa fa-h-square dcolor'
                            },
                            datakey: {
                                id: 'id',
                                name: 'name',
                                sub: 'subList'
                            },
                            info: {
                                name: 'name',
                                id: 'id',
                                pid: 'parentId',
                                description: 'description'
                            },
                            events: {
                                click: check
                            },
                            callback: function () {
                                //var cnt_list = $('#cnt_list_apportion');
                                var dts = apportionContacts.tree.find('dt');
                                var curDt = null;
                                for (var i = 0; i < dts.length; i++) {
                                    if (dts.eq(i).data('info').id == data.departmentId) {
                                        curDt = dts.eq(i);
                                        break;
                                    }
                                }
                                if (curDt) {
                                    curDt.trigger('click');
                                }
                            }
                        });
                    }

                    function check(info) {
                        var target = $(apportionContacts.getTargets());
                        if (target.length === 0) {
                            list_wrapper.html('');
                            return;
                        }
                        list_arr = [];    // 修改
                        var _infos = target;
                        var span = $('<span class="label-btn btn-info"></span>');
                        var i = $('<i class="fa fa-times"></i>');
                        scope.formData.id = info.id;
                        list_arr.push(info.id);
                        list_wrapper.html('');
                        list_wrapper.html(span.html(info.name).append(i));
                        i.click(function () {
                            apportionContacts.setCheck(info.id);
                            list_wrapper.html('');
                            scope.formData.id = null;
                            list_arr = [];    // 修改
                        });
                        scope.tabs.tabApportion.dptId = info.id;
                    }

                    // 保存科室信息
                    scope.saveApportion = function () {
                        if (scope.curDepartmentId === list_arr[0]){
                            return false;
                        }
                        if(dataApportion.dptId !== scope.tabs.tabApportion.dptId) {
                            if (list_arr.length === 0) {
                                modal.toast.warn("请选择组织！");
                                return false;
                            }
                            $http({
                                url: app.url.yiliao.saveDoctor,
                                method: 'post',
                                data: {
                                    access_token: app.url.access_token,
                                    departmentIds: list_arr.length > 0 ? list_arr : 0,
                                    doctorId: data.doctorId,
                                    groupId: data.groupId
                                }
                            }).then(function (resp) {
                                if (resp.data.resultCode === 1) {
                                    modal.toast.success("组织分配成功！");
                                } else {
                                    modal.toast.warn("分配失败！");
                                }
                            }, function (x) {
                                console.error(x.statusText);
                            });
                        }
                        return true;
                    };
                };

                scope.tabs.otherInfo = function(){
                    scope.viewData.inviteCode = window.location.protocol + '//' + window.location.host + '/appInvite/joinToGroup.html?groupId=' + data.groupId + '&doctorId=' + data.doctorId;
                    scope.isLoading = false;
                    if(scope.info) {
                        scope.isLoading = false;
                        return;
                    }
                    scope.isLoading = true;
                    // 获取医生其它信息
                    $http({
                        url: app.url.yiliao.getUserDetail,
                        data: {
                            userId: data.doctorId,
                            access_token: app.url.access_token
                        },
                        method: 'post'
                    }).then(function (dt) {
                        dt = dt.data.data;
                        if (dt && dt.length > 0) {
                            scope.info = dt;
                        } else {
                            scope.info = false;
                        }
                        scope.isLoading = false;
                    });
                };

                // 保存医生信息
                scope.save = function () {
                    var allDone = true;
                    if(scope.saveDoctorInfo){
                        if(!scope.saveDoctorInfo()) allDone = false;
                    }
                    if(scope.saveProfit){
                        if(!scope.saveProfit()) allDone = false;
                    }
                    if(scope.saveApportion){
                        if(!scope.saveApportion()) allDone = false;
                    }

                    if(allDone){
                        var href = (window.location.hash).substring(2).replace(/\//g, '.');
                        if($stateParams.hasOwnProperty('id')){
                            var idx = href.lastIndexOf('.');
                            href = href.substring(0, idx);
                            $state.go(href,{id: new Date().getTime()},{reload: false});
                        }
                    }
                    scope.cancel();
                };

                // 模态框退出
                scope.cancel = function () {
                    scope.imgs = null;
                    scope.$root.winVisable =false;
                    firstVisit = true;

                    timer = setInterval(watch, 200);
                    el.addClass('hide');
                    html.css('overflow', 'auto');
                };
            },
            post: function(){
                console.log('---------------->')
            }
        };
    }
]);


app.directive('popWin', ['uiLoad', 'JQ_CONFIG', '$document', '$http', 'Doctor', '$state', 'modal',
    function (uiLoad, JQ_CONFIG, $document, $http, Doctor, $state, modal) {
        return {
            restrict: 'E',
            templateUrl: 'src/tpl/directives/pop_win.html',

            link: function (scope, el, attr) {

                var data = {};

                scope.viewData = {};
                scope.showInfo = true;
                scope.showWarn = false;

                scope.$root.quitStatus =false;

                function watch(){
                    if(scope.$root) {
                        if (scope.$root.quitStatus) {
                            clearInterval(timer);
                            init();
                        }
                    }else{
                        clearInterval(timer);
                    }
                }

                var timer = setInterval(watch, 200);

                function init(){

                    data = Doctor.getData();
                    scope.viewData.headPicFile = data.headPic;
                    scope.viewData.name = data.name;
                    scope.viewData.info = data.info;

                }

                // 保存医生信息
                scope.doQuit = function () {

                    // 删除医生
                    $http({
                        url: app.url.yiliao.dimission,
                        method: 'post',
                        data: {
                            access_token: app.url.access_token,
                            groupId: data.groupId,
                            doctorId: data.doctorId
                        }
                    }).then(function (resp) {
                        if (resp.data.resultCode === 1) {
                            modal.toast.success('解除成功！');
                            $state.reload(function(){
                                if(scope.toCurPage){
                                    scope.toCurPage();
                                }
                            });
                        } else {
                            scope.showInfo = false;
                            scope.showWarn = true;
                            scope.viewData.warn_text = resp.data.resultMsg || '操作失败！';
                            console.warn((resp.data.resultMsg || '操作失败！') + ' (代码：' + resp.data.resultCode + ')');
                            modal.toast.warn((resp.data.resultMsg || '操作失败！') + ' (代码：' + resp.data.resultCode + ')');
                        }
                    }, function (x) {
                        console.error(x.statusText);
                    });

                };

                // 模态框退出
                scope.exit = function () {
                    scope.imgs = null;
                    scope.$root.quitStatus =false;

                    timer = setInterval(watch, 200);
                    el.addClass('hide');
                    //$state.reload();
                };
            }
        };
    }
]);

