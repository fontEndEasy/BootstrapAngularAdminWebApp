'use strict';
app.controller('storemanager', function ($rootScope, $scope, $state, $timeout, $http, utils) {
	var store_id = utils.localData('store_id');
	var login_userId = utils.localData('user_id');
	var user_id = "";

	console.log("login_userId:"+login_userId);

	//查询店长信息
	var getShopkeeper = function () {
    	$scope.normal = true;
        $http.get(app.url.query_for_shopkeeper+"&company="+store_id, {}).success(function (data, status, headers, config) {
            if(typeof data["#message"] == "undefined"){
            	if(data.info_list.length>0){
            		user_id = data.info_list[0]['employee-user'];	
            	}
            	$scope.listManager();
            }else{
            	window.wxc.xcConfirm(data['#message'], window.wxc.xcConfirm.typeEnum.error);
            }
        });
    };
    getShopkeeper();
    //添加管理员
    $scope.addStoreManager= function (type) {
    	if(type==2){
    		$state.go('app.store_manager.store_manager_zong');
    	}else{
    		$state.go('app.store_manager.storemanageradd');
    	}
    };

    $rootScope.$on('lister_store_manager_listManager', function (evet, data) {
      $scope.listManager();
    });
    $scope.list = [];
	//初始化管理员列表
	$scope.listManager = function () {
		$http.get(app.url.manager_query+'?role=admin', {}).
		    success(function (data, status, headers, config) {
		   	if(typeof data['#message'] == "undefined"){
		   		$scope.list = data.info_list;
		   	}else{
		   		$scope.list = [];
		   	}
			setTimeout(function(){
				$(".manager-lab-container div").on({
					mouseenter:function(){
					 var leng = $(".manager-lab-container div").length;
					 if(leng==1) return;
					 if(user_id != $(this).attr("id")){
					 	$(this).find(".fa").show();
					 }
					},
					mouseleave:function(){
						$(this).find(".fa").hide();
					}
				});
			},200);
	    });
	};
	
	//删除管理员
	$scope.deleteManager = function(id,_userid){
		var ids = "";
		$("#manager input[type=checkbox]").each(function(){
			if(this.checked){
				ids +=$(this).val()+";";
			}
		});
		if(_userid == login_userId){
			var txt=  "确定删除自己的管理员身份吗？删除后将没有登录权限！";
		}else{
			var txt=  "确定删除该管理员吗？";
		}
		
		var option = {
			title: "提示框",
			btn: parseInt("0011",2),
			onOk: function(){
				$http.get(app.url.manager_delete+'?id='+id).success(function (data, status, headers, config) {
					if(typeof data["#message"] == "undefined"){
						var txt=  "删除成功！！！";
						window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.success,{"onOk":function(v){
							if(login_userId == _userid){
								$rootScope.$emit('lister_logout');
							}else{
								$scope.listManager();	
							}
						}});
					}else{
						window.wxc.xcConfirm(data['#message'], window.wxc.xcConfirm.typeEnum.error);
					}
				});
			}
		};
		window.wxc.xcConfirm(txt, "confirm", option);
		
	};
});
