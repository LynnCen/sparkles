## 开发环境

-   nodejs 10.16.X
-   npm 6.9.0
-   python 2.7.X
-   npm install -g node-gyp

安装 Electron 以及 electron-build 需要代理，确保网络畅通，代理可以找项目 leader 或 公司运维。

## 本地运行

-   dev: npm run dev

    > ctrl/command + shift + c，打开控制台。

    > 初次编译完成后，如果登陆界面白屏。打开控制台 ctrl + R 刷新即可。

    > livereload： 因为是遗留项目，热更新有问题。渲染进程的代码修改后需要收到 ctrl + R 控制台进行刷新。主进程代码修改后 需要重新编译

## 构建生产包

-   package

    -   test: npm run package-win-test
    -   beta: npm run package-win-beta
    -   prod: npm run package-win-prod
    -   prod(debug): package-win-prod-debug

    > prod 不带控制台，其余命令构建可打开控制台

```
├── config `webpack 配置`
├── docs `部分架构流程图`
│   ├── TMM_收发消息架构_v4.0.pdf
│   └── 图片消息收发.pdf
├── lib `第三方库 副本`
│   └── electron-screenshots
├── locales `国际化文件`
├── locales_script_format `国际或机翻 工具`
├── main.js `主进程如何`
├── main_applet.js `小程序窗口`
├── main_clientSettings.js `设置页面窗口`
├── main_ipc.js `ipc 通信拆分`
├── main_lightBox.js `图片预览窗口`
├── scripts `npm 脚本`
├── src
│   ├── app.js `entry`
│   ├── global.theme.css `主题配置文件`
│   ├── ～～global.theme.less～～ `lagecy`
│   ├── js
│   │   ├── config.js `多语言客户端配置`
│   │   ├── newSdk `im sdk`
│   │   │   ├── config `业务配置`
│   │   │   │   └── index.ts
│   │   │   ├── consts
│   │   │   ├── logic `业务逻辑`
│   │   │   │   ├── Topic `话题`
│   │   │   │   ├── clearAwaitSendMessage.ts `消息重发逻辑`
│   │   │   │   ├── comments `评论`
│   │   │   │   ├── contacts `通讯录`
│   │   │   │   ├── friendReq `好友申请`
│   │   │   │   ├── getBasicBucketInfo.ts `AWS`
│   │   │   │   ├── getBucketInfo.ts `AWS`
│   │   │   │   ├── group `群组`
│   │   │   │   ├── index.ts
│   │   │   │   ├── initScript `初始化 流程`
│   │   │   │   ├── message `消息`
│   │   │   │   ├── moments `Moments`
│   │   │   │   ├── payment `支付`
│   │   │   │   ├── reSendMessage.ts `重发`
│   │   │   │   ├── reportUnread.ts `上报未读存量`
│   │   │   │   ├── sendACKReadMessage.ts `上报已读回执`
│   │   │   │   ├── session `会话逻辑`
│   │   │   │   ├── updateFriendsInfo.ts `好友`
│   │   │   │   └── updateUnreadAsync.ts
│   │   │   ├── model `DB 模型`
│   │   │   │   ├── config.ts `DB Schema`
│   │   │   │   ├── message `消息模型`
│   │   │   │   ├── public `公共DB`
│   │   │   ├── notification `通知中心`
│   │   │   ├── service
│   │   │   │   ├── api `api 层`
│   │   │   │   ├── apiBase `请求库封装`
│   │   │   │   ├── apiCore `请求库封装`
│   │   │   │   └── nets `请求库封装`
│   │   │   ├── utils `相关工具函数`
│   │   │   └── websocket_client `websocket`
│   │   ├── ui
│   │   │   ├── components
│   │   │   │   ├── Avatar `全局头像代理`
│   │   │   │   ├── CheckUpdateModal `自动更新模态框`
│   │   │   │   ├── Editor `moments 富文本`
│   │   │   │   ├── TmmFileListModal `附件模态框`
│   │   │   │   ├── TmmPickerBoard `好友 会话选择`
│   │   │   │   ├── TmmSearch `tmm 全局公共搜索`
│   │   │   │   ├── TmmSessionBoard `会话设置面板`
│   │   │   │   ├── Tmm_Ant `and design 主题封装`
│   │   │   │   ├── _N_Cropper `裁剪`
│   │   │   │   ├── _N_ImageIcon `图片 主题处理`
│   │   │   │   ├── _N_InitLoadingModal `初始化loading`
│   │   │   ├── hooks `部分自定义hooks`
│   │   │   │   └── useUserSelect.jsx `lagecy`
│   │   │   ├── icons `svg 图标`
│   │   │   ├── pages
│   │   │   │   ├── Header
│   │   │   │   ├── Home `chat 页面`
│   │   │   │   ├── Login `扫码界面`
│   │   │   │   ├── Nav `侧边栏`
│   │   │   │   ├── Second `通讯录`
│   │   │   ├── stores  `全局 store`
│   │   │   ├── stores_new `全局 store`
│   │   │   │   ├── chat.js
│   │   │   │   ├── comments.js
│   │   │   │   ├── common.js
│   │   │   │   ├── contacts.js
│   │   │   │   ├── downloadCenter.js
│   │   │   │   ├── formatIntlTemplate.js
│   │   │   │   ├── forward.js
│   │   │   │   ├── intersectionObserver.js
│   │   │   │   ├── momentLikes.js
│   │   │   │   ├── notifications.js
│   │   │   │   ├── session.js
│   │   │   │   ├── sessionInfoProxy.js
│   │   │   │   ├── userInfoProxy.js `lagecy`
│   │   │   │   └── userProxy.js
│   │   │   ├── utils `工具类`
│   │   └── windows
│   ├── lightlyWindow
│   │   └── LightBox `图片浏览器`
│   └── otherRenderProcess
│       ├── Applet `小程序页面`
│       ├── Settings `设置页面`
│       ├── react-screenshots `截图`
│       └── utils.js
├── tsconfig.json
└── types.d.ts

```

