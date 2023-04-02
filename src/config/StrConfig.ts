export default class StrConfig {
  // static BACKENDPAGE = "/#/user/plan";
  static AcceptImg = "image/jpeg,image/gif,image/png";
  static UploadModel = "/Model/UploadModel";
  static UploadImg = "/Model/UploadImg";
  static UploadIcon = "/Data/UploadIcon";

  static getChannelListApi = "/dahua/findChannelBydevid";
  static getOrgListAPi = "/dahua/findsunByorgid";

  static defaultMaxZoom = 50000000;

  static ColorSelect = [
    "#FFFFFF",
    "#ff4500",
    "#f29500",
    "#fac000",
    "#66ff00",
    // "#00ffff",
    "#ff00ff",
    "#9999ff"
    // "#000000",
  ];

  static BalloonColorSelect = [
    { color: "white" },
    { color: "#ff4500" },
    { color: "orange" },
    { color: "#f7b881" },
    { color: "#fac000" },
    { color: "#f0d800" },
    { color: "#adff2f" },
    { color: "#66ff00" },
    { color: "#00ffff" },
    { color: "#ff00ff" },
    { color: "#9999ff" },
    { color: "#fd5b78" }
  ];

  static ResourceList = {
    balloon: "标签列表",
    build: "模型列表",
    push: "塌陷列表",
    line: "线条列表",
    area: "体块列表"
  };

  // 高德矢量图
  static AMAP_VECTOR_URLS = [
    "http://wprd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7",
    "http://wprd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7",
    "http://wprd03.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7",
    "http://wprd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7"
  ];
  // 高德卫星图
  static AMAP_SATELLITE_URLS = [
    "http://wprd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=6",
    "http://wprd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=6",
    "http://wprd03.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=6",
    "http://wprd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=6"
  ];
  // 高德路网图
  static AMAP_NETWORK_URLS = [
    "http://wprd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=8",
    "http://wprd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=8",
    "http://wprd03.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=8",
    "http://wprd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=8"
  ];

  // 谷歌矢量图
  static GOOGELE_VECTOR_URLS = [
    "http://mt0.google.cn/vt/?lyrs=m&hl=zh-CN&gl=cn",
    "http://mt1.google.cn/vt/?lyrs=m&hl=zh-CN&gl=cn",
    "http://mt2.google.cn/vt/?lyrs=m&hl=zh-CN&gl=cn",
    "http://mt3.google.cn/vt/?lyrs=m&hl=zh-CN&gl=cn"
  ];
  // 谷歌卫星图
  static GOOGELE_SATELLITE_URLS = [
    "http://mt0.google.cn/vt/?lyrs=s&hl=zh-CN&gl=cn",
    "http://mt1.google.cn/vt/?lyrs=s&hl=zh-CN&gl=cn",
    "http://mt2.google.cn/vt/?lyrs=s&hl=zh-CN&gl=cn",
    "http://mt3.google.cn/vt/?lyrs=s&hl=zh-CN&gl=cn"
  ];
  // 谷歌卫星、路网图
  static GOOGELE_SATELLITE_NETWORK_URLS = [
    "http://mt0.google.cn/vt/?lyrs=y&hl=zh-CN&gl=cn",
    "http://mt1.google.cn/vt/?lyrs=y&hl=zh-CN&gl=cn",
    "http://mt2.google.cn/vt/?lyrs=y&hl=zh-CN&gl=cn",
    "http://mt3.google.cn/vt/?lyrs=y&hl=zh-CN&gl=cn"
  ];

  // 天地图
  // todo 特殊url路径
  static TIANDI_SATELLITE_NETWORK_URLS = ["http://192.168.1.147:1234/Tianditu/"];

  static location = [
    { value: "cloud", text: "大华平台中心" },
    { value: "device", text: "设备" },
    { value: "3rdCloud", text: "第三方平台" }
  ];

  static recordType = [
    { value: "normal", text: "普通" },
    { value: "alarm", text: "报警" },
    { value: "pluse", text: "手动" },
    { value: "motionDetect", text: "动检" }
  ];

  static playbackType = [
    { value: 0, text: "支持按文件和按时间" },
    { value: 1, text: "只支持按文" },
    { value: 2, text: "只支持按时间" }
  ];
  static videoStream = [{ value: "main", text: "主码流" }, { value: "extra1", text: "辅码流1" }];
  static pptLayerOptions = [
    {
      value: "terrain",
      title: "地块",
      icon:
        process.env.NODE_ENV == "production"
          ? "/res/image/icon/admin/26741589521597989.svg"
          : "/res/image/icon/admin/26621589513333723.svg"
    },
    {
      value: "cad",
      title: "CAD",
      icon:
        process.env.NODE_ENV == "production"
          ? "/res/image/icon/admin/26751589521597989.svg"
          : "/res/image/icon/admin/26631589515515032.svg"
    },
    {
      value: "gps",
      title: "GPS",
      icon:
        process.env.NODE_ENV == "production"
          ? "/res/image/icon/admin/26761589521597989.svg"
          : "/res/image/icon/admin/26611589513333722.svg"
    },
    {
      value: "area",
      title: "体块",
      icon: ""
    },
    {
      value: "line",
      title: "线",
      icon: ""
    },
    {
      value: "build",
      title: "模型",
      icon: ""
    }
    // {
    //   value: "particle",
    //   title: "粒子",
    //   icon:
    //     process.env.NODE_ENV == "production"
    //       ? "/res/image/icon/admin/26731589521597989.svg"
    //       : "/res/image/icon/admin/26641589521547434.svg"
    // }
  ];
  static unsavedWarnMsg = "您有新增项未保存😅~";
  static viewTips = {
    update: "点击按钮记录视角",
    updated: "已更新视角，记得保存"
  };
  static balloonSettings = {
    fontSize: 16,
    themeIndex: "white",
    color: "white",
    pointVisible: true,
    balloonVisible: true,
    imageUrl: "/res/image/icon/公共服务/1547695527887.png",
    altitude: 10
  };
}

