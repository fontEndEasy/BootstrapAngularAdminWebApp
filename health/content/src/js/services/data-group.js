'use strict';

angular.module('app').service('Group', ['$rootScope', '$http', 'utils', 'modal',
    function ($rootScope, $http, utils, modal) {

        var thiz = this,
            info = {
                id: '666666666666666666666666',
                name: '',
                logo: 'src/img/logoDefault.jpg',
                status: {},
                profit: {},
                config: {},
                user: {
                    admin: 'admin',
                    headPic: 'src/img/a0.jpg'
                }
            },
            data = {},
            id = null,
            groupId = utils.localData('curGroupId');
        $rootScope.doctor = {};
        this.addData = function (d) {
            id = d;
        };
        this.getData = function(){
            return info || null;
        };
        var getAsyncData = function(id, fun){
            if(!id) {
                fun.call(null, info);
                return;
            }
            $http({
                url: app.url.yiliao.getGroupInfo,
                cache: true,
                data: {
                    access_token: app.url.access_token,
                    id: id
                },
                method: 'post'
            }).then(function(resp){
                if(resp.data.resultCode === 1 && resp.data.data){
                    data = resp.data.data;
                    thiz.init(data);
                    if(fun){
                        fun.call(null, info);
                    }
                }else{
                    modal.toast.error('获取集团数据失败！');
                    console.error('获取集团数据：' + resp.data.resultMsg);
                }
            });
        };

        this.init = function(dt){
            if(dt){
                info.id = dt.id || dt.groupId || info.id;
                info.name = dt.name || info.name;
                info.logo = dt.logo || dt.logoUrl || 'src/img/logoDefault.jpg';
                info.status.active = dt.active || info.status.active;
                info.status.certStatus = dt.certStatus || info.status.certStatus;
                info.status.applyStatus = dt.applyStatus || info.status.applyStatus;
                info.creator = dt.creator || info.creator;
                info.createDate = dt.creatorDate || info.createDate;
                info.introduction = dt.introduction || info.introduction;
                info.updator = dt.updator || info.updator;
                info.updateDate = dt.updatorDate || info.updateDate;
                info.cureNum = dt.cureNum || info.cureNum;
                info.companyId = dt.companyId || '';

                info.user.name = dt.groupUser && dt.groupUser.name || '';
                info.user.admin = dt.groupUser && dt.groupUser.rootAdmin || info.user.admin;
                info.user.headPic = (dt.groupUser && dt.groupUser.headPicFileName) || (dt.groupUser && dt.groupUser.headPicture) || info.user.headPic;
                info.user.status= dt.userStatus || '1',

                info.profit.carePlanGroupProfit = dt.config && dt.config.carePlanGroupProfit || 0;
                info.profit.carePlanParentProfit = dt.config && dt.config.carePlanParentProfit || 0;
                info.profit.clinicGroupProfit = dt.config && dt.config.clinicGroupProfit || 0;
                info.profit.clinicParentProfit = dt.config && dt.config.clinicParentProfit || 0;
                info.profit.phoneGroupProfit = dt.config && dt.config.phoneGroupProfit || 0;
                info.profit.phoneParentProfit = dt.config && dt.config.phoneParentProfit || 0;
                info.profit.textGroupProfit = dt.config && dt.config.textGroupProfit || 0;
                info.profit.textParentProfit = dt.config && dt.config.textParentProfit || 0;

                info.config.memberApply = dt.config && dt.config.memberApply || false;
                info.config.memberInvite = dt.config && dt.config.memberInvite || false;
                info.config.dutyEndTime = dt.config && dt.config.dutyEndTime || 0;
                info.config.dutyStartTime = dt.config && dt.config.dutyStartTime || 0;

                info.config.passByAudit = dt.config && dt.config.passByAudit || 0;

                info.groupCert = dt.groupCert || info.groupCert;
            }
        };

        //getAsyncData();

        this.set = function(key, val){
            var keys = key.split('.');
            var len = keys.length;
            var obj = info;
            var tmp = {};

            for(var n=0; n<len; n++){
                if(!obj.hasOwnProperty(keys[n])){
                    for(var i=len-1; i>=n; i--){
                        if(i === n){
                            tmp[keys[i]] = tmp[keys[i]] || val;
                        }else{
                            tmp[keys[i-1]] = {};
                            tmp[keys[i-1]][keys[i]] = tmp[keys[i]] || val;
                        }
                    }
                    obj[keys[n]] = tmp[keys[n]];
                    break;
                }else{
                    if(n === len - 1){
                        obj[keys[n]] = val;
                    }else{
                        obj = obj[keys[n]];
                    }
                }
            }
        };

        this.get = function(key){

        };

        this.handle = function(id, fun){
            if(info && info.name){
                fun.call(null, info);
            }else{
                getAsyncData(id, fun);
            }
        };

        this.update = function(){
            getAsyncData();
        };

        return this;

        // 名称，id，状态，logo，
        var groupInfo = {
            id: 123,
            name: 'xxx',
            logo: '',
            status: {

            }
        };
    }
]);

