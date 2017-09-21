(function() {
    angular.module('app')
        .factory('OrderHistoryFactory', OrderHistoryFactory);

    // 手动注入依赖
    OrderHistoryFactory.$inject = ['$http'];

    function OrderHistoryFactory($http) {
        return {
            getWindowData: getWindowData,
            orderList: orderList,
            getOrderDisease: getOrderDisease
        };

        // 获取病情资料
        function getOrderDisease(param) {

            return $http.post(app.api.order.getOrderDisease, param)
                .then(getListsComplete)
                .catch(getListsFailed);
        };

        // 获取历史接单记录
        function orderList(param) {

            return $http.post(app.api.order.orderList, param)
                .then(getListsComplete)
                .catch(getListsFailed);
        };

        // 获取对话内容
        function getWindowData(param) {

            return $http.post(app.api.im.getMsgList, param)
                .then(getListsComplete)
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
