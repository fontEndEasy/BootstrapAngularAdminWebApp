'use strict';

// 集团登录控制器
app.controller('SigninFormController', ['$scope', '$http', '$state', '$cookieStore', 'utils', '$rootScope', 'modal',
    function($scope, $http, $state, $cookieStore, utils, $rootScope, modal) {
        var width_pswd,
            width_code,
            smsid = '',
            _remember,
            _isRemembered = utils.localData('user_remember'),
            _telephone = utils.localData('user_telephone'),
            _password = utils.localData('user_password');


        // 延迟200毫秒后初始化一些数据
        (function initData() {
            setTimeout(function() {
                width_pswd = $('#login_with_pswd');
                width_code = $('#login_with_code');
                _remember = $('#rememberInfo');

                if (_isRemembered) {
                    _remember.attr('checked', true);
                    if (_isRemembered && _telephone && _password) {
                        $scope.user.telephone = _telephone;
                        $scope.user.password = _password;
                        $scope.$apply($scope.user);
                        $scope.$apply($scope.password);
                    }
                }
            }, 200);
        })()

        $scope.login_with_pswd = true;

        $scope.withPSWD = function() {
            $scope.authError = '';
            $scope.login_with_pswd = true;
            width_pswd.addClass('animating fade-in-right');
        };
        $scope.withCODE = function() {
            $scope.authError = '';
            $scope.login_with_pswd = false;
            width_code.addClass('animating fade-in-right');
        };
        $scope.getCode = function() {
            if (!$scope.user.telephone) {
                modal.toast.warn('请填写手机号码！');
                return;
            } else {
                var timer = 0,
                    num = 120;
                var btn = $('#login_with_code .get-code');
                //var timer = 0, num = 15;
                var disabled = document.createAttribute('disabled');
                $scope.authError = '';
                btn[0].setAttributeNode(disabled);
                btn.html('再次获取 (<span id="code_timer" class="text-warning">' + num + '</span>)');
                var codeTimer = $('#code_timer');
                timer = setInterval(function() {
                    if (num === 0) {
                        clearInterval(timer);
                        btn[0].removeAttribute('disabled');
                        btn.html('再次获取');
                        utils.localData('smsid', null);
                    } else if (num <= 100) {
                        codeTimer.html('0' + --num);
                    } else if (num <= 10) {
                        codeTimer.html('00' + --num);
                    } else {
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
                }).then(function(response) {
                    if (response.data.resultCode === 1) {
                        smsid = response.data.data.smsid;
                        utils.localData('smsid', smsid);
                    } else {
                        $scope.authError = response.data.resultMsg;
                        num = 0;
                    }
                }, function(x) {
                    $scope.authError = '服务器错误';
                });
            }
        };

        function setLocalGroupList(dt) {
            var len = dt.length;
            var listStr = '[';
            for (var i = 0; i < len; i++) {
                listStr += '{name:"' + dt[i].name + '",id:"' + dt[i].id + '"';
                if (dt[i].id === $scope.curGroupId) {
                    listStr += ',isCurGroup:true}';
                } else {
                    listStr += ',isCurGroup:false}';
                }

                if (i < dt.length - 1) {
                    listStr += ','
                }
            }
            listStr += ']';
            utils.localData('groupList', listStr);
        };

        // 集团列表下拉框 chosen
        function initChosen(dt) {
            var select = $('#group_select').html('');
            var len = dt.length;
            for (var i = 0; i < len; i++) {
                var opt = $('<option value="' + dt[i]['id'] + '">' + dt[i]['name'] + '</option>');
                select.append(opt);
                if (i === 0) {
                    if (dt[i]['groupId']) {
                        $scope.curGroupId = dt[i]['groupId'];
                    } else {
                        $scope.curGroupId = dt[i]['id'];
                    }
                }
            }

            setLocalGroupList(dt);

            select.on('change', function(e) {
                if (dt[$(this)[0].selectedIndex].groupId) {
                    $scope.curGroupId = dt[$(this)[0].selectedIndex].groupId;
                } else {
                    $scope.curGroupId = dt[$(this)[0].selectedIndex].id;
                }
                setLocalGroupList(dt);
            });
        }

        $scope.user = {};
        $scope.authError = null;

        $scope.login = function() {
            $scope.authError = null;
            var param = {
                userType: 3
            };
            if ($scope.login_with_pswd) {
                var url = app.url.login;
                param.telephone = $scope.user.telephone;
                param.password = $scope.user.password;
            } else {
                var url = app.url.loginByCode;
                param.telephone = $scope.user.telephone;
                param.smsid = smsid || utils.localData('smsid');
                param.verifyCode = $scope.user.ranCode;
            }

            $http({
                url: url,
                method: 'post',
                data: param
            }).then(function(response) {
                if (response.data.resultCode === 1) {
                    if (response.data.data.user.status === 7) {
                        $scope.authError = '此账号还未认证！';
                        return;
                    } else if (response.data.data.user.status === 2) {
                        $scope.authError = '此账号还未审核！';
                        return;
                    }
                    //清除信息
                    $rootScope.curDepartmentId = null;
                    utils.localData('groupPicFile', null);
                    utils.localData('company', null);
                    utils.localData('curGroupId', null);
                    utils.localData('curGroupName', null);
                    utils.localData('curGroupEnterpriseName', null);

                    $rootScope.rootGroup.id = null;
                    $scope.datas.groupPicFile = null;
                    $rootScope.rootGroup.name = null;
                    $rootScope.rootGroup.enterpriseName = null;
                    $rootScope.rootEnterprise = null;
                    $rootScope.enterprise_userName = null;

                    $rootScope.isCompany = false;
                    utils.localData('isCompany', 'false');
                    $rootScope.logFromCompany = false;
                    utils.localData('logFromCompany', 'false');

                    //localStorage.clear();
                    var _name = response.data.data.user.name;
                    var _id = response.data.data.userId;
                    var _type = $scope.userType['type_' + response.data.data.user.userType];

                    $scope.datas.user_id = _id;
                    $scope.datas.user_name = _name;
                    $scope.datas.user_type = _type;

                    utils.localData('user_name', (_name || _name == '0') ? _name : null);
                    utils.localData('user_type', _type);
                    utils.localData('user_id', _id);

                    if (_remember.prop("checked")) {
                        utils.localData('user_remember', true);
                        utils.localData('user_telephone', $scope.user.telephone);
                        utils.localData('user_password', $scope.user.password);
                    } else {
                        utils.localData('user_remember', null);
                        utils.localData('user_telephone', null);
                        utils.localData('user_password', null);
                    }

                    utils.setCookie('a', response.data.data.access_token);
                    app.url.access_token = response.data.data.access_token;
                    utils.localData('access_token', app.url.access_token);

                    // 设置头像数据
                    if (response.data.data.user.headPicFileName) {
                        utils.localData('headPicFile', response.data.data.user.headPicFileName);
                        $scope.datas.user_headPicFile = response.data.data.user.headPicFileName + '?' + (new Date()).getTime();
                    } else {
                        //utils.localData('headPicFile', null);
                        $scope.datas.user_headPicFile = null;
                    }

                    $rootScope.groupList = response.data.data.user.groupList || [];
                    var len = $rootScope.groupList.length;
                    $rootScope.loginError = false; // 清楚提示信息
                    if (len > 1) {
                        $scope.has_more_group = true;
                        utils.localData('has_more_group', true);
                        setTimeout(function() {
                            initChosen($rootScope.groupList);
                        }, 300);
                    } else {
                        utils.localData('has_more_group', false);
                        $scope.curGroupId = response.data.data.user.loginGroupId;
                        setLocalGroupList($rootScope.groupList);

                        if (len === 0) {
                            utils.localData('applyStatus', 'NR');
                        }
                        $scope.verifyByGuser($scope.curGroupId, _id);
                    }
                } else {
                    $scope.authError = response.data.resultMsg;
                }
            }, function(x) {
                $scope.authError = '服务器错误';
            });
        };

        $scope.login_for_sure = function() {
            if ($scope.curGroupId && $scope.datas.user_id) {
                $scope.verifyByGuser($scope.curGroupId, $scope.datas.user_id);
            }
        };
    }
]);
