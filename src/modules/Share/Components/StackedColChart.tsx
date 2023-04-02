import React from "react";
import {
  // G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  LegendProps,
  LabelProps
  // View,
  // Guide,
  // Shape,
  // Facet,
  // Util
} from "bizcharts";
import DataSet from "@antv/data-set";
import { CSSProperties } from "react";

// const css = require("../../../styles/custom.css");
const scss = require("../../../styles/scss/sharepage.scss");

const _theme = {
  defaultColor: "#fff",
  colors: [
    "rgba(255, 255, 255, 0.5)",
    "#0cceac",
    // "#00b4fa",
    // "#16f4ad", // green
    // "#00d5ffc7",
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
      width: 156,
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
          stroke: "rgba(255,255,255,.6)",
          lineWidth: 1,
          lineDash: [0]
        },
        hideFirstLine: false
      }
    },
    right: {
      label: {
        textStyle: {
          fill: "#fff",
          fontSize: 14
        }
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
          lineHeight: 16
        }
      },
      line: {
        // lineWidth: 1
      },
      tickLine: {
        // lineWidth: 1
      }
    }
  }
};

interface StackedColChartProps {
  data: Array<any>;
  legend?: boolean | LegendProps;
  transpose?: boolean;
  chartWidth?: number;
  chartHeight?: number;
  chartPadding?:
    | string
    | number
    | [number, number, number, number] //[top,right,bottom,left]
    | [string, string]
    | undefined;
  theme?: any;
  showPercent?: boolean;
  geomLabel?: boolean | LabelProps;
  geomColor?: string | Array<any>;
  style?: CSSProperties;
  className?: string;
  chartClassName?: string;
}

export default function StackedColChart({
  data,
  legend = true,
  transpose = false,
  chartWidth = 140,
  chartHeight = 200,
  chartPadding = [10, 10, 80, 0],
  theme = {},
  showPercent = true,
  geomColor = "type",
  geomLabel = true,
  style = undefined,
  className = "",
  chartClassName = ""
}: StackedColChartProps) {
  const ds = new DataSet();
  const dv = ds
    .createView()
    .source(data)
    .transform({
      type: "percent",
      field: "value",
      // 统计销量
      dimension: "type",
      // 每年的占比
      groupBy: ["x"],
      // 以不同产品类别为分组
      as: "percent"
    });
  const cols = {
    percent: {
      min: 0,
      formatter(val) {
        return parseInt(val * 100);
      }
    }
  };
  const legendProps = legend && {
    useHtml: false,
    offsetY: 0,
    offsetX: 0,
    ...legend
  };

  const labelProps = geomLabel && {
    content: "value",
    offset: -10,
    ...geomLabel
  };

  return (
    <Chart
      width={chartWidth}
      height={chartHeight}
      data={dv}
      padding={chartPadding}
      theme={{ ..._theme, ...theme }}
      forceFit
      scale={cols}
      className={scss["pe-auto"] + " " + scss["stackedColChart"] + " " + chartClassName}
    >
      <Coord transpose={transpose} />
      {legend ? <Legend {...legendProps} /> : null}
      <Axis name="x" />
      <Axis
        name={showPercent ? "percent" : "value"}
        label={{
          textStyle: {
            fill: "#ffffff40",
            fontSize: 14
          }
        }}
      />
      <Tooltip
        itemTpl={`<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}${
          showPercent ? "%" : ""
        }</li>`}
      />
      <Geom
        type="intervalStack"
        position={`x*${showPercent ? "percent" : "value"}`}
        color={geomColor}
      >
        {/* {geomLabel ? <Label content="value" offset={-10} /> : null} */}
        {geomLabel ? <Label {...labelProps} /> : null}
      </Geom>
    </Chart>
  );
}
