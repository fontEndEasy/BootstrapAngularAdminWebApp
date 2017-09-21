app.controller('HController', function($rootScope, $scope, $state, $stateParams, $http, $compile, utils, modal) {
	console.log($scope);
	console.log('<====================================>');
	console.log($stateParams.fn);
	console.log(eval("function() {}"));
	//console.dir( eval($stateParams.fn) );
});