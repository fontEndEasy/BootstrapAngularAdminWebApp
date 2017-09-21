(function() {
    angular.module('app')
        .controller('ChatImgSelModalInstanceCtrl', ChatImgSelModalInstanceCtrl);

    ChatImgSelModalInstanceCtrl.$inject = ['$scope', '$uibModalInstance', 'toaster', '$http','images','gId'];

    function ChatImgSelModalInstanceCtrl($scope, $uibModalInstance, toaster, $http,images,gId,$sce) {
        $http.post(app.api.order.getDialogueImg, {
            access_token: localStorage['guider_access_token'],
            guideId:gId
        }).
        success(function(data, status, headers, config) {
            if (data.resultCode == 1) {
                console.log(data.data);
                if(data.data.length>0){
                    data.data.forEach(function(item,index,array){
                        if(images.indexOf(item.imgs)>-1){
                            item.check=true;
                        }
                    });
                }
                $scope.images=data.data;
            } else {
                toaster.pop('error', null, data.resultMsg);
            }
        }).
        error(function(data, status, headers, config) {
            toaster.pop('error', null, data.resultMsg);
        });

        $scope.changeCheckStatus=function(item,$event){
            var checkedLength=$scope.images.filter(function(item,index,array){
                return item.check==true;
            }).length;
            if(checkedLength<8){
                item.check=!item.check;
            }
            else{
                $event.preventDefault();
                toaster.pop('warn', null, '最多只能选择8张图片');
            }
        };


        $scope.ok = function () {
            var selected=[];
            $scope.images.forEach(function(item,index,array){
                if(item.check==true){
                    selected.push(item.imgs);
                }
            });
            $uibModalInstance.close(selected);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }

})();
