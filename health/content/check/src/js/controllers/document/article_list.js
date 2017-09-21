app.controller('ArticleCtrl', function($scope, $timeout,utils,$http,modal,toaster,$location,$state,$rootScope) {

    //所有文档和置顶文档表格
    var articleTable;
    var topDocTable;
    //当前选中的病种id
    var currentTreeId;
    //病种标签列表
    $scope.keywords=[];

    //“更多”按钮
    $scope.showMore=false;

    //筛选模块
    $scope.isCollapsed = false;
    $scope.open=false;

    $scope.mainKeyword=null;

    $scope.topOrNormal='所有文档';

    //树的数据的加载情况
    $scope.isTreeLoad=false;

    //点击搜索前所在的branch
    var preBranch=undefined;

    $scope.my_tree = tree = {};

    //所有文档获取数据的url和param
    var allDocUrl=app.url.document.getArticleByDisease;
    var allDocParam={
        access_token:app.url.access_token,
        createType:1,
        pageIndex:1,
        pageSize:10
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
            createType:1
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
        $scope.isTop=false;

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
            createType:1,
            pageIndex:1,
            pageSize:10,
            diseaseId:branch.id
        };
        initDocTable();
    };

    //点击新建文章
    $scope.createArticle=function(){
        $state.go('app.create_article',null,{reload:true});
    };

    //是否是置顶文档
    $scope.isTop=false;
    $scope.topOrNormal=$scope.isTop?'所有文档':'置顶文档（最多5篇）';
    $scope.$watch('isTop',function(newValue,oldValue){
        if(newValue!=oldValue){
            $scope.topOrNormal=$scope.isTop?'所有文档':'置顶文档（最多5篇）';
        }
    });

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
        if(preBranch==null){
            allDocUrl=app.url.document.getArticleByDisease;
            allDocParam={
                access_token:app.url.access_token,
                createType:1,
                pageIndex:1,
                pageSize:10
            };
            initDocTable();
        }
        else{
            $scope.my_tree.select_branch(preBranch);
        }
        $scope.mainKeyword=null;

        //$scope.my_tree.select_branch(preBranch);
        //$scope.mainKeyword=null;
        ////所有文档获取数据的url和param
        //allDocUrl=app.url.document.getArticleByDisease;
        //allDocParam={
        //    access_token:app.url.access_token,
        //    createType:1,
        //    pageIndex:1,
        //    pageSize:10
        //};
        //initDocTable();
    };

    //点击病种标签
    $scope.sortByKeyword=function(keyword){
        if(keyword.name=='不限'){
            allDocUrl=app.url.document.getArticleByDisease;
            allDocParam={
                access_token:app.url.access_token,
                createType:1,
                pageIndex:1,
                pageSize:10,
                diseaseId:currentTreeId
            };
        }
        else{
            allDocUrl=app.url.document.findArticleByTag;
            allDocParam={
                access_token:app.url.access_token,
                createType:1,
                pageIndex:1,
                pageSize:10,
                tags:keyword.id
            };
        }

        initDocTable();
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
        $scope.isTop=false;
        $scope.keywords=[];
        if($scope.mainKeyword==null||$scope.mainKeyword.length==0){
            //所有文档
            allDocUrl=app.url.document.getArticleByDisease;
            allDocParam={
                access_token:app.url.access_token,
                createType:1,
                pageIndex:1,
                pageSize:10
            };
        }
        else{
            //搜索标题
            allDocUrl=app.url.document.findArticleByKeyWord;
            allDocParam={
                title:$scope.mainKeyword,
                access_token:app.url.access_token,
                createType:1,
                pageIndex:1,
                pageSize:10
            };
        }
        initDocTable();
    };

    //显示置顶文档
    $scope.showTopDoc=function(){
        $scope.isTop=!$scope.isTop;

        if($scope.isTop==true){
            $http.post(app.url.document.findTopArticle, {
                access_token:app.url.access_token
            }).
                success(function(data, status, headers, config) {
                    if(data.resultCode==1){
                        $scope.topDocData=data.data;
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
        else{
            //所有文档获取数据的url和param
            allDocUrl=app.url.document.getArticleByDisease;
            allDocParam={
                access_token:app.url.access_token,
                createType:1,
                pageIndex:1,
                pageSize:10
            };
            initDocTable();
        }
    };




    //将一篇文档置顶，默认是置顶到最后，超出5个提醒，默认只有存在封面的才可以置顶
    var pullArticle=function(articleId){
        $http.post(app.url.document.topArticle, {
            access_token:app.url.access_token,
            articleId:articleId
        }).
            success(function(data, status, headers, config) {
                if(data.resultCode==1){
                    if(data.data.status==false){
                        toaster.pop('warn','',data.data.msg);
                    }
                    else{
                        toaster.pop('success','','置顶成功');
                        allDocParam.pageIndex=1;
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
        $http.post(app.url.document.topArticleRemove, {
            access_token:app.url.access_token,
            articleId:articleId
        }).
            success(function(data, status, headers, config) {
                if(data.resultCode==1){
                    if(data.data.status==false){
                        toaster.pop('warn','',data.data.msg);

                    }
                    else{
                        toaster.pop('success','','取消置顶成功');
                        allDocParam.pageIndex=1;
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


    //编辑文章
    var editArticle=function(aData){
        $state.go('app.edit_article',{id:aData.id},{'reload':true});
    };

    //将置顶文章上移
    var upperDoc=function(iDataIndex){
        console.log(iDataIndex);
        if(iDataIndex==0){
            $scope.$apply(toaster.pop('error','','第一行不能置顶'));
        }
        else{
            var upArticleId=topDocTable.row(iDataIndex).data().id;
            var downArticleId=topDocTable.row(iDataIndex-1).data().id;

            $http.post(app.url.document.topArticleUp, {
                access_token:app.url.access_token,
                upId:upArticleId,
                downId:downArticleId
            }).
                success(function(data, status, headers, config) {
                    if(data.resultCode==1){
                        var i=$scope.topDocData[iDataIndex-1];
                        $scope.topDocData[iDataIndex-1]=$scope.topDocData[iDataIndex];
                        $scope.topDocData[iDataIndex]=i;
                        topDocTable.clear();
                        topDocTable.rows.add($scope.topDocData).draw();
                        toaster.pop('success','','上移成功');
                    }
                }).
                error(function(data, status, headers, config) {
                    alert(data.resultMsg);
                });
        }

    };

    //移除置顶
    var removeTop=function(nRow,articleId){
        $http.post(app.url.document.topArticleRemove, {
            access_token:app.url.access_token,
            articleId:articleId
        }).
            success(function(data, status, headers, config) {
                if(data.resultCode==1){
                    nRow.remove();
                    toaster.pop('success','','移除成功');
                }
            }).
            error(function(data, status, headers, config) {
                alert(data.resultMsg);
            });
    };

    // 初始化所有文档表格
    function initDocTable() {
        var index = 1,
            length = 10,
            start = 0,
            idx = 0,
            size = 10,
            num = 0;

        console.log('所有文档表格');

        var setAllTable = function () {
            articleTable = $('#article_list').DataTable({
                "language": app.lang.datatables.translation,
                "searching": false,
                "sScrollX": "100%",
                "sScrollXInner": "110%",
                "destroy": true,
                "lengthChange": true,
                "ordering": false,
                "draw": 1,
                "pageLength": length,
                "lengthMenu": [5,10,20,50],
                "autoWidth" : false,
                "displayStart": start,
                "bServerSide": true,
                "sAjaxSource": allDocUrl,
                "fnServerData": function (sSource, aoData, fnCallback) {
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
                            '<span style="display: block;overflow: hidden;">'+
                            '<span>'+dt.title+'</span>'+
                            '<small class="text-muted clear text-ellipsis">'+keywordsStr.substring(0,30)+
                            '</small>'+
                            '<small class="text-muted clear text-ellipsis">作者：'+authorName+groupNameStr+doctorTitle+doctorHos+
                            '</small>'+
                            '</span>';
                    }
                }, {
                    "data": "useNum",
                    "orderable": false,
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
                            if(dt.top==true){
                                return '<label id="quitArticle" class="operate">取消置顶</label> | <label id="editArticle" class="operate">编辑</label> | <label id="copyUrl"  class="operate copyUrl" data-clipboard-text="'+dt.url+'">拷贝url</label>';
                            }
                            else{
                                return '<label id="pullArticle" class="operate">置顶</label> | <label id="editArticle" class="operate">编辑</label> | <label id="copyUrl" class="operate copyUrl" data-clipboard-text="'+dt.url+'">拷贝url</label>';
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
                        if(event.target.id=='copyUrl'){
                            return;
                        }
                        var url = $state.href('article', {id: aData.id});
                        window.open(url,'_blank');
                    });
                }
            });

            // 表格事件处理,init-初始化完成,length-改变每页长度,page-翻页,search-搜索
            articleTable.off('page.dt').on('page.dt', function (e, settings) {
                console.log('分页分页分页');
                index = articleTable.page.info().page+1;
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
            //    console.log(e);
            //    console.log('排序排序排序排序排序排序排序排序排序排序排序排序排序排序排序排序排序排序排序排序排序排序排序排序排序排序排序排序排序排序排序');
            //    var orderType=articleTable.order()[0][1];
            //    var orderBy=articleTable.order()[0][0];
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

                        var groupNameStr=dt.groupName?'@'+dt.groupName:'';
                        var doctorTitle=dt.doctor?dt.doctor.title:'';
                        var doctorHos=dt.doctor&&dt.doctor.hospital?'|'+dt.doctor.hospital:'';
                        var authorName=dt.authorName?dt.authorName:dt.author;
                        var photoPath='src/img/nophoto.jpg';
                        if(dt.copy_small&&dt.copy_small!=""){
                            photoPath=dt.copy_small;
                        }


                        return'<img src='+photoPath+' alt="..." style="width:60px;height:60px;margin-right:10px;float:left;border-radius:0;">'+
                            '<span style="display: block;overflow: hidden;">'+
                            '<span>'+dt.title+'</span>'+
                            '<small class="text-muted clear text-ellipsis">'+keywordsStr.substring(0,30)+
                            '</small>'+
                            '<small class="text-muted clear text-ellipsis">作者：'+authorName+groupNameStr+' '+doctorTitle+doctorHos+
                            '</small>'+
                            '</span>';
                    }
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
                            return '<label id="upperDoc" class="operate">上移</label> | <label id="removeTop" class="operate">移除</label>  | <label id="copyUrl"  class="operate copyUrl" data-clipboard-text="'+dt.url+'">拷贝url</label>';
                        }
                    }
                ],
                "createdRow": function (nRow, aData, iDataIndex) {
                    $(nRow).on('click','#upperDoc', function (event) {
                        upperDoc(iDataIndex);
                        event.stopPropagation();
                    });
                    $(nRow).on('click','#removeTop', function (event) {
                        removeTop(nRow,aData.id);
                        event.stopPropagation();
                    });
                    $(nRow).on('click', function () {
                        if(event.target.id=='copyUrl'){
                            return;
                        }
                        window.open(aData.url);
                        event.stopPropagation();
                    });
                }
            });
        };
        setTopTable();
    }

    var clipboard = new Clipboard('.copyUrl');

    clipboard.on('success', function(e) {
        $scope.$apply(toaster.pop('success','','复制成功'));
        e.clearSelection();
    });

    clipboard.on('error', function(e) {
        $scope.$apply(toaster.pop('error','','复制失败'));
        e.clearSelection();
    });

    window.reflashData=function(){
        initDocTable();
        initTopDocTable();
    };

    $scope.$on('$destroy', function() {
        clipboard.destroy();
    });
});