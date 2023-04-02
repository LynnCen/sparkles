import React from "react";
import { Select, Slider, InputNumber, message } from "antd";
import Config from "../config/Config";
import ShowData from "./tools/showData";
import ReactDOM from "react-dom";

const Option = Select.Option;

const css = require("../styles/compare.css");
const customCss = require("../styles/custom.css");

/**
 * @name CompareTerrain
 * @author: bubble
 * @create: 2019/8/23
 * @description: 地块对比
 */

interface CtProps {
  drawerVisible: boolean;
  compareTerrain: any[];
}

interface CtStates {
  isVertical: boolean;
  widthOfOne: string;
  heightOfOne: string;
  widthOfTwo: string;
  heightOfTwo: string;
  containerOneWidth: string;
  containerOneHeight: string;
  containerTwoWidth: string;
  containerTwoHeight: string;
  oneUrl: string;
  twoUrl: string;
  isCompleted: boolean;
  altitude: number;
  longitude: number;
  latitude: number;
  isShowAttribute: boolean;
}

let dragType = "vertical",
  modelType = "together",
  oneMaps,
  twoMaps,
  isShow = true;

const maps = function (a, b, c, d) {
  this.m1 = a;
  this.v1 = b;
  this.m2 = c;
  this.v2 = d;
  this.p = null;
  const click = () => {
    const m1 = this.m1;
    const m2 = this.m2;
    const v1 = this.v1;
    const v2 = this.v2;
    const polygon1 = new polygon("polygonLayer", m1, v1);
    const polygon2 = new polygon("polygonLayer", m2, v2);
    const p1 = polygon1.init();
    const p2 = polygon2.init();
    const STATE_CREATE = "create";
    const STATE_ADD = "add";

    m1.bindEvent("click", e => {
      const geo = e.getGeoLocation();
      if (e.isLeftClick()) {
        if (geo) {
          p1.addVertex(geo);
          const geo1 = new v2.GeoLocation(geo.x(), geo.y(), geo.z());
          p2.addVertex(geo1);
        }
      } else if (e.isRightClick()) {
        m2.unbindEvent("click");
        m1.unbindEvent("click");
      }
    });
    m2.bindEvent("click", e => {
      const geo = e.getGeoLocation();
      if (e.isLeftClick()) {
        if (geo) {
          const geo1 = new v1.GeoLocation(geo.x(), geo.y(), geo.z());
          p1.addVertex(geo1);
          p2.addVertex(geo);
        }
      } else if (e.isRightClick()) {
        m2.unbindEvent("click");
        m2.unbindEvent("click");
      }
    });
  };

  const polygon = function (i, m, v) {
    this.id = i;
    this.m = m;
    this.v = v;
    this.layer = this.m.getLayerById(i) || new this.v.Layer.FeatureLayer(i);
    const getLayerId = () => {
      return this.id;
    };
    const getLayer = () => {
      return this.layer;
    };
    const init = () => {
      const layer = this.layer;
      const v = this.v;
      const m = this.m;
      const polygon = new v.Feature.Polygon();
      const style = new v.Style.ExtrudeStyle();
      style.setColor(new v.Color("#ffffff"));
      style.setOpacity(0.7);
      style.setHeight(40);
      polygon.setStyle(style);
      m.addLayer(layer);
      layer.addFeature(polygon);
      return polygon;
    };
    return {
      getLayerId,
      getLayer,
      init
    };
  };
  return {
    click,
    polygon
  };
};

class CompareTerrain extends React.Component<CtProps, CtStates> {
  line;
  alignToggle;
  interval;

  constructor(props: CtProps) {
    super(props);
    this.state = {
      isVertical: false,
      widthOfOne: window.innerWidth + "px",
      widthOfTwo: window.innerWidth + "px",
      heightOfOne: "100%",
      heightOfTwo: "100%",
      containerOneWidth: window.innerWidth / 2 + "px",
      containerOneHeight: window.innerHeight + "px",
      containerTwoWidth: window.innerWidth / 2 + "px",
      containerTwoHeight: window.innerHeight + "px",
      oneUrl: "http://127.0.0.1:1234/API/res/source/CC/SWLH_20191101/a3x/",
      twoUrl: "http://127.0.0.1:1234/API/res/source/CC/SWLH_20181016/a3x/",
      // oneUrl: "https://highdata.oss-cn-hangzhou.aliyuncs.com/DEM/20190721lishui1419/",
      // twoUrl: "https://highdata.oss-cn-hangzhou.aliyuncs.com/DEM/20190721lishui1419/",
      isCompleted: false,
      altitude: 0,
      longitude: 0,
      latitude: 0,
      isShowAttribute: false
    };
  }

