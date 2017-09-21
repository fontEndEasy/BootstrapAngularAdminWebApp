'use strict';

app.controller('ChargeCtrl', ['$scope', '$http', '$modal', 'toaster','$log',
	function($scope, $http, $modal, toaster,$log) {
		var access_token = localStorage.getItem('access_token');
		var curGroupId = localStorage.getItem('curGroupId');
		$scope.submit = function() {
			var updateModal = $modal.open({
				templateUrl: 'updateModalContent.html',
				controller: 'updateModalInstanceCtrl',
				size: 'sm'
			});

			updateModal.result.then(function(status) {
				if (status == 'ok') {
					$http.post(app.url.yiliao.setCharge, {
						'access_token': access_token,
						'groupId': curGroupId,
						'textMin': $scope.charge.textMin*100,
						'textMax': $scope.charge.textMax*100,
						'phoneMin': $scope.charge.phoneMin*100,
						'phoneMax': $scope.charge.phoneMax*100,
						'clinicMin': $scope.charge.clinicMin*100,
						'clinicMax': $scope.charge.clinicMax*100,
						'carePlanMin': $scope.charge.carePlanMin*100,
						'carePlanMax': $scope.charge.carePlanMax*100
					}).
					success(function(data, status, headers, config) {
						console.log(data);
						if (data.resultCode == 1) {
							toaster.pop('success','','修改成功');
						}
						else{
							toaster.pop('error','',data.resultMsg);
						}
					}).
					error(function(data, status, headers, config) {
						toaster.pop('error','','修改失败');
					});
				}
			}, function() {
				$log.info('updateModal dismissed at: ' + new Date());
			});


		};
		 $scope.charge = {
		 	textMin: 0,
		 	textMax: 0,
		 	phoneMin: 0,
		 	phoneMax: 0,
		 	clinicMin: 0,
		 	clinicMax: 0,
		 	carePlanMin: 0,
		 	carePlanMax: 0
		 };

		$http.post(app.url.yiliao.getCharge, {
			'access_token': access_token,
			'groupId': curGroupId
		}).
		success(function(data, status, headers, config) {
			console.log(data);
			if (data.resultCode == 1) {
				if(data.data){
					$scope.charge = {
						textMin: data.data.textMin/100,
						textMax: data.data.textMax/100,
						phoneMin: data.data.phoneMin/100,
						phoneMax: data.data.phoneMax/100,
						clinicMin: data.data.clinicMin/100,
						clinicMax: data.data.clinicMax/100,
						carePlanMin: data.data.carePlanMin/100,
						carePlanMax: data.data.carePlanMax/100
					};
				}

			}
			else{
				alert(data.resultMsg);
			}
		}).
		error(function(data, status, headers, config) {
			alert(data.resultMsg);
		});
	}
]);

//弹出确认模态框
app.controller('updateModalInstanceCtrl', ['$scope', '$modalInstance', '$http', 'toaster', function($scope, $modalInstance, $http, toaster) {
	$scope.ok = function() {
		$modalInstance.close('ok');
	};

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
}]);