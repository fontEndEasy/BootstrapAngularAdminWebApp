'use strict';
//调查表列表
app.controller('EditorSurveyCtrl', function($scope, $state, $http, toaster, editableThemes, editableOptions, ChooseDepartmentFactory, $stateParams) {
    editableThemes.bs3.inputClass = 'input-xs';
    editableThemes.bs3.buttonsClass = 'btn-xs';
    editableOptions.theme = 'bs3';

    if ($stateParams.surveyId && $stateParams.version) {
        $http.post(app.yiliao + 'designer/findSurveyByOne', {
            access_token: app.url.access_token,
            surveyId: $stateParams.surveyId,
            version: $stateParams.version
        }).
        then(function(rpn) {
            rpn = rpn.data;
            if (rpn.resultCode === 1) {
                $scope.surveyData = rpn.data;
                $scope.isDiseaseDisable = true;
            } else if (rpn.resultMsg) {
                toaster.pop('error', null, rpn.resultMsg);
            } else {
                toaster.pop('error', null, '接口出错');
            };
        });
    };

    $scope.surveyData = {
        groupId: app.url.groupId(),
        // title: '调查表计划',
        // desc: '介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍',
        // diseaseTypeId: 'd1',
        // diseaseName: '泌尿科',
        // questions: [{
        //     id: 'q1',
        //     type: 1,
        //     name: '选择题',
        //     options: [{
        //         id: 'o1',
        //         title: '不能进食',
        //         isAddRemark: true,
        //     }, {
        //         id: 'o2',
        //         title: '能进食',
        //         isAddRemark: false,
        //     }]
        // }, {
        //     id: 'q2',
        //     type: 2,
        //     name: '填空题'
        // }, {
        //     id: 'q3',
        //     type: 3,
        //     name: '问答题'
        // }]
        questions: []
    };

    // {
    //     'title': '题库标题 ',
    //     'desc': '描述 ',
    //     'diseaseTypeId': '病种ID',
    //     'groupId': '集团ID',
    //     'surveyId': '调查表ID',
    //     'questions': [{
    //         'seq': '排序',
    //         'type': '类型',
    //         'name': '名称',
    //         'options': [{
    //             'seq': '排序',
    //             'name': '选项名称',
    //             'isAddRemark': '是否在选项后增加填空框'
    //         }]
    //     }]
    // }


    // 选择科室
    $scope.chooseDepartment = function() {

        ChooseDepartmentFactory.open(callback);

        function callback(department) {
            $scope.surveyData.diseaseTypeId = department.departmentLable;
            $scope.surveyData.diseaseName = department.departmentLableName;
        }
    };


    // 添加选项
    $scope.addOption = function(qIndex) {
        $scope.surveyData.questions[qIndex].options.push({
            name: '请点击输入选项名称',
            piont: 0
        });
    };
    // 删除选项
    $scope.removeOption = function(qIndex, oIndex) {
        $scope.surveyData.questions[qIndex].options.splice(oIndex, 1);
    };
    // 添加问题
    $scope.addQuestion = function(type) {
        if (type === 1)
            $scope.surveyData.questions.push({
                name: '选择题',
                type: 1,
                options: [{
                    name: '请点击输入选项名称'
                }, {
                    name: '请点击输入选项名称'
                }]
            });

        else
            $scope.surveyData.questions.push({
                name: type === 2 ? '填空题' : '问答题',
                type: type
            });
    };
    // 复制问题
    $scope.copyQyestiong = function(qIndex, item) {

        var name = '问题题目' + qIndex + 1;

        if (item.name) {
            name = item.name;
        };

        var _copyItem_ = {
            name: name,
            type: item.type
        };

        if (item.options) {
            _copyItem_.options = [];
            for (var i = 0; i < item.options.length; i++) {
                _copyItem_.options[i] = {
                    name: item.options[i].name || '请点击输入选项名称',
                    isAddRemark: item.options[i].isAddRemark || null
                };
            };
        };
        $scope.surveyData.questions.splice(qIndex + 1, 0, _copyItem_);

    };
    // 删除问题
    $scope.removeQuestion = function(qIndex) {
        $scope.surveyData.questions.splice(qIndex, 1);
    };
    // 向上移动问题
    $scope.putUpQuestion = function(qIndex) {
        var _copyItem_ = $scope.surveyData.questions[qIndex - 1];
        $scope.surveyData.questions[qIndex - 1] = $scope.surveyData.questions[qIndex];
        $scope.surveyData.questions[qIndex] = _copyItem_;
    };
    // 向下移动问题
    $scope.putDownQuestion = function(qIndex) {
        var _copyItem_ = $scope.surveyData.questions[qIndex + 1];
        $scope.surveyData.questions[qIndex + 1] = $scope.surveyData.questions[qIndex];
        $scope.surveyData.questions[qIndex] = _copyItem_;
    };
    // 保存编辑
    $scope.saveEdit = function() {
        var _checkData_ = $scope.surveyData;

        // 没通过校验
        if (!checkData(_checkData_)) return;

        _checkData_ = JSON.stringify(_checkData_);

        $http.post(app.yiliao + 'designer/saveSurvey', {
            access_token: app.url.access_token,
            jsonData: _checkData_
        }).
        then(function(rpn) {
            rpn = rpn.data;
            if (rpn.resultCode === 1) {
                toaster.pop('success', null, '保存成功');
                $state.go('app.surveyLibrary');
            } else if (rpn.resultMsg) {
                toaster.pop('error', null, rpn.resultMsg);
            } else {
                toaster.pop('error', null, '接口出错');
            };
        });

    };
    // 保存校验
    function checkData(_checkData_) {

        if (!_checkData_.diseaseTypeId) {
            toaster.pop('error', null, '请选择科室');
            return false;
        }

        if (!_checkData_.title) {
            toaster.pop('error', null, '请填写调查表标题');
            return false;
        }

        if (!_checkData_.desc) {
            toaster.pop('error', null, '请填写调查表简介');
            return false;
        }

        if (!_checkData_.questions || _checkData_.questions.length < 1) {
            toaster.pop('error', null, '请添加题目');
            return false;
        }

        for (var i = 0; i < _checkData_.questions.length; i++) {
            if (!_checkData_.questions[i].name) {
                toaster.pop('error', null, '请填写Q' + (i + 1) + '题目');
                return false;
            };
        };

        if (!_checkData_.groupId) {
            toaster.pop('error', null, '集团ID不能为空');
            return false;
        }

        return true;

    };
});
