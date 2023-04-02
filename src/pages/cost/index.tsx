import React, { useEffect, useState, Component } from "react";
import { Drawer, Spin, Table, Breadcrumb, Row, Tag, Popover, Tooltip, Col } from "antd";
import CardLayout, { CardLayoutSuffix } from "components/CardLayout";
import { render, vh } from "utils/common";
import { StackChart } from "components/Stack";
import Bulletgraph from "./Bulletgraph";
import map from "utils/TDTMap";
import Axios from "axios";
import { sxcother } from "config/sxcwms";
import { InfoWin } from "components/Universal";
import context from "layout/context";

interface Props {
  [k: string]: any;
  visible: boolean;
  config: any;
  code: string;
  townName: string;
}

interface States {
  config: any;
}

export default class A extends Component<Props, States> {
  static contextType = context;
  constructor(props) {
    super(props);
    this.state = { config: props.config };
  }
  componentDidMount() {
    if (this.state.config) {
      this.getData();
    }
    map.map.addEventListener("click", this.onMapClick);
  }
  componentWillReceiveProps({ code, config }) {
    if ((config && !this.state.config) || code != this.props.code) {
      this.setState({ config }, this.getData);
    }
  }
  componentWillUnmount() {
    map.map.removeEventListener("click", this.onMapClick);
  }

  getData = () => {
    const { code } = this.props;
    const { config } = this.state;
    Axios.get(`/check/data?townCode=${code}`).then((r) => {
      console.log(r.data);
      const { progress, statistics } = config;
      progress.data = r.data.settlementProgressVOList;
      progress.count.data.forEach((e, i) => {
        e.value = r.data[e.key];
        e.layer = Object.values(sxcother.check.layerMap)[i];
      });
      statistics.pop.forEach((e) => ((e.data = r.data[e.key]), (e.value = e.data.length)));
      statistics.branchProportion.actual = r.data.branchProportion;
      statistics.data.forEach((e) => (e.value = r.data[e.key] || 0));
      const { system } = this.context.store;
      if (system) {
        statistics.data.forEach(
          (e) => Object.keys(system).includes(e.key) && (e.value = system[e.key])
        );
        config.statistics.branchProportion.target = system.qualifiedBranchProportion;
      }
      this.setState({ config });
    });
  };

  onMapClick = ({ lnglat }) => {
    if (map.map.getZoom() >= map.CLASS_DETAIL_ZOOM) {
      let [x, y] = [lnglat.getLng(), lnglat.getLat()];
      Axios.get(`/check/class_detail`, { params: { x, y } }).then((r) => {
        if (r.data) {
          console.log(r.data);
          const { config } = this.state;
          config.mapInfo.forEach((e) => (e.value = r.data[e.key]));
          let item = config.progress.data.find((e) => e.teamName == r.data.teamName);
          config.mapInfo[1].value = item ? item.paymentStatus : "待验收";
          let selector = `tdt-infowindow-custom${r.data.classId || 0}`;
          map.addInfoWin({ lnglat, content: `<div id="${selector}"></div>`, id: r.data.classId });
          render(<InfoWin data={config.mapInfo} />, "#" + selector);
        }
      });
    }
  };

  onStackItemClick = (checked, item) => {
    if (item && item.value) {
      const { progress } = this.state.config;
      const status = (item.key.startsWith("in") ? "待" : "已") + "完结";
      const list = progress.data.filter((e) => e.paymentStatus.includes(status));
      const { layers } = map.sxcLayerMap["check"].KR;
      if (!layers.includes(item.layer)) {
        if (!map.getLayer(sxcother["check"].id)) {
          map.map.addLayer(map.sxcLayerMap["check"]);
        }
        map.sxcLayerMap["check"].setParams({
          layers: item.layer,
          viewparams: "teamList:" + list.map((e) => e.cutTeamId).join("\\,"),
        });
        this.context.centerTownBy({ code: this.props.code });
      } else {
        map.sxcLayerMap["check"].setParams({ layers: "" });
        map.map.removeLayer(map.sxcLayerMap["check"]);
      }
    }
  };

