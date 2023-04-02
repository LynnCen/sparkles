//当前语言环境
var lang_cur = "zh-cn";
//查询测值
function drawMonitorData(data) {
  if (eval(data).length === 0) {
    if (lang_cur == "en-us") {
      showMsg("no data");
    } else {
      showMsg("无数据");
    }
    return;
  }
  var cx = $("#panel-chart-x").highcharts();
  var cy = $("#panel-chart-y").highcharts();
  var t = data[0]["t"].toString();
  var sx = "[";
  var sy = "[";
  var xSum = 0.0;
  var ySum = 0.0;
  $.each(data, function (i, d) {
    if (d["t"] === t) {
      if (d["v1"] !== null) {
        xSum += parseFloat(d["v1"]);
        sx += "[" + xSum.toFixed(6).toString() + "," + d["d"] + "],";
      }
      if (d["v2"] !== null) {
        ySum += parseFloat(d["v2"]);
        sy += "[" + ySum.toFixed(6).toString() + "," + d["d"] + "],";
      }
    } else {
      cx.addSeries({
        name: t,
        lineWidth: 1,
        data: eval(sx.substring(0, sx.length - 1) + "]")
      });
      cy.addSeries({
        name: t,
        lineWidth: 1,
        data: eval(sy.substring(0, sy.length - 1) + "]")
      });
      t = d["t"].toString();
      sx = "[";
      sy = "[";
      xSum = 0.0;
      ySum = 0.0;
      if (d["v1"] !== null) {
        xSum += parseFloat(d["v1"]);
        sx += "[" + xSum.toFixed(6).toString() + "," + d["d"] + "],";
      }
      if (d["v2"] !== null) {
        ySum += parseFloat(d["v2"]);
        sy += "[" + ySum.toFixed(6).toString() + "," + d["d"] + "],";
      }
    }
  });
  cx.addSeries({
    name: t,
    lineWidth: 1,
    data: eval(sx.substring(0, sx.length - 1) + "]")
  });
  cy.addSeries({
    name: t,
    lineWidth: 1,
    data: eval(sy.substring(0, sy.length - 1) + "]")
  });
}

//查询警戒线与测值
function doQuery() {
  var isRun = true;
  $("#btn-search").click(function () {
    if (isRun) {
      if (lang_cur == "en-us") {
        document.getElementById("btn-search").innerText = "Disable";
      } else {
        document.getElementById("btn-search").innerText = "禁 用";
      }
      document.getElementById("btn-search").disabled = true;
      isRun = false;
    }
    setTimeout(function () {
      isRun = true;
      if (lang_cur == "en-us") {
        document.getElementById("btn-search").innerText = "Query";
      } else {
        document.getElementById("btn-search").innerText = "查 询";
      }
      document.getElementById("btn-search").disabled = false;
    }, 2000);
  });
  var chartX = $("#panel-chart-x").highcharts();
  while (chartX.series.length > 0) {
    chartX.series[0].remove(false);
  }
  //chartX.redraw();
  var chartY = $("#panel-chart-y").highcharts();
  while (chartY.series.length > 0) {
    chartY.series[0].remove(false);
  }
  //chartY.redraw();
  // if (!validateInput()) {
  //   return;
  // }
  // var deviceName = encodeURI($("#input-device").val(), "utf-8");
  // var dateList = $("#dateList").val();
  // if (dateList.split(",").length > 21) {
  //   if (lang_cur == "en-us") {
  //     showMsg("The date of the inquiry cannot exceed 20 days");
  //   } else {
  //     showMsg("查询日期不能超过20天");
  //   }
  //   return;
  // }
  //查询测值
  // var queryUrl =
  //   "../../Handler/Ajax.ashx?oper=getNBWYDeflectionData&deviceName=" +
  //   deviceName +
  //   "&dateList=" +
  //   dateList;
  let queryUrl =
    HOST + "/http://183.248.239.71:9050/Handler/Ajax.ashx?oper=getNBWYDeflectionData&";
  const args = parent.iframeChartArgs;
  const deviceName = parent.chartPlace + "内部位移01"; //encodeURI($("#input-device").val(), "utf-8");
  if (!parent.iframeChartArgs) {
    let date = new Date();
    date.setTime(date.getTime() - 1000 * 60 * 60 * 24 * 7);
    const dateList = "2019-10-01,2019-10-03,2019-10-02,2019-10-04,2019-10-05,"; //encodeURI($("#dropdown-datatype").val(), "utf-8");
    queryUrl += "deviceName=" + deviceName + "&dateList=" + dateList;
  } else {
    const queries = Object.keys(args).reduce((queries, key, i) => {
      queries += key + "=" + args[key];
      i < Object.keys(args).length - 1 && (queries += "&");
      return queries;
    }, "");
    queryUrl += queries;
  }
  callService(queryUrl, drawMonitorData);
  // if (lang_cur == "en-us") {
  //   chartX.setTitle({
  //     text: $("#input-device").val() + "-A-direction displacement curve"
  //   });
  //   chartY.setTitle({
  //     text: $("#input-device").val() + "-B-direction displacement curve"
  //   });
  // } else {
  chartX.setTitle({
    text: (args && args.deviceName) || deviceName + "-A向位移曲线图"
  });
  chartY.setTitle({
    text: (args && args.deviceName) || deviceName + "-B向位移曲线图"
  });
  // }
}

