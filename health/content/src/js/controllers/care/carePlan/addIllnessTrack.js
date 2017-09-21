(function() {
    angular.module('app')
        .factory('AddIllnessTrackFtory', AddIllnessTrackFtory)

    // 手动注入依赖
    AddIllnessTrackFtory.$inject = ['$http', '$modal'];

    function AddIllnessTrackFtory($http, $modal) {
        return {
            selectBox: selectBox,
            illnessTrackLibrary: illnessTrackLibrary,
            createIllnessTrack: createIllnessTrack,
            triggerMsg: triggerMsg,
            repeatAsk: repeatAsk,
            editTips: editTips
        };
        // 选择添加方式
        function selectBox(illnessTrackData, callBack) {
            if (!illnessTrackData) illnessTrackData = {};

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: function() {
                    var isChack = window.location.href.indexOf('/check/');
                    if (isChack != -1)
                        return '../src/tpl/care/carePlan/addIllnessTrack/selectBox.html';
                    else
                        return 'src/tpl/care/carePlan/addIllnessTrack/selectBox.html';
                }(),
                controller: 'AddIllnessTrackSelectCtrl',
                size: 'md',
                resolve: {
                    illnessTrackData: function() {
                        return illnessTrackData;
                    },
                    callBack: function() {
                        return callBack || {};
                    }
                }
            });
        };
        // 创建病情跟踪
        function createIllnessTrack(illnessTrackData, callBack) {
            if (!illnessTrackData) illnessTrackData = {};

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: function() {
                    var isChack = window.location.href.indexOf('/check/');
                    if (isChack != -1)
                        return '../src/tpl/care/carePlan/addIllnessTrack/createIllnessTrack.html';
                    else
                        return 'src/tpl/care/carePlan/addIllnessTrack/createIllnessTrack.html';
                }(),
                controller: 'CreateIllnessTrackCtrl',
                windowClass: 'docModal doc',
                resolve: {
                    illnessTrackData: function() {
                        return illnessTrackData;
                    }
                }
            });

            modalInstance.result.then(function(illnessTrackData) {
                if (callBack)
                    callBack(illnessTrackData);
            });
        };
        // 打开病情跟踪库
        function illnessTrackLibrary(illnessTrackData, callBack) {

            if (!illnessTrackData) illnessTrackData = {};

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: function() {
                    var isChack = window.location.href.indexOf('/check/');
                    if (isChack != -1)
                        return '../src/tpl/care/carePlan/addIllnessTrack/illnessTrackLibary.html';
                    else
                        return 'src/tpl/care/carePlan/addIllnessTrack/illnessTrackLibary.html';
                }(),
                controller: 'AddIllnessTrackLibraryCtrl',
                size: 'lg',
                resolve: {
                    illnessTrackData: function() {
                        return illnessTrackData;
                    }
                }
            });
            modalInstance.result.then(function(illnessTrackData) {
                if (callBack)
                    callBack(illnessTrackData);
            });
        };
        // 触发消息
        function triggerMsg(triggerMsgData, callBack) {
            if (!triggerMsgData) triggerMsgData = {};

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: function() {
                    var isChack = window.location.href.indexOf('/check/');
                    if (isChack != -1)
                        return '../src/tpl/care/carePlan/addIllnessTrack/addTriggerMsg.html';
                    else
                        return 'src/tpl/care/carePlan/addIllnessTrack/addTriggerMsg.html';
                }(),
                controller: 'AddTriggerMsgCtrl',
                size: 'lg',
                resolve: {
                    triggerMsgData: function() {
                        return triggerMsgData;
                    }
                }
            });
            modalInstance.result.then(function(triggerMsgData) {
                if (callBack)
                    callBack(triggerMsgData);
            });
        };
        // 重复提问
        function repeatAsk(repeatAskData, callBack) {
            if (!repeatAskData) repeatAskData = {};

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: function() {
                    var isChack = window.location.href.indexOf('/check/');
                    if (isChack != -1)
                        return '../src/tpl/care/carePlan/addIllnessTrack/repeatAsk.html';
                    else
                        return 'src/tpl/care/carePlan/addIllnessTrack/repeatAsk.html';
                }(),
                controller: 'RepeatAskCtrl',
                size: 'lg',
                resolve: {
                    repeatAskData: function() {
                        return repeatAskData;
                    }
                }
            });
            modalInstance.result.then(function(repeatAskData) {
                if (callBack)
                    callBack(repeatAskData);
            });
        };
        // 小帖士
        function editTips(tipsData, callBack) {
            if (!tipsData) tipsData = {};

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: function() {
                    var isChack = window.location.href.indexOf('/check/');
                    if (isChack != -1)
                        return '../src/tpl/care/carePlan/addIllnessTrack/editTips.html';
                    else
                        return 'src/tpl/care/carePlan/addIllnessTrack/editTips.html';
                }(),
                controller: 'EditTipsCtrl',
                size: 'md',
                resolve: {
                    tipsData: function() {
                        return tipsData;
                    }
                }
            });
            modalInstance.result.then(function(tipsData) {
                if (callBack)
                    callBack(tipsData);
            });
        };
    };

    angular.module('app')
        .controller('AddIllnessTrackSelectCtrl', AddIllnessTrackSelectCtrl)

    function AddIllnessTrackSelectCtrl($scope, $http, $modal, $modalInstance, toaster, AddIllnessTrackFtory, illnessTrackData, callBack) {

        // 创建病情跟踪
        $scope.create = function() {

            AddIllnessTrackFtory.createIllnessTrack(illnessTrackData, _callBack);

            function _callBack(illnessTrackData) {
                callBack();
            };

            $modalInstance.dismiss('cancel');

        };

        // 创建病情跟踪
        $scope.openLibary = function() {

            AddIllnessTrackFtory.illnessTrackLibrary(illnessTrackData, _callBack);

            function _callBack(illnessTrackData) {
                callBack();
            };

            $modalInstance.dismiss('cancel');

        };
    };

    angular.module('app')
        .controller('CreateIllnessTrackCtrl', CreateIllnessTrackCtrl)

    function CreateIllnessTrackCtrl($scope, $http, $modal, $modalInstance, toaster, illnessTrackData, editableThemes, editableOptions) {

        editableThemes.bs3.inputClass = 'input-xs';
        editableThemes.bs3.buttonsClass = 'btn-xs';
        editableOptions.theme = 'bs3';


        $scope.illnessTrackData = illnessTrackData;

        if (illnessTrackData.question)
            $scope.illnessTrack = illnessTrackData.question;
        else
            $scope.illnessTrack = {
                // 'id': '', //修改时传入
                'name': '题目名称',
                'options': [{
                    'seq': '1', //序号
                    'name': '选项名称',
                    'level': '1', //级别(1:正常、2:异常、3:危险)
                    'appendQuestions': []
                }, {
                    'seq': '2', //序号
                    'name': '选项名称',
                    'level': '1', //级别(1:正常、2:异常、3:危险)
                    'appendQuestions': []
                }]
            };

        // 添加选项
        $scope.addOption = function() {
            $scope.illnessTrack.options.push({
                'seq': $scope.illnessTrack.options[$scope.illnessTrack.options.length - 1].seq + 1,
                'name': '选项名称',
                'level': '1',
                'appendQuestions': []
            });
        };

        // 删除元素
        $scope.removeItem = function(item, arry) {
            var index = arry.indexOf(item);
            arry.splice(index, 1);
        };

        // 添加追加问题
        $scope.addAppendQuestion = function(option) {
            if (!option.appendQuestions)
                option.appendQuestions = [];
            option.appendQuestions.push({
                // 'seq': function() {
                //     if (option.appendQuestions.length > 0)
                //         return option.appendQuestions[option.appendQuestions.length - 1].seq + 1
                //     return 1;
                // }(),
                'name': '追加题目名称',
                'options': [{
                    // 'seq': '1',
                    'name': '选项名称'
                }, {
                    // 'seq': '2',
                    'name': '选项名称'
                }]
            });
        };

        // 添加追加问题的选项
        $scope.addAppendOption = function(question) {
            question.options.push({
                // 'seq': '2',
                'name': '选项名称'
            });
        };

        // 复制追加问题
        $scope.copyAppendQuestion = function(question, questions) {
            var index = questions.indexOf(question);
            questions.splice(index + 1, 0, {
                // 'seq': '',
                'name': question.name,
                'options': function() {
                    return angular.copy(question.options);
                }()
            })
        };

        // 选择选项
        $scope.optionChange = function(option, arry) {
            var index = arry.indexOf(option.levelName);
            option.level = index + 1;
        };

        // 互换item
        $scope.exchangeItem = function(moveItem, replaceItem, arry) {
            var mIndex = arry.indexOf(moveItem),
                rIndex = arry.indexOf(replaceItem)

            arry.splice(rIndex, 1, moveItem);
            arry.splice(mIndex, 1, replaceItem);

        };

        // 取消
        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };

        // 保存
        $scope.ok = function() {
            var data = $scope.illnessTrack;
            if (!data)
                return toaster.pop('error', null, '数据有问题');
            if (!data.name)
                return toaster.pop('error', null, '请输入题目名称');
            if (!data.options || data.options.length < 2)
                return toaster.pop('error', null, '可选项不能少于两项');
            for (var i = 0; i < data.options.length; i++) {
                if (!data.options[i].name)
                    return toaster.pop('error', null, '选项名称不能为空');
                var questions = data.options[i].appendQuestions;
                if (questions && questions.length > 0)
                    for (var j = 0; j < questions.length; j++) {
                        if (!questions[j].name)
                            return toaster.pop('error', null, '请输入题目名称');
                        if (!questions[j].options || questions[j].options.length < 2)
                            return toaster.pop('error', null, '可选项不能少于两项');
                        for (var k = 0; k < questions[j].options.length; k++) {
                            if (!questions[j].options[k].name)
                                return toaster.pop('error', null, '选项名称不能为空');
                        }
                    }
            }
            // 创建
            if (!illnessTrackData.question)
                submitReplyData();
            else
                updateIllnessTrackQuestion();
        };

        // 收藏并保存
        $scope.collect = function() {

            var json = {
                name: $scope.illnessTrack.name,
                options: $scope.illnessTrack.options
            }

            var param = {
                access_token: app.url.access_token,
                groupId: app.url.groupId(),
                diseaseType: illnessTrackData.diseaseTypeId,

                jsonData: JSON.stringify(json)
            }
            $http.post(app.urlRoot + 'designer/storeQuestion', param)
                .then(function(rpn) {
                    rpn = rpn.data;
                    if (rpn && rpn.resultCode == 1) {
                        toaster.pop('success', null, '收藏成功');

                        if (!illnessTrackData.question)
                            submitReplyData();
                        else
                            updateIllnessTrackQuestion();

                    } else if (rpn && rpn.resultMsg) {
                        toaster.pop('error', null, rpn.resultMsg);
                    } else {
                        toaster.pop('error', null, '收藏错误');
                        console.error(rpn);
                    };
                });

        };

        // 修改病情跟踪
        function updateIllnessTrackQuestion() {

            var json = {
                'name': $scope.illnessTrack.name,
                'repeatAsk': $scope.illnessTrack.repeatAsk,
                // 'sourceId': '有啥传啥，其他字段一样',
                'options': $scope.illnessTrack.options
            }

            var param = {
                access_token: app.url.access_token,
                questionId: $scope.illnessTrack.id,
                sendTime: $scope.illnessTrackData.sendTime,
                jsonData: JSON.stringify(json)
            }

            $http.post(app.urlRoot + 'designer/updateIllnessTrackQuestion', param)
                .then(function(rpn) {
                    rpn = rpn.data;
                    if (rpn && rpn.resultCode == 1) {
                        toaster.pop('success', null, '修改成功');
                        $modalInstance.close(rpn.data);
                    } else if (rpn && rpn.resultMsg) {
                        toaster.pop('error', null, rpn.resultMsg);
                    } else {
                        toaster.pop('error', null, '获取计划数据出错');
                        console.error(rpn);
                    };
                });
        };

        // 创建病情跟踪
        function submitReplyData() {
            var param = {
                access_token: app.url.access_token,
                sendTime: $scope.illnessTrackData.sendTime,
                carePlanId: $scope.illnessTrackData.carePlanId,

                schedulePlanId: $scope.illnessTrackData.schedulePlanId,
                dateSeq: $scope.illnessTrackData.dateSeq,
                jsonData: JSON.stringify($scope.illnessTrack)
            }

            if ($scope.illnessTrackData.id)
                param.id = $scope.illnessTrackData.id;

            $http.post(app.urlRoot + 'designer/saveIllnessTrack', param)
                .then(function(rpn) {
                    rpn = rpn.data;
                    if (rpn && rpn.resultCode == 1) {
                        toaster.pop('success', null, '添加成功');
                        $modalInstance.close(rpn.data);
                    } else if (rpn && rpn.resultMsg) {
                        toaster.pop('error', null, rpn.resultMsg);
                    } else {
                        toaster.pop('error', null, '获取计划数据出错');
                        console.error(rpn);
                    };
                });
        };
    };

    angular.module('app')
        .controller('AddIllnessTrackLibraryCtrl', AddIllnessTrackLibraryCtrl)

    function AddIllnessTrackLibraryCtrl($scope, $http, $modal, $modalInstance, toaster, illnessTrackData) {


        $scope.illnessTrackData = illnessTrackData

        //生成病种树
        function setTree() {
            var contacts = new Tree('lifeQualityLibraryTree', {
                hasCheck: false,
                allCheck: false,
                multiple: false,
                allHaveArr: false,
                self: true,
                search: false,
                arrType: [1, 0],
                data: {
                    url: app.yiliao + 'designer/getDiseaseTypeTree4Q',
                    param: {
                        access_token: app.url.access_token,
                        carePlanId: illnessTrackData.carePlanId
                    }
                },
                datakey: {
                    id: 'id',
                    name: 'name',
                    sub: 'children'
                },
                info: {
                    name: 'name',
                    id: 'id',
                    pid: 'department',
                    leaf: 'leaf'
                },
                root: {
                    selectable: true,
                    name: '全部',
                    id: null
                },
                events: {
                    click: treeClick
                },
                callback: function() {
                    var dts = contacts.tree.find('dt');
                    // 默认获取root 全部 的数据
                    if (dts && dts.eq(0) && dts.eq(0).data() && dts.eq(0).data().info)
                        treeClick(dts.eq(0).data().info);
                }
            });
        };

        setTimeout(setTree, 0);

        function treeClick(info) {
            $scope.diseaseName = info.name;
            setTable(info.id);
        };

        $scope.diseaseTypeId = null;
        $scope.pageIndex = 1;
        $scope.pageSize = 5;

        function setTable(diseaseTypeId, pageIndex, pageSize) {

            $http.post(app.yiliao + 'designer/getQuestionList', {
                access_token: app.url.access_token,
                carePlanId: illnessTrackData.carePlanId,
                diseaseTypeId: diseaseTypeId || $scope.diseaseTypeId || 0
            }).
            then(function(rpn) {
                rpn = rpn.data;
                if (rpn.resultCode === 1) {

                    $scope.countData = rpn.data;

                    var start = $scope.pageSize * ($scope.pageIndex - 1),
                        end = $scope.pageIndex * $scope.pageSize;
                    $scope.illnessTrack = $scope.countData.slice(start, end);
                    $scope.page_count = rpn.data.length;

                } else if (rpn.resultMsg) {
                    toaster.pop('error', null, rpn.resultMsg);
                } else {
                    toaster.pop('error', null, '接口出错');
                };
            });
        };

        $scope.setTable = setTable;
        $scope.pageChanged = function() {
            var start = $scope.pageSize * ($scope.pageIndex - 1),
                end = $scope.pageIndex * $scope.pageSize;
            $scope.illnessTrack = $scope.countData.slice(start, end);
        };

        $scope.selectArry = [];

        // 选择
        $scope.selectItem = function(item) {

            var index = $scope.selectArry.indexOf(item);
            if (index === -1)
                $scope.selectArry.push(item);
            else
                $scope.selectArry.splice(index, 1);

        };

        // 是否已选择
        $scope.isSelect = function(item) {

            var arry = $scope.selectArry;
            for (var i = 0; i < arry.length; i++) {
                if (arry[i].qId === item.qId)
                    return true;
            }
            return false;
        };

        // 取消
        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };

        // 确定
        $scope.ok = function() {

            if (!$scope.selectArry || $scope.selectArry.length < 1)
                return toaster.pop('error', null, '请选择问题');

            var param = {
                access_token: app.url.access_token,
                sendTime: $scope.illnessTrackData.sendTime,
                carePlanId: $scope.illnessTrackData.carePlanId,

                schedulePlanId: $scope.illnessTrackData.schedulePlanId,
                dateSeq: $scope.illnessTrackData.dateSeq,
                jsonData: JSON.stringify($scope.selectArry)
            }

            $http.post(app.urlRoot + 'designer/batchSaveQuestion', param)
                .then(function(rpn) {
                    rpn = rpn.data;
                    if (rpn && rpn.resultCode == 1) {
                        toaster.pop('success', null, '添加成功');
                        $modalInstance.close(rpn.data);
                    } else if (rpn && rpn.resultMsg) {
                        toaster.pop('error', null, rpn.resultMsg);
                    } else {
                        toaster.pop('error', null, '添加失败');
                        console.error(rpn);
                    };
                });

        };

    };

    angular.module('app')
        .controller('AddTriggerMsgCtrl', AddTriggerMsgCtrl)

    function AddTriggerMsgCtrl($scope, $http, $modal, $modalInstance, toaster, triggerMsgData) {

        $scope.triggerMsgData = {
            careItemId: triggerMsgData.careItemId
        };
        if (!triggerMsgData.triggerMsgs) {
            $scope.triggerMsgData.triggerMsgs = []
            if ($scope.triggerMsgData.triggerMsgs.length < 1) {
                $scope.triggerMsgData.triggerMsgs.push('患者恢复的很好，请放心！')
                $scope.triggerMsgData.triggerMsgs.push('您回复程度很好，请放心！')
                $scope.triggerMsgData.triggerMsgs.push('患者出现异常，请及时处理！')
                $scope.triggerMsgData.triggerMsgs.push('您的情况出现异常，建议咨询医生。')
                $scope.triggerMsgData.triggerMsgs.push('患者出现危险项，请马上联系患者处理。')
                $scope.triggerMsgData.triggerMsgs.push('您的情况出现异常，建议咨询医生。')
            }
        } else {
            $scope.triggerMsgData.triggerMsgs = []
            $scope.triggerMsgData.triggerMsgs.push(triggerMsgData.triggerMsgs.remindDoctor1)
            $scope.triggerMsgData.triggerMsgs.push(triggerMsgData.triggerMsgs.remindPatient1)
            $scope.triggerMsgData.triggerMsgs.push(triggerMsgData.triggerMsgs.remindDoctor2)
            $scope.triggerMsgData.triggerMsgs.push(triggerMsgData.triggerMsgs.remindPatient2)
            $scope.triggerMsgData.triggerMsgs.push(triggerMsgData.triggerMsgs.remindDoctor3)
            $scope.triggerMsgData.triggerMsgs.push(triggerMsgData.triggerMsgs.remindPatient3)
        }

        // 取消
        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };

        // 保存
        $scope.ok = function() {

            for (var i = 0; i < $scope.triggerMsgData.triggerMsgs.length; i++) {
                if (!$scope.triggerMsgData.triggerMsgs[i])
                    return toaster.pop('error', null, '请填完每个提醒');
            }

            $http.post(app.urlRoot + 'designer/saveTriggerMsg', {
                access_token: app.url.access_token,
                careItemId: $scope.triggerMsgData.careItemId,
                triggerMsgs: $scope.triggerMsgData.triggerMsgs
            }).then(function(rpn) {
                rpn = rpn.data;
                if (rpn && rpn.resultCode == 1) {
                    toaster.pop('success', null, '保存成功');
                    $modalInstance.close(rpn.data);
                } else if (rpn && rpn.resultMsg) {
                    toaster.pop('error', null, rpn.resultMsg);
                } else {
                    toaster.pop('error', null, '保存出错');
                    console.error(rpn);
                };
            });


        };
    };

    angular.module('app')
        .controller('RepeatAskCtrl', RepeatAskCtrl)

    function RepeatAskCtrl($scope, $http, $modal, $modalInstance, toaster, repeatAskData) {
        $scope.repeatAskData = repeatAskData;
        $scope.repeatAskOption = {
            'repeats': [{
                'repeatSeq': 1,
                'dateSeq': 1,
                'sendTime': function() {
                    var splitArry = repeatAskData.sendTime.split(':');
                    if (splitArry[1] === '00') {
                        result = splitArry[0] + ':30';
                        return result;
                    } else {
                        result = splitArry[0] - 0 + 1 + ':00';
                        return result;
                    }
                    return '09:00'
                }()
            }]

        };

        $scope.isEnd = true;

        $scope.endCondition = {
            'continueDays': '1',
            'level': '1' //级别(1:正常、2:异常、3:危险)
        };

        // 添加重复时间
        $scope.addReaptOption = function(filtersJson) {
            var filters = JSON.parse(filtersJson);

            $scope.repeatAskOption.repeats.push({
                'repeatSeq': 1,
                'dateSeq': function() {
                    if ($scope.repeatAskOption.repeats && $scope.repeatAskOption.repeats.length > 0) {
                        var dateSeq = $scope.repeatAskOption.repeats[$scope.repeatAskOption.repeats.length - 1].dateSeq;
                        return dateSeq;
                    } else {
                        return 1
                    }
                }(),
                'sendTime': function() {
                    if ($scope.repeatAskOption.repeats && $scope.repeatAskOption.repeats.length > 0) {
                        var prevTime = $scope.repeatAskOption.repeats[$scope.repeatAskOption.repeats.length - 1].sendTime,
                            splitArry = prevTime.split(':'),
                            result = null;

                        function nextTime(_splitArry) {
                            if (_splitArry[1] === '00') {
                                _splitArry = [_splitArry[0], '30'];
                            } else {
                                _splitArry = [_splitArry[0] - 0 + 1 + '', '00'];
                            }
                            return _splitArry;
                        };

                        splitArry = nextTime(splitArry);


                        for (i = 0; i < filters.length; i++) {
                            if (splitArry[0] + ':' + splitArry[1] == filters[i]) {
                                splitArry = nextTime(filters[i].split(':'));
                            }
                        }

                        result = splitArry[0] + ':' + splitArry[1];

                    } else {
                        return '09:00'
                    }
                }()
            });
        };

        $scope.timeFilterArry = function(exception, dateSeq) {
            var _repeats = angular.copy($scope.repeatAskOption.repeats),
                _resultArry = [];

            // 过滤第一天的发送时间
            if (dateSeq == 1)
                _resultArry = [repeatAskData.sendTime];

            for (var i = 0; i < _repeats.length; i++) {
                if (exception != _repeats[i].sendTime && dateSeq == _repeats[i].dateSeq)
                    _resultArry.push(_repeats[i].sendTime)
            }
            return JSON.stringify(_resultArry);
        };

        // 取消
        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };

        // 保存
        $scope.ok = function() {

            var json = {
                repeats: $scope.repeatAskOption.repeats
            };

            if ($scope.isEnd)
                json.endCondition = $scope.endCondition;

            $http.post(app.urlRoot + 'designer/saveRepeatAsk', {
                access_token: app.url.access_token,
                questionId: repeatAskData.question.id,
                jsonData: JSON.stringify(json)
            }).then(function(rpn) {
                rpn = rpn.data;
                if (rpn && rpn.resultCode == 1) {
                    toaster.pop('success', null, '保存成功');
                    $modalInstance.close(rpn.data);
                } else if (rpn && rpn.resultMsg) {
                    toaster.pop('error', null, rpn.resultMsg);
                } else {
                    toaster.pop('error', null, '保存出错');
                    console.error(rpn);
                };
            });
        };
    };

    angular.module('app')
        .controller('EditTipsCtrl', EditTipsCtrl)

    function EditTipsCtrl($scope, $http, $modal, $modalInstance, toaster, tipsData) {
        console.log(tipsData);

        $scope.options = [];
        $scope.tipsData = [];

        if (tipsData.question.id) {
            for (var i = 0; i < tipsData.question.options.length; i++) {
                $scope.options.push({
                    'seq': tipsData.question.options[i].seq,
                    'name': tipsData.question.options[i].name
                });
                if (tipsData.question.options[i].tips) {
                    $scope.tipsData.push({
                        'seq': tipsData.question.options[i].seq,
                        'tips': tipsData.question.options[i].tips
                    });
                }

            }
        };

        if ($scope.tipsData.length < 1) {
            $scope.tipsData.push({
                'seq': tipsData.question.options[0].seq,
                'tips': ''
            });
        };

        // 过滤已选择的选项
        $scope.filterOption = function(seq) {
            var arry = [];

            for (var k = 0; k < $scope.options.length; k++) {
                arry.push($scope.options[k])
            };

            result = arry.filter(function(item, index) {

                if (item.seq == seq)
                    return true;
                for (var j = 0; j < $scope.tipsData.length; j++) {
                    if (item.seq === $scope.tipsData[j].seq) {
                        return false;
                    }
                }
                return true;
            });

            return result;
        };

        // 添加提示
        $scope.addTip = function() {
            $scope.tipsData.push({
                'seq': null,
                'tips': ''
            });
        };

        // 移除提示
        $scope.removeTip = function(index) {
            $scope.tipsData.splice(index, 1)
        };

        // 取消
        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };

        // 保存
        $scope.ok = function() {

            for (var i = 0; i < $scope.tipsData.length; i++) {
                if (!$scope.tipsData[i].tips)
                    return toaster.pop('error', null, '请填写好每个选项的提示');
            };

            var json = {
                'options': $scope.tipsData
            }

            $http.post(app.urlRoot + 'designer/saveTips', {
                access_token: app.url.access_token,
                questionId: tipsData.question.id,
                jsonData: JSON.stringify(json)

            }).then(function(rpn) {
                rpn = rpn.data;
                if (rpn && rpn.resultCode == 1) {
                    toaster.pop('success', null, '保存成功');
                    $modalInstance.close(rpn.data);
                } else if (rpn && rpn.resultMsg) {
                    toaster.pop('error', null, rpn.resultMsg);
                } else {
                    toaster.pop('error', null, '保存出错');
                    console.error(rpn);
                };
            });
        };
    };

})();
