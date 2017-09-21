'use strict';
app.controller('LookStrategyactive', function ($rootScope, $scope, $state,$stateParams, $http, $compile, utils, modal) {
    $scope.id = $stateParams.id;
    //模态框退出
    $scope.look_strategyactive_cancel = function () {
        $state.go('app.strategyactive',{},{});
    };  

    $scope.c_YQTGHD_area_date = function(_type){
        var st = (new Date()).format("yyyy-MM-dd");
        console.log($.now()-_type*24*60*60*1000);
        var et = (new Date($.now()-_type*24*60*60*1000)).format("yyyy-MM-dd");
        $http({
            "method": "get",
            "url": app.url.c_YQTGHD_area_date+"?__FILTER__=date%3E="+et+"%26%26date%3C="+st+"%26%26yqtghd_area="+$scope.id+"&__ORDER_BY__=date%20desc"
        }).then(function (resp) {
            $scope.c_YQTGHD_area_date_list = resp.data.info_list;
        });
   }

   $scope.c_YQTGHD_area_date(30);
    
});
