(function() {
    angular.module('app')
        .directive('ngUmeditor', ngUmeditor);

    function ngUmeditor() {
        return {
            scope: {
                token: '@',
                content: '=',
            },
            templateUrl: function() {
                var isChack = window.location.href.indexOf('/check/');
                if (isChack != -1)
                    return '../components/ngUmeditor/ngUmeditorView.html';
                else
                    return 'components/ngUmeditor/ngUmeditorView.html';
            }(),
            controller: 'ngUmeditorCtrl',
        };
    }
})();
