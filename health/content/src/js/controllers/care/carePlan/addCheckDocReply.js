(function() {
    angular.module('app')
        .factory('AddCheckDocReplyFtory', AddCheckDocReplyFtory)

    // 手动注入依赖
    AddCheckDocReplyFtory.$inject = ['$http', '$modal'];

    function AddCheckDocReplyFtory($http, $modal) {
        return {
            open: openModel
        };

        function openModel(replyData, callBack) {

            if (!replyData) replyData = {};

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: function() {
                    var isChack = window.location.href.indexOf('/check/');
                    if (isChack != -1)
                        return '../src/tpl/care/carePlan/addCheckDocReply.html';
                    else
                        return 'src/tpl/care/carePlan/addCheckDocReply.html';
                }(),
                controller: 'AddCheckDocReplyCtrl',
                size: 'md',
                resolve: {
                    replyData: function() {
                        return replyData;
                    }
                }
            });
            modalInstance.result.then(function(replyData) {
                if (callBack)
                    callBack(replyData);
            });
        };

    };

    angular.module('app')
        .controller('AddCheckDocReplyCtrl', AddCheckDocReplyCtrl)

    function AddCheckDocReplyCtrl($scope, $http, $modal, $modalInstance, toaster, replyData) {

        $scope.replyData = replyData;

        function submitReplyData(data) {
            $http.post(app.urlRoot + 'designer/saveDoctorReply', {
                access_token: app.url.access_token,
                careItemId: $scope.replyData.careItemId,
                doctorReply: $scope.replyData.doctorReply
            }).then(function(rpn) {
                rpn = rpn.data;
                if (rpn && rpn.resultCode == 1) {
                    toaster.pop('success', null, '设置成功');
                    $modalInstance.close(rpn.data);
                } else if (rpn && rpn.resultMsg) {
                    toaster.pop('error', null, rpn.resultMsg);
                } else {
                    toaster.pop('error', null, '获取计划数据出错');
                    console.error(rpn);
                };
            });
        };


        // 取消
        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };

        // 保存
        $scope.ok = function() {
            if (!$scope.replyData.doctorReply)
                return toaster.pop('error', null, '请输入回复内容');
            submitReplyData($scope.replyData);
        };

    };

})();
