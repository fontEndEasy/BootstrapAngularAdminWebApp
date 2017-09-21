'use strict';
//日程题库
app.controller('NewFollowUpCtrl', function($rootScope, $scope, $state, $http, $stateParams, $compile, utils, $modal, toaster) {

    // 判断是否修改随访计划
    if ($stateParams.planId) {
        $http.post(app.url.care.findFollowUpTemplate, {
            access_token: app.url.access_token || localStorage.getItem('check_access_token'),
            //groupId: localStorage.getItem('curGroupId'),
            tmplateId: $stateParams.planId
        }).
        then(function(rpn) {
            console.log(rpn.data);
            if (rpn.data.resultCode === 1) {
                $scope.lists = rpn.data.data;
            } else {
                toaster.pop('error', null, rpn.data.resultMsg);
            }
        });

    } else {

        var defaultData = {
            name: '',
            diseaseLable: '',
            diseaseLableName: '',
            description: '',
            //groupId: localStorage.getItem('curGroupId'),
            followUpDays: [{
                dayNum: 1,
                followUpDayDetails: []
            }]
        }

        $scope.lists = defaultData;
    }


    // 添加日程
    $scope.addDay = function() {
        if (!$scope.lists.followUpDays[$scope.lists.followUpDays.length - 1].dayNum && $scope.lists.followUpDays[$scope.lists.followUpDays.length - 1].dayNum != 0)
            return toaster.pop('error', null, '请选择时间');
        if (!$scope.lists.followUpDays[$scope.lists.followUpDays.length - 1].name) {
            toaster.pop('error', null, '请填写每日的日程主题');
            return;
        }
        $scope.lists.followUpDays.push({
            followUpDayDetails: []
        });
    };

    //删除日程
    $scope.removeFollowUpDay=function(index){
        $scope.lists.followUpDays.splice(index,1);
    };

    // 提交保存的格式
    // {
    //     'id': '模板ID',
    //     'name': '模板名称',
    //     'groupId': '集团ID',
    //     diseaseLable: '病种id',
    //     description: '简介',
    //     'followUpDays': [{
    //         'id': '随访计划按天ID',
    //         'dayNum': '第N天',
    //         'followTemplateId': '随访计划模板ID',
    //         'name': '名称',
    //         'followUpDayDetails': [{
    //             'id': '详情ID',
    //             'type': '1:患教资料2:调查表3:生活量表',
    //             'followTemplateDateId': '随访按天ID',
    //             'itemId': '生活量表ID，调查表ID，教患资料ID',
    //             'name': 'name'
    //         }]
    //     }]
    // }

    // 保存
    $scope.save = function() {

        // 提示语
        if ($stateParams.planId) {
            var sucessMsg = '修改成功';
        } else {
            var sucessMsg = '添加成功';
        }

        if ($scope.lists.name == '')
            return toaster.pop('error', null, '请输入随访计划名称');
        if ($scope.lists.diseaseLable == '')
            return toaster.pop('error', null, '请选择随访标签');
        if (!$scope.lists.followUpDays[$scope.lists.followUpDays.length - 1].dayNum && $scope.lists.followUpDays[$scope.lists.followUpDays.length - 1].dayNum != 0)
            return toaster.pop('error', null, '请选择时间间隔');
        if (!$scope.lists.followUpDays[$scope.lists.followUpDays.length - 1].name)
            return toaster.pop('error', null, '请填写每日的日程主题');
        if ($scope.lists.description == '')
            return toaster.pop('error', null, '请输入随访计划简介');

        var json = JSON.stringify($scope.lists);
        console.log($scope.lists);
        $http.post(app.url.care.addFollowUpTemplate, {
            access_token: app.url.access_token || localStorage.getItem('check_access_token'),
            data: json
        }).
        then(function(rpn) {
            // console.log(rpn.data);
            if (rpn.data.resultCode === 1) {
                toaster.pop('error', null, sucessMsg);
                // $state.go('app.new_follow_up', {
                //     planId: rpn.data.data.templateId
                // });
                $state.go('app.follow_up_table');
            } else {
                toaster.pop('error', null, rpn.data.resultMsg);
            }
        });
    };

    //选择病种
    $scope.chooseDisease = function() {
        if ($stateParams.planId) {
            return toaster.pop('error', null, '不能更改病种');
        }
        getDisease();
    }

    function getDisease() {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'NewFollowUp_DiseaseSelected.html',
            controller: 'NewFollowUp_DiseaseSelected',
            size: 'md'
        });
        modalInstance.result.then(function(disease) {
            $scope.lists.diseaseLable = disease.diseaseLable;
            $scope.lists.diseaseLableName = disease.diseaseLableName;
        });
    }

    // 设置提醒内容
    $scope.textEditor = function(index) {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'NewFollowUp_TextDialog.html',
            controller: 'NewFollowUp_TextDialogCtrl',
            size: 'md'
        });
        // 回调
        modalInstance.result.then(function(text) {
            var result = {
                followUpDayDetails: {
                    itemId: text,
                    type: 7,
                    name: text
                }
            }
            $scope.lists.followUpDays[index].followUpDayDetails.push(result.followUpDayDetails);
        });
    };

    // 调整时间
    $scope.timeEditor = function(index, timePoint, prevTime) {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'NewFollowUp_TimeDialog.html',
            controller: 'NewFollowUp_TimeDialogCtrl',
            size: 'md',
            resolve: {
                data: function() {
                    var data = {
                        timePoint: timePoint,
                        prevTime: prevTime
                    }
                    return data;
                }
            }
        });
        // 回调
        modalInstance.result.then(function(timePoint) {
            $scope.lists.followUpDays[index].dayNum = timePoint;
        });
    };

    // 添加调查表或生活量表
    $scope.addList = function(type, index) {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'NewFollowUp_AddList.html',
            controller: 'NewFollowUp_AddListCtrl',
            size: 'lg',
            resolve: {
                data: function() {
                    var data = {
                        type: type
                    }
                    return data;
                }
            }
        });
        // 回调
        modalInstance.result.then(function(result) {
            if (isRepeat($scope.lists.followUpDays[index].followUpDayDetails, result.followUpDayDetails)) {
                if (type == 3) {
                    var msg = '该生活量表已添加';
                } else if (type == 5) {
                    var msg = '该调查表已添加';
                }
                return toaster.pop('error', null, msg);
            }
            $scope.lists.followUpDays[index].followUpDayDetails.push(result.followUpDayDetails);
        });
    };

    // 移除调查表或生活量表
    $scope.removeList = function(index, item) {
        var itemIndex = $scope.lists.followUpDays[index].followUpDayDetails.indexOf(item);
        $scope.lists.followUpDays[index].followUpDayDetails.splice(itemIndex, 1);
    }

    //从平台添加文章
    $scope.addFromPlatform = function(index) {
        var modalInstance = $modal.open({
            templateUrl: 'docModalContent.html',
            controller: 'NewFollowUp_docModalInstanceCtrl',
            windowClass: 'docModal doc'
        });

        modalInstance.result.then(function(result) {
            if (isRepeat($scope.lists.followUpDays[index].followUpDayDetails, result.followUpDayDetails)) {
                return toaster.pop('error', null, '该文章已经添加');
            }
            $scope.lists.followUpDays[index].followUpDayDetails.push(result.followUpDayDetails);
        });
    };


    // 判断是否重复添加
    function isRepeat(array, item) {
        if (array.length === 0) return false;
        for (var i = array.length - 1; i >= 0; i--) {
            if (array[i].itemId == item.itemId && array[i].type == item.type) {
                return true;
            }
        };
        return false;
    }

});

