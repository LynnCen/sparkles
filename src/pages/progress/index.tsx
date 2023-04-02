import React, { useEffect, useState, Component } from "react";
import { Drawer, Row, Col, Breadcrumb, Popover } from "antd";
import Progress from "../../components/Progress";
import CardLayout, {CardLayoutSuffix} from "../../components/CardLayout";
import {InfoWin, LabelItem, VerticalDataBlock, InfoWinTable, DataBlock} from "../../components/Universal";
import css from "./style.module.scss";
import { percentage, render, vh, capitalize } from "../../utils/common";
import axios from "axios";
import map from "utils/TDTMap";
import context from "layout/context";
import { sxcother } from "config/sxcwms";
import isEqual from "lodash/isEqual";

const strokeColor = { "0%": "#39F4E8", "100%": "#02D281" };

interface Props {
  [k: string]: any;
  visible: boolean;
  config: any;
  code: string;
  townName: string;
  checkedItems: any[];
}

interface States {
  configData: any;
  teamIdList: number[];
  classList: [];
  activeBlockIdx?: undefined | number;
}

export default class A extends Component<Props, States> {
  static contextType = context;
  constructor(props) {
    super(props);
    this.state = {
      configData: props.config,
      teamIdList: [],
      classList: [],
    };
  }

  componentDidMount() {
    const { configData } = this.state;
    if (configData) {
      this.getData();
    }
    map.map.addEventListener("click", this.onMapClick);
  }

  componentWillReceiveProps({ config, code, checkedItems }) {
    const { configData, teamIdList } = this.state;
    if (config && (!configData || code != this.props.code)) {
      this.setState({ configData: config, activeBlockIdx: void 0 }, () => {
        this.getData();
      });
    }
    if (
      !isEqual(
        checkedItems.map((e) => e.id),
        teamIdList
      )
    ) {
      this.setState({ teamIdList: checkedItems.map((e) => e.id) }, () => {
        this.getData();
        this.getClass(checkedItems);
      });
    }
  }
  componentWillUnmount() {
    map.map.removeEventListener("click", this.onMapClick);
  }

  onMapClick = ({ lnglat }) => {
    if (map.map.getZoom() >= map.CLASS_DETAIL_ZOOM) {
      let [x, y] = [lnglat.getLng(), lnglat.getLat()];
      axios.get(`/progress/class_detail`, { params: { x, y } }).then((r) => {
        if (r.data) {
          const { configData } = this.state;
          configData.mapInfo.forEach((e) => (e.value = r.data[e.key]));
          let selector = `tdt-infowindow-custom${r.data.classId || 0}`;
          map.addInfoWin({ lnglat, content: `<div id="${selector}"></div>`, id: r.data.classId });
          render(<InfoWin data={configData.mapInfo} />, "#" + selector);
        }
      });
    }
  };

  getData = async () => {
    const { code } = this.props;
    const { configData, teamIdList } = this.state;
    const level = teamIdList.length > 0 ? 2 : 1;
    axios
      .get(`/progress/data`, { params: { level, townCode: code, teamList: teamIdList.join(",") } })
      .then((r) => {
        const { content } = configData.progress;
        ["area", "number"].forEach((k) => {
          content[k].data.forEach((e, i) => {
            e.value = r.data[e.key];
            // e.layer = Object.values(sxcother.progress.layerMap)[i];
          });
          content[k].progress.value = r.data[`completed${capitalize(k)}Progress`];
        });
        configData.quality.content.forEach((e) => (e.value = r.data[e.key]));
        this.setState({ configData });
      });
  };

  getClass = (checkedItems) => {
    const { configData } = this.state;
    const { pop } = configData.quality;
    if (checkedItems.length > 0) {
      const tList = checkedItems.map((e) => e.id);
      axios.get(`/progress/list_class`, { params: { teamList: tList.join(",") } }).then((r) => {
        pop[0].value = checkedItems.length;
        pop[0].data = checkedItems.map((e) => e.teamName);
        pop[1].data = r.data;
        pop[1].value = r.data.length;
        this.setState({ configData });
      });
    } else {
      pop.forEach((e) => ((e.value = 0), (e.data = [])));
      this.setState({ configData });
    }
  };