  handleAlignToggle = () => {
    let isVertical = dragType === "level";
    const isTogether = modelType === "together";
    isVertical ? (dragType = "vertical") : (dragType = "level");
    this.ModelChange(isTogether, isVertical, true);
  };

  handleSingleToggle = () => {
    const isVertical = dragType === "vertical";
    const isTogether = modelType === "self";
    this.line.draggable = isTogether;
    isTogether ? (modelType = "together") : (modelType = "self");
    this.ModelChange(isTogether, isVertical, false);
  };

  ModelChange = (isTogether, isVertical, isToggle) => {
    const height = window.innerHeight;
    const width = window.innerWidth;
    if (isToggle) {
      this.setState({
        isVertical: !this.state.isVertical
      });
    }
    this.line.removeAttribute("style");
    this.alignToggle.removeAttribute("style");

    const containerOneWidth = (isVertical ? width / 2 : width) + "px";
    const containerOneHeight = (isVertical ? height : height / 2) + "px";
    const containerTwoWidth = (isVertical ? width / 2 : width) + "px";
    const containerTwoHeight = (isVertical ? height : height / 2) + "px";

    const heightOfOne =
      (isVertical ? height : isTogether ? height : height / 2) + "px";
    const widthOfOne =
      (isVertical ? (isTogether ? width : width / 2) : width) + "px";
    const heightOfTwo =
      (isVertical ? height : isTogether ? height : height / 2) + "px";
    const widthOfTwo =
      (isVertical ? (isTogether ? width : width / 2) : width) + "px";
    this.setState({
      containerOneWidth,
      containerOneHeight,
      containerTwoWidth,
      containerTwoHeight,
      heightOfOne,
      widthOfOne,
      heightOfTwo,
      widthOfTwo
    });
  };

  drag = (x, y) => {
    const isVertical = dragType === "vertical";
    // const isTogether = modelType === "together";
    this.line.style.left = (isVertical ? x : 0) + "px";
    this.line.style.top = (isVertical ? 0 : y) + "px";
    this.alignToggle.style.left = (isVertical ? x : "50%") + "px";
    this.alignToggle.style.top = (isVertical ? "50%" : y) + "px";
    isVertical
      ? this.setState({
        containerOneWidth: x + "px",
        containerTwoWidth: window.innerWidth - x + "px"
      })
      : this.setState({
        containerOneHeight: y + "px",
        containerTwoHeight: window.innerHeight - y + "px"
      });
  };

  lineOnDrag = e => {
    const x = e.clientX;
    const y = e.clientY;
    this.drag(x, y);
  };

  lineOnDragEnd = e => {
    const x = e.clientX;
    const y = e.screenY;
    this.drag(x, y);
  };

