(function() {
    angular.module('app')
        .directive('searchDoctorDialog', searchDoctorDialog);

    function searchDoctorDialog() {
        return {
            scope: {
                open: '=',
                goRunning: '=',
            },
            templateUrl: 'app/shared/searchDoctorDialog/searchDoctorDialogView.html',
            controller: 'SearchDoctorDialogCtrl'
        }
    }

})();