export const templates = {
  null: {
    name: "空白模板",
    // enTitle: "SHARE TEST",
    value: "null",
    open: true,
    hasDrawer: false,
    hasCommonHeader: true
  },
  water: {
    name: "水环境",
    value: "water",
    // enTitle: "中交上海航道局有限公司格源环境工程分公司",
    open: true,
    hasDrawer: true,
    hasCommonHeader: true,
    cdir: "water",
    configPath: `${process.env.publicPath}js/share/water.json`
  },
  putianEcology: {
    name: "莆田生态云",
    // enTitle: "LISHUI MOBILE 5G ECOLOGICAL ENVIRONMENT MONITORING PLATFORM",
    value: "putianEcology",
    open: true,
    hasDrawer: true,
    hasCommonHeader: true,
    cdir: "putian",
    configPath: `${process.env.publicPath}js/share/putian.js`,
    regionPath: `${process.env.publicPath}js/share/putianRegion.json`
  },
  ecology: {
    name: "生态环境监测",
    // enTitle: "LISHUI MOBILE 5G ECOLOGICAL ENVIRONMENT MONITORING PLATFORM",
    value: "ecology",
    open: true,
    hasDrawer: true,
    hasCommonHeader: true,
    cdir: "ecology",
    routes: [
      "ecology/AtmosphereSkin",
      "ecology/SiteSkin",
      "ecology/SewageSkin",
      "ecology/ConservancySkin",
      "ecology/GeologySkin",
      "ecology/FireSkin"
    ]
  },
  waterProtection: {
    name: "饮用水源保护",
    value: "waterProtection",
    open: true,
    hasDrawer: true,
    hasCommonHeader: true,
    cdir: "waterProtection",
    configPath: `${process.env.publicPath}js/share/waterProtection.json`
  },
  campus: {
    name: "智慧教育",
    value: "campus",
    open: true,
    hasDrawer: true,
    hasCommonHeader: true,
    cdir: "campus",
    configPath: `${process.env.publicPath}js/share/campus.js`
  },
  illegalBuilding: {
    name: "违章建筑",
    value: "illegalBuilding",
    open: true,
    hasDrawer: true,
    hasCommonHeader: true,
    cdir: "IllegalBuilding",
    configPath: `${process.env.publicPath}js/share/wfjz.json`
  },
  edu: {
    name: "智慧教育空间站",
    value: "edu",
    open: true,
    hasDrawer: true,
    hasCommonHeader: true,
    cdir: "Edu",
    configPath: `${process.env.publicPath}js/share/edu.json`
  },
  industrial: {
    name: "工业园区",
    value: "industrial",
    open: true,
    hasDrawer: false,
    hasCommonHeader: false,
    configPath: `${process.env.publicPath}js/share/industrial.json`
  },
  emergency: {
    name: "应急物资与装备",
    value: "emergency",
    open: true,
    hasDrawer: true,
    hasCommonHeader: true,
    cdir: "emergency",
    configPath: `${process.env.publicPath}js/share/emergency.json`
  },
  ecology2: {
    name: "农创园生态环境监测",
    value: "ecology2",
    open: true,
    hasDrawer: true,
    hasCommonHeader: true,
    cdir: "Ecology2",
    configPath: `${process.env.publicPath}js/share/ecology2.js`
  },
  gongan: {
    name: "公安应急指挥",
    value: "gongan",
    open: true,
    hasDrawer: true,
    hasCommonHeader: true,
    cdir: "gongan",
    configPath: `${process.env.publicPath}js/share/gongan.json`
  },
  gongancommand: {
    name: "公安局指挥中心",
    value: "gongancommand",
    open: true,
    hasDrawer: true,
    hasCommonHeader: true,
    cdir: "gongancommand",
    configPath: `${process.env.publicPath}js/share/gongancommand.json`
  },
  geologicHazard: {
    name: "地质灾害",
    value: "geologicHazard",
    open: true,
    hasDrawer: true,
    hasCommonHeader: true,
    cdir: "geologicHazard",
    configPath: `${process.env.publicPath}js/share/geologicHazard.json`
  },
  geologicHazard2: {
    name: "地质灾害2",
    value: "geologicHazard2",
    open: true,
    hasDrawer: true,
    hasCommonHeader: true,
    cdir: "geologicHazard2",
    configPath: `${process.env.publicPath}js/share/geologicHazard.json`
  },
  fangzhi: {
    name: "松材线虫病防治综合管理平台",
    value: "fangzhi",
    open: true,
    hasDrawer: true,
    hasCommonHeader: true,
    cdir: "fangzhi",
    configPath: `${process.env.publicPath}js/share/fangzhi.json`
  },
  lishui3D: {
    name: "丽水三维地图场景化应用",
    value: "lishui3D",
    open: true,
    hasDrawer: true,
    hasCommonHeader: true,
    cdir: "lishui3D",
    configPath: `${process.env.publicPath}js/share/lishui3D.json`
  },
  channelManagement: {
    name: "丽水市城市应急通道管控平台",
    value: "channelManagement",
    open: true,
    hasDrawer: true,
    hasCommonHeader: true,
    cdir: "channelManagement",
    configPath: `${process.env.publicPath}js/share/channelManagement.json`
  },
  grassrootsGovernance: {
    name: "基层治理一张图",
    value: "grassrootsGovernance",
    open: true,
    hasDrawer: true,
    hasCommonHeader: true,
    cdir: "grassrootsGovernance",
    configPath: `${process.env.publicPath}js/share/grassrootsGovernance.json`
  },
  peibiao1: {
    name: "松材线虫方案1",
    value: "peibiao1",
    open: true,
    hasDrawer: true,
    hasCommonHeader: true,
    cdir: "peibiao1",
    configPath: `${process.env.publicPath}js/share/peibiao1.json`
  },
  peibiao2: {
    name: "松材线虫方案2",
    value: "peibiao2",
    open: true,
    hasDrawer: true,
    hasCommonHeader: true,
    cdir: "peibiao2",
    configPath: `${process.env.publicPath}js/share/peibiao2.json`
  },
  folkMap1: {
    name: "民情地图1",
    value: "folkMap1",
    open: true,
    hasDrawer: true,
    hasCommonHeader: true,
    cdir: "folkMap1",
    configPath: `${process.env.publicPath}js/share/folkMap1.json`
  },
  folkMap2: {
    name: "民情地图2",
    value: "folkMap2",
    open: true,
    hasDrawer: true,
    hasCommonHeader: true,
    cdir: "folkMap2",
    configPath: `${process.env.publicPath}js/share/folkMap2.json`
  },
  digitalFarm: {
    name: "数字孪生农场",
    value: "digitalFarm",
    open: true,
    hasDrawer: true,
    hasCommonHeader: true,
    cdir: "digitalFarm",
    configPath: `${process.env.publicPath}js/share/digitalFarm.json`
  },
  dtVillage: {
    name: "数字孪生乡村(东坑)",
    value: "dtVillage",
    open: true,
    hasDrawer: true,
    hasCommonHeader: true,
    cdir: "dtVillage",
    configPath: `${process.env.publicPath}js/share/dtVillage.json`
  },
  fusionCommand: {
    name: "丽水市应急融合指挥管理平台",
    value: "fusionCommand",
    open: true,
    hasDrawer: true,
    hasCommonHeader: true,
    cdir: "fusionCommand",
    configPath: `${process.env.publicPath}js/share/fusionCommand.json`
  },
  dtVillage2: {
    name: "数字孪生乡村(大坑)",
    value: "dtVillage2",
    open: true,
    hasDrawer: true,
    hasCommonHeader: true,
    cdir: "dtVillage2",
    configPath: `${process.env.publicPath}js/share/dtVillage2.json`
  },
  dtVillage3: {
    name: "数字孪生乡村(西坑)",
    value: "dtVillage3",
    open: true,
    hasDrawer: true,
    hasCommonHeader: true,
    cdir: "dtVillage2",
    configPath: `${process.env.publicPath}js/share/dtVillage3.json`
  },
  songyangMap1: {
    name: "松阳民情地图1",
    value: "songyangMap1",
    open: true,
    hasDrawer: true,
    hasCommonHeader: true,
    cdir: "songyangMap1",
    configPath: `${process.env.publicPath}js/share/songyangMap1.json`
  },
  songyangMap2: {
    name: "松阳民情地图2",
    value: "songyangMap2",
    open: true,
    hasDrawer: true,
    hasCommonHeader: true,
    cdir: "songyangMap2",
    configPath: `${process.env.publicPath}js/share/songyangMap2.json`
  },
  songyangMap3: {
    name: "松阳民情地图3",
    value: "songyangMap3",
    open: true,
    hasDrawer: true,
    hasCommonHeader: true,
    cdir: "songyangMap3",
    configPath: `${process.env.publicPath}js/share/songyangMap3.json`
  },
  songyangMap4: {
    name: "松阳民情地图4",
    value: "songyangMap4",
    open: true,
    hasDrawer: true,
    hasCommonHeader: true,
    cdir: "songyangMap4",
    configPath: `${process.env.publicPath}js/share/songyangMap4.json`
  },
  songyangMap5: {
    name: "松阳民情地图5",
    value: "songyangMap5",
    open: true,
    hasDrawer: true,
    hasCommonHeader: true,
    cdir: "songyangMap5",
    configPath: `${process.env.publicPath}js/share/songyangMap5.json`
  },
  songyangMap6: {
    name: "松阳民情地图6",
    value: "songyangMap6",
    open: true,
    hasDrawer: true,
    hasCommonHeader: true,
    cdir: "songyangMap6",
    configPath: `${process.env.publicPath}js/share/songyangMap6.json`
  },
  songyangMap7: {
    name: "松阳民情地图7",
    value: "songyangMap7",
    open: true,
    hasDrawer: true,
    hasCommonHeader: true,
    cdir: "songyangMap7",
    configPath: `${process.env.publicPath}js/share/songyangMap7.json`
  },
  songyangMap8: {
    name: "松阳民情地图8",
    value: "songyangMap8",
    open: true,
    hasDrawer: true,
    hasCommonHeader: true,
    cdir: "songyangMap8",
    configPath: `${process.env.publicPath}js/share/songyangMap8.json`
  },
  songyangMap9: {
    name: "松阳民情地图9",
    value: "songyangMap9",
    open: true,
    hasDrawer: true,
    hasCommonHeader: true,
    cdir: "songyangMap9",
    configPath: `${process.env.publicPath}js/share/songyangMap9.json`
  },
  songyangMap10: {
    name: "松阳民情地图10",
    value: "songyangMap10",
    open: true,
    hasDrawer: true,
    hasCommonHeader: true,
    cdir: "songyangMap10",
    configPath: `${process.env.publicPath}js/share/songyangMap10.json`
  },
  songyangMap11: {
    name: "松阳民情地图11",
    value: "songyangMap11",
    open: true,
    hasDrawer: true,
    hasCommonHeader: true,
    cdir: "songyangMap11",
    configPath: `${process.env.publicPath}js/share/songyangMap11.json`
  },
  songyangMap12: {
    name: "松阳民情地图12",
    value: "songyangMap12",
    open: true,
    hasDrawer: true,
    hasCommonHeader: true,
    cdir: "songyangMap12",
    configPath: `${process.env.publicPath}js/share/songyangMap12.json`
  },
  lianDuPolice: {
    name: "莲都区公安(警情监控)",
    value: "lianDuPolice",
    open: true,
    hasDrawer: true,
    hasCommonHeader: true,
    cdir: "lianDuPolice",
    configPath: `${process.env.publicPath}js/share/lianDuPolice.json`
  },
  lianDuPolice2: {
    name: "莲都区公安(基础集控)",
    value: "lianDuPolice2",
    open: true,
    hasDrawer: true,
    hasCommonHeader: true,
    cdir: "lianDuPolice2",
    configPath: `${process.env.publicPath}js/share/lianDuPolice2.json`
  },
  lianDuPolice3: {
    name: "莲都区公安(多维管控)",
    value: "lianDuPolice3",
    open: true,
    hasDrawer: true,
    hasCommonHeader: true,
    cdir: "lianDuPolice3",
    configPath: `${process.env.publicPath}js/share/lianDuPolice3.json`
  },
  lianDuPolice4: {
    name: "莲都区公安(联动作战)",
    value: "lianDuPolice4",
    open: true,
    hasDrawer: true,
    hasCommonHeader: true,
    cdir: "lianDuPolice4",
    configPath: `${process.env.publicPath}js/share/lianDuPolice4.json`
  },
  jhDiseases: {
    name: "金华市园林病虫害防治管理平台",
    value: "jhDiseases",
    open: true,
    hasDrawer: true,
    hasCommonHeader: true,
    cdir: "jhDiseases",
    configPath: `${process.env.publicPath}js/share/jhDiseases.json`
  },

  // zhongtai: {
  //   name: "中泰街道",
  //   value: "zhongtai",
  //   open: true,
  //   hasDrawer: true,
  //   hasCommonHeader: false
  // }
  // building: {
  //   name: "建筑智慧运维",
  //   value: "building",
  //   open: false,
  //   hasDrawer: true
  // },
};

