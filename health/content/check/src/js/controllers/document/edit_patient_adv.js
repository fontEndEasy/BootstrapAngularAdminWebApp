/**
 * Created by clf on 2015/12/4.
 */
app.controller('PatientADEditCtrl', function($scope, $timeout,utils,$http,$modal,Upload,toaster,$state,$stateParams,$sce) {
    $scope.titleLength=0;
    $scope.summaryLength=0;
    $scope.formData={};
    $scope.formData.keywords=[];
    $scope.fontImg=null;
    $scope.fontImgUrl=null;
    $scope.isSaved=false;
    $scope.formData.isShowImg=false;
    var isEdit=false;
    var articleId=null;

    localStorage.removeItem('articlePreview');
    var um = UM.getEditor('myEditor',{
        initialFrameWidth:'100%',
        initialFrameHeight:300,
        imageUrl:app.url.upload.CommonUploadServlet,
        imagePath:'',
        uploadPath:'adv'
    });

    $scope.$on('$destroy', function() {
        um.destroy();
    });

    //获取文字的长度
    var getByteLen = function (val) {
        var len = 0;
        for (var i = 0; i < val.length; i++) {
            if (val[i].match(/[^\x00-\xff]/ig) != null) //全角
                len += 2;
            else
                len += 1;
        };
        return len;
    };


    //编辑文章
    if($stateParams.id){
        isEdit=true;
        $http.post(app.url.science_ad.getDocumentDetail, {
            access_token:app.url.access_token,
            id:$stateParams.id
        }).
        success(function(data, status, headers, config) {
            if(data.resultCode==1){
                $scope.formData={
                    title:data.data.title
                };
                $scope.fontImgUrl=data.data.copyPath;
                $scope.formData.isShowImg=data.data.isShowImg==1?true:false;
                articleId=data.data.id;
                um.setContent(data.data.content);
            }
            else{
                alert(data.resultMsg);
            }
        }).
        error(function(data, status, headers, config) {
            alert(data.resultMsg);
        });
    }


    $scope.$watch('formData.title',function(newValue, oldValue){
        if(newValue!=oldValue){
            if($scope.formData.title){
                var totalLen=0;
                var cutTitle="";
                for(var j=0;j<$scope.formData.title.length;j++){
                    if(totalLen>=40){
                        break;
                    }
                    else{
                        totalLen+=getByteLen($scope.formData.title[j]);
                        cutTitle+=$scope.formData.title[j];
                    }
                }
                $scope.titleLength=getByteLen($scope.formData.title);
                $scope.formData.title=cutTitle;
            }
            else{
                $scope.titleLength=0;
            }
        }
    });
    $scope.$watch('formData.summary',function(newValue, oldValue){
        if(newValue!=oldValue){
            if($scope.formData.summary){
                var totalLen=0;
                var cutSummary="";
                for(var j=0;j<$scope.formData.summary.length;j++){
                    if(totalLen>=80){
                        break;
                    }
                    else{
                        totalLen+=getByteLen($scope.formData.summary[j]);
                        cutSummary+=$scope.formData.summary[j];
                    }
                }
                $scope.summaryLength=getByteLen($scope.formData.summary);
                $scope.formData.summary=cutSummary;
            }
            else{
                $scope.summaryLength=0;
            }
        }


    });


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
    //}
    //
    //function upload (file,fileName) {
    //    $scope.fontImgProgress=0;
    //    file.upload = Upload.upload({
    //        url:app.url.upload.CommonUploadServlet,
    //        file:file,
    //        fields:{
    //            path:'adv'
    //        }
    //    });
    //    file.upload.success(function (response) {
    //        if(response.resultCode==1){
    //            if(response.data.datas[0]){
    //                $scope.fontImgUrl=response.data.datas[0].oUrl;
    //                toaster.pop('success',null,'封面修改成功！');
    //            }
    //        }
    //        else{
    //            toaster.pop('error',null,'封面修改失败！');
    //            alert(response.resultMsg);
    //        }
    //    });
    //    file.upload.progress(function (evt) {
    //        $scope.fontImgProgress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
    //    });
    //    file.upload.error(function (response) {
    //        console.log(response);
    //        toaster.pop('error',null,'封面修改失败！');
    //    });
    //};
    //
    //
    ////删除封面图片
    //$scope.deleteImg=function(){
    //    if($scope.fontImgUrl!=null){
    //        var originUrl = $scope.fontImgUrl;
    //        var newURL = originUrl.match('^[^#]*?://.*?(/.*)$')[1];
    //        $http.get(app.url.upload.commonDelFile+'?fileName='+newURL).
    //            success(function(data, status, headers, config) {
    //                if(data.resultCode==1){
    //                    $scope.fontImg=null;
    //                    $scope.fontImgUrl=null;
    //                    toaster.pop('success','',data.resultMsg);
    //                    $scope.fontImgProgress=0;
    //                }
    //                else{
    //                    toaster.pop('error','',data.resultMsg);
    //                }
    //            }).
    //            error(function(data, status, headers, config) {
    //                toaster.pop('error','',data.resultMsg);
    //            });
    //    }
    //    else{
    //        toaster.pop('error','','图片为空！');
    //    }
    //};


    //保存文章
    $scope.saveDoc=function(){
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

        $scope.isSaved=true;
        var isShowImg=$scope.formData.isShowImg==false?0:1;
        if(isEdit==true){
            $http.post(app.url.science_ad.updateDocument, {
                access_token:app.url.access_token,
                id:articleId,
                title:$scope.formData.title,
                copyPath:$scope.fontImgUrl,
                isShowImg:isShowImg,
                content:html
            }).
            success(function(data, status, headers, config) {
                if(data.resultCode==1){
                    if($state.includes('app.edit_patient_ad')){
                        toaster.pop('success','','保存成功,3秒钟后返回患者广告条列表');
                        setTimeout(function(){
                            $state.go('app.doc.ads.patient',{},{reload:true});
                        },3000);
                    }
                    else if($state.includes('edit_patient_ad')){
                        toaster.pop('success','','保存成功,3秒钟后返回文章');
                        window.opener.reflashData();
                        setTimeout(function(){
                            $state.go('patient_ad_article',{id:$stateParams.id},{reload:true});
                        },3000);
                    }
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
        }
        else{
            $http.post(app.url.science_ad.createDocument, {
                access_token:app.url.access_token,
                documentType:1,
                title:$scope.formData.title,
                copyPath:$scope.fontImgUrl,
                isShowImg:isShowImg,
                content:html
            }).
                success(function(data, status, headers, config) {
                    if(data.resultCode==1){
                        toaster.pop('success','','保存成功,3秒钟后返回患者广告条列表');
                        setTimeout(function(){
                            $state.go('app.doc.ads.patient',{},{reload:true});
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
        }

    };

    //预览文章，并不保存
    $scope.toPreview=function(){
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
        var isShowImg=$scope.formData.isShowImg==false?0:1;
        var articlePreview={
            title:$scope.formData.title,
            copyPath:$scope.fontImgUrl,
            content:html,
            isShowImg:isShowImg
        };

        localStorage.setItem('articlePreview',JSON.stringify(articlePreview));
        var url = $state.href('patient_ad_article', {id: 'preview'});
        window.open(url,'_blank');
    };
});