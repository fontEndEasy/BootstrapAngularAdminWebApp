'use strict';

//集团设置控制器
app.controller('groupCreate', ['$rootScope', '$scope', '$modal', '$log', '$http', '$state', '$stateParams', 'utils', 'toaster', 'modal', 'Group',
    function ($rootScope, $scope, $modal, $log, $http, $state, $stateParams, utils, toaster, modal, Group) {
        $scope.financialState = true;
        var groupId = localStorage.getItem('curGroupId');
        var doctorId = $scope.datas.user_id || utils.localData('user_id');
        var logoImg = null;

        Group.handle(groupId, function(group) {
            if(!group.name){
                $scope.step_apply = true;
                $scope.step_check = false;
                $scope.step_active = false;
                $scope.step_status = true;
                logoImg = $scope.groupLogoUrl = utils.localData('headPicFile') || 'src/img/logoDefault.jpg';
                return;
            }
            // 集团审核状态
            switch (group.status.applyStatus) {
                case 'P':
                    $scope.pass = true;
                    $scope.step_apply = true
                    $scope.step_check = true;
                    $scope.step_active = true;
                    $scope.step_status = true;
                    break;
                case 'NP':
                    $scope.step_apply = true
                    $scope.step_check = true;
                    $scope.step_active = false;
                    $scope.no_pass = true;
                    $scope.step_status = false;
                    logoImg = group.logo;
                    $scope.groupLogoUrl = group.logo;
                    getCheckInfo();     // 审核未通过时，获取审核信息
                    break;
                case 'A':
                    $scope.un_check = true;
                    $scope.step_apply = true;
                    $scope.step_check = true;
                    $scope.step_active = false;
                    $scope.step_status = true;
                    break;
                default:
                    $scope.un_check = false;
                    $scope.step_apply = true;
                    $scope.step_check = false;
                    $scope.step_active = false;
                    $scope.step_status = true;
                    logoImg = $scope.groupLogoUrl = utils.localData('headPicFile') || 'src/img/logoDefault.jpg';
                    break;
            }

        });

        if (groupId && $scope.isActive) {
            $scope.status_normal = true;
            if ($scope.isSysAdmin) {
                $state.go('app.group_edit');
            }
        } else {
            $scope.status_normal = false;
        }

        function getCheckInfo() {
            $http.post(app.url.yiliao.groupApplyInfo, {
                access_token: app.url.access_token,
                groupId: groupId || localStorage.getItem('curId')
            }).
            success(function (data) {
                if (data.resultCode === 1) {
                    $scope.groupName = data.data.name;
                    $scope.groupInfo = data.data.introduction;
                    //$scope.groupLogoUrl = data.data.logoUrl;
                    $scope.auditMsg = data.data.auditMsg;
                } else {
                    toaster.pop('error', null, data.resultMsg);
                }
            }).
            error(function (data) {
                $scope.authError = data.resultMsg;
            });
        }

        //提交按钮事件
        $scope.submitBt = function () {
            $scope.regGroup();  // 提交集团信息
        };

        //注册集团
        $scope.regGroup = function () {
            var params = {
                access_token: app.url.access_token,
                name: $scope.groupName,
                introduction: $scope.groupInfo,
                applyUserId: doctorId
            };
            if ($scope.isReapply) {
                params.id = utils.localData('curId');
            }

            params.logoUrl = logoImg || utils.localData('headPicFile') || 'src/img/logoDefault.jpg';

            $http.post(app.url.yiliao.groupApply, params).success(function (data) {
                if (data.resultCode === 1) {
                    //utils.localData('curGroupName', data.data.name);
                    //$scope.rootGroup.name = localStorage.getItem('curGroupName');

                    //$scope.user.isInGroup = true;
                    //utils.localData('isInGroup', true);

                    //$scope.user.isAdmin = true;
                    //utils.localData('isAdmin', true);

                    $scope.isActive = false;
                    Group.set('status.applyStatus', 'A');
                    //utils.localData('isActive', true);

                    //utils.localData('certStatus', 'NC');
                    //utils.localData('applyStatus', 'A');

                    // 清理一些本地数据
                    //utils.localData('isIdentified', null);
                    //utils.localData('isIdentified', null);
                    //utils.localData('curLiId', 'id_0');

                    // 跳转
                    if ($scope.isReapply || (!$scope.isReapply && !$scope.pass && !$scope.step_apply)) {
                        $state.go('app.group_create', null, {reload: true});
                    }else{
                        $rootScope.verifyByGuser(data.data.groupId, data.data.applyUserId);
                    }
                    $scope.isReapply = false;
                } else {
                    toaster.pop('error', null, data.resultMsg);
                }
            }).error(function (data) {
                toaster.pop('error', null, data.resultMsg);
            });
        };

        function getGroupInfo(id) {
            $http.post(app.url.yiliao.getGroupInfo, {
                access_token: app.url.access_token,
                id: id
            }).success(function (data) {
                if (data.resultCode === 1) {
                    var group = data.data;
                    $scope.groupName = name || group.name;
                    $scope.groupInfo = group.introduction;

                    // 集团logo
                    if (group.logoUrl) {
                        $scope.groupLogoUrl = group.logoUrl + '?' + new Date().getTime();
                    } else {
                        $scope.groupLogoUrl = 'src/img/logoDefault.jpg';
                    }
                } else {
                    toaster.pop('error', null, data.resultMsg);
                }
            }).
            error(function (data) {
                toaster.pop('error', null, data.resultMsg);
            });
        };

        if ((!$rootScope.isActive || $rootScope.no_pass) && groupId) {
            //getGroupInfo(groupId);          //获取集团详情
        }

        if (groupId) $scope.logoUpdate = true;

        $scope.reapply = function () {
            $scope.isReapply = true;
            $scope.step_apply = true;
            $scope.step_check = false;
            $scope.step_active = false;
            $scope.step_status = true;
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
            if (file.url) {
                $scope.groupLogoUrl = file.url;
                logoImg = file.url;
                $scope.$apply();
            }

            file.result = '上传成功！';
            toaster.pop('success', null, '头像上传成功！');
        };

        // 每个文件上传失败后回调
        $scope.uploaderError = function (up, err, errTip) {
            toaster.pop('error', null, errTip);
        };
    }]);