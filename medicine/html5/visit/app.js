/**
 * app.js
 * @authors Casper 
 * @date    2015/12/14
 * @version 1.0.0
 */
define(['angular', 'app.core'], function(angular) {
    angular.module('app', ['app.core'])
        .config(configure)
        .run(run);

    configure.$inject = [];

    function configure() {}

    run.$inject = ['$rootScope', '$urlRouter'];

    function run($rootScope, $urlRouter) {
        $rootScope.$on('$stateChangeStart', function(e, nextState, nextStateParams) {
            console.log("$stateChangeStart", arguments);
            $rootScope.$broadcast('close');
        });
        $rootScope.$on('$locationChangeSuccess', function(e, next, current) {
            console.log("$locationChangeSuccess", next, current);
            e.preventDefault();
            $urlRouter.sync();
        });
    }
});
