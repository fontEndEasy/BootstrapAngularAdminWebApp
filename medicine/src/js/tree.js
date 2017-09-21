(function (window, undefined) {
    var Tree = function (id, settings) {
        this.settings = settings;
        if(this.settings.modal){
            this.tree = $('#data_box').addClass('list-group');
        }else{
            this.tree = $('#' + id).addClass('list-group');
        }
        this.data = null;
        this.treeDepth = 0;
        this.targetsDt = [];
        this.fixdata = [];
        this.targets = [];
        this.targetsId = [];
        this.tempsAdd = [];
        this.tempsSub = [];
        this.tempsIdAdd = [];
        this.tempsIdSub = [];
        this.isRendered = false;
        this.isLeaf = false;
        this.dtKey = {};
        this.targetData = this.deepClone(this.settings.targetData);
        this.dataKey = this.deepClone(this.settings.datakey);

        this.init(this.settings);
        return this;
    };

    Tree.prototype = {
        init: function (set) {
            if(set.fixdata && set.fixdata.length > 0){
                var len = set.fixdata.length;
                for(var i=0; i<len; i++){
                    this.fixdata.push(set.fixdata[i]);
                    this.targetsId.push(set.fixdata[i].id);
                }
                this.targets = this.fixdata;
                set.fixdata = this.fixdata;
            }

            if(set.data.url){
                this.getData(set.data);
            }else{
                this.setTree(set.data);
            }
        },

        getData: function (data) {
            var _this = this;
            $.ajax({
                url: data.url,
                type: 'post',
                dataType: 'json',
                data: data.param,
                success: function (resp) {
                    if (resp.resultCode === 1 && resp.data) {
                        _this.sourceData = resp.data;
                        _this.setTree(resp.data);
                    } else {
                        console.warn(resp.resultMsg);
                        if (resp.resultCode !== 1) {
                            window.location.href = '#/access/signin';
                        }
                    }
                },
                error: function (resp) {
                    console.error(resp.resultMsg);
                }
            });
        },

        dataReset: function(dt){
            var data = [],
                sub = this.settings.datakey.sub;

            sort(dt);

            function sort(d){
                var l = d.length,
                    dArr = [],
                    dObj = {};
                for(var i=0; i<l; i++){
                    if(d[i][sub]){
                        dArr.push(d[i]);
                        sort(d[i][sub]);
                    }
                }
                data.push(d);
            }
        },

        setTree: function (dt) {
            var that = this;
            if ((this.settings.root && dt && dt.length > 0) || (this.settings.root && dt && that.settings.extra)) {
                var data = [{}];
                data[0].nodeType = 'root';
                data[0].name = this.settings.root.name;
                data[0].id = this.settings.root.id;
                data[0][this.settings.datakey.sub] = dt;
            } else {
                var data = dt;
            }

            if (that.settings.extra && data  && data.length > 0 && !this.isRendered){
                var len = that.settings.extra.length;
                for(var i=0; i<len; i++){
                    that.settings.extra[i].isExtra = true;
                    data[0][this.settings.datakey.sub].push(that.settings.extra[i]);
                }
            }

            if(this.settings.events && this.settings.events.filters){
                data = this.settings.events.filters(data);
            }

            this.treeWrapper = $('<div class="tree-wrap"></div>');
            if(data && data.length > 0){
                var objs = this.setBranch(data);			// 创建分支
                for (var i = 0; i < objs.length; i++) {
                    this.treeWrapper.append(objs[i]);
                }
            }else{
                setTimeout(function () {
                    that.treeWrapper.prepend($('<p class="text-muted text-center">未找到相关数据！</p>'));
                }, 10);
                //return;
            }

            that.tree.html('');
            that.tree.append(that.treeWrapper);
            this.isRendered = true;

            // 结束之后调用回调方法
            if(this.settings.callback){
                this.settings.callback();
            }
            if(this.settings.events && this.settings.events.callback){
                this.settings.events.callback();
            }
        },

        setBranch: function (data) {

            var _this = this,
                len = data.length,
                item = null,
                dt = null,
                dd = null,
                dl = null,
                iArrow = null,
                iCheck = null,
                iIcon = null,
                span = null,
                subs = null,
                ln = 0,
                hasSub = false,
                siblings = null,
                objArr = [],
                info = {},
                iconArrow = 'fa fa-caret-right/fa fa-caret-down',
                iconCheck = 'fa fa-check/fa fa-square',
                iconRoot = 'fa fa-hospital-o dcolor',
                iconBranch = 'fa fa-h-square dcolor',
                iconLeaf = 'fa fa-user-md dcolor',
                iconHead = 'headPicFileName',
                iconExtra = 'fa fa-h-square dcolor',
                curDt = null,
                pidKey = null,
                value = null;

            if (this.settings.icons) {
                if (this.settings.icons.arrow) {
                    iconArrow = this.settings.icons.arrow;
                    //var arrows = this.settings.icons.arrow.split('/');
                    //var iconArrow_r = arrows[0];
                    //var iconArrow_d = arrows[1] || 'fa fa-caret-down';
                } else {
                    //var arrows = iconArrow.split('/');
                    //var iconArrow_r = arrows[0];
                    //var iconArrow_d = arrows[1];
                }
                if (this.settings.icons.check) {
                    iconCheck = this.settings.icons.check;
                }

                if (this.settings.icons.root) {
                    iconRoot = this.settings.icons.root;
                }
                if (this.settings.icons.branch) {
                    iconBranch = this.settings.icons.branch;
                }
                if (this.settings.icons.leaf) {
                    iconLeaf = this.settings.icons.leaf;
                }
                if (this.settings.icons.headPicFileName) {
                    iconHead = this.settings.icons.headPicFileName;
                }
            } else {
                //var arrows = iconArrow.split('/');
                //var iconArrow_r = arrows[0];
                //var iconArrow_d = arrows[1];
            }

            iconArrow = iconArrow.split('/');
            var iconArrow_r = iconArrow[0];
            var iconArrow_d = iconArrow[1];

            iconCheck = iconCheck.split('/');
            var iconCheck_s = iconCheck[0];
            var iconCheck_u = iconCheck[1];

            for(var key in this.settings.info){
                var k = this.settings.datakey[key];
                if(!k){
                    k = this.settings.info[key];
                }
                if(!k) continue;
                this.dtKey[key] = k;
            }

            // 遍历每一个二级节点并生成相应的子列表
            for (var i = 0; i < len; i++) {

                if(_this.settings.leafDepth === _this.treeDepth) break;

                dl = dl = $('<dl class="cnt-list-warp"></dl>');
                dt = $('<dt></dt>');

                iArrow = $('<i></i>');
                iCheck = $('<i></i>');
                iIcon = $('<i></i>');
                iconHead = $('<img />');
                span = $('<span></span>');

                if(_this.settings.targetData){
                    data[i] = data[i][_this.settings.targetData];
                }

                if(!data[i]) continue;

                span.html(data[i].name);

                info = {};

                for(var key in _this.dtKey){
                    var k = _this.dtKey[key];
                    //if(!data[i][k] && data[i][k] != '0') continue;
                    if(key === 'id'){
                        info[key] = (data[i][k] || data[i][k] =='0') ? data[i][k] : data[i]['userId'];
                    }else if(key === 'pid'){
                        info[key] = (data[i][k] || data[i][k] =='0') ? data[i][k] : 'x';
                    }else{
                        info[key] = data[i][k];
                    }
                }
                /*
                for(var key in _this.settings.info){
                    var k = _this.settings.info[key];
                    if(!k){
                        k = _this.settings.datakey[key];
                    }
                    //var k = _this.settings.info[key];
                    //if(!data[i][k] && data[i][k] != '0') continue;
                    if(key === 'id'){
                        info[key] = (data[i][k] || data[i][k] =='0') ? data[i][k] : data[i]['userId'];
                    }else if(key === 'pid'){
                        info[key] = (data[i][k] || data[i][k] =='0') ? data[i][k] : 'x';
                    }else{
                        info[key] = data[i][k];
                    }
                }*/

                //info = data[i];

                dt.data('info', info);

                subs = data[i][_this.settings.datakey.sub];

                // 判断此层节点是否为叶子节点
                if(!subs || (_this.settings.leafDepth - 1 === _this.treeDepth)){
                    _this.isLeaf = true;
                }else{
                    _this.isLeaf = false;
                }

                dl.append(dt);

                var cur_div, tTop;

                var reached = _this.settings.leafDepth && _this.settings.leafDepth - 1 === _this.treeDepth;

                // 含下一级
                if ((subs && (ln = subs.length) > 0 && !reached) || (_this.settings.allHaveArr && !_this.isLeaf && !reached)) {
                    hasSub = true;

                    dd = $('<dd></dd>');

                    if(_this.settings.async && info.id != '0' && !_this.settings.arrType){
                        iArrow.addClass(iconArrow_r);
                    }else{
                        var _search = _this.settings.search && !_this.settings.search.unwind;
                        if(_this.settings.arrType && _this.settings.arrType[_this.treeDepth] != '1' && _search){
                            iArrow.addClass(iconArrow_r);
                        }else{
                            iArrow.addClass(iconArrow_d);
                        }
                    }
                    iIcon.addClass(data[i].nodeType !== 'root' ? (!data[i].isExtra ? iconBranch : (data[i].icon || iconExtra)) : iconRoot);
                    dt.append(iArrow);

                    function arrowHandler (e) {
                        var that = $(this),
                            evt = e || window.event,
                            cur_div = that.parents('.list-group').find('.cur-back-line'),
                            curDt = that.parents('.list-group').find('.cur-line');
                        evt.stopPropagation();

                        // 异步加载节点数据
                        if (_this.settings.async && !that.hasClass(iconArrow_d) && !e.data.pNode.data('subs')) {
                            //setCurLine();
                            //return;
                            //_this.settings.async.call(that.parent(), e.data);
                            var loading = $('<i class="refreshing glyphicon glyphicon-repeat"></i>');
                            e.data.pNode.prev().append(loading);
                            var _param = {};
                            //_param.access_token = app.url.access_token;
                            if(e.data.dt.isExtra){
                                var url = e.data.dt.url;
                                for(var key in e.data.dt.param){
                                    _param[key] = e.data.dt.param[key];
                                }
                                for(var key in e.data.dt.dataKey){
                                    _param[key] = e.data.dt[e.data.dt.dataKey[key]];
                                }
                                if(e.data.dt.target) {
                                    _this.settings.targetData = e.data.dt.target.data;
                                    _this.settings.datakey = e.data.dt.target.dataKey;
                                }
                            }else{
                                var url = _this.settings.async.url;
                                for(var key in _this.settings.async.data){
                                    _param[key] = _this.settings.async.data[key];
                                }
                                for(var key in _this.settings.async.dataKey){
                                    _param[key] = e.data.dt[_this.settings.async.dataKey[key]];
                                }
                                _this.settings.targetData = _this.targetData;
                                _this.settings.datakey = _this.dataKey;
                            }

                            $.ajax({
                                dataType: 'json',
                                url: url,
                                method: 'post',
                                data: _param,
                                success: function (resp) {
                                    var dt = resp.data;
                                    if (resp.resultCode === 1 && dt) {
                                        if(!dt.length){
                                            dt = dt.pageData;
                                        }
                                        if(!dt.length){
                                            return;
                                        }
                                        _this.isLeaf = true;
                                        e.data.pNode.data('subs', dt);
                                        _this.insertNodes(e.data.pNode, dt); // 请求到数据后，把新节点插入
                                        _this.initCheckStatus();
                                    } else {
                                        //console.warn(resp.resultMsg);
                                        if (resp.resultCode === 1030102) {
                                            window.location.href = '#/access/signin';
                                        }
                                    }
                                    loading.remove();
                                    setCurLine();
                                },
                                error: function (resp) {
                                    console.error(resp.resultMsg);
                                }
                            });
                        }else{
                            setCurLine();
                        }

                        // 设置背景条的位置
                        function  setCurLine(){
                            var pSiblings = that.parent().siblings();
                            if (that.hasClass(iconArrow_d)) {
                                pSiblings.addClass('none')
                                that.removeClass(iconArrow_d).addClass(iconArrow_r);
                                if (curDt.length > 0) {
                                    if (!that.parent().hasClass('cur-line') && that.parent().find('.cur-line').length > 0) {
                                        cur_div.css('display', 'none');
                                    }
                                    cur_div.css('top', curDt.offset().top - tTop);
                                }
                            } else {
                                pSiblings.removeClass('none');
                                that.removeClass(iconArrow_r).addClass(iconArrow_d);
                                if (curDt.length > 0) {
                                    cur_div.css('display', 'block');
                                    cur_div.css('top', curDt.offset().top - tTop);
                                }
                            }
                        }
                    };

                    iArrow.on('click', {pNode: dd, dt: info}, arrowHandler);

                    if (this.settings.async !== true) {
                        if(subs && ln > 0) {
                            _this.treeDepth++;
                            var objs = this.setBranch(subs);    // 创建下一分支
                            for (var j = 0; j < objs.length; j++) {
                                dd.append(objs[j]);
                            }
                            _this.treeDepth--;
                        }
                    }

                    var _search = _this.settings.search && !_this.settings.search.unwind;
                    if((this.settings.async && info.pid != 'x' && info.id != '0' && _this.settings.arrType) && (_this.settings.arrType[_this.treeDepth] != '1' && _search)){
                        dd.addClass('none');
                    }

                    /*if(_this.settings.arrType && _this.settings.arrType[_this.treeDepth] != '1' && _search){
                        dd.addClass('none');
                    }*/

                    //dt.data('subLen', len);

                    dl.append(dd);

                } else if(_this.settings.extra && !_this.isLeaf){
                    hasSub = true;
                    iIcon.addClass(data[i].nodeType !== 'root' ? (!data[i].isExtra ? iconBranch : (data[i].icon || iconExtra)) : iconRoot);
                } else {  // 不含下一级
                    hasSub = false;
                    iIcon.addClass(iconLeaf);
                }

                dt.data('subLen', len);

                if (_this.settings.hasCheck) {
                    if(_this.settings.leafCheck && _this.isLeaf && !hasSub){
                        iCheck.addClass(iconCheck_s + ' un-check');
                        dt.append(iCheck);
                    }else if(!_this.settings.leafCheck){
                        iCheck.addClass(iconCheck_s + ' un-check');
                        dt.append(iCheck);
                    }
                }

                dt.append(iIcon).append(span);

                objArr.push(dl);

                // 定义列表行的事件
                // for(var evt in _this.settings.events){
                // 	dt.on(evt, function(){
                // 		_this.settings.events[evt].call($(this), $(this).data('id'), $(this).data('name'));
                // 	});
                // }

                // 异步加载节点数据
                function getAsyncData(e, param, fun){
                    if (!e.pNode.data('subs')) {
                        if(e.dt.isExtra){
                            var url = e.dt.url;
                            for(var key in e.dt.param){
                                param[key] = e.dt.param[key];
                            }
                            for(var key in e.dt.dataKey){
                                param[key] = e.dt[e.dt.dataKey[key]];
                            }
                            if(e.dt.target) {
                                _this.settings.targetData = e.dt.target.data;
                                _this.settings.datakey = e.dt.target.dataKey;
                            }
                        }else{
                            var url = _this.settings.async.url;
                            for(var key in _this.settings.async.dataKey){
                                param[key] = e.dt[_this.settings.async.dataKey[key]];
                            }
                            _this.settings.targetData = _this.targetData;
                            _this.settings.datakey = _this.dataKey;
                        }

                        $.ajax({
                            dataType: 'json',
                            url: url,
                            method: 'post',
                            data: param,
                            success: function (resp) {
                                var dt = resp.data;
                                if (resp.resultCode === 1 && dt) {
                                    if(!dt.length){
                                        dt = dt.pageData;
                                    }
                                    if(!dt.length){
                                        return;
                                    }
                                    _this.isLeaf = true;
                                    e.pNode.data('subs', dt);
                                    _this.insertNodes(e.pNode, dt); // 请求到数据后，把新节点插入
                                    fun(e.pNode.children('dl').children('dt'));
                                } else {
                                    //fun(null);
                                    fun(e.pNode.children('dl').children('dt'));
                                    if (resp.resultCode === 1030102) {
                                        window.location.href = '#/access/signin';
                                    }
                                }
                            },
                            error: function (resp) {
                                console.error(resp.resultMsg);
                            }
                        });
                    }else{
                        fun(e.pNode.children('dl').children('dt'));
                    }
                }

                function checked(e) {
                    if (!$(this).data('info').id && !_this.settings.root.selectable) return;
                    if (_this.treeWrapper.find('.cur-back-line').length === 0) {
                        cur_div = $('<div class="cur-back-line"></div>');
                        tTop = _this.treeWrapper.offset().top + 1;
                        _this.treeWrapper.append(cur_div);
                    } else {
                        cur_div = _this.treeWrapper.find('.cur-back-line');
                        tTop = _this.treeWrapper.offset().top + 1;
                    }

                    var _p = e.data.iCheck.parent().parent();
                    if (_this.settings.hasCheck) {
                        if (_this.settings.multiple) {
                            var _chk_class = iconCheck_s.split(' ')[1];
                            var _uchk_class = iconCheck_u.split(' ')[1];

                            _this.targetsDt = [];
                            _this.tempsAdd = [];
                            _this.tempsIdAdd = [];
                            _this.tempsSub = [];
                            _this.tempsIdSub = [];

                            // 设置上一级checkbox的状态，可能会被递归调用
                            function setTopCheck(node){
                                var _p = node.parent().parent();
                                var _dt = _p.parent().children('dl').children('dt');
                                var _check = _dt.children('.un-check');
                                var _ln = 0;
                                if(_check.length === 0){
                                    _check = _dt.children('.' +_uchk_class);
                                    if(_check.length > 0) {
                                        _ln = _check.length;
                                    }
                                }else{
                                    _ln = _check.length;
                                }

                                var len = _dt.data('subLen');
                                var num = len - _ln;

                                var _check = _p.parent().siblings('dt').children('.' + _chk_class);

                                if(num === len){
                                    if(_this.settings.cover){
                                        _p.parent().parent().children('dt').trigger('click');
                                        setSubCheck(node);
                                    }else{
                                        _check.removeClass('un-check').removeClass(_uchk_class);
                                    }
                                }else if(num < len && num !== 0 && !_this.settings.cover){
                                    _check.removeClass('un-check').addClass(iconCheck_u);
                                }else{
                                    //_p.parent().parent().children('dt').trigger('click');
                                    _check.removeClass(_uchk_class).addClass('un-check');
                                    //setSubCheck(_check);
                                }
                                if(_p.parent().parent().parent().siblings('dt').length > 0){
                                    if(!_this.settings.cover) {
                                        setTopCheck(_check);
                                    }
                                }
                            }

                            if (e.data.iCheck.hasClass('un-check')) {
                                if (_this.settings.allCheck) {

                                    var _dts = _p.find('dt');

                                    function appendData(dts){
                                        dts.each(function () {
                                            $(this).find('.' + _chk_class).removeClass('un-check');
                                            if (!_this.settings.self) {
                                                if ($(this).children('i').length === 2) {
                                                    _this.addTargets($(this));		// 添加数据到数组集合
                                                }
                                            } else {
                                                _this.addTargets($(this));		    // 添加数据到数组集合
                                            }
                                        });
                                    }

                                    // 异步添加所以子节点数据
                                    if(_this.settings.async){
                                        if(e.data.pNode) {
                                            if(!e.data.pNode.data('subs')) {
                                                var loading = $('<i class="refreshing glyphicon glyphicon-repeat"></i>');
                                                e.data.pNode.prev().append(loading);
                                                var _param = {};
                                                _param.access_token = app.url.access_token;
                                                for (var key in _this.settings.async.data) {
                                                    _param[key] = _this.settings.async.data[key];
                                                }
                                                var len = _dts.length;
                                                var _num = 0;
                                                var dts = [];
                                                for(var i=0; i<len; i++){
                                                    if(_dts.eq(i).children('i').length > 2){
                                                        dts.push(_dts.eq(i));
                                                    }
                                                }
                                                len = dts.length;
                                                for (var i = 0; i < len; i++) {
                                                    getAsyncData({
                                                        pNode: dts[i].next(),
                                                        dt: dts[i].data('info')
                                                    }, _param, function (dts) {
                                                        _num++;

                                                        if (_num === len) {
                                                            loading.remove();
                                                        }
                                                        if (dts && dts.length > 0) {
                                                            appendData(dts);

                                                            if (_this.settings.events.click && !_this.settings.unionSelect) {
                                                                _this.settings.events.click.call($(this), $(this).data('info'));
                                                            }
                                                        }
                                                    });
                                                }
                                            }else{
                                                appendData(_dts);
                                            }
                                        }else{
                                            appendData(_dts);
                                        }
                                    } else {
                                        appendData(_dts);
                                    }
                                }else{
                                     _this.addTargets($(this));		// 添加数据到数组集合
                                }
                                e.data.iCheck.removeClass(_uchk_class).removeClass('un-check');
                            } else {
                                if (_this.settings.allCheck) {
                                    _p.find('dt').each(function () {
                                        $(this).find('.' + _chk_class).addClass('un-check');
                                        if(!_this.settings.self) {
                                            if ($(this).children('i').length === 2) {
                                                _this.removeTargets($(this));		// 从数组集合移除数据
                                            }
                                        }else{
                                            _this.removeTargets($(this));		    // 从数组集合移除数据
                                        }
                                    });
                                }
                                else{
                                    _this.removeTargets($(this));		// 添加数据到数组集合
                                }
                                e.data.iCheck.addClass('un-check');
                            }

                            if(!_this.settings.leafCheck){
                                setTopCheck(e.data.iCheck);
                            }

                            // 设置下一级checkbox的状态
                            function setSubCheck(node){
                                var _dl = node.parent().parent();
                                var _dt = _dl.parent().children('dl').children('dt');
                                var _check = _dt.children('.fa-check');
                                _check.removeClass(_uchk_class).addClass('un-check');
                                _this.removeTargets(_dt);		// 从数组集合移除数据

                                _dt.each(function () {
                                    $(this).find('.' + _chk_class).addClass('un-check');
                                    if(_this.settings.self) {
                                        if ($(this).children('i').length === 2) {
                                            _this.removeTargets($(this));		// 从数组集合移除数据
                                        }
                                    }else{
                                        _this.removeTargets($(this));		    // 从数组集合移除数据
                                    }
                                });
                            }

                        } else {
                            if (e.data.iCheck.hasClass('un-check')) {
                                _this.tree.find('.fa-check').addClass('un-check');
                                e.data.iCheck.removeClass('un-check');
                                _this.targetsDt = [];
                                _this.targets = [];
                                _this.tempsAdd = [];
                                _this.tempsIdAdd = [];
                                _this.tempsSub = [];
                                _this.tempsIdSub = [];
                                _this.addTargets(e.data.iCheck.parent());		// 添加数据到数组集合
                            } else {
                                _this.tree.find('.fa-check').addClass('un-check');
                                e.data.iCheck.addClass('un-check');
                                _this.targets = [];
                            }
                        }
                    } else {
                        cur_div.css('top', $(this).offset().top - tTop);
                        _this.tree.find('.cur-line').removeClass('cur-line');
                        $(this).addClass('cur-line');
                        _this.addTargets($(this));		// 添加数据到数组集合
                    }

                    if (_this.settings.events.click) {
                        _this.settings.events.click.call($(this), $(this).data('info'));
                    }

/*                    setTimeout(function(){
                        console.log(_this.targets);
                        console.log(_this.targetsId);
                        console.log(_this.tempsIdAdd);
                        console.log(_this.tempsIdSub);
                    }, 500);*/

                }

                if(_this.settings.self){
                    dt.on('click', {pNode: dd, iCheck: iCheck, dt: info}, checked);
                }else if((!_this.settings.self && _this.settings.multiple) || (_this.settings.leafCheck && _this.isLeaf && !hasSub)){
                    dt.on('click', {pNode: dd, iCheck: iCheck, dt: info}, checked);
                }

                // 鼠标停留时
                var div = $('<div class="back-line"></div>');
                dt.hover(function () {
                    tTop = _this.treeWrapper.offset().top + 1;
                    div.css('top', $(this).offset().top - tTop);
                    _this.treeWrapper.append(div);
                    if (!$(this).data('info').id && !_this.settings.root.selectable) return;
                    if (_this.settings.events.mouseenter) {
                        _this.settings.events.mouseenter.call($(this), $(this).data('info'));
                    }
                }, function () {
                    div.remove();
                    if (!$(this).data('info').id && !_this.settings.root.selectable) return;
                    if (_this.settings.events.mouseleave) {
                        _this.settings.events.mouseleave.call($(this), $(this).data('info'));
                    }
                });
            }

            return objArr;

        },

        insertNodes: function(node, dt){
            var _this = this;
            var objs = this.setBranch(dt);			// 创建分支
            for (var i = 0; i < objs.length; i++) {
                node.append(objs[i]);
            }
            var isFull = node.prev().children('.fa-check').length && !node.prev().children('.fa-check').hasClass('un-check');
            var _dt = node.children('dl').children('dt');
            for (var i = 0; i < _dt.length; i++) {
                _dt.eq(i).data('subLen', _dt.length);
            }
            if(isFull){
                //_dt.children('.fa-check').removeClass('un-check');
                //_dt.children('.fa-check').trigger('click');
                //_dt.trigger('click');
            }
            //_dt.attr('data-subLen', (_dt.data('subLen') ? _dt.data('subLen') : 0) + objs.length);
            // 结束之后调用回调方法
            //this.settings.callback();
        },
        initCheckStatus: function(){
            if(this.settings.fixdata){
                var dts = this.tree.find('dt'),
                    fixDt = this.settings.fixdata,
                    ln = fixDt.length,
                    l = dts.length;
                for(var i=0; i<ln; i++){
                    for(var j=0; j<l; j++) {
                        var _dt = dts.eq(j);
                        if (_dt.data('info').id == fixDt[i].id && _dt.children('.un-check').length > 0) {
                            _dt.trigger('click');
                            break;
                        }

                    }
                }
            }
        },
        setCheck: function (id) {
            var _this = this;
            var len = this.targets.length;
            for (var i = 0; i < len; i++) {
                var dt = $(this.targetsDt[i]);
                if (id === dt.data('info').id) {
                    if (dt.children('un-check').length === 0) {
                        dt.trigger('click');
                        break;
                    }
                }
            }
        },
        setLeafDepth: function(num){
            this.settings.leafDepth = num;
        },
        getTargets: function () {
            return this.targets;
        },
        getTargetsId: function () {
            return this.targetsId;
        },
        getTempsAdd: function () {
            return this.tempsAdd;
        },
        getTempsIdAdd: function () {
            return this.tempsIdAdd;
        },
        getTempsSub: function () {
            return this.tempsSub;
        },
        getTempsIdSub: function () {
            return this.tempsIdSub;
        },
        addTargets: function (dt) {

            if(!this.settings.multiple){
                this.targetsDt = [];
                this.targets = [];
                this.targetsId = [];
                this.tempsAdd = [];
                this.tempsIdAdd = [];
                this.tempsIdSub = [];
            }
            var info = dt.data('info');
            if (this.targetsId.indexOf(info.id) === -1) {
                this.targetsDt.push(dt);
                this.targets.push(info);
                this.targetsId.push(info.id);
            }

            this.tempsAdd.push(info);
            this.tempsIdAdd.push(info.id);

        },

        removeTargets: function (dt) {
            var len = dt.length,
                idx = -1,
                info = dt.data('info');

            idx = this.targetsId.indexOf(info.id);
            if (idx !== -1) {
                this.targetsDt.splice(idx, 1);
                this.targets.splice(idx, 1);
                this.targetsId.splice(idx, 1);
            }

            this.tempsSub.push(info);
            this.tempsIdSub.push(info.id);
        },
        getTree: function(){
            return this.tree;
        },
        getSourceData: function(){
            return this.sourceData;
        },

        // 深度拷贝
        deepClone: function (obj) {
            if(!obj || (typeof obj !== 'object')) return obj;

            function clone(obj){
                if(obj.constructor === Object){
                    var _obj = {};
                    for(var k in obj){
                        if(obj[k] && (obj[k].constructor === Object || obj[k].constructor === Array)){
                            _obj[k] = clone(obj[k]);
                        }else{
                            _obj[k] = obj[k];
                        }
                    }
                }else if(obj.constructor === Array){
                    var _obj = [],
                        len = obj.length;

                    for(var i=0; i<len; i++){
                        if(obj[i] && (obj[i].constructor === Array || obj[i].constructor === Object)){
                            _obj.push(clone(obj[i]));
                        }else{
                            _obj.push(obj[i]);
                        }
                    }
                }else{
                    var _obj = obj;
                }

                return _obj;
            }

            return clone(obj);
        },

    };

    window.Tree = Tree;
})(window);