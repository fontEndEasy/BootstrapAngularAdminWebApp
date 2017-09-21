'use strict';

app.controller('setting', function($rootScope, $scope, $state, $stateParams, $http, $compile, utils, modal, uiLoad, JQ_CONFIG, $injector, $urlRouter) {
    var position = $stateParams.position || "other";
    $scope.formData = {};
    $scope.loading = true;
    $scope.mytime = new Date();
    $scope.hstep = 1;
    $scope.mstep = 10;
    $scope.token = localStorage.getItem('yy_access_token');
    $scope.is_online = false;

    if (position == "bank") {
        setTimeout(function() {
            window.scrollTo(0, document.body.scrollHeight);
        }, 100);
    }
    var loginType = localStorage.getItem('user_type');
    $scope.loginType = loginType;

    if (loginType == 'c_StoreHQ' || loginType == 'c_DrugFactory' || loginType == 'c_DrugDistributor') { //总店和药厂地图不显示
        $scope.is_show_map = false; //总店地图不显示
    } else {
        $scope.is_show_map = true; //地图显示
    }

    $scope.is_c_DrugFactory = false; //是否是药厂设置
    if (loginType == 'c_DrugFactory' || loginType == 'c_DrugDistributor' || loginType == 'c_StoreHQ') { //是否是药厂或者总店
        $scope.is_c_DrugFactory = true;
    }

    $scope.is_cm = false;
    if (loginType == 'c_MonomerDrugStore' || loginType == 'c_ChainDrugStore') { //连锁店或者零售店
        $scope.is_cm = true;
        $scope.changeZcsy = function(flag) {
            if (flag == 0) {
                $scope.is_online = false;
            } else {
                $scope.is_online = true;
            }
        }
    }

    /*window.callback = function(value){
        $scope.data.logo = (value.substring(0,value.lastIndexOf("/")));
    }
*/

    function checkTime(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i.toString();
    }


    // 添加操作
    $scope.submit = function() {
        var name = $scope.data.name; //基本信息
        var remark = $scope.data.remark; //简介
        var logo = $scope.data.logo; //企业标识
        var zcyb = $('input[name="zcyb"]:checked').val(); //s会否支持医疗保险
        var zcsy = $('input[name="zcsy"]:checked').val(); //是否支持送药
        var logo_one = $('input[name="logo_one"]:checked').val(); //是否支持送药
        var sybz = $scope.data.sybz; //是否支持送药
        var province = $("#province").find("option:selected").val();
        var yysjd = $scope.data.yysjd; //营业事件
        var city = $("#city").find("option:selected").val();
        var area = $("#area").find("option:selected").val();
        var lxrsj = $scope.data.lxrsj; //联系人手机
        var longitude = $scope.data.longitude; //经度
        var latitude = $scope.data.latitude; //经度
        if (name == '' || name == null) {
            var txt = "基本信息不能为空！！！";
            window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.warning);
            return false;
        }

        var data = {
            name: name,
            remark: remark,
            logo: logo,
            zcyb: zcyb,
            zcsy: zcsy,
            sybz: sybz,
            logo_one: logo_one,
            yysjd: yysjd,
            province: province,
            city: city,
            area: area,
            jyfw: 2,
            lxdz: $scope.data.lxdz,
            lxrsj: lxrsj,
            longitude: longitude,
            latitude: latitude
        };
        $http({
            url: app.url.save_setting,
            method: 'post',
            data: data,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function(resp) {
            if (typeof resp.data['#message'] != "undefined") {
                window.wxc.xcConfirm(resp.data['#message'], window.wxc.xcConfirm.typeEnum.error);
            } else {
                var txt = "保存成功！！！";
                if (logo != "") {
                    $rootScope.$emit('lister_headPicFile', {
                        image_url: logo,
                        user_name: name
                    });
                }
                window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.success);
            }

        });
    };

    $scope.uploaderSuccess = function(up, file, info) {
        $scope.data.logo = file.url;
        $scope.logo_image = file.url;
        $("#setting_logo").attr("src", file.url);
    }

    $scope.update = function() {
        var name = $scope.data.name; //基本信息
        var remark = $scope.data.remark; //简介
        var logo = $scope.data.logo; //企业标识
        var zcyb = $('input[name="zcyb"]:checked').val(); //s会否支持医疗保险
        var zcsy = $('input[name="zcsy"]:checked').val(); //是否支持送药
        var sybz = $scope.data.sybz; //是否支持送药
        var yysjd = $scope.data.yysjd; //营业事件
        var logo_one = $('input[name="logo_one"]:checked').val(); //是否使用统一标示
        var province = $("#province").find("option:selected").val();
        var city = $("#city").find("option:selected").val();
        var area = $("#area").find("option:selected").val();
        var lxrsj = $scope.data.lxrsj; //联系人手机
        var longitude = $scope.data.longitude; //经度
        var latitude = $scope.data.latitude; //经度
        var id = $scope.data.id; //记录id
        var qyfzr = localStorage.getItem('store_leader');
        if (name == '' || name == null) {
            var txt = "基本信息不能为空！！！";
            window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.warning);
            return false;
        }
        var data = {
            "id": id,
            "name": name,
            "remark": remark,
            "qyfzr": qyfzr,
            "logo": logo,
            "logo_one": logo_one,
            "zcyb": zcyb,
            "zcsy": zcsy,
            "sybz": sybz,
            "yysjd": yysjd,
            "province": province,
            "city": city,
            "area": area,
            "jyfw": 2,
            "lxdz": $scope.data.lxdz,
            "lxrsj": lxrsj,
            "longitude": longitude,
            "latitude": latitude
                /*,
                                "#last_modified_time":$scope.last_modified_time*/
        };
        // data = {"name" : '深圳百灵药店 - API - EDIT - 444', "id" : id, "#last_modified_time" : $scope.last_modified_time};

        $http({
            url: app.url.eidt_setting,
            method: 'post',
            data: data,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function(resp) {
            if (typeof resp.data['#message'] != "undefined") {
                window.wxc.xcConfirm(resp.data['#message'], window.wxc.xcConfirm.typeEnum.error);
            } else {
                var txt = "修改成功";
                if (logo != "") {
                    $rootScope.$emit('lister_headPicFile', {
                        image_url: logo,
                        user_name: name
                    });
                }
                window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.success);
            }
        });
    };

    $scope.last_modified_time = "";
    $scope.button_show = false;
    //初始化设置信息
    $scope.listSetting = function() {
        var type_id = localStorage.getItem("store_id");
        $http.get(app.url.view_setting + "?id=" + type_id, {}).success(function(data, status, headers, config) {
            if (typeof data["#message"] == "undefined") {
                data = data[0];
                if (data.id != '') {
                    $scope.button_show = true;
                }
                window.uploadImageData = data.logo;
                $scope.last_modified_time = data['#last_modified_time'];
                $scope.data = data;
                var zcyb = data.zcyb;
                if (zcyb == true) {
                    $("input[name=zcyb]").eq(0).attr("checked", true);
                } else {
                    $("input[name=zcyb]").eq(1).attr("checked", true);
                }
                var zcsy = data.zcsy;
                if (zcsy == true) {
                    $("input[name=zcsy]").eq(0).attr("checked", true);
                    $scope.is_online = true;
                } else {
                    $("input[name=zcsy]").eq(1).attr("checked", true);
                    $scope.is_online = false;
                }
                var logo_one = data.logo_one;
                if (logo_one == "Y") {
                    $("input[name=logo_one]").eq(0).attr("checked", true);
                } else {
                    $("input[name=logo_one]").eq(1).attr("checked", true);
                }
                initMap();

                setTimeout(function() {
                    if (null != data.province) {
                        var pid = data.province.id;
                        if (null != data.city) {
                            var cid = data.city.id;
                        }
                        if (null != data.area) {
                            var aid = data.area.id;
                        }
                        $("#province").val(data.province.id);
                        $scope.change("", 0, function(data) {
                            setTimeout(function() {
                                $("#city").val(cid);
                                $scope.change("", 1, function(data) {
                                    setTimeout(function() {
                                        $("#area").val(aid);
                                    }, 200)
                                });
                            }, 200)
                        });
                    }
                    if ($scope.data.logo != "undefined" && $scope.data.logo != "") {
                        var img = new Image();
                        img.onload = function() {
                            $scope.logo_image = $scope.data.logo;
                        }
                        img.onerror = function() {
                            $scope.logo_image = "src/img/p0.jpg";
                        }
                        img.src = $scope.data.logo;
                    } else {
                        $scope.logo_image = "src/img/p0.jpg";
                    }
                    $("#areaDetail").val($scope.data.lxdz);
                }, 200)

            } else {
                window.wxc.xcConfirm(data['#message'], window.wxc.xcConfirm.typeEnum.error);
            }
        });
    };

    var map = null,
        myValue;

    function G(id) {
        return document.getElementById(id);
    }

    var geoc = new BMap.Geocoder();

    function showPoint(e) {
        G('lat').value = e.point.lat;
        G('lng').value = e.point.lng;
        var p = new BMap.Point(e.point.lng, e.point.lat);
        var mk = new BMap.Marker(p);
        map.clearOverlays();
        map.addOverlay(mk);
        mk.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画

        var pt = e.point;
        geoc.getLocation(pt, function(rs) {
            var addComp = rs.addressComponents;
            $scope.$apply(function() {

                $scope.data.lxdz = addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber;
            })
        });
    }

    function setPlace() {
        map.clearOverlays(); //清除地图上所有覆盖物
        function myFun() {
            var pp = local.getResults().getPoi(0).point;
            //获取第一个智能搜索的结果 
            G('lng').value = pp.lng;
            G('lat').value = pp.lat;
            $scope.data.longitude = pp.lng; //经度
            $scope.data.latitude = pp.lat; //经度
            map.centerAndZoom(pp, 18);
            map.addOverlay(new BMap.Marker(pp)); //添加标注
        }
        var local = new BMap.LocalSearch(map, { //智能搜索
            onSearchComplete: myFun
        });
        local.search(myValue);
    }

    function initMap() {
        if ($scope.is_show_map) { //显示地图才去加载
            // 百度地图API功能
            map = new BMap.Map("allmap");
            var locals = typeof $scope.data.lxdz == 'undefined' || $scope.data.lxdz == "" ? "深圳市" : $scope.data.lxdz; // 定义本地地址； 
            var lng = typeof $scope.data.longitude == 'undefined' || $scope.data.longitude == "" ? "114.065959" : $scope.data.longitude;
            var lat = typeof $scope.data.latitude == 'undefined' || $scope.data.latitude == "" ? "114.065959" : $scope.data.latitude;
            if (lng == '' && lat == '') {
                map.centerAndZoom(locals);
                var point = new BMap.Point(114.065959, 22.54859);
            } else {
                map.centerAndZoom(new BMap.Point(lng, lat), 18);
                var point = new BMap.Point(lng, lat);
            }

            map.centerAndZoom(point, 18);
            var marker = new BMap.Marker(point); // 创建标注


            map.clearOverlays();
            map.addOverlay(marker); // 将标注添加到地图中
            marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画



            map.enableScrollWheelZoom(true);
            map.addControl(new BMap.NavigationControl()); //添加默认缩放平移控件
            map.addControl(new BMap.NavigationControl({
                anchor: BMAP_ANCHOR_TOP_RIGHT,
                type: BMAP_NAVIGATION_CONTROL_SMALL
            })); //右上角，仅包含平移和缩放按钮
            map.addControl(new BMap.NavigationControl({
                anchor: BMAP_ANCHOR_BOTTOM_LEFT,
                type: BMAP_NAVIGATION_CONTROL_PAN
            })); //左下角，仅包含平移按钮
            map.addControl(new BMap.NavigationControl({
                anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
                type: BMAP_NAVIGATION_CONTROL_ZOOM
            })); //右下角，仅包含缩放按钮
            map.addEventListener("click", showPoint);

            var ac = new BMap.Autocomplete({
                "input": "areaDetail",
                "location": map
            }); //建立一个自动完成的对象
            ac.addEventListener("onhighlight", function(e) { //鼠标放在下拉列表上的事件
                var str = "";
                var _value = e.fromitem.value;
                var value = "";
                if (e.fromitem.index > -1) {
                    value = _value.province + _value.city + _value.district + _value.street + _value.business;
                }
                str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

                value = "";
                if (e.toitem.index > -1) {
                    _value = e.toitem.value;
                    value = _value.province + _value.city + _value.district + _value.street + _value.business;
                }
                str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
                G("searchResultPanel").innerHTML = str;
            });

            ac.addEventListener("onconfirm", function(e) { //鼠标点击下拉列表后的事件
                var _value = e.item.value;
                myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
                G("searchResultPanel").innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
                $scope.data.lxdz = myValue;
                //将自动匹配的下拉框值作为参数区查询
                setPlace();
            });


        }
    }



    //查询城市信息
    $scope.getExplorer = function() {
        $http.get(app.url.query_explorer, {}).success(function(data, status, headers, config) {
            $scope.list = data;
            $scope.listSetting();
        });
    };
    $scope.getExplorer();


    $scope.change = function(x, y, callback) {
        callback = callback || function() {};
        var id = '';
        if (y == 0) { //省级
            id = $("#province").find("option:selected").val();
        } else if (y == 1) {
            id = $("#city").find("option:selected").val();
        }
        $http.get(app.url.query_explorer + '?parent=' + id, {}).success(function(data, status, headers, config) {
            if (y == 0) {
                $scope.list_1 = data;
            } else {
                $scope.list_2 = data;
            }
            callback(data);
        });
    };

});
