// ============================== signinService.js =================================
(function() {
    angular.module('app')
        .factory('SigninFactory', SigninFactory);

    function SigninFactory($http) {
        return {
            getData: getData
        };
        // 获取数据
        function getData(param) {

            return $http.post(app.api.shared.signin, param)
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
