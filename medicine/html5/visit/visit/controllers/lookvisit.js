define(['angular', 'ngDialog'], function(angular) {
    angular.module('app').controller('LookVisitController', LookVisitController);
    LookVisitController.$inject = ['$scope', '$rootScope', '$stateParams', '$state', '$http', '$q', 'ngDialog'];

    function LookVisitController($scope, $rootScope, $stateParams, $state, $http, $q, ngDialog) {
        document.title = "客户拜访";
        var id = $stateParams.id;
        var access_token = window.localStorage.getItem("access_token");
        var userId = window.localStorage.getItem("userId");
        $scope.vm = {
            title: "",
            status: "", //状态
            startDate: "", //开始拜访时间
            endDate: "", //结算拜访时间
            startAddress: "", //开始拜访地址
            startCoordinate: "", //开始拜访经纬度
            endAddress: "", //结束拜访地址
            endCoordinate: "", //结束拜访经纬度
            visitDate: "", //拜访日期
            doctorId: "", //拜访医生ID
            doctorName: "", //拜访医生名称
            remark: "" //备注
        };

        $scope.back = function() {
            history.go(-1);
        }

        Date.prototype.format = function(format) {
            var o = {
                "M+": this.getMonth() + 1,
                "d+": this.getDate(),
                "h+": this.getHours(),
                "m+": this.getMinutes(),
                "s+": this.getSeconds(),
                "q+": Math.floor((this.getMonth() + 3) / 3),
                "S": this.getMilliseconds()
            };
            if (/(y+)/.test(format)) {
                format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            }
            for (var k in o) {
                if (new RegExp("(" + k + ")").test(format)) {
                    format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
                }
            }
            return format;
        };



        function queryVistCustomerDetail(callback) {
            callback = callback || function() {};
            var param = {};
            param.access_token = access_token;
            param.id = id;
            $http({
                url: window.serverApiRoot + "vistCustomer/getVistCustomerDetail",
                method: 'post',
                data: param,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                transformRequest: function(obj) {
                    var str = [];
                    for (var p in obj) {
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    }
                    return str.join("&");
                }
            }).then(function(response) {
                var rep = response.data;
                if (rep && rep.resultCode == 1) {
                    callback(rep);
                } else {
                    console.warn(rep);
                }
            });
        }

        queryVistCustomerDetail(function(rep) {
            if (rep.data.title) $scope.vm.title = rep.data.title;
            if (rep.data.startDate) $scope.vm.startDate = rep.data.startDate;
            if (rep.data.endDate) $scope.vm.endDate = rep.data.endDate;
            if (rep.data.startAddress) $scope.vm.startAddress = rep.data.startAddress;
            if (rep.data.startCoordinate) $scope.vm.startCoordinate = rep.data.startCoordinate;
            if (rep.data.endAddress) $scope.vm.endAddress = rep.data.endAddress;
            if (rep.data.endCoordinate) $scope.vm.endCoordinate = rep.data.endCoordinate;
            if (rep.data.visitDate) $scope.vm.visitDate = rep.data.visitDate;
            if (rep.data.doctorId) $scope.vm.doctorId = rep.data.doctorId;
            if (rep.data.doctorName) $scope.vm.doctorName = rep.data.doctorName;
            if (rep.data.remark) $scope.vm.remark = rep.data.remark;
            if (rep.data.flag) $scope.vm.flag = rep.data.flag;
            if (rep.data.id) $scope.vm.id = rep.data.id;

            $scope.currdate = {
                time: new Date(rep.data.creatorDate).format("yyyy年MM月dd"),
                week: "星期" + ("日一二三四五六".charAt(new Date(rep.data.creatorDate).getDay()))
            };
        });
    }
});
