export const config = {
  title: "平台",
  enTitle: "WATER ENVIRONMENT MANALAGEMENT PLATFORM",
  menu: {
    人员情况: "./images/water/personnel.png",
    运行指标: "./images/water/runTargets.png"
  },
  overview: {
    title: "项目概况",
    suffix: { name: "场站数量", value: 125, unit: "个" },
    data: [
      {
        name: "笏石镇",
        icon: "./images/water/heliu.png",
        value: 31
      },
      {
        name: "埭头镇",
        icon: "./images/water/suojinindent2.png",
        value: 21
      },
      {
        name: "平海镇",
        icon: "./images/water/suojinindent2.png",
        value: 31
      },
      {
        name: "东峤镇",
        icon: "./images/water/xiangjiaoba.png",
        value: 18
      },
      {
        name: "月塘镇",
        icon: "./images/water/ziyuan.png",
        value: 8
      },
      {
        name: "南日镇",
        icon: "./images/water/ziyuan.png",
        value: 16
      }
    ]
  },
  monitors: {
    title: "视频监控",
    data: [
      {
        town: "笏石镇",
        village: "西徐村A",
        data: [
          {
            code: "KTU-001",
            thumbnail: "./images/water/putian1.png",
            name: "西徐村A视频监控",
            url: `./video/putian1.mp4`
          },
          {
            code: "KTU-002",
            thumbnail: "./images/water/putian2.png",
            name: "西徐村B视频监控",
            url: `./video/putian2.mp4`
          }
        ]
      }
    ]
  },
  runTargets: [
    {
      type: "污水处理设备",
      item: "工作",
      count: 100
    },
    { type: "污水处理设备", item: "关闭", count: 15 },
    { type: "污水处理设备", item: "故障", count: 10 },
    { type: "污水处理设备", item: "离网", count: 0 },

    {
      type: "水质监测站",
      item: "工作",
      count: 117
    },
    { type: "水质监测站", item: "关闭", count: 1 },
    { type: "水质监测站", item: "故障", count: 2 },
    { type: "水质监测站", item: "离网", count: 5 }
  ],
  energyConsumption: {
    title: "当前能耗情况",
    data: [
      {
        type: "目前负荷",
        x: "资源化利用",
        value: 77.0,
        limit: [0, 100],
        scale: 0.1
      },
      {
        type: "目前负荷",
        x: "网络数据",
        value: 48.0,
        limit: [0, 100],
        scale: 0.1
      },
      {
        type: "目前负荷",
        x: "能耗情况",
        value: 90.0,
        limit: [0, 100],
        scale: 0.1
      },
      {
        type: "负荷余量",
        x: "资源化利用",
        value: 23.0,
        limit: [0, 100],
        scale: 0.1
      },
      {
        type: "负荷余量",
        x: "网络数据",
        value: 52.0,
        limit: [0, 100],
        scale: 0.1
      },
      {
        type: "负荷余量",
        x: "能耗情况",
        value: 10.0,
        limit: [0, 100],
        scale: 0.1
      }
    ],
    theme: {
      colors: ["#0cceac", "rgba(255, 255, 255, 0.4)"],
      axis: {
        left: {
          grid: {
            lineStyle: { stroke: "transparent" },
            hideFirstLine: true
          }
        },
        bottom: {
          position: "bottom",
          label: {
            offset: 12,
            textStyle: { fill: "rgba(255,255,255,.8)" }
          }
        }
      }
    }
  },
  environment: [
    {
      name: "温度（℃）",
      value: 26,
      avatar: "./images/water/icon_wendu.png"
    },
    {
      name: "相对湿度",
      value: 43,
      avatar: "./images/water/icon_shidu.png"
    },
    {
      name: "pm2.5(μg/m3)",
      value: 23,
      avatar: "./images/water/fengsu.png"
    },
    {
      name: "风向",
      value: "西南风",
      avatar: "./images/water/iconfengxiang.png"
    }
  ],
  waterTargets: {
    title: "水质指标",
    count: 150,
    standard: 0.95,
    sample: {
      town: "",
      village: "",
      data: [
        {
          name: "限值:60mg/L",
          value: 0.7,
          limit: [0, 60],
          scale: 0.01,
          change: 1,
          limits: [0, 60]
        },
        {
          name: "限值:20mg/L",
          value: 4.4,
          limit: [4.1, 8.8],
          scale: 0.1,
          change: -1,
          limits: [0, 20]
        },
        {
          name: "限值:20mg/L",
          value: 2,
          limit: [1, 2],
          scale: 1,
          change: 1,
          limits: [0, 20]
        },
        {
          name: "限值:8mg/L",
          value: 0.05,
          limit: [0.05, 0.05],
          scale: 0.01,
          change: 1,
          limits: [0, 8]
        },
        {
          name: "限值:1mg/L",
          value: 0.07,
          limit: [0.07, 0.07],
          scale: 0.01,
          change: -1,
          limits: [0, 1]
        },
        {
          name: "限值:5-9",
          value: 6,
          limit: [5.84, 6],
          scale: 0.01,
          change: 1,
          limits: [5, 9]
        }
      ]
    },
    data: [
      // , {
      //   title: "杨林村B", data: [
      //     { name: "限值:60mg/L", value: 50, limit: [0, 100], scale: 0.01, change: 1, limits: [0, 60] },
      //     { name: "限值:20mg/L", value: 18.17, limit: [0, 100], scale: 0.01, change: 1, limits: [0, 20] },
      //     { name: "限值:20mg/L", value: 16.32, limit: [0, 100], scale: 0.02, change: 1, limits: [0, 20] },
      //     { name: "限值:8mg/L", value: 8.06, limit: [0, 100], scale: 0.01, change: 1, limits: [0, 8] },
      //     { name: "限值:1mg/L", value: 1, limit: [0, 100], scale: 0.02, change: 1, limits: [0, 1] },
      //     { name: "限值:6-9", value: 7.11, limit: [0, 100], scale: 0.01, change: 1, limits: [6, 9] },
      //   ]
      // }
    ],
    proportion: {
      title: "场站达标情况",
      value: (122.0 / (122 + 3)).toFixed(3),
      data: [
        {
          type: "达标",
          x: "占比",
          value: 122,
          limit: [0, 125]
        },
        {
          type: "未达标",
          x: "占比",
          value: 3,
          limit: [0, 125]
        }
      ]
    }
  },
  sewage: {
    title: "昨日污水处理量",
    suffix: { name: "单位", unit: "m³" },
    data: [
      [
        {
          // name: "昨日处理量(m³)",
          value: 300,
          change: 1,
          limit: [11.08, 11.12],
          scale: 0.02,
          title: "笏石镇"
        },
        {
          // name: "昨日处理量(m³)",
          value: 200,
          change: 1,
          limit: [0, 500],
          scale: 0.01,
          title: "埭头镇"
        },
        {
          // name: "昨日处理量(m³)",
          value: 400,
          change: 1,
          limit: [0, 500],
          scale: 0.01,
          title: "平海镇"
        }
      ],
      [
        {
          // name: "昨日处理量(m³)",
          value: 600,
          change: 1,
          limit: [9.4, 9.44],
          scale: 0.02,
          title: "东峤镇"
        },
        {
          // name: "昨日处理量(m³)",
          value: 300,
          change: 1,
          limit: [0, 500],
          scale: 0.01,
          title: "月塘镇"
        },
        {
          // name: "昨日处理量(m³)",
          value: 200,
          change: 1,
          limit: [0, 500],
          scale: 0.01,
          title: "南日镇"
        }
      ]
    ],
    proportion: {
      title: "日均总处理量",
      value: (1300.0 / (1300 + 50)).toFixed(3),
      data: [
        {
          type: "日均处理量",
          x: "占比",
          value: 1300,
          limit: [0, 1350]
        },
        {
          type: "总设计处理量",
          x: "占比",
          value: 50,
          limit: [0, 1350]
        }
      ]
    }
  },
  region: null
};
