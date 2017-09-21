/**
 * Created by clf on 2015/11/6.
 */
app.controller('ArticleCtrl', function($scope, $timeout,utils,$http,$modal,toaster,$location,$state,$rootScope,$stateParams,$sce) {
    $scope.showCollect=false;
    $scope.showRCollect=false;
    $scope.showEdit=false;
    $scope.showDel=false;
    $scope.isPreview=false;

    //当前集团id
    var curGroupId=localStorage.getItem('curGroupId');

    //获取文章的数据
    var getArticleData=function(){
        $http.post(app.url.document.getArticleByIdWeb, {
            access_token:app.url.access_token,
            articleId:$stateParams.id,
            createType:2,
            createrId:curGroupId
        }).
        success(function(data, status, headers, config) {
            if(data.resultCode==1){
                $scope.article={
                    id:data.data.id,
                    authorName:data.data.authorName||data.data.author,
                    title:data.data.title,
                    keywords:data.data.tag,
                    copyPath:data.data.copyPath,
                    content:data.data.content,
                    isShow:data.data.isShow,
                    useNum:data.data.useNum,
                    top:data.data.top,
                    description:data.data.description,
                    url:$sce.trustAsResourceUrl(data.data.url+'?'+Date.now())
                };

                if(data.data.collect==2){
                    $scope.showDel=true;
                    $scope.showEdit=true;
                }

                if(data.data.collect==1){
                    if(data.data.groupId==curGroupId){
                        $scope.showDel=true;
                        $scope.showRCollect=false;
                        $scope.showEdit=true;
                    }
                    else{
                        $scope.showDel=false;
                        $scope.showRCollect=true;
                        $scope.showEdit=false;
                    }
                }
                if($scope.article.description.length==100){
                    $scope.article.description=$scope.article.description.substring(0,94)+'......';
                }
                $scope.article.content = $sce.trustAsHtml($scope.article.content);
            }
            else{
                console.log(data.resultMsg);
            }
        }).
        error(function(data, status, headers, config) {
            alert(data.resultMsg);
        });
    };

    if($stateParams.id=='preview'){
        $scope.isPreview=true;
        $scope.article=JSON.parse(localStorage.getItem('articlePreview'));
        $scope.article.content = $sce.trustAsHtml($scope.article.content);
        if($scope.article.description.length==100){
            $scope.article.description=$scope.article.description.substring(0,94)+'......';
        }
    }
    else{
        getArticleData();
    }

    //删除文章
    $scope.deleteArticle=function(){
        var modalInstance = $modal.open({
            templateUrl: 'delModalContent.html',
            controller: 'delModalInstanceCtrl',
            size: 'sm'
        });

        modalInstance.result.then(function (status) {
            if(status=='ok'){
                $http.post(app.url.document.delArticle, {
                    access_token:app.url.access_token,
                    articleId:$stateParams.id
                }).
                    success(function(data, status, headers, config) {
                        if(data.resultCode==1){
                            window.opener.reflashData();
                            window.close();
                        }
                        else{
                            console.log(data.resultMsg);
                        }
                    }).
                    error(function(data, status, headers, config) {
                        alert(data.resultMsg);
                    });
            }
        }, function () {

        });
    };

    //收藏
    $scope.collectArticle=function(){
        $http.post(app.url.document.collectArticle, {
            access_token:app.url.access_token,
            articleId:$stateParams.id,
            createType:2,
            createrId:curGroupId
        }).
        success(function(data, status, headers, config) {
            if(data.resultCode==1){
                if(data.data=="false"){
                    toaster.pop('success','','收藏失败');
                    $scope.showCollect=true;
                    $scope.showRCollect=false;
                }
                else if(data.data=="true"){
                    toaster.pop('success','','收藏成功');
                    window.opener.reflashData();
                    $scope.showCollect=false;
                    $scope.showRCollect=true;
                }
            }
            else{
                console.log(data.resultMsg);
            }
        }).
        error(function(data, status, headers, config) {
            console.log(data.resultMsg);
        });
    };

    //取消收藏
    $scope.removeCollect=function(){
        $http.post(app.url.document.collectArticleRemove, {
            access_token:app.url.access_token,
            articleId:$stateParams.id,
            createType:2,
            createrId:curGroupId
        }).
        success(function(data, status, headers, config) {
            if(data.resultCode==1){
                toaster.pop('success','','取消收藏成功');
                window.opener.reflashData();
                $scope.showCollect=true;
                $scope.showRCollect=false;
            }
            else{
                console.log(data.resultMsg);
            }
        }).
        error(function(data, status, headers, config) {
            alert(data.resultMsg);
        });
    };


    //编辑文章
    $scope.editArticle=function(){
        $state.go('edit_article',{id:$scope.article.id},{'reload':true});
    };
});

app.controller('delModalInstanceCtrl', function ($scope, $modalInstance,toaster,$http,utils) {
    $scope.ok = function() {
        $modalInstance.close('ok');
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});