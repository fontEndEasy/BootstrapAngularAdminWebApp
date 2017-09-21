(function() {
    angular.module('app')
        .controller('UploadFileController', UploadFileController);

    UploadFileController.$inject = ['$scope', '$http', 'toaster', 'FileUploader'];

    function UploadFileController($scope, $http, toaster, FileUploader) {

        // 七牛上传文件过滤
        $scope.qiniuFilters = {
            mime_types: [ //只允许上传图片和zip文件
                {
                    title: "Image files",
                    extensions: "jpg,gif,png"
                }
            ]
        }

        $scope.token = localStorage['guider_access_token'];
        // 选择文件后回调
        $scope.uploaderAdded = function(up, files) {
            // console.log(up, files);
            $scope.data.isLoading = true;
        };
        // 每个文件上传成功回调
        $scope.uploaderSuccess = function(up, file, info) {

            $http({
                url: file.url + '?imageInfo',
                method: 'get'
            }).then(function(response) {
                var rep = response.data;
                if (!rep.error) {
                    $scope.data.isLoading = false;
                    $scope.data.imgFile = {};
                    $scope.data.imgFile.name = file.name;
                    $scope.data.imgFile.size = file.size;
                    $scope.data.imgFile.url = file.url;
                    $scope.data.imgFile.format = rep.format;
                    $scope.data.imgFile.width = rep.width;
                    $scope.data.imgFile.height = rep.height;
                    $scope.data.imgFile.colorModel = rep.colorModel;
                    $scope.data.imgFile.key = file.id;
                } else {
                    toaster.pop('error', null, rep.error);
                }
                $scope.fileList = [];
            });

        };
        // 每个文件上传失败后回调
        $scope.uploaderError = function(up, err, errTip) {
            $scope.data.isLoading = false;
            console.warn(up, err, errTip);
            toaster.pop('error', null, errTip);
        };

        // 上传文件-
        // $scope.uploader = new FileUploader({
        //     url: app.api.upLoad.commonUploadServlet
        // });

        // // 上传文件-FILTERS

        // $scope.uploader.filters.push({
        //     fn: function(item /*{File|FileLikeObject}*/ , options) {
        //         var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        //         return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        //     }
        // });

        // // 上传文件-CALLBACKS

        // $scope.uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/ , filter, options) {
        //     $scope.data.imgFile = null;
        //     $scope.data.error = '文件添加失败，请检查文件格式';
        // };

        // $scope.uploader.onAfterAddingFile = function(fileItem) {
        //     $scope.data.isLoading = true;
        //     $scope.data.imgFile = null;
        //     $scope.data.error = '';
        //     fileItem.upload();
        // };
        // $scope.uploader.onSuccessItem = function(fileItem, response, status, headers) {
        //     $scope.data.isLoading = false;
        //     if (response.resultCode === 1) {
        //         $scope.data.imgFile = response.data.datas[0];
        //     }
        // };

    };

})();
