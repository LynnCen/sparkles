import React, { useRef, useState, useEffect } from "react";
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  Guide,
  LabelProps
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

interface DonutChartProps {
  data: Array<any>;
  legend?: boolean;
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
  colors?: Array<string>;
  colors_pie?: Array<string>;
  label: LabelProps;
  guideHtml: string;
}

export default function DonutChart({
  data,
  legend = true,
  chartWidth = 188,
  chartHeight = 170,
  chartPadding = [2, 0, 30, 0],
  style = undefined,
  className = "",
  chartClassName = "",
  colors = undefined,
  colors_pie = undefined,
  label = {},
  guideHtml = ""
}: DonutChartProps) {
  const { DataView } = DataSet;
  const { Html } = Guide;
  const dv = new DataView();
  dv.source(data);
  const chart = useRef(null);
  const [width, setWidth] = useState(chartWidth);
  colors && (theme.colors = colors);
  colors_pie && (theme.colors_pie = colors_pie);

  useEffect(() => {
    let node = chart.current.parentNode;
    while (node.className.indexOf("card-layout") == -1) {
      if (node.nodeName == "BODY") return;
      node = node.parentNode;
    }
    if (node.nodeName !== "BODY") {
      // console.log(node.offsetWidth);
      setWidth(node.offsetWidth / 2);
    }
  }, []);
  // const cols = {
  //   percent: {
  //     min: 0,
  //     formatter(val) {
  //       return (val * 100).toFixed(2) + "%";
  //     }
  //   }
  // };
  return (
    <div ref={chart}>
      <Chart
        width={width}
        height={chartHeight}
        data={dv}
        padding={chartPadding}
        theme={theme}
        forceFit
        style={style}
        // scale={cols}
        className={scss["pe-auto"] + " " + chartClassName}
      >
        <Coord type={"theta"} radius={0.8} innerRadius={0.7} />
        <Axis name="count" />
        {legend && <Legend position="bottom" offsetY={-20} offsetX={0} />}
        <Tooltip
          showTitle={false}
          itemTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
        />
        {/* <Facet
          type="rect"
          cols={9}
          fields={["type"]}
          showTitle={true}
          colTitle={{
            offsetY: -15,
            style: {
              fontSize: 14,
              textAlign: "center",
              fill: "#fff",
              opacity: 0.8
            }
          }}
          padding={0}
        /> */}
        <Guide>
          <Html
            position={["50%", "50%"]}
            html={
              guideHtml ||
              '<div style="color:#8c8c8c;font-size:1.16em;text-align: center;width: 10em;"><span style="color:white;font-size:1em">' +
                data.reduce((total, item) => total + item.count, 0) +
                "</span></div>"
            }
            alignX="middle"
            alignY="middle"
          />
        </Guide>
        <Geom
          type="intervalStack"
          position="count"
          color="item"
          style={{
            lineWidth: 0.5, // 圆外框线
            stroke: "#fff"
          }}
        >
          <Label
            content="count"
            {...label}
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
        </Geom>
      </Chart>
    </div>
  );
}
