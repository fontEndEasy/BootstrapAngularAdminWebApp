'use strict';

app.controller('RelationshipEdit', function ($rootScope, $scope, $state, $timeout, $http, utils, modal) {
    var url = app.url.yiliao.getRelationShip,
        container = $('#dialog_container'),
        cnt_list = $('#cnt_list_apportion'),
        dt = null,
        html = $('html'),
        list_wrapper = $('#cnt_list_department'),
        groupId = utils.localData('curGroupId'),
        parentId = null;

    $scope.formData = {};
    $scope.formData.name = $scope.targetDoctorName;

    $scope.hasSuper = true;
    html.css('overflow', 'hidden');

    if (!$scope.groupProfit && $scope.groupProfit !== 0) {
        $scope.formData.groupProfit = 0;
    } else {
        $scope.formData.groupProfit = $scope.groupProfit;
    }
    if (!$scope.superProfit && $scope.superProfit !== 0) {
        $scope.formData.superProfit = 0;
    } else {
        $scope.formData.superProfit = $scope.superProfit;
    }

    if (!$scope.formData.superProfit) {
        $scope.formData.superProfit = 0;
    }

    if ($scope.targetDoctorParentId == 0) {
        $scope.hasSuper = false;
        $scope.formData.superProfit = 0;
    }


    // 初始化通讯录列表
    var contacts = new Tree('cnt_list_relationship', {
        hasCheck: true,
        multiple: false,
        arrType: [0,0],
        data: {
            url: app.url.yiliao.getProfitTree,
            param: {
                access_token: app.url.access_token,
                groupId: groupId
            }
        },
        async: false,
        icons: {
            arrow: 'fa fa-caret-right/fa fa-caret-down',
            check: 'fa fa-check',
            root: 'fa fa-hospital-o tomato',
            branch: 'fa fa-user-md tomato',
            leaf: 'fa fa-user-md tomato'
        },
        info: {
            name: 'name',
            id: 'id',
            pid: 'parentId',
            description: 'description'
        },
        datakey: {
            id: 'id',
            name: 'name',
            sub: 'children'
        },
        events: {
            click: check
        },
        callback: function () {
            var dts = contacts.tree.find('dt');
            var curDt = null;
            for (var i = 0; i < dts.length; i++) {
                if (dts.eq(i).data('info').id === $scope.targetDoctorParentId) {
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
        if ($scope.targetDoctorId == info.id) {
            list_wrapper.html('');
            modal.toast.warn('不能选择自己！');
            contacts.setCheck(info.id);
            return;
        }

        var dts = contacts.tree.find('dt');
        var curDt = null;
        for (var i = 0; i < dts.length; i++) {
            if (dts.eq(i).data('info').id == $scope.targetDoctorId) {
                curDt = dts.eq(i);
                break;
            }
        }
        dts = curDt.parent().children('dd').find('dt');
        for (var i = 0; i < dts.length; i++) {
            if (dts.eq(i).data('info').id == info.id) {
                list_wrapper.html('');
                modal.toast.warn('不能选择自己的下级！');
                contacts.setCheck(info.id);
                $scope.hasSuper = false;
                return;
            }
        }

        var target = $(contacts.getTargets());
        if (target.length === 0) {
            parentId = null;
            list_wrapper.html('');
            return;
        }
        var _info = target.data('info');
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
            $scope.hasSuper = false;
        });
        $scope.hasSuper = true;
    }

    // 执行操作
    $scope.save = function () {
        if ($scope.formData.groupProfit > 100 || $scope.formData.superProfit > 100) {
            modal.toast.warn('抽成比例不能大于100');
            return;
        }
        if (!$scope.formData.superProfit) {
            $scope.formData.superProfit = 0;
        }
        if (!parentId) {
            parentId = 0;
            $scope.formData.superProfit = 0;
        }
        // 设置抽成关系
        var param = {
            access_token: app.url.access_token,
            groupId: groupId,
            parentId: parentId,
            id: $scope.targetDoctorId
        };
        $http({
            url: app.url.yiliao.updateProfitRelation,
            method: 'post',
            data: param
        }).then(function (resp) {
            if (resp.data.resultCode === 1) {
                console.log("设置抽成关系成功！");

                // 修改抽成比例
                param = {
                    access_token: app.url.access_token,
                    groupId: groupId,
                    id: $scope.targetDoctorId,
                    groupProfit: $scope.formData.groupProfit,
                    parentProfit: $scope.formData.superProfit
                };
                $http({
                    url: app.url.yiliao.updateProfit,
                    method: 'post',
                    data: param
                }).then(function (resp) {
                    if (resp.data.resultCode === 1) {
                        console.log("修改抽成比例成功！");
                        $state.go('app.relationship.list', {id: $scope.curDepartmentId}, {reload: true});
                        html.css('overflow', 'auto');
                    } else {
                        modal.toast.warn('修改抽成比例失败！ (' + resp.data.resultMsg + ')');
                    }
                }, function (x) {
                    console.error(x.statusText);
                });
            } else {
                modal.toast.warn('设置抽成关系失败！ (' + resp.data.resultMsg + ')');
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
