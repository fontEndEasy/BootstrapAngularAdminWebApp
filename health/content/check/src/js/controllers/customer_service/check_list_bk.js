'use strict';

app.controller('CheckListUndone', function($rootScope, $scope, $state, $timeout, $http, utils) {
  var url = app.url.admin.check.getDoctors; // 后台API路径
  var data = null;

  // 从后台获取数据
  $http.post(url,{
    access_token: app.url.access_token
  }).then(function(resp) {
    if (resp.data.resultCode === 1) {
      data = resp.data.data;
      if(dTable){
        dTable.fnDestroy();
        initTable();
      }else{
        initTable();
      }
      $scope.loading = false;
    } else {
      console.warn(resp.statusText);
    }
  }, function(err) {
    console.error(err.statusText);
  });

  $scope.click = function(){};

  var status_false = {
    only : true,
    single : true,
    locked : true,
    mutiple : true
  };

  var status = {
    only : false,
    single : true,
    locked : true,
    mutiple : true
  };

  // 添加组织（工具栏按钮）
  $scope.addUnit = function(){
    if($rootScope.ids.length === 0){
      $rootScope.details = {};
    }
    setStatus(status_false);
    $state.go('app.org.add');
  };

  // 编辑某一组织（工具栏按钮）
  $scope.checkIt = function(){
    if($rootScope.obj['userId']){
      $rootScope.details = $rootScope.obj;
      setStatus(status_false);
      $state.go('app.check_edit');
    }
  };

  var mask = $('<div class="mask"></div>');
  var container = $('#dialog-container');
  var dialog = $('#dialog');
  var hButton = $('#clickId');
  var doIt = function(){};

  // 冻结某一组织（工具栏按钮）
  $scope.freeze = function(){
    mask.insertBefore(container);
    container.removeClass('none');
    doIt = function(){
      app.utils.getData(app.url.org.freeze, {id: $rootScope.ids[0]['id']}, function callback(dt){
        //data = dt;
      });
    };
  };

  // 设置某一组织的考勤时间（工具栏按钮）
  $scope.attendance = function(){
    setStatus(status_false);
    $state.go('app.org.attendance');
  };

  // 删除某一组织（工具栏按钮）
  $scope.removeIt = function(){
    mask.insertBefore(container);
    container.removeClass('none');
    doIt = function(){
      if($rootScope.ids.length !== 0){
        var url = app.url.org.api.delete;
        app.utils.getData(url, {"ids":$rootScope.ids}, function callback(dt){
          mask.remove();
          container.addClass('none');
          $state.reload('app.org.list');
        });
      }
    };
  };

  // 执行操作
  $rootScope.do = function(){
    doIt();
  };

  // 模态框退出
  $rootScope.cancel = function(){
    mask.remove();
    container.addClass('none');
  };  

  // 不操作返回
  $scope.return = function(){
    $rootScope.ids = [];
    setStatus(status);
    window.history.back();
  };  

  // 查看某一组织详情（工具栏按钮）
  $scope.seeDetails = function(id){
    $rootScope.details = app.utils.getDataByKey(data, 'id', id ? id : $rootScope.ids[0]);
    setStatus(status_false);
    $state.go('app.org.details');
  };

  // 设置按钮的状态值
  $scope.setBtnStatus = function(){

    if($scope.ids.length === 0){
      $scope.single = true;
      $scope.locked = true;
      $scope.mutiple = true;
      $scope.only = false;
    }else if($scope.ids.length === 1){
      $scope.only = false;
      $scope.single = false;
      $scope.locked = false;
      $scope.mutiple = false;
    }else{
      $scope.only = true;
      $scope.single = true;
      $scope.locked = true;
      $scope.mutiple = false;
    }

    if(!$scope.obj.locked){
      if(!$scope.single) {
        $('button .fa-lock').next('span').html('冻结');
      }
    } else {
      if(!$scope.single){
        $('button .fa-lock').next('span').html('解冻');
      }
    }

    hButton.trigger('click'); // 触发一次点击事件，使所以按钮的状态值生效
  };

  function setStatus(param){
    if(param){
      $scope.only = param.only,
      $scope.single = param.single,
      $scope.locked = param.locked,
      $scope.mutiple = param.mutiple
    }
  }

  ////////////////////////////////////////////////////////////

  var id_key = null;
  $rootScope.init = function(){
    id_key = {
      "parent": $scope.item_id
    };
    utils.getData(url, id_key, function callback(dt){
      data = dt;
      if(dTable){
        dTable.fnDestroy();
        initTable();
      }else{
        initTable();
      }
    });
  };

  $rootScope.ids = [];

  function clicked(target, that){
    var classname = 'rowSelected', id;

    target.click(function(e){
      var evt = e || window.event;
      //evt.preventDefault();
      evt.stopPropagation();

      if(!that){
        that = $(this).parents('tr');
      }

      $rootScope.details = $rootScope.obj = utils.getDataByKey(data, 'userId', that.data('id'));
      id = $rootScope.obj['id'];

      if(!$(this)[0].checked){
        var idx = $rootScope.ids.indexOf(id);
        if(idx !== -1 ) $rootScope.ids.splice(idx, 1);
      }else{
        $rootScope.ids.push(id);
      }
      $scope.setBtnStatus();
    });
  }

  // 初始化表格 jQuery datatable
  var doctorList, dTable;
  function initTable() {
    doctorList = $('#doctorList');
    dTable = doctorList.dataTable({
      "search": null,
      "data": data,
      "sAjaxDataProp": "dataList",
      "oLanguage": app.lang.datatables.translation,
      "fnCreatedRow": function(nRow, aData, iDataIndex){
        $(nRow).attr('data-id', aData['userId']);
      },
      "drawCallback": function( settings ) {
        var input = doctorList.find('thead .i-checks input');
        var inputs = doctorList.find('tbody .i-checks input');
        var len = inputs.length, allChecked = true;
        for(var i=0; i<len; i++){
          if(!inputs.eq(i)[0].checked){
            allChecked = false;
            break;
          }
        }
        // if(allChecked){
        //   input[0].checked = true;
        // }else{
        //   input[0].checked = false;
        // }
        
        input.off().click(function(){
          for(var i=0; i<len; i++){
            if(!inputs.eq(i)[0].checked || !$(this)[0].checked){  
              clicked(inputs.eq(i).off());
              inputs.eq(i).trigger('click');
            }
          }
        });
      },
      "aoColumns": [{
        "mDataProp": "doctorNum"
      }, {
        "mDataProp": "title"
      }, {
        "mDataProp": "hospital"
      }, {
        "mDataProp": "name"
      }, {
        "mDataProp": "telephone"
      }]
    });

    var id;
    
    // 表格行事件
    dTable.$('tr').dblclick(function(e, settings) {
      //$scope.seeDetails($(this).data('id'));
    }).click(function(e) {
      var evt = e || window.event;
      var target = event.target || event.srcElement;

      evt.preventDefault();
      //evt.stopPropagation();
      var ipt = $(this).find('.i-checks input');
      clicked(ipt.off(), $(this));
      ipt.trigger('click');
      var input = doctorList.find('thead .i-checks input');
      var inputs = doctorList.find('tbody .i-checks input');
      var len = inputs.length, allChecked = true;
      for(var i=0; i<len; i++){
        if(!inputs.eq(i)[0].checked){
          allChecked = false;
          break;
        }
      }
      // if(allChecked){
      //   input[0].checked = true;
      // }else{
      //   input[0].checked = false;
      // }
    });
  }

});