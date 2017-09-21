'use strict';
app.controller('SigninFormController', ['$scope', '$http', '$state', '$cookieStore', 'utils', '$rootScope', '$document',
    function($scope, $http, $state, $cookieStore, utils, $rootScope, $document) {
        $scope.user = {};
        $scope.authError = null;
        var _remember = $('#rememberInfo');
        var _isRemembered = utils.localData('user_remember');
        var _telephone = utils.localData('user_telephone');
        // var _password = utils.localData('user_password');
        if (_telephone) {
            _remember.prop('checked', true);
            if (_telephone) {
                $scope.user.telephone = _telephone;
                // $scope.user.password = _password;
            }
        }


        utils.directive({name:'customeDirective'});
        $scope.login = function() {
            $scope.authError = null;
            var user_name = $scope.user.telephone + '|9';
            $http({
                url: app.url.login,
                method: 'post',
                data: {
                    u: user_name,
                    p: $scope.user.password,
                    c: 'PC'
                }
            }).then(function(response) {
                var _roles = '',
                    user_JSON = response.data;

                if (typeof response.data.for_api_login != "undefined" && response.data.for_api_login.roles.length > 0) {
                    var rolesFlag = 0;
                    $.each(response.data.for_api_login.roles, function(index, obj) {
                        if (obj.value == "shop_manager" || obj.value == "admin") {
                            rolesFlag = 1;
                        }

                        /*if (user_JSON._roles != 'admin') //管理员
                            user_JSON._roles = obj.value;*/

                        if (user_JSON._roles != 'shop_manager') //店长
                            user_JSON._roles = obj.value;
                    });
                    if (rolesFlag == 0) {
                        $scope.authError = '没有登录权限';
                        return;
                    }
                } else {
                    if (typeof response.data.message == "undefined") {
                        $scope.authError = '没有登录权限';
                    } else {
                        $scope.authError = response.data.message;
                    }

                    return;
                }

                if (_remember.prop('checked')) {
                    utils.localData('user_telephone', $scope.user.telephone);
                } else {
                    utils.localData('user_telephone', null);
                }

                var param = {
                    userType: 9
                };
                param.telephone = $scope.user.telephone;
                param.password = $scope.user.password;

                // 记录用户信息
                localStorage.setItem('user_JSON', JSON.stringify(user_JSON));

                $http({
                    url: window.serverApiRoot + "user/login",
                    method: 'post',
                    data: param
                }).then(function(res) {
                    if (res.data.resultCode != 1) {
                        $scope.authError = res.data.resultMsg;
                        return;
                    }
                    if (response.data.a != 'undefined' && (response.data.message == '' || response.data.message == null)) {
                        if (response.data.for_api_login.company._type == 'c_ChainDrugStore') { //连锁药店
                            utils.localData('c_ChainDrugStore', 'true');
                            utils.localData('c_StoreHQ', 'false');
                            utils.localData('c_DrugFactory', 'false');
                            utils.localData('c_MonomerDrugStore', 'false');
                        } else if (response.data.for_api_login.company._type == 'c_StoreHQ') { //总店
                            utils.localData('c_ChainDrugStore', 'false');
                            utils.localData('c_StoreHQ', 'true');
                            utils.localData('c_DrugFactory', 'false');
                            utils.localData('c_MonomerDrugStore', 'false');
                        } else if (response.data.for_api_login.company._type == 'c_DrugFactory' || response.data.for_api_login.company._type == 'c_DrugDistributor') { //生产企业
                            utils.localData('c_ChainDrugStore', 'false');
                            utils.localData('c_StoreHQ', 'false');
                            utils.localData('c_DrugFactory', 'true');
                            utils.localData('c_MonomerDrugStore', 'false');
                        } else if (response.data.for_api_login.company._type == 'c_MonomerDrugStore') { //零售店
                            utils.localData('c_ChainDrugStore', 'false');
                            utils.localData('c_StoreHQ', 'false');
                            utils.localData('c_DrugFactory', 'false');
                            utils.localData('c_MonomerDrugStore', 'true');
                        };
                        var _picUrl = response.data.for_api_login.logo;
                        var _name = response.data.for_api_login.company.name;
                        var _storeid = response.data.for_api_login.company.id; //店铺id
                        var _id = response.data.user_id;
                        var store_leader = response.data.user_name;
                        var logo = response.data.for_api_login.logo;
                        var _type = response.data.for_api_login.company._type;
                        _roles = _roles;

                        $scope.datas.groupPicFile = _picUrl;
                        $scope.datas.user_id = _id;
                        $scope.datas._storeid = _storeid;
                        $scope.datas.user_name = _name;
                        $scope.datas.user_type = _type;
                        $scope.datas._roles = _roles;

                        utils.localData('user_name', _name);
                        utils.localData('store_id', _storeid);
                        utils.localData('user_type', _type);
                        utils.localData('logo', logo);
                        utils.localData('user_id', _id);
                        utils.localData('store_leader', store_leader);
                        utils.localData('roles', _roles);

                        var preaccess_token = localStorage.getItem('access_token');
                        app.url.access_token = response.data.a;
                        console.log("response.data.a:" + response.data.a);
                        utils.localData('yy_access_token', res.data.data.access_token);
                        utils.localData('access_token', app.url.access_token);

                        if (preaccess_token != null) { //强制改变更新token
                            $.each(app.url, function(item, value) {
                                if (typeof value === "string") {
                                    app.url[item] = value.replace(preaccess_token, app.url.access_token);
                                }
                            });
                        }

                        //保存店铺的设置信息(连锁总店、门店、零售店)
                        app.url.save_setting = app.urlRoot + 'api/invoke/' + response.data.a + '/' + _type + '.edit_for_company';
                        //编辑设置信息(连锁总店、门店、零售店)
                        app.url.eidt_setting = app.urlRoot + 'api/invoke/' + response.data.a + '/' + _type + '.edit_for_company';
                        //查询设置信息(连锁总店、门店、零售店)
                        app.url.view_setting = app.urlRoot + 'api/data/' + response.data.a + '/' + _type + '.edit_for_company';


                        //获取项目路径
                        //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
                        var curWwwPath = window.document.location.href;
                        //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
                        var pathName = window.document.location.pathname;
                        var pos = curWwwPath.indexOf(pathName);
                        //获取主机地址，如： http://localhost:8083
                        var localhostPaht = curWwwPath.substring(0, pos);
                        //获取带"/"的项目名，如：/uimcardprj
                        var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
                        utils.localData('basepath', localhostPaht + projectName);

                        utils.localData('path', localhostPaht);


                        console.log(response.data);

                        // 设置头像数据
                        if (response.data.for_api_login.logo) {
                            var _headPicFile = response.data.for_api_login.logo;
                            console.log("_headPicFile:" + _headPicFile);

                            utils.localData('headPicFile', _headPicFile);
                            $scope.datas.user_headPicFile = _headPicFile + '?' + (new Date()).getTime();
                        } else {
                            utils.localData('headPicFile', null);
                            $scope.datas.user_headPicFile = null;
                        }
                        var days = 1;
                        var exp = new Date();
                        exp.setTime(exp.getTime() + 30 * 1000);


                        if (response.data.for_api_login.company._type == 'c_ChainDrugStore') { //连锁药店
                            return $state.go('app.chaindrugstore', {}, {
                                reload: true
                            });
                        } else if (response.data.for_api_login.company._type == 'c_StoreHQ') { //总店
                            return $state.go('app.storehq', {}, {
                                reload: true
                            });
                        } else if (response.data.for_api_login.company._type == 'c_DrugFactory' || response.data.for_api_login.company._type == 'c_DrugDistributor') { //药厂
                            return $state.go('app.drugfactory', {}, {
                                reload: true
                            });
                        } else if (response.data.for_api_login.company._type == 'c_MonomerDrugStore') { //零售店
                            return $state.go('app.monomerdrugstore', {}, {
                                reload: true
                            });
                        }
                    } else {
                        $scope.authError = response.data.message;
                    }
                }, function(x) {
                    $scope.authError = '网络阻塞--暂停访问';
                });
            }, function(x) {
                $scope.authError = '网络阻塞--暂停访问';
            });
        };

        $scope.withCODE = function() {
            $state.go('access.signininbox');
        }

    }
]);
