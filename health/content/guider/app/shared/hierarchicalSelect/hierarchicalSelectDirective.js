(function() {
    angular.module('app')
        .directive('hierarchicalSelect', hierarchicalSelect);

    function hierarchicalSelect() {
        return {
            scope: {
                open: '=',
                data: '='
            },
            templateUrl: 'app/shared/hierarchicalSelect/hierarchicalSelectView.html',
            controller: 'HierarchicalSelectCtrl'
        }
    }

})();
