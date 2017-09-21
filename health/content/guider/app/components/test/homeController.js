(function() {
    angular.module('app')
        .controller('TestController', TestController)

    TestController.$inject = ['$scope', 'FileUploader', 'ngAudio', '$http'];

    function TestController($scope, FileUploader, ngAudio, $http) {


        $http.post('http://192.168.3.7:8091/designer/saveSurvey', {
            access_token: app.url.access_token
        }).
        then(function(rpn) {
            rpn = rpn.data;
            if (rpn.resultCode === 1) {
                toaster.pop('success', null, '保存成功');
            } else if (rpn.resultMsg) {
                toaster.pop('error', null, rpn.resultMsg);
            } else {
                toaster.pop('error', null, '接口出错');
            };
        });

        // /*语音*/
        // $scope.dealAudio = function(link) {
        //     return ngAudio.load(link);
        // }

        // $scope.audio = ngAudio.load('/qiniuUrl/1901b5f606f8450bad2b005ad9f9ecdd_mp3');



        // WebSocket
        // WebSocketTest();

        // function WebSocketTest() {
        //     if ("WebSocket" in window) {
        //         // WebSocket支持浏览器!
        //         // open web socket
        //         var ws = new WebSocket("ws://echo.websocket.org");
        //         ws.onopen = function(evt) {
        //             // Web Socket is connected, send data using send()
        //             $scope.msgList = [];
        //             $scope.send = function(msg) {
        //                 ws.send(msg);
        //             };
        //         };
        //         ws.onmessage = function(evt) {
        //             console.log(evt);
        //             var received_msg = evt.data;
        //             $scope.$apply(function() {
        //                 $scope.msgList.push(received_msg);
        //             });
        //         };
        //         ws.onclose = function(evt) {
        //             // websocket is closed.
        //             console.log("连接已关闭");
        //         };
        //         ws.onerror = function(evt) {
        //             // websocket is closed.
        //             console.log("连接出错");
        //         };
        //     } else {
        //         // 你的浏览器不支持 WebSocket
        //         console.log("你的浏览器不支持 WebSocket");
        //     }
        // }

    };

})();
