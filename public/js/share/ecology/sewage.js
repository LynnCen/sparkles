const _config = (monitors = ["缙云县健顺排污口"]) => ({
  overview: [
    {
      name: "工业排污监测点（个）",
      value: 424,
      icon: "./images/ecology/icon_gongyepaiwu.png"
    },
    {
      name: "农业排污监测点（个）",
      value: 218,
      icon: "./images/ecology/icon_nongyepaiwu.png"
    },
    {
      name: "生活排污监测点（个）",
      value: 662,
      icon: "./images/ecology/icon_shenghuopaiwu.png"
    },
    {
      name: "在线监测点（个）",
      value: 132,
      icon: "./images/ecology/icon_zaixianjiance.png"
    },
    {
      name: "视频监控点（个）",
      value: 104,
      icon: "./images/ecology/icon_shipingjiankong.png"
    },
    {
      name: "预警信息（个）",
      value: 0,
      icon: "./images/ecology/icon_gaojing1.png"
    }
  ],
  sewage: {
    title: "排污监测点位",
    enTitle: "Sewage monitoring point",
    suffix: { name: "监测点位", value: 15, unit: "个" }
  },
  monitors: [
    {
      title: "工业排污",
      data: [
        {
          code: "33112200001310062424",
          thumbnail: "./images/ecology/paiwu01.png",
          name: monitors[0],
          url:
            "rtsp://218.205.127.16:554/pag://218.205.127.179:7302:33112300001310216233:0:SUB:TCP?streamform=rtp&idinfo=EBACAAAQAABFDubO7bdaOvraN6ZEHEI57niFj3%2FPtHYqUdfqpkafoXzg50YukOZDcxeytvgzwv3eFiLv6dcLHwz0ENuhKt6G&checkinfo=eyJ0aW1lIjoiMjAxOTEwMTZUMTAzMjMxWiIsInVybCI6InJ0c3A6Ly8yMTguMjA1LjEyNy4xNjo1NTQvcGFnOi8vMjE4LjIwNS4xMjcuMTc5OjczMDI6MzMxMTIzMDAwMDEzMTAyMTYyMzM6MDpTVUI6VENQP3N0cmVhbWZvcm09cnRwIn0%3D"
        }
      ]
    },
    {
      title: "农业排污",
      data: []
    },
    {
      title: "生活排污",
      data: [],
      points: []
    }
  ]
});
export const config = _config();
export const zhongtai = _config(["中泰街道紫荆村村委"]);
export const name = "sewage";
