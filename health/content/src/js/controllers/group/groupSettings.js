'use strict';

//集团设置控制器
app.controller('groupSettingsCtrl', ['$rootScope', '$scope', '$modal', '$log', '$http', '$state', '$stateParams', 'utils', 'toaster',
    function ($rootScope, $scope, $modal, $log, $http, $state, $stateParams, utils, toaster) {
        $scope.financialState = true;
        //$rootScope.isCompany = false;
        $scope.amemberInvite = 'false';
        var companyId, regOrUpdate;
        var groupId = localStorage.getItem('curGroupId');
        //判断当前角色
        if (localStorage.getItem('company')) {//公司角色
            var company = JSON.parse(localStorage.getItem('company'));
            //$scope.financialState = false;
            companyId = company.id;
            utils.localData('user_id', null);
        } else if (localStorage.getItem('user_id')) {//医生角色
            companyId = '';//localStorage.getItem('user_id')
            if ($rootScope.rootGroup.enterpriseName) {
                //$scope.financialState = false;
            }
            utils.localData('enterprise_id', null);
        }

        //判断注册集团还是修改集团
        if (groupId) {
            getGroupInfo(groupId);//$stateParams.groupId
            regOrUpdate = 'update';
        } else {
            regOrUpdate = 'reg';
        }

        //提交按钮事件
        $scope.submitBt = function () {
            if (regOrUpdate == 'reg')
                return $scope.regGroup();
            if (regOrUpdate == 'update')
                return $scope.updateGroup(groupId);
        };

        //注册集团
        $scope.regGroup = function () {
            $http.post(app.url.yiliao.regGroup, {
                access_token: app.url.access_token,
                companyId: companyId,
                name: $scope.groupName,//+'医生集团'
                introduction: $scope.groupInfo,
                'config.memberInvite': $scope.amemberInvite,
                'config.parentProfit': $scope.parentProfit,
                'config.groupProfit': $scope.groupProfit
            }).
            success(function (data) {
                if (data.resultCode === 1) {
                    utils.localData('curGroupId', data.data.id);
                    utils.localData('curGroupName', data.data.name);
                    $rootScope.rootGroup.name = localStorage.getItem('curGroupName');
                    $state.go('app.groupLogo');
                } else {
                    toaster.pop('error', null, data.resultMsg);
                    //$scope.authError = data.resultMsg;
                }
            }).
            error(function (data) {
                toaster.pop('error', null, data.resultMsg);
                //$scope.authError = data.resultMsg;
            });
        };

        //修改集团信息
        $scope.updateGroup = function (groupId) {
            //console.log(!!$scope.amemberInvite);
            $http.post(app.url.yiliao.updateGroup, {
                access_token: app.url.access_token,
                id: groupId,
                name: $scope.groupName,//+'医生集团'
                introduction: $scope.groupInfo,
                'config.memberInvite': $scope.amemberInvite,
                'config.parentProfit': $scope.parentProfit,
                'config.groupProfit': $scope.groupProfit
            }).
            success(function (data) {
                if (data.resultCode === 1) {
                    console.log(data);
                    utils.localData('curGroupName', data.data.name);
                    $rootScope.rootGroup.name = localStorage.getItem('curGroupName');
                    toaster.pop('success', null, '修改成功！');
                    //$scope.authError = '修改成功！';
                } else {
                    toaster.pop('error', null, data.resultMsg);
                    //$scope.authError = data.resultMsg;
                }
            }).
            error(function (data) {
                $scope.authError = data.resultMsg;
            });
        };

        //获取集团详情
        function getGroupInfo(id) {
            $http.post(app.url.yiliao.getGroupInfo, {
                access_token: app.url.access_token,
                id: id
            }).
            success(function (data) {
                if (data.resultCode === 1) {
                    var group = data.data;
                    // if(group.name.length>4){
                    //   var name = group.name.substring(0,group.name.length - 4);
                    // }
                    $scope.groupName = name || group.name;
                    $scope.groupInfo = group.introduction;
                    if (group.config) {
                        $scope.amemberInvite = String(group.config.memberInvite);
                        $scope.parentProfit = group.config.parentProfit;
                        $scope.groupProfit = group.config.groupProfit;
                    }
                } else {
                    toaster.pop('error', null, data.resultMsg);
                    //$scope.authError = data.resultMsg;
                }
            }).
            error(function (data) {
                toaster.pop('error', null, data.resultMsg);
                //$scope.authError = data.resultMsg;
            });
        };
    }])

//集团LOGO设置控制器
app.controller('groupLogoSettingsCtrl', ['$scope', '$modal', '$log', '$http', 'Upload', '$stateParams', '$state', 'toaster', 'utils',
    function ($scope, $modal, $log, $http, Upload, $stateParams, $state, toaster, utils) {

        var groupId = localStorage.getItem('curGroupId');
        if (groupId)
            $scope.logoUpdate = true;

        //获取图片
        var creatorId = 'noPic';
        (function getLogo() {
            $http.post(app.url.yiliao.getGroupInfo, {
                access_token: app.url.access_token,
                id: groupId
            }).
            success(function (data) {
                if (data.resultCode === 1) {
                    creatorId = data.data.creator;

                    var imgUrl = app.url.upload.getCertPath + '?access_token=' + app.url.access_token + '&userId=' + creatorId + '&certType=' + groupId;
                    console.log(imgUrl);
                    (function getImg(imgUrl) {
                        $http.get(imgUrl).
                        success(function (data) {
                            if (data.resultCode === 1) {
                                $scope.groupLogoUrl = data.data[0] + '?' + Math.random();
                            } else {
                                $scope.authError = data.resultMsg;
                                $scope.groupLogoUrl = '#';
                            }
                        }).
                        error(function (data) {
                            $scope.authError = data.resultMsg;
                        });
                    })(imgUrl);

                } else {
                    console.log(data.resultMsg);
                }
            }).
            error(function (data) {
                console.log(data.resultMsg);
            });

        })();

        //上传图片
        $scope.$watch('groupLogo', function (files) {
            goUpload(files, 'groupLogo', groupId);
        });
        function goUpload(files, fileName, certType) {
            if (files != null) {
                if (!angular.isArray(files)) {
                    files = [files];
                }
                for (var i = 0; i < files.length; i++) {
                    $scope.errorMsg = null;
                    (function (f, fileName, certType) {
                        upload(f, fileName, certType);
                    })(files[i], fileName, certType);
                }
            }
        };
        function upload(file, fileName, certType) {
            if (creatorId === 'noPic') return toaster.pop('error', null, '未找到原头像！');
            file.upload = Upload.upload({
                url: app.url.upload.upLoadImg,
                file: file,
                fileName: fileName,
                fields: {
                    'userId': creatorId,
                    'access_token': app.url.access_token,
                    'certType': certType,
                    'fileName': fileName
                }
            });
            file.upload.progress(function (evt) {
                file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
            file.upload.success(function (response) {
                if (response.data.oUrl) {
                    $scope.datas.groupPicFile = response.data.oUrl + '?' + (new Date()).getTime();
                    utils.localData('groupPicFile', response.data.oUrl);
                } else {
                    $scope.datas.groupPicFile = 'src/img/logoDefault.jpg' + '?' + (new Date()).getTime();
                    utils.localData('groupPicFile', null);
                }
                console.log(creatorId);
                console.log(certType);
                console.log(fileName);
                console.log(response);
                file.result = '修改成功！';
                toaster.pop('success', null, '头像修改成功！');
            });
            file.upload.error(function (response) {
                console.log(response);
                $scope.authError = '修改失败！';
                toaster.pop('error', null, '修改失败！');
            });
        };
    }])