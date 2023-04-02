import {
  Chart,
  Axis,
  Tooltip,
  Coord,
  Legend,
  LegendProps,
  Facet,
  Guide,
  Geom,
  Label
} from "bizcharts";
import DataSet from "@antv/data-set";
import { CSSProperties } from "react";

interface Lishui3DChart2 {
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

export default function Lishui3DChart2({
  data,
  legend = true,
  // chartWidth = 200,
  chartWidth = 230,
  chartHeight = 140,
  // chartPadding = [8, 10, 5, 18],
  chartPadding = [0, 0, 0, -120],
  style = undefined,
  className = "",
  chartClassName = "",
  colors_pie = undefined,
  colTitle = { offsetY: 73 }
}: Lishui3DChart2) {
  // colors_pie && (theme.colors_pie = colors_pie);
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
      data={data}
      padding={chartPadding}
      forceFit
    >
      <Coord type="polar" radius={0.8} />
      <Tooltip />
      <Legend position="right-center" offsetX={-100} offsetY={0} />
      <Geom
        type="interval"
        color="item"
        position="item*count"
        style={{
          lineWidth: 1,
          stroke: "#fff"
        }}
      />
    </Chart>
  );
}
