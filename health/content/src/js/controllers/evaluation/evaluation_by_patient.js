'use strict';

(function() {
    app.controller('EvaluationByPatient', function($rootScope, $scope, $state, $http, utils, $modal, Doctor) {
        var access_token = localStorage.getItem('access_token');
        var curGroupId = localStorage.getItem('curGroupId');


        // 查看某一信息
        $scope.seeDetails = function(id) {
            if (id) {
                $('#doctor_details').removeClass('hide');
                $rootScope.winVisable = true;
                Doctor.addData(id);
            }
        };

        var url = app.url.yiliao.getDocInviteNum, // 后台API路径
            data = null,
            html = $('html'),
            body = $('body'),
            param = {
                'access_token': access_token,
                'groupId': curGroupId
            };

        var doctorList, docTable;

        function initTable() {
            var name,
                _index,
                _start,
                isSearch = false,
                searchTimes = 0,
                index = 1,
                start = 0,
                length = 10,
                num = 0,
                size = 50,
                idx = 0;

            var setTable = function() {
                doctorList = $('#evaluationByPatient');
                docTable = doctorList.dataTable({
                    "draw": index,
                    "displayStart": start,
                    "lengthMenu": [5, 10, 15, 20, 30, 40, 50, 100],
                    "pageLength": length,
                    "bServerSide": true,
                    "sAjaxSource": url,
                    "fnServerData": function(sSource, aoData, fnCallback) {
                        num = 1;
                        idx = index - 1;
                        //param['keyword'] = name;
                        param.pageIndex = index - 1;
                        param.pageSize = aoData[4]['value'];
                        console.log('index is:' + index);
                        $.ajax({
                            "type": "post",
                            "url": sSource,
                            "dataType": "json",
                            "data": param,
                            "success": function(resp) {
                                index = aoData[0]['value'];
                                resp.start = resp.data.start;
                                resp.recordsTotal = resp.data.total;
                                resp.recordsFiltered = resp.data.total;
                                resp.length = resp.data.pageSize;
                                resp.data = resp.data.pageData;
                                size = aoData[4]['value'];
                                fnCallback(resp);
                            }
                        });
                    },
                    "searching": false,
                    "language": app.lang.datatables.translation,
                    "createdRow": function(nRow, aData, iDataIndex) {
                        var a_link = $(nRow).find('.a-link');
                        a_link.click(function() {
                            if (aData.id) {
                                $scope.seeDetails(aData.id);
                            }
                        });
                        $(nRow).on('click', 'button', function() {
                            showPop(aData);
                        });
                        num++;
                    },
                    columns: [{
                        "orderable": false,
                        "render": function(set, status, dt) {
                            return '<span class="text-num">' + (idx * size + num) + '</span>';
                        },
                        "searchable": false
                    }, {
                        "orderable": false,
                        "render": function(set, status, dt) {
                            if (dt.headPicFileName) {
                                var path = dt.headPicFileName;
                            } else {
                                var path = 'src/img/a0.jpg';
                            }
                            return '<img class="a-link" src="' + path + '"/></a>';
                        },
                        "searchable": false
                    }, {
                        data: 'name',
                        render: function(data, type, row) {
                            if (row.name == undefined) {
                                return '';
                            } else {
                                return '<a class="a-link">' + data + '</a>';
                            }
                        },
                        "orderable": false,
                        "searchable": false
                    }, {
                        data: 'hospital',
                        render: function(data, type, row) {
                            if (row.hospital == undefined) {
                                return '';
                            } else {
                                return row.hospital;
                            }
                        },
                        "orderable": false
                    }, {
                        data: 'departments',
                        render: function(data, type, row) {
                            if (row.departments == undefined) {
                                return '';
                            } else {
                                return row.departments;
                            }
                        },
                        "orderable": false
                    }, {
                        data: 'title',
                        render: function(data, type, row) {
                            if (row.title == undefined) {
                                return '';
                            } else {
                                return row.title;
                            }
                        },
                        "orderable": false
                    }, {
                        data: 'value',
                        render: function(data, type, row) {
                            if (row.value == undefined) {
                                return '';
                            } else {
                                return row.value;
                            }
                        },
                        "orderable": false
                    }, {
                        data: null,
                        "defaultContent": "<button class='btn btn-primary'>查 询</button>",
                        "orderable": false
                    }],
                    "order": [
                        [4, "desc"]
                    ]
                });


                // 表格事件处理,init-初始化完成,length-改变每页长度,page-翻页,search-搜索
                docTable.off().on('length.dt', function(e, settings, len) {
                    index = 1;
                    start = 0;
                    length = len;
                    docTable.fnDestroy();
                    setTable();
                }).on('page.dt', function(e, settings) {
                    index = settings._iDisplayStart / length + 1;
                    start = length * (index - 1);
                    docTable.fnDestroy();
                    setTable();
                });
            };

            setTable();

        }

        initTable();

        function showPop(data) {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'patientModalContent.html',
                controller: 'PatientCtrl',
                size: 'lg',
                resolve: {
                    item: function() {
                        return data;
                    }
                }
            });
        };
    });



    app.controller('PatientCtrl', function($scope, $modalInstance, $http, item, $rootScope, Doctor) {
        var access_token = localStorage.getItem('access_token');
        var curGroupId = localStorage.getItem('curGroupId');
        $scope.doctorName = item.name;

        setTimeout(function() {
            var url = app.url.yiliao.getDocInvitePatient, // 后台API路径
                data = null,
                html = $('html'),
                body = $('body'),
                param = {
                    'access_token': access_token,
                    'groupId': curGroupId,
                    'doctorId': item.id
                };

            // 查看某一信息
            $scope.seeDetails = function(id) {
                if (id) {
                    $('#doctor_details').removeClass('hide');
                    $rootScope.winVisable = true;
                    Doctor.addData(id);
                }
            };

            ////////////////////////////////////////////////////////////

            // 初始化表格
            var patientList, dTable;

            function initTable() {
                var name,
                    _index,
                    _start,
                    isSearch = false,
                    searchTimes = 0,
                    index = 1,
                    start = 0,
                    length = 5;

                var setTable = function() {
                    patientList = $('#patientsTable');
                    dTable = patientList.dataTable({
                        "draw": index,
                        "displayStart": start,
                        "lengthMenu": [5, 10, 15, 20],
                        "pageLength": length,
                        "bServerSide": true,
                        "sAjaxSource": url,
                        "fnServerData": function(sSource, aoData, fnCallback) {
                            //param['keyword'] = name;
                            param.pageIndex = index - 1;
                            param.pageSize = aoData[4]['value'];
                            console.log('index is:' + index);
                            $.ajax({
                                "type": "post",
                                "url": sSource,
                                "dataType": "json",
                                "data": param,
                                "success": function(resp) {
                                    resp.start = resp.data.start;
                                    resp.recordsTotal = resp.data.total;
                                    resp.recordsFiltered = resp.data.total;
                                    resp.length = resp.data.pageSize;
                                    resp.data = resp.data.pageData;
                                    fnCallback(resp);
                                }
                            });
                        },
                        "searching": false,
                        "language": app.lang.datatables.translation,
                        "createdRow": function(nRow, aData, iDataIndex) {
                            var a_link = $(nRow).find('.a-link');
                            a_link.click(function(e) {
                                var evt = e || window.event;
                                evt.stopPropagation();
                                //$scope.seeDetails(aData.id);
                            });
                        },
                        columns: [{
                            "orderable": false,
                            "render": function(set, status, dt) {
                                if (dt.headPicFileName) {
                                    var path = dt.headPicFileName;
                                } else {
                                    var path = 'src/img/a0.jpg';
                                }
                                return '<img class="a-link" src="' + path + '"/>';
                            }
                        }, {
                            data: 'name',
                            "orderable": false,
                            "render": function(set, status, dt) {
                                return '<a class="a-link">' + dt.name + '</a>';
                            }
                        }, {
                            data: 'sex',
                            render: function(data, type, row) {
                                if (row.sex == undefined) {
                                    return '';
                                } else {
                                    if (row.sex == 1) {
                                        return '男';
                                    } else if (row.sex == 2) {
                                        return '女';
                                    } else if (row.sex == 3) {
                                        return '保密';
                                    } else {
                                        return '未知';
                                    }
                                }
                            },
                            "orderable": false
                        }, {
                            data: 'age',
                            render: function(data, type, row) {
                                if (row.age == undefined) {
                                    return '';
                                } else {
                                    return row.age;
                                }
                            },
                            "orderable": false
                        }, {
                            data: 'telephone',
                            render: function(data, type, row) {
                                if (row.telephone == undefined) {
                                    return '';
                                } else {
                                    return row.telephone;
                                }
                            },
                            "orderable": false
                        }, {
                            data: 'time',
                            render: function(data, type, row) {
                                if (row.time == undefined) {
                                    return '';
                                } else {
                                    return row.time;
                                }
                            },
                            "orderable": false
                        }]
                    });

                    // 表格事件处理,init-初始化完成,length-改变每页长度,page-翻页,search-搜索
                    dTable.off().on('length.dt', function(e, settings, len) {
                        index = 1;
                        start = 0;
                        length = len;
                        dTable.fnDestroy();
                        setTable();
                    }).on('page.dt', function(e, settings) {
                        index = settings._iDisplayStart / length + 1;
                        start = length * (index - 1);
                        dTable.fnDestroy();
                        setTable();
                    });
                };

                setTable();

            }

            initTable();

        }, 1);

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    });
})()
