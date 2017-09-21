(function() {
    angular.module('app')
        .controller('QuickReplyController', QuickReplyController);

    QuickReplyController.$inject = ['$scope', '$uibModal', 'QuickReplyFactory'];

    function QuickReplyController($scope, $uibModal, QuickReplyFactory) {

        // 快捷回复－获取快捷回复列表
        getQuickReplyList();

        function getQuickReplyList() {

            var param = {
                access_token: localStorage['guider_access_token']
            }

            QuickReplyFactory
                .getQuickReplyList(param)
                .then(thenFc)

            function thenFc(response) {
                if(response.length>0){
                    var sortedArray=response.sort(function(a,b){
                        return a.is_system-b.is_system;
                    });
                    $scope.quickReplyList=sortedArray;
                }
                else{
                    $scope.quickReplyList = response;
                }
            }
        };

        // 快捷回复－保存修改
        $scope.quickReplySave = function(value, item) {
            var FactoryType = {};
            var param = {};

            if (item.replyId) {
                FactoryType = 'updateQuickReply';
                param = {
                    access_token: localStorage['guider_access_token'],
                    replyId: item.replyId,
                    replyContent: value,
                    is_system:1
                }
            } else {
                FactoryType = 'addQuickReply';
                param = {
                    access_token: localStorage['guider_access_token'],
                    replyContent: value,
                    is_system:1
                }
            }

            QuickReplyFactory[FactoryType](param)
                .then(thenFc)

            function thenFc(response) {
                getQuickReplyList();
            }


        }

        // 快捷回复－选择回复内容
        $scope.quickReplySelected = function(itemId, itemArry) {
            for (var i = 0; i < itemArry.length; i++) {
                if (itemArry[i].replyId == itemId) {
                    $scope.data.isOpen = false;
                    $scope.goRunning.changeText(itemArry[i].replyContent);
                } else {
                    itemArry[i].isSelected = false;
                }
            }
        }

        // 快捷回复-添加内容
        $scope.addQuickReplyItem = function() {
            $scope.quickReplyList.push({
                replyContent: '',
                replyId: '',
                userId: JSON.parse(localStorage['user']).id,
                is_system:1
            });

            setTimeout(function(){
                var replyListContent=document.getElementById('replyListContent');
                replyListContent.scrollTop=document.getElementById('replyListContent').scrollHeight;
            },10);

        };

        // 快捷回复－删除
        $scope.removeQuickReplyItem = function(data) {
            //if (!data.replyId) return console.log('缺少删除回复的replyId');
            function thenFc(response) {
                var replayIndex=$scope.quickReplyList.indexOf(data);
                $scope.quickReplyList.splice(replayIndex,1);
            }


            if(!data.replyId){
                var replayIndex=$scope.quickReplyList.indexOf(data);
                $scope.quickReplyList.splice(replayIndex,1);
            }
            else{
                var param = {
                    access_token: localStorage['guider_access_token'],
                    replyId: data.replyId
                };

                QuickReplyFactory
                    .removeQuickReply(param)
                    .then(thenFc);
            }


        }

    };

})();
