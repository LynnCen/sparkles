import { Component } from "react";
import { message } from "antd";
import Config from "../../config/Config";
import VrpIcon from "../../components/VrpIcon";
import Plan from "../../services/PlanService";
import AnimationService from "../../services/AnimationService";
import { MapModel, TerrainModel } from "../../models/PlanModel";
import OpenTerrainModal from "../terrain/OpenTerrainModal";
import AllTerrainModal from "../terrain/AllTerrainModal";
import ModelModal from "../Modal/model/ModelModal";
import TerrainService from "../../services/TerrainService";
import ShowData from "../../components/tools/showData";
import Tools from "../../components/tools/Tools";
import MarkerModal from "../Modal/MarkerModal";
import ChangeMap from "./ChangeMap";
import Handle from "../../components/tools/Handle";
import TransCoordinate from "../../components/tools/Coordinate";
import app from "../../index";
import { CadModuleData, ExcelData, ExcelFile } from "../../components/model/CAD";
import CADService from "../../services/CadService";
import Resource from "./Resource";
import SiltService from "../../services/SiltService";
import { Model, Mark, GPSAnimation, Terrain, Layer } from "../../components/model/";
import LSGY from "../Share/skin/industrial/LSGY";
const { maps, vrPlanner } = Config;
const css = require("../../styles/custom.css");

/**
 * @name OpenTerrain
 * @author: bubble
 * @create: 2018/11/28
 */

interface IAddTerrainMenuProps {
  mapData: MapModel;
  terrainList: TerrainModel[];
  planTitle: string;
  getPlanTerrain: (callback?) => void;
  limit: any;
}

interface IAddTerrainMenuStates {
  visible: boolean;
  allModalVisible: boolean;
  model?: Model;
  isModel: boolean;
  modelTool: any;
  mark?: Mark;
  isMark: boolean;
  terrainList: TerrainModel[];
}

class OpenTerrain extends Component<IAddTerrainMenuProps, IAddTerrainMenuStates> {
  public static OpenModelModal: (model) => void;
  public static BindClick: (model: Model) => void;
  public static CloseModelModal: () => void;
  public static OpenMarkerModal: (mark) => void;
  public static CloseMarkerModal: () => void;
  // public static closeMarkerBox: (point) => void;
  static _this;
  constructor(props: IAddTerrainMenuProps) {
    super(props);
    OpenTerrain._this = this;
    this.state = {
      visible: false,
      allModalVisible: false,
      isModel: false,
      modelTool: new Config.vrPlanner.Extension.ModelTool(Config.maps, {
        inactiveOpacity: 0.7
      }),
      isMark: false,
      terrainList: []
    };

    /**
     * @description 打开模型的属性框
     */
    OpenTerrain.OpenModelModal = model => {
      this.setState({ model, isModel: true });
    };

    OpenTerrain.BindClick = (model: Model) => {
      this.modelSelect(model);
    };
    /**
     * @description 关闭模型的属性框
     */
    OpenTerrain.CloseModelModal = () => {
      this.state.modelTool.unselect();
      this.setState({ isModel: false });
    };

    OpenTerrain.OpenMarkerModal = mark => this.setState({ mark, isMark: true });
    OpenTerrain.CloseMarkerModal = () => this.setState({ isMark: false });
  }
  async componentDidMount() {
    this.setTerrain(this.props.terrainList, true);
    await Promise.all([this.getData(), this.getAnimateData()]);
    this.handleEvent();
  }

  componentWillReceiveProps(nextProps: IAddTerrainMenuProps) {
    if (
      nextProps.terrainList.length != this.props.terrainList.length ||
      !nextProps.terrainList.every((e, i) => this.props.terrainList.find(t => t.id == e.id))
    ) {
      this.setTerrain(nextProps.terrainList, false);
    }
  }

  /**
   * @description 模型绑定事件
   */
  modelSelect = (model: Model) => {
    model.point.bindEvent("click", e => {
      if (e.isRightClick()) {
        // this.modelUpdate(model);
        this.setState({ isModel: true, model });
      }
    });
  };

