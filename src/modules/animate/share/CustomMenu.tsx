import { Component } from "react";
import {
  RouteComponentProps,
  Switch,
  Route,
  withRouter
} from "react-router-dom";
import { message } from "antd";
import Header from "./Header";
import { templates } from "../../../config/StrConfig";
import Tools from "../../../components/tools/Tools";
import Config from "../../../config/Config";
import ShareService from "../../../services/ShareService";
import PlanService from "../../../services/PlanService";
import AnimationService from "../../../services/AnimationService";
import ShowData from "../../../components/tools/showData";
import TerrainService from "../../../services/TerrainService";
import { Terrain } from "../../../components/model";
import Play from "../../../components/tools/Play";
import Compass from "../../Component/Compass";

const css = require("../../styles/custom.css");
const scss = require("../../styles/scss/sharepage.scss");

/**
 * @name CustomMenu
 * @create: 2020/4/21
 * @description: 分享页面菜单
 */

interface CustomMenuProps extends RouteComponentProps {
  url: string;
  callBack: (img) => void;
  imgCall: (url) => void;
  titleCall: (title) => void;
}

interface CustomMenuStates {
  isMeasure: boolean;
  isToggleTo2D: boolean;
  isDataShow: boolean;
  isMap: boolean;
  isOpenBalloon: boolean;
  isCycle: boolean;

  title: string;
  eleList: string;
  menu: any;
  limit: any;
  template: string;
  skin: { [k: string]: any };

  time: string;
  drawVisible: boolean;
  modalProps: {
    visible: boolean;
    title: string;
  };
  modalImg: string;
  weatherData: any;
  address: string;
  popoverVisible: boolean;
  isCompared: boolean;
  compareTerrain: any[];
  logoUrl?: string;
  en: string;
  map: any;
  planId: number;
}

class CustomMenu extends Component<CustomMenuProps, CustomMenuStates> {
  INDEX = 0;
  INTERVAL;
  Features;

  constructor(props: CustomMenuProps) {
    super(props);
    this.state = {
      isMeasure: false,
      isToggleTo2D: false,
      isDataShow: true,
      isMap: false,
      isOpenBalloon: false,
      isCycle: false,
      eleList: "",
      template: "null",
      skin: templates["null"],
      title: "",
      menu: [],
      limit: {
        balloon: 7,
        area: 7,
        line: 7,
        push: 7,
        build: 7
      },
      compareTerrain: [],
      logoUrl: "",
      time: "",
      drawVisible: true,
      modalProps: {
        visible: false,
        title: ""
      },
      modalImg: "",
      weatherData: null,
      address: "北京",
      popoverVisible: false,
      isCompared: false,
      en: "",
      map: {},
      planId: 0
    };
  }

  getUrl = () => {
    const {
      inLineMapUrl,
      outLineMapUrl,
      inLineSwitch,
      outLineSwitch
    } = this.state.map;
    if (inLineSwitch === 1) {
      return inLineMapUrl ? inLineMapUrl.split(",") : [];
    } else if (outLineSwitch === 1) {
      return outLineMapUrl ? outLineMapUrl.split(",") : [];
    } else {
      return false;
    }
  };
  setMap = () => {
    const { mapType } = this.state.map;
    const type = mapType ? mapType : 0;
    const url = this.getUrl();
    switch (type) {
      case 1:
        if (url) {
          Tools.addMaps(17, url, true);
        }
        break;
      case 2:
        if (url) {
          Tools.addMaps(19, url, true);
        }
        break;
      case 3:
        if (url) {
          Tools.addMaps(18, url, false);
        }
        break;
    }
  };

