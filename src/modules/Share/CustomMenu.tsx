import { Component, lazy } from "react";
import { RouteComponentProps, Switch, Route, withRouter } from "react-router-dom";
import ShareService from "../../services/ShareService";
import PlanService from "../../services/PlanService";
import Config from "../../config/Config";
import Tools from "../../components/tools/Tools";
import CustomFun from "../../config/CustomFun";
import TerrainService from "../../services/TerrainService";
import ShowData from "../../components/tools/showData";
import Play from "../../components/tools/Play";
import Handle from "../../components/tools/Handle";
import DimensionMenu from "../Menu/Dimension";
import Measure from "../Menu/Measure";
import Draw from "../Menu/Draw";
import Sunshine from "../Menu/Sunshine";
import Inundate from "../Menu/Inundate";
import Snapshot from "../Menu/Snapshot";
import ChangeMap from "../Menu/ChangeMap";
import SelectInfo from "../Menu/SelectInfo";
import Balloon, { balloonTip } from "../Menu/Balloon";
import SearchMap from "../Menu/SearchMap";
import Compass from "../Component/Compass";
import React from "react";
import Header, {
  IndustrialHeader,
  ZhongtaiHeader,
  GeologicHazardHeader,
  Peibiao1Header,
  Peibiao2Header,
  SongyangMapHeader, LianDuPoliceHeader
} from "./Components/Header";
import CompareTerrain from "../../components/CompareTerrain";
import VrpIcon from "../../components/VrpIcon";
import { GPSAnimation, Animation, Terrain, Layer, Mark } from "../../components/model/";
import StrConfig, { templates } from "../../config/StrConfig";
import AnimationService from "../../services/AnimationService";
import app from "../../index";
import { CadModuleData } from "../../components/model/CAD";
import { message, Input, } from "antd";
import Sidebar from "./Sidebar/";
import DataService from "../../services/DataService";
import {
  GeologicHazardPrefix,
  FolkMap,
  DigtalFarm,
  DtVillage,
  DtVillage2,
  DtVillage3,
  FusionCommand
} from "./Components/Header";
import TransCoordinate from "../../components/tools/Coordinate";
import Bulldoze from "../Menu/Bulldoze";
import { data1 } from "./skin/songyangMap1/data";
import { data2 } from "./skin/songyangMap2/data";
import { data3 } from "./skin/songyangMap3/data";
import { data4 } from "./skin/songyangMap4/data";
import { data5 } from "./skin/songyangMap5/data";
import { data6 } from "./skin/songyangMap6/data";
import UserService from "../../services/UserService";
import SyLegend from './Components/SyLegend'
import SyLabelImg from '../../assets/路径134.svg'
import SyPopup from './Components/SyPopup'
import SyContentPopUp from "./Components/SyContentPopUp";
import SyPrompt from './Components/SyPrompt'
import SySelectedRouter from './Components/SySelectedRouter'
import SyPopupList from './Components/SyPopupList'
import LdHeatMap from './ldheatmap'
const { maps, vrPlanner, } = Config;

const css = require("../../styles/custom.css");
const scss = require("../../styles/scss/sharepage.scss");
const syvw = px => (px / 3200) * 100 + "vw";
const rem = px => px + "rem"

