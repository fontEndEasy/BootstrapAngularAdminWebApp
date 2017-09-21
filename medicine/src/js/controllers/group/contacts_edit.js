'use strict';

app.controller('ContactsEdit', function ($rootScope, $scope, $state, $timeout, $http, utils, modal) {
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

    $scope.formData.name = $scope.targetDepartmentName;
    $scope.formData.description = $scope.targetDepartmentDescription;

    // 初始化通讯录列表
    var contacts = new Tree('cnt_list_apportion', {
        hasCheck: true,
        multiple: false,
        self: true,
        arrType: [1,1,0],
        data: {
            url: url,
            param: {
                access_token: app.url.access_token,
                groupId: groupId
            }
        },
        icons: {
            arrow: 'fa fa-caret-right/fa fa-caret-down',
            check: 'fa fa-check',
            root: 'fa fa-hospital-o dcolor',
            branch: 'fa fa-h-square dcolor',
            leaf: 'fa fa-user-md dcolor'
        },
        root: {
            selectable: true,
            name: utils.localData('curGroupName'),
            id: 0
        },
        datakey: {
            id: 'id',
            name: 'name',
            sub: 'subList'
        },
        info: {
            name: 'name',
            id: 'id',
            pid: 'parentId',
            description: 'description'
        },
        events: {
            click: check
        },
        callback: function () {
            var dts = contacts.tree.find('dt');
            var curDt = null;
            for (var i = 0; i < dts.length; i++) {
                if (dts.eq(i).data('info').id == $scope.targetDepartmentParentId) {
                    curDt = dts.eq(i);
                    break;
                }
            }
            if (curDt) {
                curDt.trigger('click');
            }
        }
    });

    function check(info) {
        if ($scope.targetDepartmentId === info.id) {
            list_wrapper.html('');
            modal.toast.warn('不能选择自己！');
            contacts.setCheck(info.id);
            return;
        }

        var dts = contacts.tree.find('dt');
        var curDt = null;
        for (var i = 0; i < dts.length; i++) {
            if (dts.eq(i).data('info').id === $scope.targetDepartmentId) {
                curDt = dts.eq(i);
                break;
            }
        }
        dts = curDt.parent().children('dd').find('dt');
        for (var i = 0; i < dts.length; i++) {
            if (dts.eq(i).data('info').id === info.id) {
                list_wrapper.html('');
                modal.toast.warn('不能选择自己的下级！');
                contacts.setCheck(info.id);
                return;
            }
        }

        var target = $(contacts.getTargets());
        if (target.length === 0) {
            parentId = null;
            list_wrapper.html('');
            return;
        }
        var _info = target;
        var span = $('<span class="label-btn btn-info"></span>');
        var i = $('<i class="fa fa-times"></i>');
        //$scope.formData.id = info.id;
        parentId = info.id;
        list_wrapper.html('');
        list_wrapper.html(span.html(info.name).append(i));
        i.click(function () {
            contacts.setCheck(info.id);
            list_wrapper.html('');
            parentId = null;
        });
    }

    // 执行操作
    $scope.save = function () {
        var param = {
            access_token: app.url.access_token,
            name: $scope.formData.name,
            description: $scope.formData.description,
            id: $scope.targetDepartmentId
        };
        if (parentId) {
            param.parentId = parentId;
        }
        $http({
            url: app.url.yiliao.updateByDepart,
            method: 'post',
            data: param
        }).then(function (resp) {
            if (resp.data.resultCode === 1) {
                console.log("编辑成功！");
                $state.go('app.contacts.list', {id: $scope.curDepartmentId}, {reload: true});
                html.css('overflow', 'auto');
            } else {
                console.warn("编辑失败！");
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
        //$state.go('app.contacts.list');
        html.css('overflow', 'auto');
    };

});

//55da83c64203f36ccd87e091
//55da83c64203f36ccd87e091