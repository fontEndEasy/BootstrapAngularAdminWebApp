/**
 * app.core.js
 * @authors wangzl 
 * @date    2016/02/19
 * @version 1.0.0
 */
define(['angular', 'oclazyload', 'app.router', 'app.service', 'app.directive'], function() {
    angular.module('app.core', ['oc.lazyLoad', 'app.router', 'app.service', 'app.directive'])
        .filter('html', htmlFilter)
        .config(configure)
        .run();

    htmlFilter.$inject = ['$sce'];

    function htmlFilter($sce) {
        return function(input) {
            return $sce.trustAsHtml(input);
        };
    }

    configure.$inject = ['$ocLazyLoadProvider'];

    function configure($ocLazyLoadProvider) {
        $ocLazyLoadProvider.config({
            modules: [],
            debug: true
        });
    }

    /*  run.$inject = ['$areaService', '$developerService'];
      function run($areaService, $developerService) {}*/
});
