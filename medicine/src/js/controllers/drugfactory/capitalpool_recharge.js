app.controller('capitalpoolRechargeController',
    function($rootScope, $scope, $state, $stateParams, $http, $compile, utils, modal, $timeout) {

        if (!$stateParams.id)
            return $state.go('app.capitalpool');

        // var id = $stateParams.id;
        // $scope.outaccountlist = [];
        // $scope.inaccountlist = [];
        // $scope.money = 3689.99;
        // $scope.inbank = "1";
        // $scope.outbank = "2";
        // $scope.inSelectBank = {};
        // $scope.outSelectBank = {};
        // $scope.inbanklist = [{
        //     id: "1",
        //     name: "招商银行",
        //     info: {
        //         zhname: "南山支行",
        //         skhm: "zhangsan",
        //         skaccount: "888 8888 8888 888 881"
        //     }
        // }, {
        //     id: "2",
        //     name: "工商银行",
        //     info: {
        //         zhname: "南山支行",
        //         skhm: "lishi",
        //         skaccount: "888 8888 8888 888 882"
        //     }
        // }, {
        //     id: "3",
        //     name: "建设银行",
        //     info: {
        //         zhname: "南山支行",
        //         skhm: "wangwu",
        //         skaccount: "888 8888 8888 888 883"
        //     }
        // }, {
        //     id: "4",
        //     name: "其他",
        //     info: {
        //         zhname: "",
        //         skhm: "",
        //         skaccount: ""
        //     }
        // }];

        // $scope.outbanklist = [{
        //     id: "1",
        //     name: "招商银行",
        //     info: {
        //         zhname: "南山支行",
        //         skhm: "zhangsan",
        //         skaccount: "888 8888 8888 888 888"
        //     }
        // }, {
        //     id: "2",
        //     name: "工商银行",
        //     info: {
        //         zhname: "南山支行",
        //         skhm: "zhangsan",
        //         skaccount: "888 8888 8888 888 888"
        //     }
        // }, {
        //     id: "3",
        //     name: "建设银行",
        //     info: {
        //         zhname: "南山支行",
        //         skhm: "zhangsan",
        //         skaccount: "888 8888 8888 888 888"
        //     }
        // }, {
        //     id: "4",
        //     name: "其他",
        //     info: {
        //         zhname: "",
        //         skhm: "",
        //         skaccount: ""
        //     }
        // }];


        // $scope.pmenter = function() {
        //     //调用调拨接口
        //     $state.go('app.capitalpool', {}, {});
        // }

        // $scope.changeInBank = function(inbank) {
        //     initSelect(inbank);
        // }

        // $scope.changeOutBank = function(outbank) {
        //     initSelect(outbank);
        // }

        // function initSelect(_id) {
        //     if (typeof _id == "undefined") {
        //         $scope.inbank = $scope.inbanklist[0].id;
        //         $scope.inSelectBank = $scope.inbanklist[0].info;
        //         $scope.outbank = $scope.outbanklist[0].id;
        //         $scope.outSelectBank = $scope.outbanklist[0].info;
        //         $scope.outSelectBank.zzmoney = "";
        //         if ($scope.inbanklist[0].name == "其他") {
        //             $(".inbankinput").prop("readonly", false);
        //         } else {
        //             $(".inbankinput").prop("readonly", true);
        //         }
        //     } else {
        //         $.each($scope.inbanklist, function(index, item) {
        //             if (item.id == _id) {
        //                 if (item.name == "其他") {
        //                     $(".inbankinput").prop("readonly", false);
        //                 } else {
        //                     $(".inbankinput").prop("readonly", true);
        //                 }
        //                 $scope.inSelectBank = item.info;
        //                 return false;
        //             }
        //         });
        //         $.each($scope.outbanklist, function(index, item) {
        //             if (item.id == _id) {
        //                 $scope.outSelectBank = item.info;
        //                 $scope.outSelectBank.zzmoney = "";
        //                 return false;
        //             }
        //         });
        //     }

        // }

        // initSelect();


        // 收款银行
        $scope.collectingCard = {
            name: '招商银行',
            branch: '南山支行',
            accountName: 'zhangsan',
            cardNumber: 88888888888888883
        };

        // 转账信息
        var transferInfo = {
            name: '招商银行',
            branch: '',
            accountName: '',
            cardNumber: '',
            money: ''
        };


        // 获取银行列表
        getBankList();

        function getBankList() {
            $http({
                url: app.org + 'enterprise/wallet/bankMessage',
                method: 'post',
                data: {
                    access_token: utils.localData('yy_access_token')
                }
            }).then(function(resp) {
                resp = resp.data;
                if (resp && resp.resultCode == 1) {
                    $scope.transferBankList = resp.data;
                    $scope.transferInfo = transferInfo;
                } else if (resp && resp.resultMsg) {
                    window.wxc.xcConfirm(resp.resultMsg, window.wxc.xcConfirm.typeEnum.error);
                } else {
                    window.wxc.xcConfirm('获取数据错误', window.wxc.xcConfirm.typeEnum.error);
                }
            });
        };


        // 获取资金池金钱数据
        getGoodsWalletMoney($stateParams.id);

        function getGoodsWalletMoney(goodsId) {
            $http({
                url: app.org + 'enterprise/wallet/goodsWalletMoney',
                method: 'post',
                data: {
                    access_token: utils.localData('yy_access_token'),
                    goodsId: goodsId
                }
            }).then(function(resp) {
                resp = resp.data;
                if (resp && resp.resultCode == 1) {
                    $scope.walletMoney = resp.data;
                } else if (resp && resp.resultMsg) {
                    window.wxc.xcConfirm(resp.resultMsg, window.wxc.xcConfirm.typeEnum.error);
                } else {
                    window.wxc.xcConfirm('获取数据错误', window.wxc.xcConfirm.typeEnum.error);
                }
            });
        };

        // 取消
        $scope.cancel = function() {
            $state.go('app.capitalpool', {}, {});
        };

        // 提交资金申请
        $scope.submitApply = function(transferInfo) {

            if (!transferInfo)
                return window.wxc.xcConfirm('请正确填写信息', window.wxc.xcConfirm.typeEnum.error);
            if (!transferInfo.name)
                return window.wxc.xcConfirm('请正确选择转账银行', window.wxc.xcConfirm.typeEnum.error);
            if (!transferInfo.branch)
                return window.wxc.xcConfirm('请正确选择转账支行', window.wxc.xcConfirm.typeEnum.error);
            if (!transferInfo.accountName)
                return window.wxc.xcConfirm('请正确填写转账户名', window.wxc.xcConfirm.typeEnum.error);
            if (!transferInfo.cardNumber)
                return window.wxc.xcConfirm('请正确选择转账银行卡号', window.wxc.xcConfirm.typeEnum.error);
            if (!transferInfo.money || transferInfo.money < 0)
                return window.wxc.xcConfirm('请正确转账金额', window.wxc.xcConfirm.typeEnum.error);

            $http({
                url: app.org + 'enterprise/wallet/goodsWalletRechargeApply',
                method: 'post',
                data: {
                    access_token: utils.localData('yy_access_token'),
                    goodsId: $stateParams.id,
                    money: transferInfo.money * 100,
                    transferBank: transferInfo.name,
                    transferSubBank: transferInfo.branch,
                    transferAccountNo: transferInfo.cardNumber,
                    transferAccountPerson: transferInfo.accountName,
                    receiveBank: $scope.collectingCard.name
                }
            }).then(function(resp) {
                resp = resp.data;
                if (resp && resp.resultCode == 1) {
                    window.wxc.xcConfirm('申请成功', window.wxc.xcConfirm.typeEnum.success);
                    $state.go('app.capitalpool');
                } else if (resp && resp.resultMsg) {
                    window.wxc.xcConfirm(resp.resultMsg, window.wxc.xcConfirm.typeEnum.error);
                } else {
                    window.wxc.xcConfirm('获取数据错误', window.wxc.xcConfirm.typeEnum.error);
                }
            });
        };


    }
);
