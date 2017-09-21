(function() {
    angular.module('app')
        .directive('timeEditor', timeEditor);

    function timeEditor() {
        return {
            scope: {
                open: '=',
                date: '=',
                minDate: '@',
                maxDate: '@',
                minuteStep: '@',
                hourStep: '@',
                callBack: '=',
            },
            templateUrl: 'app/shared/time_editor/timeEditorView.html',
            controller: 'TimeEditorCtrl'
        }
    }

})();
