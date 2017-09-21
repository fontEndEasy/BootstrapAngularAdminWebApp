'use strict';

// 首页控制器
app.controller('HomeController', ['$state', '$cookieStore', '$http', '$rootScope', 'utils',
    function ($state, $cookieStore, $http, $rootScope, utils) {
        var date = new Date();
        var _y = date.getFullYear();
        var _M = date.getMonth() + 1;
        var _d = date.getDate();
        var _h = date.getHours();
        var _m = date.getMinutes();
        console.log('欢迎来到 [' + document.title + '], 当前时间是: ' + _y + ' 年 ' + _M + ' 月 ' + _d + ' 日 ' + (_h >= 12 ? ('下午 ' + _h % 12) : ('上午 ' + _h)) + ' 点 ' + _m + ' 分');

        var cookie = $cookieStore.get('username');

        if (!cookie) {
            //$state.go('access.signin');
        }

        // 初始化页面数据
        var urls = [
            app.url.admin.check.getDoctors,
            app.url.admin.check.getDoctors,
            app.url.admin.check.getDoctors,
            app.url.admin.check.findDoctorByAuthStatus,
            app.url.feedback.query
        ];

        function setNumbers() {
            var dt, n=0;
            function setDoctorCheckNum(status){
                var param = {
                    status: status,
                    pageIndex: 0,
                    pageSize: 1,
                    access_token: app.url.access_token
                };
                if (status === 5) delete dt.status;
                if (status === 7) status = 3;
                $http({
                    url: urls[status-1],
                    method: 'post',
                    data: param
                }).then(function (resp) {
                    if (param.status === 1) {
                        //$('#check_pass').html(resp.data.data.total);            // 审核通过
                        //utils.localData('check_pass', resp.data.data.total);
                        //setDoctorCheckNum(2);
                    } else if (param.status === 2) {
                        //$('#doctor_check').html(resp.data.data.total);            // 未审核
                        //utils.localData('doctor_check', resp.data.data.total);
                        //setDoctorCheckNum(3);
                    } else if (param.status === 3) {
                        //$('#check_nopass').html(resp.data.data.total);          // 审核未通过
                        //utils.localData('check_nopass', resp.data.data.total);
                        //setDoctorCheckNum(7);
                    } else if(param.status === 7){
                        //$('#check_nocheck').html(resp.data.data.total);         // 未认证
                        //utils.localData('check_nocheck', resp.data.data.total);
                        //setDoctorCheckNum(5);
                    } else {
                        //$('#feedback_undo').html(resp.data.data.total);         // 反馈未处理
                        //utils.localData('feedback_undo', resp.data.data.total);
                    }
                });
            }

            setDoctorCheckNum(2);

            //}

            var url = [
                app.url.order.findOrder
            ];
            for (var j = 0; j < url.length; j++) {
                var dt = {
                    pageIndex: 0,
                    pageSize: 5,
                    payType: 2,
                    //orderStatus: 3,
                    access_token: app.url.access_token
                };
                //if (j === 1) delete dt.status;
                $http({
                    url: url[j],
                    method: 'post',
                    data: dt
                }).then(function (resp) {
                    if (resp.data.resultCode !== 1) {
                        $('#order_done').html(0);  // 已支付订单
                        utils.localData('order_done', null);
                        return;
                    }else{
                        $('#order_done').html(resp.data.data.total);  // 已支付订单
                        utils.localData('order_done', resp.data.data.total);
                    }
                    //if (resp.data.data.pageData[0].orderStatus == 3) {}
                });
            }


            var group_url = [
                app.url.admin.check.groupApplyList,
                app.url.admin.check.getGroupCerts
            ];
            //  更新“医生集团认证”数据
            function getGroupCheckNum(i){
                var param = {
                    access_token: app.url.access_token,
                    status: 'A',
                    pageIndex: 0,
                    pageSize: 1
                };

                $http({
                    url: group_url[i],
                    method: 'post',
                    data: param
                }).then(function (resp) {
                    var _dt = resp.data.data;
                    if (i === 0) {
                        $('#group_check').html(_dt.total);  // 集团未审核
                        utils.localData('group_check', _dt.total);
                        getGroupCheckNum(1);
                    }else{
                        $('#group_check_with_v').html(_dt.total);  // 集团加V未审核
                        utils.localData('group_check_with_v', _dt.total);
                    }
                });
            }

            getGroupCheckNum(0);
        }
        //setTimeout(setNumbers, 300);
        //clearInterval($rootScope.timer); // 避免重复计时
        //$rootScope.timer = setInterval(setNumbers, 60000); // 一分钟刷新一次界面数据
    }
]);