'use strict';

app.controller('joinstoreaddmanager', function ($rootScope, $scope, $state, $timeout, $http, utils) {
    $scope.formData = {};
    // 执行操作
    $scope.save = function () {
    	var tel = $scope.tel;
    	var name = $scope.name;
    	if(name==''||name==null){
    		alert("店员名称不能为空!");
    		return;
    	}
    	if(tel.length!=11){
    		alert("手机号码不能大于11位！");
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
			},
			transformRequest : function(obj) {
				var str = [];
				for ( var p in obj) {
					var v = obj[p];
					if (v !== undefined && v !== null) {
						str.push(p+ "="+ encodeURIComponent(v));
					}
				}
				return str.join("&");
			}
        }).then(function (resp) {
        	if (typeof resp.data['#message'] == "undefined") {
                var txt=  "保存成功";
                window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.success,{onOk:function(){
                    $scope.cancel();
                }});
            }else{
                window.wxc.xcConfirm(resp.data['#message'], window.wxc.xcConfirm.typeEnum.error);
            }
        });
    };
// 模态框退出
$scope.cancel = function () {
    $state.go('app.join_store_manager', {'reload':true});
};

});