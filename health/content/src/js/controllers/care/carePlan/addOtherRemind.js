(function() {
    angular.module('app')
        .factory('AddCareRemindFtory', AddCareRemindFtory)

    // 手动注入依赖
    AddCareRemindFtory.$inject = ['$http', '$modal'];

    function AddCareRemindFtory($http, $modal) {
        return {
            open: openModel
        };

        function openModel(remindData, callBack) {

            if (!remindData) remindData = {};

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: function() {
                    var isChack = window.location.href.indexOf('/check/');
                    if (isChack != -1)
                        return '../src/tpl/care/carePlan/addOtherRemind.html';
                    else
                        return 'src/tpl/care/carePlan/addOtherRemind.html';
                }(),
                controller: 'AddCareRemindCtrl',
                size: 'md',
                resolve: {
                    remindData: function() {
                        return remindData;
                    }
                }
            });
            modalInstance.result.then(function(remindData) {
                if (callBack)
                    callBack(remindData);
            });
        };

    };

    angular.module('app')
        .controller('AddCareRemindCtrl', AddCareRemindCtrl)

    function AddCareRemindCtrl($scope, $http, $modal, $modalInstance, toaster, remindData) {

        $scope.remindData = {
            sendTime: remindData.sendTime || null,
            carePlanId: remindData.carePlanId || null,
            schedulePlanId: remindData.schedulePlanId || null,
            dateSeq: remindData.dateSeq || null,
            tmpType: remindData.tmpType,
            OtherRemind: {
                content: function() {
                    if (remindData.OtherRemind && remindData.OtherRemind.content)
                        return remindData.OtherRemind.content;
                    return ''
                }()
            }

        };

        if (remindData.id)
            $scope.remindData.id = remindData.id;

        function submitRemindData(data) {
            if (!data.OtherRemind)
                return toaster.pop('error', null, '请输入提醒内容');

            var param = {
                access_token: app.url.access_token,
                sendTime: data.sendTime,
                carePlanId: data.carePlanId,

                schedulePlanId: data.schedulePlanId,
                dateSeq: data.dateSeq,
                jsonData: JSON.stringify(data.OtherRemind)
            }

            if (data.id)
                param.id = data.id;

            $http.post(app.urlRoot + 'designer/saveOtherRemind', param)
                .then(function(rpn) {
                    rpn = rpn.data;
                    if (rpn && rpn.resultCode == 1) {
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
            submitRemindData($scope.remindData);
        };

    };

})();
