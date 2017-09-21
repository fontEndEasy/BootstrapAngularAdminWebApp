'use strict';

app.controller('GroupCheckEdit', ['$scope', '$http', '$state', '$rootScope', 'utils', '$stateParams', 'modal',
    function ($scope, $http, $state, $rootScope, utils, $stateParams, modal) {
        $scope.isPass = true;
        $scope.authError = null;
        $scope.formData = {};
        $scope.viewData = {};
        $scope.tabs = {};

        if($stateParams.id){
            var groupId = $stateParams.id || utils.localData('curGroupId');
        }

        $scope.isCheckingV = $scope.isCheckingV || utils.localData('isCheckingV') === 'true';

        // 获取认证公司信息
        var getGroupInfo = function(){
            if(groupId){
                $http({
                    url: app.url.admin.check.getGroupCert,
                    method: 'post',
                    data: {
                        access_token: app.url.access_token,
                        groupId: groupId || utils.localData('curGroupId')
                    }
                }).then(function(resp) {
                    if (resp.data.resultCode === 1) {
                        var dt = resp.data.data;
                        // 集团信息
                        $scope.viewData.name = dt.name || '--';
                        $scope.viewData.introduction = dt.introduction || '--';
                        $scope.viewData.logo = dt.groupIconPath || 'src/img/logoDefault.jpg';
                        $scope.viewData.skill = dt.diseaseName || '--';

                        if(!dt.groupCert){
                            $scope.hasIdentified = false;
                        }else{
                            $scope.hasIdentified = true;
                            // 公司信息
                            $scope.companyName = dt.groupCert.companyName;
                            $scope.orgCode = dt.groupCert.orgCode;
                            $scope.license = dt.groupCert.license;
                            $scope.corporation = dt.groupCert.corporation;
                            $scope.businessScope = dt.groupCert.businessScope;
                            $scope.accountName = dt.groupCert.accountName;
                            $scope.openBank = dt.groupCert.openBank;
                            $scope.bankAcct = dt.groupCert.bankAcct;
                            $scope.adminName = dt.groupCert.adminName;
                            $scope.idNo = dt.groupCert.idNo;
                            $scope.adminTel = dt.groupCert.adminTel;
                            $scope.idImage = dt.groupCert.idImage;
                            $scope.orgCodeImage = dt.groupCert.orgCodeImage;
                            $scope.licenseImage = dt.groupCert.licenseImage;
                        }
                    } else {
                        $scope.authError = resp.data.resultMsg;
                    }
                }, function(resp) {
                    $scope.authError = resp.data.resultMsg;
                });
            }
        };

        $scope.tabs.groupInfo = function(){
            if($rootScope.groupInfo){
                $scope.viewData.name = $rootScope.groupInfo.name || '--';
                $scope.viewData.introduction = $rootScope.groupInfo.introduction || '--';
                $scope.viewData.logo = $rootScope.groupInfo.logo || 'src/img/logoDefault.jpg';
                $scope.viewData.skill = $rootScope.groupInfo.skill || '--';
            }else{
                if(groupId){
                    getGroupInfo();
                }
            }
        };

        $scope.tabs.companyInfo = function(){
            getGroupInfo();
        };

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
                groupId: groupId
            };
            if (chk_pass.prop('checked')) {
                var url = app.url.admin.check.passCert;
                isPass = true;
            } else {
                var url = app.url.admin.check.noPass;
                formParam.remarks = $scope.formData.remark;
                isPass = false;
            }

            $http.post(url, formParam).then(function (resp) {
                if (resp.data.resultCode === 1) {
                    // 更新界面中的数据
                    $('#group_check_with_v').html(utils.localData('group_check_with_v') * 1 - 1);
                    window.history.back();
                } else {
                    modal.toast.error(resp.data.resultMsg);
                }
            }, function (x) {
                modal.toast.error('服务器错误！');
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
