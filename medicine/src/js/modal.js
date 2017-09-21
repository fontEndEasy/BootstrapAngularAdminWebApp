// modals
'use strict';

app.factory('modal', ['$http', function($http) {
    var toast = $('<div class="toast-wrap"></div>');
    var body = $('body');
    var timer = 0;

    function setPos(obj) {
        clearTimeout(timer);
        var w = obj.width();
        obj.css({ 'display': 'none' });
        obj.css({ 'left': '50%', 'margin-left': -w / 2 });
        timer = setTimeout(function() {
            obj.fadeOut(1000);
        }, 5000);

        setTimeout(function() {
            obj.css({ 'display': 'block' });
        }, 100);
    }

    return {
        toast: {
            success: function(str) {
                toast.removeClass('toast-error toast-warn').addClass('toast-success').html(str);
                body.append(toast);
                setPos(toast);
            },
            warn: function(str) {
                toast.removeClass('toast-error toast-success').addClass('toast-warn').html(str);
                body.append(toast);
                setPos(toast);
            },
            error: function(str) {
                toast.removeClass('toast-success toast-warn').addClass('toast-error').html(str);
                body.append(toast);
                setPos(toast);
            },
            remove: function() {
                toast.remove();
            }
        }
    };
}]);