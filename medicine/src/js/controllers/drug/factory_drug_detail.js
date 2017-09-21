'use strict';
app.controller('factory_drugdetail', function ($rootScope, $scope, $state,$stateParams, $http, $compile, utils, modal) {
$scope.lists =[];
//模态框退出
$scope.cancel = function () {
    $state.go('app.factory_varietylist', {'reload':true});
};
var id  = $stateParams.id;
//console.log("id is:"+id);

var imgPath = localStorage.getItem('path');

$scope.tabs = {};
//根据药品id查询申请认证的药店
$scope.tabs.getStoreInfo = function () {
	$http.get(app.url.drug_store+"?goods="+id).
	success(function (data, status, headers, config) {
		//console.log(data.info_list);
		$scope.list_store = data.info_list;
		for(var i=0;i<$scope.list_store.length;i++){
        	$scope.list_store[i].isShow = false;
        	$scope.list_store[i].state_0 = false;
        	$scope.list_store[i].state_9 = false;
        	$scope.list_store[i].state_1 = false;
        }
		console.log($scope.list_store);
	});
};


$('button').hover(function(){
		 $scope.state = state;
		 console.log(state);
		 if(state==0){
			 $(nRow).find('button').html("下架").attr("class","btn btn-danger");
		 }else if(state==9){
			 $(nRow).find('button').html("上架").attr("class","btn btn-success");
		 }
	 },function(){
		 $scope.state = state;
		 if(state==0){
			 $(nRow).find('button').html("已上架").attr("class","btn btn-success");
		 }else if(state==9){
			 $(nRow).find('button').html("已下架").attr("class","btn btn-danger");
		 }
	 });

$scope.request_0 = true;
$scope.request_1 = false;
$scope.request_9 = false;
$scope.getDrugView = function () {
$http.get(app.url.drug_view+"?id="+id).
    success(function (data, status, headers, config) {
        $scope.obj = data;
        //console.log(data);
        $scope.general_name = data.general_name==''?"--":data.general_name;//药名
        $scope.pack_specification = data.pack_specification==''||data.pack_specification==null?"--":data.pack_specification;//规格
        $scope.specification = data.specification==''?"--":data.specification;//药品类别
        $scope.image = imgPath+data.image;//药品图片
        $scope.number = data.number==''?"--":data.number;//批准文号
        $scope.general_name = data.general_name==''?"--":data.general_name;//通用名
        $scope.bar_code = data.bar_code==''||data.bar_code==null?"--":data.bar_code;// 条码
        $scope.abbr = data.abbr==''||null?"--":data.abbr;// 助记码
        var text = data.trade_name;
        $scope.trade_name = data.trade_name==''||null?"--":data.trade_name;// 药品商品名
        $scope.codes = data.codes==''||null?"--":data.codes;// 产品识别码
        $scope.manual = data.manual==''||data.manual==null?"":data.manual;// 说明书
        $scope.biz_type = data.biz_type==''||null?"--":data.biz_type;// 经营类别
        $scope.indications = data.indications==''||null?"--":data.indications;// 适应症
        $scope.title = data.type.name==''||null?"--":data.form.name;// 剂型
        $scope.companyname = data.company.name==''||null?"--":data.company.name;// 药厂名称
        $scope.companyid = data.company.id==''||null?"--":data.company.id;// 药厂id
        $scope.id = data.id;// 药品id
        $scope.pack_specification = data.pack_specification==''||null?"--":data.pack_specification;// 包装规格
        
        $scope.usages = data.usages;//使用方法
        
        var state_audit = data.state_audit.value;
        console.log(state_audit+"===============");
        if(state_audit==0){
        	$scope.request_0 = true;
        	$scope.request_1 = false;
        	$scope.request_9 = false;
        }else if(state_audit==1){
        	$scope.request_0 = false;
        	$scope.request_1 = true;
        	$scope.request_9 = false;
        }else{
        	$scope.request_0 = false;
        	$scope.request_1 = false;
        	$scope.request_9 = true;
        }
        
    });
};

$scope.getDrugView();
$scope.over = true;

$scope.onMouseOver =function(actor,index){
	$scope.over = false;
		if(actor=='9'){
			$scope.list_store[index].state_9 = true;	
			$scope.list_store[index].isShow = true;
		}else if(actor=='0'){
			$scope.list_store[index].isShow = true;
			$scope.list_store[index].state_0 = true;
		}else if(actor=='1'){
			$scope.list_store[index].isShow = true;
			$scope.list_store[index].state_1 = true;
		}
};
$scope.onMouseOut =function(actor,index){
	if(actor=='9'){
		$scope.list_store[index].state_9 = false;	
		$scope.list_store[index].isShow = false;
	}else if(actor=='0'){
		$scope.list_store[index].isShow = false;
		$scope.list_store[index].state_0 = false;
	}else if(actor=='1'){
		$scope.list_store[index].isShow = false;
		$scope.list_store[index].state_1 = false;
	}
};

$scope.opera =function(storeid,type){
	console.log(storeid);
	if(type==0){
		$scope.drug_request(storeid,9);
	}else if(type==1){
		$scope.drug_request(storeid,9);
	}else if(type==9){
		$scope.drug_request(storeid,5);
	}
};


//药品申请认证
$scope.drug_request = function(store_id,state){
	$scope.storename = localStorage.getItem('user_name');
	$scope.store_id = localStorage.getItem('store_id');
	$http({
        url: app.url.drug_store_request,
        method: 'post',            
        data: {
        	goods:$scope.id,
        	drug_store:store_id,
        	state:state
        }
    }).then(function (resp) {
    	console.log(resp);
    	if(resp.data.is_success==true){
    		$scope.request_1 = true	;
    		$scope.request_0 = false;
    	}else{
    		$scope.request_0 = true;
    		$scope.request_1 = false	;
    	}
    });
};
//改变下拉框查询（店铺关键字+认证状态）
$scope.change = function() {
	var state = $("#select").find("option:selected").val();
	var keyword1 ="%"+encodeURIComponent($("#searchText").val())+"%";
	$http.get(app.url.drug_store+"?goods="+id+"&state="+state+"&drug_store="+keyword1).
	success(function (data, status, headers, config) {
		$scope.list_store = data.info_list;
	});
};
//提交药品审核去hippo
$scope.drug_audit = function(){
$http.get(app.url.drug_store_audit+"?state_audit=1"+"&id="+id).
success(function (data, status, headers, config) {
	console.log(data);
	if(data.is_success==true){
		$scope.request_1 = true;
		$scope.request_0 = false;
	}
});
}



});
