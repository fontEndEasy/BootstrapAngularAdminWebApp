app.controller('CareIntroCtrl', function($scope, $timeout,utils,$http,$modal,Upload,toaster,$state,$stateParams,$sce) {
    $scope.titleLength=0;
    $scope.summaryLength=0;
    $scope.formData={};
    $scope.formData.keywords=[];
    $scope.fontImg=null;
    $scope.fontImgUrl=null;
    $scope.thumPath=null;
    $scope.isSaved=false;
    var planSave={};

    $scope.isEdit=$stateParams.isEdit=='edit';

    var um = UM.getEditor('myEditor',{
        initialFrameWidth:'100%',
        initialFrameHeight:300,
        imageUrl:app.url.upload.CommonUploadServlet,
        imagePath:'',
        uploadPath:'care'
    });

    $scope.$on('$destroy', function() {
        um.destroy();
    });

    //获取文字的长度
    //var getByteLen = function (val) {
    //    var len = 0;
    //    for (var i = 0; i < val.length; i++) {
    //        if (val[i].match(/[^\x00-\xff]/ig) != null) //全角
    //            len += 2;
    //        else
    //            len += 1;
    //    };
    //    return len;
    //};


    $scope.diseaseData=[];
    var getDiseaseData=function(){
        $http.post(app.url.care.getDiseaseTypeTree, {
            access_token:app.url.access_token,
            groupId: localStorage.getItem('curGroupId'),
            tmpType: 3
        }).
        success(function(data, status, headers, config) {
            if(data.resultCode==1){
                data.data.forEach(function(item,index,array){
                    $scope.diseaseData.push({id:item.id,name:item.name});
                });
                //$scope.formData.selectedDisease=$scope.diseaseData[$scope.diseaseData.length-1];
            }
            else{
                alert(data.resultMsg);
            }
        }).
        error(function(data, status, headers, config) {
            alert(data.resultMsg);
        });

    };

    getDiseaseData();


    //获取金钱区间
    function getPriceRange(){
        $http.post(app.urlRoot + 'group/fee/get', {
            access_token: localStorage.getItem('access_token'),
            groupId: localStorage.getItem('curGroupId')
        }).then(function(rpn) {
            if (rpn.data.resultCode === 1 && rpn.data.data.carePlanMax && rpn.data.data.carePlanMin) {
                $scope.carePlanMax = rpn.data.data.carePlanMax / 100;
                $scope.carePlanMin = rpn.data.data.carePlanMin / 100;
            }
        });
    };

    getPriceRange();

    if($stateParams.isEdit=='edit'){
        planSave=JSON.parse(localStorage.getItem('planSave'));
        $scope.formData.title=planSave.title;
        $scope.fontImgUrl=planSave.fontImgUrl;
        $scope.thumPath=planSave.thumPath;
        $scope.formData.selectedDisease=planSave.selectedDisease;
        $scope.formData.planPrice=planSave.planPrice/100;
        $scope.formData.summary=planSave.summary;
        um.setContent(planSave.content?planSave.content:'');
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
                        totalLen+=$scope.formData.title[j].length;
                        cutTitle+=$scope.formData.title[j];
                    }
                }
                $scope.titleLength=$scope.formData.title.length;
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
                        totalLen+=$scope.formData.summary[j].length;
                        cutSummary+=$scope.formData.summary[j];
                    }
                }
                $scope.summaryLength=$scope.formData.summary.length;
                $scope.formData.summary=cutSummary;
            }
            else{
                $scope.summaryLength=0;
            }
        }
    });

    //图片上传
    $scope.$watch('fontImg',function (files) {
        goUpload (files,'fontImg');
    });

    //这边是多文件上传
    function goUpload (files,fileName,certType) {
        if (files != null) {
            var isAllow=false;
            var fileTypes=['jpg','jpeg','png','bmp'];
            fileTypes.forEach(function(item,index,array){
                if(files.name.split('.').slice(-1)[0]==item){
                    isAllow=true;
                }
            });
            if(!isAllow){
                toaster.pop('error',null,'图片类型不支持');
                return;
            }


            if (!angular.isArray(files)) {
                files = [files];
            }
            for (var i = 0; i < files.length; i++) {
                $scope.errorMsg = null;
                (function (f,fileName,certType) {
                    utils.fileCompressToBlob(f,1,1000000,function(blob){
                        upload(blob,fileName,certType);
                    });
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
                path:'care'
            }
        });
        file.upload.success(function (response) {
            if(response.resultCode==1){
                if(response.data.datas[0]){
                    $scope.fontImgUrl=response.data.datas[0].oUrl;
                    $scope.thumPath=response.data.datas[0].tUrl;
                    toaster.pop('success',null,'题图上传成功！');
                }
            }
            else{
                toaster.pop('error',null,'题图上传失败！');
                console.log(response.resultMsg);
            }
        });
        file.upload.error(function (response) {
            console.log(response);
            toaster.pop('error',null,'题图上传失败！');
        });
    };


    //删除题图
    $scope.deleteImg=function(){
        if($scope.fontImgUrl!=null){
            var originUrl = $scope.fontImgUrl;
            var newURL = originUrl.match('^[^#]*?://.*?(/.*)$')[1];
            $http.get(app.url.upload.commonDelFile+'?fileName='+newURL).
                success(function(data, status, headers, config) {
                    if(data.resultCode==1){
                        $scope.fontImg=null;
                        $scope.fontImgUrl=null;
                        toaster.pop('success','',data.resultMsg);
                    }
                    else{
                        toaster.pop('error','',data.resultMsg);
                    }
                }).
                error(function(data, status, headers, config) {
                    toaster.pop('error','',data.resultMsg);
                });
        }
        else{
            toaster.pop('error','','图片为空！');
        }
    };


    //确认编辑
    $scope.saveDoc=function(){
        if(!$scope.formData.title){
            toaster.pop('warn','','请填写标题');
            return;
        }
        if(!$scope.formData.selectedDisease){
            toaster.pop('warn','','请选择病种');
            return;
        }
        if(!$scope.formData.planPrice){
            toaster.pop('warn','','请填写价格');
            return;
        }
        else{
            if($scope.formData.planPrice<$scope.carePlanMin||$scope.formData.planPrice>$scope.carePlanMax){
                toaster.pop('warn','','价格不在价格区间内');
                return;
            }
        }
        if(!$scope.fontImgUrl){
            toaster.pop('warn','','请上传题图');
            return;
        }
        if(!$scope.formData.summary){
            toaster.pop('warn','','请填写摘要');
            return;
        }

        var html = um.getContent();
        console.log(html);
        if(html.length<=0){
            toaster.pop('warn','','请填写正文');
            return;
        }

        planSave.title=$scope.formData.title;
        planSave.fontImgUrl=$scope.fontImgUrl;
        planSave.thumPath=$scope.thumPath;
        planSave.selectedDisease=$scope.formData.selectedDisease;
        planSave.planPrice=$scope.formData.planPrice*100;
        planSave.summary=$scope.formData.summary;
        planSave.content=html;

        localStorage.setItem('planSave',JSON.stringify(planSave));

        if($stateParams.planId){
            $state.go('app.edit_plan',{planId:$stateParams.planId,isEdit:'edit'});
        }
        else{
            $state.go('app.new_plan',{isEdit:'edit'});
        }
    };

    //预览文章，并不保存
    $scope.toPreview=function(){
        if(!$scope.formData.title){
            toaster.pop('warn','','请填写标题');
            return;
        }
        if(!$scope.formData.selectedDisease){
            toaster.pop('warn','','请选择病种');
            return;
        }
        if(!$scope.formData.planPrice){
            toaster.pop('warn','','请填写价格');
            return;
        }
        else{
            if($scope.formData.planPrice<$scope.carePlanMin||$scope.formData.planPrice>$scope.carePlanMax){
                toaster.pop('warn','','价格不在价格区间内');
                return;
            }
        }
        if(!$scope.fontImgUrl){
            toaster.pop('warn','','请上传题图');
            return;
        }
        if(!$scope.formData.summary){
            toaster.pop('warn','','请填写摘要');
            return;
        }

        var html = um.getContent();
        if(html.length<=0){
            toaster.pop('warn','','请填写正文');
            return;
        }

        var article={
            title:$scope.formData.title,
            fontImgUrl:$scope.fontImgUrl,
            thumPath:$scope.thumPath,
            selectedDisease:$scope.formData.selectedDisease,
            planPrice:$scope.formData.planPrice*100,
            summary:$scope.formData.summary,
            content:html,
            time:utils.dateFormat(new Date(),'yyyy-MM-dd')
        };
        var modalInstance = $modal.open({
            templateUrl: 'previewModalContent.html',
            controller: 'previewModalInstanceCtrl',
            windowClass:'carePreview',
            resolve: {
                article: function () {
                    return article;
                }
            }
        });
    };
});

app.controller('previewModalInstanceCtrl', function ($scope, $modalInstance,article,$sce) {
    $scope.article=article;
    $scope.article.content=$sce.trustAsHtml(article.content);
    console.log(article);
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});
