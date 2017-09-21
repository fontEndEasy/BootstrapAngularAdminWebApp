'use strict';
app.controller('joinstoremanager', function ($rootScope, $scope, $state, $timeout, $http, utils) {
    var url = app.url.yiliao.getAllData,
        container = $('#dialog_container'),
        cnt_list = $('#cnt_list_apportion'),
        dt = null,
        html = $('html'),
        list_wrapper = $('#cnt_list_department'),
        groupId = utils.localData('curGroupId'),
        parentId = null;

    $scope.formData = {};
    html.css('overflow', 'hidden');

    //添加门店
    $scope.addStore= function () {
        $state.go('app.join_store_manager_add');
    };
    // 执行操作
    $scope.save = function () {
    	var tel = $scope.tel;
    	var name = $scope.name;
    	if(name==''||name==null){
    		alert("店员名称不能为空!");
    		return;
    	}
    	if(tel.length==0){
    		alert("手机号码不能为空！");
    		return;
    	}
        if(!isPhoneNum(tel)){
            alert("手机号码格式不匹配！");
            return;
        }
        $http({
            url: app.url.save_for_employee,
            method: 'post',            
            data: {
                name:$scope.name,
                mobile_phone:$scope.tel,
                password:123456,
                roles:'shop_assistant',
                remark: $scope.remark
            },
            headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
        }).then(function (resp) {
            if (typeof resp.data['#message'] == "undefined") {
                var txt=  "保存成功";
                window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.success);
            }else{
                window.wxc.xcConfirm(resp.data['#message'], window.wxc.xcConfirm.typeEnum.error);
            }
        });
    };


    function isPhoneNum (tel){
        // return /^1(3[0-9]|4[57]|5[0-35-9]|7[678]|8[0-9])\d{8}$/.test(tel);
        return /^\d{11}$/.test(tel);
    }
});