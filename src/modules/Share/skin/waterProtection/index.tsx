import { useEffect, useState } from "react";
import { Drawer, Spin } from "antd";
import { templates } from "../../../../config/StrConfig";
import StackedColChart from "../../Components/StackedColChart";
import MonitorCard from "../../Components/MonitorCard";
import WeatherContext from "../../Components/WeatherContext";
import WeatherCard2 from "../../Components/WeatherCard2";
import CardLayout from "../../Components/CardLayout";
import TextCard from "../../Components/TextCard";
import { useInterval } from "../water";
import { Chart, Geom, Axis, Coord, Guide } from "bizcharts";
import DataSet from "@antv/data-set";

const css = require("../../../../styles/custom.css");
const scss = require("../../../../styles/scss/sharepage.scss");

let vh = px => (px / 1080) * 100 + "vh";

export const changeData = (config, keys) => {
  const change = (item, i, k, obj?) => {
    if (k == "child3R") {
      let isPositive =
        (Math.random() >= 0.5 &&
          item.value < item.limit[1] &&
          item.value > item.limit[0]) ||
        item.value <= item.limit[0] ||
        item.value > item.limit[1];
      let delta2 =
        (isPositive ? 1 : -1) * (k === "child3R" ? item.scale || 0.01 : 1);
      k === "child3R" && (item.change = isPositive);
      item.value =
        Math.abs(delta2) < 0.2
          ? Number(Number(item.value + delta2).toFixed(2))
          : Number(Number(item.value + delta2).toFixed(2));
    } else {
      let delta =
        Number(
          Math.random() >= 0.5
            ? item.value < item.limit[1]
            : item.value > item.limit[0]
              ? -1
              : 0
        ) * item.scale;

      item.hasOwnProperty("change") &&
        (item.change = delta > 0 ? 1 : delta < 0 ? -1 : 0);
      item.value = Number(Number(item.value + delta).toFixed(2));
      if (item.value < item.limit[0] || item.value > item.limit[1]) {
        item.color = "#fffc00";
        item.exceed = true;
      } else {
        item.color = "#fff";
        item.exceed = false;
      }
      if (k == "child4R") {
        obj.data[i + 2].value = item.value > 100 ? 0 : 100 - item.value;
        obj.data[i + 4].value =
          item.value > 110
            ? 110 - item.value
            : 110 - item.value - obj.data[i + 2].value;
      } else if (k == "child5R") {
        obj.data[i + 2].value = item.value > 100 ? 0 : 100 - item.value;
        obj.data[i + 4].value =
          item.value > 110
            ? 110 - item.value
            : 110 - item.value - obj.data[i + 2].value;
      }
    }
  };
  keys.forEach(k => {
    if (k == "child3R") {
      config[k].data.forEach(data =>
        data.data.forEach((item, i) => change(item, i, k))
      );
    } else if (k == "child4R") {
      config[k].data
        .filter(e => e.type == "现场值")
        .forEach((item, i) => {
          if (i < 2) {
            change(item, i, k, config[k]);
          }
        });
    } else if (k == "child5R") {
      config[k].data
        .filter(e => e.type == "现场值")
        .forEach((item, i) => {
          if (i < 2) {
            change(item, i, k, config[k]);
          }
        });
    }
    // else if (k == "sewage") {
    //   config[k].data.forEach(data =>
    //     data.forEach((item, i) => change(item, i, k))
    //   );
    // }
  });
  return config;
};

