(function() {
    angular.module('app')
        .directive('timeCalculator', timeCalculator);

    function timeCalculator() {
        return {
            scope: {
                starttime: '=',
                endtime: '=',
            },
            template: '{{time}}',
            controller: function($scope, $timeout) {

                setTimePolling();

                function setTimePolling() {

                    var starttime = $scope.starttime;
                    var endtime = $scope.endtime;

                    if (!starttime && !endtime) {
                        return console.warn('必需要有其中一个: starttime 或 endtime');
                    }

                    var second = '';

                    if (!starttime) {
                        second = (endtime - new Date().getTime()) / 1000;
                    } else if (!endtime) {
                        second = (new Date().getTime() - starttime) / 1000;
                    } else {
                        second = (endtime - starttime) / 1000;
                    }

                    var hour = second / 60 / 60;
                    var minute = second / 60;

                    var time;

                    if (second < 60) {

                        second = Math.floor(second);
                        time = second + '秒';

                    } else if (minute < 60) {
                        minute = Math.floor(minute);
                        second = Math.floor(second - minute * 60);
                        time = minute + '分' + second + '秒';
                    } else if (hour < 24) {
                        hour = Math.floor(hour);
                        minute = Math.floor((second - hour * 60 * 60) / 60);
                        second = Math.floor(second - minute * 60 - hour * 60 * 60);
                        time = hour + '时' + minute + '分' + second + '秒';
                    } else {
                        time = '超过24小时';
                    }

                    $scope.time = time;

                    $timeout(setTimePolling, 1000);

                }
            }
        };
    }
})();
