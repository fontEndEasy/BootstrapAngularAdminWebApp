'use strict';

app.controller('PatientDetails', function ($rootScope, $scope, $state, $timeout, $http, utils, $stateParams) {
    var container = $('#dialog_container'),
        html = $('html'),
        curId = $scope.curId || utils.localData('curId'),
        curType = $scope.curType || utils.localData('curType'),
        groupId = utils.localData('curGroupId'),
        patientId = $stateParams.id;

    html.css('overflow', 'hidden');

    $scope.viewData = {};
    $scope.formData = {};


    $scope.viewData.patientName = $scope.curPatientName;


    if (patientId) {
        $http({
            url: app.url.yiliao.getTreatmentRecords,
            method: 'post',
            //url: "src/api/records.json",
            //method: 'get',
            data: {
                access_token: app.url.access_token,
                groupId: groupId,
                patientId: patientId,
                type: curType,
                id: curId
            }
        }).then(function (resp) {
            //if (resp.data.resultCode === 1 && resp.data.data) {
            if (resp.data) {
                var dt = resp.data;
                createRecordTable(dt);
            } else {
                //createRecordTable(null);
            }
        }, function (x) {
            console.error(x.statusText);
        });
    } else {
        //createRecordTable(null);
    }

    function createRecordTable(dt) {
        var dtArr = dt.data;
        if (!dtArr) return;
        var tab = $('<table></table>');
        var tabHead = $('<thead></thead>');
        var tabBody = $('<tbody></tbody>');

        var tr = '<tr><td>关联用户</td><td>' + ($scope.curUserName || '') + '</td></tr>' +
            '<tr><td>成员关系</td><td>' + (dt.relation || '') + '</td></tr>' +
            '<tr><td>年龄</td><td>' + (dt.age || '') + '</td></tr>' +
            '<tr><td>联系方式</td><td>' + (dt.telephone || '') + '</td></tr>';

        tabHead.html(tr);
        tr = '';
        var len = dtArr.length;
        if (len === 0) {
            tr += '<tr><td colspan="2">诊疗纪录 [<span class="text-info">0/0</span>]（' + getTimeString(0) + '）</td></tr>';
            tabBody.html(tr);
        } else {
            for (var i = 0; i < len; i++) {
                tr += '<tr class="ttl-row"><td colspan="2">诊疗纪录 [<span class="text-info">' + (i + 1) + '/' + len + '</span>] (' + getTimeString(dtArr[i].createTime || 0) + ')</td></tr>' +
                    '<tr><td>医生</td><td>' + (dtArr[i].name || '') + '</td></tr>' +
                    '<tr><td>病种</td><td>' + (dtArr[i].disease || '') + '</td></tr>';
                tabBody.html(tr);
            }
        }

        tab.append(tabHead).append(tabBody);
        $('#patient_record').html('').append(tab);
    }

    function getTimeString(date){
        if(date){
            date = new Date(date);
            var _y = date.getFullYear();
            var _M = date.getMonth() + 1;
            var _d = date.getDate();
            var _h = date.getHours();
            var _m = date.getMinutes();
        }

        return date ? _y + ' 年 ' + _M + ' 月 ' + _d + ' 日 ，' + _h + ' 点 ' + _m + ' 分' : '--年--月--日';
    }

    // 模态框退出
    $scope.cancel = function () {
        container.prev().remove();
        container.remove();
        html.css('overflow', 'auto');
        window.history.back();
        //$state.go('app.patient.patient_list',{id:$scope.curDepartmentId},{reload:true});
    };

});