# create-react-app-demo

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).


# 安装依赖
```bash
$ npm install
```

## Available Scripts

In the project directory, you can run:

### 本地开发开发：
```bash
npm run serve
```

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### 打包：
```bash
npm run build
```

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

# 环境地址
| 环境 | 域名 |
|:------:|:------------------:|
| 集成 | https://ie-gateway.lanhanba.net/blaster |
| 测试 | https://saasadmin.lanhanba.net  |
| 预演 | https://saasadmin.lanhanba.com  |
| 生产 | https://saasadmin.location.pub  |


```

# 项目
## 目录
```md
├── dist                      # 打包文件
├── libs
├── public
│   └── index.html
│   └── favicon.ico
├── src
│   ├── layout                # 侧边栏
│   ├── assets                # 静态资源
│   ├── common                # 公用文件
│   │   ├── components        # 组件
│   │   │   └── Login
│   │   │   └── NotFound
│   │   ├── enums
│   │   ├── helpers
│   │   ├── hook              # 自定义hooks
│   │   ├── request           # 请求文件
│   │   ├── styles            # 样式文件
│   │   └── utils
│   ├── views                 # 页面
│   │   ├── home
│   │   │   └── pages
│   │   │   │   └── index
│   │   │   │   │   └── components
│   │   │   │   │   │   └── List
│   │   │   │   │   │   │   └── index.tsx
│   │   │   │   │   │   │   └── index.module.less
│   │   │   │   │   └── entry.tsx
│   │   │   │   │   └── entry.module.less # xx.module.less|css|scss，结尾的文件将切换到css module
│   │   │   │   │   └── page.config.ts
│   │   │   │   │   └── ts-config.ts
│   │   │   │   └── store
│   │   │   │   └── ...
│   │   └── home2
│   │       └── pages
│   │   │   │   └── index
│   ├── router                # 路由
│   └── store                 # [可选]公共状态管理-redux
│       └── index.ts
│   └── app.tsx               # 页面结构 router
│   └── global.less           # 公共样式文件
│   └── index.tsx             # 入口文件
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



