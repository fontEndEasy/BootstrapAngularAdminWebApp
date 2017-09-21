'use strict';
app.controller('ChainIntegrationTable', function ($rootScope, $scope, $state, $http, $compile, utils, modal) {

    $scope.JF_goods_xh_list = [];
    $scope.dp_goods_id = "";
    $scope.dp_store_id = "all";
    $scope.start_date = "";
    $scope.end_date = "";
    $scope.unit = "";

    //兑换消耗积分中的品种
    function get_JF_goods_xh(){
        $http({
            "method": "get",
            "url": app.url.get_JF_goods_xh
        }).then(function (resp) {
            $scope.JF_goods_xh_list = resp.data.list_datas;
            $.each($scope.JF_goods_xh_list,function(index,item){
                $scope.JF_goods_xh_list[index].id = item.goods.id;
                $scope.JF_goods_xh_list[index].title = item.goods.title;
            })
            if($scope.JF_goods_xh_list.length>0){
                $scope.dp_goods_id = $scope.JF_goods_xh_list[0].goods.id;
                $scope.unit = $scope.JF_goods_xh_list[0]['goods$unit'].name;
            }
        });
    }


    //积分兑换报表
    function get_JF_dates_xh2(data){
        $http({
            "method": "post",
            "url": app.url.get_JF_dates_xh2,
            "data":data
        }).then(function (resp) {
            $scope.JF_dates_xh2_list = resp.data.data;
        });
    }

    get_JF_goods_xh();

    $scope.changeGoods = function(_goods_id){
        $.each($scope.JF_goods_xh_list,function(index,item){
            if(_goods_id == item.id){
                $scope.unit = $scope.JF_goods_xh_list[index]['goods$unit'].name;
                return false;
            }
        });
    }

    //查询
    $scope.searchIntegrationTable = function() {
        var data = {};
        data.goods = $scope.dp_goods_id;
        if($scope.start_date != ""){
            data.str_start = $scope.start_date;
            data.str_end = $scope.end_date;
        }
        get_JF_dates_xh2(data);
    }


     //加载datepickter
    function initStartDate(){
        $('#cintegrationtable_stime').daterangepicker({
            singleDatePicker: true,
            format:"YYYY-MM"
        },
        function(start, end, label) {
            start = start.toISOString().split("T")[0];
            $scope.start_date = start.substring(0,start.lastIndexOf("-"));
            $scope.end_date = "";
            $('#recharge_etime').val("");
            initEndDate($scope.start_date);
        });
    }

    function initEndDate(_minDate){
        if(typeof _minDate != "undefined"){
            $('#cintegrationtable_etime').daterangepicker({
                singleDatePicker: true,
                minDate: _minDate,
                format:"YYYY-MM"
            },
            function(start, end, label) {
                start = start.toISOString().split("T")[0];
                $scope.end_date = start.substring(0,start.lastIndexOf("-"));
            });
        }else{
            $('#cintegrationtable_etime').daterangepicker({
                singleDatePicker: true,
                format:"YYYY-MM"
            },
            function(start, end, label) {
                start = start.toISOString().split("T")[0];
                $scope.end_date = start.substring(0,start.lastIndexOf("-"));
            });
        }
        
    }

    initStartDate();
    initEndDate();

});
