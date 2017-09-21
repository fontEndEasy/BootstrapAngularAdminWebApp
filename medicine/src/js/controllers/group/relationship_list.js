'use strict';

app.controller('RelationshipList', function($rootScope, $scope, $state, $timeout, $http, utils) {
  var url = app.url.yiliao.getProfitList, // 后台API路径
      data = null,
      html = $('html'),
      body = $('body'),
      doctorId = $scope.curDoctorId || utils.localData('curDoctorId'),
      groupId = utils.localData('curGroupId');

  if($rootScope.pageName !== 'list_pass'){
    utils.localData('page_index', null);
    utils.localData('page_start', null);
    //utils.localData('page_length', null);
    $rootScope.pageName = 'list_pass';
  }

  // 查看某一信息
  $scope.seeDetails = function(id) {
    if (id) {
      $state.go('app.relationship.list.edit');
    }
  };

  ////////////////////////////////////////////////////////////

  // 初始化表格
  var doctorList, dTable;

  function initTable() {
    var name,
      _index,
      _start,
      isSearch = false,
      searchTimes = 0,
      index = utils.localData('page_index') * 1 || 1, 
      start = utils.localData('page_start') * 1 || 0, 
      length = utils.localData('page_length') * 1 || 50;

    var setTable = function(){
      doctorList = $('#relationshipList');
      dTable = doctorList.dataTable({
        "draw": index,
        "displayStart": start,
        "lengthMenu": [5,10,15,20,30,40,50,100],
        "pageLength": length,
        "bServerSide": true, 
        "sAjaxSource": url,
        "fnServerData": function(sSource, aoData, fnCallback) {
          $.ajax({
            "type": "post",
            "url": sSource,
            "dataType": "json",
            "data": {
              name: name,
              access_token: app.url.access_token,
              groupId: groupId,
              parentId: doctorId,
              pageIndex: index - 1,
              pageSize: aoData[4]['value']
            }, 
            "success": function(resp) {
              index = aoData[0]['value'];
              for(var i=0; i<resp.data.pageData.length; i++){
                utils.extendHash(resp.data.pageData[i], ["name","groupProfit","parentProfit","contactWay"]);
              }
              resp.start = resp.data.start;
              resp.recordsTotal = resp.data.total;
              resp.recordsFiltered = resp.data.total;
              resp.length = resp.data.pageSize;
              resp.data = resp.data.pageData;
              fnCallback(resp);
              $scope.loading = false;
            }
          });
        },
        //"searching": false,
        "language": app.lang.datatables.translation,
        "createdRow": function(nRow, aData, iDataIndex){
          $(nRow).data('x_id', aData['id']).attr('data-id', aData['doctorId']).click(aData, function(param, e) {
            //$rootScope.targetDoctorParentId = param.data.parentId;
            $rootScope.targetDoctorId = param.data.id;
            $rootScope.targetDoctorName = param.data.name;

            $rootScope.groupProfit = param.data.groupProfit || 0;
            $rootScope.superProfit = param.data.parentProfit || 0;

            $scope.seeDetails(param.data.id);
          });
        },
        "columns": [{
          "orderable": false,
          "render": function(set, status, dt){
            if(dt.headPicFileName){
              var path = dt.headPicFileName;
            }else{
              var path = 'src/img/a0.jpg';
            }
            return '<img src="' + path + '"/>';
          }
        }, {
          "data": "name",
          "orderable": false
        }, {
          "data": "groupProfit",
          "orderable": false,
          "render": function(d){
            if((d.constructor === Array) || !d){
              d = '0';
            }
            return d  + '%';
          }
        }, {
          "data": "parentProfit",
          "orderable": false,
          "render": function(d){
            if((d.constructor === Array) || !d){
              d = '0';
            }
            return d  + '%';
            //return ((d || d.length !== 0) || '0') + '%';
          }
        }, {
          "data": "contactWay",
          "orderable": false,
          "searchable": false
        }]
      });

      // 表格事件处理,init-初始化完成,length-改变每页长度,page-翻页,search-搜索
      dTable.off().on('init.dt', function(){
        doctorList.find('tr[data-id=' + $rootScope.curRowId + ']').addClass('currentRow');
      }).on('length.dt', function(e, settings, len){
        index = 1;
        start = 0;
        length = len;
        dTable.fnDestroy();
        setTable();
        utils.localData('page_length', len);
      }).on('page.dt', function(e, settings){
        index = settings._iDisplayStart / length + 1;
        start = length * (index - 1);
        dTable.fnDestroy();
        utils.localData('page_index', index);
        utils.localData('page_start', start);
        setTable();
      }).on('search.dt', function(e, settings){
        if(settings.oPreviousSearch.sSearch){
          isSearch = true;
          searchTimes ++;
          _index = settings._iDisplayStart / settings._iDisplayLength + 1;
          _start = settings._iDisplayStart;
          name = settings.oPreviousSearch.sSearch;
        }else{
          isSearch = false;
          name = null;
        }
        if(isSearch){
          index = 1;
          start = 0;
        }else{
          if(searchTimes > 0){
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