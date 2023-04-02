document.write("<script src='../../layer/jquery-3.2.0.min.js'></script>");
document.write("<script src='Js/chart/highcharts.js'></script>");
document.write("<script src='Js/chart/echarts.js'></script>");
document.write("<script src='Js/chart/exporting.js'></script>");
// document.write("<script src='../../Js/layer/layer.js'></script>");
// document.write("<script src='../../Js/validate.js'></script>");

var HOST = "http://127.0.0.1:1000"
//上次查询时间
var lastQueryTime = 0;

//HighCharts时间与正常时间相差8个小时
var TIME_STAMP = 8 * 60 * 60 * 1000;

//Y轴显示最大值
var yAxisMax = Number.MIN_VALUE;

//Y轴显示最小值
var yAxisMin = Number.MAX_VALUE;

//警戒线是否显示
var isWLShow = true;

//弹出提示信息
function showMsg(msg) {
    if(window.layer||parent.layer) {
        (window.layer||parent.layer).msg(msg)
    } else  {
        alert(msg)
    }
}

//获取Url参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
//回调函数
function showData (result) {
    var data = JSON.stringify(result); //json对象转成字符串

}
function callService(url, callback) {
    // let result = parent.data
    // callback(result["Data"]);
    $.getJSON(url, function (result) {
        if (result["Code"] === 0) {
            callback(result["Data"]);
        } else if (result["Code"] !== 0) {
            showMsg(result["Message"]);
        }
    });
    // $.getJSON(url + "&_t=" + new Date().getTime(), function (result) {
    //     //-1未注册
    //     if (result['Code'] === -1) {
    //         top.window.location.href = 'http://' + window.location.host;
    //         return;
    //     }
    //     if (result["Code"] === 0) {
    //         callback(result["Data"]);
    //     } else if (result["Code"] !== 0) {
    //         showMsg(result["Message"]);
    //     }
    // });
}

