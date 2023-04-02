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
export default function ConservancySkin({ visible }: Props) {
  const m = window["__esModule__conservancy"] || {};
  const [config, setConfig] = useState(m.config);
  useEffect(() => {
    if (!m.config) {
      loadScript(
        `${process.env.publicPath}js/share/ecology/conservancy.js`,
        "conservancy",
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
          scss["conservancySkin"] +
          " " +
          scss["pe-auto"]
        }
        visible={visible}
      >
        {config ? (
          <div className={scss["left"]}>
            {config.overview.map((item, i) => (
              <AvatarCard
                title={item.title}
                data={item.data}
                imgHeight={36}
                imgWidth={42}
                colWidth={[300]}
                rowHeight={80}
                placement="bottom"
                style={{ marginBottom: "6px" }}
              />
            ))}
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
                    style={{ marginBottom: vh(20) }}
                    offset={
                      i == 0
                        ? 0
                        : i == 1
                        ? config.monitors[0].data.length
                        : config.monitors
                            .slice(0, 2)
                            .reduce((r, item) => (r += item.data.length), 0)
                    }
                  />
                  {i == 1 && (
                    <List
                      data={window.currentMenu.sub
                        .slice(6)
                        .map(item => item.title)}
                      offset={6}
                      style={{ marginBottom: vh(50), maxHeight: "99px" }}
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