  componentWillMount() {
    this.getShare();
  }
  getShare = () => {
    const { url } = this.props;
    const { vrPlanner, maps } = Config;

    ShareService.getInfo({ url }, (success, res) => {
      if (success) {
        const { data } = res;
        // if (Config.loggedIn) {
        const id = data.planId;
        Config.PLANID = id;
        console.log(data)
        const {
          plan: { title, city, county, en, map },
          eleList,
          onemenuVos,
          terrainVOList,
          pictureurl,
          antitle,
          template,
          compareTerrain,
          logoUrl
        } = data;
        (window as any).template = Object.keys(templates).find(
          key => key == template
        )
          ? template
          : "null";
        //    this.getTemplateSkin(id, window.template);
        const {
          balloon,
          area,
          line,
          push,
          build,
          cameraLook,
          cameraPosition
        } = data.plan;
        if (cameraLook && cameraPosition)
          Config.CameraPosition = JSON.stringify({
            cameraLook,
            cameraPosition
          });
        const limit = { balloon, area, line, push, build };
        PlanService.getData({ id }, (flag, res) => {
          flag
            ? this.addTerrain(id, terrainVOList, res.data)
            : message.error(res.message);
        });
        AnimationService.getAModel({ planId: id }, (flag, res) => {
          if (flag) {
            for (const _data of res.data) {
              let lineLayer: any = null;
              let modelLayer: any = null;
              const { type } = _data;
              modelLayer =
                maps.getLayerById("animateModelLayer") ||
                new vrPlanner.Layer.FeatureLayer("animateModelLayer");
              lineLayer =
                maps.getLayerById("animateLineLayer") ||
                new vrPlanner.Layer.FeatureLayer("animateLineLayer");
              lineLayer.setLodWindowSize(1); //数据可视距离设置
              lineLayer.setRenderTileTree(false);
              maps.addLayer(lineLayer);
              maps.addLayer(modelLayer);
              const animation = ShowData.renderAnimateLine({ data: _data });
              animation.setVisible(false);
              lineLayer.addFeature(animation.line.line);

              if (animation.models.length) {
                animation.models.forEach(model => {
                  modelLayer.addFeature(model.point);
                  modelLayer.addFeature(model.mark.point);
                  modelLayer.addFeature(model.mark.line);
                });
              }
            }
          }
        });
        document.title = title;
        const menu = onemenuVos.sort(Tools.compare("index"));
        console.log(menu);
        this.setState(
          {
            title,
            eleList: eleList || "",
            //  menu,
            limit,
            template: (window as any).template,
            address: city,
            compareTerrain,
            logoUrl,
            en,
            map,
            planId: id
          },
          () => {
            this.props.imgCall(pictureurl);
            this.props.titleCall(antitle);
          }
        );
        // }
        // else { // message.warning("当前方案的分享已关闭，请联系管理员开放"); }
      } else message.error(res.message);
    });
    this.getAnimation();
  };

  getAnimation = () => {
    const { menu } = this.state;
    const _this = this;
    let cdata = { planId: Config.PLANID };
    AnimationService.getGPSLine(cdata, (flag, res) => {
      if (flag) {
        let m = res.data;
        this.setState(
          {
            menu: res.data
          },
          () => {
            console.log(this.state.menu);
          }
        );
      } else {
      }
    });
  };
  /**
   * @description 显示地块
   */
  addTerrain = (planId, list, data) => {
    const { CameraPosition, vrPlanner, maps, ScenesSetData } = Config;
    const camera = maps.getCamera();

    if (list !== null) {
      list.map((item, index) => {
        TerrainService.getTerrainAltitude(
          {
            planId,
            terrainId: item.id
          },
          (success, res) => {
            if (success) {
              const { minLevel, maxLevel, windowSize } = JSON.parse(ScenesSetData);
              const terrain = new Terrain({
                id: item.id,
                altitude: Number(res.data.altitude),
                opacity: Number(res.data.opacity),
                url: item.dataUrl,
                title: item.title,
                minLevel: Number(minLevel),
                maxLevel: Number(maxLevel),
                windowSize: Number(windowSize),
              });
              Terrain.addTerrain(terrain);
              if (index + 1 === list.length) {
                if (this.state.eleList.includes("map")) {
                  this.setMap();
                }
                this.showData(data);
                setTimeout(() => {
                  if (CameraPosition) {
                    const { cameraLook, cameraPosition } = JSON.parse(
                      CameraPosition
                    );
                    if (cameraLook && cameraPosition) {
                      const pos = new vrPlanner.GeoLocation(
                        new vrPlanner.Math.Double3.create(
                          JSON.parse(cameraPosition)
                        )
                      );
                      const lookAt = new vrPlanner.GeoLocation(
                        new vrPlanner.Math.Double3.create(
                          JSON.parse(cameraLook)
                        )
                      );
                      camera.setPosition(pos, lookAt);
                    }
                  } else {
                    Terrain.terrains[0].focus();
                  }
                }, 1000);
              }
            }
          }
        );
      });
    }
  };

