'use strict';

app.controller('zong', function ($rootScope, $scope, $state, $http, $compile, $stateParams,utils, modal) {
    $scope.loading = true;
    $rootScope.loaded = true;
    // 模态框退出
    $scope.cancel = function () {
        $state.go('app.store_manager',{},{});
    };
    //执行操作
    $scope.save = function () {
    	var tel = $scope.tel;
    	var name = $scope.name;
    	if(name==''||name==null){
    		var txt=  "姓名不能为空！！！";
    		window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.warning);
    		return;
    	}
    	if(tel==''){
    		var txt=  "手机号码不能为空！！！";
    		window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.warning);
    		return;
    	}
        if(!isPhoneNum(tel)){
            var txt=  "手机号码格式不匹配！";
            window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.warning);
            return;
        }
        $http({
            url:app.url.company_manager_create,
            method: 'post',            
            data: {
            	name:name,
        	    password:123456,
                roles:"admin",
            	mobile_phone:tel
            }
        }).then(function (resp) {
            if (typeof resp.data["#message"] == "undefined") {
            	var txt=  "创建管理员成功！！！";
        		window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.success,{onOk:function(v){
                    $scope.cancel();
                    $rootScope.$emit('lister_store_manager_listManager');
                }});
            }else {
         		window.wxc.xcConfirm(resp.data["#message"], window.wxc.xcConfirm.typeEnum.error,{onOk:function(v){
                    $rootScope.$emit('lister_store_manager_listManager');
                }});
            }
        }, function (x) {
        	var txt=  "电话号码："+tel+"    已经存在！！！";
        	window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.error);
        });
    };

    function isPhoneNum (tel){
        return /^\d{11}$/.test(tel);
    }

});
