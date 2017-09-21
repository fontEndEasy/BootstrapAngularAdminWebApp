(function() {
    // injector
    angular.module('app')
        .config(config);

    // run.$inject＝['$rootScope', '$state', '$stateParams'];

    function config($stateProvider, $urlRouterProvider, $httpProvider, $provide) {
        // =================================路由配置===========================================
        $urlRouterProvider
            .when('', '/signin')
            .when('/', '/signin')
            .when('/order', '/order/')

        $stateProvider
            .state('test', {
                // abstract: true,
                title: '测试',
                url: '/test',
                views: {
                    '': {
                        templateUrl: 'app/components/test/home.html',
                        controller: 'TestController',
                    },
                },
                resolve: {
                    lazy: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'app/components/test/homeController.js',
                            ]);
                        }
                    ]
                }

            })
            // 订单
            .state('order', {
                title: '订单',
                url: '/order',
                views: {
                    '': {
                        template: '<div ui-view="appNav"></div><ui-view> </ui-view>'
                    },
                    'appNav@order': {
                        templateUrl: 'app/shared/app_nav/navView.html',
                        controller: 'AppNavCtrl',
                    }
                },
                resolve: {
                    lazy: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                files: [
                                    // nav
                                    'app/shared/app_nav/navService.js',
                                    'app/shared/app_nav/navController.js',
                                    //修改密码
                                    'app/shared/changePwdModal/changePwdModalController.js',
                                    'app/shared/changePwdModal/changePwdModalService.js'
                                ],
                                
                            });
                        }
                    ]
                }

            })
            .state('order.home', {
                title: '订单',
                url: '/',
                views: {
                    '': {
                        templateUrl: 'app/components/order/orderView.html',
                        controller: 'orderCtrl',
                    }
                },
                resolve: {
                    lazy: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                files: [
                                    // face-icon-filter
                                    'app/shared/chat_window/faceIcon/filter/faceIconFilterDirective.js',
                                    'app/shared/chat_window/faceIcon/faceIconDirective.js',
                                    // quickReply
                                    'app/shared/chat_window/quickReply/quickReplyDirective.js',
                                    'app/shared/chat_window/quickReply/quickReplyService.js',
                                    'app/shared/chat_window/quickReply/quickReplyController.js',
                                    // 七牛上传文件组建
                                    '../components/qiniuUploader/rely/plupload.full.min.js',
                                    '../components/qiniuUploader/qiniuUploaderController.js',
                                    '../components/qiniuUploader/qiniuUploaderDirective.js',
                                    // uploadFile
                                    'app/shared/chat_window/uploadFile/uploadFileDirective.js',
                                    'app/shared/chat_window/uploadFile/uploadFileController.js',
                                    // editor
                                    'app/shared/chat_window/editor/editorDirective.js',
                                    'app/shared/chat_window/editor/editorController.js',
                                    // searchDoctorDialog
                                    'app/shared/searchDoctorDialog/searchDoctorDialogDirective.js',
                                    'app/shared/searchDoctorDialog/searchDoctorDialogService.js',
                                    'app/shared/searchDoctorDialog/searchDoctorDialogController.js',
                                    // doctorInfoDailog
                                    'app/shared/doctorInfoDailog/doctorInfoDailogDirective.js',
                                    'app/shared/doctorInfoDailog/doctorInfoDailogService.js',
                                    'app/shared/doctorInfoDailog/doctorInfoDailogController.js',
                                    // patientInfoDailog
                                    'app/shared/patientInfoDailog/patientInfoDailogDirective.js',
                                    'app/shared/patientInfoDailog/patientInfoDailogService.js',
                                    'app/shared/patientInfoDailog/patientInfoDailogController.js',
                                    // time_calculator
                                    'app/shared/time_calculator/calculatorDirective.js',
                                    // order
                                    'app/components/order/orderService.js',
                                    'app/components/order/orderController.js',
                                    //chatImgSelModal
                                    'app/shared/chatImgSelModal/chatImgSelModalService.js',
                                    'app/shared/chatImgSelModal/chatImgSelModalController.js',
                                ]
                            });
                        }
                    ]
                }

            })
            .state('order.history', {
                title: '订单历史记录',
                url: '/history',
                views: {
                    '': {
                        templateUrl: 'app/components/orderHistory/historyView.html',
                        controller: 'orderHistoryCtrl',
                    }
                },
                resolve: {
                    lazy: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                files: [
                                    // face-icon-filter
                                    'app/shared/chat_window/faceIcon/filter/faceIconFilterDirective.js',
                                    'app/shared/chat_window/faceIcon/faceIconDirective.js',
                                    // quickReply
                                    'app/shared/chat_window/quickReply/quickReplyDirective.js',
                                    'app/shared/chat_window/quickReply/quickReplyService.js',
                                    'app/shared/chat_window/quickReply/quickReplyController.js',
                                    // uploadFile
                                    'app/shared/chat_window/uploadFile/uploadFileDirective.js',
                                    'app/shared/chat_window/uploadFile/uploadFileController.js',
                                    // editor
                                    'app/shared/chat_window/editor/editorDirective.js',
                                    'app/shared/chat_window/editor/editorController.js',
                                    // doctorInfoDailog
                                    'app/shared/doctorInfoDailog/doctorInfoDailogDirective.js',
                                    'app/shared/doctorInfoDailog/doctorInfoDailogService.js',
                                    'app/shared/doctorInfoDailog/doctorInfoDailogController.js',

                                    'app/components/orderHistory/historyService.js',
                                    'app/components/orderHistory/historyController.js'
                                ],
                                
                            });
                        }
                    ]
                }

            })
            .state('order.schedule', {
                title: '日程',
                url: '/schedule',
                views: {
                    '': {
                        templateUrl: 'app/components/orderSchedule/scheduleView.html',
                        controller: 'scheduleCtrl',
                    }
                },
                resolve: {
                    lazy: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                files: [
                                    // timeEditor
                                    'app/shared/time_editor/timeEditorDirective.js',
                                    'app/shared/time_editor/timeEditorController.js',
                                    // doctorInfoDailog
                                    'app/shared/doctorInfoDailog/doctorInfoDailogDirective.js',
                                    'app/shared/doctorInfoDailog/doctorInfoDailogService.js',
                                    'app/shared/doctorInfoDailog/doctorInfoDailogController.js',
                                    // patientInfoDailog
                                    'app/shared/patientInfoDailog/patientInfoDailogDirective.js',
                                    'app/shared/patientInfoDailog/patientInfoDailogService.js',
                                    'app/shared/patientInfoDailog/patientInfoDailogController.js',
                                    // orderSchedule
                                    'app/components/orderSchedule/scheduleService.js',
                                    'app/components/orderSchedule/scheduleController.js'
                                ],
                                
                            });
                        }
                    ]
                }

            })
            .state('order.schedule.threeWayCalling', {
                title: '三方通话',
                url: '/threeWayCalling',
                params: {
                    order: null
                },
                views: {
                    '': {
                        templateUrl: 'app/components/threeWayCalling/threeWayCallingView.html',
                        controller: 'threeWayCallingCtrl',
                    }
                },
                resolve: {
                    lazy: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                files: [
                                    // threeWayCalling
                                    'app/components/threeWayCalling/threeWayCallingService.js',
                                    'app/components/threeWayCalling/threeWayCallingController.js'
                                ],
                                
                            });
                        }
                    ]
                }

            })
            .state('order.myOrder', {
                title: '咨询记录',
                url: '/myOrder',
                views: {
                    '': {
                        templateUrl: 'app/components/myOrder/myOrderView.html',
                        controller: 'myOrderCtrl',
                    }
                },
                resolve: {
                    lazy: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                files: [
                                    // 七牛上传文件组建
                                    '../components/qiniuUploader/rely/plupload.full.min.js',
                                    '../components/qiniuUploader/qiniuUploaderController.js',
                                    '../components/qiniuUploader/qiniuUploaderDirective.js',

                                    // hierarchicalSelect
                                    'app/shared/hierarchicalSelect/hierarchicalSelectDirective.js',
                                    'app/shared/hierarchicalSelect/hierarchicalSelectController.js',
                                    // editorConsultingRecord
                                    'app/components/editorConsultingRecord/editorConsultingRecordView.html',
                                    'app/components/editorConsultingRecord/editorConsultingRecordService.js',
                                    'app/components/editorConsultingRecord/editorConsultingRecordController.js',

                                    // myOrder
                                    'app/components/myOrder/myOrderService.js',
                                    'app/components/myOrder/myOrderController.js',
                                    // doctorInfoDailog
                                    'app/shared/doctorInfoDailog/doctorInfoDailogDirective.js',
                                    'app/shared/doctorInfoDailog/doctorInfoDailogService.js',
                                    'app/shared/doctorInfoDailog/doctorInfoDailogController.js',
                                ],
                                
                            });
                        }
                    ]
                }

            })
            .state('order.myOrder.consultingRecord', {
                title: '咨询记录',
                url: '/consultingRecord',
                params: {
                    orderId: null
                },
                views: {
                    '': {
                        templateUrl: 'app/components/consultingRecord/consultingRecordView.html',
                        controller: 'consultingRecordCtrl',
                    }
                },
                resolve: {
                    lazy: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                files: [
                                    // consultingRecord
                                    'app/components/consultingRecord/consultingRecordService.js',
                                    'app/components/consultingRecord/consultingRecordController.js'
                                ],
                                
                            });
                        }
                    ]
                }

            })
            .state('order.myOrder.editorConsultingRecord', {
                title: '填写咨询记录',
                url: '/editorConsultingRecord',
                params: {
                    orderId: null,
                    doctorId: null
                },
                views: {
                    '': {
                        templateUrl: 'app/components/editorConsultingRecord/editorConsultingRecordView.html',
                        controller: 'editorConsultingRecordCtrl',
                    }
                },
                resolve: {
                    lazy: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                files: [

                                    // editorConsultingRecord
                                    'app/components/editorConsultingRecord/editorConsultingRecordService.js',
                                    'app/components/editorConsultingRecord/editorConsultingRecordController.js',
                                    // hierarchicalSelect
                                    'app/shared/hierarchicalSelect/hierarchicalSelectDirective.js',
                                    'app/shared/hierarchicalSelect/hierarchicalSelectController.js',
                                    // doctorInfoDailog
                                    'app/shared/doctorInfoDailog/doctorInfoDailogDirective.js',
                                    'app/shared/doctorInfoDailog/doctorInfoDailogService.js',
                                    'app/shared/doctorInfoDailog/doctorInfoDailogController.js',
                                    //medicineSel
                                    'app/shared/medicineSel/ui-medicine.js',
                                ],
                                
                            });
                        }
                    ]
                }

            })
            .state('order.care', {
                title: '咨询记录',
                url: '/care',
                views: {
                    '': {
                        templateUrl: 'app/components/care/careView.html',
                        controller: 'careCtrl',
                    }
                },
                resolve: {
                    lazy: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                files: [
                                    // care
                                    'app/components/care/careService.js',
                                    'app/components/care/careController.js',
                                    // doctorInfoDailog
                                    'app/shared/doctorInfoDailog/doctorInfoDailogDirective.js',
                                    'app/shared/doctorInfoDailog/doctorInfoDailogService.js',
                                    'app/shared/doctorInfoDailog/doctorInfoDailogController.js',
                                ],

                            });
                        }
                    ]
                }

            })
            // 登录
            .state('signin', {
                title: '登录',
                url: '/signin',
                views: {
                    '': {
                        templateUrl: 'app/components/signin/signinView.html',
                        controller: 'SigninCtrl',
                    },
                },
                resolve: {
                    lazy: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                files: [
                                    // signin
                                    'app/components/signin/signinService.js',
                                    'app/components/signin/signinController.js'
                                ],
                                
                            });
                        }
                    ]
                }

            })
            // 忘记密码
            .state('resetPassWord', {
                title: '忘记密码',
                url: '/resetPassWord',
                views: {
                    '': {
                        templateUrl: 'app/components/resetPassWord/resetPassWordView.html',
                        controller: 'ResetPassWordCtrl',
                    },
                },
                resolve: {
                    lazy: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                files: [
                                    // signin
                                    'app/components/resetPassWord/resetPassWordService.js',
                                    'app/components/resetPassWord/resetPassWordController.js'
                                ],

                            });
                        }
                    ]
                }

            })
            // 新密码
            .state('newPassWord', {
                title: '忘记密码',
                url: '/newPassWord/:smsid/:ranCode/:phone',
                views: {
                    '': {
                        templateUrl: 'app/components/newPassWord/newPassWordView.html',
                        controller: 'NewPassWordCtrl'
                    }
                },
                resolve: {
                    lazy: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                files: [
                                    'app/components/newPassWord/newPassWordService.js',
                                    'app/components/newPassWord/newPassWordController.js'
                                ]
                            });
                        }
                    ]
                }
            })
            // 重置成功
            .state('resetSuccess', {
                title: '重置成功',
                url: '/resetSuccess',
                views: {
                    '': {
                        templateUrl: 'app/components/resetSuccess/resetSuccessView.html',
                        controller: 'ResetSuccessCtrl',
                    },
                },
                resolve: {
                    lazy: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                files: [
                                    'app/components/resetSuccess/resetSuccessController.js'
                                ],

                            });
                        }
                    ]
                }

            })

    }
})();
