'use strict';
app.controller('StrategyActive', function($rootScope, $scope, $state, $http, $compile, utils, modal) {

    $rootScope.$on('lister_strategyactive_list', function(evet, data) {
        getActivityList($scope.goodId, 10, 1);
    });


    $scope.medicineList = [];
    $scope.activityList = [];
    $scope.goodId = '';
    $scope.money_total = 0;

    getMedicineList();

    function getMedicineList() {
        $http({
            "method": "get",
            "url": app.url.query_for_stack_forDrugFactory
        }).then(function(resp) {
            $scope.medicineList = resp.data.info_list;
            if ($scope.medicineList && $scope.medicineList[0] && $scope.medicineList[0].id)
                $scope.getActivityList($scope.medicineList[0].id);
        });
    };

    $scope.pageIndex = 1;
    $scope.pageSize = 10;

    // 翻页
    $scope.pageChanged = function() {
        getActivityList($scope.goodId, $scope.pageSize, $scope.pageIndex);
    };
    // 获取活动列表数据
    function getActivityList(goodId, pageSize, pageIndex) {

        getAcoutMoney(goodId);

        if (goodId) {
            $scope.goodId = goodId;
        }

        if (pageIndex)
            $scope.pageIndex = pageIndex;

        if (pageSize)
            $scope.pageSize = pageSize;

        $http.post(app.org + 'enterprise/promotionActivity/promotionActivityList', {
            access_token: utils.localData('yy_access_token'),
            goodsHippoId: goodId || $scope.goodId,
            pageSize: pageSize || $scope.pageSize || 10,
            pageIndex: (pageIndex || $scope.pageIndex || 1) - 1
        }).then(function(rpn) {
            rpn = rpn.data;
            if (rpn && rpn.resultCode == 1) {
                $scope.activityList = rpn.data.pageData;
                $scope.pageTotal = rpn.data.total;
            } else if (rpn && rpn.resultMsg) {
                window.wxc.xcConfirm(rpn.resultMsg, window.wxc.xcConfirm.typeEnum.error);
            } else {
                console.error(rpn);
            };
        });
    };
    $scope.getActivityList = getActivityList;


    // 获取活动详情
    $scope.getActivityItemDetails = function(item) {

        if (item.isShowBox)
            return;

        if (!item.promotionHippoId)
            return window.wxc.xcConfirm('活动id不能为空', window.wxc.xcConfirm.typeEnum.error);

        $http.post(app.org + 'enterprise/promotionActivity/promotionActivityDetail', {
            access_token: utils.localData('yy_access_token'),
            promotionHippoId: item.promotionHippoId
        }).then(function(rpn) {
            rpn = rpn.data;
            if (rpn && rpn.resultCode == 1) {
                item.details = rpn.data;
            } else if (rpn && rpn.resultMsg) {
                window.wxc.xcConfirm(rpn.resultMsg, window.wxc.xcConfirm.typeEnum.error);
            } else {
                console.error(rpn);
            };
        });
    };

    // 启动活动
    $scope.promotionStart = function(item) {

        console.log(item);

        if (!item.promotionHippoId)
            return window.wxc.xcConfirm('活动id不能为空', window.wxc.xcConfirm.typeEnum.error);

        $http.post(app.org + 'enterprise/promotionActivity/promotionStart', {
            access_token: utils.localData('yy_access_token'),
            promotionHippoId: item.promotionHippoId
        }).then(function(rpn) {
            rpn = rpn.data;
            if (rpn && rpn.resultCode == 1) {
                getActivityList($scope.goodId);
                window.wxc.xcConfirm('启动成功', window.wxc.xcConfirm.typeEnum.success);
            } else if (rpn && rpn.resultMsg) {
                window.wxc.xcConfirm(rpn.resultMsg, window.wxc.xcConfirm.typeEnum.warning, {
                    okText: '去充值',
                    onOk: function() {
                        $state.go('app.capitalpool.capitalpool_recharge', {
                            id: item.goodsId
                        });
                    }
                });
            } else {
                console.error(rpn);
            };
        });
    };

    // 结束成功
    $scope.promotionStop = function(item) {

        if (!item.promotionHippoId)
            return window.wxc.xcConfirm('活动id不能为空', window.wxc.xcConfirm.typeEnum.error);

        $http.post(app.org + 'enterprise/promotionActivity/promotionEnd', {
            access_token: utils.localData('yy_access_token'),
            promotionHippoId: item.promotionHippoId
        }).then(function(rpn) {
            rpn = rpn.data;
            if (rpn && rpn.resultCode == 1) {
                getActivityList($scope.goodId);
                window.wxc.xcConfirm('结束成功', window.wxc.xcConfirm.typeEnum.success);
            } else if (rpn && rpn.resultMsg) {
                window.wxc.xcConfirm(rpn.resultMsg, window.wxc.xcConfirm.typeEnum.error);
            } else {
                console.error(rpn);
            };
        });
    };


    // 获取推广费余额
    function getAcoutMoney(goodsId) {
        $http.post(app.org + 'enterprise/wallet/goodsWalletMoney', {
            access_token: utils.localData('yy_access_token'),
            goodsHippoId: goodsId
        }).then(function(rpn) {
            rpn = rpn.data;
            if (rpn && rpn.resultCode == 1) {
                if (rpn.data && rpn.data.usableMoney)
                    $scope.money_total = rpn.data.usableMoney / 100;
                else
                    $scope.money_total = 0;
            } else if (rpn && rpn.resultMsg) {
                window.wxc.xcConfirm('获取可用余额出错：' + rpn.resultMsg, window.wxc.xcConfirm.typeEnum.error);
            } else {
                console.error(rpn);
            };
        });
    };





    $(".startegyactive-list").on("click", "a", function(evt) {
        evt = evt || window.event;
        evt.stopPropagation();
    });

    $(".startegyactive-list").on("click", "table a", function(evt) {
        evt = evt || window.event;
        $state.go("app.strategyactive.look_strategyactive", {
            id: '333'
        }, {});
        evt.stopPropagation();
    });

    $scope.look_strategyactive = function(_id) {
        var evt = window.event;
        $state.go("app.strategyactive.look_strategyactive", {
            id: _id
        }, {});
        evt.stopPropagation();
    }

    $scope.edit_strategyactive = function() {
        $state.go("app.strategyactive.edit_strategyactive", {
            type: 'add',
            goods: $scope.goodId,
            id: ""
        }, {});
    }

});
