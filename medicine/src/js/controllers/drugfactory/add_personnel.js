'use strict';

app.controller('ContactsAddPersonnel', function($rootScope, $scope, $stateParams, $state, $timeout, $http, utils, modal) {
    var container = $('#dialog_container'),
        cnt_list = $('#cnt_list_apportion'),
        dt = null,
        html = $('html'),
        list_wrapper = $('#cnt_list_department'),
        groupId = utils.localData('store_id'),
        parentId = $scope.curDepartmentId;
    var id = $stateParams.id;
    // "56d10990b472651e1cfdc819" || 

    $scope.formData = {};
    html.css('overflow', 'hidden');
    if (typeof id != "undefined") {
        $scope.formData.userId = $scope.targetUserInfo.userId;
        $scope.formData.name = $scope.targetUserInfo.name;
        $scope.formData.telephone = $scope.targetUserInfo.telephone;
        $scope.formData.position = $scope.targetUserInfo.position;
        $scope.formData.roleList = $scope.targetUserInfo.role;
        $scope.formData.remarks = $scope.targetUserInfo.remarks;
        console.log($scope.targetUserInfo);
    }


    // 初始化通讯录列表
    var contacts = new Tree('cnt_list_apportion', {
        hasCheck: true,
        allCheck: false,
        multiple: false,
        self: true,
        arrType: [1, 1, 0],
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
            description: 'desc'
        },
        events: {
            click: check,
            filters: function(data) {
                if (data && data.length > 0) {
                    $.each(data[0].subList, function(index) {
                        if (data[0].subList[index].name == "未分配") {
                            data[0].subList.splice(index, 1);
                            return false;
                        }
                    });
                }
                return data;
            }
        },
        callback: function() {
            var dts = contacts.tree.find('dt');
            var curDt = null;
            for (var i = 0; i < dts.length; i++) {
                if (dts.eq(i).data('info').id == $scope.curDepartmentId) {
                    curDt = dts.eq(i);
                    break;
                }
            }
            if (curDt) {
                curDt.trigger('click');
            }
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
        i.click(function() {
            contacts.setCheck(info.id);
            list_wrapper.html('');
            parentId = null;
        });
    }

    // 执行操作
    $scope.save = function() {
        if (!$scope.formData.name && $scope.formData.name != '0') {
            modal.toast.warn("人员名称不可为空！");
            return;
        }
        var ids = [];
        $(".rolecontainer li.active").each(function() {
            ids.push($(this).attr("id"));
        });
        $scope.formData.role = ids.join(",");
        if (typeof id == "undefined") {
            $http({
                url: app.url.addEnterUser,
                method: 'post',
                data: {
                    access_token: utils.localData('yy_access_token'),
                    name: $scope.formData.name,
                    position: $scope.formData.position,
                    telephone: $scope.formData.telephone,
                    role: $scope.formData.role,
                    remarks: $scope.formData.remarks,
                    id: parentId,
                    enterpriseId: groupId
                }
            }).then(function(resp) {
                if (resp.data.resultCode === 1) {
                    var txt = "创建成功！";
                    window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.success, {
                        onOk: function() {
                            $state.go('app.drugfactory', {}, {
                                reload: true
                            });
                            html.css('overflow', 'auto');
                        }
                    });

                } else {
                    window.wxc.xcConfirm(resp.data.resultMsg, window.wxc.xcConfirm.typeEnum.error);
                }
            }, function(x) {
                console.error(x.statusText);
            });
        } else {
            $http({
                url: app.url.updateEnterUser,
                method: 'post',
                data: {
                    access_token: utils.localData('yy_access_token'),
                    name: $scope.formData.name,
                    position: $scope.formData.position,
                    telephone: $scope.formData.telephone,
                    role: $scope.formData.role,
                    remarks: $scope.formData.remarks,
                    id: $scope.targetUserInfo.id,
                    newId: parentId,
                    userId: id,
                    enterpriseId: groupId
                }
            }).then(function(resp) {
                if (resp.data.resultCode === 1) {
                    var txt = "修改成功！";
                    window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.success, {
                        onOk: function() {
                            $state.go('app.drugfactory', {}, {
                                reload: true
                            });
                            html.css('overflow', 'auto');
                        }
                    });

                } else {
                    window.wxc.xcConfirm(resp.data.resultMsg, window.wxc.xcConfirm.typeEnum.error);
                }
            }, function(x) {
                console.error(x.statusText);
            });
        }
    };

    //查询角色是否被使用(获取医药代表分管的药品数量)
    function isQueryRole(_that) {
        /*var txt=  "该职员当前分管“黛力新”、“茶碱缓”品种，若要取消医药代表角色，请先到品种库中删除分管品种";
        window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info,{onOk:function(){}});*/
        $http({
            url: app.url.getEnterpriseUserAssignDrugList,
            method: 'post',
            data: {
                access_token: utils.localData('yy_access_token'),
                userId: $scope.targetUserInfo.userId
            }
        }).then(function(resp) {
            if (resp.data.resultCode === 1) {
                if (resp.data.data > 0) {
                    var txt = "该职员当前分管了" + resp.data.data + "个品种，若要取消医药代表角色，请先到品种库中删除分管品种";
                    window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info, {
                        onOk: function() {}
                    });
                } else {
                    _that.toggleClass("active");
                }
            } else {
                window.wxc.xcConfirm(resp.data.resultMsg, window.wxc.xcConfirm.typeEnum.error);
            }
        }, function(x) {
            console.error(x.statusText);
        });
    }

    //获取角色列表
    function getRoleList() {
        $http({
            url: app.url.getRoleList,
            method: 'post',
            data: {
                access_token: utils.localData('yy_access_token'),
                enterpriseId: groupId
            }
        }).then(function(resp) {
            if (resp.data.resultCode === 1) {
                $scope.roleList = resp.data.data;
                setTimeout(function() {
                    if ($scope.targetUserInfo.role && $scope.targetUserInfo.role != "") {
                        $(".rolecontainer li").each(function(index) {
                            var that = $(this);
                            if (typeof id != "undefined") {
                                var _id = that.attr("id");
                                $.each($scope.targetUserInfo.role, function(_index, item) {
                                    if (_id == item.key) {
                                        that.addClass("active");
                                        return false;
                                    }
                                });
                            } else {
                                that.removeClass("active");
                            }
                        });
                    }
                }, 100);
            } else {
                window.wxc.xcConfirm("获取角色列表失败", window.wxc.xcConfirm.typeEnum.error);
            }
        }, function(x) {
            console.error(x.statusText);
        });
    }
    getRoleList();

    // 模态框退出
    $scope.cancel = function() {
        container.prev().remove();
        container.remove();
        window.history.back();
        html.css('overflow', 'auto');
    };

    $(".rolecontainer").on("click", "li", function() {
        if (typeof id != "undefined") {
            if ($(this).hasClass("active")) {
                isQueryRole($(this));
            } else {
                $(this).toggleClass("active");
            }
        } else {
            $(this).toggleClass("active");
        }

    });



});
