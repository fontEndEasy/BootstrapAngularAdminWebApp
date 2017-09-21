'use strict';

app.controller('InvitePatient', function ($rootScope, $scope, $state, $timeout, $http, utils, modal, $modal) {
    var txtLt = $('#invite_phone_list'),
        keys = [],
        numbers = [],
        tmpKey = keys,
        timer = 0,
        tmr = 0,
        that = null,
        //phone = /^(13[0-9]|15[0-3]|15[5-9]|170|180|182|18[5-9])([0-9]{8})$/,
        //phone = /^(1)([0-9]{10})$/,
        phone = /^(13[0-9]|14[57]|15[0-9]|17[0678]|18[0-9])[0-9]{8}$/,
        target = null,
        curEle,
        ipt,
        numberEles = [],
        index = 0;


    $scope.inviteSucceed = false;

    function editFocus(e){
        var evt = e || window.event;
        evt.stopPropagation();
        if(curEle !== $(this)){
            clearInterval(tmr);
            var temp = $(this).html();
            var thiz = curEle = $(this);

            tmr = setInterval(function(){
                var _val = thiz.html();
                if(temp !== _val){
                    temp = _val;
                    if(!phone.test(_val)){
                        thiz.parent().addClass('btn-warning');
                    }else{
                        var _idx = keys.indexOf(_val);
                        if(_idx === -1){
                            keys[e.data] = _val;
                            numberEles[e.data] = thiz.parent();  // 加入到集合，供后面匹配使用
                        }else{
                            blink(numberEles[_idx], thiz.parent());
                        }
                        thiz.parent().removeClass('btn-warning');
                    }
                }
            },50);
        }
    }

    function blink(eleA, eleB){
        //return;
        var n = 6;
        var t =setInterval(function(){
            if(n%2){
                eleA.addClass('btn-danger');
                eleB.addClass('btn-danger');
            }else{
                eleA.removeClass('btn-danger');
                eleB.removeClass('btn-danger');
            }
            if(n-- === 0) clearInterval(t);
        },100);
    }

    // input聚焦后的相关处理
    function iptFocus(e){
        var evt = e || window.event;
        evt.stopPropagation();
        if(curEle !== $(this)){
            clearInterval(tmr);
            clearInterval(timer);
            var temp = $(this).val();
            var thiz = curEle = $(this);
            timer = setInterval(function(){
                var _val = ipt.val();
                if(temp !== _val){
                    temp = _val;
                    if(phone.test(_val)){
                        var span = $('<span class="label-btn btn-success"></span>');
                        var b = $('<b contenteditable="true">'+ _val +'</b>');
                        var ie = $('<i class="fa fa-times"></i>');
                        var idx = keys.indexOf(_val);
                        span.prepend(b);
                        span.prepend(ie);
                        span.insertBefore(ipt);
                        ipt.val('');

                        keys.push(_val);            // 加入到集合，供后面匹配使用
                        numberEles.push(span);      // 加入到集合，供后面匹配使用

                        if(idx !== -1){
                            blink(numberEles[idx], span);   // 有相同的号码时闪烁
                        }

                        ie.on('click', index, function(e){
                            keys[e.data] = null;
                            $(this).parent().remove();
                        });
                        b.on('click', index, editFocus);

                        index ++;
                    }
                }
            },50);
        }
    }

    function createIpt(){
        ipt = $('<input maxlength="11" class="num-input" />');
        txtLt.append(ipt);
        ipt.on('focus', iptFocus);
        ipt.trigger('focus');
    }

    txtLt.trigger('focus').blur(function(){
        clearInterval(tmr);
    });

    txtLt.click(function(e){
        var evt = e || window.event;
        evt.stopPropagation();
        target = evt.target || evt.srcElement;
        if(ipt){
            ipt.trigger('focus');
        }else{
            if(target === $(this)[0]){
                createIpt();    // 嵌入一个input元素，用于输入
            }
        }
    });

    // 捕获粘贴事件
    txtLt.on('paste', function(e){
        var clipboardData = (event.clipboardData || window.clipboardData);  // 获取剪贴板对象
        var nums = clipboardData.getData("text");   // 获取剪贴板文本
        var marks = nums.split(/\d+/);
        var idxs = [];

        marks.splice(0, 1);
        //console.log(marks);

        nums = nums.split(/\D+/);
        if(!nums[0].match(/\d/)){
            nums.splice(0,1);
        }
        if(!nums[nums.length - 1].match(/\d/)){
            nums.splice(nums.length - 1,1);
        }

        if(nums.length > 0){
            nums = utils.unique(nums, idxs);
        }

        for(var i=idxs.length - 1; i>=0; i--){
            marks.splice(idxs[i], 1);
        }

        if(ipt) ipt.remove();

        // 为每个数字创建一个标签
        for(var i=0; i<nums.length; i++){
            if(!phone.test(nums[i])){
                var span = $('<span class="label-btn btn-success btn-warning"></span>');
            }else{
                var span = $('<span class="label-btn btn-success"></span>');
            }

            var b = $('<b contenteditable="true">' + nums[i] + '</b>');
            var name = marks[i].trim();
            if(/\S/.test(name)){
                var m = $('<span>( ' + marks[i].trim() + ' )</span>');
            }else{
                var m = $('<span></span>');
            }
            var ie = $('<i class="fa fa-times"></i>');
            span.prepend(m);
            span.prepend(b);
            span.prepend(ie);
            txtLt.append(span);

            keys.push(nums[i]);             // 加入到集合，供后面匹配使用
            numberEles.push(span);          // 加入到集合，供后面匹配使用

            ie.bind('click', index, function(e){
                keys[e.data] = null;
                $(this).parent().remove();
            });
            b.on('click', index, editFocus);
            b.on('paste', function(e) {
                var evt = e || window.event;
                evt.stopPropagation();
                var clipboardData = (event.clipboardData || window.clipboardData),
                    keys = clipboardData.getData("text");
                $(this).html();
            });

            index ++;
        }
        clearInterval(timer);
        createIpt();    // 粘贴后嵌入一个input元素，用于输入
    });

    $scope.add = function(){
        clearInterval(tmr);
        clearInterval(timer);

        numbers = [];

        $scope.succeed = false;
        $scope.invited = false;

        for(var i=0; i<index; i++){
            if(phone.test(keys[i])){
                numbers.push(keys[i]);          // 有效的号码集合
            }
        }

        if(numbers.length > 0){
            numbers = utils.unique(numbers);
        }

        if(numbers.length === 0){
            modal.toast.warn('请至少添加一个手机号码！');
            return;
        }

        $http({
            "method": "post",
            "url": app.url.yiliao.addPatient,
            "data": {
                access_token: app.url.access_token,
                telephones: numbers
            }
        }).then(function (resp) {
            var _dt = resp.data;
            if(_dt.resultCode == '1' && _dt.data){
                var succeed = [],
                    invited = [];
                $scope.inviteSucceed = true;

                for(var k in _dt.data){
                    if(_dt.data[k].msg === '已是好友'){
                        invited.push(k);
                    }else{
                        succeed.push(k);
                    }
                }
                if(succeed.length > 0) {
                    $scope.succeed = true;
                    $('#succeed_list').html(succeed.toString().replace(/,/g, ', ') + ' <span class="text-success">邀请成功!</span>');
                }
                if(invited.length > 0) {
                    $scope.invited = true;
                    $('#invited_list').html(invited.toString().replace(/,/g, ', ') + ' <span class="text-primary">已是好友!</span>');
                }
            }
        });
    };

    $scope.clear = function(){
        clearInterval(tmr);
        clearInterval(timer);
        txtLt.html('');
        keys = [];
        numbers = [];
        numberEles = [];
        $scope.succeed = false;
        $scope.invited = false;

        createIpt();
    };
});