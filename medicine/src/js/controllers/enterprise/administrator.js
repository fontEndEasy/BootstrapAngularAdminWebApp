'use strict'
//公司管理员界面的js
app.controller('AdminCtrl', ['$rootScope', '$scope', '$modal', '$log', '$http','toaster', function($rootScope, $scope, $modal, $log, $http,toaster) {
  //$rootScope.isCompany = true;
  $scope.adminstrators = null;
  var access_token = localStorage.getItem('access_token');
  var enterprise_doc_id = localStorage.getItem('enterprise_id');
  var enterprise_id = JSON.parse(localStorage.getItem('company')).id;
  //获取集团管理员列表(没有分页)
  $http.post(app.url.yiliao.searchByCompanyUser, {
    access_token: access_token,
    objectId: enterprise_id,
    status: 'C',
    pageIndex:0,
    pageSize:200
  }).
  success(function(data, status, headers, config) {
    if (data.resultCode == 1) {
      $scope.adminstrators = data.data.pageData;
    } else {
      console.log(data.data.resultMsg);
    }

  }).
  error(function(data, status, headers, config) {
    console.log(data);
  });

  //判断是不是创建者
  $scope.isCreator = function(adminstrator) {
    if (adminstrator.doctor.doctorId == enterprise_doc_id) {
      return true;
    } else {
      return false;
    }
  };

  //弹出删除提醒模态框
  $scope.removeRow = function(row) {
    // if (row.doctor.doctorId == enterprise_doc_id) {
    //   toaster.pop('warn','','不能删除自己！');
    //   return;
    // }
    var removeModal = $modal.open({
      templateUrl: 'removeModalContent.html',
      controller: 'removeModalInstanceCtrl',
      size: 'sm',
      resolve: {
        item: function() {
          return row;
        }
      }
    });

    removeModal.result.then(function(status) {
      if (status == 'ok') {
        var index = $scope.adminstrators.indexOf(row);
        if (index !== -1) {
          $scope.adminstrators.splice(index, 1);
        }
      }
    }, function() {
      
    });
  };


  //弹出邀请模态框
  $scope.invite = function() {
    var inviteModal = $modal.open({
      templateUrl: 'inviteDocToManageModalContent.html',
      controller: 'inviteDocToManageModalCtrl'
    });

    inviteModal.result.then(function(status) {
      if (status == 'ok') {
        console.log('invite');
      }
    }, function() {
      
    });
  };

}]);