  /**
   * @description 显示数据
   */
  showData = data => {
    const { maps, vrPlanner } = Config;
    const { limit } = this.state;
    for (const item of data) {
      let layer: any = null;
      const { type, whethshare } = item;
      layer =
        maps.getLayerById(`${type}Layer`) ||
        new vrPlanner.Layer.FeatureLayer(`${type}Layer`);
      layer.setLodWindowSize(limit[type] ? Math.pow(2, limit[type] + 1) : 512);
      layer.setRenderTileTree(false);
      maps.addLayer(layer);
      switch (type) {
        case "line":
          const line = ShowData.renderLine({ data: item });
          layer.addFeature(line.line);
          line.setVisible(whethshare);
          break;
        case "area":
          const geometry = ShowData.renderBlock({ data: item }, false);
          geometry.isNew = false;
          if (!whethshare) geometry.setHeight(1);
          layer.addFeature(geometry.polygon);
          geometry.setVisible(whethshare);
          break;
        case "push":
          const push = ShowData.renderPush({ data: item });
          layer.addFeature(push.polygon);
          push.setVisible(whethshare);
          break;
        case "build":
          const model = ShowData.renderModel({ data: item });
          layer.addFeature(model.point);
          model.setVisible(whethshare);
          break;
        case "balloon":
          const mark = ShowData.renderBalloon({ data: item });
          layer.addFeature(mark.point);
          mark.setVisible(whethshare);
          break;
      }
    }
    // app._store
    //     .dispatch({
    //         type: "cadModel/getFormatListForShare",
    //         payload: { planId: this.state.planId }
    //     })
    //     .then(() => {
    //         const list = app._store.getState().cadModel.panels;
    //         list.forEach(item => {
    //             const CadModule = new CadModuleData({
    //                 font: { ...item.fontVo },
    //                 line: { ...item.lineVo },
    //                 block: { ...item.blockVo },
    //                 isShow: item.isShow,
    //                 title: item.title,
    //                 position: item.position,
    //                 lookAt: item.lookAt,
    //                 list: item.list
    //             });
    //             const isShow = {
    //                 fontIsShare: Boolean(item.fontVo.isShare),
    //                 lineIsShare: Boolean(item.lineVo.isShare),
    //                 blockIsShare: Boolean(item.blockVo.isShare)
    //             };
    //             CadModule.render(isShow);
    //             // setTimeout(() => {
    //             //   CadModule.setFontVisible(Boolean(item.fontVo.isShare));
    //             //   CadModule.setLineVisible(Boolean(item.lineVo.isShare));
    //             //   CadModule.setBlockVisible(Boolean(item.blockVo.isShare));
    //             // },100)
    //             item.data = CadModule;
    //             CadModuleData.addData(CadModule);
    //         });
    //     });
  };

  renderMenu = () => {
    // const { eleList } = this.state;
    // const feature = {
    //     measure: { title: "测量", dom: <Measure /> },
    //     draw: { title: "绘制", dom: <Draw isSave={false} /> },
    //     sun: { title: "日照", dom: <Sunshine pptShow={true} /> },
    //     water: { title: "水淹", dom: <Inundate /> },
    //     viewChange: { title: "2D-3D", dom: <DimensionMenu /> },
    //     map: { title: "地图", dom: <ChangeMap /> },
    //     balloon: { title: "热气球", dom: <Balloon pptShow={true} /> },
    //     // thermal: { title: "热力图", dom: "" },
    //     search: { title: "搜索", dom: <SearchMap /> },
    //     view: { title: "视角", dom: <Snapshot callBack={this.props.callBack} /> },
    //     compared: {
    //         title: "对比",
    //         dom: (
    //             <VrpIcon
    //                 iconClassName={css["vrp-menu-icon"]}
    //                 iconName={"icon-compare"}
    //                 title="方案对比"
    //                 onClick={this.handleCompared}
    //             />
    //         )
    //     },
    //     select: { title: "框选", dom: <SelectInfo /> }
    // };
    // if (eleList) {
    //     return JSON.parse(eleList).map((ele, index) => {
    //         if (ele === "map") {
    //             if (ChangeMap.OpenGoogleMap) ChangeMap.OpenGoogleMap(false);
    //         }
    //         if (feature[ele]) {
    //             return (
    //                 <li
    //                     className={css["menu-item-group"]}
    //                     key={index}
    //                     title={feature[ele].title}
    //                 >
    //                     <span className={css["menu-title"]}>{feature[ele].dom}</span>
    //                 </li>
    //             );
    //         }
    //     });
    // }
  };

