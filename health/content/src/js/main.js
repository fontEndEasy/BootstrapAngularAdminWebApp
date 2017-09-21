'use strict';
/* Controllers */
angular.module('app').controller('AppCtrl', ['$rootScope', '$scope', '$translate', '$localStorage', '$window', '$http', '$state', '$cookieStore', 'utils', 'Group',
    function($rootScope, $scope, $translate, $localStorage, $window, $http, $state, $cookieStore, utils, Group) {

        //var dt = Group.getData();
        // add 'ie' classes to html
        var isIE = !!navigator.userAgent.match(/MSIE/i);
        isIE && angular.element($window.document.body).addClass('ie');
        isSmartDevice($window) && angular.element($window.document.body).addClass('smart');
        app.state = $state;
        // config
        $scope.app = {
            name: '玄关健康平台',
            version: '1.0.0',
            // for chart colors
            color: {
                primary: '#7266ba',
                info: '#23b7e5',
                success: '#27c24c',
                warning: '#fad733',
                danger: '#f05050',
                light: '#e8eff0',
                dark: '#3a3f51',
                black: '#1c2b36'
            },
            settings: {
                themeID: 8,
                navbarHeaderColor: 'bg-black',
                navbarCollapseColor: 'bg-white-only',
                asideColor: 'bg-black',
                headerFixed: true,
                asideFixed: false,
                asideFolded: false,
                asideDock: false,
                container: false
            }
        }
            //集团
        $rootScope.rootGroup = {
            id: localStorage.getItem('curGroupId'),
            name: localStorage.getItem('curGroupName'),
            enterpriseName: localStorage.getItem('curGroupEnterpriseName')
        }

        //公司
        $rootScope.rootEnterprise = null;
        $rootScope.enterprise_userName = null;

        // save settings to local storage
        if (angular.isDefined($localStorage.settings)) {
            $scope.app.settings = $localStorage.settings;
        } else {
            $localStorage.settings = $scope.app.settings;
        }
        $scope.$watch('app.settings', function() {
            if ($scope.app.settings.asideDock && $scope.app.settings.asideFixed) {
                // aside dock and fixed must set the header fixed.
                $scope.app.settings.headerFixed = true;
            }
            // save to local storage
            $localStorage.settings = $scope.app.settings;
        }, true);
        // angular translate
        $scope.lang = {
            isopen: false
        };
        $scope.langs = {
            //en: 'English',
            zh_CN: '中文（简体）'
        };
        $scope.userType = {
            type_1: '患者',
            type_2: '医助',
            type_3: '医生',
            type_4: '客服'
        };
        $scope.datas = {
            user_id: utils.localData('user_id'),
            user_name: utils.localData('user_name') || ' ',
            user_type: utils.localData('user_type') || ' ',
            user_headPicFile: utils.localData('headPicFile') || null,
            groupPicFile: (utils.localData('groupPicFile') + '') !== (null + '') ? utils.localData('groupPicFile') + '?' + (new Date()).getTime() : null
        };
        $scope.groupList = [];
        $scope.selectLang = $scope.langs[$translate.proposedLanguage()] || "中文（简体）";
        $scope.setLang = function(langKey, $event) {
            // set the current lang
            $scope.selectLang = $scope.langs[langKey];
            // You can change the language during runtime
            $translate.use(langKey);
            $scope.lang.isopen = !$scope.lang.isopen;
        };

        // 设置默认语言为中文
        $scope.selectLang = $scope.langs['zh_CN'];
        $translate.use('zh_CN');
        $scope.app.ui = {};
        var uiInit = $scope.app.ui.init = function() {
            $http.get('src/api/nav_items').then(function(resp) {
                if (resp.data.datalist) {
                    $scope.app.ui.items = resp.data.datalist;
                };
            });
        };
        //uiInit();

        // 用户退出
        $scope.logout = function() {
            $http.get(app.url.logout + '?' + $.param({
                access_token: app.url.access_token
            })).then(function(response) {
                if (response.statusText === 'OK') {
                    $cookieStore.remove('username');
                    $cookieStore.remove('enterprisename');

                    // 清除某些与当前账号相关的数据
                    utils.localData('headPicFile', null);
                    utils.localData('groupPicFile', null);
                    utils.localData('curGroupId', null);
                    utils.localData('curGroupName', null);
                    utils.localData('curGroupEnterpriseName', null);
                    utils.localData('company', null);
                    $rootScope.rootGroup.enterpriseName = null;
                    $rootScope.rootGroup.name = null;
                    $rootScope.curDepartmentId = null;
                    $scope.datas.groupPicFile = null;
                    $rootScope.rootGroup.id = null;
                    $rootScope.rootGroup.name = null;
                    $rootScope.rootGroup.enterpriseName = null;
                    $rootScope.rootEnterprise = null;
                    $rootScope.enterprise_userName = null;
                    //localStorage.clear();

                    if (!$rootScope.isCompany) {
                        $state.go('access.signin', {
                            "reload": true
                        });
                    } else {
                        $state.go('access.enterprise_signin', {
                            "reload": true
                        });
                    }
                } else {
                    console.log("Logout: " + response.statusText);
                }
            }, function(x) {
                console.log("Logout: " + x.statusText);
            });
        };

        $rootScope.verifyByGuser = function(gid, doctorId) { //检查账户信息
            $scope.ajaxInfo = null;
            $http.post(app.url.yiliao.verifyByGuser, {
                access_token: localStorage.getItem('access_token'),
                doctorId: doctorId,
                groupId: gid
            }).success(function(resp) {
                if (resp.resultCode != 1){
                    $rootScope.loginError = resp.resultMsg;
                    return;
                }else{
                    $scope.user = {};
                    $scope.group = {};

                    // 是否有资格创建集团
                    $http({
                        url: app.url.yiliao.hasCreateRole,
                        method: 'post',
                        data: {
                            access_token: app.url.access_token,
                            doctorId: doctorId
                        }
                    }).then(function(resp){
                        if(resp.data.resultCode == '1'){
                            if(resp.data.data === true){
                                $rootScope.canCreateGroup = true;
                            }else{
                                $rootScope.canCreateGroup = false;
                            }
                        }
                    });

                    //是否已有集团
                    if (!resp.data.group) {
                        $scope.un_reg = true;
                        $scope.un_check = false;
                        $scope.step_apply = false;
                        $scope.step_check = false;
                        $scope.step_active = false;
                        $scope.step_status = true;
                        $scope.user.isInGroup = false;
                        $scope.user.isAdmin = false;
                        $scope.isSysAdmin = false;      // 是否为管理员
                        $state.go('app.invite_list', null, {reload: true});
                        return;
                    }
                    var dt = {
                        id: resp.data.group.id,
                        name: resp.data.group.name,
                        logo: resp.data.group.logoUrl,
                        active: resp.data.group.active,
                        applyStatus: resp.data.group.applyStatus,
                        certStatus: resp.data.group.certStatus,
                        creator: resp.data.group.creator,
                        createDate: resp.data.group.creatorDate,
                        introduction: resp.data.group.introduction,
                        updator: resp.data.group.updator,
                        updateDate: resp.data.group.updatorDate,
                        cureNum: resp.data.group.cureNum,
                        companyId: resp.data.group.companyId,

                        groupCert: resp.data.group.groupCert,
                        config: resp.data.group.config,
                        groupUser: resp.data.groupUser,
                        userStatus: resp.data.userStatus
                    };

                    Group.init(dt);     // 设置集团相关的数据集合

                    if (resp.data.groupUser && resp.data.groupUser.rootAdmin && resp.data.groupUser.rootAdmin === 'root') {
                        Group.set('user.admin', 'root');
                    }

                    if($scope.datas.user_headPicFile){
                        Group.set('user.headPic', $scope.datas.user_headPicFile);
                    }

                    if($scope.has_more_group){
                        Group.set('user.hasMoreGroup', true);
                    }

                    //Group.set('user.status', resp.data.userStatus);

                    Group.handle(dt.id, function(group){

                        //是否已有集团
                        if (resp.data.group) {
                            utils.localData('curGroupId', group.id);
                            utils.localData('curGroupName', group.name);
                            utils.localData('group_creator', group.creator);
                            $rootScope.rootGroup.name = localStorage.getItem('curGroupName');
                            if (group.company) {
                                utils.localData('curGroupEnterpriseName', group.company.name);
                                $rootScope.rootGroup.enterpriseName = localStorage.getItem('curGroupEnterpriseName');
                            } else {
                                $rootScope.rootGroup.enterpriseName = null;
                            }
                        }

                        // 记录公司信息认证状态
                        if (group.certStatus) {
                            $rootScope.group.certStatus = group.status.certStatus;
                            utils.localData('certStatus', group.status.certStatus);
                        }

                        // 记录用户状态（3-集团管理员，2-集团成员，1-集团外医生）
                        switch (group.user.status) {
                            case '1':
                                //$scope.user.isInGroup = false;
                                //$scope.user.isAdmin = false;
                                //$scope.isSysAdmin = false;      // 是否为管理员

                                $state.go('app.invite_list', null, {reload: true});
                                break;
                            case '2':
                                //$scope.user.isInGroup = true;
                                //$scope.user.isAdmin = false;
                                //$scope.isSysAdmin = false;

                                if(group.status.active){
                                    $state.go('app.invite_list', null, {reload: true});
                                }else{
                                    if(group.status.applyStatus === 'P' || group.status.applyStatus === 'NR' || !$scope.user.isAdmin){
                                        $state.go('app.invite_list', null, {reload: true});
                                    }else{
                                        $state.go('app.group_create', null, {reload: true});
                                    }
                                }
                                break;
                            case '3':
                                //$scope.user.isAdmin = true;
                               //$scope.user.isInGroup = true;
                                //$scope.isSysAdmin = true;

                                if(group.status.active === 'active'){
                                    $state.go('app.contacts', null, {reload: true});
                                }else {
                                    if (group.status.applyStatus === 'P') {
                                        $state.go('app.contacts', null, {reload: true});
                                    } else if (group.status.applyStatus === 'NR') {
                                        $state.go('app.invite_list', null, {reload: true});
                                    } else {
                                        $state.go('app.group_create', null, {reload: true});
                                    }
                                }
                                break;
                            default:
                                break;
                        }

                        // 默认显示‘切换到普通用户’字样
                        $rootScope.roleX = true;
                        utils.localData('roleX', 'true');
                    });
                }
            }).error(function(data) {
                utils.localData('user_name', null);
                utils.localData('user_type', null);
                utils.localData('user_id', null);
                $scope.ajaxInfo = data.resultMsg;
            });
        };

        $scope.switch_user = function(){
            if(!$rootScope.roleX){
                $rootScope.roleX = true;
                utils.localData('roleX', 'true');
                $state.go('app.contacts', null, {reload: true});
            }else{
                $rootScope.roleX = false;
                utils.localData('roleX', 'false');
                $state.go('app.invite_list', null, {reload: true});
            }
        };

        $scope.createGroup = function(){
            var userId = utils.localData('user_id');
            utils.localData('applyStatus', 'NR');
            $state.go('app.group_create');
        };

        function isSmartDevice($window) {
            // Adapted from http://www.detectmobilebrowsers.com
            var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
            // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
            return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
        }

        // token更新后（如：切换用户），强制刷新页面。
        window.onfocus = function(){
            if(app.url.access_token !== utils.localData('access_token')){
                window.location.reload();
            }
        };
    }
]);