// 设置提醒内容
app.controller('NewFollowUp_TextDialogCtrl', function($scope, $modalInstance, toaster) {


    $scope.confirm = function() {
        if (!$scope.text) {
            return toaster.pop('error', null, '请输入提醒内容');
        }
        $modalInstance.close($scope.text);
    };
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

});

// 调整时间
app.controller('NewFollowUp_TimeDialogCtrl', function($scope, $modalInstance, toaster, data) {

    $scope.timePoint = data.timePoint;
    $scope.prevTime = data.prevTime;

    // 默认选择的时间
    if (!$scope.timePoint) {
        $scope.timePoint = $scope.prevTime + 1;
    }
    $scope.confirm = function() {
        $modalInstance.close($scope.timePoint);
    };
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

});
//选择病种弹窗
app.controller('NewFollowUp_DiseaseSelected', function($rootScope, $scope, $modalInstance, $http, utils, toaster) {

    var disease = {
        diseaseLableName: '',
        diseaseLable: ''
    }

    //生成病种树
    function setTree(argument) {
        var contacts = new Tree('sch_cnt_list', {
            hasCheck: false,
            allCheck: false,
            multiple: false,
            allHaveArr: false,
            self: true,
            search: false,
            arrType: [0, 0],
            data: {
                url: app.url.yiliao.getTypeByParent,
                param: {
                    access_token: app.url.access_token || localStorage.getItem('check_access_token'),
                    parentId: null
                }
            },
            datakey: {
                id: 'id',
                name: 'name',
                sub: 'children'
            },
            info: {
                name: 'name',
                id: 'id',
                pid: 'department',
                leaf: 'leaf'
            },
            events: {
                click: select
            },
            callback: function() {
                // alert(1);
            }
        });

        function select(info) {
            console.log(info);
            disease.diseaseLable = info.id;
            disease.diseaseLableName = info.name;
        }
    }

    $scope.add = function() {
        $modalInstance.close(disease);
    }

    setTimeout(setTree, 0);

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});
// 添加调查表或生活量表
app.controller('NewFollowUp_AddListCtrl', function($rootScope, $scope, $modalInstance, $state, $http, toaster, data) {

    var type = data.type;

    if (type === 3) {
        $scope.viewName = "添加生活量表";
    }
    // 如果是调查表，需转换类型，查询是5，提交是2
    else if (type === 5) {
        $scope.viewName = "添加调查表";
    }

    //生成病种树
    function setTree(argument) {
        var contacts = new Tree('sch_list', {
            hasCheck: false,
            allCheck: false,
            multiple: false,
            allHaveArr: false,
            self: true,
            search: false,
            arrType: [0, 0],
            data: {
                url: app.url.care.getDiseaseTypeTree,
                param: {
                    access_token:  app.url.access_token || localStorage.getItem('check_access_token'),
                    //groupId: localStorage.getItem('curGroupId'),
                    tmpType: type
                }
            },
            datakey: {
                id: 'id',
                name: 'name',
                sub: 'children'
            },
            info: {
                name: 'name',
                id: 'id',
                pid: 'department',
                leaf: 'leaf'
            },
            events: {
                click: setTable
            },
            callback: function() {
                var dts = contacts.tree.find('dt');
                // //默认获取等一个子节点数据
                // for (var i = 0; i < dts.length; i++) {
                //     if (dts.eq(i).data().info.leaf) {
                //         setTable(dts.eq(i).data().info);
                //         return;
                //     }
                // }
                // 默认获取root 全部 的数据
                setTable(dts.eq(0).data().info);
            }
        });
        var datable = null;
        setTable({});
        //获取表格
        function setTable(info) {
            $scope.diseaseNameSelected = info.name;
            if (!info.name) {
                return;
            }
            //选择父节点
            // if (!info.leaf) {
            //     return;
            // }
            // if (!info.id) {
            //     return toaster.pop('error', null, '缺少参数：病种ID');
            // }
            $http.post(app.url.care.queryCareTemplateItem, {
                access_token:  app.url.access_token || localStorage.getItem('check_access_token'),
                categoryId: info.id,
                type: type
            }).
            then(function(rpn) {
                // console.log(rpn.data);
                if (rpn.data.resultCode === 1) {
                    dataTable(rpn.data.data);
                } else {
                    toaster.pop('error', null, rpn.data.resultMsg);
                }

            });

            function dataTable(data) {
                if (datable) { //表格是否已经初始化
                    datable.fnClearTable(); //清理表格数据
                }
                datable = $('#listDatable').dataTable({
                    "language": app.lang.datatables.translation,
                    "ordering": false,
                    "searching": false,
                    "bDestroy": true, //可重新初始化
                    "lengthMenu": [10, 15, 20, 30, 40, 50, 100],
                    "bLengthChange": false,

                    data: data,
                    columns: [{
                        data: null,
                        title: "编号",
                        createdCell: function(nTd, sData, oData, iRow, iCol) {
                            var startnum = this.api().page() * (this.api().page.info().length);
                            $(nTd).html(iRow + 1 + startnum);
                        }
                    }, {
                        data: 'ghnrContent'
                    }, {
                        data: null,
                        "defaultContent": "<button class='btn btn-primary text-xs btn-xs'>添加</button>"
                    }],
                    "createdRow": function(nRow, aData, iDataIndex) {
                        $(nRow).on('click', 'button', function() {
                            addFollow(aData);
                        });
                    }
                });
            };

            function addFollow(data) {
                var result = {
                    followUpDayDetails: {
                        itemId: data.ghnrId,
                        type: type,
                        name: data.ghnrContent
                    }
                }
                $modalInstance.close(result);
            }
        };
    }

    setTimeout(setTree, 0);

    $scope.cancel = function() {
        // $scope.$apply();
        $modalInstance.dismiss('cancel');
    };

});

