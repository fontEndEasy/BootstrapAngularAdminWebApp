(function() {
    angular.module('app')
        .factory('AddArticleFtory', AddArticleFtory)

    // 手动注入依赖
    AddArticleFtory.$inject = ['$http', '$modal', '$http', 'toaster'];

    function AddArticleFtory($http, $modal, $http, toaster) {
        return {
            open: openModel
        };

        function openModel(artilceData, callBack) {

            if (!artilceData) artilceData = {};

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: function() {
                    var isChack = window.location.href.indexOf('/check/');
                    if (isChack != -1)
                        return '../src/tpl/care/followUp/addArticle.html';
                    else
                        return 'src/tpl/care/followUp/addArticle.html';
                }(),
                controller: 'AddArticleCtrl',
                windowClass: 'docModal doc',
                resolve: {
                    artilceData: function() {
                        return artilceData;
                    }
                }
            });
            modalInstance.result.then(function(artilce) {

                var jsonData = {
                    articleId: artilce.followUpDayDetails.itemId
                }

                $http.post(app.urlRoot + 'designer/saveArticleItem', {
                    access_token: app.url.access_token,
                    sendTime: artilceData.sendTime,
                    carePlanId: artilceData.carePlanId,

                    schedulePlanId: artilceData.schedulePlanId,
                    dateSeq: artilceData.dateSeq,
                    jsonData: JSON.stringify(jsonData)
                }).then(function(rpn) {
                    rpn = rpn.data;
                    if (rpn && rpn.resultCode == 1) {
                        toaster.pop('success', null, '添加成功');
                        if (callBack)
                            callBack(artilceData);
                    } else if (rpn && rpn.resultMsg) {
                        toaster.pop('error', null, rpn.resultMsg);
                    } else {
                        toaster.pop('error', null, '添加出错');
                        console.error(rpn);
                    };
                });

            });
        };

    };

    angular.module('app')
        .controller('AddArticleCtrl', AddArticleCtrl)

    function AddArticleCtrl($scope, $http, $modal, $modalInstance, toaster, utils, artilceData) {
        console.log(artilceData)


        //当前集团id
        var curGroupId = app.url.groupId();

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
            access_token: app.url.access_token,
            createType: 4,
            createrId: curGroupId,
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
                access_token: app.url.access_token,
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
                access_token: app.url.access_token,
                createType: 4,
                createrId: curGroupId,
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
                    access_token: app.url.access_token,
                    createType: 4,
                    createrId: curGroupId,
                    pageIndex: 1,
                    pageSize: 5,
                    diseaseId: currentTreeId
                };
            } else {
                allDocUrl = app.url.document.findArticleByTag;
                allDocParam = {
                    access_token: app.url.access_token,
                    createType: 4,
                    createrId: curGroupId,
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
                    access_token: app.url.access_token,
                    createType: 4,
                    createrId: curGroupId,
                    pageIndex: 1,
                    pageSize: 5
                };
            } else {
                //搜索标题
                allDocUrl = app.url.document.findArticleByKeyWord;
                allDocParam = {
                    title: $scope.mainKeyword,
                    access_token: app.url.access_token,
                    createType: 4,
                    createrId: curGroupId,
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


                            return '<img src=' + photoPath + ' alt="..." style="width:60px;height:60px;margin-right:10px;float:left;border-radius:0;">' +
                                '<span class="clear">' +
                                '<span>' + dt.title + '</span>' +
                                '<small class="text-muted clear text-ellipsis">' + keywordsStr.substring(0, 30) +
                                '</small>' +
                                '<small class="text-muted clear text-ellipsis">作者：' + authorName + groupNameStr + ' ' + doctorTitle + doctorHos +
                                '</small>' +
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

    };

})();
