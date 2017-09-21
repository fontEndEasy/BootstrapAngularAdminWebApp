'use strict';
app.controller('Integration', function($rootScope, $scope, $state, $http, $compile, utils, modal) {
    // 初始化表格
    var doctorList, dTable, param = {};
    doctorList = $('#integration-table');
    $scope.is_btn_show = false;
    $scope.id = '0';
    $scope.is_date_list_show = false;

    Date.prototype.format = function(format) {
        var o = {
            "M+": this.getMonth() + 1, //month 
            "d+": this.getDate(), //day 
            "h+": this.getHours(), //hour 
            "m+": this.getMinutes(), //minute 
            "s+": this.getSeconds(), //second 
            "q+": Math.floor((this.getMonth() + 3) / 3), //quarter 
            "S": this.getMilliseconds() //millisecond 
        }

        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }

        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return format;
    }

    $rootScope.$on('lister_select_c_PZJFGZ', function(evet, data) {
        select_c_PZJFGZ($scope.currSelectId);
    });

    //查询药品列表
    function query_for_company() {
        $http({
            "method": "get",
            "url": app.url.query_for_stack_forDrugFactory + '?state_audit=9'
        }).then(function(resp) {
            $scope.query_for_integration_list = resp.data.info_list;
            $(".query_for_integration_list").on("click", "li", function() {
                $(this).siblings().find("a").removeClass("active");
                $(this).find("a").addClass("active");
                $scope.currSelectId = $(this).attr("id");
                $scope.currName = $(this).find("a").html();
                select_c_PZJFGZ($scope.currSelectId);
            });
            setTimeout(function() {
                $(".query_for_integration_list").find("li").eq(0).click();
            }, 200);
        });
    }

    //查询积分
    function select_c_PZJFGZ(_id) {
        $http({
            "method": "get",
            "url": app.url.select_c_PZJFGZ + "?goods=" + _id
        }).then(function(resp) {
            $scope.c_PZJFGZ_info = resp.data.info_list;
            if ($scope.c_PZJFGZ_info.length == 0) {
                $scope.is_btn_show = true;
                $scope.is_date_list_show = true;
                $scope.currIds = $scope.currSelectId + "|0";
                $scope.yffjf = 0;
                $scope.ybxfjf = 0;
            } else {
                $scope.is_btn_show = false;
                var data = $scope.c_PZJFGZ_info[0];
                $scope.id = data.id;
                $scope.currIds = $scope.currSelectId + "|" + $scope.id;
                $scope.start_date = data.start_date;
                $scope.end_date = data.end_date;
                $scope.bptydxsdphdjfs = data.bptydxsdphdjfs;
                $scope.qtqdxsdphdjfs = data.qtqdxsdphdjfs;
                $scope.zyzdsxjfs = data.zyzdsxjfs;
                $scope.zsmdwypxhjfs = data.zsmdwypxhjfs;
                $scope.yffjf = typeof data.yffjf != "undefined" ? data.yffjf : "0";
                $scope.ybxfjf = typeof data.ybxfjf != "undefined" ? data.ybxfjf : "0";
                $scope.select_c_PZJF_MTDSJ(30);
            }

        });

    }

    //药企品种库查询
    query_for_company();



    $scope.select_c_PZJF_MTDSJ = function(_type) {
        var st = (new Date()).format("yyyy-MM-dd");
        var et = (new Date($.now() - _type * 24 * 60 * 60 * 1000)).format("yyyy-MM-dd");
        $http({
            "method": "get",
            "url": app.url.select_c_PZJF_MTDSJ + "?__FILTER__=z_dt_date%3E=" + et + "%26%26z_dt_date%3C=" + st + "%26%26pzjfgz=" + $scope.id + "&__ORDER_BY__=z_dt_date%20desc"
        }).then(function(resp) {
            $scope.select_c_PZJFGZ_list = resp.data.info_list;
            if (resp.data.info_list.length == 0) {
                $scope.is_date_list_show = true;
            } else {
                $scope.is_date_list_show = false;
            }
        });
    }

    // $scope.select_c_PZJF_MTDSJ(7);
});