  play = (feature, isMenu?) => {
    // VrpTips.showTips(
    //   "演示动画",
    //   <div>
    //     <p className={css["m-b-sm"]}>空格暂停</p>
    //     <p className={css["m-b-sm"]}>pageUp上个动画</p>
    //     <p className={css["m-b-sm"]}>pageDown下个动画</p>
    //   </div>,
    //   275
    // );
    this.Features = feature;
    let terrainIds = [];
    feature
      .filter(item => item.type === "terrain")
      .map(
        item =>
          item.dataId &&
          (terrainIds = terrainIds.concat(JSON.parse(item.dataId)))
      );
    Play.featureState(false, terrainIds);
    const { maps } = Config;
    const camera = maps.getCamera();
    if (camera.isMoving()) {
      const position = camera.getPosition();
      const lookAt = camera.getLookAt();
      camera.setPosition(position, lookAt);
    }
    this.INDEX = 0;
    if (this.INTERVAL) {
      clearInterval(this.INTERVAL);
    }
    if (this.Features.length) {
      Play.analysisData(this.Features[0], isMenu);
      this.INTERVAL = setInterval(
        () => this.Interval(isMenu),
        (this.Features[0].time === null ? 8 : this.Features[0].time) * 1000
      );
    }
  };

  Interval = (isMenu?) => {
    this.INDEX++;
    if (this.INTERVAL) {
      clearInterval(this.INTERVAL);
    }
    if (this.Features) {
      if (this.INDEX === this.Features.length) {
        clearInterval(this.INTERVAL);
        this.Features = null;
        this.INDEX = 0;
        this.INTERVAL = 0;
      } else {
        Play.analysisData(
          this.Features[this.INDEX % this.Features.length],
          isMenu
        );
        this.INTERVAL = setInterval(
          () => this.Interval(isMenu),
          (this.Features[this.INDEX].time === null
            ? 8
            : this.Features[this.INDEX].time || 8) * 1000
        );
      }
    }
  };

  render() {
    const {
      title,
      menu,
      eleList,
      template,
      skin,
      drawVisible,
      address,
      en,
      logoUrl,
      planId
    } = this.state;
    const { match } = this.props;
    const drawProps = {
      visible: drawVisible,
      address,
      play: this.play,
      menu,
      template
    };
    // const ComputedHeader = skin.header ? skin.header : Header;
    return (
      <>
        <div
          className={[
            scss["mask"],
            scss["pe-none"],
            skin.hasDrawer && drawVisible && scss["back"]
          ]
            .filter(Boolean)
            .join(" ")}
        />
        <Header
          title={title}
          en={en}
          bg={skin.hasDrawer && !drawVisible}
          template={template}
          logoUrl={logoUrl}
          menu={menu}
          hasTool={!!eleList}
          renderToolMenu={this.renderMenu}
          play={this.play}
        />
        {skin.routes ? (
          <Switch>
            <Route
              exact
              path={match.url}
              render={props => <skin.component {...props} {...drawProps} />}
            />
            {skin.routes.map((route, i) => (
              <Route
                key={i}
                path={route.path}
                render={props => {
                  window.currentMenu = menu[i];
                  return <route.component {...props} {...drawProps} />;
                }}
              />
            ))}
          </Switch>
        ) : skin.component ? (
          <skin.component {...drawProps} />
        ) : null}

        <div
          className={`${scss["footer"]} ${
            window.template == "campus" ? scss["campusSkin"] : ""
            }`}
        >
          {skin.hasDrawer ? (
            <div
              className={scss["switch"] + " " + scss["pointer"]}
              onClick={e => {
                this.setState({ drawVisible: !this.state.drawVisible });
              }}
            >
              <img
                src={require(`../../assets/leftswitch${Number(
                  drawVisible
                )}.png`)}
                alt=""
              />
            </div>
          ) : null}
          <Compass
            style={{
              position: "unset",
              top: 0,
              backgroundColor: "#adabab6b",
              borderRadius: "50%"
            }}
          />
        </div>
        {/* {this.state.isCompared ? (
                    <CompareTerrain
                        drawVisible={this.state.drawVisible}
                        compareTerrain={this.state.compareTerrain}
                    />
                ) : null} */}
      </>
    );
  }
}
export default withRouter(CustomMenu);
