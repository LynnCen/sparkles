const _config = (monitors = ["龙泉宝溪乡", "紫金大桥"]) => ({
  title: "大气生态",
  enTitle: "",
  leftMenu: [
    {
      name: "今日温度（℃）",
      icon: "./images/ecology/icon_wendu.png",
      value: "12℃-23℃",
      unit: ""
    },
    {
      name: "相对湿度（RH）",
      icon: "./images/ecology/icon_shidu.png",
      value: "76%",
      unit: ""
    },
    {
      name: "风力风向",
      icon: "./images/ecology/icon_fengxiang.png",
      value: "1-2",
      unit: "级 东风"
    },
    {
      name: "空气质量（AQI）",
      icon: "./images/ecology/icon_kongqizhiyiban.png",
      value: "45",
      unit: "",
      quality: "优"
    },
    {
      name: "细颗粒物（PM2.5）",
      icon: "./images/ecology/icon_pm25.png",
      value: "23",
      unit: "μg/m3"
    },
    {
      name: "臭氧（O3）",
      icon: "./images/ecology/icon_o3.png",
      value: "106",
      unit: "μg/m3"
    }
    // {
    //   name: "预警信息（个）",
    //   icon: "./images/ecology/icon_gaojing.png",
    //   value: "1",
    //   unit: ""
    // }
  ],
  sewage: {
    title: "大气生态监测点位",
    enTitle: "Atmospheric ecological monitoring site",
    suffix: { name: "监测点位", value: 34, unit: "个" }
  },
  monitors: [
    {
      title: "景区监测点",
      data: [
        {
          code: "33118100001310012396",
          thumbnail: "./images/ecology/dizhai031.png",
          name: monitors[0],
          url:
            "rtsp://218.205.127.16:554/pag://218.205.127.179:7302:33112300001310216233:0:SUB:TCP?streamform=rtp&idinfo=EBACAAAQAABFDubO7bdaOvraN6ZEHEI57niFj3%2FPtHYqUdfqpkafoXzg50YukOZDcxeytvgzwv3eFiLv6dcLHwz0ENuhKt6G&checkinfo=eyJ0aW1lIjoiMjAxOTEwMTZUMTAzMjMxWiIsInVybCI6InJ0c3A6Ly8yMTguMjA1LjEyNy4xNjo1NTQvcGFnOi8vMjE4LjIwNS4xMjcuMTc5OjczMDI6MzMxMTIzMDAwMDEzMTAyMTYyMzM6MDpTVUI6VENQP3N0cmVhbWZvcm09cnRwIn0%3D"
        },
        {
          code: "33110200001310019449",
          thumbnail: "./images/ecology/shuili01.png",
          name: monitors[1],
          url:
            "rtsp://218.205.127.16:554/pag://218.205.127.178:7302:33112300001310016295:0:SUB:TCP?streamform=rtp&idinfo=EBACAAAQAABicZumxpxiRisimYydsEo%2Bg6Z1f1zI%2Flq7O6eVVEitdCDH3xzeX%2BqbDx%2BgfjS%2FB5RqMO2Whyzwa6gL5E8%2BasyN&checkinfo=eyJ0aW1lIjoiMjAxOTEwMTZUMTc0NTA1WiIsInVybCI6InJ0c3A6Ly8yMTguMjA1LjEyNy4xNjo1NTQvcGFnOi8vMjE4LjIwNS4xMjcuMTc4OjczMDI6MzMxMTIzMDAwMDEzMTAwMTYyOTU6MDpTVUI6VENQP3N0cmVhbWZvcm09cnRwIn0%3D"
        }
      ]
    },
    {
      title: "其他监测点",
      data: []
    }
  ]
});
export const config = _config();
export const zhongtai = _config(["中泰中心幼儿园", "中泰清水湾幼儿园"]);
export const name = "atmosphere";
