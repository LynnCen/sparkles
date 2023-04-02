import { useState, useEffect } from "react";
import { Drawer, Carousel, Spin } from "antd";
import CardLayout from "../../Components/CardLayout";
import PhotoCard from "../../Components/PhotoCard";
import RightList from "./RightList";
// import { config } from "./config";
import { feature } from "../../Components/Header";
import { templates } from "../../../../config/StrConfig";

const css = require("../../../../styles/custom.css");
const scss = require("../../../../styles/scss/sharepage.scss");

let vh = px => (px / 1080) * 100 + "vh";

interface Props {
  visible: boolean;
  template: string;
}
export default function GongAn({ visible, template }: Props) {
  const [config, setConfig] = useState(null);
  useEffect(() => {
    fetch(templates[template].configPath)
      .then(r => r.json())
      .then(setConfig)
      .catch(console.table);
  }, []);
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
          scss["emergencySkin"] +
          " " +
          scss["pe-none"]
        }
        visible={visible}
      >
        <div className={scss["left"]}>
          {config ? (
            <>
              <CardLayout
                title={config.overview.title}
                enTitle={config.overview.enTitle}
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
                style={{ marginBottom: vh(50) }}
              >
                {config.overview.data.map((item, i) => (
                  <h4 style={{ marginBottom: vh(16) }}>
                    {item.name}
                    <span
                      style={{
                        color: item.color || "#fff",
                        fontWeight: item.color ? "bold" : "lighter"
                      }}
                    >
                      {item.value}
                    </span>
                  </h4>
                ))}
              </CardLayout>

              <PhotoCard
                title={config.monitors.title}
                enTitle={config.monitors.enTitle}
                suffixIcon={
                  <div
                    className={scss["transparent"]}
                    style={{ display: "flex", alignItems: "end" }}
                  >
                    <span>{config.monitors.suffix.name}：</span>
                    <span className={scss["value"]}>
                      {config.monitors.suffix.value}
                    </span>
                    <span>{config.monitors.suffix.unit}</span>
                  </div>
                }
                data={config.monitors.data}
                // style={{ width: "380px" }}
                mask={false}
                style={{ marginBottom: vh(57) }}
              />

              <CardLayout
                title={config.communication.title}
                enTitle={config.communication.enTitle}
                suffixIcon={
                  <div
                    className={scss["transparent"]}
                    style={{ display: "flex", alignItems: "end" }}
                  >
                    <span>{config.communication.suffix.name}：</span>
                    <span className={scss["value"]}>
                      {config.communication.suffix.value}
                    </span>
                    <span>{config.communication.suffix.unit}</span>
                  </div>
                }
              >
                <Carousel
                  autoplay
                  autoplaySpeed={1000}
                  infinite={true}
                  dots={false}
                  dotPosition={"right"}
                  // vertical={true}
                  verticalSwiping={true}
                  slidesToShow={7}
                >
                  {config.communication.data.map((e, i) => (
                    <div key={i}>
                      <div
                        className={
                          scss["flex-between"] + " " + scss["list-hover"]
                        }
                        style={{
                          opacity: 0.8,
                          lineHeight: vh(36)
                        }}
                      >
                        <div className={scss["flex"]}>
                          <h4 style={{ fontWeight: "bold" }}>{e.bureau}</h4>
                          <h4>{e.detail}</h4>
                        </div>

                        <h4>{e.time}</h4>
                      </div>
                    </div>
                  ))}
                </Carousel>
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
        width={410}
        style={{ width: "auto" }}
        className={
          scss["drawer-content"] +
          " " +
          scss["drawer-right"] +
          " " +
          scss["gonganSkin"] +
          " " +
          scss["pe-none"]
        }
        visible={visible}
      >
        <div className={scss["right"]}>
          {config ? (
            <RightList data={config.rightList.data} />
          ) : (
            <Spin size="large" />
          )}
        </div>
      </Drawer>
    </>
  );
}