## 内容基于 feature-ui 分支

### Chat 模块 `Pages/Home`

    * 发送消息
        界面操作 -> chat.js(store) -> sdk/api/sendMessage
    * 会话列表

    > 界面的ui变更是根据底层数据库的映射而来，chat.js 和 session.js 两个 store 中分别有主要业务逻辑的 事件监听。 会话列表的变更主要逻辑在底层数据库，可以顺着发送消息的流程一步一步向下查看。

    * 会话配置
    > 聊天配置主要逻辑 存放在 components/tmmSessionBoard

    * 消息操作类型
    > 消息操作类型逻辑 存放在 pages/Home/NewChat/index.js

### contacts 模块 `Pages/Second`

    * 添加好友

### Moments 模块 `Pages/Moments` `Pages/MomentDetails`

    > 目前已经隐藏

    > 后面后期会进行重构，以重构样式来看，基本没有可服用UI。底层逻辑主要存放在 newSdk/logic/moment

### Tmm 设置页面 `otherRenderProcess/Settings`

    > 该界面是一个新窗口，功能相对简单，使用原生js构建

### webpack 配置 `config/`

    > 遗留项目，架构师之前以及存在的自建项目，如果需要添加新的窗口并使用 webpack 构建。 可通过config/index 中添加 client。其余配置细节，参考已存在的 client.

### 主题

    > 主题的架构通过多个版本修改，最初需求是支持深色/浅色，现在及未来需要支持主题配色。以前遗留的方式有 通过 1.shoulduseDark...变量来判断， 2. 全局className 名。
    现在的方案是基于 css变量实现， `src/js/ui/global.theme.css`，后续支持 主题颜色只需要在根节点上添加 其它样式名，覆盖变量样式。

### SDK 底层逻辑组装

    > 主要模块划分
    * config `SDK 的一些配置，主要是 api 地址`
    * consts `常量`
    * logic `业务逻辑`
    * module `数据库模型，以及一些数据模型`
    * notification `事件通知处理厂`
    * service `后端服务，api地址，请求库`
    * utils `工具函数`
    * websocket_client `长链接`

    > 基于目前的最佳实践：
        1. service/api层: 只使用对于 core(请求库) 封装后端接口地址，不处理逻辑
        2. module：每一个数据库应该至少对于一个模块，如果db需要跟业务交互需要提供一个 change 事件，具体的交互流程可以参考其它模块。
        3. logic：处理数据库和api相关的业务逻辑，增删改查等。

    基于以上的交互流程：ui -> login -> api/module -> nc -> ui

