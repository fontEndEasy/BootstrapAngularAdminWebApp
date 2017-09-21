/**
 * Created by clf on 2015/11/17.
 */

app.controller('PatientADCtrl', function($scope, $timeout,utils,$http,modal,toaster,$location,$state,$rootScope) {
    //所有文档表格
    var articleTable;

    //搜索框
    $scope.mainKeyword=null;

    //所有文档获取数据的url和param
    var docUrl=app.url.science_ad.getDocumentList;
    var docParam={
        access_token:app.url.access_token,
        documentType:1,
        pageIndex:0,
        pageSize:10
    };

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
        $scope.mainKeyword=null;
        docUrl=app.url.science_ad.getDocumentList;
        docParam={
            access_token:app.url.access_token,
            documentType:1,
            pageIndex:0,
            pageSize:10
        };
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
        if($scope.mainKeyword==null||$scope.mainKeyword.length==0){
            //所有文档
            docParam={
                access_token:app.url.access_token,
                documentType:1,
                pageIndex:0,
                pageSize:10
            };
        }
        else{
            //搜索标题
            docParam={
                access_token:app.url.access_token,
                documentType:1,
                title:$scope.mainKeyword,
                pageIndex:0,
                pageSize:10
            };
        }
        initDocTable();
    };


    //将一篇文档显示
    var showArticle=function(articleId){
        $http.post(app.url.science_ad.setAdverShowStatus, {
            access_token:app.url.access_token,
            id:articleId,
            isShow:1
        }).
        success(function(data, status, headers, config) {
            if(data.resultCode==1){
                if(data.data.status==false){
                    toaster.pop('warn','',data.data.msg);
                }
                else{
                    toaster.pop('success','','显示成功');
                    docParam={
                        access_token:app.url.access_token,
                        documentType:1,
                        pageIndex:0,
                        pageSize:10
                    };
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

    //将一篇文档取消显示
    var quitArticle=function(articleId){
        $http.post(app.url.science_ad.setAdverShowStatus, {
            access_token:app.url.access_token,
            id:articleId,
            isShow:2
        }).
        success(function(data, status, headers, config) {
            if(data.resultCode==1){
                if(data.data.status==false){
                    toaster.pop('warn','',data.data.msg);

                }
                else{
                    toaster.pop('success','','取消置顶成功');
                    docParam={
                        access_token:app.url.access_token,
                        documentType:1,
                        pageIndex:0,
                        pageSize:10
                    };
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
        $state.go('app.edit_patient_ad',{id:aData.id},{'reload':true});
    };

    //将显示的文章上移
    var upperDoc=function(id){
        $http.post(app.url.science_ad.upOrDownWeight, {
            access_token:app.url.access_token,
            id:id,
            type:'+'
        }).
        success(function(data, status, headers, config) {
            if(data.resultCode==1){
                if(data.data.status==false){
                    toaster.pop('warn','',data.data.msg);
                }
                else{
                    docParam={
                        access_token:app.url.access_token,
                        documentType:1,
                        pageIndex:0,
                        pageSize:10
                    };
                    initDocTable();
                    toaster.pop('success','','上移成功');
                }
            }
        }).
        error(function(data, status, headers, config) {
            alert(data.resultMsg);
        });
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
                            if(dt.isShow==1){
                                return '<label id="upperDoc" class="operate">上移</label> | <label id="quitArticle" class="operate">取消显示</label> | <label id="editArticle" class="operate">编辑</label>';
                            }
                            else{
                                return '<label id="showArticle" class="operate">显示</label> | <label id="editArticle" class="operate">编辑</label>';
                            }
                        }
                    }
                ],
                "createdRow": function (nRow, aData, iDataIndex) {
                    $(nRow).on('click','#upperDoc', function (event) {
                        upperDoc(aData.id);
                        event.stopPropagation();
                    });
                    $(nRow).on('click','#showArticle', function (event) {
                        showArticle(aData.id);
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
                    $(nRow).on('click', function (event) {
                        var url = $state.href('patient_ad_article', {id: aData.id});
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

    window.reflashData=function(){
        docParam={
            access_token:app.url.access_token,
            documentType:1,
            pageIndex:0,
            pageSize:10
        };
        initDocTable();
    };
});