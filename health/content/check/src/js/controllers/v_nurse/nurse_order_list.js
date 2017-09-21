'use strict';

app.controller('NListGroup', function ($rootScope, $scope, $state, $timeout, $http, utils, $stateParams, modal) {
    var url = app.url.admin.check.getGroupCerts, // 后台API路径
        data = null,
        html = $('html'),
        body = $('body');


    var param = {};

    $rootScope.isChecking = false;
    utils.localData('isChecking', null);
    $("#vgroupList0,#vgroupList1,#vgroupList2,#vgroupList3").hide();
    if($stateParams.type === 'notexception'){
        param.status = 'NP';
        $scope.check_status = '未接订单-异常';
        $("#vgroupList0").show();
        doctorList = $('#vgroupList0');
    }else if($stateParams.type === 'notall'){
        param.status = 'NP';
        $scope.check_status = '未接订单-全部';
        $("#vgroupList0").show();
        doctorList = $('#vgroupList0');
    }else if($stateParams.type === 'ingexception'){
        param.status = 'P';
        $scope.check_status = '进行中订单-异常';
         $("#vgroupList1").show();
         doctorList = $('#vgroupList1');
    }else if($stateParams.type === 'ingall'){
        param.status = 'P';
        $scope.check_status = '进行中订单-全部';
        $("#vgroupList1").show();
        doctorList = $('#vgroupList1');
    }else if($stateParams.type === 'pass'){
        param.status = 'P';
        $scope.check_status = '已完成订单';
        $("#vgroupList2").show();
        doctorList = $('#vgroupList2');
    }else{
        param.status = 'NP';
        $scope.check_status = '已取消订单';
        $("#vgroupList3").show();
        doctorList = $('#vgroupList3');
    }

    console.log("v_url:"+url+'  status:'+$scope.check_status);

    if ($rootScope.pageName !== 'list_undone') {
        utils.localData('page_index', null);
        utils.localData('page_start', null);
        $rootScope.pageName = 'list_undone';
        $rootScope.scrollTop = 0;
    }

    // 编辑某一审核信息
    $scope.seeDetails = function (router,id) {
        if (id) {
            $state.go(router,{id:id},{});
        }
    };

    ////////////////////////////////////////////////////////////

    // 初始化表格
    var doctorList, dTable,callself,inboxself;

    function initTable() {
        var name,
            _index,
            _start,
            isSearch = false,
            searchTimes = 0,
            index = utils.localData('page_index') * 1 || 1,
            start = utils.localData('page_start') * 1 || 0,
            length = utils.localData('page_length') * 1 || 50;

        var setTable = function (){
            var dataColumns = [];
            param.access_token = app.url.access_token;
            if($stateParams.type === 'notexception' || $stateParams.type === 'notall'){
                dataColumns = [
                    {
                        "data": "orderid",
                        "searchable":true,
                        "orderable":false,
                        "render": function (set, status, dt) {
                            var str = '';
                            /*if (dt.adminTel) {
                                str += '<a data-id="'+dt.id+'" class="group-info text-info">' + dt.adminTel + '</a>';
                            }*/
                            str += '<a data-id="'+dt.id+'" class="group-info text-info">20151208143256</a>';
                            return str;
                        }
                    },
                    {
                        "data": "ordertype",
                        "orderable": true,
                        "render": function (set, status, dt) {
                            var str = '加号+检查';
                            /*if (dt.name) {
                                str += '<span class="text-primary">' + dt.groupCert.name + '</span>';
                            }*/
                            return str;
                        }
                    }, 
                    {
                        "data": "username",
                        "orderable": false,
                        "render": function (set, status, dt) {
                            var str = '李小病';
                            /*if (dt.groupCert && dt.groupCert.adminTel) {
                                str += '<span class="text-primary">' + dt.groupCert.name + '</span>';
                            }*/
                            return str;
                        }
                    }, 
                    {
                        "data": "playtime",
                        "orderable": true,
                        "render": function (set, status, dt) {
                            if (dt.groupCert && dt.groupCert.createTime.length !== 0 && dt.groupCert.createTime) {
                                return utils.dateFormat(dt.groupCert.createTime, 'yyyy-MM-dd hh:ss:mm');
                            }else{
                                return '';
                            }
                        }
                    }, 
                    {
                        "data": "exception",
                        "orderable": true,
                        "render": function (set, status, dt) {
                            var str = '超时，需联系';
                            /*if (dt.groupCert && dt.groupCert.adminTel) {
                                str += '<span class="text-primary">' + dt.groupCert.name + '</span>';
                            }*/
                            return str;
                        }
                    }, 
                    {
                        "data": "oporation",
                        "orderable": false,
                        "render": function (set, status, dt) {
                            var str = '<p><button data-id="'+dt.id+'" data-nursename="'+dt.name+'" class="btn m-b-xs btn-sm btn-success call">'+
                                        '<i class="fa fa-phone" style="padding-right:10px;"></i>电话</button>'+
                                        '<button data-id="'+dt.id+'" data-nursename="'+dt.name+'" style="margin-left:10px;" class="btn m-b-xs btn-sm btn-info inbox">'+
                                        '<i class="fa glyphicon-envelope" style="padding-right:10px;"></i>短信</button></p>';
                            return str;
                        }
                    }, 
                    {
                        "data": "remarks",
                        "orderable": false,
                        "render": function (set, status, dt) {
                            if (dt.groupCert && dt.groupCert.remarks !="") {
                                return '<p><button data-id="'+dt.id+'" data-nursename="李护士" class="btn m-b-xs btn-sm btn-success remark"><i class="fa fa-plus" style="padding-right:10px;"></i>备注</button><button style="margin-left:10px;" class="btn m-b-xs btn-sm btn-info remarklook" data-id="'+dt.id+'" data-name="'+dt.name+'"><i class="fa fa-play" style="padding-right:10px;"></i>查看</button></p>';
                            }else{
                                return '<p><button data-id="'+dt.id+'" data-nursename="李护士" class="btn m-b-xs btn-sm btn-success remark"><i class="fa fa-plus" style="padding-right:10px;"></i>备注</button></p>';
                            }
                        }
                    }
                ];
            }else if($stateParams.type === 'ingexception' || $stateParams.type === 'ingall'){
                dataColumns = [
                    {
                        "data": "orderid",
                        "searchable":true,
                        "orderable":false,
                        "render": function (set, status, dt) {
                            var str = '';
                            /*if (dt.name) {
                                str += '<a data-id="'+dt.id+'" class="group-info text-info">' + dt.name + '</a>';
                            }*/
                            str += '<a data-id="'+dt.id+'" class="group-info text-info">20151208162531</a>';
                            return str;
                        }
                    }, 
                    {
                        "data": "ordertype",
                        "orderable": true,
                        "render": function (set, status, dt) {
                            var str = '加号+检查';
                            return str;
                        }
                    }, 
                    {
                        "data": "nursename",
                        "orderable": false,
                        "render": function (set, status, dt) {
                            var str = '李护士';
                            /*if (dt.groupCert && dt.groupCert.adminTel) {
                                str += '<span class="text-primary">' + dt.groupCert.adminTel + '</span>';
                            }*/
                            return str;
                        }
                    }, 
                    {
                        "data": "username",
                        "orderable": false,
                        "render": function (set, status, dt) {
                            var str = '张三';
                            /*if (dt.groupCert && dt.groupCert.adminTel) {
                                str += '<span class="text-primary">' + dt.groupCert.adminTel + '</span>';
                            }*/
                            return str;
                        }
                    }, 
                    {
                        "data": "inordertime",
                        "orderable": true,
                        "searchable": false,
                        "render": function (set, status, dt) {
                            if (dt.groupCert && dt.groupCert.createTime.length !== 0 && dt.groupCert.createTime) {
                                return utils.dateFormat(dt.groupCert.createTime, 'yyyy-MM-dd hh:ss:mm');
                            }else{
                                return '';
                            }
                        }
                    }, 
                    {
                        "data": "yyordertime",
                        "orderable": true,
                        "searchable": false,
                        "render": function (set, status, dt) {
                            if (dt.groupCert && dt.groupCert.createTime.length !== 0 && dt.groupCert.createTime) {
                                return utils.dateFormat(dt.groupCert.createTime, 'yyyy-MM-dd hh:ss:mm');
                            }else{
                                return '';
                            }
                        }
                    }, 
                    {
                        "data": "inordertime",
                        "orderable": true,
                        "searchable": false,
                        "render": function (set, status, dt) {
                            var str = '致电客户';
                            /*if (dt.groupCert && dt.groupCert.adminTel) {
                                str += '<span class="text-primary">' + dt.groupCert.adminTel + '</span>';
                            }*/
                            return str;
                        }
                    }, 
                    {
                        "data": "exception",
                        "orderable": true,
                        "searchable": false,
                        "render": function (set, status, dt) {
                            var str = '未致电，需联系';
                            /*if (dt.groupCert && dt.groupCert.adminTel) {
                                str += '<span class="text-primary">' + dt.groupCert.adminTel + '</span>';
                            }*/
                            return str;
                        }
                    }, 
                    {
                        "data": "oporation",
                        "orderable": false,
                        "searchable": false,
                        "render": function (set, status, dt) {
                            var str = '<span class="tabelbtns">'+
                                         '<button data-id="'+dt.id+'" data-nursename="李护士" data-username="张三" class="btn m-b-xs btn-sm btn-success call">'+
                                         '<i class="fa fa-phone" style="padding-right:10px;"></i>电话<i class="fa arrowcall fa-angle-double-down" style="padding-left:10px;"></i></button>'+
                                         '<button data-id="'+dt.id+'" data-nursename="李护士" data-username="张三" style="margin-left:10px;" class="btn m-b-xs btn-sm btn-info inbox">'+
                                         '<i class="fa glyphicon-envelope" style="padding-right:10px;"></i>短信<i class="arrowinbox fa fa-angle-double-down" style="padding-left:10px;"></i></button><a class="calldown"><span>致电护士</span><span class="last">致电患者</span></a><a class="inboxdown"><span>短信护士</span><span class="last">短信患者</span></span></a>';
                            return str;
                        }
                    }, 
                    {
                        "data": "remarks",
                        "orderable": false,
                        "searchable": false,
                        "render": function (set, status, dt) {
                            if (dt.groupCert && dt.groupCert.remarks !="") {
                                return '<p><button data-id="'+dt.id+'" data-nursename="'+dt.name+'" class="btn m-b-xs btn-sm btn-success remark"><i class="fa fa-plus" style="padding-right:10px;"></i>备注</button><button style="margin-left:10px;" class="btn m-b-xs btn-sm btn-info remarklook" data-id="'+dt.id+'" data-nursename="'+dt.name+'"><i class="fa fa-play" style="padding-right:10px;"></i>查看</button></p>';
                            }else{
                                return '<p><button data-id="'+dt.id+'" data-nursename="'+dt.name+'" class="btn m-b-xs btn-sm btn-success remark"><i class="fa fa-plus" style="padding-right:10px;"></i>备注</button></p>';
                            }
                        }
                    }

                ];
            }else if($stateParams.type === 'pass'){
               dataColumns = [
                    {
                        "data": "orderid",
                        "orderable":false,
                        "render": function (set, status, dt) {
                            var str = '';
                            /*if (dt.name) {
                                str += '<a data-id="'+dt.id+'" class="group-info text-info">' + dt.name + '</a>';
                            }*/
                            str += '<a data-id="'+dt.id+'" class="group-info text-info">20151210012356</a>';
                            return str;
                        }
                    }, 
                    {
                        "data": "ordertype",
                        "searchable":true,
                        "orderable": false,
                        "render": function (set, status, dt) {
                            var str = '检查';
                            /*if (dt.groupCert && dt.groupCert.adminTel) {
                                str += '<span class="text-primary">' + dt.groupCert.adminTel + '</span>';
                            }*/
                            return str;
                        }
                    }, 
                    {
                        "data": "nursename",
                        "orderable": false,
                        "render": function (set, status, dt) {
                            var str = '张护士';
                            /*if (dt.groupCert && dt.groupCert.adminTel) {
                                str += '<span class="text-primary">' + dt.groupCert.adminTel + '</span>';
                            }*/
                            return str;
                        }
                    }, 
                    {
                        "data": "username",
                        "orderable": false,
                        "render": function (set, status, dt) {
                            var str = '小明';
                            /*if (dt.groupCert && dt.groupCert.adminTel) {
                                str += '<span class="text-primary">' + dt.groupCert.adminTel + '</span>';
                            }*/
                            return str;
                        }
                    },  
                    {
                        "data": "finishtime",
                        "orderable": true,
                        "searchable": false,
                        "render": function (set, status, dt) {
                            if (dt.groupCert && dt.groupCert.createTime.length !== 0 && dt.groupCert.createTime) {
                                return utils.dateFormat(dt.groupCert.createTime, 'yyyy-MM-dd hh:ss:mm');
                            }else{
                                return '';
                            }
                        }
                    }
                ];
            }else{
               dataColumns = [
                    {
                        "data": "orderid",
                        "searchable":true,"orderable":false,
                        "render": function (set, status, dt) {
                            var str = '';
                            /*if (dt.name) {
                                str += '<a data-id="'+dt.id+'" class="group-info text-info">' + dt.name + '</a>';
                            }*/
                            str += '<a data-id="'+dt.id+'" class="group-info text-info">20151210012356</a>';
                            return str;
                        }
                    }, 
                    {
                        "data": "ordertype",
                        "orderable": false,
                        "searchable": true,
                        "render": function (set, status, dt) {
                            var str = '加号';
                            /*if (dt.groupCert && dt.groupCert.adminTel) {
                                str += '<span class="text-primary">' + dt.groupCert.adminTel + '</span>';
                            }*/
                            return str;
                        }
                    }, 
                    {
                        "data": "nursename",
                        "orderable": true,
                        "searchable": true,
                        "render": function (set, status, dt) {
                            var str = '成成';
                            /*if (dt.groupCert && dt.groupCert.adminTel) {
                                str += '<span class="text-primary">' + dt.groupCert.adminTel + '</span>';
                            }*/
                            return str;
                        }
                    }, 
                    {
                        "data": "username",
                        "orderable": true,
                        "searchable": true,
                        "render": function (set, status, dt) {
                            var str = '张晓玲';
                            /*if (dt.groupCert && dt.groupCert.adminTel) {
                                str += '<span class="text-primary">' + dt.groupCert.adminTel + '</span>';
                            }*/
                            return str;
                        }
                    },  
                    {
                        "data": "canceltime",
                        "orderable": true,
                        "searchable": false,
                        "render": function (set, status, dt) {
                            if (dt.groupCert && dt.groupCert.createTime.length !== 0 && dt.groupCert.createTime) {
                                return utils.dateFormat(dt.groupCert.createTime, 'yyyy-MM-dd hh:ss:mm');
                            }else{
                                return '';
                            }
                        }
                    },  
                    {
                        "data": "cancelinfo",
                        "orderable": true,
                        "searchable": false,
                        "render": function (set, status, dt) {
                            var str = '订单双方确定后，患者爽约';
                            /*if (dt.groupCert && dt.groupCert.adminTel) {
                                str += '<span class="text-primary">' + dt.groupCert.adminTel + '</span>';
                            }*/
                            return str;
                        }
                    }
                ];
            }
            dTable = doctorList.dataTable({
                "bServerSide": true,
                "lengthMenu": [5, 10, 15, 20, 30, 40, 50, 100],
                "pageLength": length,
                "sAjaxSource": url,
                "language": app.lang.datatables.translation,
                "fnServerData": function (sSource, aoData, fnCallback) {
                    param.pageIndex = Math.round(aoData[3]['value']/aoData[4]['value']);
                    param.pageSize = aoData[4]['value'];
                    param.access_token = app.url.access_token;
                    param.sSearch = aoData[30]['value'];
                    param.createTime = aoData[33]['value'];
                    $http({
                        "method": "post",
                        "url": sSource,
                        "data": param
                    }).then(function (resp) {
                        var _dt = resp.data.data;
                        /*for (var i = 0; i < _dt.pageData.length; i++) {
                            utils.extendHash(_dt.pageData[i], ["name", "telephone", "remark", "groupCert", "otherGroupCount"]);
                            utils.extendHash(_dt.pageData[i].groupCert, ["companyName", "createTime"]);
                        }*/
                        resp.start = _dt.start;
                        resp.recordsTotal = _dt.total;
                        resp.recordsFiltered = _dt.total;
                        resp.length = _dt.pageSize;
                        resp.data = _dt.pageData;
                        fnCallback(resp);
                        // 更新界面中的数据
                        if($stateParams.type === 'notexception'){
                            $('#v_order_notexception').html(resp.recordsTotal);
                            utils.localData('v_order_notexception', resp.recordsTotal);
                        }else if($stateParams.type === 'notall'){
                            $('#v_order_notall').html(resp.recordsTotal);
                            utils.localData('v_order_notall', resp.recordsTotal);
                        }else if($stateParams.type === 'ingexception'){
                            $('#v_order_ingexception').html(resp.recordsTotal);
                            utils.localData('v_order_ingexception', resp.recordsTotal);
                        }else if($stateParams.type === 'ingall'){
                            $('#v_order_ingall').html(resp.recordsTotal);
                            utils.localData('v_order_ingall', resp.recordsTotal);
                        }else if($stateParams.type === 'pass'){
                            $('#v_order_pass').html(resp.recordsTotal);
                            utils.localData('v_order_pass', resp.recordsTotal);
                        }else{
                            $('#v_order_cancel').html(resp.recordsTotal);
                            utils.localData('v_order_cancel', resp.recordsTotal);
                        }

                    });
                },
                "columns": dataColumns
            });


            dTable.off().on('init.dt', function () {
                doctorList.on("click","button.call",function(evt){
                    evt = evt || window.event;
                    if($stateParams.type == "ingexception" || $stateParams.type == "ingall"){
                        callself = $(this);
                        if(inboxself && inboxself.length == 1){
                            inboxself.find("i.arrowinbox").removeClass("fa-angle-double-up").addClass("fa-angle-double-down"); 
                            inboxself.parent().find(".inboxdown").hide();
                        }
                        if(callself.find("i.arrowcall").hasClass("fa-angle-double-down")){
                            callself.find("i.arrowcall").removeClass("fa-angle-double-down").addClass("fa-angle-double-up");
                            callself.parent().find(".calldown").show();
                        }else{
                            callself.find("i.arrowcall").removeClass("fa-angle-double-up").addClass("fa-angle-double-down"); 
                            callself.parent().find(".calldown").hide();
                        }
                    }else{
                        $scope.openCall($(this).attr("data-id"),$(this).attr("data-nursename"));
                    }
                    
                    evt.stopPropagation();
                }).on("click","button.inbox",function(evt){
                    evt = evt || window.event;
                    if($stateParams.type == "ingexception" || $stateParams.type == "ingall"){
                        inboxself = $(this);
                        if(callself && callself.length == 1){
                            callself.find("i.arrowcall").removeClass("fa-angle-double-up").addClass("fa-angle-double-down"); 
                            callself.parent().find(".calldown").hide();
                        }
                        if(inboxself.find("i.arrowinbox").hasClass("fa-angle-double-down")){
                            inboxself.find("i.arrowinbox").removeClass("fa-angle-double-down").addClass("fa-angle-double-up");
                            inboxself.parent().find(".inboxdown").show();
                        }else{
                            inboxself.find("i.arrowinbox").removeClass("fa-angle-double-up").addClass("fa-angle-double-down"); 
                            inboxself.parent().find(".inboxdown").hide();
                        }
                    }else{
                        $scope.openInbox($(this).attr("data-id"),$(this).attr("data-nursename"));
                    }
                    evt.stopPropagation();
                }).on("mouseleave","a.calldown",function(evt){
                    callself.find("i.arrowcall").removeClass("fa-angle-double-up").addClass("fa-angle-double-down");
                    $(this).hide();
                }).on("mouseleave","a.inboxdown",function(evt){
                    inboxself.find("i.arrowinbox").removeClass("fa-angle-double-up").addClass("fa-angle-double-down");
                    $(this).hide();
                }).on("mouseleave","td span.tabelbtns",function(evt){
                    if(inboxself && inboxself.length == 1) {
                        inboxself.find("i.arrowinbox").removeClass("fa-angle-double-up").addClass("fa-angle-double-down");
                        inboxself.parent().find(".inboxdown").hide();
                    }
                    if(callself && callself.length == 1) {
                        callself.find("i.arrowcall").removeClass("fa-angle-double-up").addClass("fa-angle-double-down");
                        callself.parent().find(".calldown").hide();
                    }
                }).on("click","a.calldown span",function(evt){ //致电下拉点击
                    evt = evt || window.event;
                    callself.find("i.arrowcall").removeClass("fa-angle-double-up").addClass("fa-angle-double-down");
                    $(this).parent().hide();
                    if($(this).hasClass("last")){ //致电患者
                        $scope.openCall(callself.attr("data-id"),callself.attr("data-username"));    
                    }else{ //致电护士
                        $scope.openCall(callself.attr("data-id"),callself.attr("data-nursename"));
                    }
                    evt.stopPropagation();
                }).on("click","a.inboxdown span",function(evt){  //短信下拉点击
                    evt = evt || window.event;
                    inboxself.find("i.arrowinbox").removeClass("fa-angle-double-up").addClass("fa-angle-double-down");
                    $(this).parent().hide();
                    if($(this).hasClass("last")){ //短信患者
                        $scope.openInbox(inboxself.attr("data-id"),inboxself.attr("data-username"));    
                    }else{ //短信护士
                        $scope.openInbox(inboxself.attr("data-id"),inboxself.attr("data-nursename"));
                    }
                    evt.stopPropagation();
                }).on("click","button.remark",function(evt){
                    evt = evt || window.event;
                    $scope.openRemark($(this).attr("data-id"),$(this).attr("data-nursename"));
                    evt.stopPropagation();
                }).on("click","button.remarklook",function(evt){
                    evt = evt || window.event;
                    $scope.openRemark($(this).attr("data-id"),$(this).attr("data-nursename"));
                    evt.stopPropagation();
                }).on("click","tr",function(){
                    var id = $('td',this).eq(0).find("a").attr("data-id");
                    if($stateParams.type === 'notexception' || $stateParams.type === 'notall'){
                        $scope.seeDetails('app.o_not_details',id);
                    }else if($stateParams.type === 'ingexception' || $stateParams.type === 'ingall'){
                        $scope.seeDetails('app.o_ing_details',id);
                    }else if($stateParams.type === 'pass'){
                        $scope.seeDetails('app.o_pass_details',id);
                    }else{
                        $scope.seeDetails('app.o_cancel_details',id);
                    }
                });
            });
        }

        setTable();

    }

    $scope.openCall = function(_uid,_name){
        $scope.callname = _name;
        
        var txt = '<div class="call-frame-info">'
                    +'<p class="call-content" style="text-align:center;">将通过平台给客户：<span>'+_name+'</span>拨打电话，请注意接听平台电话。</p>'
                  +'</div>';
        $scope.choose(txt,"拨打电话");
        
    }
    
    $scope.openInbox = function(_uid,_name){
        $scope.callname = _name;
        var txt = '<div class="inbox-frame-info">'+
        '<div class="inbox-content">'+
           '<div>将通过平台给客户：<span>'+_name+'</span>发送短信。<button class="btn m-b-xs btn-sm btn-success addmessage" id="addMess"><i class="fa fa-plus"style="padding-right:10px;"></i>新增</button><div class="clear"></div></div>'+
           '<div class="inbox-messcontent"><textarea id="inbox-textarea" ng-model="textareacontent" placeholder="新增消息内容"></textarea></div>'+
           '<div id="inbox-messlist" class="inbox-messlist">'+
                  '<div class="check-items">'+
                      '<label class="i-checks text-success">'+
                          '<input type="radio" name="check" checked="checked">'+
                          '<i></i>'+
                          '<span>李护士您好，我是V小护客服，您手持证件照的照片拍摄较模糊。请您重新拍摄，重新提交审核。祝您生活愉快！重新提交审核。祝您生活愉快！重新提交审核。</span>'+
                      '</label>'+
                      '<button class="btn m-b-xs btn-sm btn-danger delmess"><i class="fa fa-minus"style="padding-right:10px;"></i>删除</button>'+
                      '<div class="clear"></div>'+
                  '</div>'+
                  '<div class="check-items">'+
                      '<label class="i-checks text-success">'+
                          '<input type="radio" name="check">'+
                          '<i></i>'+
                          '<span>李护士您好，我是V小护客服，您需要填写真实的医院信息。祝您生活愉快！</span>'+
                      '</label>'+
                      '<button class="btn m-b-xs btn-sm btn-danger delmess"><i class="fa fa-minus"style="padding-right:10px;"></i>删除</button>'+
                      '<div class="clear"></div>'+
                  '</div>'+
              '</div>'+
        '</div>'+
      '</div>';
        $scope.choose(txt,'发送短信');
    }


    $scope.openRemark= function(_uid,_name){
        $scope.remarkName = _name;
        $scope.remarkID = _uid;
        // $("#remark-frame").animate({top:"2px"});
        var txt = '<div class="inbox-frame-info">'+
        '<div class="inbox-content">'+
           '<div>请将客户当前沟通的情况备注，方便跟踪。<button class="btn m-b-xs btn-sm btn-success addmessage" id="addRemark"><i class="fa fa-plus"style="padding-right:10px;"></i>新增</button><div class="clear"></div></div>'+
           '<div class="inbox-messcontent"><textarea id="remark-textarea" ng-model="textarearemark" placeholder="新增备注内容"></textarea></div>'+
           '<div id="remark-messlist" class="inbox-messlist">'+
               '<p>客服10001  张全蛋  备注：这个客户说证件照等会上传</p>'+
               '<p>客服10001  张全蛋  备注：这个客户说证件照等会上传</p>'+
          '</div>'+
        '</div>'+
      '</div>';
      $scope.choose(txt,'备注');
    }


    var mask = $('<div class="mask"></div>'),
            container = $('#dialog-container'),
            doIt = function () {},
            limitation = 280,
            relimitation = 140,
            OldValue; 

    container.unbind().on("click",".check-items",function(){
        var selectval = $(this).find("span").html();
        $("#inbox-textarea").val(selectval);
    }).on("click",".delmess",function(evt){
        evt = evt || window.event;
        $(this).parent().remove();
        evt.stopPropagation();
    }).on("click","#addMess",function(evt){
        evt = evt || window.event;
        var selectval = $("#inbox-textarea").val();
        if(selectval.replace(/\s/g,"").length == 0) return;
        $("#inbox-messlist").append('<div class="check-items"><label class="i-checks text-success"><input type="radio" name="check"><i></i><span>'+selectval+'</span></label><button class="btn m-b-xs btn-sm btn-danger delmess"><i class="fa fa-minus"style="padding-right:10px;"></i>删除</button><div class="clear"></div></div>');
        evt.stopPropagation();
    }).on("click","#addRemark",function(evt){
        evt = evt || window.event;
        var selectval = $("#remark-textarea").val();
        if(selectval.replace(/\s/g,"").length == 0) return;
        $("#remark-messlist").append('<p>'+selectval+'</p>');
        evt.stopPropagation();
    }).on("keyup",'#remark-textarea',function(evt){
        var currval = $(this).val();
        if(currval.lenb() > relimitation) {
            $(this).val(remarkOld);
        }else{
            OldValue = currval;
        }
    }).on("keyup",'#inbox-textarea',function(evt){
        var currval = $(this).val();
        if(currval.lenb() > limitation) {
            $(this).val(remarkOld);
        }else{
            OldValue = currval;
        }
    });


    $scope.choose = function (txt,pop_title) {
        container.find('button[type=submit]').removeClass('disabled');
        mask.insertBefore(container);
        container.find('.form-content').html('').append(txt);
        $rootScope.pop_title = pop_title;
        container.removeClass('none');
        doIt = function () {
            mask.remove();
            container.addClass('none');
        };
    };
    // 执行操作
    $rootScope.do = function () {
        doIt();
    };
    // 模态框退出
    $rootScope.cancel = function () {
        mask.remove();
        container.addClass('none');
    };

    $scope.back = function(){
        window.history.go(-1);
    }

    String.prototype.lenb = function() {
        return this.replace(/[^\x00-\xff]/g,"**").length;
    }


    initTable();

});