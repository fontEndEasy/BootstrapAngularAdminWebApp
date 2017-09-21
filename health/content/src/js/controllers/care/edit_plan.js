'use strict';
//新建关怀计划
app.controller('EditCarePlanCtrl', function($rootScope, $scope, $state, $http, $compile, utils, $modal, toaster, $stateParams) {
    var planSave = JSON.parse(localStorage.getItem('planSave')) ? JSON.parse(localStorage.getItem('planSave')) : {};
    var med_ids = [];

    //储存病情跟踪，日程提醒，生活量表，用药关怀的数据
    $rootScope.care_plan_depots = {
        depot1: [],
        depot2: [],
        depot3: [],
        depot4: []
    };

    //删除
    $scope.deletePlan = function() {
        var modalInstance = $modal.open({
            templateUrl: 'delModalContent.html',
            controller: 'delModalInstanceCtrl',
            size: 'sm'
        });

        modalInstance.result.then(function(status) {
            if (status == 'ok') {
                $http.post(app.yiliao + 'pack/care/delCareTemplate', {
                    access_token: app.url.access_token,
                    templateId: $stateParams.planId
                }).
                then(function(rpn) {
                    console.log(rpn.data);
                    if (rpn.data.resultCode === 1) {
                        toaster.pop('success', null, '删除成功');
                        $state.go('app.care_plan_list');
                    } else {
                        toaster.pop('error', null, '删除失败');
                    }
                });
            }
        }, function() {

        });
    };

    $scope.editIntroduce = function() {
        planSave.depot1 = $rootScope.care_plan_depots.depot1;
        planSave.depot2 = $rootScope.care_plan_depots.depot2;
        planSave.depot3 = $rootScope.care_plan_depots.depot3;
        planSave.depot4 = $rootScope.care_plan_depots.depot4;
        localStorage.setItem('planSave', JSON.stringify(planSave));
        $state.go('app.care_introduce', {
            planId: $stateParams.planId,
            isEdit: 'edit'
        });
    };

    $scope.delete = function(idx) {
        $rootScope.care_plan_depots.depot4.splice(idx, 1);
        med_ids.splice(idx, 1)
    };

    if ($stateParams.planId) {
        if ($stateParams.isEdit == 'edit') {
            $scope.planName = planSave.title;
            $rootScope.care_plan_disease = planSave.selectedDisease;
            $scope.planInfo = planSave.summary;
            $scope.planPrice = planSave.planPrice;

            $rootScope.care_plan_depots.depot1 = planSave.depot1 ? planSave.depot1 : [];
            $rootScope.care_plan_depots.depot2 = planSave.depot2 ? planSave.depot2 : [];
            $rootScope.care_plan_depots.depot3 = planSave.depot3 ? planSave.depot3 : [];
            $rootScope.care_plan_depots.depot4 = planSave.depot4 ? planSave.depot4 : [];
        } else {
            //获取计划详情数据
            $http.post(app.yiliao + 'pack/care/queryCareTemplateDetail', {
                access_token: app.url.access_token,
                templateId: $stateParams.planId
            }).
            then(function(rpn) {
                console.log(rpn.data);
                if (rpn.data.resultCode === 1) {

                    $scope.planName = rpn.data.data.careName;
                    $rootScope.care_plan_disease = {
                        name: rpn.data.data.categoryName,
                        id: rpn.data.data.categoryId
                    };
                    $scope.planInfo = rpn.data.data.careDesc;
                    $scope.planPrice = rpn.data.data.price;
                    $rootScope.care_plan_depots = {
                        depot1: rpn.data.data.tracks || [],
                        depot2: rpn.data.data.reminds || [],
                        depot3: rpn.data.data.scales || [],
                        depot4: rpn.data.data.drugs ? rpn.data.data.drugs[0].drugViews : []
                    }
                    if ($rootScope.care_plan_depots.depot4) {
                        $.each($rootScope.care_plan_depots.depot4, function(key, val) {
                            med_ids.push(val['drugId']);
                        });
                    }

                    planSave.title = rpn.data.data.careName;
                    planSave.fontImgUrl = rpn.data.data.imagePath ? rpn.data.data.imagePath : '';
                    planSave.selectedDisease = {
                        name: rpn.data.data.categoryName,
                        id: rpn.data.data.categoryId
                    };
                    planSave.planPrice = rpn.data.data.price;
                    planSave.summary = rpn.data.data.careDesc;
                    planSave.content = rpn.data.data.content ? rpn.data.data.content : '';
                } else {
                    toaster.pop('error', null, '获取失败');
                }
            });
        }
    }


    //tab切换
    $scope.tabNbr = 1;
    $scope.tebChange = function(tabNbr) {
        $scope.tabNbr = tabNbr;
    }


    //添加量表
    $scope.showPop = function(tabNbr) {
        if (!$rootScope.care_plan_disease) {
            return toaster.pop('error', null, '请先选择所属病种');
        }
        if (tabNbr !== 4) {
            $http.post(app.yiliao + 'pack/care/queryCareTemplateItem', {
                access_token: app.url.access_token,
                categoryId: $rootScope.care_plan_disease.id,
                type: tabNbr
            }).
            then(function(rpn) {
                console.log(rpn.data);
                var data = {
                    type: 'depot' + tabNbr,
                    data: rpn.data.data
                };
                getQuestions(data);
            });
        } else {
            $scope.medicineDialog([], function(list) {
                var dp4Ids = [];
                $rootScope.care_plan_depots.depot4.forEach(function(item, index, array) {
                    dp4Ids.push(item.drugId);
                });

                list.forEach(function(item) {
                    if (dp4Ids.indexOf(item.id) == -1) {
                        item.drugId = item.id;
                        $rootScope.care_plan_depots.depot4.push(item);
                    }
                });

            });
        }
    }


    function getQuestions(data) {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'myModalContent.html',
            controller: 'addPopCtrl',
            size: 'md',
            resolve: {
                data: function() {
                    return data;
                }
            }
        });
    };


    //移除量表
    $scope.removeShelf = function(index, type) {
        $rootScope.care_plan_depots[type].splice(index, 1);
        console.log($rootScope.care_plan_depots[type]);
    };

    //提交计划
    $scope.savePlan = function() {
        console.log('计划名称：' + $scope.planName);
        console.log('所属病种：' + $rootScope.care_plan_disease.id);
        console.log('计划简介：' + $scope.planInfo);
        console.log('价格' + $scope.planPrice);
        if ($scope.planPrice < 0) {
            return toaster.pop('error', null, '价格不能少于0');
        }
        if ($scope.carePlanMax < $scope.planPrice || $scope.carePlanMin > $scope.planPrice) {
            return toaster.pop('error', null, '请输入正确的价格');
        }
        if (!($scope.planName && $rootScope.care_plan_disease)) {
            return toaster.pop('error', null, '缺少参数');
        }
        var depot1 = traArry($rootScope.care_plan_depots.depot1, 'ghnrId');
        var depot2 = traArry($rootScope.care_plan_depots.depot2, 'ghnrId');
        var depot3 = traArry($rootScope.care_plan_depots.depot3, 'ghnrId');
        var depot4 = traArry($rootScope.care_plan_depots.depot4, 'id', 'drugId');

        $http.post(app.yiliao + 'pack/care/saveCareTemplate', {
            access_token: app.url.access_token,
            groupId: app.url.groupId(),
            tmpType: 1,
            careName: $scope.planName,
            categoryId: $rootScope.care_plan_disease.id,
            price: $scope.planPrice,
            careDesc: $scope.planInfo,
            tracks: depot1,
            remind: depot2,
            scales: depot3,
            drugs: depot4,
            content: planSave.content,
            imagePath: planSave.fontImgUrl,
            thumPath: planSave.thumPath,
            templateId: $stateParams.planId

        }).
        then(function(rpn) {
            console.log(rpn);

            if (rpn.data.resultCode === 1) {
                toaster.pop('success', null, '提交成功');

                //清除缓存
                delete $rootScope.care_plan_depots;
                delete $rootScope.care_plan_disease;

                $state.go('app.care_plan_list');
            } else {
                toaster.pop('error', null, rpn.data.resultMsg);
            }
        });

        localStorage.removeItem('planPreview');

    }

    $scope._cancel = function() {
        window.history.back();
    };

    //遍历量表数组的ID
    function traArry(arr, k, s) {
        var result = [];
        $.each(arr, function(key, val) {
            result.push(val[k] || val[s]);
        });
        return result;
    }


})

