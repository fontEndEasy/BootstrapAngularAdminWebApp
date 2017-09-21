'use strict';
app.controller('company_add_drug', function ($rootScope, $scope, $state, $http, $compile, utils, modal) {

	var um = null;

	//模态框退出
	$scope.cancel = function (flag) {
		flag = flag || false;
	    $state.go('app.factory_varietylist',{},{'reload':flag});
	};

	
	//加载控件
	$scope.initEditor = function(){
		um = UM.getEditor('myEditor',{
		    initialFrameWidth:'100%',
		    initialFrameHeight:300
		});
	}

	//经营类别
	$scope.getJYLB = function () {
	$scope.normal = true;
	$http.get(app.url.jylb_select, {}).
	    success(function (data, status, headers, config) {
	        $scope.list = data.info_list;
	    });
	};
	$scope.getJYLB();
	//剂型
	$scope.getJXList = function () {
		$scope.normal = true;
		$http.get(app.url.jx_select, {}).
		    success(function (data, status, headers, config) {
		        var list = data.info_list;
		        $scope.list_jx = data.info_list;
		        console.log(data.info_list);
		});
	};

	$scope.getJXList();

	//使用类别
	$scope.getSYLB = function () {
		$scope.normal = true;
		$http.get(app.url.select_explorer, {}).
		success(function (data, status, headers, config) {
			$scope.list_sylb = data.list.info_list;
		});
	};
	$scope.getSYLB();

	//管理类别
	$scope.getGLLB = function () {
		$scope.normal = true;
		$http.get(app.url.select_gllb, {}).
		success(function (data, status, headers, config) {
			$scope.list_gllb = data.goods_types;
		});
	};
	$scope.getGLLB();

	//适应症
	$scope.getSYZ = function () {
		$scope.normal = true;
		$http.get(app.url.select_syz, {}).
		success(function (data, status, headers, config) {
			$scope.list_syz = data.info_list;
		});
	};
	//获取药品单位
	$scope.getUnit_select = function () {
		$scope.normal = true;
		$http.get(app.url.unit_select, {}).
		success(function (data, status, headers, config) {
			$scope.list_unit = data.info_list;
		});
	};
	$scope.getSYZ();
	$scope.getUnit_select();
	//管理列别
	$scope.getGLLB = function () {
		$scope.normal = true;
		$http.get(app.url.select_gllb, {}).
		success(function (data, status, headers, config) {
			$scope.list_gllb = data.goods_types;
		});
	};
	$scope.getGLLB();
	//点击复制DIV---每点击一次改变数组的大小
	$scope.list_div=[{id:0}];
	$scope.list_obj=[{id:0}];
	$scope.s = 1;

	//复制DIV
	$scope.addDiv = function(){
		var obj={id:$scope.s++};
	    $scope.list_div.push(obj);
	};
	//删除DIV
	$scope.removeBtn = function(id){
		if(id!='0'){
			var list =  $scope.list_div;
			$("#"+id).parent().remove();
			list.splice(id,1); //清除list
			$scope.s-1;
		}
	}

	$scope.setGLLB = function(val){
		utils.localData('GLLB',val);
	}

	//保存
	$scope.save = function () {
		var gllb = $("#select").find("option:selected").val();
		var jx = $("#jx").find("option:selected").val();
		var jylb = $("#jylb").find("option:selected").val();
		var unit = $("#unit").find("option:selected").val();
		var syz = JSON.parse($("#hi_syz").val());
		var sybl = JSON.parse($("#hi_sylb").val());
		var company = localStorage.getItem('store_id');
		console.log("syz:"+syz);
		console.log("sybl:"+sybl);
		$http({
	        url: app.url.yc_save+gllb+".create_forCompany",
	        method: 'post',
	        data: {
	        	general_name:$scope.general_name,//产品名称
	        	specification:$scope.specification,//规格
	        	manufacturer:$scope.manufacturer,//生产厂家
	        	pack_specification:$scope.pack_specification,//包装规格
	        	number:$scope.number,//批准文号
	        	trade_name:$scope.trade_name,//商品名
	        	codes:$scope.codes,//产品识别码
	        	approval_date:$scope.approval_date,//注册日期
	        	biz_type:jylb,//药品经营类别
	        	indications:syz,//适应症
	        	use_types:sybl,//使用类别
	        	type:gllb,//管理类别
	        	form:jx,//剂型
	        	image_url:$("#logo").val(),//图片地址
	        	bar_code:$("#bar_code").val(),//条码
	        	abbr:$("#abbr").val(),//助记码
	        	company:company,
	        	unit:unit
	        },
	        headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			},
			transformRequest : function(obj) {
				var json = $toString(obj);
				// var json = JSON.stringify(obj);
				// return "__JSON__="+encodeURIComponent(json);
				return "__JSON__="+json;
			}
	    }).then(function (resp) {
	        if (typeof resp.data!="undefined") {
	        	var txt=  "创建成功！";
	    		window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.success);
	        } else {
	        	var txt=  "创建失败！";
	        	window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.error);
	            console.warn("创建失败！");
	        }
	    });
	};

});
