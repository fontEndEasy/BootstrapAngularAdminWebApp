'use strict';

app.controller('ChainSeparateSetting', function($rootScope, $scope, $state, $timeout, $http, utils) {

    var html = $('html');
    var logintype = localStorage.getItem('user_type');
    var store_id = localStorage.getItem("store_id");

    if (logintype == 'c_MonomerDrugStore') {
        $scope.total_2 = 100;
        $scope.is_show = true
    } else {
        $scope.is_show = false
    }

    $scope.formData = {};
    html.css('overflow', 'hidden');


    //查询该店铺已经存在的分成信息 
    $scope.getStoreSeparte = function() {
        $http.get(app.url.query_separte + "?company=" + store_id).success(function(data, status, headers, config) {
            if (typeof data["#message"] == "undefined") {
                var count = data.total;
                $scope.list = data.info_list;
                if (count > 0) {
                    if (logintype == "c_MonomerDrugStore") {
                        $scope.total_2 = '100';
                        $scope.total_5 = data.info_list[0].proportion_manager.slice(0, -3);
                        $scope.total_6 = data.info_list[0].proportion_clerk.slice(0, -3);
                        $scope.id_1 = data.info_list[0].id;
                    } else {
                        if ("shop_manager" == data.info_list[0].sales_role.value) {
                            $scope.total_1 = data.info_list[0].proportion_hq.slice(0, -3);
                            $scope.total_2 = data.info_list[0].proportion_manager.slice(0, -3);
                            $scope.total_3 = data.info_list[0].proportion_clerk.slice(0, -3);
                            $scope.id_1 = data.info_list[0].id;
                        } else {
                            $scope.total_1 = data.info_list[1].proportion_hq.slice(0, -3);
                            $scope.total_2 = data.info_list[1].proportion_manager.slice(0, -3);
                            $scope.total_3 = data.info_list[1].proportion_clerk.slice(0, -3);
                            $scope.id_1 = data.info_list[1].id;
                        }
                        if ("shop_assistant" == data.info_list[1].sales_role.value) {
                            $scope.total_4 = data.info_list[1].proportion_hq.slice(0, -3);
                            $scope.total_5 = data.info_list[1].proportion_manager.slice(0, -3);
                            $scope.total_6 = data.info_list[1].proportion_clerk.slice(0, -3);
                            $scope.id_2 = data.info_list[1].id;
                        } else {
                            $scope.total_4 = data.info_list[0].proportion_hq.slice(0, -3);
                            $scope.total_5 = data.info_list[0].proportion_manager.slice(0, -3);
                            $scope.total_6 = data.info_list[0].proportion_clerk.slice(0, -3);
                            $scope.id_2 = data.info_list[0].id;
                        }
                    }
                    $("#flag").val("1");
                }
            } else {
                window.wxc.xcConfirm(data["#message"], window.wxc.xcConfirm.typeEnum.error);
            }

        });
    };

    $scope.getStoreSeparte();
    $scope.total_1 = "100";
    $scope.total_2 = "0";
    $scope.total_3 = "0";
    $scope.total_4 = "100";
    $scope.total_5 = "0";
    $scope.total_6 = "0";

    var txt_profits_0 = $('#profits_tips_0').html(),
        txt_profits_1 = $('#profits_tips_1').html();

    var profits = ['total_1','total_2','total_3','total_4','total_5','total_6'];

    var watch_profit = $scope.$watchGroup(profits, function (newValue, oldValue) {
        var n = 2;
        while (n--) {
            var v_a = newValue[3 * n] * 1,
                v_b = newValue[3 * n + 1] * 1,
                v_c = newValue[3 * n + 2] * 1,
                profits_tips = $('#profits_tips_' + n);

            if (isNaN(v_a) || isNaN(v_b) || isNaN(v_c)) {
                profits_tips.addClass('text-danger').html('抽成比例必须为纯数字！');
                break;
            } else {
                if (v_a > 100 || v_b > 100 || v_c > 100) {
                    profits_tips.addClass('text-danger').html('单个抽成比例不能大于100%！');
                    break;
                } else if (v_a < 0 || v_b < 0 || v_c < 0) {
                    profits_tips.addClass('text-danger').html('单个抽成比例不能小于0！');
                    break;
                } else {
                    if (v_a + v_b + v_c > 100) {
                        profits_tips.addClass('text-danger').html('总店、店长与店员抽成比例之和不能大于100%！');
                        break;
                    } else {
                        profits_tips.removeClass('text-danger').html(n === 1 ? txt_profits_1 : txt_profits_0);

/*                        var total = v_a + v_b + v_c;
                        if(total !== 100){
                            if(oldValue[3 * n] * 1 !== v_a){
                                oldValue[3 * n] = v_a;
                                oldValue[3 * n + 1] = 100 - v_a;
                                $scope[profits[3 * n + 1]] = 100 - v_a;
                            }else{
                                oldValue[3 * n + 1] = v_b;
                                oldValue[3 * n] = 100 - v_b;
                                $scope[profits[3 * n]] = 100 - v_b;
                            }
                        }*/
                    }
                }
            }
        }
    });
    // 执行操作
    $scope.saveManager = function() {
        //************店长相对于总店分成开始***************//
        var proportion_1 = $scope.total_1; //店长--总店，
        var proportion_2 = $scope.total_2; //店长--店长
        var proportion_3 = $scope.total_3; //店长--店员
        //************店长相对于总店分成结束***********//
        //************店员相对于总店分成开始***********//
        var proportion_hq = $scope.total_4; //总店
        var proportion_manager = $scope.total_5; //店长
        var proportion_clerk = $scope.total_6; //店员
        //************店员相对于总店分成结束***********//

        if (proportion_1 * 1 < 0) {

            var txt = "店长生产总店抽成数据不能有负数的存在";
            window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
            return false;
        }
        if (proportion_2 * 1 < 0) {

            var txt = "店长生产店长抽成数据不能有负数的存在";
            window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
            return false;
        }
        if (proportion_3 * 1 < 0) {

            var txt = "店长生产店员抽成数据不能有负数的存在";
            window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
            return false;
        }

        if (proportion_hq * 1 < 0) {

            var txt = "店员生产总店抽成数据不能有负数的存在";
            window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
            return false;
        }
        if (proportion_manager * 1 < 0) {

            var txt = "店员生产店长抽成数据不能有负数的存在";
            window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
            return false;
        }
        if (proportion_clerk * 1 < 0) {

            var txt = "店员生产店员抽成数据不能有负数的存在";
            window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
            return false;
        }
        var total = proportion_1 * 1 + proportion_2 * 1;
        if (total != 100) {
            var txt = "店长生产分成设置之和必须等于100";
            window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
            return false;
        }
        var all = proportion_hq * 1 + proportion_manager * 1 + proportion_clerk * 1;
        if (all != 100) {
            var txt = "店员生产分成设置之和必须等于100";
            window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
            return false;
        }
        var data = {};
        var url = "";
        var id_ = $scope.id_1;
        if (typeof id_ != 'undefined') { //修改
            url = app.url.update_separte;
            data = {
                proportion_hq: proportion_1,
                proportion_manager: proportion_2,
                proportion_clerk: 0,
                id: id_,
                sales_role: 'shop_manager'
            };
        } else { //新建
            url = app.url.create;
            data = {
                proportion_hq: proportion_1,
                proportion_manager: proportion_2,
                proportion_clerk: 0,
                sales_role: 'shop_manager'
            };
        }

        $http({
            url: url,
            method: 'post',
            data: data
        }).then(function(resp) {
            if (typeof resp.data["#message"] == "undefined") {
                $scope.id_1 = resp.data.replace(/\"/g, "");
                //************店员相对于总店分成开始***********//
                var proportion_hq = $scope.total_4; //总店
                var proportion_manager = $scope.total_5; //店长
                var proportion_clerk = $scope.total_6; //店员
                //************店员相对于总店分成结束***********//
                var data = {};
                var url = "";
                var id_ = $scope.id_2;
                if (typeof id_ != 'undefined') { //修改
                    url = app.url.update_separte;
                    data = {
                        proportion_clerk: proportion_clerk,
                        proportion_manager: proportion_manager,
                        proportion_hq: proportion_hq,
                        id: id_,
                        sales_role: 'shop_assistant'
                    };
                } else { //新建
                    url = app.url.create;
                    data = {
                        proportion_clerk: proportion_clerk,
                        proportion_manager: proportion_manager,
                        proportion_hq: proportion_hq,
                        sales_role: 'shop_assistant'
                    };
                }
                $http({
                    url: url,
                    method: 'post',
                    data: data
                }).then(function(resp) {
                    if (resp.data["#message"] != 'undefined') {
                        var txt = "抽成比例已成功保存";
                        $scope.id_2 = resp.data.replace(/\"/g, "");
                        window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.success);
                    } else {
                        var txt = "抽成比例保存失败";
                        window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.error);
                    }
                });
            } else {
                window.wxc.xcConfirm(resp.data["#message"], window.wxc.xcConfirm.typeEnum.error);
            }
        });
    };
});
