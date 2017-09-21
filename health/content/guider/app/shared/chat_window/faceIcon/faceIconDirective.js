(function() {
    angular.module('app')
        .directive('faceIcon', faceIcon);

    function faceIcon() {
        return {
            scope: {
                data: '=',
                beRunning: '=',
                goRunning: '=',
            },
            templateUrl: 'app/shared/chat_window/faceIcon/faceIconView.html',
            controller: function($scope) {
                $scope.submit = function(item) {
                    if (!item.key) return;
                    $scope.data.isOpen = false;
                    $scope.goRunning.changeText(item.key);
                };

            }
        };
    }
})();
