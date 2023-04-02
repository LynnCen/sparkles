import { Component } from "react";
import { notification } from "antd";
import VrpIcon from "../../components/VrpIcon";
import Distance from "../../components/measure/Distance";
import DrawInit from "../../components/tools/DrawInit";
import CustomFun from "../../config/CustomFun";
import VrpTips from "../../components/VrpTips";
import Polygon from "../../components/model/Polygon";
import Tools from "../../components/tools/Tools";
import Config from "../../config/Config";
import TransCoordinate from "../../components/tools/Coordinate";
import Draw from "./Draw";

const css = require("../../styles/custom.css");
const scss = require('../../styles/scss/sharepage.scss')

/**
 * @name Measure
 * @author: bubble
 * @create: 2018/11/30
 * @description Header测量模块
 */

interface IMeasureProps { }

interface IMeasureStates {
  distanceVisible: boolean;
  areaVisible: boolean;
  areaSize: number;
}

class Measure extends Component<IMeasureProps, IMeasureStates> {
  constructor(props: IMeasureProps) {
    super(props);
    this.state = {
      distanceVisible: false,
      areaVisible: false,
      areaSize: 0
    };
  }

  distance = () => {
    Draw.closeBlockLayer();
    Draw.closeLineLayer();
    VrpTips.showTips(
      "测量距离方法",
      <div>
        <p className={css["m-b-sm"]}>1、点击左键在地图中画线测量</p>
        <p className={css["m-b-sm"]}>2、点击右键完成本次测量</p>
        <p className={css["m-b-sm"]}>3、退出测量（ESC）</p>
      </div>,
      288
    );
    this.setState({
      distanceVisible: true
    });
    DrawInit.DrawInit();
    Distance.measureClick();
    window.addEventListener("keydown", this.handleEvent);
  };

  handleEvent = e => {
    CustomFun.onKeyDown(e, 27, () => {
      notification.destroy();
      DrawInit.DrawInit();
      window.removeEventListener("keydown", this.handleEvent);
    });
  };

  showInfo = (feature: Polygon) => {
    const { vrPlanner, maps } = Config;
    const vertices = feature.vertices;
    const t: any = [];
    for (let i = 0; i < feature.getNumVertices(); i++) {
      t[i] = vrPlanner.Extension.GeographicLib.DMS.DecodeLatLon(
        TransCoordinate.MercatorToWGS84(vertices[i]).lat + "",
        TransCoordinate.MercatorToWGS84(vertices[i]).lon + ""
      );
    }
    const s = vrPlanner.Extension.GeographicLib.Geodesic.WGS84.Area(t, false);
    const content = `<p style="display:inline-block;padding:6px;color: #fff; text-shadow: 2px 2px #333;background:rgba(0,0,0,0.65)">当前占地面积：${Math.abs(
      s.area
    ).toFixed(2)}m²/${Math.abs((s.area * 3) / 2000).toFixed(3)}亩/${Math.abs(
      s.area / 1000000
    ).toFixed(4)}平方公里</p>`;
    const balloon = new vrPlanner.Balloon(content);
    const pointStyle = new vrPlanner.Style.PointStyle();
    pointStyle.setColor(new vrPlanner.Color("#FFFFFF00"));
    feature.polygon.setBalloon(balloon);
    feature.polygon.bindEvent("click", e => {
      if (e.isRightClick()) {
        const feature = e.getFeature();
        const polygonLayer = maps.getLayerById("areaLayer");
        polygonLayer.removeFeature(feature);
      }
    });
  };

  area = () => {
    Draw.closeBlockLayer();
    Draw.closeLineLayer();
    VrpTips.showTips(
      "测量面积方法",
      <div>
        <p className={css["m-b-sm"]}>1、点击左键在地图中绘制选区</p>
        <p className={css["m-b-sm"]}>2、3个点及以上时，可点击右键完成绘制</p>
        <p className={css["m-b-sm"]}>3、退出测量（ESC）</p>
      </div>,
      350
    );
    DrawInit.DrawInit();
    const polygon = new Polygon({ polygonStyle: "ProjectedFeatureStyle" });
    polygon.type = "measurePolygon";
    Tools.Draw(polygon, this.showInfo);
    let layer = Config.maps.getLayerById("polygonLayer");
    if (!layer) {
      layer = new Config.vrPlanner.Layer.FeatureLayer("polygonLayer");
    }
    layer.addFeature(polygon.polygon);
    Config.maps.addLayer(layer);
    // Area.AreaClick();
    window.addEventListener("keydown", this.handleEvent);
  };

  render() {
    const template = window['template']
    const syList = [
      {
        title: "测量",
        icon: `${process.env.publicPath}images/songyangMap/icon/syMeasure.svg`,
        click: this.distance
      },
      {
        title: "测面",
        icon: `${process.env.publicPath}images/songyangMap/icon/syArea.svg`,
        click: this.area
      },
    ]
    return (
      <div className={css["vrp-header-menu"]}>
        {
          template && template.substring(0, 11) == 'songyangMap' ?
            <>
              {
                syList.map((r, i) => {
                  return <div key={i} className={scss['sy-tool']} onClick={r.click}>
                    <img src={r.icon} alt="" /> <span>{r.title}</span>
                  </div>
                })
              }
            </>
            :
            <>
              <VrpIcon className={css["vrp-menu-icon"]} iconName={"icon-measure1"} title={"测量"} />
              <ul className={css["vrp-second-menu"]}>
                <li className={css["vrp-second-li"]} onClick={this.distance}>
                  <VrpIcon
                    className={css["vrp-menu-icon"]}
                    iconName={"icon-measure"}
                    title={"测量距离"}
                  />
                </li>
                <li className={css["vrp-second-li"]} onClick={this.area}>
                  <VrpIcon className={css["vrp-menu-icon"]} iconName={"icon-area"} title={"测量面积"} />
                </li>
              </ul>
            </>
        }
      </div>
    );
  }
}

export default Measure;
