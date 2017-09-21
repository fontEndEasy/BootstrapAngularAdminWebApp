'use strict';

app.controller('InvitePatientList', ['$rootScope', '$scope', '$state', '$timeout', '$http', 'utils', 'Doctor', 'modal',
    function ($rootScope, $scope, $state, $timeout, $http, utils, Doctor, modal) {

        var url = app.url.yiliao.getPatients,
            data = [],
            tags = [];

        $http({
            "method": "post",
            "url": url,
            "data": {
                access_token: app.url.access_token
            }
        }).then(function (resp) {
            if(resp.data.resultCode == '1'){
                data = resp.data.data.users;
                tags = resp.data.data.tags;
                if(tags){
                    createGroupList(tags);
                }
            }else{

            }
        });

        var groupList = $('#group_list');
        var iEdit, iDelete;
        function addEditBtn(e){
            var that = $(this);
            var ele = that.children('div');
            iEdit = $('<i class="pos-edit fa fa-pencil-square-o"></i>');
            iDelete = $('<i class="pos-delete fa fa-trash-o"></i>');
            that.append(iEdit).append(iDelete);

            iEdit.click(function (e) {
                var evt = e || window.event;
                evt.stopPropagation();
                that.off();
                //that.hover(function(){},function(){});
                editGroup(false, ele);
            });

            iDelete.click(function (e) {
                var evt = e || window.event;
                evt.stopPropagation();
                modal.confirm('删除标签', '您确定要删除吗？', function(){
                    $http({
                        url: app.url.yiliao.deletePatientTag,
                        method: 'post',
                        data: {
                            access_token: app.url.access_token,
                            tagName: ele.html()
                        }
                    }).then(function(resp){
                        if(resp.data.resultCode === 1){
                            modal.toast.success('删除成功!');
                            that.remove();
                        }else{
                            modal.toast.error(resp.data.resultMsg);
                        }
                    });
                });
            });
        }

        // 创建分组列表
        function createGroupList(dt){
            var len = dt.length;
            if(len > 0) {
                var sysArr = [];
                var cusArr = [];
                var uncArr = [];
                groupList.html('');
                for (var i = 0; i < len; i++) {
                    var li = $('<li></li>');
                    var div = $('<div>' + dt[i].tagName + '</li>');
                    if (!dt[i].sys) {
                        var span = $('<span class="badge bg-info">' + dt[i].num + '</span>');
                        cusArr.push(li);
                        li.data('ids', dt[i].userIds);
                        li.hover(addEditBtn, function leave(info) {
                            iEdit.remove();
                            iDelete.remove();
                        });
                    } else if (dt[i].tagName == "未激活") {
                        var span = $('<span class="badge bg-warning">' + dt[i].num + '</span>');
                        uncArr.push(li);
                    } else {
                        var span = $('<span class="badge bg-primary">' + dt[i].num + '</span>');
                        sysArr.push(li);
                    }
                    li.append(div);
                    li.append(span);
                    li.on('click', dt[i].userIds, viewList);
                }
                groupList.append(sysArr.concat(uncArr, cusArr));
                sysArr[0].trigger('click');
            }
            editGroup(true);
        }

        function editGroup(isNew, pnode){
            if(isNew){
                var div = $('<div class="custom-group"></div>');
                var edit_btn = $('<button type="submit" class="w100 btn btn-default"></button>');
                var edit_i = $('<i class="fa fa-fw fa-plus"></i>');
                var edit_span = $('<span class="hid">添加分组</span>');

                edit_btn.append(edit_i);
                edit_btn.append(edit_span);

                div.append(edit_btn);
                div.insertAfter(groupList);

                var edit_item = $('<div class="edit-item"></div>');
            }


            var edit_ok = $('<button type="submit" class="add-btn ok-btn">取 消</button>');
            var edit_div = $('<div></div>');
            var edit_ipt = $('<input type="text"/>');
            var tagname = '';
            edit_div.append(edit_ipt);

            if(isNew){
                edit_item.append(edit_ok);
                edit_item.append(edit_div);
            }else{
                tagname = pnode.html();
                iEdit.remove();
                iDelete.remove();
                edit_ipt.val(tagname);
                pnode.html('');
                pnode.append(edit_ok);
                pnode.append(edit_div);
                pnode.css('margin-left', -12);
                edit_ipt.off().bind('focus', iptFocus).bind('blur', iptBlur);
                edit_ok.one('click', addCancel);
                edit_ipt.trigger('focus').select();
            }

            var timer = 0, tempKey = '';

            var updateData = function(){
                var val = edit_ipt.val();
                var param = {
                    access_token: app.url.access_token,
                    tagName: val
                };
                if(!isNew){
                    param.oldName = tagname;
                    param.userIds = pnode.parent().data('ids');
                }

                $http({
                    url: app.url.yiliao.addPatientTag,
                    method: 'post',
                    data: param
                }).then(function(resp){
                    if(resp.data.resultCode === 1){
                        if(isNew) {
                            var li = $('<li>' + val + '</li>');
                            var span = $('<span class="badge bg-info">0</span>');
                            li.append(span);
                            li.on('click', [], viewList);
                            groupList.append(li);
                            modal.toast.success('添加成功！');
                        }else{
                            pnode.parent().on('click', param.userIds, viewList);
                            tagname = val;
                            modal.toast.success('修改成功！');
                        }
                        edit_ipt.val('');
                        addCancel();
                    }else{
                        modal.toast.error(resp.data.resultMsg);
                    }
                });

                if(isNew) {
                    edit_btn.off();
                }
            };
            function addCancel(){
                if(isNew){
                    edit_item.remove();
                    div.append(edit_btn);
                    edit_btn.one('click', editData);
                }else{
                    pnode.css('margin-left', 'inherit');
                    pnode.html(tagname);
                    pnode.parent().hover(addEditBtn, function leave(info) {
                        iEdit.remove();
                        iDelete.remove();
                    });
                }

                edit_ipt.off();
            };

            function iptFocus(){
                clearInterval(timer);
                timer = setInterval(function(){
                    var _key = $.trim(edit_ipt.val());
                    if(tempKey !== _key && _key && tagname !== _key) {
                        edit_ok.off();
                        edit_ok.one('click', updateData);
                        edit_ok.html('确 定');
                        tempKey = _key;
                    }else if(tempKey !== _key && (!_key && _key != '0')){
                        edit_ok.off();
                        edit_ok.html('取 消');
                        edit_ok.one('click', addCancel);
                    }
                }, 100);
            };

            function iptBlur(){
                clearInterval(timer);
            };

            function editData(){
                edit_btn.remove();
                div.append(edit_item);

                edit_ipt.bind('focus', iptFocus);
                edit_ipt.bind('blur', iptBlur);
                edit_ok.one('click', addCancel);
                edit_ipt.trigger('focus');
            };

            if(isNew) edit_btn.one('click', editData);
        }

        function viewList(e){
            var dt = e.data;
            var users = [];
            var len = dt.length;
            if(len > 0){
                for(var i=0; i<len; i++){
                    var _val = utils.queryByKey(data, dt[i], false, null, ['userId']);
                    if(_val.length > 0){
                        users.push(_val[0]);
                    }
                }
            }
            if(users){
                if(dTable) dTable.fnDestroy();
                setTable(users);
            }
            groupList.find('.cur-group').removeClass('cur-group');
            $(this).addClass('cur-group');
        }

        // 查看某一信息
        $scope.seeDetails = function (id) {
            if (id) {
                $('#doctor_details').removeClass('hide');
                $rootScope.winVisable = true;
                Doctor.addData(id);
            }
        };

        /////////////////////////////////////////////////////////////////

        var keyIpt = $('#key_ipt'),
            timer = 0,
            tmpKey = 'not empty!!!!!!!!!!',
            curLine = $('.cur-line'),
            curBkLine = $('.cur-back-line');

        keyIpt.val($rootScope.keyword);
        keyIpt.focus(function(){
            if($('.cur-line').length !== 0){
                curLine = $('.cur-line');
                curBkLine = $('.cur-back-line');
            }
            curLine.removeClass('cur-line');
            curBkLine.removeClass('cur-back-line');
            timer = setInterval(function(){
                var val = $.trim(keyIpt.val());
                $rootScope.keyword = val;
                if(tmpKey !== val && /\S+/.test(val)){
                    /*                if (curBkLine.length === 0) {
                     curLine = $('.cur-line');
                     curBkLine = $('.cur-back-line');
                     }
                     curLine.removeClass('cur-line');
                     curBkLine.removeClass('cur-back-line');
                     $rootScope.keyword = tmpKey = val;
                     $rootScope.isSearch = true;
                     utils.localData('tmpKey', tmpKey);
                     $rootScope.loaded = false;
                     $state.go('app.contacts.list', {id: tmpKey}, {reload: false});*/
                }else if(!val && val != '0'){
                    $rootScope.loaded = true;
                    tmpKey = 'not empty!!!!!!!!!!';
                    $rootScope.isSearch = false;
                }
            }, 100);
        });
        keyIpt.blur(function(){
            clearInterval(timer);
            if(!$rootScope.isSearch){
                curLine.addClass('cur-line');
                curBkLine.addClass('cur-back-line');
                $state.go('app.contacts.list',{id:$rootScope.curDepartmentId},{reload:false});
            }
        });

        $scope.submit = function(){
            var val = $.trim(keyIpt.val());

            /*        if(curBkLine.length === 0){
             curLine = $('.cur-line');
             curBkLine = $('.cur-back-line');
             }
             curLine.removeClass('cur-line');
             curBkLine.removeClass('cur-back-line');*/
            $rootScope.keyword = tmpKey = val;
            $rootScope.isSearch = true;
            utils.localData('tmpKey', tmpKey);
            $rootScope.loaded = false;
            $state.go('app.contacts.list',{id:tmpKey + '_' + new Date().getTime()},{reload:false});
        };

        ////////////////////////////////////////////////////////////

        // 初始化表格
        var doctorList, dTable, setTable;

        function initTable(dt) {
            var name,
                index = 1,
                start = 0,
                length = utils.localData('page_length') * 1 || 10,
                param = {};

            setTable = function (dt) {
                if ($rootScope.isSearch) {
                    doctorList = $('#searchList');
                } else {
                    doctorList = $('#contactsList');
                }
                dTable = doctorList.dataTable({
                    "draw": index,
                    "displayStart": start,
                    "lengthMenu": [5, 10, 15, 20, 30, 40, 50, 100],
                    "pageLength": length,
                    "bServerSide": false,
                    "data": dt,
                    "searching": false,
                    "language": app.lang.datatables.translation,
                    "createdRow": function (nRow, aData, iDataIndex) {
                        //var a_link = $(nRow).find('.a-link');
                        //a_link.click(function () {
                        //    $scope.seeDetails(aData.doctorId);
                        //});
                    },
                    "columns": [{
                        "data": "headPicFileName",
                        "orderable": false,
                        "render": function (set, status, dt) {
                            if (set) {
                                var path = set;
                            } else {
                                var path = 'src/img/a0.jpg';
                            }
                            return '<img class="a-link" src="' + path + '"/>';
                        }
                    }, {
                        "data": "name",
                        "orderable": false,
                        "searchable": false,
                        "render": function (set, status, dt) {
                            return '<a class="a-link">' + set + '</a>';
                        }
                    }, {
                        "data": "sex",
                        "orderable": false,
                        "searchable": false,
                        "render": function (set, status, dt) {
                            return (set == '1' ? '男' : set == '2' ? '女' : '未知');
                        }
                    }, {
                        "data": "telephone",
                        "orderable": false,
                        "searchable": false
                    }]
                });
            };

            //setTable();
        }

        initTable();

    }]);