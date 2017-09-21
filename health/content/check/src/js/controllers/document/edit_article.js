app.controller('EditCtrl', function($scope, $timeout,utils,$http,$modal,Upload,toaster,$state,$stateParams,$sce) {
    $scope.titleLength=0;
    $scope.summaryLength=0;
    $scope.formData={};
    $scope.formData.keywords=[];
    $scope.formData.isShow=true;
    $scope.fontImg=null;
    $scope.fontImgUrl=null;
    $scope.copy_small=null;
    $scope.isSaved=false;
    var isEdit=false;
    var articleId=null;

    localStorage.removeItem('articlePreview');
    var um = UM.getEditor('myEditor',{
        initialFrameWidth:'100%',
        initialFrameHeight:300,
        imageUrl:app.url.upload.CommonUploadServlet,
        imagePath:'',
        uploadPath:'article'
    });

    $scope.$on('$destroy', function() {
        um.destroy();
    });


    //编辑文章
    if($stateParams.id){
        isEdit=true;
        $http.post(app.url.document.getArticleById, {
            access_token:app.url.access_token,
            articleId:$stateParams.id
        }).
        success(function(data, status, headers, config) {
            if(data.resultCode==1){
                $scope.formData={
                    summary:data.data.description,
                    title:data.data.title,
                    keywords:data.data.tag,
                    selectedType:data.data.disease,
                    author:data.data.author
                };
                $scope.fontImgUrl=data.data.copyPath;
                $scope.copy_small=data.data.copy_small;
                $scope.formData.isShow=data.data.isShow==1?true:false;
                if(data.data.description.length==100){
                    $scope.formData.summary=data.data.description.substring(0,94)+'......';
                }
                articleId=data.data.id;
                um.setContent(data.data.content);
            }
            else{
                console.log(data.resultMsg);
            }
        }).
        error(function(data, status, headers, config) {
            alert(data.resultMsg);
        });
    }



    $scope.$watch('formData.title',function(newValue, oldValue){
        if(newValue!=oldValue){
            if($scope.formData.title){
                $scope.titleLength=$scope.formData.title.length;
            }
            else{
                $scope.titleLength=0;
            }
        }
    });
    $scope.$watch('formData.summary',function(newValue, oldValue){
        if(newValue!=oldValue){
            if($scope.formData.summary){
                $scope.summaryLength=$scope.formData.summary.length;
            }
            else{
                $scope.summaryLength=0;
            }
        }
    });

    //选择病种分类
    $scope.chooseType=function(){
        var diseaseModal = new DataBox('data_res', {
            hasCheck: false,
            allCheck: false,
            leafCheck: true,
            multiple: false,
            allHaveArr: false,
            self: false,
            cover: false,
            leafDepth: 2,
            selectView: false,
            search: {
                searchDepth: [1],
                dataKey: {
                    name: 'name',
                    id: 'id',
                    union: 'parentId',
                    dataSet: 'data'
                },
                unwind: false
            },
            arrType:[0,0],
            data: {
                url: app.url.document.getDiseaseTree
            },
            titles: {
                main: '选择病种',
                searchKey: '搜索病种...',
                label: '已选择病种数'
            },
            fixdata: [],
            icons: {
                arrow: 'fa fa-caret-right/fa fa-caret-down',
                check: 'fa fa-check/fa fa-square',
                root: 'fa fa-hospital-o cfblue',
                branch: 'fa fa-h-square cfblue',
                leaf: 'fa fa-stethoscope dcolor',
                head: 'headPicFileName'
            },
            response: diseaseSelected,
            datakey: {
                id: 'id',
                name: 'name',
                sub: 'children'
            },
            info: {
                name: 'name',
                id: 'id',
                leaf: 'leaf'
            }
        });
    };



    //选择病种标签
    $scope.chooseDisease=function(){
        var tagsModal = new DataBox('data_res', {
            hasCheck: true,
            allCheck: true,
            leafCheck: true,
            multiple: true,
            allHaveArr: false,
            self: false,
            cover: false,
            leafDepth: 3,
            selectView: true,
            search: {
                searchDepth: [2],
                dataKey: {
                    name: 'name',
                    id: 'id',
                    union: 'parentId',
                    dataSet: 'data'
                },
                unwind: false
            },
            arrType:[0,0],
            data: {
                url: app.url.document.getDiseaseTree
            },
            titles: {
                main: '选择标签',
                searchKey: '搜索标签...',
                label: '已选择标签数'
            },
            icons: {
                arrow: 'fa fa-caret-right/fa fa-caret-down',
                check: 'fa fa-check/fa fa-square',
                root: 'fa fa-hospital-o cfblue',
                branch: 'fa fa-h-square cfblue',
                leaf: 'fa fa-stethoscope dcolor',
                head: 'headPicFileName'
            },
            fixdata:$scope.formData.keywords,
            response: tagsSelected,
            datakey: {
                id: 'id',
                name: 'name',
                sub: 'children'
            },
            info: {
                name: 'name',
                id: 'id',
                leaf: 'leaf'
            }
        });

    };

    function diseaseSelected(dt){
        console.log(dt);
        $scope.formData.selectedType=dt[0];
        $scope.$apply($scope.formData.selectedType);
    }

    function tagsSelected(dt){
        $scope.formData.keywords=dt;
        $scope.$apply($scope.formData.keywords);
    }

    $scope.removeItem = function(item){
        var index = $scope.formData.keywords.indexOf(item);
        $scope.formData.keywords.splice(index,1);
        console.log($scope.formData.keywords);
    };



    // 七牛上传文件过滤
    $scope.qiniuFilters = {
        mime_types: [ //只允许上传图片和zip文件
            {
                title: "Image files",
                extensions: "jpg,gif,png"
            }
        ]
    };

    //选择文件上传
    $scope.selectFile = function(){
        $scope.upload();
    };

    // 设置七牛上传获取uptoken的参数
    $scope.token = localStorage.getItem('access_token');
    // 选择文件后回调
    $scope.uploaderAdded = function(up, files) {
        $scope.uploadPercent=0;
        console.log(up,files);
    };
    // 每个文件上传成功回调
    $scope.uploaderSuccess = function(up, file, info) {
        $scope.fontImgUrl=file.url;
        $scope.copy_small=file.url+'?imageView2/3/w/200/h/200';
        $scope.uploadPercent=100;
        toaster.pop('success',null,'封面修改成功！');
    };
    // 每个文件上传失败后回调
    $scope.uploaderError = function(up, err, errTip) {
        if(err.code==-600){
            toaster.pop('error', null, '文件过大');
        }
        else{
            toaster.pop('error', null, errTip);
        }
    };

    //上传进度
    $scope.fileUploadProcess=function(up, file){
        $scope.uploadPercent=file.percent==100?99:file.percent;
    };

    //保存文章
    $scope.saveDoc=function(){
        var tagsId=[];
        if(!$scope.formData.title){
            toaster.pop('warn','','请填写标题')
            return;
        }
        if(!$scope.fontImgUrl){
            toaster.pop('warn','','请上传题图');
            return;
        }
        if($scope.formData.keywords!=null&&$scope.formData.keywords.length>0){
            $scope.formData.keywords.forEach(function(item,index,array){
                tagsId.push(item.id);
            });
        }
        var html = um.getContent();
        //有摘要，则显示摘要。没有摘要，则去第一段文字的前100字，第一段文字不足100字，这只取第一段文字。
        var firstParagraph=um.getPlainTxt().split('/\n')[0].slice(0,100);
        var isShow=$scope.formData.isShow==false?0:1;
        $scope.isSaved=true;

        if(isEdit==true){
            $http.post(app.url.document.updateArticle, {
                access_token:app.url.access_token,
                articleId:articleId,
                author:$scope.formData.author,
                title:$scope.formData.title,
                diseaseId:$scope.formData.selectedType?$scope.formData.selectedType.id:null,
                isShow:isShow,
                tags:tagsId,
                copyPath:$scope.fontImgUrl,
                copy_small:$scope.copy_small,
                isShare:1,//1为分享
                description:$scope.formData.summary?$scope.formData.summary:firstParagraph,
                content:html
            }).
            success(function(data, status, headers, config) {
                if(data.resultCode==1){

                    if($state.includes('app.edit_article')){
                        toaster.pop('success','','保存成功,3秒钟后返回文章列表');
                        setTimeout(function(){
                            $state.go('app.doc.article.list',{},{reload:true});
                        },3000);
                    }
                    else if($state.includes('edit_article')){
                        window.opener.reflashData();
                        toaster.pop('success','','保存成功,3秒钟后返回');
                        setTimeout(function(){
                            $state.go('article',{id:$stateParams.id},{reload:true});
                        },3000);
                    }

                }
                else{
                    $scope.isSaved=false;
                    toaster.pop('error','',data.resultMsg);
                }
            }).
            error(function(data, status, headers, config) {
                $scope.isSaved=false;
                toaster.pop('error','',data.resultMsg);
            });
        }
        else{
            //不需要传author
            $http.post(app.url.document.addArticle, {
                access_token:app.url.access_token,
                title:$scope.formData.title,
                diseaseId:$scope.formData.selectedType?$scope.formData.selectedType.id:null,
                isShow:isShow,
                createType:1,
                tags:tagsId,
                copyPath:$scope.fontImgUrl,
                copy_small:$scope.copy_small,
                isShare:1,//1为分享
                description:$scope.formData.summary?$scope.formData.summary:firstParagraph,
                content:html
            }).
            success(function(data, status, headers, config) {
                if(data.resultCode==1){
                    toaster.pop('success','','保存成功,3秒钟后返回文章列表');
                    setTimeout(function(){
                        $state.go('app.doc.article.list',{},{reload:true});
                    },3000);
                }
                else{
                    $scope.isSaved=false;
                    toaster.pop('error','',data.resultMsg);
                }
            }).
            error(function(data, status, headers, config) {
                $scope.isSaved=false;
                toaster.pop('error','',data.resultMsg);
            });
        }

    };

    //预览文章，并不保存
    $scope.toPreview=function(){

        if(!$scope.formData.title){
            toaster.pop('warn','','请填写标题');
            return;
        }

        if(!$scope.fontImgUrl){
            toaster.pop('warn','','请上传题图');
            return;
        }

        //有摘要，则显示摘要。没有摘要，则去第一段文字的前100字，第一段文字不足100字，这只取第一段文字。
        var firstParagraph=um.getPlainTxt().split('/\n')[0].slice(0,100);
        var isShow=$scope.formData.isShow==false?0:1;
        var html = um.getContent();
        var articlePreview={
            authorName:'玄关患教中心',
            title:$scope.formData.title,
            keywords:$scope.formData.keywords,
            isShow:isShow,
            copyPath:$scope.fontImgUrl,
            description:$scope.formData.summary?$scope.formData.summary:firstParagraph,
            content:html
        };

        localStorage.setItem('articlePreview',JSON.stringify(articlePreview));

        var url = $state.href('article', {id: 'preview'});
        window.open(url,'_blank');
    };
});