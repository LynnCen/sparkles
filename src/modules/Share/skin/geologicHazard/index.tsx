import { useState, useEffect, useRef } from "react";
import {
  Drawer,
  List,
  Spin,
  Table,
  Icon,
  Empty,
  Select,
  Modal,
  Radio,
  message
} from "antd";
import CardLayout, { Suffix } from "../../Components/CardLayout";
import DonutChart from "../../Components/DonutChart";
import { templates } from "../../../../config/StrConfig";
import { Pagination } from "../../Components/Pagination";
import MonitorCard from "../../Components/MonitorCard";
import {
  getWeather,
  getArea,
  getHik,
  getLc,
  getControlObject,
  openLayer,
  onTableRow
} from "./util";
import Mark from "../../../../components/model/Mark";
import { Iframe } from "../../../../components/Iframe";
const scss = require("../../../../styles/scss/sharepage.scss");
const css = require("../../../../styles/custom.css");
let vh = px => (px / 1080) * 100 + "vh";

interface Props {
  visible: boolean;
  template: string;
  address: string;
}
export default function GeologicHazard({ visible, address, template }: Props) {
  const [config, setConfig] = useState(self[template]);
  const [videoType, setVideoType] = useState("lc");
  const [modalProps, setModalProps] = useState({
    title: "",
    visible: false,
    url: "",
    loading: false
  });
  const [dataSource, setDataSource] = useState([]);
  useEffect(() => {
    if (!config) {
      if (self[template]) {
        setConfig(self[template]);
      } else {
        fetch(templates[template].configPath)
          .then(r => r.json())
          .then(r => {
            setConfig(r);
            self[template] = r;
            getData();
          })
          .catch(console.table);
      }
    }
  }, []);
  useEffect(
    () => {
      if (self[template]) {
        getData();
      }
    },
    [
      self[template] ? self[template]["region"] : null,
      self[template] ? self[template]["town"] : null
    ]
  );
  const getData = () => {
    getWeather(self[template].region || address);
    Promise.all([getArea(), getLc(), getHik()]).then(result =>
      setConfig({ ...self[template] })
    );
  };
  const showModal = e => {
    if (/keyPreventionVillage|generalPreventionVillage/.test(e.key)) {
      getControlObject(e.key.indexOf("key") ? 1 : 2).then(r =>
        setDataSource(r.data)
      );
      setModalProps({
        ...modalProps,
        visible: true,
        title: config.disaster.modal.title
      });
    }
  };
  return (
    <>
      <Drawer
        placement="left"
        closable={false}
        maskClosable={false}
        mask={false}
        width={435}
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
            <CardLayout
              {...config.disaster}
              style={{ marginBottom: vh(24) }}
              className={"pe-auto "}
            >
              <DonutChart
                data={config.disaster.data}
                style={{ marginTop: 20 }}
                colors_pie={config.disaster.colors_pie}
                chartHeight={300}
                legend={false}
                label={{
                  // formatter: (val, item) => item.point.item + ": " + val
                  htmlTemplate: (val, item, index) => {
                    return `<div style="color: ${
                      item.color
                    }; font-size:14px;width: max-content;">${
                      item.point.item
                    }: ${val}</div>`;
                  }
                }}
                guideHtml={`<div style="color:#8c8c8c;font-size:1.16em;text-align: center;width: 10em;"><span style="color:#FBFF00;font-size:42px">
                  ${config.disaster.data.reduce(
                    (total, item) => total + item.count,
                    0
                  )}</span><br><span style="color:#fff;font-size: 18px">目标总数</span></div>`}
              />
              <ul className={scss["flex-between"] + " " + scss["square-card"]}>
                {config.disaster.overview
                  .filter((e, i) =>
                    i == 0 ? config["region"].includes("丽水") : 1
                  )
                  .map((e, i) => {
                    return (
                      <li
                        key={i}
                        className="pointer"
                        style={{ width: e.width || "auto" }}
                        onClick={() => showModal(e)}
                      >
                        <div
                          className={scss["arial"] + " " + scss["square-mask"]}
                        >
                          {e.value}
                        </div>
                        <div className={scss["title"]}>
                          {e.title}
                          <span className={scss["unit"]}>{e.unit}</span>
                        </div>
                      </li>
                    );
                  })}
              </ul>
            </CardLayout>
            <CardLayout
              {...config.situation}
              style={{ marginBottom: vh(28) }}
              className={"pe-auto " + scss["material"]}
            >
              <ul className={scss["flex-between"]}>
                {config.situation.data.map((e, i) => (
                  <li className={scss["flex"]} key={i}>
                    <img src={e.icon} alt="" width="48" />
                    <div>
                      <h5 className={scss["title"]}>{e.title}</h5>
                      <div style={{ fontSize: 28 }} className={scss["arial"]}>
                        {e.value}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </CardLayout>
            <CardLayout
              {...config.riskVOList}
              className={"pe-auto "}
              // suffixIcon={Suffix(config.riskVOList.suffix)}
            >
              {Object.values(config.riskVOList.overview).filter(e => e.value)
                .length ? (
                <ul
                  className={scss["flex-between"]}
                  style={{
                    display: "grid",
                    gap: 10,
                    gridTemplateColumns: "repeat(4, 1fr)",
                    height: vh(42),
                    overflowY: "auto"
                  }}
                >
                  {Object.values(config.riskVOList.overview)
                    .filter(e => e.value)
                    .map((e, i) => (
                      <li
                        key={i}
                        className={
                          css["flex-center"] + " " + scss["font-small"]
                        }
                        style={{
                          // width: 89,
                          height: vh(42),
                          borderRadius: 6,
                          border: `1px solid ${
                            config.riskVOList.legend[Number(e.status)].color
                          }`,
                          background:
                            config.riskVOList.legend[Number(e.status)]
                              .background
                        }}
                      >
                        {/* {e.name + " " + e.value} */}
                        {e.name}
                      </li>
                    ))}
                </ul>
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={<span>暂无</span>}
                />
              )}
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
              title={config.atmosphere.title2}
              enTitle={config.atmosphere.enTitle2}
              style={{ marginBottom: vh(24) }}
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
              {...config.alarm}
              // suffixIcon={Suffix({
              //   ...config.alarm.suffix,
              //   value: config.alarm.data.length
              // })}
              style={{ marginBottom: vh(24) }}
              className={scss["alarmInfo"] + " " + scss["pe-auto"]}
            >
              {/* <ConfigProvider renderEmpty={EmptyTable}> */}
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
              {/* </ConfigProvider> */}
            </CardLayout>

            <MonitorCard
              {...config.video}
              data={config.video[videoType]}
              suffixIcon={
                <>
                  <Radio.Group
                    defaultValue={config.video.category[0].key}
                    buttonStyle="solid"
                    size="small"
                    onChange={e => {
                      const val = e.target.value;
                      setVideoType(val);
                    }}
                    style={{ marginRight: 4 }}
                  >
                    {config.video.category.map((e, i) => (
                      <Radio.Button value={e.key}>{e.title}</Radio.Button>
                    ))}
                  </Radio.Group>
                  <Pagination total={config.video[videoType].length} />
                </>
              }
              mask={false}
              style={{ marginBottom: vh(24) }}
              thumbnailHeight={92}
              className={scss["video"] + " pe-auto "}
              time={false}
              // content={videoType == "hik" ? HikIframePreview : undefined}
              position={true}
              onClick={videoType == "hik" && hikItemClick}
              onPositonClick={e => {
                const m = Mark.marks.find(m =>
                  videoType == "hik"
                    ? m.id == e.cameraIndexCode
                    : e.name.includes(m.title)
                );
                if (m) {
                  m.setVisible(true);
                  m.focus();
                  setTimeout(() => hikItemClick(e), 1000);
                }
              }}
            />
            <CardLayout {...config.sensorCountVOList} className={"pe-auto "}>
              {Object.values(config.sensorCountVOList.overview).filter(
                e => e.value
              ).length ? (
                <ul
                  className={scss["flex-between"]}
                  style={{
                    display: "grid",
                    gap: 10,
                    gridTemplateColumns: "repeat(3, 1fr)",
                    // gridAutoRows: vh(42)
                    // flexWrap: "wrap",
                    height: vh(94),
                    overflowY: "auto"
                  }}
                >
                  {Object.values(config.sensorCountVOList.overview)
                    .filter(e => e.value)
                    .map((e, i) => (
                      <li
                        key={i}
                        className={
                          css["flex-center"] + " ellipsis " + scss["font-small"]
                        }
                        style={{
                          // marginBottom: vh(10),
                          // width: 118,
                          height: vh(42),
                          borderRadius: 6,
                          border: `1px solid ${
                            config.sensorCountVOList.legend[Number(e.status)]
                              .color
                          }`,
                          background:
                            config.sensorCountVOList.legend[Number(e.status)]
                              .background
                        }}
                      >
                        {/* {e.name + " " + e.value} */}
                        {e.name}
                      </li>
                    ))}
                </ul>
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={<span>暂无</span>}
                />
              )}
            </CardLayout>
          </div>
        ) : (
          <Spin size="large" style={{ margin: "auto", width: "100%" }} />
        )}
      </Drawer>
      {modalProps.visible && (
        <Modal
          {...modalProps}
          footer={null}
          centered
          destroyOnClose={true}
          getContainer={() => document.querySelector(".ant-drawer").parentNode}
          onCancel={e => setModalProps({ ...modalProps, visible: false })}
          width="auto"
        >
          <div>
            <Table
              align="center"
              columns={config.disaster.columns.map(e => ({
                ...e,
                dataIndex: e.key
              }))}
              dataSource={dataSource}
              loading={modalProps.loading}
            />
          </div>
        </Modal>
      )}
      {/* <div
        className={[
          scss["geologicHazard"],
          scss["center-bottom"],
          scss["pe-none"],
          scss["flex-center"]
        ].join(" ")}
      >
        {visible ? (
          config ? (
            <>
              <div>{config.overview.text}</div>
            </>
          ) : (
            <Spin size="large" style={{ margin: "auto", width: "100%" }} />
          )
        ) : null}
      </div> */}
    </>
  );
}

export const hikItemClick = _item => {
  let w = window.screen.width;
  let h = window.screen.height;
  let item;
  !document.onclick && (document.onclick = () => (item = hikWinFocus(_item)));
  if (!item) item = hikWinFocus(_item);
  if (!item.win) {
    item.win = window.open(
      location.pathname +
        self[window["template"]].video.preview +
        item.cameraIndexCode,
      "",
      `left=${(w * 3) / 8},top=${h / 2},width=${w / 4},height=${h /
        4}, location=0,toolbar=0,status=0,menubar=0`
    );
    item.win.onload = () => (item.win.document.title = item.name);
    item.win.onbeforeunload = () => (item.win = null);
  }
};
const hikWinFocus = _item => {
  let item;
  self[window["template"]].video.hik.forEach(e => {
    if (e.win) e.win.focus();
    if (e.cameraIndexCode == _item.cameraIndexCode) item = e;
  });
  return item;
};
const HikIframePreview = ({ cameraIndexCode }) => (
  <Iframe
    src={
      location.pathname +
      self[window["template"]].video.preview +
      cameraIndexCode
    }
    onLoad={function(this) {
      const { left, top } = this.getBoundingClientRect();
      queueMicrotask(() => {
        if (this.contentWindow) {
          this.contentWindow.oWebControl.JS_SetDocOffset({ left, top });
        } else message.warn("请重新打开!");
      });
    }}
  />
);

export const columns = (columns, icon, warnText) =>
  columns.map(e => ({
    ...e,
    dataIndex: e.key,
    ...(e.key === "operation"
      ? {
          width: 40,
          onCell: () => ({ style: { cursor: "pointer" } })
        }
      : {}),
    render: item => {
      return e.key == "warnType" ? (
        item && item != warnText ? (
          <span
            className={scss["flex-center-left"] + " ellipsis"}
            style={{ paddingLeft: 14, maxWidth: "7em" }}
            title={item}
          >
            <img
              src={icon}
              className={scss["opacity-animation"]}
              style={{ marginRight: 4 }}
            />

            <span>{item}</span>
          </span>
        ) : (
          <span>{item}</span>
        )
      ) : e.key === "status" ? (
        <span style={{ color: item.color }}>{item}</span>
      ) : e.key === "operation" ? (
        <span
          style={{
            borderBottom: `1px solid #fff`
          }}
          onClick={() => {
            openLayer({
              ...item,
              content: `<img src="${item.img}"/>`,
              skin: "layer-img-wrapper"
            });
          }}
        >
          {item.text}
        </span>
      ) : (
        item
      );
    }
  }));
