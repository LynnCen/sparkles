import { Component, ReactNode } from "react";
import OpenTerrain from "../Menu/OpenTerrain";
import InitialView from "../Menu/InitialView";
import ReLoad from "../Menu/ReLoad";
import Measure from "../Menu/Measure";
import Draw from "../Menu/Draw";
import Bulldoze from "../Menu/Bulldoze";
import Sunshine from "../Menu/Sunshine";
import Inundate from "../Menu/Inundate";
import ChangeMap from "../Menu/ChangeMap";
import Dimension from "../Menu/Dimension";
import Balloon from "../Menu/Balloon";
import SelectInfo from "../Menu/SelectInfo";
import Snapshot from "../Menu/Snapshot";
import { message } from "antd";
import Config from "../../config/Config";
import { PlanMsg, TerrainModel } from "../../models/PlanModel";
import Plan from "../../services/PlanService";
import Filter from "../Menu/Filter";
import SearchMap from "../Menu/SearchMap";
import UserService from "../../services/UserService";
import Shot from "../Menu/ActiveShot";
import Pine from "../Menu/Pine";

const css = require("../../styles/custom.css");

/**
 * @name Header
 * @author: bubble
 * @create: 2018/11/27
 */

interface IHeaderProps {
  menuIds: any;
  callBack: (img) => void;
  isHide: boolean;
}

interface IHeaderStates {
  terrainList: TerrainModel[];
  planTitle: string;
  mapData: any;
  limit: any;
}

interface IMenuModel {
  menu: ReactNode;
  hasLine?: boolean;
  menuId?: string;
}

class Header extends Component<IHeaderProps, IHeaderStates> {
  constructor(props: IHeaderProps) {
    super(props);
    this.state = {
      terrainList: [],
      planTitle: "",
      mapData: {},
      limit: {
        balloon: 7,
        area: 7,
        line: 7,
        push: 7,
        build: 7
      }
    };
  }

  /*
   * @description 获取地块信息
   * @param callback 是否完成
   */
  getPlanTerrain = (callback?: () => void) => {
    const data = {
      id: Config.PLANID
    };
    Plan.getPlan(data, (flag, res: PlanMsg) => {
      if (flag) {
        const {
          terrainVO,
          map,
          title,
          cameraLook,
          cameraPosition,
          area,
          balloon,
          line,
          push,
          build,
          isMap
        } = res.data;
        if (callback) {
          callback();
        }
        if (cameraLook && cameraPosition) {
          const cameraPos = { cameraPosition, cameraLook };
          Config.CameraPosition = JSON.stringify(cameraPos);
        } else {
          Config.CameraPosition = "";
        }
        Config.isMap = isMap;
        const limit = {
          area,
          balloon,
          line,
          push,
          build
        };
        this.setPageTitle(title);
        this.setState({
          terrainList: terrainVO ? terrainVO : [],
          planTitle: title,
          mapData: map,
          limit
        });
      } else {
        message.error(res.message);
      }
    });
  };

  setPageTitle = title => {
    document.getElementById("sys_page_title")!.innerHTML = title;
  };

  componentDidMount() {
    setInterval(() => {
      UserService.keepLive((success, res) => 1);
    }, 10 * 60 * 1000);
    this.getPlanTerrain();
  }

  renderHeaderMenu(list: IMenuModel[]) {
    return (
      <ul className={css["vrp-header-ul"]}>
        {list.map((item, index) => {
          if (this.props.menuIds.indexOf(item.menuId) >= 0) {
            return (
              <li
                className={
                  css["vrp-header-li"] +
                  " " +
                  (item.hasLine ? css["vrp-header-line"] : "")
                }
                key={index}
              >
                {item.menu}
              </li>
            );
          }
        })}
      </ul>
    );
  }

  render() {
    const BaseListMenu: IMenuModel[] = [
      {
        menu: <InitialView />,
        hasLine: true,
        menuId: "default"
      },
      {
        menu: (
          <OpenTerrain
            mapData={this.state.mapData}
            terrainList={this.state.terrainList}
            planTitle={this.state.planTitle}
            getPlanTerrain={this.getPlanTerrain}
            limit={this.state.limit}
          />
        ),
        hasLine: true,
        menuId: "default"
      },
      {
        menu: <ReLoad />,
        hasLine: true,
        menuId: "default"
      },
      {
        menu: <Measure />,
        menuId: "Control-Measure"
      },
      {
        menu: <Draw isSave={true} />,
        menuId: "Control-Drag"
      },
      {
        menu: <Bulldoze />,
        menuId: "Control-Push"
      },
      {
        menu: <Sunshine />,
        menuId: "Control-Sun"
      },
      {
        menu: <Inundate />,
        menuId: "Control-Water"
      },
      {
        menu: <Dimension />,
        menuId: "Control-Dimension"
      },
      {
        menu: <ChangeMap />,
        menuId: "Control-Map"
      },
      {
        menu: <Balloon />,
        menuId: "Control-KeyPower"
      },
      {
        menu: <Filter />,
        menuId: "default"
      },
      {
        menu: <SelectInfo />,
        menuId: "default"
      },
      {
        menu: <SearchMap />,
        menuId: "default"
      },
      {
        menu: <Snapshot callBack={this.props.callBack} />,
        menuId: "default"
      },
      {
        menu: <Shot />,
        menuId: "default"
      },
      Config.PLANID === 2347 && {
        menu: <Pine />,
        menuId: "default"
      }
    ].filter(Boolean);
    return (
      <div
        className={
          css["vrp-header"] +
          " " +
          (this.props.isHide ? css["hide-header"] : css["show-header"])
        }
      >
        {this.renderHeaderMenu(BaseListMenu)}
      </div>
    );
  }
}

export default Header;
