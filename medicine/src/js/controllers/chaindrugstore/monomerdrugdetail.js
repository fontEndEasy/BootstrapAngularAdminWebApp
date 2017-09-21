'use strict';

app.controller('ChainMerDetail', function($rootScope, $scope, $state, $timeout, $http, $stateParams, utils) {
    var url = app.url.employee_view;
    var id = $stateParams.id; //探矿ta
    $scope.isDZ = $stateParams.dz == 1 ? true : false;
    //根据id查询详情信息
    $scope.getMonomerDetail = function() {
        $http.get(url + '?id=' + $stateParams.id)
            .then(function(resp) {
                if (resp && resp.data && !resp.data['#message']) {
                    $scope.name = resp.data.name;
                    $scope.remark = resp.data.remark;
                    $scope.state = resp.data.state.value;
                    if (resp.data.state.value == 0) {
                        $("#yes").attr("checked", "checked");
                        $("#no").removeAttr("checked");
                    } else {
                        $("#yes").removeAttr("checked");
                        $("#no").attr("checked", "true");
                    }
                    $scope.tel = resp.data['user$mobile_phone'];
                } else {
                    window.wxc.xcConfirm(resp.data['#message'], window.wxc.xcConfirm.typeEnum.error);
                    $state.go('app.chaindrugstore', {}, {});
                }
            });
    };


    //修改店员信息
    $scope.update = function() {
        var tel = $scope.tel;
        var name = $scope.name;
        var remark = $scope.remark;
        var radio = $('input[name="bm"]:checked').val();
        if (name == '' || name == null) {
            alert("店员名称不能为空!");
            return;
        }
        if (tel == '') {
            alert("手机号码不能为空！");
            return;
        }
        $http({
            url: app.url.edit_for_company,
            method: 'post',
            data: {
                "name": $scope.name,
                'user$mobile_phone': $scope.tel,
                "roles": 'shop_assistant',
                "id": $stateParams.id,
                "state": radio,
                "remark": $scope.remark
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function(resp) {
            if (typeof resp.data['#message'] == "undefined") {
                window.wxc.xcConfirm("修改成功", window.wxc.xcConfirm.typeEnum.success, {
                    onOk: function(v) {
                        $scope.cancel();
                        $rootScope.$emit('lister_chaindrugstore_list');
                    }
                });
            } else {
                window.wxc.xcConfirm(resp.data['#message'], window.wxc.xcConfirm.typeEnum.warning);
            }
        });
    };

    $scope.getMonomerDetail();
    // 模态框退出
    $scope.cancel = function() {
        $state.go('app.chaindrugstore', {}, {});
    };
});
