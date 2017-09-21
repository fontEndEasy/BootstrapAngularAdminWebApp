'use strict';

app.controller('EnterpriseIdentify', ['$rootScope', '$scope', '$http', '$timeout', '$state', '$compile', 'Upload', 'utils',
    function($rootScope, $scope, $http, $timeout, $state, $compile, Upload, utils) {

        var groupId = utils.localData('curGroupId');
        var userId = $scope.user.user_id ||  utils.localData('user_id');
        var certStatus = $rootScope.group.certStatus || utils.localData('certStatus');

        $scope.viewData = {};
        $scope.formData = {};

        switch (certStatus){
            case 'NC':
                $scope.isIdentified = false;
                $scope.isIdentifying = false;
                break;
            case 'A':
                $scope.isIdentified = true;
                $scope.isIdentifying = false;
                break;
            case 'NP':
                $scope.isIdentified = true;
                $scope.isIdentifying = false;
                break;
            case 'P':
                $scope.isIdentified = true;
                $scope.isIdentifying = false;
                break;
            default: break;
        }

        if($scope.isIdentified && !$scope.isIdentifying){
            $http({
                url: app.url.yiliao.getGroupCert,
                method: 'post',
                data: {
                    access_token: app.url.access_token,
                    groupId: $scope.groupId || utils.localData('curGroupId')
                }
            }).then(function(resp) {
                if (resp.data.resultCode === 1) {
                    if (resp.data.data && resp.data.data.groupCert) {
                        $scope.companyName = resp.data.data.groupCert.companyName;
                        $scope.orgCode = resp.data.data.groupCert.orgCode;
                        $scope.license = resp.data.data.groupCert.license;
                        $scope.corporation = resp.data.data.groupCert.corporation;
                        $scope.businessScope = resp.data.data.groupCert.businessScope;
                        $scope.accountName = resp.data.data.groupCert.accountName;
                        $scope.openBank = resp.data.data.groupCert.openBank;
                        $scope.bankAcct = resp.data.data.groupCert.bankAcct;
                        $scope.adminName = resp.data.data.groupCert.adminName;
                        $scope.idNo = resp.data.data.groupCert.idNo;
                        $scope.adminTel = resp.data.data.groupCert.adminTel;
                        $scope.idImage = resp.data.data.groupCert.idImage;
                        $scope.orgCodeImage = resp.data.data.groupCert.orgCodeImage;
                        $scope.licenseImage = resp.data.data.groupCert.licenseImage;
                        $scope.remarks = resp.data.data.groupCert.remarks;
                    }else{
                        modal.toast.warn('未提交认证资料！');
                    }
                } else {
                    $scope.authError = resp.data.resultMsg;
                }
            }, function(resp) {
                $scope.authError = resp.data.resultMsg;
            });

            $scope.closeTipWin = function(){
                $('#btn_close').parents('.idfy-result').remove();
            };
        }

        $scope.identify = function() {
            //$('#instruction_panel').addClass('hide');
            //$('#identify_panel').removeClass('hide');
            //$('#instruction_panel').addClass('animating fade-out-up');
            $scope.isIdentified = false;
            $scope.isIdentifying = true;
        };

        //var company = JSON.parse(localStorage.getItem('company'));
        /*        if (true) {
                    $scope.fromState = false;

        /!*            $scope.coName = company.name;
                    $scope.coInfo = company.description;
                    $scope.ctrlName = company.corporation;
                    $scope.licNum = company.license;*!/

                    //获取图片
                    var imgUrl = app.url.upload.getCertPath + '?access_token=' + app.url.access_token + '&groupId=' + groupId + '&certType=enterpriseImg';
                    getImg(imgUrl);
                    //$scope.submitInfo = updateEnterprise;
                    $scope.submitInfo = reEnterprise;
                } else {
                    $scope.submitInfo = reEnterprise;
                }*/

        //修改公司
        function updateEnterprise() {
            $http.post(app.url.yiliao.updateByCompany, {
                access_token: app.url.access_token,
                id: company.id,
                name: $scope.coName,
                description: $scope.coInfo,
                corporation: $scope.ctrlName,
                license: $scope.licNum,
                status: 'A'
            }).
            success(function(data) {
                console.log(data.data);
                utils.localData('company', JSON.stringify(data.data));
                return $state.go('access.enterprise_verify', {}, {
                    reload: true
                });
            }).
            error(function(data) {
                $scope.authError = data.resultMsg;
            });
        }

        //获取图片
        function getImg(imgUrl) {
            $http.get(imgUrl).
            success(function(data) {
                console.log(data);
                if (data.resultCode === 1) {
                    for (var i = data.data.length - 1; i >= 0; i--) {
                        if (data.data[i].indexOf("usrPic") > 0)
                            $scope.usrPicUrl = data.data[i];
                        if (data.data[i].indexOf("orgCodePic") > 0)
                            $scope.orgCodePicUrl = data.data[i];
                        if (data.data[i].indexOf("licPic") > 0)
                            $scope.licPicUrl = data.data[i];
                    };
                } else {
                    $scope.authError = data.resultMsg;
                }
            }).
            error(function(data) {
                $scope.authError = data.resultMsg;
            });
        }


        var imgUrl = app.url.upload.getCertPath + '?access_token=' + app.url.access_token + '&userId=' + userId + '&certType=' + groupId;
        // getImg(imgUrl);

        // 提交认证资料
        $scope.submitInfo = function() {
            $http({
                url: app.url.yiliao.submitCert,
                method: 'post',
                data: {
                    access_token: app.url.access_token,
                    groupId: $scope.groupId || utils.localData('curGroupId'),
                    doctorId: $scope.user.userId || utils.localData('user_id'),
                    companyName: $scope.companyName,
                    orgCode: $scope.orgCode,
                    license: $scope.license,
                    corporation: $scope.corporation,
                    businessScope: $scope.businessScope,
                    accountName: $scope.accountName,
                    openBank: $scope.openBank,
                    bankAcct: $scope.bankAcct,
                    adminName: $scope.adminName,
                    idNo: $scope.idNo,
                    adminTel: $scope.adminTel,
                    idImage: $scope.idImage,
                    orgCodeImage: $scope.orgCodeImage,
                    licenseImage: $scope.licenseImage
                }
            }).then(function(resp) {
                if (resp.data.resultCode === 1) {
                    $scope.isIdentifying = false;
                    $scope.isIdentified = true;

                    $rootScope.notCheck = false;
                    $rootScope.waitting = true;
                    $rootScope.notPass = false;
                    $rootScope.passed = false;

                    utils.localData('certStatus', 'A');

                    $state.reload();
                } else {
                    $scope.authError = resp.data.resultMsg;
                }
            }, function(resp) {
                $scope.authError = resp.data.resultMsg;
            });
        };

        $scope.$watch('usrPic', function(files) {
            $scope.idImage = '';
            goUpload(files, 'usrPic', $scope.idImage);
        });
        $scope.$watch('orgCodePic', function(files) {
            $scope.orgCodeImage = '';
            goUpload(files, 'orgCodePic', $scope.orgCodeImage);
        });
        $scope.$watch('licPic', function(files) {
            $scope.licenseImage = '';
            goUpload(files, 'licPic', $scope.licenseImage);
        });

        //图片上传
        function goUpload(files, fileName) {
            if (files != null) {
                if (!angular.isArray(files)) {
                    files = [files];
                }
                for (var i = 0; i < files.length; i++) {
                    $scope.errorMsg = null;
                    upload(files[i], fileName);
                }
            }
        };

        function upload(file, fileName) {
            file.upload = Upload.upload({
                //url: app.urlFile + '/cert',
                url: app.url.upload.upLoadImg,
                file: file,
                fileName: fileName,
                fields: {
                    'userId': userId,
                    'access_token': app.url.access_token,
                    'certType': groupId,
                    'fileName': fileName
                }
            });
            file.upload.progress(function(evt) {
                file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
            file.upload.success(function(response) {
                file.result = '上传成功！';
                if(fileName === 'usrPic'){
                    $scope.idImage = response.data.oUrl;
                }else if(fileName === 'orgCodePic'){
                    $scope.orgCodeImage = response.data.oUrl;
                }else{
                    $scope.licenseImage = response.data.oUrl;
                }
            });
            file.upload.error(function(response) {
                $scope.authError = '上传失败！';
            });
        };
    }
]);
