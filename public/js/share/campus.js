export const config = {
  title: "智慧校园",
  enTitle: "SMART CAMPUS MANAGEMENT PLATFORM",
  overview: {
    title: "学校概况",
    enTitle: "Real-time video surveillance",
    stuTeaUrl: ["/Student/getViewstudentclassCount", "/Student/getCountViewlszxteacher"],
    modal: {
      title: "教学监管",
      url: ["/HomePage/getAllValue", "/HomePage/setValueForHome"],
      rows: [
        {
          label: "网阅",
          key: "networkRead"
        },
        {
          label: "阅卷",
          key: "markingCopies"
        },
        {
          label: "校本卷数",
          key: "schoolBased"
        },
        {
          label: "试题总量",
          key: "testNumber"
        }
      ]
    },
    data: [
      {
        value: ["网阅", "次"],
        name: ["阅卷", "份"],
        icon: "./images/lsms/icon_kaoshicishu.png"
      },
      {
        value: ["校本卷数", "套"],
        name: ["试题总量", "题"],
        icon: "./images/lsms/icon_ziyuan.png"
      },
      {
        value: 0,
        name: "学生人数",
        icon: "./images/lsms/icon_tiku.png"
      },
      {
        value: 0,
        icon: "./images/lsms/icon_ziyuanshiyong.png",
        name: "老师人数"
      }
    ]
  },
  netTeacher: {
    title: "网络巡课",
    enTitle: "Network class tour",
    href: `/monitorclass`
  },
  evaluation: {
    title: "学业评价",
    enTitle: "Academic evaluation",
    href: `/score`,
    // defaultValue: [2, 1],
    options: [
      {
        value: 1,
        label: "高一",
        children: new Array(18).fill(1).map((e, i) => ({
          value: e + i,
          label: e + i + "班"
        }))
      },
      {
        value: 2,
        label: "高二",
        children: new Array(18).fill(1).map((e, i) => ({
          value: e + i,
          label: e + i + "班"
        }))
      },
      {
        value: 3,
        label: "高三",
        children: new Array(18).fill(1).map((e, i) => ({
          value: e + i,
          label: e + i + "班"
        }))
      }
    ],
    levels: {
      unqualified: "不合格",
      qualified: "合格",
      secondary: "一般",
      good: "良好",
      excellment: "优秀"
    },
    theme: {
      defaultColor: "#fff",
      colors: [
        "#fd5f56",
        "#ffb747",
        "#28e1fd",
        "#0070ff",
        "#64c26b",
        "#13C2C2",
        "#3436C7",
        "#F04864"
      ],
      legend: {
        bottom: {
          itemGap: 10,
          width: 156,
          height: 12,
          textStyle: {
            fill: "rgba(255,255,255,0.8)",
            fontSize: 12,
            lineHeight: 12
          }
        }
      },
      axis: {
        left: {
          label: {
            // offset: 12,
            // autoRotate: true,
            textStyle: {
              fill: "#fff",
              fontSize: 14
            }
          },
          grid: {
            lineStyle: {
              stroke: "rgba(255,255,255,.6)",
              lineWidth: 1,
              lineDash: [2]
            },
            hideFirstLine: false
          }
        },
        bottom: {
          position: "bottom",
          title: null,
          label: {
            offset: 16,
            autoRotate: true,
            textStyle: {
              fill: "rgba(255,255,255,1)",
              fontSize: 14,
              lineHeight: 16
            }
          },
          line: {
            // lineWidth: 1
          },
          tickLine: {
            // lineWidth: 1
          }
        }
      }
    }
  },
  attendance: {
    title: "出勤概况",
    enTitle: "Attendance situation",
    day: "2019年8月23日",
    columns: {
      name: "姓名",
      studentCode: "学工号",
      sexName: "性别",
      dormPath: "楼栋宿舍"
    },
    urls: {
      stuSignProfile: "/dcms/ui/record/stuSignProfile",
      dormlist: "/dcms/ui/dorm/list?dormId=area000000",
      attendancePage: "/dcms/ui/record/attendancePage"
    },
    data: [
      // {
      //   name: "6:40前到校教师",
      //   value: 16,
      //   icon: "./images//lsms/icon_6-40.png"
      // },
      // {
      //   name: "未到校教师",
      //   value: 2,
      //   icon: "./images//lsms/icon_weidaoxiao.png"
      // },
      {
        name: "晚上下寝室教师",
        value: 50,
        icon: "./images/lsms/icon_xiaqinshi.png"
      },
      {
        name: "早上到教室学生",
        value: 1986,
        icon: "./images/lsms/icon_6-40.png"
      },
      {
        name: "晚上未到寝学生",
        value: 0,
        icon: "./images/lsms/icon_weidaoqin.png"
      }
    ]
    // data: [
    //   { name: "校领导", value: 0.92 },
    //   { name: "教师", value: 0.95 },
    //   { name: "学生", value: 0.92 },
    //   { name: "职工", value: 0.95 }
    // ]
  },
  consumption: {
    title: "校园消费",
    enTitle: "Campus consumption",
    day: "2019年8月23日",
    href: `/consumption`,
    data: [
      {
        type: "kitchen",
        name: "食堂消费",
        value: 0,
        icon: "./images/lsms/icon_shitang.png",
        change: 1
      },
      {
        type: "supermarket",
        name: "超市消费",
        value: 0,
        icon: "./images/lsms/icon_chaoshi.png",
        change: 1
      },
      {
        type: "other",
        name: "其他消费",
        value: 0,
        icon: "./images/lsms/icon_qita.png",
        change: 1
      }
    ]
  },
  moralEdu: {
    title: "德育评价",
    enTitle: "Moral Education Assessment",
    href: `/moral`
  }
};
