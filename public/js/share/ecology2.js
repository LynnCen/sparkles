let date = new Date().toLocaleDateString();
export const config = {
  title: "桐乡农创园5G生态环境监测云系统",
  enTitle: "LISHUI MOBILE 5G ECOLOGICAL ENVIRONMENT MONITORING PLATFORM",
  routes: [],
  atmosphere: {
    title: "大气生态数据",
    enTitle: "Atmospheric Ecology Data",
    suffix: { name: "监测点位", value: 34, unit: "个" },
    data: [
      {
        name: "温度（℃）",
        value: 26,
        avatar: "./images/ecology2/icon_wendu.png"
      },
      {
        name: "湿度RH",
        value: 30,
        avatar: "./images/ecology2/icon_shidu.png"
      },
      {
        name: "AQI",
        value: "32优",
        avatar: "./images/ecology2/icon_kongqizhiyiban.png"
      },
      {
        name: "PM2.5",
        value: "23",
        avatar: "./images/ecology2/icon_pm25.png"
      },
      {
        name: "风向风力",
        value: "3-4级",
        avatar: "./images/ecology2/iconfengxiang.png"
      }
    ]
  },
  runTargets: [
    [
      {
        type: "监控",
        item: "工作",
        count: 10
      },
      { type: "监控", item: "关闭", count: 1 },
      { type: "监控", item: "故障", count: 0 },
      { type: "监控", item: "离网", count: 2 },

      {
        type: "曝气机",
        item: "工作",
        count: 15
      },
      { type: "曝气机", item: "关闭", count: 3 },
      { type: "曝气机", item: "故障", count: 1 },
      { type: "曝气机", item: "离网", count: 2 }
    ],
    [
      { type: "推流器", item: "工作", count: 4 },
      { type: "推流器", item: "关闭", count: 18 },
      { type: "推流器", item: "故障", count: 0 },
      { type: "推流器", item: "离网", count: 18 },
      { type: "自动监测站", item: "工作", count: 10 },
      { type: "自动监测站", item: "关闭", count: 2 },
      { type: "自动监测站", item: "故障", count: 2 },
      { type: "自动监测站", item: "离网", count: 2 }
    ]
  ],
  energyConsumption: {
    title: "当前能耗情况",
    data: [
      {
        type: "负荷余量",
        x: "用水",
        value: 23,
        limit: [0, 100]
      },
      {
        type: "负荷余量",
        x: "用电",
        value: 52,
        limit: [0, 100]
      },
      {
        type: "负荷余量",
        x: "网络",
        value: 9,
        limit: [0, 100]
      },
      {
        type: "目前负荷",
        x: "用水",
        value: 77,
        limit: [0, 100]
      },
      {
        type: "目前负荷",
        x: "用电",
        value: 48,
        limit: [0, 100]
      },
      {
        type: "目前负荷",
        x: "网络",
        value: 90,
        limit: [0, 100]
      }
    ]
  },
  sewage: {
    title: "水环境监测数据",
    enTitle: "Monitoring data of sewage discharge",
    suffix: { name: "监测点位", value: 104, unit: "个" },
    data: [
      {
        name: "工业排污",
        value: 424,
        icon: "./images/ecology2/icon_gongyepaiwu.png"
      },
      {
        name: "农业排污",
        value: 218,
        icon: "./images/ecology2/icon_nongyepaiwu.png"
      },
      {
        name: "农业排污",
        value: 662,
        icon: "./images/ecology2/icon_shenghuopaiwu.png"
      }
    ]
  },
  conservancy: {
    title: "水利监测数据",
    enTitle: "Water Conservancy Monitoring Data",
    suffix: { name: "监测点位", value: 52, unit: "个" },
    data: [
      [
        {
          type: "水质监测",
          item: "I类水",
          count: 2
        },
        { type: "水质监测", item: "II类水", count: 6 },
        { type: "水质监测", item: "III类水", count: 8 }
      ],
      [
        { type: "水利监测", item: "饮用水", count: 13 },
        {
          type: "水利监测",
          item: "生态水流",
          count: 8
        },
        { type: "水利监测", item: "河道", count: 6 }
      ]
    ]
  },
  monitors: {
    title: "实时视频监控",
    enTitle: "Real-time video surveillance",
    icon: "./images/ecology2/icon_jiankong.png",
    data: [
      [
        {
          code: "KTU-101",
          thumbnail: "./images/ecology2/tongxiang1.png",
          name: date,
          url:
            "rtsp://218.205.127.16:554/pag://218.205.127.178:7302:33112300001310015252:0:MAIN:TCP?streamform=rtp&idinfo=EBACAAAQAAAeuyFMCCusutO%2Fi3xSt%2F4KHwfxXUySUTdPZcDjzjpg2fvls5LHaA8DPA%2BaoGVjPuQ6PuikMtyqT6ZuDi%2BDmv6q&checkinfo=eyJ0aW1lIjoiMjAxOTEwMTZUMTc0NzI2WiIsInVybCI6InJ0c3A6Ly8yMTguMjA1LjEyNy4xNjo1NTQvcGFnOi8vMjE4LjIwNS4xMjcuMTc4OjczMDI6MzMxMTIzMDAwMDEzMTAwMTUyNTI6MDpNQUlOOlRDUD9zdHJlYW1mb3JtPXJ0cCJ9"
        },
        {
          code: "KTU-102",
          thumbnail: "./images/ecology2/tongxiang2.png",
          name: date,
          url:
            "rtsp://218.205.127.16:554/pag://218.205.127.179:7302:33112300001310021896:0:SUB:TCP?streamform=rtp&idinfo=EBACAAAQAACYeLF8Nt7YBhq8hut3ccnrnFdb9nDu%2B0yHzonxnWvKLAkG7OVlI11l7TyU%2BgCyBez3W05oYp4jUOGJvWSQhukV&checkinfo=eyJ0aW1lIjoiMjAxOTEwMTZUMTc1NDExWiIsInVybCI6InJ0c3A6Ly8yMTguMjA1LjEyNy4xNjo1NTQvcGFnOi8vMjE4LjIwNS4xMjcuMTc5OjczMDI6MzMxMTIzMDAwMDEzMTAwMjE4OTY6MDpTVUI6VENQP3N0cmVhbWZvcm09cnRwIn0%3D"
        }
      ],
      [
        {
          code: "KTU-201",
          thumbnail: "./images/ecology2/tongxiang3.png",
          name: date,
          url:
            "rtsp://218.205.127.16:554/pag://218.205.127.179:7302:33110200001310010922:0:SUB:TCP?streamform=rtp&idinfo=EBACAAAQAADKUDl8VFbEsUOjTozqkr3tyhjCYoa1TMfumopIDskNydg8nTozmJR9wohvBsEwL6NKbALfGGSQq%2B2XqHHTnMEy&checkinfo=eyJ0aW1lIjoiMjAxOTEwMTZUMTc1NjQyWiIsInVybCI6InJ0c3A6Ly8yMTguMjA1LjEyNy4xNjo1NTQvcGFnOi8vMjE4LjIwNS4xMjcuMTc5OjczMDI6MzMxMTAyMDAwMDEzMTAwMTA5MjI6MDpTVUI6VENQP3N0cmVhbWZvcm09cnRwIn0%3D"
        },
        {
          code: "KTU-202",
          thumbnail: "./images/ecology2/tongxiang4.png",
          name: date,
          url:
            "rtsp://218.205.127.16:554/pag://218.205.127.178:7302:33110200001310014792:0:SUB:TCP?streamform=rtp&idinfo=EBACAAAQAADIUCtzJDlT33lxX7cB%2BeVt4U3neJBPJB1U2MBEcRHKvG27jVdU45%2BX3eZsNtuZVx7P%2F0%2BUwdxtyQmtQEUAbGkX&checkinfo=eyJ0aW1lIjoiMjAxOTEwMTZUMTc1ODIxWiIsInVybCI6InJ0c3A6Ly8yMTguMjA1LjEyNy4xNjo1NTQvcGFnOi8vMjE4LjIwNS4xMjcuMTc4OjczMDI6MzMxMTAyMDAwMDEzMTAwMTQ3OTI6MDpTVUI6VENQP3N0cmVhbWZvcm09cnRwIn0%3D"
        }
      ],
      [
        {
          code: "KTU-301",
          thumbnail: "./images/ecology2/tongxiang5.png",
          name: date
        },
        {
          code: "KTU-302",
          thumbnail: "./images/ecology2/tongxiang6.png",
          name: date
        }
      ]
    ]
  },
  chart: {
    theme: {
      defaultColor: "#ccc",
      colors: [
        "#00baff",
        "#02ce7f",
        "#f5f4d6f0",
        "#223273",
        "#8543E0",
        "#13C2C2",
        "#3436C7",
        "#F04864"
      ],
      axis: {
        left: {
          label: {
            // offset: 12,
            // autoRotate: true,
            textStyle: {
              fill: "#ccc",
              fontSize: 14
            }
          },
          grid: {
            lineStyle: {
              stroke: "rgba(255,255,255,0.3)",
              lineWidth: 1,
              lineDash: [2, 2]
            },
            hideFirstLine: false
          }
        },
        bottom: {
          position: "bottom",
          title: null,
          label: {
            offset: 22,
            autoRotate: true,
            textStyle: {
              fill: "rgba(255,255,255,0.8)",
              fontSize: 14,
              lineHeight: 20
            }
          },
          line: {
            lineWidth: 0
          },
          tickLine: {
            lineWidth: 0
          }
        }
      },
      legend: {
        bottom: {
          itemGap: 24,
          width: 156,
          height: 16,
          textStyle: {
            fill: "rgba(204,204,204,0.8)",
            fontSize: 14,
            lineHeight: 20
          }
        }
      }
    }
  }
};
