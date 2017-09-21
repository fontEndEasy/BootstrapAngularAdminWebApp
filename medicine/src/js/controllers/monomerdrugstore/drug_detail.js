'use strict';
app.controller('MonoDrugDetail', function($rootScope, $scope, $state, $stateParams, $http, $compile, utils, modal, $sce) {
    $scope.lists = [];
    //模态框退出
    $scope.cancel = function() {
        $('html').css("overflow", "auto");
        $state.go('app.monovarietylist', {}, {
            'reload': false
        });
        $rootScope.$emit('lister_monovarietylist_list');
    };
    $('html').css("overflow", "hidden");
    var id = $stateParams.id;
    var cert_state = $stateParams.state; //认证状态
    var imgPath = localStorage.getItem('path');
    $scope.request_0 = true;
    $scope.request_1 = false;
    $scope.request_9 = false;
    $scope.getDrugView = function() {
        $http.get(app.url.drug_view + "?id=" + id).
        success(function(data, status, headers, config) {
            $scope.obj = data;
            $scope.general_name = data.general_name == '' ? "--" : data.general_name; //药名
            $scope.pack_specification = data.pack_specification == '' || data.pack_specification == null ? "--" : data.pack_specification; //规格
            $scope.specification = data.specification == '' ? "--" : data.specification; //药品类别
            $scope.image = imgPath + data.image; //药品图片
            $scope.number = data.number == '' ? "--" : data.number; //批准文号
            $scope.general_name = data.general_name == '' ? "--" : data.general_name; //通用名
            $scope.bar_code = data.bar_code == '' || data.bar_code == null ? "--" : data.bar_code; // 条码
            $scope.id = data.id; // 药品id
            $scope.abbr = data.abbr == '' || null ? "--" : data.abbr; // 助记码
            var text = data.trade_name;
            $scope.trade_name = data.trade_name == '' || null ? "--" : data.trade_name; // 药品商品名
            $scope.codes = data.codes == '' || null ? "--" : data.codes; // 产品识别码

            $scope.manual = $sce.trustAsHtml(data.manual);

            $scope.company = data.company;
            $scope.type = data.type;

            //$scope.manual = data.manual==''||data.manual==null?"":data.manual;// 说明书
            $scope.biz_type = data.biz_type == '' || null ? "--" : data.biz_type; // 经营类别
            $scope.indications = data.indications == '' || null ? "--" : data.indications; // 适应症
            $scope.indicationstext = [];
            if ($scope.indications == "--" || typeof $scope.indications == "undefined") {
                $scope.indicationstext = "--";
            } else {
                $.each($scope.indications, function(index, item) {
                    $scope.indicationstext.push(item.name);
                });
                $scope.indicationstext = $scope.indicationstext.join("、");
            }


            $scope.title = data.type.name == '' || null ? "--" : data.form.name; // 剂型
            if (data.company == null || typeof data.company == 'undefined') {
                $scope.is_company_show = false;
            } else {
                $scope.is_company_show = true;
            }
            $scope.manufacturer = data.manufacturer == '' || null ? "--" : data.manufacturer; // 药厂名称
            $scope.pack_specification = data.pack_specification == '' || null ? "--" : data.pack_specification; // 包装规格

            $scope.usages = data.usages; //使用方法

            var state_audit = data.state_audit.value;
            console.log(state_audit);
            if (cert_state == 0) {
                $scope.request_0 = true;
                $scope.request_1 = false;
                $scope.request_9 = false;
            } else if (cert_state == 1) {
                $scope.request_0 = false;
                $scope.request_1 = true;
                $scope.request_9 = false;
            } else {
                $scope.request_0 = false;
                $scope.request_1 = false;
                $scope.request_9 = true;
            }
            $scope.companyname = data.company.name == '' || null ? "--" : data.company.name; // 供应商名称
            $scope.companyid = data.company.id == '' || null ? "--" : data.company.id; // 供应商id

        });
    };

    $scope.getDrugView();

    //药品申请认证
    $scope.drug_request = function() {
        $scope.storename = localStorage.getItem('user_name');
        $scope.store_id = localStorage.getItem('store_id');
        $http({
            url: app.url.drug_request,
            method: 'post',
            data: {
                goods: $scope.id
            }
        }).then(function(resp) {
            if (typeof resp.data["#message"] == "undefined") {
                $scope.request_1 = true;
                $scope.request_0 = false;
            } else {
                $scope.request_0 = true;
                $scope.request_1 = false;
            }
        });
    }

});