  /**
   * @description 获取方案数据
   */
  async getData() {
    const data = { id: Config.PLANID };
    const { limit } = this.props;
    return Promise.all([
      new Promise((resolve, reject) =>
        Plan.getData(data, (flag, res) => {
          if (flag) {
            for (const _data of res.data) {
              let layer: any = null;
              const { type } = _data;
              layer =
                maps.getLayerById(`${type}Layer`) ||
                new vrPlanner.Layer.FeatureLayer(`${type}Layer`);
              layer.setLodWindowSize(limit[type] ? Math.pow(2, limit[type] + 1) : 512);
              layer.setRenderTileTree(false);
              maps.addLayer(layer);

              switch (type) {
                case "line":
                  const line = ShowData.renderLine({ data: _data });
                  layer.addFeature(line.line);
                  break;
                case "area":
                  const geometry = ShowData.renderBlock({ data: _data });
                  geometry.isNew = false;
                  layer.addFeature(geometry.polygon);
                  break;
                case "push":
                  const push = ShowData.renderPush({ data: _data });
                  layer.addFeature(push.polygon);
                  break;
                case "build":
                  const model = ShowData.renderModel({ data: _data });
                  this.modelSelect(model);
                  layer.addFeature(model.point);
                  break;
                case "balloon":
                  const mark = ShowData.renderBalloon({ data: _data });
                  mark.point.bindEvent("click", e => {
                    if (e.isRightClick()) this.setState({ mark, isMark: true });
                  });
                  layer.addFeature(mark.point);
                  break;
              }
            }
            if (Config.PLANID == 2277 && !res.data.some(item => item.title.includes("公司"))) {
              LSGY.getAuth().then(_ => LSGY.getCompany().then(LSGY.genCompanyMark));
            }
            Layer.getList(Config.PLANID, true);
            resolve();
          } else reject(res.message);
        })
      ),
      // CADService.getFormatList
      new Promise((resolve, reject) =>
        app._store.dispatch({ type: "cadModel/getFormatList" }).then(() => {
          const list = app._store.getState().cadModel.panels;
          const backups = app._store.getState().cadModel.backups;
          list.forEach((item, i) => {
            const CadModule = new CadModuleData({
              font: { ...item.fontVo },
              line: { ...item.lineVo },
              block: { ...item.blockVo },
              isShow: item.isShow,
              title: item.title,
              position: item.position,
              lookAt: item.lookAt,
              list: item.list
            });
            CadModule.render({});
            item.data = CadModule;
            backups[i].data = CadModule;
            CadModuleData.addData(CadModule);
          });
          resolve();
        })
      ),
      new Promise((resolve, reject) =>
        CADService.getSelectionList({ planId: Config.PLANID }, (flag, res) => {
          flag
            ? (app._store.dispatch({
              type: "cadModel/setProp",
              payload: { cadSource: res.data.list }
            }),
              resolve())
            : (message.error(res.message), reject());
        })
      ),
      /**
       * @description 获取冲淤数据
       */
      new Promise((resolve, reject) =>
        SiltService.getListByPlanId({ planId: Config.PLANID }, (flag, res) => {
          if (flag) {
            res.data.forEach(item => {
              const silt = new ExcelData(item);
              ExcelData.addSilt(silt);
              item.sampledDataList.forEach(_item => {
                const file = new ExcelFile(Object.assign(_item, { coordinate: item.coordinate }));
                silt.addFile(file);
              });
            });
            resolve();
          } else {
            message.error(res.message);
            reject();
          }
        })
      )
    ]);
  }

