;
(function() {
    window.bridge = null;
    //判断访问终端
    var browser = {
        versions: function() {
            var u = navigator.userAgent,
                app = navigator.appVersion;
            return {
                trident: u.indexOf('Trident') > -1, //IE内核
                presto: u.indexOf('Presto') > -1, //opera内核
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端
                iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1, //是否iPad
                webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
                weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
                qq: u.match(/\sQQ/i) == " qq" //是否QQ
            };
        }(),
        language: (navigator.browserLanguage || navigator.language).toLowerCase()
    };
    //注册事件监听
    function connectWebViewJavascriptBridge(callback) {
        if (window.WebViewJavascriptBridge) {
            return callback(WebViewJavascriptBridge);
        }
        if (window.WVJBCallbacks) {
            return window.WVJBCallbacks.push(callback);
        }
        window.WVJBCallbacks = [callback];
        var WVJBIframe = document.createElement('iframe');
        WVJBIframe.style.display = 'none';
        WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
        document.documentElement.appendChild(WVJBIframe);
        setTimeout(function() {
            document.documentElement.removeChild(WVJBIframe)
        }, 0)
    }

    //关闭H5页面
    function closeVC() {
        if (browser.versions.ios) {
            window.bridge.callHandler('closeVC', {
                'foo': 'bar'
            }, function(response) {});
        } else if (browser.versions.android) {
            if (window.androidJS && typeof window.androidJS.closeVC !== "undefined") {
                window.androidJS.closeVC();
            } else {
                alert("closeVC未定义");
            }
        }
    }

    //设置token
    function setToken(callback) {
        callback = callback || function() {};

        if (browser.versions.ios) {
            window.bridge.callHandler('setToken', "1", function(response) {
                var data = JSON.parse(response);
                callback(data);
            });
        } else if (browser.versions.android) {
            if (window.androidJS && typeof window.androidJS.setToken !== "undefined") {
                var response = window.androidJS.setToken();
                var data = JSON.parse(response);
                callback(data);
            } else {
                alert("setToken未定义");
            }

        }
    }

    //弹出选择医生框
    function selectDoctor() {
        if (browser.versions.ios) {
            window.bridge.callHandler('selectDoctor', "1", function(response) {});
        } else if (browser.versions.android) {
            if (window.androidJS && typeof window.androidJS.selectDoctor !== "undefined") {
                window.androidJS.selectDoctor();
            } else {
                alert("selectDoctor未定义");
            }
        }
    }

    //注册回调
    function registerCallback(handlerName, callback) {
        callback = callback || function() {};
        if (browser.versions.ios) {
            bridge.registerHandler(handlerName, function(data, responseCallback) {
                data = JSON.parse(data);
                callback(data);
                responseCallback(data);
            });
        } else if (browser.versions.android) {
            window[handlerName] = function(data) {
                callback(data);
            }
        }
    }

    //注册回调函数，初始化函数
    if (browser.versions.ios) {
        connectWebViewJavascriptBridge(function(bridge) {
            bridge.registerHandler('testJavascriptHandler', function(data, responseCallback) {
                var responseData = {
                    'Javascript Says': 'Right back atcha!'
                }
                responseCallback(responseData);
            });
            window.bridge = bridge;
            window.bridge.closeVC = closeVC;
            window.bridge.selectDoctor = selectDoctor;
            window.bridge.setToken = setToken;
            window.bridge.registerCallback = registerCallback;
        });
    } else if (browser.versions.android) {
        if (typeof window.androidJS != "undefined") {
            window.bridge = {};
            window.bridge.closeVC = closeVC; //关闭H5
            window.bridge.selectDoctor = selectDoctor; //选择医生 
            window.bridge.setToken = setToken; //设置token,返回格式 {"token":"","userid":""}
            window.bridge.registerCallback = registerCallback; //方法名：selectDoctorCallback 返回{"id":"","name":""}
        }
    } else {
        window.bridge = null;
    }

})();
