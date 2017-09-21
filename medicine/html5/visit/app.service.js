/**
 * app.service.js
 * @authors wangzl 
 * @date    2016/02/19
 * @version 1.0.0
 */
define(['angular'], function() {
    angular.module('app.service', [])
        .service('$verifyService', $verifyService)
    $verifyService.$inject = [];

    function $verifyService() {
        return {
            isPhoneNum: function(tel) {
                return /^1(3[0-9]|4[57]|5[0-35-9]|7[678]|8[0-9])\d{8}$/.test(tel);
            },
            isBankCardNo: function(cardNo) {
                return /^(\d{16}|\d{19})$/.test(cardNo);
            },
            isTradePwd: function(pwd) {
                return /^[\x21-\x7E]{6,20}$/.test(pwd) && !/^\d+$/.test(pwd);
            },
            isLoginPwd: function(pwd) {
                return pwd.length >= 6 && pwd.length <= 20;
            },
            isEmail: function(email) {
                return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(email);
            }
        };
    }

});
