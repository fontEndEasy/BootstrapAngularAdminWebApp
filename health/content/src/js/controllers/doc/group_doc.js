/**
 * Created by clf on 2015/10/22.
 */
'use strict'
app.controller('GroupCtrl', function($scope, $timeout,utils,$http,modal,toaster,$location,$state) {

    //当前集团id
    var curGroupId=localStorage.getItem('curGroupId');
    var userId=localStorage.getItem('user_id');

    //所有文档
    var platArticleTable;

    //“更多”按钮
    $scope.showMore=false;

    //筛选模块
    $scope.isCollapsed = false;
    $scope.open=false;

    //当前选中的病种id
    var currentTreeId;

    //病种标签列表
    $scope.keywords=[];

    //树的数据的加载情况
    $scope.isTreeLoad=false;

    $scope.mainKeyword=null;

    //点击搜索前所在的branch
    var preBranch;
    var tree={};
    $scope.my_tree = tree = {};

    //所有文档获取数据的url和param
    var allDocUrl=app.url.document.getArticleByDisease;
    var allDocParam={
        access_token:app.url.access_token,
        createType:6,
        pageIndex:1,
        pageSize:10,
        createrId:curGroupId
    };


    //文档树的数据
    $scope.my_data=[];

    function clone(myObj){
        var newObj={};
        newObj.label=myObj.name+'('+myObj.count+')';
        newObj.id=myObj.diseaseId;
        if(myObj.children!=undefined){
            newObj.children=[];
            for(var i in myObj.children){
                newObj.children[i]=clone(myObj.children[i]);
            }
        }
        return newObj;
    }




    //这里要获取病种树的数据
    var getTreeData=function(){
        $http.post(app.url.document.findDiseaseTreeForArticle, {
            access_token:app.url.access_token,
            createType:2,
            groupId:curGroupId
        }).
        success(function(data, status, headers, config) {
            if(data.resultCode==1){

                var source={
                    count:data.data.total,
                    name:'全部文档'
                };

                source.children=data.data.tree;
                var result=clone(source);
                var eArray=new Array();
                eArray[0]=result;
                $scope.my_data=eArray;
                $scope.isTreeLoad=true;
                console.log(eArray);
            }
            else{
                console.log(data.resultMsg);
            }
        }).
        error(function(data, status, headers, config) {
            alert(data.resultMsg);
        });
    };

    getTreeData();

    //点击文档树节点
    $scope.my_tree_handler = function(branch) {
        currentTreeId=branch.id;

        //如果是文档树的最后节点
        if(branch.level==3){
            //请求病种标签
            $http.post(app.url.document.getDisease,{
                parentId:branch.id
            }).
                success(function(data, status, headers, config) {
                    if(data.resultCode==1){
                        $scope.keywords=data.data;
                        if($scope.keywords.length>0){
                            $scope.keywords.unshift({
                                name:'不限',
                                id:null
                            });
                        }
                    }
                    else{
                        alert(data.resultMsg);
                    }
                }).
                error(function(data, status, headers, config) {
                    alert(data.resultMsg);
                });

        }
        else{
            $scope.keywords=[];
        }

        allDocUrl=app.url.document.getArticleByDisease;
        allDocParam={
            access_token:app.url.access_token,
            createType:6,
            pageIndex:1,
            pageSize:10,
            createrId:curGroupId,
            diseaseId:branch.id
        };
        initPlatDocTable();

    };

    //watch搜索框
    $scope.mainKWLength=0;
    $scope.$watch('mainKeyword',function(newValue, oldValue){
        if(newValue!=oldValue){
            if($scope.mainKeyword){
                $scope.mainKWLength=$scope.mainKeyword.length;
            }
            else{
                $scope.mainKWLength=0;
            }
        }
    });


    //观察关键字长度来确定是否显示“更多”按钮
    $scope.$watch('keywords',function(newValue,oldValue){
        setTimeout(function(){
            var kw_c_height=$('#kw_content').height();
            console.log(kw_c_height);
            if(kw_c_height<40){
                $scope.showMore=false;

            }
            else{
                $scope.showMore=true;
            }
            $scope.$apply('showMore');
        },0);
    });

    //清除搜索关键字
    $scope.clearMainKW=function(){
        $scope.my_tree.select_branch(preBranch);
        $scope.mainKeyword=null;
        //所有文档获取数据的url和param
        //allDocUrl=app.url.document.getArticleByDisease;
        //allDocParam={
        //    access_token:app.url.access_token,
        //    createType:6,
        //    pageIndex:1,
        //    pageSize:10,
        //    createrId:curGroupId
        //};
        //initPlatDocTable();
    };


    //点击病种标签
    $scope.sortByKeyword=function(keyword){
        if(keyword.name=='不限'){
            allDocUrl=app.url.document.getArticleByDisease;
            allDocParam={
                access_token:app.url.access_token,
                createType:6,
                pageIndex:1,
                pageSize:10,
                createrId:curGroupId,
                diseaseId:currentTreeId
            };
        }
        else{
            allDocUrl=app.url.document.findArticleByTag;
            allDocParam={
                access_token:app.url.access_token,
                createType:6,
                pageIndex:1,
                pageSize:10,
                createrId:curGroupId,
                tags:keyword.id
            };
        }

        initPlatDocTable();
    };

    //按回车键搜索文档标题
    $scope.pressEnter=function($event){
        if($event.keyCode==13){
            $scope.findDocByKeyWord();
        }
    };

    //关键字搜索文档标题
    $scope.findDocByKeyWord=function(){
        preBranch=$scope.my_tree.get_selected_branch();
        $scope.my_tree.select_branch();
        $scope.keywords=[];

        if($scope.mainKeyword==null||$scope.mainKeyword.length==0){
            //所有文档
            allDocUrl=app.url.document.getArticleByDisease;
            allDocParam={
                access_token:app.url.access_token,
                createType:6,
                pageIndex:1,
                pageSize:10,
                createrId:curGroupId
            };
        }
        else{
            //搜索标题
            allDocUrl=app.url.document.findArticleByKeyWord;
            allDocParam={
                title:$scope.mainKeyword,
                access_token:app.url.access_token,
                createType:6,
                createrId:curGroupId,
                pageIndex:1,
                pageSize:10
            };
        }
        initPlatDocTable();
    };


    //收藏
    var collectArticle=function(aData){
        $http.post(app.url.document.collectArticle, {
            access_token:app.url.access_token,
            articleId:aData.id,
            createType:3,
            createrId:userId
        }).
        success(function(data, status, headers, config) {
            if(data.resultCode==1){
                if(data.data=="false"){
                    toaster.pop('success','','收藏失败');
                }
                else if(data.data=="true"){
                    allDocParam.pageIndex=1;
                    initPlatDocTable();
                    toaster.pop('success','','收藏成功');
                }

            }
            else{
                console.log(data.resultMsg);
            }
        }).
        error(function(data, status, headers, config) {
            console.log(data.resultMsg);
        });
    };

    //取消收藏
    var removeCollect=function(id){
        $http.post(app.url.document.collectArticleRemove, {
            access_token:app.url.access_token,
            articleId:id,
            createType:3
        }).
        success(function(data, status, headers, config) {
            if(data.resultCode==1){
                allDocParam.pageIndex=1;
                initPlatDocTable();
                toaster.pop('success','','取消收藏成功');
            }
            else{
                console.log(data.resultMsg);
            }
        }).
        error(function(data, status, headers, config) {
            alert(data.resultMsg);
        });
    };



    // 初始化所有文档表格
    function initPlatDocTable() {
        var index = 1,
            length =10,
            start = 0,
            idx = 0,
            size = 10,
            num = 0;


        var setTable = function () {
            platArticleTable = $('#doc_list').DataTable({
                "language": app.lang.datatables.translation,
                "searching": false,
                "sScrollX": "100%",
                "sScrollXInner": "110%",
                "destroy": true,
                "lengthChange": true,
                "ordering": false,
                "draw": index,
                "pageLength": length,
                "lengthMenu": [5,10,20,50],
                "autoWidth" : false,
                "displayStart": start,
                "bServerSide": true,
                "sAjaxSource": allDocUrl,
                "fnServerData": function (sSource, aoData, fnCallback) {
                    num = 1;
                    idx = index;
                    $.ajax({
                        "type": "post",
                        "url": sSource,
                        "dataType": "json",
                        "data":allDocParam,
                        "success": function (resp) {
                            if(resp.resultCode==1){
                                var data = {};
                                data.recordsTotal = resp.data.total;
                                data.recordsFiltered = resp.data.total;
                                data.length = resp.data.pageSize;
                                data.data = resp.data.pageData;
                                size = aoData[4]['value'];
                                fnCallback(data);
                            }
                            else{
                                console.log(resp.resultMsg);
                            }
                        }
                    });
                },
                "columns": [{
                    "data": "author",
                    "render": function (set, status, dt) {

                        var keywordsStr='';
                        if(dt.tag&&dt.tag.length>0){
                            keywordsStr+='关键字：';
                            dt.tag.forEach(function(item,index,array){
                                if(item){
                                    keywordsStr+=item.name+'；';
                                }
                            });
                        }
                        else{
                            keywordsStr+='&nbsp;'
                        }
                        var groupNameStr=dt.groupName?'&nbsp<i class="fa fa-circle" style="transform:scale(0.5,0.5);"></i>&nbsp'+dt.groupName:'';
                        var doctorTitle=dt.doctor&&dt.doctor.title?'&nbsp<i class="fa fa-circle" style="transform:scale(0.5,0.5);"></i>&nbsp'+dt.doctor.title:'';
                        var doctorHos=dt.doctor&&dt.doctor.hospital?'&nbsp<i class="fa fa-circle" style="transform:scale(0.5,0.5);"></i>&nbsp'+dt.doctor.hospital:'';
                        var authorName=dt.authorName?dt.authorName:dt.author;
                        var photoPath='src/img/nophoto.jpg';
                        if(dt.copy_small&&dt.copy_small!=""){
                            photoPath=dt.copy_small;
                        }


                        return'<img src='+photoPath+' alt="..." style="width:60px;height:60px;margin-right:10px;float:left;border-radius:0;">'+
                            '<span class="clear">'+
                            '<span>'+dt.title+'</span>'+
                            '<small class="text-muted clear text-ellipsis">'+keywordsStr.substring(0,30)+
                            '</small>'+
                            '<small class="text-muted clear text-ellipsis">作者：'+authorName+groupNameStr+doctorTitle+doctorHos+
                            '</small>'+
                            '</span>';
                    },
                    //"orderable": false
                }, {
                    "data": "useNum",
                    //"orderable": false,
                    "render": function (set, status, dt) {
                        if(dt.useNum==undefined){
                            return 0;
                        }
                        else{
                            return dt.useNum;
                        }
                    }
                }, {
                    "data": "visitCount",
                    //"orderable": false,
                    "render": function (set, status, dt) {
                        if(dt.visitCount==undefined){
                            return 0;
                        }
                        else{
                            return dt.visitCount;
                        }
                    }
                }, {
                    "render": function (set, status, dt) {
                        return utils.dateFormat(dt.lastUpdateTime,'yyyy-MM-dd');
                    }
                },
                    {
                        "render": function (set, status, dt) {
                            if(dt.collect==0){
                                return '<label id="collectArticle" class="operate">收藏</label>';
                            }
                            else if(dt.collect==1){
                                return '<label id="removeCollect" class="operate">取消收藏</label>';
                            }
                            else{
                                return "";
                            }
                        },
                        //"orderable": false
                    }
                ],
                "createdRow": function (nRow, aData, iDataIndex) {
                    $(nRow).on('click','#collectArticle', function (event) {
                        collectArticle(aData);
                        event.stopPropagation();
                    });
                    $(nRow).on('click','#removeCollect', function (event) {
                        removeCollect(aData.id);
                        event.stopPropagation();
                    });
                    $(nRow).on('click','', function (event) {
                        var url = $state.href('doc.article', {id: aData.id,createType:6});
                        window.open(url,'_blank');
                    });
                }
            });


            // 表格事件处理,init-初始化完成,length-改变每页长度,page-翻页,search-搜索
            platArticleTable.off('page.dt').on('page.dt', function (e, settings) {
                console.log('分页分页分页分页分页分页分页分页分页分页分页分页分页分页分页分页分页分页分页分页分页分页分页分页分页分页分页分页');
                index = platArticleTable.page.info().page+1;
                start = length * (index - 1);
                allDocParam.pageIndex=index;
            })
            .on('length.dt', function ( e, settings, len ) {
                //console.log( 'New page length: '+len );
                //index = articleTable.page.info().page+1;
                //start = length * (index - 1);
                length=len;
                index = 1;
                start = 0;
                allDocParam.pageIndex=1;
                allDocParam.pageSize=len;
            } );
            //    .off('order.dt').on('order.dt',function(e,settings){
            //    console.log(platArticleTable.order());
            //    console.log('排序排序排序排序排序排序排序排序排序排序排序排序排序排序排序排序排序排序排序排序排序排序排序排序排序排序排序排序排序排序排序');
            //    var orderType=platArticleTable.order()[0][1];
            //    var orderBy=platArticleTable.order()[0][0];
            //    //这里编写排序事件
            //    console.log(orderBy);
            //    console.log(orderType);
            //    if(orderBy==0){
            //        orderBy='visitCount';
            //    }
            //    else if(orderBy==2){
            //        orderBy='visitCount';
            //    }
            //    else if(orderBy==3){
            //        orderBy='lastUpdateTime';
            //    }
            //
            //    allDocParam.orderType=orderType;
            //    allDocParam.orderBy=orderBy;
            //    allDocParam.pageIndex=1;
            //});


        };
        setTable();

    }


    initPlatDocTable();


    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    window.reflashData=function(){
        initPlatDocTable();
    };

});