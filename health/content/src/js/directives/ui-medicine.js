angular.module('app').filter('filterUndefined', function() {
    return function(param1) {
        param1 = typeof param1 == "undefined" ? "src/img/default_drugs.png" : param1;
        return param1;
    };
});

angular.module('app').directive('sbLoad', ['$parse', function($parse) {
    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {
            var fn = $parse(attrs.sbLoad);
            /*elem.on('load', function (event) {
              scope.$apply(function() {
                fn(scope, { $event: event });
              });
            });*/
            elem.on('error', function(event) {
                var that = this;
                scope.$apply(function() {
                    // fn(scope, { $event: event });
                    that.src = "src/img/default_drugs.png";
                });
            });
        }
    };
}]);
angular.module('app').directive('uiMedicine', function($timeout, $rootScope, $parse, $http) {
    var templateStr = '<div class="commsearch"><div class="mask"></div>' +
        '<div class="cnt-anim-dialog animating">' +
        '<div class="panel-heading font-bold text-center">品种新增<span ng-bind="id"></span></div>' +
        '<div class="panel-body">' +
        '<div class="panel-heading if-frame">' +
        '<div class="input-group" style="width: 400px;margin: 0 auto;position: relative;">' +
        '<input type="text" class="form-control" placeholder="药品名称/助记码/生产厂家/药品商品名" ng-model="keyword" ng-keypress="pressEnter($event)">' +
        '<a ng-show="mainKWLength>0" style="position: absolute;top: 10px;right: 120px;z-index: 999;" ng-click="clearMainKW()" class="glyphicon glyphicon-remove"></a>' +
        '<span class="input-group-btn">' +
        '<button class="btn btn-default" type="button" ng-click="findDrugByKeyWord()"  ng-keypress="pressEnter($event)">搜索</button>' +
        '</span>' +
        '</div>' +
        '<div class="clearfix">' +
        '<div class="form-horizontal" >' +
        '<div class="form-group">' +
        '<label class="control-label col-md-2 text-right">关 键 字 ：</label>' +
        '<div class="col-md-16 keywordspan">' +
        '<button ng-show="keys" style="margin-right:5px;" class="btn m-b-xs btn-sm btn-success" >{{key_word}}<i class="fa fa-times" style="padding-left:10px;" ng-click="del($event)"></i></button>' +
        '</div>' +
        '</div>' +
        '<div class="form-group" style="margin-top:10px;">' +
        '<label class="control-label col-md-2 text-right">生产厂商：</label>' +
        '<div id="medicine-complays" class="col-md-16 keywordspan">' +
        '<button ng-repeat="m in _moziLt1 track by $index" id="{{m.id}}" store_name="{{m.manufacturer}}" style="margin-right:5px;" class="btn m-b-xs btn-sm btn-success" ng-click="removeSpan(\'{{m.id}}\');">{{m.manufacturer}}</button>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<br>' +
        '<div class="panel-heading store-result-list" ng-repeat = "l in info_list">' +
        '<label class="clearfix img" for="list_{{l.id}}">' +
        '<img class="pull-left b-3x m-r" sb-load="onImgLoad($event)" ng-src="{{l.image_url | filterUndefined}}" />' +
        '<div>' +
        '<div class="h3 m-t-xs m-b-xs ng-binding" ng-bind="l.general_name"></div>' +
        '<small class="text-muted ng-binding"><span ng-bind="l.specification"></span> * <span ng-bind="l.pack_specification"></span></small>' +
        '<small class="text-muted ng-binding" ng-bind="l.manufacturer"></small>' +
        '</div>' +
        '<div class="cnt-opr-btn">' +
        '<input id="list_{{l.id}}" value="{{l.id}}" class="" ng-model="l.company.id" type="checkbox" ng-checked="{{l.checked}}"><i></i>' +
        '</div>' +
        '</label>' +
        '</div>' +
        '</div>' +
        '<div class="cnt-opr-bar form-group">' +
        '<div class="col-md-offset-2 col-md-4">' +
        '<button ng-click="medicine_save()" type="button" class="w100 btn btn-success">确 定</button>' +
        '</div>' +
        '<div class="col-md-4">' +
        '<button ng-click="medicine_cancel()" type="button" class="w100 btn btn-default">取 消</button>' +
        '</div>' +
        '</div>' +
        '</div></div>' +
        '<style>' +
        '.commsearch {position:absolute;left:0;top:0;width:100%;height:100%;z-index:9999; display:none;}' +
        '.commsearch .cnt-anim-dialog{right:-600px;}' +
        '.if-frame{background-color:#ffffff !important; border:none !important; border-bottom:#d1d6dd solid 1px !important;}' +
        '.keywordspan span{ margin-right:5px;}' +
        '.bg{background-color:#23b7e5;}' +
        '.store-result-list {margin-top: 10px;margin-bottom: 5px;}' +
        '.store-result-list label{position: relative;display:block; cursor:pointer; user-select:none; -webkit-user-select:none; -moz-user-select:none;}' +
        '.store-result-list label img {margin-top: 8px;display: inline-block;width: 60px;height: 60px;}' +
        '.store-result-list .h3 {font-size: 16px;color: #364353;}' +
        '.store-result-list small.text-muted {font-size: 14px;color: #647488;display: block;}' +
        '.store-result-list label .cnt-opr-btn {position: absolute;top:50%;margin-top: -5px;right: 10px;}' +
        '.keywordspan{padding-left: 93px;}' +
        '.keywordspan span.btn-success{background-color: #65c475;color: #ffffff;}' +
        '.keywordspan span.rdisabled{background-color: #f1f3f5;color: #647488;}' +
        '</style>';


    return {
        restrict: 'ACE',
        scope: {
            open: "="
        },
        template: templateStr,
        link: function($scope, element, attr) {
            $scope.keys = false;
            var callback = function() {};
            var selectArr = [];
            var findGlobalData = [];
            var _moziLt1 = [];

            //关键字搜索
            $scope.findDrugByKeyWord = function() {
                var key = $scope.keyword;
                if (key == "") return;
                var query_for_drug_company_url = medicineApiRoot + "api/invoke/" + app.url.access_token + "/c_Goods.select";
                var set_good_state_url = medicineApiRoot + "api/invoke/" + app.url.access_token + "/c_GoodsOnStack.set_good_state";
                var url = '';
                if (typeof key == 'undefined') {
                    url = query_for_drug_company_url;
                } else {
                    url = query_for_drug_company_url + "?__KEYWORD__=" + key + '&state_audit=9'
                }

                $http.get(url, {}).
                success(function(data, status, headers, config) {
                    $scope.keys = true;
                    var info_list = data.info_list;
                    var list = data.info_list.slice(0);
                    if (selectArr.length > 0) {
                        $.each(info_list, function(j, jitem) {
                            info_list[j].checked = false;
                        });
                        $.each(selectArr, function(j, item) {
                            var len = info_list.length;
                            for (var i = 0; i < len; i++) {
                                if (info_list[i]["id"] === item) {
                                    info_list[i].checked = true;
                                    return;
                                }
                            }
                        });
                    }
                    $scope.info_list = info_list;
                    _moziLt1 = []
                    var tmp = {};
                    $.each(list, function(i, keys) {
                        tmp[keys.manufacturer] = keys;
                    });
                    $.each(tmp, function(i, keys) {
                        _moziLt1.push(keys);
                    });
                    $scope.filterStr = [];
                    $.each(_moziLt1, function(i, item) {
                        $scope.filterStr.push(item.id);
                    });
                    $scope._moziLt1 = _moziLt1.length > 10 ? _moziLt1.slice(0, 9) : _moziLt1;
                    if (_moziLt1.length > 10) {
                        $scope._moziLt1.push({
                            id: "0",
                            manufacturer: "显示更多"
                        });
                    }
                    $scope.key_word = $scope.keyword;
                    findGlobalData = $scope.info_list.slice(0);
                });
            };

            $scope.open = function(_arr, _callback) {
                //显示弹出框
                selectArr = _arr.slice(0) || [];
                callback = _callback || function() {};
                $scope._moziLt1 = [];
                $scope.info_list = [];
                $scope.keyword = '';
                $scope.keys = false;
                $(".commsearch").show();
                $(".commsearch .cnt-anim-dialog").animate({
                    "right": -2
                });
            };

            $scope.$root.openUiMedicine = $scope.open;

            $scope.removeSpan = function(id) {
                if (id == 0) {
                    $scope._moziLt1 = _moziLt1.slice(0);
                    return;
                }
                if ($("#" + id).hasClass("btn-success")) {
                    $("#" + id).removeClass("btn-success").addClass("rdisabled");
                    $("#" + id).find("i").removeClass("fa-times");
                } else {
                    $("#" + id).removeClass("rdisabled").addClass("btn-success");
                    $("#" + id).find("i").removeClass("fa-check");
                }

                var tempids = [];
                $("#medicine-complays").find("button.btn-success").each(function() {
                    tempids.push($(this).attr("store_name"));
                });
                var temparr = [];
                var len = $("#medicine-complays").find("button").length
                if (tempids.length == len) {
                    $scope.info_list = findGlobalData.slice(0);
                } else if (tempids.length > 0 && tempids.length != len) {
                    $.each(findGlobalData, function(j, jitem) {
                        var re = new RegExp(tempids.join("|"), "gi");
                        if (re.test(jitem.manufacturer)) {
                            temparr.push(jitem);
                        }
                    });
                    $scope.info_list = temparr.slice(0);
                } else {
                    $scope.info_list = [];
                }
            };

            //按回车键搜索文档标题
            $scope.pressEnter = function($event) {
                if ($event.keyCode == 13) {
                    $scope.findDrugByKeyWord();
                }
            };
            $scope.del = function($event) {
                $scope._moziLt1 = [];
                $scope.info_list = [];
                $scope.keyword = '';
                $scope.keys = false;
            };

            $scope.medicine_save = function() {
                var selectList = []; //选中药品
                $(".cnt-opr-btn input[type=checkbox]").each(function() {
                    if (this.checked) {
                        selectList.push(getDataByKey($scope.info_list, "id", $(this).val()));
                    }
                });
                if (selectList.length > 0) {
                    $(".commsearch .cnt-anim-dialog").animate({
                        "right": -600
                    }, function() {
                        $(".commsearch").hide();
                    });
                    callback(selectList);
                }
            };
            //模态框退出
            $scope.medicine_cancel = function() {
                $(".commsearch .cnt-anim-dialog").animate({
                    "right": -600
                }, function() {
                    $(".commsearch").hide();
                });
            };

            function getDataByKey(data, key, val) {
                var len = data.length;
                for (var i = 0; i < len; i++) {
                    if (data[i][key] === val) {
                        return data[i];
                    }
                }
            }
        }
    };
});
