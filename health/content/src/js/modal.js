// modals
'use strict';

app.factory('modal', ['$http', function($http) {
    var wrapper = $('<div class="toast-wrap"></div>');
    var body = $('body');
    var timer = 0;

    body.append(wrapper);

    function setPos(obj, t) {
        //clearTimeout(timer);
        wrapper.append(obj);
        //var w = obj.width();
        //obj.css({'display': 'none'});
        //obj.css({'left': '50%', 'margin-left': -w / 2});
        //obj.css({'right': '50px'});
        setTimeout(function() {
            obj.animate({
                'opacity': 0
            }, 1000, function() {
                obj.animate({
                    'height': 0
                }, 500, function() {
                    obj.remove();
                });
            });
        }, t || 5000);
    }

    return {
        toast: {
            success: function(str, t) {
                var toast = $('<div></div>');
                var span = $('<span class="toast-success">' + str + '</span>');
                toast.append(span);
                setPos(toast, t);
            },
            warn: function(str, t) {
                var toast = $('<div></div>');
                var span = $('<span class="toast-warn">' + str + '</span>');
                toast.append(span);
                setPos(toast, t);
            },
            error: function(str, t) {
                var toast = $('<div></div>');
                var span = $('<span class="toast-error">' + str + '</span>');
                toast.append(span);
                setPos(toast, t);
            },
            remove: function() {
                toast.remove();
            }
        },

        prompt: function(ttl, cnt) {
            var mask = $('<div class="mask"></div>');
            var wrapper = $('<div class="dialog-container animating fade-in-down"></div>');
            var title = $('<div class="dialog-heading font-bold text-center">' + ttl + '</div>');
            var dialog = $('<div class="dialog-body" style="width:auto;min-width:400px"></div>');
            var content = $('<div class="form-text text-md text-center mrt-15 mrb-15">' + cnt + '</div>');
            var operate = $('<div class="dialog-opr-bar clear"></div>');
            var opr_ok = $('<div class="col-md-offset-4 col-md-4"></div>');
            var ok = $('<button type="button" class="w100 btn btn-danger">确 定</button>');

            dialog.append(content);
            opr_ok.append(ok);
            operate.append(opr_ok);
            wrapper.append(title);
            wrapper.append(dialog);
            wrapper.append(operate);

            ok.one('click', function() {
                wrapper.remove();
                mask.remove();
            });

            body.append(mask);
            body.append(wrapper);

            var w = wrapper.width();
            wrapper.css({
                'left': '50%',
                'margin-left': -w / 2
            });
        },

        confirm: function(ttl, cnt, fun) {
            var mask = $('<div class="mask"></div>');
            var wrapper = $('<div class="dialog-container animating fade-in-down"></div>');
            var title = $('<div class="dialog-heading font-bold text-center">' + ttl + '</div>');
            var dialog = $('<div class="dialog-body" style="width:auto;min-width:400px"></div>');
            var content = $('<div class="form-text text-md text-center mrt-15 mrb-15">' + cnt + '</div>');
            var operate = $('<div class="dialog-opr-bar clear"></div>');
            var opr_ok = $('<div class="col-md-offset-2 col-md-4"></div>');
            var opr_cancel = $('<div class="col-md-4"></div>');
            var ok = $('<button type="button" class="w100 btn btn-danger">确 定</button>');
            var cancel = $('<button type="button" class="w100 btn btn-default">取 消</button>');

            dialog.append(content);
            opr_ok.append(ok);
            opr_cancel.append(cancel);
            operate.append(opr_ok);
            operate.append(opr_cancel);
            wrapper.append(title);
            wrapper.append(dialog);
            wrapper.append(operate);

            ok.one('click', function() {
                fun.call(null);
                wrapper.remove();
                mask.remove();
            });

            cancel.one('click', function() {
                wrapper.remove();
                mask.remove();
            });

            body.append(mask);
            body.append(wrapper);

            var w = wrapper.width();
            wrapper.css({
                'left': '50%',
                'margin-left': -w / 2
            });
        }
    };
}]);
