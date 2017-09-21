app.controller('MsgManCtrl', function($scope,$http,$stateParams) {

    $scope.curPubName=JSON.parse(localStorage.getItem('curPubMsg')).name;
});