'use strict';
app.controller('MonoIntegrationActive', function ($rootScope, $scope, $state, $http, $compile, utils, modal) {
    var datable;
    //获取表格
    function setTable() {
        var data = {};
        function dataTable(data) {
              if (datable) { //表格是否已经初始化
                  datable.fnClearTable(); //清理表格数据
              }

              console.log(data);
              datable = $('#monoactive-table').dataTable({
                  "language": app.lang.datatables.translation,
                  "ordering": false,
                  "bInfo":false,
                  "bLengthChange": false,  
                  "searching": false,
                  "bDestroy": true, //可重新初始化
                  "lengthMenu": [10, 15, 20, 30, 40, 50, 100],
                  "data": data,
                  "columns":[
                    {"data": function (set, state, dt) {return set.goods.title;}},
                    // {"data": function (set, state, dt) { return set.pzdm;}}, 
                    {"data": function (set, state, dt) {return set['goods$manufacturer'];},"orderable": false,"searchable": false}, 
                    {
                        "data": function (set, state, dt) {
                            return "每赠送出10盒药，药厂补贴一盒药";
                        },
                        "orderable": false,
                        "searchable": false,
                        "visible":false
                    }, 
                    {"data": function (set, state, dt) {
                        if(!set.is_join_goods){
                            return "<button type='button' class='btn btn-audit1' style='width:90px;' id='"+set.goods.id+"'><i></i>未参加</button>";
                        }else{
                            return "<button type='button' class='btn btn-audit0' style='width:90px;' id='"+set.goods.id+"'><i></i>已参加</button>";
                        }
                      },
                      "orderable": false,
                      "searchable": false
                    }],
                  "createdRow": function(nRow, aData, iDataIndex) {
                    var is_join_goods = aData.is_join_goods;  //是否参加
                    var is_cert_goods = aData.is_cert_goods;  //是否认证
                    var is_own_goods = aData.is_own_goods;    //是否上架
                    //是否参与
                    $(nRow).on('click','button',function(){
                        if(!is_join_goods){  //未参加
                            if(!is_own_goods){
                                var text = "请确认品种有货并上架后，方可参加患者积分换药活动。";
                                 window.wxc.xcConfirm(text, window.wxc.xcConfirm.typeEnum.confirm,{okText:"去上架",cancelText:"知道了",onOk:function(){
                                      $state.go('app.monovarietylist',{},{});
                                 }});
                            }else{
                                if(!is_cert_goods){
                                  var text = "请先向厂商提交该药品的厂家认证，认证完成后方可参加患者积分换药活动。";
                                  window.wxc.xcConfirm(text, window.wxc.xcConfirm.typeEnum.confirm,{okText:"去认证",cancelText:"知道了",onOk:function(){
                                      $state.go('app.monovarietylist',{},{});
                                  }});
                                }else{
                                   var text = "确定要参加吗？";
                                   window.wxc.xcConfirm(text, window.wxc.xcConfirm.typeEnum.warning,{onOk:function(){
                                        $http({
                                            url: app.url.join_c_JF_STORE_JOIN,
                                            method: 'post',            
                                            data: {
                                                goods:aData.goods.id
                                            }
                                        }).then(function (resp) {
                                             setTable();
                                        });
                                   }});
                                }
                            }
                           
                        }else{
                           var text = "确定要退出吗？";
                           window.wxc.xcConfirm(text, window.wxc.xcConfirm.typeEnum.warning,{onOk:function(){
                                $http({
                                    url: app.url.out_c_JF_STORE_JOIN,
                                    method: 'post',            
                                    data: {
                                        goods:aData.goods.id
                                    }
                                }).then(function (resp) {
                                     setTable();
                                });
                           }});
                        }
                         
                     });
                     
                     $(nRow).find('button').hover(function(){
                         if(!is_join_goods){
                             $(nRow).find('button').html("参加").attr("class","btn btn-success");
                         }else if(is_join_goods){
                             $(nRow).find('button').html("退出").attr("class","btn btn-danger");
                         }
                     },function(){
                         if(!is_join_goods){
                             $(nRow).find('button').html("<i></i>未参加").attr("class","btn btn-audit1");
                         }else if(is_join_goods){
                             $(nRow).find('button').html("<i></i>已参加").attr("class","btn btn-audit0");
                         }
                     });
                  }
              });
        }


        $http.post(app.url.get_c_JF_STORE_JOIN,data).then(function(resp) {
            dataTable(resp.data.data);
        });

    }

    setTable();

    
});
