'use strict';
//集团LOGO设置控制器
app.controller('groupLogoCtrl', ['$scope', '$modal', '$log', '$http', 'Upload','$stateParams','$state','$rootScope','toaster','utils',
  function($scope, $modal, $log, $http, Upload,$stateParams,$state,$rootScope,toaster,utils){
    //$rootScope.isCompany = false;
    var groupId = localStorage.getItem('curGroupId');
    $scope.$watch('groupLogo',function (files) {
        goUpload (files,'groupLogo',groupId);
    });

    var userId,successUrl; //用户ID,成功后跳转URl

    if(localStorage.getItem('enterprise_id')){//公司
        userId = localStorage.getItem('enterprise_id');
        successUrl = 'app.group_manage';
    }else{//医生
        userId = localStorage.getItem('user_id');
        successUrl = 'app.contacts';
    }
    $scope.goToGroup = function () {
        $state.go(successUrl,{'reload':true});
    }
    function goUpload (files,fileName,certType) {
        if (files != null) {
            if (!angular.isArray(files)) {
                files = [files];
            }
            for (var i = 0; i < files.length; i++) {
                $scope.errorMsg = null;
                (function (f,fileName,certType) {
                    upload(f,fileName,certType);
                })(files[i],fileName,certType);
            }
        }
    };
    function upload (file,fileName,certType) {
        file.upload = Upload.upload({
            url:app.url.upload.upLoadImg,
            file:file,
            fileName:fileName,
            fields: {
                'userId': userId,
                'access_token':app.url.access_token,
                'certType':certType,
                'fileName':fileName
            }
        });
        file.upload.progress(function (evt) {
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });
        file.upload.success(function (response) {
            console.log(response);
            if(response.data.oUrl){
                $scope.datas.groupPicFile = response.data.oUrl + '?'+ (new Date()).getTime();
                utils.localData('groupPicFile', response.data.oUrl);
            }else{
                $scope.datas.groupPicFile = 'src/img/a0.jpg';
                utils.localData('groupPicFile', null);
            }
            toaster.pop('success',null,'头像修改成功！');
            file.result = '上传成功！';
            console.log(userId);
            console.log(certType);
            console.log(fileName);
            console.log(response);
        });
        file.upload.error(function (response) {
            console.log(response);
            toaster.pop('error',null,'头像修改失败！');
            $scope.authError = '上传失败';
        });
    };
}])