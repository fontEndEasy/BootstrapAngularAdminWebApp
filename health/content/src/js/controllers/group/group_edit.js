'use strict';

//集团设置控制器
app.controller('groupEdit', ['$rootScope', '$scope', '$modal', '$log', '$http', '$state', '$stateParams', 'utils', 'toaster', 'Group',
    function ($rootScope, $scope, $modal, $log, $http, $state, $stateParams, utils, toaster, Group) {
        $scope.financialState = true;
        $scope.memberInvite = 'true';
        $scope.memberApply = 'true';
        var groupId = localStorage.getItem('curGroupId');
        var doctorId = $scope.datas.user_id || utils.localData('user_id');
        var logoImg = null;

        $scope.financialState = false;
        $scope.groupLogoProgress = 0;

        Group.handle(groupId, function(group) {
            $scope.groupName = group.name;
            $scope.groupInfo = group.introduction;
            $scope.groupLogoUrl = group.logo;
            if (group.config) {
                $scope.memberInvite = String(group.config.memberInvite);
                $scope.memberApply = String(group.config.memberApply);
            }

            // 是否为超级管理员
            switch (group.user.admin) {
                case 'root':
                    $scope.isRootAdmin = true;
                    break;
                default:
                    $scope.isRootAdmin = false;
                    break;
            }
        });

        //提交按钮事件
        $scope.submitBt = function () {
            $scope.updateGroup(groupId);
            $scope.saveData();
        };

        //修改集团信息
        $scope.updateGroup = function (groupId) {
            $http.post(app.url.yiliao.updateGroup, {
                access_token: app.url.access_token,
                id: groupId,
                name: $scope.groupName,//+'医生集团'
                introduction: $scope.groupInfo,
                'config.memberInvite': $scope.memberInvite,
                'config.memberApply': $scope.memberApply,
                logoUrl: logoImg
            }).
            success(function (data) {
                if (data.resultCode === 1) {
                    utils.localData('curGroupName', data.data.name);
                    $rootScope.rootGroup.name = localStorage.getItem('curGroupName');
                    toaster.pop('success', null, '集团信息修改成功！');
                } else {
                    toaster.pop('error', null, data.resultMsg);
                }
            }).
            error(function (data) {
                $scope.authError = data.resultMsg;
            });
        };

        //获取擅长病种
        $http.post(app.url.yiliao.getDiseaseLabel, {
            access_token: localStorage.getItem('access_token'),
            docGroupId: localStorage.getItem('curGroupId')
        }).success(function (data) {
            if (data.data.length > 0) {
                $scope.loading = false;
                data.data.map(function (e) {
                    e.id = e.diseasesId;
                    e.name = e.diseasesName;
                    delete e.diseasesId;
                    delete e.diseasesName;
                    return e;
                });
                $scope.dataDom = data.data;
            } else {
                $scope.loading = false;
            }
            setEditor();
        }).error(function (data) {
            console.error(data);
        });

        //添加擅长病种
        var pickData = function () {
            var databox = new DataBox('data_res', {
                hasCheck: true,
                allCheck: true,
                leafCheck: true,
                multiple: true,
                allHaveArr: false,
                self: false,
                cover: false,
                leafDepth: 2,
                selectView: true,
                search: {
                    url: '',
                    param: {},
                    searchDepth: [1],
                    dataKey: {
                        name: 'name',
                        id: 'id',
                        union: 'parentId',
                        dataSet: 'data.data'
                    },
                    //keyName: 'keyword',
                    unwind: false
                },
                arrType: [1, 1, 0],
                data: {
                    url: app.yiliao + 'base/getDiseaseTree'
                },
                titles: {
                    main: '选择病种',
                    searchKey: '搜索病种...',
                    label: '已选择病种数'
                },
                icons: {
                    arrow: 'fa fa-caret-right/fa fa-caret-down',
                    check: 'fa fa-check/fa fa-square',
                    root: 'fa fa-hospital-o cfblue',
                    branch: 'fa fa-h-square cfblue',
                    leaf: 'fa fa-stethoscope dcolor',
                    head: 'headPicFileName'
                },
                fixdata: $scope.dataDom,
                response: makeList,
                datakey: {
                    id: 'id',
                    name: 'name',
                    sub: 'children'
                },
                info: {
                    name: 'name',
                    id: 'id',
                    leaf: 'leaf'
                }
            });
        };

        //遍历dom
        function makeList(data) {
            $scope.dataDom = data;
            $scope.$apply($scope.dataDom);
        }

        function setEditor() {
            // 修改
            $scope.addData = function () {
                pickData();
            };

            // 保存
            $scope.saveData = function () {
                var ids = [];
                //更改数组每个元素的属性名称
                if (!$scope.dataDom || $scope.dataDom.length === 0) return;

                $scope.dataDom.forEach(function (item, index, array) {
                    ids.push(item.id);
                });
                //设置擅长病种
                $http.post(app.yiliao + 'group/settings/setSpecialty', {
                    'access_token': localStorage.getItem('access_token'),
                    'docGroupId': localStorage.getItem('curGroupId'),
                    'specialtyIds': ids
                }).
                success(function (data) {
                    if (data.resultCode === 1) {
                        $scope.result = true;
                        toaster.pop('success', null, '擅长病种保存成功！');
                    } else {
                        $scope.result = false;
                        toaster.pop('error', null, '擅长病种保存失败！');
                    }
                }).
                error(function (data) {
                    console.error('保存擅长病种:' + data);
                });
            };

            $scope.removeItem = function (item) {
                var index = $scope.dataDom.indexOf(item);
                $scope.dataDom.splice(index, 1);
            };
        }

        //获取集团详情
        function getGroupInfo(id) {
            $http.post(app.url.yiliao.getGroupInfo, {
                access_token: app.url.access_token,
                id: id
            }).success(function (data) {
                if (data.resultCode === 1) {
                    var group = data.data;
                    $scope.groupName = name || group.name;
                    $scope.groupInfo = group.introduction;
                    if (group.config) {
                        $scope.memberInvite = String(group.config.memberInvite);
                        $scope.memberApply = String(group.config.memberApply);
                    }

                    // 集团logo
                    if (group.logoUrl) {
                        $scope.groupLogoUrl = group.logoUrl + '?' + new Date().getTime();
                    } else {
                        $scope.groupLogoUrl = 'src/img/logoDefault.jpg?' + new Date().getTime();
                    }
                } else {
                    toaster.pop('error', null, data.resultMsg);
                }
            }).error(function (data) {
                toaster.pop('error', null, data.resultMsg);
            });
        };

        //getGroupInfo(groupId);

        if (groupId) $scope.logoUpdate = true;

        var modalInstance;
        $scope.transferTo = function () {
            modalInstance = $modal.open({
                animation: true,
                templateUrl: 'groupTransfer.html',
                controller: 'GroupTransfer',
                size: 'md',
                resolve: {
                    item: function () {
                        return doctorId;
                    }
                }
            });
        };

        $scope.selectFile = function () {
            $scope.upload();
        };

        // 设置七牛上传获取uptoken的参数
        $scope.token = localStorage.getItem('access_token');
        // 选择文件后回调
        $scope.uploaderAdded = function (up, files) {
            $scope.uploadBoxOpen = true;
        };
        // 文件上传进度
        $scope.progress = function (up, file) {
            $scope.groupLogoProgress = file.percent;
        };
        // 每个文件上传成功回调
        $scope.uploaderSuccess = function (up, file, info) {
            if (groupId && file.url) {
                if (file.url) {
                    $scope.groupLogoUrl = file.url;
                    $scope.datas.groupPicFile = file.url;
                    logoImg = file.url;
                    $scope.$apply();
                }

                file.result = '上传成功！';
                toaster.pop('success', null, '头像上传成功！');
            }
        };
        // 每个文件上传失败后回调
        $scope.uploaderError = function (up, err, errTip) {
            toaster.pop('error', null, errTip);
        };
    }]);

