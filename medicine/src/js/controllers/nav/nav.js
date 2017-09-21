app.controller('navCtrl', ['$rootScope', '$scope', '$http', 'utils',
    function($rootScope, $scope, $http, utils) {

        $scope.userData = app.getUserData();


        if (!utils.localData('isCompany')) {
            utils.localData('isCompany', $scope.isCompany);
        } else {
            if (utils.localData('isCompany') === 'true') {
                $scope.isCompany = true;
            } else {
                $scope.isCompany = false;
            }
        }

        if (!utils.localData('c_MonomerDrugStore')) {
            utils.localData('c_MonomerDrugStore', $scope.c_MonomerDrugStore);
        } else {
            if (utils.localData('c_MonomerDrugStore') === 'true') {
                $scope.datas.c_MonomerDrugStore = 'true';
            } else {
                $scope.datas.c_MonomerDrugStore = 'false';
            }
        }

        if (!utils.localData('c_ChainDrugStore')) {
            utils.localData('c_ChainDrugStore', $scope.c_ChainDrugStore);
        } else {
            if (utils.localData('c_ChainDrugStore') === 'true') {
                $scope.datas.c_ChainDrugStore = 'true';
            } else {
                $scope.datas.c_ChainDrugStore = 'false';
            }
        }

        if (!utils.localData('c_StoreHQ')) {
            utils.localData('c_StoreHQ', $scope.c_StoreHQ);
        } else {
            if (utils.localData('c_StoreHQ') === 'true') {
                $scope.datas.c_StoreHQ = 'true';
            } else {
                $scope.datas.c_StoreHQ = 'false';
            }
        }

        if (!utils.localData('c_DrugFactory')) {
            utils.localData('c_DrugFactory', $scope.c_DrugFactory);
        } else {
            if (utils.localData('c_DrugFactory') === 'true') {
                $scope.datas.c_DrugFactory = 'true';
            } else {
                $scope.datas.c_DrugFactory = 'false';
            }
        }

        if ($scope.logFromCompany || utils.localData('logFromCompany') === 'true') {
            $scope.logFromCompany = true;
        } else {
            $scope.logFromCompany = false;
        }
        if (!$scope.datas.user_headPicFile) {
            if (!$scope.logFromCompany && (utils.localData('headPicFile') + '') !== (null + '')) {
                $scope.datas.user_headPicFile = (utils.localData('headPicFile') || 'src/img/a0.jpg') + '?' + (new Date()).getTime();
            } else {
                $scope.datas.user_headPicFile = '';
            }
        }
        var groupId = utils.localData('curGroupId');
        // 获取集团logo
        if (!$scope.datas.groupPicFile && (utils.localData('groupPicFile') + '') !== (null + '')) {
            $scope.datas.groupPicFile = utils.localData('groupPicFile') + '?' + (new Date()).getTime();
        }

        // 设置栏目标签
        setTimeout(function() {
            var nav_li = $('.app-aside .nav > li > .nav-item');
            for (var i = 0; i < nav_li.length; i++) {
                nav_li.eq(i).attr('id', 'id_' + i);
            }
            $('#' + utils.localData('curLiId')).addClass('nav-cur-item').parent().parent().parent().addClass('active');
            nav_li.click(function() {
                nav_li.removeClass('nav-cur-item');
                $(this).addClass('nav-cur-item');
                utils.localData('curLiId', $(this).attr('id'));
            });
        }, 200);




        //////////////////////////////////////////////////////////////

        var msgIcon = $('#msg_icon'),
            msgWindow = $('#msg_window'),
            movePoint = msgWindow.find('.move-point'),
            offTop = 0,
            offLeft = 0,
            evt,
            doc = $(document),
            body = $('body');


        msgIcon.click(function() {
            //console.log(3423432)
            //$('#doctor_details').addClass('doctor-details');

            utils.directive({
                name: 'doctorDetails'
            });
        });

        movePoint.mousedown(function(e) {
            var _evt = e || window.event;

            offTop = _evt.clientY - msgWindow.offset().top;
            offLeft = _evt.clientX - msgWindow.offset().left;

            console.log(offTop + ', ' + offLeft);
            body.css({
                'user-select': 'none'
            });
            //body.css({'display': 'none'});

            doc.bind('mousemove', function(e) {
                evt = e || window.event;
                msgWindow.css({
                    'top': evt.clientY - offTop,
                    'left': evt.clientX - offLeft,
                    'cursor': 'default'
                });
            });

        });

        $('#contacts_search_input').mousedown(function(e) {
            var _evt = e || window.event;
            _evt.stopPropagation();
            doc.unbind('mousemove');
        });

        doc.mouseup(function() {
            doc.unbind('mousemove');
            body.css({
                'user-select': 'inherit'
            });
        });

        $scope.img_path = "src/img/default_enterprise.png";
        $scope.user_name = utils.localData('user_name');
        //图片访问地址
        $scope.headPicFile = localStorage.getItem('headPicFile'); //图片地址
        var img = new Image();
        img.onload = function() {
            $scope.img_path = $scope.headPicFile + '?' + (new Date()).getTime();
        }

        img.onerror = function() {
            utils.localData('headPicFile', "src/img/default_enterprise.png");
            $scope.img_path = 'src/img/default_enterprise.png';
        }
        img.src = typeof $scope.headPicFile == "undefined" ? 'src/img/default_enterprise.png' : $scope.headPicFile;

        $rootScope.$on('lister_headPicFile', function(evet, data) {
            if (data.image_url) {
                var _headPicFile = data.image_url;
                utils.localData('headPicFile', _headPicFile);
                $scope.img_path = _headPicFile + '?' + (new Date()).getTime();
            }

            if (data.user_name) {
                utils.localData('user_name', data.user_name);
                $scope.user_name = data.user_name;
            }
        });


    }

])
