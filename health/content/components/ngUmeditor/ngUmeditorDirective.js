(function() {
    angular.module('app')
        .directive('ngUmeditor', ngUmeditor);

    function ngUmeditor() {
        return {
            scope: {
                token: '@',
                content: '=',
            },
            template:'<!-- ���ر༭�������� -->'+
            '<script id="ngUmeditorContainer" name="content" type="text/plain">'+
            '</script>'+
            '<!-- ��ţ�ϴ���� -->'+
            '<qiniu-uploader token="{{token}}" bucket="vpan" upload="upload" filters="qiniuFilters" file-list="fileList" max-file-size="2mb" chunk-sizee="1mb" success-call-back="uploaderSuccess" error-call-back="uploaderError" added-call-back="uploaderAdded"></qiniu-uploader>'+
            '<!-- ��ţ�ϴ���� end -->',
            //templateUrl: function() {
            //    var isChack = window.location.href.indexOf('/check/');
            //    if (isChack != -1)
            //        return '../components/ngUmeditor/ngUmeditorView.html';
            //    else
            //        return 'components/ngUmeditor/ngUmeditorView.html';
            //}(),
            controller: 'ngUmeditorCtrl',
        };
    }
})();
