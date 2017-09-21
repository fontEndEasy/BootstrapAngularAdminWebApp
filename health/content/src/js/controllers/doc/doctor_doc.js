/**
 * Created by clf on 2015/10/22.
 */
'use strict'
app.controller('doctorDocCtrl', function($scope, $timeout,utils,$http,modal,toaster,$location,$state) {
    var docArticleTable;
    $scope.mainKeyword=null;

    //所有文档获取数据的url和param
    var docArticleUrl=app.url.document.getArticleByDoctor;
    var docArticleParam={
        access_token:app.url.access_token,
        pageIndex:1,
        pageSize:10
    };

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
        $scope.mainKeyword=null;
        docArticleUrl=app.url.document.getArticleByDoctor;
        docArticleParam={
            access_token:app.url.access_token,
            pageIndex:1,
            pageSize:10
        };
        initdocArticleTable();
    };

    //标题关键字搜索
    $scope.findDocByKeyWord=function(){
        docArticleUrl=app.url.document.findArticleByKeyWord;
        docArticleParam={
            access_token:app.url.access_token,
            title:$scope.mainKeyword,
            createType:3,
            pageIndex:1,
            pageSize:10
        };
        initdocArticleTable();
    };

    //按回车键搜索文档标题
    $scope.pressEnter=function($event){
        if($event.keyCode==13){
            $scope.findDocByKeyWord();
        }
    };

    //关键字搜索文档标题
    $scope.findDocByKeyWord=function(){
        if($scope.mainKeyword==null||$scope.mainKeyword.length==0){
            //所有文档获取数据的url和param
            docArticleUrl=app.url.document.getArticleByDoctor;
            docArticleParam={
                access_token:app.url.access_token,
                pageIndex:1,
                pageSize:10,
                createType:3
            };
        }
        else{
            //根据标题搜索
            docArticleUrl=app.url.document.findArticleByKeyWord;
            docArticleParam={
                access_token:app.url.access_token,
                title:$scope.mainKeyword,
                pageIndex:1,
                pageSize:10,
                createType:3
            };
        }
        initdocArticleTable();
    };


    //编辑文章
    var editArticle=function(id,collect){
        $state.go('app.doc.edit_article',{id:id},{'reload':true});
    };

    //取消收藏
    var removeCollect=function(id,nRow){
        $http.post(app.url.document.collectArticleRemove, {
            access_token:app.url.access_token,
            articleId:id,
            createType:3
        }).
        success(function(data, status, headers, config) {
            if(data.resultCode==1){
                nRow.remove();
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
    function initdocArticleTable() {
        var index = 1,
            length = 10,
            start = 0,
            idx = 0,
            size = 10,
            num = 0;


        var setTable = function () {
            docArticleTable = $('#collectDocTable').DataTable({
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
                "sAjaxSource": docArticleUrl,
                "fnServerData": function (sSource, aoData, fnCallback) {
                    $.ajax({
                        "type": "post",
                        "url": sSource,
                        "dataType": "json",
                        "data":docArticleParam,
                        "success": function (resp) {
                            console.log(resp);
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
                            if(dt.collect==2){
                                return '<label id="editArticle" class="operate">编辑</label> | <label id="copyUrl"  class="operate copyUrl" data-clipboard-text="'+dt.url+'">拷贝url</label>';
                            }
                            else if(dt.collect==1){
                                return '<label id="removeCollect" class="operate">取消收藏</label> | <label id="copyUrl"  class="operate copyUrl" data-clipboard-text="'+dt.url+'">拷贝url</label>';
                            }
                            else{
                                return '';
                            }

                        },
                        //"orderable": false
                    }
                ],
                "createdRow": function (nRow, aData, iDataIndex) {
                    $(nRow).on('click','#editArticle', function (event) {
                        editArticle(aData.id,aData.collect);
                        event.stopPropagation();
                    });
                    $(nRow).on('click','#removeCollect', function (event) {
                        removeCollect(aData.id,nRow);
                        event.stopPropagation();
                    });
                    $(nRow).on('click','', function (event) {
                        if(event.target.id=='copyUrl'){
                            return;
                        }
                        var url = $state.href('doc.article', {id: aData.id,createType:3});
                        window.open(url,'_blank');
                    });
                }
            });


            // 表格事件处理,init-初始化完成,length-改变每页长度,page-翻页,search-搜索
            docArticleTable.off('page.dt').on('page.dt', function (e, settings) {
                console.log('分页分页分页分页分页分页分页分页分页分页分页分页分页分页分页分页分');
                index = docArticleTable.page.info().page+1;
                start = length * (index - 1);
                docArticleParam.pageIndex=index;
            })
            .on('length.dt', function ( e, settings, len ) {
                //console.log( 'New page length: '+len );
                //index = articleTable.page.info().page+1;
                //start = length * (index - 1);
                length=len;
                index = 1;
                start = 0;
                docArticleParam.pageIndex=1;
                docArticleParam.pageSize=len;
            } );
            //    .off('order.dt').on('order.dt',function(e,settings){
            //    console.log(docArticleTable.order());
            //    console.log('排序排序排序排序排序排序排序排序排序排序排序');
            //    var orderType=docArticleTable.order()[0][1];
            //    var orderBy=docArticleTable.order()[0][0];
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
            //    docArticleParam.orderType=orderType;
            //    docArticleParam.orderBy=orderBy;
            //    docArticleParam.pageIndex=1;
            //});


        };
        setTable();
    }

    initdocArticleTable();

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
        initdocArticleTable();
    };

    $scope.$on('$destroy', function() {
        clipboard.destroy();
    });
});