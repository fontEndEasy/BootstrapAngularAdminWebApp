'use strict';

angular.module('app').service('Doctor', ['$rootScope', '$http', 'utils', 'modal',
    function ($rootScope, $http, utils, modal) {

        var info = {},
            data = {},
            id = null,
            groupId;
        $rootScope.doctor = {};
        this.addData = function (d) {
            id = d;
        };
        this.getData = function(){
            return info || null;
        };
        this.getAsyncData = function(fun){
            groupId = utils.localData('curGroupId');
            var callback = fun;
            $http({
                url: app.url.yiliao.getDoctorInfoDetails,
                data: {
                    access_token: app.url.access_token,
                    groupId: groupId,
                    doctorId: id
                },
                method: 'post'
            }).then(function(resp){
                if(resp.data.data){
                    data = resp.data.data;
                    info.userType = (data.user && data.user.userType) ? data.user.userType : '';
                    info.headPic = (data.user && data.user.headPicFileName) ? data.user.headPicFileName : '';
                    info.name = (data.user && data.user.name) ? data.user.name : '--';
                    info.creatorId = (data.groupDoctor && data.groupDoctor.creator) ? data.groupDoctor.userId : '';
                    info.referenceId = (data.groupDoctor && data.groupDoctor.referenceId) ? data.groupDoctor.referenceId : '';
                    info.doctorId = (data.user && data.user.userId) ? data.user.userId : '';
                    info.companyId = (data.group && data.group.companyId) ? data.group.companyId : '';
                    info.groupId = (data.group && data.group.id) ? data.group.id : '';
                    info.groupDoctorId = (data.groupDoctor && data.groupDoctor.id) ? data.groupDoctor.id : '';
                    info.departmentId = (data.departmentDoctor && data.departmentDoctor.departmentId) ? data.departmentDoctor.departmentId : '';
                    info.parentId = (data.groupProfit && data.groupProfit.parentId) ? data.groupProfit.parentId : '';
                    info.state = (data.user && data.user.status) ? data.user.status : '';
                    info.status = (data.groupDoctor && data.groupDoctor.status) ? data.groupDoctor.status : '';
                    info.info = ((data.user && data.user.doctor && data.user.doctor.title) ? data.user.doctor.title : '--') + ' / ' + ((data.user && data.user.doctor && data.user.doctor.departments) ? data.user.doctor.departments : '--') + ' / ' + ((data.user && data.user.doctor && data.user.doctor.hospital) ? data.user.doctor.hospital : '--');
                    info.departmentFullName = data.departmentFullName;
                    info.telephone = (data.user && data.user.telephone) ? data.user.telephone : '';
                    info.contactWay = (data.groupDoctor && data.groupDoctor.contactWay) ? data.groupDoctor.contactWay : '';
                    info.introduction = (data.user && data.user.doctor && data.user.doctor.introduction) ? data.user.doctor.introduction : '';
                    info.skill = (data.user && data.user.doctor && data.user.doctor.skill) ? data.user.doctor.skill : '';
                    info.relation = (data.inviteRelation && data.inviteRelation.inviteMsg) ? data.inviteRelation.inviteMsg : '';
                    info.remarks = (data.groupDoctor && data.groupDoctor.remarks) ? data.groupDoctor.remarks : '';
                    info.groupProfit = (data.groupProfit && data.groupProfit.groupProfit) ? data.groupProfit.groupProfit : '';
                    info.parentProfit = (data.groupProfit && data.groupProfit.parentProfit) ? data.groupProfit.parentProfit : '';

                    var exist = data.groupProfit && data.groupProfit.config;
                    var dt = exist && data.groupProfit.config;
                    info.textGroupProfit = exist ? dt.textGroupProfit : '';
                    info.textParentProfit = exist ? dt.textParentProfit : '';
                    info.phoneGroupProfit = exist ? dt.phoneGroupProfit : '';
                    info.phoneParentProfit = exist ? dt.phoneParentProfit : '';
                    info.carePlanGroupProfit = exist ? dt.carePlanGroupProfit : '';
                    info.carePlanParentProfit = exist ? dt.carePlanParentProfit : '';
                    info.clinicGroupProfit = exist ? dt.clinicGroupProfit : '';
                    info.clinicParentProfit = exist ? dt.clinicParentProfit : '';
                    info.consultationGroupProfit = exist ? dt.consultationGroupProfit : '';
                    info.consultationParentProfit = exist ? dt.consultationParentProfit : '';

                    callback(info);
                }else{
                    modal.toast.warn(resp.data.resultMsg);
                    callback(null);
                }
            });
        };

        return this;
    }
]);