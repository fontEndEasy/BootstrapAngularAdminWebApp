'use strict';

app.controller('Contacts', function ($rootScope, $scope, $state, $http, $compile, utils, modal, Group) {

    //$state.go('app.relationship.list', null, {reload: true})
    //Group.getData();

    var data = null,
        cnt_list = $('#cnt_list'),
        items = cnt_list.find('.list-group-item'),
        dt = null,
        groupId = utils.localData('curGroupId');

    $scope.loading = true;
    $rootScope.loaded = true;

/*    Group.handle(groupId, function (group) {
        console.log(group);
    });*/

    // 创建通讯录列表数据
    var contacts = new Tree('cnt_list', {
        hasCheck: false,
        allCheck: false,
        multiple: false,
        allHaveArr: false,
        self: true,
        search: false,
        arrType: [1,1,0],
        //extra: true,
        data: {
            url: app.url.yiliao.getAllData,
            param: {
                access_token: app.url.access_token,
                groupId: groupId
            }
        },
        async: false,
        icons: {
            arrow: 'fa fa-caret-right/fa fa-caret-down',
            check: 'fa fa-check',
            root: 'fa fa-hospital-o dcolor',
            branch: 'fa fa-h-square dcolor',
            leaf: 'fa fa-h-square dcolor',
            head: 'headPicFileName'
        },
        root: {
            selectable: false,
            name: utils.localData('curGroupName'),
            id: 0
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
            description: 'description',
            isExtra: 'isExtra'
        },
        extra: [{
            name: '已申请，待集团审核<b class="badge bg-success pull-right" id="doctor_asked">5</b>',
            id: 'idx_3',
            subList: [],
            icon: 'fa fa-flag'
        },{
            name: '已邀请，待医生验证<b class="badge bg-info pull-right" id="doctor_invited">374</b>',
            id: 'idx_2',
            subList: [],
            icon: 'fa fa-clock-o'
        },{
            name: '已加入，未分配组织<b class="badge bg-warning pull-right" id="doctor_undistributed">6009</b>',
            id: 'idx_1',
            subList: [],
            icon: 'fa fa-bookmark'
        },{
            name: '已和集团解除关系<b class="badge bg-danger pull-right" id="doctor_quit">36</b>',
            id: 'idx_0',
            subList: [],
            icon: 'fa fa-ban'
        }],
        events: {
            click: forward,
            mouseenter: enter,
            mouseleave: leave
        },
        callback: function () {
            $scope.toCurPage();
            //return;
            var n = 4;
            while (n--) {
                if (n === 1) {
                    var num = $('#doctor_undistributed').html('0');
                    _getData(app.url.yiliao.getUndistributed, {}, num);
                } else if (n === 2) {
                    var num = $('#doctor_invited').html('0');
                    _getData(app.url.yiliao.searchDoctor, {
                        status: 'I'
                    }, num);
                } else if (n === 3) {
                    var num = $('#doctor_quit').html('0');
                    _getData(app.url.yiliao.searchDoctor, {
                        status: 'S'
                    }, num);
                } else {
                    var num = $('#doctor_asked').html('0');
                    _getData(app.url.yiliao.searchDoctor, {
                        status: 'J'
                    }, num);
                }
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
                }).then(function (resp) {
                    if (resp.data.resultCode === 1 && resp.data.data) {
                        target.html(resp.data.data.total);
                    } else {
                        console.warn("编辑失败！");
                    }
                }, function (x) {
                    console.error(x.statusText);
                });
            }
        }
    });

    $rootScope.toCurPage = function(){
        if ($scope.curDepartmentId) {
            var dts = contacts.getTree().find('dt');
            for (var i = 0; i < dts.length; i++) {
                if (dts.eq(i).data('info') && dts.eq(i).data('info').id === $scope.curDepartmentId) {
                    if(!$rootScope.isSearch) {
                        dts.eq(i).trigger('click');
                    }
                    break;
                }
            }
        } else {
            var curDepartment = cnt_list.find('.cnt-list-warp').first();
            if(!$rootScope.isSearch){
                curDepartment.find('dt').eq(1).trigger('click');
            }
        }
    };

    var iEdit, iDelete;

    function enter(info) {
        if(info.isExtra) return;
        $scope.curIndex = null;
        var cur_div = contacts.treeWrapper.find('.back-line');
        iEdit = $('<i class="pos-edit fa fa-pencil-square-o"></i>');
        iDelete = $('<i class="pos-delete fa fa-trash-o"></i>');
        $(this).append(iEdit).append(iDelete);

        iEdit.click(function (e) {
            var evt = e || window.event;
            evt.stopPropagation();
            $rootScope.targetDepartmentParentId = info.pid;
            $rootScope.targetDepartmentId = info.id;
            $rootScope.targetDepartmentName = info.name;
            $rootScope.targetDepartmentDescription = info.description;
            $state.go('app.contacts.list.edit');
        });

        iDelete.click(function (e) {
            var evt = e || window.event;
            evt.stopPropagation();
            $rootScope.targetDepartmentId = info.id;
            $rootScope.targetDepartmentName = info.name;
            //$state.go('app.contacts.list.delete');
            var htmlStr =
                '<div class="clearfix">' +
                    '<i class="txt-warn pull-left thumb-md avatar fa fa-warning"></i>'+
                    '<div class="clear">' +
                        '<div class="h4 m-t-xs m-b-xs text-left text-primary">'+ info.name +'</div>'+
                            '<small class="text-muted">若该组织下含有医生，您先将其移走或删除。您确定要移除该组织吗？</small>'+
                        '</div>' +
                    '</div>' +
                '</div>';

            // 移除组织
            modal.confirm('移除组织', htmlStr, function(){
                $http({
                    url: app.url.yiliao.deleteByDepart,
                    method: 'post',
                    data: {
                        access_token: app.url.access_token,
                        ids: $scope.targetDepartmentId
                    }
                }).then(function (resp) {
                    if (resp.data.resultCode === 1) {
                        $state.go('app.contacts.list', {}, {reload: true});
                    } else {
                        console.warn("移除失败！");
                        modal.toast.error(resp.data.resultMsg);
                    }
                }, function (x) {
                    console.error(x.statusText);
                });
            });
        });
    }

    function leave(info) {
        if(info.isExtra) return;
        $scope.curIndex = null;
        iEdit.remove();
        iDelete.remove();
    }

    function forward(info) {
        $scope.curIndex = null;
        //cnt_list.find('.cur-line').removeClass('cur-line');
        //this.addClass('cur-line');
        $rootScope.isSearch = false;
        $rootScope.curDepartmentId = info.id || null;
        utils.localData('curDepartmentId', $scope.curDepartmentId);
        $state.go('app.contacts.list', {id: info.id + '/' +(new Date().getTime())}, {reload: false});
    }

    $scope.check = function () {
        alert('checked');
    };

    // 添加组织
    $scope.addUnit = function () {
        //console.log($scope.curDepartmentId);
        $state.go('app.contacts.list.add');
    };

    // 邀请医生
    $scope.invite = function () {
        $state.go('app.contacts.list.invite');
    };

    // 编辑组织
    $scope.editUnit = function () {
        if ($rootScope.obj['id']) {
            $rootScope.details = $rootScope.obj;
            setStatus(status_false);
            $state.go('app.org.edit');
        }
    };

    var mask = $('<div class="mask"></div>');
    var container = $('#dialog-container');
    var dialog = $('#dialog');
    var doIt = function () {
    };

    // 执行操作
    $rootScope.do = function () {
        doIt();
    };

    // 模态框退出
    $rootScope.cancel = function () {
        mask.remove();
        container.addClass('none');
    };

    // 不操作返回
    $scope.return = function () {
        $rootScope.ids = [];
        setStatus(status);
        window.history.back();
    };
});