  mapStart = () => {
    const camera = Config.maps.getCamera();
    const position = camera.getPosition();
    const lookAt = camera.getLookAt();
    const oneMaps = One.window.maps;
    const oneVrp = One.window.vrplanner;
    const twoMaps = Two.window.maps;
    const twoVrp = Two.window.vrplanner;
    console.log(this.state)
    const oneTerrain = new oneVrp.Layer.A3XTerrainLayer(
      "terrain",
      this.state.oneUrl
    );
    oneMaps.addLayer(oneTerrain);
    oneTerrain.bindEvent("loadingTileCompleted", function () {
      oneTerrain.unbindEvent("loadingTileCompleted");
      const camera = oneMaps.getCamera();
      const p = new oneVrp.GeoLocation(
        position.x(),
        position.y(),
        position.z()
      );
      const l = new oneVrp.GeoLocation(lookAt.x(), lookAt.y(), lookAt.z());
      camera.setPosition(p, l);
      camera.bindEvent("move", function () {
        const position = camera.getPosition();
        const lookAt = camera.getLookAt();
        const p = new twoVrp.GeoLocation(
          position.x(),
          position.y(),
          position.z()
        );
        const l = new twoVrp.GeoLocation(lookAt.x(), lookAt.y(), lookAt.z());
        twoMaps.getCamera().setPosition(p, l);
      });
    });
    const twoTerrain = new twoVrp.Layer.A3XTerrainLayer(
      "terrain",
      this.state.twoUrl
    );
    twoMaps.addLayer(twoTerrain);
    twoTerrain.bindEvent("loadingTileCompleted", function () {
      twoTerrain.unbindEvent("loadingTileCompleted");
      const p = new twoVrp.GeoLocation(
        position.x(),
        position.y(),
        position.z()
      );
      const l = new twoVrp.GeoLocation(lookAt.x(), lookAt.y(), lookAt.z());
      const camera = twoMaps.getCamera();
      camera.setPosition(p, l);
      camera.bindEvent("move", function () {
        const position = camera.getPosition();
        const lookAt = camera.getLookAt();
        const p = new oneVrp.GeoLocation(
          position.x(),
          position.y(),
          position.z()
        );
        const l = new oneVrp.GeoLocation(lookAt.x(), lookAt.y(), lookAt.z());
        oneMaps.getCamera().setPosition(p, l);
      });
    }),
      this.setState({
        isCompleted: true
      });
  };

  componentDidMount() {
    if (this.props.compareTerrain.length === 0) {
      message.warning("暂无对比地块录入");
    } else {
      this.setState({
        oneUrl: this.props.compareTerrain[0].dataUrl,
        twoUrl: this.props.compareTerrain[1].dataUrl
      });
      const interval = setInterval(() => {
        if (One.window.maps && Two.window.maps) {
          this.mapStart();
          clearInterval(interval);
        }
      }, 10);
    }
  }

  componentWillUnmount() {
    const oneMaps = One.window.maps;
    const oneCamera = oneMaps.getCamera();
    const position = oneCamera.getPosition();
    const lookAt = oneCamera.getLookAt();
    const camera = Config.maps.getCamera();
    const p = new Config.vrPlanner.GeoLocation(
      position.x(),
      position.y(),
      position.z()
    );
    const l = new Config.vrPlanner.GeoLocation(
      lookAt.x(),
      lookAt.y(),
      lookAt.z()
    );
    camera.setPosition(p, l);
  }

  longitudeChange = value => {
    this.setState({ longitude: value }, () => {
      this.translation();
    });
  };

  latitudeChange = value => {
    this.setState({ latitude: value }, () => {
      this.translation();
    });
  };

  altitudeChange = value => {
    this.setState({ altitude: value }, () => {
      this.translation();
    });
  };

  translation = () => {
    const twoMaps: any = Two.window.maps;
    const twoVrp: any = Two.window.vrplanner;
    const terrain = twoMaps.getLayerById("terrain");
    terrain.setTranslation(
      new twoVrp.Math.Double3(
        this.state.longitude,
        this.state.latitude,
        this.state.altitude
      )
    );
  };

  showAttribute = () => {
    this.setState(state => ({
      isShowAttribute: !state.isShowAttribute
    }));
  };

