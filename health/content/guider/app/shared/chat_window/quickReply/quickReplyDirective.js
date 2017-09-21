(function() {
    angular.module('app')
        .directive('quickReply', quickReply);

    function quickReply() {
        return {
            scope: {
                data: '=',
                beRunning: '=',
                goRunning: '=',
            },
            templateUrl: 'app/shared/chat_window/quickReply/quickReplyView.html',
            controller: 'QuickReplyController',
        };
    }
})();
