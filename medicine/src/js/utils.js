// utils
'use strict';

app.factory('utils', ['$rootScope', '$http', '$compile', function ($rootScope, $http, $compile) {
    return {
        directive: function (p) {
            $('#doctor_details').children().attr('doctor-details', '');
            $compile($('#doctor_details').html())($rootScope);
            app.directive(p.name, ['uiLoad', 'JQ_CONFIG', '$document', '$scope', '$compile',
                function (uiLoad, JQ_CONFIG, $document, $scope, $compile) {
                    return {
                        restrict: 'AEC',
                        templateUrl: 'src/tpl/group/doctor_details.html',
                        //replace: true,
                        transclude: true,
                        link: function (scope, el, attr) {
                            debugger
                            scope.$apply();
                            scope.$watch(
                                function (scope) {
                                    // watch the 'compile' expression for changes
                                    return scope.$eval(attrs.compile);
                                },
                                function (value) {
                                    // when the 'compile' expression changes
                                    // assign it into the current DOM
                                    el.html(value);
                                    // compile the new DOM and link it to the current
                                    // scope.
                                    // NOTE: we only compile .childNodes so that
                                    // we don't get into infinite loop compiling ourselves
                                    $compile(el.contents())(scope);
                                }
                            );
                            console.log('23dsfsdfdsfdsfds')
                            uiLoad.load(JQ_CONFIG.databox).then(function () {

                                el.on('click', function () {
                                    var target;
                                    attr.target && (target = $(attr.target)[0]);
                                    //screenfull.toggle(target);
                                    console.log('dsfsdfdsfdsfds')
                                });

                                $document.on('mousedown', function () {

                                });
                            });
                        },
                        pre: function () {

                        },
                        post: function () {
                            console.log('---------------->')
                        }
                    };
                }
            ]);
        },
        getData: function (u, d, m, h) {
            var args = arguments;
            $http({
                url: u,
                data: typeof d !== 'function' ? d || {} : {},
                method: typeof m !== 'function' ? m || 'POST' : 'POST',
                headers: typeof h !== 'function' ? h || {} : {}
            }).then(function (dt) {
                if ((dt.data.dataList && dt.data.dataList.length !== 0) || dt.data.code == 1) {
                    for (var i = 0; i < args.length; i++) {
                        if (typeof args[i] === 'function') {
                            args[i].call(null, dt.data.dataList);
                        }
                        ;
                    }
                } else {
                    console.warn(dt.statusText);
                }
            }, function (x) {
                console.error(x.statusText);
            });
        },
        getDataByKey: function (data, key, val) {
            var len = data.length;
            for (var i = 0; i < len; i++) {
                if (data[i][key] === val) {
                    return data[i];
                }
            }
        },
        getDataByVal: function (data, key, val) {
            var value = [];
            if (!data) {
                return null;
            }

            getArrVal(data);

            function getArrVal(dt) {
                if (dt.constructor === Array && dt.length > 0) {
                    var len = dt.length;
                    for (var i = 0; i < len; i++) {
                        getArrVal(dt[i]);
                    }
                } else {
                    for (var k in dt) {
                        if (dt[k].constructor === Array && dt[k].length > 0) {
                            getArrVal(dt[k]);
                        }
                    }
                    if (dt[key] === val) {
                        value.push(dt);
                    }
                }
            }

            return value;
        },
        localData: function (key, val) {
            if (window.localStorage) {
                if (val) {
                    localStorage.setItem(key, val);
                    return true;
                } else if (val === null) {
                    localStorage.removeItem(key)
                } else {
                    var dt = localStorage.getItem(key);
                    if (dt) {
                        return dt;
                    } else {
                        return null;
                    }
                }
            } else {
                return false;
            }
        },
        queryByKey: function (data, key, only, exclude, types, depth) {
            var value = [], dep = 0;
            if (!data) {
                return null;
            }

            getArrVal(data);

            function getArrVal(dt) {
                if (dt.constructor === Array) {
                    if (dt.length > 0) {
                        var len = dt.length;
                        for (var i = 0; i < len; i++) {
                            if (dt[i].constructor === Object) {
                                getArrVal(dt[i]);
                            } else {
                                if(depth && depth.indexOf(dep) == -1) break;
                                if ((dt[i] + '').search(new RegExp(key), 'ig') !== -1) {
                                    if(only) {
                                        value = dt[i];
                                        return
                                    }else{
                                        value.push(dt[i]);
                                    }
                                }
                            }
                        }
                    } else {
                        return;
                    }
                } else if (dt.constructor === Object) {
                    if (types) {
                        var len = types.length;
                        for (var i = 0; i < len; i++) {
                            var type = types[i].split('.');
                            if (type.length === 1) {
                                var _dt = dt[type[0]];
                            } else if (type.length === 2) {
                                if(dt[type[0]]){
                                    var _dt = dt[type[0]][type[1]];
                                }
                            } else {
                                if(dt[type[0]] && dt[type[0]][type[1]]){
                                    var _dt = dt[type[0]][type[1]][type[2]];
                                }
                            }
                            if(!_dt && _dt != '0') continue;
                            if (_dt.constructor === Array) {
                                if (_dt.length > 0) {
                                    dep ++;
                                    getArrVal(_dt);
                                    dep --;
                                }
                            } else {
                                if(depth && depth.indexOf(dep) == -1) break;
                                if ((_dt + '').search(new RegExp(key), 'ig') !== -1) {
                                    if(only) {
                                        value = dt;
                                        return
                                    }else{
                                        value.push(dt);
                                    }
                                }
                            }
                        }
                    }

                    var isExcluded = false;
                    for (var k in dt) {
                        if(exclude && exclude.length > 0){
                            for(var i=0; i<exclude.length; i++){
                                if(k === exclude[i]) {
                                    isExcluded = true;
                                    break;
                                }
                            }
                        }

                        if(isExcluded) continue;

                        if (dt[k].constructor === Array) {
                            if (dt[k].length > 0) {
                                dep ++;
                                getArrVal(dt[k]);
                                dep --;
                            }
                        } else if (dt[k].constructor === Object) {
                            getArrVal(dt[k]);
                        } else {
                            if (!types) {
                                if(depth && depth.indexOf(dep) == -1) break;
                                if ((dt[k] + '').search(new RegExp(key), 'ig') !== -1) {
                                    if(only) {
                                        value = dt;
                                        return
                                    }else{
                                        value.push(dt);
                                    }
                                }
                            }
                        }
                    }
                } else {
                    if(depth && depth.indexOf(dep) == -1) return;
                    if ((dt + '').search(new RegExp(key), 'ig') !== -1) {
                        if(only) {
                            value = dt;
                            return
                        }else{
                            value.push(dt);
                        }
                    }
                }
            }

            return value;
        },
        serialize: function (dt) {
            var str = '';

            toSerializedString(dt);

            function toSerializedString(obj, name, idx) {
                if (obj.constructor === Object) {
                    for (var key in obj) {
                        if (obj[key].constructor !== Object && obj[key].constructor !== Array) {
                            str += '&' + ((name || name == '0' ? name : '') + (idx || idx == '0' ? '[' + idx + '].' : '') + key + '=' + obj[key]);
                        } else if (obj[key].constructor === Object) {
                            toSerializedString(obj[key]);
                        } else {
                            toSerializedString(obj[key], key);
                        }
                    }
                } else if (obj.constructor === Array) {
                    var len = obj.length;
                    for (var i = 0; i < len; i++) {
                        if (obj[i].constructor !== Object && obj[i].constructor !== Array) {
                            str += '&' + ((name ? name : '') + '[' + i + ']=' + obj[i]);
                        } else if (obj[i].constructor === Object) {
                            toSerializedString(obj[i], name ? name : '', i);
                        } else {
                            toSerializedString(obj[i]);
                        }
                    }
                } else {
                    return dt;
                }
            }

            return str.slice(1);
        },
        extendHash: function (dt, keys, val) {
            if (!dt) {
                //console.warn("数据无效！ In function 'extendHash'.");
                dt = {};
            }
            if (dt.constructor === Array && dt.length > 0) {
                var len = dt.length;
                for (var i = 0; i < len; i++) {
                    var l = keys.length;
                    for (var n = 0; n < l; n++) {
                        if (!dt[i][keys[n]]) {
                            dt[i][keys[n]] = '';
                        }
                    }
                }
            } else {
                var len = keys.length;
                for (var i = 0; i < len; i++) {
                    if (!dt[keys[i]] && dt[keys[i]] != '0' && dt[keys[i]] != 'null') {
                        dt[keys[i]] = val && val[i] ? val[i] : [];
                    }
                }
            }
        },
        dateFormat: function (date, format) {
            var datas = ['2015-04-23', '2015-04-23 16:03:45', '2015/04/23 16:03:45', '2015年4月23日', '2015年4月23日16点3分45秒', '2015年4月23日,16点3分45秒', '2015年4月23日下午4点3分45秒'];
            var formats = ['yyyy-MM-dd', 'yyyy-MM-dd hh:mm:ss', 'yyyy/MM/dd hh:mm:ss', 'yyyy|MM|dd', 'yyyy|MM|dd hh|mm|ss', 'yyyy年MM月dd日,hh点mm分ss秒', 'yyyy|MM|dd&hh|mm|ss'];

            format = format || 'yyyy-MM-dd hh:mm:ss';
            date = date.constructor === Date ? date : new Date(date);

            var segments = {
                'y+': date.getFullYear(),
                'M+': date.getMonth() + 1,
                'd+': date.getDate(),
                'h+': date.getHours(),
                'm+': date.getMinutes(),
                's+': date.getSeconds(),
                'S+': date.getMilliseconds()
            };

            for (var k in segments) {
                var exp = new RegExp(k);
                var len = (segments[k] + '').length;
                if (!exp.exec(format)) continue;
                var segLen = exp.exec(format)[0].length;
                if (len < segLen) {
                    segments[k] = '0' + segments[k];
                    len = (segments[k]).length;
                }
                format = format.replace(exp, (segments[k] + '').substring(len - segLen));
            }

            return format;
        },
        keyHandler: function(dom, handleObj){
            dom = dom || window.document;
            $(dom).bind('keydown', function(e){
                var evt = e || window.event;
                var keyCode = evt.keyCode;
                switch (keyCode){
                    case 13:

                        handleObj['key'+ keyCode]();

                        break;

                    case 37:    // 左

                        handleObj['key'+ keyCode]();

                        break;

                    case 38:    // 上
                        break;

                    case 39:    // 右
                        break;

                    case 40:    // 下
                        break;

                    default: break;
                }
            });
        }
    };
}]);

