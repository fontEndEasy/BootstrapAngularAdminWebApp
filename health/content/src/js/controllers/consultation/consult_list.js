/**
 * Created by clf on 2016/1/14.
 */
app.controller('ConsultListCtrl', function($scope,utils,$http,$modal,toaster,$location,$state,$rootScope,$stateParams) {
    var curGroupId=utils.localData('curGroupId');


    getOpenStatus();
    function getOpenStatus(){
        $http.post(app.url.consult.getOpenConsultation,{
            access_token:app.url.access_token,
            groupId:curGroupId
        }).
            success(function(data, status, headers, config) {
                if(data.resultCode==1){
                    if(data.resultCode!=1){
                        $state.go('app.consultation.introduce');
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

    getPackList();

    function getPackList(){
        $http.post(app.url.consult.getPackList, {
            access_token:app.url.access_token,
            groupId:curGroupId,
            pageIndex:0,
            pageSize:1000
        }).
        success(function(data, status, headers, config) {
            if(data.resultCode==1){
                $scope.data=data.data.pageData;
            }
            else{
                toaster.pop('error',null,data.resultMsg);
            }
        }).
        error(function(data, status, headers, config) {
            toaster.pop('error',null,data.resultMsg);
        });
    }



    $scope.deletePack=function(_id){
        var modalInstance = $modal.open({
            templateUrl: 'delModalContent.html',
            controller: 'delModalInstanceCtrl',
            size: 'sm'
        });

        modalInstance.result.then(function (status) {
            if(status=='ok'){
                $http.post(app.url.consult.delPack, {
                    access_token:app.url.access_token,
                    consultationPackId:_id
                }).
                success(function(data, status, headers, config) {
                    if(data.resultCode==1){
                        toaster.pop('success',null,'删除成功');
                        getPackList();
                    }
                    else{
                        toaster.pop('error',null,data.resultMsg||'当前会诊包中有医生');
                    }
                }).
                error(function(data, status, headers, config) {
                    toaster.pop('error',null,data.resultMsg);
                });
            }
        }, function () {

        });
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