'use strict';
app.controller('company_add_drug', function ($rootScope, $scope, $state, $http, $compile, utils, modal) {
	var um = null;
	$scope.image_url = "";
	$scope.unit = "";
	$scope.bar_code = "";
	$scope.abbr = "";
	$scope.token = localStorage.getItem('yy_access_token');
	$scope.yy_token = $scope.token;

	$scope.companyuploaderSuccess = function(up,file,info){
		$scope.image = file.url;
		$scope.image_url = file.url;
		$scope.company_image = file.url;
		$("#company_image").attr("src",file.url);
	}
	//模态框退出
	$scope.cancel = function () {
	    $state.go('app.factory_varietylist',{},{});
	};

	if($scope.image_url != "undefined" && $scope.image_url != ""){
		var img = new Image();
		img.onload = function(){
			$scope.company_image = $scope.image_url;
		}
		img.onerror = function(){
			$scope.company_image = "src/img/p0.jpg";
		}
		img.src = $scope.image_url;
	}else{
		$scope.company_image = "src/img/p0.jpg";
	}

	/*setTimeout(function(){
		window.frames["name_iframe"].contentWindow.uploadFileImg($scope.image);
	},1000);

	window.callback = function(value){
		$scope.image_url = value.substring(0,value.lastIndexOf("/"));
	}*/
	//加载控件
	/*$scope.initEditor = function(){
		UM.getEditor('myEditor').destroy();
		um = UM.getEditor('myEditor',{
		    initialFrameWidth:'100%',
		    initialFrameHeight:300
		});
	}*/

	$scope.planData = {content:""};



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
		});
	};

	$scope.getJXList();

	//使用类别
	$scope.getSYLB = function () {
		$scope.normal = true;
		$http.get(app.url.select_explorer, {}).
		success(function (data, status, headers, config) {
			$scope.list_sylb = data.list.info_list;
			initSYLB($scope.list_sylb);
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
			initSYZ($scope.list_syz)
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
	$scope.list_div=[
		{
			"patients":"",  //适用人群
			"period":"",    //用药周期
			"times":"",     //用药次数
			"quantity":"",  //每次用量
			"units":"",      //单位
			"method":""     //用法
		}
	];
	$scope.s = 1;

	//复制DIV
	$scope.addDiv = function(){
		var obj = {
			"patients":"",  //适用人群
			"period":"",    //用药周期
			"times":"",     //用药次数
			"quantity":"",  //每次用量
			"unit":"",		//单位
			"method":""     //用法
		};
	    $scope.list_div.push(obj);
	};
	//删除DIV
	$scope.removeBtn = function(index){
		$scope.list_div.splice(index,1); //清除list
	}

	$scope.setGLLB = function(val){
		$scope.GLLB = val;
	}

	var syzs = [];
	var sybls = [];

	function initSYZ(_dataArr){
		 // 创建适应症列表数据
	    var syzcontacts = new Tree('syz_ul', {
	        hasCheck: true,
            allCheck: true,
            multiple: true,
            arrType: [1, 0],
	        data:_dataArr,
	        async: false,
	        icons: {
	            /*arrow: 'fa fa-caret-right/fa fa-caret-down',
                check: 'fa fa-check/fa fa-square',
                root: 'fa fa-hospital-o cfblue',
                branch: 'fa fa-h-square cfblue',
                leaf: 'fa fa-user-md dcolor',
                head: 'headPicFileName'*/
                arrow: 'fa fa-caret-right/fa fa-caret-down',
                check: 'fa fa-check/fa fa-square',
                root: 'fa fa-hospital-o dcolor',
                branch: 'fa fa-h-square dcolor',
                leaf: 'fa fa-h-square dcolor'
	        },
	        datakey: {
	            id: 'id',
	            name: 'name',
	            sub: 'subList'
	        },
	        info: {
	            name: 'name',
	            id: 'id',
	            pid: 'parentId'
	        },
	        events: {
	            click: forward,
	            mouseenter: enter,
	            mouseleave: leave
	        },
	        callback: function () {
	        	$("#syz_ul dl").on("click",function(evt){
					evt = evt || window.event;
					evt.stopPropagation();
				});
	        }
	    });

	    var iEdit, iDelete;

	    function enter(info) {
	    }

	    function leave(info) {
	    }

	    function forward(info) {
	    	var selectItems = syzcontacts.getTargets();
	    	var tmp = [];
	    	syzs =[];
	    	$.each(selectItems,function(index,item){
	    		tmp.push(item.name);
	    		syzs.push(item.id);
	    	})
	    	$("#liMenu_syz").html(tmp.join("、"));
	    }
	}

	function initSYLB(_dataArr){
		 // 创建适应症列表数据
	    var sylbcontacts = new Tree('sylb_ul', {
            /*hasCheck: true,
            multiple: false,*/
            hasCheck: true,
            allCheck: true,
            multiple: true,
            self: true,
            arrType: [1, 0],
	        data:_dataArr,
	        async: false,
	        icons: {
	            arrow: 'fa fa-caret-right/fa fa-caret-down',
                check: 'fa fa-check/fa fa-square',
                root: 'fa fa-hospital-o dcolor',
                branch: 'fa fa-h-square dcolor',
                leaf: 'fa fa-h-square dcolor'
	        },
	        datakey: {
	            id: 'id',
	            name: 'name',
	            sub: 'subList'
	        },
	        info: {
	            name: 'name',
	            id: 'id',
	            pid: 'parentId',
	            description: 'description'
	        },
	        events: {
	            click: forward,
	            mouseenter: enter,
	            mouseleave: leave
	        },
	        callback: function () {
	        	$("#sylb_ul dl").on("click",function(evt){
					evt = evt || window.event;
					evt.stopPropagation();
				});
	        }
	    });

	    var iEdit, iDelete;

	    function enter(info) {

	    }

	    function leave(info) {
	    }

	    function forward(info) {
	    	var selectItems = sylbcontacts.getTargets();
	    	var tmp = [];
	    	sybls = [];
	    	$.each(selectItems,function(index,item){
	    		tmp.push(item.name);
	    		sybls.push(item.id);
	    	})
	    	$("#liMenu_sylb").html(tmp.join("、"));
	    }
	}


	//**************点击展开按钮取值开始********************//
	var nextState = 1;
	$scope.change = function($evt,type) {
		var evt = $evt || window.event;
		if(type == "syz") $("#sylb_ul").hide();
		else $("#syz_ul").hide();
		$("#"+type+"_ul").toggle();
		evt.stopPropagation();
	}

	$("body").on("click",function(){
		$("#syz_ul,#sylb_ul").hide();
	});
	//**************点击展开按钮取值结束********************//

	//保存
	$scope.save = function () {
		var gllb = $("#select").find("option:selected").val();
		var jx = $("#jx").find("option:selected").val();
		var jylb = $("#jylb").find("option:selected").val();
		var unit = $scope.unit;
		var company = localStorage.getItem('store_id');
		// var manual = UM.getEditor('myEditor').getContent();  // 说明书
		var manual = $scope.planData.content;
		var usages = []; 
		var opflag = 0;
		$.each($scope.list_div,function(index,item){
			if(typeof item.units == "undefined"){
				opflag = 1;
				return false;
			}
			var tmp = {};
			tmp.patients = item.patients;
			tmp.method = item.method;
			tmp.period = item.period;
			tmp.times = item.times;
			tmp.quantity = item.quantity+item.units.name;
			usages.push(tmp);
		});

		if(opflag == 1){
			window.wxc.xcConfirm("请选择单位", window.wxc.xcConfirm.typeEnum.error);
			return;
		}

		if(typeof $scope.general_name == 'undefined' || $scope.general_name.length==0 || $scope.general_name.replace(/\s/g,"").length == 0){
			window.wxc.xcConfirm("产品名称不能为空", window.wxc.xcConfirm.typeEnum.error);
			return;
		}else if($scope.general_name.length > 50){
			window.wxc.xcConfirm("产品名称数据最长为50个字符", window.wxc.xcConfirm.typeEnum.error);
			return;
		}else if(typeof $scope.specification == 'undefined' || $scope.specification.length==0 || $scope.specification.replace(/\s/g,"").length == 0){
			window.wxc.xcConfirm("规格不能为空", window.wxc.xcConfirm.typeEnum.error);
			return;
		}else if(typeof $scope.manufacturer == 'undefined' || $scope.manufacturer.length==0 || $scope.manufacturer.replace(/\s/g,"").length == 0){
			window.wxc.xcConfirm("生产厂家不能为空", window.wxc.xcConfirm.typeEnum.error);
			return;
		}else if(typeof $scope.pack_specification == 'undefined' || $scope.pack_specification.length==0 || $scope.pack_specification.replace(/\s/g,"").length == 0){
			window.wxc.xcConfirm("包装规格不能为空", window.wxc.xcConfirm.typeEnum.error);
			return; 
		}else if(typeof $scope.number == 'undefined' || $scope.number.length==0 || $scope.number.replace(/\s/g,"").length == 0){
			window.wxc.xcConfirm("批准文号不能为空", window.wxc.xcConfirm.typeEnum.error);
			return;
		}else if($scope.codes && $scope.codes.length>7){
			window.wxc.xcConfirm("产品识别码不能超过7位", window.wxc.xcConfirm.typeEnum.error);
			return;
		}else if($scope.codes && !/^81\d*$/.test($scope.codes)){
			window.wxc.xcConfirm("产品识别码必须是“81”开头的数字,且必须是数字", window.wxc.xcConfirm.typeEnum.error);
			return;
		}

		var data = {
        	general_name:$scope.general_name,//产品名称
        	specification:$scope.specification,//规格
        	manufacturer:$scope.manufacturer,//生产厂家
        	pack_specification:$scope.pack_specification,//包装规格
        	number:$scope.number,//批准文号
        	trade_name:$scope.trade_name,//商品名
        	codes:$scope.codes,//产品识别码
        	approval_date:$scope.approval_date,//注册日期
        	biz_type:jylb,//药品经营类别
        	indications:syzs,//适应症
        	use_types:sybls,//使用类别
        	type:gllb,//管理类别
        	form:jx,//剂型
        	image:$scope.image_url,//图片地址
        	manual:manual,  //说明描叙
        	usages:usages,  //用法用量
        	bar_code:$("#bar_code").val(),//条码
        	abbr:$("#abbr").val(),//助记码
        	company:company,
        	unit:unit
        };
        var json = JSON.stringify(data);
		data = "__JSON__="+encodeURIComponent(json);
		$http({
	        url: app.url.yc_save+gllb+".create_forCompany",
	        method: 'post',
	        data: data
	    }).then(function (resp) {
	        if (typeof resp.data['#message']=="undefined") {
	        	var txt=  "创建成功！";
	    		window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.success,{onOk:function(){
	    			$scope.cancel();
	    			$rootScope.$emit('lister_factory_table_list');
	    		}});
	        } else {
	        	window.wxc.xcConfirm(resp.data['#message'], window.wxc.xcConfirm.typeEnum.error);
	        }
	    });
	};

	$('#approval_date').daterangepicker({
        singleDatePicker: true,
        format:"YYYY-MM-DD"
    },
    function(start, end, label) {
        $scope.approval_date = start.toISOString().split("T")[0];

    });


});
