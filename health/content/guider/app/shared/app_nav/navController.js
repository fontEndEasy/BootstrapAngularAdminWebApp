// ============================== appNavController.js =================================
(function() {
    angular.module('app')
        .controller('AppNavCtrl', AppNavCtrl);

    // 手动注入依赖
    AppNavCtrl.$inject = ['$scope', '$state', 'AppNavFactory', '$timeout', '$rootScope','ChangePwdModalFactory','toaster'];

    // 登录控制器
    function AppNavCtrl($scope, $state, AppNavFactory, $timeout, $rootScope,ChangePwdModalFactory,toaster) {

        var userId=JSON.parse(localStorage.getItem('user')).id;

        // 路由改变
        $rootScope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams) {
                // console.log(event, toState, toParams, fromState, fromParams);
                $scope.isopen = false;
            });
        window.onbeforeunload=function(){
            return '';
        };

        $scope.signOut = function() {

            var param = {
                access_token: localStorage['guider_access_token']
            }

            // 退出登录
            AppNavFactory
                .getData(param)
                .then(thenFc);

            function thenFc(response) {
                if (response.data.resultMsg) {
                    console.log(response.data.resultMsg);
                }
                localStorage.removeItem('user');
                localStorage.removeItem('guider_access_token');
                // localStorage.removeItem('guider_access_token');

                $state.go('signin');
            }
        };

        if (!localStorage['user'])
            return $scope.signOut();

        $scope.user = JSON.parse(localStorage['user']);



        //////////////////////// 通知轮询 /////////////////
        if (localStorage['MsgListNewDataAcount']){
            $scope.MsgListNewDataAcount = +localStorage['MsgListNewDataAcount'];
        }
        var refreshStep = 10000;
        var getMsgListTimer = null;

        var getScheduleCountTimer=null;

        getMsgListPolling();

        function getMsgListPolling() {
            if ($scope.msgList&&$scope.msgList.length>0) {
                getMsgList(0, $scope.msgList[$scope.msgList.length - 1].msgId);
            } else {
                getMsgList();
            }

            // 保持只有一个计时器
            if (getMsgListTimer)
                $timeout.cancel(getMsgListTimer);

            getMsgListTimer = $timeout(getMsgListPolling, refreshStep);

        }


        //获取未完成日程统计
        $rootScope.getScheduleCount=function(){
            var param={
                access_token: localStorage['guider_access_token'],
                userId:userId
            };
            AppNavFactory.getNoServiceSchedule(param).then(thenFc);
            function thenFc(response){
                if(response&&response.data&&response.data.data){
                    $scope.noServiceScheduleCount=response.data.data;
                }
            }
        };

        getScheduleCountPolling();
        function getScheduleCountPolling() {
            $rootScope.getScheduleCount();

            // 保持只有一个计时器
            if (getScheduleCountTimer)
                $timeout.cancel(getScheduleCountTimer);

            getScheduleCountTimer = $timeout(getScheduleCountPolling, refreshStep);

        }



        // 获取消息
        function getMsgList(type, msgId) {

            var param = {
                access_token: localStorage['guider_access_token'],
                cnt: 20,
                groupId: 'GROUP_002',
                userId: $scope.user.id
            };

            if (msgId && (type == 0 || type == 1)) {
                param.msgId = msgId;
                param.type = type;
            }

            AppNavFactory
                .getMsgList(param)
                .then(thenFc);

            function thenFc(response) {

                if (response) {
                    // 本地没有数据
                    if (!$scope.msgList) {
                        if (response.msgList) {

                            $scope.msgList = response.msgList;
                        }
                    }
                    // 本地有数据
                    else {
                        if (response.msgList) {

                            if (response.msgList.length > 0) {

                                // 获取新数据
                                if (type == 0) {

                                    $scope.MsgListNewDataAcount = ($scope.MsgListNewDataAcount ? $scope.MsgListNewDataAcount : 0) + response.msgList.length;
                                    localStorage['MsgListNewDataAcount'] = $scope.MsgListNewDataAcount;

                                    var index = null;
                                    for (var i = 0; i < response.msgList.length; i++) {
                                        if (response.msgList[i].msgId == $scope.msgList[$scope.msgList.length - 1].msgId) {
                                            index = i;
                                            break;
                                        }
                                    }

                                    if (index) {

                                        for (var j = index + 1; j < response.msgList.length; j++) {
                                            $scope.msgList.push(response.msgList[j]);
                                        }

                                    } else {

                                        for (var j = 0; j < response.msgList.length; j++) {
                                            $scope.msgList.push(response.msgList[j]);
                                        }

                                    }
                                }

                                // 获取旧数据
                                else if (type == 1) {

                                    $scope.msgList = response.msgList.concat($scope.msgList);

                                }

                            }

                        }

                    }
                }


            }

        }

        $scope.getMsgListOldData = function() {
            if ($scope.msgList) {
                if ($scope.msgList[0])
                    getMsgList(1, $scope.msgList[0].msgId);
            }

        };

        $scope.clearMsgNewAcount = function($event) {
            $scope.MsgListNewDataAcount = 0;
            localStorage['MsgListNewDataAcount'] = $scope.MsgListNewDataAcount;
            $event.stopPropagation()
        };

        //修改密码
        $scope.openChangePwdModal=function(){
            ChangePwdModalFactory.openChangePwdModal('md');
        };

    };

})();
