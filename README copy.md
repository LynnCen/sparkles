# Location 租户前台应用

## 开发前必读

### 1. IconFont的引入规约（public/index.html）
```
1. 引入的个数
原则上引入的iconfont只能有两个，分别为：UI组件库的iconfont:
https://www.iconfont.cn/manage/index?spm=a313x.7781069.1998910419.db775f1f3&manage_type=myprojects&projectId=2105876&keyword=&project_type=&page=

以及当前项目的iconfont项目：xxx

2. 引入的规范
项目名 + 地址链接 + script，例如：
<!-- locatioin_pc https://www.iconfont.cn/manage/index?spm=a313x.7781069.1998910419.23&manage_type=myprojects&projectId=1879396&keyword=&project_type=&page= -->
<script src="//at.alicdn.com/t/c/font_1879396_jabugzulo5.js"></script>

3. 当前项目因为历史原因，保持现状，禁止再新引入iconfont，如有使用，请自行添加icon至location-pc
https://www.iconfont.cn/manage/index?spm=a313x.7781069.1998910419.db775f1f3&manage_type=myprojects&projectId=1879396&keyword=&project_type=&page=
```


### 创建路由规则
```
1. 路由名尽量抽象（即一个单词命名）
2. 如果一个单词无法表达，直接在后拼接，不使用驼峰或者连接符，比如
门店管理： store manage 路由名应为 storemanage
3. 如果是功能模块，直接在views下新建一个文件夹，不要看prd中该功能归属的一级菜单
4. 如果是单个功能页面，
（1）可根据功能语义查找合适的目录进行存放，可以参照prd中该功能归属的一级菜单，也可以不参照
（2）多个相同功能的页面，但是又需要独立维护，可创建一个单独的文件夹存放，比如门店地图，有汽车行业的门店地图、鱼你的门店地图、演示的门店地图、通用版本的门店地图，这个时候可以在storemap文件夹下分别维护不同版本的门店地图
以上描述有不尽详尽的地方可咨询疯子
```

### 注释规范
```
请遵循该规范：https://doc.weixin.qq.com/doc/w3_ABMA4QZJAOkzGWN7QPUQY2Shkcqjy?scode=ADMAmgftAAcdBqMcwzABMA4QZJAOk
```

### 环境说明
```
ie: 集成环境
te: 测试环境
se: 预演环境
pe: 生产环境

npm run serve:ie 连接到集成环境的接口
npm run serve:te 连接到测试环境的接口
npm run serve:se 连接到预演环境的接口
npm run serve:pe 连接到生产环境的接口
```

### 组件开发(避免重复开发)
###### 当前项目已经比较成熟，90%以上日常使用的组件都已开发好了
```
1. 优先查找common/components下的组件
2. 查找组件库平台 https://reactpc.lanhanba.net/components/docs/changelog
3. 查找ant组件库文档
```
###### 组件图解说明(不做强制要求)
```
1. 安装Paste Image插件（用法：command + option + v进行粘贴图片到md文件）
2. 组件根目录下创建Diagrammatize文件夹，内放README.md及相关图片，可参考src/common/components/business/RecommendSidebar/Diagrammatize
```


# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm run serve`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## react-router

https://reactrouter.com/docs/en/v6/api

## redux

http://cn.redux.js.org/redux-toolkit/overview


## 环境
| 环境 | 域名 |
|:------:|:------------------:|
| 集成   | https://ie-console.lanhanba.net |
| 测试 | https://console.lanhanba.net  |
| 预演 | https://console.lanhanba.com  |
| 生产 | https://console.location.pub  |

## 部署

| 环境  |                         地址                          |
|:---:|:---------------------------------------------------:|
| 集成  | http://ci.lanhanba.com/job/ie/job/location/job/console-pc/ |
| 测试  | http://ci.lanhanba.com/job/te/job/location/job/console-pc/ |
| 预演  | http://ci.lanhanba.com/job/se/job/location/job/console-pc/ |
| 生产  | http://ci.lanhanba.com/job/pe/job/location/job/console-pc/ |


## 目录
```md
├── dist                      # 打包文件
├── libs
├── public
│   └── index.html
│   └── favicon.ico
├── src
│   ├── Layouts               # 
│   │   └── BasicLayout
│   ├── assets                # 静态资源
│   ├── common                # 公用文件
│   │   ├── enums
│   │   ├── helpers
│   │   ├── hook              # 自定义hooks
│   │   ├── request           # 请求文件
│   │   ├── styles            # 样式文件
│   │   └── utils
│   ├── components            # 组件
│   │   ├── Login
│   │   ├── NotFound
│   ├── pages                 # 页面
│   │   ├── Home
│   │   │   └── Index
│   │   │   │   └── index.tsx
│   │   │   │   └── index.module.less # xx.module.less|css|scss，结尾的文件将切换到css module
│   │   │   │   └── page.config.ts
│   │   │   │   └── ts-config.ts
│   │   └── Home2
│   │       └── Index
│   ├── router                # 路由
│   └── store                 # [可选]公共状态管理-redux
│       └── features
│       └── store.ts
│   └── app.tsx               # 页面结构 router
│   └── global.less           # 公共样式文件
│   └── index.tsx             # 入口文件
│   └── react-app-env.d.ts 
│   └── setupProxy.js         # 跨域配置
└── types
├── .eslintignore
├── .eslintrc.js
├── .gitignore
├── config-overrides.js       # 不eject的情况下更改webpack配置
├── package-lock.json
├── package.json
├── README.md
├── tsconfig.json
```