// 添加教患资料
app.controller('NewFollowUp_docModalInstanceCtrl', function($scope, $modalInstance, toaster, $http, utils) {

    //当前集团id
    var curGroupId = localStorage.getItem('curGroupId');

    //所有文档
    var platArticleTable;
    //筛选模块
    $scope.isCollapsed = false;
    $scope.open = false;

    //“更多”按钮
    $scope.showMore = false;

    //当前选中的病种id
    var currentTreeId;

    //病种标签列表
    $scope.keywords = [];

    //树的数据的加载情况
    $scope.isTreeLoad = false;

    $scope.mainKeyword = null;

    //点击搜索前所在的branch
    var preBranch;
    var tree = {};
    $scope.my_tree = tree = {};

    //所有文档获取数据的url和param
    var allDocUrl = app.url.document.getArticleByDisease;
    var allDocParam = {
        access_token:  app.url.access_token || localStorage.getItem('check_access_token'),
        createType: 1,
        pageIndex: 1,
        pageSize: 5
    };


    //文档树的数据
    $scope.my_data = [];

    function clone(myObj) {
        var newObj = {};
        newObj.label = myObj.name + '(' + myObj.count + ')';
        newObj.id = myObj.diseaseId;
        if (myObj.children != undefined) {
            newObj.children = [];
            for (var i in myObj.children) {
                newObj.children[i] = clone(myObj.children[i]);
            }
        }
        return newObj;
    }


    //这里要获取病种树的数据
    var getTreeData = function() {
        $http.post(app.url.document.findDiseaseTreeForArticle, {
            access_token: app.url.access_token || localStorage.getItem('check_access_token'),
            createType: 1
        }).
        success(function(data, status, headers, config) {
            if (data.resultCode == 1) {

                var source = {
                    count: data.data.total,
                    name: '全部文档',
                    diseaseId: null
                };

                source.children = data.data.tree;
                var result = clone(source);
                var eArray = new Array();
                eArray[0] = result;
                $scope.my_data = eArray;
                $scope.isTreeLoad = true;
            } else {
                console.log(data.resultMsg);
            }
        }).
        error(function(data, status, headers, config) {
            alert(data.resultMsg);
        });
    };

    getTreeData();

    //点击文档树节点
    $scope.my_tree_handler = function(branch) {
        currentTreeId = branch.id;
        $scope.isTop = false;

        //如果是文档树的最后节点
        if (branch.children.length == 0) {
            //请求病种标签
            $http.post(app.url.document.getDisease, {
                parentId: branch.id
            }).
            success(function(data, status, headers, config) {
                if (data.resultCode == 1) {
                    $scope.keywords = data.data;
                    if ($scope.keywords.length > 0) {
                        $scope.keywords.unshift({
                            name: '不限',
                            id: null
                        });
                    }
                } else {
                    alert(data.resultMsg);
                }
            }).
            error(function(data, status, headers, config) {
                alert(data.resultMsg);
            });

        } else {
            $scope.keywords = [];
        }

        allDocUrl = app.url.document.getArticleByDisease;
        allDocParam = {
            access_token: app.url.access_token || localStorage.getItem('check_access_token'),
            createType: 1,
            pageIndex: 1,
            pageSize: 5,
            diseaseId: branch.id
        };
        initPlatDocTable();

    };

    //watch搜索框
    $scope.mainKWLength = 0;
    $scope.$watch('mainKeyword', function(newValue, oldValue) {
        if (newValue != oldValue) {
            if ($scope.mainKeyword) {
                $scope.mainKWLength = $scope.mainKeyword.length;
            } else {
                $scope.mainKWLength = 0;
            }
        }
    });

    //观察关键字长度来确定是否显示“更多”按钮
    $scope.$watch('keywords', function(newValue, oldValue) {
        setTimeout(function() {
            var kw_c_height = $('#p_kw_content').height();
            if (kw_c_height < 70) {
                $scope.showMore = false;

            } else {
                $scope.showMore = true;
            }
            $scope.$apply('showMore');
        }, 0);
    });

    //点击病种标签
    $scope.sortByKeyword = function(keyword) {
        if (keyword.name == '不限') {
            allDocUrl = app.url.document.getArticleByDisease;
            allDocParam = {
                access_token: app.url.access_token || localStorage.getItem('check_access_token'),
                createType: 1,
                pageIndex: 1,
                pageSize: 5,
                diseaseId: currentTreeId
            };
        } else {
            allDocUrl = app.url.document.findArticleByTag;
            allDocParam = {
                access_token: app.url.access_token || localStorage.getItem('check_access_token'),
                createType: 1,
                pageIndex: 1,
                pageSize: 5,
                tags: keyword.id
            };
        }

        initPlatDocTable();
    };


    //清除搜索关键字
    $scope.clearMainKW = function() {
        $scope.my_tree.select_branch(preBranch);
        $scope.mainKeyword = null;
    };


    //按回车键搜索文档标题
    $scope.pressEnter = function($event) {
        if ($event.keyCode == 13) {
            $scope.findDocByKeyWord();
        }
    };

    //关键字搜索文档标题
    $scope.findDocByKeyWord = function() {
        preBranch = $scope.my_tree.get_selected_branch();
        $scope.my_tree.select_branch();
        $scope.keywords = [];
        if ($scope.mainKeyword == null || $scope.mainKeyword.length == 0) {
            //所有文档
            allDocUrl = app.url.document.getArticleByDisease;
            allDocParam = {
                access_token: app.url.access_token || localStorage.getItem('check_access_token'),
                createType: 1,
                pageIndex: 1,
                pageSize: 5
            };
        } else {
            //搜索标题
            allDocUrl = app.url.document.findArticleByKeyWord;
            allDocParam = {
                title: $scope.mainKeyword,
                access_token: app.url.access_token || localStorage.getItem('check_access_token'),
                createType: 1,
                pageIndex: 1,
                pageSize: 5
            };
        }
        initPlatDocTable();
    };

    // 初始化所有文档表格
    function initPlatDocTable() {
        var index = 1,
            length = 5,
            start = 0,
            size = 5;

        var setTable = function() {
            platArticleTable = $('#doc_list').DataTable({
                "language": app.lang.datatables.translation,
                "searching": false,
                "sScrollX": "100%",
                "sScrollXInner": "110%",
                "destroy": true,
                "lengthChange": true,
                "ordering": true,
                "draw": index,
                "pageLength": length,
                "lengthMenu": [5, 10, 20, 50],
                "autoWidth": false,
                "displayStart": start,
                "bServerSide": true,
                "sAjaxSource": allDocUrl,
                "fnServerData": function(sSource, aoData, fnCallback) {
                    $.ajax({
                        "type": "post",
                        "url": sSource,
                        "dataType": "json",
                        "data": allDocParam,
                        "success": function(resp) {
                            if (resp.resultCode == 1) {
                                var data = {};
                                data.recordsTotal = resp.data.total;
                                data.recordsFiltered = resp.data.total;
                                data.length = resp.data.pageSize;
                                data.data = resp.data.pageData;
                                size = aoData[4]['value'];
                                fnCallback(data);
                            } else {
                                console.log(resp.resultMsg);
                            }
                        }
                    });
                },
                "columns": [{
                    "data": "author",
                    "render": function(set, status, dt) {

                        var keywordsStr = '';
                        if (dt.tag && dt.tag.length > 0) {
                            keywordsStr += '关键字：';
                            dt.tag.forEach(function(item, index, array) {
                                if (item) {
                                    keywordsStr += item.name + '；';
                                }
                            });
                        } else {
                            keywordsStr += '&nbsp;'
                        }
                        var groupNameStr = dt.groupName ? '@' + dt.groupName + ' ' : '';
                        var doctorTitle = dt.doctor ? dt.doctor.title : '';
                        var doctorHos = dt.doctor ? '|' + dt.doctor.hospital : '';
                        var authorName = dt.authorName ? dt.authorName : '';
                        var photoPath = 'src/img/nophoto.jpg';
                        if (dt.copyPath && dt.copyPath != "") {
                            photoPath = dt.copyPath;
                        }


                        return'<img src='+photoPath+' alt="..." style="width:60px;height:60px;margin-right:10px;float:left;border-radius:0;">'+
                            '<span style="display: block;overflow: hidden;">'+
                            '<span>'+dt.title+'</span>'+
                            '<small class="text-muted clear text-ellipsis">'+keywordsStr.substring(0,30)+
                            '</small>'+
                            '<small class="text-muted clear text-ellipsis">作者：'+authorName+groupNameStr+' '+doctorTitle+doctorHos+
                            '</small>'+
                            '</span>';
                    },
                    "orderable":  false
                }, {
                    "data": "useNum",
                    "orderable":  false,
                    "render": function(set, status, dt) {
                        if (dt.useNum == undefined) {
                            return 0;
                        } else {
                            return dt.useNum;
                        }
                    }
                }, {
                    "data": "visitCount",
                    "orderable":  false,
                    "render": function(set, status, dt) {
                        if (dt.visitCount == undefined) {
                            return 0;
                        } else {
                            return dt.visitCount;
                        }
                    }
                }, {
                    "render": function(set, status, dt) {
                        return utils.dateFormat(dt.lastUpdateTime, 'yyyy-MM-dd');
                    }
                }, {
                    "render": function(set, status, dt) {
                        return "<button class='btn btn-primary text-xs btn-xs'>添加</button>"
                    },
                    "orderable":  false
                }],
                "createdRow": function(nRow, aData, iDataIndex) {
                    $(nRow).on('click', 'button', function(event) {
                        var result = {
                            followUpDayDetails: {
                                itemId: aData.id,
                                type: 6,
                                name: aData.title
                            }
                        }

                        // 回调
                        $modalInstance.close(result);
                    });
                }
            });


            // 表格事件处理,init-初始化完成,length-改变每页长度,page-翻页,search-搜索
            platArticleTable.off('page.dt').on('page.dt', function(e, settings) {
                    index = platArticleTable.page.info().page + 1;
                    start = length * (index - 1);
                    allDocParam.pageIndex = index;
                })
                .on('length.dt', function(e, settings, len) {
                    length = len;
                    index = 1;
                    start = 0;
                    allDocParam.pageIndex = 1;
                    allDocParam.pageSize = len;
                });
        };
        setTable();

    }

    setTimeout(function() {
        initPlatDocTable();
    }, 200);


    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});
