app.directive('doctorDetails', ['uiLoad', 'JQ_CONFIG', '$document', '$http', 'Doctor', '$state', '$stateParams',
    function (uiLoad, JQ_CONFIG, $document, $http, Doctor, $state, $stateParams) {
        return {
            restrict: 'E',
            //template: '<i class="fa fa-expand fa-fw text"></i><i class="fa fa-compress fa-fw text-active"></i>',
            templateUrl: 'src/tpl/directives/doctor_details.html',

            link: function (scope, el, attr) {
                //el.addClass('hide');

                scope.$root.winVisable =false;

                function watch(){
                    if(scope.$root) {
                        if (scope.$root.winVisable) {
                            clearInterval(timer);
                            html.css('overflow', 'hidden');
                            var tab_first = el.find('.tab-container li').first();
                            if (tab_first.hasClass('active')) {
                                scope.tabs.show();
                                //tab_first.next().children('a').trigger('click');;
                                //tab_first.children('a').trigger('click');
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
                scope.viewData = {};
                scope.imgs = false;
                scope.isNormal = false;
                scope.isQuit = true;


                // 分派科室
                scope.apportion = function (id) {
                    $state.go('app.contacts.list.apportion');
                };

                // 离职
                scope.quit = function (id) {
                    $state.go('app.contacts.list.quit');
                };

                var data = {},
                    html = $('html');

                scope.tabs.show = function() {
                    //html.css('overflow', 'hidden');
                    data = Doctor.getData();

/*                    $http({
                        url: app.url.yiliao.getUserDetail,
                        data: {
                            access_token: app.url.access_token,
                            userId: data.doctorId
                        },
                        method: 'post'
                    }).then(function(resp){
                        if(resp.data.data){
                            data = resp.data.data;
                            scope.viewData.headPicFile = data.headPicFileName;
                            scope.viewData.name = (data.name && data.name.length !== 0) ? data.name : '--';
                            scope.viewData.info = ((data.doctor.title && data.doctor.title.length !== 0) ? data.doctor.title : '--') + ' / ' + ((data.doctor.departments && data.doctor.departments.length !== 0) ? data.doctor.departments : '--') + ' / ' + ((data.doctor.hospital && data.doctor.hospital.length !== 0) ? data.doctor.hospital : '--');
                            scope.viewData.contactWay = data.contactWay;
                            scope.viewData.introduction = (data.doctor.introduction && data.doctor.introduction.length !== 0) ? data.doctor.introduction : '--';
                            scope.viewData.skill = (data.doctor.skill && data.doctor.skill.length !== 0) ? data.doctor.skill : '--';
                            scope.viewData.relation = (data.inviteMsg && data.inviteMsg.length !== 0) ? data.inviteMsg : '--';
                            scope.viewData.remarks = data.remarks;
                        }
                    });*/

                    Doctor.getAsyncData(function(data){
                        if(!data) return;
                        scope.viewData.headPicFile =data.headPic;
                        scope.viewData.name =data.name;
                        scope.viewData.info =data.info;
                        scope.viewData.contactWay = data.contactWay;
                        scope.viewData.introduction = data.introduction;
                        scope.viewData.skill =data.skill;
                        scope.viewData.relation =data.relation;
                        scope.viewData.remarks = data.remarks;

                        if (data.status === 'I') {
                            scope.isNormal = false;
                            scope.isQuit = true;
                        } else if (data.status === 'C') {
                            scope.isNormal = true;
                            if (deptId) {
                                scope.isQuit = false;
                            }
                        } else if (data.status === 'S') {
                            scope.isNormal = false;
                            scope.isQuit = true;
                        } else {
                            if (deptId) {
                                scope.isNormal = true;
                                scope.isQuit = false;
                            } else {
                                scope.isNormal = false;
                                scope.isQuit = true;
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
/*
                    setTimeout(function(){
                    if(!data) return;



                    try{
                        scope.$apply(scope.viewData);
                    }catch(e){

                    }
                    }, 1000);*/

/*                    scope.viewData.headPicFile = data.doctor.headPicFilePath;
                    scope.viewData.name = (data.doctor.name && data.doctor.name.length !== 0) ? data.doctor.name : '--';
                    scope.viewData.info = ((data.doctor.position && data.doctor.position.length !== 0) ? data.doctor.position : '--') + ' / ' + ((data.doctor.departments && data.doctor.departments.length !== 0) ? data.doctor.departments : '--') + ' / ' + ((data.doctor.hospital && data.doctor.hospital.length !== 0) ? data.doctor.hospital : '--');
                    scope.viewData.contactWay = data.contactWay;
                    scope.viewData.introduction = (data.doctor.introduction && data.doctor.introduction.length !== 0) ? data.doctor.introduction : '--';
                    scope.viewData.skill = (data.doctor.skill && data.doctor.skill.length !== 0) ? data.doctor.skill : '--';
                    scope.viewData.relation = (data.invite.inviteMsg && data.invite.inviteMsg.length !== 0) ? data.invite.inviteMsg : '--';
                    scope.viewData.remarks = data.remarks;*/



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
                }

                scope.tabs.select = function(){
                    if(scope.imgs) {
                        scope.isLoading = false;
                        return;
                    }
                    // 获取医生证件图片
                    scope.isLoading = true;
                    $http.get(app.url.upload.getCertPath + '?' + $.param({
                            userId: data.doctorId,
                            access_token: app.url.access_token
                        })
                    ).then(function (dt) {
                        dt = dt.data.data;
                        if (dt && dt.length > 0) {
                            scope.imgs = dt;
                        } else {
                            scope.imgs = false;
                        }
                        scope.isLoading = false;
                    });
                };

                scope.tabs.otherInfo = function(){
                    scope.viewData.inviteCode = 'http://112.74.208.140/appInvite/joinToGroup.html?groupId=' + data.groupId + '&doctorId=' + data.doctorId;
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
                    $http({
                        url: app.url.yiliao.updateDoctor,
                        method: 'post',
                        data: {
                            access_token: app.url.access_token,
                            id: data.groupDoctorId,
                            contactWay: scope.viewData.contactWay || '--',
                            remarks: scope.viewData.remarks || '--'
                        }
                    }).then(function (resp) {
                        if (resp.data.resultCode === 1) {
                            scope.cancel();
                            var href = (window.location.hash).substring(2).replace(/\//g, '.');
                            if($stateParams){
                                var idx = href.lastIndexOf('.');
                                href = href.substring(0, idx);
                                $state.go(href,{id: new Date().getTime()},{reload: false});
                            }
                        }
                    }, function (x) {
                        console.error(x.statusText);
                    });
                };

                // 模态框退出
                scope.cancel = function () {
                    scope.imgs = null;
                    scope.$root.winVisable =false;

                    timer = setInterval(watch, 200);
                    el.addClass('hide');
                    //window.history.back();
                    //console.log($stateParams)
                    html.css('overflow', 'auto');
                };


                /*                uiLoad.load(JQ_CONFIG.databox).then(function () {

                                    el.on('click', function () {
                                        var target;
                                        attr.target && (target = $(attr.target)[0]);
                                        //screenfull.toggle(target);
                                        console.log('dsfsdfdsfdsfds')
                                    });

                                    $document.on('mousedown', function () {

                                    });
                                });*/
            },
            post: function(){
                console.log('---------------->')
            }
        };
    }
]).controller('RelationshipEdit', function ($scope, $http) {
    var dataset = {};
});