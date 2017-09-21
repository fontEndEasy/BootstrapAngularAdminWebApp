'use strict';

app.controller('ContactsListApportion', function ($rootScope, $scope, $state, $timeout, $http, utils) {
    var url = app.url.yiliao.getAllData,
        container = $('#dialog_container'),
        data = null,
        cnt_list = $('#cnt_list_apportion'),
        dt = null,
        html = $('html'),
        list_wrapper = $('#cnt_list_wrapper'),
        list_arr = [],
        groupId = utils.localData('curGroupId');

    $scope.viewData = {};
    $scope.formData = {};
    $scope.viewData.headPicFile = $scope.doctorInfo.headPicFile;
    $scope.viewData.name = $scope.doctorInfo.name;
    html.css('overflow', 'hidden');

    list_wrapper.html('');

    // 初始化通讯录列表
    var contacts = new Tree('cnt_list_apportion', {
        hasCheck: false,
        allCheck: false,
        multiple: false,
        allHaveArr: false,
        self: true,
        search: false,
        arrType: [1,1,1,0],
        data: {
            url: url,
            param: {
                access_token: app.url.access_token,
                groupId: groupId
            }
        },
        async: false,
        icons: {
            arrow: 'fa fa-caret-right/fa fa-caret-down',
            check: 'fa fa-check/fa fa-square',
            root: 'fa fa-hospital-o dcolor',
            branch: 'fa fa-h-square dcolor',
            leaf: 'fa fa-user-md dcolor'
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
            var cnt_list = $('#cnt_list_apportion');
        }
    });

    function check(info) {
        var target = $(contacts.getTargets());
        if (target.length === 0) {
            list_wrapper.html('');
            return;
        }
        list_arr = [];    // 修改
        var _infos = target;
        var span = $('<span class="label-btn btn-info"></span>');
        var i = $('<i class="fa fa-times"></i>');
        $scope.formData.id = info.id;
        list_arr.push(info.id);
        list_wrapper.html('');
        list_wrapper.html(span.html(info.name).append(i));
        i.click(function () {
            contacts.setCheck(info.id);
            list_wrapper.html('');
            $scope.formData.id = null;
            list_arr = [];    // 修改
        });
    }

    // 执行操作
    $scope.save = function () {
        $http({
            url: app.url.yiliao.saveDoctor,
            method: 'post',
            data: {
                access_token: app.url.access_token,
                departmentIds: list_arr,
                doctorId: $scope.doctorInfo.id,
                groupId: groupId
            }
        }).then(function (resp) {
            if (resp.data.resultCode === 1) {
                console.log("分配成功！");
                //window.history.back();
                $state.go('app.contacts.list', {id: $scope.curDepartmentId}, {reload: true});
                html.css('overflow', 'auto');
            } else {
                console.warn("分配失败！");
            }
        }, function (x) {
            console.error(x.statusText);
        });
    };

    // 模态框退出
    $scope.cancel = function () {
        container.prev().remove();
        container.remove();
        //$state.go('app.contacts.list');
        $state.go('app.contacts.list', {id: $scope.curDepartmentId}, {reload: false});
        html.css('overflow', 'auto');
    };

});