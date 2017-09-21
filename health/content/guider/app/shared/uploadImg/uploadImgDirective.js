(function() {
    angular.module('app')
        .directive('uploadImg', uploadImg);

    function uploadImg() {
        return {
            scope: {
                data: '=',
                setClass: '@',
                setValue: '@',
            },
            templateUrl: 'app/shared/uploadImg/uploadImgView.html',
            controller: 'UploadImgController',
        };
    }
})();
