'use strict';

// 首页控制器
app.controller('HomeController', ['$state', '$cookieStore', '$http', '$rootScope', 'utils',
  function($state, $cookieStore, $http, $rootScope, utils) {
    var date = new Date();
    var _y = date.getFullYear();
    var _M = date.getMonth() + 1;
    var _d = date.getDate();
    var _h = date.getHours();
    var _m = date.getMinutes();
    console.log('欢迎来到 [' + document.title + '], 当前时间是: ' + _y + ' 年 ' + _M + ' 月 ' + _d + ' 日 ' + (_h>=12 ? ('下午 ' + _h%12):('上午 ' + _h)) + ' 点 ' + _m + ' 分');

    var cookie = $cookieStore.get('username');
    
    if(!cookie){
      $state.go('access.signin');
    }

    // 初始化页面数据
    var urls = [
        app.url.admin.check.getDoctors,
        app.url.admin.check.getDoctors,
        app.url.admin.check.getDoctors,
        app.url.feedback.query
      ];

    function setNumbers(){
      var dt;
      for(var i=0; i<urls.length; i++){
        dt = {
          status: i+1,
          pageIndex: 0,
          pageSize: 1,
          access_token: app.url.access_token
        };
        if(i === 3) delete dt.status;
        $http({
          url: urls[i],
          method: 'post',
          data: dt
        }).then(function(resp){
          if(resp.data.resultCode !== 1) return;
          if(resp.data.data.pageData[0].status===1){
            $('#check_pass').html(resp.data.data.total);  // 审核通过
            utils.localData('check_pass', resp.data.data.total);
          }else if(resp.data.data.pageData[0].status===2){
            $('#check_undo').html(resp.data.data.total);  // 未审核
            utils.localData('check_undo', resp.data.data.total);
          }else if(resp.data.data.pageData[0].status===3){
            $('#check_nopass').html(resp.data.data.total);// 审核未通过
            utils.localData('check_nopass', resp.data.data.total);
          }else{
            $('#feedback_undo').html(resp.data.data.total);// 反馈未处理
            utils.localData('feedback_undo', resp.data.data.total);  
          }
        });  
      }
    }
    //setTimeout(setNumbers, 300);
    //clearInterval($rootScope.timer); // 避免重复计时
    //$rootScope.timer = setInterval(setNumbers, 60000); // 一分钟刷新一次界面数据
  }
]);