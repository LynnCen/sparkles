var txtYmax = $("#defaultYmax"),
  txtYmin = $("#defaultYmin"),
  txtintervalY = $("#defaultintervalY"),
  allFields = $([])
    .add(txtYmax)
    .add(txtYmin)
    .add(txtintervalY),
  tips = $(".validateTips");
//当前查询的数据类型
var currentDataType;
var myEChart;
////*************图标默认显示-30 和 30 的刻度，并且刻度为10mm 产品要求这样
////默认刻度
//var defaultYmax = 30;
//var defaultYmin = -30;
//var defaultintervalY = 10;

////*************图标默认显示 未设置值是自适应
var defaultYmax;
var defaultYmin;
var defaultintervalY;
//计算数据源最大值最小值
var maxY = 0;
var minY = 0;
if (
  defaultYmin != undefined &&
  defaultYmin != null &&
  defaultYmax != undefined &&
  defaultYmax != null
) {
  maxY = defaultYmax;
  minY = defaultYmin;
}

//滚轮放大缩小需要用到的数据结构
var range = new Object();
range.max = 0;
range.min = 0;
range.Ymax = 0;
range.Ymin = 0;
//**************************

//查询测值
function drawMonitorData(data) {
  if (eval(data.dataDt).length === 0) {
    showMsg(parent.lang.NoData);
    return;
  }
  //var chart = getChart();
  var series = [];
  currentDataType = data.dataDt[0]["datatype"];
  var id = data.dataDt[0]["id"];
  var t;
  var seriesData = "[";
  var deviceCount = 0;

  $.each(data.dataDt, function (i, d) {
    t = parseInt(d["t"]);
    //+ TIME_STAMP;
    if (d["id"] === id) {
      if (d["v"] !== null) {
        seriesData += "[" + t + "," + d["v"] + "],";
      }
    } else {
      series.push({
        name: id + "",
        lineWidth: 1,
        type: "line",
        data: eval(seriesData.substring(0, seriesData.length - 1) + "]")
      });
      //chart.addSeries({ name: id, lineWidth: 1, data: eval(seriesData.substring(0, seriesData.length - 1) + ']') });
      id = d["id"];
      deviceCount++;
      seriesData = "[";
      if (d["v"] !== null) {
        seriesData += "[" + t + "," + d["v"] + "],";
      }
    }
    //----------获取最大值 最小值-------2017-10-11-----------------
    if (d["v"] > maxY) {
      maxY = d["v"];
    }
    if (d["v"] < minY) {
      minY = d["v"];
    }
    //------------------2017-10-11-------------------------------
  });
  //-------------------------------获取数据中的最大值最小值-------------------------------
  //if (minY < defaultYmin) {
  //    minY = (Math.ceil((minY * -1) / 10) * 10) * -1;//-41 转为-50
  //}
  //else {
  //    minY = defaultYmin;//默认显示-30
  //}
  //if (maxY > defaultYmax) {
  //    maxY = Math.ceil((maxY) / 10) * 10;//51 转换为60
  //}
  //else {
  //    maxY = defaultYmax;//默认最大30
  //}
  if (
    defaultYmin != undefined &&
    defaultYmin != null &&
    defaultYmax != undefined &&
    defaultYmax != null
  ) {
    minY = defaultYmin;
    maxY = defaultYmax;
  }
  //记录最大最小值到range
  range["max"] = maxY;
  range["min"] = minY;
  series.push({
    name: id + "",
    lineWidth: 1,
    type: "line",
    data: eval(seriesData.substring(0, seriesData.length - 1) + "]")
  });
  //drawChartWithScale(series, maxY, minY, defaultintervalY, data.legend, data.warnsDt);
  drawBNWYChartWithScale(
    series,
    maxY,
    minY,
    defaultintervalY,
    data.legend,
    data.warnsDt
  );
  //drawChart(series);
}

