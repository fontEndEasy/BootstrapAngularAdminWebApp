'use strict';
/* Controllers */
angular.module('app').controller('AppCtrl', ['$rootScope', '$scope', '$translate', '$localStorage', '$window', '$http', '$state', '$cookieStore', 'utils',
    function ($rootScope, $scope, $translate, $localStorage, $window, $http, $state, $cookieStore, utils) {

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

        // save settings to local storage
        if (angular.isDefined($localStorage.settings)) {
            $scope.app.settings = $localStorage.settings;
        } else {
            $localStorage.settings = $scope.app.settings;
        }
        $scope.$watch('app.settings', function () {
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
            check_user_name: utils.localData('check_user_name') || ' ',
            check_user_type: utils.localData('check_user_type') || ' ',
            doctor_check: utils.localData('doctor_check') || 0,
            group_check: utils.localData('group_check') || 0,
            group_check_with_v: utils.localData('group_check_with_v') || 0,
            v_order_notexception: utils.localData('v_order_notexception') || 0,
            v_order_notall: utils.localData('v_order_notall') || 0,
            v_order_ingexception: utils.localData('v_order_ingexception') || 0,
            v_order_ingall: utils.localData('v_order_ingall') || 0,
            v_order_pass: utils.localData('v_order_pass') || 0,
            v_order_cancel: utils.localData('v_order_cancel') || 0,
            feedback_undo: utils.localData('feedback_undo') || 0,
            order_done: utils.localData('order_done') || 0
        };

        $scope.selectLang = $scope.langs[$translate.proposedLanguage()] || "中文（简体）";
        $scope.setLang = function (langKey, $event) {
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
        var uiInit = $scope.app.ui.init = function () {
            $http.get('src/api/nav_items').then(function (resp) {
                if (resp.data.datalist) {
                    $scope.app.ui.items = resp.data.datalist;
                }
                ;
            });
        };
        //uiInit();

        // 用户退出
        $scope.logout = function () {
            $http.get(app.url.logout + '?' + $.param({
                    access_token: app.url.access_token
                })).then(function (response) {
                if (response.statusText === 'OK') {
                    $cookieStore.remove('username');
                    $state.go('access.signin');
                } else {
                    console.log("Logout: " + response.statusText);
                }
            }, function (x) {
                console.log("Logout: " + x.statusText);
            });
        };

        function isSmartDevice($window) {
            // Adapted from http://www.detectmobilebrowsers.com
            var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
            // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
            return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
        }
    }
]);