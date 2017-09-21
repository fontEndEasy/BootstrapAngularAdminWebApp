'use strict';
app.controller('storehqContacts', function ($rootScope, $scope, $state, $http, $compile, utils, modal) {
    $scope.loading = true;
    $rootScope.loaded = true;
    $scope.is_test = false;

    var html='';
    //批量添加品种
    $scope.add_store_drug = function(){
        $scope.medicineDialog([],function(list){
          if(list.length>0){
            $.each(list,function(i,item){
                /*$scope.save_manytimes(item.id,function(resp){
                   if(i == list.length -1){
                      if (resp.data.is_success == true) {
                          var txt=  "添加品种成功";
                          window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.success,{onOK:function(v){
                             $state.go('app.monovarietylist',{},{'reload':true});
                          }});
                      }else{
                          window.wxc.xcConfirm(resp.data['#message'], window.wxc.xcConfirm.typeEnum.error);
                      }
                   }
                });*/
            });
          }
        });
     }

     $scope.changeFrame = function(_id){
       $(_id).show();
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

    //删除门店
    $scope.storehqdel = function(id){
      var txt=  "确定删除该门店吗？";
      var option = {
        title: "提示框",
        btn: parseInt("0011",2),
        onOk: function(){
        $http.get(app.url.delete_chain_HQ+'?id='+id).
        success(function (data, status, headers, config) {
          if(typeof data['#message'] == "undefined"){
              var txt=  "删除成功！！！";
              window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.success,{onOk:function(v){
                $scope.select_forStoreHQ();
              }});
            }else{
              window.wxc.xcConfirm(data['#message'], window.wxc.xcConfirm.typeEnum.error);
            }
          });
        }
      };
      window.wxc.xcConfirm(txt, "confirm", option);
    }

    // 添加门店店长
    $scope.addStoreLeader = function (id) {
    	$state.go('app.changeLeader("'+id+'")');
    };
    
    var mask = $('<div class="mask"></div>');
    var container = $('#dialog-container');
    var dialog = $('#dialog');
    var doIt = function () {
    };
    // 执行操作
    $rootScope.do = function () {
        doIt();
    };

    $rootScope.$on('lister_storehq_list', function (evet, data) {
        $scope.select_forStoreHQ();
    });

    //查询总店下的门店列表
    $scope.select_forStoreHQ = function () {
        $http.get(app.url.select_forStoreHQ, {}).success(function (data, status, headers, config) {
            var store_list = data.c_chaindrugstore_manages;
            $scope.store_list = data.c_chaindrugstore_manages;
            $scope.isShow = data.length==0?true:false;
            $scope.imgpath = localStorage.getItem('path');
        });
    };
   $scope.select_forStoreHQ();

});