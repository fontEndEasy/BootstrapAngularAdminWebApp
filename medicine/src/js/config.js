// config
var app = angular.module('app').config(
    ['$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$stateProvider',
        function($controllerProvider, $compileProvider, $filterProvider, $provide, $stateProvider) {
            // lazy controller, directive and service
            app.controller = $controllerProvider.register;
            app.directive = $compileProvider.directive;
            app.filter = $filterProvider.register;
            app.factory = $provide.factory;
            app.service = $provide.service;
            app.constant = $provide.constant;
            app.value = $provide.value;
        }
    ]).config(['$translateProvider',
    function($translateProvider) {
        // 注册一个静态文件加载器，模块会在指定的url中查找翻译词典
        // url结构为 [prefix][langKey][suffix].
        $translateProvider.useStaticFilesLoader({
            prefix: 'src/l10n/',
            suffix: '.js'
        });
        // 设置默认语言
        $translateProvider.preferredLanguage('en');
        // 存储默认语言(本地)
        $translateProvider.useLocalStorage();
    }
]).factory('authorityInterceptor', [
    function() {
        var authorityInterceptor = {
            response: function(response) {
                //判断session是否失效
                if (response.data['#code'] == 'server.error.session_timeout') {
                    app.state.go('access.signin', {}, {
                        "reload": true
                    });
                }
                if ('no permission' == response.data) {
                    app.controller('Interceptor', ['$state',
                        function($state) {
                            app.state.go('access.404');
                        }
                    ]);
                }
                if ("no login" == response.data) {
                    app.state.go('access.signin');
                }
                return response;
            }
        };
        return authorityInterceptor;
    }
]).config(
    ['$httpProvider',
        function($httpProvider) {
            $httpProvider.interceptors.push('authorityInterceptor');
            $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
            $httpProvider.defaults.transformRequest = [
                function(data) {
                    return angular.isObject(data) && String(data) !== '[object File]' ? $.param(data, true) : data;
                }
            ];
        }
    ]);
angular.module('app').directive('onlyDigits', function() {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function(scope, element, attr, ctrl) {
            function inputValue(val) {
                if (val) {
                    var digits = val.replace(/[^0-9]/g, '');

                    if (digits !== val) {
                        ctrl.$setViewValue(digits);
                        ctrl.$render();
                    }
                    return parseInt(digits, 10);
                }
                return undefined;
            }
            ctrl.$parsers.push(inputValue);
        }
    };
});
angular.module('app').directive('customeDirective', ['uiLoad', 'JQ_CONFIG', '$document', '$compile',
                function (uiLoad, JQ_CONFIG, $document, $compile) {
                    return {
                        restrict: 'AEC',
                        templateUrl: 'src/tpl/group/test.html',
                        //replace: true,
                        transclude: true,
                        link: function (scope, el, attr) {
                            console.log(el);
                            console.log(attr.compile);
                            console.log(scope);
                            scope.name = "children";
                            console.log($compile);
                            /*scope.$apply();*/
                            scope.$watch(
                                function (scope) {
                                    // watch the 'compile' expression for changes
                                    return scope.$eval(attr.compile);
                                },
                                function (value) {
                                    // when the 'compile' expression changes
                                    // assign it into the current DOM
                                    el.html(value);
                                    // compile the new DOM and link it to the current
                                    // scope.
                                    // NOTE: we only compile .childNodes so that
                                    // we don't get into infinite loop compiling ourselves
                                    $compile(el.contents())(scope);
                                }
                            );
                            console.log('23dsfsdfdsfdsfds')
                            /*uiLoad.load(JQ_CONFIG.databox).then(function () {

                                el.on('click', function () {
                                    var target;
                                    attr.target && (target = $(attr.target)[0]);
                                    //screenfull.toggle(target);
                                    console.log('dsfsdfdsfdsfds')
                                });

                                $document.on('mousedown', function () {

                                });
                            });*/
                        },
                        pre: function () {
                            console.log('pre');
                        },
                        post: function () {
                            console.log('---------------->')
                        }
                    };
                }
            ]);
