'use strict';
app.controller('MonoContacts', function ($rootScope, $scope, $state, $http, $compile, utils, modal) {
    $scope.loading = true;
    $rootScope.loaded = true;

    $rootScope.$on('lister_monomerdrugstore_list', function (evet, data) {
        initQuery();
    });
    
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

    // 添加店员
    $scope.addMonomerDrug = function () {
        $state.go('app.monomerdrugstore.adds',{},{});
    };

    $scope.query_status = 0;
    function initQuery(){
        if($scope.query_status == 0){
            $scope.getShopkeeper();
        }else if($scope.query_status == 1){
            $scope.getEmployee();
        }else if($scope.query_status == 2){
            $scope.getLeaveEmployee();
        }
    }

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
                        $scope.query_status = 0;
                        $scope.getShopkeeper();
                    }
                  }, 
                  {
                    label: '店员',
                    onSelect:function(){
                        $scope.query_status = 1;
                        $scope.getEmployee();
                    }
                  }
                ]
            },
            {
                label: "已离职员工",
                onSelect:function(){
                    $scope.query_status = 2;
                    $scope.getLeaveEmployee();
                }
            }
        ];
    }
    initMailTree();
    initQuery();
});