/**
 * @name CustomMenu
 * @create: 2019/4/13
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
  eleList: string[];
  menu: any;
  limit: any;
  template: string;
  skin: { [k: string]: any };

  time: string;
  drawerVisible: boolean;
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
  watermark: { picture: string; title: string };
  searchListVisible: boolean;
  searchList: any;
  toolVisible: boolean;
  promptVisible: boolean;
  promptName: string;
  syPopupVisible: boolean;
  syContentPopupVisible: boolean;
  popupPoint: any;
  // syContentPopUpPoint: any;
  contentPopupStyle: string;
  tempData: any;
  syLegendSelectedList: any[];
  ldHeatMapVisible: boolean;
  ldMenuActive: any[];
  ldYear: string;
  ldFirstMonth: string;
  ldLastMonth: string;
  ldPoliceId: number;
  syPopupListVisible: boolean;
  syAddressTitle1: string;
  syAddressTitle2: string;
}

class CustomMenu extends Component<CustomMenuProps, CustomMenuStates> {
  featureTool;
  ballloonData: Mark;
  // static genTemplateSkin: (template) => void;
  constructor(props: CustomMenuProps) {
    super(props);
    this.state = {
      isMeasure: false,
      isToggleTo2D: false,
      isDataShow: true,
      isMap: false,
      isOpenBalloon: false,
      isCycle: false,
      eleList: [],
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
      drawerVisible: true,
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
      planId: 0,
      watermark: { picture: "", title: "" },
      searchListVisible: false,
      searchList: [],
      toolVisible: false,
      promptVisible: false,
      promptName: "",
      syPopupVisible: false,
      syContentPopupVisible: false,
      popupPoint: {},
      contentPopupStyle: "1",
      tempData: {
        'songyangMap1': [],
        'songyangMap2': [],
        'songyangMap3': [],
        'songyangMap4': [],
        'songyangMap5': [],
        'songyangMap6': [],
      },
      syLegendSelectedList: [],
      ldHeatMapVisible: true,
      ldMenuActive: [],
      ldYear: "2021",
      ldFirstMonth: "1月",
      ldLastMonth: "2月",
      ldPoliceId: 0,
      syPopupListVisible: false,
      syAddressTitle1: "裕溪乡",
      syAddressTitle2: "内陈村"
    };
    this.featureTool = {
      measure: { dom: <Measure /> },
      draw: { dom: <Draw isSave={false} /> },
      bulldoze: { dom: <Bulldoze /> },
      sun: { dom: <Sunshine pptShow={true} /> },
      water: { dom: <Inundate /> },
      viewChange: { dom: <DimensionMenu /> },
      map: { dom: <ChangeMap /> },
      balloon: { dom: <Balloon pptShow={true} /> },
      thermal: { title: "热力图", dom: "" },
      search: { dom: <SearchMap /> },
      view: { dom: <Snapshot callBack={this.props.callBack} /> },
      compared: {
        dom: (
          <VrpIcon
            className={css["vrp-menu-icon"]}
            iconName={"icon-compare"}
            title="方案对比"
            onClick={this.handleCompared}
          />
        )
      },
      select: { dom: <SelectInfo /> }
    };
  }

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
                minLevel: list.length > 10 ? 8 : Number(minLevel),
                maxLevel: Number(maxLevel),
                windowSize: list.length > 10 ? 2 : Number(windowSize)
              });
              Terrain.addTerrain(terrain);

              if (index + 1 === list.length) {
                if (this.state.eleList.includes("map")) {
                  this.setMap();
                }
                this.showData(data);
                setTimeout(() => {
                  if (CameraPosition) {
                    const { cameraLook, cameraPosition } = JSON.parse(CameraPosition);
                    if (cameraLook && cameraPosition) {
                      const pos = new vrPlanner.GeoLocation(
                        new vrPlanner.Math.Double3.create(JSON.parse(cameraPosition))
                      );
                      const lookAt = new vrPlanner.GeoLocation(
                        new vrPlanner.Math.Double3.create(JSON.parse(cameraLook))
                      );
                      camera.setPosition(pos, lookAt);
                    }
                  } else {
                    Terrain.terrains[0].focus();
                  }
                  if (Config.PLANID === 2371) {
                    Terrain.terrains.forEach(terrain => {
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
                        terrain.focus();
                        terrain.setVisible(true);
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
                    });
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
  showData = async data => {
    const { limit } = this.state;
    showData({ data, limit, planId: this.state.planId });
  };

  getUrl = () => {
    const { inLineMapUrl, outLineMapUrl, inLineSwitch, outLineSwitch } = this.state.map;
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

  getShare = () => {
    const { url } = this.props;
    ShareService.getInfo({ url }, async (success, res) => {
      if (success) {
        const { data } = res;
        // if (Config.loggedIn) {
        const id = data.planId;
        Config.PLANID = id;
        const {
          plan: { title, city, county, en, map },
          eleList,
          onemenuVos,
          terrainVOList,
          pictureurl,
          antitle,
          template,
          compareTerrain,
          logoUrl,
          logId
        } = data;
        (window as any).template = Object.keys(templates).find(key => key == template)
          ? template
          : "null";
        this.genTemplateSkin(window["template"]);
        document.title = title;
        const { balloon, area, line, push, build, cameraLook, cameraPosition } = data.plan;
        if (cameraLook && cameraPosition)
          Config.CameraPosition = JSON.stringify({
            cameraLook,
            cameraPosition
          });
        const limit = { balloon, area, line, push, build };
        PlanService.getData({ id }, (flag, res) => {
          flag ? this.addTerrain(id, terrainVOList, res.data) : message.error(res.message);
        });
        const menu = onemenuVos.sort(Tools.compare("index"));

        let _eleList = [];
        if (eleList)
          try {
            _eleList = JSON.parse(eleList);
          } catch (e) {
            console.table(e);
          }
        this.setState({
          title,
          eleList: _eleList.filter(e => this.featureTool[e]),
          menu,
          limit,
          template: (window as any).template,
          address: city,
          compareTerrain,
          logoUrl,
          en,
          map,
          planId: id,
          watermark: { picture: pictureurl, title: antitle }
        });
        if (template.substring(0, 11) == 'songyangMap') {
          this.handleResize()
          window.onresize = () => {
            this.handleResize()
          }
        }
        window.addEventListener(
          "beforeunload",
          e => {
            ShareService.setEndTime({ logId, endTime: Date.now() }, (f, r) => null);
          },
          false
        );
        // }
        // else { // message.warning("当前方案的分享已关闭，请联系管理员开放"); }
      } else message.error(res.message);
    });
  };

  handleCompared = () => {
    this.setState({
      isCompared: !this.state.isCompared,
      drawerVisible: false
    });
  };

  renderEleMenu = () => {
    const { eleList } = this.state;
    if (eleList.length) {
      return eleList.map((ele, index) => {
        return (
          <li className={css["menu-item-group"]} key={index}>
            <span className={css["menu-title"]}>{this.featureTool[ele].dom}</span>
          </li>
        );
      });
    }
    return null;
  };

  // handleStop = () => {
  //   const camera = maps.getCamera();
  //   camera.unbindEvent("stop");
  //   const pos = camera.getPosition();
  //   const look = camera.getLookAt();
  //   camera.flyTo(pos, look);
  //   clearTimeout(Play.timer);
  // };
  handleResize() {
    let htmlWidth = document.documentElement.clientWidth || document.body.clientWidth
    let htmlDom = document.getElementsByTagName('html')[0]
    htmlDom.style.fontSize = 100 / 3200 * htmlWidth + 'px';
  }

  componentDidMount() {
    this.getShare();
    window.addEventListener("keydown", e => {
      CustomFun.onKeyDown(e, 36, () => {
        //Home
        Handle.HomeHandle();
        this.genTemplateSkin(window["template"]);
      });
      CustomFun.onKeyDown(e, 32, () => {
        //space
        if (Play.timer) {
          Handle.stopCamera();
        } else if (Play.features) {
          Play.INDEX--;
          Play.timeout();
        }
      });
      CustomFun.onKeyDown(e, 33, () => {
        //PgUp
        if (Play.timer) {
          Handle.stopCamera();
        }
        if (Play.features) {
          if (--Play.INDEX < 0) {
            Play.INDEX = Play.features.length - 1;
          }
          Play.analysisData(Play.features[Play.INDEX % Play.features.length]);
        }
      });
      CustomFun.onKeyDown(e, 34, () => {
        //PgDn
        if (Play.timer) {
          Handle.stopCamera();
        }
        if (Play.features) {
          Play.INDEX++;
          Play.analysisData(Play.features[Play.INDEX % Play.features.length]);
        }
      });
    });
  }

  updatePosition = (position, lookAt) => { };
  genTemplateSkin = (template, fromPPT = true) => {
    const { match } = this.props;
    if (template) {
      const { cdir, routes } = templates[template];
      cdir &&
        (templates[template].component = lazy(() =>
          import(/* webpackChunkName: "skin" */ `./skin/${cdir}`)
        ));
      routes &&
        (templates[template].routes = templates[template].routes.map((e, i) => ({
          path: `${match.url}/${i}`,
          component: lazy(() => import(/* webpackChunkName: "skin" */ `./skin/${e}`))
        })));
      switch (template) {
        case "industrial":
          templates[template].header = IndustrialHeader;
          break;
        case "geologicHazard":
        case "geologicHazard2":
          templates[template].header = GeologicHazardHeader;
          templates[template].titleSuffix = <GeologicHazardPrefix />;
          break;
        case "peibiao1":
          templates[template].header = Peibiao1Header;
          break;
        case "peibiao2":
          templates[template].header = Peibiao2Header;
          break;
        case "folkMap1":
        case "folkMap2":
          templates[template].titleSuffix = <FolkMap />;
          break;
        case "digitalFarm":
          templates[template].titleSuffix = <DigtalFarm />;
          break;
        case "dtVillage":
          templates[template].titleSuffix = <DtVillage />;
          break;
        case "dtVillage2":
          templates[template].titleSuffix = <DtVillage2 />;
          break;
        case "dtVillage3":
          templates[template].titleSuffix = <DtVillage3 />;
          break;
        case "fusionCommand":
          templates[template].titleSuffix = <FusionCommand />;
          break;
        case "songyangMap1":
        case "songyangMap2":
        case "songyangMap3":
        case "songyangMap4":
        case "songyangMap5":
        case "songyangMap6":
        case "songyangMap7":
        case "songyangMap8":
        case "songyangMap9":
        case "songyangMap10":
        case "songyangMap11":
        case "songyangMap12":
          templates[template].header = SongyangMapHeader
          break;
      }
      if (Config.PLANID === 2300) {
        templates[template].header = ZhongtaiHeader;
      }
      if (Config.PLANID === 2442) {
        templates[template].header = LianDuPoliceHeader;
      }
      this.setState({ skin: templates[template], template });
      window["pptTemplate"] = fromPPT ? template : undefined;
    }
  };
  get drawerProps() {
    const { drawerVisible, address, menu, template, ldYear, ldFirstMonth, ldLastMonth, ldPoliceId } = this.state;
    return {
      drawer: {
        visible: drawerVisible,
        click: (v = !drawerVisible) => this.setState({ drawerVisible: v })
      },
      visible: drawerVisible,
      address,
      menu,
      template,
      ldStartMonth: ldFirstMonth !== "" ? this.getLdTime(ldFirstMonth) : `${ldYear + "-01"}`,
      ldEndMonth: ldLastMonth !== "" ? this.getLdTime(ldLastMonth) : `${ldYear + "-01"}`,
      ldPoliceId
    };
  }

  getLdTime = (month) => {
    const { ldYear } = this.state
    const ldTimeList = {
      '1月': "01",
      '2月': "02",
      '3月': "03",
      '4月': "04",
      '5月': "05",
      '6月': "06",
      '7月': "07",
      '8月': "08",
      '9月': "09",
      '10月': "10",
      '11月': "11",
      '12月': "12",
    }
    return ldYear + "-" + ldTimeList[month]
  }

  changeVisible = (key) => {
    this.setState({
      drawerVisible: !key
    })
  }

  searchChange = (e) => {
    const value = e.target.value
    if (value != "") {
      const url = 'http://dtcity.cn:8088/api/peoples/queryAll?key=' + value
      fetch(url, {
        method: "get",
      })
        .then(res => res.json())
        .then(res => {
          res.data.splice(5)
          this.setState({
            searchListVisible: true,
            searchList: res.data
          })
        })
    }
    else {
      this.setState({
        searchListVisible: false,
        searchList: []
      })
    }
  }

  searchClick = (r) => {
    console.log(r)
    // if (this.ballloonData) this.ballloonData
    console.log(this.ballloonData)
    if (this.ballloonData) {
      this.ballloonData.remove()
      this.changePopupVisible(false)
    }
    DataService.getPlanDataById({ planDataString: r.planDataId }, (bool, res) => {
      if (bool) {
        let layer = maps.getLayerById("balloonLayer")
        if (!layer) {
          layer = new vrPlanner.Layer.FeatureLayer("balloonLayer");
          maps.addLayer(layer);
        }
        const { data } = res;
        data.forEach(item => {
          const { position } = item;
          const mark = new Mark({
            geo: new vrPlanner.GeoLocation(JSON.parse(position)[0], JSON.parse(position)[1], JSON.parse(position)[2]),
            title: `${r.name}(${r.familyCount}人)`,
            lineVisible: true,
            height: (Math.random() + 1) * 20,
            icon: "images/songyang/bg.png",
            isCustom: true,
          });
          mark.point.data = r;
          mark.point.template = "songyangMap1";
          mark.point.name = "居民住宅";
          mark.renderBalloon({
            click: () => {
              this.changePopupVisible(true, mark.point);
            }
          })
          mark.focus();
          this.ballloonData = mark;
          layer.addFeature(mark.point);
          layer.addFeature(mark.line);
        })
      }
    })
  }

  changePrompt = (key, name?) => {
    this.setState({
      promptVisible: !key,
      promptName: name ? name : ''
    })
  }

  changePopupVisible = (key, data?) => {
    if (!key) {
      let layer = maps.getLayerById("helpLayer");
      if (!layer) {
        layer = new vrPlanner.Layer.FeatureLayer("helpLayer");
        maps.addLayer(layer)
      }
      layer.clearFeatures();
    }
    this.setState({
      syPopupVisible: key,
      syContentPopupVisible: false,
      popupPoint: data ? data : {}
    })
  }

  changeContentPopupVisible = (key, style?) => {
    this.setState({
      syContentPopupVisible: key,
      contentPopupStyle: style ? style : "1"
    })
  }

  syChangeSelected = (value) => {
    const { syLegendSelectedList } = this.state
    if (syLegendSelectedList.includes(value)) {
      let indexOf = syLegendSelectedList.indexOf(value)
      syLegendSelectedList.splice(indexOf, 1)
      this.setState({
        syLegendSelectedList: syLegendSelectedList
      })
    }
    else {
      this.setState({
        syLegendSelectedList: [...syLegendSelectedList, value]
      })
    }
  }

  changeLdVisible = (value) => {
    const { ldFirstMonth, ldLastMonth } = this.state
    fetch(`http://dtcity.cn:8077/api/caseInfo/timeList?startMonth=${this.getLdTime(ldFirstMonth)}&endMonth=${this.getLdTime(ldLastMonth)}`, { method: 'get' })
    this.setState({
      ldHeatMapVisible: !value
    })
  }

  lianduShowData = (value) => {
    const { ldMenuActive } = this.state;
    const index = ldMenuActive.indexOf(value);
    if (index > -1) {
      ldMenuActive.splice(index, 1)
    } else {
      ldMenuActive.push(value)
    }
    this.setState({
      ldMenuActive
    })
  };

  ldClearMonth = () => {
    this.setState({
      ldFirstMonth: "",
      ldLastMonth: ""
    })
  }

  ldSelectMonth = (value) => {
    const { ldFirstMonth } = this.state
    if (ldFirstMonth !== "") {
      const text1 = parseInt(ldFirstMonth.replace(/[^\d]/g, ''))
      const text2 = parseInt(value.replace(/[^\d]/g, ''))
      if (text1 > text2) {
        this.setState({
          ldLastMonth: ldFirstMonth,
          ldFirstMonth: value,
        })
      }
      else if (text1 < text2) {
        this.setState({
          ldLastMonth: value,
          ldFirstMonth
        })
      }
      else if (text1 === text2) {
        this.setState({
          ldLastMonth: value,
          ldFirstMonth
        })
      }
    } else {
      this.setState({
        ldFirstMonth: value
      })
    }
  }

  ldPoliceChange = (data) => {
    let layer = maps.getLayerById("limit");
    if (!layer) {
      layer = new vrPlanner.Layer.FeatureLayer("limit");
      maps.addLayer(layer);
    }
    layer.clearFeatures();
    if (!data.id) Handle.HomeHandle();
    else {
      fetch(`http://192.168.1.148:8077/api/common/station_boundary/${data.id}`, {
        mode: "cors"
      })
        .then(res => res.json())
        .then(res => {
          const { code, data } = res;
          if (code === 200)
            data.forEach(item => {
              const { position } = item;
              const line = new vrPlanner.Feature.Line();
              layer.addFeature(line);
              const style = new vrPlanner.Style.ProjectedFeatureStyle();
              line.setStyle(style)
              style.setLineWidth(5);
              style.setLineColor(new vrPlanner.Color("red"))
              position.forEach(_pos => {
                const geo = TransCoordinate.WGS84ToMercator(_pos);
                line.addVertex(geo)
              })
            })
        })
      const { latitude, longitude } = data;
      const geo = TransCoordinate.WGS84ToMercator({ x: longitude, y: latitude, z: 60 });
      const cam = maps.getCamera();
      cam.flyTo(geo.add(new vrPlanner.Math.Double3(400, 450, 600)), geo, true);
    }
    this.setState({
      ldPoliceId: data.id
    })
  }

  getSyPopupIndex = (title, value) => {
    this.setState({
      syAddressTitle1: title,
      syAddressTitle2: value.title
    })
    const geo = TransCoordinate.WGS84ToMercator({ x: value.lng, y: value.lat, z: 150 })
    const cam = maps.getCamera();
    cam.flyTo(geo.add(new vrPlanner.Math.Double3(150, 150, 300)), geo, true)
  }

  render() {
    const {
      title,
      menu,
      eleList,
      template,
      skin,
      drawerVisible,
      address,
      en,
      logoUrl,
      planId,
      watermark,
      searchListVisible,
      searchList,
      toolVisible,
      promptVisible,
      promptName,
      syContentPopupVisible,
      syPopupVisible,
      popupPoint,
      contentPopupStyle,
      tempData,
      syLegendSelectedList,
      ldHeatMapVisible,
      ldMenuActive,
      ldYear,
      ldFirstMonth,
      ldLastMonth,
      ldPoliceId,
      syPopupListVisible,
      syAddressTitle1,
      syAddressTitle2
    } = this.state;
    const { match } = this.props;
    const ComputedHeader = skin.header ? skin.header : Header;
    const toolBarList = [
      {
        title: '查询',
        icon: `${process.env.publicPath}images/songyangMap/icon/查询.svg`,
        // selectedIcon: `${process.env.publicPath}images/songyangMap/icon/查询选中.svg`
      },
      {
        title: '统计',
        icon: `${process.env.publicPath}images/songyangMap/icon/统计.svg`,
        selectedIcon: `${process.env.publicPath}images/songyangMap/icon/统计选中.svg`
      },
      {
        title: '更多',
        icon: `${process.env.publicPath}images/songyangMap/icon/更多.svg`,
        selectedIcon: `${process.env.publicPath}images/songyangMap/icon/更多选中.svg`
      }
    ]
    const syLegendList = {
      'songyangMap1': data1,
      'songyangMap2': data2,
      'songyangMap3': data3,
      'songyangMap4': data4,
      'songyangMap5': data5,
      'songyangMap6': data6,
    }
    return (
      <>
        <div
          className={[
            scss["mask"],
            scss["pe-none"],
            skin.hasDrawer && drawerVisible && template && template.substring(0, 11) !== 'songyangMap' && scss["back"],
            template.substring(0, 12) == 'lianDuPolice' && scss['ld-back']
          ]
            .filter(Boolean)
            .join(" ")}
        />
        <ComputedHeader
          title={title}
          en={en}
          bg={skin.hasDrawer && !drawerVisible}
          template={template}
          logoUrl={logoUrl}
          menu={menu}
          hasTool={eleList.length}
          tempData={tempData}
          renderEleMenu={this.renderEleMenu}
          genTemplateSkin={this.genTemplateSkin}
          hideDrawer={() => {
            this.setState({
              drawerVisible: true,
              syPopupVisible: false
            })
          }}
          titleSuffix={skin.titleSuffix || null}
          drawer={{
            visible: drawerVisible,
            click: () => this.setState({ drawerVisible: !drawerVisible })
          }}
          syChangeVisible={() => {
            this.setState({
              syPopupVisible: false,
              syLegendSelectedList: [],
              tempData: {
                'songyangMap1': [],
                'songyangMap2': [],
                'songyangMap3': [],
                'songyangMap4': [],
                'songyangMap5': [],
                'songyangMap6': [],
              },
            })
          }}
          ldMenuActive={ldMenuActive}
          ldChangVisible={() => {
            this.setState({
              ldMenuActive: []
            })
          }}
          ldYear={ldYear}
          ldFirstMonth={ldFirstMonth}
          ldLastMonth={ldLastMonth}
          ldClearMonth={this.ldClearMonth}
          ldSelectMonth={this.ldSelectMonth}
          ldYearChange={(value) =>
            this.setState({
              ldYear: value.toString()
            })}
          ldPoliceChange={this.ldPoliceChange}
        />
        {skin.routes ? (
          <Switch>
            <Route
              exact
              path={match.url}
              render={props => <skin.component {...props} {...this.drawerProps} />}
            />
            {skin.routes.map((route, i) => (
              <Route
                key={i}
                path={route.path}
                render={props => {
                  window["currentMenu"] = menu[i];
                  return <route.component {...props} {...this.drawerProps} />;
                }}
              />
            ))}
          </Switch>
        ) : skin.component ? (
          <skin.component {...this.drawerProps} />
        ) : null}

        {
          template.substring(0, 11) == 'songyangMap' ? null : <div
            className={`${scss["footer"]} ${window["template"] == "campus" ? scss["campusSkin"] : ""
              }`}
          >
            {/* {skin.hasDrawer ? (
            <div
              className={scss["switch"] + " " + scss["pointer"]}
              onClick={e => {
                this.setState({ drawerVisible: !this.state.drawerVisible });
              }}
            >
              <img
                src={require(`../../assets/leftswitch${Number(
                  drawerVisible
                )}.png`)}
                alt=""
              />
            </div>
          ) : null} */}

            <Compass
              style={{
                position: "unset",
                top: 0,
                // backgroundColor: "#adabab6b",
                borderRadius: "50%"
              }}
            />
          </div>
        }
        {
          template.substring(0, 11) == 'songyangMap' &&
          <>
            {/* <SyContentPopUp /> */}
            <div className={scss['sy-address-label']}
              style={{ left: `${rem(8.88)}` }}
            >
              <div>
                <div
                  onClick={() => this.setState({
                    syPopupListVisible: !syPopupListVisible
                  })}
                  className={scss['sy-address-label-active']}
                >
                  <span>松阳县</span>
                  <img src={SyLabelImg} alt="" />
                  <span>{syAddressTitle1}</span>
                  <img src={SyLabelImg} alt="" />
                  <span>{syAddressTitle2}</span>
                </div>
                {
                  syPopupListVisible && <SyPopupList
                    hidePopup={() => this.setState({
                      syPopupListVisible: false
                    })}
                    getPopupIndex={this.getSyPopupIndex}
                  />
                }

              </div>
            </div>
            <div className={scss['toolBar']}>
              <div className={scss['toolBar-search']}>
                <Input placeholder="搜索人名" onChange={this.searchChange} />
                <div className={scss['search-button']}>
                  <img src={toolBarList[0].icon} alt="" />
                </div>
                {
                  searchListVisible && <div className={scss['search-list']}>
                    {
                      searchList.map((r, i) => {
                        return <div key={i} onClick={() => this.searchClick(r)}>{i + 1}.{r.name}</div>
                      })
                    }
                  </div>
                }
              </div>

              <div onClick={() => this.changeVisible(drawerVisible)}>
                <img src={drawerVisible ? toolBarList[1].icon : toolBarList[1].selectedIcon} alt="" />
                <div>{toolBarList[1].title}</div>
              </div>
              <div>
                <div onClick={() => this.setState({ toolVisible: !toolVisible })}>
                  <img src={toolVisible ? toolBarList[2].selectedIcon : toolBarList[2].icon} alt="" />
                  <div>{toolBarList[2].title}</div>
                </div>
                {
                  toolVisible && <div className={scss['sy-tool-list']}>
                    {
                      eleList.map((e, i) => {
                        return <div key={i}>{this.featureTool[e].dom}</div>
                      })
                    }
                  </div>
                }
              </div>
            </div>
            <SySelectedRouter
              template={template}
              genTemplateSkin={this.genTemplateSkin}
              hideDrawer={() => {
                this.setState({
                  drawerVisible: true,
                  syPopupVisible: false
                })
              }}
              syChangeVisible={() => {
                this.setState({
                  syPopupVisible: false,
                  syLegendSelectedList: [],
                  tempData: {
                    'songyangMap1': [],
                    'songyangMap2': [],
                    'songyangMap3': [],
                    'songyangMap4': [],
                    'songyangMap5': [],
                    'songyangMap6': [],
                  },
                })
              }}
            />
          </>
        }
        {
          template.substring(0, 11) == 'songyangMap' && promptVisible ? <SyPrompt promptName={promptName} changePrompt={this.changePrompt} /> : null
        }
        {
          syPopupVisible && <SyPopup
            data={popupPoint}
            changeContentPopupVisible={this.changeContentPopupVisible}
            changePopupVisible={this.changePopupVisible}
          />
        }
        {
          syContentPopupVisible && <SyContentPopUp
            data={popupPoint}
            listKey={contentPopupStyle}
            changeVisible={this.changeContentPopupVisible}
          />
        }
        {
          template.substring(0, 11) == 'songyangMap' && !drawerVisible ? <SyLegend
            type={template}
            data={syLegendList[template]}
            tempData={tempData}
            changePrompt={this.changePrompt}
            promptVisible={promptVisible}
            changePopupVisible={this.changePopupVisible}
            syLegendSelectedList={syLegendSelectedList}
            syChangeSelected={this.syChangeSelected}
          /> : null
        }
        {
          template.substring(0, 11) == 'songyangMap' && drawerVisible ? <div className={scss['sy-shrink']} onClick={() => this.changeVisible(drawerVisible)}></div> : null
        }
        {
          template == "lianDuPolice" &&
          <img
            className={scss['ld-heatMap-button']}
            src={ldHeatMapVisible ? `${process.env.publicPath}images/ldPolice/开.svg` : `${process.env.publicPath}images/ldPolice/关.svg`}
            onClick={() => this.changeLdVisible(ldHeatMapVisible)}
            alt=""
          />
        }
        {
          template.substring(0, 12) == 'lianDuPolice' && <LdHeatMap
            style={ldHeatMapVisible ? { display: "block", zIndex: 5 } : { display: "none", zIndex: 1 }}
          />
        }
        {
          this.state.isCompared ? (
            <CompareTerrain
              drawerVisible={this.state.drawerVisible}
              compareTerrain={this.state.compareTerrain}
            />
          ) : null
        }
        {
          template == "peibiao1" || template == "peibiao2" || template.substring(0, 11) == 'songyangMap' ? null : (
            <Sidebar
              drawer={{
                visible: skin.hasDrawer,
                click: () => this.setState({ drawerVisible: !drawerVisible }),
                drawerVisible: drawerVisible,
                template: template,
              }}
              eleList={eleList.map(e => this.featureTool[e].dom)}
              watermark={watermark}
              ldMenuActive={ldMenuActive}
              lianduShowData={this.lianduShowData}
              onemenuVos={menu}
              ldPoliceId={ldPoliceId}
              ldStartMonth={ldFirstMonth !== "" ? this.getLdTime(ldFirstMonth) : `${ldYear + "-01"}`}
              ldEndMonth={ldLastMonth !== "" ? this.getLdTime(ldLastMonth) : `${ldYear + "-01"}`}
            />
          )
        }
      </>
    );
  }
}
export default withRouter(CustomMenu);

