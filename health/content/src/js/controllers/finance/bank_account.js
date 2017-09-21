'use strict';

app.controller('BankAccount', ['$rootScope', '$scope', '$state', '$timeout', '$http', 'utils', 'modal', '$modal',
    function ($rootScope, $scope, $state, $timeout, $http, utils, modal, $modal) {

    var groupId = utils.localData('curGroupId');

    $scope.bankAccount = [];
    $rootScope.canAddMore = true;

    $http({
        url: app.url.finance.getGroupBanks,
        method: 'post',
        data: {
            access_token: app.url.access_token,
            groupId: groupId
        }
    }).then(function(resp){
        if(resp.data.resultCode == '1'){
            $scope.bankAccount = resp.data.data;
            if($scope.bankAccount.length !== 0){
                $rootScope.canAddMore = false;
            }else{
                $rootScope.canAddMore = true;
            }
        }
    });

    // 查看某一信息
    $scope.seeDetails = function (id) {
        if (id) {
            $('#doctor_details').removeClass('hide');
            $rootScope.winVisable = true;
        }
    };

    $scope.setDefault = function (idx, flg) {

        $http({
            url: app.url.finance.setBankStatus,
            method: 'post',
            data: {
                access_token: app.url.access_token,
                id: $scope.bankAccount[idx].id,
                isDefault: true
            }
        }).then(function(resp){
            if(resp.data.resultCode == '1'){
                if(!flg){
                    modal.toast.success('设置成功！');
                }
                for(var i=0; i<$scope.bankAccount.length; i++){
                    if(i !== idx){
                        $scope.bankAccount[i].isDefault = false;
                    }
                }
                $scope.bankAccount[idx].isDefault = true;
            }
        });
    };

    $scope.remove = function (idx) {
        if($scope.bankAccount.length === 1){
            //modal.toast.warn('必须保留至少一个卡号！');
            //return;
        }
        modal.confirm('删除银行卡', '您确定删除该银行卡吗？',function(){
            $http({
                url: app.url.finance.deleteBankCard,
                method: 'post',
                data: {
                    access_token: app.url.access_token,
                    id: $scope.bankAccount[idx].id
                }
            }).then(function(resp){
                if(resp.data.resultCode == '1'){
                    modal.toast.success('删除成功！');
                    if (idx || idx === 0) {
                        $scope.bankAccount.splice(idx,1);
                    }
                    if($scope.bankAccount.length !== 0){
                        $rootScope.canAddMore = false;
                    }else{
                        $rootScope.canAddMore = true;
                    }
                    //$scope.setDefault(0, true);
                }
            });
        });
    };

    var modalInstance;
    $scope.addAccount = function () {
        modalInstance = $modal.open({
            animation: true,
            templateUrl: 'addBackAccount.html',
            controller: 'AddBankAccount',
            size: 'md',
            resolve: {
                item: function() {
                    return $scope.curGroupId;
                }
            }
        });
    };

}]);


////////////////////////////////////////////////////////////////////////////////

app.controller('AddBankAccount', function($scope, $rootScope, $modalInstance, $http, item, modal) {
    $scope.account = {};
    var groupId = localStorage.getItem('curGroupId');

    // 下拉框 chosen
    function initChosen(dt) {
        var select = $('#bank_list');
        var len = dt.length;
        var tmp = $('<select></select>');
        tmp.append('<option>请选择</option>');
        for (var i = 0; i < len; i++) {
            var opt = $('<option data-id="' + dt[i]['id'] + '">' + dt[i]['bankName'] + '</option>');
            tmp.append(opt);
        }
        select.html(tmp.html());
        select.on('change', function (e) {
            $scope.account.bankId = dt[$(this)[0].selectedIndex].id;
            $scope.account.bankName = $(this).val();
        });
    }

    // 获取银行列表
    $http({
        url: app.url.finance.getBanks,
        method: 'post',
        data: {
            access_token: app.url.access_token
        }
    }).then(function(resp){
        if(resp.data.resultCode == '1'){
            initChosen(resp.data.data);
        }
    });

    $scope.confirm = function () {

        $http({
            url: app.url.finance.addGroupBankCard,
            method: 'post',
            data: {
                access_token: app.url.access_token,
                groupId: groupId,
                bankNo: $scope.account.bankNo,
                bankName: $scope.account.bankName,
                //bankId: $scope.account.bankId,
                //subBank: $scope.account.subBank,
                isDefault: $scope.account.isDefault,
            }
        }).then(function(resp){
            if(resp.data.resultCode == '1'){
                modal.toast.success('添加成功！');
                //item.push($scope.account);
                if(resp.data.data){
                    item.push(resp.data.data);
                }else{
                    item.push($scope.account);
                }
                if($scope.account.isDefault){
                    $scope.setDefault(item.length - 1);
                }
                $rootScope.canAddMore = false;
                $modalInstance.dismiss('cancel');
            }else{
                modal.toast.warn(resp.data.resultMsg);
            }
        });
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

    $scope.setDefault = function (idx) {
        for(var i=0; i<item.length; i++){
            if(i !== idx){
                item[i].isDefault = false;
            }
        }
        item[idx].isDefault = true;
    };
});