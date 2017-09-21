(function() {
    angular.module('app')
        .directive('uploadFile', uploadFile);

    function uploadFile() {
        return {
            scope: {
                data: '=',
                beRunning: '=',
                goRunning: '=',
            },
            templateUrl: 'app/shared/chat_window/uploadFile/uploadFileView.html',
            controller: 'UploadFileController',
        };
    }
})();
