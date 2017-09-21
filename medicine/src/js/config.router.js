'use strict';

angular.module('app').run(
    ['$rootScope', '$state', '$stateParams', '$urlRouter',
        function($rootScope, $state, $stateParams, $urlRouter) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
            // 离开提示
            $rootScope.$on('$stateChangeStart',
                function(event, toState, toParams, fromState, fromParams, options) {
                    if (fromState.name === 'app.setting') {
                        event.preventDefault();
                        $(".xcConfirm").remove();
                        var text = "请确定保存了数据才离开";
                        window.wxc.xcConfirm(text, window.wxc.xcConfirm.typeEnum.warning, {
                            onOk: function() {
                                $state.go(toState.name, null, {
                                    notify: false
                                }).then(function(state) {
                                    $rootScope.$broadcast('$stateChangeSuccess', state, null);
                                });
                            }
                        });
                    }

                }
            );
        }
    ]).config(['$stateProvider', '$urlRouterProvider', 'JQ_CONFIG',
        function($stateProvider, $urlRouterProvider, JQ_CONFIG) {
            //$urlRouterProvider.when('/app/home');
            //$urlRouterProvider.otherwise('/app/customer_service');
            $urlRouterProvider.otherwise('/app/home');
            $stateProvider.state('app', {
                abstract: true,
                url: '/app',
                //templateUrl: 'src/tpl/app.html',
                views: {
                    '': {
                        templateUrl: 'src/tpl/app.html'
                    },
                    'footer': {
                        template: '<div id="dialog-container" ui-view></div>'
                    },
                    'nav@app': {
                        templateUrl: 'src/tpl/nav/nav.html'
                    }
                },
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load(['src/js/controllers/nav/nav.js']);
                        }
                    ]
                }
            }).state('app.home', {
                url: '/home',
                templateUrl: 'src/tpl/home.html',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load(['src/js/controllers/home.js']);
                        }
                    ]
                }
            })
                // others
                .state('lockme', {
                    url: '/lockme',
                    templateUrl: 'src/tpl/lockme.html'
                }).state('access', {
                    url: '/access',
                    template: '<div ui-view class="fade-in-right-big smooth"></div>'
                })
                .state('access.signin', {
                    url: '/signin',
                    templateUrl: 'src/tpl/signin.html',
                    resolve: {
                        deps: ['uiLoad',
                            function(uiLoad) {
                                return uiLoad.load(['src/js/controllers/signin.js']);
                            }
                        ]
                    }
                }).state('h', {
                    url: '/h?type&role&fn',
                    template: '<div id="h" ng-controller="HController">HHref.link</div>',
                    resolve: {
                        deps: ['uiLoad', function(uiLoad) {
                            return uiLoad.load(['src/js/controllers/h.js'])
                        }]
                    }
                }).state('ab', {
                    url: '/ab',
                    template: '<div id="ab">HHref.link</div>'
                })
                .state('access.signininbox', {
                    url: '/signininbox',
                    templateUrl: 'src/tpl/signin_inbox.html',
                    resolve: {
                        deps: ['uiLoad',
                            function(uiLoad) {
                                return uiLoad.load(['src/js/controllers/signin_inbox.js']);
                            }
                        ]
                    }
                })
                .state('access.enterprise_signin', {
                    url: '/enterprise_signin',
                    templateUrl: 'src/tpl/enterprise/signin.html',
                    resolve: {
                        deps: ['uiLoad',
                            function(uiLoad) {
                                return uiLoad.load(['src/js/controllers/enterprise/signin.js']);
                            }
                        ]
                    }
                })
                .state('access.signup', {
                    url: '/signup',
                    templateUrl: 'src/tpl/enterprise/signup.html',
                    resolve: {
                        deps: ['uiLoad',
                            function(uiLoad) {
                                return uiLoad.load(['src/js/controllers/enterprise/signup.js']);
                            }
                        ]
                    }
                })
                /*.state('access.enterprise_identify', { //注册后信息审核
                    url: '/enterprise_identify',
                    templateUrl: 'src/tpl/enterprise/enterprise_identify.html',
                    resolve: {
                        deps: ['uiLoad',
                            function(uiLoad) {
                                return uiLoad.load(['src/js/controllers/enterprise/enterprise_identify.js']);
                            }
                        ]
                    }
                })*/
                .state('app.storehq', { //总店
                    url: '/storehq',
                    templateUrl: 'src/tpl/storehq/contacts.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('src/js/controllers/storehq/contacts.js').then(
                                    function() {
                                        return $ocLazyLoad.load(['angularBootstrapNavTree']);
                                    }
                                ).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.alert_confirm));
                                });
                            }
                        ]
                    }
                })
                //推广费管理
                .state('app.pfmanagement', {
                    url: '/pfmanagement',
                    templateUrl: 'src/tpl/storehq/pfmanagement.html',
                    resolve: {
                        deps: ['uiLoad',
                            function(uiLoad) {
                                return uiLoad.load(['src/js/controllers/storehq/pfmanagement.js']).then(function() {
                                    return uiLoad.load(JQ_CONFIG.alert_confirm);
                                });
                            }
                        ]
                    }
                })
                .state('app.pfmanagement.detail', { //推广费管理----查看明细
                    url: '/pfmanagementdetail?{id}',
                    views: {
                        "dialogView@app": {
                            templateUrl: 'src/tpl/storehq/detail.html'
                        }
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('src/js/controllers/storehq/detail.js');
                            }
                        ]
                    }
                })
                .state('app.storehq.changeleader', { //总店====更换店长---传递多个参数?{id}&{type}
                    url: '/changeleader?{id}&{type}',
                    views: {
                        "dialogView@app": {
                            templateUrl: 'src/tpl/storehq/changeLeader.html'
                        }
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('src/js/controllers/storehq/changeLeader.js').then(function() {
                                    return uiLoad.load(JQ_CONFIG.alert_confirm);
                                });
                            }
                        ]
                    }
                })
                .state('app.storehq.set_Company', { //总店====创建门店
                    url: '/setCompany',
                    views: {
                        "dialogView@app": {
                            templateUrl: 'src/tpl/storehq/set_Company.html'
                        }
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('src/js/controllers/storehq/set_Company.js').then(function() {
                                    return uiLoad.load(JQ_CONFIG.alert_confirm);
                                });
                            }
                        ]
                    }
                })
                .state('app.drugfactory', { //药厂
                    url: '/drugfactory',
                    templateUrl: 'src/tpl/drugfactory/contacts.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('src/js/controllers/drugfactory/contacts.js').then(
                                    function() {
                                        return $ocLazyLoad.load(['angularBootstrapNavTree', 'ngFileUpload']);
                                    }
                                ).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.alert_confirm));
                                });
                            }
                        ]
                    }
                })
                .state('app.drugfactory.add_department', { //药厂=====添加部门
                    url: '/add_department',
                    views: {
                        "dialogView@app": {
                            templateUrl: 'src/tpl/drugfactory/add_department.html'
                        }
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return uiLoad.load(['src/js/controllers/drugfactory/add_department.js']).then(function() {
                                    return uiLoad.load(JQ_CONFIG.alert_confirm.concat(JQ_CONFIG.tree));
                                });
                            }
                        ]
                    }
                })
                .state('app.drugfactory.edit', {
                    url: '/edit',
                    views: {
                        "modalDialog@app": {
                            templateUrl: 'src/tpl/drugfactory/contacts_edit.html'
                        }
                    },
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function($ocLazyLoad) {
                                return $ocLazyLoad.load('src/js/controllers/drugfactory/contacts_edit.js');
                            }
                        ]
                    }
                })
                .state('app.drugfactory.delete', {
                    url: '/delete',
                    views: {
                        "modalDialog@app": {
                            templateUrl: 'src/tpl/drugfactory/contacts_delete.html'
                        }
                    },
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function($ocLazyLoad) {
                                return $ocLazyLoad.load('src/js/controllers/drugfactory/contacts_delete.js');
                            }
                        ]
                    }
                })
                .state('app.drugfactory.add_personnel', { //药厂=====添加人员
                    url: '/add_personnel?id',
                    views: {
                        "dialogView@app": {
                            templateUrl: 'src/tpl/drugfactory/add_personnel.html'
                        }
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return uiLoad.load(['src/js/controllers/drugfactory/add_personnel.js']).then(function() {
                                    return uiLoad.load(JQ_CONFIG.alert_confirm.concat(JQ_CONFIG.tree));
                                });
                            }
                        ]
                    }
                })

                .state('app.factory_varietylist', { //药厂=====品种库
                    url: '/factory_varietylist',
                    templateUrl: 'src/tpl/drugfactory/factory_varietylist.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return uiLoad.load([
                                    // 百度富文本编辑器
                                    'components/ngUmeditor/umeditor/third-party/jquery.min.js',
                                    'components/ngUmeditor/umeditor/umeditor.min.js',
                                    'components/ngUmeditor/umeditor/umeditor.config.js',
                                    'components/ngUmeditor/umeditor/themes/default/css/umeditor.min.css',

                                    'src/js/controllers/drugfactory/factory_varietylist.js',
                                    'src/js/directives/ui-medicine.js'
                                ]).then(function() {
                                    return uiLoad.load(JQ_CONFIG.alert_confirm.concat(JQ_CONFIG.tree, JQ_CONFIG.umeditor, JQ_CONFIG.dataTable));
                                });
                            }
                        ]
                    }
                })
                // 文件管理
                .state('app.file_management', {
                    url: '/file_management/{id}/{name}',
                    templateUrl: 'src/tpl/file_management/file_management.html',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'toaster',
                                    'xeditable',
                                    // 'components/jszip/dist/jszip.min.js',
                                    // 'components/jszip/vendor/FileSaver.js',
                                    // 七牛上传文件组建
                                    'components/qiniuUploader/rely/plupload.full.min.js',
                                    // 'components/qiniuUploader/rely/qiniu.js',
                                    'components/qiniuUploader/qiniuUploaderController.js',
                                    'components/qiniuUploader/qiniuUploaderDirective.js',

                                    'src/js/controllers/file_management/file_management.js'
                                ]);
                            }
                        ]
                    }
                })
                .state('app.drugcode', { //药厂=====药监码
                    url: '/drugcode',
                    templateUrl: 'src/tpl/drugfactory/drugcode.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return uiLoad.load(['src/js/controllers/drugfactory/drugcode.js']).then(function() {
                                    return uiLoad.load(JQ_CONFIG.alert_confirm.concat(JQ_CONFIG.dataTable));
                                });
                            }
                        ]
                    }
                })
                .state('app.drugcode.mark', { //药厂====药监码--标记
                    url: '/drugcodemark',
                    views: {
                        "modalDialog@app": {
                            templateUrl: 'src/tpl/drugfactory/drugcode_mark.html'
                        }
                    },
                    resolve: {
                        deps: ['uiLoad',
                            function(uiLoad) {
                                return uiLoad.load(['src/js/controllers/drugfactory/drugcode_mark.js']);
                            }
                        ]
                    }
                })

                .state('app.capitalpool', { //药厂=====资金池
                    url: '/capitalpool',
                    templateUrl: 'src/tpl/drugfactory/capitalpool.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return uiLoad.load(['src/js/controllers/drugfactory/capitalpool.js']).then(function() {
                                    return uiLoad.load(JQ_CONFIG.alert_confirm.concat(JQ_CONFIG.jscharts));
                                });
                            }
                        ]
                    }
                })
                .state('app.capitalpool.capitalpool_drug', { //药厂====资金池品种间调拨和余额调拨
                    url: '/capitalpool_drug/{type}/{id}',
                    views: {
                        "modalDialog@app": {
                            templateUrl: 'src/tpl/drugfactory/capitalpool_drug.html'
                        }
                    },
                    resolve: {
                        deps: ['uiLoad',
                            function(uiLoad) {
                                return uiLoad.load(['src/js/controllers/drugfactory/capitalpool_drug.js']);
                            }
                        ]
                    }
                })

                .state('app.capitalpool.capitalpool_recharge', { //药厂====充值
                    url: '/capitalpool_recharge/{id}',
                    views: {
                        "modalDialog@app": {
                            templateUrl: 'src/tpl/drugfactory/capitalpool_recharge.html'
                        }
                    },
                    resolve: {
                        deps: ['uiLoad',
                            function(uiLoad) {
                                return uiLoad.load(['src/js/controllers/drugfactory/capitalpool_recharge.js']);
                            }
                        ]
                    }
                })

                .state('app.factory_varietylist.add_company_drug', { //药厂---药品添加
                    url: '/add_company_drug',
                    views: {
                        "modalDialog@app": {
                            templateUrl: 'src/tpl/drugfactory/add_company_drug.html'
                        }
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load([
                                    'toaster',
                                    // 七牛上传文件组件
                                    'components/qiniuUploader/rely/plupload.full.min.js',
                                    'components/qiniuUploader/qiniuUploaderController.js',
                                    'components/qiniuUploader/qiniuUploaderDirective.js',

                                    // 百度富文本编辑器
                                    'components/ngUmeditor/ngUmeditorController.js',
                                    'components/ngUmeditor/ngUmeditorDirective.js',

                                    'src/js/controllers/drugfactory/add_company_drug.js',
                                ]).then(function() {
                                    return uiLoad.load(JQ_CONFIG.alert_confirm.concat(JQ_CONFIG.daterangepicker));
                                });
                            }
                        ]
                    }
                })
                .state('app.factory_varietylist.factory_drug_detail', { //药厂===药品详情
                    url: '/factory_drug_detail/{id}',
                    views: {
                        "modalDialog@app": {
                            templateUrl: 'src/tpl/drugfactory/factory_drug_detail.html'
                        }
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('src/js/controllers/drugfactory/factory_drug_detail.js');
                            }
                        ]
                    }
                })

                .state('app.factory_varietylist.factory_drug_yy', { //药厂===医药代表
                    url: '/factory_drug_yy/{id}/{name}',
                    views: {
                        "modalDialog@app": {
                            templateUrl: 'src/tpl/drugfactory/factory_drug_yy.html'
                        }
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('src/js/controllers/drugfactory/factory_drug_yy.js');
                            }
                        ]
                    }
                })



                .state('app.integration', { //药厂====患者积分管理
                    url: '/integration',
                    templateUrl: 'src/tpl/drugfactory/integration.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('src/js/controllers/drugfactory/integration.js').then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.alert_confirm, JQ_CONFIG.dataTable, JQ_CONFIG.daterangepicker));
                                });
                            }
                        ]
                    }
                })
                .state('app.integration.edit_integration', { //药厂====添加+设置积分规则
                    url: '/edit_integration/{type}/{ids}/{name}',
                    views: {
                        "modalDialog@app": {
                            templateUrl: 'src/tpl/drugfactory/edit_integration.html'
                        }
                    },
                    resolve: {
                        deps: ['uiLoad',
                            function(uiLoad) {
                                return uiLoad.load(['src/js/controllers/drugfactory/edit_integration.js']);
                            }
                        ]
                    }
                })
                .state('app.strategy', { //药厂====推广策略管理
                    url: '/strategy',
                    templateUrl: 'src/tpl/drugfactory/strategy.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('src/js/controllers/drugfactory/strategy.js').then(function() {
                                    return uiLoad.load(JQ_CONFIG.alert_confirm.concat(JQ_CONFIG.dataTable));
                                });
                            }
                        ]

                    }
                })
                .state('app.strategy.edit_strategy', { //药厂====推广策略管理==添加+编辑
                    url: '/edit_strategy/{type}/{id}',
                    views: {
                        "modalDialog@app": {
                            templateUrl: 'src/tpl/drugfactory/edit_strategy.html'
                        }
                    },
                    resolve: {
                        deps: ['uiLoad',
                            function(uiLoad) {
                                return uiLoad.load(['src/js/controllers/drugfactory/edit_strategy.js']);
                            }
                        ]
                    }
                })
                .state('app.strategyactive', { //药厂====药品推广活动管理
                    url: '/strategyactive',
                    templateUrl: 'src/tpl/drugfactory/strategyactive.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('src/js/controllers/drugfactory/strategyactive.js').then(function() {
                                    return uiLoad.load(JQ_CONFIG.alert_confirm.concat(JQ_CONFIG.dataTable, JQ_CONFIG.daterangepicker));
                                });
                            }
                        ]
                    }
                })

                .state('app.strategyactive.edit_strategyactive', { //药厂====药品推广活动管理===添加+编辑+复制
                    url: '/edit_strategyactive/{type}/{goods}/{id}',
                    views: {
                        "modalDialog@app": {
                            templateUrl: 'src/tpl/drugfactory/edit_strategyactive.html'
                        }
                    },
                    resolve: {
                        deps: ['uiLoad',
                            function(uiLoad) {
                                return uiLoad.load(['src/js/controllers/drugfactory/edit_strategyactive.js']);
                            }
                        ]
                    }
                })
                .state('app.strategyactive.look_strategyactive', { //药厂====药品推广活动管理
                    url: '/look_strategyactive/{id}',
                    views: {
                        "modalDialog@app": {
                            templateUrl: 'src/tpl/drugfactory/look_strategyactive.html'
                        }
                    },
                    resolve: {
                        deps: ['uiLoad',
                            function(uiLoad) {
                                return uiLoad.load(['src/js/controllers/drugfactory/look_strategyactive.js']);
                            }
                        ]
                    }
                })
                .state('app.strategyactivedetail', { //药厂====推广费审核
                    url: '/strategyactivedetail/{id}',
                    templateUrl: 'src/tpl/drugfactory/strategyactive_detail.html',
                    resolve: {
                        deps: ['uiLoad',
                            function(uiLoad) {
                                return uiLoad.load([
                                    'src/js/controllers/drugfactory/strategyactive_detail.js'
                                ]).then(function() {
                                    return uiLoad.load(JQ_CONFIG.alert_confirm.concat(JQ_CONFIG.daterangepicker, JQ_CONFIG.moment));
                                });
                            }
                        ]
                    }
                })
                .state('app.strategyactivedetail.check', { //药厂====推广费-审核
                    url: '/strategyactivedetailcheck/{id}',
                    views: {
                        "modalDialog@app": {
                            templateUrl: 'src/tpl/drugfactory/strategyactive_detail_drug.html'
                        }
                    },
                    resolve: {
                        deps: ['uiLoad',
                            function(uiLoad) {
                                return uiLoad.load(['src/js/controllers/drugfactory/strategyactive_detail_drug.js']);
                            }
                        ]
                    }
                })
                .state('app.recharge', { //药厂-----充值页面
                    url: '/recharge',
                    templateUrl: 'src/tpl/drugfactory/recharge.html',
                    resolve: {
                        deps: ['uiLoad',
                            function(uiLoad) {
                                return uiLoad.load(['src/js/controllers/drugfactory/recharge.js']);
                            }
                        ]
                    }
                })
                .state('app.integrationtable', { //药厂====积分兑换报表
                    url: '/integrationtable',
                    templateUrl: 'src/tpl/drugfactory/integrationtable.html',
                    resolve: {
                        deps: ['uiLoad',
                            function(uiLoad) {
                                return uiLoad.load(['src/js/controllers/drugfactory/integrationtable.js']).then(function() {
                                    return uiLoad.load(JQ_CONFIG.alert_confirm.concat(JQ_CONFIG.daterangepicker));
                                });
                            }
                        ]
                    }
                })
                .state('app.integrationactive', { //药厂====参与积分活动药店
                    url: '/integrationactive',
                    templateUrl: 'src/tpl/drugfactory/integrationactive.html',
                    resolve: {
                        deps: ['uiLoad',
                            function(uiLoad) {
                                return uiLoad.load(['src/js/controllers/drugfactory/integrationactive.js']).then(function() {
                                    return uiLoad.load(JQ_CONFIG.alert_confirm.concat(JQ_CONFIG.dataTable));
                                });
                            }
                        ]
                    }
                })
                .state('app.monomerdrugstore', { //零售店
                    url: '/monomerdrugstore',
                    templateUrl: 'src/tpl/monomerdrugstore/contacts.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('src/js/controllers/monomerdrugstore/contacts.js').then(
                                    function() {
                                        return $ocLazyLoad.load('angularBootstrapNavTree');
                                    }
                                ).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.alert_confirm));
                                });
                            }
                        ]
                    }
                })

                .state('app.monovarietylist', { //零售店-------品种库
                    url: '/monovarietylist/{validator}',
                    templateUrl: 'src/tpl/monomerdrugstore/varietylist.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return uiLoad.load(['src/js/controllers/monomerdrugstore/varietylist.js', 'src/js/directives/ui-medicine.js']).then(function() {
                                    return uiLoad.load(JQ_CONFIG.alert_confirm.concat(JQ_CONFIG.dataTable));
                                });
                            }
                        ]
                    }
                })

                .state('app.monovarietylist.drug_detail', { //零售店------药品详情
                    url: '/drug_detail?{id}&{state}',
                    views: {
                        "modalDialog@app": {
                            templateUrl: 'src/tpl/monomerdrugstore/drug_detail.html'
                        }
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('src/js/controllers/monomerdrugstore/drug_detail.js');
                            }
                        ]
                    }
                })

                .state('app.monosalesmanager', { //零售店------销售抽成比例
                    url: '/monosalesmanager',
                    templateUrl: 'src/tpl/monomerdrugstore/separate_setting.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('src/js/controllers/monomerdrugstore/separate_setting.js').then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.alert_confirm));
                                });
                            }
                        ]
                    }
                })

                .state('app.monosalestable', { //零售店------销售报表
                    url: '/monosalestable',
                    templateUrl: 'src/tpl/monomerdrugstore/monosalestable.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('src/js/controllers/monomerdrugstore/monosalestable.js').then(function() {
                                    return uiLoad.load(JQ_CONFIG.dataTable);
                                });
                            }
                        ]
                    }
                })
                .state('app.monosalesrankinglist', { //零售店------销售排行榜
                    url: '/monosalesrankinglist',
                    templateUrl: 'src/tpl/monomerdrugstore/monosalesrankinglist.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('src/js/controllers/monomerdrugstore/monosalesrankinglist.js');
                            }
                        ]
                    }
                })
                .state('app.monomerdrugstore.adds', { //添加单个门店弹出页面
                    url: '/adds',
                    views: {
                        "modalDialog@app": {
                            templateUrl: 'src/tpl/monomerdrugstore/addmonomerdrug_1.html'
                        }
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('src/js/controllers/monomerdrugstore/addmonomerdrug_1.js').then(function() {
                                    return uiLoad.load(JQ_CONFIG.alert_confirm);
                                });
                            }
                        ]
                    }
                })
                .state('app.monomerdrugstore.details', { //店员或者店长详情页
                    url: '/details/{id}/{dz}',
                    views: {
                        "dialogView@app": {
                            templateUrl: 'src/tpl/monomerdrugstore/monomerdrugdetail.html'
                        }
                    },
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function($ocLazyLoad) {
                                return $ocLazyLoad.load('src/js/controllers/monomerdrugstore/monomerdrugdetail.js');
                            }
                        ]
                    }
                })
                .state('app.monointegrationtable', { //零售====积分兑换报表
                    url: '/monointegrationtable',
                    templateUrl: 'src/tpl/monomerdrugstore/integrationtable.html',
                    resolve: {
                        deps: ['uiLoad',
                            function(uiLoad) {
                                return uiLoad.load(['src/js/controllers/monomerdrugstore/integrationtable.js']).then(function() {
                                    return uiLoad.load(JQ_CONFIG.alert_confirm.concat(JQ_CONFIG.daterangepicker));
                                });
                            }
                        ]
                    }
                })
                .state('app.monointegrationactive', { //零售====积分兑换活动
                    url: '/monointegrationactive',
                    templateUrl: 'src/tpl/monomerdrugstore/integrationactive.html',
                    resolve: {
                        deps: ['uiLoad',
                            function(uiLoad) {
                                return uiLoad.load(['src/js/controllers/monomerdrugstore/integrationactive.js']).then(function() {
                                    return uiLoad.load(JQ_CONFIG.alert_confirm.concat(JQ_CONFIG.dataTable));
                                });
                            }
                        ]
                    }
                })
                .state('app.chaindrugstore', { //连锁药店
                    url: '/chaindrugstore',
                    templateUrl: 'src/tpl/chaindrugstore/contacts.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('src/js/controllers/chaindrugstore/contacts.js').then(
                                    function() {
                                        return $ocLazyLoad.load('angularBootstrapNavTree');
                                    }
                                ).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.alert_confirm));
                                });
                            }
                        ]
                    }
                })

                .state('app.chaindrugstore.list', {
                    url: '/list/{id}',
                    templateUrl: 'src/tpl/chaindrugstore/contacts_list.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('src/js/controllers/chaindrugstore/contacts_list.js').then(function() {
                                    return uiLoad.load(JQ_CONFIG.dataTable);
                                });
                            }
                        ]
                    }
                })
                .state('app.chaindrugstore.adds', { //添加单个门店弹出页面
                    url: '/adds',
                    views: {
                        "modalDialog@app": {
                            templateUrl: 'src/tpl/chaindrugstore/addmonomerdrug_1.html'
                        }
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('src/js/controllers/chaindrugstore/addmonomerdrug_1.js').then(function() {
                                    return uiLoad.load(JQ_CONFIG.alert_confirm);
                                });
                            }
                        ]
                    }
                })
                .state('app.chaindrugstore.details', { //店员或者店长详情页
                    url: '/details/{id}/{dz}',
                    views: {
                        "dialogView@app": {
                            templateUrl: 'src/tpl/chaindrugstore/monomerdrugdetail.html'
                        }
                    },
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function($ocLazyLoad) {
                                return $ocLazyLoad.load('src/js/controllers/chaindrugstore/monomerdrugdetail.js');
                            }
                        ]
                    }
                })

                .state('app.chainvarietylist', { //连锁药店-------品种库
                    url: '/chainvarietylist/{validator}',
                    templateUrl: 'src/tpl/chaindrugstore/varietylist.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return uiLoad.load(['src/js/controllers/chaindrugstore/varietylist.js', 'src/js/directives/ui-medicine.js']).then(function() {
                                    return uiLoad.load(JQ_CONFIG.alert_confirm.concat(JQ_CONFIG.dataTable));
                                });
                            }
                        ]
                    }
                })

                .state('app.chainvarietylist.drug_detail', { //连锁药店------药品详情
                    url: '/drug_detail?{id}&{state}',
                    views: {
                        "modalDialog@app": {
                            templateUrl: 'src/tpl/chaindrugstore/drug_detail.html'
                        }
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('src/js/controllers/chaindrugstore/drug_detail.js');
                            }
                        ]
                    }
                })
                .state('app.chainsalesmanager', { //连锁药店------销售抽成比例
                    url: '/chainsalesmanager',
                    templateUrl: 'src/tpl/chaindrugstore/separate_setting.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('src/js/controllers/chaindrugstore/separate_setting.js').then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.alert_confirm));
                                });
                            }
                        ]
                    }
                })
                .state('app.chainsalestable', { //连锁药店------销售报表
                    url: '/chainsalestable',
                    templateUrl: 'src/tpl/chaindrugstore/chainsalestable.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('src/js/controllers/chaindrugstore/chainsalestable.js').then(function() {
                                    return uiLoad.load(JQ_CONFIG.dataTable);
                                });
                            }
                        ]
                    }
                })
                .state('app.chainsalesrankinglist', { //连锁药店------销售排行榜
                    url: '/chainsalesrankinglist',
                    templateUrl: 'src/tpl/chaindrugstore/chainsalesrankinglist.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('src/js/controllers/chaindrugstore/chainsalesrankinglist.js');
                            }
                        ]
                    }
                })
                .state('app.chainintegrationtable', { //零售====积分兑换报表
                    url: '/chainintegrationtable',
                    templateUrl: 'src/tpl/chaindrugstore/integrationtable.html',
                    resolve: {
                        deps: ['uiLoad',
                            function(uiLoad) {
                                return uiLoad.load(['src/js/controllers/chaindrugstore/integrationtable.js']).then(function() {
                                    return uiLoad.load(JQ_CONFIG.daterangepicker);
                                });
                            }
                        ]
                    }
                })
                .state('app.chainintegrationactive', { //零售====积分兑换活动
                    url: '/chainintegrationactive',
                    templateUrl: 'src/tpl/chaindrugstore/integrationactive.html',
                    resolve: {
                        deps: ['uiLoad',
                            function(uiLoad) {
                                return uiLoad.load(['src/js/controllers/chaindrugstore/integrationactive.js']).then(function() {
                                    return uiLoad.load(JQ_CONFIG.alert_confirm.concat(JQ_CONFIG.dataTable));
                                });
                            }
                        ]
                    }
                })


                .state('app.addmonomerdrug', { //添加单个门店通讯录
                    url: '/addmonomerdrug',
                    templateUrl: 'src/tpl/group/addmonomerdrug.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('src/js/controllers/group/addmonomerdrug.js').then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree);
                                });
                            }
                        ]
                    }
                })

                .state('app.varietylistconfirm', { //品种库认证
                    url: '/varietylistconfirm',
                    templateUrl: 'src/tpl/drug/varietylistconfirm.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return uiLoad.load(['src/js/controllers/drug/varietylistconfirm.js']).then(function() {
                                    return uiLoad.load(JQ_CONFIG.alert_confirm.concat(JQ_CONFIG.dataTable));
                                });
                            }
                        ]
                    }
                })

                .state('app.join_store_manager', { //加盟店（门店）管理
                    url: '/join_store_manager',
                    templateUrl: 'src/tpl/group/join_store_manager.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return uiLoad.load(['src/js/controllers/group/join_store_manager.js']);
                            }
                        ]
                    }
                })
                .state('app.join_store_manager_add', { //加盟店（门店添加）管理
                    url: '/join_store_manager_add',
                    templateUrl: 'src/tpl/group/join_store_manager_add.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return uiLoad.load(['src/js/controllers/group/join_store_manager_add.js']);
                            }
                        ]
                    }
                })
                .state('app.system_message', { //系统消息
                    url: '/system_message',
                    templateUrl: 'src/tpl/group/system_message.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('src/js/controllers/group/system_message.js').then(function() {
                                    return uiLoad.load(JQ_CONFIG.alert_confirm.concat(JQ_CONFIG.dataTable));
                                });
                            }
                        ]
                    }
                }).state('app.setting', { //系统设置app.setting
                    url: '/setting?position',
                    templateUrl: 'src/tpl/setting/setting.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load([
                                    'toaster',
                                    // 七牛上传文件组件
                                    'components/qiniuUploader/rely/plupload.full.min.js',
                                    'components/qiniuUploader/qiniuUploaderController.js',
                                    'components/qiniuUploader/qiniuUploaderDirective.js',

                                    'src/js/controllers/setting/setting.js'
                                ]).then(function() {
                                    return uiLoad.load(JQ_CONFIG.alert_confirm);
                                });
                            }
                        ]
                    }
                }).state('app.store_manager', { //门店管理员
                    url: '/store_manager',
                    templateUrl: 'src/tpl/group/store_manager.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('src/js/controllers/group/store_manager.js').then(function() {
                                    return uiLoad.load(JQ_CONFIG.alert_confirm);
                                });
                            }
                        ]
                    }
                }).state('app.store_manager.storemanageradd', { //门店管理员添加
                    url: '/storemanageradd',
                    views: {
                        "modalDialog@app": {
                            templateUrl: 'src/tpl/group/store_manager_add.html'
                        }
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return uiLoad.load(['src/js/controllers/group/store_manager_add.js']);
                            }
                        ]
                    }
                }).state('app.store_manager.store_manager_zong', { ///总店管理员添加
                    url: '/store_manager_zong',
                    views: {
                        "modalDialog@app": {
                            templateUrl: 'src/tpl/group/store_manager_zong.html'
                        }
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('src/js/controllers/group/store_manager_zong.js');
                            }
                        ]
                    }
                })
                .state('app.groupSettings', {
                    url: '/groupSettings/:groupId',
                    templateUrl: 'src/tpl/group/groupSettings.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load(['ngFileUpload', 'toaster']).then(function() {
                                    return uiLoad.load(['src/js/controllers/group/groupSettings.js']);
                                });
                            }
                        ]
                    }
                })
                //值班表
                .state('app.schedule', {
                    url: '/schedule',
                    templateUrl: 'src/tpl/group/schedule.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load(['toaster', 'src/js/controllers/group/schedule.js']).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree);
                                });
                            }
                        ]
                    }
                })
                // 集团管理员
                .state('app.group_admin', {
                    url: '/group_admin',
                    templateUrl: 'src/tpl/group/administrator.html',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function($ocLazyLoad) {
                                return $ocLazyLoad.load(['toaster', 'src/js/controllers/group/administrator.js']);
                            }
                        ]
                    }
                })
                //公司模块
                .state('app.group_manage', {
                    url: '/group_manage',
                    templateUrl: 'src/tpl/enterprise/group_manage.html',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function($ocLazyLoad) {
                                return $ocLazyLoad.load('src/js/controllers/enterprise/group_manage.js');
                            }
                        ]
                    }
                }).state('app.group_manage.enterprise_setting', {
                    url: '/enterprise_setting',
                    views: {
                        "@app": {
                            templateUrl: 'src/tpl/enterprise/enterprise_setting.html'
                        }
                    },
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function($ocLazyLoad) {
                                return $ocLazyLoad.load('src/js/controllers/enterprise/enterprise_setting.js');
                            }
                        ]
                    }
                }).state('app.en_admin', {
                    url: '/en_admin',
                    templateUrl: 'src/tpl/enterprise/administrator.html',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function($ocLazyLoad) {
                                return $ocLazyLoad.load(['toaster', 'src/js/controllers/enterprise/administrator.js']);
                            }
                        ]
                    }
                })
                .state('access.Fill_Info', {
                    url: '/Fill_Info',
                    templateUrl: 'src/tpl/enterprise/Fill_Info.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('ngFileUpload').then(function() {
                                    return uiLoad.load(['src/js/controllers/enterprise/Fill_Info.js']);
                                });
                            }
                        ]
                    }
                })
                .state('access.signup_success', {
                    url: '/signup_success',
                    templateUrl: 'src/tpl/enterprise/signup_success.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function(uiLoad) {
                                return uiLoad.load(['src/js/controllers/enterprise/signup_success.js']);
                            }
                        ]
                    }
                })
                .state('access.enterprise_verify', {
                    url: '/verify',
                    templateUrl: 'src/tpl/enterprise/verify.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function(uiLoad) {
                                return uiLoad.load(['src/js/controllers/enterprise/verify.js']);
                            }
                        ]
                    }
                })

                // 其它
                .state('access.forgotpwd', {
                    url: '/forgotpwd',
                    templateUrl: 'src/tpl/forgotpwd.html',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function($ocLazyLoad) {
                                return $ocLazyLoad.load('src/js/controllers/enterprise/forgotpwd.js');
                            }
                        ]
                    }
                }).state('access.resetPassword', {
                    url: '/resetPassword',
                    templateUrl: 'src/tpl/enterprise/resetPassword.html',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function($ocLazyLoad) {
                                return $ocLazyLoad.load('src/js/controllers/enterprise/resetPassword.js');
                            }
                        ]
                    }
                }).state('access.404', {
                    url: '/404',
                    templateUrl: 'src/tpl/404.html'
                }).state('app.mail.list', {
                    url: '/inbox/{fold}',
                    templateUrl: 'src/tpl/mail.list.html'
                }).state('app.mail.detail', {
                    abstract: true,
                    url: '/{mailId:[0-9]{1,4}}',
                    templateUrl: 'src/tpl/mail.detail.html'
                })
                //app端接受邀请
                .state('appInvite', {
                    url: '/appInvite',
                    templateUrl: 'src/tpl/appInvite.html'
                });
        }
    ]);
