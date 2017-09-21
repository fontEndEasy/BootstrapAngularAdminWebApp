'use strict';

app.controller('ReportsOfFinance', ['$rootScope', '$scope', '$state', '$timeout', '$http', 'utils', '$stateParams', 'JQ_CONFIG', 'uiLoad', 'modal',
    function ($rootScope, $scope, $state, $timeout, $http, utils, $stateParams, JQ_CONFIG, uiLoad, modal) {

        var groupId = utils.localData('curGroupId'),
            name = $stateParams.name,
            flg = $stateParams.date,
            watch_form,
            orderForm = $('#order_query');

        if (name === 'group') {
            var url = app.url.finance.gIncomeDetail;
            var date = new Date();
            var MM = date.getMonth() + 1;
            MM = MM > 9 ? MM : ('0' + MM)
            var date = date.getFullYear() + '-' + MM;
            var param = {
                groupId: groupId,
                month: flg
            };
            //$scope.reports_name = '集团收入报表';
            $scope.isGroup = true;
        } else {
            var url = app.url.finance.gdIncomeList;
            var param = {
                upGroup: groupId
            };
            //$scope.reports_name = '医生收入报表';
            $scope.isGroup = false;
        }

        if (flg && flg != '0') {
            $scope.canBack = true;
            //$scope.reports_name = '报表查询记录';
        }

        // 返回上一页
        $scope.goBack = function () {
            window.history.back();
        };

        // 查询
        var formData = [
            'childName',
            'telephone',
            'oType',
            'startTime',
            'endTime'
        ];
        $scope.queryOrder = function () {
            url = app.url.finance.gMIncomeDetail;
            if(dTable) {
                dTable.fnDestroy();
                initTable();
            }
        };


        function monitorOfFormData() {
            watch_form = $scope.$watchGroup(formData, function (newValue, oldValue) {
                var len = newValue.length;
                param = {};
                for (var i = 0; i < len; i++) {
                    if (newValue[i] && /\S/g.test(newValue[i])) {
                        param[formData[i]] = newValue[i];
                    }
                }
            });
        }

        monitorOfFormData();

        // 导出报表
        $scope.export = function () {
            if(param){
                if(param.startTime && typeof param.startTime !== "number"){
                    param.startTime = Date.parse(param.startTime.replace(/-/g, '/') + ' 00:00:00');
                }
                if(param.endTime && typeof param.endTime !== "number"){
                    param.endTime = Date.parse(param.endTime.replace(/-/g, '/') + ' 23:59:59');
                }
                var str = '';
                for(var k in param){
                    str += '&' + k + '=' + param[k];
                }
            }

            if(param.access_token){
                $scope.action_url = app.url.finance.downExcel + '?type=21' + (str ? str : '');
            }else{
                $scope.action_url = app.url.finance.downExcel + '?access_token=' + app.url.access_token +
                    '&groupId=' + groupId + '&type=21&month=' + flg + '&pageIndex=' + (index - 1) +
                    '&pageSize=' + length + (str ? str : '');
            }

            orderForm.attr('action', $scope.action_url);
        };

        ////////////////////////////////////////////////////////////

        // 初始化表格
        var table, dTable, keyWord, index, length;

        function initTable() {
            var start = 0;
            index = 1;
            length = utils.localData('page_length') * 1 || 10;

            var setTable = function () {
                if ($scope.isGroup) {
                    table = $('#table_of_group');
                } else {
                    table = $('#table_of_doctor');
                }
                dTable = table.dataTable({
                    "draw": index,
                    "displayStart": start,
                    "lengthMenu": [5, 10, 15, 20, 30, 40, 50, 100],
                    "pageLength": length,
                    "bServerSide": true,
                    "sAjaxSource": url,
                    "fnServerData": function (sSource, aoData, fnCallback) {
                        if(param.startTime && typeof param.startTime !== "number"){
                            param.startTime = Date.parse(param.startTime.replace(/-/g, '/') + ' 00:00:00');
                            /*if(!param.endTime){
                                param.endTime = new Date().getTime();
                            }*/
                        }
                        if(param.endTime && typeof param.endTime !== "number"){
                            param.endTime = Date.parse(param.endTime.replace(/-/g, '/') + ' 23:59:59');
                        }
                        param.pageIndex = index - 1;
                        param.pageSize = aoData[4]['value'];
                        param.month = flg;
                        param.groupId = groupId;
                        param.access_token = app.url.access_token;
                        $http({
                            "method": "post",
                            "url": sSource,
                            "data": param
                        }).then(function (resp) {
                            if(resp.data.resultCode != '1'){
                                modal.toast.warn(resp.data.resultMsg);
                                setSearchBar();
                                return;
                            }
                            resp = resp.data.data;
                            for (var i = 0; i < resp.pageData.length; i++) {
                                utils.extendHash(resp.pageData[i], ["doctorName", "telephone", "orderType", "orderTypeName", "money", "orderNo", "shareMoney"]);
                            }
                            resp.start = resp.start;
                            resp.recordsTotal = resp.total;
                            resp.recordsFiltered = resp.total;
                            resp.length = resp.pageSize;
                            resp.data = resp.pageData;
                            fnCallback(resp);
                            $scope.loading = false;
                            $rootScope.loaded = true;
                        }, function(resp){
                            modal.toast.error(resp.data.resultMsg);
                        });
                    },
                    "searching": $scope.isGroup ? false : true,
                    "language": app.lang.datatables.translation,
                    "createdRow": function (nRow, aData, iDataIndex) {
                        var a_link = $(nRow).find('.a-link');
                        a_link.click(function () {
                            //$scope.seeDetails(aData.doctorId);
                        });
                    },
                    "columns": $scope.isGroup ? [{
                        "data": "childName",
                        "orderable": false,
                        "searchable": false
                    }, {
                        "data": "telephone",
                        "orderable": false,
                        "searchable": false
                    }, {
                        "data": "typeName",
                        "orderable": false,
                        "searchable": false,
                        /*"render": function (set, status, dt) {
                            return set == '1' ? '咨询套餐' : set == '2' ? '报到套餐' : set == '3' ? '门诊套餐' : set == '4' ? '健康关怀套餐' : set == '5' ? '随访套餐' : '直通车套餐';
                        }*/
                    }, {
                        "data": "orderNO",
                        "orderable": false,
                        "searchable": false
                    }, {
                        "data": "createDate",
                        "orderable": false,
                        "searchable": false,
                        "render": function (set, status, dt) {
                            if (set && set.length !== 0) {
                                return utils.dateFormat(set, 'yyyy年MM月dd日，hh点mm分');
                            } else {
                                return '';
                            }
                        }
                    }, {
                        "data": "orderMoney",
                        "orderable": false,
                        "searchable": false,
                        "render": function (set, status, dt) {
                            return (set / 100).toFixed(2);
                        }
                    }, {
                        "data": "money",
                        "orderable": false,
                        "searchable": false,
                        "render": function (set, status, dt) {
                            return (set / 100).toFixed(2);
                        }
                    }] : [{
                        "data": "doctorName",
                        "orderable": false,
                        "searchable": false,
                        "render": function (set, status, dt) {
                            return '<a class="a-link">' + set + '</a>';
                        }
                    }, {
                        "data": "telephone",
                        "orderable": false,
                        "searchable": false
                    }, {
                        "data": "finishedMoney",
                        "orderable": false,
                        "searchable": false,
                        "render": function (set, status, dt) {
                            return (set / 100).toFixed(2);
                        }
                    }, {
                        "data": "unfinishedMoney",
                        "orderable": false,
                        "searchable": false,
                        "render": function (set, status, dt) {
                            return (set / 100).toFixed(2);
                        }
                    }]
                });

                function setSearchBar(){
                    if ($scope.isGroup && flg && flg != '0') {
                        var table_warp = orderForm.appendTo($('#table_of_group_wrapper').children(".row:nth-child(1)")
                            .children(".col-sm-6:nth-child(1)").attr('class', 'col-md-2').next().attr('class', 'col-md-10'));

                        uiLoad.load(JQ_CONFIG.dateTimePicker).then(function () {
                            var now = new Date();
                            var start_time = $("#start_time").datetimepicker({
                                format: "yyyy-mm-dd",
                                initialDate: new Date(),
                                startView: 2,
                                minView: 2,
                                autoclose: true,
                                keyboardNavigation: true,
                                todayBtn: false,
                                language: 'zh-CN'
                            }).on('show', function (e) {
                                //start_time.datetimepicker('setEndDate', now);
                                //$('.datetimepicker').find('thead th').css({'height': 0, 'padding': 0, 'font-size': 0});
                            }).on('changeDate', function () {
                                end_time.datetimepicker('setStartDate', $(this).val());
                                $scope.startTime = $(this).val();
                                $scope.$apply();
                            });

                            var end_time = $("#end_time").datetimepicker({
                                format: "yyyy-mm-dd",
                                initialDate: new Date(),
                                startView: 2,
                                minView: 2,
                                autoclose: true,
                                keyboardNavigation: true,
                                todayBtn: false,
                                language: 'zh-CN'
                            }).on('show', function (e) {
                                end_time.datetimepicker('setEndDate', now);
                            }).on('changeDate', function () {
                                start_time.datetimepicker('setEndDate', $(this).val());
                                $scope.endTime = $(this).val();
                                $scope.$apply();
                            });
                        });
                    }
                }

                function submit() {
                    $scope.searching = true;
                    param = {
                        upGroup: groupId
                    };

                    if (!(/\D/g.test(keyWord)) && keyWord.length === 11) {
                        param.telephone = keyWord;
                    } else {
                        param.name = keyWord;
                    }

                    url = app.url.finance.gdIncomeList;
                    dTable.fnDestroy();
                    initTable();
                }

                if (!$scope.isGroup) {
                    var table_of_doctor_filter = $('#table_of_doctor_filter'),
                        _form = $('<form></form>'),
                        _lbl = table_of_doctor_filter.addClass('group-search').children('label').append(_i),
                        _i = $('<i ng-show="loaded" class="fa icon-magnifier"></i>'),
                        _ipt = _lbl.find('input').attr('placeholder', '搜索...').attr('autocomplete', 'off'),
                        _timer = 0,
                        _temp = '',
                        isSearching = false;

                    table_of_doctor_filter.append(_form);
                    _form.append(_lbl);
                    _lbl.html('').append(_ipt).append(_i);
                    _ipt.focus(function () {
                        _timer = setInterval(function () {
                            var val = $.trim(_ipt.val());
                            if (val) {
                                isSearching = true;
                                _i.removeClass('icon-magnifier').addClass('fa-times-circle');
                                keyWord = _temp = val;
                            } else {
                                isSearching = false;
                                _i.removeClass('fa-times-circle').addClass('icon-magnifier');
                                if (_temp && !val) {
                                    $scope.searching = false;
                                    keyWord = _temp = '';
                                    start = length * (index - 1);
                                    //dTable.fnDestroy();

                                    param = {
                                        upGroup: groupId
                                    };
                                    //url = app.url.finance.gdIncomeList;
                                    //initTable();
                                }
                            }
                        }, 100);
                    });
                    _ipt.blur(function () {
                        clearInterval(_timer);
                    });
                    _i.click(function () {
                        isSearching = false;
                        keyWord = _temp = '';
                        _ipt.trigger('submit');
                        _ipt.val('');
                        _i.removeClass('fa-times-circle').addClass('icon-magnifier');
                        start = length * (index - 1);
                        dTable.fnDestroy();

                        param = {
                            upGroup: groupId
                        };
                        url = app.url.finance.gdIncomeList;
                        dTable.fnDestroy();
                        initTable();
                    });
                    _ipt.val(keyWord).trigger('focus');

                    utils.keyHandler(_ipt, {
                        'key13': submit
                    });
                }

                // 表格事件处理,init-初始化完成,length-改变每页长度,page-翻页,search-搜索
                dTable.off().on('init.dt', function () {
                    table.find('tr[data-id=' + $rootScope.curRowId + ']').addClass('currentRow');
                    setSearchBar();
                }).on('length.dt', function (e, settings, len) {
                    index = 1;
                    start = 0;
                    length = len;
                    dTable.fnDestroy();
                    setTable();
                    utils.localData('page_length', len);
                }).on('page.dt', function (e, settings) {
                    if (!isSearching) {
                        index = settings._iDisplayStart / length + 1;
                    }
                });
            };

            setTable();
        }

        initTable();

    }]);