'use strict';

angular.module('app').run(
    ['$rootScope', '$state', '$stateParams',
        function($rootScope, $state, $stateParams) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        }
    ]).config(
    ['$stateProvider', '$urlRouterProvider', 'JQ_CONFIG',
        function($stateProvider, $urlRouterProvider, JQ_CONFIG) {
            var version = '12121212';
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
                        }
                    },
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function($ocLazyLoad) {
                                return $ocLazyLoad.load(['toaster', 'src/js/directives/ui-medicine.js']);
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
                // 医生集团认证审核
                .state('app.check', {
                    url: '/check',
                    template: '<div ui-view></div>'
                }).state('app.check.doctor', {
                    url: '/doctor',
                    template: '<div ui-view></div>'
                }).state('app.check.group', {
                    url: '/group',
                    template: '<div ui-view></div>'
                })
                // 医生审核
                .state('app.check.doctor.check_list', {
                    url: '/check_list/{type}/{page}',
                    templateUrl: 'src/tpl/customer_service/doctor_check_list.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('src/js/controllers/customer_service/doctor_check_list.js').then(function() {
                                    return uiLoad.load(JQ_CONFIG.dataTable);
                                });
                            }
                        ]
                    }
                })
                // 集团加V审核
                .state('app.check.group.with_v_list', {
                    url: '/with_v_list/{type}/{page}',
                    templateUrl: 'src/tpl/customer_service/with_v_list.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('src/js/controllers/customer_service/with_v_list.js').then(function() {
                                    return uiLoad.load(JQ_CONFIG.dataTable);
                                });
                            }
                        ]
                    }
                }).state('app.check.group.with_v_check_view', {
                    url: '/with_v_check_view/{id}',
                    templateUrl: 'src/tpl/customer_service/with_v_check_view.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('src/js/controllers/customer_service/with_v_check_view.js').then(function() {
                                    return uiLoad.load(JQ_CONFIG.dataTable);
                                });
                            }
                        ]
                    }
                }).state('app.check.group.with_v_details_view', {
                    url: '/with_v_details_view/{id}',
                    templateUrl: 'src/tpl/customer_service/with_v_check_view.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('src/js/controllers/customer_service/with_v_check_view.js').then(function() {
                                    return uiLoad.load(JQ_CONFIG.dataTable);
                                });
                            }
                        ]
                    }
                })
                // 集团审核
                .state('app.check.group.check_list', {
                    url: '/check_list/{type}/{page}',
                    templateUrl: 'src/tpl/customer_service/group_check_list.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('src/js/controllers/customer_service/group_check_list.js').then(function() {
                                    return uiLoad.load(JQ_CONFIG.dataTable);
                                });
                            }
                        ]
                    }
                }).state('app.check.group.check_view', {
                    url: '/check_view/{id}',
                    templateUrl: 'src/tpl/customer_service/group_check_view.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('src/js/controllers/customer_service/group_check_view.js').then(function() {
                                    return uiLoad.load(JQ_CONFIG.dataTable);
                                });
                            }
                        ]
                    }
                }).state('app.check.group.details_view', {
                    url: '/details_view/{id}',
                    templateUrl: 'src/tpl/customer_service/group_check_view.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('src/js/controllers/customer_service/group_check_view.js').then(function() {
                                    return uiLoad.load(JQ_CONFIG.dataTable);
                                });
                            }
                        ]
                    }
                }).state('app.group_check_view', {
                    url: '/group_check_view/{id}',
                    templateUrl: 'src/tpl/customer_service/group_check_view.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('src/js/controllers/customer_service/group_check_view.js').then(function() {
                                    return uiLoad.load(JQ_CONFIG.dataTable);
                                });
                            }
                        ]
                    }
                }).state('app.group_check_list_nopass', {
                    url: '/group_check_list_nopass',
                    templateUrl: 'src/tpl/customer_service/group_check_list.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('src/js/controllers/customer_service/group_check_list.js').then(function() {
                                    return uiLoad.load(JQ_CONFIG.dataTable);
                                });
                            }
                        ]
                    }
                }).state('app.group_check_undone_view', {
                    url: '/group_check_undone',
                    templateUrl: 'src/tpl/customer_service/group_check_edit.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('src/js/controllers/customer_service/group_check_edit.js').then(function() {
                                    return uiLoad.load(JQ_CONFIG.dataTable);
                                });
                            }
                        ]
                    }
                })
                .state('app.group_check_pass_view', {
                    url: '/group_check_pass_view',
                    templateUrl: 'src/tpl/customer_service/group_check_view.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('src/js/controllers/customer_service/group_check_views.js').then(function() {
                                    return uiLoad.load(JQ_CONFIG.dataTable);
                                });
                            }
                        ]
                    }
                })
                .state('app.group_check_nopass_view', {
                    url: '/group_check_nopass_view',
                    templateUrl: 'src/tpl/customer_service/group_check_view.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('src/js/controllers/customer_service/group_check_views.js').then(function() {
                                    return uiLoad.load(JQ_CONFIG.dataTable);
                                });
                            }
                        ]
                    }
                })

            // 护士集团认证审核
            .state('app.vgroup_check_list', {
                    url: '/vgroup_check_list/{type}',
                    templateUrl: 'src/tpl/v_nurse/vgroup_check_list.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('src/js/controllers/v_nurse/v_group_check_list.js').then(function() {
                                    return uiLoad.load(JQ_CONFIG.dataTable);
                                });
                            }
                        ]
                    }
                })
                .state('app.v_not_details', {
                    url: '/v_not_details/{id}',
                    templateUrl: 'src/tpl/v_nurse/v_not_details.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('src/js/controllers/v_nurse/v_not_details.js').then(function() {
                                    return uiLoad.load(JQ_CONFIG.dataTable);
                                });
                            }
                        ]
                    }
                })
                .state('app.v_check_edit', {
                    url: '/v_check_edit/{id}',
                    templateUrl: 'src/tpl/v_nurse/v_check_edit.html',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function($ocLazyLoad) {
                                return $ocLazyLoad.load('src/js/controllers/v_nurse/v_check_edit.js');
                            }
                        ]
                    }
                })
                // 订单管理
                .state('app.order_query', {
                    url: '/order_query',
                    templateUrl: 'src/tpl/v_nurse/order_query.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('src/js/controllers/v_nurse/order_query.js').then(function() {
                                    return uiLoad.load(JQ_CONFIG.dataTable);
                                });
                            }
                        ]
                    }
                })
                // 充值确认
                .state('app.topUp_confirm', {
                    url: '/topUp_confirm',
                    templateUrl: 'src/tpl/capitalLibrary/topUp_confirm.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load(['src/js/controllers/capitalLibrary/topUp_confirm.js', 'toaster']).then(function() {
                                    return uiLoad.load(JQ_CONFIG.moment);
                                });
                            }
                        ]
                    }
                })
                .state('app.order_list', {
                    url: '/order_list/{id}',
                    templateUrl: 'src/tpl/v_nurse/order_list.html',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function($ocLazyLoad) {
                                return $ocLazyLoad.load('src/js/controllers/v_nurse/order_list.js');
                            }
                        ]
                    }
                })
                .state('app.order_query.order_details', {
                    url: '/order_details/{id}',
                    templateUrl: 'src/tpl/v_nurse/order_details.html',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function($ocLazyLoad) {
                                return $ocLazyLoad.load('src/js/controllers/v_nurse/order_details.js');
                            }
                        ]
                    }
                })
                .state('app.nurse_order_list', {
                    url: '/nurse_order_list/{type}',
                    templateUrl: 'src/tpl/v_nurse/nurse_order_list.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('src/js/controllers/v_nurse/nurse_order_list.js').then(function() {
                                    return uiLoad.load(JQ_CONFIG.dataTable);
                                });
                            }
                        ]
                    }
                })

            .state('app.o_not_details', {
                    url: '/o_not_details/{id}',
                    templateUrl: 'src/tpl/v_nurse/o_not_details.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('src/js/controllers/v_nurse/o_not_details.js').then(function() {
                                    return uiLoad.load(JQ_CONFIG.dataTable);
                                });
                            }
                        ]
                    }
                })
                .state('app.o_pass_details', {
                    url: '/o_pass_details/{id}',
                    templateUrl: 'src/tpl/v_nurse/o_pass_details.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('src/js/controllers/v_nurse/o_pass_details.js').then(function() {
                                    return uiLoad.load(JQ_CONFIG.dataTable);
                                });
                            }
                        ]
                    }
                })
                .state('app.o_cancel_details', {
                    url: '/o_cancel_details/{id}',
                    templateUrl: 'src/tpl/v_nurse/o_cancel_details.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('src/js/controllers/v_nurse/o_cancel_details.js').then(function() {
                                    return uiLoad.load(JQ_CONFIG.dataTable);
                                });
                            }
                        ]
                    }
                })
                .state('app.o_ing_details', {
                    url: '/o_ing_details/{id}',
                    templateUrl: 'src/tpl/v_nurse/o_ing_details.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('src/js/controllers/v_nurse/o_ing_details.js').then(function() {
                                    return uiLoad.load(JQ_CONFIG.dataTable);
                                });
                            }
                        ]
                    }
                })
                // 公司审核
                .state('app.company_check_list_undone', {
                    url: '/company_check_list_undone',
                    templateUrl: 'src/tpl/customer_service/company_check_list_undone.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('src/js/controllers/customer_service/company_check_list_undone.js').then(function() {
                                    return uiLoad.load(JQ_CONFIG.dataTable);
                                });
                            }
                        ]
                    }
                }).state('app.company_check_list_pass', {
                    url: '/company_check_list_pass',
                    templateUrl: 'src/tpl/customer_service/company_check_list_pass.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('src/js/controllers/customer_service/company_check_list_pass.js').then(function() {
                                    return uiLoad.load(JQ_CONFIG.dataTable);
                                });
                            }
                        ]
                    }
                }).state('app.company_check_pass_view', {
                    url: '/company_check_pass_view',
                    templateUrl: 'src/tpl/customer_service/company_check_pass_view.html',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function($ocLazyLoad) {
                                return $ocLazyLoad.load('src/js/controllers/customer_service/company_check_pass_view.js');
                            }
                        ]
                    }
                }).state('app.company_check_list_nopass', {
                    url: '/company_check_list_nopass',
                    templateUrl: 'src/tpl/customer_service/company_check_list_nopass.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('src/js/controllers/customer_service/company_check_list_nopass.js').then(function() {
                                    return uiLoad.load(JQ_CONFIG.dataTable);
                                });
                            }
                        ]
                    }
                }).state('app.company_check_nopass_view', {
                    url: '/company_check_nopass_view',
                    templateUrl: 'src/tpl/customer_service/company_check_nopass_view.html',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function($ocLazyLoad) {
                                return $ocLazyLoad.load('src/js/controllers/customer_service/company_check_nopass_view.js');
                            }
                        ]
                    }
                }).state('app.company_check_edit', {
                    url: '/company_check_edit',
                    templateUrl: 'src/tpl/customer_service/company_check_edit.html',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function($ocLazyLoad) {
                                return $ocLazyLoad.load('src/js/controllers/customer_service/company_check_edit.js');
                            }
                        ]
                    }
                }).state('app.check_list_undone', {
                    url: '/check_list_undone',
                    templateUrl: 'src/tpl/customer_service/check_list_undone.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('src/js/controllers/customer_service/check_list_undone.js').then(function() {
                                    return uiLoad.load(JQ_CONFIG.dataTable);
                                });
                            }
                        ]
                    }
                }).state('app.check_list_pass', {
                    url: '/check_list_pass',
                    templateUrl: 'src/tpl/customer_service/check_list_pass.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('src/js/controllers/customer_service/check_list_pass.js').then(function() {
                                    return uiLoad.load(JQ_CONFIG.dataTable);
                                });
                            }
                        ]
                    }
                }).state('app.check_pass_view', {
                    url: '/check_pass_view',
                    templateUrl: 'src/tpl/customer_service/check_pass_view.html',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function($ocLazyLoad) {
                                return $ocLazyLoad.load('src/js/controllers/customer_service/check_pass_view.js');
                            }
                        ]
                    }
                }).state('app.check_list_nopass', {
                    url: '/check_list_nopass',
                    templateUrl: 'src/tpl/customer_service/check_list_nopass.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('src/js/controllers/customer_service/check_list_nopass.js').then(function() {
                                    return uiLoad.load(JQ_CONFIG.dataTable);
                                });
                            }
                        ]
                    }
                }).state('app.check_nopass_view', {
                    url: '/check_nopass_view',
                    templateUrl: 'src/tpl/customer_service/check_nopass_view.html',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function($ocLazyLoad) {
                                return $ocLazyLoad.load('src/js/controllers/customer_service/check_nopass_view.js');
                            }
                        ]
                    }
                }).state('app.check_list_nocheck', {
                    url: '/check_list_nocheck',
                    templateUrl: 'src/tpl/customer_service/check_list_nocheck.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('src/js/controllers/customer_service/check_list_nocheck.js').then(function() {
                                    return uiLoad.load(JQ_CONFIG.dataTable);
                                });
                            }
                        ]
                    }
                }).state('app.check_nocheck_view', {
                    url: '/check_nocheck_view',
                    templateUrl: 'src/tpl/customer_service/check_nocheck_view.html',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function($ocLazyLoad) {
                                return $ocLazyLoad.load('src/js/controllers/customer_service/check_nocheck_view.js');
                            }
                        ]
                    }
                }).state('app.check_edit', {
                    url: '/check_edit',
                    templateUrl: 'src/tpl/customer_service/check_edit.html',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function($ocLazyLoad) {
                                return $ocLazyLoad.load('src/js/controllers/customer_service/check_edit.js');
                            }
                        ]
                    }
                }).state('app.feedback_undone', {
                    url: '/feedback_undone',
                    templateUrl: 'src/tpl/customer_service/feedback_undone.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('src/js/controllers/customer_service/feedback_undone.js').then(function() {
                                    return uiLoad.load(JQ_CONFIG.dataTable);
                                });
                            }
                        ]
                    }
                }).state('app.feedback_view', {
                    url: '/feedback_view',
                    templateUrl: 'src/tpl/customer_service/feedback_view.html',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function($ocLazyLoad) {
                                return $ocLazyLoad.load('src/js/controllers/customer_service/feedback_view.js');
                            }
                        ]
                    }
                })
                // 订单
                .state('app.order', {
                    url: '/order',
                    templateUrl: 'src/tpl/order/order.html',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function($ocLazyLoad) {
                                return $ocLazyLoad.load('src/js/controllers/order/order.js');
                            }
                        ]
                    }
                })
                .state('app.order.done', {
                    url: '/done',
                    templateUrl: 'src/tpl/order/order_done.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('src/js/controllers/order/order_done.js').then(function() {
                                    return uiLoad.load(JQ_CONFIG.dataTable);
                                });
                            }
                        ]
                    }
                })
                // 文档中心
                .state('app.doc', {
                    url: '/doc',
                    template: '<div ui-view></div>'
                }).state('app.doc.article', {
                    url: '/article',
                    template: '<div ui-view></div>'
                }).state('app.doc.ads', {
                    url: '/ads',
                    template: '<div ui-view></div>'
                })
                //文章列表
                .state('app.doc.article.list', {
                    url: '/list',
                    templateUrl: 'src/tpl/document/article_list.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('toaster').then(
                                    function() {
                                        return $ocLazyLoad.load('angularBootstrapNavTree');
                                    }
                                ).then(
                                    function() {
                                        return $ocLazyLoad.load('src/js/controllers/document/article_list.js');
                                    }
                                ).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.dataTable, JQ_CONFIG.clipboard));
                                });
                            }
                        ]
                    }
                })
                //新建文章
                .state('app.create_article', {
                    url: '/create_article',
                    templateUrl: 'src/tpl/document/edit_article.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(function() {
                                    return $ocLazyLoad.load({
                                        files: ['src/js/controllers/document/edit_article.js',
                                            // 七牛上传文件组件
                                            '../components/qiniuUploader/rely/plupload.full.min.js',
                                            '../components/qiniuUploader/qiniuUploaderController.js',
                                            '../components/qiniuUploader/qiniuUploaderDirective.js'
                                        ],
                                        cache: false
                                    }).then(function() {
                                        return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                                    });
                                });
                            }
                        ]
                    }
                })
                //编辑文章
                .state('app.edit_article', {
                    url: '/edit_article/{id}',
                    templateUrl: 'src/tpl/document/edit_article.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(function() {
                                    return $ocLazyLoad.load(['src/js/controllers/document/edit_article.js',
                                        // 七牛上传文件组件
                                        '../components/qiniuUploader/rely/plupload.full.min.js',
                                        '../components/qiniuUploader/qiniuUploaderController.js',
                                        '../components/qiniuUploader/qiniuUploaderDirective.js'
                                    ]).then(function() {
                                        return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                                    });
                                });
                            }
                        ]
                    }
                })
                //浏览文章
                .state('article', {
                    url: '/article/{id}',
                    templateUrl: 'src/tpl/document/article.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(function() {
                                    return $ocLazyLoad.load('src/js/controllers/document/article.js').then(function() {
                                        return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                                    });
                                });
                            }
                        ]
                    }
                })
                //浏览页面的编辑文章
                .state('edit_article', {
                    url: '/edit_article/{id}',
                    templateUrl: 'src/tpl/document/edit_article.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(function() {
                                    return $ocLazyLoad.load(['src/js/controllers/document/edit_article.js',
                                        // 七牛上传文件组件
                                        '../components/qiniuUploader/rely/plupload.full.min.js',
                                        '../components/qiniuUploader/qiniuUploaderController.js',
                                        '../components/qiniuUploader/qiniuUploaderDirective.js'
                                    ]).then(function() {
                                        return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                                    });
                                });
                            }
                        ]
                    }
                })
                //健康科普列表
                .state('app.doc.health', {
                    url: '/health',
                    template: '<div ui-view></div>'
                })
                .state('app.doc.health.science', {
                    url: '/health_science',
                    templateUrl: 'src/tpl/document/health_science.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('toaster').then(
                                    function() {
                                        return $ocLazyLoad.load('angularBootstrapNavTree');
                                    }
                                ).then(
                                    function() {
                                        return $ocLazyLoad.load('src/js/controllers/document/health_science.js');
                                    }
                                ).then(function() {
                                    return uiLoad.load(JQ_CONFIG.dataTable.concat(JQ_CONFIG.clipboard));
                                });
                            }
                        ]
                    }
                })
                //新建健康科普
                .state('app.create_health_science', {
                    url: '/create_health_science',
                    templateUrl: 'src/tpl/document/edit_health_science.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load(['ui.select', 'toaster', 'ngFileUpload']).then(function() {
                                    return $ocLazyLoad.load(['src/js/controllers/document/edit_health_science.js',
                                        // 七牛上传文件组件
                                        '../components/qiniuUploader/rely/plupload.full.min.js',
                                        '../components/qiniuUploader/qiniuUploaderController.js',
                                        '../components/qiniuUploader/qiniuUploaderDirective.js'
                                    ]).then(function() {
                                        return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                                    });
                                });
                            }
                        ]
                    }
                })
                //编辑健康科普
                .state('app.edit_health_science', {
                    url: '/edit_health_science/{id}',
                    templateUrl: 'src/tpl/document/edit_health_science.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load(['ui.select', 'toaster', 'ngFileUpload']).then(function() {
                                    return $ocLazyLoad.load('src/js/controllers/document/edit_health_science.js').then(function() {
                                        return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                                    });
                                });
                            }
                        ]
                    }
                })
                //查看健康科普文章
                .state('health_science_article', {
                    url: '/health_science_article/{id}',
                    templateUrl: 'src/tpl/document/health_science_article.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('toaster').then(function() {
                                    return $ocLazyLoad.load('src/js/controllers/document/health_science_article.js');
                                });
                            }
                        ]
                    }
                })
                //查看健康科普页面的编辑文章
                .state('edit_health_science', {
                    url: '/edit_health_science/{id}',
                    templateUrl: 'src/tpl/document/edit_health_science.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load(['ui.select', 'toaster', 'ngFileUpload']).then(function() {
                                    return $ocLazyLoad.load(['src/js/controllers/document/edit_health_science.js',
                                        // 七牛上传文件组件
                                        '../components/qiniuUploader/rely/plupload.full.min.js',
                                        '../components/qiniuUploader/qiniuUploaderController.js',
                                        '../components/qiniuUploader/qiniuUploaderDirective.js'
                                    ]).then(function() {
                                        return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                                    });
                                });
                            }
                        ]
                    }
                })
                //患者广告条
                .state('app.doc.ads.patient', {
                    url: '/patient',
                    templateUrl: 'src/tpl/document/patient_adv.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('toaster').then(
                                    function() {
                                        return $ocLazyLoad.load('src/js/controllers/document/patient_adv.js');
                                    }
                                ).then(function() {
                                    return uiLoad.load(JQ_CONFIG.dataTable.concat(JQ_CONFIG.clipboard));
                                });
                            }
                        ]
                    }
                })
                //新建患者广告
                .state('app.create_patient_ad', {
                    url: '/create_patient_ad',
                    templateUrl: 'src/tpl/document/edit_patient_adv.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load(['ui.select', 'toaster', 'ngFileUpload']).then(function() {
                                    return $ocLazyLoad.load(['src/js/controllers/document/edit_patient_adv.js',
                                        // 七牛上传文件组件
                                        '../components/qiniuUploader/rely/plupload.full.min.js',
                                        '../components/qiniuUploader/qiniuUploaderController.js',
                                        '../components/qiniuUploader/qiniuUploaderDirective.js'
                                    ]).then(function() {
                                        return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                                    });
                                });
                            }
                        ]
                    }
                })
                //编辑患者广告
                .state('app.edit_patient_ad', {
                    url: '/edit_patient_ad/{id}',
                    templateUrl: 'src/tpl/document/edit_patient_adv.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(function() {
                                    return $ocLazyLoad.load(['src/js/controllers/document/edit_patient_adv.js', // 七牛上传文件组件
                                        '../components/qiniuUploader/rely/plupload.full.min.js',
                                        '../components/qiniuUploader/qiniuUploaderController.js',
                                        '../components/qiniuUploader/qiniuUploaderDirective.js'
                                    ]).then(function() {
                                        return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                                    });
                                });
                            }
                        ]
                    }
                })
                //查看患者广告文章
                .state('patient_ad_article', {
                    url: '/patient_adv_article/{id}',
                    templateUrl: 'src/tpl/document/patient_adv_article.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('toaster').then(function() {
                                    return $ocLazyLoad.load('src/js/controllers/document/patient_adv_article.js');
                                });
                            }
                        ]
                    }
                })
                //查看患者广告页面的编辑文章
                .state('edit_patient_ad', {
                    url: '/edit_patient_ad/{id}',
                    templateUrl: 'src/tpl/document/edit_patient_adv.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(function() {
                                    return $ocLazyLoad.load(['src/js/controllers/document/edit_patient_adv.js', // 七牛上传文件组件
                                        '../components/qiniuUploader/rely/plupload.full.min.js',
                                        '../components/qiniuUploader/qiniuUploaderController.js',
                                        '../components/qiniuUploader/qiniuUploaderDirective.js'
                                    ]).then(function() {
                                        return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                                    });
                                });
                            }
                        ]
                    }
                })
                //公众账号start
                .state('app.public_msg_list', {
                    url: '/public_msg_list',
                    templateUrl: 'src/tpl/public_msg/public_msg_list.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('src/js/controllers/public_msg/public_msg_list.js');
                            }
                        ]
                    }
                })
                .state('app.msg_manage', {
                    url: '/msg_manage/{id}',
                    templateUrl: 'src/tpl/public_msg/msg_manage.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('src/js/controllers/public_msg/msg_manage.js');
                            }
                        ]
                    }
                })
                .state('app.msg_manage.send_msg', {
                    url: '/send_msg',
                    templateUrl: 'src/tpl/public_msg/send_msg.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(function() {
                                    return $ocLazyLoad.load(['src/js/controllers/public_msg/send_msg.js',
                                        // 七牛上传文件组件
                                        '../components/qiniuUploader/rely/plupload.full.min.js',
                                        '../components/qiniuUploader/qiniuUploaderController.js',
                                        '../components/qiniuUploader/qiniuUploaderDirective.js'
                                    ]).then(function() {
                                        return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                                    });
                                });
                            }
                        ]
                    }
                })
                .state('app.msg_manage.msg_history', {
                    url: '/msg_history',
                    templateUrl: 'src/tpl/public_msg/msg_history.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('toaster').then(
                                    function() {
                                        return $ocLazyLoad.load('src/js/controllers/public_msg/msg_history.js');
                                    }
                                ).then(function() {
                                    return uiLoad.load(JQ_CONFIG.dataTable);
                                });
                            }
                        ]
                    }
                })
                .state('app.msg_manage.setting', {
                    url: '/setting',
                    templateUrl: 'src/tpl/public_msg/setting.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(
                                    function() {
                                        return $ocLazyLoad.load('src/js/controllers/public_msg/setting.js');
                                    }
                                );
                            }
                        ]
                    }
                })
                //公众账号end
                //短信查询
                .state('app.message_query', {
                    url: '/message_query',
                    templateUrl: 'src/tpl/message/message_query.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('src/js/controllers/message/message_query.js').then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.dataTable));
                                });
                            }
                        ]
                    }
                })
                //短信模板
                .state('app.message_tpl', {
                    url: '/message_tpl',
                    templateUrl: 'src/tpl/message/message_tpl.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load('toaster').then(
                                    function() {
                                        return $ocLazyLoad.load('src/js/controllers/message/message_tpl.js');
                                    }
                                ).then(function() {
                                    return uiLoad.load(JQ_CONFIG.dataTable);
                                });
                            }
                        ]
                    }
                })
                //编辑短信模板
                .state('app.edit_message_tpl', {
                    url: '/edit_message_tpl/:id',
                    templateUrl: 'src/tpl/message/edit_message_tpl.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load(['ui.select', 'toaster']).then(
                                    function() {
                                        return $ocLazyLoad.load('src/js/controllers/message/edit_message_tpl.js');
                                    }
                                );
                            }
                        ]
                    }
                })
                //健康关怀计划-计划列表
                .state('app.care_plan_list', {
                    url: '/care_plan_list',
                    templateUrl: '../src/tpl/care/care_plan_list.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load(['toaster', '../src/js/controllers/care/care_plan_list.js']).then(function() {
                                    return uiLoad.load(JQ_CONFIG.dataTable.concat(JQ_CONFIG.tree));
                                });
                            }
                        ]
                    }
                })
                //健康关怀计划-关怀计划
                .state('app.carePlan', {
                    url: '/carePlan/:planId',
                    templateUrl: '../src/tpl/care/carePlan/carePlan.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load([
                                    'toaster',
                                    'xeditable',

                                    // 七牛上传文件组件
                                    '../components/qiniuUploader/rely/plupload.full.min.js',
                                    '../components/qiniuUploader/qiniuUploaderController.js',
                                    '../components/qiniuUploader/qiniuUploaderDirective.js',
                                    // 百度富文本编辑器
                                    '../components/ngUmeditor/umeditor/third-party/jquery.min.js',
                                    '../components/ngUmeditor/umeditor/umeditor.min.js',
                                    '../components/ngUmeditor/umeditor/umeditor.config.js',
                                    '../components/ngUmeditor/umeditor/themes/default/css/umeditor.min.css',
                                    '../components/ngUmeditor/ngUmeditorController.js',
                                    '../components/ngUmeditor/ngUmeditorDirective.js',

                                    // 时间选择组件
                                    '../components/timeSetCpn/timeSetCpnDirective.js',

                                    '../src/js/controllers/care/carePlan/editInfo.js',
                                    '../src/js/controllers/care/carePlan/addOtherRemind.js',
                                    '../src/js/controllers/care/carePlan/addMedication.js',
                                    '../src/js/controllers/care/carePlan/addCheckRemind.js',
                                    '../src/js/controllers/care/carePlan/addLifeQuality.js',
                                    '../src/js/controllers/care/carePlan/addSurvey.js',
                                    '../src/js/controllers/care/carePlan/addCheckDocReply.js',
                                    '../src/js/controllers/care/carePlan/addIllnessTrack.js',
                                    '../src/js/controllers/care/carePlan/carePlan.js'
                                ]).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox));
                                });
                            }
                        ]
                    }
                })
                //健康关怀计划-生活量表题库
                .state('app.lifeQualityLibrary', {
                    url: '/lifeQualityLibrary',
                    templateUrl: '../src/tpl/care/lifeQualityLibrary/lifeQualityLibrary.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load([
                                    'toaster',
                                    '../src/js/controllers/care/lifeQualityLibrary/lifeQualityLibrary.js'
                                ]).then(function() {
                                    return uiLoad.load(JQ_CONFIG.dataTable.concat(JQ_CONFIG.tree));
                                });
                            }
                        ]
                    }
                })
                //健康关怀计划-创建量表
                .state('app.editLifeQuality', {
                    url: '/editLifeQuality/:lifeScaleId/:version',
                    templateUrl: '../src/tpl/care/lifeQualityLibrary/editLifeQuality.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load([
                                    'toaster',
                                    'xeditable',
                                    '../components/chooseDepartment/chooseDepartmentService.js',
                                    '../src/js/controllers/care/lifeQualityLibrary/editLifeQuality.js'
                                ]).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree);
                                });;
                            }
                        ]
                    }
                })
                //健康关怀计划-调查表库
                .state('app.surveyLibrary', {
                    url: '/surveyLibrary',
                    templateUrl: '../src/tpl/care/surveyLibrary/surveyLibrary.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load([
                                    'toaster',
                                    '../src/js/controllers/care/surveyLibrary/surveyLibrary.js'
                                ]).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree);
                                });;
                            }
                        ]
                    }
                })
                //健康关怀计划-编辑调查表
                .state('app.editorSurvey', {
                    url: '/editorSurvey/:surveyId/:version',
                    templateUrl: '../src/tpl/care/surveyLibrary/editorSurvey.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load([
                                    'toaster',
                                    'xeditable',
                                    '../components/chooseDepartment/chooseDepartmentService.js',
                                    '../src/js/controllers/care/surveyLibrary/editorSurvey.js'
                                ]).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree);
                                });;
                            }
                        ]
                    }
                })
                //随访表
                .state('app.follow_up_table', {
                    url: '/follow_up_table/:planId',
                    templateUrl: '../src/tpl/care/follow_up_table.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load(['toaster', '../src/js/controllers/care/follow_up_table.js']).then(function() {
                                    return uiLoad.load(JQ_CONFIG.dataTable.concat(JQ_CONFIG.tree));
                                });
                            }
                        ]
                    }
                })
                //新增随访
                .state('app.new_follow_up', {
                    url: '/new_follow_up/:planId',
                    templateUrl: '../src/tpl/care/new_follow_up.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load(['toaster', '../src/js/controllers/care/new_follow_up.js']).then(
                                    function() {
                                        return $ocLazyLoad.load('angularBootstrapNavTree');
                                    }
                                ).then(function() {
                                    return uiLoad.load(JQ_CONFIG.dataTable.concat(JQ_CONFIG.tree));
                                });
                            }
                        ]
                    }
                })
                //新增随访
                .state('app.followUp', {
                    url: '/followUp/:planId',
                    templateUrl: '../src/tpl/care/followUp/followUp.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load([
                                    'toaster',
                                    'xeditable',

                                    // 七牛上传文件组件
                                    '../components/qiniuUploader/rely/plupload.full.min.js',
                                    '../components/qiniuUploader/qiniuUploaderController.js',
                                    '../components/qiniuUploader/qiniuUploaderDirective.js',
                                    // 百度富文本编辑器
                                    '../components/ngUmeditor/umeditor/third-party/jquery.min.js',
                                    '../components/ngUmeditor/umeditor/umeditor.min.js',
                                    '../components/ngUmeditor/umeditor/umeditor.config.js',
                                    '../components/ngUmeditor/umeditor/themes/default/css/umeditor.min.css',
                                    '../components/ngUmeditor/ngUmeditorController.js',
                                    '../components/ngUmeditor/ngUmeditorDirective.js',

                                    // 时间选择组件
                                    '../components/timeSetCpn/timeSetCpnDirective.js',

                                    '../src/js/controllers/care/carePlan/editInfo.js',
                                    '../src/js/controllers/care/carePlan/addOtherRemind.js',
                                    '../src/js/controllers/care/carePlan/addMedication.js',
                                    '../src/js/controllers/care/carePlan/addCheckRemind.js',
                                    '../src/js/controllers/care/carePlan/addLifeQuality.js',
                                    '../src/js/controllers/care/carePlan/addSurvey.js',
                                    '../src/js/controllers/care/carePlan/addCheckDocReply.js',
                                    '../src/js/controllers/care/carePlan/addIllnessTrack.js',

                                    '../src/js/controllers/care/followUp/addArticle.js',
                                    '../src/js/controllers/care/followUp/followUp.js'
                                ]).then(
                                    function() {
                                        return $ocLazyLoad.load('angularBootstrapNavTree');
                                    }
                                ).then(function() {
                                    return uiLoad.load(JQ_CONFIG.dataTable.concat(JQ_CONFIG.tree, JQ_CONFIG.databox));
                                });
                            }
                        ]
                    }
                })
                // 集团收入结算
                .state('app.reports_of_finance', {
                    url: '/reports_of_finance/{name}',
                    templateUrl: 'src/tpl/finance/reports_of_finance.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load(['src/js/controllers/finance/reports_of_finance.js']).then(function() {
                                    return uiLoad.load(JQ_CONFIG.dataTable);
                                });
                            }
                        ]
                    }
                })
                .state('app.statistic_of_report', {
                    url: '/statistic_of_report',
                    templateUrl: 'src/tpl/finance/statistic_of_report.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load(['src/js/controllers/finance/statistic_of_report.js']).then(function() {
                                    return uiLoad.load(JQ_CONFIG.dataTable);
                                });
                            }
                        ]
                    }
                })
                .state('app.settlement_of_finance', {
                    url: '/settlement_of_finance/{name}/{date}',
                    templateUrl: 'src/tpl/finance/settlement_of_finance.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load(['src/js/controllers/finance/settlement_of_finance.js']).then(function() {
                                    return uiLoad.load(JQ_CONFIG.dataTable);
                                });
                            }
                        ]
                    }
                })
                // 导医管理
                .state('app.guider_account', {
                    url: '/guider_account',
                    templateUrl: 'src/tpl/account/guider_account.html',
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function($ocLazyLoad, uiLoad) {
                                return $ocLazyLoad.load(['src/js/controllers/account/guider_account.js', 'src/js/directives/xg-table.js']).then(function() {
                                    return uiLoad.load(JQ_CONFIG.dataTable);
                                });
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
                }).state('access.signin', {
                    url: '/signin',
                    templateUrl: 'src/tpl/signin.html',
                    resolve: {
                        deps: ['uiLoad',
                            function(uiLoad) {
                                return uiLoad.load(['src/js/controllers/signin.js']);
                            }
                        ]
                    }
                }).state('access.signup', {
                    url: '/signup',
                    templateUrl: 'src/tpl/signup.html',
                    resolve: {
                        deps: ['uiLoad',
                            function(uiLoad) {
                                return uiLoad.load(['src/js/controllers/signup.js']);
                            }
                        ]
                    }
                }).state('access.forgotpwd', {
                    url: '/forgotpwd',
                    templateUrl: 'src/tpl/forgotpwd.html'
                }).state('access.404', {
                    url: '/404',
                    templateUrl: 'src/tpl/404.html'
                })
        }
    ]);
