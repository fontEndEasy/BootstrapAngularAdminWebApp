'use strict';

app.controller('ChargeCtrl', ['$scope', '$http', '$modal', 'toaster','$log',
	function($scope, $http, $modal, toaster,$log) {
		var access_token = localStorage.getItem('access_token');
		var curGroupId = localStorage.getItem('curGroupId');


		var profits_tips = $('#profits_tips'),
            charge_tips = $('#charge_tips'),
            bankAccount_tips = $('#bankAccount_tips'),
            txt_profits = profits_tips.html(),
            txt_charges = charge_tips.html(),
            txt_account = bankAccount_tips.html(),
            profits = [
                'clinicParentProfit',
                'clinicGroupProfit',
                'textParentProfit',
                'textGroupProfit',
                'phoneParentProfit',
                'phoneGroupProfit',
                'carePlanParentProfit',
                'carePlanGroupProfit',
                'consultationParentProfit',
                'consultationGroupProfit'
            ],
            charges = [
                'charge.textMin',
                'charge.textMax',
                'charge.phoneMin',
                'charge.phoneMax',
                'charge.carePlanMin',
                'charge.carePlanMax'
            ],
            account = [
                //'account.bankName',
                'account.bankId',
                'account.subBank',
                'account.bankNo',
                'account.userRealName',
                'account.personNo'
            ],
            watch_profit,
            watch_charge,
            watch_account,
            profitInfo = [],
            priceInfo = [],
            bankInfo = [],
            profitInfoChanged = false,
            priceInfoChanged = false,
            bankInfoChanged = false,
            canSubmitProfit = false,
            canSubmitPrice= false,
            canSubmitBank = false;

        $scope.account = {};
        //$scope.account.bankName = '12233333366666';

        // 获取及初始化相关数据
        (function(){
            getGroupProfits()       // 获取集团抽成数据
            getPriceInfo();         // 获取价格范围数据
            //getBankList();        // 获取银行列表
            getBankInfo();          // 获取银行卡信息
        })();


        // 银行列表下拉框 chosen
        function initChosen(dt) {
            var select = $('#bank_list').html('');
            var len = dt.length;
            for (var i = 0; i < len; i++) {
                var opt = $('<option value="' + dt[i]['id'] + '">' + dt[i]['bankName'] + '</option>');
                select.append(opt);
                if(i === 0){
                    $scope.account.bankName = dt[i]['bankName'];
                }
            }
            select.on('change', function (e) {
                $scope.account.bankId = dt[$(this)[0].selectedIndex].id;
                $scope.account.bankName = dt[$(this)[0].selectedIndex].bankName;
            });
        }

        // 获取集团抽成数据
        function getGroupProfits(){
            $http({
                url: app.url.yiliao.getGroupInfo,
                method: 'post',
                data: {
                    access_token: app.url.access_token,
                    id: curGroupId
                }
            }).then(function(resp){
                if(resp.data.resultCode == '1'){
                    monitorOfProfitInfo();
                    if(!resp.data.data || !resp.data.data.config) return;
                    $scope.textParentProfit = resp.data.data.config.textParentProfit;
                    $scope.textGroupProfit = resp.data.data.config.textGroupProfit;
                    $scope.phoneParentProfit = resp.data.data.config.phoneParentProfit;
                    $scope.phoneGroupProfit = resp.data.data.config.phoneGroupProfit;
                    $scope.carePlanParentProfit = resp.data.data.config.carePlanParentProfit;
                    $scope.carePlanGroupProfit = resp.data.data.config.carePlanGroupProfit;
                    $scope.clinicParentProfit = resp.data.data.config.clinicParentProfit;
                    $scope.clinicGroupProfit = resp.data.data.config.clinicGroupProfit;
                    $scope.consultationParentProfit = resp.data.data.config.consultationParentProfit;
                    $scope.consultationGroupProfit = resp.data.data.config.consultationGroupProfit;
                    profitInfo.push($scope.clinicParentProfit, $scope.clinicGroupProfit, $scope.textParentProfit,
                        $scope.textGroupProfit, $scope.phoneParentProfit, $scope.phoneGroupProfit,
                        $scope.carePlanParentProfit, $scope.carePlanGroupProfit,
                        $scope.consultationParentProfit, $scope.consultationGroupProfit);

                    //monitorOfProfitInfo();
                }else{
                    console.error('更新抽成比例出错：' + resp.data.resultMsg);
                }
            });
        }

        // 获取银行列表
        function getBankList(){
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
        }

        // 获取银行卡信息
        function getBankInfo(){
            $http({
                url: app.url.finance.getGroupBanks,
                method: 'post',
                data: {
                    access_token: app.url.access_token,
                    groupId: curGroupId
                }
            }).then(function(resp){
                //$scope.account.bankName = resp.data.data[0].bankName;
                monitorOfBankInfo();
                if(!resp.data.data || !resp.data.data.length > 0){
                    return;
                }
                $scope.account.bankId = resp.data.data[0].id;
                $scope.account.subBank = resp.data.data[0].subBank;
                $scope.account.bankNo = resp.data.data[0].bankNo;
                $scope.account.userRealName = resp.data.data[0].userRealName;
                $scope.account.personNo = resp.data.data[0].personNo;
                bankInfo.push($scope.account.bankId, $scope.account.subBank, $scope.account.bankNo,
                    $scope.account.userRealName, $scope.account.personNo);

                //monitorOfBankInfo();
            });
        }

        function monitorOfProfitInfo() {
            watch_profit = $scope.$watchGroup(profits, function (newValue, oldValue) {
                var n = 5;
                while (n--) {
                    if (((newValue[2 * n + 1] !== undefined) && isNaN(newValue[2 * n + 1] * 1)) || ((newValue[2 * n] !== undefined) && isNaN(newValue[2 * n] * 1))) {
                        profits_tips.addClass('text-danger').html('抽成比例必须为纯数字！');
                        $scope.settingsForm.$invalid = true;
                        canSubmitProfit = false;
                        break;
                    } else {
                        if ((newValue[2 * n + 1] * 1) > 100 || (newValue[2 * n] * 1) > 100) {
                            profits_tips.addClass('text-danger').html('单个抽成比例不能大于100%！');
                            $scope.settingsForm.$invalid = true;
                            canSubmitProfit = false;
                            break;
                        } else if ((newValue[2 * n + 1] * 1) < 0 || (newValue[2 * n] * 1) < 0) {
                            profits_tips.addClass('text-danger').html('单个抽成比例不能小于0！');
                            $scope.settingsForm.$invalid = true;
                            canSubmitProfit = false;
                            break;
                        } else {
                            if ((newValue[2 * n + 1] * 1) + (newValue[2 * n] * 1) > 100) {
                                profits_tips.addClass('text-danger').html('集团与上级抽成比例之和不能大于100%！');
                                $scope.settingsForm.$invalid = true;
                                canSubmitProfit = false;
                                break;
                            } else {
                                profits_tips.removeClass('text-danger').html(txt_profits);
                                canSubmitProfit = true;
                            }
                        }
                    }
                }

                if(!canSubmitProfit || !canSubmitPrice || !canSubmitBank){
                    $scope.settingsForm.$invalid = true;
                }

                // 检测抽成比例有没有改动
                var len = newValue.length;
                for (var i = 0; i < len; i++) {
                    if (newValue[i] !== profitInfo[i]) {
                        profitInfoChanged = true;
                        break;
                    } else {
                        profitInfoChanged = false;
                    }
                }
            });
        }

        function monitorOfPriceInfo() {
            watch_charge = $scope.$watchGroup(charges, function (newValue, oldValue) {
                var n = 3;
                while (n--) {
                    if ((isNaN(newValue[2 * n + 1] * 1)) || (isNaN(newValue[2 * n] * 1))) {
                        charge_tips.addClass('text-danger').html('价格必须为纯数字！');
                        $scope.settingsForm.$invalid = true;
                        canSubmitPrice = false;
                        break;
                    } else {
                        if ((newValue[2 * n + 1] * 1) < 0 || (newValue[2 * n] * 1) < 0) {
                            charge_tips.addClass('text-danger').html('价格不能小于0！');
                            $scope.settingsForm.$invalid = true;
                            canSubmitPrice = false;
                            break;
                        } else if ((newValue[2 * n + 1] * 1) < (newValue[2 * n] * 1)) {
                            charge_tips.addClass('text-danger').html('最低价不能大于最高价！');
                            $scope.settingsForm.$invalid = true;
                            canSubmitPrice = false;
                            break;
                        } else {
                            if ((newValue[2 * n + 1] * 1) > 1000000) {
                                charge_tips.addClass('text-danger').html('最高价不能大于1,000,000！');
                                $scope.settingsForm.$invalid = true;
                                canSubmitPrice = false;
                                break;
                            } else {
                                charge_tips.removeClass('text-danger').html(txt_charges);
                                canSubmitPrice = true;
                            }
                        }
                    }
                }

                if(!canSubmitProfit || !canSubmitPrice || !canSubmitBank){
                    $scope.settingsForm.$invalid = true;
                }

                // 检测价格范围有没有改动
                var len = newValue.length;
                for (var i = 0; i < len; i++) {
                    if (newValue[i] !== priceInfo[i]) {
                        priceInfoChanged = true;
                        break;
                    } else {
                        priceInfoChanged = false;
                    }
                }
            });
        }

        function monitorOfBankInfo(){
            watch_account = $scope.$watchGroup(account, function(newValue, oldValue){
                if(newValue[2] !== undefined && isNaN(newValue[2])){
                    bankAccount_tips.addClass('text-danger').html('卡号必须为纯数字！');
                    $scope.settingsForm.$invalid = true;
                    canSubmitBank = false;
                }else if((newValue[0] === undefined || isNaN(newValue[0])) && oldValue[0] !== undefined){
                    //$scope.settingsForm.$invalid = true;
                    //bankAccount_tips.addClass('text-danger').html('必须选择所属银行！');
                }else{
                    if(newValue[2] !== undefined && (newValue[2].length != 16 && newValue[2].length != 19)){
                        $scope.settingsForm.$invalid = true;
                        canSubmitBank = false;
                        bankAccount_tips.addClass('text-danger').html('卡号长度必须为16或19位！');
                    }else{
                        bankAccount_tips.removeClass('text-danger').html(txt_account);
                        canSubmitBank = true;
                    }
                }

                if(!canSubmitProfit || !canSubmitPrice || !canSubmitBank){
                    $scope.settingsForm.$invalid = true;
                }

                // 检测银行卡信息有没有改动
                var len = newValue.length;
                for(var i=0; i<len; i++){
                    if(newValue[i] !== bankInfo[i]){
                        bankInfoChanged = true;
                        break;
                    }else{
                        bankInfoChanged = false;
                    }
                }
            });
        }

        // 更新银行卡号
        $scope.updateBankAccount = function () {
            if(!bankInfoChanged) return;

            bankInfoChanged = false;

            $http({
                url: app.url.finance.addGroupBankCard,
                method: 'post',
                data: {
                    access_token: app.url.access_token,
                    groupId: curGroupId,
                    bankNo: $scope.account.bankNo,
                    //bankName: $scope.account.bankName,
                    //bankId: $scope.account.bankId,
                    subBank: $scope.account.subBank,
                    userRealName: $scope.account.userRealName,
                    personNo: $scope.account.personNo,
                    //isDefault: $scope.account.isDefault,
                }
            }).then(function(resp){
                if(resp.data.resultCode == '1'){
                    toaster.pop('success',null,'银行卡号更新成功！');
                }else{
                    toaster.pop('warning',null,resp.data.resultMsg);
                }
            });
        };

        //修改抽成比例
        $scope.updateProfits = function(groupId) {
            if(!profitInfoChanged) return;

            profitInfoChanged = false;

            var _p_a = $scope.textParentProfit;
            var _p_b = $scope.textGroupProfit;
            var _p_c = $scope.phoneParentProfit;
            var _p_d = $scope.phoneGroupProfit;
            var _p_e = $scope.carePlanParentProfit;
            var _p_f = $scope.carePlanGroupProfit;
            var _p_g = $scope.clinicParentProfit;
            var _p_h = $scope.clinicGroupProfit;
            var _p_i = $scope.consultationParentProfit;
            var _p_j = $scope.consultationGroupProfit;

            if(isNaN(_p_a) || isNaN(_p_b) || isNaN(_p_c) || isNaN(_p_d) || isNaN(_p_e) ||
                isNaN(_p_f) || isNaN(_p_g) || isNaN(_p_h) || isNaN(_p_i) || isNaN(_p_j)){
                toaster.pop('warning', null, '抽成比例必须为数字!');
                return;
            }

            $http.post(app.url.yiliao.updateGroupProfit,{
                access_token:app.url.access_token,
                id: groupId,
                'config.textParentProfit':$scope.textParentProfit,
                'config.textGroupProfit':$scope.textGroupProfit,
                'config.phoneParentProfit':$scope.phoneParentProfit,
                'config.phoneGroupProfit':$scope.phoneGroupProfit,
                'config.carePlanParentProfit':$scope.carePlanParentProfit,
                'config.carePlanGroupProfit':$scope.carePlanGroupProfit,
                'config.clinicParentProfit':$scope.clinicParentProfit,
                'config.clinicGroupProfit':$scope.clinicGroupProfit,
                'config.consultationParentProfit':$scope.consultationParentProfit,
                'config.consultationGroupProfit':$scope.consultationGroupProfit
            }).
            success(function (data) {
                if(data.resultCode===1){
                    toaster.pop('success',null,'抽成比例修改成功！');
                }else{
                    toaster.pop('error',null,data.resultMsg);
                }
            }).
            error(function(data) {
                $scope.authError = data.resultMsg;
            });
        };

        //提交按钮事件
        $scope.submit = function () {
            if(!profitInfoChanged && !priceInfoChanged && !bankInfoChanged){
                toaster.pop('warning',null,'未任变更何数据，无需再次保存！');
            }

            $scope.updateProfits(curGroupId);
            $scope.updateCharges();
            $scope.updateBankAccount();
        };

		$scope.updateCharges = function() {
            if(!priceInfoChanged) return;

            priceInfoChanged = false;

            $http.post(app.url.yiliao.setCharge, {
                'access_token': access_token,
                'groupId': curGroupId,
                'textMin': $scope.charge.textMin * 100,
                'textMax': $scope.charge.textMax * 100,
                'phoneMin': $scope.charge.phoneMin * 100,
                'phoneMax': $scope.charge.phoneMax * 100,
                'carePlanMin': $scope.charge.carePlanMin * 100,
                'carePlanMax': $scope.charge.carePlanMax * 100
            }).success(function(data, status, headers, config) {
                if (data.resultCode == 1) {
                    toaster.pop('success','','价格范围修改成功');
                }
                else{
                    toaster.pop('error','',data.resultMsg);
                }
            }).error(function(data, status, headers, config) {
                toaster.pop('error','','价格范围修改失败');
            });
		};

        $scope.charge = {
            textMin: 0,
            textMax: 0,
            phoneMin: 0,
            phoneMax: 0,
            carePlanMin: 0,
            carePlanMax: 0
        };

        function getPriceInfo() {
            $http.post(app.url.yiliao.getCharge, {
                'access_token': access_token,
                'groupId': curGroupId
            }).success(function (data, status, headers, config) {
                if (data.resultCode == 1) {
                    monitorOfPriceInfo();
                    if (data.data) {
                        $scope.charge = {
                            textMin: data.data.textMin / 100,
                            textMax: data.data.textMax / 100,
                            phoneMin: data.data.phoneMin / 100,
                            phoneMax: data.data.phoneMax / 100,
                            //clinicMin: data.data.clinicMin/100,
                            //clinicMax: data.data.clinicMax/100,
                            carePlanMin: data.data.carePlanMin / 100,
                            carePlanMax: data.data.carePlanMax / 100
                        };
                        priceInfo.push($scope.charge.textMin, $scope.charge.textMax, $scope.charge.phoneMin,
                            $scope.charge.phoneMax, $scope.charge.carePlanMin, $scope.charge.carePlanMax);

                        //monitorOfPriceInfo();
                    }
                }
                else {
                    toaster.pop('warning', null, data.resultMsg);
                }
            }).error(function (data, status, headers, config) {
                toaster.pop('error', null, data.resultMsg);
            });
        }
	}
]);

//弹出确认模态框
app.controller('updateModalInstanceCtrl', ['$scope', '$modalInstance', '$http', 'toaster', function($scope, $modalInstance, $http, toaster) {
	$scope.ok = function() {
		$modalInstance.close('ok');
	};

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
}]);