//查询警戒线与测值
function doQuery() {
  clearEChartSeries();
  initEChartToolbox(parent.lang.Time, parent.lang.nbwy + "(mm)", "mm");
  //clearPlotLine();
  //yAxisMax = Number.MIN_VALUE;
  //yAxisMin = Number.MAX_VALUE;
  // if (!validateInput()) {
  //   return;
  // }
  var deviceName = encodeURI($("#input-device").val(), "utf-8");
  var dataType = $("#dropdown-datatype").val();
  var dataType2 = $("#dropdown-datatype2").val();
  var startDate = $("#input-startdate").val();
  var endDate = $("#input-enddate").val();
  //查询测值
  // var queryUrl =
  //   "../../Handler/Ajax.ashx?oper=getNBWYChartData&deviceName=" +
  //   deviceName +
  //   "&dataType=" +
  //   dataType +
  //   "&dataType2=" +
  //   dataType2 +
  //   "&startDate=" +
  //   startDate +
  //   "&endDate=" +
  //   endDate;
  let queryUrl =
    HOST + "/http://183.248.239.71:9050/Handler/Ajax.ashx?oper=getNBWYChartData&";
  if (!parent.iframeChartArgs) {
    let date = new Date();
    date.setTime(date.getTime() - 1000 * 60 * 60 * 24 * 7);
    const deviceName = window.top.chartPlace || "内部位移01"; //encodeURI($("#input-device").val(), "utf-8");
    const dataType = "v1"; //encodeURI($("#dropdown-datatype").val(), "utf-8");
    const dataType2 = "cc";
    const startDate = date.Format("yyyy-MM-dd"); //$("#input-startdate").val();
    const endDate = new Date().Format("yyyy-MM-dd"); //$("#input-enddate").val();
    queryUrl +=
      "deviceName=" +
      deviceName +
      "&dataType=" +
      dataType +
      "&dataType2=" +
      dataType2 +
      "&startDate=" +
      startDate +
      "&endDate=" +
      endDate;
  } else {
    const args = parent.iframeChartArgs;
    const queries = Object.keys(args).reduce((queries, key, i) => {
      queries += key + "=" + args[key];
      i < Object.keys(args).length - 1 && (queries += "&");
      return queries;
    }, "");
    queryUrl += queries;
  }
  callService(queryUrl, drawMonitorData);
  //切换显示legend 是否处于预警线
  var uniqueL = false;
  //var myEChart = getEChart();
  myEChart.on("legendselectchanged", function (params) {
    var count = 0;
    var legend = 999;
    var name;
    $.each(params.selected, function (i, val) {
      if (val === true) {
        count++;
        legend = i;
        name = params.name;
      }
    });
    if (count === 1) {
      uniqueL = true;
      var option = myEChart.getOption();
      ShowMarkLine(option.series, true, legend);
      myEChart.setOption(option, true);
    } else if (uniqueL) {
      uniqueL = false;
      var option = myEChart.getOption();
      ShowMarkLine(option.series, false);
      myEChart.setOption(option, true);
    }
  });
}

//图例点击事件，当只有一条线显示的时候，查询报警线
//function legendClick(e) {
//    var s = this.chart.series;
//    var num = 0;
//    var name;
//    for (var i = 0; i < s.length; i++) {
//        if (i === this.index) {
//            s[i].visible ? s[i].hide() : s[i].show();
//        }
//        if (s[i].visible) {
//            num++;
//            name = s[i].name;
//        }
//    }
//    if (num === 1) {
//        isWLShow = true;
//        var queryUrl = '../../Handler/Ajax.ashx?oper=getNBWYWarningLine&deviceInnerId=' + name + '&dataType=' + currentDataType;
//        queryWarningLine(queryUrl);
//    }
//    else {
//        isWLShow = false;
//    }

//    if (!isWLShow) {
//        this.chart.zoom();
//    }

//    clearPlotLine();
//    return false;
//}

