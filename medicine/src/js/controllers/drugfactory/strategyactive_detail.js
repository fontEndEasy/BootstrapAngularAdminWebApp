'use strict';
app.controller('IntegrationTableDetailController', function($rootScope, $scope, $stateParams, $state, $http, $compile, utils, modal) {

    //加载datepickter
    initStartDate();

    function initStartDate() {
        $('#integrationtabledetail_stime').daterangepicker({
                singleDatePicker: true,
                format: "YYYY-MM-DD"
            },
            function(start, end, label) {
                $scope.start_date = start.toISOString().split("T")[0];
                $scope.end_date = "";
                $('#integrationtabledetail_etime').val("");
                initEndDate($scope.start_date);
            });
    }
    initEndDate();

    function initEndDate(_minDate) {
        if (typeof _minDate != "undefined") {
            $('#integrationtabledetail_etime').daterangepicker({
                    singleDatePicker: true,
                    minDate: _minDate,
                    format: "YYYY-MM-DD"
                },
                function(start, end, label) {
                    $scope.end_date = start.toISOString().split("T")[0];

                });
        } else {
            $('#integrationtabledetail_etime').daterangepicker({
                    singleDatePicker: true,
                    format: "YYYY-MM-DD"
                },
                function(start, end, label) {
                    $scope.end_date = start.toISOString().split("T")[0];

                });
        }

    }

    $scope.goodsHippoId = $stateParams.id;
    $scope.pageSize = 10;
    $scope.pageIndex = 1;


    // 翻页
    $scope.pageChanged = function() {
        getPromotionDetails($scope.pageSize, $scope.pageIndex);
    };

    // 获取审核明细列表数据
    getPromotionDetails();

    function getPromotionDetails(pageSize, pageIndex, startDate, endDate) {

        if (pageSize)
            $scope.pageSize = pageSize;
        if (pageIndex)
            $scope.pageIndex = pageIndex;

        $http.post(app.org + 'enterprise/promotionActivity/promotionItemList', {
            access_token: utils.localData('yy_access_token'),
            promotionHippoId: $scope.goodsHippoId,
            pageSize: pageSize || $scope.pageSize || 10,
            pageIndex: (pageIndex || $scope.pageIndex || 1) - 1,
            storeName: $scope.storeName || '',
            startDate: startDate || $scope.startDate || '',
            endDate: endDate || $scope.endDate || ''
        }).then(function(rpn) {
            rpn = rpn.data;
            if (rpn && rpn.resultCode == 1) {
                $scope.promotionDetails = rpn.data.pageData;
                $scope.pageCount = rpn.data.pageCount;
            } else if (rpn && rpn.resultMsg) {
                window.wxc.xcConfirm(rpn.resultMsg, window.wxc.xcConfirm.typeEnum.error);
            } else {
                console.error(rpn);
            };
        });
    };
    $scope.getPromotionDetails = getPromotionDetails;

    // 合计
    $scope.sumIncome = function(promotionDetails) {
        var sum = 0;
        for (var i = 0; i < promotionDetails.length; i++) {
            if (promotionDetails[i].isCheck)
                sum = sum + promotionDetails[i].income
        }
        return sum;
    };


    // 搜索
    $scope.search = function() {

        if (($scope.start_date && !$scope.end_date) || (!$scope.start_date && $scope.end_date))
            return window.wxc.xcConfirm('请正确选择过滤时间', window.wxc.xcConfirm.typeEnum.error);

        if ($scope.start_date && $scope.end_date) {
            $scope.startDate = moment($scope.start_date).unix() * 1000;
            $scope.endDate = moment($scope.end_date).unix() * 1000;
        }

        getPromotionDetails(null, 1);
    };

    // 获取活动资金详情
    getActivityItemDetails();

    function getActivityItemDetails() {

        $http.post(app.org + 'enterprise/promotionActivity/promotionActivityMoneyStat', {
            access_token: utils.localData('yy_access_token'),
            promotionHippoId: $scope.goodsHippoId
        }).then(function(rpn) {
            rpn = rpn.data;
            if (rpn && rpn.resultCode == 1) {
                $scope.storeMoney = rpn.data;
            } else if (rpn && rpn.resultMsg) {
                window.wxc.xcConfirm(rpn.resultMsg, window.wxc.xcConfirm.typeEnum.error);
            } else {
                console.error(rpn);
            };
        });

    };

    // 全选
    $scope.checkAll = function() {

        var isCheck = false;

        if ($scope.isCheckAll)
            isCheck = true;
        else
            isCheck = false;

        angular.forEach($scope.promotionDetails, function(file) {
            file.isCheck = isCheck;
        })

    };

    // 单选
    $scope.checkOne = function() {
        for (var i = 0; i < $scope.promotionDetails.length; i++) {

            // 只有一个
            if ($scope.promotionDetails.length == 1) {
                if ($scope.promotionDetails[i].isCheck) {
                    $scope.isCheckAll = true;
                } else {
                    $scope.isCheckAll = false;
                }
                break;
            }

            if (!$scope.promotionDetails[i].isCheck) {
                $scope.isCheckAll = false;
                break;
            }

            // 最后一个
            if (i == $scope.promotionDetails.length - 1) {
                if ($scope.promotionDetails[i].isCheck)
                    $scope.isCheckAll = true;
                break;
            }
        }
    };


    $scope.auditPromoteCheck = 9;

    // 批量审核
    $scope.auditPromote = function() {

        var itemIds = [];

        var arry = angular.copy($scope.promotionDetails);

        for (var i = 0; i < arry.length; i++) {
            if (arry[i].isCheck)
                itemIds.push(arry[i].itemHippoId);
        };

        if (itemIds.length < 1) {
            $scope.templateBox = false;
            return window.wxc.xcConfirm('未勾选任何数据', window.wxc.xcConfirm.typeEnum.info);
        }

        $scope.templateBox = false;
        $http.post(app.org + 'enterprise/promotionActivity/promotionItemApprove', {
            access_token: utils.localData('yy_access_token'),
            itemIds: itemIds,
            approveStatus: $scope.auditPromoteCheck
        }).then(function(rpn) {
            rpn = rpn.data;
            if (rpn && rpn.resultCode == 1) {
                window.wxc.xcConfirm('审核成功', window.wxc.xcConfirm.typeEnum.error);
                getPromotionDetails();
            } else if (rpn && rpn.resultMsg) {
                window.wxc.xcConfirm(rpn.resultMsg, window.wxc.xcConfirm.typeEnum.error);
            } else {
                console.error(rpn);
            };
        });

    };

});
