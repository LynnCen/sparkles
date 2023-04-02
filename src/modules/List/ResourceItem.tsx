import { Component } from "react";
import { Checkbox, Popconfirm, Popover, message } from "antd";
import VrpIcon from "../../components/VrpIcon";
import Config from "../../config/Config";
import DataService from "../../services/DataService";

const css = require("../../styles/custom.css");

/**
 * @name ResourceItem
 * @create: 2019/1/4
 * @description:
 */

interface ResourceItemProps {
  data: any;
  onUpdate: (data) => void;
  onDelete: (item) => void;
  checkedIds: any;
  checkboxChange: (e, id) => void;
  type: string;
}

interface ResourceItemStates {
  visible?: boolean;
}

class ResourceItem extends Component<ResourceItemProps, ResourceItemStates> {
  constructor(props: ResourceItemProps) {
    super(props);
    this.state = {
      visible: props.data.visible
    };
  }

  componentWillReceiveProps(val) {
    let feature: any = {};
    switch (this.props.type) {
      case "area":
        feature = val.data.polygon;
        break;
      case "line":
        feature = val.data.line;
        break;
      case "push":
        feature = val.data.polygon;
        break;
      case "balloon":
        feature = val.data.point;
        break;
      case "build":
        feature = val.data.point;
        break;
      // case "water":
      //   feature = val.data.point;//todo
      //   break;
    }
    this.setState({ visible: feature ? feature.isVisible() : true });
  }

  titleClick = () => {
    const { data } = this.props;
    data.focus();
  };

  isShow = () => {
    const { data } = this.props;
    const { visible } = this.state;
    if (data.type == "balloon") {
      this.setState({ visible: !data.visible });
      data.setVisible(!data.visible);
      const _data = {
        id: data.id,
        title: data.title,
        fontSize: data.fontSize,
        contentId: data.contentId.toString(),
        whethshare: data.whethshare,
        balloonVisible: data.titleVisible,
        color: data.fontColor,
        imageUrl: data.icon,
        altitude: data.height,
        pointVisible: data.iconVisible,
        visible: data.visible
      };
      if (typeof data.subMenuId == "number") _data.subMenuId = data.subMenuId;
      DataService.modData(_data, (f, res) => !f && message.error(res.message));
    } else {
      this.setState({ visible: !visible });
      data.setVisible(!visible);
    }
  };

  rightIcons = item => {
    return (
      <div className={css["item-icons"]}>
        <VrpIcon
          iconName={this.state.visible ? "icon-visible" : "icon-invisible"}
          title={"可见"}
          onClick={this.isShow}
        />
        <VrpIcon
          iconName={"icon-edit"}
          title={"编辑"}
          onClick={() => this.props.onUpdate(item)}
        />
        <Popconfirm
          title={"确定要删除吗？"}
          okText={"确定"}
          cancelText={"取消"}
          onConfirm={() => this.props.onDelete(item)}
        >
          <span>
            <VrpIcon iconName={"icon-delete"} title={"删除"} />
          </span>
        </Popconfirm>
      </div>
    );
  };

  /**
   * @description 获取标签图标、模型缩略图
   * @returns {string}
   */
  getResourceImg = () => {
    const { data } = this.props;
    if (data.type === "build") {
      return Config.apiHost + data.imageUrl.replace("upload", "res/image");
    } else {
      return Config.apiHost + data.icon;
    }
  };

  render() {
    const { data, type } = this.props;
    return (
      <li className={css["vrp-list-item"]}>
        <div className={css["after-content"]}>
          <Checkbox
            checked={this.props.checkedIds[data.id]}
            onChange={e => this.props.checkboxChange(e, data.id)}
          />
          {type === "build" || type === "balloon" ? (
            <Popover
              content={
                <img src={this.getResourceImg()} style={{ width: 80 }} />
              }
            >
              <img
                src={this.getResourceImg()}
                style={{
                  width: type === "balloon" ? 20 : 30,
                  marginLeft: 8
                }}
              />
            </Popover>
          ) : null}
          <div
            className={css["title"] + " " + css["m-l-sm"]}
            onClick={() => this.titleClick()}
          >
            {data.title}
          </div>
        </div>
        {this.rightIcons(data)}
      </li>
    );
  }
}

export default ResourceItem;
