app.controller('SettingCtrl', ['$scope', '$modal', '$log', function($scope, $modal, $log) {
  $scope.invite = function(row) {
    var inviteModal = $modal.open({
      templateUrl: 'inviteDocCreateGroupModalContent.html',
      controller: 'inviteDocCreateGroupModalCtrl'
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

app.controller('inviteDocCreateGroupModalCtrl', ['$scope', '$modalInstance', '$http', function($scope, $modalInstance, $http) {
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
        console.log(dt);
        $scope.showNoneResult = false;
        $scope.showResult = true;
        ttl = dt.doctor.title || '--';
        dpt = dt.doctor.departments || '--';
        hsp = dt.doctor.hospital || '--';
        $scope.formData.id = dt._id;//doctor.doctorNum;
        $scope.viewData.name = dt.name || '--';
        $scope.viewData.telephone = dt.telephone;
        $scope.viewData.info = ttl + ' / ' + dpt + ' / ' + hsp;
        $scope.viewData.imgSrc = dt.headPicFileName|| 'src/img/a0.jpg';
      } else {
        $scope.showResult = false;
        $scope.showNoneResult = true;
        $scope.viewData.keys = keys;
      }
    }, function(x) {
      console.error(x.statusText);
    });
  };

  // 发起客户端邀请
  $scope.inviteCreateGroup = function() {
    $http({
      url: app.url.yiliao.sendInviteCode,
      method: 'post',
      data: {
        "access_token": access_token,
        "companyId": enterprise_id,
        "doctorId": $scope.formData.id,
        "telephone": $scope.viewData.telephone
      }
    }).then(function(resp) {
      if (resp.data.resultCode === 1) {
        $scope.showResult = false;
        $scope.showSuccess = true;
      } else {
        $scope.showResult = false;
        $scope.showWarn = true;
        $scope.formData.warn_text = resp.data.resultMsg;
        console.log("[邀请失败！] " + resp.data.resultMsg);
      }
    }, function(x) {
      console.error(x.statusText);
    });
  };

  // 开启短信邀请
  $scope.sendMsg = function() {
    $scope.showNoneResult = false;
    $scope.showMsgBox = true;

  };

  // 发送短信邀请
  $scope.doSend = function() {
    $http({
      url: app.url.yiliao.sendInviteCode,
      method: 'post',
      data: {
        "access_token": access_token,
        "companyId": enterprise_id,
        "telephone": $scope.formData.phone
      }
    }).then(function(resp) {
      if (resp.data.resultCode === 1) {
        $scope.showResult = false;
        $scope.showSuccess = true;
      } else {
        $scope.showResult = false;
        $scope.showWarn = true;
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
    doIt();
  };

  $scope.close = function () {
    $modalInstance.dismiss('cancel');
  };
}]);