'use strict';
//集团列表界面js文件
app.controller('GroupManageCtrl', ['$rootScope', '$scope', '$http', '$location', '$state', 'utils',
	function($rootScope, $scope, $http, $location, $state, utils) {
		$rootScope.isCompany = true;
		utils.localData('isCompany', 'true');
		$rootScope.curGroupId = null;
		$rootScope.rootEnterprise = JSON.parse(localStorage.getItem('company'));
		if(localStorage.getItem('enterprise_userName')==null){
			$rootScope.enterprise_userName = localStorage.getItem('enterprise_telephone');
		}
		else{
			$rootScope.enterprise_userName = localStorage.getItem('enterprise_userName');
		}
		$scope.access_token = localStorage.getItem('access_token');
		$scope.company = JSON.parse(localStorage.getItem('company'));
		$scope.curGroupEnterpriseName = $scope.company.name;
		$scope.companyName = null;
		$scope.groupList = null;
		//获取集团列表
		$http.post(app.url.yiliao.getGroupList, {
			access_token: $scope.access_token,
			companyId: $scope.company.id,
			pageIndex:0,
			pageSize:200
		}).
		success(function(data, status, headers, config) {
			var groupList = data.data.pageData;
			//获取每个集团图片的url
			for (var i = 0; i < groupList.length; i++) {
				(function(i) {
					var imgUrl = app.url.upload.getCertPath + '?access_token=' + $scope.access_token + '&userId=' + groupList[i].creator + '&certType=' + groupList[i].id;
					$http.get(imgUrl).
					success(function(data, status, headers, config) {
						if (data.resultCode == 1) {
							console.log(data);
							if (data.data.length > 0) {
								for (var j = 0; j < data.data.length; j++) {
									if (data.data[j].indexOf(groupList[i].id.toString() + '/groupLogo') > -1) {
										groupList[i].groupLogoUrl = data.data[j];
									}
								};
							}
						}

					}).
					error(function(data, status, headers, config) {
						console.log(data);
					});
				})(i);
			};

			$scope.groupList = groupList;
			console.log($scope.groupList);
		}).
		error(function(data, status, headers, config) {
			console.log(data);
		});

		//邀请医生集团加入公司
		$scope.linkToInvite = function() {
			$location.url($location.url() + "/enterprise_setting");
		};

		//公司管理集团
		$scope.linkToManageGroup = function(id, name, creator) {
			localStorage.setItem('curGroupEnterpriseName', $scope.curGroupEnterpriseName);
			localStorage.setItem('curGroupId', id);
			localStorage.setItem('curGroupName', name);
			$rootScope.rootGroup.name = name;
			$rootScope.rootGroup.enterpriseName = $scope.curGroupEnterpriseName;
			if (creator) {
				localStorage.setItem('group_creator', creator);
				$scope.datas.user_id = creator;
				utils.localData('headPicFile', null);
				$scope.datas.user_headPicFile = null;
			}

			utils.localData('groupPicFile', null);
			$scope.datas.groupPicFile = null;

			$rootScope.isCompany = false;
			utils.localData('isCompany', 'false');
			$state.go('app.contacts', {}, {
				"reload": true
			});
		};

		// 这里导航到创建新集团
		$scope.createGroup = function() {
			localStorage.removeItem('curGroupId');
			localStorage.removeItem('curGroupName');
			$state.go('app.groupSettings');
		}
	}
]);