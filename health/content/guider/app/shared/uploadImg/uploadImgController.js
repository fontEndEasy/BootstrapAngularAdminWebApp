(function() {
    angular.module('app')
        .controller('UploadImgController', UploadImgController);

    UploadImgController.$inject = ['$scope', 'FileUploader'];

    function UploadImgController($scope, FileUploader) {

        $scope.selectFile = function() {
            document.getElementById("uploadImgInput").click();
        }

        // 上传文件-
        $scope.uploader = new FileUploader({
            url: app.api.upLoad.commonUploadServlet
        });

        // 上传文件-FILTERS

        $scope.uploader.filters.push({
            fn: function(item /*{File|FileLikeObject}*/ , options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });

        // 上传文件-CALLBACKS
        $scope.data = {};
        $scope.data.file = [];

        $scope.uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/ , filter, options) {
            $scope.data.error = '文件添加失败，请检查文件格式';
        };

        $scope.uploader.onAfterAddingFile = function(fileItem) {
            $scope.data.isLoading = true;
            $scope.data.error = '';
            fileItem.upload();
        };

        $scope.uploader.onSuccessItem = function(fileItem, response, status, headers) {
            $scope.data.isLoading = false;
            if (response.resultCode == 1) {
                $scope.data.file.push(response.data.datas[0]);
                console.log($scope.data.file);
            }
        };

    };

})();
