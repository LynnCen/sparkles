import { Chart, Geom, Axis, Tooltip, Coord, LegendProps } from "bizcharts";
import DataSet from "@antv/data-set";
import { CSSProperties } from "react";

interface Lishui3DChart5 {
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

export default function Lishui3DChart5({
  data,
  legend = true,
  // chartWidth = 200,
  chartWidth = 220,
  chartHeight = 160,
  // chartPadding = [8, 10, 5, 18],
  chartPadding = [0, 0, -20, 0],
  style = undefined,
  className = "",
  chartClassName = "",
  colors_pie = undefined,
  colTitle = { offsetY: 73 }
}: Lishui3DChart5) {
  const { DataView } = DataSet;
  const dv = new DataView().source(data);
  dv.transform({
    type: "fold",
    fields: ["数量"],
    // 展开字段集
    key: "user",
    // key字段
    value: "score" // value字段
  });
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
    <Chart height={chartHeight} data={dv} padding={chartPadding} forceFit>
      <Coord type="polar" radius={0.45} />
      <Axis
        name="item"
        line={null}
        tickLine={null}
        grid={{
          hideFirstLine: false
        }}
      />
      <Tooltip />
      <Axis
        name="score"
        line={null}
        tickLine={null}
        grid={{
          type: "polygon",
          alternateColor: "rgba(0, 0, 0, 0.04)"
        }}
      />
      {/* <Legend name="user" marker="circle" /> */}
      <Geom type="area" position="item*score" color="user" />
      <Geom type="line" position="item*score" color="user" size={1} />
      <Geom
        type="point"
        position="item*score"
        color="user"
        shape="circle"
        size={4}
        style={{
          stroke: "#fff",
          lineWidth: 1,
          fillOpacity: 1
        }}
      />
    </Chart>
  );
}
