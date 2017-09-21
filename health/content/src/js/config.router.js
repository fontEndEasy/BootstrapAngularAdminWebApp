'use strict';

angular.module('app').run(
    ['$rootScope', '$state', '$stateParams',
        function($rootScope, $state, $stateParams) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
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
                            return $ocLazyLoad.load(['src/js/controllers/nav/nav.js', 'src/js/directives/ui-medicine.js']);
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
            }).state('access.enterprise_signin', {
                url: '/enterprise_signin',
                templateUrl: 'src/tpl/enterprise/signin.html',
                resolve: {
                    deps: ['uiLoad',
                        function(uiLoad) {
                            return uiLoad.load(['src/js/controllers/enterprise/signin.js']);
                        }
                    ]
                }
            }).state('access.signup', {
                url: '/signup',
                templateUrl: 'src/tpl/enterprise/signup.html',
                resolve: {
                    deps: ['uiLoad',
                        function(uiLoad) {
                            return uiLoad.load(['src/js/controllers/enterprise/signup.js']);
                        }
                    ]
                }
            }).state('app.relationship', {
                url: '/relationship',
                templateUrl: 'src/tpl/group/relationship.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('src/js/controllers/group/relationship.js').then(function() {
                                return uiLoad.load(JQ_CONFIG.tree);
                            });
                        }
                    ]
                }
            }).state('app.relationship.list', {
                url: '/list/{id}',
                templateUrl: 'src/tpl/group/relationship_list.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('src/js/controllers/group/relationship_list.js').then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable);
                            });
                        }
                    ]
                }
            }).state('app.relationship.edit', {
                url: '/edit',
                views: {
                    "modalDialog@app": {
                        templateUrl: 'src/tpl/group/relationship_edit.html'
                    }
                },
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load('src/js/controllers/group/relationship_edit.js');
                        }
                    ]
                }
            }).state('app.relationship.list.delete', {
                url: '/delete',
                views: {
                    "modalDialog@app": {
                        templateUrl: 'src/tpl/group/relationship_delete.html'
                    }
                },
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load('src/js/controllers/group/relationship_delete.js');
                        }
                    ]
                }
            }).state('app.contacts', {
                url: '/contacts',
                //templateUrl: 'http://localhost:8080/template/contacts.html',
                templateUrl: 'src/tpl/group/contacts.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('src/js/controllers/group/contacts.js').then(function() {
                                return uiLoad.load(JQ_CONFIG.tree);
                            });
                        }
                    ]
                }
            }).state('app.contacts.list', {
                url: '/list/{id}',
                templateUrl: 'src/tpl/group/contacts_list.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('src/js/controllers/group/contacts_list.js').then(function() {
                                var dt = uiLoad.load(JQ_CONFIG.dataTable);
                                return dt;
                            });
                        }
                    ]
                }
            }).state('app.contacts.list.details', {
                url: '/details',
                views: {
                    "dialogView@app": {
                        templateUrl: 'src/tpl/group/contacts_list_details.html'
                    }
                },
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load('src/js/controllers/group/contacts_list_details.js');
                        }
                    ]
                }
            }).state('app.contacts.list.add', {
                url: '/add',
                views: {
                    "modalDialog@app": {
                        templateUrl: 'src/tpl/group/contacts_add.html'
                    }
                },
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load('src/js/controllers/group/contacts_add.js');
                        }
                    ]
                }
            }).state('app.contacts.list.edit', {
                url: '/edit',
                views: {
                    "modalDialog@app": {
                        templateUrl: 'src/tpl/group/contacts_edit.html'
                    }
                },
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load('src/js/controllers/group/contacts_edit.js');
                        }
                    ]
                }
            }).state('app.contacts.list.delete', {
                url: '/delete',
                views: {
                    "modalDialog@app": {
                        templateUrl: 'src/tpl/group/contacts_delete.html'
                    }
                },
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load('src/js/controllers/group/contacts_delete.js');
                        }
                    ]
                }
            }).state('app.contacts.list.invite', {
                url: '/invite',
                views: {
                    "modalDialog@app": {
                        templateUrl: 'src/tpl/group/contacts_invite.html'
                    }
                },
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load('src/js/controllers/group/contacts_invite.js');
                        }
                    ]
                }
            }).state('app.contacts.list.quit', {
                url: '/quit',
                views: {
                    "modalDialog@app": {
                        templateUrl: 'src/tpl/group/contacts_list_quit.html'
                    }
                },
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load('src/js/controllers/group/contacts_list_quit.js');
                        }
                    ]
                }
            }).state('app.contacts.list.apportion', {
                url: '/apportion',
                views: {
                    "dialogView@app": {
                        templateUrl: 'src/tpl/group/contacts_list_apportion.html'
                    }
                },
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load('src/js/controllers/group/contacts_list_apportion.js');
                        }
                    ]
                }
            }).state('app.contacts.joinToCompany', {
                url: '/joinToCompany',
                views: {
                    "modalDialog@app": {
                        templateUrl: 'src/tpl/group/joinToCompany.html'
                    }
                },
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load('src/js/controllers/group/joinToCompany.js');
                        }
                    ]
                }
            }).state('app.groupSettings', {
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
            }).state('app.groupLogo', {
                url: '/groupLogo/:groupId',
                templateUrl: 'src/tpl/group/groupLogo.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['ngFileUpload', 'toaster']).then(function() {
                                return uiLoad.load(['src/js/controllers/group/groupLogo.js']);
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
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster', 'src/js/controllers/group/administrator.js']).then(function() {
                                return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox));
                            });
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
            })
            .state('app.enterprise_identify', {
                url: '/enterprise_identify',
                templateUrl: 'src/tpl/enterprise/enterprise_identify.html',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load(['ngFileUpload', 'toaster']).then(function() {
                                return $ocLazyLoad.load(['src/js/controllers/enterprise/enterprise_identify.js']);
                            });
                        }
                    ]
                }
            })
            .state('app.group_create', {
                url: '/group_create',
                templateUrl: 'src/tpl/group/group_create.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['ngFileUpload', 'toaster']).then(function() {
                                return $ocLazyLoad.load(['src/js/controllers/group/group_create.js',
                                    // 七牛上传文件组建
                                    'components/qiniuUploader/rely/plupload.full.min.js',
                                    'components/qiniuUploader/qiniuUploaderController.js',
                                    'components/qiniuUploader/qiniuUploaderDirective.js'
                                ]).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox));
                                });
                            });
                        }
                    ]
                }
            })
            .state('app.group_edit', {
                url: '/group_edit',
                templateUrl: 'src/tpl/group/group_edit.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['ngFileUpload', 'toaster']).then(function() {
                                return $ocLazyLoad.load(['src/js/controllers/group/group_edit.js',
                                    // 七牛上传文件组建
                                    'components/qiniuUploader/rely/plupload.full.min.js',
                                    'components/qiniuUploader/qiniuUploaderController.js',
                                    'components/qiniuUploader/qiniuUploaderDirective.js'
                                ]).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox));
                                });
                            });
                        }
                    ]
                }
            }).state('app.group_create.invite', {
                url: '/invite',
                views: {
                    "modalDialog@app": {
                        templateUrl: 'src/tpl/group/contacts_invite.html'
                    }
                },
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load('src/js/controllers/group/contacts_invite.js');
                        }
                    ]
                }
            })
            .state('app.en_admin', {
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
            }).state('access.signup_success', {
                url: '/signup_success',
                templateUrl: 'src/tpl/enterprise/signup_success.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function(uiLoad) {
                            return uiLoad.load(['src/js/controllers/enterprise/signup_success.js']);
                        }
                    ]
                }
            }).state('access.enterprise_verify', {
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
            // 医生考核
            .state('app.evaluation_by_patient', {
                url: '/evaluation_by_patient',
                templateUrl: 'src/tpl/evaluation/evaluation_by_patient.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('src/js/controllers/evaluation/evaluation_by_patient.js').then(function() {
                                return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.dataTable));
                            });
                        }
                    ]
                }
            })
            .state('app.evaluation_by_doctor', {
                url: '/evaluation_by_doctor',
                templateUrl: 'src/tpl/evaluation/evaluation_by_doctor.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('src/js/controllers/evaluation/evaluation_by_doctor.js').then(function() {
                                return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.dataTable));
                            });
                        }
                    ]
                }
            })
            .state('app.evaluation_by_finance', {
                url: '/evaluation_by_finance',
                templateUrl: 'src/tpl/evaluation/evaluation_by_finance.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('src/js/controllers/evaluation/evaluation_by_finance.js').then(function() {
                                return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.dataTable));
                            });
                        }
                    ]
                }
            })
            .state('app.doctor_list', {
                url: '/doctor_list',
                templateUrl: 'src/tpl/evaluation/doctor_list.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('src/js/controllers/evaluation/doctor_list.js').then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable);
                            });
                        }
                    ]
                }
            })
            .state('app.doctor_list.details', {
                url: '/details',
                views: {
                    "dialogView@app": {
                        templateUrl: 'src/tpl/evaluation/doctor_details.html'
                    }
                },
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load('src/js/controllers/evaluation/doctor_details.js');
                        }
                    ]
                }
            })
            // 医生统计
            .state('app.statistics_of_disease', {
                url: '/statistics_of_disease',
                templateUrl: 'src/tpl/statistics/statistics_of_disease.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['src/js/controllers/statistics/statistics_of_disease.js']).then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable.concat(JQ_CONFIG.echarts));
                            });
                        }
                    ]
                }
            })
            // 集团收入
            .state('app.reports_of_finance', {
                url: '/reports_of_finance/{name}/{date}',
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
            .state('app.bank_account', {
                url: '/bank_account',
                templateUrl: 'src/tpl/finance/bank_account.html',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load(['src/js/controllers/finance/bank_account.js']);
                        }
                    ]
                }
            })
            // 患者库
            .state('app.patient', {
                url: '/patient/{type}',
                templateUrl: 'src/tpl/patient/patient.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('src/js/controllers/patient/patient.js').then(function() {
                                return uiLoad.load(JQ_CONFIG.tree);
                            });
                        }
                    ]
                }
            })
            .state('app.patient.patient_list', {
                url: '/patient_list/{id}',
                templateUrl: 'src/tpl/patient/patient_list.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('src/js/controllers/patient/patient_list.js').then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable);
                            });
                        }
                    ]
                }
            })
            .state('app.patient.patient_list.details', {
                url: '/details',
                views: {
                    "dialogView@app": {
                        templateUrl: 'src/tpl/patient/patient_details.html'
                    }
                },
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load('src/js/controllers/patient/patient_details.js');
                        }
                    ]
                }
            }).state('app.statistics_of_title', {
                url: '/statistics_of_title',
                templateUrl: 'src/tpl/statistics/statistics_of_title.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['src/js/controllers/statistics/statistics_of_title.js', 'toaster']).then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable.concat(JQ_CONFIG.echarts));
                            });
                        }
                    ]
                }
            })
            .state('app.statistics_of_area', {
                url: '/statistics_of_area',
                templateUrl: 'src/tpl/statistics/statistics_of_area.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['src/js/controllers/statistics/statistics_of_area.js', 'toaster']).then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable.concat(JQ_CONFIG.echarts));
                            });
                        }
                    ]
                }
            })
            //值班安排设置
            .state('app.schedule_setting', {
                url: '/schedule_setting',
                templateUrl: 'src/tpl/setting/schedule_setting.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['src/js/controllers/setting/schedule_setting.js', 'toaster']).then(function() {
                                return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox));
                            });
                        }
                    ]
                }
            })
            .state('app.schedule_setting.add', {
                url: '/add',
                views: {
                    "modalDialog@app": {
                        templateUrl: 'src/tpl/setting/add.html'
                    }
                },
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster', 'src/js/controllers/setting/add.js']).then(function() {
                                return uiLoad.load(JQ_CONFIG.tree);
                            });
                        }
                    ]
                }
            })
            //专家名单设置
            .state('app.expert_setting', {
                url: '/expert_setting',
                templateUrl: 'src/tpl/setting/expert_setting.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster', 'src/js/controllers/setting/expert_setting.js']).then(function() {
                                return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox));
                            });
                        }
                    ]
                }
            })
            .state('app.expert_setting.add', {
                url: '/add',
                views: {
                    "modalDialog@app": {
                        templateUrl: 'src/tpl/setting/add.html'
                    }
                },
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster', 'src/js/controllers/setting/add.js']).then(function() {
                                return uiLoad.load(JQ_CONFIG.tree);
                            });
                        }
                    ]
                }
            })
            //病种标签设置
            .state('app.disease_setting', {
                url: '/disease_setting',
                templateUrl: 'src/tpl/setting/disease_setting.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster', 'src/js/controllers/setting/disease_setting.js']).then(function() {
                                return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox));
                            });
                        }
                    ]
                }
            })
            //消息管理
            .state('app.message', {
                url: '/message',
                templateUrl: 'src/tpl/message/message.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['src/js/controllers/message/message.js', 'toaster']).then(function() {
                                return uiLoad.load(JQ_CONFIG.umeditor);
                            });
                        }
                    ]
                }
            })
            //文章列表
            .state('app.article_list', {
                url: '/article_list',
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
                                return $ocLazyLoad.load(['src/js/controllers/document/edit_article.js',
                                    'components/qiniuUploader/rely/plupload.full.min.js',
                                    'components/qiniuUploader/qiniuUploaderController.js',
                                    'components/qiniuUploader/qiniuUploaderDirective.js'
                                ]).then(function() {
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
                                    'components/qiniuUploader/rely/plupload.full.min.js',
                                    'components/qiniuUploader/qiniuUploaderController.js',
                                    'components/qiniuUploader/qiniuUploaderDirective.js'
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
                url: '/article/{id}?createType',
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
                                    'components/qiniuUploader/rely/plupload.full.min.js',
                                    'components/qiniuUploader/qiniuUploaderController.js',
                                    'components/qiniuUploader/qiniuUploaderDirective.js'
                                ]).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                                });
                            });
                        }
                    ]
                }
            })
            //集团财务
            .state('app.charge_setting', {
                url: '/charge_setting',
                templateUrl: 'src/tpl/group/charge_setting.html',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load(['ui.bootstrap', 'toaster', 'src/js/controllers/group/charge_setting.js']);
                        }
                    ]
                }
            })
            //健康关怀计划-计划列表
            .state('app.care_plan_list', {
                url: '/care_plan_list',
                templateUrl: 'src/tpl/care/care_plan_list.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster', 'src/js/controllers/care/care_plan_list.js']).then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable.concat(JQ_CONFIG.tree));
                            });
                        }
                    ]
                }
            })
            //健康关怀计划-新建计划
            .state('app.new_plan', {
                url: '/new_plan/:isEdit',
                templateUrl: 'src/tpl/care/new_plan.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster', 'src/js/controllers/care/new_plan.js']).then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable.concat(JQ_CONFIG.tree));
                            });
                        }
                    ]
                }
            })
            //健康关怀计划-编辑计划
            .state('app.edit_plan', {
                url: '/edit_plan/:planId/:isEdit',
                templateUrl: 'src/tpl/care/edit_plan.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster', 'src/js/controllers/care/edit_plan.js']).then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable.concat(JQ_CONFIG.tree));
                            });
                        }
                    ]
                }
            })
            //健康关怀计划-编辑介绍
            .state('app.care_introduce', {
                url: '/care_introduce/:planId/:isEdit',
                templateUrl: 'src/tpl/care/care_introduce.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['ui.select', 'toaster', 'ngFileUpload']).then(function() {
                                return $ocLazyLoad.load('src/js/controllers/care/care_introduce.js').then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                                });
                            });
                        }
                    ]
                }
            })
            //健康关怀计划-预览计划
            //.state('app.plan_preview', {
            //    url: '/plan_preview/:planId',
            //    templateUrl: 'src/tpl/care/plan_preview.html',
            //    resolve: {
            //        deps: ['$ocLazyLoad',
            //            function($ocLazyLoad) {
            //                return $ocLazyLoad.load(['toaster', 'src/js/controllers/care/plan_preview.js']);
            //            }
            //        ]
            //    }
            //})
            //健康关怀计划-病情跟踪题库
            .state('app.questions_of_disease', {
                url: '/questions_of_disease',
                templateUrl: 'src/tpl/care/questions_of_disease.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster', 'src/js/controllers/care/questions_of_disease.js']).then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable.concat(JQ_CONFIG.tree));
                            });
                        }
                    ]
                }
            })
            //健康关怀计划-日程题库
            .state('app.reserve_of_schedule', {
                url: '/reserve_of_schedule',
                templateUrl: 'src/tpl/care/reserve_of_schedule.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster', 'src/js/controllers/care/reserve_of_schedule.js']).then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable.concat(JQ_CONFIG.tree));
                            });
                        }
                    ]
                }
            })
            //健康关怀计划-关怀计划
            .state('app.carePlan', {
                url: '/carePlan/:planId',
                templateUrl: 'src/tpl/care/carePlan/carePlan.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load([
                                'toaster',
                                'xeditable',

                                // 七牛上传文件组件
                                'components/qiniuUploader/rely/plupload.full.min.js',
                                'components/qiniuUploader/qiniuUploaderController.js',
                                'components/qiniuUploader/qiniuUploaderDirective.js',
                                // 百度富文本编辑器

                                'components/ngUmeditor/ngUmeditorController.js',
                                'components/ngUmeditor/ngUmeditorDirective.js',

                                // 时间选择组件
                                'components/timeSetCpn/timeSetCpnDirective.js',

                                'src/js/controllers/care/carePlan/editInfo.js',
                                'src/js/controllers/care/carePlan/addOtherRemind.js',
                                'src/js/controllers/care/carePlan/addMedication.js',
                                'src/js/controllers/care/carePlan/addCheckRemind.js',
                                'src/js/controllers/care/carePlan/addLifeQuality.js',
                                'src/js/controllers/care/carePlan/addSurvey.js',
                                'src/js/controllers/care/carePlan/addCheckDocReply.js',
                                'src/js/controllers/care/carePlan/addIllnessTrack.js',
                                'src/js/controllers/care/carePlan/carePlan.js'
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
                templateUrl: 'src/tpl/care/lifeQualityLibrary/lifeQualityLibrary.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load([
                                'toaster',
                                'src/js/controllers/care/lifeQualityLibrary/lifeQualityLibrary.js'
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
                templateUrl: 'src/tpl/care/lifeQualityLibrary/editLifeQuality.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load([
                                'toaster',
                                'xeditable',
                                'components/chooseDepartment/chooseDepartmentService.js',
                                'src/js/controllers/care/lifeQualityLibrary/editLifeQuality.js'
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
                templateUrl: 'src/tpl/care/surveyLibrary/surveyLibrary.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load([
                                'toaster',
                                'src/js/controllers/care/surveyLibrary/surveyLibrary.js'
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
                templateUrl: 'src/tpl/care/surveyLibrary/editorSurvey.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load([
                                'toaster',
                                'xeditable',
                                'components/chooseDepartment/chooseDepartmentService.js',
                                'src/js/controllers/care/surveyLibrary/editorSurvey.js'
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
                templateUrl: 'src/tpl/care/follow_up_table.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster', 'src/js/controllers/care/follow_up_table.js']).then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable.concat(JQ_CONFIG.tree));
                            });
                        }
                    ]
                }
            })
            //新增随访
            .state('app.new_follow_up', {
                url: '/new_follow_up/:planId',
                templateUrl: 'src/tpl/care/new_follow_up.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster', 'src/js/controllers/care/new_follow_up.js']).then(
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
                templateUrl: 'src/tpl/care/followUp/followUp.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load([
                                'toaster',
                                'xeditable',

                                // 七牛上传文件组件
                                'components/qiniuUploader/rely/plupload.full.min.js',
                                'components/qiniuUploader/qiniuUploaderController.js',
                                'components/qiniuUploader/qiniuUploaderDirective.js',
                                // 百度富文本编辑器
                                'components/ngUmeditor/umeditor/third-party/jquery.min.js',
                                'components/ngUmeditor/umeditor/umeditor.min.js',
                                'components/ngUmeditor/umeditor/umeditor.config.js',
                                'components/ngUmeditor/umeditor/themes/default/css/umeditor.min.css',
                                'components/ngUmeditor/ngUmeditorController.js',
                                'components/ngUmeditor/ngUmeditorDirective.js',

                                // 时间选择组件
                                'components/timeSetCpn/timeSetCpnDirective.js',

                                'src/js/controllers/care/carePlan/editInfo.js',
                                'src/js/controllers/care/carePlan/addOtherRemind.js',
                                'src/js/controllers/care/carePlan/addMedication.js',
                                'src/js/controllers/care/carePlan/addCheckRemind.js',
                                'src/js/controllers/care/carePlan/addLifeQuality.js',
                                'src/js/controllers/care/carePlan/addSurvey.js',
                                'src/js/controllers/care/carePlan/addCheckDocReply.js',
                                'src/js/controllers/care/carePlan/addIllnessTrack.js',

                                'src/js/controllers/care/followUp/addArticle.js',
                                'src/js/controllers/care/followUp/followUp.js'
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
            //医生的患教中心 start
            .state('doc', {
                //abstract: true,
                url: '/doc',
                templateUrl: 'src/tpl/doc.html'
            })
            //玄关患教中心
            .state('app.doc', {
                url: '/doc'
            })
            .state('app.doc.platform_doc', {
                url: '/platform_doc',
                views: {
                    "@app": {
                        templateUrl: 'src/tpl/doc/platform_doc.html'
                    }
                },
                //templateUrl: 'src/tpl/doc/platform_doc.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('toaster').then(
                                function() {
                                    return $ocLazyLoad.load('angularBootstrapNavTree');
                                }
                            ).then(
                                function() {
                                    return $ocLazyLoad.load('src/js/controllers/doc/platform_doc.js');
                                }
                            ).then(function() {
                                return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.dataTable));
                            });
                        }
                    ]
                }
            })
            //集团患教中心
            .state('app.doc.group_doc', {
                url: '/group_doc',
                views: {
                    "@app": {
                        templateUrl: 'src/tpl/doc/group_doc.html'
                    }
                },
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('toaster').then(
                                function() {
                                    return $ocLazyLoad.load('angularBootstrapNavTree');
                                }
                            ).then(
                                function() {
                                    return $ocLazyLoad.load('src/js/controllers/doc/group_doc.js');
                                }
                            ).then(function() {
                                return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.dataTable));
                            });
                        }
                    ]
                }
            })
            //医生收藏
            .state('app.doc.doctor_doc', {
                url: '/doctor_doc',
                views: {
                    "@app": {
                        templateUrl: 'src/tpl/doc/doctor_doc.html'
                    }
                },
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('toaster').then(
                                function() {
                                    return $ocLazyLoad.load('angularBootstrapNavTree');
                                }
                            ).then(
                                function() {
                                    return $ocLazyLoad.load('src/js/controllers/doc/doctor_doc.js');
                                }
                            ).then(function() {
                                return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.dataTable, JQ_CONFIG.clipboard));
                            });
                        }
                    ]
                }
            })
            //新建文章
            .state('app.doc.create_article', {
                url: '/create_article',
                views: {
                    "@app": {
                        templateUrl: 'src/tpl/doc/edit_article.html'
                    }
                },
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(function() {
                                return $ocLazyLoad.load(['src/js/controllers/doc/edit_article.js',
                                    'components/qiniuUploader/rely/plupload.full.min.js',
                                    'components/qiniuUploader/qiniuUploaderController.js',
                                    'components/qiniuUploader/qiniuUploaderDirective.js'
                                ]).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                                });
                            });
                        }
                    ]
                }
            })
            //编辑文章
            .state('app.doc.edit_article', {
                url: '/edit_article/{id}',
                views: {
                    "@app": {
                        templateUrl: 'src/tpl/doc/edit_article.html'
                    }
                },
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(function() {
                                return $ocLazyLoad.load(['src/js/controllers/doc/edit_article.js',
                                    'components/qiniuUploader/rely/plupload.full.min.js',
                                    'components/qiniuUploader/qiniuUploaderController.js',
                                    'components/qiniuUploader/qiniuUploaderDirective.js'
                                ]).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                                });
                            });
                        }
                    ]
                }
            })
            //浏览文章
            .state('doc.article', {
                url: '/article/{id}?createType',
                templateUrl: 'src/tpl/doc/article.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(function() {
                                return $ocLazyLoad.load('src/js/controllers/doc/article.js').then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                                });
                            });
                        }
                    ]
                }
            })
            //浏览页面的编辑文章
            .state('doc.edit_article', {
                url: '/edit_article/{id}?createType',
                //views: {
                //    "@app": {
                //        templateUrl: 'src/tpl/doc/edit_article.html'
                //    }
                //},
                templateUrl: 'src/tpl/doc/edit_article.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(function() {
                                return $ocLazyLoad.load(['src/js/controllers/doc/edit_article.js',
                                    'components/qiniuUploader/rely/plupload.full.min.js',
                                    'components/qiniuUploader/qiniuUploaderController.js',
                                    'components/qiniuUploader/qiniuUploaderDirective.js'
                                ]).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                                });
                            });
                        }
                    ]
                }
            })
            //医生的患教中心 end
            //集团公众账号start
            .state('app.public_msg_list', {
                url: '/public_msg_list',
                templateUrl: 'src/tpl/public_msg/group/public_msg_list.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('src/js/controllers/public_msg/group/public_msg_list.js');
                        }
                    ]
                }
            })
            .state('app.msg_manage', {
                url: '/msg_manage/{id}',
                templateUrl: 'src/tpl/public_msg/group/msg_manage.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('src/js/controllers/public_msg/group/msg_manage.js');
                        }
                    ]
                }
            })
            .state('app.msg_manage.send_msg', {
                url: '/send_msg',
                templateUrl: 'src/tpl/public_msg/group/send_msg.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(function() {
                                return $ocLazyLoad.load(['src/js/controllers/public_msg/group/send_msg.js',
                                    'components/qiniuUploader/rely/plupload.full.min.js',
                                    'components/qiniuUploader/qiniuUploaderController.js',
                                    'components/qiniuUploader/qiniuUploaderDirective.js'
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
                templateUrl: 'src/tpl/public_msg/group/msg_history.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('toaster').then(
                                function() {
                                    return $ocLazyLoad.load('src/js/controllers/public_msg/group/msg_history.js');
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
                templateUrl: 'src/tpl/public_msg/group/setting.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(
                                function() {
                                    return $ocLazyLoad.load('src/js/controllers/public_msg/group/setting.js');
                                }
                            );
                        }
                    ]
                }
            })
            //集团公众账号end
            //医生公众账号start
            .state('app.doc.msg_manage', {
                url: '/msg_manage/{id}',
                views: {
                    "@app": {
                        templateUrl: 'src/tpl/public_msg/doctor/msg_manage.html'
                    }
                },
                //templateUrl: 'src/tpl/public_msg/doctor/msg_manage.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('src/js/controllers/public_msg/doctor/msg_manage.js');
                        }
                    ]
                }
            })
            .state('app.doc.msg_manage.send_msg', {
                url: '/send_msg',
                views: {
                    "@app.doc.msg_manage": {
                        templateUrl: 'src/tpl/public_msg/doctor/send_msg.html'
                    }
                },
                //templateUrl: 'src/tpl/public_msg/doctor/send_msg.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(function() {
                                return $ocLazyLoad.load(['src/js/controllers/public_msg/doctor/send_msg.js',
                                    'components/qiniuUploader/rely/plupload.full.min.js',
                                    'components/qiniuUploader/qiniuUploaderController.js',
                                    'components/qiniuUploader/qiniuUploaderDirective.js'
                                ]).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                                });
                            });
                        }
                    ]
                }
            })
            .state('app.doc.msg_manage.msg_history', {
                url: '/msg_history',
                views: {
                    "@app.doc.msg_manage": {
                        templateUrl: 'src/tpl/public_msg/doctor/msg_history.html'
                    }
                },
                //templateUrl: 'src/tpl/public_msg/doctor/msg_history.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('toaster').then(
                                function() {
                                    return $ocLazyLoad.load('src/js/controllers/public_msg/doctor/msg_history.js');
                                }
                            ).then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable);
                            });
                        }
                    ]
                }
            })
            //医生公众账号end
            .state('app.invitation', {
                url: '/invitation',
                templateUrl: 'src/tpl/invitation/invite_patient.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('toaster').then(
                                function() {
                                    return $ocLazyLoad.load('src/js/controllers/invitation/invite_patient.js');
                                }
                            ).then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable);
                            });
                        }
                    ]
                }
            })
            .state('app.invite_list', {
                url: '/invite_list',
                templateUrl: 'src/tpl/invitation/invite_list.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('toaster').then(
                                function() {
                                    return $ocLazyLoad.load('src/js/controllers/invitation/invite_list.js');
                                }
                            ).then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable);
                            });
                        }
                    ]
                }
            })
            //集团药品库start
            .state('app.group_drug_library', {
                url: '/group_drug_library',
                templateUrl: 'src/tpl/group_drug_library/group_drug_library.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('toaster').then(
                                function() {
                                    return $ocLazyLoad.load('src/js/controllers/group_drug_library/group_drug_library.js');
                                }
                            ).then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable);
                            });
                        }
                    ]
                }
            })
            // 文件管理
            .state('app.file_management', {
                url: '/file_management',
                templateUrl: 'src/tpl/file_management/file_management.html',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'toaster',
                                'xeditable',
                                'bower_components/jszip/dist/jszip.min.js',
                                'bower_components/jszip/vendor/FileSaver.js',
                                // 七牛上传文件组建
                                'components/qiniuUploader/rely/plupload.full.min.js',
                                'components/qiniuUploader/rely/qiniu.js',
                                'components/qiniuUploader/qiniuUploaderController.js',
                                'components/qiniuUploader/qiniuUploaderDirective.js',
                                'src/js/controllers/file_management/file_management.js'
                            ]);
                        }
                    ]
                }
            })
            //会诊
            .state('app.consultation', {
                url: '/consultation',
                template: '<ui-view></ui-view>'
            })
            .state('app.consultation.introduce', {
                url: '/introduce',
                templateUrl: 'src/tpl/consultation/introduce.html',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load(['toaster','src/js/controllers/consultation/introduce.js']);
                        }
                    ]
                }
            })
            .state('app.consultation.list', {
                url: '/list',
                templateUrl: 'src/tpl/consultation/consult_list.html',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load(['toaster', 'src/js/controllers/consultation/consult_list.js', 'src/js/directives/xg-table.js']);
                        }
                    ]
                }
            })
            .state('app.consultation.detail', {
                url: '/id/{id}',
                templateUrl: 'src/tpl/consultation/consult_detail.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster', 'src/js/controllers/consultation/consult_detail.js']).then(function() {
                                return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox));
                            });
                        }
                    ]
                }
            })
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
            })
            .state('access.resetPassword', {
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
