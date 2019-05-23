## 简介

  基于[vue-element-admin](https://github.com/PanJiaChen/vue-element-admin/blob/master/README.zh-CN.md)模板开发。

  - [项目在线访问](http://testshoph5.51fanbei.com)

## 准备

  本项目技术栈基于 [ES2015+](http://es6.ruanyifeng.com/)、[vue](https://cn.vuejs.org/index.html)、[vuex](https://vuex.vuejs.org/zh-cn/)、[vue-router](https://router.vuejs.org/zh-cn/) 、[axios](https://github.com/axios/axios) 和 [element-ui](https://github.com/ElemeFE/element)。

  vue-element-admin模板相关文档：
  - [模板使用文档](https://panjiachen.github.io/vue-element-admin-site/zh/)
  - [模板github地址](https://github.com/PanJiaChen/vue-element-admin/blob/master/README.zh-CN.md)

## 命令

  ```bash
  # 启动服务
  npm run serve

  # 使用测试服务器启动服务
  npm run serve:shop

  浏览器访问：http://localhost:9527
  ```

  ```bash
  # 打包项目
  npm run build
  ```

  ```bash
  # --report to build with bundle size analytics
  npm run build --report

  # --preview to start a server in local to preview
  npm run build --preview

  # lint code
  npm run lint

  # lint and auto fix
  npm run lint:fix
  ```

## 结构

  ```bash
  ├── build                      // 构建相关
  ├── config                     // 配置相关
  ├── dist                       // 打包好的文件
  ├── src                        // 源代码
  │   ├── api                    // 各模块请求接口函数
  │   ├── assets                 // 主题、字体等静态资源
  │   ├── components             // 公共组件
  │   ├── directive              // 公共自定义指令
  │   ├── filters                // 公共filter
  │   │   ├── transform.js       // 字段转中文函数
  │   ├── icons                  // 项目所有svg、icons
  │   ├── router                 // 路由
  │   ├── store                  // vuex管理
  │   ├── styles                 // 全局样式
  │   ├── utils                  // 公用方法目录
  │   │   ├── request.js         // axios请求统一配置
  │   │   ├── tools.js           // 公共工具方法
  │   │   ├── validate.js        // 公共表单校验方法
  │   ├── vendor                 // 公共插件
  │   ├── views                  // 所有页面代码目录
  │   ├── App.vue                // 入口页面
  │   ├── main.js                // 入口文件
  │   └── permission.js          // 权限管理
  ├── static                     // 第三方不打包资源
  ├── .babelrc                   // babel-loader 配置
  ├── .eslintrc.js               // eslint 配置项
  ├── .gitignore                 // git 忽略项
  ├── favicon.ico                // favicon图标
  ├── index.html                 // html模板
  └── package.json               // package.json
  ```

## 浏览器支持
  ```bash
  IE10+
  Edge
  Chrome
  Firefox
  Safari
  ```
  