import { CSSProperties } from "react";
import CardLayout from "./CardLayout";
import DateCardLayout from "./DateCardLayout";
import React from "react";
import { Chart, Geom, Axis, Tooltip, Legend } from "bizcharts";
// const { Line } = Guide;
// const css = require("../../../styles/custom.css");
const scss = require("../../../styles/scss/sharepage.scss");

const theme = {
  defaultColor: "#ccc",
  colors: [
    "#00b4fa",
    "#16f4ad",
    "#ff9000",
    "#f5f4d6f0",
    "#223273",
    "#8543E0",
    "#13C2C2",
    "#3436C7",
    "#F04864"
  ],
  axis: {
    left: {
      label: {
        // offset: 12,
        // autoRotate: true,
        textStyle: {
          fill: "rgba(255,255,255,0.8)",
          fontSize: 14
        }
      },
      grid: {
        lineStyle: {
          stroke: "rgba(255,255,255,0.3)",
          lineWidth: 1,
          lineDash: [2, 2]
        },
        hideFirstLine: false
      }
    },
    bottom: {
      position: "bottom",
      title: null,
      label: {
        offset: 22,
        autoRotate: true,
        textStyle: {
          fill: "rgba(255,255,255,0.8)",
          fontSize: 14,
          lineHeight: 20
        }
      },
      line: {
        lineWidth: 0
      },
      tickLine: {
        lineWidth: 0
      }
    }
  },
  legend: {
    bottom: {
      itemGap: 24,
      width: 156,
      height: 16,
      textStyle: {
        fill: "rgba(255,255,255,0.8)",
        // fill: "rgba(204,204,204,0.8)",
        fontSize: 14,
        lineHeight: 20
      }
    }
  }
};

interface LineChartProps {
  title: string;
  enTitle?: string;
  datePicker?: boolean;
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
}

export default function LineChart({
  title,
  enTitle,
  datePicker = false,
  data,
  legend = true,
  chartWidth = 382,
  chartHeight = 240,
  chartPadding = [10, 30, 65, 40],
  style = undefined,
  className = "",
  chartClassName = ""
}: LineChartProps) {
  let Component = datePicker ? DateCardLayout : CardLayout;
  const cols = {
    x: {
      range: [0, 1]
    }
  };
  // const keys = Object.keys(data[0]);
  return (
    <Component
      title={title}
      enTitle={enTitle}
      style={style}
      className={scss["line-chart"] + " " + className}
    >
      <Chart
        scale={cols}
        width={chartWidth}
        height={chartHeight}
        data={data}
        padding={chartPadding}
        theme={theme}
        forceFit
        className={scss["pe-auto"] + " " + chartClassName}
      >
        <Legend />
        <Axis name="x" />
        <Axis
          name="y"
          label={{
            formatter: val => `${val}`
          }}
        />
        <Tooltip crosshairs={{ type: "y" }} /> {/*固定y*/}
        <Geom type="line" position="x*y" size={2} color={"type"} />
        <Geom
          type="point"
          position="x*y"
          size={4}
          shape={"circle"}
          color={"type"}
          style={{
            stroke: "#fff",
            lineWidth: 1
          }}
        />
        {/* <Guide>
          <Line
            top // {boolean} 指定 guide 是否绘制在 canvas 最上层，默认为 false, 即绘制在最下层
            start={{ x: "Aug", y: 26.5 }} // {object} | {function} | {array} 辅助线结束位置，值为原始数据值，支持 callback
            end={{ x: "Dec", y: 29 }} // 同 start
            lineStyle={{
              stroke: "#999", // 线的颜色
              lineDash: [0, 2, 2], // 虚线的设置
              lineWidth: 3 // 线的宽度
            }} // {object} 图形样式配置 https://bizcharts.net/products/bizCharts/api/graphic#线条样式
            text={{
              position: "start", // 'start' | 'center' | 'end' | '39%' | 0.5 文本的显示位置
              autoRotate: true, // {boolean} 是否沿线的角度排布，默认为 true
              style: {
                fill: "red"
              }, // {object}文本图形样式配置,https://bizcharts.net/products/bizCharts/api/graphic#文本属性
              offsetX: 20, // {number} x 方向的偏移量
              offsetY: -10, // {number} y 方向的偏移量
              content: "预期借阅趋势线" // {string} 文本的内容
            }}
          />
        </Guide> */}
      </Chart>
      <div style={{ width: "100%", height: "7.8vh" }} />
    </Component>
  );
}
