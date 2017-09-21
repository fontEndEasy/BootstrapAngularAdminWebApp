// ============================== signinService.js =================================
(function() {
    angular.module('app')
        .factory('ResetPassWordFactory', ResetPassWordFactory);

    function ResetPassWordFactory($http) {
        return {
            getRanCode: getRanCode
        };
        // 获取数据
        function getRanCode(param) {

            return $http.post(app.api.shared.sendRanCode, param)
                .then(getDataComplete)
                .catch(getDataFailed);

            // 处理数据
            function getDataComplete(response) {
                return response.data;
            };
            // 检测错误
            function getDataFailed(error) {
                console.error('请求失败.' + error.data);
            };
        };
    }
})();
