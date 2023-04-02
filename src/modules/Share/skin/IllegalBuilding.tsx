import { useState, useEffect, useRef } from "react";
import { Drawer, Progress, Spin } from "antd";
import RectChartCard from "../Components/RectChartCard";
import CardLayout from "../Components/CardLayout";
import ScrollCard from "../Components/ScrollCard";
// import { config as _config } from "./wfjzConfig";
import { scroll } from "../Components/ScrollCard";
import { templates } from "../../../config/StrConfig";

// const css = require("../../../styles/custom.css");
const scss = require("../../../styles/scss/sharepage.scss");
let vh = px => (px / 1080) * 100 + "vh";

interface Props {
  visible: boolean;
  template: string;
}
export default function IllegalBuilding({ visible, template }: Props) {
  const scrollBox = useRef();
  const [config, setConfig] = useState(null);

  useEffect(
    () => {
      !config &&
        fetch(templates[template].configPath)
          .then(r => r.json())
          .then(setConfig)
          .catch(console.table);
      if (config && Object.keys(config).length) {
        setInterval(tick, 2000);
        scroll("#scroll-box0", config.streets.data, data =>
          setConfig({ ...config, streets: { ...config.streets, data } })
        );
      }
    },
    [config ? Object.keys(config).length : 0]
  );

  const tick = () => {
    ["overview", "streets"].forEach(k => {
      let data = config[k].data.map((item, i) => {
        let isPositive =
          (Math.random() >= 0.5 && item.value < item.max && item.value > 0) ||
          item.value <= 0 ||
          item.value > item.max;
        let delta = (isPositive ? 1 : -1) * 0.01;
        item.value =
          Math.abs(delta) < 0.1
            ? Number(Number(item.value + delta).toFixed(2))
            : item.value + delta;
        return item;
      });
      setConfig({ ...config, [k]: { ...config[k], data } });
    });
  };

  return (
    <>
      <Drawer
        placement="left"
        closable={false}
        maskClosable={false}
        mask={false}
        width={300}
        className={
          scss["drawer-content"] +
          " " +
          scss["drawer-left"] +
          " " +
          scss["pe-none"]
        }
        visible={visible}
      >
        {config ? (
          <div className={scss["left"]}>
            <CardLayout
              style={{ marginBottom: vh(94) }}
              className={" " + scss["pe-auto"]}
            >
              <div
                className={scss["avatar-grid"]}
                style={{
                  gridTemplateColumns: "250px",
                  gridTemplateRows: "auto",
                  gridRowGap: vh(48)
                }}
              >
                {config.overview.data.map((item, i) => (
                  <div className={scss["item"]} key={i}>
                    <div className={scss["icon"]}>
                      <span>
                        <img
                          src={item.icon}
                          style={{
                            width: "42px",
                            height: "auto"
                          }}
                        />
                      </span>
                    </div>
                    <div style={{ width: i < 3 ? "auto" : "182px" }}>
                      <h4 style={{ lineHeight: "14px", height: "auto" }}>
                        {item.name}
                      </h4>
                      <div
                        className={i < 3 ? scss["flex"] : ""}
                        style={{ alignItems: "flex-end", marginTop: "7px" }}
                      >
                        {i < 3 ? (
                          <>
                            <h1 style={{ marginRight: "9px" }}>{item.value}</h1>
                            <h4 style={{ height: "auto", width: "100%" }}>
                              {item.unit}
                            </h4>
                          </>
                        ) : (
                          <>
                            <Progress
                              strokeWidth={12}
                              strokeColor={"#fff445"}
                              status="active"
                              showInfo={false}
                              percent={parseInt(item.value * 100)}
                            />
                            <h1 style={{ color: "#fff445" }}>
                              {parseInt(item.value * 100)}
                              {item.unit}
                            </h1>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardLayout>
            <CardLayout
              style={{ height: vh(250) }}
              className={
                scss["progress-line-card"] +
                " " +
                scss["pe-auto"] +
                " " +
                scss["hide-scrollbar"]
              }
            >
              <div
                className={""}
                id="scroll-box0"
                ref={scrollBox}
                style={{
                  position: "absolute",
                  width: "243px"
                }}
              >
                {config.streets.data.map((item, i) => (
                  <div
                    className={scss[""]}
                    key={i}
                    style={{
                      paddingBottom: vh(40)
                    }}
                  >
                    <div
                      className={scss["flex"]}
                      style={{
                        alignItems: "flex-end"
                      }}
                    >
                      <h4
                        style={{
                          marginRight: "9px",
                          color: "rgba(255,255,255,0.8)"
                        }}
                      >
                        {item.name}
                      </h4>
                      <h1
                        style={{ marginRight: "9px", width: "auto" }}
                        className={scss["arial"]}
                      >
                        {item.value}
                      </h1>
                      <h5 style={{ marginBottom: 0 }}>{item.unit}</h5>
                    </div>
                    <Progress
                      strokeColor={"#16f4ad"}
                      status="active"
                      showInfo={false}
                      percent={(item.value / item.max) * 1.0 * 100}
                      format={percent => parseInt((percent / 100) * item.max)}
                    />
                  </div>
                ))}
              </div>
            </CardLayout>
          </div>
        ) : (
          <Spin size="large" />
        )}
      </Drawer>
      <Drawer
        placement="right"
        closable={false}
        mask={false}
        width={504}
        className={
          scss["drawer-content"] +
          " " +
          scss["drawer-right"] +
          " " +
          scss["pe-none"]
        }
        visible={visible}
      >
        {config ? (
          <div className={scss["right"]}>
            <RectChartCard
              title={config.statistics.title}
              enTitle={config.statistics.enTitle}
              placement="horizontal"
              data={config.statistics.data}
              chartHeight={210}
              style={{ marginBottom: vh(60) }}
            />

            <ScrollCard
              title={config.inspectionList.title}
              enTitle={config.inspectionList.enTitle}
              data={config.inspectionList.data}
              placement="horizontal"
            />
          </div>
        ) : (
          <Spin size="large" />
        )}
      </Drawer>
    </>
  );
}
