//初始化系统参数
function initInputParam(data) {
  if (eval(data).length === 0) {
    console.log(parent.lang.PointAcquireFailure);
    return;
  }
  //绑定测点
  $("#dropdown-device").empty();
  $.each(data, function(i, device) {
    $("#dropdown-device").append(
      '<option value="' + device["id"] + '">' + device["name"] + "</option>"
    );
  });
}

//展示日降雨量
function showDayData(data) {
  if (eval(data).length === 0) {
    showMsg(parent.lang.NoData);
    return;
  }
  var RainDataConfigType;
  var calType = data[0].CalType;
  if (calType == 1) {
    RainDataConfigType = parent.lang.RainDataConfigType1;
  } else if (calType == 2) {
    RainDataConfigType = parent.lang.RainDataConfigType2;
  } else {
    RainDataConfigType = parent.lang.RainDataConfigType3;
  }
  if (calType == 2) {
    //当日0点到24点的雨量数据
    $("#chart-panel-day").highcharts({
      chart: {
        type: "column"
      },
      title: {
        text: parent.lang.RainfallDay + " " + RainDataConfigType,
        x: -20
      },
      xAxis: {
        title: {
          text: parent.lang.Time
        },
        lineWidth: 1,
        categories: [
          "0:00",
          "1:00",
          "2:00",
          "3:00",
          "4:00",
          "5:00",
          "6:00",
          "7:00",
          "8:00",
          "9:00",
          "10:00",
          "11:00",
          "12:00",
          "13:00",
          "14:00",
          "15:00",
          "16:00",
          "17:00",
          "18:00",
          "19:00",
          "20:00",
          "21:00",
          "22:00",
          "23:00"
        ]
      },
      yAxis: {
        title: {
          text: parent.lang.RainfallAccumulative + "(mm)"
        },
        lineWidth: 1
      },
      tooltip: {
        valueSuffix: " mm"
      },
      legend: {
        layout: "vertical",
        align: "right",
        verticalAlign: "middle",
        borderWidth: 0
      },
      plotOptions: {
        column: {
          dataLabels: {
            enabled: true // dataLabels设为true
          }
        }
      },
      series: [
        {
          name: parent.lang.Rainfall,
          data: []
        }
      ]
    });
  } else {
    $("#chart-panel-day").highcharts({
      chart: {
        type: "column"
      },
      title: {
        text: parent.lang.RainfallDay + " " + RainDataConfigType,
        x: -20
      },
      xAxis: {
        title: {
          text: parent.lang.Time
        },
        lineWidth: 1,
        categories: [
          "8:00",
          "9:00",
          "10:00",
          "11:00",
          "12:00",
          "13:00",
          "14:00",
          "15:00",
          "16:00",
          "17:00",
          "18:00",
          "19:00",
          "20:00",
          "21:00",
          "22:00",
          "23:00",
          "0:00",
          "1:00",
          "2:00",
          "3:00",
          "4:00",
          "5:00",
          "6:00",
          "7:00"
        ]
      },
      yAxis: {
        title: {
          text: parent.lang.RainfallAccumulative + "(mm)"
        },
        lineWidth: 1
      },
      tooltip: {
        valueSuffix: " mm"
      },
      legend: {
        layout: "vertical",
        align: "right",
        verticalAlign: "middle",
        borderWidth: 0
      },
      plotOptions: {
        column: {
          dataLabels: {
            enabled: true // dataLabels设为true
          }
        }
      },
      series: [
        {
          name: parent.lang.Rainfall,
          data: []
        }
      ]
    });
  }
  var chart = $("#chart-panel-day").highcharts();
  $.each(data, function(i, d) {
    var s = {};
    s.name = d.name;
    s.data = eval(d.data);
    chart.addSeries(s);
  });
}

//展示日降雨量
function showMonthData(data) {
  if (eval(data).length === 0) {
    showMsg(parent.lang.NoData);
    return;
  }
  var chart = $("#chart-panel-month").highcharts();
  $.each(data, function(i, d) {
    if (d.name == "Categories") {
      chart.xAxis[0].setCategories(eval(d.data));
    } else if (d.name == "Sum") {
    } else {
      var s = {};
      s.name = d.name;
      s.data = eval(d.data);
      chart.addSeries(s);
    }
  });
}

