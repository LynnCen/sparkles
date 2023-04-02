import { Component, Fragment,ReactFragment } from "react";
import { Drawer } from "antd";
import Config from "../../config/Config";
import VrpIcon from "../../components/VrpIcon";
import Resource from "../Menu/Resource";
import AnimateModel from "../Menu/AnimationModel";
import ModelLibrary from "../Menu/ModelLibrary";
import SettingsModal from "../Modal/SettingsModal";
import Dynamic from "../Menu/Dynamic";
import PPT from "../Menu/PPT";
import Cad from "../Cad";
import Content from "../Content";

const css = require("../../styles/custom.css");

/**
 * @name RightMenu
 * @author: bubble
 * @create: 2018/12/25
 * @description: 右侧菜单
 */

interface RightMenuProps {
  menuIds: string[];
  isHide: boolean;
}

interface RightMenuStates {
  drawerVisible: boolean;
  visibleData: {
    type: string;
    upload: boolean;
    width: number;
    component: ReactFragment | Component;
  };
  newClientWidth: number;
  isTool: boolean;
}

interface IMenuModel {
  menu: string;
  menuId: string;
  type: string;
  icon: string;
}

const BaseListMenu: IMenuModel[] = [
  {
    menu: "资源列表",
    menuId: "default",
    type: "resource",
    icon: "icon-menu",
    component: Resource
  },
  {
    menu: "模型库",
    menuId: "Control-Model",
    type: "model",
    icon: "icon-model-bade",
    component: ModelLibrary
  },
  {
    menu: "动态模拟库",
    menuId: "default",
    type: "dynamic",
    icon: "icon-label",
    component: Dynamic
  },
  // {
  //   menu: "视频监控",
  //   menuId: "Control-Monitor",
  //   type: "monitor",
  //   icon: "icon-monitor"
  // },
  {
    menu: "PPT模式",
    menuId: "default",
    type: "ppt",
    icon: "icon-demoplay",
    component: PPT
  },
  {
    menu: "轨迹",
    menuId: "default",
    type: "animation",
    icon: "icon-trail",
    component: AnimateModel
  },
  {
    menu: "CAD数据",
    menuId: "default",
    type: "cad",
    icon: "icon-cad",
    component: Cad
  },
  {
    menu: "信息栏",
    menuId: "default",
    type: "content",
    icon: "icon-xinxijituan",
    component: Content
  }
].filter(Boolean);

class RightMenu extends Component<RightMenuProps, RightMenuStates> {
  divDom;

  constructor(props: RightMenuProps) {
    super(props);
    const { clientWidth } = document.documentElement;
    this.state = {
      visibleData: {
        type: "",
        component: Fragment,
        upload: false,
        width: 300
      },
      drawerVisible: false,
      newClientWidth: -1 * (clientWidth - 340),
      isTool: false
    };
  }

  openDrawer = data => {
    const { visibleData } = this.state;
    const drawerVisible = data.type !== visibleData.type;
    visibleData.component = drawerVisible ? data.component : Fragment;
    visibleData.type = data.type === visibleData.type ? "" : data.type;
    visibleData.width = 300;
    switch (data.type) {
      case "model":
        visibleData.upload =
          this.props.menuIds.indexOf("Control-UploadModel") > 0;
        break;
      case "monitor":
        visibleData.width = 400;
        break;
      default:
        break;
    }
    const { clientWidth } = document.documentElement;
    this.setState({
      visibleData,
      drawerVisible,
      newClientWidth: -1 * (clientWidth - visibleData.width - 40)
    });
  };

  onClose = () => {
    this.setState({ drawerVisible: false });
  };

  /**
   * @description 重新获取视口的大小
   */
  getClient = () => {
    const { clientWidth } = document.documentElement;
    const { visibleData } = this.state;
    this.setState({
      newClientWidth: -1 * (clientWidth - visibleData.width - 40)
    });
  };

  /**
   * @description 关闭抽屉
   */
  hideDrawer = () => {
    const { visibleData } = this.state;
    visibleData.type = "";
    this.setState({
      drawerVisible: false,
      visibleData
    });
  };

  // 开启全屏后不关闭抽屉
  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.isHide) {
  //     this.hideDrawer();
  //   }
  // }

  componentDidMount() {
    window.addEventListener("resize", this.getClient); // 监听窗口大小变化
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.getClient);
  }

  ToolClick = () => {
    this.setState({
      isTool: !this.state.isTool
    });
  };

  closeToolModal = () => {
    this.setState(
      {
        isTool: false
      },
      () => {
        const { maps } = Config;
        const list = maps.getLayerList();
        const { minLevel, maxLevel, windowSize } = JSON.parse(
          Config.ScenesSetData
        );
        const { minZoom, maxZoom, near, far } = JSON.parse(
          Config.CameraSetData
        );
        for (const item of list) {
          if (item.includes("terrain")) {
            const terrain = maps.getLayerById(item);
            terrain.setLodMinLevel(parseInt(minLevel));
            terrain.setLodMaxLevel(parseInt(maxLevel));
            terrain.setLodWindowSize(256 * (parseInt(windowSize) + 1));
          }
        }
        const camera = maps.getCamera();
        camera.setMaxZoom(Number(maxZoom));
        camera.setMinZoom(Number(minZoom));
        camera.setNear(Number(near));
        camera.setFar(Number(far));
      }
    );
  };

  renderMenu(list: IMenuModel[]) {
    return (
      <ul className={css["vrp-header-ul"]}>
        {list.map((item, index) => {
          if (this.props.menuIds.indexOf(item.menuId) >= 0) {
            return (
              <li
                key={index}
                className={
                  css["vrp-menu-item"] +
                  (this.state.visibleData.type === item.type
                    ? " " + css["active"]
                    : "")
                }
                onClick={() => this.openDrawer(item)}
              >
                <VrpIcon
                  className={css["vrp-menu-icon"]}
                  iconName={item.icon}
                  title={item.menu}
                />
              </li>
            );
          }
        })}
      </ul>
    );
  }

  render() {
    const { drawerVisible, visibleData, newClientWidth, isTool } = this.state;
    const devTools = (
      <ul className={css["vrp-grid-item"]}>
        <li className={css["vrp-menu-item"]} onClick={this.ToolClick}>
          <VrpIcon
            className={css["vrp-menu-icon"]}
            iconName={"icon-set"}
            title={"设置"}
          />
        </li>
      </ul>
    );
    return (
      <div
        className={
          css["vrp-right-menu"] +
          " " +
          (this.props.isHide ? css["hide-right-menu"] : css["show-right-menu"])
        }
      >
        {this.renderMenu(BaseListMenu)}
        {devTools}
        {this.props.isHide ? null : (
          <Drawer
            placement="right"
            mask={false}
            closable={false}
            keyboard={false}
            width={visibleData.width}
            onClose={this.onClose}
            className={drawerVisible ? css["show-drawer"] : ""}
            visible={drawerVisible}
          >
            <visibleData.component/>
            {/* {visibleData.type === "monitor" && (
              <ErrorBoundary msgContent={"服务器繁忙，请刷新页面重试"}>
                <MonitorList clientWidth={newClientWidth} />
              </ErrorBoundary>
            )} */}
          </Drawer>
        )}
        {isTool ? <SettingsModal closeModal={this.closeToolModal} /> : null}
      </div>
    );
  }
}

export default RightMenu;
