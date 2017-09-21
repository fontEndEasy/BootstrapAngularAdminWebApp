'use strict';
app.controller('varietylistconfirm', function ($rootScope, $scope, $state, $http, $compile, utils, modal) {
$scope.lists =[];

$scope.is_show = true;

$scope.is_show = true;
//节点复制	
$(".add").click(function(){
	$scope.is_show = false;
	$scope.$apply(function(){
		var fun ={edit:function(){
			        console.log($(this))
					console.log(2);
				},delete_:function(){
					console.log(3);
				},save:function(){
					console.log(4);
				}
		}
		$scope.lists.push(fun);
	});
}); 

var logintype = localStorage.getItem('user_type');

var type_show=true;
if(logintype=='c_ChainDrugStore'){//连锁门店
	$scope.type_show = true;
}else if(logintype=='c_DrugFactory'){//药厂
	$scope.type_show = false;
}else if(logintype=='c_MonomerDrugStore'){//零售店
	$scope.type_show = true;
}

//获取品种分类
$scope.getVarietyList = function () {
$http.get(app.url.select_variety, {}).
    success(function (data, status, headers, config) {
        $scope.lists = data.info_list;
        for(var i=0;i<$scope.lists.length;i++){
        	$scope.lists[i].isShow = false;
        }
});
};

$scope.edit = function(id,index){
	$scope.lists[index].isShow = true;
}

$scope.update = function (id,index) {
	var title = $("#title_"+id).val();
	if(title==''){
		var txt=  "分类名称不能为空不能为空！！！";
		window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.warning);
		return;
	}
    $http({
        url: app.url.edit_for_drug_store,
        method: 'post',            
        data: {
        	title:title,
        	id:id
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
    	$scope.lists[index].isShow = false;
        if (typeof resp.data['#message'] == "undefined") {
        	var txt=  "修改成功！！！";
    		window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.success);
        }else{
             window.wxc.xcConfirm(resp.data['#message'], window.wxc.xcConfirm.typeEnum.error);
        }
    });
};


$scope.go_search = function (id) {
	$("#title_"+id).attr("ng-show",true);
};
//删除
$scope.delete_ = function (id) {
	var txt=  "确定删除分类吗？";
	var option = {
		title: "提示框",
		btn: parseInt("0011",2),
		onOk: function(){
				$http.get(app.url.delete_for_drug_store+'?id='+id).
				success(function (data, status, headers, config) {
					if(data=='"OK"'){
						var txt=  "删除成功！！！";
						window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.success);
						$state.go('app.varietylist', {'reload':true});
					}else{
						var txt= data['#message'];
						window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.error);
					}
				});
		}
	};
	window.wxc.xcConfirm(txt, "confirm", option);
};
//保存
$scope.save = function (id) {
	$scope.is_show = true;
	var title = $("#title_"+id).val();
	if(title==''){
		var txt=  "分类名称不能为空不能为空！！！";
		window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.warning);
		return;
	}
    $http({
        url: app.url.create_for_drug_store,
        method: 'post',            
        data: {
        	title:title
        },
        headers : {
			'Content-Type' : 'application/x-www-form-urlencoded'
		}
    }).then(function (resp) {
        if (typeof resp.data['#message'] == "undefined") {
        	var txt=  "保存成功！！！";
    		window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.success,{"onOk":function(){

            }});
        }else{
             window.wxc.xcConfirm(resp.data['#message'], window.wxc.xcConfirm.typeEnum.success);
        }
    });
};

$scope.getVarietyList();
//获取品种库数目
$scope.getVarietyCount = function () {
	$http.get(app.url.query_for_stack, {}).
	success(function (data, status, headers, config) {
		$scope.count = data.total;
	});
};
$scope.getVarietyCount();
//点击分类查询药品
$scope.getListByType = function(id){
	console.log(id);
	$scope.ids = id;
	initTable();
}

