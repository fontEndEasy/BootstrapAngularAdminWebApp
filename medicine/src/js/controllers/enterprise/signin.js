'use strict';

// 公司登录控制器
app.controller('enterpriseSigninFormController', ['$scope', '$http', '$state', '$cookieStore', 'utils','$rootScope',
  function($scope, $http, $state, $cookieStore, utils,$rootScope) {
    $scope.enterprise = {};
    $scope.authError = null;
    var _remember = $('#rememberInfo');
    var _isRemembered = utils.localData('enterprise_remember');
    var _telephone = utils.localData('enterprise_telephone');
    var _password = utils.localData('enterprise_password');
    if(_isRemembered){
      _remember.attr('checked', true);
      if(_isRemembered && _telephone && _password){
        $scope.enterprise.telephone = _telephone;
        $scope.enterprise.password = _password;
      }
    } 
    $scope.login = function() {
      $scope.authError = null;
      $http({
        url: app.url.yiliao.companyLogin,
        method: 'post',
        data: {
          telephone: $scope.enterprise.telephone,
          password: $scope.enterprise.password
          //,userType: 5
        }
      }).then(function(response) {
        if(response.data.resultCode === 1){
          //清除信息
          $rootScope.curDepartmentId = null;
          utils.localData('groupPicFile', null);
          utils.localData('headPicFile', null);
          utils.localData('curGroupName', null);
          utils.localData('curGroupId', null);
          utils.localData('curGroupEnterpriseName', null);
          utils.localData('groupPicFile', null);
          $scope.datas.user_headPicFile = null;
          $scope.datas.groupPicFile = null;
          $rootScope.rootGroup.name = null;
          $rootScope.rootGroup.enterpriseName = null;
          $rootScope.rootEnterprise = null;
          $rootScope.enterprise_userName = null;

          $rootScope.isCompany = true;
          utils.localData('isCompany', 'true');
          $rootScope.logFromCompany = true;
          utils.localData('logFromCompany', 'true');
          var _name = response.data.data.user.user.name || ' ';
          var _type = $scope.userType['type_' + response.data.data.user.user.userType];
          console.log(response.data.data.user.user.name);
          var _id = response.data.data.user.userId;
          $scope.datas.user_name = null;
          utils.localData('user_name', null);
          $scope.datas.user_type = _type;
          utils.localData('enterprise_userName',_name);
          utils.localData('enterprise_type', _type);
          utils.localData('enterprise_id', _id);

          if(_remember.prop("checked")){
            utils.localData('enterprise_remember', true);
            utils.localData('enterprise_telephone', $scope.enterprise.telephone);
            utils.localData('enterprise_password', $scope.enterprise.password);
          }else{
            utils.localData('enterprise_remember', null);
            utils.localData('enterprise_telephone', null);
            utils.localData('enterprise_password', null);
          }

          app.url.access_token = response.data.data.user.access_token;
          utils.localData('access_token', app.url.access_token);

          // 判断公司状态
          if(response.data.data.status == 1){//未创建公司
            utils.localData('company', null);
            return $state.go('access.Fill_Info');
          }
          utils.localData('company', JSON.stringify(response.data.data.company));
          if(response.data.data.company.status==='P')//审核通过
            return $state.go('app.group_manage');
          if(response.data.data.company.status==='A')//审核中
            return $state.go('access.enterprise_verify',{},{reload:true});
          if(response.data.data.company.status==='B')//审核不通过
            return $state.go('access.enterprise_verify',{},{reload:true});
          if(response.data.data.company.status==='O')//临时冻结
            return $scope.authError = '账户已冻结！';
          if(response.data.data.company.status==='S')//已停用
            return $scope.authError = '账户已停用！';

          utils.localData('enterprise_name', null);
          utils.localData('enterprise_type', null);
          utils.localData('enterprise_id', null);
          return $scope.authError = data.resultMsg;

        } else {
          $scope.authError = '用户名或密码错误';
          utils.localData('enterprise_name', null);
          utils.localData('enterprise_type', null);
          utils.localData('enterprise_id', null);
        }
      }, function(x) {
        $scope.authError = '服务器错误';
        utils.localData('enterprise_name', null);
        utils.localData('enterprise_type', null);
        utils.localData('enterprise_id', null);
      });

    };
  }
]);