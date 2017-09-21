app.controller('navCtrl', ['$rootScope', '$scope', '$http', 'utils', '$state', 'Group',
    function ($rootScope, $scope, $http, utils, $state, Group) {

        var groupId = $scope.groupId || utils.localData('curGroupId');

/*        if ($scope.logFromCompany || utils.localData('logFromCompany') === 'true') {
            $scope.logFromCompany = true;
        } else {
            $scope.logFromCompany = false;
        }*/

        /*if (!$scope.datas.user_headPicFile) {
            if (!$scope.logFromCompany && (utils.localData('headPicFile') + '') !== (null + '')) {
                $scope.datas.user_headPicFile = (utils.localData('headPicFile') || 'src/img/a0.jpg');
            } else {
                $scope.datas.user_headPicFile = '';
            }
        }*/

        if(utils.localData('has_more_group') === 'true'){
            $scope.has_more_group = true;
        }else{
            $scope.has_more_group = false;
        }

        $scope.user = {};

        Group.handle(groupId, function(group) {
            //$scope.user.name = group.user.name || utils.localData('user_name');
            if(!group.name){
                $scope.un_reg = true;
                $scope.un_check = false;
                $scope.user.isInGroup = false;
                $scope.user.isAdmin = false;
                $scope.isSysAdmin = false;      // 是否为管理员

                $scope.datas.user_headPicFile = (utils.localData('headPicFile') || 'src/img/a0.jpg');

                return;
            }else{

            }
            // 用户头像
            if (group.user.headPic) {
                $scope.datas.user_headPicFile = group.user.headPic;
            }else{
                $scope.datas.user_headPicFile = 'src/img/a0.jpg';
            }

            // 记录用户状态（3-集团管理员，2-集团成员，1-集团外医生）
            switch (group.user.status) {
                case '1':
                    $scope.user.isInGroup = false;
                    $scope.user.isAdmin = false;
                    $rootScope.isSysAdmin = false;
                    break;
                case '2':
                    $scope.user.isInGroup = true;
                    $scope.user.isAdmin = false;
                    $rootScope.isSysAdmin = false;
                    break;
                case '3':
                    $scope.user.isAdmin = true;
                    $scope.user.isInGroup = true;
                    $rootScope.isSysAdmin = true;
                    break;
                default:
                    break;
            }

            if(!$rootScope.roleX){
                $scope.user.isInGroup = true;
                $scope.user.isAdmin = false;
                $rootScope.isSysAdmin = true;
            }

            // 集团是否激活
            switch (group.status.active) {
                case 'active':
                    $rootScope.isActive = true;
                    group.status.applyStatus = 'P';
                    break;
                default:
                    $rootScope.isActive = false;
                    break;
            }

            // 集团审核状态
            switch (group.status.applyStatus) {
                case 'P':
                    $scope.un_reg = false;
                    $scope.un_check = false;
                    $scope.pass = true;
                    $scope.step_apply = true
                    $scope.step_check = true;
                    $scope.step_active = true;
                    $scope.step_status = true;
                    break;
                case 'NP':
                    $scope.un_reg = false;
                    $scope.un_check = false;
                    $scope.step_apply = true
                    $scope.step_check = true;
                    $scope.step_active = false;
                    $scope.no_pass = true;
                    $scope.step_status = false
                    break;
                case 'A':
                    $scope.un_reg = false;
                    $scope.un_check = true;
                    $scope.step_apply = true;
                    $scope.step_check = true;
                    $scope.step_active = false;
                    $scope.step_status = true;
                    break;
                default:
                    $scope.un_reg = true;
                    $scope.un_check = false;
                    $scope.step_apply = true;
                    $scope.step_check = true;
                    $scope.step_active = false;
                    $scope.step_status = true;
                    //logoImg = $scope.groupLogoUrl = utils.localData('headPicFile') || 'src/img/logoDefault.jpg';
                    break;
            }

            $scope.datas.groupPicFile = group.logo;      // 设置集团LOGO
        });

        $scope.group = {};
        $scope.user.name = $scope.datas.user_name || utils.localData('user_name');
        //$scope.isRootAdmin = $scope.isRootAdmin || utils.localData('isRootAdmin') === 'true';
        $rootScope.roleX = $rootScope.roleX || utils.localData('roleX') === 'true';
        //$scope.user.userId=$scope.user.userId || utils.localData('user_id');
        //$scope.group.isIdentified = $scope.group.isIdentified || utils.localData('isIdentified');

        var ddd = null;

        if($scope.user.isInGroup && ddd){
            if(groupId) {
                // 获取集团信息
                $http.post(app.url.yiliao.getGroupInfo, {
                    access_token: app.url.access_token,
                    id: groupId
                }).success(function (data) {
                    if (data.resultCode === 1) {
                        var group = data.data;
                        // 集团logo
                        if (group.logoUrl) {
                            $scope.datas.groupPicFile = group.logoUrl;
                        } else {
                            $scope.datas.groupPicFile = 'src/img/logoDefault.jpg?';
                        }
                    } else {
                        toaster.pop('error', null, data.resultMsg);
                    }
                }).error(function (data) {
                    toaster.pop('error', null, data.resultMsg);
                });
            }

            if($scope.user.isAdmin && ddd){
                // 获取集团状态
                if($rootScope.un_check || $rootScope.no_pass || !$rootScope.isActive) {
                    $http({
                        url: app.url.yiliao.getGroupStatusInfo,
                        method: 'post',
                        data: {
                            access_token: app.url.access_token,
                            groupId: groupId
                        }
                    }).then(function (resp) {
                        if (resp.data.resultCode === 1) {
                            // 记录集团相关数据，用于更新界面
                            if (resp.data.data.active === 'active') {
                                utils.localData('isActive', true);
                                $rootScope.isActive = true;
                            } else {
                                utils.localData('isActive', false);
                                $rootScope.isActive = false;
                            }

                            switch (resp.data.data.applyStatus) {
                                case 'P':
                                    utils.localData('applyStatus', 'P');
                                    $rootScope.pass = true;
                                    $rootScope.step_apply = true
                                    $rootScope.step_check = true;
                                    $rootScope.step_active = true;
                                    $rootScope.step_status = true;
                                    break;
                                case 'NP':
                                    utils.localData('applyStatus', 'NP');
                                    $rootScope.step_apply = true
                                    $rootScope.step_check = true;
                                    $rootScope.step_active = false;
                                    $rootScope.no_pass = true;
                                    $rootScope.step_status = false
                                    break;
                                case 'A':
                                    utils.localData('applyStatus', 'A');
                                    $rootScope.un_check = true;
                                    $rootScope.step_apply = true;
                                    $rootScope.step_check = true;
                                    $rootScope.step_active = false;
                                    $rootScope.step_status = true;
                                    break;
                                default:
                                    break;
                            }
                            //$scope.$apply();
                        } else {
                            $scope.authError = resp.data.resultMsg;
                        }
                    }, function (resp) {
                        $scope.authError = resp.data.resultMsg;
                    });
                }
            }
        }else{
            //$scope.user.isAdmin = false;
        }

        if($scope.group.isIdentified === true || $scope.group.isIdentified === 'true'){
            $scope.group.isIdentified = true;
        }else{
            $scope.group.isIdentified = false;
        }

        // 设置栏目标签
        /*setTimeout(function(){
            var nav_li = $('.nav > li > .nav-item');
            for(var i = 0; i<nav_li.length; i++){
                nav_li.eq(i).attr('id', 'id_' + i);
            }
            $('#' + utils.localData('curLiId')).addClass('nav-cur-item').parent().parent().parent().addClass('active');
            nav_li.click(function () {
                nav_li.removeClass('nav-cur-item');
                $(this).addClass('nav-cur-item');
                utils.localData('curLiId', $(this).attr('id'));
            });
        }, 200);*/
    }
]);
