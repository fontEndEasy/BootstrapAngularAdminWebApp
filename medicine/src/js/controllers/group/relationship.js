'use strict';

app.controller('Relationship', function ($rootScope, $scope, $state, $http, $compile, utils, modal, uiLoad, JQ_CONFIG, Doctor) {

    var inviteData = null,
        tempData = null,
        cnt_list = $('#cnt_list'),
        items = cnt_list.find('.list-group-item'),
        dt = null,
        groupId = utils.localData('curGroupId'),
        isListMode = true,
        isGrapMade = false,
        listUrl = app.url.yiliao.getProfitList;

    $scope.isLoading = true;
    $scope.loaded = true;


    // 查看某一信息
    $scope.seeDetails = function (dt) {
        if (dt) {
            $('#doctor_details').removeClass('hide');
            $rootScope.winVisable = true;
            Doctor.addData(dt);
        }
    };


    var iEdit, iDelete;

    function enter(info) {
        $scope.curIndex = null;
        var cur_div = contacts.tree.find('.back-line');
        iEdit = $('<i class="pos-edit fa fa-pencil-square-o"></i>');
        iDelete = $('<i class="pos-delete fa fa-trash-o"></i>');
        $(this).append(iEdit).append(iDelete);

        iEdit.click(function (e) {
            var evt = e || window.event;
            evt.stopPropagation();
            $rootScope.targetDoctorParentId = info.pid;
            $rootScope.targetDoctorId = info.id;
            $rootScope.targetDoctorName = info.name;

            $rootScope.groupProfit = info.groupProfit;
            $rootScope.superProfit = info.superProfit;

            $state.go('app.relationship.list.edit');
        });

        iDelete.click(function (e) {
            var evt = e || window.event;
            evt.stopPropagation();
            $rootScope.targetDoctorId = info.id;
            $rootScope.targetDoctorName = info.name;
            $state.go('app.relationship.list.delete');
        });
    }

    function leave(info) {
        $scope.curIndex = null;
        iEdit.remove();
        iDelete.remove();
    }

    function forward(info) {
        $scope.curIndex = null;
        //cnt_list.find('.cur-line').removeClass('cur-line');
        //this.addClass('cur-line');
        $rootScope.targetDoctorParentId = info.pid;
        $rootScope.targetDoctorId = info.id;
        $rootScope.targetDoctorName = info.name;

        $rootScope.groupProfit = info.groupProfit || 0;
        $rootScope.superProfit = info.superProfit || 0;

        $rootScope.curDoctorId = info.id || null;
        utils.localData('curDoctorId', $scope.curDoctorId);
        $state.go('app.relationship.edit', {id: info.id}, {reload: false});
    }


    /////////////////////////////////////////////////////////////////

    var keyIpt = $('#key_ipt');

    $scope.submit = function () {
        var val = $.trim(keyIpt.val());

        $scope.loaded = false;
        if (/\S+/.test(val)) {

        }
        if (!inviteData) {
            $scope.loaded = true;
            modal.toast.warn("数据未加载完成！");
            return;
        }

        var data = utils.getDataByVal(inviteData, 'name', val);
        if (data && data.length > 0) {
            $scope.center(data[0]);
        } else {
            modal.toast.warn('未找到相关数据！');
        }

        $scope.loaded = true;
    };


    //////////////////////////////////////////////////////////

/*    $http({
        //url: app.url.yiliao.getProfitTree,
        url: app.url.yiliao.getProfitList,
        method: 'post',
        data: {
            access_token: app.url.access_token,
            groupId: groupId
        }
    }).then(function (resp) {
        if (resp.data && resp.data.data) {
            tempData = resp.data.data;
            //inviteData = resp.data.data;
            inviteData = {
                name: utils.localData('curGroupName'),
                children: resp.data.data
            };
            setLevel(inviteData);
        }
    });*/

    $('#list_mode').click(function(){
        if(!$(this).hasClass('active')){
            isListMode = true;
            //routeItem = [];
            //level = [];
            //dTable.fnDestroy();

            $('#list_view').removeClass('hide');
            $('#tree-container').addClass('hide');
            $(this).addClass('active').next().removeClass('active');
/*            param.parentId = 0;
            num = 0;
            level = [];
            routeItem = [];
            setLevel({
                name: utils.localData('curGroupName'),
                children: inviteData
            });*/
        }
    });

    $('#grap_mode').click(function(){
        if(!$(this).hasClass('active')){
            isListMode = false;
            $('#tree-container').removeClass('hide');
            $('#list_view').addClass('hide');
            $(this).addClass('active').prev().removeClass('active');
            if(!isGrapMade){
                graphicMode();
            }
        }
    });

    function initRoute(dt){
        var n=0;
        (function getPrent(dt){
            if(dt.parent){
                routeItem.unshift(dt);
                level.push(n++);
                getPrent(dt.parent);
            }else{
                routeItem.unshift(dt);
                level.push(n++);
            }
        }(dt));
    }

    var routeItem = [],
        level = [],
        num = 0,
        route = $('#level_route');

    function setLevel(dt) {
        if(!isListMode){
            num = 0;
            level = [];
            initRoute(dt);
        }else{
            if(dt){
                level.push(num);
                routeItem.push(dt);
                num ++;
            }
        }

        setLevelRoute();

        initTable();
    }

    function setLevelRoute() {
        var len = level.length;

        route.html('');
        for (var i = 0; i < len; i++) {
            if (i === 0) {
                var a = $('<a class="route-link route-first fa fa-hospital-o">' + (routeItem[i].name || '') + '</a>');
                //a.click(locateTo);
            } else if (i === len - 1) {
                var a = $('<a class="route-link route-last">' + (routeItem[i].name || '') + '</a>');
            } else {
                var a = $('<a class="route-link">' + (routeItem[i].name || '') + '</a>');
                //a.click(locateTo);
            }
            a.click(locateTo);
            a.data('level', i);
            route.append(a);
        }

        function locateTo() {
            var _n = $(this).data('level');
            if(isListMode) {
                if (_n < level.length - 1) {
                    level.splice(_n + 1, level.length - _n - 1);
                    routeItem.splice(_n + 1, routeItem.length - _n - 1);
                    $(this).nextAll().remove();
                    if (routeItem[_n].childrenCount > 0 || (routeItem[_n].children && routeItem[_n].children.length > 0)) {
                        param.parentId = routeItem[_n].id;
                        setLevel();
                    }else{
                        param.parentId = 0;
                        num = 0;
                        level = [];
                        routeItem = [];
                        setLevel({
                            name: utils.localData('curGroupName')
                        });
                    }
                    num = _n + 1;
                }
            }else{
                var _dt = utils.queryByKey(inviteData, routeItem[_n].id, true, ['parent'], ['id']);
                $scope.centerNode(_dt);
            }
        }
    }


    // 初始化表格
    var doctorList, dTable, keyWord,
        param = {
            groupId: groupId,
            parentId: 0
        };

    setLevel({
        name: utils.localData('curGroupName')
    });

    var dt = {};

    function initTable(data) {
        var name,
            subs = [],
            index = 1,
            start = 0,
            length = utils.localData('page_length') * 1 || 50;

        var setTable = function () {
            if ($rootScope.isSearch) {
                doctorList = $('#searchList');
            } else {
                doctorList = $('#contactsList');
            }

            if (dTable) dTable.fnDestroy();

            dTable = doctorList.dataTable({
                "draw": index,
                "displayStart": start,
                "lengthMenu": [5, 10, 15, 20, 30, 40, 50, 100],
                "pageLength": length,
                "bServerSide": true,
                "sAjaxSource": listUrl,
                //"data": data,
                "fnServerData": function (sSource, aoData, fnCallback) {
                    param.pageIndex = index - 1;
                    param.pageSize = aoData[4]['value'];
                    param.access_token = app.url.access_token;
                    $http({
                        "method": "post",
                        "url": sSource,
                        "data": param
                    }).then(function (resp) {
                        resp = resp.data.data;
                        index = aoData[0]['value'];
                        for (var i = 0; i < resp.pageData.length; i++) {
                            utils.extendHash(resp.pageData[i], ["name", "contactWay", "attributes", "departments", "title", "departmentFullName", "children"]);
                        }
                        resp.start = resp.start;
                        resp.recordsTotal = resp.total;
                        resp.recordsFiltered = resp.total;
                        resp.length = resp.pageSize;
                        resp.data = resp.pageData;
                        fnCallback(resp);
                        $scope.loading = false;
                        $rootScope.loaded = true;
                    });
                },
                //"searching": false,
                "language": app.lang.datatables.translation,
                "createdRow": function (nRow, aData, iDataIndex) {
                    if (aData.childrenCount) {
                        var btn = $('<button class="btn btn-info">' + aData.childrenCount + '</button>');
                        $(nRow).find('.next-level').append(btn);
                        btn.on('click', aData, function (e) {
                            var evt = e || window.event;
                            evt.stopPropagation();
                            route.removeClass('none');
                            param.parentId = e.data.id;
                            setLevel(e.data);
                        });
                    }
                    var a_link = $(nRow).find('.a-link');
                    a_link.click(function(){
                        $scope.seeDetails(aData.id);
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
                        return '<img class="a-link" src="' + path + '"/></a>';
                    },
                    "searchable": false
                }, {
                    "orderable": false,
                    "render": function (set, status, dt) {
                        return '<a class="a-link">' + dt.name + '</a>';
                    }
                }, {
                    "data": "departmentFullName",
                    "orderable": false
                }, {
                    "data": "title",
                    "orderable": false
                }, {
                    "data": "contactWay",
                    "orderable": false
                }, {
                    "render": function (set, status, dt) {
                        if (dt.groupProfit > 0) {
                            return dt.groupProfit + ' %';
                        } else {
                            return dt.groupProfit;
                        }
                    },
                    "orderable": false,
                    "searchable": false
                }, {
                    "render": function (set, status, dt) {
                        if (dt.parentProfit > 0) {
                            return dt.parentProfit + ' %';
                        } else {
                            return dt.parentProfit;
                        }
                    },
                    "orderable": false,
                    "searchable": false
                }, {
                    "render": function (set, status, dt) {
                        if (dt.childrenCount) {
                            var btnStr = '<span class="next-level"></span>';
                            return btnStr;
                        } else {
                            return '';
                        }
                    },
                    "orderable": false,
                    "searchable": false
                }]
            });

            var contactsList_filter = $('#contactsList_filter'),
                _form = $('<form></form>'),
                _lbl = contactsList_filter.addClass('group-search').children('label').append(_i),
                _i = $('<i ng-show="loaded" class="fa icon-magnifier"></i>'),
                _ipt = _lbl.find('input').attr('placeholder', '搜索...').attr('autocomplete', 'off'),
                _timer = 0,
                _temp = '',
                isSearching = false;

            contactsList_filter.append(_form);
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
                            route.removeClass('none');
                            $scope.searching = false;
                            keyWord = _temp = '';
                            start = length * (index - 1);
                            dTable.fnDestroy();
                            //initTable(tempData);

                            param = {
                                groupId: groupId,
                                parentId: 0
                            };
                            listUrl = app.url.yiliao.getProfitList;
                            initTable();
                        }
                    }
                }, 100);
            });
            _ipt.blur(function () {
                clearInterval(_timer);
            });
            _i.click(function () {
                route.removeClass('none');
                isSearching = false;
                keyWord = _temp = '';
                _ipt.trigger('submit');
                _ipt.val('');
                _i.removeClass('fa-times-circle').addClass('icon-magnifier');
                start = length * (index - 1);
                dTable.fnDestroy();
                //initTable(tempData);

                param = {
                    groupId: groupId,
                    parentId: 0
                };
                listUrl = app.url.yiliao.getProfitList;
                initTable();
            });
            _ipt.val(keyWord).trigger('focus');

            function submit(){
                route.addClass('none');
                $scope.searching = true;

                param = {
                    groupId: groupId,
                    keyword: keyWord
                };
                listUrl = app.url.yiliao.searchByKeyword;
                initTable();
            }

            utils.keyHandler(_ipt, {
                'key13': submit
            });

            dTable.off().on('draw.dt', function (e, settings) {

            }).on('page.dt', function (e, settings) {
                subs = [];
                if (!isSearching) {
                    index = settings._iDisplayStart / length + 1;
                }
            });
        };

        setTable();

    }

    //initTable();

    function graphicMode() {
        uiLoad.load(JQ_CONFIG.d3).then(function () {
            var dragListener,
                node,
                scale,
                x, y,
                dragStarted,
                domNode,
                nodes,
                target,
                parentLink,
                relCoords,
                links,
                nodePaths,
                nodesExit,
                panTimer,

                translateCoords,
                translateX,
                translateY,
                scaleX,
                scaleY,
                overlayWidth = 100;
            // Get JSON data
            var makeTree = function () {
                var path = app.url.yiliao.getProfitTree + '?access_token=' + app.url.access_token + '&groupId=' + groupId;
                var dt = {}, data = {}, treeData = {};
                if (!inviteData) {
                    d3.xhr(path, "application/json,text/javascript", function (error, treeDt) {
                        eval("dt=" + treeDt.response);
                        data.name = utils.localData('curGroupName');
                        data.children = dt.data;
                        data.id = '0';
                        inviteData = data;

                        initTree();
                    });
                }else{
                    data = inviteData;

                    initTree();
                }

                isGrapMade = true;

                function initTree() {
                    //var treeJSON = d3.xhr(path, "application/json,text/javascript", function (error, treeData) {

                    // Calculate total nodes, max label length
                    $('#tree-container').html('');
                    treeData = data;
                    var totalNodes = 0;
                    var maxLabelLength = 0;
                    // variables for drag/drop
                    var selectedNode = null;
                    var draggingNode = null;
                    // panning variables
                    var panSpeed = 200;
                    var panBoundary = 20; // Within 20px from edges will pan when dragging.
                    // Misc. variables
                    var i = 0;
                    var duration = 750;
                    var root;

                    // size of the diagram
                    var viewerWidth = $('#tree-container').width() - 15;
                    var viewerHeight = $(window).height() - 195;

                    var tree = d3.layout.tree()
                        .size([viewerHeight, viewerWidth]);

                    // define a d3 diagonal projection for use by the node paths later on.
                    var diagonal = d3.svg.diagonal()
                        .projection(function (d) {
                            return [d.y, d.x];
                        });

                    // A recursive helper function for performing some setup by walking through all nodes

                    function visit(parent, visitFn, childrenFn) {
                        if (!parent) return;

                        visitFn(parent);

                        var children = childrenFn(parent);
                        if (children) {
                            var count = children.length;
                            for (var i = 0; i < count; i++) {
                                visit(children[i], visitFn, childrenFn);
                            }
                        }
                    }

                    // Call visit function to establish maxLabelLength
                    visit(treeData, function (d) {
                        totalNodes++;
                        maxLabelLength = Math.max(d.name ? d.name.length : 0, maxLabelLength) + .01;

                    }, function (d) {
                        return d.children && d.children.length > 0 ? d.children : null;
                    });


                    // sort the tree according to the node names

                    function sortTree() {
                        tree.sort(function (a, b) {
                            return (b.name && b.length>0 ? b.name : '').toLowerCase() < (a.name && a.length>0 ? a.name : '').toLowerCase() ? 1 : -1;
                        });
                    }

                    // Sort the tree initially incase the JSON isn't in a sorted order.
                    sortTree();

                    // TODO: Pan function, can be better implemented.

                    function pan(domNode, direction) {
                        var speed = panSpeed;
                        if (panTimer) {
                            clearTimeout(panTimer);
                            translateCoords = d3.transform(svgGroup.attr("transform"));
                            if (direction == 'left' || direction == 'right') {
                                translateX = direction == 'left' ? translateCoords.translate[0] + speed : translateCoords.translate[0] - speed;
                                translateY = translateCoords.translate[1];
                            } else if (direction == 'up' || direction == 'down') {
                                translateX = translateCoords.translate[0];
                                translateY = direction == 'up' ? translateCoords.translate[1] + speed : translateCoords.translate[1] - speed;
                            }
                            scaleX = translateCoords.scale[0];
                            scaleY = translateCoords.scale[1];
                            scale = zoomListener.scale();
                            svgGroup.transition().attr("transform", "translate(" + translateX + "," + translateY + ")scale(" + scale + ")");
                            d3.select(domNode).select('g.node').attr("transform", "translate(" + translateX + "," + translateY + ")");
                            zoomListener.scale(zoomListener.scale());
                            zoomListener.translate([translateX, translateY]);
                            panTimer = setTimeout(function () {
                                pan(domNode, speed, direction);
                            }, 50);
                        }
                    }

                    // Define the zoom function for the zoomable tree

                    function zoom() {
                        svgGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
                        //svgGroup.attr("transform", "translate(" + d3.event.translate + ")");  //禁止缩放
                    }


                    // define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents

                    var zoomListener = d3.behavior.zoom().scaleExtent([0.1, 3]).on("zoom", zoom);

                    function initiateDrag(d, domNode) {
                        draggingNode = d;
                        d3.select(domNode).select('.ghostCircle').attr('pointer-events', 'none');
                        d3.selectAll('.ghostCircle').attr('class', 'ghostCircle show');
                        d3.select(domNode).attr('class', 'node activeDrag');

                        svgGroup.selectAll("g.node").sort(function (a, b) { // select the parent and sort the path's
                            if (a.id != draggingNode.id) return 1; // a is not the hovered element, send "a" to the back
                            else return -1; // a is the hovered element, bring "a" to the front
                        });
                        // if nodes has children, remove the links and nodes
                        if (nodes.length > 1) {
                            // remove link paths
                            links = tree.links(nodes);
                            nodePaths = svgGroup.selectAll("path.link")
                                .data(links, function (d) {
                                    return d.target.id;
                                }).remove();
                            // remove child nodes
                            nodesExit = svgGroup.selectAll("g.node")
                                .data(nodes, function (d) {
                                    return d.id;
                                }).filter(function (d, i) {
                                    if (d.id == draggingNode.id) {
                                        return false;
                                    }
                                    return true;
                                }).remove();
                        }

                        // remove parent link
                        parentLink = tree.links(tree.nodes(draggingNode.parent));
                        svgGroup.selectAll('path.link').filter(function (d, i) {
                            if (d.target.id == draggingNode.id) {
                                return true;
                            }
                            return false;
                        }).remove();

                        dragStarted = null;
                    }

                    function moveNode(dt) {
                        if (!dt) return;
                        //console.log(dt);
                        var parentId = dt.parent ? dt.parent.id : '0';
                        var param = {
                            access_token: app.url.access_token,
                            groupId: groupId,
                            parentId: parentId,
                            id: dt.id
                        };
                        if (parentId == '0') {
                            dt.attributes.tempProfit = dt.attributes.parentProfit;
                            dt.attributes.parentProfit = '0';
                            dt.parentId = '0';
                        } else {
                            if (dt.attributes.tempProfit) {
                                dt.attributes.parentProfit = dt.attributes.tempProfit;
                            }
                            if (dt.parent) {
                                dt.parentId = dt.parent.id;
                            }
                        }
                        $http({
                            url: app.url.yiliao.updateProfitRelation,
                            method: 'post',
                            data: param
                        }).then(function (resp) {
                            if (resp.data.resultCode === 1) {
                                modal.toast.success("修改成功！");
                            } else {
                                modal.toast.warn(resp.data.resultMsg);
                            }
                        }, function (x) {
                            console.error(x.statusText);
                        });
                    }

                    // define the baseSvg, attaching a class for styling and the zoomListener
                    var baseSvg = d3.select("#tree-container").append("svg")
                        .attr("width", viewerWidth)
                        .attr("height", viewerHeight)
                        .attr("class", "overlay")
                        .call(zoomListener);


                    // Define the drag listeners for drag/drop behaviour of nodes.
                    dragListener = d3.behavior.drag()
                        .on("dragstart", function (d) {
                            if (d == root) {
                                return;
                            }
                            dragStarted = true;
                            nodes = tree.nodes(d);
                            d3.event.sourceEvent.stopPropagation();
                            // it's important that we suppress the mouseover event on the node being dragged. Otherwise it will absorb the mouseover event and the underlying node will not detect it d3.select(this).attr('pointer-events', 'none');
                        })
                        .on("drag", function (d) {
                            if (d == root) {
                                return;
                            }
                            if (dragStarted) {
                                domNode = this;
                                initiateDrag(d, domNode);
                            }

                            // get coords of mouseEvent relative to svg container to allow for panning
                            relCoords = d3.mouse($('svg').get(0));
                            if (relCoords[0] < panBoundary) {
                                panTimer = true;
                                pan(this, 'left');
                            } else if (relCoords[0] > ($('svg').width() - panBoundary)) {

                                panTimer = true;
                                pan(this, 'right');
                            } else if (relCoords[1] < panBoundary) {
                                panTimer = true;
                                pan(this, 'up');
                            } else if (relCoords[1] > ($('svg').height() - panBoundary)) {
                                panTimer = true;
                                pan(this, 'down');
                            } else {
                                try {
                                    clearTimeout(panTimer);
                                } catch (e) {

                                }
                            }

                            d.x0 += d3.event.dy;
                            d.y0 += d3.event.dx;
                            var node = d3.select(this);
                            node.attr("transform", "translate(" + d.y0 + "," + d.x0 + ")");
                            updateTempConnector();
                        }).on("dragend", function (d) {
                            if (d == root) {
                                return;
                            }
                            domNode = this;
                            if (selectedNode) {
                                // now remove the element from the parent, and insert it into the new elements children
                                var index = draggingNode.parent.children.indexOf(draggingNode);
                                if (index > -1) {
                                    draggingNode.parent.children.splice(index, 1);
                                }
                                if (typeof selectedNode.children !== 'undefined' || typeof selectedNode._children !== 'undefined') {
                                    if (typeof selectedNode.children !== 'undefined') {
                                        selectedNode.children.push(draggingNode);
                                    } else {
                                        selectedNode._children.push(draggingNode);
                                    }
                                } else {
                                    selectedNode.children = [];
                                    selectedNode.children.push(draggingNode);
                                }
                                // Make sure that the node being added to is expanded so user can see added node is correctly moved
                                expand(selectedNode);
                                sortTree();
                                endDrag();
                                moveNode(d);
                            } else {
                                endDrag();
                            }
                        });

                    function endDrag() {
                        selectedNode = null;
                        d3.selectAll('.ghostCircle').attr('class', 'ghostCircle');
                        d3.select(domNode).attr('class', 'node');
                        // now restore the mouseover event or we won't be able to drag a 2nd time
                        d3.select(domNode).select('.ghostCircle').attr('pointer-events', '');
                        updateTempConnector();
                        if (draggingNode !== null) {
                            update(root);
                            centerNode(draggingNode);
                            draggingNode = null;
                        }
                    }

                    // Helper functions for collapsing and expanding nodes.

                    function collapse(d) {
                        if (d.children) {
                            d._children = d.children;
                            d._children.forEach(collapse);
                            d.children = null;
                        }
                    }

                    function expand(d) {
                        if (d._children) {
                            d.children = d._children;
                            d.children.forEach(expand);
                            d._children = null;
                        }
                    }

                    var overCircle = function (d) {
                        selectedNode = d;
                        updateTempConnector();
                    };
                    var outCircle = function (d) {
                        selectedNode = null;
                        updateTempConnector();
                    };

                    // Function to update the temporary connector indicating dragging affiliation
                    var updateTempConnector = function () {
                        var data = [];
                        if (draggingNode !== null && selectedNode !== null) {
                            // have to flip the source coordinates since we did this for the existing connectors on the original tree
                            data = [{
                                source: {
                                    x: selectedNode.y0,
                                    y: selectedNode.x0
                                },
                                target: {
                                    x: draggingNode.y0,
                                    y: draggingNode.x0
                                }
                            }];
                        }
                        var link = svgGroup.selectAll(".templink").data(data);

                        link.enter().append("path")
                            .attr("class", "templink")
                            .attr("d", d3.svg.diagonal())
                            .attr('pointer-events', 'none');

                        link.attr("d", d3.svg.diagonal());

                        link.exit().remove();
                    };

                    // Function to center node when clicked/dropped so node doesn't get lost when collapsing/moving with large amount of children.

                    function centerNode(source) {
                        target = source;
                        scale = zoomListener.scale();
                        x = -source.y0;
                        y = -source.x0;
                        x = x * scale + viewerWidth / 2 - 300;
                        //x = x * scale + viewerWidth / 2 - $('.overlay').children().width() + 100;
                        y = y * scale + viewerHeight / 2;
                        d3.select('g').transition()
                            .duration(duration)
                            .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
                        zoomListener.scale(scale);
                        zoomListener.translate([x, y]);
                    }

                    $scope.centerNode = centerNode;

                    $(window).resize(function () {
                        viewerWidth = $('#tree-container').width() - 15;
                        viewerHeight = $(this).height() - 195;
                        if (viewerWidth < 0 || viewerHeight < 0) return;
                        baseSvg.attr("width", viewerWidth).attr("height", viewerHeight);
                        centerNode(target);
                    });

                    // Toggle children function

                    function toggleChildren(d) {
                        if (d.children) {
                            d._children = d.children;
                            d.children = null;
                        } else if (d._children) {
                            d.children = d._children;
                            d._children = null;
                        }
                        return d;
                    }

                    // Toggle children on click.

                    function flex(d) {
                        if (d3.event.defaultPrevented) return; // click suppressed
                        d = toggleChildren(d);
                        update(d);
                        centerNode(d);
                    }

                    function click(d, n, e) {
                        var evt = e || window.event;
                        evt.stopPropagation();
                        if (!d.parentId) return;
                        var info = {
                            name: d.name,
                            id: d.id,
                            pid: d.parentId,
                            groupProfit: d.attributes.groupProfit,
                            superProfit: d.attributes.parentProfit
                        };
                        centerNode(d);
                        isListMode = false;
                        setLevel(d);
                        //forward(info);
                    }

                    var tips = $('<div class="tip-tool"></div>');
                    var body = $('body');

                    function update(source) {
                        // Compute the new height, function counts total children of root node and sets tree height accordingly.
                        // This prevents the layout looking squashed when new nodes are made visible or looking sparse when nodes are removed
                        // This makes the layout more consistent.
                        var levelWidth = [1];
                        var childCount = function (level, n) {

                            if (n.children && n.children.length > 0) {
                                if (levelWidth.length <= level + 1) levelWidth.push(0);

                                levelWidth[level + 1] += n.children.length;
                                n.children.forEach(function (d) {
                                    childCount(level + 1, d);
                                });
                            }
                        };
                        childCount(0, root);
                        var newHeight = d3.max(levelWidth) * 45; // 25 pixels per line
                        tree = tree.size([newHeight, viewerWidth]);

                        // Compute the new tree layout.
                        var nodes = tree.nodes(root).reverse(),
                            links = tree.links(nodes);

                        // Set widths between levels based on maxLabelLength.
                        nodes.forEach(function (d) {
                            d.y = (d.depth * (maxLabelLength * 10)); //maxLabelLength * 10px
                            // alternatively to keep a fixed scale one can set a fixed depth per level
                            // Normalize for fixed-depth by commenting out below line
                            // d.y = (d.depth * 500); //500px per level.
                        });

                        // Update the nodes
                        node = svgGroup.selectAll("g.node")
                            .data(nodes, function (d) {
                                return d.id || (d.id = ++i);
                            });

                        // Enter any new nodes at the parent's previous position.
                        var nodeEnter = node.enter().append("g")
                            .call(dragListener)
                            .attr("class", "node")
                            .attr("transform", function (d) {
                                return "translate(" + source.y0 + "," + source.x0 + ")";
                            });
                        //.on('click', flex);

                        nodeEnter.append("circle")
                            .attr('class', 'nodeCircle')
                            .attr("r", 0)
                            .style("fill", function (d) {
                                return d._children ? "lightsteelblue" : "#fff";
                            }).on('click', flex);

                        nodeEnter.append("text")
                            .attr("x", function (d) {
                                return d.children || d._children ? -10 : 10;
                            })
                            .attr("dy", ".35em")
                            .attr('class', 'nodeText')
                            .attr("text-anchor", function (d) {
                                return d.children || d._children ? "end" : "start";
                            })
                            .text(function (d) {
                                return d.name;
                            })
                            .style("fill-opacity", 0);

                        // phantom node to give us mouseover in a radius around it
                        nodeEnter.append("circle")
                            .attr('class', 'ghostCircle')
                            .attr("r", 20)
                            .attr("opacity", 0.2) // change this to zero to hide the target area
                            .style("fill", "red")
                            .attr('pointer-events', 'mouseover')
                            .on("mouseover", function (node) {
                                overCircle(node);
                            })
                            .on("mouseout", function (node) {
                                outCircle(node);
                            });

                        // Update the text to reflect whether node has children or not.
                        node.select('text')
                            .attr("x", function (d) {
                                if (d.parentId) {
                                    return 10;
                                } else {
                                    return d.children || d._children ? -10 : 10;
                                }
                            })
                            .attr("text-anchor", function (d) {
                                if (d.parentId) {
                                    return "start";
                                } else {
                                    return d.children || d._children ? "end" : "start";
                                }
                            })
                            .text(function (d) {
                                return d.name;
                            }).on('click', click).on('mouseover', function (d, n, e) {
                                if (!d.attributes) return;
                                if (d.parent.id == '0') {
                                    d.attributes.parentProfit = '0';
                                }
                                var evt = e || window.event;
                                var str = '<img src="' + d.attributes.headPicFileName + '"/><div><b>姓名：</b>' + d.name +
                                    '<br/><b>医院：</b></b>' + (d.attributes.hospital || '') +
                                    '<br/><span><b>科室：</b>' + (d.attributes.departments || '') +
                                    '</span>&nbsp;&nbsp;<span><b>职称：</b>' + (d.attributes.title || '') +
                                    '</span><br/><span><b>集团抽成：</b>' + (d.attributes.groupProfit || 0) +
                                    '%</span>&nbsp;&nbsp;<span><b>上级抽成：</b>' + (d.attributes.parentProfit || 0) + '%</span></div>';
                                tips.html(str);
                                tips.css({'top': evt.clientY + 20, 'left': evt.clientX + 14});
                                body.append(tips);
                            }).on('mouseout', function () {
                                tips.remove();
                            });

                        // Change the circle fill depending on whether it has children and is collapsed
                        node.select("circle.nodeCircle")
                            .attr("r", 6)
                            .style("fill", function (d) {
                                return d._children ? "#0f0" : "#fff";
                            });

                        // Transition nodes to their new position.
                        var nodeUpdate = node.transition()
                            .duration(duration)
                            .attr("transform", function (d) {
                                return "translate(" + d.y + "," + d.x + ")";
                            });

                        // Fade the text in
                        nodeUpdate.select("text")
                            .style("fill-opacity", 1);

                        // Transition exiting nodes to the parent's new position.
                        var nodeExit = node.exit().transition()
                            .duration(duration)
                            .attr("transform", function (d) {
                                return "translate(" + source.y + "," + source.x + ")";
                            })
                            .remove();

                        nodeExit.select("circle")
                            .attr("r", 0);

                        nodeExit.select("text")
                            .style("fill-opacity", 0);

                        // Update the links
                        var link = svgGroup.selectAll("path.link")
                            .data(links, function (d) {
                                return d.target.id;
                            });

                        // Enter any new links at the parent's previous position.
                        link.enter().insert("path", "g")
                            .attr("class", "link")
                            .attr("d", function (d) {
                                var o = {
                                    x: source.x0,
                                    y: source.y0
                                };
                                return diagonal({
                                    source: o,
                                    target: o
                                });
                            });

                        // Transition links to their new position.
                        link.transition()
                            .duration(duration)
                            .attr("d", diagonal);

                        // Transition exiting nodes to the parent's new position.
                        link.exit().transition()
                            .duration(duration)
                            .attr("d", function (d) {
                                var o = {
                                    x: source.x,
                                    y: source.y
                                };
                                return diagonal({
                                    source: o,
                                    target: o
                                });
                            })
                            .remove();

                        // Stash the old positions for transition.
                        nodes.forEach(function (d) {
                            d.x0 = d.x;
                            d.y0 = d.y;
                        });
                    }

                    // Append a group which holds all nodes and which the zoom Listener can act upon.
                    var svgGroup = baseSvg.append("g");

                    // Define the root
                    root = treeData;
                    root.x0 = viewerHeight / 2;
                    root.y0 = 0;

                    // Layout the tree initially and center on the root node.
                    update(root);
                    centerNode(root);

                    window.center = $scope.center = centerNode;
                    //});
                }
            };

            makeTree("src/js/testData.json");
        });
    }
});
