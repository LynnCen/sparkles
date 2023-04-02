import { useState, useEffect } from "react";
import { Drawer, Spin } from "antd";
import AvatarCard from "../../Components/AvatarCard";
import CardLayout from "../../Components/CardLayout";
import MonitorCard from "../../Components/MonitorCard";
import List from "../../Components/List";
import { loadScript } from "../../../../utils/common";

const css = require("../../../../styles/custom.css");
const scss = require("../../../../styles/scss/sharepage.scss");
let vh = px => (px / 1080) * 100 + "vh";

interface Props {
  visible: boolean;
}

export default function SewageSkin({ visible }: Props) {
  const m = window["__esModule__sewage"] || {};
  const [config, setConfig] = useState(m.config);
  useEffect(() => {
    if (!m.config) {
      loadScript(
        `${process.env.publicPath}js/share/ecology/sewage.js`,
        "sewage",
        "module"
      )
        .then(({ config }) => {
          setConfig(config);
        })
        .catch(console.error);
    }
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
          scss["sewageSkin"] +
          " " +
          scss["pe-auto"]
        }
        visible={visible}
      >
        {config ? (
          <div className={scss["left"]}>
            <AvatarCard
              data={config.overview}
              imgHeight={36}
              imgWidth={42}
              colWidth={[300]}
              rowHeight={105}
              placement="bottom"
              dropdownData={config.monitors[0].data}
            />
          </div>
        ) : (
          <Spin size="large" style={{ margin: "auto", width: "100%" }} />
        )}
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
          scss["sewageSkin"] +
          " " +
          scss["pe-auto"]
        }
        visible={visible}
      >
        {config ? (
          <div className={scss["right"]}>
            <CardLayout
              title={"排污监测点位"}
              enTitle={"Sewage monitoring point"}
              style={{ marginBottom: "0px" }}
            >
              {config.monitors.map((item, i) => (
                <>
                  <MonitorCard
                    title={item.title}
                    data={item.data}
                    mask={false}
                    style={{ marginBottom: "10px" }}
                    offset={i == 0 ? 0 : i == 1 ? 9 : 15}
                  />
                  {i == 0 && (
                    <List
                      data={window.currentMenu.sub
                        .slice(1, 8)
                        .map(item => item.title)}
                      offset={1}
                      style={{ marginBottom: vh(20), maxHeight: "99px" }}
                    />
                  )}
                </>
              ))}
            </CardLayout>
          </div>
        ) : (
          <Spin size="large" style={{ margin: "auto", width: "100%" }} />
        )}
      </Drawer>
    </>
  );
}
