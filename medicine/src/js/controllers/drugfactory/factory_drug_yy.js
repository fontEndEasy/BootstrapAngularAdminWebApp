'use strict';
app.controller('factory_drugyy', function ($rootScope, $scope, $state,$stateParams, $http, $compile, utils, modal) {
	$scope.lists =[];
	var id  = $stateParams.id;
	$scope.general_name = $stateParams.name;
	var html = $('html');
    html.css('overflow', 'hidden');
    var yy_access_token = utils.localData('yy_access_token'),
          groupId = utils.localData('store_id');
          // "56d10990b472651e1cfdc819" || 
    var selectList = [];
	//模态框退出
	$scope.cancel = function () {
		html.css('overflow', 'auto');
	    $state.go('app.factory_varietylist', {'reload':false});
	};

	//保存设置医药代表
	$scope.save_medicine_creates = function(){
		set_medicine_creates();
	}

    function drugEnterpriseGetSellerByGoodsId(){
        $http({
            "method": "post",
            "url": app.url.drugEnterpriseGetSellerByGoodsId,
            "data":{
                access_token:yy_access_token,
                goodsId:id
            }
        }).then(function (resp) {
            if (resp.data.resultCode === 1) {
                selectList = resp.data.data;
                setTable();
            } else {
                window.wxc.xcConfirm("查询品种医药代表失败", window.wxc.xcConfirm.typeEnum.error);
            }
        });
    }

    drugEnterpriseGetSellerByGoodsId();

	//查询所有医药代表
	function get_medicine_rep_all(){
        $http({
            "method": "get",
            "url": app.url.get_medicine_rep_all,
            "data":{
                access_token:yy_access_token,
                enterpriseId:groupId,
                pageIndex:0,
                pageSize:10
            }
        }).then(function (resp) {
            if(typeof resp.data["#message"] == "undefined"){
                $scope.list_datas = resp.data.list_datas;
            }else{
                window.wxc.xcConfirm(resp.data['#message'], window.wxc.xcConfirm.typeEnum.error);
            }
        });
    }

    var datable = null;
      
      //获取表格
      function setTable() {
        
        function dataTable() {
            if (datable) { 
                datable.fnClearTable(); 
            }
            var length = utils.localData('page_length') * 1 || 10;
            datable = $('#yydb_contactsList').dataTable({
                "bServerSide": true,
                "lengthMenu": [5, 10, 15, 20, 30, 40, 50, 100],
                "pageLength": length,
                "ordering": false,
                "bInfo":false,
                "bLengthChange": false,  
                "paging": false,
                "searching": false,
                "bDestroy":true,
                "sAjaxSource": app.url.get_medicine_rep_all,
                "language": app.lang.datatables.translation,
                "fnServerData": function (sSource, aoData, fnCallback) {
                    var param = {};
                    if(typeof $scope.title !="undefined" && $scope.title!=''){
                        param.keyword = $scope.title;
                    }
                    param.pageIndex = Math.round(aoData[3]['value']/aoData[4]['value']);
                    param.pageSize = aoData[4]['value']<0?10:aoData[4]['value'];
                    param.enterpriseId = groupId;
                    param.access_token = yy_access_token;
                    $http({
                        "method": "post",
                        "url": sSource,
                        "data": param
                    }).then(function (resp) {
                        var _dt = resp.data.data;
                        resp.start = _dt.start;
                        resp.recordsTotal = _dt.total;
                        resp.recordsFiltered = _dt.total;
                        resp.length = _dt.pageSize;
                        resp.data = _dt.pageData;
                        fnCallback(resp);
                    });
                },
                columns:[
                    {
                        "data": function (set, status, dt) {
                          var str = '';
                          if(selectList.length>0){
                            $.each(selectList,function(index,item){
                                if(set.userId == item.userId){
                                    str = '<label class="i-checks"><input type="checkbox" id="' + set.userId + '"  name="check' + set.userId + '"  checked><i></i></label>';
                                    return false;
                                } 
                            });
                            if(str == ""){
                                str = '<label class="i-checks"><input type="checkbox" id="' + set.userId + '"  name="check' + set.userId + '" ><i></i></label>';
                            }
                          }else{
                            str = '<label class="i-checks"><input type="checkbox" id="' + set.userId + '"  name="check' + set.userId + '" ><i></i></label>';
                          }
                          return str;
                        }
                    },
                    {
                        "data": function (set, status, dt) {
                          var image_url = typeof set['image'] == "undefined"?"src/img/a0.jpg":set['image'];
                          return '<p class="varietylist-checkbox"><span class="imgblock"><img src="'+image_url+'"/></span></p>';
                        }
                    },
                    {
                      "data": function (set, status, dt) {
                        if(typeof set['name'] != "undefined" && set['name'] != ""){
                          return set['name'];
                        }else{
                          return "";
                        }
                      }
                    },
                    {
                      "data": function (set, status, dt) {
                        if(typeof set.position!='undefined' && set.position!="null"){
                            return set.position;
                          }else{
                            return "";
                          }
                        }
                    },
                    {
                        "data": function (set, status, dt) {
                          if(typeof set.telephone!='undefined' && set.telephone!="null"){
                            return set.telephone;
                          }else{
                            return "";
                          }
                        }
                    }
                ]
            });

            /*var doctorList = $("#yydb_contactsList");
              doctorList.find("tbody tr input[type='checkbox']").on("click",function(evt){
                evt = evt || window.event;
                if(!$(this).prop("checked")){
                    doctorList.find("input[name='checkall']").prop("checked",false);
                }else{
                    if(doctorList.find("tbody tr input[type='checkbox']").length == doctorList.find("tbody tr input:checked").length){
                        doctorList.find("input[name='checkall']").prop("checked",true);
                    }
                }
                evt.stopPropagation();
              });

              doctorList.find("input[name='checkall']").on("click",function(){
                var check = $(this).prop("checked");
                doctorList.find("tbody tr input[type='checkbox']").each(function() {
                    $(this).prop("checked", check);
                });
              });*/

             // doctorList.find("input[name='checkall']").prop("checked",false);
        }

        dataTable();
      };
      //点击搜索
      $scope.findByKeyWord = function(){
          $scope.title = $scope.mainKeyword;
          setTable();
      };

      $scope.pressEnter=function($event){
          if($event.keyCode==13){
              $scope.findByKeyWord();
          }
      };

    //设置医药代表
    function set_medicine_creates(){
    	var ids = [];
      $(".yylist input[type='checkbox']").each(function() {
          if($(this).prop("checked")){
            ids.push($(this).attr("id"));
          }
      });   
      if(ids.length == 0) return;
    	var data = {
        	goodsId:id,
        	access_token:yy_access_token,
            userId:ids.join(",")
        };
        $http({
            "method": "post",
            "url": app.url.set_medicine_creates,
            "data":data
        }).then(function (resp) {
            if(typeof resp.data["#message"] == "undefined"){
            	html.css('overflow', 'auto');
			    $state.go('app.factory_varietylist', {'reload':false});
                $rootScope.$emit('lister_factory_table_list');          
            }else{
                window.wxc.xcConfirm(resp.data['#message'], window.wxc.xcConfirm.typeEnum.error);
            }
        });
    }
});
