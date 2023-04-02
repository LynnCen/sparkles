import { Component } from "react";
import Config from "../config/Config";
import { Icon } from "antd";
import VrpTips from "../components/VrpTips";
import CustomMenu from "../modules/Share/CustomMenu";
import Watermark from "../modules/Share/Watermark";
import ShotImg from "../modules/Menu/ShotImg";
const css = require("../styles/custom.css");

/**
 * @name SharePage
 * @author: bubble
 * @create: 2018/12/27
 * @description: 分享页面
 */

interface SharePageProps {}

interface SharePageStates {
  imgList: any;
  isShowImgTips: boolean;
  picture: string;
  title: string;
}

class SharePPT extends Component<SharePageProps, SharePageStates> {
  constructor(props: SharePageProps) {
    super(props);
    this.state = {
      imgList: [],
      isShowImgTips: false,
      picture: "",
      title: ""
    };
  }

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

  delShotImg = index => {
    const { imgList, isShowImgTips } = this.state;
    imgList.splice(index, 1);
    this.setState({ imgList }, () => {
      if (isShowImgTips && this.state.imgList.length === 0) {
        this.setState({ isShowImgTips: false });
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

  getPicture = picture => {
    this.setState({ picture });
  };

  getTitle = title => {
    this.setState({ title });
  };

  render() {
    const { imgList } = this.state;
    const { hash } = window.location;
    const url = /#\/shareppt\/(\w+)\/?/.test(hash);
    return (
      <>
        {/* <Compass heightPosition={25} /> */}
        <CustomMenu
          url={RegExp.$1}
          callBack={this.getImgList}
          imgCall={this.getPicture}
          titleCall={this.getTitle}
        />
        {imgList.length > 0 ? (
          <ShotImg imgList={imgList} delShotImg={this.delShotImg} />
        ) : null}

        {/* <Watermark picture={this.state.picture} title={this.state.title} /> */}
      </>
    );
  }
}

export default SharePPT;
