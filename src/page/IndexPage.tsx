import { Component } from "react";
import { message, notification } from "antd";
import Header from "../modules/Layout/Header";
import UserService from "../services/UserService";
import Config from "../config/Config";
import RightMenu from "../modules/Layout/RightMenu";
import FullScreen from "../modules/Menu/FullScreen";
import Compass from "../modules/Component/Compass";
import VrpTips from "../components/VrpTips";
import CustomFun from "../config/CustomFun";
import ShotImg from "../modules/Menu/ShotImg";
// import { balloonTip } from "../modules/Menu/Balloon";

const css = require("../styles/custom.css");

/**
 * @name IndexPage
 * @author: bubble
 * @create: 2018/11/21
 */

interface IndexPageProps {}

interface IndexPageStates {
  menuIds: string[];
  imgList: any;
  down: boolean;
  showHideMenu: boolean;
  isShowImgTips: boolean;
  isCompleted: boolean;
  percent: number;
}

class IndexPage extends Component<IndexPageProps, IndexPageStates> {
  constructor(props: IndexPageProps) {
    super(props);
    this.state = {
      menuIds: [],
      imgList: [],
      down: true,
      showHideMenu: false,
      isShowImgTips: false,
      isCompleted: false,
      percent: 0
    };
  }
  componentWillMount() {
    // if (process.env.NODE_ENV === "development" && !Config.loggedIn) {
    //   import("../test/open-menu-ppt.js")
    //     .then(m => m.default())
    //     .catch(message.error);
    // }
    this.onMapsRead();
  }
  componentDidMount() {
    // VrpTips.showTips("热气球模式", balloonTip, 395, 12);
  }
  /**
   * @description 页面初始化 验证用户是否存在
   */
  onMapsRead() {
    if (!Config.loggedIn) {
      UserService.checkLogin((flag, r) => {
        Config.loggedIn = r.data;
        if (r.data) {
          this.getUserInfo({ id: Config.PLANID });
        } else {
          message.error(r.message);
          Config.goLogin();
        }
      });
    } else this.getUserInfo({ id: Config.PLANID });
  }

  /**
   * @description 获取用户的功能菜单权限
   */
  getUserInfo = data => {
    UserService.getPlanUserInfo(data, (flag, res) => {
      if (flag) {
        const mIds: string[] = ["default"];
        const menuList = res.data.eleList;
        for (const item of menuList) {
          mIds.push(item.eleId);
        }
        this.setState({ menuIds: mIds });
      } else {
        message.error("获取用户菜单权限失败");
      }
    });
  };

  getImgList = img => {
    const { imgList, isShowImgTips } = this.state;
    if (imgList.length === 6) {
      imgList.splice(0, 1);
    }
    imgList.push(img);
    this.setState({
      imgList,
      isShowImgTips: !isShowImgTips && this.state.imgList.length === 1
    });
    this.showTips();
  };

  delShotImg = index => {
    const { imgList, isShowImgTips } = this.state;
    imgList.splice(index, 1);
    this.setState({ imgList }, () => {
      if (isShowImgTips && this.state.imgList.length === 0) {
        this.setState({ isShowImgTips: false });
      }
    });
  };

  /**
   * @description 全屏/退出全屏点击事件
   */
  showHideMenu = () => {
    this.setState({ showHideMenu: !this.state.showHideMenu }, () => {
      setTimeout(() => (Config.keyboard = true), 1000);
      if (this.state.showHideMenu) {
        VrpTips.showTips(
          "全屏",
          <div>
            <p className={css["m-b-sm"]}>退出全屏（ESC）</p>
          </div>,
          230
        );
        window.addEventListener("keydown", this.handleShowMenu);
      }
    });
  };

  /**
   * @description ESC退出全屏
   * @param e
   */
  handleShowMenu = e => {
    CustomFun.onKeyDown(e, 27, () => {
      this.setState({
        showHideMenu: false
      });
      notification.destroy();
      window.removeEventListener("keydown", this.handleShowMenu);
    });
  };

  showTips = () => {
    if (this.state.isShowImgTips) {
      VrpTips.showTips(
        "使用方法",
        <div>
          <p className={css["m-b-sm"]}>1、保存当前视角</p>
          <p className={css["m-b-sm"]}>2、点击屏幕下方图片回到该视角</p>
        </div>,
        305
      );
    }
  };

  render() {
    const { imgList } = this.state;
    return (
      <div>
        <Header
          menuIds={this.state.menuIds}
          isHide={this.state.showHideMenu}
          callBack={this.getImgList}
        />
        <RightMenu
          menuIds={this.state.menuIds}
          isHide={this.state.showHideMenu}
        />
        <FullScreen
          showHideMenu={this.showHideMenu}
          isFull={this.state.showHideMenu}
        />
        {imgList.length > 0 ? (
          <ShotImg imgList={imgList} delShotImg={this.delShotImg} />
        ) : null}
        <Compass />
      </div>
    );
  }
}

export default IndexPage;
