import React from "react";
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util
} from "bizcharts";
import DataSet from "@antv/data-set";

const scss = require("../../../styles/scss/sharepage.scss");

export const FolkMap1L = ({ data }) => {
  return (
    <div>
      {data.map(item => {
        return (
          <div key={item.index} className={scss["left-child"]}>
            <div className={scss["childL"]}>
              <img src={item.image} alt="" />
            </div>
            <div className={scss["childR"]}>
              <div>{item.number}</div>
              <div>{item.text}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

interface titleProps {
  title: string;
  entitle: string;
  right?: any;
}

export const FolkMapTitle = ({ title, entitle, right }: titleProps) => {
  return (
    <div className={scss["component-title"]}>
      <div className={scss["title-left"]}>
        <div>{title}</div>
        <div>{entitle}</div>
      </div>
      {right && <div>{right}</div>}
    </div>
  );
};

interface RightProps {
  text: string;
  number?: number;
  unit?: string;
}

/**
 * @description title右侧
 */

export const TitleRight = ({ text, number, unit }: RightProps) => {
  return (
    <div className={scss["title-right"]}>
      <span>{text}</span>
      {number && <span className={scss["number"]}>{number}</span>}
      {unit && <span>{unit}</span>}
    </div>
  );
};

/**
 * @description 统计图组
 */

export const ChartGroup = ({ data, color }) => {
  return (
    <div className={scss["chart-group"]}>
      {data.map(item => {
        return (
          <div key={item.index} className={scss["group-content"]}>
            <div className={scss["chart-box"]}>
              <DonutChart
                data={item.data}
                number={item.proportion}
                color={color}
              />
            </div>
            <div>{item.title}</div>
            <div>
              <span>{item.number}</span>人
            </div>
          </div>
        );
      })}
    </div>
  );
};

/**
 * @description 环形统计图
 */

export const DonutChart = ({ data, number, color }) => {
  const { DataView } = DataSet;
  const { Html } = Guide;
  const dv = new DataView();
  dv.source(data).transform({
    type: "percent",
    field: "count",
    dimension: "item",
    as: "percent"
  });
  return (
    <Chart width={84} height={84} data={dv} padding={[0, 0, 0, 0]}>
      <Coord type={"theta"} radius={1} innerRadius={0.9} />
      <Axis name="percent" />
      <Guide>
        <Html
          position={["50%", "50%"]}
          html={`<div style="color:#fff;font-size:22px;font-weight:bold;text-align: center;">${number}%</div>`}
          alignX="middle"
          alignY="middle"
        />
      </Guide>
      <Geom type="intervalStack" position="percent" color={["item", color]} />
    </Chart>
  );
};

/**
 * @description 卡片
 */

interface BlueCardProps {
  title: string;
  number: number;
  unit: string;
  width: number;
}

export const BlueCard = ({ title, number, unit, width }: BlueCardProps) => {
  return (
    <div className={scss["blue-card"]} style={{ width: `${width}px` }}>
      <div>
        <span>{number}</span> {unit}
      </div>
      <div>{title}</div>
    </div>
  );
};

export const ContentShow = ({ imageUrl, title, number }) => {
  return (
    <div className={scss["content-show"]}>
      <div>
        <img src={imageUrl} alt="" />
      </div>
      <div className={scss["text"]}>
        <div>{title}</div>
        <div>{number}</div>
      </div>
    </div>
  );
};
