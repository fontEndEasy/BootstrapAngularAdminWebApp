'use strict';

app.controller('ContactsListAdd', function ($rootScope, $scope, $state, $timeout, $http, utils) {
    var container = $('#dialog_container');
    $scope.viewData = {};
    $scope.showInfo = true;
    $scope.showWarn = false;

    var doctorId = $scope.doctorInfo.id,
        html = $('html'),
        deptId = $scope.curDepartmentId || utils.localData('curDepartmentId'),
        groupId = $scope.curGroupId || utils.localData('curGroupId');

    if (!doctorId || !deptId) {
        return;
    }

    $scope.viewData.headPicFile = $scope.doctorInfo.headPicFile;
    $scope.viewData.name = $scope.doctorInfo.name || '--';

    var ttl, dpt, hsp;
    // 获取医生职业信息
    $http({
        url: app.url.doctor.getWork,
        method: 'post',
        data: {
            access_token: app.url.access_token,
            userId: doctorId
        }
    }).then(function (resp) {
        if (resp.data.resultCode === 1) {
            var dt = resp.data.data;
            ttl = dt.title || '--';
            dpt = dt.departments || '--';
            hsp = dt.hospital || '--';
            $scope.viewData.info = ttl + ' / ' + dpt + ' / ' + hsp;
        }
    }, function (x) {
        console.error(x.statusText);
    });

    var doIt = function () {

        // 删除医生
        $http({
            url: app.url.yiliao.dimission,
            method: 'post',
            data: {
                access_token: app.url.access_token,
                groupId: groupId,
                doctorId: doctorId,
            }
        }).then(function (resp) {
            if (resp.data.resultCode === 1) {
                $state.go('app.contacts.list', {id: deptId}, {reload: true});
                html.css('overflow', 'auto');
            } else {
                $scope.showInfo = false;
                $scope.showWarn = true;
                $scope.formData.warn_text = resp.data.resultMsg || '操作失败！';
                console.warn((resp.data.resultMsg || '操作失败！') + ' (代码：' + resp.data.resultCode + ')');
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
        //window.history.back();
        $state.go('app.contacts.list.details');
    };

});