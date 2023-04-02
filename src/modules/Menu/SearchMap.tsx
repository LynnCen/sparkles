import { Component } from "react";
import VrpIcon from "../../components/VrpIcon";
import SearchResultModal from "../Modal/SearchResultModal";
import VrpTips from "../../components/VrpTips";
import { notification } from "antd";
import CustomFun from "../../config/CustomFun";

const css = require("../../styles/custom.css");

/**
 * @name SearchMap
 * @create: 2019/3/12
 * @description: 菜单：地图搜索
 */

interface SearchMapProps {}

interface SearchMapStates {
  isShowModal: boolean;
}

class SearchMap extends Component<SearchMapProps, SearchMapStates> {
  constructor(props: SearchMapProps) {
    super(props);
    this.state = {
      isShowModal: false
    };
  }

  showHideModal = () => {
    this.setState(
      {
        isShowModal: !this.state.isShowModal
      },
      () => {
        this.showTips();
      }
    );
  };

  showTips = () => {
    if (this.state.isShowModal) {
      VrpTips.showTips(
        "地图搜索",
        <div>
          <p className={css["m-b-sm"]}>1、输入地址信息在地图中搜索</p>
          <p className={css["m-b-sm"]}>2、右键点击地图进行范围查找</p>
          <p className={css["m-b-sm"]}>3、退出查找（ESC）</p>
        </div>,
        300
      );
      window.addEventListener("keydown", this.handleEvent);
    } else {
      notification.destroy();
      window.removeEventListener("keydown", this.handleEvent);
    }
  };

  handleEvent = e => {
    CustomFun.onKeyDown(e, 27, () => {
      this.showHideModal();
    });
  };

  render() {
    const { isShowModal } = this.state;
    return (
      <div>
        <VrpIcon
          className={
            css["vrp-menu-icon"] + " " + (isShowModal ? css["active"] : "")
          }
          iconName={"icon-search"}
          title="地图搜索"
          onClick={this.showHideModal}
        />
        {isShowModal ? (
          <SearchResultModal closeModal={this.showHideModal} />
        ) : null}
      </div>
    );
  }
}

export default SearchMap;
