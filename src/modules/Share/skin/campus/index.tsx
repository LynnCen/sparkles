import { useState, useEffect } from "react";
import { Drawer, Spin } from "antd";
import RadioCard from "./RadioCard";
import MonitorClass from "./MonitorClass";
import Evaluation from "./Evaluation";
import Attendance from "./Attendance";
import Overview from "./Overview";
import MoralEdu from "./MoralEdu";
// import { config } from "./campusConfig.js";
import { templates } from "../../../../config/StrConfig";
import { loadScript } from "../../../../utils/common";

const css = require("../../../../styles/custom.css");
const scss = require("../../../../styles/scss/sharepage.scss");

let vh = px => (px / 1080) * 100 + "vh";

interface Props {
  visible: boolean;
  template: string;
}
export default function CampusSkin({ visible, template }: Props) {
  const [config, setConfig] = useState(null);
  useEffect(() => {
    loadScript(templates[template].configPath, `${template}-config`, "module")
      .then(({ config }) => setConfig(config))
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
          scss["campusSkin"] +
          " " +
          scss["pe-none"]
        }
        visible={visible}
      >
        <div className={scss["left"]}>
          {config ? (
            <>
              <Overview style={{ marginBottom: vh(10) }} {...config.overview} />
              {/* <AvatarCard
              title={config.overview.title}
              enTitle={config.overview.enTitle}
              data={config.overview.data}
              imgHeight={42}
              style={{ marginBottom: vh(12) }}
            ></AvatarCard> */}

              <MonitorClass {...config.netTeacher} />
              {/* <AvatarFlexCard
            title={config.netTeacher.title}
            enTitle={config.netTeacher.enTitle}
            data={config.netTeacher.data}
            style={{ marginBottom: vh(48) }}
          ></AvatarFlexCard> */}

              {/* <RectChartCard
            title={config.evaluation.title}
            enTitle={config.evaluation.enTitle}
            data={config.evaluation.data}
          ></RectChartCard> */}
              {/* <LineChart
            title={config.library.title}
            enTitle={config.library.enTitle}
            datePicker={true}
            data={config.library.data}
          ></LineChart> */}
              <Evaluation {...config.evaluation} />
              {/* <CardLayout
              title={config.evaluation.title}
              enTitle={config.evaluation.enTitle}
              href={config.evaluation.href}
              suffixIcon={
                <>
                  <Cascader
                    options={config.evaluation.options}
                    expandTrigger="hover"
                    defaultValue={config.evaluation.defaultValue}
                    onChange={this.changeClass}
                    suffixIcon={
                      <span>
                        <img
                          src={require("../../../../assets/icon/icon_xiala.png")}
                          alt=""
                        />
                      </span>
                    }
                    style={{ width: "120px", backgroundColor: "rgba(255,255,255,.2)",color:"#fff" }}
                  />
                </>
              }
            >
              <StackedColChart
                data={config.evaluation.data}
                theme={config.evaluation.theme}
                chartPadding={[10, 10, 80, 30]}
                chartHeight={265}
                showPercent={false}
                geomLabel={false}
              ></StackedColChart>
            </CardLayout> */}
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
          scss["campusSkin"] +
          " " +
          scss["pe-none"]
        }
        visible={visible}
      >
        <div className={scss["right"]}>
          {config ? (
            <>
              <Attendance {...config.attendance} />
              {/* <DateCardLayout
              title={config.attendance.title}
              enTitle={config.attendance.enTitle}
              style={{ marginBottom: vh(25) }}
              className={scss[""] + " "}
            >
              <div
                className={scss["flex-center-evenly"]}
                style={{ flexWrap: "wrap" }}
              >
                {config.attendance.data.map((e, i) => (
                  <div
                    className={scss["item"] + " " + scss["center"]}
                    style={{ width: i < 3 ? "33.33%" : "auto" }}
                    key={i}
                  >
                    <img src={e.icon} alt="" />
                    <h4>{e.name}</h4>
                    <h2 style={{ color: "white" }}>{e.value}</h2>
                  </div>
                ))}
              </div>
            </DateCardLayout> */}

              {/* <ProgressLineCard
            title={config.attendance.title}
            enTitle={config.attendance.enTitle}
            data={config.attendance.data}
            style={{ marginBottom: vh(40) }}
            datePicker={true}
          ></ProgressLineCard> */}

              <RadioCard
                {...config.consumption}
                datePicker={false}
                arrowIcon={true}
                style={{ marginBottom: vh(46) }}
              />

              {/* <PhotoCard
            title={config.monitors.title}
            enTitle={config.monitors.enTitle}
            data={config.monitors.data}
            style={{ width: "380px" }}
          ></PhotoCard> */}
              {/* <CardLayout
              title={config.events.title}
              enTitle={config.events.enTitle}
              suffixIcon={
                <img
                  src={require("../../../assets/lsms/icon-rili1.png")}
                  alt=""
                />
              }
            >
              <div
                className={scss["hide-scrollbar"]}
                style={{ height: vh(146) }}
              >
                <div
                  id="scroll-box"
                  style={{
                    position: "absolute",
                    width: "100%"
                  }}
                >
                  {events.map((e, i) => (
                    <div
                      className={scss["flex-between"]}
                      style={{ opacity: 0.8, lineHeight: vh(32) }}
                    >
                      <h4>{e.content}</h4>
                      <h4>{e.date}</h4>
                    </div>
                  ))}
                </div>
              </div>
            </CardLayout> */}
              <MoralEdu {...config.moralEdu} />
              {/* <CardLayout
              title={config.moralEdu.title}
              enTitle={config.moralEdu.enTitle}
              suffixIcon={
                <img
                  src={require("../../../../assets/lsms/icon-rili1.png")}
                  alt=""
                />
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
                slidesToShow={5}
              >
                {moralEdu.map((e, i) => (
                  <div>
                    <div
                      className={scss["flex-between"]}
                      style={{ opacity: 0.8, lineHeight: vh(32) }}
                    >
                      <h4>{e.content}</h4>
                      <h4>{e.date}</h4>
                    </div>
                  </div>
                ))}
              </Carousel>
            </CardLayout> */}
            </>
          ) : (
            <Spin size="large" />
          )}
        </div>
      </Drawer>
    </>
  );
}
