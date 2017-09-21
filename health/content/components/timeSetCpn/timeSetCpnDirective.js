(function() {
    angular.module('app')
        .directive('timeSetCpn', timeSetCpn);

    function timeSetCpn() {
        return {
            scope: {
                time: '=',
                change: '=',
                hourStep: '@',
                minuteStep: '@',
                filterArryJson: '=',
            },
            template: '<div class="form-group">' +
                '<select class="form-control" ng-model="timeOption.hour" ng-change="timeChange()" ng-options="item as item for item in hourOption | filter:timeFilter(timeOption.minute,1)">' +
                '</select>' +
                '</div>' +
                '<div class="form-group">' +
                '：' +
                '</div>' +
                '<div class="form-group">' +
                '<select class="form-control" ng-model="timeOption.minute" ng-change="timeChange()" ng-options="item as item for item in minuteOption | filter:timeFilter(timeOption.hour,2)">' +
                '</select>' +
                '</div>',

            //templateUrl: function() {
            //    var isChack = window.location.href.indexOf('/check/');
            //    if (isChack != -1)
            //        return '../components/timeSetCpn/timeSetCpnView.html';
            //    else
            //        return 'components/timeSetCpn/timeSetCpnView.html';
            //}(),
            controller: 'TimeSetCpnCtrl',
        };
    };

    angular.module('app')
        .controller('TimeSetCpnCtrl', TimeSetCpnCtrl);

    TimeSetCpnCtrl.$inject = ['$scope'];

    function TimeSetCpnCtrl($scope) {

        // 初始化发送时间
        if (!$scope.time) {
            $scope.timeOption = {
                hour: '00',
                minute: '00'
            };
        } else {
            var splitArry = $scope.time.split(':');

            $scope.timeOption = {
                hour: splitArry[0],
                minute: splitArry[1]
            };
        };

        $scope.timeChange = function() {
            $scope.time = $scope.timeOption.hour + ':' + $scope.timeOption.minute;
        };

        $scope.hourOption = function() {
            var _step = [];
            for (var i = 0; i < 24; i++) {
                if ($scope.hourStep && i % $scope.hourStep == 0)

                    if (i < 10)
                        _step.push('0' + i.toString());
                    else
                        _step.push(i.toString());
            }
            return _step;
        }();

        $scope.minuteOption = function() {
            var _step = [];
            for (var i = 0; i < 60; i++) {
                if ($scope.minuteStep && i % $scope.minuteStep == 0)
                    if (i < 10)
                        _step.push('0' + i.toString());
                    else
                        _step.push(i.toString());
            }
            return _step;
        }();

        // 时间过滤格式
        // $scope.filterArry = ['09:30', '08:00'];

        $scope.timeFilter = function(hourOrMinute, type) {

            if (!$scope.filterArryJson)
                return;

            var _houerFilterArry = [],
                filterArry = JSON.parse($scope.filterArryJson);

            if (filterArry && filterArry.length > 0)
                for (var i = 0; i < filterArry.length; i++) {
                    if (filterArry[i].split(':')[type == 1 ? type : 0] == hourOrMinute)
                        _houerFilterArry.push(filterArry[i].split(':')[type == 1 ? 0 : 1]);
                }

            return function(item) {

                for (var k = 0; k < _houerFilterArry.length; k++) {
                    if (item == _houerFilterArry[k]) {
                        return false;
                    }
                }

                return true;
            };
        };

    };

})();
