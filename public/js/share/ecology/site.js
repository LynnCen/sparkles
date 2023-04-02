const _config = (monitors = ["望城岭公寓二期", "八都溪河流综合治理工程"]) => ({
  overview: [
    {
      name: "项目总数（个）",
      value: 515,
      icon: "./images/ecology/icon_xiangmuzongshu.png"
    },
    {
      name: "在线监测点（个）",
      value: 51,
      icon: "./images/ecology/icon_zaixianjiance.png"
    },
    {
      name: "视频监控点（个）",
      value: 47,
      icon: "./images/ecology/icon_shipingjiankong.png"
    },
    {
      name: "噪音合格率",
      value: 0.83,
      icon: "./images/ecology/icon_zaoyin.png",
      unit: "%"
    },
    {
      name: "扬尘合格率",
      value: 0.9,
      icon: "./images/ecology/icon_yangcheng.png",
      unit: "%"
    },
    {
      name: "扬尘预警",
      value: 2,
      icon: "./images/ecology/icon_gaojing.png",
      data: [
        { name: "望城岭公寓二期 PM2.5超标", offset: 0 },
        { name: "城中公寓二期南区(西地块) PM2.5超标", offset: -1 }
      ]
    },
    {
      name: "噪音预警",
      value: 3,
      icon: "./images/ecology/icon_gaojing.png",
      data: [
        { name: "望城岭公寓二期 噪音超标", offset: 0 },
        { name: "金周农居新社区北地块项目工程 噪音超标", offset: 2 },
        { name: "城中公寓二期南区(西地块) 噪音超标", offset: -1 }
      ]
    }
  ],
  sewage: {
    title: "工地监测点位",
    enTitle: "Construction site monitoring",
    suffix: { name: "监测点位", value: 132, unit: "个" }
  },
  monitors: [
    {
      title: "大型项目",
      data: [
        {
          code: "33110200001310216869",
          thumbnail: "./images/ecology/gongdi-wangchengling1.png",
          name: monitors[0],
          url: ""
        },
        {
          code: "33118100001310010251",
          thumbnail: "./images/ecology/gongdi-baduxi.png",
          name: monitors[1],
          url: ""
        }
      ]
    },
    {
      title: "中型项目",
      data: []
    },
    {
      title: "小型项目",
      data: []
    }
  ]
});
export const config = _config();
export const zhongtai = _config(["中泰工业区", "中泰绿泰路5号"]);
export const name = "site";
