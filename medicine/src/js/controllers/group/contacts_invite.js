'use strict';

app.controller('ContactsInvite', function ($rootScope, $scope, $state, $timeout, $http, utils) {

    var container = $('#dialog_container'),
        ipt = $('#doctorInfo'),
        keys = null,
        tmpKey = keys,
        groupId = utils.localData('curGroupId');

    $scope.viewData = {};
    $scope.formData = {};
    $scope.showResult = false;
    $scope.showNoneResult = false;
    $scope.showMsgBox = false;
    $scope.showSuccess = false;
    $scope.hasNoResult = true;
    $scope.hasGroup = false;
    $scope.isNopass = false;
    $scope.inviteAgain = false;
    $scope.isALoading = false;
    $scope.isBLoading = false;

    var keyType = $('#key_type'),
        keyName = '',
        type = '',
        phone = /^(13[0-9]|15[0-3]|15[5-9]|170|180|182|18[5-9])([0-9]{8})$/,
        doctorNum = /^[0-9]{1,10}$/,
        timer = 0;

    keyType.html('<i class="fa fa-question-circle"></i>');
    ipt.trigger('focus').html('');

    function changeVal() {
        timer = setInterval(function () {
            //ipt.height(ipt[0].scrollHeight - 12);
            keys = ipt.html();
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

    ipt.on('focus', function () {
        //changeVal();
        if(ipt.html().match('医生号/手机号')) {
            ipt.html('');
        }
    });

    ipt.on('blur', function () {
        //clearInterval(timer);
        if(!ipt.html() || !ipt.html().match(/\S+/)){
            ipt.html('医生号/手机号');
        }
    });

    var doIt = function () {
        /*    if(tmpKey === keys){
         return;
         }else{
         tmpKey = keys
         }*/
        var dt = null, ttl, dpt,
            hsp;

        keys = ipt.html();
        keys = keys.split(/\D+/);
        if(!keys[0].match(/\d/)){
            keys.splice(0,1);
        }
        if(!keys[keys.length - 1].match(/\d/)){
            keys.splice(keys.length - 1,1);
        }

        console.log(keys);

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
    // 批量邀请
    function invite(){
        $http({
            url: app.url.yiliao.saveBatchInvite,
            method: 'post',
            data: param
        }).then(function (resp) {
            $scope.isALoading = false;
            $scope.isBLoading = false;
            if (resp.data.resultCode === 1 && !resp.data.data.wrong) {
                $scope.showResult = false;
                $scope.showSuccess = true;
                $scope.showNoneResult = false;
                $scope.hasNoResult = false;
            }else{
                $scope.showResult = false;
                $scope.showNoneResult = true;
                $scope.hasNoResult = true;
                $scope.viewData.keys = resp.data.data.wrong;
            }
        }, function (x) {
            console.error(x.statusText);
        });
    }
    $scope.batchInvite = function () {
        $scope.showSuccess = false;
        $scope.isALoading = true;
        keys = ipt.html();
        keys = keys.split(/\D+/);
        if(!keys[0].match(/\d/)){
            keys.splice(0,1);
        }
        if(!keys[keys.length - 1].match(/\d/)){
            keys.splice(keys.length - 1,1);
        }
        console.log(keys);
        param.access_token = app.url.access_token;
        param.groupId = groupId;
        param.telepNumsOrdocNums = keys;
        param.ignore = false;
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
        //window.history.back();
        $state.go('app.contacts.list', {}, {reload: true});
    };

});