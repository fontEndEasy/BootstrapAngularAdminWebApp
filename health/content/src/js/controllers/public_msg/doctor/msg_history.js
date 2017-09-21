/**
 * Created by clf on 2015/11/24.
 */
app.controller('MsgHistoryCtrl', function($scope, $timeout,utils,$http,$modal,toaster,$location,$state,$stateParams) {
    var docArticleTable;

    var params={
        access_token:app.url.access_token,
        pid:$stateParams.id,
        pageIndex:1,
        pageSize:10
    };

    var delMsgHistory=function(msgId){
        var modalInstance = $modal.open({
            templateUrl: 'delModalContent.html',
            controller: 'delModalInstanceCtrl',
            size: 'sm'
        });

        modalInstance.result.then(function (status) {
            if(status=='ok'){
                $http.post(app.url.pubMsg.delMsgHistory, {
                    access_token:app.url.access_token,
                    id:msgId
                }).
                success(function(data, status, headers, config) {
                    if(data.resultCode==1){
                        params.pageIndex=1;
                        params.pageSize=10;
                        initMsgHistory();
                    }
                    else{
                        alert(data.resultMsg);
                    }
                }).
                error(function(data, status, headers, config) {
                    alert(data.resultMsg);
                });
            }
        }, function () {

        });
    };

    initMsgHistory();

    function initMsgHistory() {
        var index = 1,
            length = 10,
            start = 0,
            size = 10;

        var setTable = function () {
            docArticleTable = $('#msg_history').DataTable({
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
                "sAjaxSource": app.url.pubMsg.getMsgPageList,
                "fnServerData": function (sSource, aoData, fnCallback) {
                    $.ajax({
                        "type": "post",
                        "url": sSource,
                        "dataType": "json",
                        "data":params,
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
                    "render": function (set, status, dt) {
                        if(dt.sendTime){
                            return utils.dateFormat(dt.sendTime,'yyyy-MM-dd hh:mm');
                        }
                        else{
                            console.log('少了参数sendTime');
                            return '';
                        }
                    }
                },{
                    "render": function (set, status, dt) {
                        if(dt.mpt){
                            return '<span class="text-left"><p class="m-b-sm text-md">'+dt.mpt[0].title+
                                '</p>'+
                                '<p class="text-muted">'+dt.mpt[0].digest+
                                '</p>'+
                                '</span>';
                        }
                        else{
                            console.log('少了参数mpt');
                            return '';
                        }

                    }
                },{
                    "render": function (set, status, dt) {
                        return '<button class="btn btn-danger btn-xs" id="delMsgHistory">删除</button>';
                    }
                }
                ],
                "createdRow": function (nRow, aData, iDataIndex) {
                    $(nRow).on('click','#delMsgHistory', function (event) {
                        delMsgHistory(aData.id);
                        event.stopPropagation();
                    });
                }
            });


            // 表格事件处理,init-初始化完成,length-改变每页长度,page-翻页,search-搜索
            docArticleTable.off('page.dt').on('page.dt', function (e, settings) {
                console.log('分页分页分页');
                index = docArticleTable.page.info().page+1;
                start = length * (index - 1);
                params.pageIndex=index;
            })
            .on('length.dt', function ( e, settings, len ) {
                length=len;
                index = 1;
                start = 0;
                params.pageIndex=1;
                params.pageSize=len;
            } );
        };
        setTable();
    }

    //var getMsgHistory=function(){
    //    $http.post(app.url.pubMsg.getMsgHistory, getHisParam).
    //        success(function(data, status, headers, config) {
    //            if(data.resultCode==1){
    //                initMsgHistory(data.data);
    //            }
    //            else{
    //                alert(data.resultMsg);
    //            }
    //        }).
    //        error(function(data, status, headers, config) {
    //            alert(data.resultMsg);
    //        });
    //};

    //getMsgHistory();

});

app.controller('delModalInstanceCtrl', function ($scope, $modalInstance,toaster,$http,utils) {
    $scope.ok = function() {
        $modalInstance.close('ok');
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});