/**
 * app.directive.js
 * @authors wangzl 
 * @date    2016/01/03
 * @version 1.0.0
 */
define(['angular'], function(angular) {
    angular.module('app.directive', [])
        .directive('alertBox', alertBox);

    function alertBox() {
        return {
            restrict: 'EA',
            template: '<div ng-if="vm.showConfirm" class="confirm-wrapper">' +
                '<div class="confirm">' +
                '<div class="confirm-tip">{{vm.title}}</div>' +
                '<div class="confirm-info" ng-class="{\'confirm-success\': vm.success}"><div ng-bind-html="vm.msg"></div></div>' +
                '<div ng-if="vm.btns.length>1" class="confirm-double-button">' +
                '<div class="confirm-opbutons first" ng-click="vm.closeMsg();">{{vm.btns[0].btnMsg}}</div>' +
                '<div class="confirm-opbutons" ng-click="vm.closeMsg(1);">{{vm.btns[1].btnMsg}}</div>' +
                '</div>' +
                '<div ng-if="vm.btns.length<2" class="confirm-ok-button" ng-click="vm.closeMsg(1);">{{vm.btns[0].btnMsg}}</div>' +
                '</div>' +
                '</div>',
            replace: true,
            controller: ['$scope', '$rootScope', '$sce', '$window', function($scope, $rootScope, $sce, $window) {
                var vm = this;
                vm.title = "温馨提示";
                vm.showConfirm = false;
                vm.msg = '';
                vm.btns = [{
                    btnMsg: "取消"
                }, {
                    btnMsg: "确定"
                }];
                vm.btnMsg = '';
                vm.closeMsg = closeMsg;
                var func;

                active();

                function active() {
                    $rootScope.$on('alert', function(event, data) {
                        data && analyze(data);
                    });

                    $scope.$on('alert', function(event, data) {
                        data && analyze(data);
                    });

                    $scope.$on('close', function() {
                        close();
                    });
                }

                function closeMsg(_flag) {
                    _flag && func && func();
                    close();
                }


                function close() {
                    if (vm.showConfirm) {
                        vm.showConfirm = false;
                        func = null;
                        $(window).unbind('touchmove');
                    }
                }

                function open() {
                    if (!vm.showConfirm) {
                        vm.showConfirm = true;
                        $(window).bind('touchmove', function(e) {
                            e.preventDefault();
                        });
                    }
                }

                function analyze(data) {
                    func = data.func;
                    vm.success = !!data.success;
                    vm.title = data.title || '温馨提示';
                    vm.msg = $sce.trustAsHtml(data.msg) || '';
                    vm.btns = data.btns || [{
                        btnMsg: "取消"
                    }, {
                        btnMsg: "确定"
                    }];
                    open();
                }
            }],
            controllerAs: 'vm'
        };
    }
});
