(function() {
    angular.module('app')
        .controller('threeWayCallingCtrl', threeWayCallingCtrl);

    // 手动注入依赖
    threeWayCallingCtrl.$inject = ['$scope', '$state', 'moment', '$timeout', '$stateParams', 'ThreeWayCallingFactory', 'toaster'];

    // 三方通话控制器
    function threeWayCallingCtrl($scope, $state, moment, $timeout, $stateParams, ThreeWayCallingFactory, toaster) {

        $scope.cancel = function(argument) {
            $state.go('order.schedule');
        }

        if (!$stateParams.order)
            return $state.go('order.schedule');

        // 订单,导医,医生,患者
        $scope.order = $stateParams.order;

        // 获取用户数据
        var user = JSON.parse(localStorage['user']);
        $scope.user = user;

        // 创建会议
        $scope.createConference = function(orderId) {

            var param = {
                access_token: localStorage['guider_access_token'],
                orderId: orderId,
            }

            ThreeWayCallingFactory
                .createConference(param)
                .then(thenFc)

            function thenFc(response) {
                response = response.data;
                if (response.resultCode == 1) {
                    response = response.data;
                    if (response.code == 0) {
                        //$scope.callRecordId = response.confId;
                        $scope.confId=response.confId;
                        conferenceGetStatusPulling();

                    } else {

                        toaster.pop('error', null, '会议创建失败');
                    }
                } else if (response.resultMsg) {
                    toaster.pop('error', null, response.resultMsg);
                } else {
                    toaster.pop('error', null, '接口调用失败');
                }
            }
        }

        // 解散三方通话
        $scope.dismissConference = function() {


            var param = {
                access_token: localStorage['guider_access_token'],
                callRecordId: $scope.callRecordId
            }

            ThreeWayCallingFactory
                .dismissConference(param)
                .then(thenFc)

            function thenFc(response) {
                if (response.code == 0) {
                    toaster.pop('success', null, '关闭成功');
                    $state.go('order.schedule');
                } else {
                    console.warn(response.reason);
                    toaster.pop('error', null, response.reason);
                }

            }

        }

        // 禁听患者
        $scope.deafConference = function() {
            var param = {
                access_token: localStorage['guider_access_token'],
                callRecordId: $scope.callRecordId,
                userId: $scope.role.patient.id
            }

            ThreeWayCallingFactory
                .deafConference(param)
                .then(thenFc)

            function thenFc(response) {
                if (response.code == 0) {
                    // toaster.pop('success', null, '关闭成功');
                } else {
                    toaster.pop('error', null, response.reason);
                }
            }
        }

        // 取消禁听患者
        $scope.unDeafConference = function() {


            var param = {
                access_token: localStorage['guider_access_token'],
                callRecordId: $scope.callRecordId,
                userId: $scope.role.patient.id
            }

            ThreeWayCallingFactory
                .unDeafConference(param)
                .then(thenFc)

            function thenFc(response) {
                if (response.code == 0) {
                    // toaster.pop('success', null, '关闭成功');
                } else {
                    toaster.pop('error', null, response.reason);
                }
            }

        }

        // 加入会议
        $scope.inviteMember = function(id) {


            var param = {
                access_token: localStorage['guider_access_token'],
                callRecordId: $scope.callRecordId,
                userId: id
            }

            ThreeWayCallingFactory
                .inviteMember(param)
                .then(thenFc)

            function thenFc(response) {
                // console.log(response);
                if (response.code == 0) {
                    // toaster.pop('success', null, '关闭成功');
                } else {
                    toaster.pop('error', null, response.reason);
                }
            }

        }

        // 退出会议
        $scope.removeConference = function(id) {
            var param = {
                access_token: localStorage['guider_access_token'],
                callRecordId: $scope.callRecordId,
                userId: id
            }

            ThreeWayCallingFactory
                .removeConference(param)
                .then(thenFc)

            function thenFc(response) {
                // console.log(response);
                if (response.code == 0) {
                    // toaster.pop('success', null, '关闭成功');
                } else {
                    toaster.pop('error', null, response.reason);
                }
            }

        }


        ////////////////////// 电话会议轮询//////////////
        var refreshStep = 1000;
        var conferenceGetStatusTimer = null;

        function conferenceGetStatusPulling() {
            conferenceGetStatus();

            // 导医被移除三方通话
            //if (setScenario()) {
            //    if (setScenario() == 12 || setScenario() == 13)
            //        return;
            //}
            if (!$state.is('order.schedule.threeWayCalling')) {
                return
            }

            // 保持只有一个计时器
            if (conferenceGetStatusTimer)
                $timeout.cancel(conferenceGetStatusTimer);

            conferenceGetStatusTimer = $timeout(conferenceGetStatusPulling, refreshStep);
        }


        function conferenceGetStatus() {
            var param = {
                access_token: localStorage['guider_access_token'],
                confId: $scope.confId
            }

            ThreeWayCallingFactory
                .conferenceGetStatus(param)
                .then(thenFc)

            function thenFc(response) {
                if (response) {
                    if (response.list)
                        $scope.role = {};
                    for (var i = 0; i < response.list.length; i++) {
                        if (response.list[i].type == 1)
                            $scope.role.patient = response.list[i];
                        if (response.list[i].type == 2)
                            $scope.role.guider = response.list[i];
                        if (response.list[i].type == 3)
                            $scope.role.doctor = response.list[i];
                    }
                    if(response.recordId){
                        $scope.callRecordId=response.recordId;
                    }
                }

            }

        }

        // 监听三方通话状态
        $scope.$watch('role', function(newValue, oldValue, scope) {

            if (newValue == oldValue)
                return;

            $scope.scenarioType = setScenario();
        });

        /**
         *判断不同类型显示不同内容
         */
        function setScenario() {
            if ($scope.role) {
                if ($scope.role.patient && $scope.role.guider && $scope.role.doctor) {
                    if ($scope.role.patient.status == 20 && $scope.role.guider.status == 30 && $scope.role.doctor.status == 0) {
                        //'场景1 正在拨打患者电话 导医已经接入状态';
                        $scope.result = '您已接入，正在为您拨通患者';
                        return 1;
                    } else if ($scope.role.patient.status == 30 && $scope.role.guider.status == 30 && $scope.role.doctor.status == 0) {
                        //'场景2 患者已经接通电话 允许禁听患者 拨打导医状态';
                        $scope.result = '您已确认接通患者，此时可以禁听患者\n开始拨通医生';
                        return 2;
                    } else if ($scope.role.patient.status == 30 && $scope.role.guider.status == 30 && $scope.role.doctor.status == 50) {
                        //'场景2.1 患者已经接通电话 允许禁听患者 此时已拨打过医生， 但是医生未接 导医通话中状态';
                        $scope.result = '医生未接，您可以与患者协商再预约时间并关闭会议\n或禁听后再次拨打医生';
                        return 2.1;
                    } else if ($scope.role.patient.status == 35 && $scope.role.guider.status == 30 && $scope.role.doctor.status == 0) {
                        //'场景3 患者已经被禁听 可以去拨打医生的状态或者医生未接状态';
                        $scope.result = '您已禁听患者，请立刻拨通医生';
                        return 3;
                    } else if ($scope.role.patient.status == 35 && $scope.role.guider.status == 30 && $scope.role.doctor.status == 20) {
                        //'场景4 患者已经被禁听 正在拨打医生的电话';
                        $scope.result = '正在拨通医生中';
                        return 4;
                    } else if ($scope.role.patient.status == 35 && $scope.role.guider.status == 30 && $scope.role.doctor.status == 30) {
                        //'场景5 患者已经被禁听 医生已经接通电话';
                        $scope.result = '取消患者禁听，同时您会被移除通话';
                        return 5;
                    } else if ($scope.role.patient.status == 35 && $scope.role.guider.status == 30 && $scope.role.doctor.status == 50) {
                        //'场景6 患者已经被禁听 医生并未接听电话';
                        $scope.result = '医生未接通，您可以再次拨通医生\n或取消患者禁听';
                        return 6;
                    } else if ($scope.role.patient.status == 35 && $scope.role.guider.status == 30 && ($scope.role.doctor.status == 41 || $scope.role.doctor.status == 43)) {
                        //'场景6.1 患者已经被禁听 医生接通后挂断了';
                        $scope.result = '医生已挂断，可以取消患者禁听\n与患者协商或重新拨打医生';
                        return 6.1;
                    } else if ($scope.role.doctor.status == 0 && $scope.role.guider.status == 30 && $scope.role.patient.status == 50) {
                        //'场景7 患者未接通 导医可以重拨患者状态 此次未拨打医生';
                        $scope.result = '患者未接听，您可以重拨患者';
                        return 7;
                    } else if ($scope.role.doctor.status == 0 && $scope.role.guider.status == 30 && ($scope.role.patient.status == 41 || $scope.role.patient.status == 43)) {
                        //'场景7.1 患者已接听 但又挂断了 导医可以重拨患者状态 此次未拨打医生';
                        $scope.result = '患者已挂断，您需要重拨患者';
                        return 7.1;
                    } else if ($scope.role.doctor.status == 30 && $scope.role.guider.status == 30 && ($scope.role.patient.status == 43 || $scope.role.patient.status == 41)) {
                        //'场景8 医生接通了 但是患者已经挂断电话了';
                        $scope.result = '患者已离开，请您立即拨通患者\n患者接通后，您会被移除通话';
                        return 8;
                    } else if ($scope.role.doctor.status == 50 && $scope.role.guider.status == 30 && ($scope.role.patient.status == 43 || $scope.role.patient.status == 41)) {
                        //'场景9 医生未接通 并且患者已经挂断电话了';
                        $scope.result = '患者已离开，您可以重拨患者再次邀请';
                        return 9;
                    } else if (($scope.role.guider.status == 41 || $scope.role.guider.status == 50) && $scope.role.doctor != 30 && $scope.role.patient != 30) {
                        //'场景10 导医自己挂断了';
                        $scope.result = '您断开了通话，请点击下方按钮重新接听。';
                        return 10;
                    } else if ($scope.role.guider.status == 20 && $scope.role.patient.status == 0 && $scope.role.doctor.status == 0) {
                        //'场景11 导医等待接电话 医生患者还未拨通时';
                        $scope.result = '玄关健康平台正在拨通您的电话，\n请及时接听。';
                        return 11;
                    } else if ($scope.role.guider.status == 42 && $scope.role.doctor.status == 30 && $scope.role.patient.status == 30) {
                        //'场景12 患者医生正在沟通中， 导医被移除三方通话';
                        $scope.result = '患者与医生已经接通，请点击下方按钮退出三方通话';
                        return 12;
                    } else if (($scope.role.guider.status == 42 || $scope.role.guider.status == 43) && ($scope.role.doctor != 30 || $scope.role.patient != 30)) {
                        //'场景13 导医被移除， 且医生或者患者结束了三方通话';
                        $scope.result = '患者与医生已经接通，请点击下方按钮退出三方通话';
                        return 13;
                    } else if ($scope.role.guider.status == 30 && $scope.role.doctor.status == 30 && $scope.role.patient.status == 20) {
                        //'场景14 导医和医生已经在通话中 正在拨打患者';
                        $scope.result = '医生已接听，正在为您拨通患者。';
                        return 14;
                    } else if ($scope.role.guider.status == 30 && $scope.role.doctor.status == 30 && $scope.role.patient.status == 30) {
                        //'场景15 患者和导医和医生已经在通话中 正在拨打患者';
                        $scope.result = '三方通话中。';
                        return 15;
                    }else if ($scope.role.guider.status == 20 && $scope.role.doctor.status == 0 && $scope.role.patient.status == 35) {
                        //'场景11 重新接通导医';
                        $scope.result = '玄关健康平台正在拨通您的电话，\n请及时接听。';
                        return 11;
                    }else if ($scope.role.guider.status == 20 && $scope.role.doctor.status == 35 && $scope.role.patient.status == 20) {
                        //'场景11 重新接通导医';
                        $scope.result = '玄关健康平台正在拨通您的电话，\n请及时接听。';
                        return 11;
                    }else if ($scope.role.guider.status == 20 && $scope.role.doctor.status == 0 && $scope.role.patient.status == 30) {
                        //'场景11 重新接通导医';
                        $scope.result = '玄关健康平台正在拨通您的电话，\n请及时接听。';
                        return 11;
                    }
                }
            }
            return null;
        };

    };
})();
