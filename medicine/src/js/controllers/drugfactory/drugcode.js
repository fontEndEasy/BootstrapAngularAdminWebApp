'use strict';
app.controller('DrugCodeController', function($rootScope, $scope, $state, $http, $compile, utils, modal) {

    var userData = app.getUserData();

    $scope.page = 1;
    $scope.page_size = 10;
    $scope.isCheckAll = false;
    $scope.drug_store = '';
    $scope.drug_mc = '';

    // 换页
    $scope.pageChanged = function() {
        $scope.isCheckAll = false;
        $scope.getCheckCodeList($scope.page, $scope.page_size);
    };
    // 获取药检码列表
    getCheckCodeList();

    function getCheckCodeList(page, page_size, drug_store, drug_mc) {

        var filter = null;
        if ($scope.drug_store) {
            filter = 'drug_store$name=' + '%' + $scope.drug_store + '%';
            if ($scope.drug_mc)
                filter = filter + '&&drug_mc=' + '%' + $scope.drug_mc + '%';
        } else if ($scope.drug_mc) {
            filter = 'drug_mc=' + '%' + $scope.drug_mc + '%';
            if ($scope.drug_store)
                filter = filter + '&&drug_store$name=' + '%' + $scope.drug_store + '%';
        }

        $http({
            url: app.urlRoot + 'api/invoke/' + utils.localData('yy_access_token') + '/c_drug_mc_manage.select',
            method: 'post',
            data: {
                // drug_store: userData.for_api_login.company.id,
                __PAGE__: page || $scope.page || 1,
                __PAGE_SIZE__: page_size || $scope.page_size || 10,
                __FILTER__: filter
            }
        }).then(function(resp) {
            resp = resp.data;
            if (resp.info_list) {
                $scope.checkCodeList = resp.info_list;
                $scope.page_count = resp.total;
            } else if (resp['#message']) {
                window.wxc.xcConfirm(resp['#message'], window.wxc.xcConfirm.typeEnum.error);
            } else {
                window.wxc.xcConfirm('获取数据失败', window.wxc.xcConfirm.typeEnum.error);
            }
        }, function(x) {
            console.error(x.statusText);
        });
    };
    $scope.getCheckCodeList = getCheckCodeList;

    // 全选
    $scope.checkAll = function() {

        var isCheck = false;

        if ($scope.isCheckAll)
            isCheck = true;
        else
            isCheck = false;

        angular.forEach($scope.checkCodeList, function(file) {
            file.isCheck = isCheck;
        })

    };

    // 单选
    $scope.checkOne = function() {
        for (var i = 0; i < $scope.checkCodeList.length; i++) {

            // 只有一个
            if ($scope.checkCodeList.length == 1) {
                if ($scope.checkCodeList[i].isCheck) {
                    $scope.isCheckAll = true;
                } else {
                    $scope.isCheckAll = false;
                }
                break;
            }

            if (!$scope.checkCodeList[i].isCheck) {
                $scope.isCheckAll = false;
                break;
            }

            // 最后一个
            if (i == $scope.checkCodeList.length - 1) {
                if ($scope.checkCodeList[i].isCheck)
                    $scope.isCheckAll = true;
                break;
            }
        }
    };

});