const showData = async ({ data, limit, planId }) => {
  for (const item of data) {
    let layer: any = null;
    const { type, whethshare } = item;
    layer = maps.getLayerById(`${type}Layer`) || new vrPlanner.Layer.FeatureLayer(`${type}Layer`);
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

  if (!process.env.LIZHONG) {
    //CAD
    app._store
      .dispatch({
        type: "cadModel/getFormatListForShare",
        payload: { planId }
      })
      .then(() => {
        const list = app._store.getState().cadModel.panels;
        list.forEach(item => {
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
          const isShow = {
            fontIsShare: Boolean(item.fontVo.isShare),
            lineIsShare: Boolean(item.lineVo.isShare),
            blockIsShare: Boolean(item.blockVo.isShare)
          };
          CadModule.render(isShow);
          item.data = CadModule;
          CadModuleData.addData(CadModule);
        });
      });
    const modelLayer =
      maps.getLayerById("animateModelLayer") ||
      new vrPlanner.Layer.FeatureLayer("animateModelLayer");
    const lineLayer =
      maps.getLayerById("animateLineLayer") || new vrPlanner.Layer.FeatureLayer("animateLineLayer");
    const gpslineLayer =
      maps.getLayerById("gpsLineLayer") || new vrPlanner.Layer.FeatureLayer("gpsLineLayer");
    lineLayer.setLodWindowSize(1); //数据可视距离设置
    lineLayer.setRenderTileTree(false);
    maps.addLayer(lineLayer);
    maps.addLayer(gpslineLayer);
    maps.addLayer(modelLayer);
    //Animation
    await Promise.all([
      new Promise((resolve, reject) =>
        AnimationService.getAModel({ planId }, (flag, res) => {
          if (flag) {
            for (const data of res.data) {
              const animation = ShowData.renderAnimateLine({ data });
              animation.setVisible(false);
              lineLayer.addFeature(animation.line.line);
              animation.models.forEach(model => {
                modelLayer.addFeature(model.point);
              });
            }
            resolve();
          } else {
            message.error(res.message);
            reject(res.message);
          }
        })
      ),
      new Promise((resolve, reject) =>
        AnimationService.getGPSLine({ planId }, async (flag, res) => {
          if (flag) {
            for (let i = 0; i < res.data.length; i++) {
              let geo;
              let gpsGeoData = [];
              let data = res.data;
              let animation: GPSAnimation;
              await new Promise((resolve, reject) => {
                if (res.data[i].gpsModelList.length > 0) {
                  res.data[i].gpsModelList.forEach((model, index) => {
                    let geoInit = res.data[i].gpsModelList[index].geo.split(",");
                    AnimationService.getShipList({ code: model.code }, (flag, res) => {
                      if (flag) {
                        gpsGeoData = res.data;
                        geo = TransCoordinate.WGS84ToMercator({
                          x: res.data[i].lon,
                          y: res.data[i].lat,
                          z: geoInit[2]
                        });
                        data[i].gpsModelList[index].geo = `${geo.x() +
                          "," +
                          geo.y() +
                          "," +
                          geo.z()}`;
                        data[i].gpsModelList[index].course = res.data[0].angle;
                        animation = ShowData.renderGPSLine({
                          data: data[i]
                        });
                        animation.gpsLine[index].saveAttribute(res.data);
                        resolve();
                      } else message.error(res.message);
                    });
                  });
                } else {
                  resolve();
                }
              });
              if (animation) {
                animation.setAllVisible(false);
                gpslineLayer.addFeature(animation.line.line);
                animation.models.forEach(model => {
                  modelLayer.addFeature(model.point);
                  animation.AddGpsVertices(model.code, model.geo.z(), gpsGeoData);
                });
              }
            }
            resolve();
          } else {
            message.error(res.message);
            reject(res.message);
          }
        })
      )
    ]);
    Layer.getList(planId, true);
    if (GPSAnimation.animations.length) {
      const contentsId = [
        ...new Set(
          GPSAnimation.animations.reduce((r, c) => (c.contentsId && r.push(...c.contentsId), r), [])
        )
      ];
      if (contentsId.length) {
        DataService.getContentTabs({ id: contentsId.toString() }).then(r =>
          app._store.dispatch({
            type: "markerModel/setProp",
            payload: { panels: r.data }
          })
        );
      }
    }
  }
};
