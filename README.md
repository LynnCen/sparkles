# 地图展示系统

#### 介绍

#### 软件架构

#### 安装教程

若使用`BrowserRouter`, 且`process.env.PUBLIC_URL`不为`/`时, nginx 配置参考:

```
location /<PUBLIC_URL> {
    alias D:/path_to_project/build/;
    index index.html index.htm;
    try_files $uri $uri/ <PUBLIC_URL>/index.html;
}
```

#### 使用说明

1.  xxxx
2.  xxxx
3.  xxxx

#### 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request