angular.module('app').controller('GuoupSearch', ['$rootScope', '$scope', '$http', '$state', 'utils',
    function($rootScope, $scope, $http, $state, utils) {
        var keyIpt = $('#key_ipt'),
            timer = 0,
            tmpKey = 'not empty!!!!!!!!!!';

        keyIpt.focus(function() {
            var curLine = $('.cur-line'),
                curBkLine = $('.cur-back-line');
            timer = setInterval(function() {
                var val = $.trim(keyIpt.val());
                if (tmpKey !== val && /\S+/.test(val)) {
                    if (curBkLine.length === 0) {
                        curLine = $('.cur-line');
                        curBkLine = $('.cur-back-line');
                    }
                    curLine.removeClass('cur-line');
                    curBkLine.removeClass('cur-back-line');
                    $rootScope.keyword = tmpKey = val;
                    $rootScope.isSearch = true;
                    utils.localData('tmpKey', tmpKey);
                    $state.go('app.contacts.list', {
                        id: tmpKey
                    }, {
                        reload: false
                    });
                } else if (!val && val != '0') {
                    curLine.addClass('cur-line');
                    curBkLine.addClass('cur-back-line');
                    tmpKey = 'not empty!!!!!!!!!!';
                    //$rootScope.isSearch = true;
                    $rootScope.isSearch = false;
                    $state.go('app.contacts.list', {
                        id: $rootScope.curDepartmentId
                    }, {
                        reload: false
                    });
                    //$rootScope.isSearch = false;

                    $('#' + utils.localData('curLiId')).removeClass('nav-cur-item').parent().parent().parent().removeClass('active');
                    $('#id_0').addClass('nav-cur-item').parent().parent().parent().addClass('active');
                    utils.localData('curLiId', 'id_0');
                } else {
                    //$rootScope.isSearch = false;
                }
            }, 100);
        });
        keyIpt.blur(function() {
            clearInterval(timer);
        });
    }
]);

