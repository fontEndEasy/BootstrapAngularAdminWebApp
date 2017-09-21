app.directive('sbLoad', ['$parse', function ($parse) {
  return {
    restrict: 'A',
    link: function (scope, elem, attrs) {
      var fn = $parse(attrs.sbLoad);
      elem.on('error', function (event) {
        var that = this;
        scope.$apply(function() {
          that.src = "src/img/default_drugs.png";
        });
      });
    }
  };
}]);
app.controller('MonoVarietylist', function ($rootScope, $scope, $state,$stateParams,$http, $compile, utils, modal) {
    var validator = $stateParams.validator || 0;
    $scope.isNotCheck = false;
    $scope.is_show = true;
    $scope.state_id = "";
    $scope.cert_state_id = "";
    var login_type = localStorage.getItem('user_type');
    if(login_type=='c_DrugFactory'){
    	 $scope.class_ = false;
    }else{
    	 $scope.class_ = true;
    }

    $scope.stateOptions = [
      {id:"0",title:"已上架"},
      {id:"9",title:"已下架"},
      {id:"1",title:"未审核"}
    ];

    $scope.cer_stateOptions = [
      {id:"0",title:"未认证"},
      {id:"9",title:"已认证"},
      {id:"1",title:"待审批"},
      {id:"5",title:"拒绝认证"}
    ];

    //查询
    $scope.searchTable = function(){
      setTable();
    }

    //提交认证
    $scope.submitCheck = function(){
      var ids = [];
      $("#monocontactsList tbody tr input[type='checkbox']").each(function() {
          if($(this).prop("checked")){
            ids.push($(this).attr("id"));
          }
      });
      if(ids.length == 0) return;
      $http({
          url: app.url.confirm_c_GoodsCert,
          method: 'post',            
          data:{
            goodses:'json:'+JSON.stringify(ids)
          }
      }).then(function (resp) {
          if (typeof resp.data['#message'] == "undefined") {
              var txt=  "提交认证成功";
              window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.success,{onOk:function(v){

                 setTable();
              }});
          }else{
              window.wxc.xcConfirm(resp.data['#message'], window.wxc.xcConfirm.typeEnum.error);
          }
      });
    }

    //添加品种
    $scope.add_store_drug = function(){
        $scope.medicineDialog([],function(list){
          if(list.length>0){
            $.each(list,function(i,item){
                $scope.save_manytimes(item.id,function(resp){
                   if(i == list.length -1){
                      if (typeof resp.data['#message'] == "undefined") {
                          var txt=  "添加品种成功";
                          window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.success,{onOk:function(v){
                             setTable();
                          }});
                      }else{
                          window.wxc.xcConfirm(resp.data['#message'], window.wxc.xcConfirm.typeEnum.error);
                      }
                   }
                });
            });
          }
        },"添加品种");
     }
    $scope.save_manytimes=function(id,callback){
        var data = {};
        data = {state:0,goods:id}
        $http({
            url: app.url.set_good_state,
            method: 'post',            
            data:data
        }).then(function (resp) {
            callback(resp);
        });
    };

    var datable = null;
    if(validator == 0){
      setTable();
    }else{
      $(".varietylistnav li").eq(1).click();
    }
    //获取表格
    function setTable() {
    	var data={};
    	if(typeof $scope.title!='undefined' && $scope.title.length > 0){
    		data['__KEYWORD__'] = '%'+$scope.title+'%';
    	}

      if(typeof $scope.state_id!='undefined' && $scope.state_id.length > 0){
        data['state'] = $scope.state_id;
      }

      if(typeof $scope.cert_state_id!='undefined' && $scope.cert_state_id.length > 0){
        data['cert_state'] = $scope.cert_state_id;
      }
    	$http.post(app.url.query_for_stack,data).then(function(rpn) {
  			dataTable(rpn.data.info_list);
  			$scope.count = rpn.data.total;
  		});

      function dataTable(data) {
          if (datable) { //表格是否已经初始化
              datable.fnClearTable(); //清理表格数据
          }
          datable = $('#monocontactsList').dataTable({
              "language": app.lang.datatables.translation,
              "ordering": false,
              "bInfo":false,
              "bLengthChange": false,  
              "searching": false,
              "bDestroy": true, //可重新初始化
              "lengthMenu": [10, 15, 20, 30, 40, 50, 100],
              "data": data,
              "columns":[{
                      "data": function (set, status, dt) {
                        var image_url = typeof set['goods$image'] == "undefined"?"src/img/default_drugs.png":set['goods$image'];
                        if(typeof set.cert_state != "undefined" && set.cert_state.value==9){
                          return '<div class="varietylist-checkbox"><div class="checkbox showcheck"><label class="i-checks"><input type="checkbox" id="' + set.goods.id + '"  name="check' + set.goods.id + '" ><i></i></label></div><span class="imgblock"><img sb-load="onImgLoad($event)" src="'+image_url+'"/><span class="imgcheck">厂家认证</span></span><div>';  
                        }else{
                          return '<div class="varietylist-checkbox"><div class="checkbox showcheck"><label class="i-checks"><input type="checkbox" id="' + set.goods.id + '"  name="check' + set.goods.id + '" ><i></i></label></div><span class="imgblock"><img sb-load="onImgLoad($event)" src="'+image_url+'"/></span><div>';  
                        }
                      }
                  },{
                  "data": function (set, status, dt) {
                      if(typeof set['goods$trade_name'] != "undefined" && set['goods$trade_name'] != ""){
                        return "<a style='colour:blue;'>"+set['goods$general_name']+"（"+set['goods$trade_name']+"）</a>";
                      }else{
                        return "<a style='colour:blue;'>"+set['goods$general_name']+"</a>";
                      }
                  		
                  }
              }, {
                 "data": "goods$specification",
                   "orderable": false,
                   "searchable": false
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
                      if(typeof set.state != "undefined" && set.state.value==0){
                        return "<button type='button' class='btn state btn-audit0' style='width:90px;'><i></i>已上架</button>";
                      }else{
                        return "<button type='button' class='btn state btn-audit0' style='width:90px;'><i></i>已下架</button>";
                      }
                  	
                  },
                  "orderable": false,
                  "searchable": false
              }, {
                  "data":  function (set, status, dt) {
                      if(typeof set.cert_state != "undefined"){
                          return "<button type='button' class='btn cert_state btn-audit0' style='width:90px;'><i></i>"+set.cert_state.title+"</button>";
                      }else{
                          return "<button type='button' class='btn cert_state btn-audit0' style='width:90px;'><i></i>未认证</button>";
                      }
                    
                  },
                  "orderable": false,
                  "searchable": false
              },{
              	"data": "goods$abbr",
                  "orderable": false,
                  "searchable": false
              }],
              "createdRow": function(nRow, aData, iDataIndex) {
             	 $(nRow).on('click','td',function(){
                  if($(this).find("input[type='checkbox']").length>0) return;
               		$state.go('app.monovarietylist.drug_detail',{id:aData.goods.id,state:typeof aData.cert_state != "undefined"?aData.cert_state.value:0});
             	 });
               var state = aData.state.value;
               var cert_state = aData.cert_state.value;
             	 $(nRow).on('click','button.state',function(evt){
                    $scope.s=state==0?9:0;//上下操作
                     $http({
                        url: app.url.set_good_state,
                        method: 'post',            
                        data: {
                          goods:aData.goods.id,
                          state:$scope.s
                        }
                    }).then(function (resp) {
                      if (typeof resp.data['#message'] == "undefined") {
                        setTable();
                      }else{
                          window.wxc.xcConfirm(resp.data['#message'], window.wxc.xcConfirm.typeEnum.error);
                      }
                    });
                  evt = evt || window.event;
                  evt.stopPropagation();
             	 });
               $(nRow).on('click','button.cert_state',function(evt){
                  evt = evt || window.event;
                  evt.stopPropagation();
                  if(aData.cert_state.value != 0) return;
                  $http({
                      url: app.url.confirm_c_GoodsCert,
                      method: 'post',            
                      data:{
                        goodses:'json:'+JSON.stringify([aData.goods.id])
                      }
                  }).then(function (resp) {
                      if (typeof resp.data['#message'] == "undefined") {
                          var txt=  "提交认证成功";
                          window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.success,{onOk:function(v){
                             setTable();
                          }});
                      }else{
                          window.wxc.xcConfirm(resp.data['#message'], window.wxc.xcConfirm.typeEnum.error);
                      }
                  });
                  
                 
               });
             	 
             	 $(nRow).find('button.state').hover(function(){
             		 if(state==0){
             			 $(nRow).find('button.state').html("下架").attr("class","btn state btn-danger");
             		 }else if(state==9){
             			 $(nRow).find('button.state').html("上架").attr("class","btn state btn-success");
             		 }
             	 },function(){
             		 if(state==0){
             			 $(nRow).find('button.state').html("<i></i>已上架").attr("class","btn state btn-audit0");
             		 }else if(state==9){
             			 $(nRow).find('button.state').html("<i></i>已下架").attr("class","btn state btn-audit1");
             		 }
             	 });

              $(nRow).find('button.cert_state').hover(function(){
                 if(cert_state==0){
                   $(nRow).find('button.cert_state').html("提交认证").attr("class","btn cert_state btn-danger");
                 }
               },function(){
                 if(cert_state==0){
                   $(nRow).find('button.cert_state').html("<i></i>未认证").attr("class","btn cert_state btn-audit0");
                 }
               });
              }
          });

          var doctorList = $("#monocontactsList");
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
          });

          doctorList.find("input[name='checkall']").prop("checked",false);
      }
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

});
