import { useState, useEffect } from "react";
import { Drawer, Progress, Popover, Icon, Spin } from "antd";
import CardLayout from "../../Components/CardLayout";
import MonitorCard from "../../Components/MonitorCard";
import List from "../../Components/List";
import { loadScript } from "../../../../utils/common";
import Play from "../../../../components/tools/Play";

const css = require("../../../../styles/custom.css");
const scss = require("../../../../styles/scss/sharepage.scss");

let vh = px => (px / 1080) * 100 + "vh";

interface Props {
  visible: boolean;
  template: string;
}

export default function SiteSkin({ visible, template }: Props) {
  const m = window["__esModule__site"] || {};
  const [config, setConfig] = useState(m.config);
  useEffect(() => {
    if (!m.config) {
      loadScript(
        `${process.env.publicPath}js/share/ecology/site.js`,
        "site",
        "module"
      )
        .then(({ config }) => {
          setConfig(config);
        })
        .catch(console.error);
    }
  }, []);
  const _play = (e, item) => {
    if (
      template &&
      window.template.indexOf("ecology") > -1 &&
      window.currentMenu
    ) {
      const s =
        window.currentMenu.sub.find(s => item.name == s.title) ||
        window.currentMenu.sub.find(
          s => item.name.includes(s.title) || s.title.includes(item.name)
        );
      s && Play.play(s.feature!);
    }
  };
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
                {config.overview.map((item, i) => (
                  <div className={scss["item"]} key={i}>
                    <div className={scss["icon"]}>
                      <span style={{ width: "42px", display: "flex" }}>
                        <img
                          src={item.icon}
                          style={{
                            // width: "42px",
                            height: "auto",
                            margin: "auto"
                          }}
                          className={item.data ? scss["opacity-animation"] : ""}
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
                        {!item.unit ? (
                          <>
                            {item.data ? (
                              <Popover
                                key={i}
                                placement="right"
                                content={
                                  <ul className={scss["popover-box"]}>
                                    {item.data.map((item, j) => {
                                      return (
                                        <li
                                          key={j}
                                          className={
                                            scss["flex-center-between"] +
                                            " " +
                                            scss["pointer"]
                                          }
                                          onClick={e => _play(e, item)}
                                        >
                                          <h5>{item.name}</h5>
                                          <Icon type="right" />
                                        </li>
                                      );
                                    })}
                                  </ul>
                                }
                                trigger="hover"
                                overlayClassName={scss["popover-container"]}
                              >
                                <h1
                                  style={{ marginRight: "9px", width: "40%" }}
                                >
                                  {item.value}
                                </h1>
                              </Popover>
                            ) : (
                              <h1 style={{ marginRight: "9px" }}>
                                {item.value}
                              </h1>
                            )}
                          </>
                        ) : (
                          <>
                            <Progress
                              strokeWidth={12}
                              strokeColor={"#02d281"}
                              status="active"
                              showInfo={false}
                              percent={parseInt(item.value * 100)}
                            />
                            <h1>
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
                        .slice(2)
                        .map(item => item.title)}
                      offset={2}
                      style={{ marginBottom: vh(15), maxHeight: "132px" }}
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
