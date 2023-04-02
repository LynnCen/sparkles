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

const scss = require("../../../../styles/scss/sharepage.scss");

interface Lishui3DChart1 {
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

export default function Lishui3DChart1({
  data,
  legend = true,
  // chartWidth = 200,
  chartWidth = 230,
  chartHeight = 160,
  // chartPadding = [8, 10, 5, 18],
  chartPadding = [0, 0, -20, 0],
  style = undefined,
  className = "",
  chartClassName = "",
  colors_pie = undefined,
  colTitle = { offsetY: 73 }
}: Lishui3DChart1) {
  const { DataView } = DataSet;
  const { Html } = Guide;
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
        val = val * 100 + "%";
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
      padding={chartPadding}
      data={dv}
      scale={cols}
      className={scss["pe-auto"] + " " + chartClassName}
      forceFit
    >
      <Coord type={"theta"} radius={0.4} innerRadius={0.8} />
      <Axis name="percent" />
      <Tooltip
        showTitle={false}
        itemTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
      />
      <Guide>
        <Html
          position={["50%", "50%"]}
          html='<div style="color:#B4B7BC;font-size:12px;text-align: center;width: 10em;">
            890
            <br/>
            户数
          </div>'
          alignX="middle"
          alignY="middle"
        />
      </Guide>
      <Geom
        type="intervalStack"
        position="percent"
        color="item"
        tooltip={[
          "item*percent",
          (item, percent) => {
            percent = percent * 100 + "%";
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
          formatter={(val, item) => {
            return item.point.item + ": " + val;
          }}
          textStyle={{
            fill: "#B4B7BC"
          }}
        />
      </Geom>
    </Chart>
  );
}
