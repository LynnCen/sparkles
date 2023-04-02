import {
  // G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  // Coord,
  // Label,
  Legend
  // View,
  // Guide,
  // Shape,
  // Facet,
  // Util
} from "bizcharts";
import DataSet from "@antv/data-set";
import { CSSProperties } from "react";
import CardLayout from "./CardLayout";

// const css = require("../../../styles/custom.css");
const scss = require("../../../styles/scss/sharepage.scss");

const theme = {
  defaultColor: "#ccc",
  colors: [
    "#00b4fa",
    "#16f4ad",
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

interface fieldItem {
  name: string;
  [key: string]: string | number;
}
interface RectChartCardProps {
  title: string;
  enTitle?: string;
  placement?: "horizontal" | "vertical";
  data: Array<fieldItem>;
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

export default function RectChartCard({
  title,
  enTitle,
  placement = "vertical",
  data,
  legend = true,
  chartWidth = 382,
  chartHeight = 191,
  chartPadding = [10, 0, 70, 30],
  style = undefined,
  className = "",
  chartClassName = ""
}: RectChartCardProps) {
  const ds = new DataSet();
  const dv = ds.createView().source(data);
  dv.transform({
    type: "fold",
    fields: Object.keys(data[0]).slice(1), // 展开字段集
    key: "x", // key字段
    value: "y" // value字段
  });
  return (
    <CardLayout
      title={title}
      enTitle={enTitle}
      placement={placement}
      style={style}
      className={className}
    >
      <Chart
        width={chartWidth}
        height={chartHeight}
        data={dv}
        padding={chartPadding}
        theme={theme}
        forceFit
        className={scss["pe-auto"] + " " + chartClassName}
      >
        <Axis name={"x"} />
        <Axis name={"y"} />
        {legend ? <Legend /> : null}
        <Tooltip
          crosshairs={{
            type: "y"
          }}
        />
        <Geom
          type="interval"
          position="x*y"
          color={"name"}
          size={15} //柱体宽度
          adjust={[
            {
              type: "dodge",
              marginRatio: 1 / 32 //柱体间距比例
            }
          ]}
        />
      </Chart>
    </CardLayout>
  );
}
// const data = [
//   {
//     name: "大一",
//     二月: 85.9,
//     三月: 86.8,
//     四月: 84.3,
//     五月: 87.4,
//     六月: 89.4
//   },
//   {
//     name: "大二",
//     二月: 82.9,
//     三月: 80.8,
//     四月: 83.3,
//     五月: 85.4,
//     六月: 87.4
//   },
//   {
//     name: "大三",
//     二月: 75.9,
//     三月: 78.8,
//     四月: 80.3,
//     五月: 79.4,
//     六月: 85.4
//   }
// ];
