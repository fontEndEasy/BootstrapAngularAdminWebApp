'use strict';

app.controller('ContactsAddManager', function ($rootScope, $scope, $state,$stateParams, $timeout, $http, utils) {
    $scope.formData = {};
   //查询职员信息
    $scope.getEmployee = function () {
    $http.get(app.url.get_comEmp_role+"?role=admin", {}).
        success(function (data, status, headers, config) {
             $scope.list = data.companyemployees;
        });
    };
    
	$scope.getEmployee();

	//保存管理员
	$scope.saveManyTimes = function(){
		$scope.fl = true;
		var ids="";
		$("#store_manager_add_table tr input[type=checkbox]").each(function(){
		    if(this.checked){
		    	ids +=$(this).val()+";";
		    }
		}); 
		if(ids==''){
			var txt=  "请勾选管理员！！！";
			window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.warning);
			return false;
		}
		ids =ids.substring(0,ids.length-1);
		var array = ids.split(";");
		
		for(var i=0;i<array.length;i++){
			var companyid =  localStorage.getItem("store_id");
			var employeeid = array[i];
			var role='admin';
			if($scope.fl){
				$http({
					url: app.url.manager_create,
					method: 'post',
					data: {
						company: companyid,
						employee:employeeid,
						role: role
					}
				}).then(function (resp) {
					if(i==array.length){
						if (typeof resp.data['#message']!='undefined') {
							var txt=  "添加管理员失败！！！";
							window.wxc.xcConfirm(resp.data['#message'], window.wxc.xcConfirm.typeEnum.error,{onOk:function(v){
								$scope.cancel();
							}});
							$scope.fl = false;
						}else{
							var txt=  "添加管理员成功！！！";
							window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.success,{onOk:function(v){
								$scope.cancel();
								$rootScope.$emit('lister_store_manager_listManager');
							}});
							
						}
					}
				});
			}
		}
	};
	// 模态框退出
	$scope.cancel = function () {
	    $state.go('app.store_manager',{},{});
	};
});