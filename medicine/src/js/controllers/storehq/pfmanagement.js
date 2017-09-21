'use strict';
app.controller('pfmanagementController', function($rootScope, $scope, $state, $http, $compile, utils, modal) {
    $scope.pfflag = false;
    //积分兑换报表
    function get_JF_dates_xh(data) {
        $http({
            "method": "post",
            "url": app.url.get_JF_dates_xh,
            "data": data
        }).then(function(resp) {
            $scope.JF_dates_xh_list = resp.data.data;
        });
    }


    $scope.data_list = [{
        "name": "深圳一致药店（龙华店）",
        "ysmoney": "115.500元",
        "dsmoney": "115.50元"
    }, {
        "name": "深圳一致药店（华强北店）",
        "ysmoney": "115.500元",
        "dsmoney": "115.50元"
    }, {
        "name": "深圳一致药店（海岸城店）",
        "ysmoney": "115.500元",
        "dsmoney": "115.50元"
    }, {
        "name": "深圳一致药店（世界之窗店）",
        "ysmoney": "115.500元",
        "dsmoney": "115.50元"
    }, {
        "name": "深圳一致药店（龙城店）",
        "ysmoney": "115.500元",
        "dsmoney": "115.50元"
    }, {
        "name": "深圳一致药店（龙华店）",
        "ysmoney": "115.500元",
        "dsmoney": "115.50元"
    }, {
        "name": "深圳一致药店（龙华店）",
        "ysmoney": "115.500元",
        "dsmoney": "115.50元"
    }, {
        "name": "深圳一致药店（龙华店）",
        "ysmoney": "115.500元",
        "dsmoney": "115.50元"
    }];

    $scope.log_list = [{
        "id": 1,
        "date": "2016-01-27",
        "sdmoney": "678.00元"
    }, {
        "id": 2,
        "date": "2016-01-27",
        "sdmoney": "678.00元"
    }, {
        "id": 3,
        "date": "2016-01-27",
        "sdmoney": "678.00元"
    }, {
        "id": 4,
        "date": "2016-01-27",
        "sdmoney": "678.00元"
    }, {
        "id": 5,
        "date": "2016-01-27",
        "sdmoney": "678.00元"
    }, {
        "id": 6,
        "date": "2016-01-27",
        "sdmoney": "678.00元"
    }, {
        "id": 7,
        "date": "2016-01-27",
        "sdmoney": "678.00元"
    }];

    $scope.inlog = function(_flag) {
        $scope.pfflag = _flag;
    }
});
