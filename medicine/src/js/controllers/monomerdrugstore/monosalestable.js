'use strict';
app.controller('MonoSalestable', function($rootScope, $scope, $state, $http, $compile, utils, modal) {

    // 获取用户数据
    var user = app.getUserData();

    // 获取药品列表数据
    getMedicineList();

    function getMedicineList() {
        $http({
            "method": "get",
            "url": app.urlRoot + 'api/invoke/' + utils.localData('yy_access_token') + '/c_JF_STORE_JOIN.get_goods_toJoin'
        }).then(function(resp) {
            if (resp.data && resp.data) {
                $scope.medicineList = resp.data.data;
                $scope.goodId = $scope.medicineList[0].goods.id;
                getPromotionStoreList($scope.goodId);
                salesMoneyStat($scope.goodId);
            } else {
                window.wxc.xcConfirm('调用接口出错', window.wxc.xcConfirm.typeEnum.error);
            }
        });
    };


    // 销售报表列表
    $scope.pageSize = 1;
    $scope.pageIndex = 1;
    $scope.reportDay = 7;

    $scope.pageChanged = function() {
        getPromotionStoreList($scope.goodId, $scope.pageIndex, $scope.pageSize, $scope.reportDay)
    };

    // 获取销售报表列表数据
    function getPromotionStoreList(goodId, pageIndex, pageSize, reportDay) {

        if (goodId)
            $scope.goodId = goodId;
        if (pageIndex)
            $scope.pageIndex = pageIndex;
        if (pageSize)
            $scope.pageSize = pageSize;
        if (reportDay)
            $scope.reportDay = reportDay

        $http.post(app.org + 'enterprise/promotionActivity/promotionStoreDetail', {
            access_token: utils.localData('yy_access_token'),
            goodsHippoId: goodId || $scope.goodId, //'7b668c2d76f040e29def3210803bea2d',
            storeHippoId: user.user_id, //'a86d811021774b088de5927033852d56',
            pageSize: pageSize || $scope.pageSize || 10,
            pageIndex: (pageIndex || $scope.pageIndex || 1) - 1,
            reportDay: reportDay || $scope.reportDay || null
        }).then(function(rpn) {
            rpn = rpn.data;
            if (rpn && rpn.resultCode == 1) {
                $scope.promotionStoreList = rpn.data.pageData;
                $scope.pageCount = rpn.data.pageCount;
            } else if (rpn && rpn.resultMsg) {
                window.wxc.xcConfirm(rpn.resultMsg, window.wxc.xcConfirm.typeEnum.error);
            } else {
                console.error(rpn);
            };
        });

    };
    $scope.getPromotionStoreList = getPromotionStoreList;


    // 获取销售金额统计
    function salesMoneyStat(goodId) {
        $http.post(app.org + 'enterprise/promotionActivity/promotionStoreStat', {
            access_token: utils.localData('yy_access_token'),
            goodsHippoId: goodId || $scope.goodId, //'7b668c2d76f040e29def3210803bea2d',
            storeHippoId: user.user_id //'a86d811021774b088de5927033852d56',
        }).then(function(rpn) {
            rpn = rpn.data;
            if (rpn && rpn.resultCode == 1) {
                $scope.moneyStat = rpn.data;
            } else if (rpn && rpn.resultMsg) {
                window.wxc.xcConfirm(rpn.resultMsg, window.wxc.xcConfirm.typeEnum.error);
            } else {
                console.error(rpn);
            };
        });
    };


});
