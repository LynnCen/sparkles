//当前测点Id号，绘制警戒线用
var currentDeviceId;

//监测类型
var monitorType;
//当前语言环境
var lang_cur = "zh-cn";

//*************图标默认显示-30 和 30 的刻度，并且刻度为10mm 产品要求这样
//默认刻度
var defaultYmax = 30;
var defaultYmin = -30;
var defaultintervalY = 10;
//滚轮放大缩小需要用到的数据结构
var range = new Object();
range.max = 0;
range.min = 0;
range.Ymax = 0;
range.Ymin = 0;
//**************************

//检查是否绘制警戒线，二维位移长度和三维位移长度不绘制
function checkIsDrawLine(name) {
  return name.indexOf("D") < 0;
}

//查询测值
function drawMonitorData(data) {
  if (eval(data.dataDt).length === 0) {
    showMsg(parent.lang.NoData);
    return;
  }
  currentDeviceId = data.dataDt[0]["id"];
  var seriesX = "[";
  var seriesY = "[";
  var seriesH = "[";
  var seriesD2 = "[";
  var seriesD3 = "[";
  var t;
  //计算数据源最大值最小值
  var maxY = Number.MIN_VALUE;
  var minY = Number.MAX_VALUE;
  $.each(data.dataDt, function (i, d) {
    t = parseInt(d["t"]);
    if (d["x"] !== null) {
      seriesX += "[" + t + "," + d["x"] + "],";
    }
    if (d["y"] !== null) {
      seriesY += "[" + t + "," + d["y"] + "],";
    }
    if (d["h"] !== null) {
      seriesH += "[" + t + "," + d["h"] + "],";
    }
    if (d["d2"] !== null) {
      seriesD2 += "[" + t + "," + d["d2"] + "],";
    }
    if (d["d3"] !== null) {
      seriesD3 += "[" + t + "," + d["d3"] + "],";
    }
    maxY = GetMaxValue(
      maxY,
      new Array(d["x"], d["y"], d["h"], d["d2"], d["d3"])
    );
    minY = GetMinValue(
      minY,
      new Array(d["x"], d["y"], d["h"], d["d2"], d["d3"])
    );
  });

  //******************************************************测试数据源---------------------------------debugger------------------------------
  //seriesX = "[[1503273600000,5],[1503363600000,7],[1506718800000,3],[1506722400000,43],[1506726000000,4],";
  //seriesY = "[[1503273600000,2],[1503363600000,11],[1506718800000,18],[1506722400000,6],[1506726000000,4],";
  //seriesH = "[[1503273600000,6],[1503363600000,-5],[1506718800000,-8],[1506722400000,-15],[1506726000000,13],";
  //seriesD2 = "[[1503273600000,10],[1503363600000,6],[1506718800000,9],[1506722400000,15],[1506726000000,13],";
  //seriesD3 = "[[1503363600000,6],[1506718800000,14],[1506722400000,9],";
  //******************************************************---------------------------------debugger------------------------------

  //判断语言环境
  if (window.top.lang.Lang == "en-us") {
    lang_cur = "en-us";
  }
  if (lang_cur == "zh-cn") {
    var series = [
      {
        name: "X轴位移",
        type: "line",
        lineWidth: 1,
        data: eval(seriesX.substring(0, seriesX.length - 1) + "]")
      },
      {
        name: "Y轴位移",
        type: "line",
        lineWidth: 1,
        data: eval(seriesY.substring(0, seriesY.length - 1) + "]")
      },
      {
        name: "H轴位移",
        type: "line",
        lineWidth: 1,
        data: eval(seriesH.substring(0, seriesH.length - 1) + "]")
      },
      {
        name: "二维位移长度",
        type: "line",
        lineWidth: 1,
        data: eval(seriesD2.substring(0, seriesD2.length - 1) + "]")
      },
      {
        name: "三维位移长度",
        type: "line",
        lineWidth: 1,
        data: eval(seriesD3.substring(0, seriesD3.length - 1) + "]")
      }
    ];

    //创建带固定刻度的图标
    var legendData = [
      "X轴位移",
      "Y轴位移",
      "H轴位移",
      "二维位移长度",
      "三维位移长度"
    ];
  } else {
    var series = [
      {
        name: "X-axis displacement",
        type: "line",
        lineWidth: 1,
        data: eval(seriesX.substring(0, seriesX.length - 1) + "]")
      },
      {
        name: "Y-axis displacement",
        type: "line",
        lineWidth: 1,
        data: eval(seriesY.substring(0, seriesY.length - 1) + "]")
      },
      {
        name: "H-axis displacement",
        type: "line",
        lineWidth: 1,
        data: eval(seriesH.substring(0, seriesH.length - 1) + "]")
      },
      {
        name: "Two-dimensional displacement length",
        type: "line",
        lineWidth: 1,
        data: eval(seriesD2.substring(0, seriesD2.length - 1) + "]")
      },
      {
        name: "Three-dimensional displacement length",
        type: "line",
        lineWidth: 1,
        data: eval(seriesD3.substring(0, seriesD3.length - 1) + "]")
      }
    ];

    //创建带固定刻度的图标
    var legendData = [
      "X-axis displacement",
      "Y-axis displacement",
      "H-axis displacement",
      "Two-dimensional displacement length",
      "Three-dimensional displacement length"
    ];
  }

  //三倍显示，取整
  var diffY = Math.ceil(maxY - minY);

  maxY = maxY + diffY * 0.5;
  minY = minY - diffY * 0.5;

  if (diffY == 0) {
    maxY = 10;
    minY = -10;
  }

  //记录最大最小值到range
  range["max"] = maxY;
  range["min"] = minY;

  var intervalY = calYInterval(minY, maxY);
  maxY = Math.ceil(maxY / intervalY) * intervalY;
  minY = Math.ceil(minY / intervalY - 1) * intervalY;

  drawChartWithScale(series, maxY, minY, intervalY, legendData, data.warnsDt);

  //绑定鼠标滚轮事件
  var uniqueL = false;
  var myEChart = getEChart();
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

//查询警戒线与测值
function doQuery() {
  clearEChartSeries();
  initEChart(parent.lang.Date, parent.lang.Displacement + "(mm)", "mm");
  // if (!validateInput()) {
  //   return;
  // }
  singleDevices = [
    "程路后村", "新处村", "潘坑村"
  ]
  let queryUrl =
    HOST + "/http://183.248.239.71:9050/Handler/Ajax.ashx?oper=getBMWYDisplacementTrendData&";
  if (!parent.iframeChartArgs) {
    let date = new Date();
    date.setTime(date.getTime() - 1000 * 60 * 60 * 24 * 7);
    const deviceName = window.top.chartPlace + "监测点" + (singleDevices.includes(window.top.chartPlace) ? "" : "01"); //encodeURI($("#input-device").val(), "utf-8");
    const dataType = "实时数据"; //encodeURI($("#dropdown-datatype").val(), "utf-8");
    const startDate = date.Format("yyyy-MM-dd"); //$("#input-startdate").val();
    const endDate = new Date().Format("yyyy-MM-dd"); //$("#input-enddate").val();
    queryUrl +=
      "deviceName=" +
      deviceName +
      "&dataType=" +
      dataType +
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
}

//图例点击事件，当只有一条线显示的时候，查询报警线
function legendClick(e) {
  var s = this.chart.series;
  var num = 0;
  var name;
  for (var i = 0; i < s.length; i++) {
    if (i === this.index) {
      s[i].visible ? s[i].hide() : s[i].show();
    }
    if (s[i].visible) {
      num++;
      name = s[i].name;
    }
  }
  var queryUrl;
  if (num === 1 && checkIsDrawLine(name)) {
    queryUrl =
      HOST + "/http://183.248.239.71:9050/Handler/Ajax.ashx?oper=getBMWYWarningLine&deviceId=" +
      // "http://183.248.239.71:9050/Handler/Ajax.ashx?oper=getBMWYWarningLine&deviceId=" +
      currentDeviceId +
      "&dataType=" +
      encodeURI(name, "utf-8");
    queryWarningLine(queryUrl);
    isWLShow = true;
  } else {
    isWLShow = false;
  }

  if (!isWLShow) {
    this.chart.zoom();
  }

  clearPlotLine();
  return false;
}

var pVal = 0;

//页面加载完成
$(function () {
  initInput();
  isWLShow = false;
  initEChart(parent.lang.Date, parent.lang.Displacement + "(mm)", "mm");
  //隐藏Y轴缩放条，改用滚轮 因为默认y轴缩放条不支持放大，只支持缩小。
  HideYDataZoom();
  //获取测点
  var initDeviceTreeUrl =
    "http://127.0.0.1:4000/Handler/Ajax.ashx?oper=getBMWYDeviceTree";
  // "http://183.248.239.71:9050/Handler/Ajax.ashx?oper=getBMWYDeviceTree";
  // callService(initDeviceTreeUrl, initDeviceTree);

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
    if (pVal < -0.5) {
      pVal = -0.5;
    }
    range.Ymax =
      (range.max + range.min + (range.max - range.min) * (1 + pVal)) / 2;
    range.Ymin =
      (range.max + range.min - (range.max - range.min) * (1 + pVal)) / 2;
    var myEChart = getEChart();
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
  //     // var pNode = zTree.getNodeByParam("pId",null);
  //     // var buffer = pNode.id + deviceId;
  //     // var node = zTree.getNodeByParam("id", buffer);
  //     //// zTree.cancelSelectedNode();//先取消所有的选中状态
  //     // zTree.selectNode(node, true);//将指定ID的节点选中
  //     // zTree.setting.callback.onClick(null, zTree.setting.treeId, node); //调用事件
  //     // doQuery();
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
