'use strict';

app.controller('Patient', function ($rootScope, $scope, $state, $http, $compile, utils, $stateParams) {
    var data = null,
        cnt_list = $('#cnt_list'),
        items = cnt_list.find('.list-group-item'),
        dt = null,
        groupId = utils.localData('curGroupId'),
        isDiseaseType = false;

    $scope.loading = true;

    if($stateParams.type === 'disease'){
        isDiseaseType = true;
    }
    if(isDiseaseType){
        $rootScope.curType = '4';
        $rootScope.typeName = '病种';
    }

    if(isDiseaseType){
        var dataUrl = app.url.yiliao.getDiseaseTree,
            async = false,
            extra = false,
            root = {
                selectable: false,
                name: '病种结构'
            },
            datakey = {
                id: 'id',
                name: 'name',
                sub: 'children'
            },
            keys = {
                name: 'name',
                id: 'id',
                pid: 'department',
                description: 'description'
            },
            icons = {
                arrow: 'fa fa-caret-right/fa fa-caret-down',
                check: 'fa fa-check/fa fa-square',
                root: 'fa fa-cubes cfblue',
                branch: 'fa fa-medkit msblue',
                leaf: 'fa fa-stethoscope dcolor',
                head: 'headPicFileName'
            };
    }else{
        isDiseaseType = false;
        var dataUrl = app.url.yiliao.getAllData,
            async = {
                url: app.url.yiliao.getDepartmentDoctor,
                dataKey: {
                    departmentId: 'id'
                },
                data: {
                    access_token: app.url.access_token,
                    groupId: groupId,
                    status: 'C',
                    type: 1
                },
                dataName: '',
                target: {
                    data: '',
                    dataKey: {
                        id: 'id',
                        name: 'name'
                    }
                }
            },
            extra = [{
                name: '未分配',
                id: 'idx_0',
                parentId: 0,
                subList: [],
                icon: 'fa fa-bookmark'
            }];
            root = {
                selectable: true,
                name: utils.localData('curGroupName'),
                id: 0
            },
            datakey = {
                id: 'id',
                name: 'name',
                sub: 'subList'
            },
            keys = {
                name: 'name',
                id: 'id',
                pid: 'parentId',
                description: 'description'
            },
            icons = {
                arrow: 'fa fa-caret-right/fa fa-caret-down',
                check: 'fa fa-check/fa fa-square',
                root: 'fa fa-hospital-o cfblue',
                branch: 'fa fa-h-square cfblue',
                leaf: 'fa fa-h-square cfblue',
                head: 'headPicFileName'
            };
    }

    // 创建通讯录列表数据
    var contacts = new Tree('cnt_list', {
        hasCheck: false,
        allCheck: false,
        multiple: false,
        allHaveArr: false,
        self: true,
        search: false,
        arrType: [1,1,1,1,1,1,1],
        //unionSelect: true,
        //selectView: true,
        data: {
            url: dataUrl,
            param: {
                access_token: app.url.access_token,
                groupId: groupId
            }
        },
        async: false,
        extra: extra,
        icons: icons,
        root: root,
        datakey: datakey,
        info: {
            name: 'name',
            id: 'id',
            pid: 'parentId',
            dpt: 'departments',
            description: 'description',
            param: 'param',
            icon: 'icon',
            url: 'url',
            isExtra: 'isExtra',
            target: 'target'
        },
        events: {
            click: forward
        },
        callback: function () {
            if(isDiseaseType){
                contacts.getTree().find('dt').eq(1).trigger('click');
            }else{
                contacts.getTree().find('dt').eq(0).trigger('click');
            }
        }
    });

    function forward(info) {
        $scope.curIndex = null;
        if(info.id == '0' && info.pid == 'x' && !isDiseaseType){
            $rootScope.curType = '1';
            $rootScope.typeName = '集团';
        }else if(info.pid == 'x' && !isDiseaseType){
            $rootScope.curType = '3';
            $rootScope.typeName = '医生';
        }else if(!isDiseaseType){
            $rootScope.curType = '2';
            $rootScope.typeName = '组织';
        }else if(info.pid == 'x'){
            $rootScope.curType = '4';
            $rootScope.typeName = '病种';
        }else{
            $rootScope.curType = '5';
            $rootScope.typeName = '病种';
        }
        $rootScope.curId = info.id;
        utils.localData('curId', $scope.curId);
        utils.localData('curType', $scope.curType);
        $state.go('app.patient.patient_list', {id: info.id}, {reload: false});
    }

});
