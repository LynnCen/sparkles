import { useState, useEffect } from "react";
import { Drawer, List, Spin, Avatar, Table, Empty, message } from "antd";
import CardLayout, { Suffix } from "../../Components/CardLayout";
import { openLayer, getDeviceStatus, onTableRow } from "../geologicHazard/util";
import { Pagination } from "../../Components/Pagination";
import VrpIcon from "../../../../components/VrpIcon";
import { templates } from "../../../../config/StrConfig";
import Play from "../../../../components/tools/Play";
import Mark from "../../../../components/model/Mark";
import Config from "../../../../config/Config";
import {
  genBalloon,
  getWeather,
  getDisasterCallback,
  focus,
  getLc,
  getDisaster,
  clearData
} from "../geologicHazard/util";
import MonitorCard from "../../Components/MonitorCard";
import { columns } from "../geologicHazard";
import { render } from "../../../../utils/common";
const scss = require("../../../../styles/scss/sharepage.scss");
const css = require("../../../../styles/custom.css");
let vh = px => (px / 1080) * 100 + "vh";

interface Props {
  visible: boolean;
  template: string;
  address: string;
  drawer: { visible: boolean; click: () => void };
}
export default function GeologicHazard2({
  visible,
  address,
  template,
  drawer
}: Props) {
  const [config, setConfig] = useState(self["geologicHazard"]);
  useEffect(() => {
    if (!self["geologicHazard"]) {
      fetch(templates["geologicHazard"].configPath)
        .then(r => r.json())
        .then(r => {
          setConfig(r);
          self["geologicHazard"] = r;
          getWeather(config["region"] || address);
        })
        .catch(console.table);
    }
    return () => {
      clearData();
      setConfig({ ...self["geologicHazard"] });
      Play.timer && clearTimeout(Play.timer as NodeJS.Timeout);
    };
  }, []);
  useEffect(
    () => {
      if (config) {
        console.log("refresh");
        config["region"] && getWeather(config["region"] || address);
      }
    },
    [config ? config["region"] : null]
  );
  useEffect(
    () => {
      if (self["geologicHazard"]) {
        getDisaster().then(async r => {
          if (r.data) {
            await getDisasterCallback(r.data);
            setConfig({ ...self["geologicHazard"] });
            if (!self["pptTemplate"]) {
              getLc(true).then(() => setConfig({ ...self["geologicHazard"] }));
            }
            // process.env.NODE_ENV == "development" &&
            config.forecastEquipmentVOList.data.forEach((e, i) => {
              let mark = Mark.getById("forecastEquipment" + e.deviceId);
              if (!mark) {
                e.status = 1;
                mark = genBalloon({
                  id: "forecastEquipment" + e.deviceId,
                  ...e,
                  title: e.name,
                  visible: false,
                  icon: self["geologicHazard"].icon[e.type]["1"],
                  effect: {}
                });
                getDeviceStatus(e.deviceId);
              }
            });
            let mark = Mark.getById(r.data.uniqueId);
            if (mark) focus(mark);
            else {
              mark = genBalloon(
                {
                  id: r.data.uniqueId,
                  ...r.data,
                  title: self["geologicHazard"].menu.geohazard || r.data.name,
                  icon: self["geologicHazard"].icon.geohazard,
                  className: "ant-popover-placement-top tip"
                },
                true
              );
            }
            mark && mark.setIcon({ ...mark, titleVisible: true });
          } else message.warn("暂无数据");
        });
      }
    },
    [self["geologicHazard"] ? self["geologicHazard"].geohazard : undefined]
  );
  const showSupply = () => {
    const table = (
      <Table
        align="center"
        columns={config.suppliesLibraryVOList.columns.map(e => ({
          ...e,
          dataIndex: e.key
        }))}
        dataSource={config.suppliesLibraryVOList.data}
      />
    );
    openLayer({
      title: config.suppliesLibraryVOList.title,
      content:
        '<div style="margin:10px auto auto;height:auto" id="supply-table"></div>',
      area: ["1000px", "400px"]
    });
    render(table, "#supply-table");
  };
  return (
    <>
      <Drawer
        placement="left"
        closable={false}
        maskClosable={false}
        mask={false}
        width={420}
        className={[
          scss["drawer-content"],
          scss["drawer-left"],
          scss["geologicHazard"],
          scss["pe-none"]
        ].join(" ")}
        visible={visible}
      >
        {config ? (
          <div className={scss["left"]}>
            {/* <WeatherCard
              title={"天气预报"}
              enTitle={"Meteorological"}
              address={address}
              style={{ marginBottom: vh(36) }}
            /> */}
            <CardLayout
              {...config.atmosphere}
              style={{ marginBottom: vh(38) }}
              className={"pe-auto"}
              // suffixIcon={
              //   <div className={scss["flex-between"]}>
              //     <img
              //       src={require("../../../../assets/weizhi.png")}
              //       alt=""
              //       style={{ width: 14, marginRight: 8 }}
              //     />
              //     {config["region"]}
              //   </div>
              // }
            >
              <div
                className={css["flex-center-between"] + " " + scss["center"]}
              >
                {config.atmosphere.data.map((item, i) => (
                  <div className={scss["item"]} key={i}>
                    <div className={scss["icon"]}>
                      <span>
                        <img src={item.avatar} style={{ height: 32 }} />
                      </span>
                    </div>
                    <div>
                      <h2
                        className={scss["arial"] + " " + scss["white"]}
                        style={{
                          lineHeight: "17px",
                          marginBottom: "5px",
                          fontSize: i == 0 ? 16 : 24
                        }}
                      >
                        {item.value || ""}
                        <span style={{ fontSize: 14 }}>{item.unit || ""}</span>
                      </h2>
                      <h4 style={{ opacity: 0.8 }}>{item.name}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </CardLayout>

            <CardLayout
              {...config.pointInfo}
              style={{ marginBottom: vh(40) }}
              className={scss["pe-auto"] + " " + scss["pointInfo"]}
              suffixIcon={
                <a
                  onClick={e => {
                    let synopsis = config.pointInfo.data[0];
                    openLayer({
                      title: config.pointInfo.data[1].value + synopsis.name,
                      content: `<div style="padding:10px">${synopsis.value
                        .map(p => `<p style="font-size:22px">${p}</p>`)
                        .join("")}</div>`,
                      area: ["40%", "auto"]
                    });
                  }}
                >
                  {config.pointInfo.suffix.name}
                </a>
              }
            >
              <ul>
                {config.pointInfo.data.slice(1).map((e, i) => (
                  <li
                    key={i}
                    style={{
                      padding: e.key == "synopsis" ? `${vh(8)} 0` : 0,
                      ...(e.key == "synopsis"
                        ? {
                            display: "flex",
                            alignItems: "baseline",
                            maxHeight: vh(96),
                            overflow: "auto"
                          }
                        : {})
                    }}
                  >
                    <span
                      style={{ opacity: 0.8 }}
                      dangerouslySetInnerHTML={{ __html: e.name }}
                    />
                    {e.key == "type" ? (
                      e.value.map(v => (
                        <span
                          className={scss["flex-center"] + " " + scss["tag"]}
                          style={{ background: e.background || "transparent" }}
                        >
                          <span title={v}>{v}</span>
                        </span>
                      ))
                    ) : Array.isArray(e.value) ? (
                      e.value.map(v => (
                        <span title={v.value} style={{ marginRight: 16 }}>
                          {v.value + v.unit}
                        </span>
                      ))
                    ) : (
                      <span title={e.value}>{e.value}</span>
                    )}
                  </li>
                ))}
              </ul>
            </CardLayout>

            <div
              style={{ marginBottom: vh(40) }}
              className={"pe-auto " + scss["geo-nav"]}
            >
              <div>{self["geologicHazard"].menu.geohazard}</div>
              <ul className={scss["flex-center-between"]}>
                {config.pointInfo.nav.data.map((e, i) => (
                  <NavLi
                    {...e}
                    color={config.pointInfo.nav.color}
                    drawer={drawer}
                  />
                ))}
              </ul>
            </div>

            <CardLayout
              {...config.sensorVOList}
              className={scss["pe-auto"] + " " + scss["monitor"]}
            >
              <>
                {Object.values(config.sensorVOList.overview).filter(
                  e => e.value
                ).length ? (
                  <>
                    <ul
                      style={{
                        display: "grid",
                        gap: 12,
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gridAutoRows: vh(42)
                      }}
                    >
                      {Object.values(config.sensorVOList.overview)
                        .filter(e => e.value)
                        .map((e, i) => {
                          return (
                            <li
                              key={i}
                              className={
                                css["flex-center"] +
                                " ellipsis " +
                                scss["font-small"]
                              }
                              style={{
                                borderRadius: 6,
                                border: `1px solid ${
                                  config.sensorVOList.legend[Number(e.status)]
                                    .color
                                }`,
                                background:
                                  config.sensorVOList.legend[Number(e.status)]
                                    .background
                              }}
                            >
                              {/* {e.name + " " + e.value} */}
                              {e.name}
                            </li>
                          );
                        })}
                    </ul>
                    {/* <div
                      style={{ width: 120, margin: "auto", marginTop: vh(12) }}
                    >
                      <ul className={css["flex-center-between"]}>
                        {Object.values(config.monitor.legend)
                          .reverse()
                          .map((e, i) => (
                            <li key={i} className={css["flex-center"]}>
                              {e.text}
                              <span
                                style={{
                                  marginLeft: 4,
                                  display: "inline-block",
                                  border: `1px solid ${e.color}`,
                                  borderRadius: 2,
                                  width: 20,
                                  height: 8,
                                  background:
                                    config.monitor.legend[
                                      Object.keys(config.monitor.legend)
                                        .length -
                                        1 -
                                        i
                                    ].background
                                }}
                              />
                            </li>
                          ))}
                      </ul>
                    </div> */}
                  </>
                ) : (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
              </>
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
        width={420}
        className={[
          scss["drawer-content"],
          scss["drawer-right"],
          scss["geologicHazard"],
          scss["pe-none"]
        ].join(" ")}
        visible={visible}
      >
        {config ? (
          <div className={scss["right"]}>
            <CardLayout
              {...config.alarm}
              // suffixIcon={Suffix({
              //   ...config.alarm.suffix1,
              //   value: config.alarm.data.length
              // })}
              style={{ marginBottom: vh(40), minHeight: vh(195) }}
              className={scss["alarmInfo"] + " " + scss["pe-auto"]}
            >
              <Table
                align="center"
                rowKey={record => record.warnType + record.location}
                // scroll={{ y: vh(110) }}
                columns={columns(
                  config.alarm.columns,
                  config.alarm.icon,
                  config.alarm.empty[0].warnType
                )}
                dataSource={config.alarm.data}
                onRow={onTableRow}
                pagination={false}
                getPopupContainer={node => node}
                className={scss["grey-table"]}
              />
            </CardLayout>

            <MonitorCard
              {...config.video}
              data={config.video.lc}
              suffixIcon={
                config.video.lc.length > 2 ? (
                  <Pagination total={config.video.lc.length} />
                ) : (
                  <div />
                )
              }
              mask={false}
              time={false}
              style={{ marginBottom: vh(40) }}
              thumbnailHeight={92}
              className={scss["video"] + " pe-auto "}
              position={true}
              onPositonClick={e => {
                const m = Mark.marks.find(m => e.name.includes(m.title));
                if (m) {
                  m.setVisible(true);
                  m.focus();
                }
              }}
            />
            <CardLayout
              {...config.headVO}
              className="pe-auto"
              style={{ marginBottom: vh(40) }}
            >
              <List
                itemLayout="horizontal"
                dataSource={config.headVO.data}
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          src={item.avatar || config.headVO.avatar}
                          className={item.avatar ? "" : scss["error"]}
                        />
                      }
                      title={item.name + " " + item.position + " " + item.phone}
                      description={item.unit}
                    />
                    {/* <div>
                      <span
                        style={{
                          background: config.inspection.icons[0].background
                        }}
                      >
                        <img src={config.inspection.icons[0].url} />
                      </span>
                      <span
                        style={{
                          background: config.inspection.icons[1].background
                        }}
                      >
                        <img src={config.inspection.icons[1].url} />
                      </span>
                    </div> */}
                  </List.Item>
                )}
              />
            </CardLayout>

            <CardLayout
              {...config.suppliesLibraryVOList}
              className={"pe-auto " + scss["material"]}
              suffixIcon={
                <a onClick={showSupply}>
                  {config.suppliesLibraryVOList.suffix.name}
                </a>
              }
            >
              {config.suppliesLibraryVOList.data.length ? (
                <ul
                  className={scss["flex-between"]}
                  style={{ marginBottom: vh(21) }}
                >
                  {config.suppliesLibraryVOList.data.map((e, i) => (
                    <li key={i} className={scss["flex"]} title={e.name}>
                      <img src={e.icon} alt="" width="48" />
                      <div>
                        <h5 className={scss["title"]}>{e.name}</h5>
                        <div
                          className={scss["arial"]}
                          style={{ fontSize: vh(24) }}
                        >
                          {e.distance}
                          <span className={scss["font-small"]}>{e.unit}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
            </CardLayout>
          </div>
        ) : (
          <Spin size="large" style={{ margin: "auto", width: "100%" }} />
        )}
      </Drawer>
    </>
  );
}

const fce = "forecastEquipment";
const NavLi = ({ title, icon, feature, color, drawer, ...rest }) => {
  const [played, setPlayed] = useState(false);
  const hasF =
    feature &&
    feature.length &&
    ((feature[0].dataId && feature[0].dataId.length) || feature[0].data.length);
  return (
    <li
      style={{
        background: color[Number(played)],
        borderRadius: 6,
        padding: `${vh(10)} 0 ${vh(6)} 0`,
        cursor: "pointer",
        width: 87.5
      }}
      onClick={ev => {
        if (hasF) {
          if (title.includes("监测")) {
            setTimeout(
              () => {
                self["geologicHazard"][fce + "VOList"].data.forEach((e, i) => {
                  let m = Mark.getById(fce + e.deviceId);
                  m && m.setVisible(!played);
                });
              },
              played
                ? 0
                : (feature[0].type == "view" ? feature[0].time : 3) * 1e3
            );
          }
          if (!played) {
            drawer.visible && drawer.click();
            Play.play(feature!, true);
          } else {
            clearTimeout(Play.timer as NodeJS.Timeout);
            feature.forEach(f => Play.setFeatureVisible(f, false));
          }
          setPlayed(!played);
        } else message.warn("暂无数据");
      }}
    >
      <VrpIcon
        iconName={icon}
        style={{
          fontSize: vh(24),
          display: "block",
          height: 28,
          lineHeight: "24px",
          opacity: hasF ? 1 : 0.5
        }}
      />
      <span className={scss["font-small"]} style={{ opacity: hasF ? 1 : 0.5 }}>
        {title}
      </span>
    </li>
  );
};
