//监测类型
var monitorType;
var deviceId;
//四川自贡华川项目定制需求水泥位模块变化过程曲线需要在纵轴上添加孔口的地面高程(m)，反应目前水位到孔口的高度( 可设置Plot红色线)
var PlotValue = [];
//PlotValue.push({ 'deviceid': 1, 'elevation': 11 });
//PlotValue.push({ 'deviceid': 2, 'elevation': 20 });
//PlotValue.push({ 'deviceid': 3, 'elevation': 13 });
//PlotValue.push({ 'deviceid': 4, 'elevation': 14 });
//PlotValue.push({ 'deviceid': 5, 'elevation': 15 });
//PlotValue.push({ 'deviceid': 6, 'elevation': 16 });
//Y轴标题
function getYAxisTitle() {
  var yAxisTitles = {
    jgwy: parent.lang.MinimumDryBeach + "(m)",
    nw: parent.lang.WaterLevel + "(m)",
    sd: parent.lang.Humidity + "(%)",
    tyl: parent.lang.EarthPressure + "(KPa)",
    lf: parent.lang.Crack + "(mm)",
    rxwy: parent.lang.FlexibleDisplacement + "(mm)",
    wd: parent.lang.Temperature + "(℃)",
    cs: parent.lang.Infrasound + "(Hz)",
    ds: parent.lang.EarthquakeSound + "(Hz)",
    gjyl: parent.lang.StressofSteelBars + "(MPa)",
    stsyl: parent.lang.PermeationPressure + "(KPa)",
    yb: parent.lang.Strain + "(ε)",
    kxsyl: parent.lang.PoreWaterPressure + "(KPa)",
    QY: parent.lang.Pressure + "(Pa)",
    MSYL: parent.lang.AnchorCable + "(KN)",
    SuoL: "索力(N)"
  };
  return yAxisTitles[monitorType];
}

//测值单位
function getValueSuffix() {
  var valueSuffixs = {
    jgwy: " m",
    nw: " m",
    sd: " %",
    tyl: " KPa",
    lf: " mm",
    rxwy: " mm",
    wd: " ℃",
    cs: " Hz",
    ds: " Hz",
    gjyl: " MPa",
    stsyl: " KPa",
    yb: " 10^-6",
    kxsyl: " KPa",
    QY: " Pa",
    MSYL: " KN",
    SuoL: "N"
  };
  return valueSuffixs[monitorType];
}

