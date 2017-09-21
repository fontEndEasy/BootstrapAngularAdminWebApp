'use strict';

app.controller('groupDrugLibraryCtrl', function($rootScope, $scope, $http, toaster) {

    var datable = null;

    $scope.page = 1;
    $scope.page_size = 10;

    setTable($scope.page, $scope.page_size);

    //获取表格
    function setTable(page, page_size) {

        var url = app.yiyao + 'api/invoke/' + localStorage.getItem('access_token') + app.url.yiyao.c_Group_Goods_select;
        $http.post(url, {
            group: localStorage.getItem('curGroupId'),
            __PAGE__: page,
            __PAGE_SIZE__: page_size,
            __ORDER_BY__: 'created_time desc'
        }).
        then(function(rpn) {
            if (rpn && rpn.data && rpn.data.info_list) {
                if (rpn.data.info_list.length > 0) {
                    $scope.drugList = rpn.data.info_list;
                    $scope.page_count = rpn.data.total;
                } else {
                    $scope.drugList = [];
                    $scope.page_count = 0;
                }
            }
        });

    };

    $scope.openDrugBox = function() {
        $scope.medicineDialog([], function(list) {
            var goods = [];
            list.map(function(item) {
                goods.push(item.id);
            });
            addDrug(goods);
        });
    }

    function addDrug(goods) {
        var url = app.yiyao + 'api/invoke/' + localStorage.getItem('access_token') + app.url.yiyao.c_Group_Goods_creates;
        goods = JSON.stringify(goods);

        $http.post(url, {
            group: localStorage.getItem('curGroupId'),
            goodses: 'json:' + goods
        }).
        then(function(rpn) {
            if (rpn.data && rpn.data.is_success) {
                toaster.pop('success', null, '添加成功');
                $scope.page = 1;
                setTable($scope.page, $scope.page_size);
            } else {
                toaster.pop('error', null, '添加失败');
                console.warn(rpn);
            }
        });
    }

    $scope.pageChanged = function() {
        setTable($scope.page, $scope.page_size);
    };

    $scope.delete = function(id) {
        var url = app.yiyao + 'api/invoke/' + localStorage.getItem('access_token') + app.url.yiyao.c_Group_Goods_delete;
        $http.post(url, {
            group: localStorage.getItem('curGroupId'),
            id: id
        }).
        then(function(rpn) {
            if (rpn && rpn.data && rpn.data == '"OK"') {
                toaster.pop('success', null, '删除成功');
                setTable($scope.page, $scope.page_size);
            } else {
                toaster.pop('error', null, '删除失败');
                console.warn(rpn);
            }
        });
    }

})
