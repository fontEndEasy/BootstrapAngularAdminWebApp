'use strict';

app.controller('ContactsDelete', function($rootScope, $scope, $state, $timeout, $http, utils, modal) {
  var container = $('#dialog_container');
  $scope.viewData = {};
  $scope.viewData.name = $scope.targetDepartmentName;
  var groupId = utils.localData('store_id');

  //"56d10990b472651e1cfdc819" || 
  var doIt = function(){
    // 删除组织
    $http({
      url: app.url.deleteEnterOrg,
      method: 'post',
      data: {
        access_token: utils.localData('yy_access_token'),
        id: $scope.targetDepartmentId,
        enterpriseId:groupId
      }
    }).then(function(resp){
      if(resp.data.resultCode === 1){
        $state.go('app.drugfactory',{},{reload:true});
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