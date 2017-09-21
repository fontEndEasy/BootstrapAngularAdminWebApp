'use strict';

app.controller('set_Company', function ($rootScope, $scope, $state, $http, $compile, $stateParams,utils, modal) {
	// 模态框退出
	$scope.cancel = function () {
	    $state.go('app.storehq',{},{});
	};

	//新增一名店长信息
	//执行操作
	$scope.save = function () {
		//新选中的武林盟主
		var tel = $scope.tel;
		var name = $scope.name;
		if(name==''||name==null){
			var txt=  "店长名称不能为空！";
			window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.warning);
			return;
		}
		var storename = $scope.storename;
		if(storename==''||storename==null){
			var txt=  "店名称不能为空！";
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
	        url:app.url.create_chain_HQ,
	        method: 'post',            
	        data: {
	        	name:storename,
	        	name_shop_manager:name,
	        	mobile_phone:tel
	        }
	    }).then(function (resp) {
	        if (typeof resp.data['#message'] == "undefined") {
	        	var txt=  "创建门店成功";
	    		window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.success,{onOk:function(v){
	                 $scope.cancel();
	                 $rootScope.$emit('lister_storehq_list');
	             }});
	        }else{
	     		window.wxc.xcConfirm(resp.data['#message'], window.wxc.xcConfirm.typeEnum.error);
	        }
	    });
	};

	function isPhoneNum (tel){
        return /^\d{11}$/.test(tel);
    }


});