/*初始化Chart大小*/
function initChart() {
  //控制chartpanel高度
  var browserHeight = $(document.body).height() - 25;
  var browserWidth = $(document.body).width() - 25;
  $("#panel-chart-x").css("height", browserHeight);
  $("#panel-chart-x").css("width", browserWidth / 2.0 - 10);
  $("#panel-chart-y").css("height", browserHeight);
  $("#panel-chart-y").css("width", browserWidth / 2.0 - 10);

  $(window).resize(function () {
    browserHeight = $(document.body).height() - 25;
    browserWidth = $(document.body).width() - 25;
    $("#panel-chart-x").css("height", browserHeight);
    $("#panel-chart-x").css("width", browserWidth / 2.0 - 10);
    $("#panel-chart-y").css("height", browserHeight);
    $("#panel-chart-y").css("width", browserWidth / 2.0 - 10);
  });
  Highcharts.setOptions({
    lang: {
      printChart: parent.lang.PrintPic,
      downloadJPEG: parent.lang.DownLoadJPEG,
      downloadPNG: parent.lang.DownLoadPNG,
      exportButtonTitle: parent.lang.ExportToPic,
      contextButtonTitle: parent.lang.TableMenu
    }
  });
  $("#panel-chart-x").highcharts({
    chart: {
      type: "line"
    },
    tooltip: {
      borderWidth: 1,
      borderColor: "#AAA",
      useHTML: true,
      headerFormat: "<b>{series.name}</b><table>",
      pointFormat:
        "<tr><td>深度:{point.y} m</td>" + "<td>位移量:{point.x} mm</td></tr>",
      footerFormat: "</table>",
      valueDecimals: 4
    },
    title: {
      text: "A向位移曲线图",
      x: -20
    },
    xAxis: {
      title: {
        text: "位移量(mm)",
        align: "high"
      },
      lineWidth: 1,
      opposite: true
    },
    yAxis: {
      title: {
        text: "深度(m)",
        align: "high"
      },
      lineWidth: 1,
      reversed: true
    },
    legend: {
      layout: "vertical",
      align: "right",
      verticalAlign: "middle",
      borderWidth: 0
    },
    series: [
      {
        name: "测点",
        data: []
      }
    ]
  });

  $("#panel-chart-y").highcharts({
    chart: {
      type: "line"
    },
    tooltip: {
      borderWidth: 1,
      borderColor: "#AAA",
      useHTML: true,
      headerFormat: "<b>{series.name}</b><table>",
      pointFormat:
        "<tr><td>深度:{point.y} m</td>" + "<td>位移量:{point.x} mm</td></tr>",
      footerFormat: "</table>",
      valueDecimals: 4
    },
    title: {
      text: "B向位移曲线图",
      x: -20
    },
    xAxis: {
      title: {
        text: "位移量(mm)",
        align: "high"
      },
      lineWidth: 1,
      opposite: true
    },
    yAxis: {
      title: {
        text: "深度(m)",
        align: "high"
      },
      lineWidth: 1,
      reversed: true
    },
    legend: {
      layout: "vertical",
      align: "right",
      verticalAlign: "middle",
      borderWidth: 0
    },
    series: [
      {
        name: "测点",
        data: []
      }
    ]
  });
}

