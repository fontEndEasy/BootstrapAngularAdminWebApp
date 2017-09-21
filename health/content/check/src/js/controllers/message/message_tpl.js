/**
 * Created by clf on 2015/12/26.
 */
app.controller('MsgTplCtrl', function($scope, $timeout,utils,$http,$modal,toaster,$location,$state) {
    //所有文档表格
    var articleTable;

    //所有文档获取数据的url和param
    var docUrl=app.url.msg.queryMsgTpl;
    var docParam={
        access_token:app.url.access_token,
        pageIndex:0,
        pageSize:10
    };


    //编辑文章
    var editArticle=function(aData){
        $state.go('app.edit_message_tpl',{id:aData.id},{'reload':true});
    };


    function delDoc(id){
        var modalInstance = $modal.open({
            templateUrl: 'delModalContent.html',
            controller: 'delModalInstanceCtrl',
            size: 'sm'
        });

        modalInstance.result.then(function (status) {
            if(status=='ok'){
                $http.post(app.url.msg.delTpl, {
                    access_token:app.url.access_token,
                    id:id
                }).
                success(function(data, status, headers, config) {
                    if(data.resultCode==1){
                        toaster.pop('success','','删除成功！');
                        docParam.pageIndex=0;
                        initDocTable();
                    }
                    else{
                        toaster.pop('error','',data.resultMsg);
                    }
                }).
                error(function(data, status, headers, config) {
                    alert(data.resultMsg);
                });
            }
        }, function () {

        });




    }


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
                    "render": function(set, status, dt) {
                        return dt.usage;
                    },
                    "defaultContent": ''
                }, {
                    "render": function (set, status, dt) {
                        return dt.content;
                    },
                    "defaultContent": ''
                }, {
                    "render": function (set, status, dt) {
                        return dt.category;
                    },
                    "defaultContent": ''
                },
                    {
                        "render": function (set, status, dt) {
                                return ' <label id="editArticle" class="operate">编辑</label>';
                        }
                    }
                ],
                "createdRow": function (nRow, aData, iDataIndex) {
                    $(nRow).on('click','#delDoc', function (event) {
                        delDoc(aData.id);
                        event.stopPropagation();
                    });
                    $(nRow).on('click','#editArticle', function (event) {
                        editArticle(aData);
                        event.stopPropagation();
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
});

app.controller('delModalInstanceCtrl', function ($scope, $modalInstance) {
    $scope.ok = function() {
        $modalInstance.close('ok');
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});