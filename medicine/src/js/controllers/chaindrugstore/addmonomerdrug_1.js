'use strict';

app.controller('ChainContactsAdd', function ($rootScope, $scope, $state, $timeout, $http, utils) {
    var html = $('html');
    $scope.formData = {};
    html.css('overflow', 'hidden');
    // 执行操作
    $scope.ContactsAddSave = function () {
    	var tel = $scope.tel;
    	var name = $scope.name;
    	if(name==''||name==null){
    		var txt=  "店员名称不能为空！";
    		window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.warning);
    		return;
    	}
    	if(tel==''){
    		var txt=  "手机号码不能为空！";
    		window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.warning);
    		return;
    	}
        if(!isPhoneNum(tel)){
            var txt=  "手机号码格式不匹配！";
            window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.warning);
            return;
        }
        $http({
            url: app.url.save_for_employee,
            method: 'post',            
            data: {
                name:$scope.name,
                mobile_phone:$scope.tel,
                password:"123456",
                roles:'shop_assistant',
                remark: $scope.remark
            },
            headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
        }).then(function (resp) {
            if (typeof resp.data['#message'] == "undefined") {
                var txt=  "保存成功,默认密码为123456";
        		window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.success,{"onOk":function(){
                    $scope.ContactsAddCancel();
                    $rootScope.$emit('lister_chaindrugstore_list');
                }});
            }else{
         		window.wxc.xcConfirm(resp.data['#message'], window.wxc.xcConfirm.typeEnum.error);
            }
        });
    };
    function isPhoneNum (tel){
        return /^\d{11}$/.test(tel);
    }
    // 模态框退出
    $scope.ContactsAddCancel = function () {
        $state.go('app.chaindrugstore',{},{});
        html.css('overflow', 'auto');
    };
});