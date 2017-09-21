'use strict';

app.controller('ContactsAddDepartment', function ($rootScope, $scope,$stateParams, $state, $timeout, $http, utils, modal) {
    var container = $('#dialog_container'),
        cnt_list = $('#cnt_list_apportion'),
        dt = null,
        html = $('html'),
        list_wrapper = $('#cnt_list_department'),
        groupId = utils.localData('store_id'),
        parentId = null;
        // "56d10990b472651e1cfdc819" || 

    $scope.formData = {};
    html.css('overflow', 'hidden');

    // 初始化通讯录列表
    var contacts = new Tree('cnt_list_apportion', {
        hasCheck: true,
        allCheck: false,
        multiple: false,
        self: true,
        arrType: [1,1,0],
        data: {
            url: app.url.getEnterOrg,
            param: {
                access_token: utils.localData('yy_access_token'),
                enterpriseId: groupId
            }
        },
        icons: {
            arrow: 'fa fa-caret-right/fa fa-caret-down',
            check: 'fa fa-check',
            root: 'fa fa-hospital-o dcolor',
            branch: 'fa fa-h-square dcolor',
            leaf: 'fa fa-h-square dcolor'
        },
        datakey: {
            id: 'id',
            name: 'name',
            sub: 'subList'
        },
        info: {
            name: 'name',
            id: 'id',
            pid: 'parentId',
            description: 'description'
        },
        events: {
            click: check,
            filters:function(data){
                if(data && data.length > 0){
                    $.each(data[0].subList,function(index){
                        if(data[0].subList[index].name == "未分配"){
                            data[0].subList.splice(index,1);
                            return false;
                        }
                    });
                }
                return data;
            }
        },
        callback: function () {
            
        }
    });

    function check(info) {
        var target = $(contacts.getTargets());
        if (target.length === 0) {
            parentId = null;
            list_wrapper.html('');
            return;
        }
        var _info = target;
        var span = $('<span class="label-btn btn-info"></span>');
        var i = $('<i class="fa fa-times"></i>');
        parentId = info.id;
        list_wrapper.html('');
        list_wrapper.html(span.html(info.name).append(i));
        i.click(function () {
            contacts.setCheck(info.id);
            list_wrapper.html('');
            parentId = null;
        });
    }

    // 执行操作
    $scope.save = function () {
        if(!$scope.formData.name && $scope.formData.name != '0'){
            modal.toast.warn("组织名称不可为空！");
            return;
        }
        $http({
            url: app.url.addEnterOrg,
            method: 'post',
            data: {
                access_token: utils.localData('yy_access_token'),
                name:$scope.formData.name,
                desc: $scope.formData.description,
                parentId: parentId,
                enterpriseId: groupId
            }
        }).then(function (resp) {
            if (resp.data.resultCode === 1) {
                var txt=  "创建成功！";
                window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.success,{onOk:function(){
                    $state.go('app.drugfactory', {}, {reload: true});
                    html.css('overflow', 'auto');
                }});
                
            } else {
                window.wxc.xcConfirm(resp.data.resultMsg, window.wxc.xcConfirm.typeEnum.error);
            }
        }, function (x) {
            console.error(x.statusText);
        });
    };

    // 模态框退出
    $scope.cancel = function () {
        container.prev().remove();
        container.remove();
        window.history.back();
        html.css('overflow', 'auto');
    };


});