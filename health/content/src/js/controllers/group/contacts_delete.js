'use strict';

app.controller('ContactsDelete', function ($rootScope, $scope, $state, $timeout, $http, utils, modal) {
    var container = $('#dialog_container');
    $scope.viewData = {};
    $scope.viewData.name = $scope.targetDepartmentName;

    var doIt = function () {
        // 删除组织
        $http({
            url: app.url.yiliao.deleteByDepart,
            method: 'post',
            data: {
                access_token: app.url.access_token,
                ids: $scope.targetDepartmentId
            }
        }).then(function (resp) {
            if (resp.data.resultCode === 1) {
                $state.go('app.contacts.list', {}, {reload: true});
            } else {
                console.warn("删除失败！");
                modal.toast.error(resp.data.resultMsg);
            }
        }, function (x) {
            console.error(x.statusText);
        });
    };

    // 执行操作
    $scope.do = function () {
        doIt();
    };

    // 模态框退出
    $scope.cancel = function () {
        container.prev().remove();
        container.remove();
        window.history.back();
    };

});