  render() {
    const { isVertical, isShowAttribute } = this.state;
    return (
      <div style={{ height: "100vh" }}>
        <div
          className={css["containerOne"]}
          style={{
            width: this.state.containerOneWidth,
            height: this.state.containerOneHeight,
            backgroundColor: "#555555"
          }}
        >
          {/* {this.state.isCompleted ? <Select
            defaultValue={"2019年01月"}
            style={{ position: "absolute", top: "130px", left: "30px", zIndex: 1 }}
          >
            <Option value="2019年01月">2019年01月</Option>
            <Option value="2019年08月">2019年08月</Option>
          </Select> : null} */}
          <iframe
            name="One"
            src={`${process.env.publicPath}container.html`}
            frameBorder="no"
            style={{
              position: "absolute",
              top: 0
              // width: this.state.widthOfOne
            }}
            width={this.state.widthOfOne}
            height={this.state.heightOfOne}
          />
        </div>
        <div
          className={css["containerTwo"]}
          style={{
            width: this.state.containerTwoWidth,
            height: this.state.containerTwoHeight,
            backgroundColor: "#555555"
          }}
        >
          {/* {this.state.isCompleted ? <Select
            defaultValue={"2019年08月"}
            style={{ position: "absolute", top: "130px", left: "30px", zIndex: 1 }}

          >
            <Option value="2019年08月">2019年08月</Option>
          </Select> : null} */}
          {this.state.isCompleted ? (
            <div
              className={
                customCss["vrp-form"] +
                " " +
                css["attribute-container"] +
                " " +
                (isShowAttribute && css["show"])
              }
            >
              <div
                className={css["attribute-tag"]}
                onClick={this.showAttribute}
              />
              <div className={customCss["flex-center-left"]}>
                <label className={customCss["flex-none-label"]}>经度</label>
                <Slider
                  className={customCss["flex-auto"]}
                  style={{ width: 90 }}
                  min={-100}
                  max={100}
                  step={0.1}
                  value={
                    typeof this.state.longitude === "number"
                      ? this.state.longitude
                      : 1
                  }
                  onChange={this.longitudeChange}
                />
                <InputNumber
                  style={{ width: 60 }}
                  min={-100}
                  max={100}
                  step={0.1}
                  size="small"
                  value={
                    typeof this.state.longitude === "number"
                      ? this.state.longitude
                      : 1
                  }
                  onChange={this.longitudeChange}
                />
              </div>
              <div className={customCss["flex-center-left"]}>
                <label className={customCss["flex-none-label"]}>纬度</label>
                <Slider
                  className={customCss["flex-auto"]}
                  style={{ width: 90 }}
                  min={-100}
                  max={100}
                  step={0.1}
                  value={
                    typeof this.state.latitude === "number"
                      ? this.state.latitude
                      : 1
                  }
                  onChange={this.latitudeChange}
                />
                <InputNumber
                  style={{ width: 60 }}
                  min={-100}
                  max={100}
                  step={0.1}
                  size="small"
                  value={
                    typeof this.state.latitude === "number"
                      ? this.state.latitude
                      : 1
                  }
                  onChange={this.latitudeChange}
                />
              </div>
              <div className={customCss["flex-center-left"]}>
                <label className={customCss["flex-none-label"]}>海拔</label>
                <Slider
                  className={customCss["flex-auto"]}
                  style={{ width: 90 }}
                  min={-100}
                  max={100}
                  step={0.1}
                  value={
                    typeof this.state.altitude === "number"
                      ? this.state.altitude
                      : 1
                  }
                  onChange={this.altitudeChange}
                />
                <InputNumber
                  style={{ width: 60 }}
                  min={-100}
                  max={100}
                  step={0.1}
                  size="small"
                  value={
                    typeof this.state.altitude === "number"
                      ? this.state.altitude
                      : 1
                  }
                  onChange={this.altitudeChange}
                />
              </div>
            </div>
          ) : null}
          <iframe
            name="Two"
            src={`${process.env.publicPath}container.html`}
            frameBorder="no"
            style={{
              position: "absolute",
              bottom: 0,
              right: 0
              // width: this.state.widthOfTwo
            }}
            width={this.state.widthOfTwo}
            height={this.state.heightOfTwo}
          />
        </div>
        <div
          className={css["line"] + " " + (isVertical ? css["vertical"] : "")}
          draggable={true}
          ref={node => (this.line = node)}
          onDrag={this.lineOnDrag}
          onDragEnd={this.lineOnDragEnd}
        />
        <div
          className={
            css["align-toggle"] + " " + (isVertical ? css["vertical"] : "")
          }
          title="垂直/水平模式切换"
          ref={node => (this.alignToggle = node)}
          onClick={this.handleAlignToggle}
        />
        <div
          className={css["single-toggle"]}
          title="联动/独立模式切换"
          onClick={this.handleSingleToggle}
        />
      </div>
    );
  }
}

export default CompareTerrain;