  async getAnimateData() {
    const data = { planId: Config.PLANID };

    const { limit } = this.props;

    let lineLayer: any = null;
    let modelLayer: any = null;
    let createTime;

    modelLayer =
      maps.getLayerById("animateModelLayer") ||
      new vrPlanner.Layer.FeatureLayer("animateModelLayer");
    lineLayer =
      maps.getLayerById("animateLineLayer") || new vrPlanner.Layer.FeatureLayer("animateLineLayer");
    let gpslineLayer =
      maps.getLayerById("gpsLineLayer") || new vrPlanner.Layer.FeatureLayer("gpsLineLayer");

    lineLayer.setLodWindowSize(1); //数据可视距离设置
    lineLayer.setRenderTileTree(false);
    maps.addLayer(lineLayer);
    maps.addLayer(gpslineLayer);
    maps.addLayer(modelLayer);
    AnimationService.getShipPoiListdef([], (flag, res) => {
      if (flag) {
        GPSAnimation.gpsData = res.data;
      } else {
        console.log("获取gpsline列表失败");
      }
    });
    await Promise.all([
      new Promise((resolve, reject) => {
        AnimationService.getAModel(data, async (flag, res) => {
          if (flag) {
            for (let i = 0; i < res.data.length; i++) {
              const animation = ShowData.renderAnimateLine({
                data: res.data[i]
              });
              if (res.data[i].createTime === null) {
                createTime = await this.setAnimateCreateTime(res.data[i], i, "animation");
                animation.createTime = createTime;
              }

              lineLayer.addFeature(animation.line.line);

              if (animation.models.length) {
                animation.models.forEach(model => {
                  modelLayer.addFeature(model.point);
                  // modelLayer.addFeature(model.mark.point)
                });
              }
            }
            resolve();
          }
          reject();
        });
      }),
      new Promise((resolve, reject) => {
        AnimationService.getGPSLine(data, async (flag, res) => {
          if (flag) {
            for (let i = 0; i < res.data.length; i++) {
              let geo;
              let gpsGeoData = [];
              let data = res.data;

              await new Promise((resolve, reject) => {
                if (res.data[i].gpsModelList.length > 0) {
                  res.data[i].gpsModelList.forEach((model, index) => {
                    let geoInit = res.data[i].gpsModelList[index].geo.split(",");
                    AnimationService.getShipList({ code: model.code }, (flag, res) => {
                      if (flag) {
                        gpsGeoData = res.data;
                        let lon = res.data[i].lon;
                        let lat = res.data[i].lat;

                        geo = TransCoordinate.WGS84ToMercator({
                          x: lon,
                          y: lat,
                          z: geoInit[2]
                        });
                        data[i].gpsModelList[index].geo = `${geo.x() +
                          "," +
                          geo.y() +
                          "," +
                          geo.z()}`;
                        data[i].gpsModelList[index].course = res.data[0].angle;
                        resolve();
                      } else {
                        console.log(res);
                      }
                    });
                  });
                } else {
                  resolve();
                }
              });
              const animation = ShowData.renderGPSLine({ data: data[i] });
              if (res.data[i].createTime === null) {
                createTime = await this.setAnimateCreateTime(res.data[i], i, "gpsAnimation");
                animation.createTime = createTime;
              }
              if (animation.line) gpslineLayer.addFeature(animation.line.line);

              if (animation.models.length) {
                animation.models.forEach(model => {
                  modelLayer.addFeature(model.point);
                  animation.AddGpsVertices(model.code, model.geo.z(), gpsGeoData);
                });
              }
            }
            resolve();
          } else {
            console.log("获取gpsline失败");
            reject();
          }
        });
      })
    ]);
  }

  setAnimateCreateTime = (value, i, type) => {
    const hours = Math.floor(i / 360) < 10 ? "0" + Math.floor(i / 360) : Math.floor(i / 360);
    const minutes =
      Math.floor((i % 360) / 60) < 10
        ? "0" + Math.floor((i % 360) / 60)
        : Math.floor((i % 360) / 60);
    const seconds = Math.floor(i % 60) < 10 ? "0" + Math.floor(i % 60) : Math.floor(i % 60);
    let createTime;

    if (type === "animation") {
      createTime = `${"2020-1-1 " + hours + ":" + minutes + ":" + seconds}`;

      let vertices: any = [];
      for (let { x, y, z } of JSON.parse(value.vertices)) {
        // vertices.push(new Config.vrPlanner.GeoLocation(x, y, z));
        vertices.push({ x: x, y: y, z: z });
      }

      let cdata = {
        position: vertices,
        isCircle: value.isCircle || false,
        isGap: value.isGap || false,
        isActive: value.isActive ? value.isActive : "finish",
        isShow: value.isShow || true,
        altitude: value.altitude.toString(),
        interval: value.interval,
        title: value.title,
        depthTest: value.depthTest || false,
        isClose: value.isClose || false,
        planId: value.planId,
        visualAngle: value.visualAngle || "null",
        isChecked: value.isChecked ? value.isChecked : false,
        showBalloon: value.showBalloon || true,
        lineType: "animateline",
        createTime: createTime
      };
      value.createTime = createTime;
      // let cdata = { "str": JSON.stringify(data) };
      AnimationService.modALine({ id: value.id, str: JSON.stringify(cdata) }, (flag, res) => {
        if (flag) {
          console.log(res);
        } else {
          console.log(res);
        }
      });
    } else {
      createTime = `${"2020-2-1 " + hours + ":" + minutes + ":" + seconds}`;
      let data = {
        title: value.title,
        altitude: value.altitude.toString(),
        depthTest: value.depthTest,
        isShow: value.isShow,
        width: value.width.toString(),
        color: value.color,
        planId: Config.PLANID,
        verticalLineColor: value.verticalLineColor,
        showVerticalLine: value.showVerticalLine,
        isReverse: value.isReverse,
        trajType: "GPSLine",
        isLevel: value.isLevel,
        visualAngle: value.visualAngle, //.length ? value.visualAngle : "null",
        createTime: createTime
      };

      let balloonData = {
        balloonTitle: value.balloonTitle,
        fontSize: value.fontSize,
        fontColor: value.fontColor,
        iconUrl: value.iconUrl,
        balloonHeight: value.balloonHeight,
        titleVisible: value.titleVisible,
        iconVisible: value.iconVisible
      };
      AnimationService.modGPSLine(
        {
          id: value.id,
          str: JSON.stringify(data),
          gpsBalloon: JSON.stringify(balloonData)
        },
        (flag, res) => {
          if (flag) {
            console.log(res);
          } else {
            console.log(res);
          }
        }
      );
    }
  };

