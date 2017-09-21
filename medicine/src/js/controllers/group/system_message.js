'use strict';
app.controller('messageList', function($rootScope, $scope, $state, $timeout, $http, utils) {
    var datable = null;
    setTable({});
    //获取表格
    function setTable() {
        var data = {};
        if ($scope.title != null && $scope.title.length != 0) {
            data.title = "%" + $scope.title + "%";
        }
        $http({
            url: app.url.messages_list,
            method: 'post',
            data: data
        }).then(function(rpn) {
            dataTable(rpn.data.info_list);
        });

        function dataTable(data) {
            if (datable) { //表格是否已经初始化
                datable.fnClearTable(); //清理表格数据
            }
            datable = $('#messagecontactsList').dataTable({
                "language": app.lang.datatables.translation,
                "ordering": false,
                "searching": false,
                "bDestroy": true, //可重新初始化
                "lengthMenu": [10, 15, 20, 30, 40, 50, 100],
                data: data,
                columns: [{
                    "render": function(set, status, dt) {
                        if (dt.is_read == false) {
                            return "<strong>" + dt.received_time + "</strong>";
                        } else {
                            return dt.received_time;
                        }
                    }
                }, {
                    "render": function(set, status, dt) {
                        if (dt.is_read == false) {
                            return "<a class='a-link' style='colour:chartreuse'><strong id='_" + dt.id + "'>" + dt.title + "</strong></a>";
                        } else {
                            return "<a class='a-link' style='colour:black'>" + dt.title + "</a>";
                        }
                    }
                }, {
                    "data": function(set, status, dt) {
                        if (set.is_read == false) {
                            return "<span id='" + set.id + "'><strong>未读</strong></span>";
                        } else {
                            return "已读";
                        }
                    },
                    "orderable": false,
                    "searchable": false
                }],
                "createdRow": function(nRow, aData, iDataIndex) {
                    var a_link = $(nRow).find('.a-link');
                    a_link.click(function() {
                        //设置点击事件
                        $http.get(app.url.set_read + '?id=' + aData.id).
                        success(function(data, status, headers, config) {
                            $("#" + aData.id).html("已读");
                            $("#" + '_' + aData.id).css('font-weight', 'normal');
                            // setTable({});
                        });
                    });
                }
            });
        }
    };

    var id = "";
    // 查看某一信息
    $scope.seeDetails = function(id) {
        if (id) {
            $('#doctor_details').removeClass('hide');
            $rootScope.winVisable = true;
            Doctor.addData(id);
        }
    };

    //按回车键搜索文档标题
    $scope.pressEnter = function($event) {
        if ($event.keyCode == 13) {
            $scope.findByKeyWord();
        }
    };

    //关键字搜索文档标题
    $scope.findByKeyWord = function() {
        $scope.title = $scope.mainKeyword;
        setTable();
    };
});
