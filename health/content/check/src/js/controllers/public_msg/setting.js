/**
 * Created by clf on 2015/11/24.
 */
app.controller('MsgSettingCtrl', function($scope, $timeout,utils,$http,$modal,Upload,toaster,$state,$stateParams) {

    var getPubInfo=function(){
        $http.post(app.url.pubMsg.getPubInfo, {
            access_token:app.url.access_token,
            pid:$stateParams.id
        }).
        success(function(data, status, headers, config) {
            if(data.resultCode==1){
                $scope.pubInfo=data.data;
            }
            else{
                toaster.pop('error','',data.resultMsg);
            }
        }).
        error(function(data, status, headers, config) {
            toaster.pop('error','',data.resultMsg);
        });
    };

    getPubInfo();


    //图片上传
    $scope.$watch('fontImg',function (files) {
        goUpload (files,'fontImg');
    });

    //这边是多文件上传
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

    function upload (file,fileName) {
        console.log(file);
        file.upload = Upload.upload({
            url:app.url.upload.CommonUploadServlet,
            file:file,
            fields:{
                path:'pubgroup'
            }
        });
        file.upload.success(function (response) {
            if(response.resultCode==1){
                if(response.data.datas[0]){
                    $scope.pubInfo.photourl=response.data.datas[0].oUrl;
                    toaster.pop('success',null,'图标修改成功！');
                }
            }
            else{
                toaster.pop('error',null,'图标修改失败！');
                console.log(response.resultMsg);
            }
        });
        file.upload.error(function (response) {
            console.log(response);
            toaster.pop('error',null,'图标修改失败！');
        });
    };


    //删除封面图片
    $scope.deleteImg=function(){
        if($scope.pubInfo.photourl!=null){
            var originUrl = $scope.pubInfo.photourl;
            var newURL = originUrl.match('^[^#]*?://.*?(/.*)$')[1];
            $http.get(app.url.upload.commonDelFile+'?fileName='+newURL).
                success(function(data, status, headers, config) {
                    if(data.resultCode==1){
                        console.log(data);
                        $scope.fontImg=null;
                        $scope.pubInfo.photourl=null;
                        toaster.pop('success','','图片删除成功');
                    }
                }).
                error(function(data, status, headers, config) {
                    alert(data);
                });
        }
        else{
            toaster.pop('error','','图片为空！');
        }
    };

    $scope.save=function(){
        $http.post(app.url.pubMsg.savePubInfo, {
            access_token:app.url.access_token,
            pid:$stateParams.id,
            photourl:$scope.pubInfo.photourl,
            note:$scope.pubInfo.note
        }).
        success(function(data, status, hueaders, config) {
            if(data.resultCode==1){
                toaster.pop('success','','保存成功');
            }
            else{
                toaster.pop('error','',data.resultMsg);
            }
        }).
        error(function(data, status, headers, config) {
            toaster.pop('error','',data.resultMsg);
        });
    };
});

