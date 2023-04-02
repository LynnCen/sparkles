import React, {Component} from "react";
import Config from "../../config/Config";
import DrawInit from "../../components/tools/DrawInit";
import OpenTerrain from "../Menu/OpenTerrain";
import {message} from "antd";
import CustomFun from "../../config/CustomFun";
import Model from "../../components/model/Model";

const css = require("../../styles/custom.css");

interface ModelProps {
  modelList: any[];
  onClick?: (data) => void;
  picker: boolean;
  small?: boolean;
}

interface ModelStates {
  // imageUrl: string;
  // source: string;
  // title: string;
  // id: number;
  model: any;
  // isModal: boolean;
  // rotate: number;
  // width: number;
  // height: number;
  // deep: number;
  // position: any;
  loading: boolean;
}

class ModelList extends Component<ModelProps, ModelStates> {
  static defaultProps = {
    small: false
  };

  constructor(props: ModelProps) {
    super(props);
    this.state = {
      // imageUrl: "/images/model_error.jpg",
      // source: "",
      // title: "模型",
      // id: 0,
      model: {},
      // isModal: false,
      // rotate: 0,
      // width: 1,
      // height: 1,
      // position: {},
      // deep: 1,
      loading: false
    };
  }

  componentDidMount() {
  }

  // setData = data => {
  //   this.setState({
  //     imageUrl: Config.apiHost + data["img"],
  //     source: Config.apiHost + data["source"],
  //     title: data["title"],
  //     id: 0,
  //     rotate: 0,
  //     width: 1,
  //     height: 1,
  //     deep: 1,
  //     position: new Config.vrPlanner.GeoLocation(0, 0, 0)
  //   });
  // };

  handleEvent = e => {
    this.setState({
      loading: false
    });
    const {maps} = Config;
    CustomFun.onKeyDown(e, 27, () => {
      const layer = maps.getLayerById("buildLayer");
      const featureList = layer.getFeatureList();
      for (const feature of featureList) {
        if (feature.hasOwnProperty("isNew")) {
          if (feature.isNew) {
            layer.removeFeature(feature);
          }
        }
      }
    });
  };

  addModelToMap = data => {
    this.setState({
      loading: true
    });
    window.addEventListener("keydown", this.handleEvent);
    const {maps, vrPlanner} = Config;
    let first = true;
    const modelLayer =
      maps.getLayerById("buildLayer") ||
      new vrPlanner.Layer.FeatureLayer("buildLayer");
    maps.addLayer(modelLayer);

    const model = new Model({
      geo: new Config.vrPlanner.GeoLocation(0, 0, 0),
      title: data.title,
      url: data["source"],
      imageUrl: data["img"]
    });
    console.log(Config.apiHost + data["source"]);
    const {point} = model;

    modelLayer.addFeature(point);

    const modelReader = new vrPlanner.Model.ModelReader();
    // const point = new vrPlanner.Feature.Point();
    // point.isNew = true;
    // modelLayer.addFeature(point);
    DrawInit.DrawInit();
    message.loading("模型正在加载中，请将光标移到地图区域", 0);
    // window.addEventListener("mousemove", (e) => this.handleMove(e, point, first, modelReader))
    maps.bindEvent("mouseMove", event => {
      maps
        .getGeoLocationAtScreenPosPrecise(event.getPageX(), event.getPageY())
        .done(geoLocation => {
          if (geoLocation != null) {
            maps
              .getElevationPrecise(geoLocation.x(), geoLocation.y())
              .done(ele => {
                // if (ele < 0) { ele = 0; }
                model.setPosition(geoLocation.x(), geoLocation.y(), ele);
                if (first) {
                  setTimeout(() => {
                    modelReader
                      .read(Config.apiHost + data["source"])
                      .done(model => {
                        this.setState({
                          loading: false
                        });
                        message.destroy();
                      });
                  }, 100);
                  first = false;
                }
              });
          }
        });
    });
    maps.bindEvent("click", event => {
      window.removeEventListener("keydown", this.handleEvent);
      if (this.state.loading) {
        message.loading("模型正在加载中，请稍等");
      } else {
        message.destroy();
        maps.unbindEvent("mouseMove");
        // window.removeEventListener("mousemove", (e) => this.handleMove(e, point, first, modelReader));
        maps.unbindEvent("click");
        const geo = event.getGeoLocation();
        if (geo != null) {
          // if (ele < 0) ele = 0;
          model.geo = geo;
          model.setPosition(geo.x(), geo.y(), geo.z());
          this.setState(
            {
              model
            },
            () => {
              model.add(OpenTerrain.BindClick(model));
            }
          );
        }
      }
    });
  };

  handleClick = data => {
    const {picker, onClick} = this.props;
    if (picker) {
      onClick!!(data);
    } else {
      this.addModelToMap(data);
    }
  };

  render() {
    const {modelList, small} = this.props;
    return (
      <ul className={css["vrp-model-list"]}>
        {modelList
          ? modelList.map((item, index) => {
            return (
              <li key={index} className={css["vrp-model-li"]}>
                <div
                  className={
                    css["vrp-model-img"] + " " + (small && css["small"])
                  }
                  title={item.title}
                  style={{
                    backgroundImage: `url(${Config.apiHost + item.img})`
                  }}
                  onClick={() => this.handleClick(item)}
                />
              </li>
            );
          })
          : null}
      </ul>
    );
  }
}

export default ModelList;
