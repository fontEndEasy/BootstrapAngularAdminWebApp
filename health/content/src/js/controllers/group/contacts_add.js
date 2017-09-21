'use strict';

app.controller('ContactsAdd', function ($rootScope, $scope, $state, $timeout, $http, utils, modal) {
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

    // 初始化通讯录列表
    var contacts = new Tree('cnt_list_apportion', {
        hasCheck: true,
        allCheck: false,
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
            leaf: 'fa fa-h-square dcolor'
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
                if (dts.eq(i).data('info').id === $scope.curDepartmentId) {
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
        var target = $(contacts.getTargets());
        if (target.length === 0) {
            parentId = null;
            list_wrapper.html('');
            return;
        }
        var _info = target;
        var span = $('<span class="label-btn btn-info"></span>');
        var i = $('<i class="fa fa-times"></i>');
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
        if(!$scope.formData.name && $scope.formData.name != '0'){
            modal.toast.warn("组织名称不可为空！");
            return;
        }
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