'use strict';
app.controller('factory_drugdetail', function($rootScope, $scope, $state, $stateParams, $http, $compile, utils, modal) {
    $scope.lists = [];
    $scope.a = "";
    //模态框退出
    $scope.cancel = function() {
        $state.go('app.factory_varietylist', {
            'reload': false
        });
        // $rootScope.$emit('lister_factory_table_list');
    };
    var id = $stateParams.id;
    var imgPath = localStorage.getItem('path');
    $scope.tabs = {};
    //根据药品id查询申请认证的药店
    $scope.tabs.getStoreInfo = function() {
        $http.get(app.url.drug_store + "?goods=" + id).
        success(function(data, status, headers, config) {
            //console.log(data.info_list);
            if (data && data.info_list) {
                $scope.list_store = data.info_list;
                for (var i = 0; i < $scope.list_store.length; i++) {
                    $scope.list_store[i].isShow = false;
                    $scope.list_store[i].state_0 = false;
                    $scope.list_store[i].state_9 = false;
                    $scope.list_store[i].state_1 = false;
                }
            } else {
                window.wxc.xcConfirm(data['#message'], window.wxc.xcConfirm.typeEnum.error);
            }
        });
    };

    $scope.request_0 = true;
    $scope.request_1 = false;
    $scope.request_9 = false;
    $scope.getDrugView = function() {
        $http.get(app.url.drug_view + "?id=" + id).
        success(function(data, status, headers, config) {
            if (typeof data["#message"] == "undefined") {
                $scope.obj = data;
                $scope.general_name = data.general_name == '' ? "--" : data.general_name; //药名
                $scope.pack_specification = data.pack_specification == '' || data.pack_specification == null ? "--" : data.pack_specification; //规格
                $scope.specification = data.specification == '' ? "--" : data.specification; //药品类别
                $scope.image = data.image; //药品图片
                $scope.number = data.number == '' ? "--" : data.number; //批准文号
                $scope.general_name = data.general_name == '' ? "--" : data.general_name; //通用名
                $scope.bar_code = data.bar_code == '' || data.bar_code == null ? "--" : data.bar_code; // 条码
                $scope.abbr = data.abbr == '' || null ? "--" : data.abbr; // 助记码
                var text = data.trade_name;
                $scope.trade_name = data.trade_name == '' || null ? "--" : data.trade_name; // 药品商品名
                $scope.codes = data.codes == '' || null ? "--" : data.codes; // 产品识别码
                $scope.manual = data.manual ? data.manual : "--"; // 说明书
                $scope.biz_type = data.biz_type == '' || null ? "--" : data.biz_type.name; // 经营类别
                $scope.use_types = data.use_types ? data.use_types : []; // 使用类别
                $scope.gg_type = typeof data.type == "undefined" ? "--" : data.type.title; // 管理类别
                $scope.indications = data.indications ? data.indications : []; // 适应症
                $scope.manufacturer = typeof data.manufacturer == "undefined" ? "" : data.manufacturer; //生产厂家
                $scope.indicationstext = [];
                $.each($scope.indications, function(index, item) {
                    $scope.indicationstext.push(item.name);
                });
                var use_types = [];
                $.each($scope.use_types, function(index, item) {
                    use_types.push(item.name);
                });
                $scope.use_types = use_types.join("、");
                $scope.indicationstext = $scope.indicationstext.join("、");
                $scope.indicationstext = $scope.indicationstext.length > 0 ? $scope.indicationstext : "--";
                $scope.title = data.type.name == '' || null ? "--" : data.form.name; // 剂型
                $scope.companyname = data.company.name == '' || null ? "--" : data.company.name; // 药厂名称
                $scope.companyid = data.company.id == '' || null ? "--" : data.company.id; // 药厂id
                $scope.id = data.id; // 药品id
                $scope.pack_specification = data.pack_specification == '' || null ? "--" : data.pack_specification; // 包装规格
                $scope.usages = data.usages; //使用方法
                var state_audit = data.state_audit.value;
                if (state_audit == 0) {
                    $scope.request_0 = true;
                    $scope.request_1 = false;
                    $scope.request_9 = false;
                } else if (state_audit == 1) {
                    $scope.request_0 = false;
                    $scope.request_1 = true;
                    $scope.request_9 = false;
                } else {
                    $scope.request_0 = false;
                    $scope.request_1 = false;
                    $scope.request_9 = true;
                }

                $("#storeList").on("mouseenter", ".whenbtns", function() {
                    $(this).siblings(".btns_hover").show();
                }).on("mouseleave", ".btns_hover", function() {
                    $(this).hide();
                });
            } else {
                window.wxc.xcConfirm(data['#message'], window.wxc.xcConfirm.typeEnum.error);
            }

        });
    };

    $scope.getDrugView();

    $scope.opera = function(storeid, type) {
        $scope.drug_request(storeid, type);
    };

    //药品申请认证
    $scope.drug_request = function(store_id, state) {
        $scope.storename = localStorage.getItem('user_name');
        $scope.store_id = localStorage.getItem('store_id');
        $http({
            url: app.url.drug_store_request,
            method: 'post',
            data: {
                goods: $scope.id,
                drug_store: store_id,
                state: state
            }
        }).then(function(resp) {
            if (typeof resp.data["#message"] == "undefined") {
                $scope.tabs.getStoreInfo();
            }
        });
    };
    //改变下拉框查询（店铺关键字+认证状态）
    $scope.change = function(a) {
        var url = app.url.drug_store + "?goods=" + id;
        if ($("#searchText").val().replace(/\s/g, "").length != 0) {
            var keyword1 = "%" + encodeURIComponent($("#searchText").val()) + "%";
            if (keyword1 != "") {
                url += "&drug_store=" + keyword1;
            }
        }
        if (a != "") {
            url += "&state=" + a;
        }
        //app.url.drug_store+"?goods="+id+"&state="+state+"&drug_store="+keyword1
        $http.get(url).success(function(data, status, headers, config) {
            $scope.list_store = data.info_list;
        });
    };
    //提交药品审核去hippo
    $scope.drug_audit = function() {
        $http.get(app.url.drug_store_audit + "?state_audit=1" + "&id=" + id).
        success(function(data, status, headers, config) {
            if (typeof data["#message"] == "undefined") {
                $scope.request_1 = true;
                $scope.request_0 = false;
            }
        });
    }
});
