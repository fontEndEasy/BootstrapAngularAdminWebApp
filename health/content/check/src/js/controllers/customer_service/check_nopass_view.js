'use strict';

app.controller('CheckNopassView', ['$scope', '$http', '$state', '$rootScope', 'utils',
    function ($scope, $http, $state, $rootScope, utils) {
        $scope.authError = null;
        $scope.viewData = {};
        $scope.viewData.doctorPortrait = $rootScope.curDoctorPic || utils.localData('curDoctorPic');
        $scope.viewData.isDoctor = false;
        var id = '';
        if ($scope.details) {
            id = $scope.details.id;
            if (!utils.localData('idVal', id)) {
                console.error('数据未保存！');
            }
        } else {
            id = utils.localData('idVal');
            if (!id) {
                console.error('无有效数据！');
                return;
            }
        }

        // 获取要审核的医生数据
        if (id) {
            $http({
                url: app.url.admin.check.getDoctor,
                data: {
                    id: id,
                    access_token: app.url.access_token
                },
                method: 'POST'
            }).then(function (dt) {
                if (dt.data.resultCode !== 1) {
                    $scope.authError = '获取数据失败！';
                    return;
                }
                dt = dt.data.data;
                var date = dt.licenseExpire;
                if (date) {
                    date = new Date(dt.licenseExpire);
                    var _y = date.getFullYear();
                    var _m = date.getMonth() + 1;
                    var _d = date.getDate();
                }
                $scope.viewData = {
                    name: dt.name || '--',
                    userId: dt.userId || '--',
                    doctorNum: dt.doctorNum || '--',
                    hospital: dt.hospital || '--',
                    departments: dt.departments || '--',
                    title: dt.title || '--',
                    telephone: dt.telephone || '--',
                    status: dt.status == 3 ? '未通过' : dt.status == 1 ? '已通过' : '待审核',
                    remark: dt.remark || '--',
                    checker: dt.checker || '--',
                    licenseExpire: date ? _y + ' 年 ' + _m + ' 月 ' + _d + ' 日' : '--',
                    licenseNum: dt.licenseNum || '--',
                    isDoctor: dt.userType == '3' ? true : false
                }
            });

            // 获取要医生证件图片
            $http.get(app.url.user.getDoctorFile + '?' + $.param({
                    doctorId: id,
                    type: 5,
                    access_token: app.url.access_token
                })
            ).then(function (dt) {
                dt = dt.data.data;
                if (dt && dt.length > 0) {
                    $scope.imgs = [];
                    for(var i=0; i<dt.length; i++){
                        $scope.imgs.push(dt[i].url);
                    }
                } else {
                    $scope.imgs = false;
                }
            });
        }

        // 不操作返回
        $scope.return = function () {
            $rootScope.ids = [];
            window.history.back();
        };

        setTimeout(function () {
            var preview = $('#gl_preview img');
            var points = $('#gl_point a');
            preview.attr('src', points.eq(0).find('img').addClass('cur-img').attr('src'));
            points.click(function () {
                var _img = $(this).find('img');
                preview.attr('src', _img.attr('src'));
                _img.addClass('cur-img');
                $(this).siblings().find('img').removeClass('cur-img');
            });
        }, 500);
    }
]);