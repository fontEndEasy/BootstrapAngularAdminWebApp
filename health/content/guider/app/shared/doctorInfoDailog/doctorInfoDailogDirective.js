(function() {
    angular.module('app')
        .directive('doctorInfoDailog', doctorInfoDailog);

    function doctorInfoDailog() {
        return {
            scope: {
                open: '=',
                goRunning: '=',
            },
            templateUrl: 'app/shared/doctorInfoDailog/doctorInfoDailogView.html',
            controller: 'DoctorInfoDailogCtrl',
        }
    }
})();
