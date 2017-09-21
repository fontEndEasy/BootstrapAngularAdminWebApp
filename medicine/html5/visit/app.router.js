/**
 * app.router.js
 * @authors wangzl 
 * @date    2016/02/19
 * @version 1.0.0
 */
define(['angular', 'angular-ui-route'], function(angular) {
    angular.module('app.router', ['ui.router']).config(router);
    router.$inject = ['$stateProvider', '$urlRouterProvider'];

    function router($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.deferIntercept();
        $urlRouterProvider.when('', '/').otherwise('/');
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'visit/tpl/home.html',
                controller: 'HomeController',
                resolve: {
                    load: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load(['visit/controllers/home']);
                    }]
                }
            })
            .state('editvisit', {
                url: '/editvisit?status&id',
                templateUrl: 'visit/tpl/editvisit.html',
                controller: 'EditVisitController',
                resolve: {
                    load: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load(['visit/controllers/editvisit.js']);
                    }]
                }
            })
            .state('lookvisit', {
                url: '/lookvisit?id',
                templateUrl: 'visit/tpl/lookvisit.html',
                controller: 'LookVisitController',
                resolve: {
                    load: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load(['visit/controllers/lookvisit.js']);
                    }]
                }
            })
    }
});
