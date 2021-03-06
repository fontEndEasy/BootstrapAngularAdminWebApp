/**
 * Created by clf on 2015/11/6.
 */
app.controller('ArticleCtrl', function($scope, $timeout,utils,$http,$modal,toaster,$location,$state,$rootScope,$stateParams,$sce) {
    $scope.showTop=false;
    $scope.showQuitTop=false;
    $scope.showEdit=true;
    $scope.showDel=true;
    $scope.isPreview=false;
    //获取文章的数据
    var getArticleData=function(){
        $http.post(app.url.document.getArticleByIdWeb, {
            access_token:app.url.access_token,
            articleId:$stateParams.id,
            createType:1
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

                if(data.data.top){
                    $scope.showTop=false;
                    $scope.showQuitTop=true;
                }
                else{
                    $scope.showTop=true;
                    $scope.showQuitTop=false;
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
        $scope.showEdit=false;
        $scope.showDel=false;
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

    //置顶文章
    $scope.topArticle=function(){
        $http.post(app.url.document.topArticle, {
            access_token:app.url.access_token,
            articleId:$scope.article.id
        }).
        success(function(data, status, headers, config) {
            if(data.resultCode==1){
                if(data.data.status==false){
                    toaster.pop('error','',data.data.msg);
                }
                else{
                    $scope.showTop=false;
                    $scope.showQuitTop=true;
                    window.opener.reflashData();
                    toaster.pop('success','','置顶成功');
                }
            }
            else{
                alert(data.resultMsg);
            }
        }).
        error(function(data, status, headers, config) {
            console.log(data.resultMsg);
        });
    };

    //取消置顶
    $scope.quitTopArticle=function(){
        $http.post(app.url.document.topArticleRemove, {
            access_token:app.url.access_token,
            articleId:$scope.article.id
        }).
        success(function(data, status, headers, config) {
            if(data.resultCode==1){
                if(data.data.status==false){
                    toaster.pop('error','',data.data.msg);
                }
                else{
                    $scope.showTop=true;
                    $scope.showQuitTop=false;
                    window.opener.reflashData();
                    toaster.pop('success','','取消置顶成功');
                }
            }
            else{
                alert(data.resultMsg);
            }
        }).
        error(function(data, status, headers, config) {
                console.log(data.resultMsg);
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