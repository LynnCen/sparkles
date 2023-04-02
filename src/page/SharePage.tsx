import { Component, ReactNode } from "react";
import PlanServices from "../services/PlanService";
import Config from "../config/Config";
import { Modal, Input, Button, message, Icon } from "antd";
import Compass from "../modules/Component/Compass";
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

interface SharePageProps {
  match;
}

interface SharePageStates {
  isPwd: boolean;
  loading: boolean;
  pwd: string;
  imgList: any;
  isShowImgTips: boolean;
  url: string;
  picture: string;
  title: string;
}

const { hash } = window.location;
const shareUrl = hash.replace("#/share/", "");

class SharePage extends Component<SharePageProps, SharePageStates> {
  INTERVAL;

  constructor(props: SharePageProps) {
    super(props);
    this.state = {
      isPwd: false,
      loading: false,
      pwd: "",
      imgList: [],
      isShowImgTips: false,
      url: "",
      picture: "",
      title: ""
    };
  }
  componentDidMount() {
    this.isPwd();
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

  /**
   * @description 是否需要密码
   */
  isPwd = () => {
    PlanServices.getShare({ shareUrl }, (flag, res) => {
      if (flag) {
        if (res.data.isencrypt === "1") {
          this.setState({ isPwd: true });
        } else {
          this.setState({ url: res.data.url });
        }
      } else {
        message.error(res.message);
      }
    });
  };

  /**
   * @description 校验密码
   */
  checkPwd = () => {
    this.setState({ loading: true }, () => {
      PlanServices.checkSharePwd(
        { shareUrl, pwd: this.state.pwd },
        (flag, res) => {
          if (flag) {
            const { data } = res;
            this.setState({ isPwd: false, url: data.url });
          } else {
            message.error(res.message);
          }
          this.setState({ loading: false });
        }
      );
    });
  };

  /**
   * @description 输入密码
   */
  handleInputPwd = e => {
    this.setState({ pwd: e.target.value });
  };

  getPicture = picture => {
    this.setState({ picture });
  };
  getTitle = title => {
    this.setState({ title });
  };

  render() {
    const { isPwd, loading, imgList, url } = this.state;
    return (
      <div>
        <Modal
          title={"请输入获取码"}
          visible={isPwd}
          onOk={this.checkPwd}
          footer={[
            <Button
              key="submit"
              type="primary"
              loading={loading}
              onClick={this.checkPwd}
            >
              确定
            </Button>
          ]}
        >
          <Input.Password
            placeholder="请输入提取码"
            onChange={this.handleInputPwd}
            onPressEnter={this.checkPwd}
          />
        </Modal>
        {/* <Compass heightPosition={25} /> */}
        {url ? (
          <CustomMenu
            url={url}
            callBack={this.getImgList}
            imgCall={this.getPicture}
            titleCall={this.getTitle}
          />
        ) : null}
        {imgList.length > 0 ? (
          <ShotImg imgList={imgList} delShotImg={this.delShotImg} />
        ) : null}
        {/* <Watermark picture={this.state.picture} title={this.state.title} /> */}
      </div>
    );
  }
}

export default SharePage;
