'use strict';
app.controller('add_store_drug', function ($rootScope, $scope, $state, $http,$stateParams, $compile, utils, modal) {

	$scope.company = false;

	var class_id  = $stateParams.id;
	$scope.class_id = class_id;//分类id
	$scope.keys =false;
	//图片访问路径
	$scope.img_path = localStorage.getItem('path');

	//关键字搜索
	$scope.findDrugByKeyWord = function(){
		var key=$scope.keyword;
		var url = '';
		if(typeof key=='undefined'){
			url = app.url.query_for_drug_company
		}else{
			url = app.url.query_for_drug_company+"?__KEYWORD__="+key
		}

		$http.get(url, {}).
	      success(function (data, status, headers, config) {
	    	$scope.keys =true;
	    	$scope.info_list = data.info_list;
	    	var list = data.info_list.slice(0);
	    	var lists = [];
	    	var _moziLt1 = []
	    	var tmp = {};
	    	$.each(list,function(i,keys){
	    		tmp[keys.manufacturer] = keys;
	    	});
	    	$.each(tmp,function(i,keys){
	    		_moziLt1.push(keys);
	    	});
	    	$scope.filterStr = [];
	    	$.each(_moziLt1,function(i,item){
	    		$scope.filterStr.push(item.id);
	    	});
	    	$scope._moziLt1 = _moziLt1;
	    	$scope.key_word =$scope.keyword;
	    	findGlobalData = $scope.info_list.slice(0);
	    });
	};

	/*$scope.keyword = '感冒';
	$scope.findDrugByKeyWord();*/
	var findGlobalData = [];

	$scope.removeSpan = function(id){
		if($("#"+id).hasClass("btn-success")){
			$("#"+id).removeClass("btn-success").addClass("rdisabled");
			$("#"+id).find("i").removeClass("fa-times");	
		}else{
			$("#"+id).removeClass("rdisabled").addClass("btn-success");
			$("#"+id).find("i").removeClass("fa-check");
		}

		var tempids = [];
		$("#medicine-complays").find("button.btn-success").each(function(){
			tempids.push($(this).attr("store_name"));
		});
		var temparr = [];
		var len = $("#medicine-complays").find("button").length
		if(tempids.length == len){
			$scope.info_list = findGlobalData.slice(0);
		}else if(tempids.length>0 && tempids.length != len){
			$.each(findGlobalData,function(j,jitem){
				var re = new RegExp(tempids.join("|") ,"gi"); 
				if(re.test(jitem.manufacturer)){
					temparr.push(jitem);
				}
			});
			$scope.info_list = temparr.slice(0);
		}else{
			$scope.info_list = [];
		}
	};



	//按回车键搜索文档标题
	$scope.pressEnter=function($event){
	    if($event.keyCode==13){
	        $scope.findDrugByKeyWord();
	    }
	};

	$scope.del = function($event){
		$($event.target).parent().remove();
		$scope._moziLt1 = [];
		$scope.info_list = [];
		$scope.keyword = '';
	};


	$scope.save = function(){
		var ids = '';//药品编号
		$(".cnt-opr-btn input[type=checkbox]").each(function(){
			if(this.checked){
				ids +=$(this).val()+";";
			}
		}); 
		ids = ids.substring(0, ids.length-1);
		var array = ids.split(";");
		$scope.length = array.length;
		for(var i=0;i<array.length;i++){
			$scope.save_manytimes(array[i]);
		}
	};
	//保存 class_id 分类id
	$scope.save_manytimes=function(id){
		var data = {};
		if(typeof class_id!="undefined"&&class_id!=''){
			data = {state:0,goods:id,category:class_id}
		}else{
			data = {state:0,goods:id}
		}
		$http({
	        url: app.url.set_good_state,
	        method: 'post',            
	        data:data
	    }).then(function (resp) {
	        if (typeof resp.data['#message'] == "undefined") {
	        	var txt=  "新增品种成功！！！";
	    		window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.success);
	        }else{
	             window.wxc.xcConfirm(resp.data['#message'], window.wxc.xcConfirm.typeEnum.error);
	        }
	    });
		
	};
		
	//模态框退出
	$scope.cancel = function () {
	    $state.go('app.varietylist',{},{});
	};	

});
