'use strict';

app.controller('ContactsInvite', function ($rootScope, $scope, $state, $timeout, $http, utils, modal) {

    var container = $('#dialog_container'),
        ipt = $('#doctorInfo'),
        keys = null,
        tmpKey = keys,
        groupId = utils.localData('curGroupId'),
        loading = $('#is_loading').addClass('hide');

    $scope.viewData = {};
    $scope.formData = {};
    $scope.showNoneResult = false;
    $scope.showMsgBox = false;
    $scope.showSuccess = false;
    $scope.hasNoResult = true;
    $scope.showNopass = false;
    $scope.inGroup = false;
    $scope.otherGroup = false;
    $scope.isNopass = false;
    $scope.isBLoading = false;

    var keyType = $('#key_type'),
        keyName = '',
        type = '',
        //phone = /^(13[0-9]|15[0-3]|15[5-9]|170|180|182|18[5-9])([0-9]{8})$/,
        phone = /^(13[0-9]|14[57]|15[0-9]|17[0678]|18[0-9])[0-9]{8}$/,
        doctorNum = /^[0-9]{1,10}$/,
        timer = 0;

    keyType.html('<i class="fa fa-question-circle"></i>');

    function changeVal() {
        timer = setInterval(function () {
            //ipt.height(ipt[0].scrollHeight - 12);
            keys = ipt.val();
            if (keys) {
                if (phone.test(keys)) {
                    type = '手机号';
                    keyType.html(type);
                } else if (doctorNum.test(keys)) {
                    type = '医生号';
                    keyType.html(type);
                } else {
                    type = '?';
                    keyType.html('<i class="fa fa-question-circle"></i>');
                }
            } else {
                keyType.html('<i class="fa fa-question-circle"></i>');
            }
        }, 100);
    }

    ipt.on('focus', function paste(){
        timer = setInterval(function(){
            keys = ipt.val();
            if(tmpKey != keys){
                if(tmpKey && tmpKey.length > keys.length) {
                    ipt.css('height', 'auto');
                }
                if(ipt[0].scrollHeight >= 200){
                    ipt.css('overflow-y', 'auto');
                }
                ipt.css('height', ipt[0].scrollHeight + 2);
                tmpKey = keys;
            }
        }, 200);
    });

    ipt.on('blur', function(){
        clearInterval(timer);
    });

    ipt.trigger('focus');

    var doIt = function () {
        /*    if(tmpKey === keys){
         return;
         }else{
         tmpKey = keys
         }*/
        var dt = null, ttl, dpt,
            hsp;

        keys = ipt.val();
        keys = keys.split(/\D+/);
        if(!keys[0].match(/\d/)){
            keys.splice(0,1);
        }
        if(!keys[keys.length - 1].match(/\d/)){
            keys.splice(keys.length - 1,1);
        }

        //console.log(keys);

        if (keys) {
            if (phone.test(keys)) {
                dt = {
                    access_token: app.url.access_token,
                    keyWord: keys
                    //telephone : keys
                };
                keyName = 'telephone';
                $scope.formData.phone = keys;
            } else if (doctorNum.test(keys)) {
                dt = {
                    access_token: app.url.access_token,
                    keyWord: keys
                    //doctorNum : keys
                };
                keyName = 'doctorNum';
                //$scope.formData.phone = null;
                $scope.formData.phone = keys;
            } else {
                dt = {
                    access_token: app.url.access_token,
                    keyWord: keys
                    //doctorNum : keys
                };
                //keyType.html('<i class="text-danger">无效查询！</i>');
                keyName = ' ';
                $scope.formData.phone = keys;
                //return;     // 校验，暂时关闭
            }
        } else {
            keyType.html('<i class="text-danger">无效查询！</i>');
            console.warn("无效查询！");
            return;
        }

        // 获取医生数据
        $http({
            url: app.url.doctor.searchs,
            method: 'post',
            data: dt
        }).then(function (resp) {
            var dt = resp.data.data;
            if (dt) {
                for (var i = 0; i < dt.length; i++) {
                    if ((keyName === 'telephone' && dt[i]['telephone'] === keys) || (keyName === 'doctorNum' && dt[i]['doctor']['doctorNum'] === keys)) {
                        dt = dt[i];
                        break;
                    }
                }
            } else {
                return;
            }
            if (dt.doctor) {
                ttl = dt.doctor.title || '--';
                dpt = dt.doctor.departments || '--';
                hsp = dt.doctor.hospital || '--';
                $scope.formData.id = dt._id;
                $scope.viewData.name = dt.name || '--';
                $scope.viewData.headPicFile = dt.headPicFileName || 'src/img/a0.jpg';
            }
            if (dt.hasGroup === 2 && dt.status === 1 && dt.doctor) {
                $scope.showNoneResult = false;
                $scope.showResult = true;
                $scope.viewData.info = ttl + ' / ' + dpt + ' / ' + hsp;
            } else if (dt.hasGroup === 1 && dt.doctor) {
                $scope.showResult = true;
                $scope.showNoneResult = false;
                $scope.hasNoResult = false;
                $scope.isNopass = false;
                $scope.hasGroup = true;
                $scope.viewData.info = ttl + ' / ' + dpt + ' / ' + hsp;
            } else if (dt.status !== 1 && dt.hasGroup !== 1 && dt.doctor) {
                $scope.showResult = true;
                $scope.showNoneResult = false;
                $scope.hasNoResult = false;
                $scope.hasGroup = false;
                $scope.isNopass = false;
                $scope.viewData.info = ttl + ' / ' + dpt + ' / ' + hsp;
            } else {
                $scope.showResult = false;
                $scope.showNoneResult = true;
                $scope.hasGroup = false;
                $scope.isNopass = false;
                $scope.hasNoResult = true;
                $scope.viewData.keys = keys + ' (' + type + ') ';
            }
        }, function (x) {
            console.error(x.statusText);
        });
    };

    // 发起邀请
    $scope.invite = function () {
        var param = {
            access_token: app.url.access_token,
            groupId: groupId,
            doctorId: $scope.formData.id
        };
        if ($scope.inviteAgain) {
            param.againInvite = 1;
        }
        $http({
            url: app.url.yiliao.saveByGroupDoctor,
            method: 'post',
            data: param
        }).then(function (resp) {
            if (resp.data.resultCode === 1 && resp.data.data.status !== 2) {
                $scope.showResult = false;
                $scope.showSuccess = true;
            } else if (resp.data.resultCode === 1 && resp.data.data.status === 2 && !resp.data.data.sms) {
                $scope.showResult = false;
                $scope.showWarn = true;
                $scope.inviteAgain = true;
                $scope.viewData.info_text = resp.data.data.msg;
            } else if (resp.data.resultCode === 1 && resp.data.data.status === 2) {
                $scope.showResult = false;
                $scope.showWarn = false;
                $scope.inviteAgain = false;
                $scope.showSuccess = true;
                $scope.viewData.info_text = resp.data.data.msg;
            } else {
                $scope.showResult = false;
                $scope.showWarn = true;
                $scope.inviteAgain = false;
                $scope.viewData.info_text = resp.data.resultMsg;
                console.log("[邀请失败！] " + resp.data.resultMsg);
            }
        }, function (x) {
            console.error(x.statusText);
        });
    };

    var param = {};
    var wrongNumber = null;
    var nopassNumber = null;

    // 批量邀请
    function invite(){
        $scope.viewData.numbers = [];
        $scope.viewData.hasGroupNumbers = [];
        $scope.viewData.otherGroupNumbers = [];
        var _success = false;

        $http({
            url: app.url.yiliao.saveBatchInvite,
            method: 'post',
            data: param
        }).then(function (resp) {
            loading.addClass('hide');
            $scope.isBLoading = false;
            var _data = resp.data.data;
            if(_data){
                var _params = param.telepNumsOrdocNums
                for(var i=0; i<_params.length; i++){
                    var _pData = _params[i];
                    if(_data[_pData] && _data[_pData].note){
                        $scope.viewData.numbers.push(_params[i]);
                    }else if(_data[_pData] && _data[_pData].msg === '已加入本集团'){
                        $scope.viewData.hasGroupNumbers.push(_params[i]);
                    }else if(_data[_pData] && _data[_pData].msg === '已加入其他集团'){
                        $scope.viewData.otherGroupNumbers.push(_params[i]);
                    }
                }

                if($scope.viewData.numbers.length === 0) {
                    for (var k in _data) {
                        if (_data[k]['note']) {
                            _success = true;
                        }
                    }
                }
            }

            if((resp.data.resultCode === 1 && !_data.wrong && $scope.viewData.numbers.length > 0) || _success) {
                var numbers = $scope.viewData.numbers;
                var l = keys.length;

                if(wrongNumber){
                    var wNumbers = wrongNumber.split(',');
                    for(var i=0; i<wNumbers.length; i++){
                        var idx = keys.indexOf(wNumbers[i]);
                        if(idx !== -1) {
                            keys.splice(idx, 1);
                        }
                    }
                }

                if(nopassNumber){
                    var nNumbers = nopassNumber.split(',');
                    for(var i=0; i<nNumbers.length; i++){
                        var idx = keys.indexOf(nNumbers[i]);
                        if(idx !== -1) {
                            keys.splice(idx, 1);
                        }
                    }
                }

                if($scope.viewData.hasGroupNumbers.length > 0) {
                    var inGroupNumbers = $scope.viewData.hasGroupNumbers;
                    for (var i = 0; i < inGroupNumbers.length; i++) {
                        var idx = keys.indexOf(inGroupNumbers[i]);
                        if (idx !== -1) {
                            keys.splice(idx, 1);
                        }
                    }
                }

                if($scope.viewData.otherGroupNumbers.length > 0) {
                    var otherGroupNumber = $scope.viewData.otherGroupNumbers;
                    for (var i = 0; i < otherGroupNumber.length; i++) {

                        var idx = keys.indexOf(otherGroupNumber[i]);
                        if (idx !== -1) {
                            keys.splice(idx, 1);
                        }
                    }
                }

                if(keys.length > 0){
                    $scope.showSuccess = true;
                    $scope.viewData.numbers = keys.toString();
                }

                //$scope.showWarn = false;
                $scope.showNoneResult = false;
            }else if(resp.data.data.wrong){
                //$scope.showWarn = false;
                $scope.inGroup = false;
                $scope.otherGroup = false;
                $scope.showSuccess = false;
                $scope.showNoneResult = true;
                $scope.hasNoResult = true;
                $scope.viewData.keys = _data.wrong;
                wrongNumber = _data.wrong;
            }else{
                //$scope.showWarn = true;
                $scope.showNoneResult = false;
                $scope.viewData.info_text = '邀请失败！';
            }

            if($scope.viewData.hasGroupNumbers.length > 0) {
                $scope.inGroup = true;
                $scope.viewData.hasGroupNumbers = $scope.viewData.hasGroupNumbers.toString();
            }
            if($scope.viewData.otherGroupNumbers.length > 0) {
                $scope.otherGroup = true;
                $scope.viewData.otherGroupNumbers = $scope.viewData.otherGroupNumbers.toString();
            }
        }, function (x) {
            console.error(x.statusText);
        });
    }
    $scope.batchInvite = function () {
        keys = ipt.val();

        $scope.showSuccess = false;
        $scope.inGroup = false;
        $scope.otherGroup = false;
        loading.removeClass('hide');

        keys = keys.split(/\D+/);
        if(!keys[0].match(/\d/)){
            keys.splice(0,1);
        }
        if(keys.length > 0 && !keys[keys.length - 1].match(/\d/)){
            keys.splice(keys.length - 1,1);
        }

        keys = utils.unique(keys);

        if(!keys || keys.length === 0) {
            loading.addClass('hide');
            modal.toast.warn('请输入有效号码！');
            return;
        }

        param.access_token = app.url.access_token;
        param.groupId = groupId;
        param.telepNumsOrdocNums = keys;
        param.ignore = false;

        wrongNumber = null;
        nopassNumber = null;

        invite();
    };

    $scope.batchInviteAnyway = function () {
        $scope.showSuccess = false;
        $scope.isBLoading = true;
        param.ignore = true;
        invite();
    };

    // 开启短信邀请
    $scope.sendMsg = function () {
        $scope.showNoneResult = false;
        $scope.showMsgBox = true;
    };

    // 发送短信
    $scope.doSend = function () {
        $http({
            url: app.url.yiliao.saveByGroupDoctor,
            method: 'post',
            data: {
                access_token: app.url.access_token,
                telephone: $scope.formData.phone,
                groupId: groupId
            }
        }).then(function (resp) {
            if (resp.data.resultCode === 1) {
                $scope.showMsgBox = false;
                $scope.showSuccess = true;
            } else {
                $scope.showMsgBox = false;
                $scope.showWarn = true;
            }
        }, function (x) {
            console.error(x.statusText);
        });
    };

    // 执行操作
    $scope.query = function () {
        $scope.showMsgBox = false;
        $scope.showSuccess = false;
        $scope.showWarn = false;
        doIt();
    };

    // 退出邀请
    $scope.return = function () {
        $scope.showResult = false;
        $scope.showNoneResult = false;
        $scope.hasGroup = false;
        $scope.isNopass = false;
        $scope.hasNoResult = false;
    };
    // 模态框退出
    $scope.cancel = function () {
        container.prev().remove();
        container.remove();
        window.history.back();
        //$state.go('app.contacts.list', {}, {reload: false});
    };

});