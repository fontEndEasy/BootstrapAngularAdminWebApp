/**
 * Created by clf on 2016/1/14.
 */
app.controller('IntroCtrl', function($scope,$http,$location,$state,$stateParams,toaster) {
    var curGroupId=localStorage.getItem('curGroupId');

    //var isOpenConsult=JSON.parse(localStorage.getItem('openConsultation'));
    //
    //if(isOpenConsult){
    //    $state.go('app.consultation.list');
    //}
    getOpenStatus();
    function getOpenStatus(){
        $http.post(app.url.consult.getOpenConsultation,{
            access_token:app.url.access_token,
            groupId:curGroupId
        }).
        success(function(data, status, headers, config) {
            if(data.resultCode==1){
                if(data.resultCode==1){
                    $state.go('app.consultation.list');
                }
            }
            else{
                console.log(data.resultMsg);
            }
        }).
        error(function(data, status, headers, config) {
            alert(data.resultMsg);
        });
    }

    $scope.open=function(){
        //请求开通服务接口
        $http.post(app.url.consult.openService, {
            access_token:app.url.access_token,
            groupId:curGroupId
        }).
        success(function(data, status, headers, config) {
            if(data.resultCode==1){
                $state.go('app.consultation.list');
            }
            else{
                toaster.pop('error',null,data.resultMsg);
            }
        }).
        error(function(data, status, headers, config) {
            toaster.pop('error',null,data.resultMsg);
        });
    };
});