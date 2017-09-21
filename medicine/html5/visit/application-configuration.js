/**
 * application-configuration.js
 * @authors wangzl 
 * @date    2016/02/19
 * @version 1.0.0
 */
require.config({
    baseUrl: './',
    urlArgs: '@ver=ver1.0.2',
    paths: {
        'jquery': 'vendor/jquery/jquery.min',
        'flexible': 'common/flexible',
        'httpconfig': '../../assets/config',
        'jsbridge': 'common/h5JSBridge',
        'angular': 'vendor/angular/angular.min',
        'angular-ui-route': 'vendor/angular-ui-router/release/angular-ui-router.min',
        'ngDialog': 'vendor/ngDialog/js/ngDialog.min',
        'oclazyload': 'vendor/oclazyload/dist/ocLazyLoad.require.min'
    },
    map: {
        '*': {
            'css': 'vendor/require-css/css.min'
        }
    },
    shim: {
        'angular': {
            deps: ['jquery', 'flexible', 'httpconfig', 'jsbridge', 'css!common/reset.css', 'css!common/main.css', 'css!common/style.css', 'css!vendor/ngDialog/css/ngDialog.css'],
            exports: 'angular'
        },
        'angular-ui-route': {
            deps: ['angular']
        },
        'ngDialog': {
            deps: ['angular']
        },
        'oclazyload': {
            deps: ['angular']
        }
    }
});

define(['angular', 'app'], function(angular) {
    'use strict';
    angular.element(document).ready(function() {
        angular.bootstrap(document, ['app']);
    });
});
