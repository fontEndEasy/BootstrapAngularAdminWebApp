angular.module('app').directive('userPicker', ['uiLoad', 'JQ_CONFIG', '$document', '$window',
    function (uiLoad, JQ_CONFIG, $document, $window) {
        return {
            restrict: 'AE',
            template: '<i class="fa fa-expand fa-fw text"></i><i class="fa fa-compress fa-fw text-active"></i>',
            link: function (scope, el, attr) {
                //el.addClass('hide');
                uiLoad.load(JQ_CONFIG.databox).then(function () {

                    el.on('click', function () {
                        var target;
                        attr.target && (target = $(attr.target)[0]);
                        //screenfull.toggle(target);
                    });

                    $document.on('mousedown', function () {

                    });
                });
            }
        };
    }
]).controller('RelationshipEdit', function ($scope, $http) {
    var dataset = {};
});