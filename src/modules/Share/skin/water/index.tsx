import { useState, useEffect, useRef } from "react";
import { Drawer, Spin } from "antd";
import AvatarCard from "../../Components/AvatarCard";
import ProgressLineCard from "../../Components/ProgressLineCard";
import PhotoCard from "../../Components/PhotoCard";
import WeatherCard from "../../Components/WeatherCard";
import CardLayout from "../../Components/CardLayout";
import StackedColChart from "../../Components/StackedColChart";
import AvatarFlexCard from "../../Components/AvatarFlexCard";
import TextCard from "../../Components/TextCard";
import CompareDonutChart from "../../Components/CompareDonutChart";
import { templates } from "../../../../config/StrConfig";

const css = require("../../../../styles/custom.css");
const scss = require("../../../../styles/scss/sharepage.scss");

const vh = px => (px / 1080) * 100 + "vh";

export const changeData = (_config, keys) => {
  const change = (item, i, k, _config?) => {
    let isPositive =
      (Math.random() >= 0.5 &&
        item.value < item.limit[1] &&
        item.value > item.limit[0]) ||
      item.value <= item.limit[0] ||
      item.value > item.limit[1];
    let delta =
      (isPositive ? 1 : -1) *
      (k === "waterTargets" || k === "bridgeTargets" ? item.scale || 0.01 : 1);
    k === "waterTargets" && (item.change = isPositive);
    item.value =
      Math.abs(delta) < 0.2
        ? Number(Number(item.value + delta).toFixed(2))
        : Number(Number(item.value + delta).toFixed(2));
    if (k == "energyConsumption") {
      _config[k].data[i + 3].value = 100 - item.value;
    }
  };
  keys.forEach(k => {
    if (k == "energyConsumption") {
      _config[k].data
        .filter(e => e.type == "负荷余量")
        .forEach((item, i) => change(item, i, k, _config));
    } else if (k == "waterTargets") {
      _config[k].data.forEach(data => {
        data.data.forEach((item, i) => change(item, i, k));
      });
    } else {
      _config[k].data.forEach((item, i) => change(item, i, k));
    }
  });
  return _config;
};
interface WaterProps {
  visible: boolean;
  address: string;
  template: string;
}
export default function WaterSkin({ visible, address, template }: WaterProps) {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    fetch(templates[template].configPath)
      .then(r => r.json())
      .then(setConfig)
      .catch(console.table);
  }, []);

  useInterval(() => {
    config &&
      setConfig({
        ...config,
        ...changeData(config, [
          "energyConsumption",
          "waterTargets",
          "bridgeTargets"
        ])
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
          scss["drawer-content"] + " " + scss["drawer-left"] + " "
          // scss["pe-none"]
        }
        visible={visible}
      >
        <div className={scss["left"]}>
          {config ? (
            <>
              <AvatarCard
                // title={config.overview.title}
                // enTitle={config.overview.enTitle}
                data={config.overview}
                colWidth={[132, 132, 116]}
                rowHeight={96}
                style={{ margin: `${vh(-10)} 0 ${vh(24)} 0` }}
                imgHeight={32}
                center={true}
              />

              <PhotoCard
                title={"实时视频监控"}
                data={config.monitors}
                style={{ width: "363px", marginBottom: vh(40) }}
                thumbnailHeight={95}
                columnGap={13}
                mask={false}
                template="water"
              />

              <CardLayout title={"设备运行指标"}>
                <div style={{ display: "flex" }}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr",
                      gridAutoRows: vh(105),
                      gridColumnGap: vh(24),
                      marginRight: "30px"
                    }}
                  >
                    {config.runTargets.map((item, i) => (
                      <div style={{}}>
                        <CompareDonutChart
                          data={item}
                          legend={
                            i == config.runTargets.length - 1 && { offsetY: 30 }
                          }
                          chartPadding={[5, 0, 150, 0]}
                        />
                      </div>
                    ))}
                  </div>
                  <div style={{}}>
                    <h4 style={{ textAlign: "center" }}>
                      {config.energyConsumption.title}
                    </h4>
                    <StackedColChart data={config.energyConsumption.data} />
                  </div>
                </div>
              </CardLayout>
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
        className={scss["drawer-content"] + " " + scss["drawer-right"] + " "}
        visible={visible}
      >
        <div className={scss["right"]}>
          {config ? (
            <>
              <WeatherCard title={"环境监测"} address={address} />

              <AvatarFlexCard
                data={config.environment}
                style={{ marginBottom: vh(45) }}
              />

              <TextCard
                title={config.bridgeTargets.title}
                data={config.bridgeTargets.data}
                color="#80ff3c"
                style={{ marginBottom: vh(55) }}
              />

              <ProgressLineCard
                title={
                  <div className={css["flex-center-between"]}>
                    {"进出口水质"}
                    <div
                      className={scss["center"]}
                      style={{
                        display: "inline-block",
                        lineHeight: "15px",
                        height: "24px"
                      }}
                    >
                      {config.qualities.catagories.map((item, i) => (
                        <span
                          style={{
                            backgroundColor: item.color,
                            fontSize: "10px",
                            display: "inline-block",
                            width: "36px"
                          }}
                        >
                          {item.name}
                        </span>
                      ))}
                    </div>
                  </div>
                }
                style={{ marginBottom: vh(45) }}
                className={""}
                data={config.qualities.data}
                format={true}
              />

              <CardLayout title={config.waterTargets.title}>
                {config.waterTargets.data.map((item, i) => (
                  <div className={css["flex"]} style={{ marginBottom: vh(20) }}>
                    <h2
                      className={scss["yahei"]}
                      style={{ color: "white", marginRight: "14px" }}
                    >
                      {item.name}
                    </h2>
                    <TextCard
                      data={item.data}
                      color="#22d8ff"
                      itemWidth={97}
                      style={{ width: "317px" }}
                      arrowIcon={true}
                    />
                  </div>
                ))}
              </CardLayout>
            </>
          ) : (
            <Spin size="large" />
          )}
        </div>
      </Drawer>
    </>
  );
}

export function useInterval(callback, delay) {
  const savedCallback = useRef();
  // Remember the latest function.
  useEffect(
    () => {
      savedCallback.current = callback;
    },
    [callback]
  );

  // Set up the interval.
  let id;
  useEffect(
    () => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    },
    [delay]
  );
  return id;
}
