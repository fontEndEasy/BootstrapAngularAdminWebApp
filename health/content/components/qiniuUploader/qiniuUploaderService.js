(function() {
    angular.module('app')
        .factory('QiniuUploaderFactory', QiniuUploaderFactory)

    // 手动注入依赖
    QiniuUploaderFactory.$inject = ['$http', '$modal'];

    function QiniuUploaderFactory($http, $modal) {
        return {
            open: openModel,
            upLoad: upLoad
        };

        // 打开上传进度
        function openModel() {
            // var modalInstance = $modal.open({
            //     templateUrl: '/components/qiniuUploader/qiniuUploaderView.html',
            //     windowClass: 'bottom-modal',
            //     controller: 'QiniuUploaderCtrl',
            //     keyboard: false,
            //     backdrop: false,
            //     size: 'sm',
            //     resolve: {
            //         data: {
            //             fromTel: 1
            //         }
            //     }
            // });
        }

        function upLoad() {

        }

    };

})();
