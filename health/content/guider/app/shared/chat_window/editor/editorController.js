(function() {
    angular.module('app')
        .controller('ChatWindowEditorController', ChatWindowEditorController);

    ChatWindowEditorController.$inject = ['$scope', 'FileUploader', 'toaster'];

    function ChatWindowEditorController($scope, FileUploader, toaster) {

        // Enter 发送内容
        document.getElementById('textarea').onkeydown = function(event) {
            if (event.keyCode == 13)
                if (!event.shiftKey)
                    $scope.shared.submit($scope.editorData, 1);
        };

        $scope.shared = {};

        // 提交输入内容
        $scope.shared.submit = function(param, type) {

            if (!param) return toaster.pop('error', null, '输入的内容不能为空');

            var data = {
                windowId: $scope.data.gid,
                type: type,
                user: {
                    id: JSON.parse(localStorage['user']).id,
                    name: JSON.parse(localStorage['user']).name
                },
                target: $scope.target
            }

            if (type == 1) {

                data.content = param;
                $scope.editorData = '';

            } else if (type == 2) {

                if (param.oUrl)
                    data.uri = param.oUrl;

                if (param.format)
                    data.format = param.format;
                if (param.key)
                    data.key = param.key;

                data.name = param.oFileName || param.name;

                data.width = param.width;
                data.height = param.height;
                data.size = param.size;

                $scope.uploadFile.isOpen = false;
                $scope.uploadFile.imgFile = null;
            }

            $scope.goRunning(data);

        };

        // 修改文本内容
        $scope.shared.changeText = function(value) {
            if (!value) {
                return console.log('内容不能为空')
            }
            if (!$scope.editorData) {
                return $scope.editorData = value;
            }
            return $scope.editorData = $scope.editorData + value;
        }

        // 打开关闭工具箱
        $scope.shared.closePopover = function(viewName) {

            var viewNameArry = [
                'uploadFile',
                'quickReply',
                'faceIcon'
            ];
            for (var i = 0; i < viewNameArry.length; i++) {

                if (viewName == viewNameArry[i] && $scope[viewNameArry[i]]) {
                    $scope[viewNameArry[i]].isOpen = true;

                } else if ($scope[viewNameArry[i]]) {
                    $scope[viewNameArry[i]].isOpen = false;
                }

            }

        }

        $scope.beRunning = $scope.shared.closePopover;

        $scope.$on("clearEdit", function () {
            $scope.editorData="";
        })
    };

})();
