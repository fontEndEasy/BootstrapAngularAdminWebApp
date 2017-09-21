app.controller('capitalpoolController', function($rootScope, $scope, $state, $http, $compile, utils, modal, $timeout) {

    // 资金池总数
    $scope.amountCount = function(capitalPool) {
        var amount = capitalPool.usableMoney;
        for (var i = 0; i < capitalPool.details.pageData.length; i++) {
            amount = amount + capitalPool.details.pageData[i].money;
        }
        return amount;
    };

    // 返回计算总额
    $scope.computeSum = function(arry) {
        var amount = 0;
        for (var i = 0; i < arry.length; i++) {
            amount = amount + arry[i];
        }
        return amount;
    };


    // 资金池列表
    $scope.pageSize = 99999;
    $scope.pageIndex = 1;

    // 换页
    $scope.pageChanged = function() {
        getMoneyList($scope.page, $scope.pageSize);
    };

    // 获取资金池列表数据
    getMoneyList();

    function getMoneyList(page, pageSize) {
        $http({
            url: app.org + 'enterprise/wallet/enterpriseWalletList',
            method: 'post',
            data: {
                access_token: utils.localData('yy_access_token'),
                enterpriseHippoId: app.getUserData().for_api_login.company.id,
                pageSize: pageSize || $scope.pageSize,
                pageIndex: (page || $scope.pageIndex) - 1
            }
        }).then(function(resp) {
            resp = resp.data;
            if (resp.data) {
                $scope.chartData = resp.data.pageData;
                $scope.chartAcoutData = {
                    totalFreezeMoney: resp.data.totalFreezeMoney,
                    totalMoney: resp.data.totalMoney,
                    totalUsableMoney: resp.data.totalUsableMoney
                };
                $scope.page_count = resp.data.pageCount;

                setChart($scope.chartData);
            } else if (resp && resp.detailMsg) {
                window.wxc.xcConfirm(resp.detailMsg, window.wxc.xcConfirm.typeEnum.error);
            } else {
                window.wxc.xcConfirm('获取数据错误', window.wxc.xcConfirm.typeEnum.error);
            }

        });
    };

    // 获取详情
    $scope.getDetails = function(item) {
        if (item.isShowDetails) return;

        $http({
            url: app.org + 'enterprise/wallet/goodsWalletDetail',
            method: 'post',
            data: {
                access_token: utils.localData('yy_access_token'),
                goodsId: item.bizId,
                pageSize: 99999,
                pageIndex: 0
            }
        }).then(function(resp) {
            resp = resp.data;
            item.details = resp.data;
        });
    };

    // 设置图表
    function setChart(chartData) {

        console.log(chartData);

        // var _chartData = [{
        //     "goodsNo": "资金池1",
        //     "money": 30123,
        //     "usableMoney": 6023,
        //     "freezeMoney": 103
        // }, {
        //     "goodsNo": "资金池2",
        //     "money": 303,
        //     "usableMoney": 601,
        //     "freezeMoney": 105
        // }];

        var _chartData = [],
            max = 1;
        $scope.maxWith = chartData.length * 146;

        // 获取最大的资金池金额
        for (var k = 0; k < chartData.length; k++) {
            if (max < chartData[k].money)
                max = chartData[k].money;
        };

        // 生成数据，计算每个资金池于最大资金池金额只差
        for (var i = 0; i < chartData.length; i++) {
            var _this = chartData[i];
            _chartData.push({
                goodsNo: _this.goodsNo,
                money: _this.money,
                usableMoney: _this.usableMoney,
                freezeMoney: _this.freezeMoney,
                spareMoney: max - _this.money
            })
        };

        var chart = AmCharts.makeChart("capitalpool-chartdiv", {
            "theme": "light",
            "type": "serial",
            "depth3D": 100,
            "angle": 30,
            "autoMargins": false,
            "marginBottom": 100,
            "marginLeft": 0,
            "marginRight": 0,
            "dataProvider": _chartData,
            "valueAxes": [{
                "stackType": "100%",
                "gridAlpha": 0,
                "axisAlpha": 0,
                "color": "#ffffff"
            }],
            "graphs": [{
                "lineColor": "#3c3837",
                "fillColors": "#3c3837",
                "fillAlphas": 0.9,
                "valueField": "freezeMoney",
                "type": "column",
                "topRadius": 1,
                "columnWidth": 0.9,
                "showOnAxis": true,
                "lineThickness": 2,
                "lineAlpha": 0.5,
                "balloonFunction": function(graphDataItem, graph) {
                    var value = graphDataItem.dataContext.goodsNo + ' 可用余额:' + graphDataItem.dataContext.usableMoney / 100 + '元'
                    return value;
                }

            }, {
                "lineColor": "#7d9b69",
                "fillColors": "#7d9b69",
                "valueField": "usableMoney",
                "fillAlphas": 0.5,
                "type": "column",
                "topRadius": 1,
                "columnWidth": 0.9,
                "showOnAxis": true,
                "lineThickness": 2,
                "lineAlpha": 0.5,
                "balloonFunction": function(graphDataItem, graph) {
                    var value = graphDataItem.dataContext.goodsNo + ' 可用余额:' + graphDataItem.dataContext.usableMoney / 100 + '元'
                    return value;
                }
            }, {
                "lineColor": "#f3f3f3",
                "fillColors": "#f3f3f3",
                "valueField": "spareMoney",
                "fillAlphas": 0.5,
                "type": "column",
                "topRadius": 1,
                "columnWidth": 0.9,
                "showOnAxis": true,
                "lineThickness": 2,
                "lineAlpha": 0.5,
                "balloonFunction": function(graphDataItem, graph) {
                    var value = graphDataItem.dataContext.goodsNo + ' 可用余额:' + graphDataItem.dataContext.usableMoney / 100 + '元'
                    return value;
                }
            }],

            "categoryField": "goodsNo",
            "categoryAxis": {
                "axisAlpha": 0,
                "labelOffset": 40,
                "gridAlpha": 0,
                "labelFunction": function(valueText, serialDataItem, categoryAxis) {
                    if (valueText.length > 10)
                        return valueText.substring(0, 10) + '...';
                    else
                        return valueText;
                }
            },
            "export": {
                "enabled": true
            }
        });
    };



});
