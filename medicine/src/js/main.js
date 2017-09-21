'use strict';
/* Controllers */
angular.module('app').controller('AppCtrl', ['$rootScope', '$scope', '$translate', '$localStorage', '$window', '$http', '$state', '$cookieStore', 'utils',
    function($rootScope, $scope, $translate, $localStorage, $window, $http, $state, $cookieStore, utils) {
        // add 'ie' classes to html
        var isIE = !!navigator.userAgent.match(/MSIE/i);
        isIE && angular.element($window.document.body).addClass('ie');
        isSmartDevice($window) && angular.element($window.document.body).addClass('smart');
        app.state = $state;
        // config
        $scope.app = {
            name: '企业管理系统',
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

        document.title = $scope.app.name;
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
                }
                ;
            });
        };
        //uiInit();

        // 用户退出2222
        $scope.logout = function() {
            var key = localStorage.getItem('access_token');
            $http.get(app.url.logout + '/' + key).then(function(response) {
                if (response.statusText === 'OK') {
                    // 清除某些与当前账号相关的数据
                    utils.localData('headPicFile', null);
                    utils.localData('groupPicFile', null);
                    utils.localData('curGroupId', null);
                    utils.localData('curGroupName', null);
                    //utils.localData('access_token', null);
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
                    $state.go('access.signin', {}, { "reload": true });
                } else {
                    $state.go('access.signin', {}, { "reload": true });
                }
            });
        };

        function isSmartDevice($window) {
            // Adapted from http://www.detectmobilebrowsers.com
            var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
            // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
            return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
        }

        $rootScope.$on('lister_logout', function(evet, data) {
            $scope.logout();
        });
    }
]);

function getRootPath() {
    var strFullPath = window.document.location.href;
    var strPath = window.document.location.pathname;
    var pos = strFullPath.indexOf(strPath);
    var prePath = strFullPath.substring(0, pos);
    var postPath = strPath.substring(0, strPath.substr(1).indexOf('/') + 1);
    path = prePath + postPath;
    return (prePath + postPath);
}
