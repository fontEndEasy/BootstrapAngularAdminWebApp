(function() {
    angular.module('app')
        .controller('DoctorInfoDailogCtrl', DoctorInfoDailogCtrl)
        .controller('DoctorInfoDailogModalInstanceCtrl', DoctorInfoDailogModalInstanceCtrl);

    DoctorInfoDailogCtrl.$inject = ['$scope', '$uibModal', '$log'];

    function DoctorInfoDailogCtrl($scope, $uibModal, $log) {

        $scope.open = function(doctorId, gId,type,callback) {
            var data = {};
            data.gId = gId;
            data.type = type;

            var size = '';

            if (type == 1) {
                size = 'lg'
            } else if (type == 2) {
                size = 'lg'
            }

            var modalInstance = $uibModal.open({
                templateUrl: 'doctorInfoDailogBox.html',
                controller: 'DoctorInfoDailogModalInstanceCtrl',
                size: size,
                resolve: {
                    doctorId: doctorId,
                    data: data,
                    goRunning: $scope.goRunning
                }
            });

            modalInstance.result.then(function (returnMsg) {
                if(callback){
                    callback();
                }
            }, function () {

            });
        };

    };

    DoctorInfoDailogModalInstanceCtrl.$inject = ['$scope', '$uibModalInstance', 'DoctorInfoDailogFtory', '$filter', 'moment', 'toaster', 'doctorId', 'goRunning', 'data','$http'];

    function DoctorInfoDailogModalInstanceCtrl($scope, $uibModalInstance, DoctorInfoDailogFtory, $filter, moment, toaster, doctorId, goRunning, data,$http) {
        $scope.timeSelectSataus=false;
        $scope.callView={};
        var timeSelPanelClick=false;
        $scope.triggerClick=function($event){
            if(timeSelPanelClick){
                return;
            }
            else{
                $scope.showTimeSelector=false;
                timeSelPanelClick=false;
            }
        };


        $scope.timeSelectClick=function($event){
            if($event.target.id=='timeSelector'){
                timeSelPanelClick=true;
            }
            $event.stopPropagation();
        };

        $scope.changeTimeSelPanel=function($event){
            $scope.showTimeSelector=!$scope.showTimeSelector;
            $event.stopPropagation();
        }


        // 获取用户数据
        var user = JSON.parse(localStorage['user']);


        $scope.data = {
            info: {},
            introduce: {},
            remarks: {},
            doctorInfo: {},
            itemData: {},
            goRunning: goRunning,
            gId: data.gId,
            type: data.type
        };

        getDoctorIntroduce(doctorId);
        getDoctorInfo(doctorId);
        getRemarks(doctorId);
        doctorInfo(doctorId);

        if ($scope.data.type == 2)
            query(doctorId);

        // 获取医生基本信息
        function getDoctorInfo(doctorId) {

            $scope.infoIsloading = true;
            var param = {
                access_token: localStorage['guider_access_token'],
                doctorId: doctorId
            };

            DoctorInfoDailogFtory
                .basicInfo(param)
                .then(thenFc)

            function thenFc(response) {
                $scope.infoIsloading = false;
                $scope.data.info = response;

            }
        }

        // 获取医生介绍
        function getDoctorIntroduce(doctorId) {
            $scope.introduceIsloading = true;
            var param = {
                access_token: localStorage['guider_access_token'],
                userId: doctorId
            }

            DoctorInfoDailogFtory
                .getIntro(param)
                .then(thenFc)

            function thenFc(response) {
                $scope.introduceIsloading = false;
                $scope.data.introduce = response;

            }
        }

        // 获取医生备注
        function getRemarks(doctorId) {
            $scope.remarksIsloading = true;
            var param = {
                access_token: localStorage['guider_access_token'],
                userId: doctorId
            }

            DoctorInfoDailogFtory
                .getRemarks(param)
                .then(thenFc)

            function thenFc(response) {
                $scope.remarksIsloading = false;
                $scope.data.remarks = response;

            }
        }

        // 修改备注
        $scope.setRemarks = function(value) {

            $scope.setRemarksIsloading = true;
            var param = {
                access_token: localStorage['guider_access_token'],
                userId: doctorId,
                remarks: value
            }

            DoctorInfoDailogFtory
                .setRemarks(param)
                .then(thenFc)

            function thenFc(response) {
                $scope.setRemarksIsloading = false;
                if (response) {
                    toaster.pop('success', null, '修改成功');
                } else {
                    toaster.pop('error', null, '修改失败');
                }
            }
        }

        // 获取医生信息
        function doctorInfo(doctorId) {
            var param = {
                access_token: localStorage['guider_access_token'],
                doctorId: doctorId
            }

            DoctorInfoDailogFtory
                .doctorInfo(param)
                .then(thenFc)

            function thenFc(response) {
                $scope.data.doctorInfo = response;

                if (response)
                        $scope.dateArry = response.timeList||[];
                        $scope.remarkList = response.remarkList||[];

            }
        }

        // 查询套餐
        function query(doctorId) {
            var param = {
                access_token: localStorage['guider_access_token'],
                doctorId: doctorId,
                packType: 2,
                status:1
            }

            DoctorInfoDailogFtory
                .query(param)
                .then(thenFc)

            function thenFc(response) {
                if (response)
                    $scope.data.itemData = response[0];

            }
        }



        // 关闭弹窗
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };


        // 选择医生可预约的时间
        $scope.selected = function(index) {
            for (var i = 0; i < $scope.dateArry.length; i++) {
                if (index == i) {
                    $scope.dateArry[i].isSelected = !$scope.dateArry[i].isSelected;
                } else {
                    $scope.dateArry[i].isSelected = false;
                }
            }

            if($scope.dateArry[index].isSelected==true){
                $scope.selectedDate = $scope.dateArry[index];
                $scope.timeSelectSataus=true;
            }
            else{
                $scope.selectedDate=null;
                $scope.timeSelectSataus=false;
            }
        }


        // 预约医生
        $scope.appointTime = function(packId) {
            //如果带上预约时间
            if($scope.selectedDate){
                $scope.appointTimeLoading = true;
                var startTime = moment($scope.selectedDate.start).unix();
                var endTime = moment($scope.selectedDate.start).add(30, 'minutes').unix();

                var param = {
                    access_token: localStorage['guider_access_token'],
                    gid: $scope.data.gId,
                    startTime: startTime * 1000,
                    endTime: endTime * 1000,
                    type:3
                };

                if (packId) {
                    param.packId = packId;
                }
                $scope.disableSend=true;
                DoctorInfoDailogFtory
                    .appointTime(param)
                    .then(function(response){
                        $scope.appointTimeLoading = false;
                        if (response) {
                            console.log($scope.data.goRunning);

                            if ($scope.data.goRunning){
                                $scope.data.goRunning();
                            }

                            $uibModalInstance.close('sentSuccess');
                            toaster.pop('success', null, '预约成功');
                        } else {
                            toaster.pop('error', null, '预约失败');
                            $scope.disableSend=false;
                        }
                    });
            }
            //没有带上预约时间
            else{
                var param = {
                    access_token: localStorage['guider_access_token'],
                    gid: $scope.data.gId,
                    type:3
                };

                if (packId) {
                    param.packId = packId;
                }

                DoctorInfoDailogFtory
                    .appointTime(param)
                    .then(function(response){
                        $scope.appointTimeLoading = false;
                        if (response) {
                            console.log($scope.data.goRunning);

                            if ($scope.data.goRunning){
                                $scope.data.goRunning();
                            }

                            $uibModalInstance.close('sentSuccess');
                            toaster.pop('success', null, '预约成功');
                        } else {
                            toaster.pop('error', null, '预约失败');
                        }
                    });
            }

        }

        ////////////////////////// 时间编辑器


        // 添加医生可预约时间
        $scope.submitNewDate = function(date) {

            var startTime = moment(date).unix();
            var endTime = moment(date).add(30, 'minutes').unix();

            var param = {
                access_token: localStorage['guider_access_token'],
                doctorId: doctorId,
                startTime: startTime * 1000,
                endTime: endTime * 1000
            };

            DoctorInfoDailogFtory
                .addDocTime(param)
                .then(thenFc);

            function thenFc(response) {
                $scope.submitNewDateLoading = false;
                if (response) {
                    doctorInfo(doctorId);
                } else {
                    toaster.pop('error', null, '可预约时间重复，请修改后重新添加');
                }

            }
        }

        // 删除医生可预约时间
        $scope.removeDateLoading = false;
        $scope.removeDate = function(date) {

            $scope.removeDateLoading = true;
            var startTime = moment(date).unix();
            var endTime = moment(date).add(30, 'minutes').unix();

            var param = {
                access_token: localStorage['guider_access_token'],
                doctorId: doctorId,
                startTime: startTime * 1000,
                endTime: endTime * 1000
            }

            DoctorInfoDailogFtory
                .removeDocTime(param)
                .then(thenFc)

            function thenFc(response) {
                $scope.removeDateLoading = false;
                if (response) {
                    toaster.pop('success', null, '删除成功');
                    doctorInfo(doctorId);
                } else {
                    toaster.pop('error', null, '删除失败');
                }

            }

            console.log($scope.dateArry);
        }

        // 设置时间
        function setFreeDate() {
            var now = moment(new Date()).format('YYYY-MM-DD H');
            var minute = moment(new Date()).format('mm');
            if (minute > 30) {
                now = moment(new Date()).add(1, 'hours').format('YYYY-MM-DD H');
                now = now + ':00';
            } else {
                now = now + ':30';
            }

             now = moment(now).unix()*1000;
            return now;

        }

        $scope.addDate = new Date(setFreeDate());

        $scope.minDate = new Date();

        $scope.dateOptions = {
            class: 'datepicker'
        };

        //添加备注
        $scope.addDocRemarks=function(){
            $scope.remarkList.unshift(
                {
                    doctorId:user.id,
                    guideName:user.name||'导医'+user.id,
                    createTime:'',
                    remark:'',
                    isNew:true
                });

            setTimeout(function(){
                var remarkListContent=document.getElementById('remarkListContent');
                remarkListContent.scrollTop=document.getElementById('remarkListContent').scrollHeight;
            },10);
        };


        //更新备注
        $scope.updateDocRemarks=function(item){
            if(item.remark===''){
                toaster.pop('warm', null, '备注不能为空');
                return;
            }

            //更新
            $http.post(app.api.doctor.addDocRemark, {
                access_token:localStorage['guider_access_token'],
                doctorId:doctorId,
                guideId:user.id,
                guideName:user.name||'导医'+user.id,
                remark:item.remark
            }).
            success(function(data, status, headers, config) {
                if(data.resultCode==1){
                    $scope.remarkList=data.data.remarkList;
                    toaster.pop('success', null, '修改成功');
                }
                else{
                    toaster.pop('error', null, '修改失败');
                }
            }).
            error(function(data, status, headers, config) {
                toaster.pop('error', null, data.resultMsg);
            });

        };

        // 拨打电话
        $scope.callPhone = function(toTel, fromTel) {
            $scope.call = {};
            $scope.call.isCalling = true;

            if (!fromTel) var fromTel = user.telephone;

            var param = {
                access_token: localStorage['guider_access_token'],
                toTel: toTel,
                fromTel: fromTel
            }

            DoctorInfoDailogFtory
                .callByTel(param)
                .then(thenFc)

            function thenFc(response) {
                $scope.call.isCalling = false;

                if (!response) {
                    $scope.call.result = {
                        type: false,
                        content: '接口调用失败'
                    };
                    return;
                }

                if (!response.resp) {
                    $scope.call.result = {
                        type: false,
                        content: '接口调用失败'
                    };
                    return;
                }

                //成功
                if (response.resp.respCode == '000000') {
                    //$scope.call.result = {
                    //    type: true,
                    //    content: '拨打成功'
                    //};
                    $scope.callView.isOpen=false;
                    $scope.call = {};
                    toaster.pop('success',null,'拨打成功');
                }

                if (response.resp.respCode !== '000000') {
                    $scope.call.result = {
                        type: false,
                        content: '拨打失败'
                    }
                }
            }

        };

        //发送等待或者没时间
        $scope.sendAbort=function(type){
            $scope.disableSend=true;
            $scope.appointTimeLoading=true;
            $http.post(app.api.order.sendCardEvent, {
                access_token:localStorage['guider_access_token'],
                type: type,
                guideOrderId:$scope.data.gId,
                recommendDoctorId:doctorId
            }).
            success(function(data, status, headers, config) {
                if ($scope.data.goRunning){
                    $scope.data.goRunning();
                }
                if(data.resultCode==1){
                    toaster.pop('success', null, '发送成功');
                    $uibModalInstance.close('sentSuccess');
                }
                else{
                    toaster.pop('error', null, '发送失败');
                    $scope.disableSend=false;
                    $scope.appointTimeLoading=false;
                }
            }).
            error(function(data, status, headers, config) {
                alert(data.resultMsg);
            });
        };

        //关闭电话对话框
        $scope.closeCallView=function(){
            $scope.call={};
            $scope.callView.isOpen=false;
        }

    }

})();
