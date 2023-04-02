import React, { Component, useState, useEffect, ReactNode } from "react";
import VrpIcon from "../../../components/VrpIcon";
import moment from "moment";
import { connect } from "dva";
import { Dispatch } from "redux";
import { debounce } from "../../../utils/common";
import LandSearch from "./LandSearch";
import ToolKit from "./ToolKit";
import { Legend } from "./Legend";
import { Panel } from "../../../stores/markerModel";
import Config from "../../../config/Config";
import Watermark from "../Watermark";
import ContentBar from "./ContentBar";
import { ldMenus, daMenus, ftMenus, ldzzMenus } from "../../../config/StrConfig";
import { Select, Popover, Dropdown, Menu } from 'antd'
import TransCoordinate from "../../../components/tools/Coordinate";
import { Geometry, Line, Mark } from "../../../components/model";
import Play from "../../../components/tools/Play";

const css = require("../../../styles/custom.css");
const scss = require("../../../styles/scss/sharepage.scss");

const { Option } = Select
const isDev = process.env.NODE_ENV == "development";
const apihost = isDev ? "http://192.168.1.148:8077" : "http://dtcity.cn:8077"
const list = [
  {
    "name": "黄村乡",
    "center": "120.011,28.5177",
  },
  {
    "name": "雅溪镇",
    "center": "119.871,28.6972",
  },
  {

    "name": "老竹镇",
    "center": "119.77,28.525",
  },
  {
    "name": "太平乡",
    "center": "119.874,28.5352",
  },
  {
    "name": "碧湖镇",
    "center": "119.78,28.3521",
  },
  {
    "name": "仙渡乡",
    "center": "119.950,28.6082",
  },
  {
    "name": "大港头镇",
    "center": "119.750,28.300",
  },
  {
    "name": "峰源乡",
    "center": "119.782,28.200",
  },
  {
    "name": "联城街道",
    "center": "119.810,28.4786",
  },
  {
    "name": "丽新乡",
    "center": "119.682,28.4945",
  }, {
    "name": "主城区", "center": "119.923394,28.467031"
  }];
const parentNotInSidebar = (target, exclude?) => {
  while (
    !target.classList.value.includes("sidebar") &&
    target.nodeName != "BODY" &&
    (exclude ? target.nodeName != exclude : true)
  ) {
    target = target.parentNode;
  }
  return target.nodeName == "BODY";
};

const { vrPlanner, maps } = Config;
const cam = maps.getCamera();
let layer = maps.getLayerById("1111");
if (!layer) {
  layer = new vrPlanner.Layer.FeatureLayer("1111")
  maps.addLayer(layer)
}

interface Props {
  drawer: { visible: boolean; click: () => void; drawerVisible: boolean, template: string };
  eleList: ReactNode[];
  contents: Panel[];
  dispatch: Dispatch<Object>;
  watermark: { picture: string; title: string };
  ldMenuActive: any[],
  ldPoliceId: number;
  ldStartMonth: string;
  ldEndMonth: string;
  onemenuVos: any[],
  lianduShowData: (value: any) => void;
}

interface States {
  contentT: boolean; //信息栏上
  contentB: boolean; //信息栏下
  rightActiveIdx?: number | undefined;
  show?: boolean;
  fullscreen?: boolean;
  pin?: boolean;
  checkIds: number[];
  isShowWarning: boolean;
}

@connect(({ markerModel }) => ({
  contents: markerModel.panels
}))
export default class extends Component<Props, States> {
  isFocus: boolean = false;
  get sidebarHeight() {
    const sidebar = document.querySelector('footer[class*="sidebar"]');
    return sidebar ? sidebar.offsetHeight + 10 : 0;
  }

