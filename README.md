# 介绍

{**以下是码云平台说明，您可以替换此简介**
码云是开源中国推出的基于 Git 的代码托管平台（同时支持 SVN）。专为开发者提供稳定、高效、安全的云端软件开发协作平台
无论是个人、团队、或是企业，都能够用码云实现代码托管、项目管理、协作开发。企业项目请看 [https://gitee.com/enterprises](https://gitee.com/enterprises)}

# 目录结构

```
│ package.json                 项目依赖包
│
├─public/                      静态文件资源
├─src/models                   数据模型代码
├─src/components               公共组件代码
├─src/config                   系统配置代码
├─src/page                     分享页面代码
├─src/services                 后台接口
├─src/styles                   样式文件
└─src/modules                  菜单组件代码
```

# 开发环境

- Node.js
- React.js+webpack

# 执行命令

1. 文件根目录下，命令行运行 npm install
2. 依赖包安装完成之后 执行 npm run start
3. 执行 npm run build 可打包项目文件
4. 服务端目录执行 .\backup.bat 会将 index.\*, compress\, js\, images\ 内容拷贝至 .\backup\yyyymmdd\ (yyyymmdd: 当前日期)
5. 服务端目录执行 .\fallback.bat yyyymmdd 会将 .\backup\yyyymmdd\ 下文件作为版本回退 (参数 yyyymmdd: .\backup\下需要回退的子目录)

# 更新日志

## 版本号：3.0.1
## 更新日期：2020-8-17

### 新增
### 变更
### 修复
### 删除


## 版本号：3.0.2
## 更新日期：2020-10-20

### 新增
#### 1:模型复制
### 变更
### 修复
### 删除