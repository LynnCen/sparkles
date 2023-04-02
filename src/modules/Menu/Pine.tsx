import { Component, useState } from "react";
import VrpIcon from "../../components/VrpIcon";
import Config from "../../config/Config";
import { Terrain, Geometry, Mark } from "../../components/model/";
import VrpModal from "../../components/VrpModal";
import { Button, Spin, List } from "antd";
const { maps, vrPlanner } = Config;

const css = require("../../styles/custom.css");

/**
 * @name Station
 * @author: bubble
 * @create: 2018/12/6
 * @description: 管道
 */

export default function Pine(props) {
  const [modal, setModal] = useState(false);
  return (
    <div>
      <VrpIcon
        iconName={"icon-pine"}
        className={css["vrp-menu-icon"]}
        title={"点位获取"}
        onClick={e => setModal(true)}
      />
      {modal && <PineModal onClose={() => setModal(false)} />}
    </div>
  );
}

interface PineProps {
  onClose?: Function;
}
interface PineStates {
  visible: boolean;
  terrain: Terrain;
  loading: boolean;
  polygons: Geometry[];
  treeList: any;
}
export class PineModal extends Component<PineProps, PineStates> {
  POLYGON: Geometry;
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      terrain: Terrain.terrains[0],
      loading: true,
      polygons: [],
      treeList: []
    };
    this.getData();
  }

  getData = () => {
    const { visible, polygons } = this.state;
    if (visible && !polygons.length) {
      const polygons: Geometry[] = [];
      let layer = maps.getLayerById("pineLayer");
      if (!layer) {
        layer = new vrPlanner.Layer.FeatureLayer("pineLayer");
        maps.addLayer(layer);
      }
      const spot = [
        {
          title: "小班0",
          color: "#0EE61566",
          vertices: [
            [13334523.05, 3303269.36, 0],
            [13334527.46, 3303349.32, 0],
            [13334497.54, 3303356.24, 0],
            [13333650.95, 3303504.25, 0],
            [13333657.84, 3302924.82, 0]
          ]
        },
        {
          title: "小班1",
          color: "#252FD266",
          vertices: [
            [13334520, 3303267.69, 0],
            [13334192.8, 3302879.25, 0],
            [13334245.55, 3302517.36, 0],
            [13334149.22, 3302147.41, 0],
            [13333656.34, 3302148.02, 0],
            [13333658.12, 3302924.46, 0]
          ]
        },
        {
          title: "小班2",
          color: "#DBE81166",
          vertices: [
            [13334636.51, 3303226.7, 0],
            [13334665.94, 3302146.51, 0],
            [13334151.11, 3302148.91, 0],
            [13334246.43, 3302517.36, 0],
            [13334194.39, 3302879.11, 0],
            [13334524.62, 3303266.51, 0],
            [13334562.81, 3303264.26, 0],
            [13334603.38, 3303219.86, 0]
          ]
        },
        {
          title: "小班3",
          color: "#079FD966",
          vertices: [
            [13334638.7, 3303216.85, 0],
            [13334889.87, 3302916.83, 0],
            [13335289.1, 3302873.63, 0],
            [13335288.78, 3302145.57, 0],
            [13334666.12, 3302146.56, 0]
          ]
        },
        {
          title: "小班4",
          color: "#FF450066",
          vertices: [
            [13334680.68, 3303281.1, 0],
            [13335288.72, 3303276.58, 0],
            [13335289.12, 3302874.06, 0],
            [13334890.02, 3302917.01, 0],
            [13334638.74, 3303217.28, 0],
            [13334652.62, 3303263.4, 0],
            [13334664.59, 3303268.32, 0]
          ]
        },
        {
          title: "小班5",
          color: "#7ED32166",
          vertices: [
            [13335281.51, 3304090.23, 0],
            [13334608.97, 3303430.95, 0],
            [13334678.7, 3303344.41, 0],
            [13334668.82, 3303305.33, 0],
            [13334680.58, 3303281.48, 0],
            [13335285.24, 3303277.68, 0]
          ]
        },
        {
          title: "小班6",
          color: "#00FFFF66",
          vertices: [
            [13334247.47, 3304091.62, 0],
            [13334251.57, 3303805.71, 0],
            [13334497.22, 3303357.66, 0],
            [13334510.92, 3303404.8, 0],
            [13334550.38, 3303397.46, 0],
            [13334603.36, 3303429.15, 0],
            [13335280.82, 3304090.09, 0]
          ]
        },
        {
          title: "小班7",
          color: "#8210E666",
          vertices: [
            [13333652.98, 3304090.32, 0],
            [13333653.04, 3303505.31, 0],
            [13334497.12, 3303356.78, 0],
            [13334251, 3303805.42, 0],
            [13334247.38, 3304091.73, 0]
          ]
        }
      ];
      spot.forEach(item => {
        const { color, vertices, title } = item;
        const geometry = new Geometry({
          color,
          title,
          polygonStyle: "ProjectedFeatureStyle",
          opacity: 0.3
        });
        vertices.forEach(vertex => {
          geometry.addVertex(
            new vrPlanner.GeoLocation(vertex[0], vertex[1], vertex[2])
          );
        });
        layer.addFeature(geometry.polygon);
        polygons.push(geometry);
      });
      fetch(
        Config.apiHost + "/res/cad/json/admin/1593071749226vapgjzgocu.json",
        {
          mode: "cors"
        }
      )
        .then(res => res.json())
        .then(res => {
          this.setState({ treeList: res, loading: false, polygons });
        });
    }
  };

  closeModal = () => {
    maps.removeLayer("pineLayer");
    maps.removeLayer("pineMarkLayer");
    const { onClose } = this.props;
    onClose && onClose();
    this.setState({ visible: false, loading: false });
  };

  getTree = (feature: Geometry) => {
    let count = 0;
    const { treeList } = this.state;
    treeList.forEach(item => {
      const { position } = item;
      const info = position.split(",");
      if (feature.polygon.contains(info[0], info[1])) {
        count++;
      }
    });
    return count;
  };

  itemClick = (feature: Geometry) => {
    console.log(feature);
    if (this.POLYGON) {
      this.POLYGON.setVisible(true);
    }
    this.POLYGON = feature;
    feature.setVisible(false);
    let layer = maps.getLayerById("pineMarkLayer");
    if (!layer) {
      layer = new vrPlanner.Layer.FeatureLayer("pineMarkLayer");
      maps.addLayer(layer);
    } else {
      layer.clearFeatures();
    }
    const { treeList } = this.state;
    treeList.forEach((item, index) => {
      const { position } = item;
      const info = position.split(",");
      if (feature.polygon.contains(info[0], info[1])) {
        const mark = new Mark({
          title: info[3],
          geo: new vrPlanner.GeoLocation(info[0], info[1], 5),
          titleVisible: false,
          height: 0,
          icon: "/res/image/icon/admin/26691587896109332.png"
        });
        mark.style.setRenderLevel((index % 5) + 16);
        mark.style.setScale(0.015);
        layer.addFeature(mark.point);
      }
    });
  };

  itemBlur = (feature: Geometry) => {
    feature.init();
  };

  itemFocus = (feature: Geometry) => {
    this.init();
    feature.setOpacity(1);
  };

  init = () => {
    const { polygons } = this.state;
    polygons.forEach(item => {
      item.init();
    });
  };

  render() {
    const { polygons, loading, visible } = this.state;
    const btnGroup = (
      <div className={css["text-center"]}>
        <Button
          className={css["m-l-md"]}
          type="primary"
          onClick={this.closeModal}
        >
          关闭
        </Button>
      </div>
    );
    return visible ? (
      <VrpModal
        defaultPosition={{ x: 30, y: 95 }}
        title="小班列表"
        style={{ width: 300 }}
        footer={btnGroup}
        onClose={this.closeModal}
      >
        <Spin tip="数据加载中..." spinning={loading}>
          <List
            size="small"
            bordered
            dataSource={polygons}
            renderItem={item => (
              <List.Item>
                <div
                  onMouseLeave={() => this.itemBlur(item)}
                  onMouseEnter={() => this.itemFocus(item)}
                  onClick={() => this.itemClick(item)}
                >
                  {item.title}：共有{this.getTree(item)}株病树
                </div>
              </List.Item>
            )}
          />
        </Spin>
      </VrpModal>
    ) : null;
  }
}
