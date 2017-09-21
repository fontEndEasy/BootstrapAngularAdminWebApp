/**
 * Created by clf on 2015/11/17.
 */

app.controller('HealthScienceCtrl', function($scope, $timeout,utils,$http,modal,toaster,$location,$state,$rootScope) {

    //所有文档和置顶文档表格
    var articleTable;
    var topDocTable;

    //当前选中的病种id
    var currentTreeId;

    //搜索框
    $scope.mainKeyword=null;

    //树的数据的加载情况
    $scope.isTreeLoad=false;

    //点击搜索前所在的branch
    var preBranch=undefined;

    $scope.topOrNormal='所有文档';

    $scope.my_tree = tree = {};

    //所有文档获取数据的url和param
    var docUrl=app.url.science_ad.getDocumentList;
    var docParam={
        access_token:app.url.access_token,
        documentType:2,
        pageIndex:0,
        pageSize:10
    };

    //文档树的数据
    $scope.my_data=[];

    //这里要获取病种树的数据
    var getTreeData=function(){
        $http.post(app.url.science_ad.getContentType, {
            access_token:app.url.access_token,
            documentType:2
        }).
            success(function(data, status, headers, config) {
                if(data.resultCode==1){

                    var source={
                        id:null,
                        label:'全部文档('+data.data.count+')'
                    };

                    source.children=[];
                    data.data.list.forEach(function(item,index,array){
                        source.children.push({
                            label:item.name+'('+item.count+')',
                            id:item.code
                        });
                    });
                    var eArray=[];
                    eArray[0]=source;
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
        $scope.isTop=false;
        docParam={
            access_token:app.url.access_token,
            documentType:2,
            pageIndex:0,
            pageSize:10,
            contentType:branch.id
        };
        initDocTable();
    };

    //点击新建文章
    $scope.createArticle=function(){
        $state.go('app.create_health_science',null,{reload:true});
    };


    //是否是置顶文档
    $scope.isTop=false;
    $scope.topOrNormal=$scope.isTop?'所有文档':'置顶文档（最多5篇）';
    $scope.$watch('isTop',function(newValue,oldValue){
        if(newValue!=oldValue){
            $scope.topOrNormal=$scope.isTop?'所有文档':'置顶文档（最多5篇）';
        }
    });

    //watch搜索框，计算输入字符串的长度
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


    //清除搜索关键字
    $scope.clearMainKW=function(){
        if(preBranch==null){
            docParam={
                access_token:app.url.access_token,
                documentType:2,
                pageIndex:0,
                pageSize:10
            };
            initDocTable();
        }
        else{
            $scope.my_tree.select_branch(preBranch);
        }
        $scope.mainKeyword=null;
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
        $scope.isTop=false;
        $scope.my_tree.select_branch();
        if($scope.mainKeyword==null||$scope.mainKeyword.length==0){
            //所有文档
            docParam={
                access_token:app.url.access_token,
                documentType:2,
                pageIndex:0,
                pageSize:10
            };
        }
        else{
            //搜索标题
            docParam={
                access_token:app.url.access_token,
                documentType:2,
                title:$scope.mainKeyword,
                pageIndex:0,
                pageSize:10
            };
        }
        initDocTable();
    };

    //编辑文章
    var editArticle=function(aData){
        $state.go('app.edit_health_science',{id:aData.id},{'reload':true});
    };

    //初始化置顶文档
    function getTopDocData(){
        $http.post(app.url.science_ad.getTopScienceList, {
            access_token:app.url.access_token
        }).
            success(function(data, status, headers, config) {
                if(data.resultCode==1){
                    $scope.topDocData=data.data.list;
                    initTopDocTable();
                }
                else{
                    alert(data.resultMsg);
                }
            }).
            error(function(data, status, headers, config) {
                alert(data.resultMsg);
            });
    }

    //显示置顶文档
    $scope.showTopDoc=function(){
        $scope.isTop=!$scope.isTop;

        if($scope.isTop==true){
            getTopDocData();
        }
        else{
            //所有文档获取数据的url和param
            docUrl=app.url.science_ad.getDocumentList;
            docParam={
                access_token:app.url.access_token,
                documentType:2,
                pageIndex:0,
                pageSize:10
            };
            initDocTable();
        }
    };

    //将一篇文档置顶，默认是置顶到最后，超出5个提醒
    var pullArticle=function(articleId){
        $http.post(app.url.science_ad.setTopScience, {
            access_token:app.url.access_token,
            id:articleId,
            isTop:1
        }).
        success(function(data, status, headers, config) {
            if(data.resultCode==1){
                if(data.data.status==false){
                    toaster.pop('warn','',data.data.msg);
                }
                else{
                    toaster.pop('success','','置顶成功');
                    docParam.pageIndex=0;
                    initDocTable();
                }
            }
            else{
                toaster.pop('error','',data.resultMsg);
            }
        }).
        error(function(data, status, headers, config) {
            toaster.pop('warn','',data.resultMsg);
        });
    };

    //将一篇文档取消置顶
    var quitArticle=function(articleId){
        $http.post(app.url.science_ad.setTopScience, {
            access_token:app.url.access_token,
            id:articleId,
            isTop:2
        }).
        success(function(data, status, headers, config) {
            if(data.resultCode==1){
                if(data.data.status==false){
                    toaster.pop('warn','',data.data.msg);
                }
                else{
                    toaster.pop('success','','取消置顶成功');
                    docParam.pageIndex=0;
                    initDocTable();
                }
            }
            else{
                toaster.pop('error','',data.resultMsg);
            }
        }).
        error(function(data, status, headers, config) {
            toaster.pop('warn','',data.resultMsg);
        });
    };

    //移除置顶
    var removeTop=function(articleId){
        $http.post(app.url.science_ad.setTopScience, {
            access_token:app.url.access_token,
            id:articleId,
            isTop:2
        }).
        success(function(data, status, headers, config) {
            if(data.resultCode==1){
                if(data.data.status==false){
                    toaster.pop('warn','',data.data.msg);
                }
                else{
                    toaster.pop('success','','移除成功');
                    getTopDocData();
                }
            }
        }).
        error(function(data, status, headers, config) {
            alert(data.resultMsg);
        });
    };



    //将置顶文章上移
    var upperDoc=function(iDataIndex,id){
        console.log(iDataIndex);
        if(iDataIndex==0){
            $scope.$apply(toaster.pop('error','','第一行不能置顶'));
        }
        else{
            console.log(id);
            $http.post(app.url.science_ad.upOrDownWeight, {
                access_token:app.url.access_token,
                id:id,
                type:'+'
            }).
            success(function(data, status, headers, config) {
                if(data.resultCode==1){
                    if(data.data.status==false){
                        toaster.pop('error','',data.data.msg);
                    }
                    else{
                        toaster.pop('success','','上移成功');
                        getTopDocData();
                    }
                }
                else{
                    toaster.pop('error','',data.resultMsg);
                }
            }).
            error(function(data, status, headers, config) {
                alert(data.resultMsg);
            });
        }

    };


    // 初始化所有文档表格
    function initDocTable() {
        var index = 0,
            length = 10,
            start = 0,
            size = 10;


        var setAllTable = function () {
            articleTable = $('#article_list').DataTable({
                "language": app.lang.datatables.translation,
                "searching": false,
                "destroy": true,
                "lengthChange": true,
                "ordering": false,
                "draw": 1,
                "pageLength": length,
                "lengthMenu": [5,10,20,50],
                "autoWidth" : false,
                "displayStart": start,
                "bServerSide": true,
                "sAjaxSource": docUrl,
                "fnServerData": function (sSource, aoData, fnCallback) {
                    $.ajax({
                        "type": "post",
                        "url": sSource,
                        "dataType": "json",
                        "data":docParam,
                        "success": function (resp) {
                            if(resp.resultCode==1){
                                var data = {};
                                data.recordsTotal = resp.data.total;
                                data.recordsFiltered = resp.data.total;
                                data.length = resp.data.pageSize;
                                data.data = resp.data.pageData;
                                $scope.curPageDate=resp.data.pageData;
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
                    "render": function (set, status, dt) {
                        var photoPath='src/img/nophoto.jpg';
                        if(dt.copyPath&&dt.copyPath!=""){
                            photoPath=dt.copyPath;
                        }
                        return'<img src='+photoPath+' alt="..." style="width:60px;height:60px;margin-right:10px;float:left;border-radius:0;">'+
                            '<span style="line-height: 60px;">'+dt.title+'</span>';
                    }
                }, {
                    "data": "visitCount",
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
                            if(dt.isTop==1){
                                return '<label id="quitArticle" class="operate">取消置顶</label> | <label id="editArticle" class="operate">编辑</label>';
                            }
                            else{
                                return '<label id="pullArticle" class="operate">置顶</label> | <label id="editArticle" class="operate">编辑</label>';
                            }
                        }
                    }
                ],
                "createdRow": function (nRow, aData, iDataIndex) {
                    $(nRow).on('click','#pullArticle', function (event) {
                        pullArticle(aData.id);
                        event.stopPropagation();
                    });
                    $(nRow).on('click','#quitArticle', function (event) {
                        quitArticle(aData.id);
                        event.stopPropagation();
                    });
                    $(nRow).on('click','#editArticle', function (event) {
                        editArticle(aData);
                        event.stopPropagation();
                    });
                    $(nRow).on('click','', function (event) {
                        var url = $state.href('health_science_article', {id: aData.id});
                        window.open(url,'_blank');
                    });
                }
            });

            // 表格事件处理,init-初始化完成,length-改变每页长度,page-翻页,search-搜索
            articleTable.off('page.dt').on('page.dt', function (e, settings) {
                index = articleTable.page.info().page;
                start = length * index;
                docParam.pageIndex=index;
            })
            .on('length.dt', function ( e, settings, len ) {
                length=len;
                index = 0;
                start = 0;
                docParam.pageIndex=0;
                docParam.pageSize=len;
            } );
        };
        setAllTable();
    }

    initDocTable();

    // 初始化置顶文档表格
    function initTopDocTable() {
        console.log('置顶文档表格');
        var setTopTable = function () {
            topDocTable = $('#topDocTable').DataTable({
                "language": app.lang.datatables.translation,
                "ordering": false,
                paging: false,
                "destroy": true,
                "searching": false,
                "bLengthChange":false,
                "data":$scope.topDocData,
                "columns": [{
                    "render": function (set, status, dt) {
                        var photoPath='src/img/nophoto.jpg';
                        if(dt.copyPath&&dt.copyPath!=""){
                            photoPath=dt.copyPath;
                        }
                        return'<img src='+photoPath+' alt="..." style="width:60px;height:60px;margin-right:10px;float:left;border-radius:0;">'+
                            '<span style="line-height: 60px;">'+dt.title+'</span>';
                    }
                }, {
                    "data": "visitCount",
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
                            if(dt.isTop&&dt.isTop==1){
                                return '<label id="upperDoc" class="operate">上移</label> | <label id="removeTop" class="operate">移除</label>';
                            }
                            else{
                                return '';
                            }
                        }
                    }
                ],
                "createdRow": function (nRow, aData, iDataIndex) {
                    $(nRow).on('click','#upperDoc', function (event) {
                        upperDoc(iDataIndex,aData.id);
                        event.stopPropagation();
                    });
                    $(nRow).on('click','#removeTop', function (event) {
                        removeTop(aData.id);
                        event.stopPropagation();
                    });
                    $(nRow).on('click','',function () {
                        //if(event.target.id=='copyUrl'){
                        //    return;
                        //}
                        window.open(aData.url);
                        event.stopPropagation();
                    });
                }
            });
        };
        setTopTable();
    }

    window.reflashData=function(){
        //docParam={
        //    access_token:app.url.access_token,
        //    documentType:2,
        //    pageIndex:1,
        //    pageSize:10
        //};
        initDocTable();
        //$scope.isTreeLoad=false;
        //getTreeData();
    };

});