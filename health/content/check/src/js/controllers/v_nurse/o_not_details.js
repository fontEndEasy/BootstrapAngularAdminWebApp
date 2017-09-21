'use strict';

app.controller('ONotDetails', function ($rootScope, $scope, $state, $timeout, $http, utils, $stateParams, modal) {
    var url = app.url.admin.check.getGroupCerts, // 后台API路径
        data = null,
        html = $('html'),
        body = $('body');
    var param = {};
    var id = $stateParams.id;


    $(".bookimgs").on("click","img",function(){
        $(this).siblings().removeClass("select");
        $(this).addClass("select");
    });

    $scope.back = function(){
        window.history.go(-1);
    }
});