  getUrl = () => {
    const { inLineMapUrl, outLineMapUrl, inLineSwitch, outLineSwitch } = this.props.mapData;
    if (inLineSwitch === 1) {
      return inLineMapUrl ? inLineMapUrl.split(",") : [];
    } else if (outLineSwitch === 1) {
      return outLineMapUrl ? outLineMapUrl.split(",") : [];
    } else {
      return false;
    }
  };

  setMap = () => {
    const { mapType } = this.props.mapData;
    const type = mapType ? mapType : 0;
    const url = this.getUrl();
    switch (type) {
      case 1:
        if (url) {
          ChangeMap.OpenAMap(url, Config.isMap);
        }
        break;
      case 2:
        if (url) {
          ChangeMap.OpenGoogleMap(url, Config.isMap);
        }
        break;
      case 3:
        if (url) {
          ChangeMap.OpenMapWorld(url, Config.isMap);
        }
        break;
    }
  };

  /**
   * @description 获取地块海拔高度 加载地块
   */
  setTerrain = async (terrainList, isFirst) => {
    const { CameraSetData, PLANID, ScenesSetData, CameraPosition } = Config;
    const { minZoom, maxZoom, near, far } = JSON.parse(CameraSetData);
    const camera = maps.getCamera();
    // window["__esModule__Terrain"] = Terrain;
    if (terrainList.length > 0) {
      for (let i = 0; i < Terrain.terrains.length; i++) {
        if (!terrainList.find(t => t.id == Terrain.terrains[i].id)) {
          Terrain.terrains[i].remove();
          i--;
        }
      }
      await Promise.all(
        terrainList.map((item, i) => {
          if (!Terrain.isExist(item.id)) {
            return new Promise((resolve, reject) => {
              TerrainService.getTerrainAltitude(
                { planId: PLANID, terrainId: item.id },
                (flag, res) => {
                  if (flag) {
                    const { minLevel, maxLevel, windowSize } = JSON.parse(ScenesSetData);
                    const terrain = new Terrain({
                      id: item.id,
                      altitude: Number(res.data.altitude),
                      opacity: Number(res.data.opacity),
                      url: item.dataUrl,
                      title: item.title,
                      minLevel: terrainList.length > 10 ? 8 : Number(minLevel),
                      maxLevel: Number(maxLevel),
                      windowSize: terrainList.length > 10 ? 3 : Number(windowSize)
                    });
                    Terrain.addTerrain(terrain);
                    !isFirst && terrain.focus();
                    if (i + 1 === terrainList.length) {
                      if (isFirst) {
                        this.setMap();
                        setTimeout(() => {
                          if (CameraPosition) {
                            const { cameraLook, cameraPosition } = JSON.parse(CameraPosition);
                            const pos = new vrPlanner.GeoLocation(
                              new vrPlanner.Math.Double3.create(JSON.parse(cameraPosition))
                            );
                            const lookAt = new vrPlanner.GeoLocation(
                              new vrPlanner.Math.Double3.create(JSON.parse(cameraLook))
                            );
                            camera.setPosition(pos, lookAt);
                          } else {
                            setTimeout(() => {
                              Terrain.terrains[0].focus();
                            }, 100);
                          }
                          Terrain.terrains.forEach(terrain => {
                            if (Config.PLANID === 2371) {
                              const { a, b, c } = terrain.layer.g.u.o;
                              const mark = new Mark({
                                geo: new vrPlanner.GeoLocation(a, b, 0),
                                icon: "/res/image/icon/admin/28771598279155445.png",
                                altitudeMode: vrPlanner.Feature.ALTITUDE_MODE_RELATIVE_TO_GROUND,
                                titleVisible: false,
                                height: 100,
                                title: terrain.title
                              });
                              mark.point.bindEvent("click", () => {
                                terrain.setVisible(true);
                                terrain.focus();
                              });
                              mark.point.bindEvent("mouseEnter", () => {
                                mark.setIcon({ titleVisible: true });
                              });
                              mark.point.bindEvent("mouseLeave", () => {
                                mark.setIcon({ titleVisible: false });
                              });
                              let layer = maps.getLayerById("areaMarkLayer");
                              if (!layer) {
                                layer = new vrPlanner.Layer.FeatureLayer("areaMarkLayer");
                                layer.setLodWindowSize(1);
                                maps.addLayer(layer);
                              }
                              layer.addFeature(mark.point);
                              layer.addFeature(mark.line);
                            }
                          });
                        }, 1000);
                      }
                    }
                    resolve();
                  } else reject();
                }
              );
            });
          } else return Promise.resolve();
        })
      );
      camera.setMaxZoom(Number(maxZoom));
      camera.setMinZoom(Number(minZoom));
      camera.setNear(Number(near));
      camera.setFar(Number(far));
    } else {
      message.info("该方案暂无地块数据，请添加数据", 4);
      this.setState({
        visible: true,
        allModalVisible: true
      });
      for (let i = 0; i < Terrain.terrains.length; i++) {
        Terrain.terrains[i].remove();
        i--;
      }
    }
    this.setState({ terrainList });
  };