  render() {
    const { visible, code, townName } = this.props;
    const { config } = this.state;
    if (config) {
      const { progress, statistics } = config;
      return (
        <Drawer
          placement="right"
          closable={false}
          mask={false}
          className={"drawer drawer-right arial"}
          visible={visible}
        >
          <div className={"right"}>
            <CardLayout
              {...progress}
              className={" pe-auto"}
              suffix={<CardLayoutSuffix {...progress.suffix} value={progress.data.length} />}
              style={{ marginBottom: vh(40) }}
            >
              <Table
                scroll={{ y: 100 }}
                columns={progress.columns.map((c, i) => ({
                  ...c,
                  dataIndex: c.key,
                  width: c.key == "teamName" ? "30%" : c.key == "paymentStatus" ? "15%" : "",
                  render: (item, record) => {
                    return i == 2 || i == 3 ? (
                      <span>{"￥" + item}</span>
                    ) : c.key == "paymentStatus" ? (
                      <Tag color={progress.statusColor[item]}>{item}</Tag>
                    ) : (
                      item
                    );
                  },
                }))}
                dataSource={progress.data}
                pagination={false}
                getPopupContainer={(node) => node}
                className={"transparent-table"}
                style={{ marginBottom: vh(6) }}
              />
              <StackChart
                prefix={progress.count.title}
                suffix={
                  "数量：" + progress.count.data.reduce((r, c) => ((r += c.value), r), 0) + "个"
                }
                data={progress.count.data.map((e) => ({
                  ...e,
                  type: progress.count.title,
                }))}
                color={progress.count.color}
                legend={{
                  selectedMode: "single",
                  onClick: (ev) => {
                    this.onStackItemClick(
                      ev["checked"],
                      progress.count.data.find((e) => e.status == ev["item"].value)
                    );
                  },
                }}
              />
            </CardLayout>
            <CardLayout
              {...statistics}
              className={" pe-auto"}
              suffix={
                <Tooltip title={"公式"} placement="left">
                  <span className="opacity_60">{statistics.suffix}</span>
                </Tooltip>
              }
            >
              <Row
                style={{
                  alignItems: "flex-end",
                  lineHeight: vh(37),
                  whiteSpace: "nowrap",
                  display: "inline-block",
                }}
              >
                <label className="font_16 opacity_80">{"计费对象："}</label>
                <Breadcrumb style={{ display: "inline-block" }}>
                  <Breadcrumb.Item>
                    <span style={{ color: "#02D281" }} className={"font_16"}>
                      {townName}
                    </span>
                  </Breadcrumb.Item>
                  {statistics.pop.map((e) => (
                    <Breadcrumb.Item>
                      <Popover
                        placement="top"
                        trigger="click"
                        overlayClassName={"popover"}
                        content={
                          <div className="pop-stripe">
                            <table>
                              <thead>
                                <tr>
                                  <th>{e.label + e.value + e.unit}</th>
                                </tr>
                              </thead>
                              <tbody>
                                {e.data.map((e) => (
                                  <tr>
                                    <td className="px-md">{e}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        }
                      >
                        <a style={{ color: "#00BAFF" }} className={"font_16"}>
                          {e.label + e.value + e.unit}
                        </a>
                      </Popover>
                    </Breadcrumb.Item>
                  ))}
                </Breadcrumb>
              </Row>

              {statistics.colKeys.map((keys) => (
                <Row style={{ lineHeight: vh(38) }}>
                  {statistics.data
                    .filter(({ key }) => keys.includes(key))
                    .map((e) => (
                      <LabelItem {...e} style={{ marginRight: 12 }} />
                    ))}
                </Row>
              ))}

              <Bulletgraph data={[statistics.branchProportion]} />

              {statistics.data
                .filter((e) => statistics.rowKeys.includes(e.key))
                .map((e) => (
                  <LabelItem {...e} style={{ lineHeight: vh(38) }} />
                ))}
            </CardLayout>
          </div>
        </Drawer>
      );
    }
    return null;
  }
}
const LabelItem = ({ label, value, unit, ...rest }) => {
  return (
    <Row align="middle" {...rest}>
      <label className="font_16 opacity_80">{label + "："}</label>
      <span className="font_24 mr-sm">{value}</span>
      <span className="font_16 opacity_80">{" " + unit}</span>
    </Row>
  );
};
