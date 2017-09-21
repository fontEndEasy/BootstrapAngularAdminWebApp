app.controller('MsgTplEditCtrl', function($scope, $timeout,utils,$http,$modal,toaster,$state,$stateParams,$sce) {
    $scope.titleLength=0;
    $scope.summaryLength=0;
    $scope.formData={};
    $scope.isSaved=false;
    var isEdit=false;


    $scope.diseaseData=[
        {
            id:'SMS',
            name:'SMS'
        },
        {
            id:'IM',
            name:'IM'
        }
    ];
    $scope.formData.selectedDisease={id:'SMS', name:'SMS'};

    //编辑文章
    if($stateParams.id){
        isEdit=true;
        $http.post(app.url.msg.queryMsgTpl, {
            access_token:app.url.access_token,
            id:$stateParams.id
        }).
            success(function(data, status, headers, config) {
                if(data.resultCode==1){
                    $scope.formData={
                        title:data.data.pageData[0].usage,
                        summary:data.data.pageData[0].content,
                        selectedDisease:{id:data.data.pageData[0].category,name:data.data.pageData[0].category}
                    };
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



    //保存文章
    $scope.saveDoc=function(){

        if(!$scope.formData.title){
            toaster.pop('warn','','请填写描述');
            return;
        }
        if(!$scope.formData.summary){
            toaster.pop('warn','','请填写正文');
            return;
        }
        $scope.isSaved=true;
        if(isEdit==true){
            $http.post(app.url.msg.saveMsgTpl, {
                access_token:app.url.access_token,
                id:$stateParams.id,
                usage:$scope.formData.title,
                category:$scope.formData.selectedDisease.id,
                content:$scope.formData.summary
            }).
                success(function(data, status, headers, config) {
                    if(data.resultCode==1){
                        toaster.pop('success','','保存成功,3秒钟后返回短信模板列表');
                        setTimeout(function(){
                            $state.go('app.message_tpl',{},{reload:true});
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
        else{
            $http.post(app.url.msg.saveMsgTpl, {
                access_token:app.url.access_token,
                id:$stateParams.id,
                usage:$scope.formData.title,
                category:$scope.formData.selectedDisease.id,
                content:$scope.formData.summary
            }).
                success(function(data, status, headers, config) {
                    if(data.resultCode==1){
                        toaster.pop('success','','保存成功,3秒钟后返回短信模板列表');
                        setTimeout(function(){
                            $state.go('app.message_tpl',{},{reload:true});
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

});