Date.prototype.format = function (format) {
    if (!format) {
        format = 'yyyy-MM-dd'
    }
    var o = {
        "M+": this.getMonth() + 1, // month
        "d+": this.getDate(), // day
        "h+": this.getHours(), // hour
        "m+": this.getMinutes(), // minute
        "s+": this.getSeconds(), // second
        "q+": Math.floor((this.getMonth() + 3) / 3), // quarter
        "S": this.getMilliseconds()
        // millisecond
    }

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "")
            .substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
                : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};
Date.prototype.formatTime = function (format) {
    if (!format) {
        format = 'yyyy-MM-dd hh:mm:ss';
    }
    return this.format(format);
};

/**
 * for jquery datatable render (渲染器)
 */
var DataRender = {};
/**
 * 时间渲染器
 */
DataRender.DateTime = function (o) {
    //var str="";
    if (o) {
        o = new Date(o).formatTime();
    }
    return o;

};
/**
 * 日期渲染器
 */
DataRender.Date = function (o) {
    if (o) {
        o = new Date(o).format();
    }
    return o;
};
/**
 * 性别渲染器
 */
DataRender.Gender = function (o) {
    if (o) {
        if (1 == o) {
            o = '男';
        }
        if (2 == o) {
            o = '女';
        }
    }
    return o;
};
/**
 * 状态渲染器
 */
DataRender.State = function (o) {
    if (o) {
        if (1 == o) {
            o = '已审核';
        }
        if (0 == o) {
            o = '未审核';
        }
    }
    return o;
};