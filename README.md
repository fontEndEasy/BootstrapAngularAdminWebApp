# BootstrapAngularAdminWebApp
> 此项目为bootstrap+angular搭建的后台管理系统，构建打包工具为grunt.js，静态第三方脚本库统一由bower管理，分药厂、医生、患者、医导等不同角色，每种角色为一个子项目，各子项目目录结构一样，可以独立打包运行，目录说明如下：
> 1. api/data:本地数据测试
> 2. css: 模式文件
> 3. fonts: iconfonts字体库
> 4. img:图片
> 5. js:脚本文件
> 6. 110n:国际化处理脚本
> 7. tpl:模板
> 8. ... ...



> 本人负责该项目的前端开发，并参与前端技术编码规范制定，技术选型，性能优化方案，负责与后台数据交互，业务处理等。
具体实施：
1. 开发工具Notepad plus++ / webstrom，Nginx(代理)，代码管理工具是Git+GitLab+Jira+Confluence为项目管理系统。
2. Jira分配任务，任务进入开发阶段，完成后把修改的代码、新增的功能或修复的bug先提交代码到本地Git仓库，登录局域网构建平台把代码提交到局域网服务器，每天12点、13点，晚18点，20点，构建平台再次把代码自动提交到最终测试服务器，Jira任务进入提交测试阶段，经测试人员测试后在Jira中进行反馈，如无问题，则任务结束。
3. 通过Angular 以及第三方模块，自定义指令，通用服务等进行数据双向绑定和渲染。
4. 结合后端人员进行Ajax长轮询实现IM通信，后期将用H5 websocket进行重构，封装locaStorage进行本地存储操作。文件上传依赖七牛插件进行相关配置实现，ngRouter状态管理机制进行路由跳转，模板，控制器，数据绑定等操作。
5. App.url命名空间进行基于restful架构的API接口管理，通过ajax调用（登录，注册，session管理，药厂、医生、医导、患者等不同角色，通讯录列表，管理员设置，药店店长，店员创建，删除，更换，患者积分管理，推广销售管理，药品品种列表，系统消息实时自动更新）等。 
6. Requirejs进行部分模块异步加载和管理，成功，信息，错误，警告弹窗组件，可定制异步数据加载树组件封装，Database数据展示，Oclazyload实现基于路由的懒加载，Bootstrap页面布局和公共样式应用等，Chrome 、Batarang等性能监控与调优工具的使用，逐渐完善。 通过Gulp构建工具搭建BrowserSync 环境进行调试。 




> Please put the files on a server or local host to preview. 
> then preview:  

> 1. http://localhost/src/
> 2. http://localhost/src/#/music/home
> 3. http://localhost/html/index.html
> 4. http://localhost/landing/index.html


> Documents locate "src/tpl/docs.html" or 
> 1. "http://localhost/src/index.html#/app/docs"
> 2. online: http://flatfull.com/themes/angulr/angular/#/app/docs


> Use Grunt and Bower

> install node.js
> go to the app root

> npm install -g grunt-cli
> npm install
> grunt bower-install
> npm start


> grunt build:angular to build the 'angular' folder