//页面加载完成
$(function () {
  initInput();
  initEChartToolbox(parent.lang.Time, parent.lang.nbwy + "(mm)", "mm");
  //HideYDataZoom();
  //异步获取测点
  var initDeviceTreeUrl = "../../Handler/Ajax.ashx?oper=getNBWYDeviceTree";
  // callService(initDeviceTreeUrl, initDeviceTree);
  //获得Y轴参数
  var getYValueUrl = "../../Handler/Ajax.ashx?oper=getYValue&monitorType=nbwy";
  //$.ajaxSettings.async = false;//同步
  // callService(getYValueUrl, getYValue);
  var pVal = 0;
  var myEChart = getEChart();
  //滚轮缩放 页面加载完成时绑定事件 防止控件panel-chart还没有
  $("#panel-chart").on("mousewheel DOMMouseScroll", function (e) {
    e = e || window.event; //ie
    if (e.stopPropagation) e.stopPropagation();
    else e.cancelBubble = true; //ie
    if (e.preventDefault) e.preventDefault();
    else e.returnValue = false;
    var delta =
      (e.originalEvent.wheelDelta &&
        (e.originalEvent.wheelDelta > 0 ? 0.2 : -0.1)) || // chrome & ie
      (e.originalEvent.detail && (e.originalEvent.detail > 0 ? -0.1 : 0.2)); // firefox
    pVal += delta;
    if (pVal < -1) {
      pVal = -1;
    }
    range.Ymax =
      (range.max + range.min + (range.max - range.min) * (1 + pVal)) / 2;
    range.Ymin =
      (range.max + range.min - (range.max - range.min) * (1 + pVal)) / 2;
    //if (range.Ymax > defaultYmax)
    //{
    //    range.Ymax = defaultYmax;
    //}
    //if (range.Ymin < defaultYmin) {
    //    range.Ymin = defaultYmin;
    //}
    myEChart.setOption({
      yAxis: {
        max: Math.round(range.Ymax),
        min: Math.round(range.Ymin)
      }
    });
  });
  // setTimeout(function() {
  //   var deviceId = GetRequest("DeviceId");
  //   if (deviceId != "") {
  //     var zTree = $.fn.zTree.getZTreeObj("deviceTree");
  //     var nodes = zTree.getNodes();
  //     for (var i = 0; i < nodes.length; i++) {
  //       var praId = nodes[i].id;
  //       var buffer = praId + deviceId + "";
  //       var node = zTree.getNodeByParam("id", buffer);
  //       if (node != null) {
  //         zTree.selectNode(node, true); //将指定ID的节点选中
  //         zTree.setting.callback.onClick(null, zTree.setting.treeId, node); //调用事件
  //         doQuery();
  //         return;
  //       }
  //     }
  //   }
  // }, 500);
  doQuery();
});
//隐藏Y轴缩放条 实现滚轮缩放
function HideYDataZoom() {
  var chart = getEChart();
  chart.setOption({
    dataZoom: [
      {
        type: "slider",
        xAxisIndex: [0]
      },
      {
        type: "slider",
        yAxisIndex: [0],
        left: "91%",
        show: false
      }
    ]
  });
}

//使用ECharts
function initEChartToolbox(xTitle, yTitle, valueSuffix) {
  myEChart = echarts.init(document.getElementById("panel-chart"));
  var option = {
    // toolbox: {
    //   itemSize: 30,
    //   left: "90%",
    //   feature: {
    //     myTool1: {
    //       show: true,
    //       title: "设置Y轴参数",
    //       icon: "path://M 6 6.5 L 20 6.5 M 6 11.5 L 20 11.5 M 6 16.5 L 20 16.5",
    //       onclick: function() {
    //         $("#defaultYmax").val(defaultYmax);
    //         $("#defaultYmin").val(defaultYmin);
    //         $("#defaultintervalY").val(defaultintervalY);
    //         $("#dialog-form").dialog("open");
    //       }
    //     }
    //   }
    // },
    // toolbox: {
    //   feature: {
    //     saveAsImage: {}
    //   }
    // },
    dataZoom: [
      {
        type: "slider",
        xAxisIndex: [0],
        bottom: 15
      }
    ],
    xAxis: {
      type: "time",
      name: xTitle,
      nameLocation: "end",
      nameGap: 25,
      axisLabel: {
        formatter: function (value) {
          return dateFormatterdate(value);
        }
      }
    },
    yAxis: {
      name: yTitle
    },
    grid: {
      left: 80,
      right: 60,
      bottom: 70
    },
    tooltip: {
      trigger: "axis",
      formatter: function (a) {
        var relVal = "";
        for (i = 0; i < a.length; i++) {
          relVal += a[i].seriesName;
          relVal += "  ";
          relVal += dateFormatterdate(a[i].data[0]);
          relVal += " ";
          relVal += dateFormattertime(a[i].data[0]);
          relVal += "  ";
          relVal += a[i].data[1];
          relVal += valueSuffix;
          relVal += "<br/>";
        }
        return relVal;
      }
    },
    legend: {
      orient: "horizontal",
      align: "right",
      top: 0,
      borderWidth: 0,
      data: []
    },
    series: []
  };
  myEChart.clear();
  myEChart.setOption(option);
  window.addEventListener("resize", function () {
    myEChart.resize();
  });
}
// $("#dialog-form").dialog({
//   autoOpen: false,
//   minHeight: 300,
//   minWidth: 350,
//   Height: 300,
//   Width: 350,
//   maxHeight: 300,
//   maxWidth: 350,
//   modal: true,
//   buttons: {
//     保存: function() {
//       var bValid = true;

//       allFields.removeClass("ui-state-error");

