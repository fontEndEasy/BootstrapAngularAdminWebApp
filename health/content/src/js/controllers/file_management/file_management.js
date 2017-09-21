'use strict';

app.controller('fileManagementCtrl', function($rootScope, $scope, $http, toaster, $modal, editableThemes, editableOptions,$window) {

    editableThemes.bs3.inputClass = 'input-xs';
    editableThemes.bs3.buttonsClass = 'btn-xs';
    editableOptions.theme = 'bs3';


    // var zip = new JSZip();

    // zip.file("Hello.txt", "Hello World\n");
    // zip.file("Hello2.txt", "23213\n");

    // // var img = zip.folder("images");
    // // img.file("smile.gif", imgData, {
    // //     base64: true
    // // });

    // var content = zip.generate({
    //     type: "blob"
    // });
    // // see FileSaver.js
    // $scope.test = function() {
    //     // saveAs(content, "example.zip");
    //     window.open('http://vpan.dev.file.dachentech.com.cn/o_1a8v4ho3q56m13h72nb6gmf3la.zip');
    //     window.open('http://vpan.dev.file.dachentech.com.cn/o_1a8v4ho3q56m13h72nb6gmf3la.zip');
    //     window.open('http://vpan.dev.file.dachentech.com.cn/o_1a91lle4vt4e1qbl1jkoq29bdb9.js');
    // };
    // window.location = "data:application/zip," + zip.generate({
    //     type: "base64"
    // });




    // 七牛上传文件过滤
    // $scope.qiniuFilters = {
    //     mime_types: [ //只允许上传图片和zip文件
    //         {
    //             title: "Image files",
    //             extensions: "jpg,gif,png"
    //         }, {
    //             title: "Zip files",
    //             extensions: "zip"
    //         }
    //     ]
    // }

    // 设置七牛上传获取uptoken的参数
    $scope.token = localStorage.getItem('access_token');

    // bytes to kB or MB...
    $scope.byte = function(bytes, precision) {
        if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
        if (typeof precision === 'undefined') precision = 1;
        var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
            number = Math.floor(Math.log(bytes) / Math.log(1024));
        return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) + ' ' + units[number];
    };
    // 计算正在上传和已经上传的文件数量
    $scope.upLoadingFilesNbr = function(files) {
        var acount = 0;
        angular.forEach(files, function(file) {
            if (file.status == 'ok') {
                acount++
            }
        })
        return acount;
    };
    // 计算正待的文件数量
    $scope.waitingFilesNbr = function(files) {
        var acount = 0;
        angular.forEach(files, function(file) {
            if (file.status == -1) {
                acount++
            }
        })

        if (files && files.length)
            acount = files.length - acount;

        return acount;
    };


    // 选择文件后回调
    $scope.uploaderAdded = function(up, files) {
        $scope.uploadBoxOpen = true;
    };
    // 每个文件上传成功回调
    $scope.uploaderSuccess = function(up, file, info) {
        var res = JSON.parse(info);
        saveFileInfo(
                file.name,
                file.type,
                file.size,
                res.key,
                res.hash
            )
            .then(function(response) {
                var rep = response.data;
                if (rep && rep.resultCode === 1) {
                    $scope.fileList.forEach(function(item,index,array){
                        if(item.id==res.key){
                            item.fileId=rep.data.id;
                        }
                    });

                    for (var i = 0; i < $scope.fileList.length; i++) {
                        if ($scope.fileList[i].id == file.id) {
                            $scope.fileList[i].status = 'ok';
                            $scope.fileList[i].percent = 100;
                            break;
                        }
                    }
                    getMyFile($scope.page, $scope.page_size);

                } else if (rep.resultMsg) {
                    toaster.pop('error', null, rep.resultMsg);
                }
            });

    };
    // 每个文件上传失败后回调
    $scope.uploaderError = function(up, err, errTip) {
        // console.error(up, err, errTip);
        toaster.pop('error', null, errTip);
    };
    // 保存文件元信息
    function saveFileInfo(name, mimeType, size, key, hash) {
        return $http({
            url: app.yiliao + 'vpanfile/saveFileInfo',
            method: 'post',
            // headers: {
            //     'access_token': $scope.accessToken || '',
            //     'Content-Type': 'application/json'
            // },
            data: {
                access_token: localStorage.getItem('access_token'),
                name: name,
                mimeType: mimeType,
                size: size,
                key: key,
                hash: hash
            }
        });

    };

    ////////////////////////文件列表///////////////////////

    $scope.myFiles = [];

    $scope.page = 1;
    $scope.page_size = 10;

    //搜索模式 upload=我上传的文件 receive=我接收的文件
    $scope.mode = 'upload';
    //文件分类（可以为空）文档=document，图片=picture，视频=video，音乐=music，其它=other
    $scope.type = '';
    //排序属性 name=按名称排序，size=按文件大小排序，date=按上传时间排序（默认
    $scope.sortAttr = 'date';
    //排序顺序 1=顺序（默认），-1=倒序
    $scope.sortType = -1;
    //关键字
    $scope.fileNameKey = '';

    // 换页
    $scope.pageChanged = function() {
        $scope.getMyFile($scope.page, $scope.page_size);
    };

    // 文件格式识别
    $scope.fileFormatIdentify = function(item) {
        var suffix=item.suffix.toLowerCase();
        var fileTypeUrl='./src/img/fileFormat/';

        if (suffix == 'ppt')
            return fileTypeUrl+'ppt.png';

        if (suffix == 'pdf')
            return fileTypeUrl+'pdf.png';

        if (suffix == 'rtf')
            return fileTypeUrl+'rtf.png';

        if (suffix == 'txt')
            return fileTypeUrl+'txt.png';

        if (suffix == 'xml')
            return fileTypeUrl+'xml.png';

        if (suffix == 'xls')
            return fileTypeUrl+'excle.png';

        if (
            suffix == 'doc' ||
            suffix == 'docx'
        )
            return fileTypeUrl+'word.png';

        // if (
        //     suffix == 'rar' ||
        //     suffix == 'zip'
        // )
        //     return 'zip';

        // if (
        //     suffix == 'doc' ||
        //     suffix == 'docx' ||
        //     suffix == 'txt' ||
        //     suffix == 'xps' ||
        //     suffix == 'pdf' ||
        //     suffix == 'rtf' ||
        //     suffix == 'xml'
        // )
        //     return 'document';

        if (
            suffix == 'jpg' ||
            suffix == 'jpeg' ||
            suffix == 'png' ||
            suffix == 'gif' ||
            suffix == 'bmp'
        )
            return item.url+'?imageView2/3/w/50/h/50'||fileTypeUrl+'image.png';

        if (
            suffix == 'mp4' ||
            suffix == 'avi' ||
            suffix == 'rmvb' ||
            suffix == 'rm' ||
            suffix == 'asf' ||
            suffix == 'divx' ||
            suffix == 'mpg' ||
            suffix == 'mpeg' ||
            suffix == 'mpe' ||
            suffix == 'wmv' ||
            suffix == 'mkv' ||
            suffix == 'vob' ||
            suffix == 'mov'
        )
            return fileTypeUrl+'video.png';

        if (
            suffix == 'mp3' ||
            suffix == 'wma' ||
            suffix == 'aac' ||
            suffix == 'mid' ||
            suffix == 'wav' ||
            suffix == 'vqf' ||
            suffix == 'cda'
        )
            return fileTypeUrl+'audio.png';

        return fileTypeUrl+'unknow.png';
    };

    // 获取文件列表
    getMyFile($scope.page, $scope.page_size);

    function getMyFile(pageIndex, pageSize, mode, type, sortAttr, sortType, fileNameKey) {

        $scope.isCheckAll = false;
        $scope.mgFilesIsLoading = true;

        $http({
            url: app.yiliao + 'vpanfile/queryFile',
            method: 'post',
            data: {
                access_token: localStorage.getItem('access_token'),
                pageIndex: pageIndex - 1,
                pageSize: pageSize,
                mode: mode || $scope.mode || null,
                type: type || $scope.type || null,
                fileNameKey: fileNameKey || $scope.fileNameKey || null,
                sortAttr: sortAttr || $scope.sortAttr || 'date',
                sortType: sortType || $scope.sortType || -1
            }
        }).then(function(response) {
            var rep = response.data;
            if (rep && rep.resultCode == 1) {
                // console.log(rep.data);
                $scope.page_count = rep.data.total;
                $scope.page_size = rep.data.pageSize;
                $scope.myFiles = rep.data.pageData;

            } else {
                console.warn(rep);
            }
            $scope.mgFilesIsLoading = false;
        });
    };
    $scope.getMyFile = getMyFile;

    // 文件重命名
    $scope.fileReName = function(id, newName) {
        console.log(newName);
        $http({
            url: app.yiliao + 'vpanfile/updateFileName',
            method: 'post',
            data: {
                access_token: localStorage.getItem('access_token'),
                newName: newName,
                id: id
            }
        }).then(function(response) {
            var rep = response.data;
            if (rep && rep.resultCode == 1) {
                toaster.pop('success', null, '修改成功');
            } else if (rep.resultMsg) {
                toaster.pop('error', null, rep.resultMsg);
            } else {
                console.warn(rep);
            }
        });
    };

    // 选择的文件
    $scope.checkList = function(files, property) {
        var chacks = [];
        angular.forEach(files, function(file) {
            if (file.isCheck)
                chacks.push(file[property]);
        })
        return chacks;
    };

    // 删除文件确认窗口
    $scope.openDeleteConfirmDialog = function(fileIds, mode) {

        var ids = [];
        if (!Array.isArray(fileIds) || fileIds.length < 1) {
            ids.push(fileIds);
        } else {
            ids = fileIds;
        }

        var modalInstance = $modal.open({
            templateUrl: 'DeleteConfirmDialog.html',
            controller: 'DeleteConfirmDialogCtrl',
            size: 'sm'
        });

        modalInstance.result.then(function(isDelete) {
            if (isDelete)
                deleteFile(ids, mode);
        });

    };

    // 删除文件
    function deleteFile(ids, mode) {

        var url = app.yiliao + 'vpanfile/deleteUploadFile';
        // 我上传的
        if (mode == 'upload') {
            url = app.yiliao + 'vpanfile/deleteUploadFile';
        }
        // 我接受的
        else if (mode == 'receive') {
            url = app.yiliao + 'vpanfile/deleteSendFile';
        } else {
            toaster.pop('error', null, '删除出错：mode不能为空');
        }

        $http({
            url: url,
            method: 'post',
            data: {
                access_token: localStorage.getItem('access_token'),
                ids: ids
            }
        }).then(function(response) {
            var rep = response.data;
            if (rep && rep.resultCode == 1) {
                toaster.pop('success', null, '删除成功');
                getMyFile($scope.page, $scope.page_size);
                for (var i = 0; i < $scope.fileList.length; i++) {
                    if ($scope.fileList[i].id == ids[0]) {
                        $scope.fileList[i].status = 'ok';
                        $scope.fileList[i].percent = 100;
                        break;
                    }
                }
                $scope.fileList=$scope.fileList.filter(function(item){
                    return item.fileId!=ids;
                });
            } else if (rep.resultMsg) {
                toaster.pop('error', null, rep.resultMsg);
            } else {
                console.warn(rep);
            }
        });
    };

    // 全选
    $scope.checkAll = function() {

        var isCheck = false;

        if ($scope.isCheckAll)
            isCheck = true;
        else
            isCheck = false;

        angular.forEach($scope.myFiles, function(file) {
            file.isCheck = isCheck;
        })

    };

    // 单选
    $scope.checkOne = function() {
        for (var i = 0; i < $scope.myFiles.length; i++) {

            // 只有一个
            if ($scope.myFiles.length == 1) {
                if ($scope.myFiles[i].isCheck) {
                    $scope.isCheckAll = true;
                } else {
                    $scope.isCheckAll = false;
                }
                break;
            }

            if (!$scope.myFiles[i].isCheck) {
                $scope.isCheckAll = false;
                break;
            }

            // 最后一个
            if (i == $scope.myFiles.length - 1) {
                if ($scope.myFiles[i].isCheck)
                    $scope.isCheckAll = true;
                break;
            }
        }
    };

    $scope.openVideoModal=function(item){
        var modalInstance = $modal.open({
            templateUrl: 'videoModalContent.html',
            controller: 'videoModalCtrl',
            windowClass:'videoModal',
            backdrop: 'static',
            //size: 'md',
            resolve: {
                item: function () {
                    return item;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {

        }, function () {

        });
    };

    window.onbeforeunload=function($event){
        var isUploadind=$scope.fileList.some(function(item,index,array){
            return item.status == 2||item.status==1;
        });
        if(isUploadind){
            return '当前有文件正在上传或者等待上传，确认关闭此页面？';
        }
    };

});
// 删除文件确认弹框
app.controller('DeleteConfirmDialogCtrl', function($scope, $modalInstance) {
    $scope.ok = function() {
        $modalInstance.close(true);
    };

    $scope.close = function() {
        $modalInstance.dismiss('cancel');
    };
});

//播放视频文件
app.controller('videoModalCtrl', function($scope, $modalInstance,item,$sce) {
    $scope.item=item;
    $scope.videoUrl=$sce.trustAsResourceUrl(item.url);
    $scope.audioBgUrl=item.suffix=='mp3'?'src/img/audio.png':'';

    $scope.close = function() {
        $modalInstance.dismiss('cancel');
    };
});
