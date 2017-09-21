// ============================== orderService.js =================================
(function() {
    angular.module('app')
        .factory('OrderFactory', OrderFactory);

    // 手动注入依赖
    OrderFactory.$inject = ['$http'];

    function OrderFactory($http) {
        return {
            getOrderList: getOrderList,
            getOrder: getOrder,
            getChatPeopleList: getChatPeopleList,
            getWindowData: getWindowData,
            closeOrder: closeOrder,
            sendMsg: sendMsg,
            getOrderDisease: getOrderDisease,
            callByTel: callByTel,
            savePatientInfo:savePatientInfo,
            findOrderDisease:findOrderDisease,
        };

        // 获取病情资料
        function getOrderDisease(param) {

            return $http.post(app.api.order.getOrderDisease, param)
                .then(getListsComplete)
                .catch(getListsFailed);
        }

        // 拨打电话
        function callByTel(param) {

            return $http.post(app.api.order.callByTel, param)
                .then(getListsComplete)
                .catch(getListsFailed);
        }

        // 获取订单列表
        function getOrderList(param) {

            return $http.post(app.api.order.waitOrderList, param)
                .then(getListsComplete)
                .catch(getListsFailed);
        }

        // 接单
        function getOrder(param) {

            return $http.post(app.api.order.getOrder, param)
                .then(getListsComplete)
                .catch(getListsFailed);
        }

        // 获取对话人列表
        function getChatPeopleList(param) {

            return $http.post(app.api.order.chartLists, param)
                .then(getListsComplete)
                .catch(getListsFailed);
        }

        // 获取对话内容
        function getWindowData(param) {

            return $http.post(app.api.im.getMsgList, param)
                .then(getListsComplete)
                .catch(getListsFailed);
        }

        // 结束服务
        function closeOrder(param) {

            return $http.post(app.api.order.closeOrder, param)
                .then(getListsComplete)
                .catch(getListsFailed);
        }

        // 发送消息
        function sendMsg(param) {

            return $http.post(app.api.im.sendMsg, param)
                .then(getListsComplete)
                .catch(getListsFailed);
        }

        //自动保存患者资料
        function savePatientInfo(param){
            return $http.post('savePatientInfo',param)
                .then(getListsComplete)
                .catch(getListsFailed);
        }

        //获取患者病历（右边栏）
        function findOrderDisease(param){
            return $http.post(app.api.order.findOrderDiseaseAndRemark,param)
                .then(getListsComplete)
                .catch(getListsFailed);
        }

    }

    // 处理数据
    function getListsComplete(response) {

        var reData = response.data;

        if (reData.resultCode === 1) {

            try {

                return reData.data;

            } catch (e) {

                if (e.type === undefined)
                    console.warn('返回数据没有 data 字段');

                console.warn(e);
            }

        } else if (reData.resultMsg) {

            console.warn(reData.resultMsg);

        } else {
            console.warn('请求失败');
        }


    }
    // 检测错误
    function getListsFailed(error) {

        console.warn('请求失败.' + error.data);
    }

})();
