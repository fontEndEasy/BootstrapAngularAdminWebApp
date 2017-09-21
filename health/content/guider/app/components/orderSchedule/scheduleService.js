(function() {
    angular.module('app')
        .factory('ScheduleFactory', ScheduleFactory);

    // 手动注入依赖
    ScheduleFactory.$inject = ['$http'];

    function ScheduleFactory($http) {
        return {
            getOrderRemarks: getOrderRemarks,
            setRemarks: setRemarks,
            scheduleDetail: scheduleDetail,
            scheduleTime: scheduleTime,
            changeAppointTime: changeAppointTime
        };

        // 更改订单预约时间
        function changeAppointTime(param) {

            return $http.post(app.api.order.changeAppointTime, param)
                .catch(getListsFailed);
        };

        // 获取日程记录
        function scheduleTime(param) {

            return $http.post(app.api.shared.scheduleTime, param)
                .then(getListsComplete)
                .catch(getListsFailed);
        };

        // 获取日程列表
        function scheduleDetail(param) {

            return $http.post(app.api.shared.scheduleDetail, param)
                .then(getListsComplete)
                .catch(getListsFailed);
        };

        // 获取订单备注
        function getOrderRemarks(param) {

            return $http.post(app.api.order.getOrderRemarks, param)
                .then(getListsComplete)
                .catch(getListsFailed);
        };

        // 修改订单备注
        function setRemarks(param) {

            return $http.post(app.api.order.setRemarks, param)
                .catch(getListsFailed);
        };

    };

    // 处理数据
    function getListsComplete(response) {

        var reData = response.data;

        if (reData.resultCode === 1) {

            try {

                return reData.data

            } catch (e) {

                if (e.type === undefined)
                    console.warn('返回数据没有 data 字段')

                console.warn(e);
            }

        } else if (reData.resultMsg) {

            console.warn(reData.resultMsg);

        } else {
            console.warn('请求失败');
        }


    };
    // 检测错误
    function getListsFailed(error) {

        console.warn('请求失败.' + error.data);
    };

})();
