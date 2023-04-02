import { useState, useEffect } from "react";
import { Drawer, Spin } from "antd";
import AvatarCard from "../../Components/AvatarCard";
import CardLayout from "../../Components/CardLayout";
import MonitorCard from "../../Components/MonitorCard";
import List from "../../Components/List";
import { feature } from "../../Components/Header";

const css = require("../../../../styles/custom.css");
const scss = require("../../../../styles/scss/sharepage.scss");
let vh = px => (px / 1080) * 100 + "vh";

interface Props {
  visible: boolean;
}
export default function FireSkin({ visible }: Props) {
  const sub = window.currentMenu.sub;
  const m = window["__esModule__fire"] || {};
  const [config, setConfig] = useState(m.config);
  useEffect(() => {
    if (!config) {
      fetch(`${process.env.publicPath}js/share/ecology/fire.json`)
        .then(r => r.json())
        .then(r => {
          window["__esModule__fire"] = { config: r };
          setConfig(r);
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
              dropdownData={config.overview[config.overview.length - 1].data}
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
              title={config.sewage.title}
              enTitle={config.sewage.enTitle}
              style={{ marginBottom: "0px" }}
            >
              {config.monitors.map((item, i) => (
                <>
                  <MonitorCard
                    title={item.title}
                    data={item.data}
                    mask={false}
                    style={{ marginBottom: "10px" }}
                    offset={i == 0 ? 0 : sub.length - 3}
                  />
                  {i == 0 && (
                    <List
                      data={sub
                        .slice(0, sub.length - 3)
                        .map(item => item.title)}
                      offset={i == 0 ? 0 : sub.length - 3}
                      style={{ marginBottom: vh(50), maxHeight: "231px" }}
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
