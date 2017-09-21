app.directive('sbLoad', ['$parse', function($parse) {
    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {
            var fn = $parse(attrs.sbLoad);
            elem.on('error', function(event) {
                var that = this;
                scope.$apply(function() {
                    that.src = "src/img/default_drugs.png";
                });
            });
        }
    };
}]);
app.controller('factory_varietylist', function($rootScope, $scope, $state, $http, $compile, utils, modal) {
    $scope.go_search = function(id) {
        $("#title_" + id).attr("ng-show", true);
    };
    var yy_access_token = utils.localData('yy_access_token'),
        groupId = utils.localData('store_id');

    //点击分类查询药品
    $scope.getListByType = function(id) {
        $scope.ids = id;
        setTable();
    }

    $rootScope.$on('lister_factory_table_list', function(evet, data) {
        setTable();
    });

    var datable = null;
    setTimeout(function() {
        setTable();
    }, 300);
    //获取表格
    function setTable() {
        var ids = "";
        var param = {};
        if ($scope.ids != null) {
            ids = $scope.ids;
            param = {
                category: ids
            };
        }
        var title = "";
        if ((typeof $scope.title != "undefined") && $scope.title != '') {
            title = "%" + $scope.title + "%";
            param = {
                title: title
            };
        }
        if (typeof $scope.ids != "undefined" && typeof $scope.title != "undefined") {
            param = {
                title: title,
                category: ids
            };
        }

        function dataTable() {
            if (datable) {
                datable.fnDestroy();
            }
            var length = utils.localData('page_length') * 1 || 10;
            datable = $('#contactsList').dataTable({
                "bServerSide":  true,
                "lengthMenu": [5, 10, 15, 20, 30, 40, 50, 100],
                "pageLength": length,
                "bDestroy": true,
                "searching": false,
                "sAjaxSource": app.url.guideSelectGoodsInfo,
                "language": app.lang.datatables.translation,
                "fnServerData": function(sSource, aoData, fnCallback) {
                    param.pageIndex = Math.round(aoData[3]['value'] / aoData[4]['value']);
                    param.pageSize = aoData[4]['value'];
                    param.companyId = groupId;
                    param.access_token = yy_access_token;
                    $http({
                        "method": "post",
                        "url": sSource,
                        "data": param
                    }).then(function(resp) {
                        var _dt = resp.data.data;
                        resp.start = _dt.start;
                        resp.recordsTotal = _dt.total;
                        resp.recordsFiltered = _dt.total;
                        resp.length = _dt.pageSize;
                        resp.data = _dt.pageData;
                        fnCallback(resp);
                    });
                },
                columns: [{
                    "data": function(set, status, dt) {
                        var image_url = typeof set['image'] == "undefined" ? "src/img/default_drugs.png" : set['image'];
                        return '<p class="varietylist-checkbox"><span class="imgblock"><img src="' + image_url + '"/></span></p>';
                    }
                }, {
                    "data": function(set, status, dt) {
                        if (typeof set['tradeName'] != "undefined" && set['tradeName'] != "") {
                            return "<a style='colour:blue;'>" + set['tradeName'] + " &#183; " + set['generalName'] + "</a>";
                        } else {
                            return "<a style='colour:blue;'>" + set['generalName'] + "</a>";
                        }
                    }
                }, {
                    "data": function(set, status, dt) {
                        if (typeof set.specification != 'undefined' && set.specification != "null") {
                            return set.specification;
                        } else {
                            return "";
                        }
                    }
                }, {
                    "data": "packSpecification",
                    "orderable": false,
                    "searchable": false
                }, {
                    "data": function(set, status, dt) { //"certificated_store_count"
                        if (typeof set.certificatedStoreCount != 'undefined' && set.certificatedStoreCount != "null") {
                            return set.certificatedStoreCount || 0;
                        } else {
                            return 0;
                        }
                    },
                    "orderable": false,
                    "searchable": false
                }, {
                    "data": function(set, status, dt) { //"医药代表"
                        if (set.waitStoreCount)
                            return set.waitStoreCount;
                        return 0;
                    },
                    "orderable": false,
                    "searchable": false
                }, {
                    "data": function(set, status, dt) { //"医药代表"
                        if (typeof set.sellerMedicalCount != 'undefined' && set.sellerMedicalCount != "null") {
                            return '<a class="yydb" href="javascript:void(0)" style="text-decoration:underline; color:#0099FF;">' + set.sellerMedicalCount + '人</a>';
                        } else {
                            return '<a class="yydb" href="javascript:void(0)" style="text-decoration:underline; color:#0099FF;">0人</a>';
                        }
                    },
                    "orderable": false,
                    "searchable": false
                }, {
                    "data": function(set, status, dt) { //"云盘资料"
                        if (typeof set.cloudCount != 'undefined' && set.cloudCount != "null") {
                            return '<a class="ypzl" href="javascript:void(0)" style="text-decoration:underline; color:#0099FF;">' + set.cloudCount + '个</a>';
                        } else {
                            return '<a class="ypzl" href="javascript:void(0)" style="text-decoration:underline; color:#0099FF;">无</a>';
                        }
                    },
                    "orderable": false,
                    "searchable": false
                }, {
                    "data": function(set, status, dt) {
                        if (typeof set.stateAudit != 'undefined') {
                            if (typeof set.stateAudit != "undefined" && set.stateAudit == 0 || typeof set.stateAudit == "undefined") {
                                return "<button type='button' class='btn btn-audit0'><i></i>未审核</button>";
                            } else if (set.stateAudit == 1) {
                                return "<button type='button' class='btn btn-audit1'><i></i>审核中</button>";
                            } else if (set.stateAudit == 9) {
                                return "<button type='button' class='btn btn-audit9'><i></i>已审核</button>";
                            }
                        } else {
                            return "<button type='button' class='btn btn-audit0'><i></i>未审核</button>";
                        }
                    },
                    "orderable": false,
                    "searchable": false
                }],
                "createdRow": function(nRow, aData, iDataIndex) {
                    $(nRow).on('click', function() {
                        $state.go('app.factory_varietylist.factory_drug_detail', {
                            id: aData.id
                        });
                    });

                    $(nRow).on('click', 'a.yydb', function(evt) { //医药代表
                        evt = evt || window.event;
                        $state.go('app.factory_varietylist.factory_drug_yy', {
                            id: aData.mongoId,
                            name: aData.generalName
                        });
                        evt.stopPropagation();
                    });
                    $(nRow).on('click', 'a.ypzl', function(evt) { //云盘资料
                        console.log(aData);
                        evt = evt || window.event;
                        $state.go('app.file_management', {
                            id: aData.mongoId,
                            name: aData.tradeName + '·' + aData.generalName
                        });
                        evt.stopPropagation();
                    });

                    if (aData.stateAudit == 0) {
                        $(nRow).on('click', 'button', function(evt) {
                            evt = evt || window.event;
                            $http({
                                url: app.url.drug_store_audit + "?state_audit=1" + "&id=" + aData.id,
                                method: 'get',
                            }).then(function(resp) {
                                if (typeof resp.data["#message"] == "undefined") {
                                    $(nRow).find('button').html("<i></i>审核中").attr("class", "btn btn-audit1").unbind("mouseenter").unbind("mouseleave");;
                                }
                            });
                            evt.stopPropagation();
                        });
                    } else {
                        $(nRow).on('click', 'button', function(evt) {
                            evt = evt || window.event;
                            evt.stopPropagation();
                        });
                    }
                    var state = aData.stateAudit;
                    $(nRow).find('button').hover(function() {
                        $scope.state = state;
                        if (typeof state === "undefined" || state == 0) {
                            $(nRow).find('button').html("提交审核").attr("class", "btn btn-success");
                        }
                    }, function() {
                        $scope.state = state;
                        if (typeof state === "undefined" || state == 0) {
                            $(nRow).find('button').html("<i></i>未审核").attr("class", "btn btn-audit1");
                        }
                    });
                }
            });
        }
        dataTable();
    };
    //点击搜索
    $scope.findByKeyWord = function() {
        $scope.title = $scope.mainKeyword;
        setTable();
    };

    $scope.pressEnter = function($event) {
        if ($event.keyCode == 13) {
            $scope.findByKeyWord();
        }
    };

});
