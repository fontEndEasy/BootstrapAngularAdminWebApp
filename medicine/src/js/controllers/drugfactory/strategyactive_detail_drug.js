app.controller('drugcodeMarkController', function ($rootScope, $scope, $state, $stateParams, $http, $compile, utils, modal,$timeout) {
  var id = $stateParams.id;
  $scope.drugcodedesc = "";
  $scope.pmenter = function(){
    //调用调拨接口
    var data = {};
    $(".markradio").find("input").each(function(){
      if($(this).prop("checked")){
        data.markType = $(this).val();
      }
    });
    data.drugcodedesc = $scope.drugcodedesc;
    $scope.$emit('lister_stgdetail_callback',data);
  }

  $scope.pmcancel = function(){
    $state.go('app.strategyactivedetail',{id:id},{});
  }

});
