(function() {
    angular.module('app')
        .factory('MakeCallFactory', MakeCallFactory)

    // 手动注入依赖
    MakeCallFactory.$inject = ['$uibModal', '$http'];

    function MakeCallFactory($uibModal, $http) {
        return {
            open: openModel,
            callByTel: callByTel
        };

        // 打开拨打电话界面
        function openModel(fromTel, toTel) {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/shared/make_call/makeCallView.html',
                controller: 'MakeCallCtrl',
                size: 'sm',
                resolve: {
                    data: {
                        fromTel: fromTel,
                        toTel: toTel
                    }
                }
            });
        }

        // 拨打电话
        function callByTel(param) {

            return $http.post(app.api.order.callByTel, param)
                .then(getListsComplete)
                .catch(getListsFailed);
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
    };



})();
