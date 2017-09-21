(function() {
    angular.module('app')
        .factory('QuickReplyFactory', QuickReplyFactory);

    // 手动注入依赖
    QuickReplyFactory.$inject = ['$http'];

    function QuickReplyFactory($http) {
        return {
            getQuickReplyList: getQuickReplyList,
            updateQuickReply: updateQuickReply,
            addQuickReply: addQuickReply,
            removeQuickReply: removeQuickReply,
        };

        // 获取快捷回复列表
        function getQuickReplyList(param) {

            return $http.post(app.api.im.getQuickReplyList, param)
                .then(getListsComplete)
                .catch(getListsFailed);
        };

        // 更改快捷回复
        function updateQuickReply(param) {

            return $http.post(app.api.im.updateQuickReply, param)
                .then(getListsComplete)
                .catch(getListsFailed);
        };

        // 添加快捷回复
        function addQuickReply(param) {

            return $http.post(app.api.im.addQuickReply, param)
                .then(getListsComplete)
                .catch(getListsFailed);
        };

        // 删除快捷回复
        function removeQuickReply(param) {

            return $http.post(app.api.im.removeQuickReply, param)
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
