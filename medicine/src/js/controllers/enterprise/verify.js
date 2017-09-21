'use strict';

// 公司申请控制器
app.controller('verifyCtrl',['$scope','$http','$state',
  function($scope,$http,$state) {
    var company = JSON.parse(localStorage.getItem('company'));
    console.log(company);
    if(company.checkRemarks){
        $scope.problem = company.checkRemarks;
    }
    $scope.verifyState = company.status;
  }
]);
