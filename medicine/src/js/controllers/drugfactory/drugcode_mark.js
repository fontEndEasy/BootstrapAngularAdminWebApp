app.controller('drugcodeMarkController', function($rootScope, $scope, $state, $http, $compile, utils, modal, $timeout) {
    $scope.drugcodedesc = "";
    var chartHeight = 380;

    $timeout(function() {
        $(".markradio").find("input").on("click", function() {
            var ve = $(this).val();
            if (ve == "1") {
                $(".markcheckbox").find("input").prop("disabled", false);
            } else {
                $(".markcheckbox").find("input").prop("disabled", true);
            }
        });
    }, 100);
    $scope.pmenter = function() {
        //调用调拨接口
        var data = {};
        $(".markradio").find("input").each(function() {
            if ($(this).prop("checked")) {
                data.markType = $(this).val();
            }
        });
        if (data.markType == 1) {
            if ($(".markcheckbox").find("input").prop("checked")) {
                data.chuanState = true;
            } else {
                data.chuanState = false;
            }
        } else {
            data.chuanState = false;
        }
        data.drugcodedesc = $scope.drugcodedesc;
        $scope.$emit('lister_Mark_callback', data);
        $state.go('app.drugcode', {}, {});
    }

    $scope.pmcancel = function() {
        $state.go('app.drugcode', {}, {});
    }

});
