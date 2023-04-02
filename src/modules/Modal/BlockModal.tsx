import { Component } from "react";
import {
  Button,
  Input,
  Slider,
  InputNumber,
  message,
  Popconfirm,
  Switch,
  Radio,
  Select
} from "antd";
import VrpModal from "../../components/VrpModal";
import Config from "../../config/Config";
import Data from "../../services/DataService";
import Resource from "../Menu/Resource";
import CustomFun from "../../config/CustomFun";
import DataService from "../../services/DataService";
import ColorPicker from "../../components/ColorPicker";
import Geometry from "../../components/model/Geometry";
import { debounce } from "../../utils/common";

const css = require("../../styles/custom.css");

/**
 * @name OpenLineModal
 * @description 线条属性框
 */
interface BlockModalProps {
  geometry: Geometry;
  closeModal: () => void;
  isSave: boolean;
}

interface BlockModalStates {
  color: string;
  height: number;
  altitude: number;
  opacity: number;
  vertices: any;
  title: string;
  planId: number;
  username: string;
  position: string;
  type: string;
  level: boolean;
  polygonStyle: string;
  whethshare: boolean;
  contents: any[];
  contentId: number[];
}

function formatter(value) {
  return `${value}%`;
}

function replace(value) {
  return Number(value.replace("%", ""));
}

class BlockModal extends Component<BlockModalProps, BlockModalStates> {
  constructor(props: BlockModalProps) {
    super(props);
    this.state = {
      color: "7ED321",
      height: 30,
      altitude: 0,
      opacity: 0.8,
      vertices: [],
      title: "新体块" + Math.round(Math.random() * 100),
      planId: 0,
      username: "",
      position: "",
      type: "area",
      level: false,
      polygonStyle: "ExtrudeStyle",
      whethshare: false,
      contents: [],
      contentId: []
    };
  }

  componentWillMount() {
    this.setBlockForm(this.props.geometry);
    window.addEventListener("keydown", this.handleOnKeyDown);
  }

