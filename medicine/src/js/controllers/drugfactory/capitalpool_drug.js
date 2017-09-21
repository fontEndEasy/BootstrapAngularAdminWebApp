app.controller('capitalpoolDrugController', function ($rootScope, $scope, $state,$stateParams, $http, $compile, utils, modal,$timeout) {
    var type = $stateParams.type;
    var id = $stateParams.id;
    $scope.amount = "";
    $scope.outaccountlist = [];
    $scope.inaccountlist = [];
    $scope.vm = {
      outbeforemoney:0,
      outaftermoney:0,
      inbeforemoney:0,
      inaftermoney:0,
      outsdmoney:0,
      insdmoney:0
    };
    var chartHeight = 380;


    $timeout(function() {
        $scope.vm = {
          outbeforemoney:0,
          outaftermoney:0,
          inbeforemoney:0,
          inaftermoney:0
        };
        $scope.chartData = [ 
          {
            "category": "PM0001",
            "id":1,
            "ts":"zhangsan",
            "value1": 70,
            "value2": 30,
            "value3": 0,
            "zjc":100000,
            "sdjy":60000,
            "kyye":40000,
            "jfdyybj":10000,
            "emptys":"",
            "subacount":[
              {"id":1,"category":"推广活动[2015/09/01-2015/9/28]","sdze":10000,ayfsfy:5000,ayjsfy:3000,adjsfy:2000,asyfy:5000},
              {"id":2,"category":"推广活动[2015/10/01-2015/10/28]","sdze":12000,ayfsfy:12000,ayjsfy:9000,adjsfy:3000,asyfy:0},
              {"id":3,"category":"推广活动[2015/11/01-2015/11/28]","sdze":18000,ayfsfy:15000,ayjsfy:13000,adjsfy:2000,asyfy:3000},
              {"id":4,"category":"推广活动[2015/12/01-2015/12/28]","sdze":10000,ayfsfy:0,ayjsfy:0,adjsfy:0,asyfy:10000}
            ]
          }, 
          {
            "category": "PM0002",
            "id":2,
            "ts":"lishi",
            "value1": 80,
            "value2": 20,
            "value3": 0,
            "zjc":82000,
            "sdjy":60000,
            "kyye":22000,
            "jfdyybj":10000,
            "emptys":"",
            "subacount":[
              {"id":1,"category":"推广活动[2015/09/01-2015/9/28]","sdze":10000,ayfsfy:5000,ayjsfy:3000,adjsfy:2000,asyfy:5000},
              {"id":2,"category":"推广活动[2015/10/01-2015/10/28]","sdze":12000,ayfsfy:12000,ayjsfy:9000,adjsfy:3000,asyfy:0},
              {"id":3,"category":"推广活动[2015/11/01-2015/11/28]","sdze":18000,ayfsfy:15000,ayjsfy:13000,adjsfy:2000,asyfy:3000},
              {"id":4,"category":"推广活动[2015/12/01-2015/12/28]","sdze":10000,ayfsfy:0,ayjsfy:0,adjsfy:0,asyfy:10000}
            ]
          }, 
          {
            "category": "PM0003",
            "id":3,
            "ts":"wangwu",
            "value1": 30,
            "value2": 50,
            "value3": 20,
            "zjc":80000,
            "sdjy":60000,
            "kyye":20000,
            "jfdyybj":10000,
            "emptys":"",
            "subacount":[
              {"id":1,"category":"推广活动[2015/09/01-2015/9/28]","sdze":10000,ayfsfy:5000,ayjsfy:3000,adjsfy:2000,asyfy:5000},
              {"id":2,"category":"推广活动[2015/10/01-2015/10/28]","sdze":12000,ayfsfy:12000,ayjsfy:9000,adjsfy:3000,asyfy:0},
              {"id":3,"category":"推广活动[2015/11/01-2015/11/28]","sdze":18000,ayfsfy:15000,ayjsfy:13000,adjsfy:2000,asyfy:3000},
              {"id":4,"category":"推广活动[2015/12/01-2015/12/28]","sdze":10000,ayfsfy:0,ayjsfy:0,adjsfy:0,asyfy:10000}
            ]
          } 
      ];

      if(type == 1){ //品种间调拨
        $scope.outaccountlist = $scope.chartData.slice(0);
        $scope.outaccount = $scope.outaccountlist[0].id;
        $scope.inaccountlist = [];
        $.each($scope.outaccountlist,function(index,item){
          if($scope.outaccount != item.id){
            $scope.inaccountlist.push(item);
          }
        });
        $scope.inaccount = $scope.inaccountlist[0].id;
        initializeChartArr();
      }else{ //PM资金池调拨
        var zjcArr = [];
        $.each($scope.chartData,function(index,item){
          if(id == item.id){
            zjcArr.push(item);
            $scope.outaccountlist = [];
            $scope.outaccountlist.push({
              "id":"jfid",
              "category":"积分兑药预备金",
              "money":item.jfdyybj,
              "value1":0,
              "value2":0,
              "value3":0,
              "value4":100,
              "zjc":item.zjc,
              "sdjy":item.sdjy,
              "kyye":item.kyye,
              "jfdyybj":item.jfdyybj,
              "ts":item.jfdyybj
            });
            $.each(item.subacount,function(idx,idxitem){
              idxitem.money = idxitem.asyfy;
              idxitem.value1 = 0;
              idxitem.value2 = 0;
              idxitem.value3 = 0;
              idxitem.value4 = 100;
              idxitem.zjc = item.zjc;
              idxitem.sdjy = item.sdjy;
              idxitem.kyye = item.kyye;
              idxitem.jfdyybj = item.jfdyybj;
              idxitem.ts = idxitem.asyfy;
              $scope.outaccountlist.push(idxitem);
            });
            $scope.outaccountlist.push({
              "id":"jjyeid",
              "category":"资金池余额",
              "money":item.kyye,
              "value1":0,
              "value2":0,
              "value3":0,
              "value4":100,
              "zjc":item.zjc,
              "sdjy":item.sdjy,
              "kyye":item.kyye,
              "jfdyybj":item.jfdyybj,
              "ts":item.kyye
            });
            return false;
          }
        });
        $scope.outaccount = $scope.outaccountlist[0].id;
        $scope.inaccountlist = [];
        $.each($scope.outaccountlist,function(index,item){
          if($scope.outaccount != item.id){
            $scope.inaccountlist.push(item);
          }
        });
        $scope.inaccount = $scope.inaccountlist[0].id;

        initializeChartArr();
      }
      
  },300);

  //拨出账号select改变
  $scope.setOutAccount = function(outaccount){
    $scope.inaccountlist = [];
    $scope.inaccount = "";
    $scope.amount = "";
    $.each($scope.outaccountlist,function(index,item){
      if(outaccount != item.id){
        $scope.inaccountlist.push(item);
      }
    });
    initializeChartArr();
  }

  //拨入账号select改变
  $scope.setInAccount = function(inaccount){
    initializeChartArr();
  }

  //监听调拨金额
  $scope.$watch('amount',function(newValue,oldValue, scope){
    if(newValue!="" && isNaN(newValue)) {
      $scope.amount = oldValue;
      return;
    }else if(!isNaN(newValue) && Number(newValue) > $scope.vm.outbeforemoney){
      $scope.amount = oldValue;
      return;
    }
    initializeChartArr();
  });

  $scope.pmenter = function(){
    //调用调拨接口
    
    $scope.$emit('lister_capitalpool');
    $state.go('app.capitalpool',{},{});
  }

  $scope.pmcancel = function(){
    $state.go('app.capitalpool',{},{});
  }

  //初始圆柱数据
  function initializeChartArr(){
    var tempOutArr = [];
    var tempInArr = [];
    if($scope.outaccountlist.length == 0 || $scope.inaccountlist.length == 0) return;
    $.each($scope.outaccountlist,function(index,item){
      if($scope.outaccount == item.id){
        tempOutArr.push(item);
        return false;
      }
    });

    $.each($scope.inaccountlist,function(index,item){
      if($scope.inaccount == item.id){
        tempInArr.push(item);
        return false;
      }
    });
    if(type == 1){
      $.each($scope.outaccountlist,function(index,item){
        var pge = (item.zjc+tempInArr[0].zjc)/100;
        $scope.outaccountlist[index].value1 = item.sdjy/pge;
        $scope.outaccountlist[index].value2 = $scope.amount!=""?(item.kyye-Number($scope.amount))/pge:item.kyye/pge;
        $scope.outaccountlist[index].value3 = $scope.amount!=""?Number($scope.amount)/pge:0;
        $scope.outaccountlist[index].value4 = 100 -  $scope.outaccountlist[index].value1 - $scope.outaccountlist[index].value2 - $scope.outaccountlist[index].value3;
        $scope.outaccountlist[index].dqye = $scope.amount!=""?(Number(item.kyye)-Number($scope.amount)):Number(item.kyye);
        $scope.outaccountlist[index].amout = $scope.amount;
      });

      $.each($scope.inaccountlist,function(index,item){
        var pge = (item.zjc+tempOutArr[0].zjc)/100;
        $scope.inaccountlist[index].value1 = item.sdjy/pge;
        $scope.inaccountlist[index].value2 = item.kyye/pge;//$scope.amount!=""?(item.kyye+Number($scope.amount))/pge:item.kyye/pge;
        $scope.inaccountlist[index].value3 = $scope.amount!=""?Number($scope.amount)/pge:0;
        $scope.inaccountlist[index].value4 = 100 -  $scope.inaccountlist[index].value1 - $scope.inaccountlist[index].value2 - $scope.inaccountlist[index].value3;
        $scope.inaccountlist[index].dqye = Number(item.kyye);
        $scope.inaccountlist[index].amout = $scope.amount;
      });
      
      initChart("capitalpool-drug-chart-left",tempOutArr);
      initChart("capitalpool-drug-chart-right",tempInArr);

      $scope.vm.outbeforemoney = tempOutArr[0].kyye;
      $scope.vm.outaftermoney = $scope.amount!=""?tempOutArr[0].kyye-Number($scope.amount):tempOutArr[0].kyye;
      $scope.vm.inbeforemoney = tempInArr[0].kyye;
      $scope.vm.inaftermoney = $scope.amount!=""?tempInArr[0].kyye+Number($scope.amount):tempInArr[0].kyye;
    }else{
      $.each($scope.outaccountlist,function(index,item){
        var pge = (item.zjc+tempInArr[0].zjc)/100;
        $scope.outaccountlist[index].value1 = item.sdjy/pge;
        $scope.outaccountlist[index].value2 = $scope.amount!=""?(Number(item.money)-Number($scope.amount))/pge:Number(item.money)/pge;
        $scope.outaccountlist[index].value3 = $scope.amount!=""?Number($scope.amount)/pge:0;
        $scope.outaccountlist[index].value4 = 100 -  $scope.outaccountlist[index].value1 - $scope.outaccountlist[index].value2 - $scope.outaccountlist[index].value3;
        $scope.outaccountlist[index].dqye = $scope.amount!=""?(Number(item.money)-Number($scope.amount)):Number(item.money);
        $scope.outaccountlist[index].amout = $scope.amount;

      });

      $.each($scope.inaccountlist,function(index,item){
        var pge = (item.zjc+tempOutArr[0].zjc)/100;
        $scope.inaccountlist[index].value1 = item.sdjy/pge;
        $scope.inaccountlist[index].value2 = Number(item.money)/pge; //$scope.amount!=""?(Number(item.money)+Number($scope.amount))/pge:Number(item.money)/pge;
        $scope.inaccountlist[index].value3 = $scope.amount!=""?Number($scope.amount)/pge:0;
        $scope.inaccountlist[index].value4 = 100 -  $scope.inaccountlist[index].value1 - $scope.inaccountlist[index].value2 - $scope.inaccountlist[index].value3;
        $scope.inaccountlist[index].dqye = Number(item.money);
        $scope.inaccountlist[index].ts = $scope.amount;
      });
      
      initChart("capitalpool-drug-chart-left",tempOutArr);
      initChart("capitalpool-drug-chart-right",tempInArr);

      $scope.vm.outbeforemoney = Number(tempOutArr[0].money);
      $scope.vm.outaftermoney = $scope.amount!=""?Number(tempOutArr[0].money)-Number($scope.amount):Number(tempOutArr[0].money);
      $scope.vm.inbeforemoney = Number(tempInArr[0].money);
      $scope.vm.inaftermoney = $scope.amount!=""?Number(tempInArr[0].money)+Number($scope.amount):Number(tempInArr[0].money);
      $scope.vm.insdmoney = tempInArr[0].sdjy;
      $scope.vm.outsdmoney = tempOutArr[0].sdjy;
    }
    
  }
  //初始圆柱形图
  function initChart(divid,chartdata){
    var graphs = [];
    if(type == 1){
      graphs = [ {
          "balloonText": "锁定金额: <b>[[sdjy]]</b>",
          "type": "column",
          "topRadius": 1,
          "columnWidth": 0.9,
          "showOnAxis": true,
          "lineThickness": 2,
          "lineAlpha": 0.5,
          "lineColor": "#3b3838",
          "fillColors": "#3b3838",
          "fillAlphas": 0.9,
          "valueField": "value1"
        }, {
          "balloonText": "当前余额: <b>[[dqye]]</b>",
          "type": "column",
          "topRadius": 1,
          "columnWidth": 0.9,
          "showOnAxis": true,
          "lineThickness": 2,
          "lineAlpha": 0.5,
          "lineColor": "#7c9b68",
          "fillColors": "#7c9b68",
          "fillAlphas": 0.5,
          "valueField": "value2"
        }, {
          "balloonText": "调拨金额: <b>[[amout]]</b>",
          "type": "column",
          "topRadius": 1,
          "columnWidth": 0.9,
          "showOnAxis": true,
          "lineThickness": 2,
          "lineAlpha": 0.5,
          "lineColor": divid=="capitalpool-drug-chart-left"?"#ca7364":"#a4cbea",
          "fillColors": divid=="capitalpool-drug-chart-left"?"#ca7364":"#a4cbea",
          "fillAlphas": 0.5,
          "valueField": "value3"
        } , {
          "balloonText": "",
          "type": "column",
          "topRadius": 1,
          "columnWidth": 0.9,
          "showOnAxis": true,
          "lineThickness": 2,
          "lineAlpha": 0,
          "lineColor": "#cecece",
          "fillColors": "#cecece",
          "fillAlphas": 0,
          "valueField": "value4"
        } ];
    }else{
      graphs = [{
          "balloonText": "锁定金额: <b>[[sdjy]]</b>",
          "type": "column",
          "topRadius": 1,
          "columnWidth": 0.9,
          "showOnAxis": true,
          "lineThickness": 2,
          "lineAlpha": 0.5,
          "lineColor": "#3b3838",
          "fillColors": "#3b3838",
          "fillAlphas": 0.9,
          "valueField": "value1"
        },{
          "balloonText": "当前余额: <b>[[dqye]]</b>",
          "type": "column",
          "topRadius": 1,
          "columnWidth": 0.9,
          "showOnAxis": true,
          "lineThickness": 2,
          "lineAlpha": 0.5,
          "lineColor": divid=="capitalpool-drug-chart-left"?"#b7d6a3":"#e0f9fe",
          "fillColors": divid=="capitalpool-drug-chart-left"?"#b7d6a3":"#e0f9fe",
          "fillAlphas": 0.9,
          "valueField": "value2"
        }, {
          "balloonText": "调拨金额: <b>[[amout]]</b>",
          "type": "column",
          "topRadius": 1,
          "columnWidth": 0.9,
          "showOnAxis": true,
          "lineThickness": 2,
          "lineAlpha": 0.5,
          "lineColor": divid=="capitalpool-drug-chart-left"?"#ca7364":"#a4cbea",
          "fillColors": divid=="capitalpool-drug-chart-left"?"#ca7364":"#a4cbea",
          "fillAlphas": 0.5,
          "valueField": "value3"
        }, {
          "balloonText": "",
          "type": "column",
          "topRadius": 1,
          "columnWidth": 0.9,
          "showOnAxis": true,
          "lineThickness": 2,
          "lineAlpha": 0,
          "lineColor": "#cecece",
          "fillColors": "#cecece",
          "fillAlphas": 0,
          "valueField": "value4"
        }];
    }

    var chart = AmCharts.makeChart(divid, {
        "theme": "light",
        "type": "serial",
        "depth3D": 80,
        "angle": 30,
        "autoMargins": false,
        "marginBottom": 30,
        "marginLeft": 50,
        "marginRight": 0,
        "dataProvider": chartdata,
        "valueAxes": [ {
          "stackType": "100%",
          "gridAlpha": 0,
          "axisAlpha":0,
          "color":"#ffffff"
        } ],
        "graphs": graphs,
        "categoryField": "category",
        "categoryAxis": {
          "axisAlpha": 0,
          "labelOffset": 40,
          "gridAlpha": 0
        },
        "export": {
          "enabled": true
        }
      });
    }

  });
