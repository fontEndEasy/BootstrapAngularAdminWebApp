'use strict';
//充值确认
app.controller('topUpConfirmCtrl', function($rootScope, $scope, $state, $http, $compile, utils, $modal, toaster, $stateParams) {

    getVendors();
    // 获取药厂选项
    function getVendors() {
        $http({
            url: medicineApiRoot + 'api/invoke/' + localStorage.getItem('check_access_token') + '/c_Company.get_drug_ents',
            method: 'get'
        }).then(function(rpn) {
            rpn = rpn.data;
            if (rpn.list_datas) {
                $scope.vendors = rpn.list_datas;
                getDrugs($scope.vendors[0].id);
            }

        });
    };
    // 获取y药品选项
    function getDrugs(companyId) {
        $http({
            url: medicineApiRoot + 'api/invoke/' + localStorage.getItem('check_access_token') + '/c_Goods.select',
            method: 'post',
            data: {
                company: companyId
            }
        }).then(function(rpn) {
            rpn = rpn.data;
            if (rpn.info_list) {
                $scope.drugs = rpn.info_list;
            }
        });
    };
    $scope.getDrugs = getDrugs;


    // 状态选项
    $scope.statusOption = [{
        title: '全部',
        value: ''
    }, {
        title: '待核对',
        value: 1
    }, {
        title: '已核对',
        value: 2
    }, {
        title: '已审核',
        value: 3
    }, {
        title: '已批退',
        value: 6
    }]

    $scope.pageSize = 10;
    $scope.pageIndex = 1;
    $scope._status = '';
    $scope.vendorId = '';
    $scope.drugId = '';

    // 翻页
    $scope.pageChange = function() {
        getWalletRechargeList($scope.pageSize, $scope.pageIndex, $scope.startDate, $scope.endDate, $scope.status, $scope.vendorId, $scope.drugId);
    };

    getWalletRechargeList();
    // 获取列表数据
    function getWalletRechargeList(pageSize, pageIndex, startDate, endDate, status, vendorId, drugId) {

        if (pageSize)
            $scope.pageSize = pageSize;
        if (pageIndex)
            $scope.pageIndex = pageIndex;

        $scope.startDate = startDate;
        if (startDate)
            startDate = moment($scope.startDate).unix() * 1000;

        $scope.endDate = endDate;
        if (endDate)
            endDate = moment($scope.endDate).unix() * 1000;

        $scope.status = status;

        $scope.vendorId = vendorId;

        $scope.drugId = drugId;

        $http({
            url: drugFirmsApiRoot + 'enterprise/wallet/walletRechargeList',
            method: 'post',
            data: {
                access_token: localStorage.getItem('check_access_token'),
                pageSize: $scope.pageSize,
                pageIndex: $scope.pageIndex - 1,
                startDate: startDate || null,
                endDate: endDate || null,
                status: status || null,
                enterpriseHippoId: vendorId,
                goodsHippoId: drugId
            }
        }).then(function(rpn) {
            rpn = rpn.data;
            if (rpn && rpn.resultCode == 1) {
                $scope.walletRechargeList = rpn.data.pageData;
                $scope.page_count = rpn.data.pageCount;
            } else if (rpn && rpn.resultMsg) {
                toaster.pop('error', null, rpn.resultMsg);
            } else {
                toaster.pop('error', null, '获取数据出错');
                console.error(rpn);
            };
        });
    };
    $scope.getWalletRechargeList = getWalletRechargeList;

    // 审核，核对，批退 （2=核对通过，3=审核通过，5=核对不通过，6=审核不通过）
    $scope.walletRechargeApprove = function(id, status, item) {
        if (status == 2) {
            var data = {
                id: id,
                status: status,
                item: item
            }
            $scope.openCheckMoneyDialog(data);
        } else {
            walletRechargeApprove(id, status);
        }

    };

    function walletRechargeApprove(id, status, money) {
        $http({
            url: drugFirmsApiRoot + 'enterprise/wallet/walletRechargeApprove',
            method: 'post',
            data: {
                access_token: localStorage.getItem('check_access_token'),
                id: id,
                status: status,
                money: money * 100
            }
        }).then(function(rpn) {
            rpn = rpn.data;
            if (rpn && rpn.resultCode == 1) {
                getWalletRechargeList($scope.pageSize, $scope.pageIndex, $scope.startDate, $scope.endDate, $scope.status, $scope.vendorId, $scope.drugId)
                toaster.pop('success', null, '操作成功');
            } else if (rpn && rpn.resultMsg) {
                toaster.pop('error', null, rpn.resultMsg);
            } else {
                toaster.pop('error', null, '获取数据出错');
                console.error(rpn);
            };

        });
    };

    // 日历打开关闭
    $scope.open = function($event, typeBtn) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope[typeBtn] = true;
    };

    // 核对金额窗口
    $scope.openCheckMoneyDialog = function(data) {

        var modalInstance = $modal.open({
            templateUrl: 'CheckMoneyDialog.html',
            controller: 'CheckMoneyDialogCtrl',
            size: 'sm',
            resolve: {
                data: function() {
                    var _data = data || {};
                    return _data;
                }
            }
        });

        modalInstance.result.then(function(money) {
            walletRechargeApprove(data.id, data.status, money);
        });

    };

})

// 审核确认弹框
app.controller('CheckMoneyDialogCtrl', function($scope, $modalInstance, data) {

    $scope.money = data.item.money || 0;

    $scope.applyMoney = data.item.applyMoney;

    $scope.ok = function() {
        $modalInstance.close($scope.money);
    };

    $scope.close = function() {
        $modalInstance.dismiss('cancel');
    };
});
