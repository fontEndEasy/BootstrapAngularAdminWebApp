(function() {
    angular.module('app')
        .factory('ChatImgSelModalFactory', ChatImgSelModalFactory);

    // 手动注入依赖

    ChatImgSelModalFactory.$inject = ['$http','$uibModal'];

    function ChatImgSelModalFactory($http,$uibModal) {
        return {
            openChatImgSelModal:openChatImgSelModal,
            findDoctorByDept: findDoctorByDept,
            getDiseaseTree: getDiseaseTree,
            getAllDepts: getAllDepts
        };


        //打开图片选择模态框
        function openChatImgSelModal(imgs,guideId,size,callback){
            console.log(imgs);
            var modalInstance = $uibModal.open({
                templateUrl: 'app/shared/chatImgSelModal/chatImgSelModalTpl.html',
                controller: 'ChatImgSelModalInstanceCtrl',
                size: size,
                resolve: {
                    images: function () {
                        return imgs;
                    },
                    gId:function(){
                        return guideId;
                    }
                }
            });

            modalInstance.result.then(function (selectedItems) {
                callback(selectedItems);
            }, function () {

            });
        }



        // 获取全部科室
        function getAllDepts(param) {

            return $http.post(app.api.shared.getAllDepts, param)
                .then(getListsComplete)
                .catch(getListsFailed);
        };

        // 医生集团搜索 - 根据病种搜索医生
        function findDoctorByDept(param) {

            return $http.post(app.api.doctor.findDoctorByDept, param)
                .then(getListsComplete)
                .catch(getListsFailed);
        };

        // 获取全部病种树
        function getDiseaseTree(param) {

            return $http.post(app.api.shared.getDiseaseTree, param)
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
