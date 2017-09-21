
function getParameter(url){
    var url = url.search;
    var theRequest = {};
    if (url.indexOf('?') != -1) {
        var str = url.substr(1);
        str = str.split("&");
        for (var i = str.length - 1; i >= 0; i--) {
            theRequest[str[i].split("=")[0]] = decodeURI(str[i].split("=")[1]);
        }
    }
    return theRequest;
}

function ajax(conf) {
    var type = conf.type;
    var url = conf.url;
    var data = conf.data;
    var dataType = conf.dataType;
    var success = conf.success;
    var error = conf.error;

    if (type == null) {
        type = "get";
    }
    if (dataType == null) {
        dataType = "text";
    }
    var xhr = null;
    try {
        xhr = new ActiveXObject("microsoft.xmlhttp");
    } catch (e1) {
        try {
            xhr = new XMLHttpRequest();
        } catch (e2) {
            window.alert("您的浏览器不支持Ajax！");
        }
    }
    if(!xhr) return;

    xhr.open(type, url, true);

    if (type == "GET" || type == "get") {
        xhr.send(null);
    } else if (type == "POST" || type == "post") {
        xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
        xhr.send(data);
    }

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            if (dataType == "text" || dataType == "TEXT") {
                if (success != null) {
                    success(xhr.responseText);
                }
            } else if (dataType == "xml" || dataType == "XML") {
                if (success != null) {
                    success(xhr.responseXML);
                }
            } else if (dataType == "json" || dataType == "JSON") {
                if (success != null) {
                    success(eval("(" + xhr.responseText + ")"));
                }
            }
        }else if(xhr.readyState == 4 && (xhr.status == 404 || xhr.status == 500 || xhr.status == 304)){
            error();
        }
    };
};


function addProcess() {
    var eles = [],
        process = document.getElementById('mask_process');
    process.innerHTML = '';
    for (var i = 0; i < 6; i++) {
        var _span = document.createElement('span');
        _span.setAttribute('class', 'p_a');
        eles.push(_span);
        process.appendChild(_span);
    }

    var n = 0, asc = true;
    setInterval(function () {
        if (n === 0) {
            asc = true;
            eles[n + 1].setAttribute('class', 'p_a');
            eles[n++].setAttribute('class', 'p_b');
        } else if (n > 0 && n < 5) {
            if (asc) {
                eles[n - 1].setAttribute('class', 'p_a');
                eles[n++].setAttribute('class', 'p_b');
            } else {
                eles[n + 1].setAttribute('class', 'p_a');
                eles[n--].setAttribute('class', 'p_b');
            }
        } else if (n === 5) {
            asc = false;
            eles[n - 1].setAttribute('class', 'p_a');
            eles[n--].setAttribute('class', 'p_b');
        }
    }, 100);
}

function discernDevice() {
    if (navigator.userAgent.toLowerCase().indexOf('android') != -1) {
        return 'android';
    } else if (navigator.userAgent.toLowerCase().indexOf('iphone') != -1) {
        return 'iphone';
    } else {
        return null;
    }
}

function getUrl(){
    var device = discernDevice();

}
