(function() {
    angular.module('app')
        .factory('ChangePwdModalFactory', ChangePwdModalFactory);

    // 手动注入依赖

    ChangePwdModalFactory.$inject = ['$http','$uibModal'];

    function ChangePwdModalFactory($http,$uibModal) {
        return {
            openChangePwdModal:openChangePwdModal
        };

        //打开图片选择模态框
        function openChangePwdModal(size){
            var modalInstance = $uibModal.open({
                templateUrl: 'app/shared/changePwdModal/changePwdModalTpl.html',
                controller: 'ChangePwdModalInstanceCtrl',
                size: size
            });

            modalInstance.result.then(function () {
            }, function () {
            });
        }


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
