/**
 * Created by clf on 2015/10/8.
 */

'use strict';

app.controller('ExpertSettingCtrl', function ($rootScope, $scope, $state, $http, $compile, utils, modal,toaster) {
    var access_token = localStorage.getItem('access_token');
    var curGroupId = localStorage.getItem('curGroupId');

    var data = null,
        cnt_list = $('#cnt_list'),
        items = cnt_list.find('.list-group-item'),
        dt = null,
        groupId = utils.localData('curGroupId');

    $scope.loading = true;

    //获取集团的专家
    $scope.experts=[];
    $http.post(app.url.yiliao.findProDoctorByGroupId, {
        "access_token": access_token,
        "docGroupId": curGroupId
    }).
    success(function(data, status, headers, config) {
        if (data.resultCode == 1) {
            //data.data.pageData = [{doctorId:219,doctorName:'小张'},{doctorId:115,doctorName:'小明'},{doctorId:325,doctorName:'小黑'}];

            //将属性doctorName转换为name,doctorId转换为id
            if(data.data.pageData!=undefined&&data.data.pageData.length>0){
                data.data.pageData= data.data.pageData.map(function(obj){
                    console.log(obj);
                    var rObj={};
                    rObj.id = obj.doctorId;
                    rObj.name=obj.doctorName;
                    return rObj;
                });
            }

            $scope.experts=data.data.pageData;
        }
        else{
            alert(data.resultMsg);
        }
    }).
    error(function(data, status, headers, config) {
        console.log(data);
    });


    var templete =
        '<div class="dialog-heading font-bold text-center">选择数据</div>'+
        '<div class="dialog-body">'+
        '<div class="box-l">'+
        '<div class="dialog-bar"><input id="keys_ipt" placeholder="关键字" class="form-control"/><i class="icon-magnifier-add"></i></div>'+
        '<div id="data_res"></div>'+
        '</div>'+
        '<div class="box-r">'+
        '<div id="data_box"></div>'+
        '</div>'+
        '</div>'+
        '<div class="dialog-opr-bar clear">'+
        '<div class="col-md-offset-2 col-md-4">'+
        '<button ng-click="ok()" type="button" class="w100 btn btn-success">确 定</button>'+
        '</div>'+
        '<div class="col-md-4">'+
        '<button ng-click="cancel()" type="button" class="w100 btn btn-default">取 消</button>'+
        '</div>'+
        '</div>';

    //var container = $('<div></div>');
    //container.addClass('dialog-container animating fade-in-down').html(templete);

    function pickData(){
        // 创建通讯录列表数据
        var databox = new DataBox('data_res', {
            hasCheck: true,
            allCheck: true,
            leafCheck: false,
            multiple: true,
            allHaveArr: true,
            self: false,
            cover: false,
            selectView: true,
            arrType: [1,0],
            search: {
                url: '',
                param: {}
            },
            data: {
                url: app.url.yiliao.getAllData,
                param: {
                    access_token: app.url.access_token,
                    groupId: groupId
                }
            },
            async: {
                url: app.url.yiliao.getDepartmentDoctor,
                dataKey: {
                    departmentId: 'id'
                },
                data: {
                    groupId: groupId,
                    status: 'C',
                    type: 1
                },
                dataName: ''
            },
            titles: {
                main: '选择值班医生',
                searchKey: '医生姓名',
                label: '已选择医生'
            },
            icons: {
                arrow: 'fa fa-caret-right/fa fa-caret-down',
                check: 'fa fa-check/fa fa-square',
                root: 'fa fa-hospital-o cfblue',
                branch: 'fa fa-h-square cfblue',
                leaf: 'fa fa-user-md dcolor',
                head: 'headPicFileName'
            },
            root: {
                selectable: true,
                name: utils.localData('curGroupName'),
                id: 0
            },
            fixdata: $scope.experts,
            response: makeList,
            datakey: {
                id: 'id',
                name: 'name',
                sub: 'subList'
            },
            info: {
                name: 'name',
                id: 'id',
                pid: 'parentId',
                description: 'description'
            },
            callback: function () {}
        });
    }

    // 添加组织
    $scope.addData = function () {
        pickData();
    };


    var doIt = function () {
    };

    //var ids = [];
    function makeList(dt){
        console.log(dt);
        $scope.experts=dt;
        $scope.$apply($scope.experts);
        //var str = '';
        //for(var i=0; i<dt.length; i++){
        //    ids.push(dt[i].id);
        //    str += '<div><i class="fa fa-times" ng-click="removeItem()"></i><h3>'+ dt[i].name +'</h3></div>';
        //}
        //$('#lab_container').html(str);
    }

    $scope.save=function(){
        var ids=[];
        $scope.experts.forEach(function(item,index,array){
            ids.push(item.id);
        });
        $http.post(app.url.yiliao.setResExpert, {
            "access_token": access_token,
            "docGroupId": curGroupId,
            "expertIds":ids
        }).
        success(function(data, status, headers, config) {
            if (data.resultCode == 1) {
                toaster.pop('success','','保存成功');
            }
            else{
                toaster.pop('error','',data.resultMsg);
            }
        }).
        error(function(data, status, headers, config) {
            console.log(data);
        });
    };

    $scope.removeItem = function(item){
        var index = $scope.experts.indexOf(item);
        $scope.experts.splice(index,1);
        console.log($scope.experts);
    };
});
