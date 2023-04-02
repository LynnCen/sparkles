import React from "react";
import {
  Chart,
  Axis,
  Tooltip,
  Coord,
  Legend,
  LegendProps,
  Facet
} from "bizcharts";
import DataSet from "@antv/data-set";
import { CSSProperties } from "react";

// const css = require("../../../styles/custom.css");
const scss = require("../../../styles/scss/sharepage.scss");

const theme = {
  defaultColor: "#fff",
  colors: [
    // "rgba(205, 238, 255, 0.2)",
    // "#00b4fa",
    "#0ccdd1",
    // "#16f4ad", // green
    "#00d5ffc7",
    "#f5f4d6f0",
    "#223273",
    "#8543E0",
    "#13C2C2",
    "#3436C7",
    "#F04864"
  ],
  legend: {
    bottom: {
      itemGap: 10,
      width: 126,
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
          stroke: "rgba(255,255,255,1)",
          lineWidth: 1
          // lineDash: [2, 2]
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
          lineHeight: 20
        }
      },
      line: {
        lineWidth: 1
      },
      tickLine: {
        lineWidth: 1
      }
    }
  }
};

interface CompareDonutChartProps {
  data: Array<any>;
  legend?: boolean | LegendProps;
  useHtml?: boolean;
  chartWidth?: number;
  chartHeight?: number;
  chartPadding?:
    | string
    | number
    | [number, number, number, number] //[top,right,bottom,left]
    | [string, string]
    | undefined;
  style?: CSSProperties;
  className?: string;
  chartClassName?: string;
  colors_pie?: Array<string>;
  colTitle?: {
    offsetY?: number;
    style?: G2.Styles.text;
  };
}

export default function CompareDonutChart({
  data,
  legend = true,
  // chartWidth = 200,
  chartWidth = 220,
  chartHeight = 200,
  // chartPadding = [8, 10, 5, 18],
  chartPadding = [10, 0, 142, 0],
  style = undefined,
  className = "",
  chartClassName = "",
  colors_pie = undefined,
  colTitle = { offsetY: 73 }
}: CompareDonutChartProps) {
  const { DataView } = DataSet;
  // const { Html } = Guide;
  const dv = new DataView();
  dv.source(data);
  colors_pie && (theme.colors_pie = colors_pie);
  // const cols = {
  //   percent: {
  //     min: 0,
  //     formatter(val) {
  //       return (val * 100).toFixed(2) + "%";
  //     }
  //   }
  // };
  // if (!legend) {
  //   console.log(legend);
  //   chartPadding[2] -= 20;
  // }
  const legendProps = legend && {
    useHtml: false,
    offsetY: 0,
    offsetX: 0,
    ...legend
  };

  return (
    <Chart
      width={chartWidth}
      height={chartHeight}
      data={dv}
      padding={chartPadding}
      theme={theme}
      forceFit
      // scale={cols}
      className={
        scss["pe-auto"] + " " + scss["compareDonutChart"] + " " + chartClassName
      }
      style={style}
    >
      <Coord type={"theta"} radius={1} innerRadius={0.66} />
      <Axis name="count" />
      {legend ? <Legend {...legendProps} /> : null}
      <Tooltip
        showTitle={false}
        itemTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
      />

      <Facet
        type="rect"
        fields={["type"]}
        padding={0}
        colTitle={Object.assign(
          {
            offset: 0,
            style: {
              fontSize: 14,
              textAlign: "center",
              fill: "#fff",
              opacity: 0.8
            }
          },
          colTitle
        )}
        eachView={(view, facet) => {
          const data = facet.data;
          const dv = new DataView();
          dv.source(data);
          // view.source(dv, {
          //   percent: {
          //     formatter: val => {
          //       return (val * 100).toFixed(2) + "%";
          //     }
          //   }
          // });
          view.coord("theta", {
            innerRadius: 0.8
          });
          view
            .intervalStack()
            .position("count")
            .color("item")
            .label("count", {
              offset: 10,
              textStyle: {
                textAlign: "center", // 文本对齐方向，可取值为： start center end
                fill: "#fff", // 文本的颜色
                opacity: 0.8,
                fontSize: "12" // 文本大小
                // fontWeight: "bold", // 文本粗细
                // textBaseline: "top" // 文本基准线，可取 top middle bottom，默认为middle
              }
            })
            .select(false)
            .style({
              lineWidth: 0.5, // 圆外框线
              stroke: "#fff"
            });
          view.guide().html({
            position: ["50%", "50%"],
            html:
              '<div style="color:#8c8c8c;font-size:1.16em;text-align: center;width: 10em;"><span style="color:white;font-size:1em">' +
              data.reduce((total, item) => total + item.count, 0) +
              "</span></div>"
          });
        }}
      />
      {/* <Geom
        type="intervalStack"
        position="count"
        color="item"
        style={{
          lineWidth: 1,
          stroke: "#fff"
        }}
      >
        <Label
          content="count"
          // formatter={(val, item) => {
          //   return val;
          // }}
          labelLine={{
            lineWidth: 1, // 线的粗细
            stroke: "#fff", // 线的颜色
            opacity: 0.3
          }}
          textStyle={{
            // textAlign: 'start', // 文本对齐方向，可取值为： start middle end
            fill: "#fff",
            opacity: 0.8
            // fontSize: '12', // 文本大小
            // fontWeight: 'bold', // 文本粗细
            // rotate: 30,
            // textBaseline: 'top' // 文本基准线，可取 top middle bottom，默认为middle
          }}
        />
      </Geom> */}
    </Chart>
  );
}
