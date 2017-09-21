(function(window, undefined) {
    'use strict';

    var isCommonjs = typeof module !== 'undefined' && module.exports;
    var keyboardAllowed = typeof Element !== 'undefined' && 'ALLOW_KEYBOARD_INPUT' in Element;

    var DataBox = function(id, settings) {
        this.settings = settings;
        this.targets = [];
        this.fixdata = [];
        this.targetsId = [];
        this.tempId = [];
        this.tags = [];
        this.tagsId = [];
        this.unionId = [];
        this.hasSub = false;
        this.isTrigger = true;
        this.dataKey = this.deepClone(this.settings.datakey);
        this.init(id, this.settings);
        return this;
    };

    DataBox.prototype = {

        init: function(id, set) {
            var that = this;

            if (set.fixdata && set.fixdata.length > 0) {
                var len = set.fixdata.length;
                for (var i = 0; i < len; i++) {
                    this.fixdata.push(set.fixdata[i]);
                    this.targetsId.push(set.fixdata[i].id);
                }
                // this.targets = this.fixdata;
            }
            this.targets = this.fixdata;
            var targets = this.fixdata,
                l = targets.length;

            for (var i = 0; i < l; i++) {
                this.tempId.push(targets[i].id);
            }

            if (!set.events) {
                set.events = {};
                set.events.click = click;
                if (set.unionSelect) {
                    //set.events.mouseenter = mouseEnter;
                    //set.events.mouseleave = mouseLeave;
                }
            }

            set.events.callback = function() {
                var dts = that.treeObj.getTree().find('dt'),
                    len = dts.length,
                    ln = that.targetsId.length,
                    dt = $();

                if (set.hasCheck && set.selectView) {
                    for (var i = 0; i < ln; i++) {
                        for (var j = 0; j < len; j++) {
                            dt = dts.eq(j);
                            if (dt.data('info').id === that.targetsId[i]) {
                                dt.trigger('click');
                            }
                        }
                    }
                }

                function _getData(url, param, pNode) {
                    var dt = {
                        access_token: app.url.access_token,
                        groupId: groupId
                    };
                    $.extend(dt, param);
                    $http({
                        url: url,
                        method: 'post',
                        data: dt
                    }).then(function(resp) {
                        if (resp.data.resultCode === 1 && resp.data.data) {
                            var _dt = resp.data.data;
                            that.treeObj.insertNodes(pNode, _dt); // 请求到数据后，把新节点插入
                            that.treeObj.initCheckStatus();
                        } else {
                            console.warn("获取未分配数据失败！");
                        }
                    }, function(x) {
                        console.error(x.statusText);
                    });
                }

                var n = 1;
                while (n--) {
                    var dl = $('<dl class="cnt-list-warp"></dl>');
                    var dt = $('<dt></dt>');
                    var dd = $('<dd></dd>');
                    var iArrow = $('<i class="fa fa-caret-right"></i>');
                    var iIcon = $('<i class="fa-fw"></i>');
                    var span = $('<span></span>');
                    if (n === 1) {
                        iIcon.addClass('fa fa-bookmark');
                        span.html('未分配');
                    }

                    dt.append(iIcon).append(span);
                    dl.append(dt);
                    that.treeObj.treeWrapper.append(dl);

                    dt.data('info', {
                        id: 'idx_' + n
                    });

                    var cur_div, tTop = that.treeObj.treeWrapper.offset().top + 1;
                    // 设置‘待审核’、‘已离职’列表数目

                    dt.bind('click', function(e) {
                        var evt = e || window.event;
                        evt.stopPropagation();
                        if (that.treeObj.treeWrapper.find('.cur-back-line').length === 0) {
                            cur_div = $('<div class="cur-back-line"></div>');
                            that.treeObj.treeWrapper.append(cur_div);
                        } else {
                            cur_div = that.treeObj.treeWrapper.find('.cur-back-line');
                        }
                        that.treeObj.treeWrapper.find('.cur-line').removeClass('cur-line');
                        $(this).addClass('cur-line');
                        tTop = that.treeObj.treeWrapper.offset().top + 1;
                        cur_div.css('top', $(this).offset().top - tTop);
                        _getData(app.url.yiliao.getUndistributed, {}, dl);
                    });

                    // 鼠标停留时
                    var div;
                    dt.hover(function() {
                        tTop = that.treeObj.treeWrapper.offset().top + 1;
                        div = $('<div class="back-line"></div>');
                        div.css('top', $(this).offset().top - tTop);
                        that.treeObj.treeWrapper.append(div);
                    }, function() {
                        div.remove();
                    });
                }
            };

            if (!window.Tree) {
                alert('The "Tree" companent is not loaded!');
                return;
            }

            var mask = $('<div class="mask"></div>');
            var templete =
                '<div class="dialog-heading font-bold text-center">' + (set.titles ? set.titles.main : "选择数据") + '</div>' +
                '<div class="dialog-body ' + (set.search || set.selectView ? 'select-view' : '') + '">' +
                '<div class="' + (set.search || set.selectView ? 'search-ipt' : '') + '">' +
                (set.search ? '<div class="search-form ' + (set.selectView ? 'dialog-bar' : '') + '"><input id="keys_ipt" autocomplete="off" placeholder=' + (set.titles ? set.titles.searchKey : "关键字") + ' class="form-control"/><i id="btn_search" class="fa icon-magnifier"></i></div>' : '') +
                (set.selectView ? '<div class="data-num">' + (set.titles ? set.titles.label : "已选择个数") + ':<span id="data_num">20</span></div>' : '') +
                '</div>' +
                (set.selectView ? '<div class="box-r"><div id="data_box" class="data-box"></div></div>' : '') +
                '<div class="box-l">' +
                '<div id="data_res"><div class="loading"><i class="glyphicon glyphicon-repeat"></i></div></div>' +
                '</div>' +
                '</div>' +
                '<div class="dialog-opr-bar clear">' +
                '<div class="col-md-offset-2 col-md-4" id="opr_ok"></div>' +
                '<div class="col-md-4" id="opr_cancal"></div>' +
                '</div>';

            var container = $('<div></div>');
            container.addClass('dialog-container animating fade-in-down').html(templete);

            $('body').append(mask).append(container);
            container.css('margin-left', -(container.width() / 2));

            that.treeObj = new Tree(id, set, this.fixdata);

            var oprOk = $('#opr_ok');
            var oprCancal = $('#opr_cancal');
            var btn_ok = $('<button type="button" class="w100 btn btn-success">确 定</button>');
            var btn_cancel = $('<button type="button" class="w100 btn btn-default">取 消</button>');
            var btn_search = $('#btn_search');
            var keys_ipt = $('#keys_ipt');
            var leafDepth = set.leafDepth;
            var timer = 0;
            var tempKey = '';
            var isSearching = false;

            this.data_num = $('#data_num').html(this.targets.length);

            oprOk.append(btn_ok);
            oprCancal.append(btn_cancel);

            //btn_search.click(btnSearch);

            keys_ipt.focus(function() {
                timer = setInterval(function() {
                    var _key = $.trim(keys_ipt.val());

                    if (tempKey !== _key && (!_key && _key != '0')) {
                        set.loadDisabled = false;
                        that.settings.search.unwind = false;
                        that.treeObj.setLeafDepth(leafDepth);
                        that.treeObj.setTree(that.treeObj.getSourceData());
                        tempKey = _key;
                        isSearching = false;
                        btn_search.removeClass('fa-times-circle').addClass('icon-magnifier');
                    } else if (tempKey !== _key && _key) {
                        isSearching = true;
                        btn_search.removeClass('icon-magnifier').addClass('fa-times-circle');
                        btnSearch();
                    }

                }, 100);
            });

            keys_ipt.blur(function() {
                clearInterval(timer);
            });

            btn_search.click(function() {
                set.loadDisabled = false;
                isSearching = false;
                tempKey = '';
                keys_ipt.val('');
                isSearching = false;
                btn_search.removeClass('fa-times-circle').addClass('icon-magnifier');
                btnSearch();
            });

            // 组合搜到的数据
            function combineData(dt) {
                var source = that.deepCloneWithKey(that.treeObj.getSourceData(), dt);
            }

            function btnSearch() {
                var _key = $.trim($('#keys_ipt').val()),
                    sourceData = that.treeObj.getSourceData();
                tempKey = _key;
                if (_key || _key == '0') {

                    set.loadDisabled = true;

                    var dataSource = that.treeObj.getSourceData();
                    if (set.search.searchDepth) {
                        that.treeObj.setLeafDepth(leafDepth - set.search.searchDepth[0]);
                    }
                    // 异步环境下搜索
                    if (set.async) {
                        var _param = set.search.param;
                        if (set.search.keyName) {
                            _param[set.search.keyName] = _key;
                        }
                        $.ajax({
                            dataType: 'json',
                            url: set.search.url,
                            method: 'post',
                            data: _param,
                            success: function(resp) {
                                if (resp.resultCode === 1 && resp.data) {
                                    var dts = eval('resp.' + set.search.dataKey.dataSet);
                                    if (dts.length > 0) {
                                        var _dt = [];
                                        for (var i = 0; i < dts.length; i++) {
                                            var union = eval('dts[' + i + '].' + set.search.dataKey.union);
                                            if (!union) {
                                                union = set.extra[0]['id']; // 暂选第一个数据的id
                                            }
                                            if (union) {
                                                _dt[i] = {};
                                                _dt[i]['name'] = eval('dts[' + i + '].' + set.search.dataKey.name);
                                                _dt[i]['id'] = eval('dts[' + i + '].' + set.search.dataKey.id);
                                                _dt[i]['union'] = union;
                                            } else {
                                                _dt[i] = {};
                                                _dt[i]['name'] = eval('dts[' + i + '].' + set.search.dataKey.name);
                                                _dt[i]['id'] = eval('dts[' + i + '].' + set.search.dataKey.id);
                                                //return;
                                            }
                                        }
                                    }
                                    that.settings.search.unwind = true;
                                    if (_dt && _dt.length > 0) {
                                        if (union) {
                                            var _data = that.deepCloneWithKey(that.treeObj.getSourceData(), _dt);
                                        } else {
                                            var _data = _dt;
                                        }
                                        var _data = that.deepCloneWithKey(that.treeObj.getSourceData(), _dt);
                                        that.treeObj.setTree(_data);
                                    } else {
                                        that.treeObj.setTree(null);
                                    }
                                } else {
                                    that.treeObj.setTree(null);
                                }
                            },
                            error: function(resp) {
                                console.error(resp.resultMsg);
                            }
                        });
                    } else {
                        that.treeObj.setLeafDepth(leafDepth);
                        var dts = that.queryByKey(dataSource, _key, false, null, ['name'], set.search.searchDepth || null);
                        if (dts.length > 0) {
                            var _dt = [];
                            for (var i = 0; i < dts.length; i++) {
                                var union = eval('dts[' + i + '].' + set.search.dataKey.union);
                                if (!union) {
                                    union = set.extra[0]['id']; // 暂选第一个数据的id
                                }
                                if (union) {
                                    _dt[i] = {};
                                    _dt[i]['name'] = eval('dts[' + i + '].' + set.search.dataKey.name);
                                    _dt[i]['id'] = eval('dts[' + i + '].' + set.search.dataKey.id);
                                    _dt[i]['union'] = union;
                                } else {
                                    return;
                                }
                            }
                        }
                        that.settings.search.unwind = true;
                        if (_dt && _dt.length > 0) {
                            var _data = that.deepCloneWithKey(that.treeObj.getSourceData(), _dt);
                            that.treeObj.setTree(_data);
                        } else {
                            that.treeObj.setTree(null);
                        }
                        //that.treeObj.setTree(_dt);
                    }

                } else {
                    that.settings.search.unwind = false;
                    that.treeObj.setLeafDepth(leafDepth);
                    that.treeObj.setTree(sourceData);
                }
            }

            function handlerUp() {

            }

            function handlerDown() {

            }

            that.keyHandler(keys_ipt, {
                'key13': btnSearch,
                'key38': handlerUp,
                'key40': handlerDown
            });

            btn_ok.click(function(e) {
                var evt = e || window.event;
                evt.stopPropagation();
                set.response.call(null, that.targets);
                mask.remove();
                container.remove();
            });

            oprCancal.click(function(e) {
                var evt = e || window.event;
                evt.stopPropagation();
                mask.remove();
                container.remove();
            });

            if (this.fixdata.length > 0) this.insertTag(this.fixdata, true);

            function click(info) {
                var tempsAdd = that.treeObj.getTempsAdd(),
                    tempsIdAdd = that.treeObj.getTempsIdAdd(),
                    lenAdd = tempsIdAdd.length,
                    tempsSub = that.treeObj.getTempsSub(),
                    tempsIdSub = that.treeObj.getTempsIdSub(),
                    lenSub = tempsIdSub.length;

                that.hasSub = false;

                if (!!$(this).next && $(this).next().length > 0) {
                    that.hasSub = true;
                }

                if (!set.multiple) {
                    that.targets = tempsAdd;
                    return;
                }

                for (var i = 0; i < lenAdd; i++) {
                    var _idx = that.tempId.indexOf(tempsIdAdd[i]);
                    if (_idx === -1) {
                        //that.targets.push(tempsAdd[i]);
                        that.targetsId.push(tempsIdAdd[i]);
                        that.tempId.push(tempsIdAdd[i]);
                        if (!set.unionSelect || !that.hasSub) {
                            that.insertTag(tempsAdd[i], true);
                        }
                    }
                    //that.insertTag(tempsAdd[i], true);
                }

                for (var i = 0; i < lenSub; i++) {
                    var _idx = that.tempId.indexOf(tempsIdSub[i]);
                    if (_idx !== -1) {
                        //that.targets.splice(_idx, 1);
                        that.targetsId.splice(_idx, 1);
                        that.tempId.splice(_idx, 1);
                        if (!set.unionSelect || !that.hasSub) {
                            that.insertTag(tempsSub[i], false);
                        }
                    }
                    //that.insertTag(tempsSub[i], false);
                }

                if (set.unionSelect && that.hasSub) {
                    var _idx = that.unionId.indexOf(info.id);
                    if (_idx === -1) {
                        that.insertTag($(this), true);
                        that.unionId.push($(this).data('info').id);

                    } else {
                        that.insertTag($(this), false);
                        that.unionId.splice(_idx, 1);
                    }
                }

                that.setNumber();
            }

            var iMove;

            function mouseEnter(info) {
                var _this = $(this);
                if (!(_this.next().length > 0)) return;
                var cur_div = that.treeObj.tree.find('.back-line');
                iMove = $('<i class="pos-delete fa fa-arrow-right"></i>');
                $(this).append(iMove);

                iMove.click(function(e) {
                    var evt = e || window.event;
                    evt.stopPropagation();
                    if (that.settings.async) {
                        var _param = {};
                        _param.access_token = app.url.access_token;
                        for (var key in that.settings.async.data) {
                            _param[key] = that.settings.async.data[key];
                        }
                        for (var key in that.settings.async.dataKey) {
                            _param[key] = _this.data('info')[that.settings.async.dataKey[key]];
                        }
                        $.ajax({
                            dataType: 'json',
                            url: that.settings.async.url,
                            method: 'post',
                            data: _param,
                            success: function(resp) {
                                if (resp.resultCode === 1 && resp.data) {
                                    _this.isLeaf = true;
                                    e.data.pNode.data('subs', resp.data);
                                    _this.insertNodes(e.data.pNode, resp.data);
                                } else {
                                    //console.warn(resp.resultMsg);
                                    if (resp.resultCode === 1030102) {
                                        window.location.href = '#/access/signin';
                                    }
                                }
                                loading.remove();
                                setCurLine();
                            },
                            error: function(resp) {
                                console.error(resp.resultMsg);
                            }
                        });
                    } else {
                        var dts = [],
                            dt = [];
                        dts = _this.next().find('dt');
                        dts.each(function() {
                            if (!($(this).next('dd').length > 0) && that.targets.indexOf($(this).data('info')) === -1) {
                                that.targets.push($(this).data('info'));
                                that.insertTag($(this).data('info'));
                                //dt.push($(this).data('info'));
                            }
                        });
                    }
                });
            }

            function mouseLeave(id) {
                iMove.remove();
            }
        },

        setNumber: function() {
            this.data_num.html(this.treeObj.getTargets().length);
            //this.data_num.html(this.targets.length);
        },

        keyHandler: function(dom, handleObj) {
            dom = dom || window.document;
            $(dom).bind('keydown', function(e) {
                var evt = e || window.event;
                var keyCode = evt.keyCode;
                switch (keyCode) {
                    case 13:
                        handleObj['key' + keyCode]();
                        break;
                    case 37: // 左
                        handleObj['key' + keyCode]();
                        break;
                    case 38: // 上
                        handleObj['key' + keyCode]();
                        break;
                    case 39: // 右
                        break;
                    case 40: // 下
                        handleObj['key' + keyCode]();
                        break;
                    default:
                        break;
                }
            });
        },

        insertTag: function(dt, isNeed) {
            var that = this,
                dataBox = $('#data_box'),
                hasSubs = false;

            if (dt && !!dt.next && dt.next().length > 0) {
                hasSubs = true;
                dt = dt.data('info');
            }

            function makeTag(_dt, theme) {
                var span = $('<span class="label-btn ' + theme + '"></span>');
                var iEle = $('<i class="fa fa-times"></i>');
                span.html(_dt.name);
                span.append(iEle);
                dataBox.append(span);
                iEle.on('click', _dt, removeTag);
                iEle.data('id', _dt.id);
                that.tags.push(iEle);
                that.tagsId.push(_dt.id);
            }

            if (that.settings.unionSelect && hasSubs && isNeed) {
                makeTag(dt, 'btn-primary');
            } else if (isNeed) {
                if (dt.length > 0) {
                    for (var i = 0; i < dt.length; i++) {
                        makeTag(dt[i], 'btn-info');
                    }
                } else {
                    makeTag(dt, 'btn-info');
                }
                //that.isTrigger = true;
            } else {
                for (var i = 0; i < that.tags.length; i++) {
                    if (that.tags[i].data('id') == dt.id) {
                        that.isTrigger = false;
                        that.tags[i].trigger('click');
                    }
                }
            }

            function removeTag(e) {
                var evt = e || window.event,
                    _dts = that.treeObj.tree.find('dt'),
                    _len = _dts.length,
                    _idx = -1;
                evt.stopPropagation();

                // 去除选择树中相应的选中项
                if (that.isTrigger) {
                    for (var j = 0; j < _len; j++) {
                        if (_dts.eq(j).data('info').id == e.data.id) {
                            _dts.eq(j).trigger('click');
                        }
                    }
                }

                _idx = that.tagsId.indexOf(e.data.id);
                if (_idx !== -1) {
                    that.tags.splice(_idx, 1);
                    that.tagsId.splice(_idx, 1);
                }

                _idx = -1;

                $(this).parent().remove();
                that.removeTargets(e.data);
                that.isTrigger = true;
                that.setNumber();
            }
        },

        removeTargets: function(target) {
            var len = target.length,
                idx = -1;

            if (!len) {
                idx = this.targetsId.indexOf(target.id);
                if (idx !== -1) {
                    this.targets.splice(idx, 1);
                    this.targetsId.splice(idx, 1);
                }
            } else {
                for (var i = 0; i < len; i++) {
                    idx = this.targetsId.indexOf(target[i].id);
                    if (idx !== -1) {
                        this.targets.splice(idx, 1);
                        this.targetsId.splice(idx, 1);
                    }
                }
            }

            //console.log(this.targets);
            //console.log(this.settings.fixdata);
        },

        queryByKey: function(data, key, only, exclude, types, depth) {
            var value = [],
                dep = 0;
            if (!data) {
                return null;
            }

            getArrVal(data);

            function getArrVal(dt) {
                if (dt.constructor === Array) {
                    if (dt.length > 0) {
                        var len = dt.length;
                        for (var i = 0; i < len; i++) {
                            if (dt[i].constructor === Object) {
                                getArrVal(dt[i]);
                            } else {
                                if (depth && depth.indexOf(dep) == -1) break;
                                if ((dt[i] + '').search(new RegExp(key, 'ig')) !== -1) {
                                    if (only) {
                                        value = dt[i];
                                        return
                                    } else {
                                        value.push(dt[i]);
                                    }
                                }
                            }
                        }
                    } else {
                        return;
                    }
                } else if (dt.constructor === Object) {
                    if (types) {
                        var len = types.length;
                        for (var i = 0; i < len; i++) {
                            var type = types[i].split('.');
                            if (type.length === 1) {
                                var _dt = dt[type[0]];
                            } else if (type.length === 2) {
                                if (dt[type[0]]) {
                                    var _dt = dt[type[0]][type[1]];
                                }
                            } else {
                                if (dt[type[0]] && dt[type[0]][type[1]]) {
                                    var _dt = dt[type[0]][type[1]][type[2]];
                                }
                            }
                            if (!_dt && _dt != '0') continue;
                            if (_dt.constructor === Array) {
                                if (_dt.length > 0) {
                                    dep++;
                                    getArrVal(_dt);
                                    dep--;
                                }
                            } else {
                                if (depth && depth.indexOf(dep) == -1) break;
                                if ((_dt + '').search(new RegExp(key, 'ig')) !== -1) {
                                    if (only) {
                                        value = dt;
                                        return
                                    } else {
                                        value.push(dt);
                                    }
                                }
                            }
                        }
                    }

                    var isExcluded = false;
                    for (var k in dt) {
                        if (exclude && exclude.length > 0) {
                            for (var i = 0; i < exclude.length; i++) {
                                if (k === exclude[i]) {
                                    isExcluded = true;
                                    break;
                                }
                            }
                        }

                        if (isExcluded) continue;

                        if (dt[k].constructor === Array) {
                            if (dt[k].length > 0) {
                                dep++;
                                getArrVal(dt[k]);
                                dep--;
                            }
                        } else if (dt[k].constructor === Object) {
                            getArrVal(dt[k]);
                        } else {
                            if (!types) {
                                if (depth && depth.indexOf(dep) == -1) break;
                                if ((dt[k] + '').search(new RegExp(key, 'ig')) !== -1) {
                                    if (only) {
                                        value = dt;
                                        return
                                    } else {
                                        value.push(dt);
                                    }
                                }
                            }
                        }
                    }
                } else {
                    if (depth && depth.indexOf(dep) == -1) return;
                    if ((dt + '').search(new RegExp(key, 'ig')) !== -1) {
                        if (only) {
                            value = dt;
                            return
                        } else {
                            value.push(dt);
                        }
                    }
                }
            }

            return value;
        },

        deepCloneWithKey: function(obj, dt) {
            if (!obj || (typeof obj !== 'object') || !dt) return obj;

            var that = this;

            this.settings.datakey = this.dataKey;

            function clone(obj) {
                var isExist = false;
                var property = {};
                if (obj.constructor === Object) {
                    var _obj = {},
                        len = dt.length;

                    for (var i = 0; i < len; i++) {
                        if (dt[i].union === obj['id']) {
                            isExist = true;
                        }
                    }

                    for (var k in obj) {

                        if (obj[k] && (obj[k].constructor === Object || obj[k].constructor === Array)) {
                            var tempData = clone(obj[k]);
                            if (!$.isEmptyObject(tempData)) {
                                _obj[k] = tempData;
                            }
                        } else {
                            if (isExist) {
                                _obj[k] = obj[k];
                            }
                        }
                        property[k] = obj[k];
                    }

                    for (var i = 0; i < len; i++) {
                        if (dt[i].union === obj['id']) {
                            var sub = that.settings.datakey.sub;
                            if (_obj[sub]) {
                                _obj[sub].push(dt[i]);
                            } else {
                                _obj[sub] = [];
                                _obj[sub].push(dt[i]);
                            }
                        }
                    }
                } else if (obj.constructor === Array) {
                    var _obj = [],
                        len = obj.length;

                    for (var i = 0; i < len; i++) {
                        if (obj[i] && (obj[i].constructor === Array || obj[i].constructor === Object)) {
                            var tempData = clone(obj[i]);
                            if (!$.isEmptyObject(tempData)) {
                                _obj.push(clone(obj[i]));
                            }
                        } else {
                            _obj.push(obj[i]);
                        }
                    }
                } else {
                    var _obj = obj;
                }

                if (!$.isEmptyObject(_obj)) {
                    for (var k in property) {
                        _obj['id'] = property['id'];
                        _obj['name'] = property['name'];
                    }
                    return _obj;
                }
            }

            var _obj = clone(obj);

            return _obj;
        },

        // 深度拷贝
        deepClone: function(obj) {
            if (!obj || (typeof obj !== 'object')) return obj;

            function clone(obj) {
                if (obj.constructor === Object) {
                    var _obj = {};
                    for (var k in obj) {
                        if (obj[k] && (obj[k].constructor === Object || obj[k].constructor === Array)) {
                            _obj[k] = clone(obj[k]);
                        } else {
                            _obj[k] = obj[k];
                        }
                    }
                } else if (obj.constructor === Array) {
                    var _obj = [],
                        len = obj.length;

                    for (var i = 0; i < len; i++) {
                        if (obj[i] && (obj[i].constructor === Array || obj[i].constructor === Object)) {
                            _obj.push(clone(obj[i]));
                        } else {
                            _obj.push(obj[i]);
                        }
                    }
                } else {
                    var _obj = obj;
                }

                return _obj;
            }

            return clone(obj);
        },
    };

    if (isCommonjs) {
        module.exports = DataBox;
    } else {
        window.DataBox = DataBox;
    }

})(window);
