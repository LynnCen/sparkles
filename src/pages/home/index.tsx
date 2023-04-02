import { useEffect, useState, Component } from "react";
import { Drawer, Spin, Progress, Input } from "antd";
import React from "react";
import scss from "./style.module.scss";
import { DataBlock, InfoWin, ProgressBar, TextLabel } from "components/Universal";
import CardLayout, { CardLayoutSuffix } from "components/CardLayout";
import axios from "axios";
import map from "utils/TDTMap";
import { sxcother } from "config/sxcwms";
import { render } from "utils/common";

interface Props {
  [k: string]: any;
  visible: boolean;
  config: any;
  code: string | number;
}

interface States {
  config: any;
  data?: any;
}

export default class A extends Component<Props, States> {
  constructor(props) {
    super(props);
    this.state = {
      config: props.config,
    };
  }
  componentDidMount() {
    const { config } = this.state;
    if (config) {
      this.getData();
    }
    setTimeout(() => {
      map.map.addEventListener("click", this.onMapClick);
      map.map.addEventListener("zoomend", this.onMapMove);
      map.map.addEventListener("moveend", this.onMapMove);
    });
  }
  componentWillReceiveProps({ config, code }) {
    if (config && (!this.state.config || code != this.props.code)) {
      this.setState({ config }, this.getData);
    }
  }
  componentWillUnmount() {
    map.map.removeEventListener("click", this.onMapClick);
    map.map.removeEventListener("zoomend", this.onMapMove);
    map.map.removeEventListener("moveend", this.onMapMove);
    ["home0", "home1", "home2"].forEach((k) => map.map.removeLayer(map.sxcLayerMap[k]));
  }
  getData = () => {
    const { code } = this.props;
    const { config } = this.state;
    axios.get("/home/home_data?townCode=" + code).then((r) => {
      if (r.data) {
        config.statistics.forEach((e) => (e.number = r.data[e.key]));
        config.progress.forEach((item) => {
          Object.keys(item)
            .concat(item["completed"], item["pass"])
            .forEach((k) => k in r.data && (item[k] = r.data[k]));
          item.list.forEach((e) => (e.number = r.data[e.key]));
        });
        this.setState({ config });
      }
    });
    if (!map.getLayer(sxcother.home0.id)) {
      ["home0", "home1", "home2"].forEach((k) => map.map.addLayer(map.sxcLayerMap[k]));
    }
    ["home0", "home1", "home2"].forEach((k) =>
    (map.sxcLayerMap[k].setParams({ viewparams: `townCode:${code}` }),
      map.sxcLayerMap[k].setZIndex(99))
    );
  };
  onMapClick = ({ lnglat }) => {
    if (map.map.getZoom() >= map.CLASS_DETAIL_ZOOM) {
      let [x, y] = [lnglat.getLng(), lnglat.getLat()];
      axios.get(`/home/class_detail`, { params: { x, y } }).then((r) => {
        if (r.data) {
          const { config } = this.state;
          config.mapInfo.forEach((e) => (e.value = r.data[e.key]));
          let selector = `tdt-infowindow-custom${r.data.classId || 0}`;
          map.addInfoWin({ lnglat, content: `<div id="${selector}"></div>`, id: r.data.classId });
          render(<InfoWin data={config.mapInfo} />, "#" + selector);
        }
      });
    }
  };

  onMapMove = () => {
    const zoom = map.map.getZoom();
    const { styles } = map.sxcLayerMap["home0"].KR;
    let show;

    if (zoom < map.PLAUE_TREE_BIG_ZOOM) {
      map.map.removeLayer(map.sxcLayerMap['home3'])
    } else if (zoom >= map.PLAUE_TREE_BIG_ZOOM) {
      if (!map.getLayer(sxcother.home3.id)) {
        map.map.addLayer(map.sxcLayerMap["home3"]);
        map.sxcLayerMap['home3'].setParams({ layers: sxcother["home3"].layers })
      }
    }
    if (zoom < map.PLAUE_TREE_BIG_ZOOM && styles) {
      show = false;
    } else if (zoom >= map.PLAUE_TREE_BIG_ZOOM && !styles) {
      show = true;
    } else return;
    ["home0", "home1", "home2"].forEach((k) =>
      map.sxcLayerMap[k].setParams({ styles: show ? sxcother[k].styles : "" })
    );

  };
  onMarkerClick(ev, info) {
    console.log(this);
  }
  render() {
    const { visible, code } = this.props;
    const { config } = this.state;
    return (
      <Drawer
        placement="right"
        closable={false}
        mask={false}
        className={"drawer drawer-right arial " + scss["homeR"]}
        visible={visible}
      >
        <div className={scss["right"]}>
          {config ? (
            <>
              {config.progress.map((item, i) => {
                const unit = item.unit;
                return (
                  <div key={i} className={scss["childBox"]}>
                    <CardLayout
                      title={item.title}
                      enTitle={item.subtitle}
                      suffix={<CardLayoutSuffix label="单位：" unit={item.unit} />}
                    >
                      <div className={scss["childList"]}>
                        {item.list.map((content, i) => {
                          return (
                            <DataBlock
                              key={i}
                              imgUrl={content.imgUrl}
                              title={content.title}
                              number={content.number}
                              unit={""}
                            />
                          );
                        })}
                      </div>
                      <div className={scss["childText"]}>
                        <div>
                          <TextLabel
                            title="除治目标"
                            number={i ? item.list[1].number : item["goals" + item.key]}
                            unit={""}
                          />
                          <TextLabel
                            title="上报除治"
                            number={item[item.completed[0]]}
                            unit={""}
                          />
                        </div>
                        <ProgressBar
                          blueShow={false}
                          number={item[item.completed[1]]}
                          strokeColor="linear-gradient(90deg, #39F4E8 0%, #02D281 100%)"
                          title="上报进度："
                        />
                        <TextLabel title="验收除治" number={item[item.pass[0]]} unit={""} />
                        <ProgressBar
                          blueShow={false}
                          number={item[item.pass[1]]}
                          strokeColor="linear-gradient(90deg, #39F4E8 0%, #02D281 100%)"
                          title="验收进度："
                        />
                      </div>
                    </CardLayout>
                  </div>
                );
              })}
              <CardLayout
                title="治理团队"
                enTitle="Governance team"
                suffix={
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 400,
                      color: "rgba(255,255,255,0.6)",
                    }}
                  >
                    团队 · 统计
                  </div>
                }
              >
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                  }}
                >
                  {config.statistics.map((item, i) => {
                    return (
                      <div key={i} style={{ flex: "0 0 50%" }}>
                        <TextLabel title={item.title} number={item.number} unit={item.unit} />
                      </div>
                    );
                  })}
                </div>
              </CardLayout>
            </>
          ) : (
            <Spin size="large" />
          )}
        </div>
      </Drawer>
    );
  }
}
