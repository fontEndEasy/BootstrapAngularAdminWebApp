(function() {
    angular.module('app')
        .factory('SearchDoctorDialogFtory', SearchDoctorDialogFtory);

    // 手动注入依赖

    SearchDoctorDialogFtory.$inject = ['$http'];

    function SearchDoctorDialogFtory($http) {
        return {
            findDoctorByDept: findDoctorByDept,
            getDiseaseTree: getDiseaseTree,
            getAllDepts: getAllDepts
        };

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