//查询警戒线与测值
function doQuery() {
  // if (!validateInput()) {
  //   return;
  // }
  // var deviceId = $("#dropdown-device").val();
  // var xDate = $("#input-date").val();

  var chartDay = $("#chart-panel-day").highcharts();
  while (chartDay.series.length > 0) {
    chartDay.series[0].remove(false);
  }
  chartDay.redraw();

  var chartMonth = $("#chart-panel-month").highcharts();
  while (chartMonth.series.length > 0) {
    chartMonth.series[0].remove(false);
  }
  chartMonth.redraw();

  //查询测值
  // var queryDayUrl =
  //   "../../Handler/Ajax.ashx?oper=getRainInfoByDay&deviceId=" +
  //   deviceId +
  //   "&date=" +
  //   xDate;
  let queryDayUrl =
    HOST +
    "/http://183.248.239.71:9050/Handler/Ajax.ashx?oper=getRainInfoByDay&";
  queryDayUrl = genQueryUrl(queryDayUrl, parent.iframeChartArgs);
  callService(queryDayUrl, showDayData);
  // var queryMonthUrl =
  //   "../../Handler/Ajax.ashx?oper=getRainInfoByMonth&deviceId=" +
  //   deviceId +
  //   "&date=" +
  //   xDate;
  let queryMonthUrl =
    HOST +
    "/http://183.248.239.71:9050/Handler/Ajax.ashx?oper=getRainInfoByMonth&";
  queryMonthUrl = genQueryUrl(queryMonthUrl, parent.iframeChartArgs);
  callService(queryMonthUrl, showMonthData);
}
function genQueryUrl(url, args) {
  if (!args) {
    const deviceId = 1; //encodeURI($("#input-device").val(), "utf-8");
    const date = new Date().Format("yyyy-MM-dd"); //$("#input-enddate").val();
    return url + "deviceId=" + deviceId + "&date=" + date;
  } else {
    const queries = Object.keys(args).reduce((queries, key, i) => {
      queries += key + "=" + args[key];
      i < Object.keys(args).length - 1 && (queries += "&");
      return queries;
    }, "");
    return url + queries;
  }
}

function initChartSize() {
  var browserHeight = $(document.body).height();
  var browserWidth = $(document.body).width();
  $("#chart-panel-day").css("height", (browserHeight - 10) / 2.0);
  $("#chart-panel-day").css("width", browserWidth - 10);
  $("#chart-panel-month").css("height", (browserHeight - 10) / 2.0);
  $("#chart-panel-month").css("width", browserWidth - 10);

  $(window).resize(function() {
    browserHeight = $(document.body).height();
    browserWidth = $(document.body).width();
    $("#chart-panel-day").css("height", (browserHeight - 10) / 2.0);
    $("#chart-panel-day").css("width", browserWidth - 10);
    $("#chart-panel-month").css("height", (browserHeight - 10) / 2.0);
    $("#chart-panel-month").css("width", browserWidth - 10);
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

  $("#chart-panel-day").highcharts({
    chart: {
      type: "column"
    },
    title: {
      text: parent.lang.RainfallDay,
      x: -20
    },
    xAxis: {
      title: {
        text: parent.lang.Time
      },
      lineWidth: 1,
      categories: [
        "8:00",
        "9:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00",
        "21:00",
        "22:00",
        "23:00",
        "0:00",
        "1:00",
        "2:00",
        "3:00",
        "4:00",
        "5:00",
        "6:00",
        "7:00"
      ]
    },
    yAxis: {
      title: {
        text: parent.lang.RainfallAccumulative + "(mm)"
      },
      lineWidth: 1
    },
    tooltip: {
      valueSuffix: " mm"
    },
    legend: {
      layout: "vertical",
      align: "right",
      verticalAlign: "middle",
      borderWidth: 0
    },
    plotOptions: {
      column: {
        dataLabels: {
          enabled: true // dataLabels设为true
        }
      }
    },
    series: [
      {
        name: parent.lang.Rainfall,
        data: []
      }
    ]
  });

  $("#chart-panel-month").highcharts({
    chart: {
      type: "column"
    },
    title: {
      text: parent.lang.RainfallMonth,
      x: -20
    },
    xAxis: {
      title: {
        text: parent.lang.Time
      },
      lineWidth: 1
    },
    yAxis: {
      title: {
        text: parent.lang.RainfallAccumulative + "(mm)"
      },
      lineWidth: 1
    },
    tooltip: {
      valueSuffix: " mm"
    },
    legend: {
      layout: "vertical",
      align: "right",
      verticalAlign: "middle",
      borderWidth: 0
    },
    //加载完柱状图默认显示柱状的值
    plotOptions: {
      column: {
        dataLabels: {
          enabled: true // dataLabels设为true
        }
      }
    },
    series: [
      {
        name: parent.lang.Rainfall,
        data: []
      }
    ]
  });
}
//页面加载完成
$(function() {
  // $("#input-date").datepicker();
  //设置时间默认值
  var date = new Date();
  // $("#input-date").val(date.Format("yyyy-MM-dd"));
  initInput();
  initChartSize();
  var initInputParamUrl =
    "../../Handler/Ajax.ashx?oper=getMonitorDevice&monitorType=yl";
  // callService(initInputParamUrl, initInputParam);
  // defaultQuery();
  doQuery();
});
