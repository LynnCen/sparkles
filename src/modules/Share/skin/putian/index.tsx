import { CSSProperties, useState, useEffect, useRef } from "react";
import { Drawer, Spin } from "antd";
import WeatherCard from "../../Components/WeatherCard";
import WeatherContext from "../../Components/WeatherContext";
import CardLayout from "../../Components/CardLayout";
import StackedColChart from "../../Components/StackedColChart";
import AvatarFlexCard from "../../Components/AvatarFlexCard";
import TextCard from "../../Components/TextCard";
import CompareDonutChart from "../../Components/CompareDonutChart";
import Overview from "./Overview";
import WaterTarget, { MonitorCard } from "./WaterTarget";
// import { config } from "./config";
import { useInterval } from "../water";
import { templates } from "../../../../config/StrConfig";
import { loadScript } from "../../../../utils/common";

const css = require("../../../../styles/custom.css");
const scss = require("../../../../styles/scss/sharepage.scss");

const vh = px => (px / 1080) * 100 + "vh";

export const changeData = (config, keys) => {
  const change = (item, i, k, obj?) => {
    let delta =
      Number(
        Math.random() >= 0.5 ? item.value < item.limit[1] : item.value > item.limit[0] ? -1 : 0
      ) * item.scale;

    // (k == "sewage" || k == "waterTargets" ? item.scale || 0.01 : 0.1);
    item.hasOwnProperty("change") && (item.change = delta > 0 ? 1 : delta < 0 ? -1 : 0);
    item.value = Number(Number(item.value + delta).toFixed(2));
    if (item.value < item.limit[0] || item.value > item.limit[1]) {
      item.color = "#fffc00";
      item.exceed = true;
    } else {
      item.color = "#fff";
      item.exceed = false;
    }
    if (k == "energyConsumption") {
      obj.data[i + 3].value = 100 - item.value;
    }
  };
  keys.forEach(k => {
    if (k == "energyConsumption") {
      config[k].data
        .filter(e => e.type == "目前负荷")
        .forEach((item, i) => change(item, i, k, config[k]));
    } else if (k == "sewage") {
      config[k].data.forEach(data => data.forEach((item, i) => change(item, i, k)));
    }
    // else if (k == "waterTargets") {
    //   config[k].data.forEach(data =>
    //     data.data.forEach((item, i) => change(item, i, k))
    //   );
    // }
  });
  return config;
};
interface WaterProps {
  visible: boolean;
  address: string;
  template: string;
}
export default function PutianSkin({ visible, address, template }: WaterProps) {
  const [config, setConfig] = useState(null);
  const [weaData, setWeatherData] = useState(null);
  const [region, setRegion] = useState(null);
  const [environment, setEnvironment] = useState(null);
  useEffect(() => {
    !config &&
      loadScript(templates[template].configPath, template, "module")
        .then(({ config }) => (setConfig(config), setEnvironment(config.environment)))
        .catch(console.table);
  }, []);
  useEffect(
    () => {
      if (weaData && environment) {
        const { tem, humidity, air, win } = weaData[0];
        const values = [tem, humidity, air, win];
        setEnvironment(
          environment.map((item, i) => ({
            ...item,
            value: values[i]
          }))
        );
      }
      weaData &&
        !config.waterTargets.data.length &&
        fetch(templates[template].regionPath)
          .then(res => res.json())
          .then(res => {
            setRegion(res);
            config.region = res;
            const sample = config.waterTargets.sample;
            res;
            Object.keys(res).forEach(town => {
              res[town].forEach(village => {
                config.waterTargets.data.push({
                  town,
                  village,
                  data: sample.data.map(item => ({
                    ...item
                  }))
                });
              });
            });
          })
          .catch(err => console.log(err));
    },
    [weaData]
  );

  useInterval(() => {
    config &&
      setConfig({
        // ...config,
        ...changeData(config, ["energyConsumption", "waterTargets"])
      });
  }, 1000);

  return (
    <>
      <Drawer
        placement="left"
        closable={false}
        maskClosable={false}
        mask={false}
        width={420}
        className={
          scss["drawer-content"] + " " + scss["drawer-left"] + " " + scss["waterSkin"]
          // scss["pe-none"]
        }
        visible={visible}
      >
        <div className={scss["left"]}>
          {config ? (
            <>
              {/* <AvatarCard
            title={config.overview.title}
            // enTitle={config.overview.enTitle}
            suffixIcon={
              <div
                className={scss["transparent"]}
                style={{ display: "flex", alignItems: "end" }}
              >
                <span>{config.overview.suffix.name}：</span>
                <span className={scss["value"]}>
                  {config.overview.suffix.value}
                </span>
                <span>{config.overview.suffix.unit}</span>
              </div>
            }
            data={config.overview.data}
            colWidth={[132, 132, 116]}
            rowHeight={96}
            imgHeight={32}
            center={true}
          ></AvatarCard> */}
              <Overview style={{ marginBottom: vh(42) }} {...config.overview} />

              <CardLayout title={"设备运行指标"} style={{ marginBottom: vh(46) }} className={""}>
                <div style={{}}>
                  <CompareDonutChart
                    data={config.runTargets}
                    colors_pie={["#02d281", "#00baff", "#f8ca4f", "#ff5000"]}
                    legend={{
                      useHtml: true
                    }}
                    chartHeight={150}
                    chartPadding={[18, 0, 37, 0]}
                    colTitle={{ offsetY: 120 }}
                    style={{ margin: `${vh(-10)} 0 ${vh(24)} 0` }}
                  />

                  {/* <h4 style={{ textAlign: "left", marginBottom: vh(15) }}>
                {config.energyConsumption.title}
              </h4> */}
                  <StackedColChart
                    transpose={true}
                    data={config.energyConsumption.data}
                    chartPadding={[0, 0, 24, 72]}
                    chartHeight={118}
                    theme={config.energyConsumption.theme}
                    legend={{ offsetY: -20 }}
                    geomColor={["type", ["l (0) 0:#02ce7f 1:#00baff", "#ffffff4c"]]}
                    geomLabel={{
                      content: [
                        "type*x*value",
                        (type, x, value) => {
                          return type == "目前负荷"
                            ? value + (value % 1 == 0 ? ".0" : "") + "%"
                            : "";
                        }
                      ],
                      offset: -3,
                      textStyle: { fill: "#fff" }
                    }}
                  />
                </div>
              </CardLayout>

              {/* <PhotoCard
            title={"实时视频监控"}
            data={config.monitors}
            style={{ width: "363px", marginBottom: vh(40) }}
            thumbnailHeight={95}
            columnGap={13}
            mask={false}
            template="water"
          ></PhotoCard> */}
              <MonitorCard {...config.monitors} region={region} />
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
        width={416}
        className={
          scss["drawer-content"] + " " + scss["drawer-right"] + " " + scss["waterSkin"]
          // scss["pe-none"]
        }
        visible={visible}
      >
        <div className={scss["right"]}>
          {config && environment ? (
            <>
              <WeatherContext.Provider value={{ weaData }}>
                <WeatherCard title={"环境监测"} address={address} setWeatherData={setWeatherData} />
                <AvatarFlexCard data={environment} style={{ marginBottom: vh(35) }} />
              </WeatherContext.Provider>
              <WaterTarget
                {...config.waterTargets}
                region={region}
                style={{ marginBottom: vh(10) }}
              />
              <div style={{ marginBottom: vh(35), position: "relative" }}>
                <h4 style={{ marginBottom: vh(8) }}>{config.waterTargets.proportion.title}</h4>
                <StackedColChart
                  transpose={true}
                  data={config.waterTargets.proportion.data}
                  chartPadding={[0, 45, 0, 35]}
                  chartHeight={30}
                  theme={config.energyConsumption.theme}
                  legend={{
                    useHtml: true,
                    "g2-legend-marker": {
                      background: "linear-gradient(90deg, #02ce7f 0%, #00baff 100%)"
                    }
                  }}
                  geomColor={["type", ["l (0) 0:#02ce7f 1:#00baff", "#ffffff4c"]]}
                  geomLabel={{
                    offset: -1,
                    textStyle: { fill: "#fff" }
                  }}
                />
                <h5 style={{ position: "absolute", right: 0, top: vh(33) }}>
                  {config.waterTargets.proportion.value * 100 + "%"}
                </h5>
              </div>

              <CardLayout
                title={config.sewage.title}
                suffixIcon={
                  <div
                    className={scss["transparent"]}
                    style={{ display: "flex", alignItems: "end" }}
                  >
                    <span>{config.sewage.suffix.name}：</span>
                    {/* <span className={scss["value"]}>{config.sewage.suffix.value}</span> */}
                    <span>{config.sewage.suffix.unit}</span>
                  </div>
                }
                style={{ marginBottom: vh(6) }}
              >
                {config.sewage.data.map((item, i) => (
                  <div key={i}>
                    <TextCard
                      data={item}
                      color="#22d8ff"
                      // itemWidth={97}
                      // style={{ width: "317px" }}
                      // arrowIcon={true}
                      style={{ marginBottom: vh(i == 0 ? 6 : 0) }}
                    />
                  </div>
                ))}
              </CardLayout>
              <div style={{ marginBottom: vh(20), position: "relative" }}>
                <h4 style={{ marginBottom: vh(8) }}>{config.sewage.proportion.title}</h4>
                <StackedColChart
                  transpose={true}
                  data={config.sewage.proportion.data}
                  chartPadding={[0, 45, 0, 35]}
                  chartHeight={30}
                  theme={config.energyConsumption.theme}
                  legend={{
                    useHtml: true,
                    "g2-legend-marker": {
                      background: "linear-gradient(90deg, #02ce7f 0%, #00baff 100%)"
                    }
                  }}
                  geomColor={["type", ["l (0) 0:#02ce7f 1:#00baff", "#ffffff4c"]]}
                  geomLabel={{
                    content: [
                      "type*x*value",
                      (type, x, value) =>
                        type == "日均处理量" ? value + (value % 1 == 0 ? "m³" : "") : ""
                    ],
                    offset: -3,
                    textStyle: { fill: "#fff" }
                  }}
                />
                <h5 style={{ position: "absolute", right: 0, top: vh(27) }}>
                  {config.sewage.proportion.value * 100 + "%"}
                </h5>
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
