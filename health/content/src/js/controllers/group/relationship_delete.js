'use strict';

app.controller('RelationshipDelete', function($scope, $state, $http, utils, modal) {
  var container = $('#dialog_container'),
      groupId = utils.localData('curGroupId');
  $scope.viewData = {};
  $scope.viewData.name = $scope.targetDoctorName;

  var doIt = function(){
    // 删除组织
    $http({
      url: app.url.yiliao.deleteRelation,
      method: 'post',
      data: {
        access_token: app.url.access_token,
        groupId: groupId,
        id: $scope.targetDoctorId
      }
    }).then(function(resp){
      if(resp.data.resultCode === 1){
        $state.go('app.relationship.list',{},{reload:true});
      }else{
        console.warn("删除失败！");
        modal.toast.error(resp.data.resultMsg);
      }
    }, function(x) {
      console.error(x.statusText);
    });
  };

  // 执行操作
  $scope.do = function(){
    doIt();
  };

  // 模态框退出
  $scope.cancel = function(){
    container.prev().remove();
    container.remove();
    window.history.back();
  }; 

});