/**
 * Created by clf on 2016/1/15.
 */
app.controller('ConsultDetailCtrl', function($scope,utils,$http,$modal,toaster,$location,$state,$rootScope,$stateParams) {
    var curGroupId=utils.localData('curGroupId');
    $scope.doctors=[];
    $scope.hiddenData=[];
    $scope.saved=true;
    var consultationPackId=$stateParams.id?$stateParams.id:curGroupId;


    getOpenStatus();
    function getOpenStatus(){
        $http.post(app.url.consult.getOpenConsultation,{
            access_token:app.url.access_token,
            groupId:curGroupId
        }).
            success(function(data, status, headers, config) {
                if(data.resultCode==1){
                    if(data.resultCode!=1){
                        $state.go('app.consultation.introduce');
                    }
                }
                else{
                    console.log(data.resultMsg);
                }
            }).
            error(function(data, status, headers, config) {
                alert(data.resultMsg);
            });
    }

    function getData(){
        $http.post(app.url.consult.getPackDetail,{
            access_token:app.url.access_token,
            consultationPackId:$stateParams.id
        }).
            success(function(data, status, headers, config) {
                if(data.resultCode==1){
                    $scope.description=data.data.consultationPackDesc;
                    $scope.docPriceMax=data.data.maxFee/100;
                    $scope.docPriceMin=data.data.minFee/100;
                    $scope.groupRatio=data.data.groupPercent;
                    $scope.docRatio=data.data.consultationDoctorPercent;
                    $scope.orgDocRatio=data.data.unionDoctorPercent;
                    if(data.data.doctorInfoList&&data.data.doctorInfoList.length>0){
                        data.data.doctorInfoList.forEach(function(item,index,array){
                            $scope.doctors.push({
                                id:item.userId,
                                name:item.name
                            });
                        });
                    }
                }
                else{
                    console.log(data.resultMsg);
                }
            }).
            error(function(data, status, headers, config) {
                alert(data.resultMsg);
            });
    }

    //function getHiddenData(){
    //    $http.post(app.url.consult.getNotInCurrentPackDoctorIds,{
    //        access_token:app.url.access_token,
    //        groupId:curGroupId,
    //        consultationPackId:$stateParams.id
    //    }).
    //        success(function(data, status, headers, config) {
    //            if(data.resultCode==1){
    //                console.log(data);
    //                $scope.hiddenData=data.data;
    //            }
    //            else{
    //                console.log(data.resultMsg);
    //            }
    //        }).
    //        error(function(data, status, headers, config) {
    //            alert(data.resultMsg);
    //        });
    //}
    //
    //    getHiddenData();

    if($stateParams.id){
        getData();
    }


    function pickData() {
        // 创建通讯录列表数据
        var databox = new DataBox('data_res', {
            hasCheck: true,
            allCheck: true,
            leafCheck: false,
            multiple: true,
            allHaveArr: true,
            self: false,
            cover: false,
            //unionSelect: true,
            selectView: true,
            arrType: [1, 0],
            search: {
                url: app.url.yiliao.searchDoctorByKeyWord,
                param: {
                    access_token: app.url.access_token,
                    groupId: curGroupId,
                    consultationPackId:consultationPackId,
                    keyword: 'name',
                    pageSize: 10000,
                    pageIndex: 0
                },
                dataKey: {
                    name: 'doctor.name',
                    id: 'doctorId',
                    union: 'departmentId',
                    dataSet: 'data.pageData'
                },
                keyName: 'keyword',
                unwind: false
            },
            data: {
                url: app.url.yiliao.getAllData,
                param: {
                    access_token: app.url.access_token,
                    groupId: curGroupId
                }
            },
            async: {
                url: app.url.yiliao.getDepartmentDoctor,
                dataKey: {
                    departmentId: 'id'
                },
                data: {
                    access_token: app.url.access_token,
                    groupId: curGroupId,
                    consultationPackId:consultationPackId,
                    status: 'C',
                    type: 1
                },
                dataName: '',
                target: {
                    data: '',
                    dataKey: {
                        id: 'userId',
                        name: 'name'
                    }
                }
            },
            titles: {
                main: '选择会诊医生',
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
                selectable: false,
                name: utils.localData('curGroupName'),
                id: 0
            },
            extra: [{
                name: '未分配',
                id: 'idx_0',
                parentId: 0,
                subList: [],
                url: app.url.yiliao.getUndistributed,
                dataName: 'pageData',
                target: {
                    data: 'doctor',
                    dataKey: {
                        id: 'doctorId',
                        name: 'name'
                    }
                },
                param: {
                    access_token: app.url.access_token,
                    groupId: curGroupId,
                    consultationPackId:consultationPackId,
                    pageIndex: 0,
                    pageSize: 10000
                },
                icon: 'fa fa-bookmark'
            }],
            fixdata: $scope.doctors,
            //hiddenData:$scope.hiddenData,
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
                dpt: 'departments',
                description: 'description',
                param: 'param',
                icon: 'icon',
                url: 'url',
                isExtra: 'isExtra',
                target: 'target'
            },
            callback: function () {}
        });
    }


    $scope.addData = function () {
        pickData();
    };


    function makeList(dt){
        $scope.doctors=dt;
        $scope.$apply($scope.doctors);
    }

    $scope.removeItem = function(item){
        var index = $scope.doctors.indexOf(item);
        $scope.doctors.splice(index,1);
        console.log($scope.doctors);
    };

    $scope.$watch('docRatio',function(newValue,oldValue){
        if(newValue!=oldValue){
            $scope.orgDocRatio=100-newValue;
        }
    });

    $scope.$watch('orgDocRatio',function(newValue,oldValue){
        if(newValue!=oldValue){
            $scope.docRatio=100-newValue;
        }
    });

    $scope.save=function(){
        $scope.saved=false;

        var doctorIds=[];
        $scope.doctors.forEach(function(item,index,array){
            doctorIds.push(item.id);
        });

        if($stateParams.id){
            //更新
            var doctorsStr='';

            doctorIds.forEach(function(item,index,array){
                doctorsStr+='&doctorIds='+item;
            });

            var url=app.url.consult.updatePack+'?access_token='+app.url.access_token+'&id='+$stateParams.id+'&consultationPackDesc='+$scope.description+'&maxFee='+ $scope.docPriceMax*100+'&minFee='+$scope.docPriceMin*100+'&groupPercent='+$scope.groupRatio+'&consultationDoctorPercent='+$scope.docRatio+'&unionDoctorPercent='+$scope.orgDocRatio +doctorsStr;
            $http.get(encodeURI(url), {

            }).
                success(function(data, status, headers, config) {
                    if(data.resultCode==1){
                        $state.go('app.consultation.list',null,{reload:true});
                    }
                    else{
                        toaster.pop('error',null,data.resultMsg);
                        $scope.saved=true;
                    }
                }).
                error(function(data, status, headers, config) {
                    toaster.pop('error',null,data.resultMsg);
                    $scope.saved=true;
                });
        }
        else{
            //添加
            $http.post(app.url.consult.addPack, {
                access_token:app.url.access_token,
                groupId:curGroupId,
                consultationPackDesc:$scope.description,
                maxFee:$scope.docPriceMax*100,
                minFee:$scope.docPriceMin*100,
                groupPercent:$scope.groupRatio,
                consultationDoctorPercent:$scope.docRatio,
                unionDoctorPercent:$scope.orgDocRatio,
                doctorIds:doctorIds
            }).
                success(function(data, status, headers, config) {
                    if(data.resultCode==1){
                        $state.go('app.consultation.list',null,{reload:true});
                    }
                    else{
                        toaster.pop('error',null,data.resultMsg);
                        $scope.saved=true;
                    }
                }).
                error(function(data, status, headers, config) {
                    toaster.pop('error',null,data.resultMsg);
                    $scope.saved=true;
                });
        }
    }
});