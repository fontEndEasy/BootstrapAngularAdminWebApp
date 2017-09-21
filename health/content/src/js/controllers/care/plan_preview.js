'use strict';
//健康关怀列表
app.controller('PlanPreviewCtrl', function($rootScope, $scope, $state, $http, $compile, utils, $modal, toaster, $stateParams) {

    //获取计划详情数据
    $http.post(app.yiliao + 'pack/care/queryCareTemplateDetail', {
        access_token: app.url.access_token,
        templateId: $stateParams.planId
    }).
    then(function(rpn) {
        if (rpn.data.resultCode === 1) {
            $scope.planData = rpn.data.data;
            console.log($scope.planData);
        } else {
            toaster.pop('error', null, '获取失败');
        }
    });

    //tab切换
    $scope.tabNbr = 1;
    $scope.tebChange = function(tabNbr) {
        $scope.tabNbr = tabNbr;
    }

    $scope.editor = function() {
        $state.go('app.new_plan', {
            planId: $stateParams.planId
        });
    }

    $scope.delete = function() {

        $http.post(app.yiliao + 'pack/care/delCareTemplate', {
            access_token: app.url.access_token,
            templateId: $stateParams.planId
        }).
        then(function(rpn) {
            console.log(rpn.data);
            if (rpn.data.resultCode === 1) {
                toaster.pop('success', null, '删除成功');
                $state.go('app.care_plan_list');
            } else {
                toaster.pop('error', null, '删除失败');
            }
        });
    }

    $scope.back = function() {
        $state.go('app.care_plan_list');
    }

})
