(function() {
    angular.module('app')
        .factory('MyOrderFactory', MyOrderFactory);

    // 手动注入依赖
    MyOrderFactory.$inject = ['$http'];

    function MyOrderFactory($http) {
        return {
            getGuideNoServiceOrder: getGuideNoServiceOrder,
            getGuideAlreadyServicedOrder:getGuideAlreadyServicedOrder
        };

        function getGuideNoServiceOrder(param) {

            return $http.post(app.api.order.getGuideNoServiceOrder, param)
                .then(getListsComplete)
                .catch(getListsFailed);
        };

        function getGuideAlreadyServicedOrder(param) {

            return $http.post(app.api.order.getGuideAlreadyServicedOrder, param)
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
