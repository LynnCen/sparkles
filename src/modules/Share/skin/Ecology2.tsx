import { useEffect, useState } from "react";
import { Drawer } from "antd";
import AvatarCard from "../Components/AvatarCard";
import AvatarFlexCard from "../Components/AvatarFlexCard";
import DonutChart from "../Components/DonutChart";
import StackedColChart from "../Components/StackedColChart";
import CardLayout from "../Components/CardLayout";
import CompareDonutChart from "../Components/CompareDonutChart";
import MonitorCard from "../Components/MonitorCard";
import { changeData } from "./water";
import { templates } from "../../../config/StrConfig";
import { loadScript } from "../../../utils/common";

const css = require("../../../styles/custom.css");
const scss = require("../../../styles/scss/sharepage.scss");

let vh = px => (px / 1080) * 100 + "vh";

interface Props {
  visible: boolean;
  template: string;
}

export default function Ecology2Skin({ visible, template }: Props) {
  const [config, setConfig] = useState(null);
  useEffect(
    () => {
      !config &&
        loadScript(templates[template].configPath, "ecology2", "module")
          .then(({ config }) => setConfig(config))
          .catch(console.table);
      if (config && Object.keys(config).length) {
        setInterval(
          () => setConfig({ ...changeData(config, ["energyConsumption"]) }),
          1000
        );
      }
    },
    [config ? Object.keys(config).length : 0]
  );

  return (
    config && (
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
            scss["ecologySkin"] +
            " " +
            scss["pe-auto"]
          }
          visible={visible}
        >
          <div className={scss["left"]}>
            <AvatarFlexCard
              {...config.atmosphere}
              style={{ marginBottom: vh(60) }}
              suffixIcon={
                <div
                  className={scss["transparent"]}
                  style={{ display: "flex", alignItems: "end" }}
                >
                  <span>{config.atmosphere.suffix.name}：</span>
                  <span className={scss["value"]}>
                    {config.atmosphere.suffix.value}
                  </span>
                  <span>{config.atmosphere.suffix.unit}</span>
                </div>
              }
            />

            <CardLayout
              title={"设备运行指标"}
              style={{ marginBottom: vh(40) }}
              className={""}
            >
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
                    <div style={{}} key={i}>
                      <CompareDonutChart
                        data={item}
                        legend={
                          i == config.runTargets.length - 1 && { offsetY: 20 }
                        }
                        chartPadding={[5, 0, 140, 0]}
                        colors_pie={[
                          "#00baff",
                          "#02d281",
                          "#f8ca4f",
                          "#ff5000"
                        ]}
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
            <MonitorCard
              {...config.monitors}
              prefixIcon={<img src={config.monitors.icon} />}
              data={config.monitors.data[0]}
              mask={false}
            />
          </div>
        </Drawer>
        <Drawer
          placement="right"
          closable={false}
          mask={false}
          width={416}
          className={
            scss["drawer-content"] +
            " " +
            scss["drawer-right"] +
            " " +
            scss["ecologySkin"] +
            " " +
            scss["pe-auto"]
          }
          visible={visible}
        >
          <div className={scss["right"]}>
            <AvatarCard
              {...config.sewage}
              suffixIcon={
                <div
                  className={scss["transparent"]}
                  style={{ display: "flex", alignItems: "end" }}
                >
                  <span>{config.sewage.suffix.name}：</span>
                  <span className={scss["value"]}>
                    {config.sewage.suffix.value}
                  </span>
                  <span>{config.sewage.suffix.unit}</span>
                </div>
              }
              imgHeight={32}
              flex={true}
              style={{ marginBottom: vh(24) }}
            />
            <MonitorCard
              {...config.monitors}
              prefixIcon={<img src={config.monitors.icon} />}
              data={config.monitors.data[1]}
              mask={false}
              style={{ marginBottom: vh(45) }}
            />
            <CardLayout
              {...config.conservancy}
              suffixIcon={
                <div
                  className={scss["transparent"]}
                  style={{ display: "flex", alignItems: "end" }}
                >
                  <span>{config.conservancy.suffix.name}：</span>
                  <span className={scss["value"]}>
                    {config.conservancy.suffix.value}
                  </span>
                  <span>{config.conservancy.suffix.unit}</span>
                </div>
              }
              style={{}}
              className={""}
            >
              <div className={scss["flex"]}>
                {config.conservancy.data.map((item, i) => (
                  <DonutChart
                    data={item}
                    colors_pie={["#00baff", "#02d281", "#f8ca4f", "#ff5000"]}
                    style={{ marginTop: "-5px" }}
                  />
                ))}
              </div>
            </CardLayout>
            <MonitorCard
              {...config.monitors}
              prefixIcon={<img src={config.monitors.icon} />}
              data={config.monitors.data[2]}
              mask={false}
            />
          </div>
        </Drawer>
      </>
    )
  );
}
