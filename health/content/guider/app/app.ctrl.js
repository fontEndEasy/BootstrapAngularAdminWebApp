(function() {
    angular.module('app')
        .controller('AppCtrl', AppCtrl)

    function AppCtrl() {

        app.url = {};
        app.url.access_token = localStorage['guider_access_token'];

        //app.urlRoot = '/kangzhe/';
        var upLoad = '/upload/';
        var im = '/qiniu/';
        var imApiRoot = window.imApiRoot || '/';

        // 配置接口
        app.api = {

            shared: {

                // 登录
                signin: serverApiRoot + 'user/login',

                // 登出
                signOut: serverApiRoot + 'user/logout',

                // 获取备注
                getRemarks: serverApiRoot + 'user/getRemarks',

                // 修改备注
                setRemarks: serverApiRoot + 'user/setRemarks',

                // 获取日程
                getSchedules: serverApiRoot + 'pack/orderExpand/getSchedule',

                // 日程记录列表
                scheduleTime: serverApiRoot + 'pack/orderExpand/scheduleTime',
                // 获取全部的病种树
                getDiseaseTree: serverApiRoot + 'base/getDiseaseTree',
                // 根据父节点获取病种
                getDisease: serverApiRoot + 'base/getDisease',
                // 当天日程详情
                scheduleDetail: serverApiRoot + 'pack/orderExpand/scheduleDetail',

                // 基础数据 - 获取所有科室
                getAllDepts: serverApiRoot + 'base/getAllDepts',

                //根据当前查询日期，当天之后尚未进行服务的订单数量
                getNoService: serverApiRoot + 'pack/orderExpand/getNoService',

                //发送验证码
                sendRanCode: serverApiRoot + 'user/sendRanCode',

                //验证验证码
                verifyResetPassword: serverApiRoot + 'user/verifyResetPassword',

                //重置密码
                resetPassword: serverApiRoot + 'user/resetPassword',

                //更新密码
                updatePassword: serverApiRoot + 'user/updatePassword'
            },

            doctor: {
                // 获取个人信息
                getIntro: serverApiRoot + 'doctor/getIntro',
                // 获取个人简介
                basicInfo: serverApiRoot + 'doctor/basicInfo',
                // 获取医生信息－－导医
                doctorInfo: serverApiRoot + 'guide/doctorInfo',
                // 添加医生预约时间
                addDocTime: serverApiRoot + 'guide/addDocTime',
                // 删除医生预约时间
                removeDocTime: serverApiRoot + 'guide/removeDocTime',
                // 医生集团搜索 - 根据病种搜索医生
                findDoctorByDiseaseType: serverApiRoot + 'groupSearch/findDoctorByDiseaseType',
                // 医生集团搜索 - 根据科室搜索医生
                findDoctorByDept: serverApiRoot + 'groupSearch/findDoctorByDept',

                // 专长 - 检查建议
                getCheckSuggest: serverApiRoot + 'base/getCheckSuggest',

                // 诊疗记录 - 诊疗记录修改
                updateCurrecord: serverApiRoot + 'cureRecord/updateCurrecord',

                // 诊疗记录 - 诊疗记录创建
                createCurrecord: serverApiRoot + 'cureRecord/createCurrecord',

                //根据所在市，所在医院，所在科室来筛选医生
                findDoctors: serverApiRoot + 'guide/findDoctorsForWeb',

                //导医为医生添加备注
                addDocRemark: serverApiRoot + 'guide/addDocRemark',

                //通过关键字查找医生（模糊查找）
                findDoctorsFromKeyWord: serverApiRoot + 'guide/findDoctorsFromKeyWord'
            },

            guider: {
                // 咨询订单（导医） - 确定
                confirm: serverApiRoot + 'guide/confirm',

                // 咨询订单（导医） - 导医会话---查看病情详情
                findOrderDiseaseAndRemark: serverApiRoot + 'guide/findOrderDiseaseAndRemark'
            },

            order: {

                // 获取等待接单列表
                waitOrderList: serverApiRoot + 'guide/waitOrderList',

                // 导医接单
                getOrder: serverApiRoot + 'guide/receive',

                // 获取服务中的会话
                chartLists: serverApiRoot + 'guide/groupList',

                // 结束服务
                closeOrder: serverApiRoot + 'guide/endService',

                // 获取病情详情
                getOrderDisease: serverApiRoot + 'guide/orderDisease',

                // 拨打电话
                callByTel: serverApiRoot + 'voip/callByTel',

                // 发送医生预约时间
                appointTime: serverApiRoot + 'guide/appointTime',

                // 历史接单记录（导医端）
                orderList: serverApiRoot + 'guide/orderList',

                // 获取订单备注
                getOrderRemarks: serverApiRoot + 'pack/order/getRemarks',

                // 修改订单备注
                setRemarks: serverApiRoot + 'pack/order/setRemarks',

                // 服务套餐 - 查询套餐
                query: serverApiRoot + 'pack/pack/query',

                // 咨询订单（导医） - 我的订单
                getOrders: serverApiRoot + 'guide/getOrders',

                // 诊疗记录 - 根据患者和医生查找诊疗记录
                findByPatientAndDoctor: serverApiRoot + 'cureRecord/findByPatientAndDoctor',

                // 诊疗记录 - 根据订单查找诊疗记录
                findByOrder: serverApiRoot + 'cureRecord/findByOrder',

                // 订单-会话 - 预约时间
                changeAppointTime: serverApiRoot + 'orderSession/appointTime',

                //指令类型-----type=1:联系不上医生；type=2：医生没时间；type=3：通知已有推荐医生
                sendCardEvent: serverApiRoot + 'guide/sendCardEvent',

                //导医，预约的医生列表接口，状态（未预约，待支付）
                getConsultOrderDoctorList: serverApiRoot + 'guide/getConsultOrderDoctorList',

                //查看病情详情（将患者备注与患者信息合二为一）
                findOrderDiseaseAndRemark: serverApiRoot + 'guide/findOrderDiseaseAndRemark',

                //患者病情资料维护
                modifyPatientInfo: serverApiRoot + 'pack/order/modifyOrder',

                //获取患者发送的IM图片
                getDialogueImg: serverApiRoot + 'guide/getDialogueImg',

                //获取待处理订单
                getGuideNoServiceOrder: serverApiRoot + 'guide/getGuideNoServiceOrder',

                //获取已处理订单
                getGuideAlreadyServicedOrder: serverApiRoot + 'guide/getGuideAlreadyServicedOrder',

                //获取咨询记录通话录音
                getVoiceByOrderId:serverApiRoot+'cureRecord/getVoiceByOrderId'
            },

            im: {
                // 获取会话消息
                getMsgList: imApiRoot + 'msg/msgList',

                // 发送消息
                sendMsg: imApiRoot + 'msg/send',

                // 快捷回复列表
                getQuickReplyList: serverApiRoot + 'pack/fastandReply/getFastandReply',

                // 更新快捷回复
                updateQuickReply: serverApiRoot + 'pack/fastandReply/updateFastandReply',

                // 添加快捷回复
                addQuickReply: serverApiRoot + 'pack/fastandReply/addFastandReply',

                // 删除快捷回复
                removeQuickReply: serverApiRoot + 'pack/fastandReply/deleteFastandReply',

            },

            conference: {
                // 创建电话会议
                createConference: serverApiRoot + 'conference/createConference',

                // 电话会议 - 轮询获取状态
                conferenceGetStatus: serverApiRoot + 'conference/getStatus',

                // 电话会议 - 解散会议
                dismissConference: serverApiRoot + 'conference/dismissConference',

                // 电话会议 - 禁听
                deafConference: serverApiRoot + 'conference/deafConference',

                // 电话会议 - 取消禁听
                unDeafConference: serverApiRoot + 'conference/unDeafConference',

                // 电话会议 - 邀请加入
                inviteMember: serverApiRoot + 'conference/inviteMember',

                // 电话会议 - 退出会议即移出与会者
                removeConference: serverApiRoot + 'conference/removeConference',
            },

            upLoad: {

                // 通用文件上传
                commonUploadServlet: upLoad + 'CommonUploadServlet'
            },

            care:{
                //导医接关怀计划订单
                receiveCareOrder:serverApiRoot+'guide/receiveCareOrder',

                //查询正在处理中的订单
                getHandleCareOrder:serverApiRoot+'guide/getHandleCareOrder',

                //标记求助或告警处理完成
                updateCareOrder:serverApiRoot+'guide/updateCareOrder',

                //获取医生团队
                getDoctorTeam:serverApiRoot+'guide/getDoctorTeam',

                //获取等待接单列表
                heathWaitOrderList:serverApiRoot+'guide/heathWaitOrderList',

                //关怀订单详情
                getCareOrderDetail:serverApiRoot+'guide/getCareOrderDetail',
            }
        }
    }

})();
