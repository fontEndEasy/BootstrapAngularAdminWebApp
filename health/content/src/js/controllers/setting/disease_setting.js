'use strict';

app.controller('DiseaseSettingCtrl', function ($rootScope, $scope, $state, $http, $compile, utils, modal, toaster) {
    var data = null,
        cnt_list = $('#cnt_list'),
        items = cnt_list.find('.list-group-item'),
        dt = null,
        groupId = utils.localData('curGroupId');

    $scope.dataDom = null;
    $scope.loading = true;

    //获取擅长病种
    $http.post(app.url.yiliao.getDiseaseLabel, {
        access_token: localStorage.getItem('access_token'),
        docGroupId: localStorage.getItem('curGroupId')
    }).
    success(function(data) {
        if(data.data.length > 0){
            $scope.loading = false;
            data.data.map(function(e) {
                e.id = e.diseasesId;
                e.name = e.diseasesName;
                delete e.diseasesId;
                delete e.diseasesName;
                return e;
            });
            console.log(data.data);
            $scope.dataDom = data.data; 
        }else{
            $scope.loading = false;
            console.log(data);
        }
        setEditor();
    }).
    error(function(data) {
        console.log(data);
    });

    //遍历dom
    function makeList(data){
        console.log(data);
        $scope.dataDom = data;
        $scope.$apply($scope.dataDom);
    }


    //调用添加插件
    function pickData(){
        var databox = new DataBox('data_res', {
            hasCheck: true,
            allCheck: true,
            leafCheck: true,
            multiple: true,
            allHaveArr: false,
            self: false,
            cover: false,
            leafDepth: 2,
            selectView: true,
            search: {
                url: '',
                param: {},
                searchDepth: [1],
                dataKey: {
                    name: 'name',
                    id: 'id',
                    union: 'parentId',
                    dataSet: 'data.data'
                },
                //keyName: 'keyword',
                unwind: false
            },
            arrType:[1,1,0],
            data: {
                url: app.yiliao + 'base/getDiseaseTree'
            },
            titles: {
                main: '选择病种',
                searchKey: '搜索病种...',
                label: '已选择病种数'
            },
            icons: {
                arrow: 'fa fa-caret-right/fa fa-caret-down',
                check: 'fa fa-check/fa fa-square',
                root: 'fa fa-hospital-o cfblue',
                branch: 'fa fa-h-square cfblue',
                leaf: 'fa fa-stethoscope dcolor',
                head: 'headPicFileName'
            },
            fixdata: $scope.dataDom,
            response: makeList,
            datakey: {
                id: 'id',
                name: 'name',
                sub: 'children'
            },
            info: {
                name: 'name',
                id: 'id',
                leaf: 'leaf'
            }
        });
    }


    function setEditor () {
        // 修改
        $scope.addData = function () {
            pickData();
        };

        // 保存
        $scope.saveData = function () {
            var ids=[];
            //更改数组每个元素的属性名称
            $scope.dataDom.forEach(function(item,index,array){
                ids.push(item.id);
            });
            //设置擅长病种
            $http.post(app.yiliao + 'group/settings/setSpecialty', {
                'access_token': localStorage.getItem('access_token'),
                'docGroupId': localStorage.getItem('curGroupId'),
                'specialtyIds': ids
            }).
            success(function(data) {
                if(data.resultCode === 1){
                    console.log(data);
                    $scope.result = true;
                    toaster.pop('success',null,'保存成功！');
                }else{
                    $scope.result = false;
                    console.log(data);
                    toaster.pop('error',null,'保存失败！');
                }
            }).
            error(function(data) {
                console.log(data);
            });
        };

        $scope.removeItem = function(item){
            var index = $scope.dataDom.indexOf(item);
            $scope.dataDom.splice(index,1);
            console.log($scope.dataDom);
        };
    }
});
