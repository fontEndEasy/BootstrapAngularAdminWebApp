define(['angular', 'ngDialog'], function(angular) {
    angular.module('app').controller('EditVisitController', EditVisitController);
    EditVisitController.$inject = ['$scope', '$rootScope', '$stateParams', '$state', '$http', '$q', 'ngDialog'];

    function EditVisitController($scope, $rootScope, $stateParams, $state, $http, $q, ngDialog) {
        document.title = "客户拜访";
        var id = $stateParams.id;
        $scope.status = $stateParams.status;
        var access_token = window.localStorage.getItem("access_token");
        var userId = window.localStorage.getItem("userId");
        $scope.vm = {
            title: "客户拜访",
            status: "", //状态
            startDate: "", //开始拜访时间
            endDate: "", //结算拜访时间
            startAddress: "", //开始拜访地址
            startCoordinate: "", //开始拜访经纬度
            endAddress: "", //结束拜访地址
            endCoordinate: "", //结束拜访经纬度
            doctorId: "", //拜访医生ID
            doctorName: "", //拜访医生名称
            remark: "" //备注
        };

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

        $rootScope.$on('lister_position_point', function(evet, data) {
            $scope.address = data.title;
            globalCurrPoint.formatted_address = data.title;
            globalCurrPoint.location = {};
            globalCurrPoint.location.lat = data.point.lat;
            globalCurrPoint.location.lng = data.point.lng;
        });
        var dialog = null;
        $scope.gotoSelectPosition = function() {
            // $state.go('selectposition',{id:id,status:$scope.status});
            dialog = ngDialog.open({
                template: 'resolveDialog',
                className: 'ngdialog-theme-default',
                scope: $scope,
                closeByDocument: false,
                closeByEscape: false,
                showClose: false,
                disableAnimation: true
            });

            setTimeout(function() {
                if (globalCurrPosition != null) {
                    initMapDemo(globalCurrPosition);
                }
            }, 300)
        }

        $scope.back = function() {
            history.go(-1);
        }

        var globalCurrPosition = null;
        var globalCurrPoint = null;

        function geoCurrLocation() {
            var geolocation = new BMap.Geolocation();
            geolocation.getCurrentPosition(function(r) {
                if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                    globalCurrPosition = r;
                    geocoder(r.point.lat, r.point.lng);
                } else {
                    alert('failed' + this.getStatus());
                }
            }, {
                enableHighAccuracy: true
            });

            function geocoder(lat, lng) {
                $http.jsonp("http://api.map.baidu.com/geocoder/v2/?ak=6uWsWUrNR6xqQref0wIwMgGw&callback=JSON_CALLBACK&location=" + lat + "," + lng + "&output=json&pois=1")
                    .success(
                        function(data, status, header, config) {
                            if (data.status == 0) {
                                globalCurrPoint = data.result;
                                $scope.address = data.result.formatted_address;
                                if ($scope.vm.startDate == "") {
                                    $scope.vm.startAddress = data.result.formatted_address;
                                    $scope.vm.startCoordinate = data.result.location.lat + "," + data.result.location.lng;
                                } else if ($scope.vm.startDate != "" && $scope.vm.endDate == "") {
                                    $scope.vm.endAddress = data.result.formatted_address;
                                    $scope.vm.endCoordinate = data.result.location.lat + "," + data.result.location.lng;
                                }
                            } else {
                                $scope.address = "无";
                            }
                        }
                    )
                    .error(
                        function(data) {
                            $scope.address = "无";
                        }
                    );
            }
        }

        $scope.isStartActive = false;
        $scope.isEndActive = false;
        $scope.isSibmitActive = false;
        $scope.isSelectUserActive = false;

        if ($scope.status == "add") {
            $scope.currdate = {
                time: new Date().format("yyyy年MM月dd"),
                week: "星期" + ("日一二三四五六".charAt(new Date().getDay())),
                utc: new Date().getTime()
            };
            geoCurrLocation();
            if ($scope.vm.startDate == "") {
                $scope.isStartActive = true;
                $scope.isEndActive = false;
            } else {
                $scope.isStartActive = false;
                $scope.isEndActive = true;
            }
            if ($scope.vm.startDate != "" && $scope.vm.endDate == "") {
                $scope.isStartActive = false;
                $scope.isEndActive = true;
            } else if ($scope.vm.startDate != "" && $scope.vm.endDate != "") {
                $scope.isStartActive = false;
                $scope.isEndActive = false;
            } else {
                $scope.isEndActive = false;
            }

            if ($scope.vm.doctorName == "" || $scope.vm.doctorName == "请选择客户") {
                $scope.isSelectUserActive = false;
                $scope.vm.doctorName = "请选择客户";
            } else {
                $scope.isSelectUserActive = true;
            }
        } else if ($scope.status == "edit" && id && id != "") {
            queryVistCustomerDetail(function(rep) {
                if (rep.data.title) $scope.vm.title = rep.data.title;
                if (rep.data.startDate) $scope.vm.startDate = rep.data.startDate;
                if (rep.data.endDate) $scope.vm.endDate = rep.data.endDate;
                if (rep.data.startAddress) $scope.vm.startAddress = rep.data.startAddress;
                if (rep.data.startCoordinate) $scope.vm.startCoordinate = rep.data.startCoordinate;
                if (rep.data.endAddress) $scope.vm.endAddress = rep.data.endAddress;
                if (rep.data.endCoordinate) $scope.vm.endCoordinate = rep.data.endCoordinate;
                if (rep.data.doctorId) $scope.vm.doctorId = rep.data.doctorId;
                if (rep.data.doctorName) $scope.vm.doctorName = rep.data.doctorName;
                if (rep.data.remark) $scope.vm.remark = rep.data.remark;
                if (rep.data.flag) $scope.vm.flag = rep.data.flag;
                if (rep.data.id) $scope.vm.id = rep.data.id;
                geoCurrLocation();
                if ($scope.vm.startDate == "") {
                    $scope.isStartActive = true;
                    $scope.isEndActive = false;
                } else {
                    $scope.isStartActive = false;
                    $scope.isEndActive = true;
                }
                if ($scope.vm.startDate != "" && $scope.vm.endDate == "") {
                    $scope.isStartActive = false;
                    $scope.isEndActive = true;
                } else if ($scope.vm.startDate != "" && $scope.vm.endDate != "") {
                    $scope.isStartActive = false;
                    $scope.isEndActive = false;
                } else {
                    $scope.isEndActive = false;
                }

                if ($scope.vm.doctorName == "" || $scope.vm.doctorName == "请选择客户") {
                    $scope.isSelectUserActive = false;
                    $scope.vm.doctorName = "请选择客户";
                } else {
                    $scope.isSelectUserActive = true;
                }
            });
        }

        $scope.$watch("vm.doctorName", function(newVal, oldVal, scope) {
            changeSibmitActive();
        });
        $scope.$watch("vm.startDate", function(newVal, oldVal, scope) {
            changeSibmitActive();
        });
        $scope.$watch("vm.endDate", function(newVal, oldVal, scope) {
            changeSibmitActive();
        });
        $scope.$watch("vm.remark", function(newVal, oldVal, scope) {
            changeSibmitActive();
        });

        function changeSibmitActive() {
            if ($scope.vm.doctorName != "" && $scope.vm.startDate != "" && $scope.vm.endDate != "" && $scope.vm.remark != "") {
                $scope.isSibmitActive = true;
            } else {
                $scope.isSibmitActive = false;
            }
        }

        $scope.oprearCard = function(flag) {
            if (globalCurrPoint == null) return;
            if (flag == "1") { //开始打卡
                if (!$scope.isStartActive) return;
                $scope.vm.startDate = new Date().getTime();
                $scope.isStartActive = false;
                $scope.isEndActive = true;

            } else { //离开打开
                if (!$scope.isEndActive) return;
                $scope.vm.endDate = new Date().getTime();
                $scope.isStartActive = false;
                $scope.isEndActive = false;
            }

            if ($scope.vm.startDate == "") {
                $scope.vm.startAddress = globalCurrPoint.formatted_address;
                $scope.vm.startCoordinate = globalCurrPoint.location.lat + "," + globalCurrPoint.location.lng;
            } else if ($scope.vm.startDate != "" && $scope.vm.endDate == "") {
                $scope.vm.endAddress = globalCurrPoint.formatted_address;
                $scope.vm.endCoordinate = globalCurrPoint.location.lat + "," + globalCurrPoint.location.lng;
            }

            console.log($scope.vm);
        }

        $scope.selectDoctor = function() {
            if (window.bridge != null) {
                window.bridge.selectDoctor();
            } else {
                $scope.$emit('alert', {
                    msg: "<div style='text-align:center;'>非移动设备</div>",
                    btns: [{
                        btnMsg: "知道了"
                    }]
                });
            }
        }

        if (window.bridge != null) {
            window.bridge.registerCallback("selectDoctorCallback", function(data) {
                $scope.vm.doctorId = data.id;
                $scope.vm.doctorName = data.name;
                $scope.$apply('vm.doctorName');
            });
        }

        $scope.sibmitVisit = function() {
            if (!$scope.isSibmitActive) return;
            var param = {};
            param.title = $scope.vm.title;
            param.startDate = $scope.vm.startDate;
            param.endDate = $scope.vm.endDate;
            param.startAddress = $scope.vm.startAddress;
            param.startCoordinate = $scope.vm.startCoordinate;
            param.endAddress = $scope.vm.endAddress;
            param.endCoordinate = $scope.vm.endCoordinate;
            param.doctorId = $scope.vm.doctorId;
            param.doctorName = $scope.vm.doctorName;
            param.remark = $scope.vm.remark;
            param.flag = 1;
            param.access_token = access_token;
            param.userId = userId;
            if ($scope.vm.id) param.id = $scope.vm.id;
            $http({
                url: window.orgApiRoot + "vistCustomer/addVistCustomer",
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
                    $scope.$emit('alert', {
                        msg: "<div style='text-align:center;'>提交成功</div>",
                        btns: [{
                            btnMsg: "知道了"
                        }],
                        func: function() {
                            history.go(-1);
                        }
                    });
                } else if (rep.resultMsg) {
                    $scope.$emit('alert', {
                        msg: "<div style='text-align:center;'>提交失败</div>",
                        btns: [{
                            btnMsg: "知道了"
                        }],
                        func: function() {

                        }
                    });
                } else {
                    console.warn(rep);
                }
            });
        }

        $scope.saveVisit = function() {
            var param = {};
            param.title = $scope.vm.title;
            param.startDate = $scope.vm.startDate;
            param.endDate = $scope.vm.endDate;
            param.startAddress = $scope.vm.startAddress;
            param.startCoordinate = $scope.vm.startCoordinate;
            param.endAddress = $scope.vm.endAddress;
            param.endCoordinate = $scope.vm.endCoordinate;
            param.doctorId = $scope.vm.doctorId;
            param.doctorName = $scope.vm.doctorName;
            param.remark = $scope.vm.remark;
            param.flag = 0;
            param.access_token = access_token;
            param.userId = userId;
            if ($scope.vm.id) param.id = $scope.vm.id;
            $http({
                url: window.orgApiRoot + "vistCustomer/addVistCustomer",
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
                    $scope.$emit('alert', {
                        msg: "<div style='text-align:center;'>保存成功</div>",
                        btns: [{
                            btnMsg: "知道了"
                        }],
                        func: function() {
                            history.go(-1);
                        }
                    });
                } else if (rep.resultMsg) {
                    $scope.$emit('alert', {
                        msg: "<div style='text-align:center;'>保存失败</div>",
                        btns: [{
                            btnMsg: "知道了"
                        }],
                        func: function() {

                        }
                    });
                } else {
                    console.warn(rep);
                }
            });
        }

        function queryVistCustomerDetail(callback) {
            callback = callback || function() {};
            var param = {};
            param.access_token = access_token;
            param.id = id;
            $http({
                url: window.orgApiRoot + "vistCustomer/getVistCustomerDetail",
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


        $scope.localStr = "";
        $scope.plist = []

        var local = null;

        function initMapDemo(pcp) {
            // 百度地图API功能
            var map = new BMap.Map("allmap"); // 创建Map实例
            var mPoint = new BMap.Point(pcp.point.lng, pcp.point.lat);
            map.enableScrollWheelZoom();
            map.centerAndZoom(mPoint, 15);
            if ($scope.localStr == "") {
                var mk = new BMap.Marker(pcp.point);
                map.addOverlay(mk);
            }

            // alert('您的位置：'+r.point.lng+','+r.point.lat);
            var options = {
                onSearchComplete: function(results) {
                    // 判断状态是否正确
                    if (local.getStatus() == BMAP_STATUS_SUCCESS) {
                        $scope.plist = [];
                        for (var i = 0; i < results.getCurrentNumPois(); i++) {
                            $scope.plist.push(results.getPoi(i));
                        }
                        $scope.$apply('plist');
                    }
                },
                renderOptions: {
                    map: map,
                    autoViewport: false
                }
            };
            var circle = new BMap.Circle(mPoint, 1000, {
                fillColor: "blue",
                strokeWeight: 1,
                fillOpacity: 0.3,
                strokeOpacity: 0.3
            });
            map.addOverlay(circle);
            var local = new BMap.LocalSearch(map, options);
            local.searchNearby("大厦", mPoint, 1000);
            $scope.$watch('localStr', function(newVal, oldVal) {
                local.searchNearby($scope.localStr, mPoint, 1000);
            });
        }

        $scope.pselect = function(point) {
            $rootScope.$emit('lister_position_point', point);
            dialog.close();
        }


    }
});
