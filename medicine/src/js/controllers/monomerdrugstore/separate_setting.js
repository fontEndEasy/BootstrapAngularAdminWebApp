'use strict';

app.controller('MonoSeparateSetting', function($rootScope, $scope, $state, $timeout, $http, utils) {

    // var html = $('html');
    // var logintype = localStorage.getItem('user_type');
    // var store_id = localStorage.getItem("store_id");

    // $scope.total_1 = "0.00";
    // $scope.total_2 = "0.00";
    // $scope.total_3 = "0.00";
    // $scope.total_4 = "0.00";
    // $scope.total_5 = "0.00";
    // $scope.total_6 = "0.00";

    // if (logintype == 'c_MonomerDrugStore') {
    //     $scope.total_2 = 100;
    //     $scope.is_show = true
    // } else {
    //     $scope.is_show = false
    // }

    // $scope.formData = {};
    // html.css('overflow', 'hidden');
    // // 执行操作
    // $scope.save = function() {
    //     var url = "";
    //     var id_ = $scope.id_1;
    //     var data = {};
    //     var flag = $("#flag").val();
    //     var proportion_manager = $scope.total_5; //店长
    //     var proportion_clerk = $scope.total_6; //店员

    //     if (proportion_manager * 1 < 0) {
    //         var txt = "店长抽成数据不能有负数的存在";
    //         window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
    //         return false;
    //     }

    //     if (proportion_clerk * 1 < 0) {
    //         var txt = "店员抽成数据不能有负数的存在";
    //         window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
    //         return false;
    //     }

    //     var all = proportion_manager * 1 + proportion_clerk * 1;
    //     if (typeof id_ != 'undefined') { //修改
    //         url = app.url.update_separte;
    //         data = {
    //             proportion_clerk: proportion_clerk,
    //             proportion_manager: proportion_manager,
    //             proportion_hq: 0,
    //             id: id_,
    //             sales_role: 'shop_assistant'
    //         };
    //     } else { //新建
    //         url = app.url.create;
    //         data = {
    //             proportion_clerk: proportion_clerk,
    //             proportion_manager: proportion_manager,
    //             proportion_hq: 0,
    //             sales_role: 'shop_assistant'
    //         };
    //     }


    //     if (all != 100) {
    //         var txt = "店员分成设置之和必须等于100!";
    //         window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.error);
    //         return false;
    //     }
    //     $http({
    //         url: url,
    //         method: 'post',
    //         data: data
    //     }).then(function(resp) {
    //         if (typeof resp.data["#message"] == "undefined") {
    //             $scope.id_1 = resp.data.replace(/\"/g, "");
    //             var txt = "抽成比例已成功保存";
    //             window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.success);
    //         } else {
    //             window.wxc.xcConfirm(resp.data["#message"], window.wxc.xcConfirm.typeEnum.error);
    //         }
    //     });
    // };

    // //查询该店铺已经存在的分成信息 
    // $scope.getStoreSeparte = function() {
    //     $http.get(app.url.query_separte + "?company=" + store_id).success(function(data, status, headers, config) {
    //         var count = data.total;
    //         $scope.list = data.info_list;
    //         if (count > 0) {
    //             if (logintype == "c_MonomerDrugStore") {
    //                 $scope.total_2 = '100';
    //                 $scope.total_5 = data.info_list[0].proportion_manager;
    //                 $scope.total_6 = data.info_list[0].proportion_clerk;
    //                 $scope.id_1 = data.info_list[0].id;
    //             } else {
    //                 if ("shop_manager" == data.info_list[0].sales_role.value) {
    //                     $scope.total_1 = data.info_list[0].proportion_hq;
    //                     $scope.total_2 = data.info_list[0].proportion_manager;
    //                     $scope.total_3 = data.info_list[0].proportion_clerk;
    //                     $scope.id_1 = data.info_list[0].id;
    //                 } else {
    //                     $scope.total_1 = data.info_list[1].proportion_hq;
    //                     $scope.total_2 = data.info_list[1].proportion_manager;
    //                     $scope.total_3 = data.info_list[1].proportion_clerk;
    //                     $scope.id_1 = data.info_list[1].id;
    //                 }
    //                 if ("shop_assistant" == data.info_list[1].sales_role.value) {
    //                     $scope.total_4 = data.info_list[1].proportion_hq;
    //                     $scope.total_5 = data.info_list[1].proportion_manager;
    //                     $scope.total_6 = data.info_list[1].proportion_clerk;
    //                     $scope.id_2 = data.info_list[1].id;
    //                 } else {
    //                     $scope.total_4 = data.info_list[0].proportion_hq;
    //                     $scope.total_5 = data.info_list[0].proportion_manager;
    //                     $scope.total_6 = data.info_list[0].proportion_clerk;
    //                     $scope.id_2 = data.info_list[0].id;
    //                 }
    //             }
    //             $("#flag").val("1");
    //         }
    //     });
    // };

    // $scope.getStoreSeparte();


    $scope.total_1 = "100";
    $scope.total_2 = "0";
    $scope.total_3 = "100";
    $scope.total_4 = "0";

    var txt_profits_0 = $('#profits_tips_0').html(),
        txt_profits_1 = $('#profits_tips_1').html();

    var profits = ['total_1','total_2','total_3','total_4'];

    function setMonitor(){
        var watch_profit = $scope.$watchGroup(profits, function (newValue, oldValue) {
            var n = 2;
            while (n--) {
                var v_a = newValue[2 * n] * 1,
                    v_b = newValue[2 * n + 1] * 1,
                    profits_tips = $('#profits_tips_' + n);

                if (isNaN(v_a) || isNaN(v_b)) {
                    profits_tips.addClass('text-danger').html('抽成比例必须为纯数字！');
                    break;
                } else {
                    if (v_a > 100 || v_b > 100) {
                        profits_tips.addClass('text-danger').html('单个抽成比例不能大于100%！');
                        break;
                    } else if (v_a < 0 || v_b < 0) {
                        profits_tips.addClass('text-danger').html('单个抽成比例不能小于0！');
                        break;
                    } else {
                        profits_tips.removeClass('text-danger').html(n === 1 ? txt_profits_1 : txt_profits_0);
                        if(oldValue[2 * n] * 1 !== v_a){
                            oldValue[2 * n] = v_a;
                            oldValue[2 * n + 1] = 100 - v_a;
                            $scope[profits[2 * n + 1]] = 100 - v_a;
                        }else{
                            oldValue[2 * n + 1] = v_b;
                            oldValue[2 * n] = 100 - v_b;
                            $scope[profits[2 * n]] = 100 - v_b;
                        }
                    }
                }
            }
        });
    }

    setMonitor();

    getStoreSeparte();

    // 获取抽成比例
    function getStoreSeparte() {
        $http({
            url: app.url.query_separte + "?company=" + localStorage.getItem("store_id"),
            method: 'get'
        }).then(function(resp) {
            resp = resp.data;
            // console.log(resp);
            if (resp.total > 0) {

                var arry = resp.info_list;
                $scope.shop_data = {};
                for (var i = 0; i < arry.length; i++) {
                    $scope.shop_data[arry[i].sales_role.value] = {
                        hq: arry[i].proportion_hq.slice(0, -3),
                        manager: arry[i].proportion_manager.slice(0, -3),
                        clerk: arry[i].proportion_clerk.slice(0, -3),
                        id: arry[i].id
                    }
                }
                if (!$scope.shop_data.shop_manager) {
                    $scope.shop_data.shop_manager = {
                        manager: 100,
                        clerk: 0,
                    }
                }
            }

            $scope.total_1 = $scope.shop_data.shop_manager.manager;
            $scope.total_2 = $scope.shop_data.shop_manager.clerk;
            $scope.total_3 = $scope.shop_data.shop_assistant.manager;
            $scope.total_4 = $scope.shop_data.shop_assistant.clerk;
        });
    };

    // 保存抽成比例
    $scope.saveStoreSeparte = function() {

        var shop_assistant = $scope.shop_data.shop_assistant,
            shop_manager = $scope.shop_data.shop_manager,
            url_a = '',
            url_b = '',
            param_a = null,
            param_b = null;

        //************店长相对于总店分成开始***************//
        var proportion_1 = $scope.total_1; //店长--店长
        var proportion_2 = $scope.total_2; //店长--店员
        //************店长相对于总店分成结束***********//
        //************店员相对于总店分成开始***********//
        var proportion_manager = $scope.total_3; //店长
        var proportion_clerk = $scope.total_4; //店员
        //************店员相对于总店分成结束***********//

        if (proportion_1 * 1 < 0) {

            var txt = "店长生产店长抽成数据不能有负数的存在";
            window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
            return false;
        }
        if (proportion_2 * 1 < 0) {

            var txt = "店长生产店员抽成数据不能有负数的存在";
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
        var all = proportion_manager * 1 + proportion_clerk * 1;
        if (all != 100) {
            var txt = "店员生产分成设置之和必须等于100";
            window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
            return false;
        }

        param_a = {
            proportion_clerk: $scope.total_2,
            proportion_manager: $scope.total_1,
            proportion_hq: 0,
            sales_role: 'shop_manager'
        };

        param_b = {
            proportion_clerk: $scope.total_4,
            proportion_manager: $scope.total_3,
            proportion_hq: 0,
            sales_role: 'shop_assistant'
        };

        //修改
        if (shop_manager.id) {
            url_a = app.url.update_separte;
            param_a.id = shop_manager.id;
        }
        //新建
        else {
            url_a = app.url.create;
        };

        //修改
        if (shop_assistant.id) {
            url_b = app.url.update_separte;
            param_b.id = shop_assistant.id;
        }
        //新建
        else {
            url_b = app.url.create;
        };

        submitStoreSeparte([url_a, url_b], [param_a, param_b]);
    };

    // 提交抽成比例数据
    function submitStoreSeparte(url, param) {
        $http({
            url: url[0],
            method: 'post',
            data: param[0]
        }).then(function(resp) {
            if (typeof resp.data["#message"] == "undefined") {
                $http({
                    url: url[1],
                    method: 'post',
                    data: param[1]
                }).then(function(resp) {
                    if (typeof resp.data["#message"] == "undefined") {
                        window.wxc.xcConfirm("抽成比例已成功保存", window.wxc.xcConfirm.typeEnum.success);
                    } else {
                        window.wxc.xcConfirm(resp.data["#message"], window.wxc.xcConfirm.typeEnum.error);
                    }
                });
            } else {
                window.wxc.xcConfirm(resp.data["#message"], window.wxc.xcConfirm.typeEnum.error);
            }
        });


    };

});
