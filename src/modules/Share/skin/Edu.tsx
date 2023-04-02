import { useEffect, useState, useMemo } from "react";
import { Drawer, Progress, Carousel, Spin } from "antd";
import AvatarCard from "../Components/AvatarCard";
import AvatarFlexCard from "../Components/AvatarFlexCard";
import PhotoCard from "../Components/PhotoCard";
import PolarChart from "../Components/PolarChart";
import CardLayout from "../Components/CardLayout";
// import { config } from "./eduConfig";
import { templates } from "../../../config/StrConfig";

const css = require("../../../styles/custom.css");
const scss = require("../../../styles/scss/sharepage.scss");

let vh = px => (px / 1080) * 100 + "vh";

interface Props {
  visible: boolean;
  template: string;
}

export default function EduSkin({ visible, template }: Props) {
  const [config, setConfig] = useState(null);
  useEffect(() => {
    fetch(templates[template].configPath)
      .then(r => r.json())
      .then(setConfig)
      .catch(console.table);
  }, []);
  const classes = useMemo(
    () =>
      config
        ? config.excellentClass.data.reduce(
            (r, c, i) => (i % 2 ? (r[i - 1] += " " + c) : (r[i] = c), r),
            []
          )
        : [],
    [config]
  );
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
          scss["pe-auto"]
        }
        visible={visible}
      >
        <div className={scss["left"]}>
          {config ? (
            <>
              <AvatarCard
                {...config.number}
                // style={{ marginBottom: vh(12) }}
              />
              <AvatarFlexCard
                {...config.netTeacher}
                style={{ marginBottom: vh(42) }}
              />

              <CardLayout
                {...config.overview}
                style={{ marginBottom: vh(45) }}
                className={""}
              >
                <div className={scss["flex"]} style={{ alignItems: "center" }}>
                  <div style={{ position: "relative" }}>
                    <Progress
                      type="dashboard"
                      strokeColor={{
                        "0%": "#188bff",
                        "100%": "#03d3ff"
                      }}
                      percent={`${(config.overview.data.index / 600) *
                        1.0 *
                        100}`}
                      format={percent => parseInt((percent / 100) * 600)}
                      className={
                        scss["trail-transparent"] +
                        " " +
                        scss["progress-dashboard"]
                      }
                      // gapDegree={82.8}
                    />
                    <div
                      style={{
                        backgroundImage: `url(${config.overview.data.trailImg})`
                      }}
                    >
                      <div style={{ position: "absolute", bottom: 0 }}>
                        <h5>与昨日分数持平</h5>
                        <h5>
                          月平均指数{Math.floor(config.overview.data.index)}
                        </h5>
                        <h5>
                          超越本省
                          {(config.overview.data.rank * 100).toFixed(1) + "%"}
                          学校
                        </h5>
                      </div>
                    </div>
                  </div>
                  <PolarChart data={config.overview.data} />
                  {/* <Basic data={config.overview.data}></Basic> */}
                </div>
              </CardLayout>
              <CardLayout
                {...config.excellentClass}
                // style={{ height: vh(24) }}
                // className={scss["hide-scrollbar"]}
              >
                <Carousel
                  autoplay
                  autoplaySpeed={2000}
                  dotPosition={"right"}
                  vertical={true}
                  verticalSwiping={true}
                  className={scss["hide-slick-dots"]}
                >
                  {classes.map(item => (
                    <div>
                      <ul className={scss["flex"]} style={{ color: "white" }}>
                        <li
                          className={scss["list-disc"]}
                          style={{ margin: "0px 27px 0px 18px" }}
                        >
                          {item.split(" ")[0]}
                        </li>
                        <li className={scss["list-disc"]}>
                          {item.split(" ")[1]}
                        </li>
                      </ul>
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
        width={416}
        className={
          scss["drawer-content"] +
          " " +
          scss["drawer-right"] +
          " " +
          scss["pe-auto"]
        }
        visible={visible}
      >
        <div className={scss["right"]}>
          {config ? (
            <>
              <CardLayout
                title={config.labs.title}
                enTitle={config.enTitle}
                className={""}
              >
                <div
                  className={scss["center"]}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1.8fr 1fr",
                    gridAutoRows: vh(110),
                    marginBottom: vh(55)
                  }}
                >
                  {config.labs.data.map((item, i) => (
                    <div
                      className={scss["item"]}
                      // style={{ width: "33%" }}
                      key={i}
                    >
                      <div className={scss["icon"]}>
                        <span>
                          <img
                            src={item.icon}
                            style={{ marginBottom: vh(15) }}
                          />
                        </span>
                      </div>
                      <div>
                        <h4
                          style={{
                            width: "6em",
                            margin: "auto",
                            opacity: 0.8
                          }}
                        >
                          {item.name}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              </CardLayout>
              <PhotoCard
                title={config.monitors.title}
                enTitle={config.monitors.enTitle}
                data={config.monitors.data}
                style={{ width: "380px" }}
                mask={false}
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
