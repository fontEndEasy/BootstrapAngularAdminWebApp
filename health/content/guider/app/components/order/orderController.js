(function() {
    angular.module('app')
        .controller('orderCtrl', orderCtrl);

    // 手动注入依赖
    orderCtrl.$inject = ['$scope', '$interval', '$timeout', '$filter', '$sce', '$anchorScroll', '$location', '$state', 'Lightbox', '$http', 'ngAudio', 'OrderFactory', 'toaster', 'ChatImgSelModalFactory'];

    // 订单首页控制器
    function orderCtrl($scope, $interval, $timeout, $filter, $sce, $anchorScroll, $location, $state, Lightbox, $http, ngAudio, OrderFactory, toaster, ChatImgSelModalFactory) {
        $scope.qiniuIMRoot=qiniuIMRoot;
        $scope.isShowWait = false;
        $scope.guider_access_token = localStorage['guider_access_token'];
        $scope.currentOrderItem=null;

        // 滚动到底部
        $scope.goBottom = function() {
            if (!$state.is('order.home'))
                return;
            $location.hash($scope.windowDataListDB.list[$scope.windowDataListDB.list.length - 1].msgId);
        };

        // 获取用户数据
        var user = JSON.parse(localStorage['user']);
        $scope.user = user;

        // 设置轮询时间
        var refreshStep = 10000;

        ////////////////////// 等待接单///////////////////////

        // 获取等待接单数据-轮询
        getOrderListPulling();
        var getOrderListTimer = null;

        function getOrderListPulling() {
            getOrderList();

            // 保持只有一个计时器
            if (getOrderListTimer)
                $timeout.cancel(getOrderListTimer);

            // 离开此页退出轮询
            if (!$state.is('order.home'))
                return;

            getOrderListTimer = $timeout(getOrderListPulling, refreshStep);
        }


        //获取等待接单列表
        function getOrderList() {

            $scope.ordersListIsLoading = true;

            var param = {
                access_token: localStorage['guider_access_token'],
                count: 99999
            }

            OrderFactory
                .getOrderList(param)
                .then(thenFc);

            function thenFc(response) {
                $scope.ordersListIsLoading = false;

                try {
                    // 如果没有本地数据 直接覆盖 并退出循环
                    if (!$scope.orderlistsData || !response) {
                        $scope.orderlistsData = response;
                    } else if ($scope.orderlistsData.length < 1 || response.length < 1) {
                        $scope.orderlistsData = response;
                    }

                    // 与本地数据比较
                    var setp = response.length - $scope.orderlistsData.length;

                    // 比较每一个咨询订单的id
                    for (var i = 0; i < response.length; i++) {

                        if ($scope.orderlistsData[i]) {
                            if ($scope.orderlistsData[i].id != response[i].id) {
                                $scope.orderlistsData[i] = response[i];
                            }
                        } else {
                            $scope.orderlistsData[i] = response[i];
                        }

                    }

                    // 有删除的
                    if (setp < 0) {
                        setp = -setp;
                        $scope.orderlistsData.splice($scope.orderlistsData.length - setp, setp);
                    }


                } catch (e) {
                    console.log(e);
                }

            }
        }

        // 接单
        $scope.getOrder = function(orderId) {
            var param = {
                access_token: localStorage['guider_access_token'],
                id: orderId
            }

            OrderFactory
                .getOrder(param)
                .then(thenFc);

            function thenFc(response) {

                // 更新等待接单列表
                getOrderList();

                // 更新会话列表
                getChatPeopleListDB(true);

                //切换为正在接单列表
                $scope.isShowWait = false;

            }
        };



        ////////////////////// 会话列表///////////////////////

        // 获取会话列表数据-轮询
        getChatPeopleListPulling();
        var getChatPeopleListTimer = null;

        function getChatPeopleListPulling() {
            getChatPeopleListDB();

            if (getChatPeopleListTimer)
                $timeout.cancel(getChatPeopleListTimer);

            // 离开此页退出轮询
            if (!$state.is('order.home'))
                return;

            getChatPeopleListTimer = $timeout(getChatPeopleListPulling, refreshStep);
        }

        // 获取数据
        function getChatPeopleListDB(isUpdateWindowData) {

            $scope.chatPeopleListIsLoading = true;

            var localDB = null;
            var ts = 0;

            if ($scope.chatPeopleListData) {
                localDB = $scope.chatPeopleListData;
                ts = localDB.ts;
            }

            var param = {
                access_token: localStorage['guider_access_token'],
                userId: user.id,
                newData: 1,
                ts: ts
            }

            OrderFactory
                .getChatPeopleList(param)
                .then(thenFc)

            function thenFc(response) {

                $scope.chatPeopleListIsLoading = false;
                var newData = null;

                // 有更新数据则更新本地数据
                if (response && response.msgGroupVO && response.msgGroupVO && response.msgGroupVO.list) {
                    if (response.msgGroupVO.list.length > 0) {
                        for (var i = 0; i < response.msgGroupVO.list.length; i++) {
                            if (response.msgGroupVO.list[i].groupId === "GROUP_002") {
                                response.msgGroupVO.list.splice(i, 1);
                                break;
                            }
                        }
                        if (localDB) {
                            newData = updateChatPeopleList(response.msgGroupVO.list, localDB.list);
                        } else {
                            newData = response.msgGroupVO.list;
                        }

                        localDB = {
                            ts: response.msgGroupVO.ts,
                            list: newData
                        }
                        $scope.chatPeopleListData = localDB;

                    }
                }

                // 如果有订单取消了，即移除关闭的订单
                if (response && response.event && response.event.list) {
                    newData = deleteChatPeopleList(localDB.list, response.event.list);

                    localDB = {
                        ts: response.msgGroupVO.ts,
                        list: newData
                    }
                    $scope.chatPeopleListData = localDB;

                    console.log($scope.chatPeopleListData);

                    if (localDB.list.length < 1) {
                        // 更新会话
                        $scope.windowTarget = {};
                        $scope.windowDataListDB = null;
                        $scope.windowBussiness = null;
                        $scope.showDiseaseInfoTab = false;
                    };
                    for (var i = 0; i < response.event.list.length; i++) {
                        // 是否关闭当前聊天窗口的订单
                        if ($scope.windowDataListDB && $scope.windowDataListDB.gid && response.event.list[i].param.groupId) {
                            if ($scope.windowDataListDB.gid = response.event.list[i].param.groupId) {
                                $scope.chatPeopleListItemClick(localDB.list[0]);
                                break;
                            };
                        }

                    };
                };

                if (isUpdateWindowData) {
                    $scope.chatPeopleListItemClick($scope.chatPeopleListData.list[0]);
                };


                if (!$scope.windowTarget && localDB && localDB.list) {
                    if (localDB.list.length > 0) {
                        $scope.chatPeopleListItemClick(localDB.list[0]);
                    };
                };

            }
        }


        // 合并 对话列表数据库数据，返回合并后的数据
        function updateChatPeopleList(newData, oldData) {

            for (var i = 0; i < newData.length; i++) {
                if ($scope.windowDataListDB && newData[i].groupId == $scope.windowDataListDB.gid) {
                    //todo
                    getWindowData(newData[i].groupId, 0, $scope.windowDataListDB.list[$scope.windowDataListDB.list.length - 1].msgId)
                }

                for (var j = 0; j < oldData.length; j++) {

                    if (newData[i].groupId == oldData[j].groupId) {
                        //newData[i].unread = oldData[j].unread + newData[i].unread;
                        oldData.splice(j, 1);
                        break;
                    }
                }
            }
            return newData.concat(oldData);

        };

        // 移除关闭的订单
        function deleteChatPeopleList(localList, eventList) {

            if (eventList) {
                for (var k = 0; k < eventList.length; k++) {

                    for (var l = 0; l < localList.length; l++) {

                        if (eventList[k].param.groupId == localList[l].groupId) {
                            console.log('删除订单' + localList[l].groupId);
                            localList.splice(l, 1);
                        }
                    }
                }
            }

            return localList;
        }

        // 时间格式化
        $scope.formatDate = function(value) {

            var today = new Date().getTime();
            var timeStep = (today - value) / 1000 / 60 / 60 / 24;

            if (timeStep >= 0 && timeStep < 1) {
                return $filter('date')(new Date(value), 'H:mm:ss');
            }

            if (timeStep >= 1 && timeStep <= 2) {
                return '昨天';
            }

            if (timeStep > 2) {
                return $filter('date')(new Date(value), 'yyyy/MM/dd');
            }

        };

        // 点击会话人
        $scope.chatPeopleListItemClick = function(item) {
            //if($scope.windowTarget && item && item.gid==$scope.windowTarget.windowId){
            //    return;
            //}
            $scope.currentOrderItem=item;//用于当前正在接单项高亮

            $scope.$broadcast("clearEdit");
            var localDB = $scope.chatPeopleListData;

            for (var i = 0; i < localDB.list.length; i++) {
                if (item.groupId == localDB.list[i].groupId) {
                    localDB.list[i].unreadCount = 0;
                    break;
                }
            }

            $scope.chatPeopleListData = localDB;
            // 生成会话对象信息
            if (item) {
                var tempId;
                for (var i = 0; i < item.groupUsers.length; i++) {
                    if (item.groupUsers[i].userType==1) {
                        tempId=item.groupUsers[i].id;
                        break;
                    }
                }
                $scope.windowTarget = {
                    name: item.name,
                    id: tempId,
                    pic: item.gpic,
                    bizStatus: item.bizStatus,
                    windowId: item.groupId
                }
            } else {
                $scope.windowTarget = {};
            }

            //获取会话对象信息
            $scope.getTargetInfo($scope.windowTarget.windowId);

            // 更新会话
            $scope.windowDataListDB = null;
            $scope.windowBussiness = null;

            if (item && item.groupId) {
                getWindowData(item.groupId);
                $scope.getPatientInfo(item.groupId);
                $scope.showDiseaseInfoTab = true;
            } else {
                //右侧栏病情资料隐藏
                $scope.showDiseaseInfoTab = false;
            }

            // 关闭工具箱
            if ($scope.closePop)
                $scope.closePop();

        }



        /////////////////// 会话周边功能 ////////////////


        //获取会话医生列表
        $scope.getConsultDoctorList = function(gid) {
            $http.post(app.api.order.getConsultOrderDoctorList, {
                access_token: localStorage['guider_access_token'],
                gid: gid,
            }).
            success(function(data, status, headers, config) {
                if (data.resultCode == 1) {
                    $scope.consultDoctorList = data.data.doctorlist || [];
                } else {

                }
            }).
            error(function(data, status, headers, config) {
                toaster.pop('error', null, data.resultMsg);
            });
        };



        //获取会话对象信息
        $scope.getTargetInfo = function(gid) {
            $scope.targetInfoView = {};
            $scope.targetInfoView.isLoading = true;

            var param = {
                access_token: localStorage['guider_access_token'],
                gid: gid
            }

            OrderFactory
                .getOrderDisease(param)
                .then(thenFc)

            function thenFc(response) {
                $scope.targetInfoView.isLoading = false;
                $scope.targetInfo = response;
            }
        }

        // 放大图片
        $scope.openLightboxModal = function(item, index) {
            var modalInstance = Lightbox.openModal(item, index);

        };




        // 拨打电话
        $scope.callPhone = function(toTel, fromTel) {
            $scope.call = {};
            $scope.call.isCalling = true;

            if (!fromTel) var fromTel = user.telephone;

            var param = {
                access_token: localStorage['guider_access_token'],
                toTel: toTel,
                fromTel: fromTel
            }

            OrderFactory
                .callByTel(param)
                .then(thenFc)

            function thenFc(response) {
                $scope.call.isCalling = false;

                if (!response) {
                    $scope.call.result = {
                        type: false,
                        content: '接口调用失败'
                    }
                    return;
                }

                if (!response.resp) {
                    $scope.call.result = {
                        type: false,
                        content: '接口调用失败'
                    }
                    return;
                }

                if (response.resp.respCode == '000000') {
                    $scope.call.result = {
                        type: true,
                        content: '拨打成功'
                    }
                    $scope.callView.isOpen=false;
                    toaster.pop('success',null,'拨打成功');
                }

                if (response.resp.respCode !== '000000') {
                    $scope.call.result = {
                        type: false,
                        content: '拨打失败'
                    }
                }
            }

        }


        /////////////////// 会话内容 /////////////////

        // 获取会话内容-轮询
        //getWindowDataPulling();
        //var getWindowDataTimer = null;
        function getWindowDataPulling() {

            if ($scope.windowDataListDB && $scope.windowDataListDB.list) {
                if ($scope.windowDataListDB.list.length > 0) {
                    if ($scope.windowTarget) {
                        if ($scope.windowTarget.windowId != $scope.windowDataListDB.gid)
                            $scope.windowDataListDB.gid = $scope.windowTarget.windowId;
                        getWindowData($scope.windowDataListDB.gid, 0, $scope.windowDataListDB.list[$scope.windowDataListDB.list.length - 1].msgId);
                    };
                }

            }

            // 保持只有一个计时器
            if (getWindowDataTimer)
                $timeout.cancel(getWindowDataTimer);

            // 离开此页退出轮询
            if (!$state.is('order.home'))
                return;

            getWindowDataTimer = $timeout(getWindowDataPulling, refreshStep);
        };

        // 获取会话内容
        function getWindowData(gid, type, msgId) {
            $scope.windowIsLoading = true;

            var param = {
                access_token: localStorage['guider_access_token'],
                userId: user.id,
                groupId: gid,
                cnt: 20
            }


            // 第一次获取
            //if (type && msgId) {
            if (msgId) {
                param.type = type;
                param.msgId = msgId;
            }

            OrderFactory
                .getWindowData(param)
                .then(thenFc)

            function thenFc(response) {
                $scope.getConsultDoctorList(gid);

                $scope.windowIsLoading = false;
                $scope.isNoOldData = false;

                // 本地没有数据
                if (!$scope.windowDataListDB) {
                    if (gid !== $scope.windowTarget.windowId) {
                        return;
                    }
                    if (response.msgList) {
                        var localDB = {
                            gid: response.groupId,
                            list: response.msgList
                        };
                        $scope.windowDataListDB = localDB;
                        $scope.windowBussiness = response.bussiness;
                        $scope.goBottom();
                    }
                }
                // 本地有数据
                else {
                    if (response.msgList) {
                        if (response.msgList.length > 0 && $scope.windowTarget && $scope.windowTarget.windowId) {

                            // 获取新数据
                            if (type == 0) {
                                var index = null;
                                for (var i = 0; i < response.msgList.length; i++) {
                                    if (response.msgList[i].msgId == $scope.windowDataListDB.list[$scope.windowDataListDB.list.length - 1].msgId) {
                                        index = i;
                                        break;
                                    }
                                }

                                if (index) {
                                    for (var j = index + 1; j < response.msgList.length; j++) {
                                        $scope.windowDataListDB.list.push(response.msgList[j]);
                                    }
                                } else {

                                    for (var j = 0; j < response.msgList.length; j++) {
                                        $scope.windowDataListDB.list.push(response.msgList[j]);
                                    }

                                }

                                $scope.windowBussiness = response.bussiness;
                                $scope.windowDataListDB.gid = response.groupId;
                                if ($scope.windowTarget && $scope.windowTarget.windowId != $scope.windowDataListDB.gid)
                                    $scope.windowDataListDB.gid = $scope.windowTarget.windowId;
                                $scope.goBottom();
                            }

                            // 获取旧数据
                            else if (type == 1) {

                                $scope.windowDataListDB.list = response.msgList.concat($scope.windowDataListDB.list);
                                $scope.windowBussiness = response.bussiness;
                                $scope.windowDataListDB.gid = response.groupId;
                                if ($scope.windowTarget && $scope.windowTarget.windowId != $scope.windowDataListDB.gid)
                                    $scope.windowDataListDB.gid = $scope.windowTarget.windowId;

                                $scope.isOldDataLoading = false;

                            }
                        } else {
                            $scope.isOldDataLoading = false;
                            $scope.isNoOldData = true;
                        }

                    }
                }



            }
        }
        // 刷新会话
        $scope.refreshWindowData = function() {
            if ($scope.windowDataListDB && $scope.windowDataListDB.list) {
                if ($scope.windowDataListDB.list.length > 0) {
                    getWindowData($scope.windowDataListDB.gid, 0, $scope.windowDataListDB.list[$scope.windowDataListDB.list.length - 1].msgId);
                }

            }
        };
        // 获取会话历史数据
        $scope.getWindowOldData = function() {
            if ($scope.isOldDataLoading == true) return;
            $scope.isOldDataLoading = true;
            getWindowData($scope.windowDataListDB.gid, 1, $scope.windowDataListDB.list[0].msgId);
        };

        // 文本内容转换
        $scope.textToHtml = function(content) {
            var results = $scope.faceimgfc(content, '/guider/app/shared/chat_window/faceIcon/filter/faceimages')
            results = $sce.trustAsHtml(results);
            return results;
        };

        // 卡片内容转换
        $scope.contentToHtml = function(content) {
            var results = content.replace(eval('/\\' + '|' + '\/g'), '<br>');
            results = $sce.trustAsHtml(results);
            return results;
        };

        // 消息时间转换(不能用了，逻辑有点问题)
        //$scope.msgFormatDate = function(value) {
        //    var time;
        //    var today = Date.now();
        //    var timeStep = Math.floor((today - value) / 1000 / 60 / 60 / 24);
        //
        //    if (timeStep ==0) {
        //        return time = '今天 ' + $filter('date')(new Date(value), 'HH:mm');
        //    }
        //
        //    if (timeStep ==1) {
        //
        //        return time = '昨天 ' + $filter('date')(new Date(value), 'MM-dd HH:mm');
        //
        //    }
        //
        //    if (timeStep > 1) {
        //        return time = $filter('date')(new Date(value), 'MM-dd HH:mm');
        //    }
        //
        //};

        // 结束服务
        $scope.closeOrder = function(id) {

            if (!id)
                return console.warn('缺少会话id');

            $scope.closeOrderIsLoading = true;

            var param = {
                access_token: localStorage['guider_access_token'],
                gid: id
            }

            OrderFactory
                .closeOrder(param)
                .then(thenFc)

            function thenFc(response) {
                $scope.closeOrderIsLoading = false;
                console.log('成功结束订单:' + id);

                getChatPeopleListDB();
            }

        };


        /*处理语音*/
        // function dealAudio(key) {
        //     var _audio_ = {};

        //     _audio_ = $scope.getAudio(key);

        //     if (_audio_.paused === undefined || _audio_.paused) {
        //         _audio_.play();
        //     } else {
        //         _audio_.pause();
        //     };
        // };

        // 获取语音
        $scope.getAudio = function(key) {

            if (!key) {
                return
            };

            // 点击原来的音频
            if ($scope.audio && $scope.audio.key === key) {

                if ($scope.audio.paused === undefined || $scope.audio.paused) {
                    $scope.audio.play();
                } else {
                    $scope.audio.pause();
                };

            }
            // 点击新的音频
            else {

                // 停止正在播放的音频
                if ($scope.audio) {
                    $scope.audio.restart();
                };

                $http({
                    url: imRoot+'/file/avthumb.action',
                    method: 'post',
                    headers: {
                        'access-token': localStorage['guider_access_token'],
                        //'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: {
                        bucket: 'message',
                        key: key,
                        format: 'mp3'
                    }

                }).then(function(response) {

                    if (response.data.resultCode === 1) {

                        var _audio_ = ngAudio.load('/qiniuUrl/' + response.data.data.key);
                        _audio_.key = key;

                        $scope.audio = _audio_;

                        if ($scope.audio.paused === undefined || $scope.audio.paused) {
                            $scope.audio.play();
                            console.log('play', _audio_)
                        } else {
                            $scope.audio.pause();
                            console.log('pause', _audio_)
                        };

                    };

                });
            };
        };

        $scope.thisAudio = function(key) {
            if ($scope.audio && key === $scope.audio.key) {
                return $scope.audio;
            }
        }

        // 编辑框
        $scope.shared = {
            submitEditorDate: submitEditorDate
        };

        // 提交会话内容
        function submitEditorDate(data) {
            var param = {
                access_token: localStorage['guider_access_token'],
                type: data.type,
                fromUserId: data.user.id,
                gid: data.windowId
            }

            // 文本
            if (data.type == 1) {
                param.content = data.content;

                // 图片
            } else if (data.type == 2) {

                if (data.uri)
                    param.uri = data.uri;

                if (data.format)
                    param.format = data.format;
                if (data.key)
                    param.key = data.key;

                param.name = data.name;
                param.width = data.width;
                param.height = data.height;
                param.size = data.size;
            }
            OrderFactory
                .sendMsg(param)
                .then(thenFc)

            function thenFc(response) {
                getWindowData($scope.windowDataListDB.gid, 0, $scope.windowDataListDB.list[$scope.windowDataListDB.list.length - 1].msgId);
            }
        }

        //Lightbox.templateUrl = 'app/components/order/lightboxModal.html';

        $scope.openLightboxModal2 = function(index) {
            var modalInstance = Lightbox.openModal($scope.patientInfo.diseaseImgs, index, {
                templateUrl: 'app/components/order/lightboxModal.html'
            });

            modalInstance.result.then(function(selectedItem) {
                console.log(selectedItem);
                if (selectedItem) {
                    $scope.patientInfo.diseaseImgs = $scope.patientInfo.diseaseImgs.filter(function(item, index, array) {
                        return item != selectedItem;
                    });
                    console.log($scope.patientInfo.diseaseImgs);
                    $scope.savePatientInfo();
                }
            }, function() {

            });
        };


        // 七牛上传文件过滤
        $scope.patientqiniuFilters = {
            mime_types: [ //只允许上传图片和zip文件
                {
                    title: "Image files",
                    extensions: "jpg,gif,png"
                }
            ]
        };

        $scope.maxSelect = function(arry) {
            var result = 0,
                max = 8;
            if (arry && arry.length > 0) {
                if (arry.length >= 8) {
                    result = 0;
                } else {
                    result = max - arry.length;
                };
            } else {
                result = max;
            };
            return result;
        };

        // 每个文件上传成功回调
        $scope.patientUploaderSuccess = function(up, file, info) {
            $scope.patientInfo.diseaseImgs.push(file.url);
            $scope.savePatientInfo();

        };
        // 每个文件上传失败后回调
        $scope.patientUploaderError = function(up, err, errTip) {
            console.warn(up, err, errTip);
            toaster.pop('error', null, errTip);
        };

        //获取患者病历
        $scope.getPatientInfo = function(gid) {
            var param = {
                access_token: localStorage['guider_access_token'],
                gId: gid
            };
            OrderFactory.findOrderDisease(param).then(function(data) {
                var name = data.orderVo.patientName ? data.orderVo.patientName + '，' : '';
                var sex = '';
                if (data.orderVo.sex) {
                    if (data.orderVo.sex == 1) {
                        sex = '男，';
                    } else if (data.orderVo.sex == 0) {
                        sex = '女，'
                    }
                }
                var age = data.orderVo.age ? data.orderVo.age + '，' : '';
                var relation = data.orderVo.relation ? '患者' + data.orderVo.relation + '，' : '';
                var telephone = data.orderVo.telephone ? data.orderVo.telephone : '';

                $scope.patientInfoShort = name + sex + age + relation + telephone;

                $scope.patientInfo = {
                    diseaseDesc: data.diseaseDesc,
                    cureSituation: data.cureSituation,
                    diseaseImgs: data.imgStringPath || [],
                    diseaseInfo_now: data.diseaseInfo_now,
                    diseaseInfo_old: data.diseaseInfo_old,
                    familydiseaseInfo: data.familydiseaseInfo,
                    menstruationdiseaseInfo: data.menstruationdiseaseInfo
                };
            });
        };


        var patientInfo = {};
        //输入患者资料之前保存状态
        $scope.beforeFocusPatientInfo = function() {
            patientInfo = Object.assign({}, $scope.patientInfo);
        };

        //自动保存填写的患者资料
        $scope.savePatientInfo = function() {
            if (
                patientInfo.diseaseDesc != $scope.patientInfo.diseaseDesc ||
                patientInfo.cureSituation != $scope.patientInfo.cureSituation ||
                patientInfo.diseaseImgs != $scope.patientInfo.diseaseImgs ||
                patientInfo.diseaseInfo_now != $scope.patientInfo.diseaseInfo_now ||
                patientInfo.diseaseInfo_old != $scope.patientInfo.diseaseInfo_old ||
                patientInfo.familydiseaseInfo != $scope.patientInfo.familydiseaseInfo ||
                patientInfo.menstruationdiseaseInfo != $scope.patientInfo.menstruationdiseaseInfo
            ) {
                if ($scope.windowDataListDB.gid) {
                    $http.post(app.api.order.modifyPatientInfo, {
                        access_token: localStorage['guider_access_token'],
                        gid: $scope.windowDataListDB.gid,
                        diseaseDesc: $scope.patientInfo.diseaseDesc || '',
                        cureSituation: $scope.patientInfo.cureSituation || '',
                        imagePaths: $scope.patientInfo.diseaseImgs || [],
                        diseaseInfo_now: $scope.patientInfo.diseaseInfo_now || '',
                        diseaseInfo_old: $scope.patientInfo.diseaseInfo_old || '',
                        familydiseaseInfo: $scope.patientInfo.familydiseaseInfo || '',
                        menstruationdiseaseInfo: $scope.patientInfo.menstruationdiseaseInfo || ''
                    }).
                    success(function(data, status, headers, config) {
                        if (data.resultCode == 1) {
                            $scope.patientInfo.diseaseImgs = data.data.diseaseInfo.diseaseImgs || [];
                            toaster.pop('success', null, '自动保存于' + (new Date()).toLocaleString());
                        } else {
                            toaster.pop('error', null, data.resultMsg);
                        }
                    }).
                    error(function(data, status, headers, config) {
                        toaster.pop('error', null, data.resultMsg);
                    });
                }

            }
        };

        //选择患者上传的图片
        $scope.selectChatImg = function() {
            ChatImgSelModalFactory.openChatImgSelModal($scope.patientInfo.diseaseImgs, $scope.windowTarget.windowId, 'lg', function(selectedItems) {
                $scope.patientInfo.diseaseImgs = selectedItems;
                console.log(selectedItems);
                $scope.savePatientInfo();
            });
        }
    };

    angular.module('app').controller('LightboxCtrl', function($scope, Lightbox) {
        $scope.removeChatImg = function(removeChatImg) {
            Lightbox.closeModal(removeChatImg);
        }
    });

})();