// 对Date的扩展，将 Date 转化为指定格式的String   
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
// 例子：   
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18   
Date.prototype.Format = function (fmt) { //author: meizz   
    var o = {
        "M+": this.getMonth() + 1,                 //月份   
        "d+": this.getDate(),                    //日   
        "h+": this.getHours(),                   //小时   
        "m+": this.getMinutes(),                 //分   
        "s+": this.getSeconds(),                 //秒   
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
        "S": this.getMilliseconds()             //毫秒   
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

//格式化成年月日
function dateFormatterdate(value) {
    var date = new Date(value);
    var texts = [date.getFullYear(), (date.getMonth() + 1), date.getDate()];
    return texts.join('-');
}

//格式化成时分秒
function dateFormattertime(value) {
    var date = new Date(value);
    var texts = [date.getHours(), (date.getMinutes()), date.getSeconds()];
    return texts.join(':');
}

//初始化参数，查询时间默认值、Chart
function initInput() {
    // $('#input-startdate').datepicker();
    // $('#input-enddate').datepicker();
    //设置时间默认值
    var date = new Date();
    $('#input-enddate').val(date.Format('yyyy-MM-dd'));
    date.setTime(date.getTime() - 1000 * 60 * 60 * 24 * 7);
    $('#input-startdate').val(date.Format('yyyy-MM-dd'));

    //控制chartpanel高度
    var browserHeight = $(document.body).height();
    var browserWidth = $(document.body).width();
    $('#panel-chart').css('height', browserHeight);
    $('#panel-chart').css('height', browserHeight - 10);
    $('#panel-chart').css('width', browserWidth);
    $('#panel-chart').css('width', browserWidth - 10);
    $(window).resize(function () {
        browserHeight = $(document.body).height();
        browserWidth = $(document.body).width();
        $('#panel-chart').css('height', browserHeight);
        $('#panel-chart').css('height', browserHeight - 10);
        $('#panel-chart').css('width', browserWidth);
        $('#panel-chart').css('width', browserWidth - 10);
    });
}

//使用ECharts
function initEChart(xTitle, yTitle, valueSuffix) {
    var myChart = echarts.init(document.getElementById('panel-chart')
    // ,{height:500}
    );
    var option = {
        xAxis: {
            type: 'time',
            name: xTitle,
            nameLocation: 'end',
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
            left: 80, right: 60
        },
        tooltip: {
            trigger: 'axis',
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
            orient: 'horizontal',
            align: 'right',
            top: 'top',
            borderWidth: 0,
            data: []
        },
        dataZoom: {
            show: false,
            start: 0,
            end: 100
          },
        series: []
    };
    myChart.clear();
    myChart.setOption(option);
    window.addEventListener('resize', function () {
        // myChart.resize();
    });
}

//Highcharts
function initChart(xTitle, yTitle, valueSuffix) {
    var dafaultMenuItem = Highcharts.getOptions().exporting.buttons.contextButton.menuItems;
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
            labels: {
                step: 4,
                formatter: function () {
                    return Highcharts.dateFormat("%Y-%m-%d", this.value);
                }
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
            valueSuffix: valueSuffix
        },
        legend: {
            layout: "vertical",
            align: "right",
            verticalAlign: "middle",
            borderWidth: 0
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
                            text: '放大X轴',
                            onclick: function () {
                                zoomX(-1);
                            }
                        },
                        dafaultMenuItem[1],
                        {
                            text: "缩小X轴",
                            onclick: function () {
                                zoomX(1);
                            }
                        },
                        dafaultMenuItem[1],
                        {
                            text: "放大Y轴",
                            onclick: function () {
                                zoomY(-1);
                            }
                        },
                        dafaultMenuItem[1],
                        {
                            text: "缩小Y轴",
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
        series: [{
            name: parent.lang.Point,
            lineWidth: 1,
            data: []
        }]
    });
}


//highcharts
function initChart2(xTitle, yTitle, valueSuffix, legendClick) {
    // 默认的导出菜单选项，是一个数据
    var dafaultMenuItem = Highcharts.getOptions().exporting.buttons.contextButton.menuItems;
    Highcharts.setOptions({
        lang: {
            printChart: parent.lang.PrintPic,
            downloadJPEG: parent.lang.DownLoadJPEG,
            downloadPNG: parent.lang.DownLoadPNG,
            exportButtonTitle: parent.lang.ExportToPic,
            contextButtonTitle: parent.lang.TableMenu
        }
    });
    $('#panel-chart').highcharts({
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
            type: 'line',
            zoomType: 'xy'
        },
        style: {
            backgroundColor: "#F6F6F6"
        },
        title: {
            text: '',
            x: -20
        },
        xAxis: {
            type: 'datetime',
            title: {
                text: xTitle
            },
            dateTimeLabelFormats: {
                day: '%y-%m-%d'
            }
        },
        yAxis: {
            title: {
                text: yTitle
            },
            lineWidth: 1
        },
        tooltip: {
            xDateFormat: '%Y-%m-%d %H:%M:%S',
            valueSuffix: ' ' + valueSuffix
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
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
                            text: '放大X轴',
                            onclick: function () {
                                zoomX(-1);
                            }
                        },
                        dafaultMenuItem[1],
                        {
                            text: '缩小X轴',
                            onclick: function () {
                                zoomX(1);
                            }
                        },
                        dafaultMenuItem[1],
                        {
                            text: '放大Y轴',
                            onclick: function () {
                                zoomY(-1);
                            }
                        },
                        dafaultMenuItem[1],
                        {
                            text: '缩小Y轴',
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
        series: [{
            name: parent.lang.Point,
            lineWidth: 1,
            data: []
        }]
    });
}

function zoomX(level) {
    var xAxis = $('#panel-chart').highcharts().xAxis[0],
        min = xAxis.min,
        max = xAxis.max,
        range = (max - min) / 10;
    // 通过 API 接口进行缩放或平移操作
    xAxis.setExtremes(min - range * level, max + range * level);
    if (!$('#panel-chart').highcharts().resetZoomButton) {
        $('#panel-chart').highcharts().showResetZoom();
    }
    //$('#panel-chart').highcharts().showResetZoom();
}
function zoomY(level) {
    var yAxis = $('#panel-chart').highcharts().yAxis[0],
        min = yAxis.min,
        max = yAxis.max,
        range = (max - min) / 10;
    // 通过 API 接口进行缩放或平移操作
    yAxis.setExtremes(min - range * level, max + range * level);
    if (!$('#panel-chart').highcharts().resetZoomButton) {
        $('#panel-chart').highcharts().showResetZoom();
    }
}

//Highcharts
function getChart() {
    return $("#panel-chart").highcharts();
}

//highcharts
//清除警告线，最多不会超过100条
function clearPlotLine() {
    var chart = getChart();
    for (var i = 0; i < 100; i++) {
        chart.yAxis[0].removePlotLine("poltline" + i);
        chart.xAxis[0].removePlotLine("poltline" + i);
    }
}

//清空HighChart
function clearChartSeries() {
    var chart = getChart();
    var series = chart.series;
    while (series.length > 0) {
        series[0].remove(false);
    }
    chart.redraw();
}

//画图echarts
function drawChart(series, warns) {
    var chart = getEChart();
    var legenddata = [];
    for (var i = 0; i < series.length; i++) {
        legenddata.push(series[i].name);
    }
    var option = {
        title: chart.getOption().title,
        tooltip: chart.getOption().tooltip,
        xAxis: chart.getOption().xAxis,
        yAxis: chart.getOption().yAxis,
        legend: {
            orient: 'horizontal',
            align: 'right',
            top: 'top',
            borderWidth: 0,
            data: legenddata
        },
        series: series
    };
    if (legenddata && legenddata.length == 1) {
        SetMarkLine(warns, option, true);
    } else {
        SetMarkLine(warns, option, false);
    }
    chart.setOption(option);
}

function drawEChart(series) {
    var chart = getEChart();
    var legenddata = [];
    for (var i = 0; i < series.length; i++) {
        legenddata.push(series[i].name);
    }
    var option = {
        title: chart.getOption().title,
        tooltip: chart.getOption().tooltip,
        xAxis: chart.getOption().xAxis,
        yAxis: chart.getOption().yAxis,
        legend: {
            orient: 'horizontal',
            align: 'right',
            top: 'top',
            borderWidth: 0,
            data: legenddata
        },
        series: series
    };
    chart.setOption(option);
}

function getEChart() {
    return echarts.getInstanceByDom(document.getElementById("panel-chart"));
}
//清空EChart
function clearEChartSeries() {
    var chart = getEChart();
    var seriess = chart.getOption().series;
    if (seriess.length > 0) {
        seriess = [];
    }

}
//画图echarts 可以设置刻度
//series 数据
//maxY 最大刻度 
//minY 最小刻度
//intervalY 刻度单位值 
function drawChartWithScale(series, maxY, minY, intervalY, legendData, warns) {
    var chart = getEChart();
    var option = {
        title: chart.getOption().title,
        tooltip: chart.getOption().tooltip,
        xAxis: {
            nameLocation: "end",
            axisLine: { onZero: false }//x轴为0 表示时间和位移有冲突。此处认为y周表示位移,x轴时间显示在下边
        },
        yAxis: [
               {
                   max: maxY,
                   min: minY,
                   interval: intervalY / 10,
                   axisLabel: {//显示1mm刻度，每到10显示一个刻度值如10 20 30 等。
                       formatter: function (value) {
                           if (value % intervalY == 0) return value + 'mm';
                           else return '';
                       }
                   },
                   splitLine: {
                       lineStyle: {
                           color: ['#ccc', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff']
                       }
                   }
               }
        ],
        legend: {
            orient: 'horizontal',
            align: 'right',
            top: 'top',
            borderWidth: 0,
            data: legendData
        },
       // dataZoom: [
       //{
       //    type: 'slider',
       //    xAxisIndex: [0]
       //},
       //{
       //    type: 'slider',
       //    yAxisIndex: [0],
       //    left: '91%',
       //    show: false
       //}
       // ],
        series: series
    };
    if (legendData && legendData.length == 1) {
        SetMarkLine(warns, option, true);
    } else {
        SetMarkLine(warns, option, false);
    }
    chart.setOption(option);
}




//Echart初始报警线数据源
function SetMarkLine(warns, option, show) {
    if (show === undefined) {
        show = false;
    }
    if (warns && warns.length > 0) {
        for (var i in warns) {
            if (checkEmpty(warns[i].id) || checkEmpty(warns[i].alertTypeId) || checkEmpty(warns[i].v)) {
                continue;;
            }
            var sdata = {
                type: "line",
                markLine: {
                    silent: false,
                    lineStyle: {
                        normal: {
                            type: 'line'
                        }
                    },
                    data: [{
                        name: '限值'
                    }]
                }
            };
            sdata.show = show;
            //sdata.name = warns[i].name;
            sdata.legend = warns[i].id;
            sdata.warntype = warns[i].alertTypeId;
            var color = show ? 'rgba(0, 0, 0, 1)' : 'rgba(0, 0, 0, 0)';
            switch (warns[i].alertTypeId) {
                case 1:
                    color = show ? 'rgba(255, 0, 0, 1)' : 'rgba(255, 0, 0, 0)';
                    break;
                case 2:
                    color = show ? 'rgba(255, 165, 0, 1)' : 'rgba(255, 165, 0, 0)';
                    break;
                case 3:
                    color = show ? 'rgba(0, 0, 255, 1)' : 'rgba(0, 0, 255, 0)';
                    break;
                default:
                    break;
            }
            sdata.markLine.lineStyle.normal.color = color;
            sdata.markLine.data[0].yAxis = warns[i].v;
            option.series.push(sdata);
        }
    }
}

//Echart设置报警线显示即选中一个lengend 或者 只有一个lengend时显示报警线
function ShowMarkLine(series, show, legend) {
    if (show) {
        for (var i in series) {
            if (series[i].legend == legend) {
                series[i].show = true;
                var color = 'rgba(0, 0, 0, 1)';
                switch (parseInt(series[i].warntype)) {
                    case 1:
                        color = 'rgba(255, 0, 0, 1)';
                        series[i].markLine.lineStyle.normal.color = color;
                        break;
                    case 2:
                        color = 'rgba(255, 165, 0, 1)';
                        series[i].markLine.lineStyle.normal.color = color;
                        break;
                    case 3:
                        color = 'rgba(0, 0, 255, 1)';
                        series[i].markLine.lineStyle.normal.color = color;
                        break;
                    default:
                        break;
                }
            }
        }
    }
    else {
        for (var i in series) {
            if (series[i].show) {
                series[i].show = false;
                var color = 'rgba(0, 0, 0, 0)';
                switch (parseInt(series[i].warntype)) {
                    case 1:
                        color = 'rgba(255, 0, 0, 0)';
                        series[i].markLine.lineStyle.normal.color = color;
                        break;
                    case 2:
                        color = 'rgba(255, 165, 0, 0)';
                        series[i].markLine.lineStyle.normal.color = color;
                        break;
                    case 3:
                        color = 'rgba(0, 0, 255, 0)';
                        series[i].markLine.lineStyle.normal.color = color;
                        break;
                    default:
                        break;
                }
            }
        }
    }
}

//Echart 查询警戒线Highchart
function queryEchartWarningLine(url) {
    callService(url, SetMarkLine);
}

//查询警戒线Highchart
function queryWarningLine(url) {
    callService(url, drawWarningLine);
}

//绘制报警线Highchart
function drawWarningLine(data) {
    if (eval(data).length === 0) {
        return;
    }
    var chart = getChart();
    $.each(data, function (i, wl) {
        if (wl['v'] == null) {
            return true;
        }
        var plotLine = {
            id: '',
            color: 'red', //线的颜色，定义为红色
            dashStyle: 'longdashdot', //默认是值，这里定义为长虚线
            value: wl['v'], //定义在那个值上显示标示线，这里是在x轴上刻度为3的值处垂直化一条线
            width: 2, //标示线的宽度，2px
            label: {
                text: parent.lang.WarningLine, //标签的内容
                align: 'right', //标签的水平位置，水平居左,默认是水平居中center
                x: 10, //标签相对于被定位的位置水平偏移的像素，重新定位，水平居左10px
                style: {
                    fontSize: '11px',
                    fontWeight: 'bold'
                }
            }
        };
        if (wl['alertTypeId'] === 1) { //红
            plotLine.color = 'red';
            plotLine.label.text = parent.lang.Red + ' ' + parent.lang.WarningLine;
            plotLine.id = 'poltline0';
        } else if (wl['alertTypeId'] === 2) { //橙
            plotLine.color = 'orange';
            plotLine.label.text = parent.lang.Orange + ' ' + parent.lang.WarningLine;
            plotLine.id = 'poltline1';
        } else { //蓝色
            plotLine.color = 'blue';
            plotLine.label.text = parent.lang.Blue + ' ' + parent.lang.WarningLine;
            plotLine.id = "poltline2";
        }

        chart.yAxis[0].addPlotLine(plotLine);
        if (wl['v'] > yAxisMax) {
            yAxisMax = wl['v'];
        }
        if (wl['v'] < yAxisMin) {
            yAxisMin = wl['v'];
        }

        var c = (yAxisMax - yAxisMin) * 0.1;
        chart.zoom();
        chart.yAxis[0].setExtremes(yAxisMin - c, yAxisMax + c);
    });
}

//验证输入参数
// function validateInput() {
//     var newQueryTime = (new Date()).getTime();
//     if (newQueryTime - lastQueryTime > 3000) {
//         lastQueryTime = newQueryTime;
//         return true;
//     }
//     // else if (newQueryTime - lastQueryTime <= 3000) {
//     //     if (window.top.lang.Lang == "zh-cn") {
//     //         alert("您的操作过于频繁，请稍后重试！");
//     //     }
//     //     else {
//     //         alert("Your operation is too frequent, please try again later!");
//     //     }
//     //     return false;
//     // }
//     var startDate;
//     if ($('#input-startdate').length > 0) {
//         startDate = $('#input-startdate').val();
//         if ($.trim(startDate) === '' || !IsDate(startDate)) {
//             $('#input-startdate').focus();
//             showMsg(parent.lang.DateNumberAlert);
//             return false;
//         }
//     }
//     var endDate;
//     if ($('#input-enddate').length > 0) {
//         endDate = $('#input-enddate').val();
//         if ($.trim(endDate) === '' || !IsDate(endDate)) {
//             $('#input-enddate').focus();
//             showMsg(parent.lang.DateNumberAlert);
//             return false;
//         }
//     }
//     if (Date.parse(endDate) - Date.parse(startDate) < 0) {
//         showMsg(parent.lang.DateTimeAlert);
//         $('#input-startdate').focus();
//         return false;
//     }
//     var deviceId;
//     if ($('#dropdown-device').length > 0) {
//         deviceId = $('#dropdown-device').val();
//         if ($.trim(deviceId) === '') {
//             $('#dropdown-device').focus();
//             showMsg(parent.lang.PointNullAlert);
//             return false;
//         }
//     }
//     if ($('#input-device').length > 0) {
//         deviceId = $('#input-device').val();
//         if ($.trim(deviceId) === '') {
//             $('#input-device').focus();
//             showMsg(parent.lang.PointNullAlert);
//             return false;
//         }
//     }

//     if ($('#input-date').length > 0) {
//         var d = $('#input-date').val();
//         if ($.trim(d) === '' || !IsDate(d)) {
//             $('#input-date').focus();
//             showMsg(parent.lang.DateNumberAlert);
//             return false;
//         }
//     }
//     return true;
// }

/*测点树操作*/
function deviceTreeClick(e, treeId, treeNode) {
    var zTree = $.fn.zTree.getZTreeObj("deviceTree");
    zTree.checkNode(treeNode, !treeNode.checked, null, true);
    return false;
}

function deviceTreeCheck(e, treeId, treeNode) {
    var zTree = $.fn.zTree.getZTreeObj("deviceTree"),
		nodes = zTree.getCheckedNodes(true),
		v = "";
    for (var i = 0, l = nodes.length; i < l; i++) {
        if (nodes[i].level !== 0) {
            v += nodes[i].name + ",";
        }

    }
    if (v.length > 0) v = v.substring(0, v.length - 1);
    var cityObj = $("#input-device");
    cityObj.attr("value", v);
}

function showDeviceTree() {
    var cityObj = $("#input-device");
    var cityOffset = $("#input-device").offset();
    $("#menuContent").css({
        left: cityOffset.left + "px",
        top: cityOffset.top + cityObj.outerHeight() + "px"
    }).slideDown("fast");

    $("body").bind("mousedown", onBodyDown);
}

function hideMenu() {
    $("#menuContent").fadeOut("fast");
    $("body").unbind("mousedown", onBodyDown);
}

function onBodyDown(event) {
    if (!(event.target.id === "input-device" ||
			event.target.id === "menuContent" ||
			$(event.target).parents("#menuContent").length > 0)) {
        hideMenu();
    }
}

function initDeviceTree(data) {
    if (eval(data).length === 0) {
        return;
    }
    var setting = {
        check: {
            enable: true,
            chkStyle: "radio",
            radioType: "all"
        },
        view: {
            dblClickExpand: false
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            onClick: deviceTreeClick,
            onCheck: deviceTreeCheck
        }
    };
    // $.fn.zTree.init($("#deviceTree"), setting, eval(data[0]["DeviceTree"]));
}

var code;
function showCode(str) {
    if (!code) code = $("#code");
    code.empty();
    code.append("<li>" + str + "</li>");
}

function initTreeMulSel(data) {
    if (eval(data).length === 0) {
        return;
    }
    var setting = {
        check: {
            enable: true
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            onClick: deviceTreeClick,
            onCheck: deviceTreeCheck
        }
    };
    $.fn.zTree.init($("#deviceTree"), setting, eval(data[0]["DeviceTree"].replace(/nocheck:true/g, "nocheck:false")));
}
/*测点树操作*/

function checkEmpty(str) {
    if (str == null || str.length <= 0) {
        return true;
    }
    return false;
}

//比较值大小获取最大值
function GetMaxValue(oldData, newDataArray) {
    if (newDataArray && newDataArray.length > 0) {
        for (var i = 0; i < newDataArray.length; i++) {
            if (parseInt(newDataArray[i]) > oldData) {
                oldData = newDataArray[i];
            }
        }
    }
    return oldData;
}

//比较值大小获取最小值
function GetMinValue(oldData, newDataArray) {
    if (newDataArray && newDataArray.length > 0) {
        for (var i = 0; i < newDataArray.length; i++) {
            if (parseInt(newDataArray[i]) < oldData) {
                oldData = newDataArray[i];
            }
        }
    }
    return oldData;
}

//计算Y轴间隔
function calYInterval(minY, maxY) {
    var diff = maxY - minY;
    var interval = 1;

    while (diff > 10) {
        diff = Math.ceil(diff / 10);
        interval = interval * 10;
    }

    return interval;
}
function GetRequest(keyValue) {
    var search = location.search.slice(1);
    var arr = search.split("&");
    for (var i = 0; i < arr.length; i++) {
        var ar = arr[i].split("=");
        if (ar[0] == keyValue) {
            if (unescape(ar[1]) == 'undefined') {
                return "";
            } else {
                return unescape(ar[1]);
            }
        }
    }
    return "";
}
function defaultQuery()
{
    setTimeout(function () {
        var deviceId = GetRequest("DeviceId");
        if (deviceId != "") {
            $("#dropdown-device").val(deviceId);
            doQuery();
        }
    }, 500);
}