//删除管理员模态框
app.controller('removeModalInstanceCtrl', ['$scope', '$modalInstance', 'item', '$http','toaster', function($scope, $modalInstance, item, $http,toaster) {
  var access_token = localStorage.getItem('access_token');
  var enterprise_doc_id = localStorage.getItem('enterprise_id');
  var enterprise_id = JSON.parse(localStorage.getItem('company')).id;
  $scope.ok = function() {
    $http.post(app.url.yiliao.deleteByCompanyUser, {
      access_token: access_token,
      ids: item.id
    }).
    success(function(data, status, headers, config) {
      if(data.resultCode==1){
          toaster.pop('success','','删除成功');
        }
        else{
          toaster.pop('error','','删除失败');
        }
    }).
    error(function(data, status, headers, config) {
      toaster.pop('error','','删除失败');
    });
    $modalInstance.close('ok');
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
}]);



//邀请管理员模态框
app.controller('inviteDocToManageModalCtrl', ['$scope', '$modalInstance', '$http', function($scope, $modalInstance, $http) {
  var access_token = localStorage.getItem('access_token');
  var enterprise_doc_id = localStorage.getItem('enterprise_id');
  var enterprise_id = JSON.parse(localStorage.getItem('company')).id;
  var container = $('#dialog_container');
  $scope.viewData = {};
  $scope.formData = {};
  $scope.showResult = false;
  $scope.showNoneResult = false;
  $scope.showMsgBox = false;
  $scope.showSuccess = false;
  $scope.showInviteAgain = false;
  $scope.showWarn = false;
  var doIt = function() {
    var keys = $scope.formData.doctorInfo,
      type = '?',
      dt = null,
      ttl, dpt,
      hsp;

    if (keys) {
      if (keys.length === 11 && !(/\D/.test(keys)) && keys.charAt(0) === '1') {
        type = '';
        dt = {
          access_token: access_token,
          keyWord: keys
        };
        $scope.formData.phone = keys;
      } else {
        type = '';
        dt = {
          access_token: access_token,
          keyWord: keys
        };
      }
    } else {
      console.warn("无效查询！");
      return;
    }

    // 获取医生数据
    $http({
      url: app.url.doctor.searchs,
      method: 'post',
      data: dt
    }).then(function(resp) {
      console.log(resp);
      var dt = resp.data.data[0];
      if (dt && dt.doctor) {
        $scope.showNoneResult = false;
        $scope.showInviteAgain = false;
        $scope.showResult = true;
        ttl = dt.doctor.title || '--';
        dpt = dt.doctor.departments || '--';
        hsp = dt.doctor.hospital || '--';
        $scope.formData.id = dt._id;
        $scope.viewData.name = dt.name || '--';
        $scope.viewData.telephone = dt.telephone;
        $scope.viewData.info = ttl + ' / ' + dpt + ' / ' + hsp;
        $scope.viewData.imgSrc = dt.headPicFileName|| 'src/img/a0.jpg';
      } else {
        $scope.showResult = false;
        $scope.showInviteAgain = false;
        $scope.showNoneResult = true;
        $scope.viewData.keys = keys;
      }
    }, function(x) {
      console.error(x.statusText);
    });
  };

  // 发起客户端邀请
  $scope.inviteManageEnt = function() {
    $http({
      url: app.url.yiliao.addCompanyUser,
      method: 'post',
      data: {
        "access_token": access_token,
        "objectId": enterprise_id,
        "doctorId": $scope.formData.id,
        "telephone": $scope.viewData.telephone
      }
    }).then(function(resp) {
      if (resp.data.resultCode === 1) {
        if(resp.data.data.status==2){
          $scope.showResult = false;
          $scope.showWarn = false;
          $scope.showInviteAgain = true;
          $scope.formData.inviteAgain_text = resp.data.data.msg;
        }
        else{
          $scope.showResult = false;
          $scope.success_text = resp.data.data.msg;
          $scope.showSuccess = true;
        }
        
      }else {
        $scope.showResult = false;
        $scope.showWarn = true;
        $scope.showInviteAgain = false;
        $scope.formData.warn_text = resp.data.resultMsg;
        console.log("[邀请失败！] " + resp.data.resultMsg);
      }
    }, function(x) {
      console.error(x.statusText);
    });
  };

    //再次发送邀请
  $scope.inviteAgain=function(){
    $http({
      url: app.url.yiliao.addCompanyUser,
      method: 'post',
      data: {
        "access_token": access_token,
        "objectId": enterprise_id,
        "doctorId": $scope.formData.id,
        "telephone": $scope.viewData.telephone,
        "againInvite":1
      }
    }).then(function(resp) {
      if (resp.data.resultCode === 1) {
          $scope.showResult = false;
          $scope.success_text = resp.data.data.msg;
          $scope.showSuccess = true;
          $scope.showInviteAgain = false;
      }else {
        $scope.showResult = false;
        $scope.showWarn = true;
        $scope.showInviteAgain = false;
        $scope.formData.warn_text = resp.data.resultMsg;
        console.log("[邀请失败！] " + resp.data.resultMsg);
      }
    }, function(x) {
      console.error(x.statusText);
    });
  }



  // 开启短信邀请
  $scope.sendMsg = function() {
    $scope.showNoneResult = false;
    $scope.showMsgBox = true;
    $scope.showInviteAgain = false;
  };

  // 发送短信邀请
  $scope.doSend = function() {
    $http({
      url: app.url.yiliao.addCompanyUser,
      method: 'post',
      data: {
        "access_token": access_token,
        "objectId": enterprise_id,
        "telephone": $scope.formData.phone
      }
    }).then(function(resp) {
      if (resp.data.resultCode === 1) {
        $scope.showResult = false;
        $scope.showSuccess = true;
        $scope.showInviteAgain = false;
      } else {
        $scope.showResult = false;
        $scope.showWarn = true;
        $scope.showInviteAgain = false;
        $scope.formData.warn_text = resp.data.resultMsg;
        console.log("[邀请失败！] " + resp.data.resultMsg);
      }
    }, function(x) {
      console.error(x.statusText);
    });
  };
  // 执行操作
  $scope.query = function() {
    $scope.showMsgBox = false;
    $scope.showSuccess = false;
    $scope.showWarn = false;
    $scope.showInviteAgain = false;
    doIt();
  };

  $scope.close = function() {
    $modalInstance.dismiss('cancel');
  };
}]);