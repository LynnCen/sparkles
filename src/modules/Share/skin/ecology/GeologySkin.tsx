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
export default function GeologySkin({ visible }: Props) {
  const m = window["__esModule__geology"] || {};
  const [config, setConfig] = useState(m.config);
  useEffect(() => {
    if (!config) {
      fetch(`${process.env.publicPath}js/share/ecology/geology.json`)
        .then(r => r.json())
        .then(r => {
          window["__esModule__geology"] = { config: r };
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
              colWidth={[300]}
              rowHeight={105}
              placement="bottom"
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
                    style={{ marginBottom: "20px" }}
                    offset={i == 0 ? 0 : i == 1 ? 2 : 4}
                  />
                  {i == 2 && (
                    <List
                      data={window.currentMenu.sub
                        .slice(4)
                        .map(item => item.title)}
                      offset={4}
                      style={{
                        marginBottom: vh(20),
                        maxHeight: item.data.length ? "66px" : "196px"
                      }}
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
