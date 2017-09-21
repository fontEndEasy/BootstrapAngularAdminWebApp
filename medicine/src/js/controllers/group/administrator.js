app.controller('AdminCtrl', ['$rootScope', '$scope', '$modal', '$log', '$http', '$stateParams', function($rootScope, $scope, $modal, $log, $http, $stateParams) {
  //$rootScope.isCompany = false;
  var doctorId = localStorage.getItem('user_id');
  var access_token = localStorage.getItem('access_token');
  var enterprise_doc_id = localStorage.getItem('enterprise_id');
  var curGroupId = localStorage.getItem('curGroupId');
  $scope.adminstrators = [];
  $scope.adminDocId = [];
  $scope.getAdmins = function() {
    $http.post(app.url.yiliao.getGroupAdmins, {
      "access_token": access_token,
      "objectId": curGroupId,
      "status": "C",
      "pageSize": 100,
      "pageIndex":0
    }).
    success(function(data, status, headers, config) {
      if (data.resultCode == 1) {
        if (data.data.pageData.length > 0) {
          $scope.adminstrators = data.data.pageData;
          console.log(data.data.pageData);
        }

      }
    }).
    error(function(data, status, headers, config) {
      console.log(data);
    });
  }
  $scope.getAdmins();

  // $scope.showDel = function(index, adminstrator) {
  //   if (localStorage.getItem('group_creator') == null) {
  //     if (index == 0) {
  //       return false;
  //     } else {
  //        return true;
  //     }
  //   } else {
  //     return true;
  //   }

  // }

  //判断是不是自己
  $scope.isSelf = function(adminstrator){
    if(adminstrator.doctor.doctorId==doctorId){
      return true;
    }
    else{
      return false;
    }
  }

  $scope.removeRow = function(adminstrator) {
    // if (localStorage.getItem('group_creator') == null) {
    //   if (index == 0) {
    //     toaster.pop('error','','不能删除创建者');
    //     return;
    //   }
    // }
    var removeModal = $modal.open({
      templateUrl: 'removeModalContent.html',
      controller: 'removeModalInstanceCtrl',
      size: 'sm',
      resolve: {
        item: function() {
          return adminstrator;
        }
      }
    });

    removeModal.result.then(function(status) {
      if (status == 'ok') {
        var index = $scope.adminstrators.indexOf(adminstrator);
        if (index !== -1) {
          $scope.adminstrators.splice(index, 1);
        }
      }
    }, function() {
      $log.info('removeModal dismissed at: ' + new Date());
    });
  };

  //弹出删除管理员模态框
  app.controller('removeModalInstanceCtrl', ['$scope', '$modalInstance', 'item', '$http','toaster', function($scope, $modalInstance, item, $http,toaster) {
    $scope.item = item;
    $scope.ok = function() {
      $http.post(app.url.yiliao.deleteGroupAdmin, {
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
        console.log(data);
      });
      $modalInstance.close('ok');
    };

    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };
  }]);


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
      $log.info('inviteModal dismissed at: ' + new Date());
    });
  };
}]);




app.controller('inviteDocToManageModalCtrl', ['$scope', '$modalInstance', '$http', function($scope, $modalInstance, $http) {
  var access_token = localStorage.getItem('access_token');
  var curGroupId=localStorage.getItem('curGroupId');
  var container = $('#dialog_container');
  $scope.viewData = {};
  $scope.formData = {};
  $scope.showResult = false;
  $scope.showNoneResult = false;
  $scope.showMsgBox = false;
  $scope.showSuccess = false;
  $scope.showWarn = false;
  $scope.showInviteAgain = false;

  // var deptId = $scope.curDepartmentId || utils.localData('curDepartmentId');

  // if(!deptId){
  //   return;
  // }

  var doIt = function() {
    var keys = $scope.formData.doctorInfo,
      type = '?',
      dt = null,
      ttl, dpt,
      hsp;

    if (keys) {
      if (keys.length === 11 && !(/\D/.test(keys)) && keys.charAt(0) === '1') {
        type = '手机号';
        dt = {
          access_token: access_token,
          keyWord: keys
        };
        $scope.formData.phone = keys;
      } else {
        type = '医生号';
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
        $scope.showNoneResult = true;
        $scope.showInviteAgain = false;
        $scope.viewData.keys = keys;
      }
    }, function(x) {
      console.error(x.statusText);
    });
  };

  // 发起客户端邀请
  $scope.inviteManageGroup = function() {
    
    $http({
      url: app.url.yiliao.addGroupUser,
      method: 'post',
      data: {
        "access_token": access_token,
        "objectId": curGroupId,
        "doctorId": $scope.formData.id,
        "telephone":$scope.viewData.telephone
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
          console.log(resp.data.resultMsg);
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
      url: app.url.yiliao.addGroupUser,
      method: 'post',
      data: {
        "access_token": access_token,
        "objectId": curGroupId,
        "doctorId": $scope.formData.id,
        "telephone":$scope.viewData.telephone,
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

  // 执行操作
  $scope.query = function() {
    $scope.showMsgBox = false;
    $scope.showSuccess = false;
    $scope.showWarn = false;
    $scope.showInviteAgain = false;
    doIt();
  };

  $scope.close = function () {
    $modalInstance.dismiss('cancel');
  };
}]);