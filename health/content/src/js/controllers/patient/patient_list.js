'use strict';

app.controller('PatientOfDoctor', function ($rootScope, $scope, $state, $timeout, $http, utils, modal) {
    var url = app.url.yiliao.getDoctors, // 后台API路径
        data = null,
        html = $('html'),
        body = $('body'),
        curId = $scope.curId || utils.localData('curId'),
        curType = $scope.curType || utils.localData('curType'),
        groupId = utils.localData('curGroupId'),
        curRow = null,
        curInfoRow = null;

    $rootScope.viewData = {};
    $rootScope.viewData.typeName = $scope.typeName;

    if ($scope.curIndex === 'idx_0' || curId === 'idx_0') {
        url = app.url.yiliao.patient;
        var param = {
            groupId: groupId,
            type: 5
        };
        curType = 3;
    } else {
        url = app.url.yiliao.patient;
        var param = {
            groupId: groupId,
            type: curType,
            id: curId
        };
    }

    if ($rootScope.pageName !== 'list_pass') {
        utils.localData('page_index', null);
        utils.localData('page_start', null);
        //utils.localData('page_length', null);
        $rootScope.pageName = 'list_pass';
        $rootScope.scrollTop = 0;
    }

    // 查看某一信息
    $scope.seeDetails = function (row, dt) {
        var iArr = $(row).children('td').last().children('i'),
            isDtRow = ($(row).next().hasClass('even') || $(row).next().hasClass('odd')) || $(row).next().length == '0';
        if (row && curRow != row && isDtRow) {
            //if(curInfoRow) curInfoRow.addClass('none');
            curInfoRow = $('<tr></tr>');
            var newTd = $('<td colspan="6"></td>');
            var newDiv = $('<div></div>');

            if(curId === 'idx_0'){
                curId = dt.doctorId || dt.id;
            }

            $http({
                url: app.url.yiliao.getMembers,
                method: 'post',
                //url: 'src/api/patient.json',
                //method: 'get',
                data: {
                    access_token: app.url.access_token,
                    groupId: groupId,
                    id: curId,
                    type: curType,
                    userId: dt.doctorId || dt.id
                }
            }).then(function (resp) {
                var dt = resp.data.data;
                if (!dt) return;

                var tab = $('<table class="info-table"></table>');
                var tabHead = $('<thead><tr><td>成员关系</td><td>姓名</td><td>性别</td><td>年龄</td><td>联系方式</td></tr></thead>');
                var tabBody = $('<tbody></table>');

                tab.append(tabHead).append(tabBody);

                for (var i = 0; i < dt.length; i++) {
                    var tr = $('<tr></tr>');
                    var tdStr =
                        '<td>' + (dt[i].relation || '') + '</td>' +
                        '<td>' + (dt[i].name || '') + '</td>' +
                        '<td>' + (dt[i].sex == 1 ? '男' : dt[i].sex == 2 ? '女' : dt[i].sex == 3 ? '保密' : '') + '</td>' +
                        '<td>' + (dt[i].age ? dt[i].age : dt[i].age == '0' ? dt[i].age : '') + '</td>' +
                        '<td>' + (dt[i].telephone || '') + '</td>';
                    tr.html(tdStr);
                    tabBody.append(tr);
                    tr.on('click', dt[i], function (e) {
                        $rootScope.curPatientName = e.data.name;
                        $rootScope.isInView = true;
                        //$state.go('app.patient.patient_list.details',{id: e.data.id},{reload: false});

                        //return;
                        // 查看患者详情
                        $rootScope.viewData.patientName = e.data.name;
                        var patientId = e.data.id;
                        if (patientId) {
                            var mask = $('<div class="mask"></div>');
                            var container = $('#d_container');

                            // 模态框退出
                            $rootScope.close = function () {
                                mask.remove();
                                container.addClass('none');
                                html.css('overflow', 'auto');
                            };
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
                                //if (resp.data.data&& resp.data.data.length > 0) {
                                if (resp.data && resp.data.data && resp.data.data.length > 0) {
                                    var dt = resp.data;
                                    body.append(mask);
                                    html.css('overflow', 'hidden');
                                    container.removeClass('none');
                                    createRecordTable(dt, {
                                        name: e.data.name,
                                        sex: e.data.sex == 1 ? '男' : e.data.sex == 2 ? '女' : e.data.sex == 3 ? '保密' : '',
                                        age: e.data.age,
                                        relation: e.data.relation,
                                        telephone: e.data.telephone
                                    });
                                } else if (resp.data && resp.data.data && resp.data.data.length === 0) {
                                    modal.toast.warn("没有数据！");
                                } else {
                                    modal.toast.error(resp.data.resultMsg);
                                }
                            }, function (x) {
                                console.error(x.statusText);
                            });
                        } else {
                            //createRecordTable(null);
                        }
                    });
                }

                newDiv.html(tab);
                newTd.html(newDiv);
                curInfoRow.append(newTd);

                curInfoRow.insertAfter(row);
                curRow = row;
            });
            iArr.removeClass('fa-angle-double-down').addClass('fa-angle-double-up');
        } else if (curRow == row) {
            if (curInfoRow.hasClass('none')) {
                curInfoRow.removeClass('none');
                iArr.removeClass('fa-angle-double-down').addClass('fa-angle-double-up');
            } else {
                curInfoRow.addClass('none');
                iArr.removeClass('fa-angle-double-up').addClass('fa-angle-double-down');
            }
        } else {
            var curTr = $(row).next();
            if (curTr.hasClass('none')) {
                curTr.removeClass('none');
                iArr.removeClass('fa-angle-double-down').addClass('fa-angle-double-up');
            } else {
                curTr.addClass('none');
                iArr.removeClass('fa-angle-double-up').addClass('fa-angle-double-down');
            }
        }
    };

    ////////////////////////////////////////////////////////////

    function createRecordTable(dt, d) {
        var dtArr = dt.data;
        if (!dtArr) return;
        var tab = $('<table></table>');
        var tabHead = $('<thead></thead>');
        var tabBody = $('<tbody></tbody>');

        var tr = '<tr><td>关联用户</td><td>' + ($scope.curUserName || '') + '</td></tr>' +
            '<tr><td>成员关系</td><td>' + (d.relation || '') + '</td></tr>' +
            '<tr><td>年龄</td><td>' + (d.age ? d.age : d.age == '0' ? d.age : '') + '</td></tr>' +
            '<tr><td>性别</td><td>' + (d.sex || '') + '</td></tr>' +
            '<tr><td>联系方式</td><td>' + (d.telephone || '') + '</td></tr>';

        tabHead.html(tr);
        tr = '';
        var len = dtArr.length;
        if (len === 0) {
            tr += '<tr><td colspan="2">诊疗纪录 [<span class="text-info">0/0</span>]（' + getTimeString(0) + '）</td></tr>';
            tabBody.html(tr);
        } else {
            for (var i = 0; i < len; i++) {
                tr += '<tr class="ttl-row"><td colspan="2">诊疗纪录 [<span class="text-info">' + (i + 1) + '/' + len + '</span>] (' + getTimeString(dtArr[i].createTime || 0) + ')</td></tr>' +
                    '<tr><td>医生</td><td class="text-info">' + (dtArr[i].name || '') + '</td></tr>' +
                    '<tr><td>病种</td><td class="text-info">' + (dtArr[i].diseaseTypeName || '') + '</td></tr>';
                tabBody.html(tr);
            }
        }

        tab.append(tabHead).append(tabBody);
        $('#patient_record').html('').append(tab);
    }

    function getTimeString(date) {
        if (date) {
            date = new Date(date);
            var _y = date.getFullYear();
            var _M = date.getMonth() + 1;
            var _d = date.getDate();
            var _h = date.getHours();
            var _m = date.getMinutes();
        }

        return date ? _y + ' 年 ' + _M + ' 月 ' + _d + ' 日 ，' + _h + ' 点 ' + _m + ' 分' : '--年--月--日';
    }

    // 初始化表格
    var doctorList, dTable;

    function initTable() {
        var name,
            _index,
            _start,
            isSearch = false,
            searchTimes = 0,
            index = utils.localData('page_index') * 1 || 1,
            start = utils.localData('page_start') * 1 || 0,
            length = utils.localData('page_length') * 1 || 50;

        var setTable = function () {
            doctorList = $('#doctorListOfDisease');
            dTable = doctorList.dataTable({
                "draw": index,
                "displayStart": start,
                "lengthMenu": [5, 10, 15, 20, 30, 40, 50, 100],
                "pageLength": length,
                "bServerSide": true,
                "sAjaxSource": url,
                "fnServerData": function (sSource, aoData, fnCallback) {
                    param['keyword'] = name;
                    param.pageIndex = index - 1;
                    param.pageSize = aoData[4]['value'];
                    param.access_token = app.url.access_token;
                    $.ajax({
                        "type": "post",
                        "url": sSource,
                        "dataType": "json",
                        "data": param,
                        "success": function (resp) {
                            if(resp.resultCode != '1') {
                                modal.toast.warn(resp.resultMsg);
                                return;
                            }
                            for (var i = 0; i < resp.data.pageData.length; i++) {
                                if(resp.data.pageData[i].doctor){
                                    var doctor = resp.data.pageData[i].doctor;
                                    utils.extendHash(resp.data.pageData[i], ["name", "age", "sex", "telephone"], [doctor.name,null,null,doctor.telephone]);
                                }else{
                                    utils.extendHash(resp.data.pageData[i], ["name", "age", "sex", "telephone"]);
                                }
                            }
                            resp.start = resp.data.start;
                            resp.recordsTotal = resp.data.total;
                            resp.recordsFiltered = resp.data.total;
                            resp.length = resp.data.pageSize;
                            resp.data = resp.data.pageData;
                            fnCallback(resp);
                            $scope.loading = false;
                        }
                    });
                },
                "searching": false,
                "language": app.lang.datatables.translation,
                "createdRow": function (nRow, aData, iDataIndex) {
                    $(nRow).data('x_id', aData['id']).attr('data-id', aData['doctorId']).click(aData, function (param, e) {
                        $('.currentRow').removeClass('currentRow');
                        $rootScope.curUserName = param.data.name;
                        $scope.seeDetails(nRow, param.data);
                    });
                },
                "columns": [{
                    "orderable": false,
                    "render": function (set, status, dt) {
                        if (dt.headPicFileName) {
                            var path = dt.headPicFileName;
                        } else {
                            var path = 'src/img/a0.jpg';
                        }
                        return '<img src="' + path + '"/>';
                    }
                }, {
                    "data": "name",
                    "orderable": false
                }, {
                    "data": "age",
                    "orderable": false,
                    "searchable": false
                }, {
                    "data": "sex",
                    "orderable": false,
                    "searchable": false,
                    "render": function (set, status, dt) {
                        if (dt.sex) {
                            return dt.sex == 1 ? '男' : dt.sex == 2 ? '女' : dt.sex == 3 ? '保密' : '';
                        }
                    }
                }, {
                    "data": "telephone",
                    "orderable": false,
                    "searchable": false
                }, {
                    "render": function () {
                        return '<i class="text-lg fa fa-angle-double-down">';
                    },
                    "searchable": false
                }]
            });

            // 表格事件处理,init-初始化完成,length-改变每页长度,page-翻页,search-搜索
            dTable.off().on('init.dt', function () {
                html.scrollTop($rootScope.scrollTop);
                body.scrollTop($rootScope.scrollTop);
                doctorList.find('tr[data-id=' + $rootScope.curRowId + ']').addClass('currentRow');
            }).on('length.dt', function (e, settings, len) {
                index = 1;
                start = 0;
                length = len;
                dTable.fnDestroy();
                setTable();
                utils.localData('page_length', len);
            }).on('page.dt', function (e, settings) {
                index = settings._iDisplayStart / length + 1;
                start = length * (index - 1);
                dTable.fnDestroy();
                $rootScope.scrollTop = html.scrollTop() ? 103 : 152;
                utils.localData('page_index', index);
                utils.localData('page_start', start);
                setTable();
            }).on('search.dt', function (e, settings) {
                if (settings.oPreviousSearch.sSearch) {
                    isSearch = true;
                    searchTimes++;
                    _index = settings._iDisplayStart / settings._iDisplayLength + 1;
                    _start = settings._iDisplayStart;
                    name = settings.oPreviousSearch.sSearch;
                } else {
                    isSearch = false;
                    name = null;
                }
                if (isSearch) {
                    index = 1;
                    start = 0;
                } else {
                    if (searchTimes > 0) {
                        searchTimes = 0;
                        index = _index;
                        start = _start;
                        dTable.fnDestroy();
                        setTable();
                    }
                }
            });
        };

        setTable();

    }

    initTable();

});