  componentWillReceiveProps(nextProps) {
    this.setBlockForm(nextProps.geometry);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleOnKeyDown);
  }
  /**
   * @description 顶部是否强制水平
   * @param e
   */
  levelChange = checked => {
    const { geometry } = this.props;
    geometry.setAltitude(this.state.altitude, checked);
    this.setState({ level: checked });
  };
  /**
   * 体块模式
   */
  polygonStyleChange = e => {
    const { color, height, altitude, opacity } = this.state;
    this.setState({ polygonStyle: e.target.value });
    this.props.geometry.setStyle(
      e.target.value,
      color + Math.round(opacity * 2.55).toString(16),
      height
    );
    this.props.geometry.balloon.setOffsetY(
      e.target.value == "ExtrudeStyle" ? height : -altitude
    );
  };

  /**
   * @description 抬升高度
   * @param value
   */
  altitudeChange = value => {
    this.setState({ altitude: value }, () => {
      const { geometry } = this.props;
      geometry.setAltitude(value, this.state.level);
    });
  };

  /**
   * @description 设置体块高度
   * @param value
   */
  heightChange = value => {
    this.setState({ height: value }, () => {
      this.props.geometry.setHeight(Number(value));
    });
  };

  /**
   * @description 删除体块
   */
  delBlock = () => {
    const { geometry } = this.props;
    if (geometry.id) {
      const data = {
        id: geometry.id,
        planId: Config.PLANID,
        username: Config.USERNAME
      };
      DataService.delData(data, (flag, res) => {
        if (flag) {
          message.success(res.message);
          this.props.closeModal();
          geometry.remove();
        } else {
          message.error(res.message);
        }
      });
    } else {
      geometry.remove();
    }
  };

  /**
   * @description 保存体块属性
   */
  saveBlock = () => {
    const { geometry } = this.props;
    const {
      position,
      title,
      altitude,
      height,
      color,
      opacity,
      level,
      whethshare,
      polygonStyle,
      contentId
    } = this.state;
    geometry.isNew = false;
    geometry.title = title;
    geometry.altitude = altitude;
    geometry.height = height;
    geometry.color = color + Math.round(opacity * 2.55).toString(16);
    geometry.level = level;
    geometry.whethshare = whethshare;
    geometry.polygonStyle = polygonStyle;
    geometry.contentId = contentId;
    const data = {
      color: geometry.color,
      height,
      altitude,
      title,
      planId: Config.PLANID,
      username: Config.USERNAME,
      position,
      level,
      type: "area",
      whethshare,
      polygonStyle,
      contentId: contentId.toString()
    };
    if (this.props.isSave) {
      if (!geometry.id) {
        Data.addData(data, (flag, res) => {
          if (flag) {
            message.success("保存成功");
            geometry.id = res.data;
            Geometry.set(geometry);
          } else message.error(res.message);
        });
      } else {
        Object.assign(data, { id: geometry.id });
        Data.modData(data, (flag, res) => {
          message[`${flag ? "success" : "error"}`](res.message);
        });
      }
    }
    Resource.ReloadList && Resource.ReloadList();
    this.props.closeModal();
  };

  /**
   * @description 设置体块标题
   * @param e
   */
  titleChange = e => {
    const title = e.target.value;
    this.setState({ title });
    this.props.geometry.balloon.setTitle({ title });
  };

  /**
   * @description 设置体块颜色
   * @param value
   */
  colorChange = value => {
    this.setState({ color: value }, () => {
      this.props.geometry.setColor(
        value.toString() + Math.round(this.state.opacity * 2.55).toString(16)
      );
    });
  };

  opacityChange = value => {
    this.setState({ opacity: value }, () => {
      this.props.geometry.setColor(
        this.state.color + Math.floor(value * 2.55).toString(16)
      );
    });
  };

  whethshareChange = (value: boolean) => {
    this.setState({ whethshare: value });
  };

  searchContents = key => {
    console.log(key);
    key &&
      DataService.getContents({ planId: Config.PLANID, key }, (f, res) => {
        if (f) {
          this.setState({ contents: res.data });
        } else message.error(res.message);
      });
  };
  contentChange = (value, options) => {
    console.log(value);
    if (value) {
      this.setState({ contentId: value });
      this.props.geometry.contentId = value;
    }
  };

  setBlockForm = geometry => {
    if (geometry) {
      const opacity =
        geometry.color.length > 6
          ? Math.floor((parseInt(geometry.color.slice(-2), 16) / 255) * 100)
          : 100;
      const { vertices } = geometry;
      const position: any = [];
      vertices.forEach(pos => {
        position.push([
          pos.x().toFixed(2),
          pos.y().toFixed(2),
          pos.z().toFixed(2)
        ]);
      });
      this.setState({
        title: geometry.title,
        height: geometry.height || 30,
        altitude: geometry.altitude || 0,
        color: geometry.color.replace("#", "").slice(0, 6),
        opacity: Number(opacity),
        planId: Config.PLANID,
        username: Config.USERNAME,
        position: JSON.stringify(position),
        vertices,
        level: geometry.level,
        whethshare: geometry.whethshare,
        polygonStyle: geometry.polygonStyle,
        contentId: geometry.contentId
      });
      DataService.getContents(
        { planId: Config.PLANID },
        (f, res) => f && this.setState({ contents: res.data })
      );
    }
  };

  handleOnKeyDown = e => {
    CustomFun.onKeyDown(e, 13, this.saveBlock);
    CustomFun.onKeyDown(e, 27, this.props.closeModal);
  };

  render() {
    const btnGroup = (
      <div className={css["text-center"]}>
        <Button type="primary" onClick={this.saveBlock}>
          保存
        </Button>
        <Popconfirm
          title={"确定要删除吗？"}
          okText={"确定"}
          cancelText={"取消"}
          onConfirm={this.delBlock}
        >
          {this.props.geometry.id ? (
            <Button type="primary" ghost className={css["m-l-md"]}>
              删除
            </Button>
          ) : null}
        </Popconfirm>
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
        fixed={true}
        onClose={this.props.closeModal}
      >
        <div className={css["vrp-form"]}>
          <div className={css["flex-center-left"]}>
            <label className={css["flex-none-label"]}>标题</label>
            <Input
              placeholder="请输入体块名称"
              defaultValue={this.state.title}
              value={this.state.title}
              onChange={this.titleChange}
            />
          </div>
          <div className={css["flex-center-between"]}>
            <div className={css["flex-center-left"]}>
              <label className={css["flex-none-label"]}>体块水平</label>
              <Switch
                checkedChildren="开"
                unCheckedChildren="关"
                defaultChecked={this.state.level}
                onChange={this.levelChange}
                disabled={this.state.polygonStyle === "ProjectedFeatureStyle"}
              />
            </div>
            <div className={css["flex-center-left"]}>
              <label className={css["flex-none-label"]}>分享界面</label>
              <Switch
                checkedChildren="开"
                unCheckedChildren="关"
                checked={this.state.whethshare}
                onChange={this.whethshareChange}
              />
            </div>
          </div>
          <div className={css["flex-center-left"]}>
            <label className={css["flex-none-label"]}>体块模式</label>
            <Radio.Group
              value={this.state.polygonStyle}
              onChange={this.polygonStyleChange}
            >
              <Radio.Button value="ExtrudeStyle">拉伸</Radio.Button>
              <Radio.Button value="ProjectedFeatureStyle">投影</Radio.Button>
            </Radio.Group>
          </div>
          <div className={css["flex-center-left"]}>
            <label className={css["flex-none-label"]}>高度</label>
            <Slider
              className={css["flex-auto"]}
              min={0.1}
              max={200}
              step={0.1}
              value={
                typeof this.state.height === "number" ? this.state.height : 0
              }
              onChange={this.heightChange}
              disabled={this.state.polygonStyle === "ProjectedFeatureStyle"}
            />
            <InputNumber
              min={0.1}
              max={200}
              step={0.1}
              style={{ marginLeft: 16, width: 60 }}
              size="small"
              value={
                typeof this.state.height === "number" ? this.state.height : 0
              }
              onChange={this.heightChange}
              disabled={this.state.polygonStyle === "ProjectedFeatureStyle"}
            />
          </div>
          <div className={css["flex-center-left"]}>
            <label className={css["flex-none-label"]}>抬升高度</label>
            <Slider
              className={css["flex-auto"]}
              min={-100}
              max={100}
              value={
                typeof this.state.altitude === "number"
                  ? this.state.altitude
                  : 0
              }
              onChange={this.altitudeChange}
              disabled={this.state.polygonStyle === "ProjectedFeatureStyle"}
            />
            <InputNumber
              min={-100}
              max={100}
              style={{ marginLeft: 16, width: 60 }}
              size="small"
              value={
                typeof this.state.altitude === "number"
                  ? this.state.altitude
                  : 0
              }
              onChange={this.altitudeChange}
              disabled={this.state.polygonStyle === "ProjectedFeatureStyle"}
            />
          </div>
          <div className={css["flex-center-left"]}>
            <label className={css["flex-none-label"]}>透明度</label>
            <Slider
              className={css["flex-auto"]}
              min={7}
              max={100}
              step={1}
              value={
                typeof this.state.opacity === "number" ? this.state.opacity : 0
              }
              onChange={this.opacityChange}
              tipFormatter={formatter}
            />
            <InputNumber
              min={7}
              max={100}
              style={{ marginLeft: 16, width: 60 }}
              size="small"
              formatter={formatter}
              value={
                typeof this.state.opacity === "number" ? this.state.opacity : 0
              }
              parser={replace}
              onChange={this.opacityChange}
            />
          </div>

          <div className={css["flex-center-left"]}>
            <label className={css["flex-none-label"]}>体块颜色</label>
            <ColorPicker
              currentColor={this.state.color}
              colorChange={this.colorChange}
            />
          </div>

          <div className={css["flex-center-left"]}>
            <label className={css["flex-none-label"]}>信息栏</label>
            <Select
              allowClear
              showSearch
              value={this.state.contentId}
              placeholder={"搜索信息模板"}
              filterOption={false}
              style={{ width: "100%" }}
              onSearch={debounce(this.searchContents, 500)}
              onChange={this.contentChange}
              mode="multiple"
              notFoundContent={null}
              getPopupContainer={triggerNode => triggerNode}
              // optionFilterProp={"children"}
            >
              {this.state.contents.map(e => (
                <Select.Option key={e.id} value={e.id}>
                  <div
                    className={
                      css["select-item-tip"] + " " + css["flex-center-between"]
                    }
                  >
                    {e.title}
                    <span>填充</span>
                  </div>
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>
      </VrpModal>
    );
  }
}

export default BlockModal;
