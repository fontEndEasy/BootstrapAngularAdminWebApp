(function() {
    angular.module('app')
        .directive('qiniuUploader', qiniuUploader);

    function qiniuUploader() {
        return {
            scope: {
                token: '@',
                bucket: '@',
                uploader: '=?',
                upload: '=?',
                successCallBack: '=?',
                errorCallBack: '=?',
                addedCallBack: '=?',
                progressCallBack: '=?',
                fileList: '=?',
                cancel: '=?',
                qniuSetting: '=?',
                maxFileSize: '@',
                chunkSize: '@',
                uniqueNames: '@',
                multiSelection: '@',
                filters: '=?',
                maxSelect: '=?',
            },
            templateUrl: function() {
                var isChack = window.location.href.indexOf('/check/');
                if (isChack != -1)
                    return '../components/qiniuUploader/qiniuUploaderView.html';
                else
                    return 'components/qiniuUploader/qiniuUploaderView.html';
            }(),
            controller: 'QiniuUploaderCtrl',
        };
    }
})();
