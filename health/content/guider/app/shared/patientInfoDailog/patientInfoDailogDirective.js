(function() {
    angular.module('app')
        .directive('patientInfoDailog', patientInfoDailog);

    function patientInfoDailog() {
        return {
            scope: {
                open: '='
            },
            templateUrl: 'app/shared/patientInfoDailog/patientInfoDailogView.html',
            controller: 'PatientInfoDailogCtrl'
        }
    }

})();