interface Props {
  visible: boolean;
  template: string;
}
export default function WaterProtection({ visible, address, template }: Props) {
  const [config, setConfig] = useState(null);
  const [state, setState] = useState({});
  const [weaData, setWeatherData] = useState(null);
  const [environment, setEnvironment] = useState(null);
  useEffect(() => {
    fetch(templates[template].configPath)
      .then(r => r.json())
      .then(config => setConfig(config))
      .catch(console.table);
  }, []);
  useEffect(
    () => {
      if (weaData) {
        const { tem, humidity, air, win } = weaData[0];
        const values = [tem, humidity, air, win];
        setConfig({
          ...config,
          child1R: config.child1R.map((item, i) => ({
            ...item,
            value: values[i]
          }))
        });
      }
    },
    [weaData]
  );

  useInterval(() => {
    config &&
      setConfig({
        // ...config,
        ...changeData(config, ["child3R", "child4R", "child5R"])
      });
  }, 30000);

  return (
    <>
      <Drawer
        placement="left"
        closable={false}
        maskClosable={false}
        mask={false}
        width={420}
        className={
          scss["drawer-content"] +
          " " +
          scss["drawer-left"] +
          " " +
          scss["waterProtectionL"]
          //  +
          // " " +
          // scss["pe-none"]
        }
        visible={visible}
      >
        <div className={scss["left"]}>
          {config ? (
            <>
              <div className={scss["child1"]}>
                <div className={scss["childTitle"]}>{config.child1L.title}</div>
                <div className={scss["childContent"]}>
                  {config.child1L.content.map((item, index) => {
                    return (
                      <div key={item.key} className={scss["contentBox"]}>
                        <div className={scss["imageAndLocation"]}>
                          <img src={item.img} alt="" />
                          <div>{item.location}</div>
                        </div>
                        <div className={scss["child1Data"]}>
                          <div>
                            {item.number1}
                            <span>{item.unit1}</span>
                          </div>
                          <div>
                            {item.number2}
                            <span>{item.unit2}</span>
                          </div>
                        </div>
                        <Charts data={item.data} />
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className={scss["child2"]}>
                <div className={scss["childTitle"]}>{config.child2L.title}</div>
                <div className={scss["childContent"]}>
                  <div>
                    {config.child2L.data1.map(item => {
                      return (
                        <div key={item.type}>
                          <img src={item.img} alt="" />
                          <div className={scss["text"]}>
                            <div>
                              {item.number}
                              <span>人</span>
                            </div>
                            <div>{item.type}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div>
                    <img src={config.child2L.img} alt="" />
                    <div>
                      {config.child2L.data2.map(item => {
                        return (
                          <div className={scss["text"]} key={item.type}>
                            <div>
                              {item.number}
                              <span>人</span>
                            </div>
                            <div>{item.type}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <div className={scss["child3"]}>
                <div className={scss["childTitle"]}>{config.child3L.title}</div>
                <div className={scss["childContent"]}>
                  {config.child3L.data.map(item => {
                    return (
                      <div>
                        <img src={item.img} alt="" />
                        <div className={scss["text"]}>
                          <div>
                            {item.number}
                            <span>{item.unit}</span>
                          </div>
                          <div>{item.type}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
              <Spin size="large" />
            )}
        </div>
      </Drawer>
      <Drawer
        placement="right"
        closable={false}
        mask={false}
        width={410}
        style={{ width: "auto" }}
        className={
          scss["drawer-content"] +
          " " +
          scss["drawer-right"] +
          " " +
          scss["waterProtectionR"]
          // +" " +
          // scss["pe-none"]
        }
        visible={visible}
      >
        <div className={scss["right"]}>
          {config ? (
            <>
              <div className={scss["child1"]}>
                <WeatherContext.Provider value={{ weaData }}>
                  <WeatherCard2
                    title={"天气情况"}
                    address={address}
                    setWeatherData={setWeatherData}
                  />
                </WeatherContext.Provider>
              </div>
              <div className={scss["child2"]}>
                <div className={scss["childTitle"]}>{config.child2R.title}</div>
                <MonitorCard
                  data={config.child2R.data}
                  mask={false}
                  style={{ marginBottom: "25px" }}
                />
              </div>
              <div className={scss["child3"]}>
                <CardLayout title={config.child3R.title}>
                  {config.child3R.data.map((item, i) => (
                    <div
                      className={css["flex"]}
                      style={{ marginBottom: vh(20) }}
                    >
                      <h2
                        className={scss["yahei"]}
                        style={{
                          color: "white",
                          marginRight: "10px",
                          maxWidth: "60px",
                          height: "60px",
                          padding: "15px 0"
                        }}
                      >
                        {item.name}
                      </h2>
                      <TextCard
                        data={item.data}
                        color="#22D8FF"
                        itemWidth={97}
                        style={{ width: "317px" }}
                        arrowIcon={true}
                      />
                    </div>
                  ))}
                </CardLayout>
              </div>
              <div className={scss["child4"]}>
                <div className={scss["childTitle"]}>
                  基坑监测
                  <div>
                    <img src={config.child2R.titleImg} alt="" />
                  </div>
                </div>
                <StackedColChart
                  transpose={true}
                  data={config.child4R.data}
                  chartPadding={[35, 0, 0, 72]}
                  chartHeight={100}
                  theme={config.child4R.theme}
                  legend={{ offsetY: -122, offsetX: 160 }}
                  geomColor={[
                    "type*value",
                    (type, value) => {
                      return type == "现场值"
                        ? value > 100
                          ? "#FF0505"
                          : "l (0) 0:#02ce7f 1:#00baff"
                        : type == "限制值"
                          ? "#02d2822f"
                          : "#ffffff4c";
                    }
                  ]}
                  geomLabel={{
                    content: [
                      "type*x*value",
                      (type, x, value) => {
                        return type == "现场值"
                          ? value + (value % 1 == 0 ? ".0" : "") + "%"
                          : "";
                      }
                    ],
                    offset: -3,
                    textStyle: { fill: "#fff" }
                  }}
                />
              </div>
              <div className={scss["child5"]}>
                <div className={scss["childTitle"]}>围堰监测</div>
                <StackedColChart
                  transpose={true}
                  data={config.child5R.data}
                  chartPadding={[35, 0, 0, 72]}
                  chartHeight={100}
                  theme={config.child5R.theme}
                  legend={{ offsetY: -122, offsetX: 160 }}
                  geomColor={[
                    "type*value",
                    (type, value) => {
                      return type == "现场值"
                        ? value > 100
                          ? "#FF0505"
                          : "l (0) 0:#02ce7f 1:#00baff"
                        : type == "限制值"
                          ? "#02d2822f"
                          : "#ffffff4c";
                    }
                  ]}
                  geomLabel={{
                    content: [
                      "type*x*value",
                      (type, x, value) => {
                        return type == "现场值"
                          ? value + (value % 1 == 0 ? ".0" : "") + "%"
                          : "";
                      }
                    ],
                    offset: -3,
                    textStyle: { fill: "#fff" }
                  }}
                />
              </div>
            </>
          ) : (
              <Spin size="large" />
            )}
        </div>
      </Drawer>
    </>
  );
}

const Charts = ({ data }) => {
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
    <>
      <Chart width={80} height={80} data={dv} padding={[0, 0, 0, 0]} forceFit>
        <Coord type={"theta"} radius={0.9} innerRadius={0.85} />
        <Axis name="percent" />
        <Guide>
          <Html
            position={["50%", "50%"]}
            html={`<div style="color:#ffff;font-size:22px;display:flex;flex-direction:column;align-items:center;">${data[0].count
              }<span style="font-size:12px">%</span></div>`}
          />
        </Guide>
        <Geom
          type="intervalStack"
          position="percent"
          color={["item", ["#0cceac", "#ffffff40"]]}
          tooltip={["item*percent"]}
        />
      </Chart>
    </>
  );
};
