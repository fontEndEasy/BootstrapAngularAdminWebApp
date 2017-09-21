'use strict';

app.controller('ContactsAddDoor', function ($rootScope, $scope, $state, $timeout, $http, utils) {
    var url = app.url.yiliao.getAllData,
        container = $('#dialog_container'),
        cnt_list = $('#cnt_list_apportion'),
        dt = null,
        html = $('html'),
        list_wrapper = $('#cnt_list_department'),
        groupId = utils.localData('curGroupId'),
        parentId = null;

    $scope.formData = {};
    html.css('overflow', 'hidden');
    // 执行操作
    $scope.save = function () {
        $http({
            url: app.url.yiliao.saveByDepart,
            method: 'post',
            data: {
                access_token: app.url.access_token,
                name: $scope.formData.name,
                description: $scope.formData.description,
                parentId: parentId,
                groupId: groupId
            }
        }).then(function (resp) {
            if (resp.data.resultCode === 1) {
                console.log("创建成功！");
                $state.go('app.contacts.list', {}, {reload: true});
                html.css('overflow', 'auto');
            } else {
                console.warn("创建失败！");
            }
        }, function (x) {
            console.error(x.statusText);
        });
    };

    //继续添加

    $scope.saveAgain = function () {
        $http({
            url: app.url.yiliao.saveByDepart,
            method: 'post',
            data: {
                access_token: app.url.access_token,
                name: $scope.formData.name,
                description: $scope.formData.description,
                parentId: parentId,
                groupId: groupId
            }
        }).then(function (resp) {
            if (resp.data.resultCode === 1) {
                console.log("创建成功！");
                $state.go('app.contacts.list', {}, {reload: true});
                html.css('overflow', 'auto');
            } else {
                console.warn("创建失败！");
            }
        }, function (x) {
            console.error(x.statusText);
        });
    };

    // 模态框退出
    $scope.cancel = function () {
        container.prev().remove();
        container.remove();
        window.history.back();
        html.css('overflow', 'auto');
    };

});