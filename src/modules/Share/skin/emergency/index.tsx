import { useState, useEffect } from "react";
import { Drawer, Carousel, Spin } from "antd";
import AvatarCard from "../../Components/AvatarCard";
import CardLayout from "../../Components/CardLayout";
import RiskSource from "./RiskSource";
import ExpertList from "./ExpertList";
import { feature } from "../../Components/Header";
import { templates } from "../../../../config/StrConfig";

const css = require("../../../../styles/custom.css");
const scss = require("../../../../styles/scss/sharepage.scss");

let vh = px => (px / 1080) * 100 + "vh";

interface Props {
  visible: boolean;
  template: string;
}
export default function Emergency({ visible, template }: Props) {
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
              <AvatarCard
                {...config.equipment}
                colWidth={[122, 146, 132]}
                rowHeight={78}
                imgHeight={42}
                placement="bottom"
                style={{ marginBottom: vh(16) }}
              />

              <CardLayout
                {...config.typicalCase}
                suffixIcon={
                  <div
                    className={scss["transparent"]}
                    style={{ display: "flex", alignItems: "end" }}
                  >
                    <span>{config.typicalCase.suffix.name}：</span>
                    <span className={scss["value"]}>
                      {config.typicalCase.suffix.value}
                    </span>
                    <span>{config.typicalCase.suffix.unit}</span>
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
                  slidesToShow={10}
                >
                  {config.typicalCase.data.map((e, i) => (
                    <div key={i}>
                      <div
                        className={
                          scss["flex-between"] + " " + scss["list-hover"]
                        }
                        style={{
                          lineHeight: vh(36),
                          justifyContent: "unset"
                        }}
                      >
                        <h4 style={{ marginRight: "20px" }}>{e.date}</h4>
                        <h4>{e.content}</h4>
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
        width={420}
        className={
          scss["drawer-content"] +
          " " +
          scss["drawer-right"] +
          " " +
          scss["campusSkin"] +
          " " +
          scss["pe-none"]
        }
        visible={visible}
      >
        <div className={scss["right"]}>
          {config ? (
            <>
              <RiskSource
                {...config.riskSource}
                suffixIcon={
                  <div
                    className={scss["transparent"]}
                    style={{ display: "flex", alignItems: "end" }}
                  >
                    <span>{config.riskSource.suffix.name}：</span>
                    <span className={scss["value"]}>
                      {config.riskSource.suffix.value}
                    </span>
                    <span>{config.riskSource.suffix.unit}</span>
                  </div>
                }
                className={scss["pe-auto"]}
                style={{ marginBottom: vh(30) }}
              />
              <ExpertList
                {...config.experts}
                suffixIcon={
                  <div
                    className={scss["transparent"]}
                    style={{ display: "flex", alignItems: "end" }}
                  >
                    <span>{config.experts.suffix.name}：</span>
                    <span className={scss["value"]}>
                      {config.experts.suffix.value}
                    </span>
                    <span>{config.experts.suffix.unit}</span>
                  </div>
                }
                className={scss["pe-auto"]}
              />
            </>
          ) : (
            <Spin size="large" />
          )}
        </div>
      </Drawer>
    </>
  );
}
