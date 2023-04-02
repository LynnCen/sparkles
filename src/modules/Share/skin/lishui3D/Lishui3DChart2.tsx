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
  chartWidth = 200,
  chartHeight = 160,
  // chartPadding = [8, 10, 5, 18],
  chartPadding = [0, 0, -30, -85],
  style = undefined,
  className = "",
  chartClassName = "",
  colors_pie = undefined,
  colTitle = { offsetY: 73 }
}: Lishui3DChart2) {
  const { DataView } = DataSet;
  const dv = new DataView();
  dv.source(data).transform({
    type: "percent",
    field: "count",
    dimension: "item",
    as: "percent"
  });
  const cols = {
    percent: {
      formatter: val => {
        val = (val * 100).toFixed(2) + "%";
        return val;
      }
    }
  };
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
      data={dv}
      scale={cols}
      padding={chartPadding}
      forceFit
    >
      <Coord type="theta" radius={0.5} />
      <Axis name="percent" />
      <Legend position="right" offsetX={-90} offsetY={-70} />
      <Tooltip
        showTitle={false}
        itemTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
      />
      <Geom
        type="intervalStack"
        position="percent"
        color="item"
        tooltip={[
          "item*percent",
          (item, percent) => {
            percent = (percent * 100).toFixed(2) + "%";
            return {
              name: item,
              value: percent
            };
          }
        ]}
        style={{
          lineWidth: 1,
          stroke: "#fff"
        }}
      >
        <Label
          content="percent"
          offset={-15}
          textStyle={{
            rotate: 0,
            textAlign: "center",
            shadowBlur: 2,
            fill: "#FFFFFF",
            shadowColor: "rgba(0, 0, 0, .6)"
          }}
        />
      </Geom>
    </Chart>
  );
}
