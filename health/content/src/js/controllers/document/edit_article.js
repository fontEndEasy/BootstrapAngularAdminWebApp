app.controller('EditCtrl', function($scope, $timeout,utils,$http,$modal,Upload,toaster,$stateParams,$state) {
    var groupId=localStorage.getItem('curGroupId');
    var access_token=localStorage.getItem('access_token');
    $scope.titleLength=0;
    $scope.summaryLength=0;
    $scope.formData={};
    $scope.formData.keywords=[];
    $scope.formData.isShare=true;
    $scope.formData.isShow=true;
    $scope.fontImg=null;
    $scope.fontImgUrl=null;
    $scope.copy_small=null;
    $scope.isSaved=false;
    var isEdit=false;
    var articleId=null;

    //清除掉预览的存储
    localStorage.removeItem('articlePreview');
    //um编辑器
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


    var logFromCompany=localStorage.getItem('logFromCompany');
    if(logFromCompany=='false'){
        //作者默认为当前登录管理员的名称
        $scope.formData.selectedAuthor={
            id:localStorage.getItem('user_id'),
            name:localStorage.getItem('user_name')
        };
    }


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
                    author:data.data.author,
                    summary:data.data.description,
                    title:data.data.title,
                    keywords:data.data.tag,
                    selectedType:data.data.disease
                };
                $scope.fontImgUrl=data.data.copyPath;
                $scope.copy_small=data.data.copy_small;
                $scope.formData.isShow=data.data.isShow==1?true:false;
                $scope.formData.isShare=data.data.isShare==1?true:false;
                $scope.formData.selectedAuthor={
                    id:data.data.author,
                    name:data.data.authorName
                };
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
    $scope.chooseType = function () {
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
                //url: '',
                //param: {},
                searchDepth: [1],
                dataKey: {
                    name: 'name',
                    id: 'id',
                    union: 'parentId',
                    dataSet: 'data'
                },
                //keyName: 'keyword',
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
                leaf: 'leaf',
                pid: 'parentId',
            }
        });
    };

    //选择作者
    $scope.chooseAuthor=function(){
        var authorModal = new DataBox('data_res', {
            hasCheck: true,
            allCheck: true,
            leafCheck: true,
            multiple: false,
            allHaveArr: true,
            arrType: [1, 0],
            data: {
                url: app.url.yiliao.getAllData,
                param: {
                    access_token: access_token,
                    groupId: groupId
                }
            },
            search: {
                url: app.url.yiliao.searchDoctorByKeyWord,
                param: {
                    access_token: app.url.access_token,
                    groupId: groupId,
                    keyword: 'name',
                    pageSize: 10000,
                    pageIndex: 0
                },
                dataKey: {
                    name: 'doctor.name',
                    id: 'doctorId',
                    union: 'departmentId',
                    dataSet: 'data.pageData'
                },
                keyName: 'keyword',
                unwind: false
            },
            async: {
                url: app.url.yiliao.getDepartmentDoctor,
                dataKey: {
                    departmentId: 'id'
                },
                data: {
                    access_token:access_token,
                    groupId: groupId,
                    status: 'C',
                    type: 1
                },
                dataName: '',
                target: {
                    data: '',
                    dataKey: {
                        id: 'id',
                        name: 'name'
                    }
                }
            },
            extra: [{
                name: '未分配',
                id: 'idx_0',
                parentId: 0,
                subList: [],
                url: app.url.yiliao.getUndistributed,
                dataName: 'pageData',
                target: {
                    data: 'doctor',
                    dataKey: {
                        id: 'doctorId',
                        name: 'name'
                    }
                },
                param: {
                    access_token: app.url.access_token,
                    groupId: groupId,
                    pageIndex: 0,
                    pageSize: 10000
                },
                icon: 'fa fa-bookmark'
            }],
            icons: {
                arrow: 'fa fa-caret-right/fa fa-caret-down',
                check: 'fa fa-check/fa fa-square',
                root: 'fa fa-hospital-o cfblue',
                branch: 'fa fa-h-square cfblue',
                leaf: 'fa fa-user-md dcolor',
                head: 'headPicFileName'
            },
            root: {
                selectable: false,
                name: utils.localData('curGroupName'),
                id: 'undefined'
            },
            datakey: {
                id: 'id',
                name: 'name',
                sub: 'subList'
            },
            info: {
                name: 'name',
                id: 'id',
                pid: 'parentId',
                dpt: 'departments',
                description: 'description',
                param: 'param',
                icon: 'icon',
                url: 'url',
                isExtra: 'isExtra',
                target: 'target'
            },
            response: authorSelected
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
        $scope.formData.selectedType=dt[0];
        $scope.$apply($scope.formData.selectedType);
    }

    function authorSelected(dt){
        if(dt.length>0){
            $scope.formData.selectedAuthor=dt[0];
            $scope.$apply($scope.formData.selectedAuthor);
        }
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
            toaster.pop('warn','','请填写标题');
            return;
        }
        if(!$scope.formData.selectedAuthor){
            toaster.pop('warn','','请选择作者');
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
        var isShare=$scope.formData.isShare==false?0:1;
        $scope.isSaved=true;
        if(isEdit==true){
            $http.post(app.url.document.updateArticle, {
                access_token:app.url.access_token,
                articleId:articleId,
                author:$scope.formData.selectedAuthor.id,
                title:$scope.formData.title,
                diseaseId:$scope.formData.selectedType?$scope.formData.selectedType.id:null,
                isShow:isShow,
                isShare:isShare,
                tags:tagsId,
                copyPath:$scope.fontImgUrl,
                copy_small:$scope.copy_small,
                description:$scope.formData.summary?$scope.formData.summary:firstParagraph,
                content:html
            }).
            success(function(data, status, headers, config) {
                if(data.resultCode==1){
                    if($state.includes('app.edit_article')){
                        toaster.pop('success','','保存成功,3秒钟后返回文章列表');
                        setTimeout(function(){
                            $state.go('app.article_list',{},{reload:true});
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
            $http.post(app.url.document.addArticle, {
                access_token:app.url.access_token,
                author:$scope.formData.selectedAuthor.id,
                title:$scope.formData.title,
                diseaseId:$scope.formData.selectedType?$scope.formData.selectedType.id:null,
                isShow:isShow,
                createrId:groupId,
                createType:2,
                tags:tagsId,
                copyPath:$scope.fontImgUrl,
                copy_small:$scope.copy_small,
                isShare:isShare,
                description:$scope.formData.summary?$scope.formData.summary:firstParagraph,
                content:html
            }).
            success(function(data, status, headers, config) {
                if(data.resultCode==1){
                    toaster.pop('success','','保存成功,3秒钟后返回文章列表');
                    setTimeout(function(){
                        $state.go('app.article_list',{},{reload:true});
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
        if(!$scope.formData.selectedAuthor){
            toaster.pop('warn','','请选择作者');
            return;
        }
        if(!$scope.fontImgUrl){
            toaster.pop('warn','','请上传题图');
            return;
        }

        var isShow=$scope.formData.isShow==false?0:1;
        //有摘要，则显示摘要。没有摘要，则去第一段文字的前100字，第一段文字不足100字，这只取第一段文字。
        var firstParagraph=um.getPlainTxt().split('/\n')[0].slice(0,100);
        var html = um.getContent();
        var articlePreview={
            authorName:$scope.formData.selectedAuthor.name,
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