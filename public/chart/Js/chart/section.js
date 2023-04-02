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

//查询测值
function drawMonitorData(data) {
  if (eval(data).length === 0) {
    showMsg(parent.lang.NoData);
    return;
  }
  //计算数据源最大值最小值
  var maxY = Number.MIN_VALUE;
  var minY = Number.MAX_VALUE;
  var series = [];
  var seriesData = "[";
  var name = data[0]["name"];
  //创建带固定刻度的图标
  var legendData = [];
  legendData.push(name);
  var t;
  $.each(data, function (i, d) {
    t = parseInt(d["t"]);
    if (d["name"] === name) {
      if (d["v"] !== null) {
        seriesData += "[" + t + "," + d["v"] + "],";
      }
    } else {
      series.push({
        name: name,
        type: "line",
        data: eval(seriesData.substring(0, seriesData.length - 1) + "]")
      });
      name = d["name"];
      legendData.push(name);
      seriesData = "[";
      if (d["v"] !== null) {
        seriesData += "[" + t + "," + d["v"] + "],";
      }
    }

    maxY = GetMaxValue(maxY, new Array(d["v"], d["v"]));
    minY = GetMinValue(minY, new Array(d["v"], d["v"]));
  });
  series.push({
    name: name,
    type: "line",
    data: eval(seriesData.substring(0, seriesData.length - 1) + "]")
  });

  //三倍显示，取整
  var diffY = Math.ceil(maxY - minY);

  maxY = maxY + diffY * 3;
  minY = minY - diffY * 3;

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
  drawChartWithScale(series, maxY, minY, intervalY, legendData, []);
}

//查询警戒线与测值
function doQuery() {
  clearEChartSeries();
  initEChart(parent.lang.Time, parent.lang.Displacement + "(mm)", " mm");
  //查询测值
  let queryUrl =
    HOST +
    "/http://183.248.239.71:9050/Handler/Ajax.ashx?oper=getBMWYDeviceDataMul&";
  if (!parent.iframeChartArgs) {
    let date = new Date();
    date.setTime(date.getTime() - 1000 * 60 * 60 * 24 * 7);
    const deviceName = window.top.chartPlace || "监测点01"; //encodeURI($("#input-device").val(), "utf-8");
    const dataType = "实时数据"; //encodeURI($("#dropdown-datatype").val(), "utf-8");
    const dataField = "V1";
    const startDate = date.Format("yyyy-MM-dd"); //$("#input-startdate").val();
    const endDate = new Date().Format("yyyy-MM-dd"); //$("#input-enddate").val();
    queryUrl +=
      "deviceName=" +
      deviceName +
      "&dataType=" +
      dataType +
      "&dataField=" +
      dataField +
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

//页面加载完成
$(function () {
  initInput();
  isWLShow = false;
  initEChart(parent.lang.Time, parent.lang.Displacement + "(mm)", " mm");

  //获取测点
  var initDeviceTreeUrl = "../../Handler/Ajax.ashx?oper=getBMWYDeviceTree";
  // callService(initDeviceTreeUrl, initTreeMulSel);
  doQuery();
});