// 集团切换
angular.module('app').controller('GroupSwitch', ['$rootScope', '$scope', '$http', '$state', 'utils',
    function($rootScope, $scope, $http, $state, utils) {
        var keyIpt = $('#key_ipt'),
            groupId = '',
            curGroupId = utils.localData('curGroupId'),
            userId = utils.localData('user_id');

        var groupList = utils.localData('groupList');
        if (groupList) {
            /*            var list = groupList.split(';');
                        var groupList = [];
                        for(var i=0; i<list.length; i++){
                            var item = list[i].split(',');
                            groupList[i] = {};
                            groupList[i].name = item[0];
                            groupList[i].id = item[1];
                            groupList[i].isCurGroup = item[2] == '1' ? true : false;
                        }*/

            groupList = window.eval(groupList);

            $scope.groupList = groupList || $rootScope.groupList;
        }
        $scope.changed = function(e) {
            var evt = e || window.event;
            //evt.stopPropagation();
            //evt.preventDefault();
            //var target = evt.target || evt.srcElement;
            //if(target.nodeName === 'A'){
            //var _gid = $(this).group.id;
            curGroupId = utils.localData('curGroupId');
            groupId = $(this)[0].group.id;
            $scope.switch();
            //}
        };
        $scope.switch = function() {
            if (groupId != curGroupId) {
                if ((groupId && userId) || (groupId && userId == '0') || (groupId == '0' && userId)) {
                    var listStr = '[';
                    for (var i = 0; i < groupList.length; i++) {
                        listStr += '{name:"' + groupList[i].name + '",id:"' + groupList[i].id + '"';
                        if (groupList[i].id === curGroupId) {
                            listStr += ',isCurGroup:false}';
                        } else if (groupList[i].id === groupId) {
                            listStr += ',isCurGroup:true}';
                        } else {
                            listStr += ',isCurGroup:false}';
                        }
                        if (i < groupList.length - 1) {
                            listStr += ','
                        }
                    }
                    listStr += ']';

                    utils.localData('groupList', listStr);
                    //utils.localData('curGroupId', groupId);

                    $scope.verifyByGuser(groupId, userId);
                }
            }
        };
    }
]);