//查询警戒线与测值
function doQuery() {
  clearChartSeries();
  clearPlotLine();
  // if (!validateInput()) {
  //   return;
  // }
  yAxisMax = Number.MIN_VALUE;
  yAxisMin = Number.MAX_VALUE;
  // deviceId = $("#dropdown-device").val();
  // var startDate = $("#input-startdate").val();
  // var endDate = $("#input-enddate").val();
  // var dataType2 = $("#dropdown-datatype2").val();
  // var queryUrl =
  //   "../../Handler/Ajax.ashx?oper=getSimpleChartData&monitorType=" +
  //   monitorType +
  //   "&deviceId=" +
  //   deviceId +
  //   "&dataType2=" +
  //   dataType2 +
  //   "&startDate=" +
  //   startDate +
  //   "&endDate=" +
  //   endDate;
  //查询测值
  let queryUrl =
    HOST +
    "/http://183.248.239.71:9050/Handler/Ajax.ashx?oper=getSimpleChartData&monitorType=" +
    monitorType +
    "&";
  let warningLineUrl =
    HOST +
    "/http://183.248.239.71:9050/Handler/Ajax.ashx?oper=getWarningLine&monitorType=" +
    monitorType;
  if (!parent.iframeChartArgs) {
    let date = new Date();
    date.setTime(date.getTime() - 1000 * 60 * 60 * 24 * 7);
    const deviceId = 10; //encodeURI($("#input-device").val(), "utf-8");
    const dataType2 = "cc"; //encodeURI($("#dropdown-datatype").val(), "utf-8");
    const startDate = date.Format("yyyy-MM-dd"); //$("#input-startdate").val();
    const endDate = new Date().Format("yyyy-MM-dd"); //$("#input-enddate").val();
    queryUrl +=
      "deviceId=" +
      deviceId +
      "&dataType2=" +
      dataType2 +
      "&startDate=" +
      startDate +
      "&endDate=" +
      endDate;
    warningLineUrl += "&deviceId=" + deviceId;
  } else {
    const args = parent.iframeChartArgs;
    const queries = Object.keys(args).reduce((queries, key, i) => {
      queries += key + "=" + args[key];
      i < Object.keys(args).length - 1 && (queries += "&");
      return queries;
    }, "");
    queryUrl += queries;
    warningLineUrl += "&deviceId=" + args.deviceId;
  }
  callService(queryUrl, drawMonitorData);

  // let warningLineUrl =
  //   HOST + "/http://183.248.239.71:9050/Handler/Ajax.ashx?oper=getWarningLine&monitorType=" +
  //   monitorType +
  //   "&deviceId=" +
  //   deviceId;
  queryWarningLine(warningLineUrl);
  drawNWPlot();
}
function drawNWPlot() {
  if (monitorType === "nw") {
    var chart = getChart();
    chart.yAxis[0].removePlotLine("plot-line-nw");
    if (PlotValue != null) {
      var elevation;
      for (var i = 0; i < PlotValue.length; i++) {
        if (deviceId == PlotValue[i].deviceid) {
          elevation = PlotValue[i].elevation;
        }
      }
      if (elevation != null && elevation != undefined) {
        chart.yAxis[0].addPlotLine({
          //在x轴上增加
          value: elevation, //在值为2的地方
          width: 2, //标示线的宽度为2px
          color: "#0000FF", //标示线的颜色
          id: "plot-line-nw", //标示线的id，在删除该标示线的时候需要该id标示
          label: {
            text: "地面高程:" + elevation + "(m)", //标签的内容
            align: "right" //标签的水平位置，水平居左,默认是水平居中center
            //x: 10                         //标签相对于被定位的位置水平偏移的像素，重新定位，水平居左10px
          }
        });
      }
    }
  }
}
//查询测值
function drawMonitorData(data) {
  console.log(data);
  if (eval(data).length === 0) {
    showMsg(parent.lang.NoData);
    return;
  }
  var chart = getChart();
  var seriesData = "[";
  var t;
  $.each(data, function (i, d) {
    t = parseInt(d["t"]) + TIME_STAMP;
    if (d["v"] !== null) {
      seriesData += "[" + t + "," + d["v"] + "],";
    }
  });
  chart.addSeries({
    name: data[0]["name"],
    lineWidth: 1,
    data: eval(seriesData.substring(0, seriesData.length - 1) + "]")
  });
  chart.zoom();
  var dMax = chart.yAxis[0].dataMax;
  var dMin = chart.yAxis[0].dataMin;
  if (dMax > yAxisMax) {
    yAxisMax = dMax;
  }
  if (dMin < yAxisMin) {
    yAxisMin = dMin;
  }
  var c = (yAxisMax - yAxisMin) * 0.1;
  chart.yAxis[0].setExtremes(yAxisMin - c, yAxisMax + c);
}

//初始化系统参数
function initInputParam(data) {
  if (eval(data).length === 0) {
    console.log(parent.lang.PointAcquireFailure);
    return;
  }
  //绑定测点
  $("#dropdown-device").empty();
  $.each(data, function (i, device) {
    $("#dropdown-device").append(
      '<option value="' + device["id"] + '">' + device["name"] + "</option>"
    );
  });
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
  if (num === 1) {
    isWLShow = true;
    var deviceId = $("#dropdown-device").val();
    var warningLineUrl =
      "../../Handler/Ajax.ashx?oper=getWarningLine&monitorType=" +
      monitorType +
      "&deviceId=" +
      deviceId;
    queryWarningLine(warningLineUrl);
  } else {
    isWLShow = false;
  }

  if (!isWLShow) {
    this.chart.zoom();
  }

  clearPlotLine();
  return false;
}