### app 默认图片：

    > app 默认图片 bucketId = local 的目录位于 /tmmDefaultSource,
    函数逻辑位于 newSdk/logic/_defaultLocalCheck/checkLocal

### 业务层代理

    > 目前架构，数据与UI的映射是通过 notification 进行订阅发布，如果常用数据源，可通过mobx进行代理，简化部分业务流程。实现可参考 stores_new/userProxy。此状态实例用与代理用户信息，包括用户对应的群信息。
    PS：stores_new/userInfoProxy.js 为遗留模块，目前主要存在于未重构的moments模块，后续应该使用 userProxy 进行替换.

### 图片读写压缩

    > 主要逻辑位于：src/js/ui/utils/sn_utils.js

> PS: 后期业务层工具函数，应尽量为纯函数，用 ts 进行书写。

### 多语言处理 `react-intl`

    > 多语言文件 /locales/,
    添加多语言：
        1、  找产品获取对应文案的 中文 英文 土耳其
        2、 剩余语言 通过后端机翻获取
        2.1、机翻脚本存放于 locales_script_format
        2.2、交付后端 需要翻译的英文文案，文件名为 formTemp.json(如果修改文件名，需要修改脚本中的对应位置)
        2.3、后端产出的翻译文件 拷贝到 locales_script_format/formattedLang中
        2.4、在 formatNaeLang.js 中设置本次覆盖的忽略文件（此脚本的作用为：将当前 formattedLang目录下的语言(未设置忽略的)，与对应的 /locales 下面的语言，进行整合）.
        2.5、检查脚本运行结果
        2.6、移除 formattedLang 即 locales_script_format 下面的脚本修改，避免git无意义提交

### 截图工具 `(electron-screenshots)[https://github.com/nashaofu/screenshots]`

    > 截图工具使用第三方工具，应需要支持国际后 后续对 源码进行修改后，编译到 /src/js/otherRenderProcess/react-screenshots。
    后续可查看当前插件least是否支持业务需求，或寻找其它第三方，或机遇业务自己开发

    > 截图当前问题：
        1. 国际化，目前全部固定中文
        2. 点击截图延迟：参考：
        https://link.juejin.im/?target=https%3A%2F%2Fgithub.com%2Felectron%2Felectron%2Fissues%2F8246

        https://link.juejin.im/?target=https%3A%2F%2Fgithub.com%2Felectron%2Felectron%2Fissues%2F2237

        解决方法：第三方原生扩展 或 getUserMedia(会请求摄像头)

### release

    > 版本 release 后，最好构建对于对 tag 版本，便于后续跟踪。

### 数据库 `indexDB` 第三方 `dexie.js`

    > 问题：不支持设置密码，可通过序列化加密；非关系型keyvalue 数据库，查询能力弱。
    > schema `newsdk/model/config.ts`

    用户数据库：
        chat: 会话表,
        message: 消息表,
        memberInfos: 用户信息表,
        groupInfo: 群信息表,
        groupMembers: 群成员表,
        friendReqs: 好友请求表,
        token: token存储,

        /* moments */
        momentsFeeds: moments 流,
        momentsDetailsModel: moments详情表,
        momentsUserFeeds: moments 用户流,
        commentIds: moments 评论ids,
        comments: moments 评论,
        commentLikes: moments 评论 点赞,
        momentLikes: moments 点赞,
        topicFeeds: moments 话题流,
        topicDetails: moments 话题详情,
        notifications: moments 通知中心,
        notificationRead: moments 通知中心,

        hotCommentFeeds: 热评流,
        keyValues: key - value 库,

        // 支付相关库
        [TABLE_NAME.COIN_CONFIG]: "&id",
        [TABLE_NAME.WITHDRAW_BILL]: "&id",
        [TABLE_NAME.RECHARGE_BILL]: "&id",
    公用数据库：
        intlTemplate: 透明人消息模板,
        bucketInfos: buckect sts 详情,