  constructor(props) {
    super(props);
    this.state = {
      contentT: false,
      contentB: false,
      show: true,
      fullscreen: isFullscreen(),
      pin: true,
      checkIds: [],
      rightActiveIdx: Config.PLANID == 2371 ? 1 : undefined,
      isShowWarning: false,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      if (this.props.drawer.template.substring(0, 12) === 'lianDuPolice') {
        this.renderLdDetail()
      }
    }, 500)

  }

  createMap = (layerId, url, height) => {
    const MAX_X = 20037508.342789244;
    const deviationX = 0;
    const deviationY = 0;
    const TIANDITU_VECTOR_INFO_LAYER_SETTINGS = {
      side: MAX_X * 2, // side length of layer
      center: { x: deviationX, y: deviationY, z: height }, // Center location of the SlippyMapTerrainLayer
      maxLevel: 18 // 19 is the most detailed level on the server
    };
    const tiandituVectorInfoLayerSettingsLayerSettings = new vrPlanner.Layer.LayerSettings(
      TIANDITU_VECTOR_INFO_LAYER_SETTINGS
    );
    const terrain = new vrPlanner.Layer.SlippyMapTerrainLayer(
      layerId,
      tiandituVectorInfoLayerSettingsLayerSettings,
      url,
      vrPlanner.Layer.SlippyMap.Layout.GOOGLE
    );
    terrain.setLodWindowSize(512);
    return terrain;
  }

  handleMapClick = () => {
    this.isFocus = !this.isFocus;
    if (this.isFocus) {
      const cam = maps.getCamera();
      cam.flyTo(new vrPlanner.GeoLocation(13351721.935203187, 3306930.9239528375, 15466.575971529304), new vrPlanner.GeoLocation(13351721.971960217, 3306931.0945711313, 15366.576123837827), true)
      const terrain1 = this.createMap("temp_maps1", [
        "http://t0.tianditu.com/DataServer?T=vec_w&tk=be8b387b76fa3e010851a08134961271",
        "http://t1.tianditu.com/DataServer?T=vec_w&tk=be8b387b76fa3e010851a08134961271",
        "http://t2.tianditu.com/DataServer?T=vec_w&tk=be8b387b76fa3e010851a08134961271",
        "http://t3.tianditu.com/DataServer?T=vec_w&tk=be8b387b76fa3e010851a08134961271",
        "http://t4.tianditu.com/DataServer?T=vec_w&tk=be8b387b76fa3e010851a08134961271",
        "http://t5.tianditu.com/DataServer?T=vec_w&tk=be8b387b76fa3e010851a08134961271",
        "http://t6.tianditu.com/DataServer?T=vec_w&tk=be8b387b76fa3e010851a08134961271",
        "http://t7.tianditu.com/DataServer?T=vec_w&tk=be8b387b76fa3e010851a08134961271"
      ], 1400)
      const terrain2 = this.createMap("temp_maps2", [
        "http://t0.tianditu.com/DataServer?T=cva_w&tk=be8b387b76fa3e010851a08134961271",
        "http://t1.tianditu.com/DataServer?T=cva_w&tk=be8b387b76fa3e010851a08134961271",
        "http://t2.tianditu.com/DataServer?T=cva_w&tk=be8b387b76fa3e010851a08134961271",
        "http://t3.tianditu.com/DataServer?T=cva_w&tk=be8b387b76fa3e010851a08134961271",
        "http://t4.tianditu.com/DataServer?T=cva_w&tk=be8b387b76fa3e010851a08134961271",
        "http://t5.tianditu.com/DataServer?T=cva_w&tk=be8b387b76fa3e010851a08134961271",
        "http://t6.tianditu.com/DataServer?T=cva_w&tk=be8b387b76fa3e010851a08134961271",
        "http://t7.tianditu.com/DataServer?T=cva_w&tk=be8b387b76fa3e010851a08134961271"
      ], 1403)
      maps.addLayer(terrain1, false);
      maps.addLayer(terrain2, false);
    } else {
      maps.removeLayer("temp_maps1")
      maps.removeLayer("temp_maps2")
    }

  }

  get leftMenu() {
    const { contents } = this.props;
    const { fullscreen, pin, contentT, contentB, checkIds } = this.state;
    return [
      fullscreen && {
        component: (
          <VrpIcon
            iconName="icontuding"
            title={`${pin ? "un" : ""}pin the sidebar`}
            onClick={this.onPin}
          />
        ),
        active: pin
      },
      contents.length && {
        component: (
          <VrpIcon
            iconName={`icon-full${contentB ? "-exit" : ""}`}
            // className={contentB ? scss["active"] : ""}
            onClick={e => this.setState({ contentT: !!checkIds.length, contentB: !contentB })}
          />
        ),
        active: contentB
      },
      contents.length && {
        component: (
          <VrpIcon
            iconName={"icon-jiugongge"}
            // className={contentT ? scss["active"] : ""}
            onClick={e => {
              this.setState({
                contentT: checkIds.length || !contentT,
                contentB: false,
                checkIds: []
              });
            }}
          />
        ),
        active: contentT
      },
    ].filter(Boolean);
  }

  get rightMenu() {
    const { drawer, eleList, onemenuVos } = this.props;
    const popoverContent = (
      <div>
        {
          onemenuVos.length > 0 && onemenuVos[0].sub.map((r, i) => {
            return <div className={scss['ld-sidebar-popover']} key={i}
              onClick={() => this.play(r)}>{r.title}</div>
          })
        }
      </div>
    )
    return [
      <Time />,
      !process.env.LIZHONG && (
        <LandSearch changeVisible={() => this.setState({ rightActiveIdx: undefined })}>
          <VrpIcon iconName={"icon-search-fill"} />
        </LandSearch>
      ),
      drawer.template.substring(0, 12) == "lianDuPolice" && <VrpIcon iconName={"icondituqiehuan"} onClick={this.handleMapClick} />,
      drawer.template.substring(0, 12) == "lianDuPolice" &&
      <Popover
        content={popoverContent}
      ><VrpIcon iconName={"icon-play-fill"} /></Popover>,
      <ToolKit components={eleList}>
        <VrpIcon iconName={"icon-gongju"} />
      </ToolKit>,
      drawer.visible && <VrpIcon iconName={"icon-statistics"} onClick={drawer.click} />,
      <FullScreen onChange={this.fullscreenChange} />
    ].filter(Boolean);
  }

  play = (r) => {
    Play.play(r.feature)
  };

  renderLdDetail = () => {
    fetch((`${apihost}/api/caseInfo/case_index`), {
      mode: "cors"
    }).then(res => res.json()).then(res => {
      const { data } = res;
      const newList = list.map((it) => {
        return {
          ...it,
          count: data[it.name]
        }
      });
      // 南明山 119.871298,28.387079
      // console.log(data)
      newList.forEach((item) => {
        const location = item.center.split(",");
        const geo = TransCoordinate.WGS84ToMercator({
          x: Number(location[0]),
          y: Number(location[1]),
          z: 0
        });
        const mark = new Mark({
          geo,
          height: 100,
          id: 1,
          title: `${item.name}-${item.count}`,
          icon: "",
          isLdShare: true
        });
        layer.addFeature(mark.point);
        layer.addFeature(mark.line)
      })
      layer.setLodWindowSize(1)
      cam.bindEvent("move", () => {
        cam.unbindEvent("move")
        document.body.addEventListener("click", this.cancelMenuActive);
        cam.bindEvent("stop", () => {
          layer.clearFeatures();
          this.renderBalloon();
        })
      })


    })
  }

  getIconType = (type) => {
    switch (type) {
      case 1:
        return "/res/image/icon/XXF/29741617949212682.png";// dao1
      case 2:
        return "/res/image/icon/XXF/29771617949212695.png";//电诈2
      case 3:
        return "/res/image/icon/XXF/29731617949212682.png"; //shang3
      case 4:
        return "/res/image/icon/XXF/29751617949212688.png";//du5
      case 5:
        return "/res/image/icon/XXF/29761617949212689.png";//huang4
      case 6:
        return "/res/image/icon/XXF/29721617949069955.png" // 纠纷6
    }
  };


  /**
   *
   * @param type
   * @param level
   * @description 获取风险隐患图标
   */

  getRiskIcon = (type, level) => {
    if (type === 1 || type === 5 || type === 6 || type === 7 || type === 8) {
      return "/res/image/icon/XXF/30301619770158261.png"
    }
    else if (type === 2 || type === 9 || type === 10 || type === 11) {
      return "/res/image/icon/XXF/30241619770157516.png"
    }
    else if (type === 4 || type === 15 || type === 16 || type === 18) {
      return "/res/image/icon/XXF/30261619770157532.png"
    }
    else {
      return "/res/image/icon/XXF/30291619770157683.png"
    }
  }

  renderBalloon = () => {
    layer.clearFeatures();
    const { ldMenuActive, ldPoliceId, ldStartMonth, ldEndMonth } = this.props;
    if (ldMenuActive.length) {
      const pos = cam.getPosition();
      const focus = cam.getFocusPosition();
      const dis = pos.distance(focus);
      let _distance = Math.floor(dis / 600);
      let template = this.props.drawer.template
      if (template == 'lianDuPolice') {
        if (_distance > 1) {
          let level = 0;
          let count = 3;
          if (_distance > 13) {
            // 0层3*3网格
            level = 0;
            count = 3;
          } else if (_distance >= 8 && _distance <= 13) {
            // 1层6*6网格
            level = 1;
            count = 8;
          } else if (_distance > 3 && _distance < 8) {
            // 2层12*12网格
            level = 2;
            count = 16;
          } else if (_distance > 1 && _distance <= 3) {
            // 3层12*12网格
            level = 3;
            count = 24;
          }
          ldMenuActive.forEach(id => {
            fetch(`${apihost}/api/caseInfo/caseAggregate?type=${id}&level=${level}&count=${count}&startMonth=${ldStartMonth}&endMonth=${ldEndMonth}&policeStationId=${ldPoliceId}`, {
              mode: "cors"
            }).then(res => res.json()).then(res => {
              const { data } = res;
              data.forEach(item => {
                const geo = TransCoordinate.WGS84ToMercator({
                  x: Number(item.longitude),
                  y: Number(item.latitude),
                  z: 0
                });
                const mark = new Mark({
                  geo,
                  height: 100,
                  title: item.count,
                  icon: this.getIconType(id),
                })
                mark.point.data = item;
                mark.point.bindEvent("click", () => {
                })
                layer.addFeature(mark.point)
                layer.addFeature(mark.line)
              })
            })
          })
        } else {
          ldMenuActive.forEach(id => {
            fetch(`${apihost}/api/caseInfo/queryByCondition?type=${id}&startMonth=${ldStartMonth}&endMonth=${ldEndMonth}&policeStationId=${ldPoliceId}`, {
              mode: "cors"
            }).then(res => res.json()).then(res => {
              const { data } = res;
              data.forEach(item => {
                const geo = TransCoordinate.WGS84ToMercator({
                  x: Number(item.longitude),
                  y: Number(item.latitude),
                  z: 0
                })
                const mark = new Mark({
                  geo,
                  height: 100,
                  id: item.id,
                  title: item.name || "无",
                  icon: this.getIconType(item.type),
                });
                mark.point.data = item;
                mark.renderBalloon();
                layer.addFeature(mark.point);
                layer.addFeature(mark.line)
              })
            })
          })
        }
      } else if (template == 'lianDuPolice2') {
        ldMenuActive.forEach(r => {
          if (r === 1 || r === 2 || r === 3 || r === 4) {

          }
          else {
            fetch(`${apihost}/api/basis_with/${r === 5 || r === 6 || r === 7 || r === 8 ? 'query_persons' : "query_base_infos/"}?stationId=${ldPoliceId}&type=${r}`).then(res => res.json())
              .then(res => {
                const { data } = res
                data.forEach(item => {
                  const geo = TransCoordinate.WGS84ToMercator({
                    x: Number(item.longitude),
                    y: Number(item.latitude),
                    z: 0
                  })
                  const mark = new Mark({
                    geo,
                    height: 100,
                    id: item.id,
                    title: item.name || item.targetName || item.companyName || item.unitName || "无",
                    icon: this.getRiskIcon(item.type, item.level)
                  })
                  mark.point.data = item;
                  mark.renderBalloon();
                  layer.addFeature(mark.point);
                  layer.addFeature(mark.line)
                })
              })
          }

        })
      } else if (template == 'lianDuPolice3') {
        ldMenuActive.forEach(it => {
          // fetch(url[it], { mode: "cors" }).then(res => res.json()).then(res => {
          //   const { data } = res;
          //   console.log(res)
          //   data.forEach(item => {
          //     const geo = TransCoordinate.WGS84ToMercator({
          //       x: Number(item.longitude),
          //       y: Number(item.latitude),
          //       z: 0
          //     })
          //     const mark = new Mark({
          //       geo,
          //       height: 100,
          //       id: item.id,
          //       title: item.name || item.targetName || "无" || item.companyName,
          //       icon: this.getIconType(item.type)
          //     })
          //     mark.point.data = item;
          //     mark.renderBalloon();
          //     layer.addFeature(mark.point);
          //     layer.addFeature(mark.line)
          //   })
          // })
        });
      } else {

      }
    }

  }

  /*获取数据 渲染标签*/
  showData = (value, key?) => {
    if (key) {
      const activeList = {
        1: [1, 5, 8],
        2: [2, 9, 10, 11],
        3: [3, 12, 13, 14],
        4: [4, 15, 16, 18]
      }
      activeList[value].map(r => this.props.lianduShowData(r))
      setTimeout(() => this.renderBalloon(), 200)
    }
    else {
      this.props.lianduShowData(value)
      this.renderBalloon()
    }
    // const { ldMenuActive } = this.props;
    // const index = ldMenuActive.indexOf(value);
    // if (index > -1) {
    //   ldMenuActive.splice(index, 1)
    // } else {
    //   ldMenuActive.push(value)
    // }
    // this.setState({
    //   ldMenuActive
    // }, () => {
    //   this.renderBalloon();
    // })
  };

  changeWarning = () => {
    const { ldMenuActive, ldPoliceId, ldStartMonth, ldEndMonth } = this.props;
    const { isShowWarning } = this.state;
    this.setState({
      isShowWarning: !isShowWarning
    }, () => {
      if (this.state.isShowWarning) {
        ldMenuActive.forEach((type) => {
          fetch(`${apihost}/api/caseInfo/case_warning?type=${type}&startMonth=${ldStartMonth}&endMonth=${ldEndMonth}&policeStationId=${ldPoliceId}`, {
            mode: "cors"
          }).then(res => res.json()).then(res => {
            const { data } = res;
            data.forEach((item) => {
              this.renderWarnArea(item)
            })
          })
        })
      } else {
        const { maps } = Config;
        let layer = maps.getLayerById("WarnInfoLayer")
        if (layer) {
          layer.clearFeatures();
        }
      }
    });
  }

  renderWarnArea = (item) => {
    const { communityId, communityName, flag, position } = item;
    const { maps, vrPlanner } = Config;
    const layerIdStr = "WarnInfoLayer";
    let layer = maps.getLayerById(layerIdStr)
    if (layer) {
      layer.clearFeatures();
    } else {
      layer = new vrPlanner.Layer.FeatureLayer(layerIdStr);
      maps.addLayer(layer);
    }
    let color = "#00baff80";
    switch (flag) {
      case 1:
        color = "#FEFE00";
        break;
      case 2:
        color = "#E02020";
        break;
    }
    let vertices: any = [];
    position.forEach((p) => {
      const geo = TransCoordinate.WGS84ToMercator({ x: p.x, y: p.y, z: 100 });
      vertices.push(geo);
    });
    const line = new Line({
      vertices,
      width: 5,
      color,
      lineStyle: "default",
      depthTest: false
    });
    const geometry = new Geometry({
      id: communityId,
      polygonStyle: "ProjectedFeatureStyle",
      title: communityName,
      vertices,
      color,
      opacity: 0.35
    });
    layer.addFeature(line.line);
    layer.addFeature(geometry.polygon);
    geometry.focus();

  }

  menuList = (mapTypeData) => {
    return <Menu >{
      mapTypeData && mapTypeData.map((it, i) => {
        console.log(it.isClick ? "" : `isClick${i}`);

        return <Menu.Item key={i} className={(it.isClick ? "" : scss["unActive"])} >
          <div
            className={(this.props.ldMenuActive.indexOf(it.id) > -1 ? scss['active'] : "")}
            onClick={it.isClick ? () => this.showData(it.id) : () => { }}>
            {it.name}
          </div>
        </Menu.Item>
      })} </Menu>
  }

  renderLianDuMenu() {
    let menu
    switch (this.props.drawer.template) {
      case "lianDuPolice":
        menu = ldMenus;
        break;
      case "lianDuPolice2":
        menu = daMenus
        break;
      case "lianDuPolice3":
        menu = ftMenus;
        break;
      case "lianDuPolice4":
        menu = ldzzMenus;
        break;
    }

    return <div className={scss['ld-side-bar']}>
      <div className={scss['ld-slider-menu']}>
        {menu && menu.map((item, i) => {
          return this.props.drawer.template == "lianDuPolice2" ?
            <Dropdown
              overlay={() => this.menuList(item.subTypes)}
              placement="topCenter"
              getPopupContainer={(triggerNode) => triggerNode}
              key={i}
            >
              <div
                className={scss['menu-item'] + " " + (this.props.ldMenuActive.indexOf(item.id) > -1 ? scss["active"] : "")}
                onClick={() => this.showData(item.id, "2")}
              >
                {/* <VrpIcon
                  iconName={item.name}
                  className={scss['ld-slider-icon']}
                /> */}
                {item.name}
              </div>
            </Dropdown> : <div key={i}
              className={scss['menu-item'] + " " + (this.props.ldMenuActive.indexOf(item.value) > -1 ? scss["active"] : "")}
              onClick={() => this.showData(item.value)}
            >
              <VrpIcon
                iconName={item.name}
                className={scss['ld-slider-icon']}
              />
              {item.text}
            </div>
        })}
        {
          this.props.drawer.template == "lianDuPolice" && <>
            <div className={scss['menu-item'] + " " + (this.state.isShowWarning ? scss["active"] : "")}
              onClick={this.changeWarning}>
              <VrpIcon
                iconName={"icon-alarm"}
                className={scss['ld-slider-icon']}
              />
          预警
        </div>
            <span className={scss['ld-legend']}>
              图例：
          <span className={scss["ld-legend-y"]}>75%-89%</span>
              <span className={scss["ld-legend-r"]}>90%-100%</span>
            </span>
          </>
        }
      </div>
    </div>
  };

  onPin = e => {
    this.setState({ pin: !this.state.pin }, this.fullscreenChange.bind(this, true));
  };
  fullscreenChange = (fullscreen: boolean) => {
    this.setState({ fullscreen });
    document.body.removeEventListener("mousemove", this.showSidebar);
    document.body.removeEventListener("click", this.cancelMenuActive);
    !this.state.pin &&
      this.setState({ show: !fullscreen, rightActiveIdx: undefined }, () => {
        fullscreen
          ? document.body.addEventListener("mousemove", this.showSidebar)
          : document.body.addEventListener("click", this.cancelMenuActive);
      });
  };
  showSidebar = debounce(e => {
    if (!this.state.show && document.body.clientHeight - e.y <= this.sidebarHeight) {
      this.setState({ show: true });
    } else if (
      isFullscreen() &&
      this.state.show &&
      document.body.clientHeight - e.y > this.sidebarHeight
    ) {
      parentNotInSidebar(e.target) && this.setState({ show: false, rightActiveIdx: undefined });
    }
  }, 30);
  cancelMenuActive = e => {
    let pNode = e.target.parentNode;
    let cls = pNode.classList;
    if (
      parentNotInSidebar(e.target, "CANVAS") ||
      (e.target.nodeName == "I" &&
        !("i" in pNode.dataset) &&
        (!cls.contains("header-menu") || cls.contains("second")))
    ) {
      this.setState({ rightActiveIdx: undefined });
    }
  };
  onCheckChange = (checkIds: number[]) => {
    const { contentT } = this.state;
    if (!contentT) {
      this.setState({ contentT: true });
    }
    this.setState({ checkIds });
  };

  render() {
    const { watermark, contents, drawer } = this.props;
    const { checkIds, contentB, contentT, rightActiveIdx, show, fullscreen } = this.state;
    const style = { opacity: Number(show) };
    return (
      <footer
        className={scss["sidebar"]}
        style={{ bottom: show ? 0 : -this.sidebarHeight + 10 }}
      // onMouseEnter={e => console.log(e)}
      >
        <div className={scss["relative-wrapper"]}>
          <div className={scss["sidebar-tr"]}>
            <Watermark picture={watermark.picture} title={watermark.title} />
            <Legend />
          </div>
        </div>
        <div className={scss["relative-wrapper"]} style={style}>
          <ContentBar
            data={
              (contentT && contentB) || checkIds.length
                ? checkIds.map(id => contents.find(e => e.id == id))
                : contents
            }
            style={{
              display: contentT ? "flex" : "none",
              maxHeight: contentB ? 585 : 585 + 235
            }}
            className={scss["sidebar-content-t"]}
            itemStyle={{
              width:
                checkIds.length > 0 && checkIds.length < 5
                  ? (1 / checkIds.length) * 100 + "%"
                  : "calc(25% - .3px)",
              height:
                contentT && contentB
                  ? 585
                  : contentT && !contentB && checkIds.length
                    ? 585 + 235
                    : 235
            }}
            isFullScreen={true}
          />
        </div>
        <div className={scss["sidebar-wrapper"] + " " + css["flex-center-between"]} style={style}>
          <div className={scss["sidebar-left"]}>
            {this.leftMenu.map((e: any, i) => (
              <div className={scss["icon-box"] + " " + (e.active ? scss["aaa"] : "")}>
                {e.component}
              </div>
            ))}
            {
              Config.PLANID === 2442 && this.renderLianDuMenu()
            }
          </div>
          <div className={scss["sidebar-right"]}>
            <ul className={css["flex-center"]}>
              {this.rightMenu.map((e, i) => (
                <li
                  key={i}
                  className={
                    css["flex-center"] +
                    " " +
                    (i != 0 && scss["icon-box"]) +
                    " " +
                    (i != this.rightMenu.length - 2 && i != this.rightMenu.length - 1 && i == rightActiveIdx && scss["aaa"]) +
                    " " + (i == this.rightMenu.length - 2 && drawer.drawerVisible && scss["aaa"]) +
                    " " + (i == this.rightMenu.length - 1 && fullscreen && scss["aaa"])
                  }
                  onClick={e => {
                    const { rightActiveIdx } = this.state;
                    this.setState({
                      rightActiveIdx: rightActiveIdx == i ? undefined : i
                    });
                  }}
                >
                  {{
                    ...e,
                    props: {
                      ...e.props,
                      active: i == rightActiveIdx,
                      className: i == rightActiveIdx ? scss["active"] : ""
                    }
                  }}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div
          className="overflow-x"
          style={{ ...style, background: "#fff" }}
          onWheel={e => (e.currentTarget.scrollLeft += e.deltaY)}
        >
          <ContentBar
            data={contents}
            value={checkIds}
            style={{ display: contentB ? "flex" : "none" }}
            className={scss["sidebar-content-b"]}
            itemStyle={{
              height: 235,
              width:
                contents.length > 0 && contents.length < 6 ? (1 / contents.length) * 100 + "%" : 384
            }}
            mask={true}
            onChange={this.onCheckChange}
          />
        </div>
        <ul className={scss["place-bar"]}>
          {contentB &&
            contents.map((e, i) => (
              <li
                style={{
                  width: (1 / contents.length) * 100 + "%",
                  background: checkIds.includes(e.id) ? "#35E40F" : ""
                }}
              />
            ))}
        </ul>
      </footer>
    );
  }
}

export const Time = ({ format = "YYYY年MM月DD日 HH:mm:ss", step = "s", ...rest }) => {
  const [time, setTime] = useState(moment().format(format));
  const _step = {
    d: 24 * 60 * 60 * 1000,
    h: 60 * 60 * 1000,
    m: 60 * 1000,
    s: 1000
  }[step];
  useEffect(() => {
    setInterval(() => setTime(moment().format(format)), _step || 1000);
  }, []);
  return <span {...rest}>{time}</span>;
};

const isFullscreen = () => window.screen.height == document.body.clientHeight;

const setFullscreen = () => {
  setTimeout(() => (Config.keyboard = true), 1000);
  if (!document.fullscreen) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
};
const handleKeyF11 = e => {
  // console.log(e.keyCode);
  if (e.keyCode == 122 /* f11 */) {
    e.preventDefault();
    setFullscreen();
  }
};

export const FullScreen = ({ onChange = val => null, f11 = true }) => {
  const [full, setFull] = useState(isFullscreen());
  useEffect(() => {
    f11 && window.addEventListener("keydown", handleKeyF11);
    window.addEventListener(
      "fullscreenchange",
      e => {
        setFull(isFullscreen());
        onChange(isFullscreen());
      },
      false
    );
  }, []);

  return (
    <VrpIcon
      iconName={`icon-fullscreen${full ? "-exit" : ""}`}
      onClick={e => {
        setFullscreen();
        setFull(isFullscreen());
        onChange(isFullscreen());
      }}
    />
  );
};
