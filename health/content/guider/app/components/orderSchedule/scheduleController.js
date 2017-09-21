(function() {
    angular.module('app')
        .controller('scheduleCtrl', scheduleCtrl);

    // 手动注入依赖
    scheduleCtrl.$inject = ['$scope', '$state', 'ScheduleFactory', 'moment', '$timeout', 'toaster','$stateParams','$rootScope'];

    // 日程控制器
    function scheduleCtrl($scope, $state, ScheduleFactory, moment, $timeout, toaster,$stateParams,$rootScope) {
        var userId=JSON.parse(localStorage.getItem('user')).id;
        var searchDate = moment(new Date()).format('YYYY-MM-DD');
        scheduleDetail(searchDate);
        scheduleTime(searchDate);

        $rootScope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams){
                if(toState.name==='order.schedule'&&fromState.name==='order.schedule.threeWayCalling'){
                    var curSelectDate=moment($scope.selectDate).format('YYYY-MM-DD');
                    //延迟500ms再请求服务器。
                    setTimeout(function(){
                        scheduleDetail(curSelectDate);
                        $rootScope.getScheduleCount();
                    },500);

                }
            });

        // 获取日程
        function scheduleDetail(searchDate) {
            $scope.scheduleDetailLoading = true;
            var param = {
                access_token: localStorage['guider_access_token'],
                searchDate: searchDate,
            }

            ScheduleFactory
                .scheduleDetail(param)
                .then(thenFc)

            function thenFc(response) {
                $scope.scheduleDetailLoading = false;
                $scope.schedulesList = response;

            }
        }

        // 时间戳转分钟，四舍五入到整数
        $scope.integer = function(n) {
            return Math.round(n / 1000 / 60);
        };

        $scope.scheduleDetail = scheduleDetail;

        // 获取日程记录－－并设置日历
        function scheduleTime(searchDate) {

            $scope.scheduleTimeLoading = true;
            var param = {
                access_token: localStorage['guider_access_token'],
                searchDate: searchDate,
            }

            ScheduleFactory
                .scheduleTime(param)
                .then(thenFc)

            function thenFc(response) {

                $scope.scheduleTimeLoading = false;
                $scope.scheduleTime = response;


                if (!$scope.selectDate) {
                    $scope.selectDate = new Date();
                }
                // 更新标记
                else {
                    $scope.selectDate = searchDate;
                }


            }
        }

        // 监听当前选择的日期
        $scope.$watch('selectDate', function(newValue, oldValue, scope) {

            if (newValue == oldValue)
                return;

            searchDate = moment(new Date(newValue)).format('YYYY-MM-DD');
            scheduleDetail(searchDate);
            scheduleTime(searchDate);

        });

        // 修改订单备注
        $scope.setRemarks = function(orderId, remarks) {

            $scope.setRemarksLoading = true;
            var param = {
                access_token: localStorage['guider_access_token'],
                orderId: orderId,
                remarks: remarks
            }

            ScheduleFactory
                .setRemarks(param)
                .then(thenFc)

            function thenFc(response) {
                $scope.setRemarksLoading = false;
                response = response.data;
                if (response.resultCode == 1) {
                    toaster.pop('success', null, '修改成功');
                } else if (response.resultMsg) {
                    toaster.pop('error', null, response.resultMsg);
                } else {
                    toaster.pop('error', null, '修改失败');
                }
            }
        }

        // 标记日历
        $scope.getDayClass = function(date, mode) {

            if ($scope.selectDate && moment(date).format('D') == 15) {
                if (moment(date).format('YYYY-MM') != moment($scope.selectDate).format('YYYY-MM')) {
                    console.log(moment(date).format('YYYY-MM-DD'), moment($scope.selectDate).format('YYYY-MM-DD'));
                    $scope.selectDate = date;
                    searchDate = date;
                    return '';
                }
            }

            if ($scope.scheduleTime && mode == 'day') {

                for (var i = 0; i < $scope.scheduleTime.length; i++) {
                    if (moment(date).format('D') == $scope.scheduleTime[i].dayNum && moment(date).format('E') == $scope.scheduleTime[i].week && $scope.scheduleTime[i].isTrue == 1) {
                        return 'haveData';
                    }
                }

            }

        };

        // 选择今天
        $scope.today = function() {
            $scope.selectDate = new Date();
        }


        // timeEditor
        $scope.minDate = moment(new Date()).format('YYYY/MM/DD H:mm');

        $scope.timeEditorCallBack = function(selected, backParam) {

            var appointTime = moment(selected).unix() * 1000;

            var param = {
                access_token: localStorage['guider_access_token'],
                orderId: backParam,
                appointTime: appointTime
            }

            ScheduleFactory
                .changeAppointTime(param)
                .then(thenFc)

            function thenFc(response) {
                response = response.data;
                if (response.resultCode === 1) {
                    changeAppointTime(backParam, appointTime);
                    toaster.pop('success', null, '修改成功');
                } else if (response.resultMsg) {
                    toaster.pop('error', null, response.resultMsg);
                } else {
                    toaster.pop('error', null, '接口调用失败');
                }
            }
        }

        function changeAppointTime(orderId, date) {
            for (var i = 0; i < $scope.schedulesList.length; i++) {
                if ($scope.schedulesList[i].orderId == orderId) {
                    $scope.schedulesList[i].scheduleTime = date;
                    break;
                }
            }
        }

    }
})();
