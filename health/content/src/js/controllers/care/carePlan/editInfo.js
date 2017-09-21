(function() {
    angular.module('app')
        .factory('EditCareInfoFtory', EditCareInfoFtory)

    // 手动注入依赖
    EditCareInfoFtory.$inject = ['$http', '$modal'];

    function EditCareInfoFtory($http, $modal) {
        return {
            open: openModel
        };

        function openModel(planData, callBack) {

            if (!planData) planData = {};

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: function() {
                    var isChack = window.location.href.indexOf('/check/');
                    if (isChack != -1)
                        return '../src/tpl/care/carePlan/editInfo.html';
                    else
                        return 'src/tpl/care/carePlan/editInfo.html';
                }(),
                controller: 'EditCareInfoCtrl',
                size: 'lg',
                resolve: {
                    planData: function() {
                        return planData;
                    }
                }
            });
            modalInstance.result.then(function(planData) {
                if (callBack)
                    callBack(planData);
            });
        };

    };

    angular.module('app')
        .controller('EditCareInfoCtrl', EditCareInfoCtrl)

    function EditCareInfoCtrl($scope, $http, $state, $modal, $modalInstance, toaster, planData) {
        // console.log(planData);
        // $scope.planData = planData;
        if (planData.id) {
            $scope.planData = {
                id: planData.id,
                name: planData.name,
                diseaseTypeName: planData.diseaseTypeName,
                diseaseTypeId: planData.diseaseTypeId,
                price: (planData.price || 0) / 100,
                executeTime: planData.executeTime,
                titlePic: planData.titlePic,
                digest: planData.digest,
                content: planData.content,
                tmpType: planData.tmpType
            };
        } else {
            $scope.planData = {
                tmpType: planData.tmpType
            };
        }


        //获取金钱区间
        getPriceRange();

        function getPriceRange() {
            $http.post(app.urlRoot + 'group/fee/getGroupFee', {
                access_token: app.url.access_token,
                groupId: app.url.groupId()
            }).then(function(rpn) {
                if (rpn.data.resultCode === 1) {
                    if (rpn.data.data && rpn.data.data.carePlanMax >= 0 && rpn.data.data.carePlanMin >= 0) {
                        $scope.carePlanMax = rpn.data.data.carePlanMax / 100;
                        $scope.carePlanMin = rpn.data.data.carePlanMin / 100;
                    } else {
                        $scope.carePlanMax = 0;
                        $scope.carePlanMin = 0;
                    }

                }
            });
        };

        //选择病种分类
        $scope.chooseType = function() {
            var diseaseModal = new DataBox('data_res', {
                hasCheck: false,
                allCheck: false,
                leafCheck: true,
                multiple: false,
                allHaveArr: false,
                self: false,
                cover: false,
                leafDepth: 3,
                selectView: false,
                search: {
                    //url: '',
                    //param: {},
                    searchDepth: [1],
                    dataKey: {
                        name: 'name',
                        id: 'id',
                        union: 'parentId',
                        dataSet: 'data'
                    },
                    //keyName: 'keyword',
                    unwind: false
                },
                arrType: [0, 0],
                data: {
                    url: app.url.document.getDiseaseTree
                },
                titles: {
                    main: '选择病种',
                    searchKey: '搜索病种...',
                    label: '已选择病种数'
                },
                fixdata: [],
                icons: {
                    arrow: 'fa fa-caret-right/fa fa-caret-down',
                    check: 'fa fa-check/fa fa-square',
                    root: 'fa fa-hospital-o cfblue',
                    branch: 'fa fa-h-square cfblue',
                    leaf: 'fa fa-stethoscope dcolor',
                    head: 'headPicFileName'
                },
                response: diseaseSelected,
                datakey: {
                    id: 'id',
                    name: 'name',
                    sub: 'children'
                },
                info: {
                    name: 'name',
                    id: 'id',
                    leaf: 'leaf',
                    pid: 'parentId',
                }
            });
        };

        // 确认选择病种
        function diseaseSelected(selected) {
            if (selected && selected[0]) {
                $scope.$apply(function() {
                    $scope.planData.diseaseTypeId = selected[0].id;
                    $scope.planData.diseaseTypeName = selected[0].name;
                })
            }
        };

        // 移除图片
        $scope.removeImg = function() {
            $scope.planData.titlePic = '';
        };

        // 取消
        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };

        // 保存
        $scope.saveDoc = function() {
            if (!checkData())
                return;
            pushPlan($scope.planData);
        };

        // 提交
        function pushPlan(planData) {

            var param = planData;
            planData.price = (planData.price || 0) * 100;
            param.access_token = app.url.access_token;
            param.groupId = app.url.groupId();
            if (param.price < 0) {
                param.price = 0;
            }

            $http({
                url: app.urlRoot + 'designer/saveCarePlan',
                method: 'post',
                data: param
            }).then(function(response) {
                var rep = response.data;
                if (rep && rep.resultCode == 1) {
                    toaster.pop('success', null, '保存成功');

                    if (rep.data.tmpType == 1)
                        $state.go('app.carePlan', {
                            planId: rep.data.id
                        });

                    if (rep.data.tmpType == 2)
                        $state.go('app.followUp', {
                            planId: rep.data.id
                        });

                    $modalInstance.close(rep.data);
                } else if (rep && rep.resultMsg) {
                    toaster.pop('error', null, rep.resultMsg);
                } else {
                    toaster.pop('error', null, '保存失败');
                    console.error(rep);
                }
            });
        };

        // 校验
        function checkData() {
            var _checkData = $scope.planData;
            if (!_checkData.name) {
                toaster.pop('error', null, '请输入计划名称');
                return false;
            }
            if (_checkData.name.length > 40) {
                toaster.pop('error', null, '计划名称过长');
                return false;
            }
            if (!_checkData.diseaseTypeId) {
                toaster.pop('error', null, '请选择病种');
                return false;
            }
            if (_checkData.tmpType == 1) {
                if (_checkData.price === null || _checkData.price === '' || _checkData.price === undefined || _checkData.price < $scope.carePlanMin || _checkData.price > $scope.carePlanMax) {
                    toaster.pop('error', null, '请输入正确的价格');
                    return false;
                }
                if (!_checkData.titlePic) {
                    toaster.pop('error', null, '请上传题图');
                    return false;
                }
                if (!_checkData.content) {
                    toaster.pop('error', null, '请输入正文');
                    return false;
                }
            }
            if (!_checkData.executeTime) {
                toaster.pop('error', null, '请输入执行时长');
                return false;
            }
            if (!_checkData.digest) {
                toaster.pop('error', null, '请输入摘要');
                return false;
            }
            if (_checkData.digest.length > 80) {
                toaster.pop('error', null, '计划摘要过长');
                return false;
            }
            return true;

        };

        // 七牛上传文件过滤
        $scope.qiniuFilters = {
            mime_types: [ //只允许上传图片和zip文件
                {
                    title: "Image files",
                    extensions: "jpg,gif,png"
                }
            ]
        };

        // 设置七牛上传获取uptoken的参数
        $scope.token = app.url.access_token;

        // 选择文件后回调
        $scope.uploaderAdded = function(up, files) {
            // $scope.uploadBoxOpen = true;
            $scope.planData.titlePic = null;
        };
        $scope.progressCallBack = function(up, file) {
            $scope.imgFile = file;
            console.log($scope.imgFile);
        };
        // 每个文件上传成功回调
        $scope.uploaderSuccess = function(up, file, info) {
            // console.log(up, file, info);
            $scope.$apply(function() {
                $scope.planData.titlePic = file.url;
            });
            $scope.fileList = [];
        };
        // 每个文件上传失败后回调
        $scope.uploaderError = function(up, err, errTip) {
            // console.error(up, err, errTip);
            toaster.pop('error', null, errTip);
        };

    };

})();