  showClass = (i, item) => {
    const { code } = this.props;
    const { teamIdList, activeBlockIdx } = this.state;
    if (item.value) {
      this.setState({ activeBlockIdx: activeBlockIdx == i ? void 0 : i });
      const { layers } = map.sxcLayerMap["progress"].KR;
      let viewparams = `townCode:${code}`;
      if (
        !layers.includes(item.layer) ||
        (typeof activeBlockIdx == "number" && Math.abs(activeBlockIdx - i) == 3)
      ) {
        if (!map.getLayer(sxcother["progress"].id)) {
          map.map.addLayer(map.sxcLayerMap["progress"]);
        }
        if (teamIdList.length) {
          viewparams += `;teamList:${teamIdList.join("\\,")}`;
        }
        map.sxcLayerMap["progress"].setParams({ layers: item.layer, viewparams });
        this.context.centerTownBy({ code });
      } else {
        map.sxcLayerMap["progress"].setParams({ layers: "" });
        map.map.removeLayer(map.sxcLayerMap["progress"]);
      }
    }
  };

  render() {
    const { visible, townName } = this.props;
    const { configData, activeBlockIdx } = this.state;
    console.log(activeBlockIdx)
    if (configData) {
      let { progress, quality } = configData;
      return (
        <Drawer
          placement="right"
          closable={false}
          mask={false}
          className={"drawer drawer-right "}
          visible={visible}
        >
          <div className={""}>
            <CardLayout
              style={{ marginBottom: vh(40) }}
              title={progress.title}
              enTitle={progress.enTitle}
              suffix={<CardLayoutSuffix {...progress.suffix}/>}
            >
              <Row justify="space-around" className={"mb-md"}>
                {progress.content.area.data.map((it, i) => {
                  return (
                      <DataBlock
                        title={it.text}
                        number={it.value}
                        imgUrl={it.icon}
                        onClick={() => this.showClass(i, it)}
                        hover={true}
                        className={(activeBlockIdx == i && "hover-highlight") || ""}
                      />
                  );
                })}
              </Row>
              <LabelItem text={progress.content.area.progress.label}>
                <Progress
                  percent={progress.content.area.progress.value}
                  strokeWidth={14}
                  style={{
                    borderRadius: 0,
                  }}
                  strokeColor={strokeColor}
                />
              </LabelItem>
              <Row justify="space-around" className={"mb-md"}>
                {progress.content.number.data.map((it, i) => {
                  return (

                      <DataBlock
                        title={it.text}
                        number={it.value}
                        imgUrl={it.icon}
                        onClick={() => this.showClass(i + 3, it)}
                        hover={true}
                        className={(activeBlockIdx == i + 3 && "hover-highlight") || ""}
                      />

                  );
                })}
              </Row>
              <LabelItem text={progress.content.number.progress.label}>
                <Progress
                  percent={progress.content.number.progress.value}
                  strokeWidth={14}
                  style={{
                    borderRadius: 0,
                  }}
                  strokeColor={strokeColor}
                />
              </LabelItem>
            </CardLayout>
            <CardLayout
              title={quality.title}
              enTitle={quality.enTitle}
              suffix={<CardLayoutSuffix {...quality.suffix}/>}
            >
              <LabelItem text={"计费对象"}>
                <Breadcrumb className={css["breadcrumb"]}>
                  <Breadcrumb.Item>
                    <span className={css["green"]}>{townName}</span>
                  </Breadcrumb.Item>
                  {quality.pop.map((e, i) => (
                    <Popover
                      key={i}
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
                              {e.data.map((e, i) => (
                                <tr key={i}>
                                  <td className="px-md">{e}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      }
                    >
                      <Breadcrumb.Item>
                        <a className={"font_16"}>
                          {e.label + e.value + e.unit}
                        </a>
                      </Breadcrumb.Item>{" "}
                    </Popover>
                  ))}
                </Breadcrumb>
              </LabelItem>
              {quality.content.map((it, i) => {
                return (
                  <LabelItem key={i} text={it.label}>
                    <span className={css["border-bottom-number"]}>{it.value}</span>
                    <span className={"opacity_80"}>{it.unit}</span>
                  </LabelItem>
                );
              })}
            </CardLayout>
          </div>
        </Drawer>
      );
    } else return null;
  }
}