export const surveyItems = {
  columns: {
    index: "序号",
    stage: "阶段",
    major: "专业",
    node: "设备编号",
    addr: "位置",
    monitor: "类别",
    type: "类型",
    unit: "单位"
  },
  monitors: {
    q: {
      value: "水质",
      addr: {
        "15": "希望桥",
        "16": "紫云路"
      },
      type: [
        { value: "D101", name: "PH", unit: "" },
        { value: "D102", name: "电导率", unit: "mg/L" },
        { value: "D103", name: "水湿", unit: "mg/L" },
        { value: "D104", name: "溶解氧", unit: "mg/L" },
        { value: "D105", name: "浊度", unit: "mg/L" },
        { value: "D106", name: "氨氮", unit: "mg/L" },
        { value: "D107", name: "高锰酸钾", unit: "mg/L" },
        { value: "D108", name: "总磷", unit: "mg/L" },
        { value: "D109", name: "总氮", unit: "mg/L" }
      ]
      // type: {
      //   D101: { name: "PH", unit: "" },
      //   D102: { name: "电导率", unit: "mg/L" },
      //   D103: { name: "水湿", unit: "mg/L" },
      //   D104: { name: "溶解氧", unit: "mg/L" },
      //   D105: { name: "浊度", unit: "mg/L" },
      //   D106: { name: "氨氮", unit: "mg/L" },
      //   D107: { name: "高锰酸钾", unit: "mg/L" },
      //   D108: { name: "总磷", unit: "mg/L" },
      //   D109: { name: "总氮", unit: "mg/L" }
      // }
    },
    s: {
      value: "水位",
      addr: {
        "1": "湿地",
        "2": "紫云路",
        "3": "希望桥"
      },
      type: [{ value: "D101", name: "水位", unit: "cm" }]
    },
    m: {
      value: "气象",
      addr: {
        "1": "湿地",
        "2": "紫云路",
        "3": "希望桥"
      },
      type: [
        { value: "D101", name: "风向", unit: "°" },
        { value: "D102", name: "风速", unit: "m/s" },
        { value: "D103", name: "温度", unit: "℃" },
        { value: "D104", name: "湿度", unit: "%" },
        { value: "D105", name: "气压", unit: "百帕" },
        { value: "D106", name: "降雨量", unit: "mm/h" }
      ]
    }
  }
};

