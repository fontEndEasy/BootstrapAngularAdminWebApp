(function() {
    angular.module('app')
        .directive('chatWindowEditor', chatWindowEditor);

    function chatWindowEditor() {
        return {
            scope: {
                data: '=',
                beRunning: '=',
                goRunning: '=',
                target: '=',
            },
            templateUrl: 'app/shared/chat_window/editor/editorView.html',
            controller: 'ChatWindowEditorController',
        };
    }
})();
