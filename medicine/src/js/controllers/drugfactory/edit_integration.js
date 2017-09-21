'use strict';
app.controller('EditIntegration', function ($rootScope, $scope, $state, $http,$stateParams, $compile, utils, modal) {
    $scope.type = $stateParams.type;
    var ids = $stateParams.ids.split("|");
    var goods = ids[0];
    var id = ids[1];
    console.log(ids);
    $scope.name = $stateParams.name;
    //删除积分规则
    $scope.edit_integration_del = function(){
    	var txt=  "确定要删除吗？";
        window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.confirm,{onOk:function(v){

        },onCancel:function(){

        }});
    };


    //查询积分
    function select_c_PZJFGZ(_id){
        $http({
            "method": "get",
            "url": app.url.select_c_PZJFGZ+"?goods="+_id
        }).then(function (resp) {
            $scope.c_PZJFGZ_info = resp.data.info_list;
            if($scope.c_PZJFGZ_info.length >0){
                var data = $scope.c_PZJFGZ_info[0];
                $scope.start_date = data.start_date;
                $scope.end_date = data.end_date;
                $scope.bptydxsdphdjfs = data.bptydxsdphdjfs;
                $scope.qtqdxsdphdjfs = data.qtqdxsdphdjfs;
                $scope.zyzdsxjfs = data.zyzdsxjfs;
                $scope.zsmdwypxhjfs = data.zsmdwypxhjfs;
            }
        });
    }
    
    if($scope.type == 'edit'){  //编辑去查询
        select_c_PZJFGZ(goods);    
    }

    //新增积分规则
    $scope.edit_integration_save=function(){
        var data = {};
        data.goods = goods;
        data.start_date = $scope.start_date;
        data.end_date = $scope.end_date;
        data.bptydxsdphdjfs = $scope.bptydxsdphdjfs;
        data.qtqdxsdphdjfs = $scope.qtqdxsdphdjfs;
        data.zyzdsxjfs = $scope.zyzdsxjfs;
        data.zsmdwypxhjfs = $scope.zsmdwypxhjfs;

        $http({
            url: app.url.create_c_PZJFGZ,
            method: 'post',            
            data:data
        }).then(function (resp) {
            if (typeof resp.data['#message'] == "undefined") {
                var txt=  "添加药品积分成功";
                $rootScope.$emit('lister_select_c_PZJFGZ');
                window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.success,{onOk:function(v){
                    $scope.edit_integration_cancel();
                }});
            }else{
                 window.wxc.xcConfirm(resp.data['#message'], window.wxc.xcConfirm.typeEnum.error);
            }
        });
        
    };

    //更新积分规则
    $scope.edit_integration_update=function(){
        var data = {};
        data.id = id;
        data.goods = goods;
        data.start_date = $scope.start_date;
        data.end_date = $scope.end_date;
        data.bptydxsdphdjfs = $scope.bptydxsdphdjfs;
        data.qtqdxsdphdjfs = $scope.qtqdxsdphdjfs;
        data.zyzdsxjfs = $scope.zyzdsxjfs;
        data.zsmdwypxhjfs = $scope.zsmdwypxhjfs;
    	$http({
            url: app.url.edit_c_PZJFGZ,
            method: 'post',            
            data:data
        }).then(function (resp) {
            if (typeof resp.data['#message'] == "undefined") {
            	var txt=  "更新成功";
                $scope.$emit('lister_select_c_PZJFGZ');
        		window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.success,{onOk:function(v){
                    $scope.edit_integration_cancel();
                }});
            }else{
                 window.wxc.xcConfirm(resp.data['#message'], window.wxc.xcConfirm.typeEnum.error);
            }
        });
    	
    };
    
    //模态框退出
    $scope.edit_integration_cancel = function () {
        $state.go('app.integration',{},{});
    };	

    //加载datepickter
    function initStartDate(){
        $('#integrat_stime').daterangepicker({
            singleDatePicker: true,
            format:"YYYY-MM-DD"
        },
        function(start, end, label) {
            $scope.start_date = start.toISOString().split("T")[0];
            $scope.end_date = "";
            $('#integrat_etime').val("");
            initEndDate($scope.start_date);
        });
    }

    function initEndDate(_minDate){
        if(typeof _minDate != "undefined"){
            $('#integrat_etime').daterangepicker({
                singleDatePicker: true,
                minDate: _minDate,
                format:"YYYY-MM-DD"
            },
            function(start, end, label) {
                $scope.end_date = start.toISOString().split("T")[0];

            });
        }else{
            $('#integrat_etime').daterangepicker({
                singleDatePicker: true,
                format:"YYYY-MM-DD"
            },
            function(start, end, label) {
                $scope.end_date = start.toISOString().split("T")[0];

            });
        }
        
    }

    initStartDate();
    initEndDate();

});
