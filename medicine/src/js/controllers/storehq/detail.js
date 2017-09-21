'use strict';

app.controller('storehqPFDetailController', function ($rootScope, $scope, $state, $timeout, $http,$stateParams, utils) {
    $scope.logdetail_list = [
        {"id":1,"name":"深圳一致药店（龙华店）","sdmoney":"678.00元"},
        {"id":2,"name":"深圳一致药店（龙华店）","sdmoney":"678.00元"},
        {"id":3,"name":"深圳一致药店（龙华店）","sdmoney":"678.00元"},
        {"id":4,"name":"深圳一致药店（龙华店）","sdmoney":"678.00元"},
        {"id":5,"name":"2016-01-27","sdmoney":"678.00元"},
        {"id":6,"name":"2016-01-27","sdmoney":"678.00元"},
        {"id":7,"name":"2016-01-27","sdmoney":"678.00元"}
    ];
	// 模态框退出
	$scope.cancel = function () {
	    $state.go('app.pfmanagement');
	};
});