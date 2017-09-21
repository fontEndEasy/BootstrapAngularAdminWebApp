define(['angular'], function(angular) {
    angular.module('app').filter('myDateTime', function() {
        return function(utctime) {
            var dt = new Date(utctime);
            return dt.format("MM月dd日") + " " + ("星期" + ("日一二三四五六".charAt(dt.getDay())));
        };
    });
    angular.module('app').controller('HomeController', HomeController);
    HomeController.$inject = ['$scope', '$rootScope', '$state', '$http', '$q'];

    function HomeController($scope, $rootScope, $state, $http, $q) {
        document.title = "客户拜访";
        $scope.visitShow = false;
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

        $scope.delvisit = function($event, _id) {
            var evt = $event || window.event;
            $scope.$emit('alert', {
                msg: "<div style='text-align:center;'>确定要删除吗？</div>",
                func: function() {
                    $http({
                        url: window.serverApiRoot + "vistCustomer/deleteVistCustomerList",
                        method: 'post',
                        data: {
                            access_token: access_token,
                            id: _id
                        },
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
                            getVisitList();
                        } else {
                            console.warn(rep);
                        }
                    });
                }
            });

            evt.stopPropagation();
        }
        $scope.back = function() {
            // if (window.bridge != null) {
            window.bridge.closeVC();
            // } else {
            //     alert("非移动设备");
            // }
        }

        $scope.gotoVisit = function(status, id, flag) {
            if (typeof id != "undefined") {
                if (typeof flag != "undefined" && flag == 0) {
                    $state.go('editvisit', {
                        id: id,
                        status: status
                    });
                } else {
                    $state.go('lookvisit', {
                        id: id
                    });
                }
            } else {
                $state.go('editvisit', {
                    status: status
                });
            }

        }
        $scope.VisitList = [];

        function getVisitList() {
            $http({
                url: window.orgApiRoot + "vistCustomer/getVistCustomerList",
                method: 'post',
                data: {
                    access_token: access_token,
                    userId: userId
                },
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
                    if (rep.data && rep.data.length > 0) {
                        $scope.visitShow = true;
                        $scope.VisitList = rep.data;
                    } else {
                        $scope.visitShow = false;
                    }
                } else {
                    console.warn(rep);
                }
            });
        }

        function login() {
            var param = {
                userType: 9
            };
            param.telephone = "1234562";
            param.password = "123456";
            $http({
                url: window.serverApiRoot + "/user/login",
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
                    window.localStorage.setItem("access_token", rep.data.access_token);
                    window.localStorage.setItem("userId", rep.data.userId);
                    access_token = window.localStorage.getItem("access_token");
                    userId = window.localStorage.getItem("userId");
                    getVisitList();
                } else {
                    console.warn(rep);
                }
            });
        }
        if (window.bridge != null) {
            window.bridge.setToken(function(data) {
                window.localStorage.setItem("access_token", data.token);
                window.localStorage.setItem("userId", data.userid);
                access_token = window.localStorage.getItem("access_token");
                userId = window.localStorage.getItem("userId");
                getVisitList();
            });
        } else {
            login();
        }
    }
});
