'use strict';
app.controller('MailContacts', function($rootScope, $scope, $state, $http, $compile, utils, Upload) {
    var data = null,
        cnt_list = $('#cnt_zuzhi_list'),
        items = cnt_list.find('.list-group-item'),
        groupId = utils.localData('store_id');
    //"56d10990b472651e1cfdc819" || 

    $scope.loading = true;
    $rootScope.loaded = true;
    $scope.toCurPage = function() {
        if ($scope.curDepartmentId) {
            var dts = contacts.getTree().find('dt');
            for (var i = 0; i < dts.length; i++) {
                if (dts.eq(i).data('info') && dts.eq(i).data('info').id === $scope.curDepartmentId) {
                    if (!$rootScope.isSearch) {
                        dts.eq(i).trigger('click');
                    }
                    break;
                }
            }
        } else {
            var curDepartment = cnt_list.find('.cnt-list-warp').first();
            if (!$rootScope.isSearch) {
                curDepartment.find('dt').eq(1).trigger('click');
            }
        }
    };

    getTreeData();

    function getTreeData() {
        $http.post(app.url.getEnterOrg, {
            access_token: utils.localData('yy_access_token'),
            enterpriseId: groupId
        }).then(function(rpn) {
            if (rpn.data.resultCode === 1) {
                setTree(rpn.data.data);
            }
        });
    };

    var contacts = null;

    // 创建通讯录列表数据
    function setTree(data) {

        // 将未分配节点放到最后
        data[0].subList = data[0].subList.splice(1, data[0].subList.length - 1).concat(data[0].subList.splice(0, 1));

        contacts = new Tree('cnt_zuzhi_list', {
            hasCheck: false,
            allCheck: false,
            multiple: false,
            allHaveArr: false,
            self: true,
            search: false,
            arrType: [1, 1, 0],
            //extra: true,
            data: data,
            async: false,
            icons: {
                arrow: 'fa fa-caret-right/fa fa-caret-down',
                check: 'fa fa-check',
                root: 'fa fa-hospital-o dcolor',
                branch: 'fa fa-h-square dcolor',
                leaf: 'fa fa-h-square dcolor',
                head: 'headPicFileName'
            },
            /*root: {
                selectable: true,
                name: utils.localData('user_name'),
                id: 0
            },*/
            datakey: {
                id: 'id',
                name: 'name',
                sub: 'subList'
            },
            info: {
                name: 'name',
                id: 'id',
                pid: 'parentId',
                description: 'desc',
                isExtra: 'isExtra'
            },
            extra: [{
                name: '已离职',
                id: 'idx_0',
                subList: [],
                icon: 'fa fa-ban'
            }],
            events: {
                click: forward,
                mouseenter: enter,
                mouseleave: leave
            },
            callback: function() {
                $scope.toCurPage();
                return;
                var n = 3;
                while (n--) {
                    var dl = $('<dl class="cnt-list-warp"></dl>');
                    var dt = $('<dt></dt>');
                    var iIcon = $('<i class="fa-fw m-r-xs"></i>');
                    var span = $('<span></span>');
                    var num = $('<span class="badge"></span>');
                    if (n === 1) {
                        iIcon.addClass('fa fa-clock-o');
                        span.html('待验证');
                        num.html('0');
                        num.addClass('bg-info');
                        _getData(app.url.yiliao.searchDoctor, {
                            status: 'I'
                        }, num);
                    }

                    dt.append(num).append(iIcon).append(span);
                    dl.append(dt);
                    contacts.treeWrapper.append(dl);

                    dt.data('info', {
                        id: 'idx_' + n
                    });

                    var cur_div, tTop = contacts.treeWrapper.offset().top + 1;
                    dt.bind('click', 'idx_' + n, function(e) {
                        var evt = e || window.event;
                        evt.stopPropagation();
                        //evt.preventDefault();
                        if (contacts.treeWrapper.find('.cur-back-line').length === 0) {
                            cur_div = $('<div class="cur-back-line"></div>');
                            contacts.treeWrapper.append(cur_div);
                        } else {
                            cur_div = contacts.treeWrapper.find('.cur-back-line');
                        }
                        cnt_list.find('.cur-line').removeClass('cur-line');
                        $(this).addClass('cur-line');
                        tTop = contacts.treeWrapper.offset().top + 1;
                        cur_div.css('top', $(this).offset().top - tTop);
                        $rootScope.curDepartmentId = e.data;
                        utils.localData('curDepartmentId', e.data);

                        $state.go('app.contacts.list', {
                            id: e.data + '?' + (new Date()).getTime()
                        }, {
                            reload: false
                        });
                    });

                    // 鼠标停留时
                    var div;
                    dt.hover(function() {
                        tTop = contacts.treeWrapper.offset().top + 1;
                        div = $('<div class="back-line"></div>');
                        div.css('top', $(this).offset().top - tTop);
                        contacts.treeWrapper.append(div);
                    }, function() {
                        div.remove();
                    });
                }

                // 设置‘待审核’、‘已离职’列表数目
                function _getData(url, param, target) {
                    var dt = {
                        access_token: app.url.access_token,
                        groupId: groupId
                    };
                    $.extend(dt, param);
                    $http({
                        url: url,
                        method: 'post',
                        data: dt
                    }).then(function(resp) {
                        if (resp.data.resultCode === 1 && resp.data.data) {
                            target.html(resp.data.data.total);
                        } else {
                            console.warn("编辑失败！");
                        }
                    }, function(x) {
                        console.error(x.statusText);
                    });
                }
            }
        });
    };



    var iEdit, iDelete;

    function enter(info) {
        if (info.pid == "0") return;
        if (info.name == "未分配") return;
        if (info.isExtra) return;
        $scope.curIndex = null;
        var cur_div = contacts.treeWrapper.find('.back-line');
        iEdit = $('<i class="pos-edit fa fa-pencil-square-o"></i>');
        iDelete = $('<i class="pos-delete fa fa-trash-o"></i>');
        $(this).append(iEdit).append(iDelete);

        iEdit.click(function(e) {
            var evt = e || window.event;
            evt.stopPropagation();
            $rootScope.targetDepartmentParentId = info.pid;
            $rootScope.targetDepartmentId = info.id;
            $rootScope.targetDepartmentName = info.name;
            $rootScope.targetDepartmentDescription = info.description;
            $state.go('app.drugfactory.edit');
        });

        iDelete.click(function(e) {
            var evt = e || window.event;
            evt.stopPropagation();
            $rootScope.targetDepartmentId = info.id;
            $rootScope.targetDepartmentName = info.name;
            $state.go('app.drugfactory.delete');
        });
    }

    function leave(info) {
        if (info.pid == "0") return;
        if (info.name == "未分配") return;
        if (info.isExtra) return;
        $scope.curIndex = null;
        iEdit.remove();
        iDelete.remove();
    }

    function forward(info, keyword) {
        $scope.curIndex = null;
        $rootScope.isSearch = false;
        $rootScope.curDepartmentId = info.id || null;
        $rootScope.targetDepartment = info || null;

        var data = {},
            url = '#';

        if (info.id == "idx_0") {
            data = {
                access_token: utils.localData('yy_access_token'),
                enterpriseId: groupId
            }
            url = app.url.getEnterOffLineUserList;

        } else {
            data = {
                access_token: utils.localData('yy_access_token'),
                id: info.id,
                enterpriseId: groupId
            }
            if (keyword)
                data.keyword = keyword;
            url = app.url.getEnterUsersByDptId;
        }

        $http({
            url: url,
            method: 'post',
            data: data
        }).then(function(resp) {
            if (resp.data.resultCode === 1) {
                if (resp.data.data && resp.data.data.list)
                    $scope.list = resp.data.data.list;
                else
                    $scope.list = resp.data.data;
            } else {
                window.wxc.xcConfirm("查询失败！", window.wxc.xcConfirm.typeEnum.error);
            }
        }, function(x) {
            console.error(x.statusText);
        });

    }
    $scope.forward = forward;

    $scope.addDrugFactory = function(state) {
        if (state == '1') {
            $state.go('app.drugfactory.add_department', {}, {
                reload: true
            });
        } else if (state == '2') {
            $scope.curDepartmentId = null;
            $scope.targetUserInfo = null;
            $state.go('app.drugfactory.add_personnel', {}, {
                reload: true
            });
        }
    };


    // 导入人员
    $scope.upload = function(file) {
        uploadUsingUpload(file)
    };

    function uploadUsingUpload(file) {
        file.upload = Upload.upload({
            url: app.org + 'enterprise/dept/importEnterpriseUserFile?access_token=' + utils.localData('yy_access_token') + '&enterpriseId=' + groupId,
            headers: {
                'optional-header': 'header-value'
            },
            data: {
                file: file
            }
        });

        file.upload.then(function(resp) {
            if (resp.data.resultCode === 1) {
                if (resp.data.resultMsg) {
                    var text = '';
                    if (resp.data.data && resp.data.data.length > 0) {
                        for (var i = 0; i < resp.data.data.length; i++) {
                            text = text + resp.data.data[i] + ' ; ';
                        }
                    }
                    window.wxc.xcConfirm(text || resp.data.resultMsg, window.wxc.xcConfirm.typeEnum.info);
                } else
                    window.wxc.xcConfirm('上传成功', window.wxc.xcConfirm.typeEnum.success);
            } else {
                if (resp.data.resultMsg)
                    window.wxc.xcConfirm(resp.data.resultMsg, window.wxc.xcConfirm.typeEnum.error);
                else
                    window.wxc.xcConfirm("查询失败！", window.wxc.xcConfirm.typeEnum.error);
            }
        });
    };

    $scope.openEdit = function(info) {
        $rootScope.targetUserInfo = info;
        $state.go('app.drugfactory.add_personnel', {
            id: info.userId
        });
    }

});
