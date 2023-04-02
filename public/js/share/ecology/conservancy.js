const _config = (monitors = ["莲都区紫金大桥水文站1", "莲都区紫金大桥水文站2"]) => ({
  overview: [
    {
      title: "水质级别监测点",
      data: [
        {
          name: "I类水质监测点（个）",
          value: 2,
          icon: "./images/ecology/icon-humidity.png"
        },
        {
          name: "II类水质监测点（个）",
          value: 6,
          icon: "./images/ecology/icon-humidity.png"
        },
        {
          name: "III类水质监测点（个）",
          value: 8,
          icon: "./images/ecology/icon-humidity.png"
        }
      ]
    },
    {
      title: "水质分类监测点",
      data: [
        {
          name: "饮用水监测点（个）",
          value: 16,
          icon: "./images/ecology/icon-humidity.png"
        },
        {
          name: "河道监测点（个）",
          value: 132,
          icon: "./images/ecology/icon_hedao.png"
        },
        {
          name: "山塘水库监测点（个）",
          value: 246,
          icon: "./images/ecology/icon_shantanshuiku.png"
        },
        {
          name: "生态水流监测点（个）",
          value: 104,
          icon: "./images/ecology/icon_shengtaishuiliu.png"
        }
      ]
    }
  ],
  sewage: {
    title: "水利监测点位",
    enTitle: "Water Conservancy Monitoring Points",
    suffix: { name: "监测点位", value: 496, unit: "个" }
  },
  monitors: [
    {
      title: "饮用水/河道",
      data: [
        {
          code: "33110200001310019498",
          thumbnail: "./images/ecology/shuili01.png",
          name: monitors[0],
          url:
            "rtsp://218.205.127.16:554/pag://218.205.127.179:7302:33112300001310216233:0:SUB:TCP?streamform=rtp&idinfo=EBACAAAQAABFDubO7bdaOvraN6ZEHEI57niFj3%2FPtHYqUdfqpkafoXzg50YukOZDcxeytvgzwv3eFiLv6dcLHwz0ENuhKt6G&checkinfo=eyJ0aW1lIjoiMjAxOTEwMTZUMTAzMjMxWiIsInVybCI6InJ0c3A6Ly8yMTguMjA1LjEyNy4xNjo1NTQvcGFnOi8vMjE4LjIwNS4xMjcuMTc5OjczMDI6MzMxMTIzMDAwMDEzMTAyMTYyMzM6MDpTVUI6VENQP3N0cmVhbWZvcm09cnRwIn0%3D"
        },
        {
          code: "33110200001310019449",
          thumbnail: "./images/ecology/shuili012.png",
          name: monitors[1],
          url:
            "rtsp://218.205.127.16:554/pag://218.205.127.179:7302:33112300001310216233:0:SUB:TCP?streamform=rtp&idinfo=EBACAAAQAABFDubO7bdaOvraN6ZEHEI57niFj3%2FPtHYqUdfqpkafoXzg50YukOZDcxeytvgzwv3eFiLv6dcLHwz0ENuhKt6G&checkinfo=eyJ0aW1lIjoiMjAxOTEwMTZUMTAzMjMxWiIsInVybCI6InJ0c3A6Ly8yMTguMjA1LjEyNy4xNjo1NTQvcGFnOi8vMjE4LjIwNS4xMjcuMTc5OjczMDI6MzMxMTIzMDAwMDEzMTAyMTYyMzM6MDpTVUI6VENQP3N0cmVhbWZvcm09cnRwIn0%3D"
        }
      ]
    },
    {
      title: "山塘水库/生态水流",
      data: []
    }
  ]
});
export const config = _config();
export const zhongtai = _config(["蒋家谭港（中泰段）", "直路溪（中泰）"]);
export const name = "conservancy";
