'use strict';

app.controller('GroupCheckEdit', ['$scope', '$http', '$state', '$rootScope', 'utils', '$stateParams',
    function ($scope, $http, $state, $rootScope, utils, $stateParams) {
        $scope.isPass = true;
        $scope.authError = null;
        $scope.formData = {};
        $scope.viewData = {};
        $scope.tabs = {};

        if($stateParams.id){
            var curId = $stateParams.id || utils.localData('curId');
        }

        $scope.isChecking = $scope.isChecking || utils.localData('isChecking') === 'true';

        // 获取审核集团信息
        var getGroupInfo = function(){
            if(curId){
                $http({
                    url: app.url.admin.check.applyDetail,
                    method: 'post',
                    data: {
                        access_token: app.url.access_token,
                        groupApplyId: curId
                    }
                }).then(function(resp) {
                    if (resp.data.resultCode === 1) {
                        var dt = resp.data.data;

                        $scope.hasIdentified = true;
                        // 公司信息
                        $scope.viewData.groupName = dt.groupName;
                        $scope.viewData.doctorName = dt.doctorName;
                        $scope.viewData.telephone = dt.telephone;
                        $scope.viewData.hospitalName = dt.hospitalName;
                        $scope.viewData.level = dt.level;
                        $scope.viewData.departments = dt.departments;
                        $scope.viewData.title = dt.title;
                        $scope.viewData.licenseNum = dt.licenseNum;
                        $scope.viewData.licenseExpire = dt.licenseExpire;
                        $scope.viewData.auditMsg = dt.auditMsg;
                        $scope.viewData.adminName = dt.adminName;

                        if (dt.imageUrls && dt.imageUrls.length > 0) {
                            $scope.imgs = [];
                            for(var i=0; i<dt.imageUrls.length; i++){
                                $scope.imgs.push(dt.imageUrls[i]);
                            }
                        } else {
                            $scope.imgs = false;
                        }
                    } else {
                        $scope.authError = resp.data.resultMsg;
                    }
                }, function(resp) {
                    $scope.authError = resp.data.resultMsg;
                });
            }
        };

        getGroupInfo();

        setTimeout(function () {
            var preview = $('#gl_preview img');
            var points = $('#gl_point a');
            preview.attr('src', points.eq(0).find('img').addClass('cur-img').attr('src'));
            points.click(function () {
                var _img = $(this).find('img');
                preview.attr('src', _img.attr('src'));
                _img.addClass('cur-img');
                $(this).siblings().find('img').removeClass('cur-img');
            });
        }, 500);

        // 提交并更新数据
        $scope.submit = function () {
            var chk_pass = $('#pass'),
                formParam = {},
                remark = $('.check-items input:checked').siblings('span'),
                isPass = true;

            if (remark.length > 0) {
                $scope.formData.remark = remark.html();
            } else {
                $scope.formData.remark = $scope.viewData.remarkNopass;
            }
            $scope.formData.access_token = app.url.access_token;

            // 选择url，并组装提交参数
            formParam = {
                access_token: app.url.access_token,
                id: curId
            };

            var url = app.url.admin.check.processGroupApply;

            if (chk_pass.prop('checked')) {
                formParam.status = 'P';
                isPass = true;
            } else {
                formParam.auditMsg = $scope.formData.remark;
                formParam.status = 'NP';
                isPass = false;
            }

            $http.post(url, formParam).then(function (resp) {
                if (resp.data.resultCode === 1) {
                    window.history.back();
                } else {
                    $scope.authError = resp.data.resultMsg;
                }
            }, function (x) {
                $scope.authError = '服务器错误！';
            });
        };

        // 不操作返回
        $scope.return = function () {
            $rootScope.ids = [];
            //$state.go('app.company_check_list_undone');
            window.history.back();
        };

        setTimeout(function () {
            var chk_pass = $('#pass');
            var chk_nopass = $('#nopass');
            var is = $('.required-items i');
            var ipts = $('.required-items input');
            var btn = $('form button[type=submit]');
            var other = $('#other_remark');
            var txtr = $('#remarkNopass');
            var timer_a, timer_b;

            chk_nopass.change(function () {
                if (chk_nopass.prop('checked')) {
                    is.addClass('none');
                    ipts.removeAttr('required');
                    if (!other.prop('checked')) {
                        btn.removeAttr('disabled');
                    }
                    if (!timer_a) {
                        timer_a = setInterval(function () {
                            if (other.prop('checked')) {
                                if (/\S/g.test(txtr.val())) {
                                    btn.removeAttr('disabled');
                                } else {
                                    btn.attr('disabled', true);
                                    clearInterval(timer_b);
                                    if (!timer_b) {
                                        timer_b = setInterval(function () {
                                            if (/\S/g.test(txtr.val())) {
                                                btn.removeAttr('disabled');
                                            } else {
                                                btn.attr('disabled', true);
                                            }
                                        }, 200);
                                    }
                                }
                            } else {
                                clearInterval(timer_b);
                                timer_b = null;
                                btn.removeAttr('disabled');
                            }
                        }, 200);
                    }
                } else {
                    clearInterval(timer_a);
                    timer_a = null;
                }
            });
            chk_pass.change(function () {
                clearInterval(timer_a);
                clearInterval(timer_b);
                timer_a = timer_b = null;
                if (chk_pass.prop('checked')) {
                    btn.removeAttr('disabled');
                    is.removeClass('none');
                }
            });
        }, 500);
    }
]);
