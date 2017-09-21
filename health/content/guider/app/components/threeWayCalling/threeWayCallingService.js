(function() {
    angular.module('app')
        .factory('ThreeWayCallingFactory', ThreeWayCallingFactory);

    function ThreeWayCallingFactory($http) {
        return {
            createConference: createConference,
            dismissConference: dismissConference,
            conferenceGetStatus: conferenceGetStatus,
            deafConference: deafConference,
            unDeafConference: unDeafConference,
            inviteMember: inviteMember,
            removeConference: removeConference
        };
        // 退出会议
        function removeConference(param) {

            return $http.post(app.api.conference.removeConference, param)
                .then(getListsComplete)
                .catch(getListsFailed);

        };

        // 邀请加入会议
        function inviteMember(param) {

            return $http.post(app.api.conference.inviteMember, param)
                .then(getListsComplete)
                .catch(getListsFailed);

        };
        // 取消禁听
        function unDeafConference(param) {

            return $http.post(app.api.conference.unDeafConference, param)
                .then(getListsComplete)
                .catch(getListsFailed);

        };
        // 禁听
        function deafConference(param) {

            return $http.post(app.api.conference.deafConference, param)
                .then(getListsComplete)
                .catch(getListsFailed);

        };
        // 开启三方通话
        function conferenceGetStatus(param) {

            return $http.post(app.api.conference.conferenceGetStatus, param)
                .then(getListsComplete)
                .catch(getListsFailed);

        };
        // 开启三方通话
        function createConference(param) {

            return $http.post(app.api.conference.createConference, param)
                .catch(getListsFailed);

        };
        // 解散三方通话
        function dismissConference(param) {

            return $http.post(app.api.conference.dismissConference, param)
                .then(getListsComplete)
                .catch(getListsFailed);

        };
    }

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
