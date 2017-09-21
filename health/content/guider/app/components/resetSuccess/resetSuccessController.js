(function() {
    angular.module('app')
        .controller('ResetSuccessCtrl', ResetSuccessCtrl);

    // 手动注入依赖
    ResetSuccessCtrl.$inject = ['$scope', '$state','$http'];

    // 登录控制器
    function ResetSuccessCtrl($scope, $state,$http) {

    }

})();
