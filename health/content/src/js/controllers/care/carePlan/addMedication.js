(function() {
    angular.module('app')
        .factory('AddMedicationFtory', AddMedicationFtory)

    // 手动注入依赖
    AddMedicationFtory.$inject = ['$http', '$modal'];

    function AddMedicationFtory($http, $modal) {
        return {
            open: openModel
        };

        function openModel(medicationData, callBack) {

            if (!medicationData) medicationData = {
                MedicalCare: {
                    medicalInfos: []
                }
            };

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: function() {
                    var isChack = window.location.href.indexOf('/check/');
                    if (isChack != -1)
                        return '../src/tpl/care/carePlan/addMedication.html';
                    else
                        return 'src/tpl/care/carePlan/addMedication.html';
                }(),
                controller: 'AddMedicationCtrl',
                windowClass: 'docModal doc',
                // size: 'lg',
                resolve: {
                    medicationData: function() {
                        return medicationData;
                    }
                }
            });
            modalInstance.result.then(function(medicationData) {
                if (callBack)
                    callBack(medicationData);
            });
        };


    };

    angular.module('app')
        .controller('AddMedicationCtrl', AddMedicationCtrl)

    function AddMedicationCtrl($scope, $http, $modal, $modalInstance, toaster, medicationData) {

        $scope.medicationData = medicationData;

        // 添加药品
        $scope.openDrugBox = function() {
            $scope.$root.openUiMedicine([], function(list) {
                list.map(function(item) {
                    var drug = {
                        'image': item.image || '',
                        'general_name': item.general_name || '',
                        'manufacturer': item.manufacturer || '',
                        'medicalId': item.id || '',
                        'pack_specification': item.pack_specification || '',
                        'title': item.title || '',
                    }
                    $scope.medicationData.MedicalCare.medicalInfos.push(drug);
                });
            });
        };

        // 移除药品
        $scope.removeDrug = function(index) {
            $scope.medicationData.MedicalCare.medicalInfos.splice(index, 1);
        };

        // 取消
        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };

        // 确定
        $scope.ok = function() {
            checkData($scope.medicationData)
        };

        // 提交数据
        function submitRemindData(data) {

            var param = {
                access_token: app.url.access_token,
                sendTime: data.sendTime,
                carePlanId: data.carePlanId,
                schedulePlanId: data.schedulePlanId,
                dateSeq: data.dateSeq,
                jsonData: JSON.stringify(data.MedicalCare)
            };

            if (data.id)
                param.id = data.id;

            $http.post(app.urlRoot + 'designer/saveMedicalCare', param)
                .then(function(rpn) {
                    rpn = rpn.data;
                    if (rpn && rpn.resultCode == 1) {
                        toaster.pop('success', null, '保存成功');
                        $modalInstance.close(rpn.data);
                    } else if (rpn && rpn.resultMsg) {
                        toaster.pop('error', null, rpn.resultMsg);
                    } else {
                        toaster.pop('error', null, '保存出错');
                        console.error(rpn);
                    };
                });
        };

        // 数据校验
        function checkData(data) {
            if (!data.sendTime)
                return toaster.pop('error', null, '请输入发送时间');
            if (!data.carePlanId)
                return toaster.pop('error', null, '缺少关怀计划id');
            if (!data.dateSeq)
                return toaster.pop('error', null, '缺少日程天数');
            if (data.MedicalCare && data.MedicalCare.medicalInfos) {
                if (data.MedicalCare.medicalInfos.length < 1) {
                    return toaster.pop('error', null, '请添加药品');
                } else {
                    var arry = data.MedicalCare.medicalInfos;
                    for (var i = 0; i < arry.length; i++) {
                        if (!arry[i].totalQuantity ||
                            !arry[i].totalQuantity.quantity ||
                            !arry[i].totalQuantity.unit ||
                            !arry[i].usage ||
                            !arry[i].usage.days ||
                            !arry[i].usage.patients ||
                            !arry[i].usage.quantity ||
                            !arry[i].usage.times ||
                            !arry[i].usage.period ||
                            !arry[i].usage.period.number ||
                            !arry[i].usage.period.text ||
                            !arry[i].usage.period.unit ||
                            !arry[i].reminder ||
                            !arry[i].reminder.duration ||
                            !arry[i].reminder.gapDay
                        )
                            return toaster.pop('error', null, '请正确填写药品的每一项');
                    }
                }
            }
            submitRemindData(data);
        };

        // 设置药量
        $scope.setDose = function(index, doseData) {
            if (!doseData) doseData = {};
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'SetDoseView.html',
                controller: 'SetDoseCtrl',
                size: 'sm',
                resolve: {
                    doseData: function() {
                        return doseData;
                    }
                }
            });
            modalInstance.result.then(function(doseData) {
                $scope.medicationData.MedicalCare.medicalInfos[index].totalQuantity = doseData;
            });
        };

        // 设置用法用量
        $scope.setUsage = function(index, usage, medicalId) {
            if (!usage) usage = [];
            if (medicalId) usage.medicalId = medicalId;

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'SetUsageView.html',
                controller: 'SetUsageCtrl',
                size: 'md',
                resolve: {
                    usage: function() {
                        return usage;
                    },
                }
            });
            modalInstance.result.then(function(usage) {
                $scope.medicationData.MedicalCare.medicalInfos[index].usage = usage;
            });
        };

        // 设置提醒
        $scope.setAlert = function(index, alertData) {
            if (!alertData) alertData = {};
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'SetAlertView.html',
                controller: 'SetAlertCtrl',
                size: 'sm',
                resolve: {
                    alertData: function() {
                        return alertData;
                    }
                }
            });
            modalInstance.result.then(function(alertData) {
                $scope.medicationData.MedicalCare.medicalInfos[index].reminder = alertData;
            });
        };

    };

    angular.module('app')
        .controller('SetDoseCtrl', SetDoseCtrl)

    function SetDoseCtrl($scope, $http, $modal, $modalInstance, toaster, doseData) {

        if (doseData.quantity && doseData.unit) {
            $scope.doseData = {
                quantity: doseData.quantity,
                unit: doseData.unit
            };
        } else {
            $scope.doseData = {
                quantity: 1,
                unit: '盒'
            }
        }

        // 取消
        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };

        // 确定
        $scope.ok = function() {
            $modalInstance.close($scope.doseData);
        };
    };

    angular.module('app')
        .controller('SetUsageCtrl', SetUsageCtrl)

    function SetUsageCtrl($scope, $http, $modal, $modalInstance, toaster, usage) {

        var medicalId = usage.medicalId;

        $scope.usage = {
            'days': usage.days || 1,
            'patients': usage.patients || '',
            'period': {
                'number': function() {
                    if (usage.period && usage.period.number)
                        return usage.period.number;
                    return 1;
                }(),
                'text': function() {
                    if (usage.period && usage.period.text)
                        return usage.period.text;
                    return '';
                }(),
                'unit': function() {
                    if (usage.period && usage.period.unit)
                        return usage.period.unit;
                    return '';
                }()
            },
            'quantity': usage.quantity || '',
            'quantityNbr': cutQuantity(usage.quantity).number,
            'quantityUnit': cutQuantity(usage.quantity).unit,
            'remarks': usage.remarks || '',
            'times': usage.times || 1
        };

        $scope.usageSelected = $scope.usage;

        function cutQuantity(quantity) {
            if (!quantity)
                return {
                    number: 1,
                    unit: '颗'
                }
            var number = quantity.split(/[^\d]/)[0];
            var unit = quantity.replace(number, '');
            return {
                number: number - 0,
                unit: unit
            }
        };

        // http: //192.168.3.7:9002/web/api/data/9d8f068784304be791bc920453a4b8d7/c_Goods.view?id=bcdfd672ed5945aaaa7043bcb1ab52e1
        getUsages();

        function getUsages() {
            $http.post('/web/api/data/' + app.url.access_token + '/c_Goods.view', {
                id: medicalId
            }).
            then(function(rpn) {
                if (rpn && rpn.data && rpn.data.usages) {
                    $scope.usagesList = rpn.data.usages;
                } else {
                    toaster.pop('error', null, '获取药品失败');
                };
            });
        };

        // 用药内容改变
        $scope.usageChange = function(usage) {

            if (usage.period.number < 0) {
                usage.period.number = 1;
                return toaster.pop('error', null, '请输入正确数量');
            }

            $scope.usageSelected = {
                'days': usage.days || 1,
                'patients': usage.patients || '',
                'period': {
                    'number': function() {
                        if (usage.period && usage.period.number)
                            return usage.period.number;
                        return '';
                    }(),
                    'text': function() {
                        // if (usage.period && usage.period.text)
                        //     return usage.period.text;

                        return usage.period.number + ' 天';
                    }(),
                    'unit': function() {
                        if (usage.period && usage.period.unit)
                            return usage.period.unit;
                        return 'Day';
                    }()
                },
                'quantity': function() {
                    if (usage.quantityNbr && usage.quantityUnit)
                        return usage.quantityNbr + usage.quantityUnit;
                    return usage.quantity;
                }(),
                'remarks': usage.remarks || '',
                'times': usage.times || ''
            };
        };

        // 只能输入正整数
        $scope.onlyNbr = function(nbr) {

            if (nbr === null || nbr === undefined || nbr <= 0) {
                toaster.pop('error', null, '请输入正确数量');
                return 1;
            }
            return nbr;
        };

        // 取消
        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };

        // 确定
        $scope.ok = function() {
            console.log($scope.usageSelected);
            if (!checkData($scope.usageSelected)) return;
            $modalInstance.close($scope.usageSelected);
        };

        // 校验
        function checkData(usageSelected) {
            var checkNbr = cutQuantity(usageSelected.quantity);
            if (checkNbr.number <= 0 || !checkNbr.unit) {
                toaster.pop('error', null, '请输入正确数量');
                return false;
            }

            if (!usageSelected) {
                toaster.pop('error', null, '请选择用药');
                return false;
            }
            if (!usageSelected.days) {
                toaster.pop('error', null, '请选择用药天数');
                return false;
            }
            if (!usageSelected.patients) {
                toaster.pop('error', null, '请输入用药人群');
                return false;
            }
            if (!usageSelected.period || !usageSelected.period.number || usageSelected.period.number < 1 || !usageSelected.period.text || !usageSelected.period.unit) {
                toaster.pop('error', null, '请正确设置用法');
                return false;
            }
            if (!usageSelected) {
                toaster.pop('error', null, '请选择用药');
                return false;
            }
            return true;
        }

    };

    angular.module('app')
        .controller('SetAlertCtrl', SetAlertCtrl)

    function SetAlertCtrl($scope, $http, $modal, $modalInstance, toaster, alertData) {

        if (alertData.step && alertData.continue) {
            $scope.alertData = alertData;
        } else {
            $scope.alertData = {
                duration: 1,
                gapDay: 1
            }
        }

        // 取消
        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };

        // 确定
        $scope.ok = function() {
            $modalInstance.close($scope.alertData);
        };
    };

})();