//highcharts
function initChart2En(xTitle, yTitle, valueSuffix, legendClick) {
  // 默认的导出菜单选项，是一个数据
  var dafaultMenuItem = Highcharts.getOptions().exporting.buttons.contextButton
    .menuItems;
  Highcharts.setOptions({
    lang: {
      printChart: parent.lang.PrintPic,
      downloadJPEG: parent.lang.DownLoadJPEG,
      downloadPNG: parent.lang.DownLoadPNG,
      exportButtonTitle: parent.lang.ExportToPic,
      contextButtonTitle: parent.lang.TableMenu
    }
  });
  $("#panel-chart").highcharts({
    chart: {
      events: {
        selection: function (event) {
          var isReset = event.resetSelection || false;
          if (!isReset) {
            return true;
          }
          if (isWLShow) {
            var c = (yAxisMax - yAxisMin) * 0.1;
            this.zoom();
            this.yAxis[0].setExtremes(yAxisMin - c, yAxisMax + c);
            return false;
          }
          return true;
        }
      },
      type: "line",
      zoomType: "xy"
    },
    style: {
      backgroundColor: "#F6F6F6"
    },
    title: {
      text: "",
      x: -20
    },
    xAxis: {
      type: "datetime",
      title: {
        text: xTitle
      },
      dateTimeLabelFormats: {
        day: "%y-%m-%d"
      }
    },
    yAxis: {
      title: {
        text: yTitle
      },
      lineWidth: 1
    },
    tooltip: {
      xDateFormat: "%Y-%m-%d %H:%M:%S",
      valueSuffix: " " + valueSuffix
    },
    legend: {
      layout: "vertical",
      align: "right",
      verticalAlign: "middle",
      borderWidth: 0
    },
    plotOptions: {
      series: {
        events: {
          legendItemClick: legendClick
        }
      }
    },
    exporting: {
      buttons: {
        contextButton: {
          menuItems: [
            dafaultMenuItem[0],
            {
              separator: true
            },
            dafaultMenuItem[2],
            dafaultMenuItem[3],
            dafaultMenuItem[5],
            dafaultMenuItem[1],
            {
              text: "Zoom in on the x-axis",
              onclick: function () {
                zoomX(-1);
              }
            },
            dafaultMenuItem[1],
            {
              text: "Zoom out on the x-axis",
              onclick: function () {
                zoomX(1);
              }
            },
            dafaultMenuItem[1],
            {
              text: "Zoom in on the y-axis",
              onclick: function () {
                zoomY(-1);
              }
            },
            dafaultMenuItem[1],
            {
              text: "Zoom out on the y-axis",
              onclick: function () {
                zoomY(1);
              }
            }
          ]
        }
      },
      enabled: true,
      url: "../../Handler/picDownLoad.ashx"
    },
    series: [
      {
        name: parent.lang.Point,
        lineWidth: 1,
        data: []
      }
    ]
  });
}

$(function () {
  monitorType = getUrlParam("monitortype");
  initInput();
  isWLShow = true;
  console.log(monitorType);
  if (monitorType === "nw") {
    console.log(monitorType);
    // document.getElementById("dropdown-datatype2").style.visibility = "visible";
  }
  //查询测值单位
  //var valueSuffixUrl = "../../Handler/Ajax.ashx?oper=getValueSuffix&monitorType=" + monitorType;
  //callService(valueSuffixUrl, function (data) {
  //    initChart2('时间', data[0]["tile"], data[0]["suffix"], legendClick);
  //});

  //根据中英文环境初始化highcharts配置信息
  // if (window.top.lang.Lang == "en-us") {
  //   initChart2En(
  //     parent.lang.Time,
  //     getYAxisTitle(),
  //     getValueSuffix(),
  //     legendClick
  //   );
  // } else {
  initChart2(parent.lang.Time, getYAxisTitle(), getValueSuffix(), legendClick);
  // }
  // var initInputParamUrl = "../../Handler/Ajax.ashx?oper=getMonitorDevice&monitorType=" + monitorType;
  // callService(initInputParamUrl, initInputParam);
  // defaultQuery();
  doQuery();
});
