'use strict';

angular.module('app').service('Doctor', ['$rootScope', '$http',
    function ($rootScope, $http) {

        var info = {},
            data = {},
            id = null;
        $rootScope.doctor = {};

        this.addData = function (d) {
            id = d;
        };
        this.getData = function(){
            return info || null;
        };
        this.getAsyncData = function(fun){
            var callback = fun;
            $http({
                url: app.url.yiliao.getUserDetail,
                data: {
                    access_token: app.url.access_token,
                    userId: id
                },
                method: 'post'
            }).then(function(resp){
                if(resp.data.data){
                    data = resp.data.data;

                    info.headPic = data.headPicFileName;
                    info.name = (data.name && data.name.length !== 0) ? data.name : '--';
                    info.doctorId = (data.userId && data.userId.length !== 0) ? data.userId : '--';
                    info.info = ((data.doctor.title && data.doctor.title.length !== 0) ? data.doctor.title : '--') + ' / ' + ((data.doctor.departments && data.doctor.departments.length !== 0) ? data.doctor.departments : '--') + ' / ' + ((data.doctor.hospital && data.doctor.hospital.length !== 0) ? data.doctor.hospital : '--');
                    info.contactWay = data.contactWay;
                    info.introduction = (data.doctor.introduction && data.doctor.introduction.length !== 0) ? data.doctor.introduction : '--';
                    info.skill = (data.doctor.skill && data.doctor.skill.length !== 0) ? data.doctor.skill : '--';
                    info.relation = (data.inviteMsg && data.inviteMsg.length !== 0) ? data.inviteMsg : '--';
                    info.remarks = data.remarks;

                    callback(info);
                }else{
                    callback(null);
                }
            });

            //return info || null;
        };

        return this;
    }
]);