  /**
   * @description 关闭弹窗
   */
  closeModal = () => {
    this.setState({ visible: false });
    this.closeAllTerrainModal();
    Terrain.terrains.forEach(terrain => {
      terrain.init();
    });
    // this.props.terrainList.map(item => {
    //   const terrain = Config.maps.getLayerById("terrain" + item.id);
    //   if (terrain !== null) {
    //     terrain.setTranslation(
    //       new Config.vrPlanner.Math.Double3(0, 0, Number(terrain.altitude || 0))
    //     );
    //   }
    // });
  };

  /**
   * @description 关闭模型弹窗
   */
  closeModelModal = () => {
    this.setState({ isModel: false });
  };

  /**
   * @description 打开地块列表
   */
  openTerrain = () => {
    this.props.getPlanTerrain(() => {
      this.setState({ visible: true });
    });
  };

  /**
   * @description 显示所有地块列表弹窗
   */
  openAllTerrainModal = () => {
    this.setState({ allModalVisible: true });
  };

  /**
   * @description 关闭所有地块列表弹窗
   */
  closeAllTerrainModal = () => {
    this.setState({ allModalVisible: false });
  };

  /**
   * @description 添加地块成功的回调
   */
  addNewTerrain = () => {
    this.props.getPlanTerrain();
    this.closeAllTerrainModal();
  };

  delTerrain = (id: number) => {
    this.setState({
      terrainList: this.state.terrainList.filter(t => t.id != id)
    });
  };

  handleEvent = () => {
    window.addEventListener("keydown", e => {
      if (e.key === "Home") {
        Handle.HomeHandle();
      }
    });
  };

  /**
   * @description 关闭弹窗
   */
  closeMarkerModal = () => {
    const { mark } = this.state;
    Config.maps.unbindEvent("click");
    if (mark) {
      mark.showMessage = true;
      mark.showBalloonData();
      this.setState({ isMark: false, mark });
    }
  };

  render() {
    const { planTitle } = this.props;
    const { terrainList, model, mark } = this.state;
    return (
      <div className={css["flex-center"]}>
        <VrpIcon
          className={css["vrp-menu-icon"]}
          iconName={"icon-open-folder"}
          title="打开地块"
          onClick={this.openTerrain}
        />
        <span
          style={{ maxWidth: "100px" }}
          className={css["m-l-sm"] + " " + css["text-overflow-hide"]}
          title={planTitle}
        >
          {planTitle}
        </span>
        {this.state.visible && (
          <OpenTerrainModal
            planTerrainList={terrainList}
            openAllTerrainModal={this.openAllTerrainModal}
            closeModal={this.closeModal}
            delTerrain={this.delTerrain}
          />
        )}
        {this.state.allModalVisible && (
          <AllTerrainModal
            closeModal={this.closeAllTerrainModal}
            addNewTerrain={this.addNewTerrain}
            haveTerrainList={terrainList}
          />
        )}
        {this.state.isModel && model && (
          <ModelModal
            model={model}
            modelTool={this.state.modelTool}
            closeModal={this.closeModelModal}
          />
        )}
        {this.state.isMark && mark && (
          <MarkerModal
            closeModal={this.closeMarkerModal}
            updateSuccess={Resource.ReloadList}
            mark={mark}
            clientWidth={0}
          />
        )}
      </div>
    );
  }
}

export default OpenTerrain;
