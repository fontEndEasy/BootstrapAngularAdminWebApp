/**
 * Created by clf on 2016/3/4.
 */
(function() {
    angular.module('app')
        .controller('careCtrl', careCtrl);

    // 手动注入依赖
    careCtrl.$inject = ['$scope', '$interval', '$timeout', '$filter', '$sce', '$anchorScroll', '$location', '$state', 'Lightbox', '$http', 'ngAudio', 'toaster','DoctorInfoDailogFtory'];

    // 订单首页控制器
    function careCtrl($scope, $interval, $timeout, $filter, $sce, $anchorScroll, $location, $state, Lightbox, $http, ngAudio, toaster,DoctorInfoDailogFtory) {
        var user=JSON.parse(localStorage.getItem('user'));
        $scope.isShowWait=false;
        $scope.handleCareOrderList=[];
        $scope.careDetail=null;
        $scope.remindDocs=[];
        $scope.notRemindDocs=[];
        $scope.currentCare=null;
        $scope.currentCallViewInfo={};
        $scope.remarkList=[];

        getHandleCareOrder();
        heathWaitOrderList();

        //获取正在接单数据
        function getHandleCareOrder(){
            $http.post(app.api.care.getHandleCareOrder, {
                access_token:localStorage['guider_access_token']
            }).
            success(function(data, status, headers, config) {
                if(data.resultCode==1){
                    data.data.forEach(function(item,index,array){
                        if(item.waitTime){
                            item.timeString=convertTime(item.waitTime);
                        }
                        else{
                            item.timeString='';
                        }
                    });
                    $scope.handleCareOrderList=data.data;
                    if(!$scope.currentCare){
                        if($scope.handleCareOrderList.length>0){
                            $scope.handel($scope.handleCareOrderList[0]);
                        }
                    }
                }
                else{
                    console.warn(data.resultMsg);
                }
            }).
            error(function(data, status, headers, config) {
                if(data&&data.resultMsg){
                    console.warn(data.resultMsg);
                }
            });
        }

        //获取等待接单数据
        function heathWaitOrderList(){
            $http.post(app.api.care.heathWaitOrderList, {
                access_token:localStorage['guider_access_token']
            }).
            success(function(data, status, headers, config) {
                if(data.resultCode==1){
                    $scope.waitOrderList=data.data;
                    data.data.forEach(function(item,index,array){
                        item.timeString=convertTime(item.waitTime);
                    });
                }
                else{
                    console.warn(data.resultMsg);
                }
            }).
            error(function(data, status, headers, config) {
                if(data&&data.resultMsg){
                    console.warn(data.resultMsg);
                }
            });
        }

        //将时间戳转换为时间
        function convertTime(timeStamp){
            var date = new Date(timeStamp);
            var dayStr=date.getUTCDate()-1==0?'':date.getUTCDate()-1+'天';
            var hoursStr = date.getUTCHours()+'小时';
            var minutesStr = date.getUTCMinutes()+'分钟';
            return dayStr+hoursStr+minutesStr+'前';
        }

        //将时间戳转换为时间
        //function convertTime(ts){
        //    var dateLeft = parseInt(ts / 86400000); //折合天数
        //    ts = ts - dateLeft * 86400000; //剩余秒数
        //    var hourLeft = parseInt(ts / 3600000); //折合小时
        //    ts = ts - hourLeft * 3600000; //剩余秒数
        //    var minuteLeft = parseInt(ts / 60000); //折合分钟
        //
        //    var dateStr=dateLeft==0?'':dateLeft+'天';
        //    return dateStr+hourLeft+'小时'+minuteLeft+'分钟前';
        //}

        //轮询
        var polling=setInterval(function(){
            heathWaitOrderList();
            getHandleCareOrder();
            // 离开此页退出轮询
            if (!$state.is('order.care')){
                clearInterval(polling);
            }

        },1000*10);

        //点击接单
        $scope.receiveCareOrder=function(item){
            receiveCareOrder(item);//接单
            setTimeout(function(){
                getHandleCareOrder();//刷新正在接单数据
                heathWaitOrderList();//刷新等待接单数据
            },100);

        };

        function receiveCareOrder(item){
            $http.post(app.api.care.receiveCareOrder, {
                access_token:localStorage['guider_access_token'],
                orderId:item.orderId,
                careType:item.careType,
                careTemplateId:item.careTemplateId,
                fromId:item.fromId
            }).
            success(function(data, status, headers, config) {
                if(data.resultCode==1){
                    $scope.isShowWait=false;
                }
                else{
                    console.warn(data.resultMsg);
                }
            }).
            error(function(data, status, headers, config) {
                console.warn(data.resultMsg);
            });
        }

        //处理（点击每一项）
        $scope.handel=function(item){
            $scope.currentCare=item;
            //$scope.handleCareOrderList.forEach(function(item,index,array){
            //    item.selected=false;
            //});
            //item.selected=true;

            //获取关怀信息
            $http.post(app.api.care.getCareOrderDetail, {
                access_token:localStorage['guider_access_token'],
                orderId:item.orderId,
                careType:item.careType,
                fromId:item.fromId
            }).
            success(function(data, status, headers, config) {
                if(data.resultCode==1){
                    $scope.careDetail=data.data;
                    if(data.data.remark&&data.data.remark.remarkList){
                        $scope.remarkList=data.data.remark.remarkList;
                    }
                    else{
                        $scope.remarkList=[];
                    }
                }
                else{
                    toaster.pop('error',null,data.resultMsg);
                }
            }).
            error(function(data, status, headers, config) {
                    toaster.pop('error',null,data.resultMsg);
            });

            //获取医生列表
            $http.post(app.api.care.getDoctorTeam, {
                access_token:localStorage['guider_access_token'],
                orderId:$scope.currentCare.orderId
            }).
            success(function(data, status, headers, config) {
                if(data.resultCode==1){
                    $scope.remindDocs=data.data.filter(function(item,index,array){
                        return item.receiveRemind==1;
                    });

                    $scope.notRemindDocs=data.data.filter(function(item,index,array){
                        return item.receiveRemind==0;
                    });
                }
                else{
                    toaster.pop('error',null,data.resultMsg);
                }
            }).
            error(function(data, status, headers, config) {
                toaster.pop('error',null,data.resultMsg);
            });

            //获取备注列表
        };

        //结束处理
        $scope.closeCare=function(){
            $http.post(app.api.care.updateCareOrder, {
                access_token:localStorage['guider_access_token'],
                orderId:$scope.currentCare.orderId,
                careType:$scope.currentCare.careType,
                id:$scope.currentCare.id
            }).
            success(function(data, status, headers, config) {
                if(data.resultCode==1){
                    $scope.currentCare=null;
                    getHandleCareOrder();
                }
                else{
                    toaster.pop('error',null,data.resultMsg);
                }
            }).
            error(function(data, status, headers, config) {
                toaster.pop('error',null,data.resultMsg);
            });
        };

        //设置当前医生的电话
        $scope.setCurrentDocTel=function(item){
            item.callViewIsOpen=true;
            $scope.currentDocItem=item;
            //$scope.currentCallViewInfo={
            //    callViewIsOpen:true,
            //    currentDocTel:item.telephone
            //};
            $scope.call = {};
        };

        // 拨打电话
        $scope.callPhone = function() {
            $scope.call = {};
            $scope.call.isCalling = true;
            var toTel=$scope.currentDocItem.telephone;
            var fromTel = user.telephone;

            var param = {
                access_token: localStorage['guider_access_token'],
                toTel: toTel,
                fromTel: fromTel
            };


            $http.post(app.api.order.callByTel, param).
                success(function(data, status, headers, config) {
                    if(data.resultCode==1){
                        thenFc(data);
                    }
                    else{
                        console.warn(data.resultMsg);
                    }
                }).
                error(function(data, status, headers, config) {
                    console.warn(data.resultMsg);
                });

            function thenFc(response) {
                $scope.call.isCalling = false;

                if (!response) {
                    $scope.call.result = {
                        type: false,
                        content: '接口调用失败'
                    };
                    return;
                }

                if (!response.data) {
                    $scope.call.result = {
                        type: false,
                        content: '接口调用失败'
                    };
                    return;
                }

                if (!response.data.resp) {
                    $scope.call.result = {
                        type: false,
                        content: '接口调用失败'
                    };
                    return;
                }

                if (response.data.resp.respCode == '000000') {
                    $scope.call.result = {
                        type: true,
                        content: '拨打成功'
                    };
                    $scope.currentDocItem.callViewIsOpen=false;
                    $scope.call = {};
                    toaster.pop('success',null,'拨打成功');
                }

                if (response.data.resp.respCode !== '000000') {
                    $scope.call.result = {
                        type: false,
                        content: '拨打失败'
                    }
                }
            }
        };

        //添加备注
        $scope.addCareRemarks=function(){
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

        //点击确认添加
        $scope.updateCareRemarks=function(item){
            if(item.remark===''){
                toaster.pop('warn', null, '备注不能为空');
                return;
            }

            //更新备注
            $http.post(app.api.doctor.addDocRemark, {
                access_token:localStorage['guider_access_token'],
                doctorId:$scope.currentCare.orderId,
                guideId:$scope.currentCare.orderId,
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

        //显示医生信息
        $scope.showDocInfo=function(doctorId){
            DoctorInfoDailogFtory.openModal(doctorId, null,1,null);
        }
    }
})();
