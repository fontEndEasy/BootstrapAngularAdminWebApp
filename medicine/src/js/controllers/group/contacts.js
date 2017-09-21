'use strict';
app.controller('Contacts', function ($rootScope, $scope, $state, $http, $compile, utils, modal) {
    var data = null,
        cnt_list = $('#cnt_list'),
        items = cnt_list.find('.list-group-item'),
        dt = null,
        groupId = utils.localData('curGroupId');

    $scope.loading = true;
    $rootScope.loaded = true;
    console.log(localStorage.getItem('access_token')+"----");
    var html='';

    //批量添加品种
    $scope.add_store_drug = function(){
        $rootScope.directive.medicine([],function(list){
          if(list.length>0){
            $.each(list,function(i,item){
                /*$scope.save_manytimes(item.id,function(resp){
                   if(i == list.length -1){
                      if (typeof resp.data['#message'] == "undefined") {
                          var txt=  "添加品种成功";
                          window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.success);
                      }else{
                          window.wxc.xcConfirm(resp.data['#message'], window.wxc.xcConfirm.typeEnum.error);
                      }
                   }
                });*/
            });
          }
        });
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
    //查询已经离职的员工数目
    $scope.getMonomerNote = function () {
        $http.get(app.url.query_for_company, {}).success(function (data, status, headers, config) {
        	$scope.count = data.total;
            $(".count").html(data.total);
        });
    };
    //查询店长信息
    $scope.getShopkeeper = function () {
    	$scope.normal = true;
        $http.get(app.url.query_for_shopkeeper, {}).success(function (data, status, headers, config) {
            var list = data.info_list;
            $scope.list = data.info_list;
        });
    };
    $scope.normal = true;
    //查询职员信息
    $scope.getEmployee = function () {
    	$scope.normal = true;
        $http.get(app.url.query_for_employee, {}).success(function (data, status, headers, config) {
             $scope.list = data.info_list;
        });
    };

    //已经离职员工查询
    $scope.getLeaveEmployee = function () {
    $scope.normal = false;
        $http.get(app.url.query_for_company, {}).success(function (data, status, headers, config) {
            var list = data.info_list;
            $scope.list = data.info_list;
        });
    };
    $scope.getEmployee();
    $scope.getMonomerNote();
    $scope.getShopkeeper();
    var iEdit, iDelete;


    function enter(info) {
        $scope.curIndex = null;
        var cur_div = contacts.tree.find('.back-line');
        iEdit = $('<i class="pos-edit fa fa-pencil-square-o"></i>');
        iDelete = $('<i class="pos-delete fa fa-trash-o"></i>');
        $(this).append(iEdit).append(iDelete);
        iEdit.click(function (e) {
            var evt = e || window.event;
            evt.stopPropagation();
            $rootScope.targetDepartmentParentId = info.pid;
            $rootScope.targetDepartmentId = info.id;
            $rootScope.targetDepartmentName = info.name;
            $rootScope.targetDepartmentDescription = info.description;
            $state.go('app.contacts.list.edit');
        });

        iDelete.click(function (e) {
            var evt = e || window.event;
            evt.stopPropagation();
            $rootScope.targetDepartmentId = info.id;
            $rootScope.targetDepartmentName = info.name;
            $state.go('app.contacts.list.delete');
        });
    }


    function leave(info) {
        $scope.curIndex = null;
        iEdit.remove();
        iDelete.remove();
    }

    function forward(info) {
        $scope.curIndex = null;
        $rootScope.isSearch = false;
        $rootScope.curDepartmentId = info.id || null;
        utils.localData('curDepartmentId', $scope.curDepartmentId);
        $state.go('app.contacts.list', {id: info.id}, {reload: false});
    }

    $scope.check = function () {
        alert('checked');
    };

    // 添加组织
    $scope.addUnit = function () {
        $state.go('app.contacts.list.add');
    };
    
    // 添加门店店长
    $scope.addStoreLeader = function (id) {
    	$state.go('app.changeLeader("'+id+'")');
    };
    
    // 编辑组织
    $scope.editUnit = function () {
        if ($rootScope.obj['id']) {
            $rootScope.details = $rootScope.obj;
            setStatus(status_false);
            $state.go('app.org.edit');
        }
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
    // 模态框退出
    $rootScope.cancel = function () {
        mask.remove();
        $state.go('app.contacts');
    };
    // 不操作返回
    $scope.return = function () {
        $rootScope.ids = [];
        setStatus(status);
        window.history.back();
    };
    // 添加单个门店通讯录
    $scope.addMonomerDrug = function () {
        $state.go('app.contacts.list.adds');
    };
        
    //查询总店下的门店列表
    $scope.select_forStoreHQ = function () {
        $http.get(app.url.select_forStoreHQ, {}).
            success(function (data, status, headers, config) {
                var store_list = data.c_chaindrugstore_manages;
                $scope.store_list = data.c_chaindrugstore_manages;
                $scope.isShow = data.length==0?true:false;
                $scope.imgpath = localStorage.getItem('path');
            });
    };

   $scope.logintype = localStorage.getItem('user_type');
   var logintype = $scope.logintype;

    /*连锁药门店   c_ChainDrugStore
    经营企业 c_DrugDistributor
    总店：c_StoreHQ
    生产企业 c_DrugFactory
    单体药店(零售店) c_MonomerDrugStore*/
    if(logintype!='c_DrugFactory' && logintype!='c_MonomerDrugStore' && logintype !="c_ChainDrugStore"){
    	$scope.select_forStoreHQ();
    }

    console.log("logintype:"+logintype);

    function initMailTree(){
        $scope.my_tree_handler = function(branch) {};
        $scope.my_tree = {};
        $scope.my_datatree = [
            {
                label: utils.localData('user_name'),
                children: [
                  {
                    label: '店长',
                    onSelect:function(){
                        $scope.getShopkeeper();
                    }
                  }, 
                  {
                    label: '店员',
                    onSelect:function(){
                        $scope.getEmployee();
                    }
                  }
                ]
            },
            {
                label: "已离职员工",
                onSelect:function(){
                    $scope.getLeaveEmployee();
                }
            }
        ];
    }

    //零售店和连锁门店初始化菜单
    if(logintype=='c_MonomerDrugStore' || logintype=='c_ChainDrugStore' || logintype=='c_DrugFactory'){
        initMailTree();
    }
    // $(".nav li a").removeClass("nav-cur-item");  //清除选中的菜单
    //更换店长
});