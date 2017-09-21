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

            // API路径集合
            app.urlRoot = serverApiRoot;
            //app.urlFile = '/upload/';
            app.yiliao = '/yiliao/';
            app.yiliao = serverApiRoot;
            app.urlFile = uploadApiRoot;
            app.medicine = medicineApiRoot;

            var common = {
                list: 'list.iv',
                save: 'save.iv',
                edit: 'edit.iv',
                modify: 'modify.iv',
                delete: 'batchDelete.iv',
                find: 'findByIds.iv',
                view: 'view.iv'
            };

            function getApi(name, common) {
                var apis = {};
                for (var n in common) {
                    apis[n] = serverApiRoot + name + '/' + common[n];
                }
                return apis;
            }

            app.url = {
                access_token: localStorage.getItem('check_access_token'),
                groupId: function() {
                    return '666666666666666666666666';
                },

                login: serverApiRoot + 'user/login',
                logout: serverApiRoot + 'user/logout',
                admin: {
                    check: {
                        getDoctors: serverApiRoot + 'admin/check/getDoctors',
                        getDoctor: serverApiRoot + 'admin/check/getDoctor',
                        searchByCompany: serverApiRoot + 'company/searchByCompany',
                        getCompanyById: serverApiRoot + 'company/getCompanyById',
                        updateByCompany: serverApiRoot + 'company/updateByCompany',
                        getArea: serverApiRoot + 'admin/check/getArea',
                        getHospitals: serverApiRoot + 'admin/check/getHospitals',
                        getDepts: serverApiRoot + 'admin/check/getDepts',
                        getTitles: serverApiRoot + 'admin/check/getTitles',
                        checked: serverApiRoot + 'admin/check/checked',
                        fail: serverApiRoot + 'admin/check/fail',
                        updateCheckInfo: serverApiRoot + 'doctor/updateCheckInfo',
                        findDoctorByAuthStatus: serverApiRoot + 'admin/check/findDoctorByAuthStatus',
                        addHospital: serverApiRoot + 'admin/check/addHospital',
                        getGroupCert: serverApiRoot + 'group/cert/getGroupCert',
                        getGroupCerts: serverApiRoot + 'group/cert/getGroupCerts',
                        getOtherGroupCerts: serverApiRoot + 'group/cert/getOtherGroupCerts',
                        passCert: serverApiRoot + 'group/cert/passCert',
                        noPass: serverApiRoot + 'group/cert/noPass',
                        updateRemarks: serverApiRoot + 'group/cert/updateRemarks',
                        groupApplyList: serverApiRoot + 'group/applyList',
                        processGroupApply: serverApiRoot + 'group/processGroupApply',
                        applyDetail: serverApiRoot + 'group/applyDetail',
                    }
                },
                feedback: {
                    query: serverApiRoot + 'feedback/query',
                    get: serverApiRoot + 'feedback/get'
                },
                user: {
                    getDoctorFile: serverApiRoot + 'user/getDoctorFile'
                },
                upload: {
                    getCertPath: app.urlFile + 'getCertPath',
                    upLoadImg: app.urlFile + 'cert',
                    CommonUploadServlet: app.urlFile + 'CommonUploadServlet',
                    commonDelFile: app.urlFile + 'commonDelFile'
                },
                order: {
                    findOrder: serverApiRoot + 'pack/order/findOrders',
                    updateRefundByOrder: serverApiRoot + 'pack/order/updateRefundByOrder',
                    callByOrder: serverApiRoot + 'voip/callByOrder'
                },
                //患教中心
                document: {
                    getAllData: app.yiliao + 'department/getAllDataById',
                    getDepartmentDoctor: serverApiRoot + 'department/doctor/getDepartmentDoctor',
                    getDiseaseTree: serverApiRoot + 'base/getDiseaseTree',
                    //上移置顶指定文章
                    topArticleUp: serverApiRoot + 'article/topArticleUp',
                    //取消指定文档置顶
                    topArticleRemove: serverApiRoot + 'article/topArticleRemove',
                    //获取置顶文章列表（最多5条）
                    findTopArticle: serverApiRoot + 'article/findTopArticle',
                    //收藏一个文档，已收藏不做重复收藏操作
                    collectArticle: serverApiRoot + 'article/collectArticle',
                    //置顶指定文章，如果已置顶文章大于5，则不置顶并返回提示信息
                    topArticle: serverApiRoot + 'article/topArticle',
                    //新建文章
                    addArticle: serverApiRoot + 'article/addArticle',
                    //查询病种树并统计对应一级病种文档数量
                    findDiseaseTreeForArticle: serverApiRoot + 'article/findDiseaseTreeForArticle',
                    //根据关键字搜索文章标题,获取文章列表
                    findArticleByKeyWord: serverApiRoot + 'article/findArticleByKeyWord',
                    //根据病种查出对应范围内文章，返回文章（基本信息）列表，指定查询范围（1：平台，2：集团，3：个体医生），指定创建者ID范围内文章列表
                    getArticleByDisease: serverApiRoot + 'article/getArticleByDisease',
                    //根据父节点获取专长，parentId为空查找一级病种
                    getDisease: serverApiRoot + 'base/getDisease',
                    //根据ID查询出文章，返回所有基本信息
                    getArticleById: serverApiRoot + 'article/getArticleById',
                    //编辑指定ID文章，返回所有基本信息，后台增加一条浏览记录
                    updateArticle: serverApiRoot + 'article/updateArticle',
                    //根据标签搜索tag字段,获取文章列表 整个文档对象（包含ＵＲＬ）（查看平台文章时，该用户是否已收藏，后面再做）
                    findArticleByTag: serverApiRoot + 'article/findArticleByTag',
                    //删除文章，只能删除useNum为0的所有文章
                    delArticle: serverApiRoot + 'article/delArticle',
                    //根据ID查询出文章，返回所有基本信息（web端）
                    getArticleByIdWeb: serverApiRoot + 'article/getArticleByIdWeb'
                },
                //爱心宣教
                pubMsg: {
                    //根据集团Id获取该集团下所有公共号
                    getPubListByMid: serverApiRoot + 'pub/getByMid',
                    //公共号发送消息(消息只接收json格式)
                    sendMsg: serverApiRoot + 'pub/sendMsg',
                    //根据公共号Id获取公共号信息
                    getPubInfo: serverApiRoot + 'pub/get',
                    //保存公共号信息
                    savePubInfo: serverApiRoot + 'pub/save',
                    //公共号 - 获取消息历史
                    getMsgHistory: serverApiRoot + 'pub/msgList',
                    //删除公共号信息
                    delMsgHistory: serverApiRoot + 'pub/delMsg',
                    //玄关平台客服所有公共号
                    getCustomerPub: serverApiRoot + 'pub/getCustomerPub',
                    //获取消息历史(分页查询)
                    getMsgPageList: serverApiRoot + 'pub/msgPageList'
                },
                //健康科普和患者广告
                science_ad: {
                    //根据文档类型获取对应的文档内容分类列表
                    getContentType: serverApiRoot + 'document/getContentType',
                    //创建文档（患者广告/健康科普）
                    createDocument: serverApiRoot + 'document/createDocument',
                    //获取文档列表
                    getDocumentList: serverApiRoot + 'document/getDocumentList',
                    //根据ID浏览文档
                    viewDocumentDetail: serverApiRoot + 'document/viewDocumentDetail',
                    //更新文档
                    updateDocument: serverApiRoot + 'document/updateDocument',
                    //删除文档
                    delDocument: serverApiRoot + 'document/delDocument',
                    //根据ID获取文档信息
                    getDocumentDetail: serverApiRoot + 'document/getDocumentDetail',
                    //设置科普文档置顶
                    setTopScience: serverApiRoot + 'document/setTopScience',
                    //获取科普置顶文章（按权重排序），不足五条，则补充至五条按浏览量倒序排序
                    getTopScienceList: serverApiRoot + 'document/getTopScienceList',
                    //上移或者下移已置顶或者已显示的文档
                    upOrDownWeight: serverApiRoot + 'document/upOrDownWeight',
                    //置广告显示或不显示
                    setAdverShowStatus: serverApiRoot + 'document/setAdverShowStatus',
                },
                account: {
                    //获取导医列表
                    getGuideDoctorList: serverApiRoot + 'user/getGuideDoctorList',
                    //注册账户
                    register: serverApiRoot + 'user/register',
                    //重置密码
                    resetPassword: serverApiRoot + 'user/oneKeyReset',
                    //更新导医信息
                    updateUserInfo: serverApiRoot + 'user/updateGuidInfo',
                    //更改启用信息
                    updateStatus: serverApiRoot + 'user/updateGuideStatus'
                },
                msg: {
                    find: serverApiRoot + 'smsLog/find',
                    //删除文案模板
                    delTpl: serverApiRoot + 'base/deleteCopyWriterTemplateById',
                    //新增或者更新文案模板
                    saveMsgTpl: serverApiRoot + 'base/saveMsgTemplate',
                    //查询或者搜索文案模板（可分页获取）
                    queryMsgTpl: serverApiRoot + 'base/queryMsgTemplate',
                    //根据ID文案模板
                    queryMsgTplById: serverApiRoot + 'base/queryMsgTemplateById'
                },
                // 关怀计划
                care: {
                    get: serverApiRoot + 'group/fee/get',
                    // 添加随访计划模板接口
                    //addFollowUpTemplate: app.yiliao + 'pack/followReForm/addFollowUpTemplate',
                    addFollowUpTemplate: serverApiRoot + 'pack/followReForm/addFollowUpTemplate',
                    // 查询单个随访计划模板接口
                    //findFollowUpTemplate: app.yiliao + 'pack/followReForm/findFollowUpTemplate',
                    findFollowUpTemplate: serverApiRoot + 'pack/followReForm/findFollowUpTemplate',
                    // 删除随访计划模板接口
                    //deleteFollowUpTemplate: app.yiliao + 'pack/followReForm/deleteFollowUpTemplate',
                    deleteFollowUpTemplate: serverApiRoot + 'pack/followReForm/deleteFollowUpTemplate',
                    //统计 - 获取有数据的集团病种树
                    getDiseaseTypeTree: serverApiRoot + 'group/stat/getDiseaseTypeTree',
                    queryCareTemplate: serverApiRoot + 'pack/care/queryCareTemplate',
                    queryCareTemplateDetail: serverApiRoot + 'pack/care/queryCareTemplateDetail',
                    queryCareTemplateItem: serverApiRoot + 'pack/care/queryCareTemplateItem',
                    saveCareTemplate: serverApiRoot + 'pack/care/saveCareTemplate',
                    delCareTemplate: serverApiRoot + 'pack/care/delCareTemplate',
                    findCareTemplateById: serverApiRoot + 'pack/care/findCareTemplateById',
                    deleteCareTempateByCare: serverApiRoot + 'pack/care/deleteCareTempateByCare',
                    saveCareTemplateByCare: serverApiRoot + 'pack/care/saveCareTemplateByCare',
                    queryCareTemplateItemDetailByCare: serverApiRoot + 'pack/care/queryCareTemplateItemDetailByCare',
                    findFollowUpTemplates: serverApiRoot + 'pack/followReForm/findFollowUpTemplates',
                    getOrderDetailById: serverApiRoot + 'pack/order/getOrderDetailById',
                },
                yiliao: {
                    getTypeByParent: serverApiRoot + 'article/getTypeByParent'
                },
                finance: {
                    settleTypeList: serverApiRoot + 'income/settleTypeList', // departed
                    settleList: serverApiRoot + 'income/settleList', // departed
                    settleIncome: serverApiRoot + 'income/settleIncome', // departed
                    settleIncomeList: serverApiRoot + 'income/settleIncomeList', // departed
                    downExcel: serverApiRoot + 'income/downExcel',

                    gSettleYMList: serverApiRoot + 'income/gSettleYMList',
                    dSettleYMList: serverApiRoot + 'income/dSettleYMList',
                    gSettleMList: serverApiRoot + 'income/gSettleMList',
                    dSettleMList: serverApiRoot + 'income/dSettleMList',
                    groupSettle: serverApiRoot + 'income/groupSettle',
                    doctorSettle: serverApiRoot + 'income/doctorSettle',

                    settleYMList: drugFirmsApiRoot + 'eIncome/settleYMList',
                    settleMList: drugFirmsApiRoot + 'eIncome/settleMList',
                    settle: drugFirmsApiRoot + 'eIncome/settle',
                }
            };
            app.lang = {
                datatables: {
                    translation: {
                        "sLengthMenu": "每页 _MENU_ 条",
                        "sZeroRecords": "没有找到符合条件的数据",
                        "sProcessing": "&lt;img src=’./loading.gif’ /&gt;",
                        "sInfo": "当前第 _START_ - _END_ 条，共 _TOTAL_ 条",
                        "sInfoEmpty": "没有记录",
                        "sInfoFiltered": "(从 _MAX_ 条记录中过滤)",
                        "sSearch": "搜索",
                        "oPaginate": {
                            "sFirst": "<<",
                            "sPrevious": "<",
                            "sNext": ">",
                            "sLast": ">>"
                        }
                    }
                }
            }
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
]).factory('authorityInterceptor', [function() {
    var authorityInterceptor = {
        response: function(response) {
            if ('no permission' == response.data) {
                app.controller('Interceptor', ['$state',
                    function($state) {
                        app.state.go('access.404');
                    }
                ]);
            }
            if ("1030102" == response.data.resultCode || "1030101" == response.data.resultCode) {
                app.state.go('access.signin');
            }
            return response;
        }
    };
    return authorityInterceptor;
}]).config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('authorityInterceptor');
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $httpProvider.defaults.transformRequest = [function(data) {
        return angular.isObject(data) && String(data) !== '[object File]' ? $.param(data, true) : data;
    }];
}]);
