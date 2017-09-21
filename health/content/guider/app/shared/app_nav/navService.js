// ============================== navService.js =================================
(function() {
    angular.module('app')
        .factory('AppNavFactory', AppNavFactory);

    // 手动注入依赖
    AppNavFactory.$inject = ['$http', '$state'];

    function AppNavFactory($http, $state) {
        return {
            getData: getData,
            getMsgList: getMsgList,
            getNoServiceSchedule:getNoServiceSchedule
        };
        // 获取数据
        function getData(param) {
            return $http.post(app.api.shared.signOut, param)
                .then(getDataComplete)
                .catch(getDataFailed);

            // 处理数据
            function getDataComplete(response) {

                return response;
            };
            // 检测错误
            function getDataFailed(error) {
                console.error('请求失败.' + error.data);
            };
        };


        //获取未完成日程统计
        function getNoServiceSchedule(param){
            return $http.post(app.api.shared.getNoService, param)
                .then(getDataComplete)
                .catch(getDataFailed);

            // 处理数据
            function getDataComplete(response) {

                return response;
            };
            // 检测错误
            function getDataFailed(error) {
                console.error('请求失败.' + error.data);
            };
        }

        // 获取通知
        function getMsgList(param) {

            return $http.post(app.api.im.getMsgList, param)
                .then(getDataComplete)
                .catch(getDataFailed);

            // 处理数据
            function getDataComplete(response) {

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
            function getDataFailed(error) {

                console.error('请求失败.' + error.data);
            };
        };
    }

})();
