(function() {
    angular.module('app')
        .controller('EditorConsultingRecordModalInstanceCtrl', EditorConsultingRecordModalInstanceCtrl);

    EditorConsultingRecordModalInstanceCtrl.$inject = ['$scope', '$uibModalInstance', '$state', 'toaster', 'Lightbox', 'EditorConsultingRecordFactory', 'data','ngAudio','$rootScope','DoctorInfoDailogFtory','$http'];

    function EditorConsultingRecordModalInstanceCtrl($scope, $uibModalInstance, $state, toaster, Lightbox, EditorConsultingRecordFactory, data,ngAudio,$rootScope,DoctorInfoDailogFtory,$http) {
        var user=JSON.parse(localStorage.getItem('user'));
        $scope.uploadImgData = {};
        $scope.patientDrugSuggestList = [];
        $scope.uploadImgData.file = [];
        $scope.consultVoice=[];
        $scope.callView={};

        $scope.token = localStorage['guider_access_token'];
        $scope.maxSelect = function(arry) {
            var result = 0,
                max = 8;
            if (arry && arry.length > 0) {
                if (arry.length >= 8) {
                    result = 0;
                } else {
                    result = max - arry.length;
                };
            } else {
                result = max;
            };
            return result;
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
        //// 选择文件后回调
        //$scope.uploaderAdded = function(up, files) {
        //    if (!$scope.uploadImgData)
        //        $scope.uploadImgData = {};
        //
        //    if (!$scope.uploadImgData.file)
        //        $scope.uploadImgData.file = [];
        //
        //    for (var i = 0; i < files.length; i++) {
        //        $scope.uploadImgData.file.push({
        //            id: files[i].id,
        //            oUrl: files[i].url || '',
        //            isUploading: true
        //        });
        //    }
        //};
        //// 每个文件上传成功回调
        //$scope.uploaderSuccess = function(up, file, info) {
        //    for (var i = 0; i < $scope.uploadImgData.file.length; i++) {
        //        if (file.id == $scope.uploadImgData.file[i].id) {
        //            $scope.uploadImgData.file[i].oUrl = file.url;
        //            $scope.uploadImgData.file[i].isUploading = false;
        //        }
        //    };
        //    console.log($scope.uploadImgData.file);
        //};
        //
        //// 每个文件上传失败后回调
        //$scope.uploaderError = function(up, err, errTip) {
        //    console.warn(up, err, errTip);
        //    toaster.pop('error', null, errTip);
        //};




        findByOrder();

        $scope.diseaseSelectUrl = app.api.shared.getDisease;
        $scope.diseaseSelectData = [];

        $scope.medicationSelectUrl = app.api.doctor.getCheckSuggest;
        $scope.medicationSelectData = [];

        $scope.cancel = function(argument) {
            //如果有音频，关掉音频，销毁对象
            if($scope.voices){
                $scope.voices.forEach(function(item,index,array){
                    if(item._audio){
                        item._audio.stop();
                        item._audio=null;
                    }
                });
            }

            if($scope.consultVoice){
                $scope.consultVoice.forEach(function(item,index,array){
                    if(item._audio){
                        item._audio.stop();
                        item._audio=null;
                    }
                });
            }
            $uibModalInstance.dismiss('cancel');
        };

        getConsultVoice();
        //获取通话录音
        function getConsultVoice() {
            var param = {
                access_token: localStorage['guider_access_token'],
                orderId: data.orderId
            };

            EditorConsultingRecordFactory
                .getConsultVoice(param)
                .then(thenFc);

            function thenFc(response) {
                if (response.resultCode == 1) {
                    if(response.data){
                        response.data.forEach(function(item,index,array){
                            $scope.consultVoice.push({
                                url:item.videoUrl,
                                stoptime:item.videoStopTime
                            });
                        });
                    }
                }
            }
        }

            // 查询记录
            function findByOrder() {

                $scope.findByOrderLoading = true;

                var param = {
                    access_token: localStorage['guider_access_token'],
                    orderId: data.orderId
                };

                $scope.isLoading=true;

                EditorConsultingRecordFactory
                    .findByOrder(param)
                    .then(thenFc)

                function thenFc(response) {
                    $scope.findByOrderLoading = false;
                    if (response.resultCode == 1) {

                        // 有记录
                        if (response.data.length > 0) {
                            $scope.isLoading=false;
                            var reData = response.data[0];
                            data.id = reData.id;
                            $scope.consultAdvise = reData.consultAdvise;
                            $scope.diseaseSelectData = reData.consultAdviseDiseaseList;
                            $scope.medicationSelectData = reData.checkSuggestList;
                            if (reData.patientDrugSuggestList && reData.patientDrugSuggestList.c_patient_drug_suggest_list && reData.patientDrugSuggestList.c_patient_drug_suggest_list.length > 0) {
                                $scope.patientDrugSuggestList = reData.patientDrugSuggestList.c_patient_drug_suggest_list;
                            } else {
                                $scope.patientDrugSuggestList = [];
                            }
                            $scope.reid = reData.id;
                            if (reData.images) {
                                $scope.uploadImgData = {};
                                $scope.uploadImgData.file = [];
                                $scope.images=reData.images;
                                for (var i = 0; i < reData.images.length; i++) {
                                    $scope.uploadImgData.file[i] = {};
                                    $scope.uploadImgData.file[i].oUrl = reData.images[i];
                                }
                            }

                            $scope.doctorInfo={
                                doctorId:reData.doctorId,
                                name:reData.user.name||'未命名',
                                telephone:reData.user.telephone||null,
                                hospital:reData.user.doctor.hospital,
                                departments:reData.user.doctor.departments
                            };

                            $scope.patientInfo={
                                name:reData.patient.userName||'未命名',
                                age:reData.patient.age,
                                sex:reData.patient.sex==1?'女':'男'
                            };

                            $scope.voices=[];
                            $scope.receiveVoices=reData.voices;
                            reData.voices.forEach(function(item,index,array){
                                $scope.voices.push({
                                    url:item,
                                    timeLong:item.split('?')[1].split('=')[1]
                                });
                            });

                            //// 提交－－保存记录
                            //$scope.submit = updateCurrecord;
                        }

                    } else if (response.resultMsg) {
                        toaster.pop('error', null, response.resultMsg);
                    } else {
                        toaster.pop('error', null, '接口调用失败');
                    }
                }
            }


        //播放咨询结果(需要到七牛云获取)
        $scope.playDoctorAudio=function(item){
            if(item._audio&&item._audio.paused==false){
                item._audio.pause();
            }
            else{
                var isPaused=$scope.voices.every(function(voice,index,array){
                    if(!voice._audio){
                        return true;
                    }
                    else{
                        if(voice._audio.paused){
                            return true;
                        }
                        else{
                            return false;
                        }
                    }
                });

                if(isPaused){
                    if(item._audio&&item._audio.paused){
                        item._audio.play();
                    }
                    else{
                        var bucket=item.url.split('//')[1].split('.')[0];
                        var key=item.url.split('/')[3].split('?')[0];

                        $http({
                            //url: '/qiniu/im/file/avthumb.action',
                            url:imRoot+'file/avthumb.action',
                            method: 'post',
                            headers: {
                                'access-token': localStorage['guider_access_token'],
                                //'Content-Type': 'application/x-www-form-urlencoded'
                            },
                            data: {
                                bucket: bucket,
                                key: key,
                                format: 'mp3'
                            }
                        }).then(function(response) {
                            if (response.data.resultCode === 1) {
                                item.url=qiniuPatientRoot+response.data.data.key;
                                item._audio=ngAudio.load(item.url);
                                item._audio.play();
                            };

                        });
                        //
                        //item._audio=ngAudio.load(item.url);
                        //item._audio.play();
                    }
                }
            }
        };

        //播放通话录音（直接播放，wav格式）
        $scope.playConsultAudio=function(item){
            if(item._audio&&item._audio.paused==false){
                item._audio.pause();
            }
            else{
                var isPaused=$scope.consultVoice.every(function(voice,index,array){
                    if(!voice._audio){
                        return true;
                    }
                    else{
                        if(voice._audio.paused){
                            return true;
                        }
                        else{
                            return false;
                        }
                    }
                });

                if(isPaused){
                    if(item._audio&&item._audio.paused){
                        item._audio.play();
                    }
                    else{
                        //var bucket=item.url.split('//')[1].split('.')[0];
                        //var key=item.url.split('/')[3].split('_')[0];
                        //
                        //$http({
                        //    //url: '/qiniu/im/file/avthumb.action',
                        //    url:imRoot+'file/avthumb.action',
                        //    method: 'post',
                        //    headers: {
                        //        'access-token': localStorage['guider_access_token'],
                        //        //'Content-Type': 'application/x-www-form-urlencoded'
                        //    },
                        //    data: {
                        //        bucket: bucket,
                        //        key: key,
                        //        format: 'mp3'
                        //    }
                        //}).then(function(response) {
                        //    if (response.data.resultCode === 1) {
                        //        item.url=qiniuTelRecordRoot+response.data.data.key;
                        //        item._audio=ngAudio.load(item.url);
                        //        item._audio.play();
                        //    };
                        //
                        //});
                        item._audio=ngAudio.load(item.url);
                        item._audio.play();
                    }
                }
            }
        };

            //$scope.openDrugBox = function() {
            //    $scope.$root.openUiMedicine([], function(list) {
            //        $scope.patientDrugSuggestList=$scope.patientDrugSuggestList.concat(list);
            //        console.log($scope.patientDrugSuggestList);
            //    });
            //};

            // 保存记录
            $scope.updateCurrecord=function(submitState) {
                if (!$scope.consultAdvise)
                    return toaster.pop('info', null, '请填写咨询结果');

                if(!data.id){
                    return toaster.pop('info', null, 'id为空');
                }

                $scope.submitLoading = true;
                var param = {
                    access_token: localStorage['guider_access_token'],
                    orderId: data.orderId,
                    id: data.id,
                    doctorId:data.doctorId,
                    submitState:submitState,
                    consultAdvise: $scope.consultAdvise,
                    attention: setIdList($scope.medicationSelectData),
                    consultAdviseDiseases: setIdList($scope.diseaseSelectData),
                    images:$scope.images,
                    voices:$scope.receiveVoices
                    //drugAdviseJson: setIdAndNbrList($scope.patientDrugSuggestList)||null
                };


                EditorConsultingRecordFactory
                    .updateCurrecord(param)
                    .then(thenFc)

                function thenFc(response) {
                    $scope.submitLoading = false;
                    if (response.resultCode == 1) {
                        toaster.pop('success', null, response.resultMsg);
                        $uibModalInstance.close('ok');
                    } else if (response.resultMsg) {
                        toaster.pop('error', null, response.resultMsg);
                    } else {
                        toaster.pop('error', null, '接口调用失败');
                    }
                }
            }

            function setIdAndNbrList(data) {
                if (!data) return null;
                var result = [];
                for (var i = 0; i < data.length; i++) {
                    result.push({
                        drug: data[i].drug.id,
                        requires_quantity: data[i].requires_quantity
                        // period: data[i].c_drug_usage_list[0].period.number + ' ' + data[i].c_drug_usage_list[0].period.unit,
                        // times: data[i].c_drug_usage_list[0].times,
                        // quantity: data[i].c_drug_usage_list[0].quantity,
                        // patients: data[i].c_drug_usage_list[0].patients,
                        // method: data[i].c_drug_usage_list[0].method
                    });
                }
                result = JSON.stringify(result);
                return result;
            }


            // 提取id转成 1,2,3,4,5
            function setIdList(data) {
                if (!data) return null;
                var result = '';
                for (var i = 0; i < data.length; i++) {
                    if (i == 0) {
                        result = '' + data[i].id;
                    } else {
                        result = result + ',' + data[i].id;
                    }

                }
                return result;
            }

            // 提取imageUrl
            function setImgUrl(data) {
                if (!data) return null;
                var result = [];
                for (var i = 0; i < data.length; i++) {
                    result[i] = data[i].oUrl;
                }
                return result;
            }

            // 放大图片
            $scope.openLightboxModal = function(item, index) {
                var arry = [];
                for (var i = 0; i < item.length; i++) {
                    arry[i] = item[i].oUrl;
                }
                Lightbox.openModal(arry, index);
            };

            $scope.openDocInfoModal=function(){
                console.log(3333);
                console.log(typeof DoctorInfoDailogFtory.openModal);
                DoctorInfoDailogFtory.openModal($scope.doctorInfo.doctorId,null,1);
            };

            // 拨打电话
            $scope.callPhone = function() {
                $scope.call = {};
                $scope.call.isCalling = true;
                var toTel=$scope.doctorInfo.telephone;
                var fromTel = user.telephone;

                var param = {
                    access_token: localStorage['guider_access_token'],
                    toTel: toTel,
                    fromTel: fromTel
                };

                EditorConsultingRecordFactory
                    .callByTel(param)
                    .then(thenFc)

                function thenFc(response) {
                    $scope.call.isCalling = false;

                    if (!response) {
                        $scope.call.result = {
                            type: false,
                            content: '接口调用失败'
                        }
                        return;
                    }

                    if (!response.data) {
                        $scope.call.result = {
                            type: false,
                            content: '接口调用失败'
                        }
                        return;
                    }

                    if (!response.data.resp) {
                        $scope.call.result = {
                            type: false,
                            content: '接口调用失败'
                        }
                        return;
                    }

                    if (response.data.resp.respCode == '000000') {
                        $scope.call.result = {
                            type: true,
                            content: '拨打成功'
                        }
                        $scope.callView.isOpen=false;
                        $scope.call = {};
                        toaster.pop('success',null,'拨打成功');
                    }

                    if (response.data.resp.respCode !== '000000') {
                        $scope.call.result = {
                            type: false,
                            content: '拨打失败'
                        }
                    }
                }

            }

        //关闭电话对话框
        $scope.closeCallView=function(){
            $scope.call={};
            $scope.callView.isOpen=false;
        }

        }

    })();
