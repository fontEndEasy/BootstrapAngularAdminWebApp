'use strict';

app.controller('VNurse', ['$scope', '$http', '$state', '$rootScope', 'utils', 'uiLoad', 'JQ_CONFIG', '$compile',
    function ($scope, $http, $state, $rootScope, utils, uiLoad, JQ_CONFIG, $compile) {
        $scope.isPass = true;
        uiLoad.load(JQ_CONFIG.dateTimePicker).then(function () {
            $(".form_datetime").datetimepicker({
                format: "yyyy-mm-dd",
                autoclose: true,
                pickerPosition: "bottom-left",
                minView: 2,
                todayBtn: false,
                language: 'zh-CN'
            });
        });

        $scope.authError = null;
        $scope.formData = {};
        $scope.viewData = {};
        $scope.viewData.doctorPortrait = $rootScope.curDoctorPic || utils.localData('curDoctorPic');

        var access_level = 0;
        var target = null;

        var id = '';
        if ($scope.details) {
            id = $scope.details.id;
            if (!utils.localData('idVal', id)) {
                console.error('数据未保存！');
            }
        } else {
            id = utils.localData('idVal');
            if (!id) {
                console.error('无有效数据！');
                return;
            }
        }

        // 获取要审核的医生数据
        $http({
            url: app.url.admin.check.getDoctor,
            data: {
                id: id,
                access_token: app.url.access_token
            },
            method: 'POST'
        }).then(function (dt) {
            dt = dt.data.data;
            if (dt.resultMsg === 1) {
                $scope.authError = '当前医生正在被其它人审核！';
            }
            $scope.formData = {
                userId: dt.userId,
                departments: dt.departments,
                hospital: dt.hospital,
                hospitalId: dt.hospitalId,
                title: dt.title
            };
            $scope.viewData = {
                name: dt.name || ' ',
                telephone: dt.telephone || ' '
            };
            getDoctorTitle();
        });

        // 获取要医生证件图片
        $http.get(app.url.upload.getCertPath + '?' + $.param({
                userId: id,
                access_token: app.url.access_token
            })
        ).then(function (dt) {
                dt = dt.data.data;
                if (dt && dt.length > 0) {
                    $scope.imgs = dt;
                } else {
                    $scope.imgs = false;
                }
            });

        var key = null,
            data = null,
            search = null,
            val = '',
            areaId = [],
            curClickItem;

        // 创建‘医疗机构、科室’数据列表
        function initList(param) {
            $http({
                url: param.url,
                data: param.data,
                method: param.method
            }).then(function (dt) {
                var route = $('#list_route'),
                    panel = $('#eara_panel'),
                    search = $('#search_input'),
                    lastUl = null;

                if (dt.data.resultCode !== 1) {
                    var lnks = route.find('a');
                    var w = 0;
                    for (var i = 0; i < lnks.length; i++) {
                        w += lnks.eq(i).width();
                    }
                    if (w > route.width()) {
                        route.animate({"scrollLeft": w - route.width() + 50}, 300);
                    }
                    return;
                } else {
                    if (dt.data.data.length === 0 && access_level !== 4) {
                        target.find('i').css('visibility', 'hidden');
                        container.find('button[type=submit]').removeClass('disabled');
                        return;
                    }
                }

                data = dt.data.data;
                function makeList(data) {
                    var len = data.length;
                    var ul = $('<ul class="eara-list"></ul>');

                    if (access_level % 2 === 0) {
                        ul.addClass('bg-even');
                    } else {
                        ul.addClass('bg-odd');
                    }
                    ul.data('level', access_level);
                    //ul.className = 'eara-list';
                    for (var i = 0; i < len; i++) {
                        var li = $('<li></li>');
                        li.data(param.key, data[i][param.key]);
                        li.data('name', data[i]['name']);

                        // 点击展开下一层列表
                        li.click(function () {

                            route.find('.route-link').eq(3).remove();
                            search.val('');
                            $(this).parent().nextAll().remove();
                            access_level = $(this).parent().data('level');
                            if (key) {
                                key = 'code';
                            }

                            // (Link) 选择到的区域路线
                            var link = $('#link_' + access_level);

                            if (link.length > 0) {
                                link.nextAll().remove();
                            } else {
                                link = $('<a href class="route-link"></a>');
                                link.attr('id', 'link_' + access_level);
                            }
                            link.html($(this).data('name'));
                            route.append(link);

                            link.data('offsetTop', panel.scrollTop());
                            link.data('offsetLeft', panel.scrollLeft());
                            link.off().on('click', function () {
                                var top = $(this).data('offsetTop') * 1;
                                var left = $(this).data('offsetLeft') * 1;
                                panel.scrollTop(top).scrollLeft(0);
                            });
                            // (End Link)

                            var data_key = $(this).data(param.key);
                            if (access_level % 2 === 0) {
                                $(this).siblings().removeClass('item-odd');
                                $(this).addClass('item-odd');
                            } else {
                                $(this).siblings().removeClass('item-even');
                                $(this).addClass('item-even');
                            }

                            // (Path) 设置API
                            if (access_level === 3) {
                                var url = app.url.admin.check.getHospitals;
                                key = 'id';
                            } else {
                                var url = param.url;
                                key = null;
                            }
                            // (End Path)

                            // 最终的目标标签
                            if ((access_level === 4) ||
                                (param.key !== 'code' && access_level === 2)) {
                                container.find('button[type=submit]').removeClass('disabled');
                            } else {
                                container.find('button[type=submit]').addClass('disabled');
                            }

                            target = $(this); // 保存当前被点击的对象

                            if (data_key) {
                                initList({
                                    url: url,
                                    data: {
                                        id: data_key,
                                        access_token: app.url.access_token
                                    },
                                    method: 'POST',
                                    key: key || param.key
                                });
                            }

                            if(access_level === 4){
                                curClickItem = $(this);
                            }
                            areaId[access_level - 2] = data_key;
                        });

                        var str = '<a href class="auto">' +
                            ((access_level === 4) ||
                            (param.key !== 'code' && access_level === 2) ? '' :
                            '<span class="pull-right text-muted">' +
                            '<i class="fa fa-fw fa-angle-right text"></i>' +
                            '</span>') +
                            '<span>' + data[i]['name'] + '</span>' +
                            '</a>';
                        li.html(str);
                        ul.append(li);
                    }

                    if(access_level === 4){
                        var li = $('<li class="edit-item"></li>');
                        var edit_btn = $('<button type="submit" class="add-btn">添加医院</button>');
                        var edit_ipt = $('<input type="text"/>');
                        var timer = 0, tempKey = '';
                        li.append(edit_btn);
                        ul.append(li);

                        var addData = function(){
                            $http({
                                url: app.url.admin.check.addHospital,
                                method: 'post',
                                data: {
                                    access_token: app.url.access_token,
                                    provinceId: areaId[0],
                                    cityId: areaId[1],
                                    countryId: areaId[2],
                                    name: edit_ipt.val()
                                }
                            }).then(function(resp){
                                if(resp.data.resultCode === 1){
                                    curClickItem.trigger('click');
                                }else{
                                    alert(resp.data.resultMsg);
                                }
                            });

                            edit_btn.off();
                        };
                        var addCancel = function(){
                            edit_btn.removeClass('ok-btn');
                            edit_btn.one('click', editData);
                            edit_ipt.off();
                            edit_ipt.parent().remove();
                            edit_btn.html('添加医院');

                            edit_btn.off();
                            edit_btn.one('click', editData);
                        };

                        var iptFocus = function(){
                            clearInterval(timer);
                            timer = setInterval(function(){
                                var _key = $.trim(edit_ipt.val());
                                if(tempKey !== _key && _key) {
                                    edit_btn.off();
                                    edit_btn.one('click', addData);
                                    edit_btn.html('确 定');
                                    tempKey = _key;
                                }else if(tempKey !== _key && (!_key && _key != '0')){
                                    edit_btn.off();
                                    edit_btn.html('取 消');
                                    edit_btn.one('click', addCancel);
                                }
                            }, 100);
                        };

                        var iptBlur = function(){
                            clearInterval(timer);
                            //edit_btn.off();
                        };

                        var editData = function(){
                            $(this).addClass('ok-btn').html('取 消');
                            li.append($('<div></div>').append(edit_ipt));
                            edit_ipt.bind('focus', iptFocus);
                            edit_ipt.bind('blur', iptBlur);
                            edit_btn.one('click', addCancel);
                            edit_ipt.trigger('focus');
                        };

                        edit_btn.one('click', editData);

                    }
                    panel.append(ul);
                    lastUl = panel.find('.eara-list').last();
                }

                makeList(data);
                var isLast = true;

                search.off().on('keydown', function () {
                    setTimeout(function () {
                        val = search.val();
                        if (!val.match(/\S+/g)) {
                            lastUl.remove();
                            isLast = true;
                            makeList(data);
                            return;
                        }
                        var len = data.length,
                            keys = val.split(/\s+/),
                            isMatched = false,
                            dts = [];

                        for (var i = 0; i < len; i++) {
                            isMatched = true;
                            for (var j = 0; j < keys.length; j++) {
                                if (data[i].name.search(keys[j]) === -1) {
                                    isMatched = false;
                                }
                            }
                            if (isMatched) {
                                dts.push(data[i]);
                            }
                        }
                        if (dts.length !== 0) {
                            if (isLast) {
                                panel.find('.eara-list').last().remove();
                            }
                            isLast = true;
                            makeList(dts);
                        } else {
                            if (keys.length !== 0) {
                                lastUl.remove();
                                isLast = false;
                            } else {
                                lastUl.remove();
                                isLast = true;
                                makeList(data);
                            }
                        }
                    }, 200);
                });

                var uls = panel.find('.eara-list');
                var links = route.find('a');
                var w1 = 0, w2 = 0;
                for (var i = 0; i < uls.length; i++) {
                    w1 += uls.eq(i).width();
                }
                for (var i = 0; i < links.length; i++) {
                    w2 += links.eq(i).width();
                }
                if (w1 > panel.width()) {
                    panel.animate({"scrollLeft": w1 - panel.width() + 25}, 300);
                }
                panel.animate({"scrollTop": 0}, 300);
                if (w2 > panel.width()) {
                    route.animate({"scrollLeft": w2 - panel.width() + 50}, 300);
                }
                panel.animate({"scrollTop": 0}, 300);
            });

            access_level++;
        }

        var chooseBtn = $('#chooseBtn');
        var step, firstTime = true;

        // 提交并更新数据
        $scope.submit = function () {
            var chk_pass = $('#pass'),
                chk_nopass = $('#nopass'),
                formParam = {},
                remark = $('.check-items input:checked').siblings('span'),
                isPass = true;

            if (remark.length > 0) {
                $scope.formData.remark = remark.html();
            } else {
                $scope.formData.remark = $scope.viewData.remarkNopass;
            }
            $scope.formData.access_token = app.url.access_token;


            // 选择url，并组装提交参数
            if (chk_pass.prop('checked')) {
                var url = app.url.admin.check.checked;
                formParam = {
                    userId: $scope.formData.userId,
                    title: $scope.formData.title,
                    hospitalId: $scope.formData.hospitalId,
                    hospital: $scope.formData.hospital,
                    departments: $scope.formData.departments,
                    licenseExpire: $scope.formData.licenseExpire,
                    licenseNum: $scope.formData.licenseNum,
                    access_token: app.url.access_token
                };
                isPass = true;
            } else {
                var url = app.url.admin.check.fail;
                formParam = {
                    userId: $scope.formData.userId,
                    title: $scope.formData.title,
                    hospitalId: $scope.formData.hospitalId,
                    hospital: $scope.formData.hospital,
                    departments: $scope.formData.departments,
                    remark: $scope.formData.remark,
                    access_token: app.url.access_token
                };
                isPass = false;
            }

            $http.post(url, formParam).then(function (resp) {
                if (resp.data.resultCode === 1) {
                    // 更新界面中的数据
                    if (isPass) {
                        $('#check_pass').html(utils.localData('check_pass') * 1 + 1);
                    } else {
                        $('#check_nopass').html(utils.localData('check_nopass') * 1 + 1);
                    }
                    $state.go('app.check_list_undone');
                } else {
                    $scope.authError = resp.data.resultMsg;
                }
            }, function (x) {
                $scope.authError = '服务器错误！';
            });


        };

        var mask = $('<div class="mask"></div>'),
            container = $('#dialog-container'),
            doIt = function () {
            };

        // 执行操作
        $rootScope.do = function () {
            doIt();
        };

        // 不操作返回
        $scope.return = function () {
            $rootScope.ids = [];
            window.history.go(-1);
        };

        // (Search) 医疗机构搜索
        var hospital = $('#hospital_ipt');
        var departments = $('#departments_ipt');
        hospital.on('focus', function () {
            searchByKey($(this), 'focus', 'hospital', app.url.admin.check.getHospitals);
        }).on('blur', function () {
            searchByKey($(this), 'blur');
        });
        departments.on('focus', function () {
            searchByKey($(this), 'focus', 'depts', app.url.admin.check.getDepts);
        }).on('blur', function () {
            searchByKey($(this), 'blur');
        });

        var doReturn = false,
            curIpt = null,
            isBlured = false;
        $('body').on('mousedown', function (e) {
            var evt = e || window.event;
            var target = evt.target || evt.srcElement;
            if (target.nodeName.toLowerCase() === 'ul' && $(target).hasClass('data-list')) {
                doReturn = true;
            } else {
                if (curIpt && target !== curIpt[0]) {
                    doReturn = false;
                    isBlured = true;
                    curIpt.trigger('blur');
                } else {
                    isBlured = false;
                }
            }
        });

        function searchByKey(ipt, satus, type, url) {
            var isFocused = false,
                val = '';

            curIpt = ipt;
            switch (satus) {
                case 'focus':
                    var dataList = $('<ul class="data-list none"></ul>');

                    ipt.parent().append(dataList);
                    isFocused = true;
                    var len = 0,
                        idx = 0,
                        lis = null,
                        ulHg = 0,
                        liHg = 0,
                        top = 0;

                    $(document).off('keydown').on('keydown', function (e) {
                        var evt = e || window.event;
                        var keyCode = evt.keyCode;
                        var scTop = dataList.scrollTop();

                        if (isFocused) {
                            switch (keyCode) {
                                case 38:  // 向上选择
                                    if (len === 0) return;
                                    if (idx >= 1) {
                                        idx--;
                                    } else {
                                        idx = len - 1;
                                        dataList.scrollTop((len - 1) * liHg);
                                    }
                                    lis.eq(idx).addClass('cur-li').siblings().removeClass('cur-li');
                                    if (liHg * (idx) < scTop) {
                                        top = liHg * (idx);
                                        dataList.scrollTop(top);
                                    }

                                    ipt.val(val = lis.eq(idx).html());
                                    if (type === 'hospital') {
                                        $scope.formData.hospitalId = lis.eq(idx).data('id');
                                        $scope.formData.hospital = lis.eq(idx).html();
                                    } else {
                                        $scope.formData.departments = lis.eq(idx).html();
                                    }
                                    break;
                                case 40:  // 向下选择
                                    if (len === 0) return;
                                    if (idx < len - 1) {
                                        idx++;
                                    } else {
                                        idx = 0;
                                        dataList.scrollTop(0);
                                    }
                                    lis.eq(idx).addClass('cur-li').siblings().removeClass('cur-li');
                                    if (liHg * (idx + 1) > ulHg + scTop) {
                                        top = liHg * (idx + 1) - ulHg;
                                        dataList.scrollTop(top);
                                    }

                                    ipt.val(val = lis.eq(idx).html());
                                    if (type === 'hospital') {
                                        $scope.formData.hospitalId = lis.eq(idx).data('id');
                                        $scope.formData.hospital = lis.eq(idx).html();
                                    } else {
                                        $scope.formData.departments = lis.eq(idx).html();
                                    }
                                    break;
                                case 13:  // 回车确认
                                    if (len === 0) return;

                                    ipt.val(val = lis.eq(idx).html());
                                    if (type === 'hospital') {
                                        $scope.formData.hospitalId = lis.eq(idx).data('id');
                                        $scope.formData.hospital = lis.eq(idx).html();
                                    } else {
                                        $scope.formData.departments = lis.eq(idx).html();
                                    }

                                    setTimeout(function () {
                                        ipt.trigger('blur');
                                        dataList.remove();
                                    }, 200);
                                    break;
                                default:  // 其它按键，正常输入
                                    dataList.scrollTop(0);
                                    idx = 0;
                                    setTimeout(function () {
                                        var v = $.trim(ipt.val());
                                        if (val !== v && /\S+/.test(v)) {
                                            val = v;

                                            $http({
                                                url: url,
                                                data: {
                                                    name: val,
                                                    access_token: app.url.access_token
                                                },
                                                method: 'POST'
                                            }).then(function (resp) {
                                                var dt = resp.data.data,
                                                    liStr = '';
                                                len = dt.length;
                                                if (len > 0) {
                                                    for (var i = 0; i < len; i++) {
                                                        liStr += '<li data-id="' + dt[i].id + '">' + dt[i].name + '</li>';
                                                    }
                                                    ulHg = dataList.removeClass('none').html(liStr).height();
                                                    lis = dataList.find('li');

                                                    // 点击选择
                                                    lis.on('click', function () {
                                                        if (type === 'hospital') {
                                                            $scope.formData.hospitalId = $(this).data('id');
                                                            $scope.formData.hospital = $(this).html();
                                                        } else {
                                                            $scope.formData.departments = $(this).html();
                                                        }

                                                        ipt.val(val = $(this).html());

                                                        setTimeout(function () {
                                                            ipt.trigger('blur');
                                                            dataList.remove();
                                                        }, 200);
                                                    });
                                                    liHg = lis.eq(idx).addClass('cur-li').height();
                                                } else {
                                                    setTimeout(function () {
                                                        dataList.html('');
                                                        dataList.addClass('none');
                                                    }, 200);
                                                }
                                            });
                                        } else if (!/\S+/.test(v)) {
                                            val = v;
                                            dataList.html('');
                                            dataList.addClass('none');
                                        }
                                    }, 500);
                                    break;
                            }
                        } else {
                            dataList.remove();
                        }
                    });
                    break;
                case 'blur':
                    if (!doReturn) {
                        setTimeout(function () {
                            isFocused = false;
                            ipt.siblings().remove();
                            if (!isBlured) {
                                $(document).off('keydown');
                            }
                            val = '';
                        }, 200);
                    }
                    break;
                default:
                    break;
            }
        }

        // (End Search)

        $scope.choose = function (idx, txt) {
            var header = $('<div class="list-header"></div>'),
                route = $('<div id="list_route"></div>'),
                search = $('<div class="data-search"><div><input id="search_input" type="text"/><i class="fa icon-magnifier"></i></div></div>'),
                panel = $('<div id="eara_panel"></div>');

            header.append(route);
            header.append(search);
            access_level = 0;
            container.find('button[type=submit]').addClass('disabled');
            mask.insertBefore(container);
            container.find('.form-content').addClass('def-border').html('').append(header).append(panel);

            // (Url) 根据不同的API做不同的操作
            if (txt === 'hospital') {
                var url = app.url.admin.check.getArea;
                var _key = 'code';
                $rootScope.pop_title = '选择医疗机构';
            } else {
                var url = app.url.admin.check.getDepts;
                var _key = 'id';
                $rootScope.pop_title = '选择科室';
            }
            var param = {
                url: url,
                data: {
                    access_token: app.url.access_token
                },
                method: 'POST',
                key: _key
            };
            initList(param);

            container.removeClass('none');

            doIt = function () {
                if (access_level === 5) {
                    $scope.formData.hospitalId = target.data('id');
                    $scope.formData.hospital = target.data('name');
                } else if (access_level === 3 || access_level === 2) {
                    $scope.formData.departments = target.data('name');
                }
                access_level = 0;
                mask.remove();
                container.addClass('none');
            };
        };

        // 模态框退出
        $rootScope.cancel = function () {
            mask.remove();
            container.addClass('none');
        };

        function getDoctorTitle(){
            $http.post(app.url.admin.check.getTitles, {
                access_token: app.url.access_token
            }).then(function (resp) {
                var dt = resp.data.data;
                if (dt.length > 0) {
                    initChosen(dt);
                } else {
                    $scope.authError = '数据有误！';
                }
            }, function (x) {
                $scope.authError = '服务器错误！';
            });
        }

        // 下拉框 chosen
        function initChosen(dt) {
            var select = $('#doctor_title');
            var len = dt.length;
            var tmp = $('<select></select>');
            var isExist = false;
            for (var i = 0; i < len; i++) {
                var opt = $('<option>' + dt[i]['name'] + '</option>');
                if ($scope.formData.title === dt[i]['name']) {
                    isExist = true;
                }
                tmp.append(opt);
            }
            if (!isExist) {
                opt = $('<option>' + $scope.formData.title + '</option>');
                tmp.prepend(opt);
            }
            select.html(tmp.html());
            select.on('change', function (e) {
                $scope.formData['title'] = $(this).val();
            });
            select.val($scope.formData.title);
            //$scope.formData['title'] = select.val();
        }

        setTimeout(function () {
            var preview = $('#gl_preview img');
            var points = $('#gl_point a');
            preview.attr('src', points.eq(0).find('img').addClass('cur-img').attr('src'));
            points.click(function () {
                var _img = $(this).find('img');
                preview.attr('src', _img.attr('src'));
                _img.addClass('cur-img');
                $(this).siblings().find('img').removeClass('cur-img');
            });

            var chk_pass = $('#pass');
            var chk_nopass = $('#nopass');
            var is = $('.required-items i');
            var ipts = $('.required-items input');
            var btn = $('form button[type=submit]');
            var other = $('#other_remark');
            var txtr = $('#remarkNopass');
            var timer_a, timer_b;
            chk_nopass.change(function () {
                if (chk_nopass.prop('checked')) {
                    is.addClass('none');
                    ipts.removeAttr('required');
                    if (!other.prop('checked')) {
                        btn.removeAttr('disabled');
                    }
                    if (!timer_a) {
                        timer_a = setInterval(function () {
                            if (other.prop('checked')) {
                                if (/\S/g.test(txtr.val())) {
                                    btn.removeAttr('disabled');
                                } else {
                                    btn.attr('disabled', true);
                                    clearInterval(timer_b);
                                    if (!timer_b) {
                                        timer_b = setInterval(function () {
                                            if (/\S/g.test(txtr.val())) {
                                                btn.removeAttr('disabled');
                                            } else {
                                                btn.attr('disabled', true);
                                            }
                                        }, 500);
                                    }
                                }
                            } else {
                                clearInterval(timer_b);
                                timer_b = null;
                                btn.removeAttr('disabled');
                            }
                        }, 1000);
                    }
                } else {
                    clearInterval(timer_a);
                    timer_a = null;
                }
            });
            chk_pass.change(function () {
                clearInterval(timer_a);
                clearInterval(timer_b);
                timer_a = timer_b = null;
                if (chk_pass.prop('checked')) {
                    is.removeClass('none');
                    ipts.attr('required', true);
                    btn.attr('disabled', true);
                }
            });
        }, 500);

    }
]);
