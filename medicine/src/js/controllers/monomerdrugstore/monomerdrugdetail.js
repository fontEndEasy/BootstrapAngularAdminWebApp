'use strict';

app.controller('MonoMerDetail', function ($rootScope, $scope, $state, $timeout, $http,$stateParams, utils) {
    var url = app.url.employee_view;
    var id  = $stateParams.id;//探矿ta
    $scope.isDZ = $stateParams.dz==1?true:false;
    $('html').css("overflow","hidden");
    //根据id查询详情信息
	$scope.getMonomerDetail = function () {
		$http.get(url+'?id='+$stateParams.id).success(function (data, status, headers, config) {
	        $scope.name = data.name;
	        $scope.remark = data.remark;
	        $scope.state = data.state.value;
	        if(data.state.value==0){
	        	$("#yes").attr("checked","checked");
	        	$("#no").removeAttr("checked");
	        }else{
	        	$("#yes").removeAttr("checked");
	        	$("#no").attr("checked","true");
	        }
	        $scope.tel = data['user$mobile_phone'];
	    });
	};

		
	//修改店员信息
	$scope.update = function () {
		var tel =$scope.tel;
		var name = $scope.name;
		var remark = $scope.remark;
		var radio = $('input[name="bm"]:checked').val();
		if(name==''||name==null){
			window.wxc.xcConfirm("店员名称不能为空", window.wxc.xcConfirm.typeEnum.success);
			return;
		}
		if(tel==''){
			window.wxc.xcConfirm("手机号码不能为空", window.wxc.xcConfirm.typeEnum.success);
			return;
		}
		$http({
		    url: app.url.edit_for_company,
		    method: 'post',            
		    data: {
		    	'name':$scope.name,
		        'user$mobile_phone':$scope.tel,
		        'roles':'shop_assistant',
		        'id':$stateParams.id,
		        'state':radio,
		        'remark': $scope.remark
		    }
		}).then(function (resp) {
		    if (typeof resp.data['#message'] == "undefined") {
		        window.wxc.xcConfirm("修改成功", window.wxc.xcConfirm.typeEnum.success,{onOk:function(v){
                    $scope.cancel();
                    $rootScope.$emit('lister_monomerdrugstore_list');
                }});
		    }else{
		        window.wxc.xcConfirm(resp.data['#message'], window.wxc.xcConfirm.typeEnum.warning);
		    }
		 });
	};

	$scope.getMonomerDetail();
	    // 模态框退出
	$scope.cancel = function () {
		$('html').css("overflow","auto");
	    $state.go('app.monomerdrugstore',{}, {'reload':false});
	};
});