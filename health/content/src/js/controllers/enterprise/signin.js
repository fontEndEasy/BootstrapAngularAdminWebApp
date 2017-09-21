'use strict';

// 公司登录控制器
app.controller('enterpriseSigninFormController', ['$scope', '$http', '$state', '$cookieStore', 'utils', '$rootScope',
    function ($scope, $http, $state, $cookieStore, utils, $rootScope) {

        var width_pswd,
            width_code,
            smsid = '',
            _remember,
            _isRemembered = utils.localData('enterprise_remember'),
            _telephone = utils.localData('enterprise_telephone'),
            _password = utils.localData('enterprise_password');

        // 延迟200毫秒后初始化一些数据
        (function initData(){
            setTimeout(function(){
                width_pswd = $('#login_with_pswd');
                width_code = $('#login_with_code');
                _remember = $('#rememberInfo');

                if (_isRemembered) {
                    _remember.attr('checked', true);
                    if (_isRemembered && _telephone && _password) {
                        $scope.enterprise.telephone = _telephone;
                        $scope.enterprise.password = _password;
                        $scope.$apply($scope.enterprise);
                    }
                }
            }, 200);
        })()

        $scope.login_with_pswd = true;

        $scope.withPSWD = function(){
            $scope.login_with_pswd = true;
            width_pswd.addClass('animating fade-in-right');
        };
        $scope.withCODE = function(){
            $scope.login_with_pswd = false;
            width_code.addClass('animating fade-in-right');
        };
        $scope.getCode = function(){
            if(!$scope.user.telephone){
                modal.toast.warn('请填写手机号码！');
                return ;
            }else{
                var timer = 0, num = 120;
                var btn = $('#login_with_code .get-code');
                //var timer = 0, num = 15;
                var disabled = document.createAttribute('disabled');
                btn[0].setAttributeNode(disabled);
                btn.html('再次获取 (<span id="code_timer" class="text-warning">' + num + '</span>)');
                var codeTimer = $('#code_timer');
                timer = setInterval(function(){
                    if(num === 0){
                        clearInterval(timer);
                        btn[0].removeAttribute('disabled');
                        btn.html('再次获取');
                        utils.localData('smsid', null);
                    }else if(num <= 100){
                        codeTimer.html('0' + --num);
                    }else if(num <= 10){
                        codeTimer.html('00' + --num);
                    }else{
                        codeTimer.html(--num);
                    }
                }, 1000);

                $http({
                    url: app.url.sendRanCode,
                    method: 'post',
                    data: {
                        phone: $scope.user.telephone,
                        userType: 3
                    }
                }).then(function (response) {
                    if (response.data.resultCode === 1) {
                        smsid = response.data.data.smsid;
                        utils.localData('smsid', smsid);
                    } else {
                        $scope.authError = response.data.resultMsg;
                    }
                }, function (x) {
                    $scope.authError = '服务器错误';
                });
            }
        };

        $scope.enterprise = {};
        $scope.authError = null;

        $scope.login = function () {
            $scope.authError = null;
            $http({
                url: app.url.yiliao.companyLogin,
                method: 'post',
                data: {
                    telephone: $scope.enterprise.telephone,
                    password: $scope.enterprise.password
                    //,userType: 5
                }
            }).then(function (response) {
                if (response.data.resultCode === 1) {
                    //清除信息
                    $rootScope.curDepartmentId = null;
                    utils.localData('groupPicFile', null);
                    utils.localData('headPicFile', null);
                    utils.localData('curGroupName', null);
                    utils.localData('curGroupId', null);
                    utils.localData('curGroupEnterpriseName', null);
                    utils.localData('groupPicFile', null);
                    $scope.datas.user_headPicFile = null;
                    $scope.datas.groupPicFile = null;
                    $rootScope.rootGroup.name = null;
                    $rootScope.rootGroup.enterpriseName = null;
                    $rootScope.rootEnterprise = null;
                    $rootScope.enterprise_userName = null;

                    $rootScope.isCompany = true;
                    utils.localData('isCompany', 'true');
                    $rootScope.logFromCompany = true;
                    utils.localData('logFromCompany', 'true');
                    var _name = response.data.data.user.user.name || ' ';
                    var _type = $scope.userType['type_' + response.data.data.user.user.userType];
                    console.log(response.data.data.user.user.name);
                    var _id = response.data.data.user.userId;
                    $scope.datas.user_name = null;
                    utils.localData('user_name', null);
                    $scope.datas.user_type = _type;
                    utils.localData('enterprise_userName', _name);
                    utils.localData('enterprise_type', _type);
                    utils.localData('enterprise_id', _id);

                    if (_remember.prop("checked")) {
                        utils.localData('enterprise_remember', true);
                        utils.localData('enterprise_telephone', $scope.enterprise.telephone);
                        utils.localData('enterprise_password', $scope.enterprise.password);
                    } else {
                        utils.localData('enterprise_remember', null);
                        utils.localData('enterprise_telephone', null);
                        utils.localData('enterprise_password', null);
                    }

                    app.url.access_token = response.data.data.user.access_token;
                    utils.localData('access_token', app.url.access_token);

                    // 判断公司状态
                    if (response.data.data.status == 1) {//未创建公司
                        utils.localData('company', null);
                        return $state.go('access.Fill_Info');
                    }
                    utils.localData('company', JSON.stringify(response.data.data.company));
                    if (response.data.data.company.status === 'P')//审核通过
                        return $state.go('app.group_manage');
                    if (response.data.data.company.status === 'A')//审核中
                        return $state.go('access.enterprise_verify', {}, {reload: true});
                    if (response.data.data.company.status === 'B')//审核不通过
                        return $state.go('access.enterprise_verify', {}, {reload: true});
                    if (response.data.data.company.status === 'O')//临时冻结
                        return $scope.authError = '账户已冻结！';
                    if (response.data.data.company.status === 'S')//已停用
                        return $scope.authError = '账户已停用！';

                    utils.localData('enterprise_name', null);
                    utils.localData('enterprise_type', null);
                    utils.localData('enterprise_id', null);
                    return $scope.authError = data.resultMsg;

                } else {
                    $scope.authError = '用户名或密码错误';
                    utils.localData('enterprise_name', null);
                    utils.localData('enterprise_type', null);
                    utils.localData('enterprise_id', null);
                }
            }, function (x) {
                $scope.authError = '服务器错误';
                utils.localData('enterprise_name', null);
                utils.localData('enterprise_type', null);
                utils.localData('enterprise_id', null);
            });

        };
    }
]);