//初始化表格
var list, dTable;
function initTable() {
	var ids = $scope.ids;
	console.log(ids);
	var key = $scope.keyword;
	 var index = 1,
     length = 10,
     start = 0,
     size = 10;
	var param = {};
    var name,
        _index,
        _start,
        isSearch = false,
        searchTimes = 0,
        index = 1,
        start = 0,
        length = utils.localData('page_length') * 1 || 50;
    var url='';
    if(key==''||key==null){
    	url=app.url.query_for_stack;
    }else if(ids!=null||ids!=''){
    	url=app.url.query_for_stack;
    }else{
    	isSearch = true;
    	url=app.url.query_for_stack+"?title="+key;
    }
    var setTable = function () {
        if(!isSearch){
        	list = $('#contactsList');
        }else{
        	list = $('#searchList');
        }
        dTable = list.dataTable({
            "draw": index,
            "displayStart": start,
            "lengthMenu": [5, 10, 15, 20, 30, 40, 50, 100],
            "pageLength": length,
            "bServerSide": true,
            "sAjaxSource": url,
            "fnServerData": function (sSource, aoData, fnCallback) {
                $http({
                    "method": "post",
                    "url": url,
                    "data": param
                }).then(function (resp) {
                	 var list = resp.data.info_list;
                	 console.log(list);
                     for (var i = 0; i < resp.data.total; i++) {
                         utils.extendHash(list[i], ["goods$general_name", "goods$pack_specification","goods$manufacturer", "cert_state","goods$abbr"]);
                     }
                     $scope.button_show_s = true;
                    resp.start = resp.start;
                    resp.recordsTotal = resp.data.total;
                    resp.recordsFiltered = resp.data.total;
                    resp.length = resp.pageSize;
                    resp.data = resp.data.info_list;
                    fnCallback(resp);
                    $scope.loading = false;
                    $rootScope.loaded = true;
                });
            },
            "searching": false,
            "language": app.lang.datatables.translation,
            "createdRow": function (nRow, aData, iDataIndex) {
            	 $(nRow).on('click','a',function(){
            		 console.log(aData.goods.id);
            		 $state.go('app.varietylist.drug_detail',{id:aData.goods.id});
            	 });
            	//上下架操作
            	 $(nRow).on('click','button',function(){
            		// console.log(aData.goods.id+"-----------");
            		 $scope.s=$scope.state==0?9:0;//上下操作
            		 console.log($scope.s);
            		$http({
            		        url: app.url.set_good_state,
            		        method: 'post',            
            		        data: {
            		        	goods:aData.goods.id,
            		        	state:$scope.s
            		        }
            		    }).then(function (resp) {
            		    	$scope.state = $scope.s==0?9:0;
            		    	$state.go('app.varietylist', {'reload':true});
            		    	if($scope.s==0){
                   			 	$(nRow).find('button').html("已上架").attr("class","btn btn-success");
	                   		 }else if(state==9){
	                   			 $(nRow).find('button').html("已下架").attr("class","btn btn-danger");
	                   		 }
            		    });
            		 
            	 });
            	 var state = aData.state.value;
            	 $(nRow).find('button').hover(function(){
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
            	 })
            },
            "columns": !$rootScope.isSearch ? [{
                "render": function (set, status, dt) {
                	return "<a style='colour:blue;'>"+dt['goods$general_name']+"</a>";
                	
                }
            }, {
            	 "data": "goods$pack_specification",
                 "orderable": false,
                 "searchable": false
            }, {
                "data": "goods$manufacturer",
                "orderable": false,
                "searchable": false
            }, {
                "data":  function (set, status, dt) {
                	if(set.state.value==0){
                		return "<button type='button' class='btn btn-success'>已认证</button>";
                	}else if(set.state.value==9){
                		return "<button type='button' class='btn btn-danger'>未认证</button>";
                	}
                },
                "orderable": false,
                "searchable": false
            },{
            	"data": "goods$abbr",
                "orderable": false,
                "searchable": false
            }] : [{
                "orderable": false
            }]
        });
        
        // 表格事件处理,init-初始化完成,length-改变每页长度,page-翻页,search-搜索
        dTable.off().on('init.dt', function () {
            list.find('tr[data-id=' + $rootScope.curRowId + ']').addClass('currentRow');
        }).on('length.dt', function (e, settings, len) {
            index = 1;
            start = 0;
            length = len;
            dTable.fnDestroy();
            setTable();
            utils.localData('page_length', len);
        }).on('page.dt', function (e, settings) {
            index = settings._iDisplayStart / length + 1;
            start = length * (index - 1);
            dTable.fnDestroy();
            utils.localData('page_index', index);
            utils.localData('page_start', start);
            setTable();
        }).on('search.dt', function (e, settings) {
            if (settings.oPreviousSearch.sSearch) {
                isSearch = true;
                searchTimes++;
                _index = settings._iDisplayStart / settings._iDisplayLength + 1;
                _start = settings._iDisplayStart;
                name = settings.oPreviousSearch.sSearch;
            } else {
                isSearch = false;
                name = null;
            }
            if (isSearch) {
                index = 1;
                start = 0;
            } else {
                if (searchTimes > 0) {
                    searchTimes = 0;
                    index = _index;
                    start = _start;
                    dTable.fnDestroy();
                    setTable();
                }
            }
        });
    };
    setTable();
}

initTable();

});
