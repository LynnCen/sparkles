import { Component } from "react";
import { Button, Input, Slider, InputNumber, message, Switch } from "antd";
import VrpModal from "../../components/VrpModal";
import Data from "../../services/DataService";
import Config from "../../config/Config";
import Resource from "../Menu/Resource";
import CustomFun from "../../config/CustomFun";
import Push from "../../components/model/Push";

const css = require("../../styles/custom.css");

/**
 * @name PushModal
 * @description 塌陷属性框
 */
interface PushModalProps {
  push: Push;
  closeModal: () => void;
}

interface PushModalStates {
  height: number;
  vertices: any;
  title: string;
  planId: number;
  username: string;
  position: string;
  type: string;
  whethshare: boolean;
}

class PushModal extends Component<PushModalProps, PushModalStates> {
  constructor(props: PushModalProps) {
    super(props);
    this.state = {
      height: 30,
      vertices: [],
      title: "新体块" + Math.round(Math.random() * 100),
      planId: 0,
      username: "",
      position: "",
      type: "push",
      whethshare: false
    };
  }
  componentDidMount() {
    window.addEventListener("keydown", this.handleKeyDown);
  }
  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeyDown);
  }

  /**
   * @description 设置塌陷标题
   * @param e
   */
  titleChange = e => {
    this.setState({ title: e.target.value });
  };
  /**
   * @description 设置塌陷高度
   * @param value
   */
  heightChange = value => {
    this.setState({ height: value }, () => {
      const { push } = this.props;
      push.setHeight(Number(value));
    });
  };
  whethshareChange = (value: boolean) => {
    this.setState({ whethshare: value });
  };

  /**
   * @description 保存体块属性
   */
  savePush = () => {
    const { push } = this.props;
    push.isNew = false;
    push.title = this.state.title;
    push.height = this.state.height;
    push.whethshare = this.state.whethshare;
    if (!push.id) {
      Data.addData(this.state, (flag, res) => {
        if (flag) {
          push.id = res.data;
          message.success("保存成功");
          Push.set(push);
        } else {
          message.error(res.message);
        }
      });
    } else {
      Object.assign(this.state, { id: push.id });
      const obj = this.state;
      Data.modData(obj, (flag, res) => {
        message[`${flag ? "success" : "error"}`](res.message);
      });
    }
    Resource.ReloadList && Resource.ReloadList();
    this.props.closeModal();
  };

  handleKeyDown = e => {
    CustomFun.onKeyDown(e, 27, this.props.closeModal);
    CustomFun.onKeyDown(e, 13, this.savePush);
  };

  componentWillMount() {
    const { push } = this.props;
    if (push) {
      const { vertices } = push;
      const position: any = [];
      vertices.forEach(pos => {
        position.push([
          pos.x().toFixed(2),
          pos.y().toFixed(2),
          pos.z().toFixed(2)
        ]);
      });
      this.setState({
        title: push.title,
        height: push.height || 0,
        vertices: push.vertices,
        position: JSON.stringify(position),
        planId: Config.PLANID,
        username: Config.USERNAME,
        whethshare: push.whethshare
      });
    }
  }

  render() {
    const btnGroup = (
      <div className={css["text-center"]}>
        <Button type="primary" onClick={this.savePush}>
          保存
        </Button>
        <Button className={css["m-l-md"]} onClick={this.props.closeModal}>
          取消
        </Button>
      </div>
    );

    return (
      <VrpModal
        defaultPosition={{ x: 30, y: 95 }}
        title={this.state.title}
        style={{ width: 300 }}
        footer={btnGroup}
        onClose={this.props.closeModal}
      >
        <div className={css["vrp-form"]}>
          <div className={css["flex-center-left"]}>
            <label className={css["flex-none-label"]}>标题</label>
            <Input
              placeholder="请输入塌陷名称"
              defaultValue={this.state.title}
              onChange={this.titleChange}
            />
          </div>
          <div className={css["flex-center-left"]}>
            <label className={css["flex-none-label"]}>塌陷高度</label>
            <Slider
              className={css["flex-auto"]}
              min={-20}
              max={100}
              value={
                typeof this.state.height === "number" ? this.state.height : 0
              }
              onChange={this.heightChange}
            />
            <InputNumber
              min={-20}
              max={100}
              style={{ marginLeft: 16, width: 60 }}
              size="small"
              value={
                typeof this.state.height === "number" ? this.state.height : 0
              }
              onChange={this.heightChange}
            />
          </div>
          <div className={css["flex-center-between"]}>
            <label className={css["flex-none-label"]}>出现在分享界面</label>
            <Switch
              checkedChildren="开"
              unCheckedChildren="关"
              checked={this.state.whethshare}
              onChange={this.whethshareChange}
            />
          </div>
        </div>
      </VrpModal>
    );
  }
}

export default PushModal;