export const ldMenus = [
  {
    text: "盗窃",
    value: 1,
    name: "icondaoqieicon2",
  },
  {
    text: "电诈",
    value: 2,
    name: "icondianzhaicon2"
  },
  {
    text: "伤害",
    value: 3,
    name: "iconshanghaiicon2"
  },
  {
    text: "涉赌",
    value: 4,
    name: "iconsheduicon2"
  },
  {
    text: "涉黄",
    value: 5,
    name: "iconshehuangicon2"
  },
  {
    text: "矛盾纠纷",
    value: 6,
    name: "iconmaodunjiufenicon2"
  },
];
export const daMenus = [
  {
    "id": 1,
    "name": "重点人员",
    "subTypes": [
      {
        "id": 5,
        "name": "精神障碍患者",
        "subTypes": [],
        "hasData": false,
        "isClick": true
      },
      {
        "id": 8,
        "name": "涉稳人员",
        "subTypes": [],
        "hasData": false,
        "isClick": true
      },
      {
        "id": 98,
        "name": "涉恐人员",
        "subTypes": [],
        "hasData": false,
        "isClick": false
      },
      {
        "id": 99,
        "name": "剥政对象",
        "subTypes": [],
        "hasData": false,
        "isClick": false
      },
      {
        "id": 100,
        "name": "在莲都外国人",
        "subTypes": [],
        "hasData": false,
        "isClick": false
      }
    ],
    "hasData": true
  },
  {
    "id": 2,
    "name": "场所管理",
    "subTypes": [
      {
        "id": 9,
        "name": "旅馆业（民宿）",
        "subTypes": [],
        "hasData": true,
        "isClick": true
      },
      {
        "id": 10,
        "name": "娱乐场所",
        "subTypes": [],
        "hasData": true,
        "isClick": true
      },
      {
        "id": 11,
        "name": "网吧",
        "subTypes": [],
        "hasData": true,
        "isClick": true
      },
      {
        "id": 101,
        "name": "印章刻制业",
        "subTypes": [],
        "hasData": true,
        "isClick": false
      },
      {
        "id": 102,
        "name": "典当业",
        "subTypes": [],
        "hasData": true,
        "isClick": false
      },
      {
        "id": 103,
        "name": "宗教活动场所",
        "subTypes": [],
        "hasData": true,
        "isClick": false
      },
    ],
    "hasData": true
  },
  {
    "id": 3,
    "name": "行业管理",
    "subTypes": [
      {
        "id": 12,
        "name": "寄递物流业",
        "subTypes": [],
        "hasData": true,
        "isClick": true
      },
      {
        "id": 13,
        "name": "防范恐怖袭击重点目标",
        "subTypes": [],
        "hasData": true,
        "isClick": true
      },
      {
        "id": 14,
        "name": "治安重点单位",
        "subTypes": [],
        "hasData": true,
        "isClick": true
      },
      {
        "id": 104,
        "name": "保安业",
        "subTypes": [],
        "hasData": true,
        "isClick": false
      },
      {
        "id": 105,
        "name": "汽车租赁业",
        "subTypes": [],
        "hasData": true,
        "isClick": false
      },
      {
        "id": 106,
        "name": "金银首饰营业场所",
        "subTypes": [],
        "hasData": true,
        "isClick": false
      },
      {
        "id": 107,
        "name": "废旧金属收购业",
        "subTypes": [],
        "hasData": true,
        "isClick": false
      },
    ],
    "hasData": true
  },
  {
    "id": 4,
    "name": "物品管理",
    "subTypes": [
      {
        "id": 15,
        "name": "危险化学品",
        "subTypes": [],
        "hasData": true,
        "isClick": true
      },
      {
        "id": 16,
        "name": "民用爆炸物品",
        "subTypes": [],
        "hasData": true,
        "isClick": true
      },
      {
        "id": 18,
        "name": "易制毒化学品",
        "subTypes": [],
        "hasData": true,
        "isClick": true
      },
      {
        "id": 108,
        "name": "民用枪支",
        "subTypes": [],
        "hasData": true,
        "isClick": false
      },
      {
        "id": 109,
        "name": "涉恐敏感物资",
        "subTypes": [],
        "hasData": true,
        "isClick": false
      },
      {
        "id": 110,
        "name": '"低慢小"目标',
        "subTypes": [],
        "hasData": true,
        "isClick": false
      },
    ],
    "hasData": true
  }
];
export const ftMenus = [
  { text: "视频点位", value: 1 },
  { text: "人像点位", value: 2 },
];

export const ldzzMenus = [
  { text: "公安力量", value: 1 },
  { text: "政府力量", value: 2 },
  { text: "社会力量", value: 3 },
]
