'use strict';
//=======================================App配置==========================================
(function() {
    angular
        .module('app', [
            'ui.router',
            'ngTouch',
            'ui.bootstrap',
            'ngAnimate',
            'angularFileUpload',
            'xeditable',
            'angularMoment',
            'toaster',
            'treeControl',
            'smart-table',
            'bootstrapLightbox',
            'ngAudio',
            'oc.lazyLoad'
        ]);

    window.app = angular.module('app');

})();
(function() {
    // injector
    angular.module('app')
        .run(run)
        .config(config);

    // run.$inject＝['$rootScope', '$state', '$stateParams'];

    function run($rootScope, $state, $stateParams, editableOptions) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
    }

    function config($stateProvider, $urlRouterProvider, $httpProvider, $provide) {
        //=================================http请求配置========================================
        $httpProvider.defaults.transformRequest = function(obj) {
            var str = [];
            for (var p in obj) {
                str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
            }
            return str.join('&');
        };
        $httpProvider.defaults.headers.post = {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        };

    }
})();
(function() {
    app.directive('ngEnter', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if (event.which === 13) {
                    scope.$apply(function() {
                        scope.$eval(attrs.ngEnter);
                    });

                    event.preventDefault();
                }
            });
        };
    });
})();
