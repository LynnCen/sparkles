export const headerData = [
  {
    title: "Home",
    path: "/",
  },
  {
    title: "Download",
    path: "/download",
  },
  {
    title: "Contact us",
    path: "/contact",
  },
];

export const manualmenuData = [
  {
    title: "下载与安装",
    path: "/usermanuall/download&install",
    subData: [
      {
        subtitle: "下载",
        subPath: "/usermanual/download&install/download",
      },
      {
        subtitle: "安装",
        subPath: "/usermanual/download&install/install",
      },
    ],
  },
  {
    title: "登录",
    path: "/usermanual/login",
    subData: [
      {
        subtitle: "如何登录",
        subPath: "/usermanual/login/howlogin",
      },
      {
        subtitle: "无法登录",
        subPath: "/usermanual/login/errlogin",
      },
    ],
  },
  {
    title: "联系人",
    path: "/usermanual/contacts",
    subData: [
      {
        subtitle: "添加联系人",
        subPath: "/usermanual/contacts/add_contacts",
      },
      {
        subtitle: "同意好友申请",
        subPath: "/usermanual/contacts/agreen_contacts",
      },
      {
        subtitle: "删除联系人",
        subPath: "/usermanual/contacts/del_contacts",
      },
      {
        subtitle: "为联系人添加备注",
        subPath: "/usermanual/contacts/add_remarks",
      },
    ],
  },
  {
    title: "聊天",
    path: "/usermanual/chat",
    subData: [
      {
        subtitle: "聊天页面功能简介",
        subPath: "/usermanual/chat/page_brief",
      },
      {
        subtitle: "发送文字",
        subPath: "/usermanual/chat/send_text",
      },
      {
        subtitle: "发送表情",
        subPath: "/usermanual/chat/send_expression",
      },
      {
        subtitle: "发送图片、视频",
        subPath: "/usermanual/chat/send_img",
      },
      {
        subtitle: "发送语音",
        subPath: "/usermanual/chat/send_voice",
      },
      {
        subtitle: "发送文件",
        subPath: "/usermanual/chat/send_fiel",
      },
      {
        subtitle: "消息的快捷操作",
        subPath: "/usermanual/chat/biref_news",
      },
      {
        subtitle: "消息的发送状态和已读状态",
        subPath: "/usermanual/chat/news_status",
      },
      {
        subtitle: "群聊",
        subPath: "/usermanual/chat/group_chat",
      },
      {
        subtitle: "附近的人",
        subPath: "/usermanual/chat/nearby_people",
      },
    ],
  },
  {
    title: "音视频通话",
    path: "/usermanual/Audio_video",
    subData: [
      {
        subtitle: "发起单人视频通话",
        subPath: "/usermanual/Audio_video/single_video",
      },
      {
        subtitle: "发起多人视频通话",
        subPath: "/usermanual/Audio_video/mul_video",
      },
    ],
  },
  {
    title: "移动支付",
    path: "/usermanual/pay",
    subData: [
      {
        subtitle: "设置支付密码",
        subPath: "/usermanual/pay/pay_password",
      },
      {
        subtitle: "如何发红包给好友",
        subPath: "/usermanual/pay/send_redPacket_friend",
      },
      {
        subtitle: "拼手气红包",
        subPath: "/usermanual/pay/lucky_redPacket",
        depData: [
          {
            subtitle: "什么是拼手气红包？",
            subPath: "/usermanual/pay/lucky_redPacket/what",
          },
          {
            subtitle: "拼手气红包在哪里使用?",
            subPath: "/usermanual/pay/lucky_redPacket/where",
          },
        ],
      },
      {
        subtitle: "领取红包",
        subPath: "/usermanual/pay/receive_redPacket",
      },
      {
        subtitle: "钱包的使用",
        subPath: "/usermanual/pay/use_wallet",
      },
      {
        subtitle: "转账",
        subPath: "/usermanual/pay/transfer",
      },
      {
        subtitle: "二维码收付款",
        subPath: "/usermanual/pay/QR_code",
      },
      {
        subtitle: "提现",
        subPath: "/usermanual/pay/Withdrawal",
      },
    ],
  },
  {
    title: "Moments",
    path: "/usermanual/Moments",
    subData: [
      {
        subtitle: "Moments介绍",
        subPath: "/usermanual/Moments/introduce",
      },
      {
        subtitle: "浏览所有好友的Moments",
        subPath: "/usermanual/Moments/browse_AllMoments",
      },
      {
        subtitle: "查看某个好友的Moments",
        subPath: "/usermanual/Moments/browse_FriendMoments",
      },
      {
        subtitle: "发布一个Moments",
        subPath: "/usermanual/Moments/send_Moments",
      },
      {
        subtitle: "点赞、评论或回复",
        subPath: "/usermanual/Moments/Message_reminder",
      },
    ],
  },
  {
    title: "开放平台",
    path: "/usermanual/open",
    subData: [
      {
        subtitle: "开放平台",
        subPath: "/usermanual/open/introduce",
      },
      {
        subtitle: "玩游戏&分享给朋友",
        subPath: "/usermanual/open/games",
      },
    ],
  },
];
export const faqmenuData = [
  // 热门问题
  {
    title: "hot-questions",
    path: "/faq/hot-questions",
    subData: [
      {
        subtitle: "view-version",
        subPath: "/faq/hot-questions/view-version",
      },
      {
        subtitle: "change-lan",
        subPath: "/faq/hot-questions/change-lan",
      },
      {
        subtitle: "edit-mydata",
        subPath: "/faq/hot-questions/edit-mydata",
      },
      {
        subtitle: "err-login",
        subPath: "/faq/hot-questions/err-login",
      },
      {
        subtitle: "err-newmessage",
        subPath: "/faq/hot-questions/err-newmessage",
      },
      {
        subtitle: "err-voice",
        subPath: "/faq/hot-questions/err-voice",
        depData: [
          {
            subtitle: "confim-voice",
            subPath: "/faq/hot-questions/err-voice/confim-voice",
          },
          {
            subtitle: "where-voice",
            subPath: "/faq/hot-questions/err-voice/where-voice",
          },
          {
            subtitle: "why-voice",
            subPath: "/faq/hot-questions/err-voice/why-voice",
          },
        ],
      },
      {
        subtitle: "err-viewme-video",
        subPath: "/faq/hot-questions/err-viewme-video",
        depData: [
          {
            subtitle: "confim-voice",
            subPath: "/faq/hot-questions/err-viewme-video/confim-author-video",
          },
          {
            subtitle: "err-video-work",
            subPath: "/faq/hot-questions/err-viewme-video/err-video-work",
          },
          {
            subtitle: "why-voice",
            subPath: "/faq/hot-questions/err-voice/why-voice",
          },
        ],
      },
    ],
  },
];
