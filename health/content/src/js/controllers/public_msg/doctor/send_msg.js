/**
 * Created by clf on 2015/11/23.
 */
app.controller('DocSendMsgCtrl', function($scope, $timeout,utils,$http,$modal,Upload,toaster,$state,$stateParams) {
    var curGroupId=localStorage.getItem('curGroupId');

    $scope.titleLength=0;
    $scope.formData={};
    $scope.formData.patients=[];
    $scope.fontImg=null;
    $scope.fontImgUrl=null;
    $scope.copy_small=null;
    $scope.isSaved=false;

    //um编辑器
    var um = UM.getEditor('myEditor',{
        initialFrameWidth:'100%',
        initialFrameHeight:300,
        imageUrl:app.url.upload.CommonUploadServlet,
        imagePath:'',
        uploadPath:'pubdoc'
    });

    $scope.$on('$destroy', function() {
        um.destroy();
    });

    $scope.$watch('formData.title',function(newValue, oldValue){
        if(newValue!=oldValue){
            if($scope.formData.title){
                $scope.titleLength=$scope.formData.title.length;
            }
            else{
                $scope.titleLength=0;
            }
        }
    });

    ////图片上传
    //$scope.$watch('fontImg',function (files) {
    //    goUpload (files,'fontImg');
    //});
    //
    ////这边是多文件上传
    //function goUpload (files,fileName,certType) {
    //    if (files != null) {
    //        var isAllow=false;
    //        var fileTypes=['jpg','jpeg','png','bmp'];
    //        fileTypes.forEach(function(item,index,array){
    //            if(files.name.split('.').slice(-1)[0]==item){
    //                isAllow=true;
    //            }
    //        });
    //        if(!isAllow){
    //            toaster.pop('error',null,'图片类型不支持');
    //            return;
    //        }
    //
    //        if (!angular.isArray(files)) {
    //            files = [files];
    //        }
    //        for (var i = 0; i < files.length; i++) {
    //            $scope.errorMsg = null;
    //            (function (f,fileName,certType) {
    //                utils.fileCompressToBlob(f,1,1000000,function(blob){
    //                    upload(blob,fileName,certType);
    //                });
    //            })(files[i],fileName,certType);
    //        }
    //    }
    //};
    //
    //function upload (file,fileName) {
    //    console.log(file);
    //    file.upload = Upload.upload({
    //        url:app.url.upload.CommonUploadServlet,
    //        file:file,
    //        fields:{
    //            path:'pubdoc'
    //        }
    //    });
    //    file.upload.success(function (response) {
    //        if(response.resultCode==1){
    //            if(response.data.datas[0]){
    //                $scope.fontImgUrl=response.data.datas[0].oUrl;
    //                $scope.copy_small=response.data.datas[0].tUrl;
    //                toaster.pop('success',null,'题图修改成功！');
    //            }
    //        }
    //        else{
    //            toaster.pop('error',null,'题图修改失败！');
    //            console.log(response.resultMsg);
    //        }
    //    });
    //    file.upload.progress(function (evt) {
    //        $scope.fontImgProgress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
    //    });
    //    file.upload.error(function (response) {
    //        console.log(response);
    //        toaster.pop('error',null,'题图修改失败！');
    //    });
    //};


    ////删除封面图片
    //$scope.deleteImg=function(){
    //    if($scope.fontImgUrl!=null){
    //        var originUrl = $scope.fontImgUrl;
    //        var newURL = originUrl.match('^[^#]*?://.*?(/.*)$')[1];
    //        $http.get(app.url.upload.commonDelFile+'?fileName='+newURL).
    //            success(function(data, status, headers, config) {
    //                if(data.resultCode==1){
    //                    console.log(data);
    //                    $scope.fontImg=null;
    //                    $scope.fontImgUrl=null;
    //                    $scope.copy_small=null;
    //                    toaster.pop('success','',data.resultMsg);
    //                }
    //            }).
    //            error(function(data, status, headers, config) {
    //                alert(data);
    //            });
    //    }
    //    else{
    //        toaster.pop('error','','图片为空！');
    //    }
    //};


    // 七牛上传文件过滤
    $scope.qiniuFilters = {
        mime_types: [ //只允许上传图片和zip文件
            {
                title: "Image files",
                extensions: "jpg,gif,png"
            }
        ]
    };

    //选择文件上传
    $scope.selectFile = function(){
        $scope.upload();
    };

    // 设置七牛上传获取uptoken的参数
    $scope.token = localStorage.getItem('access_token');
    // 选择文件后回调
    $scope.uploaderAdded = function(up, files) {
        $scope.uploadPercent=0;
        console.log(up,files);
    };
    // 每个文件上传成功回调
    $scope.uploaderSuccess = function(up, file, info) {
        $scope.fontImgUrl=file.url;
        $scope.copy_small=file.url+'?imageView2/3/w/200/h/200';
        $scope.uploadPercent=100;
        toaster.pop('success',null,'封面修改成功！');
    };
    // 每个文件上传失败后回调
    $scope.uploaderError = function(up, err, errTip) {
        if(err.code==-600){
            toaster.pop('error', null, '文件过大');
        }
        else{
            toaster.pop('error', null, errTip);
        }
    };

    //上传进度
    $scope.fileUploadProcess=function(up, file){
        $scope.uploadPercent=file.percent==100?99:file.percent;
    };

    //发送消息
    $scope.sendMsg=function(){
        var tagsId=[];
        if(!$scope.formData.title){
            toaster.pop('warn','','请填写标题');
            return;
        }
        if(!$scope.fontImgUrl){
            toaster.pop('warn','','请上传题图');
            return;
        }
        var html = um.getContent();
        if(html.length<=0){
            toaster.pop('warn','','请填写正文');
            return;
        }
        if($scope.formData.patients!=null&&$scope.formData.patients.length>0){
            $scope.formData.patients.forEach(function(item,index,array){
                tagsId.push(item.id);
            });
        }

        $scope.isSaved=true;


        var mptList=[
            {
                title:$scope.formData.title,
                pic:$scope.fontImgUrl,
                content:html
            }
        ];

        var sendMsgParam={
            access_token:app.url.access_token,
            pubId:$stateParams.id,
            userId:localStorage.getItem('user_id'),
            toAll:true,
            sendType:2,
            model:2,
            toNews:true,
            mpt:mptList
        };


        $http({method:'POST',url:app.url.pubMsg.sendMsg, data: JSON.stringify(sendMsgParam), headers:
        {
            "access_token":app.url.access_token,
            "Content-Type":"application/json"
        }}).
        success(function(data, status, headers, config) {
            if(data.resultCode==1){
                toaster.pop('success','','发送成功,3秒钟后返回历史消息列表');
                setTimeout(function(){
                    $state.go('app.doc.msg_manage.msg_history',{},{reload:true});
                },3000);
            }
            else{
                $scope.isSaved=false;
                toaster.pop('error','',data.resultMsg);
            }
        }).
        error(function(data, status, headers, config) {
            $scope.isSaved=false;
            toaster.pop('error','',data.resultMsg);
        });
    };


    //预览文章
    $scope.preview=function(){
        if(!$scope.formData.title){
            toaster.pop('warn','','请填写标题');
            return;
        }
        if(!$scope.fontImgUrl){
            toaster.pop('warn','','请上传题图');
            return;
        }
        var html = um.getContent();
        if(html.length<=0){
            toaster.pop('warn','','请填写正文');
            return;
        }

        var msg={
            title:$scope.formData.title,
            fontImgUrl:$scope.fontImgUrl,
            content:html,
            time:utils.dateFormat(new Date(),'yyyy-MM-dd')
        };
        var modalInstance = $modal.open({
            templateUrl: 'previewModalContent.html',
            controller: 'previewModalInstanceCtrl',
            windowClass:'carePreview',
            resolve: {
                msg: function () {
                    return msg;
                }
            }
        });
    };
});

app.controller('previewModalInstanceCtrl', function ($scope, $modalInstance,msg,$sce) {
    $scope.msg=msg;
    $scope.msg.content=$sce.trustAsHtml($scope.msg.content);
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});
