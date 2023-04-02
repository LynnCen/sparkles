import type { NavTree } from "../../Component/DocRender/data";
enum NodeType {
    Strong = "strong",
    P = "p",
    PMargin = "pMargin",
    TitleBlock = "title-block",
    TitleInline = "title-inline",
    Link = "link",
}

export const Content = {
    "10000": {
        title: "TmmTmm 用户手册",
        context: [
            {
                type: NodeType.Strong,
                text: "介绍",
            },
            {
                type: NodeType.PMargin,
                text: "名字：TmmTmm",
            },
            {
                type: NodeType.TitleBlock,
                text: "Slogan:",
            },
            {
                type: NodeType.P,
                text: "土耳其本地化的免费聊天和移动支付应用",
            },
            {
                type: NodeType.PMargin,
                text: "Free chat and mobile payment application localized in Turkey",
            },
            {
                type: NodeType.TitleBlock,
                text: "简介：",
            },
            {
                type: NodeType.PMargin,
                text: "TMMTMM不仅仅是一个信息和社交媒体应用程序，它是一种新的数字生活方式。与朋友高清音视频通话，分享重要的时刻，享受移动支付的便捷功能",
            },
            {
                type: NodeType.TitleInline,
                text: "官网",
            },
            {
                type: NodeType.Link,
                text: "https://tmmtmm.com.tr/",
            },
            {
                type: NodeType.TitleInline,
                text: "下载地址：",
            },
            {
                type: NodeType.Link,
                text: "https://tmmtmm.com.tr/download.html",
            },
        ],
    },
};

export const nav: NavTree = [
    {
        type: "nav",
        title: "下周与安装",
        sub: [
            {
                title: "1. 下载",
                linkId: "10000",
            },
            {
                title: "2. 安装",
                linkId: "10001",
            },
        ],
    },
];