//       bValid = bValid && checkLength(txtYmax, "defaultYmax", 1, 8);
//       bValid = bValid && checkLength(txtYmin, "defaultYmin", 1, 8);
//       bValid = bValid && checkLength(txtintervalY, "defaultintervalY", 1, 8);
//       bValid =
//         bValid &&
//         checkRegexp(
//           txtYmax,
//           /^-?[1-9]\d*\.\d*|-?0\.\d*[1-9]\d*|^-?[1-9]\d*|0$/i,
//           "最大值必须为数字！"
//         );
//       bValid =
//         bValid &&
//         checkRegexp(
//           txtYmin,
//           /^-?[1-9]\d*\.\d*|-?0\.\d*[1-9]\d*|^-?[1-9]\d*|0$/i,
//           "最小值必须为数字！"
//         );
//       bValid =
//         bValid &&
//         checkRegexp(
//           txtintervalY,
//           /^[1-9]\d*\.\d*|0\.\d*[1-9]\d*|^[1-9]\d*$/i,
//           "刻度必须为正数！"
//         );
//       if (bValid) {
//         var max = Number(txtYmax.val());
//         var min = Number(txtYmin.val());
//         var interval = Number(txtintervalY.val());
//         if (min > max) {
//           updateTips("最小值不得大于最大值！");
//           bValid = false;
//         }
//         if (max - min < interval) {
//           updateTips("刻度必须必须小于最大值与最小值的差！");
//           bValid = false;
//         }

//         if (bValid) {
//           defaultYmax = max;
//           defaultYmin = min;
//           defaultintervalY = interval;
//           var yValue = defaultYmax + "," + defaultYmin + "," + defaultintervalY;
//           //设置Y轴参数
//           var setYValueUrl =
//             "../../Handler/Ajax.ashx?oper=setYValue&monitorType=nbwy&value=" +
//             yValue;
//           callService(setYValueUrl, setYValue);
//           $(this).dialog("close");
//         }
//       }
//     }
//   },
//   close: function() {
//     allFields.val("").removeClass("ui-state-error");
//   }
// });
function checkRegexp(o, regexp, n) {
  if (!regexp.test(o.val())) {
    o.addClass("ui-state-error");
    updateTips(n);
    return false;
  } else {
    return true;
  }
}
function checkLength(o, n, min, max) {
  if (o.val().length > max || o.val().length < min) {
    o.addClass("ui-state-error");
    updateTips("" + n + " 的长度必须在 " + min + " 和 " + max + " 之间。");
    return false;
  } else {
    return true;
  }
}
function updateTips(t) {
  tips.text(t).addClass("ui-state-highlight");
  setTimeout(function () {
    tips.removeClass("ui-state-highlight", 1500);
    tips.text("");
  }, 1500);
}

//画图echarts 可以设置刻度
//series 数据
//maxY 最大刻度
//minY 最小刻度
//intervalY 刻度单位值
function drawBNWYChartWithScale(
  series,
  maxY,
  minY,
  intervalY,
  legendData,
  warns
) {
  var chart = getEChart();
  var option = {
    title: chart.getOption().title,
    tooltip: chart.getOption().tooltip,
    xAxis: {
      nameLocation: "end",
      axisLine: { onZero: false } //x轴为0 表示时间和位移有冲突。此处认为y周表示位移,x轴时间显示在下边
    },
    yAxis: [
      {
        max: maxY,
        min: minY,
        interval: intervalY,
        // splitNumber:10,
        axisLabel: {
          //格式化刻度，加上"mm"单位
          formatter: function (value) {
            return value + "mm";
          }
        },
        splitLine: {
          lineStyle: {
            color: [
              "#ccc",
              "#fff",
              "#fff",
              "#fff",
              "#fff",
              "#fff",
              "#fff",
              "#fff",
              "#fff",
              "#fff"
            ]
          }
        }
      }
    ],
    legend: {
      orient: "horizontal",
      align: "right",
      top: "top",
      borderWidth: 0,
      data: legendData
    },
    series: series
  };
  if (legendData && legendData.length == 1) {
    SetMarkLine(warns, option, true);
  } else {
    SetMarkLine(warns, option, false);
  }
  chart.setOption(option);
}

function getYValue(data) {
  if (data == null || data.length === 0) {
    return;
  }
  var yValue = data.split(",");
  if (yValue.length == 3) {
    defaultYmax = Number(yValue[0]);
    defaultYmin = Number(yValue[1]);
    defaultintervalY = Number(yValue[2]);
  }
  // $.ajaxSettings.async = true;//恢复为异步不影响其他方法执行
}
function setYValue(data) {
  doQuery();
}
