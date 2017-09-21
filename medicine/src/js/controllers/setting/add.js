'use strict';

app.controller('DataAdd', function ($rootScope, $scope, $state, $timeout, $http, utils) {
    var url = app.url.yiliao.getAllData,
        container = $('#dialog_container'),
        cnt_list = $('#cnt_list_apportion'),
        dt = null,
        html = $('html'),
        list_wrapper = $('#cnt_list_department'),
        groupId = utils.localData('curGroupId'),
        mask = $('<div class="mask"></div>'),
        container = $('#d_container');

    $scope.formData = {};
    html.css('overflow', 'hidden');

    // 初始化通讯录列表
    var contacts = new Tree('data_res', {
        hasCheck: false,
        allCheck: false,
        multiple: true,
        allHaveArr: true,
        modal: true,
        dataUrl: app.url.yiliao.getAllData,
        data: {
            access_token: app.url.access_token,
            groupId: groupId
        },
        async: {
            url: app.url.yiliao.getDepartmentDoctor,
            dataKey: {
                departmentId: 'id'
            },
            data: {
                groupId: groupId,
                status: 'C',
                type: 1
            },
            dataName: ''
        },
        icons: {
            arrow: 'fa fa-caret-right/fa fa-caret-down',
            check: 'fa fa-check',
            root: 'fa fa-hospital-o cfblue',
            branch: 'fa fa-h-square cfblue',
            leaf: 'fa fa-user-md dcolor',
            head: 'headPicFileName'
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
            list_wrapper.html('');
            return;
        }
        var info = target.data('info');
        var span = $('<span class="label-btn btn-info"></span>');
        var i = $('<i class="fa fa-times"></i>');
        list_wrapper.html('');
        list_wrapper.html(span.html(info.name).append(i));
        i.click(function () {
            contacts.setCheck(info.id);
            list_wrapper.html('');
        });
    }

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

    // 模态框退出
    $rootScope.cancel = function () {
        mask.remove();
        container.addClass('none');
        html.css('overflow', 'auto');
    };

});