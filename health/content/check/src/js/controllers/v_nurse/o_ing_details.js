'use strict';

app.controller('OIngDetails', ['$scope', '$http', '$state', '$rootScope', 'utils', 'uiLoad', 'JQ_CONFIG', '$compile','$stateParams',
    function ($scope, $http, $state, $rootScope, utils, uiLoad, JQ_CONFIG, $compile,$stateParams) {
        uiLoad.load(JQ_CONFIG.dateTimePicker).then(function () {
            $(".form_datetime").datetimepicker({
                format: "yyyy-mm-dd",
                autoclose: true,
                pickerPosition: "bottom-left",
                minView: 2,
                todayBtn: false,
                language: 'zh-CN'
            });
        });

         var url = app.url.admin.check.getGroupCerts; // 后台API路径
        var param = {};
        var id = $stateParams.id;

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

        var callself,inboxself;
        $(".ingbtns").on("click","button.call",function(evt){
            evt = evt || window.event;
            callself = $(this);
            $rootScope.pop_title = "拨打电话";
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
        
            evt.stopPropagation();
        }).on("click","button.inbox",function(evt){
            evt = evt || window.event;
            inboxself = $(this);
            $rootScope.pop_title = "发送短信";
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
            evt.stopPropagation();
        }).on("mouseleave","a.calldown",function(evt){
            callself.find("i.arrowcall").removeClass("fa-angle-double-up").addClass("fa-angle-double-down");
            $(this).hide();
        }).on("mouseleave","a.inboxdown",function(evt){
            inboxself.find("i.arrowinbox").removeClass("fa-angle-double-up").addClass("fa-angle-double-down");
            $(this).hide();
        }).on("mouseleave","span.tabelbtns",function(evt){
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
            if(callself && callself.length == 1){
                callself.find("i.arrowcall").removeClass("fa-angle-double-up").addClass("fa-angle-double-down");
                $(this).parent().hide();
            }
            if($(this).hasClass("last")){ //致电患者
                $scope.openCall(callself.attr("data-id"),callself.attr("data-username"));    
            }else{ //致电护士
                $scope.openCall(callself.attr("data-id"),callself.attr("data-nursename"));
            }
            evt.stopPropagation();
        }).on("click","a.inboxdown span",function(evt){  //短信下拉点击
            evt = evt || window.event;
            if(inboxself && inboxself.length == 1){
                inboxself.find("i.arrowinbox").removeClass("fa-angle-double-up").addClass("fa-angle-double-down");
                $(this).parent().hide();
            }
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
        }).on("click","button.orderCancel",function(evt){
            evt = evt || window.event;
            $scope.choose('确定要取消订单吗？','取消订单')
            evt.stopPropagation();
        });

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


    }
]);
