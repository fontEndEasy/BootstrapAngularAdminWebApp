(function() {
    angular.module('app')
        .factory('ConsultingRecordFactory', ConsultingRecordFactory);

    // 手动注入依赖
    ConsultingRecordFactory.$inject = ['$http'];

    function ConsultingRecordFactory($http) {
        return {
            findByPatientAndDoctor: findByPatientAndDoctor,
        };

        // 获取咨询记录
        function findByPatientAndDoctor(param) {

            return $http.post(app.api.order.findByPatientAndDoctor, param)
                .then(getListsComplete)
                .catch(getListsFailed);
        };

    };

    // 处理数据
    function getListsComplete(response) {

        return response.data;

    };
    // 检测错误
    function getListsFailed(error) {

        console.warn('请求失败.' + error.data);
    };

})();
