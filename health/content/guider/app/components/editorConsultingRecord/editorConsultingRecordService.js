(function() {
    angular.module('app')
        .factory('EditorConsultingRecordFactory', EditorConsultingRecordFactory);

    // 手动注入依赖
    EditorConsultingRecordFactory.$inject = ['$http', '$uibModal'];

    function EditorConsultingRecordFactory($http, $uibModal) {
        return {
            open: open,
            createCurrecord: createCurrecord,
            updateCurrecord: updateCurrecord,
            findByOrder: findByOrder,
            confirm: confirm,
            callByTel:callByTel,
            getConsultVoice:getConsultVoice
        };

        // 打开诊疗记录编辑窗口
        function open(orderId, doctorId, callback) {
            if (!orderId || !doctorId)
                return;

            var data = {};
            var modalInstance = $uibModal.open({
                templateUrl: 'app/components/editorConsultingRecord/editorConsultingRecordView.html',
                controller: 'EditorConsultingRecordModalInstanceCtrl',
                keyboard: false,
                backdrop: 'static',
                size: 'lg',
                resolve: {
                    data: {
                        orderId: orderId,
                        doctorId: doctorId
                    }
                }

            });

            modalInstance.result.then(function() {
                if (callback)
                    callback();
            });
        }


        // 确定诊疗记录
        function confirm(param) {

            return $http.post(app.api.guider.confirm, param)
                .then(getListsComplete)
                .catch(getListsFailed);
        };

        // 获取诊疗记录
        function findByOrder(param) {

            return $http.post(app.api.order.findByOrder, param)
                .then(getListsComplete)
                .catch(getListsFailed);
        };

        // 创建诊疗记录
        function createCurrecord(param) {

            return $http.post(app.api.doctor.createCurrecord, param)
                .then(getListsComplete)
                .catch(getListsFailed);
        };

        // 更新诊疗记录
        function updateCurrecord(param) {

            return $http.post(app.api.doctor.updateCurrecord, param)
                .then(getListsComplete)
                .catch(getListsFailed);
        };

        // 拨打电话
        function callByTel(param) {

            return $http.post(app.api.order.callByTel, param)
                .then(getListsComplete)
                .catch(getListsFailed);
        };

        // 获取通话录音
        function getConsultVoice(param) {

            return $http.post(app.api.order.getVoiceByOrderId, param)
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
