import {
  // G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Legend
} from "bizcharts";
import DataSet from "@antv/data-set";
import { CSSProperties } from "react";

const css = require("../../../styles/custom.css");
const scss = require("../../../styles/scss/sharepage.scss");

const theme = {
  defaultColor: "#fff",
  colors: [
    // "rgba(205, 238, 255, 0.2)",
    // "#00b4fa",
    "#16f4ad", // green
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
      itemGap: 14,
      width: 156,
      height: 12,
      textStyle: {
        fill: "rgba(255,255,255,0.8)",
        fontSize: 12,
        lineHeight: 12
      }
    }
  }
};

interface PolarChartProps {
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

export default function PolarChart({
  data,
  legend = true,
  chartWidth = 215,
  chartHeight = 180,
  chartPadding = [10, 0, 16, 0],
  style = undefined,
  className = "",
  chartClassName = ""
}: PolarChartProps) {
  const _data = Object.keys(data.subIndexes).map((key, i) => ({
    item: key,
    全省均值: data.areaSubIndexes[key],
    本校: data.subIndexes[key]
  }));
  const { DataView } = DataSet;
  const dv = new DataView().source(_data);
  dv.transform({
    type: "fold",
    fields: ["全省均值", "本校"],
    key: "type",
    value: "score" // value字段
  });
  const cols = {
    score: {
      min: 0,
      max: 100
    }
  };
  return (
    <Chart
      width={chartWidth}
      height={chartHeight}
      data={dv}
      padding={chartPadding}
      theme={theme}
      forceFit
      scale={cols}
      className={scss["pe-auto"] + " " + chartClassName}
    >
      <Coord type="polar" radius={0.8} />
      <Tooltip />
      <Axis
        name="item"
        line={null}
        tickLine={null}
        grid={{
          lineStyle: {
            lineDash: null
          },
          hideFirstLine: false
        }}
        label={{
          textStyle: {
            textAlign: "center", // 文本对齐方向，可取值为： start center end
            fill: "#fff" // 文本的颜色
          }
        }}
      />
      <Tooltip />
      <Axis
        name="score"
        line={null}
        tickLine={null}
        grid={{
          type: "polygon",
          lineStyle: {
            lineDash: null
          },
          alternateColor: "rgba(0, 0, 0, 0.1)"
        }}
        label={{
          textStyle: {
            textAlign: "center", // 文本对齐方向，可取值为： start center end
            fill: "rgba(255, 255, 255, 0.6)" // 文本的颜色
          }
        }}
      />
      {legend ? <Legend name="type" marker="circle" offsetY={-12} /> : null}
      <Geom type="area" position="item*score" color="type" />
      <Geom type="line" position="item*score" color="type" size={2} />
      <Geom
        type="point"
        position="item*score"
        color="type"
        shape="circle"
        size={1}
        style={{
          stroke: "#fff",
          lineWidth: 1,
          fillOpacity: 1
        }}
      />
    </Chart>
  );
}

// export class Basic extends Component {
//   render() {
//     const { data } = this.props;
//     const { DataView } = DataSet;
//     const _data = Object.keys(data.subIndexes).map((key, i) => ({
//       item: key,
//       全省均值: data.areaSubIndexes[key],
//       本校: data.subIndexes[key]
//     }));
//     console.log(_data);
//     const dv = new DataView().source(_data);
//     dv.transform({
//       type: "fold",
//       fields: ["全省均值", "本校"],
//       key: "user",
//       value: "score"
//     });
//     const cols = {
//       score: {
//         min: 0,
//         max: 80
//       }
//     };
//     return (
//       <div>
//         <Chart
//           width={200}
//           height={174}
//           data={dv}
//           padding={[0, 0, 30, 0]}
//           scale={cols}
//           forceFit
//         >
//           <Coord type="polar" radius={0.8} />
//           <Axis
//             name="item"
//             line={null}
//             tickLine={null}
//             grid={{
//               lineStyle: {
//                 lineDash: null
//               },
//               hideFirstLine: false
//             }}
//           />
//           <Tooltip />
//           <Axis
//             name="score"
//             line={null}
//             tickLine={null}
//             grid={{
//               type: "polygon",
//               lineStyle: {
//                 lineDash: null
//               },
//               alternateColor: "rgba(0, 0, 0, 0.04)"
//             }}
//           />
//           <Legend name="user" marker="circle" offset={0} />
//           <Geom type="area" position="item*score" color="user" />
//           {/* <Geom type="line" position="item*score" color="user" size={2} /> */}
//           {/* <Geom
//             type="point"
//             position="item*score"
//             color="user"
//             shape="circle"
//             size={4}
//             style={{
//               stroke: "#fff",
//               lineWidth: 1,
//               fillOpacity: 1
//             }}
//           /> */}
//         </Chart>
//       </div>
//     );
//   }
// }
