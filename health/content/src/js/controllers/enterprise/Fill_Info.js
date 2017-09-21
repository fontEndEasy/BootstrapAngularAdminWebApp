'use strict';

// 公司申请控制器
app.controller('FillInfoController', ['$scope', '$http', '$timeout', '$state', '$compile', 'Upload', 'utils',
    function ($scope, $http, $timeout, $state, $compile, Upload, utils) {
        var company = JSON.parse(localStorage.getItem('company'));
        if (company) {
            $scope.fromState = false;
            console.log(company);
            $scope.coName = company.name;
            $scope.coInfo = company.description;
            $scope.ctrlName = company.corporation;
            $scope.licNum = company.license;
            //获取图片
            var imgUrl = app.url.upload.getCertPath + '?access_token=' + app.url.access_token + '&userId=' + company.creator + '&certType=enterpriseImg';
            getImg(imgUrl);
            $scope.submitInfo = updateEnterprise;
        } else {
            $scope.submitInfo = reEnterprise;
        }
        //修改公司
        function updateEnterprise() {
            console.log(company);
            $http.post(app.url.yiliao.updateByCompany, {
                access_token: app.url.access_token,
                id: company.id,
                name: $scope.coName,
                description: $scope.coInfo,
                corporation: $scope.ctrlName,
                license: $scope.licNum,
                status: 'A'
            }).
            success(function (data) {
                console.log(data.data);
                utils.localData('company', JSON.stringify(data.data));
                return $state.go('access.enterprise_verify', {}, {reload: true});
            }).
            error(function (data) {
                $scope.authError = data.resultMsg;
            });
        }

        //获取图片
        function getImg(imgUrl) {
            $http.get(imgUrl).
            success(function (data) {
                console.log(data);
                if (data.resultCode === 1) {
                    for (var i = data.data.length - 1; i >= 0; i--) {
                        if (data.data[i].indexOf("usrPic") > 0)
                            $scope.usrPicUrl = data.data[i];
                        if (data.data[i].indexOf("licPic") > 0)
                            $scope.licPicUrl = data.data[i];
                        if (data.data[i].indexOf("ctrlPic") > 0)
                            $scope.ctrlPicUrl = data.data[i];
                    };
                } else {
                    $scope.authError = data.resultMsg;
                }
            }).
            error(function (data) {
                $scope.authError = data.resultMsg;
            });
        }

        //注册公司
        function reEnterprise() {
            $http.post(app.url.yiliao.fillInfo, {
                access_token: app.url.access_token,
                name: $scope.coName,
                description: $scope.coInfo,
                corporation: $scope.ctrlName,
                license: $scope.licNum
            }).
            success(function (data) {
                // var company = JSON.parse(localStorage.getItem('company'));
                // console.log(company);
                // if(company&&data.data){
                //     company.status = data.data.status;
                // }
                if (data.resultCode === 1) {
                    utils.localData('company', JSON.stringify(data.data));
                    return $state.go('access.enterprise_verify', {}, {reload: true});
                }
                return $scope.authError = data.resultMsg;
            }).
            error(function (data) {
                $scope.authError = data.resultMsg;
            });
        };
        $scope.$watch('licPic', function (files) {
            goUpload(files, 'licPic');
        });
        $scope.$watch('ctrlPic', function (files) {
            goUpload(files, 'ctrlPic');
        });
        //图片上传
        function goUpload(files, fileName) {
            if (files != null) {
                if (!angular.isArray(files)) {
                    files = [files];
                }
                for (var i = 0; i < files.length; i++) {
                    $scope.errorMsg = null;
                    (function (f, fileName) {
                        upload(f, fileName);
                    })(files[i], fileName);
                }
            }
        };
        function upload(file, fileName) {
            file.upload = Upload.upload({
                url: app.urlFile + '/cert',
                file: file,
                fileName: fileName,
                fields: {
                    'userId': localStorage.getItem('enterprise_id'),
                    'access_token': localStorage.getItem('access_token'),
                    'certType': 'enterpriseImg',
                    'fileName': fileName
                }
            });
            file.upload.progress(function (evt) {
                file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
            file.upload.success(function (response) {
                file.result = '上传成功！';
            });
            file.upload.error(function (response) {
                $scope.authError = '上传失败！';
            });

        };
    }
]);
