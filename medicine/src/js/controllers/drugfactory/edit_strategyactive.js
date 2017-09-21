'use strict';
app.controller('EditStrategyactive', function($rootScope, $scope, $state, $http, $stateParams, $compile, utils, modal) {
    var html = $('html');
    html.css("overflow", "hidden");
    $scope.type = $stateParams.type;
    $scope.id = $stateParams.id;
    $scope.goods = $stateParams.goods;
    console.log("type:" + $scope.type + "   id:" + $scope.id);
    $scope.query_explorer_list = [];
    $scope.start_date = "";
    $scope.end_date = "";

    //查询行政区域
    function c_QYexplorer(_falg) {
        $http({
            "method": "get",
            "url": app.url.query_explorer
        }).then(function(resp) {
            if (typeof resp.data["#message"] == "undefined") {
                $scope.active_addrs = resp.data;
                var tempArr = [];
                $.each($scope.active_addrs, function(i, item) {
                    tempArr.push(item.id);
                });
                if (_falg == 1) {
                    $scope.active_items[0].selectItems = tempArr.slice(0);
                }
                toActiveItems();
                //选中需要设置的操作
                $(".add_strategyactive_items").on("click", "li", function() {
                    $(this).siblings().removeClass("active");
                    $(this).addClass("active");
                    var index = $(this).index();
                    InputSelectItems($scope.active_items[index].selectItems);
                    if (index == 0) {
                        $(".active_addrs_list li input").prop("disabled", true);
                        $(".edit_strategyactive_btn").prop("disabled", true);
                    } else {
                        $(".active_addrs_list li input").prop("disabled", false);
                        $(".edit_strategyactive_btn").prop("disabled", false);
                    }
                });

                $(".active_addrs_list").on("click", "input", function(evt) {
                    evt = evt || window.event;
                    var isActive = $(".add_strategyactive_items").find("li").hasClass("active");
                    if (!isActive) {
                        window.wxc.xcConfirm("请选择一项推广策略", window.wxc.xcConfirm.typeEnum.warning);
                        evt.preventDefault();
                        evt.stopPropagation();
                        return;
                    }
                    var checked = $(this).prop("checked");
                    $(this).find("input").prop("checked", !checked);
                    var nchecked = $(this).prop("checked");
                    var aid = $(this).attr("id");
                    var aindex = $(".add_strategyactive_items").find("li").index($(".add_strategyactive_items").find("li.active"));
                    var temp = $scope.active_items[aindex].selectItems;

                    $.each($scope.active_items, function(i, item) {
                        var bl = false;
                        if (item.selectItems.length > 0) {
                            $.each(item.selectItems, function(j, jitem) {
                                if (aid == "address_" + jitem) {
                                    if (nchecked && i != aindex) {
                                        $scope.active_items[i].selectItems.splice(j, 1);
                                    }
                                    bl = true;
                                    return false;
                                }
                            });
                            if (bl) {
                                return false;
                            }
                        }
                    });

                    if (temp.length > 0) {
                        $.each(temp, function(i, item) {
                            if ("address_" + item == aid) {
                                if (!nchecked) {

                                    $scope.active_items[aindex].selectItems.splice(i, 1);
                                    $scope.active_items[0].selectItems.push(aid.replace("address_", ""));
                                }
                                return false;
                            }
                            if (i == temp.length - 1 && "address_" + item != aid) { //添加
                                $scope.active_items[aindex].selectItems.push(aid.replace("address_", ""));
                            }
                        });
                    } else {
                        $scope.active_items[aindex].selectItems.push(aid.replace("address_", ""));
                    }

                    toActiveItems();
                    $scope.$apply('active_items');
                    $scope.$apply('active_addrs');
                    evt.stopPropagation();
                });

                $(".active_addrs_list").on("click", "li", function(evt) {
                    evt = evt || window.event;
                    if ($(this).find("input").attr("disabled") == "disabled") return;
                    var isActive = $(".add_strategyactive_items").find("li").hasClass("active");
                    if (isActive) {
                        var checked = $(this).find("input").prop("checked");
                        $(this).find("input").prop("checked", !checked);
                        var nchecked = $(this).find("input").prop("checked");
                        var aid = $(this).find("input").attr("id");
                        var aindex = $(".add_strategyactive_items").find("li").index($(".add_strategyactive_items").find("li.active"));
                        var temp = $scope.active_items[aindex].selectItems;

                        $.each($scope.active_items, function(i, item) {
                            var bl = false;
                            if (item.selectItems.length > 0) {
                                $.each(item.selectItems, function(j, jitem) {
                                    if (aid == "address_" + jitem) {
                                        if (nchecked && i != aindex) {
                                            $scope.active_items[i].selectItems.splice(j, 1);
                                        }
                                        bl = true;
                                        return false;
                                    }
                                });
                                if (bl) {
                                    return false;
                                }
                            }
                        });

                        if (temp.length > 0) {
                            $.each(temp, function(i, item) {
                                if ("address_" + item == aid) {
                                    if (!nchecked) {

                                        $scope.active_items[aindex].selectItems.splice(i, 1);
                                        $scope.active_items[0].selectItems.push(aid.replace("address_", ""));
                                    }
                                    return false;
                                }
                                if (i == temp.length - 1 && "address_" + item != aid) { //添加
                                    $scope.active_items[aindex].selectItems.push(aid.replace("address_", ""));
                                }
                            });
                        } else {
                            $scope.active_items[aindex].selectItems.push(aid.replace("address_", ""));
                        }

                        toActiveItems();
                        $scope.$apply('active_items');
                        $scope.$apply('active_addrs');
                    } else {
                        window.wxc.xcConfirm("请选择一项推广策略", window.wxc.xcConfirm.typeEnum.warning);
                    }
                    evt.stopPropagation();
                    evt.preventDefault();
                });
            } else {
                window.wxc.xcConfirm(resp.data['#message'], window.wxc.xcConfirm.typeEnum.error);
            }
        });
    }

    //查询策略列表
    function select_c_YQTGCL() {
        $http({
            "method": "get",
            "url": app.url.select_default_c_YQTGCL
        }).then(function(resp) {
            if (typeof resp.data["#message"] == "undefined") {
                $scope.active_items = [];
                var tmp = {};
                $.each(resp.data.list_datas, function(index, item) {
                    if (item.name == "默认推广策略") {
                        tmp = resp.data.list_datas.splice(index, 1);
                        return false;
                    }
                });
                resp.data.list_datas.unshift(tmp[0])
                $.each(resp.data.list_datas, function(i, item) {
                    item.selectItems = [];
                    $scope.active_items.push(item);
                });

                c_QYexplorer(1);
            } else {
                window.wxc.xcConfirm(resp.data['#message'], window.wxc.xcConfirm.typeEnum.error);
            }
        });
    }

    //查看
    function view_c_YQTGHD(_id) {
        //先查询所有策略推广数据
        $http({
            "method": "get",
            "url": app.url.select_default_c_YQTGCL
        }).then(function(resp) {
            if (typeof resp.data["#message"] == "undefined") {
                var tempItems = resp.data.list_datas;
                $http({
                    "method": "get",
                    "url": app.url.view_c_YQTGHD + "?id=" + _id
                }).then(function(resp) {
                    if (typeof resp.data["#message"] == "undefined") {

                        if ($scope.type != 'copy') {
                            $scope.start_date = resp.data.start_date;
                            $scope.end_date = resp.data.end_date;
                            $('#editstrategyactivet_stime').val(resp.data.start_date);
                            $('#editstrategyactivet_etime').val(resp.data.end_date);
                            $scope.activityPrice = resp.data.money_init - 0;
                        }

                        if (tempItems.length > resp.data.yqtghd_areas_list.length) {
                            $.each(tempItems, function(i, fitems) {
                                var fflag = false;
                                $.each(resp.data.yqtghd_areas_list, function(k, titems) {
                                    if (fitems.id == titems.tgcl.id) {
                                        fflag = true;
                                        return false;
                                    }
                                });
                                if (!fflag) {
                                    resp.data.yqtghd_areas_list.push({
                                        areas: [],
                                        tgcl: {
                                            id: fitems.id,
                                            name: fitems.name
                                        }
                                    });
                                }
                            });
                        }
                        $scope.active_items = [];
                        var tmp = [];
                        $.each(resp.data.yqtghd_areas_list, function(index, item) {
                            if (item.tgcl.name == "默认推广策略") {
                                tmp = resp.data.yqtghd_areas_list.splice(index, 1);
                                return false;
                            }
                        });
                        if (tmp.length > 0) {
                            resp.data.yqtghd_areas_list.unshift(tmp[0])
                            $.each(resp.data.yqtghd_areas_list, function(i, item) {
                                var tempitem = {};
                                tempitem.selectItems = item.areas.slice(0);
                                tempitem.name = item.tgcl.name;
                                if ($scope.type == "copy") {
                                    tempitem.id = item.tgcl.id;
                                } else {
                                    tempitem.tgcl = item.tgcl.id;
                                    if (typeof item.id != "undefined") {
                                        tempitem.id = item.id;
                                    }
                                }

                                $scope.active_items.push(tempitem);
                            });


                            c_QYexplorer();
                        } else {
                            select_c_YQTGCL();
                        }

                    } else {
                        window.wxc.xcConfirm(resp.data['#message'], window.wxc.xcConfirm.typeEnum.error);
                    }
                });
            } else {
                window.wxc.xcConfirm(resp.data['#message'], window.wxc.xcConfirm.typeEnum.error);
            }
        });



    }

    if ($scope.type == "add") {
        select_c_YQTGCL();
    } else {
        view_c_YQTGHD($scope.id);
    }

    //新增积分规则
    $scope.edit_strategyactive_save = function() {
        if ($scope.start_date.length == 0 || $scope.end_date.length == 0 || $scope.end_date.length == 0) {
            window.wxc.xcConfirm('请填写好日期', window.wxc.xcConfirm.typeEnum.error);
            return;
        }
        if (!$scope.activityPrice || $scope.activityPrice < 0) {
            window.wxc.xcConfirm('金额不能少于0', window.wxc.xcConfirm.typeEnum.error);
            return
        }

        var data = {};
        var temp = $scope.active_items.slice(0);
        var tempArr = [];
        $.each(temp, function(i, item) {
            tempArr.push({
                "tgcl": item.id,
                areas: item.selectItems
            });
        });
        $http({
            url: app.url.create_areas_c_YQTGHD,
            method: 'post',
            data: {
                list_datas: 'json:' + JSON.stringify(tempArr),
                start_date: $scope.start_date,
                end_date: $scope.end_date,
                goods: $scope.goods,
                money_init: $scope.activityPrice
            }
        }).then(function(resp) {
            if (typeof resp.data['#message'] == "undefined") {
                var txt = "新增成功！！！";
                window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.success, {
                    onOk: function(v) {
                        $scope.edit_strategyactive_cancel(false);
                        $rootScope.$emit('lister_strategyactive_list');
                    }
                });
            } else {
                window.wxc.xcConfirm(resp.data['#message'], window.wxc.xcConfirm.typeEnum.error);
            }
        });
    };


    // 编辑
    $scope.edit_strategyactive_update = function() {
        if ($scope.start_date.length == 0 || $scope.end_date.length == 0) {
            window.wxc.xcConfirm('请填写好日期', window.wxc.xcConfirm.typeEnum.error);
            return;
        }
        if (!$scope.activityPrice || $scope.activityPrice < 0) {
            window.wxc.xcConfirm('金额不能少于0', window.wxc.xcConfirm.typeEnum.error);
            return;
        }
        var data = {};
        var temp = $scope.active_items.slice(0);
        console.log($scope.active_items);
        var tempArr = [];
        $.each(temp, function(i, item) {
            tempArr.push({
                "id": item.id,
                "tgcl": item.tgcl,
                "areas": item.selectItems
            });
        });
        $http({
            url: app.url.edit_areas_c_YQTGHD,
            method: 'post',
            data: {
                id: $scope.id,
                list_datas: 'json:' + JSON.stringify(tempArr),
                start_date: $scope.start_date,
                end_date: $scope.end_date,
                goods: $scope.goods,
                money_init: $scope.activityPrice
            }
        }).then(function(resp) {
            if (resp.data.is_success == true) {
                var txt = "更新成功";
                window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.success, {
                    onOk: function(v) {
                        $scope.edit_strategyactive_cancel(false);
                        $rootScope.$emit('lister_strategyactive_list');
                    }
                });
            } else {
                window.wxc.xcConfirm(resp.data['#message'], window.wxc.xcConfirm.typeEnum.error);
            }
        });
    };
    //模态框退出
    $scope.edit_strategyactive_cancel = function(flag) {
        flag = flag || false;
        html.css("overflow", "auto");
        $state.go('app.strategyactive', {}, {
            'reload': flag
        });
    };

    //加载datepickter
    function initStartDate() {
        $('#editstrategyactivet_stime').daterangepicker({
                singleDatePicker: true,
                format: "YYYY-MM-DD"
            },
            function(start, end, label) {
                console.log(start.toISOString(), end.toISOString(), label);
                $scope.start_date = start.toISOString().split("T")[0];
                $scope.end_date = "";
                $('#editstrategyactivet_etime').val("");
                initEndDate($scope.start_date);
            });
    }

    function initEndDate(_minDate) {
        if (typeof _minDate != "undefined") {
            $('#editstrategyactivet_etime').daterangepicker({
                    singleDatePicker: true,
                    minDate: _minDate,
                    format: "YYYY-MM-DD"
                },
                function(start, end, label) {
                    $scope.end_date = start.toISOString().split("T")[0];

                });
        } else {
            $('#editstrategyactivet_etime').daterangepicker({
                    singleDatePicker: true,
                    format: "YYYY-MM-DD"
                },
                function(start, end, label) {
                    $scope.end_date = start.toISOString().split("T")[0];

                });
        }

    }

    initStartDate();
    initEndDate()

    $scope.active_items = [{
        "name": "默认推广策略",
        "selectItems": [1, 2, 3, 4, 5, 6, 7, 8, 9]
    }, {
        "name": "华北推广策略",
        "selectItems": []
    }, {
        "name": "茶碱片专用推广策略",
        "selectItems": []
    }, {
        "name": "华南推广策略",
        "selectItems": []
    }, {
        "name": "西藏推广策略",
        "selectItems": []
    }];

    $scope.active_addrs = [{
        "title": "北京",
        "id": 1,
        "to": ""
    }, {
        "title": "天津",
        "id": 2,
        "to": ""
    }, {
        "title": "河北",
        "id": 3,
        "to": ""
    }, {
        "title": "山西",
        "id": 4,
        "to": ""
    }, {
        "title": "内蒙古",
        "id": 5,
        "to": ""
    }, {
        "title": "湖南",
        "id": 6,
        "to": ""
    }, {
        "title": "上海",
        "id": 7,
        "to": ""
    }, {
        "title": "黑龙江",
        "id": 8,
        "to": ""
    }, {
        "title": "广西",
        "id": 9,
        "to": ""
    }];





    function InputSelectItems(ids) {
        var lis = $(".active_addrs_list li");
        lis.find("input").prop("checked", false);
        $.each(ids, function(j, jitem) {
            lis.each(function() {
                if ($(this).find("input").attr("id") == "address_" + jitem) {
                    $(this).find("input").prop("checked", true);
                    return false;
                }
            });
        });
        // toActiveItems();
        // $scope.$apply();
    }

    //地区列表展现所属实现
    function toActiveItems() {
        $.each($scope.active_items, function(i, item) {
            if (item.selectItems.length > 0) {
                $.each(item.selectItems, function(j, jitem) {
                    $.each($scope.active_addrs, function(k, kitem) {
                        if (kitem.id == jitem) {
                            $scope.active_addrs[k]['to'] = item.name;
                            return false;
                        }
                    });
                });
            }
        });
    }


});
