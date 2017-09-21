'use strict';

//集团加入公司控制器
app.controller('joinToCompanyCtrl', 
  function($rootScope, $scope, $state, $timeout, $http, utils) {
  
  	var container = $('#dialog_container');

    // 模态框退出
    $scope.cancel = function(){
      container.prev().remove();
      container.remove();
      window.history.back();
    }; 

    $scope.jionIn = function(){
      $http.post(app.url.yiliao.applyjoinCompany,{
          access_token:app.url.access_token,
          code:$scope.code
      }).
      success(function (data) {
        console.log(data);
        if(data.resultCode===1){
          $scope.success = '加入成功！';
          utils.localData('curGroupEnterpriseName', data.data.company.name);
          $rootScope.rootGroup.enterpriseName = localStorage.getItem('curGroupEnterpriseName');
        }else{
          $scope.authError = (data.resultMsg?data.resultMsg:'加入失败！');
        }
      }).
      error(function(data) {
        $scope.authError = data.resultMsg;
      });
    }

});