/*初始化Chart大小(英文)*/
function initChartEn() {
  //控制chartpanel高度
  var browserHeight = $(document.body).height() - 120;
  var browserWidth = $(document.body).width() - 100;
  $("#panel-chart-x").css("height", browserHeight);
  $("#panel-chart-x").css("width", browserWidth / 2.0 - 20);
  $("#panel-chart-y").css("height", browserHeight);
  $("#panel-chart-y").css("width", browserWidth / 2.0 - 20);

  $(window).resize(function () {
    browserHeight = $(document.body).height() - 120;
    browserWidth = $(document.body).width() - 100;
    $("#panel-chart-x").css("height", browserHeight);
    $("#panel-chart-x").css("width", browserWidth / 2.0 - 20);
    $("#panel-chart-y").css("height", browserHeight);
    $("#panel-chart-y").css("width", browserWidth / 2.0 - 20);
  });
  Highcharts.setOptions({
    lang: {
      printChart: parent.lang.PrintPic,
      downloadJPEG: parent.lang.DownLoadJPEG,
      downloadPNG: parent.lang.DownLoadPNG,
      exportButtonTitle: parent.lang.ExportToPic,
      contextButtonTitle: parent.lang.TableMenu
    }
  });
  $("#panel-chart-x").highcharts({
    chart: {
      type: "line"
    },
    tooltip: {
      borderWidth: 1,
      borderColor: "#AAA",
      useHTML: true,
      headerFormat: "<b>{series.name}</b><table>",
      pointFormat:
        "<tr><td>Depth:{point.y} m</td>" +
        "<td>Displacement:{point.x} mm</td></tr>",
      footerFormat: "</table>",
      valueDecimals: 4
    },
    title: {
      text: "A-direction displacement curve",
      x: -20
    },
    xAxis: {
      title: {
        text: "Displacement(mm)",
        align: "high"
      },
      lineWidth: 1,
      opposite: true
    },
    yAxis: {
      title: {
        text: "Depth(m)",
        align: "high"
      },
      lineWidth: 1,
      reversed: true
    },
    legend: {
      layout: "vertical",
      align: "right",
      verticalAlign: "middle",
      borderWidth: 0
    },
    series: [
      {
        name: "Measuring point",
        data: []
      }
    ]
  });

  $("#panel-chart-y").highcharts({
    chart: {
      type: "line"
    },
    tooltip: {
      borderWidth: 1,
      borderColor: "#AAA",
      useHTML: true,
      headerFormat: "<b>{series.name}</b><table>",
      pointFormat:
        "<tr><td>Depth:{point.y} m</td>" +
        "<td>Displacement:{point.x} mm</td></tr>",
      footerFormat: "</table>",
      valueDecimals: 4
    },
    title: {
      text: "B-direction displacement curve",
      x: -20
    },
    xAxis: {
      title: {
        text: "Displacement(mm)",
        align: "high"
      },
      lineWidth: 1,
      opposite: true
    },
    yAxis: {
      title: {
        text: "Depth(m)",
        align: "high"
      },
      lineWidth: 1,
      reversed: true
    },
    legend: {
      layout: "vertical",
      align: "right",
      verticalAlign: "middle",
      borderWidth: 0
    },
    series: [
      {
        name: "Measuring point",
        data: []
      }
    ]
  });
}

//页面加载完成
$(function () {
  //判断语言环境
  // if (window.top.lang.Lang == "en-us") {
  //   lang_cur = "en-us";
  // }
  //初始化名称
  // document.getElementById("pointname").innerText = parent.lang.PointName;
  // document.getElementById("date").innerText = parent.lang.Date;
  // document.getElementById("btn-search").innerText = parent.lang.Query;
  // $("#input-group").show();

  // $("#dateSelector").datepickerRefactor({ target: "#dateList" });
  // if (lang_cur == "en-us") {
  //   initChartEn();
  // } else {
  initChart();
  // }
  var initDeviceTreeUrl = "../../Handler/Ajax.ashx?oper=getNBWYDeviceTree";
  // callService(initDeviceTreeUrl, initDeviceTree);
  doQuery();
});