////////////////////////////////////////////////////////////////////////////////

app.controller('GroupTransfer', function ($scope, $rootScope, $modalInstance, $http, item, modal, utils) {
    $scope.account = {};
    var groupId = localStorage.getItem('curGroupId');

    $scope.confirm = function () {
        $http({
            url: app.url.yiliao.applyTransfer,
            method: 'post',
            data: {
                access_token: app.url.access_token,
                groupId: groupId,
                inviteUserId: item,
                confirmUserId: $scope.selectedDoctorId
            }
        }).then(function (resp) {
            if (resp.data.resultCode == '1') {
                modal.toast.success('转让成功！');
                $modalInstance.dismiss('cancel');
            } else {
                $scope.authError = resp.data.resultMsg;
            }
        });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    function setDoctor(dt) {
        if (item === dt[0].id) {
            $scope.authError = '不能转让给自己！';
            return;
        }
        $scope.selectedDoctorId = dt[0].id;
        $scope.selectedDoctorName = dt[0].name;
        $scope.authError = false;
        $scope.$apply();
    }

    $scope.selectDoctor = function () {
        // 创建通讯录列表数据
        var databox = new DataBox('data_res', {
            hasCheck: true,
            allCheck: false,
            leafCheck: true,
            multiple: false,
            allHaveArr: true,
            self: false,
            cover: false,
            selectView: false,
            arrType: [1, 0, 0],
            search: {
                url: app.url.yiliao.searchDoctorByKeyWord,
                param: {
                    access_token: app.url.access_token,
                    groupId: groupId,
                    keyword: 'name',
                    pageSize: 10000,
                    pageIndex: 0
                },
                dataKey: {
                    name: 'doctor.name',
                    id: 'doctorId',
                    union: 'departmentId',
                    dataSet: 'data.pageData'
                },
                keyName: 'keyword',
                unwind: false
            },
            data: {
                url: app.url.yiliao.getAllData,
                param: {
                    access_token: app.url.access_token,
                    groupId: groupId
                }
            },
            async: {
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
            titles: {
                main: '选择接收集团的医生',
                searchKey: '医生姓名',
                label: '已选择医生'
            },
            icons: {
                arrow: 'fa fa-caret-right/fa fa-caret-down',
                check: 'fa fa-check/fa fa-square',
                root: 'fa fa-hospital-o cfblue',
                branch: 'fa fa-h-square cfblue',
                leaf: 'fa fa-user-md dcolor',
                head: 'headPicFileName'
            },
            root: {
                selectable: false,
                name: utils.localData('curGroupName'),
                id: 0
            },
            extra: [{
                name: '未分配',
                id: 'idx_0',
                parentId: 0,
                subList: [],
                url: app.url.yiliao.getUndistributed,
                dataName: 'pageData',
                target: {
                    data: 'doctor',
                    dataKey: {
                        id: 'doctorId',
                        name: 'name'
                    }
                },
                param: {
                    access_token: app.url.access_token,
                    groupId: groupId,
                    pageIndex: 0,
                    pageSize: 10000
                },
                icon: 'fa fa-bookmark'
            }],
            response: setDoctor,
            datakey: {
                id: 'id',
                name: 'name',
                sub: 'subList'
            },
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
            callback: function () {
            }
        });
    };

});