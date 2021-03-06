(function() {
    angular.module('app')
        .directive('qiniuUploader', qiniuUploader);

    function qiniuUploader() {
        return {
            scope: {
                token: '@',
                bucket: '@',
                uploader: '=?',
                upload: '=?',
                successCallBack: '=?',
                errorCallBack: '=?',
                addedCallBack: '=?',
                progressCallBack: '=?',
                fileList: '=?',
                cancel: '=?',
                qniuSetting: '=?',
                maxFileSize: '@',
                chunkSize: '@',
                uniqueNames: '@',
                multiSelection: '@',
                filters: '=?',
                maxSelect: '=?',
            },
            template:
            '<div id="container" class="hide">'+
                '<!--<a class="btn btn-default btn-lg " id="pickfiles">-->'+
            '<!--<i class="glyphicon glyphicon-plus"></i>-->'+
            '<!--<span>选择文件</span>-->'+
            '<!--</a>-->'+
            '<div ng-if="false">'+
            '<ul class="block">'+
            '<li ng-repeat="file in fileList">'+
            '名字：{{file.name}} 大小：{{file.size}} 已上传：{{file.loadedSize}} 速度：{{file.formatSpeed}} 进度：{{file.percent}}% 上传状态：{{file.status}}'+
    '<a ng-click="cancel(file,$index)" ng-if="file.status!=-1 && file.status!=4 && file.status!=5">取消上传</a>'+
            '<span ng-if="file.status==-1">已取消上传</span>'+
            '<span ng-if="file.status==5">已上传完毕</span>'+
            '</li>'+
            '</ul>'+
            '<!--'+
            '*获取上传uptoken参数：token'+
        '*获取上传uptoken参数:bucket'+
        '*上传初始化配置：qniu-setting(uptoken)，如果配置了token和bucket就不需要调用此函数初始化'+
        '*上传事件按钮：upload'+

        '上传对象：uploader 为一个plupload对象，继承了所有plupload的方法'+
        '每个文件上传成功后回调：success-call-back(up, file, info)'+
        '每个文件上传失败后回调：error-call-back(up, err, errTip)'+
        '每个文件上传时回调：progressCallBack(up,file)'+
        '选择文件后的回调：added-call-back(up, files)'+
        '上传文件列表：file-list'+
        '单个文件取消上传：cancel'+
        '上传文件大小限制：max-file-size  默认100mb'+
        '分块大小：chunk-sizee'+
        '是否随机文件名：unique-names'+
        '多个文件上传：multi-selection 默认false'+
        '文件格式：过滤filters = {'+
            'mime_types: [ //只允许上传图片和zip文件'+
                '{'+
                    'title: "Image files",'+
                    'extensions: "jpg,gif,png"'+
                '}, {'+
                    'title: "Zip files",'+
                    'extensions: "zip"'+
                '}'+
            ']'+
        '}'+
        '每次最多可选择文件的数量：maxSelect'+
        '-->'+
        '</div>'+
        '</div>',

        //templateUrl: function() {
        //        var isCheck = window.location.href.indexOf('/check/');
        //        if (isCheck != -1)
        //            return '../components/qiniuUploader/qiniuUploaderView.html';
        //        else
        //            return 'components/qiniuUploader/qiniuUploaderView.html';
        //    }(),
            controller: 'QiniuUploaderCtrl',
        };
    }
})();
