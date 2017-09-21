'use strict';
app.controller('EditStrategy', function($rootScope, $scope, $state, $http, $stateParams, $compile, utils, modal) {
    $scope.type = $stateParams.type;
    $scope.id = $stateParams.id;
    $scope.statregy_name = '';
    $scope.ydpe = '';
    $scope.dptgf = '';

    if ($scope.type == 'edit') {
        $("#integrat_estre").attr("readonly", true);
    } else {
        $("#integrat_estre").attr("readonly", false);
    }
    //修改推广策略
    $scope.edit_strategy_update = function() {
        var data = {};
        data.name = $scope.statregy_name;
        // data.ydpe = $scope.ydpe;
        data.dptgf = $scope.dptgf;
        data.id = $scope.id;
        $http({
            url: app.url.edit_c_YQTGCL,
            method: 'post',
            data: data
        }).then(function(resp) {
            if (typeof resp.data === "string") {
                var txt = "更新成功";
                window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.success, {
                    onOk: function(v) {
                        $scope.edit_strategy_cancel(false);
                        $rootScope.$emit('lister_strategy_list');
                    }
                });
            } else {
                window.wxc.xcConfirm(resp.data['#message'], window.wxc.xcConfirm.typeEnum.error, {
                    onOk: function(v) {
                        $scope.edit_strategy_cancel(false);
                    }
                });
            }
        });

    };

    //删除推广策略
    $scope.edit_strategy_delete = function() {
        window.wxc.xcConfirm("确定要删除吗？", window.wxc.xcConfirm.typeEnum.confirm, {
            onOk: function(v) {
                $http({
                    url: app.url.delete_c_YQTGCL + "?id=" + $scope.id,
                    method: 'get'
                }).then(function(resp) {
                    if (typeof resp.data === "string") {
                        var txt = "删除成功";
                        window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.success, {
                            onOk: function(v) {
                                $scope.edit_strategy_cancel(false);
                                $rootScope.$emit('lister_strategy_list');
                            }
                        });
                    } else {
                        window.wxc.xcConfirm(resp.data['#message'], window.wxc.xcConfirm.typeEnum.error, {
                            onOk: function(v) {
                                $scope.edit_strategy_cancel(false);
                            }
                        });
                    }
                });
            }
        });


    };

    $scope.edit_strategy_save = function() {
        if ($scope.statregy_name.length == 0 || $scope.statregy_name.replace(/\s/g, "").length == 0) {
            window.wxc.xcConfirm("策略名称不能为空", window.wxc.xcConfirm.typeEnum.error);
            return;
        } else if ($scope.statregy_name == "默认推广策略") {
            window.wxc.xcConfirm("默认推广策略不可添加", window.wxc.xcConfirm.typeEnum.error);
            return;
            // } else if ($scope.ydpe.length == 0 || $scope.ydpe.replace(/\s/g, "").length == 0 || $scope.ydpe * 1 <= 0) {
            //     window.wxc.xcConfirm("药店配额不能为空或小于0", window.wxc.xcConfirm.typeEnum.error);
            //     return;
        } else if ($scope.dptgf.length == 0 || $scope.dptgf.replace(/\s/g, "").length == 0 || $scope.dptgf * 1 <= 0) {
            window.wxc.xcConfirm("单品推广费不能为空或小于0", window.wxc.xcConfirm.typeEnum.error);
            return;
        }
        var data = {};
        data.name = $scope.statregy_name;
        data.ydpe = $scope.ydpe;
        data.dptgf = $scope.dptgf;
        $http({
            url: app.url.create_c_YQTGCL,
            method: 'post',
            data: data
        }).then(function(resp) {
            if (typeof resp.data === "string") {
                var txt = "添加成功";
                window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.success, {
                    onOk: function(v) {
                        $scope.edit_strategy_cancel(false);
                        $rootScope.$emit('lister_strategy_list');
                    }
                });
            } else {
                window.wxc.xcConfirm(resp.data['#message'], window.wxc.xcConfirm.typeEnum.error, {
                    onOk: function(v) {
                        $scope.edit_strategy_cancel(false);
                    }
                });
            }
        });
    };

    $scope.get_strategy_by_id = function(id) {
        $http({
            url: app.url.view_c_YQTGCL + "?id=" + id,
            method: 'get'
        }).then(function(resp) {
            if (typeof resp.data['message'] !== "string") {
                $scope.statregy_name = resp.data['name'];
                $scope.ydpe = resp.data['ydpe'];
                $scope.dptgf = resp.data['dptgf'];
            } else {
                window.wxc.xcConfirm(resp.data['#message'], window.wxc.xcConfirm.typeEnum.error, {
                    onOk: function(v) {
                        $scope.edit_strategy_cancel(false);
                    }
                });
            }
        });
    };
    $scope.get_strategy_by_id($scope.id);
    //模态框退出
    $scope.edit_strategy_cancel = function(flag) {
        flag = flag || false;
        $state.go('app.strategy', {}, {
            'reload': flag
        });
    };

});
