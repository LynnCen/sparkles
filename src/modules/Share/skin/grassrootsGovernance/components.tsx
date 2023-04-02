import React, { useState, useEffect } from "react";
import moment from "moment";
import { Icon } from "antd";
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
  Label,
  View
} from "bizcharts";
import DataSet from "@antv/data-set";

const scss = require("../../../../styles/scss/sharepage.scss");

interface MonitorProps {
  title?: string;
  engTitle?: string;
  data?: Array<any>;
}

export const MonitorBox = ({ title, engTitle, data }: MonitorProps) => {
  const [page, setPage] = useState(1);
  const [_time, setTime] = useState("");
  useEffect(() => {
    setInterval(() => {
      setTime(moment(new Date()).format("HH:mm:ss"));
    });
  }, []);
  const changePage = key => {
    const num = Math.ceil(data.length / 4);
    if (key == 1) {
      if (page <= 1) {
        setPage(1);
      } else {
        setPage(page - 1);
      }
    } else {
      if (page >= num) {
        setPage(num);
      } else {
        setPage(page + 1);
      }
    }
  };
  return (
    <>
      <div className={scss["monitorTitle"]}>
        <div className={scss["titleL"]}>
          <div>{title}</div>
          <div>{engTitle}</div>
        </div>
        <div className={scss["titleR"]}>
          <div onClick={() => changePage(1)}>
            <Icon type="left" />
          </div>
          <div>
            {page}/{Math.ceil(data.length / 4)}
          </div>
          <div onClick={() => changePage(2)}>
            <Icon type="right" />
          </div>
          <div>
            <Icon type="dash" />
          </div>
        </div>
      </div>
      <div className={scss["monitorData"]}>
        {data.slice(0 + 4 * (page - 1), 4 + 4 * (page - 1)).map(item => {
          return (
            <div key={item.index}>
              <img src={item.imgUrl} alt="" />
              <div className={scss["dataTitle"]}>
                <div>
                  <span className={scss["red"]} />
                  {item.title}
                </div>
                <span>{_time}</span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

interface Child5Props {
  data?: Array<any>;
}

export const Child5Chart = ({ data }: Child5Props) => {
  return (
    <Chart height={240} data={data} padding={[10, 0, 20, 50]} forceFit>
      <Axis
        name="time"
        label={{
          textStyle: {
            fill: "rgba(255, 255, 255, 1)" // 文本的颜色
          }
        }}
      />
      <Axis
        name="number"
        label={{
          textStyle: {
            fill: "rgba(255, 255, 255, 1)" // 文本的颜色
          }
        }}
      />
      <Tooltip />
      <Geom
        type="interval"
        position="time*number"
        color={["time", ["l (90) 0:#02ce7f 1:#00baff"]]}
      />
    </Chart>
  );
};

interface barGraphProps {
  data?: Array<any>;
  max?: number;
}

export const BarGraph = ({ data, max }: barGraphProps) => {
  const ds = new DataSet();
  const dv = ds.createView().source(data);
  dv.source(data).transform({
    type: "sort",
    callback(a, b) {
      // 排序依据，和原生js的排序callback一致
      return a.population - b.population > 0;
    }
  });
  const { Region } = Guide;
  let y = 0;
  const yGap = 0.17;
  return (
    <Chart height={220} padding={[0, 0, 0, 100]} forceFit>
      {data.map(item => {
        y += yGap + 0.001;
        return (
          <View
            start={{
              x: 0,
              y: y
            }}
            end={{
              x: 1,
              y: y + yGap
            }}
            data={[item]}
            scale={{
              population: {
                min: 0,
                max: max ? max : 150,
                nice: false
              }
            }}
          >
            <Coord transpose />
            <Axis
              name="country"
              label={{
                textStyle: {
                  fill: "rgba(255, 255, 255, 1)" // 文本的颜色
                }
              }}
            />
            <Axis name="population" visible={false} />
            <Tooltip />
            <Geom
              type="interval"
              position="country*population"
              color={["country", ["l (0) 0:#00baff 1:#02ce7f"]]}
            >
              <Label
                content="population"
                textStyle={{
                  fill: "#fff",
                  fontSize: "12"
                }}
                offset={10}
              />
            </Geom>
            <Guide>
              <Region
                start={[-0.5, 0]}
                end={[0.5, max ? max : 150]}
                style={{
                  fill: "#FFFFFF",
                  fillOpacity: 0.1
                }}
              />
            </Guide>
          </View>
        );
      })}
    </Chart>
  );
};
