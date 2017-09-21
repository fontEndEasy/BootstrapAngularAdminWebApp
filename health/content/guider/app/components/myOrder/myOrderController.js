(function() {
    angular.module('app')
        .controller('myOrderCtrl', myOrderCtrl);

    // 手动注入依赖
    myOrderCtrl.$inject = ['$scope', '$state', 'moment', 'toaster', 'MyOrderFactory', 'EditorConsultingRecordFactory'];

    // 我的订单控制器
    function myOrderCtrl($scope, $state, moment, toaster, MyOrderFactory, EditorConsultingRecordFactory) {
        $scope.pageIndex = 0;
        $scope.pedding=true;

        $scope.getGuideNoServiceOrderClick=function(){
            $scope.orderlist=[];
            $scope.noMore=false;
            $scope.pageIndex=0;
            $scope.pedding=true;
            getGuideNoServiceOrder();
        };

        $scope.consultingRecord=function(item){
            if($scope.pedding){
                $scope.editor(item.orderId,item.doctorId);
            }
            else{
                $state.go('order.myOrder.consultingRecord',{orderId: item.orderId});
            }
        };

        function getGuideNoServiceOrder() {
            var param = {
                access_token: localStorage['guider_access_token'],
                pageIndex: $scope.pageIndex,
                pageSize: 9
            };

            MyOrderFactory
                .getGuideNoServiceOrder(param)
                .then(thenFc);

            function thenFc(response) {
                if (response){
                    if (response.pageData) {
                        if ($scope.pageIndex == 0) {
                            $scope.orderlist = response.pageData;
                        } else if (response.pageData.length > 0) {
                            $scope.orderlist = $scope.orderlist.concat(response.pageData);
                        } else {
                            $scope.noMore = true;
                            $scope.pageIndex = $scope.pageIndex - 1;
                        }
                    }
                }
            }
        };

        function getGuideAlreadyServicedOrder() {
            $scope.ordersListIsLoading = true;
            var param = {
                access_token: localStorage['guider_access_token'],
                pageIndex: $scope.pageIndex,
                pageSize: 9
            };

            MyOrderFactory
                .getGuideAlreadyServicedOrder(param)
                .then(thenFc);

            function thenFc(response) {
                if (response){
                    if (response.pageData) {
                        if ($scope.pageIndex == 0) {
                            $scope.orderlist = response.pageData;
                        } else if (response.pageData.length > 0) {
                            $scope.orderlist = $scope.orderlist.concat(response.pageData);
                        } else {
                            $scope.noMore = true;
                            $scope.pageIndex = $scope.pageIndex - 1;
                        }
                    }
                }
            }
        };

        getGuideNoServiceOrder();

        $scope.getGuideServiceOrderClick=function(){
            $scope.orderlist=[];
            $scope.noMore=false;
            $scope.pageIndex=0;
            $scope.pedding=false;
            getGuideAlreadyServicedOrder();
        };

        $scope.readMore=function(){
            $scope.pageIndex+=1;
            if($scope.pedding){
                getGuideNoServiceOrder();
            }
            else{
                getGuideAlreadyServicedOrder();
            }
        };


        $scope.editor = function(orderId, doctorId) {
            var callback = function() {
                getGuideNoServiceOrder();
            };
            EditorConsultingRecordFactory
                .open(orderId, doctorId, callback);
        }

    }
})();
