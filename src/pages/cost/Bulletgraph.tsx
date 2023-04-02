import React from "react";
import { Label, Chart, Geom, Axis, Tooltip, Coord, Legend, View, Guide } from "bizcharts";
import { vh } from "utils/common";

type Props = {
  data: {
    title: string;
    ranges: number[];
    actual: number;
    target: number;
  }[];
};
export default class Bulletgraph extends React.Component<Props> {
  render() {
    const { data } = this.props;
    const { Region } = Guide;
    let y = 0;
    const yGap = 0.1;
    return (
      <div className="relative" style={{ height: vh(85) }}>
        <span className="font_16 absolute">{data[0].title}</span>
        <Chart height={200} data={[1]} padding={[30, 10, 0, 0]} forceFit>
          <Legend
            custom
            position={"top-right"}
            offsetX={0}
            offsetY={-0.5}
            textStyle={{ fill: "rgba(255,255,255, .8)" }}
            items={[
              {
                value: "合格占比",
                marker: {
                  symbol: "line",
                  stroke: "#fff",
                  radius: 5,
                },
              },
              {
                value: "实际占比",
                fill: "#D19900",
                marker: "square",
              },
            ]}
          />
          {data.map((data) => {
            const ranges = data.ranges;
            const cols = {
              actual: { min: 0, max: ranges[1], nice: false },
              target: { min: 0, max: ranges[1], nice: false },
            };
            return (
              <View start={{ x: 0, y: y }} end={{ x: 1, y: y + yGap }} data={[data]} scale={cols}>
                <Coord transpose />
                <Axis name="actual" visible={false} />
                <Axis name="target" visible={false} />
                {/* <Axis
                  name="title"
                  label={{
                    offset: 0,
                    textStyle: {
                      textAlign: "center", // 文本对齐方向，可取值为： start center end
                      fill: "#fff",
                      fontSize: 16,
                    },
                  }}
                /> */}
                <Geom
                  type="point"
                  position="title*target"
                  color="#fff"
                  shape="line"
                  size={15}
                  style={{ lineWidth: 2 }}
                >
                  <Label
                    content={String(data.target)}
                    offset={0}
                    // formatter={(text, item) => {
                    //   return text * 100 + "%";
                    // }}
                    textStyle={{ fill: "#fff", textBaseline: "top" }}
                    htmlTemplate={(text, item, index) => {
                      // text 为每条记录 x 属性的值
                      // item 为映射后的每条数据记录，是一个对象，可以从里面获取你想要的数据信息
                      let percent = (text * 100).toFixed(2) + "%";
                      return `<div style="color:#fff;margin-top:100%">${percent}</div>`;
                    }}
                  />
                </Geom>
                <Geom type="interval" position="title*actual" color="#D19900" size={20}>
                  <Label
                    content={String(data.actual)}
                    offset={2}
                    formatter={(text, item) => {
                      return (text * 100).toFixed(2) + "%";
                    }}
                    textStyle={{ fill: "#fff" }}
                  />
                </Geom>
                <Guide>
                  <Region
                    start={[-1, 0]}
                    end={[1, ranges[1]]}
                    style={{ fill: "#fff", fillOpacity: 0.2 }}
                  />
                </Guide>
                <Tooltip />
              </View>
            );
          })}
        </Chart>
      </div>
    );
  }
}
