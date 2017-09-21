'use strict';

app.controller('changeLeader', function($rootScope, $scope, $state, $http, $compile, $stateParams, utils, modal) {

    //弹框带过来的id 不为空说明是在已有人选里进行选择 反之则是新建店长信息
    var id = $stateParams.id;
    var type = $stateParams.type; //0--选择一个已经存在的店员作为店长 1--新增一条信息作为店长
    $scope.type_1 = type;
    $scope.create = true;
    if (type == 1) {
        $scope.create = false;
    } else {
        $scope.create = true;
    }
    var mask = $('<div class="mask"></div>');
    $scope.remove = function() {
        $(".mask,.modal").hide();
    }
    $scope.remove();

    //根据id查询详情信息
    $scope.getLeaderList = function() {
        $http.get(app.url.select_company_list + '?company=' + $stateParams.id + '&state=0').success(function(data, status, headers, config) {
            if (typeof data["#message"] == "undefined") {
                $scope.list = data.info_list;
                $scope.sub_title = data.sub_title;
            } else {
                window.wxc.xcConfirm(data["#message"], window.wxc.xcConfirm.typeEnum.error);
            }

        });
    };

    $scope.getLeaderList();
    //切换
    $scope.toggle = function(type) {
        if (type == 0) {
            $scope.type_1 = 1;
        } else {
            $scope.type_1 = 0;
        }
        $scope.create = !$scope.create;
    };

    // 模态框退出
    $scope.cancel = function() {
        $state.go('app.storehq', {}, {
            reload: true
        });
    };

    //新增一名店长信息
    $scope.tel = "";
    $scope.name = "";
    //执行操作
    $scope.save = function() {
        var leaderId = $(".radios input[type='radio']:checked").val();
        var tel = $scope.tel;
        var name = $scope.name;
        var types = $scope.type_1;
        var url = '';
        if (types == 0) {
            url = app.url.set_shop_manager_list;

            if (leaderId == null || leaderId == '') {
                var txt = "请选择一名店员作为店长！";
                window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.warning);
                return;
            }
            tel = $(".radios input[type='radio']:checked").attr("data-tel");
            if (tel == '') {
                var txt = "手机号码不能为空！";
                window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.warning);
                return;
            }
        } else {
            url = app.url.set_shop_manager_new;
            if (name == '') {
                var txt = "店员名称不能为空！";
                window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.warning);
                return;
            }
            if (tel == "") {
                var txt = "手机号码不能为空！";
                window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.warning);
                return;
            }
            if (!isPhoneNum(tel)) {
                var txt = "手机号码格式不匹配！";
                window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.warning);
                return;
            }
        }

        var leader_name = "";
        if (name == '' || name == null) {
            leader_name = leaderId;
        } else {
            leader_name = name;
        }

        $http({
            url: url,
            method: 'post',
            data: {
                name_shop_manager: leader_name,
                mobile_phone: tel,
                company: id
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function(resp) {
            if (typeof resp.data["#message"] == "undefined") {
                var txt = "更换店长成功！";
                window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.success, {
                    onOk: function(v) {
                        $scope.cancel();
                        $rootScope.$emit('lister_storehq_list');
                    }
                });
            } else {
                window.wxc.xcConfirm(resp.data["#message"], window.wxc.xcConfirm.typeEnum.error);
            }
        });
    };

    function isPhoneNum(tel) {
        return /^\d{11}$/.test(tel);
    }


});