//添加按钮弹窗
app.controller('addPopCtrl', function($rootScope, $scope, $modalInstance, $http, utils, toaster, data) {
    $scope.items = data.data;
    var items = $rootScope.care_plan_depots[data.type];
    var _selectItem = null;
    var _temps = [];

    $.each(items, function(key, val) {
        _temps.push(val);
    });

    //var _items = items;
    for (var i = 0; i < data.data.length; i++) {
        var _dt = utils.queryByKey(items, data.data[i].ghnrId, false, null, ['ghnrId']);
        if (!$.isEmptyObject(_dt)) {
            data.data[i].selected = true;
        }
    }

    $scope.changed = function(dt) {
        if (!dt) return;
        if (dt.selected) {
            dt.selected = false;
            var _dt = utils.queryByKey(items, dt.ghnrId, true, null, ['ghnrId']);
            if (_dt) {
                var _idx = items.indexOf(_dt);
                if (_idx !== -1) {
                    items.splice(_idx, 1);
                }
            }
        } else {
            dt.selected = true;
            items.push(dt);
        }
        _selectItem = dt;
    };
    $scope.add = function() {
        //没有选择
        if (!_selectItem) {
            return;
        }
        //添加选择的数据
        var isSelected = false;
        for (var i = 0; i < $rootScope.care_plan_depots[data.type].length; i++) {
            if ($rootScope.care_plan_depots[data.type][i].ghnrId == _selectItem.ghnrId) {
                isSelected = true;
                break;
            }
        };
        if (!isSelected) {
            //$rootScope.care_plan_depots[data.type].push(_selectItem);
            $rootScope.care_plan_depots[data.type] = items;
            toaster.pop('success', null, '添加成功');
        } else {
            toaster.pop('error', null, '已添加');
        }
    };

    $scope.ok = function() {
        $modalInstance.dismiss('cancel');
    };
    $scope.cancel = function() {
        $rootScope.care_plan_depots[data.type] = _temps;
        $modalInstance.dismiss('cancel');
    };
});

app.controller('delModalInstanceCtrl', function($scope, $modalInstance, toaster, $http, utils) {
    $scope.ok = function() {
        $modalInstance.close('ok');
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});
