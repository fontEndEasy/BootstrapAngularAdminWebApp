/**
 * Created by clf on 2015/11/24.
 */
app.controller('PublicMsgListCtrl', function($scope,$http,$state) {
    var curGroupId=localStorage.getItem('curGroupId');
    var getPublicMsgList=function(){
        $http.post(app.url.pubMsg.getCustomerPub, {
            access_token:app.url.access_token
        }).
        success(function(data, status, headers, config) {
            if(data.resultCode==1){
                console.log(data);
                $scope.pub_msg_list=data.data;
            }
            else{
                console.log(data.resultMsg);
            }
        }).
        error(function(data, status, headers, config) {
            console.log(data.resultMsg);
        });
    };

    getPublicMsgList();

    $scope.toManage=function(item){
        localStorage.removeItem('curPubMsg');
        localStorage.setItem('curPubMsg',JSON.stringify(item));
        console.log(item);
        $state.go('app.msg_manage.send_msg',{id:item.pid});
    };
});