import { Component } from "react";
import { message } from "antd";
import VrpIcon from "../../components/VrpIcon";
import { SetConfigModel } from "../../models/DataModel";
import Config from "../../config/Config";
import Tools from "../../components/tools/Tools";
import UserService from "../../services/UserService";

const css = require("../../styles/custom.css");

/**
 * @name ChangeMap
 * @author: bubble && ltt
 * @create: 2018/12/20
 * @description: 切换地图
 */

interface ChangeMapProps { }

interface ChangeMapStates {
  googleData: any;
  aMapData: any;
  mapWorldData: any;
}

class ChangeMap extends Component<ChangeMapProps, ChangeMapStates> {
  public static OpenAMap: (maps, isMap?) => void;
  public static OpenGoogleMap: (maps, isMap?) => void;
  public static OpenMapWorld: (maps, isMap?) => void;

  constructor(props: ChangeMapProps) {
    super(props);
    this.state = {
      googleData: {},
      aMapData: {},
      mapWorldData: {}
    };

    ChangeMap.OpenAMap = this.aMap;
    ChangeMap.OpenGoogleMap = this.googleMap;
    ChangeMap.OpenMapWorld = this.mapWorld;
  }

  /**
   * @description 高德地图
   */
  aMap = (url, isMap = true) => {
    const AMAP_SATELLITE_URLS = [
      "http://wprd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=6",
      "http://wprd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=6",
      "http://wprd03.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=6",
      "http://wprd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=6"
    ];
    if (url) {
      Tools.addMaps(17, url, true, isMap);
    } else {
      Tools.addMaps(17, url, true, isMap);
    }
    // this.setMapVisible(isMap);
  };

  /**
   * @description 谷歌地图
   */
  googleMap = (url, isMap = true) => {
    if (url) {
      Tools.addMaps(19, url, true, isMap);
    } else {
      Tools.addMaps(19, this.state.googleData.urls, true, isMap);
    }
    // this.setMapVisible(isMap);
  };

  /**
   * @description 天地图
   * @param maps
   */
  mapWorld = (url, isMap = true) => {
    const TIANDITU_SATELLITE_INFO_URLS = [
      "http://t0.tianditu.com/DataServer?T=img_w&tk=be8b387b76fa3e010851a08134961271",
      "http://t1.tianditu.com/DataServer?T=img_w&tk=be8b387b76fa3e010851a08134961271",
      "http://t2.tianditu.com/DataServer?T=img_w&tk=be8b387b76fa3e010851a08134961271",
      "http://t3.tianditu.com/DataServer?T=img_w&tk=be8b387b76fa3e010851a08134961271",
      "http://t4.tianditu.com/DataServer?T=img_w&tk=be8b387b76fa3e010851a08134961271",
      "http://t5.tianditu.com/DataServer?T=img_w&tk=be8b387b76fa3e010851a08134961271",
      "http://t6.tianditu.com/DataServer?T=img_w&tk=be8b387b76fa3e010851a08134961271",
      "http://t7.tianditu.com/DataServer?T=img_w&tk=be8b387b76fa3e010851a08134961271"
    ];
    if (url) {
      Tools.addMaps(18, url, false, isMap);
    } else {
      Tools.addMaps(18, url, false, isMap);
    }
    // this.setMapVisible(isMap);
  };

  closeMap = () => {
    this.setMapVisible(false);
  };
  setMapVisible(isVisible: boolean) {
    const { maps } = Config;
    const layer = maps.getLayerById("maps");
    if (layer) {
      layer.setVisible(isVisible);
      // maps.removeLayer(maps.getLayerById("maps"));
    }
  }

  /**
   * @description 构造地图对象数据
   * @param item
   * @returns {any}
   */
  getUrl = item => {
    const { inLineMapUrl, outLineMapUrl, inLineSwitch, outLineSwitch } = item;
    let mapData;
    if (inLineSwitch === 1) {
      mapData = {
        isShow: true,
        urls: inLineMapUrl ? inLineMapUrl.split(",") : []
      };
    } else if (outLineSwitch === 1) {
      mapData = {
        isShow: true,
        urls: outLineMapUrl ? outLineMapUrl.split(",") : []
      };
    } else {
      mapData = { isShow: false };
    }
    return mapData;
  };

  /**
   * @description 获取地图配置数据
   */
  getSetInfo = () => {
    try {
      const info: SetConfigModel = JSON.parse(Config.setConfig);
      let aMap;
      let googleMap;
      let mapWorld;
      if (info.mapList.length > 0) {
        for (const item of info.mapList) {
          switch (item.mapType) {
            case 1:
              aMap = this.getUrl(item);
              break;
            case 2:
              googleMap = this.getUrl(item);
              break;
            case 3:
              mapWorld = this.getUrl(item);
              break;
          }
        }
        this.setState({
          aMapData: aMap,
          googleData: googleMap,
          mapWorldData: mapWorld
        });
      }
    } catch (e) {
      console.log(e.message);
    }
    // UserService.getSiteConfig((flag, res) => {
    // if (flag) {

    //   } else {
    //     message.error(res.message);
    //   }
    // })
  };

  componentDidMount() {
    this.getSetInfo();
  }

  render() {
    const { aMapData, googleData, mapWorldData } = this.state;
    return (
      <div className={css["vrp-header-menu"]}>
        <VrpIcon
          className={css["vrp-menu-icon"]}
          iconName={"icon-map"}
          title="加载地图"
        />
        <ul className={css["vrp-second-menu"]}>
          {aMapData.isShow ? (
            <li
              className={css["vrp-second-li"]}
              onClick={() => this.aMap(aMapData.urls)}
            >
              <VrpIcon
                className={css["vrp-menu-icon"]}
                iconName={"icon-amap"}
                title={"高德地图"}
              />
            </li>
          ) : null}
          {/* {googleData.isShow ? (
            <li
              className={css["vrp-second-li"]}
              onClick={() => this.googleMap(false)}
            >
              <VrpIcon
                className={css["vrp-menu-icon"]}
                iconName={"icon-google-map"}
                title={"加载谷歌地图"}
              />
            </li>
          ) : null} */}
          {mapWorldData.isShow ? (
            <li
              className={css["vrp-second-li"]}
              onClick={() => this.mapWorld(mapWorldData.urls)}
            >
              <VrpIcon
                className={css["vrp-menu-icon"]}
                iconName={"icon-tdt"}
                title={"天地图"}
              />
            </li>
          ) : null}
          <li className={css["vrp-second-li"]} onClick={this.closeMap}>
            <VrpIcon
              className={css["vrp-menu-icon"]}
              iconName={"icon-quit"}
              title={"关闭地图"}
            />
          </li>
        </ul>
      </div>
    );
  }
}

export default ChangeMap;
