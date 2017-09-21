/**
 * Created by clf on 2015/10/16.
 */
'use strict';
var app=angular.module('app',[]);

app.config(function ($httpProvider) {

    //=================================http请求配置========================================
    $httpProvider.defaults.transformRequest = function (obj) {
        var str = [];
        for (var p in obj) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
        return str.join("&");
    }
    $httpProvider.defaults.headers.post = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})

app.controller('PreviewCtrl', function($scope,$http,$sce) {
    $scope.showTop=false;
    $scope.showQuitTop=false;
    var check_access_token=localStorage.getItem('check_access_token');

    $scope.article=JSON.parse(localStorage.getItem('articlePreview'));

    $scope.article.content = $sce.trustAsHtml($scope.article.content);

    if($scope.article.isPlatform){
        $scope.showTop=true;
    }
    else{
        $scope.showTop=false;
    }

    $scope.topArticle=function(){
        $http.post($scope.article.topArticleUrl, {
            access_token:check_access_token,
            articleId:$scope.article.id
        }).
            success(function(data, status, headers, config) {
                if(data.resultCode==1){
                    if(data.data.status==false){
                        alert(data.data.msg);
                    }
                    else{
                        $scope.showTop=false;
                        $scope.showQuitTop=true;
                        alert('置顶成功');
                    }
                }
                else{
                    alert(data.resultMsg);
                }
            }).
            error(function(data, status, headers, config) {
                alert(data.resultMsg);
            });
    };

    $scope.quitTopArticle=function(){
        $http.post($scope.article.topArticleRemoveUrl, {
            access_token:check_access_token,
            articleId:$scope.article.id
        }).
            success(function(data, status, headers, config) {
                if(data.resultCode==1){
                    if(data.data.status==false){
                        alert(data.data.msg);
                    }
                    else{
                        $scope.showTop=true;
                        $scope.showQuitTop=false;
                        alert('取消置顶成功');
                    }
                }
                else{
                    alert(data.resultMsg);
                }
            }).
            error(function(data, status, headers, config) {
                alert(data.resultMsg);
            });
    };


});