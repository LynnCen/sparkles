import { Component } from "react";
import {
  Button,
  Input,
  Switch,
  message,
  Pagination,
  InputNumber,
  Cascader,
  Icon,
  Collapse,
  Popconfirm,
  Select,
  Popover
} from "antd";
import VrpModal from "../../components/VrpModal";
import Data, { default as DataService } from "../../services/DataService";
import StrConfig from "../../config/StrConfig";
import Config from "../../config/Config";
import CustomFun from "../../config/CustomFun";
import { UpdateBalloon } from "../../models/DataModel";
import PanelBase from "./PanelBase";
import { connect } from "dva";
import { Panel } from "../../stores/markerModel";
import { Dispatch } from "redux";
import Mark from "../../components/model/Mark";
import VrpIcon from "../../components/VrpIcon";
import ColorPicker from "../../components/ColorPicker";
import { debounce, loadScript } from "../../utils/common";
import ShareService from "../../services/ShareService";
import TransCoordinate from "../../components/tools/Coordinate";
import ShowData from "../../components/tools/showData";
const { maps, vrPlanner } = Config;
const Panel = Collapse.Panel;
const Option = Select.Option;
const css = require("../../styles/custom.css");
const scss = require("../../styles/scss/markerModal.scss");

/**
 * @name MarkerModal
 * @create: 2018/12/30
 * @description: 功能描述
 */

export const getFeature = data => {
  const layer = Config.maps.getLayerById("balloonLayer");
  if (layer !== null) {
    const featureList = layer.getFeatureList();
    return featureList.find(item => item.id === data.id);
  }
};

export interface IconListModel {
  id: number;
  iconClassId: number;
  className: string;
  name: string;
  url: string;
  fileName: string;
}

export interface ClassModel {
  id: number;
  name: string;
  type: number; // 1 系统 2 自定义
}

export const warnHandler = (_this: Component, msg: string | boolean = StrConfig.unsavedWarnMsg) => {
  console.assert(_this instanceof Component, "`_this` must be an instance of `Component`");
  _this.setState({ warn: true });
  setTimeout(() => _this.setState({ warn: false }), 500);
  msg && message.warn(msg);
};

const sameKeys = [
  "title",
  "fontFamily",
  "fontSize",
  "fontItalic",
  "whethshare",
  "contentId",
  "subMenuId"
];

interface MarkerModalProps {
  mark: Mark;
  closeModal: () => void;
  updateSuccess?: () => void;
  clientWidth: number;
  planDataId?: number | null;
  panels: Panel[];
  backups: Panel[];
  dispatch: Dispatch<Object>;
}

interface MarkerModalStates {
  lon: number;
  lat: number;
  updateData: UpdateBalloon;
  // mark: Mark;
  classList: any;
  loading: boolean;
  iconList: IconListModel[];
  page: number;
  total: number;
  classType: number;
  classId: any;
  panelKey: string;
  contents: Panel[]; // 信息栏
  subMenus: object[]; //分享二级菜单
  append: boolean;
  warn: boolean;
  fonts: string[];
}
@connect(({ markerModel }) => ({
  planDataId: markerModel.planDataId,
  panels: markerModel.panels,
  backups: markerModel.backups
}))
class MarkerModal extends Component<MarkerModalProps, MarkerModalStates> {
  size = 16;
  keyword = "";

  constructor(props: MarkerModalProps) {
    super(props);
    this.state = {
      lon: 0,
      lat: 0,
      updateData: {
        cameraPosition: [],
        cameraLook: [],
        title: "",
        id: 0,
        color: "",
        balloonVisible: true,
        pointVisible: true,
        imageUrl: "",
        altitude: 0,
        fontSize: 16,
        contentId: [],
        whethshare: false,
        iconType: "1"
      },
      classList: [
        {
          value: 1,
          label: "标签图标",
          children: []
        },
        {
          value: 3,
          label: "动态图标",
          children: []
        }
      ],
      loading: false,
      iconList: [],
      page: 1,
      total: 0,
      classType: 1,
      classId: undefined,
      panelKey: "",
      contents: [],
      subMenus: [],
      append: false,
      warn: false,
      fonts: []
    };
  }

  componentDidMount() {
    const { mark, dispatch } = this.props;
    this.setData(mark);
    this.handleDrag();
    dispatch({
      type: "markerModel/getPlanDataTabs",
      payload: { planDataId: this.props.mark.id }
    });
    DataService.getContents(
      { planId: Config.PLANID },
      (f, res) => f && this.setState({ contents: res.data })
    );
    ShareService.getSubMenu(
      { planId: Config.PLANID },
      (f, res) => f && this.setState({ subMenus: res.data })
    );
    loadScript(`${process.env.publicPath}js/constants.js`, "constants", "module").then(r =>
      this.setState({ fonts: r.fontFamily || [] })
    );
    this.getAllClass();
    this.getIconList(this.state.page, this.state.classType);
    window.addEventListener("keydown", this.handleOnKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleOnKeyDown);
  }

  handleOnKeyDown = e => {
    CustomFun.onKeyDown(e, 13, this.submit);
    CustomFun.onKeyDown(e, 27, this.props.closeModal);
  };

  handleDrag = () => {
    const { mark } = this.props;
    // const layer = maps.getLayerById("balloonLayer");
    maps.bindEvent("click", e => {
      if (e.isLeftClick()) {
        const geo = e.getGeoLocation();
        mark.setGeoLocation(geo);
        const wgs84 = TransCoordinate.MercatorToWGS84(geo);
        this.setState({
          lon: wgs84.lon,
          lat: wgs84.lat
        });
      }
    });
    // layer.bindEvent("mouseDown", () => {
    //   maps.getCamera().setLocked(true);
    // });

    // layer.bindEvent("mouseUp", () => {
    //   maps.getCamera().setLocked(false);
    // });
    // layer.bindEvent("mouseDrag", () => {
    //   console.log("Drag");
    // });
  };

  setIcon = () => {
    let { updateData } = this.state;
    const {
      color: fontColor,
      title,
      fontFamily,
      fontSize,
      fontItalic,
      imageUrl: icon,
      balloonVisible: titleVisible,
      pointVisible: iconVisible
    } = updateData;
    this.props.mark.setIcon({
      title,
      fontFamily,
      fontSize,
      fontItalic,
      fontColor,
      icon,
      titleVisible,
      iconVisible
    });
  };

  positionChange = (key = "lon", val: number) => {
    const { mark } = this.props;
    if (this.state[key] != val) {
      this.setState({ [key]: val }, () => {
        const { lon: x, lat: y } = this.state;
        mark.setGeoLocation(TransCoordinate.WGS84ToMercator({ x, y, z: mark.geo.z() }));
        mark.focus(true);
      });
    }
  };

  flyToView = () => {
    const {
      updateData: { cameraPosition: p, cameraLook: l }
    } = this.state;
    if (p.length && l.length) maps.getCamera().flyTo(ShowData.getGeo(p), ShowData.getGeo(l));
    else this.props.mark.focus();
  };

  viewChange = (clear = false) => {
    const cam = self["maps"].getCamera();
    const lookAt = cam.getLookAt();
    const position = cam.getPosition();
    const { updateData } = this.state;
    this.setState({
      updateData: {
        ...updateData,
        cameraPosition: clear ? [] : [position.x(), position.y(), position.z()],
        cameraLook: clear ? [] : [lookAt.x(), lookAt.y(), lookAt.z()]
      }
    });
  };

  titleChange = e => {
    const title = e.target.value;
    let { updateData } = this.state;
    updateData.title = title;
    this.setState({ updateData }, this.setIcon);
  };

  titleVisibleChange = (value: boolean) => {
    const { updateData } = this.state;
    updateData.balloonVisible = value;
    this.setState({ updateData }, () => {
      // mark.setTitleVisible(value);
      this.setIcon();
      // mark.getBalloon().setVisible(value);
      this.lineChange();
    });
  };

  fontChange = (prop, value) => {
    const { updateData } = this.state;
    updateData["font" + prop.slice(0, 1).toUpperCase() + prop.slice(1)] = value;
    this.setState({ updateData }, this.setIcon);
  };

  colorChange = color => {
    const { updateData } = this.state;
    if (this.props.mark) {
      updateData.color = color;
      this.setState({ updateData }, this.setIcon);
    }
  };
  /**
   * @description 选择标签图标
   */
  checkIcon = (icon, type) => {
    const { updateData } = this.state;
    updateData.imageUrl = icon;
    updateData.iconType = type;
    this.setIcon();
    this.setState({ updateData });
  };

  /**
   * @description 离地高度
   * @param value
   */
  heightChange = value => {
    const { updateData } = this.state;
    updateData.altitude = value;
    this.props.mark.setHeight(Number(value));
    this.setState({ updateData });
  };

  pointVisibleChange = (value: boolean) => {
    const { updateData } = this.state;
    updateData.pointVisible = value;
    this.setState({ updateData }, () => {
      this.setIcon();
      this.lineChange();
    });
  };

  lineChange = () => {
    this.props.mark.setLineVisible(
      this.state.updateData.pointVisible || this.state.updateData.balloonVisible
    );
  };

  whethshareChange = (value: boolean) => {
    const { updateData } = this.state;
    updateData.whethshare = value;
    this.setState({ updateData });
  };

  submit = (close?: boolean) => {
    const { updateSuccess, closeModal, mark, panels, dispatch } = this.props;
    const { updateData } = this.state;
    const { cameraPosition, cameraLook } = updateData;
    if (panels.length > 1 && panels.some(e => e.type == "")) {
      warnHandler(this, "面板类型不能为空哦😅~");
      return;
    }
    const geo = mark.point.getGeoLocation();
    const update = {
      position: `[${geo.x()},${geo.y()},${geo.z() - updateData.altitude}]`,
      ...updateData,
      cameraPosition: JSON.stringify(cameraPosition),
      cameraLook: JSON.stringify(cameraLook),
      contentId: updateData.contentId.toString(),
      tabs: JSON.stringify(panels)
    };
    Object.keys(update).forEach(k => update[k] == undefined && delete update[k]);
    Data.modData(update, (flag, res) => {
      if (flag) {
        const { mark } = this.props;
        mark.geo.setX(geo.x());
        mark.geo.setY(geo.y());
        mark.geo.setZ(geo.z() - update.altitude);
        mark.cameraPosition = ShowData.getGeo(cameraPosition);
        mark.cameraLook = ShowData.getGeo(cameraLook);
        sameKeys.forEach(k => (mark[k] = updateData[k]));
        mark.icon = update.imageUrl;
        mark.fontColor = update.color;
        mark.iconVisible = update.pointVisible;
        mark.titleVisible = update.balloonVisible;
        mark.height = update.altitude;
        if (close != false && updateSuccess) {
          updateSuccess();
        }
        if (close != false) {
          message.success("保存成功");
          closeModal();
        }
        dispatch({ type: "markerModel/setProp", payload: { backups: panels } });
      } else {
        message.error(res.message);
      }
    });
  };

  setData = (mark: Mark) => {
    const { updateData } = this.state;
    const { lon, lat } = TransCoordinate.MercatorToWGS84(mark.geo);
    ["id", ...sameKeys].forEach(k => (updateData[k] = mark[k]));
    const { cameraPosition: pos, cameraLook: look } = mark;
    pos && (updateData.cameraPosition = [pos.x(), pos.y(), pos.z()]);
    look && (updateData.cameraLook = [look.x(), look.y(), look.z()]);
    updateData.balloonVisible = mark.titleVisible;
    updateData.color = mark.fontColor;
    updateData.imageUrl = mark.icon;
    updateData.altitude = mark.height;
    updateData.pointVisible = mark.iconVisible;
    this.setState({ updateData, lon, lat });
  };

  getOptions = (index, list) => {
    const childrens: any[] = [];
    for (const item of list) {
      const classObj = {};
      classObj["value"] = item.id;
      classObj["label"] = item.name;
      classObj["type"] = item.type;
      childrens.push(classObj);
    }
    this.state.classList[index].children = childrens;
    this.setState({ classList: this.state.classList });
  };

  /**
   * @description 获取分类列表
   */
  getAllClass = () => {
    const typeList = [1, 3];
    for (const key of typeList) {
      const data = { type: key };
      DataService.getAllClass(data, (flag, res) => {
        if (flag) {
          this.getOptions(data.type === 1 ? 0 : 1, res.data);
        } else {
          message.error(res.message);
        }
      });
    }
  };

  /**
   * @description 选中类别变化重新获取列表
   */
  classChange = (value, selectedOptions) => {
    if (value.length === 0) {
      this.getIconList(1, 1);
    } else {
      this.getIconList(1, selectedOptions[1].type, value[1]);
    }
  };

  paginationChange = page => {
    this.getIconList(page, this.state.classType);
  };

  /**
   * @description 获取图标列表
   * @param page
   * @param type
   * @param classId
   */
  getIconList = (page, type, classId?) => {
    this.setState({
      loading: true
    });
    const base = {
      page,
      type,
      size: this.size,
      key: this.keyword
    };
    const data = classId ? { ...base, classId } : base;
    DataService.findIcon(data, (flag, res) => {
      if (flag) {
        this.setState({
          iconList: res.data.list,
          loading: false,
          page,
          classId: classId ? classId : undefined,
          total: res.data.count,
          classType: type
        });
      } else {
        message.error(res.message);
      }
    });
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
      this.setState({
        updateData: { ...this.state.updateData, contentId: value }
      });
    }
  };
  searchSubMenu = key => {
    console.log(key);
    key &&
      ShareService.getSubMenu({ planId: Config.PLANID, key }, (f, res) => {
        if (f) {
          this.setState({ subMenus: res.data });
        } else message.error(res.message);
      });
  };
  subMenuChange = (value, options) => {
    this.setState({
      updateData: { ...this.state.updateData, subMenuId: value }
    });
  };
  // handleEditorFocus = () => {
  //   window.removeEventListener("keydown", this.handleOnKeyDown);
  // };
  // handleEditorBlur = () => {
  //   window.addEventListener("keydown", this.handleOnKeyDown);
  // };

  render() {
    const { panels, dispatch, mark } = this.props;
    const {
      lon,
      lat,
      updateData,
      classList,
      iconList,
      total,
      page,
      panelKey,
      contents,
      subMenus,
      append,
      warn,
      fonts
    } = this.state;
    const imgUrl = Config.apiHost + updateData.imageUrl;
    const btnGroup = (
      <div className={css["text-center"]}>
        <Button type="primary" onClick={this.submit}>
          保存
        </Button>
        <Button className={css["m-l-md"]} onClick={() => this.props.closeModal()}>
          关闭
        </Button>
      </div>
    );

    return (
      <VrpModal
        className={scss["marker-modal"]}
        defaultPosition={{ x: 30, y: 95 }}
        title={"标签属性"}
        style={{ width: 514 }}
        // height={629}
        footer={btnGroup}
        fixed={true}
        // baseBoxStyle={{ top: top, left: this.props.clientWidth }}
        onClose={() => this.props.closeModal()}
      >
        <div className={css["vrp-form"]}>
          <div style={{ marginBottom: 14 }} className={css["flex"]}>
            <label className={css["flex-none-label"]}>经度</label>
            <InputNumber
              min={-180}
              max={180}
              step={0.00001}
              value={lon}
              formatter={(v: number | string) => Number(v).toFixed(5)}
              className={css["m-r-md"] + " flex-auto"}
              title={"经度"}
              placeholder={"经度"}
              onChange={v => this.positionChange("lon", v)}
            />
            <label className={css["flex-none-label"]}>纬度</label>
            <InputNumber
              min={-90}
              max={90}
              step={0.00001}
              value={lat}
              formatter={(v: number | string) => Number(v).toFixed(5)}
              className={css["m-r-md"] + " flex-auto"}
              title={"纬度"}
              placeholder={"纬度"}
              onChange={v => this.positionChange("lat", v)}
            />
            <label
              className={css["flex-none-label"]}
              title="重置"
              onClick={e => (mark.focus(true), this.viewChange(true))}
            >
              视角
            </label>
            <VrpIcon
              iconName={"icon-position"}
              title={"定位"}
              className={css["m-r-sm"]}
              onClick={this.flyToView}
            />
            <VrpIcon
              iconName={"icon-angle-of-view"}
              title="更新视角"
              style={{
                color:
                  updateData.cameraPosition.length &&
                  (!mark.cameraPosition ||
                    updateData.cameraPosition.some(
                      e => !mark.cameraPosition.toString().includes(e)
                    ))
                    ? "#1890ff"
                    : "inherit"
              }}
              onClick={e => this.viewChange()}
            />
          </div>
          <div className={css["flex-center-left"]}>
            <label className={css["flex-none-label"]}>标签名称</label>
            <Input className={css["m-r-md"]} value={updateData.title} onChange={this.titleChange} />

            <Popover
              placement="bottomRight"
              getPopupContainer={triggerNode => triggerNode}
              content={
                <div onClick={e => e.stopPropagation()}>
                  <div className={css["flex-center-left"]} style={{ marginBottom: 12 }}>
                    <label className={css["flex-none-label"]}>字体</label>
                    <Select
                      value={updateData.fontFamily}
                      size={"small"}
                      style={{
                        width: fonts.length
                          ? Math.ceil(Math.max(...fonts.map(s => s.length), 8) / 2) + 2.5 + "em"
                          : "auto"
                      }}
                      onChange={v => this.fontChange("family", v)}
                      placeholder="字体"
                      disabled={!updateData.balloonVisible}
                      className={css["m-r-md"]}
                    >
                      {fonts.map((e, i) => (
                        <Option value={e} key={i}>
                          {e}
                        </Option>
                      ))}
                    </Select>
                    <Button
                      style={{
                        padding: "0 3px",
                        height: "auto",
                        borderColor: updateData.fontItalic ? "#1890ff" : "#d9d9d9"
                      }}
                      onClick={e => {
                        this.fontChange("italic", !updateData.fontItalic);
                      }}
                    >
                      <VrpIcon
                        iconName="icon-italic"
                        title={"斜体"}
                        className="pointer"
                        style={{
                          fontSize: "1em",
                          color: updateData.fontItalic ? "#1890ff" : "#d9d9d9"
                        }}
                      />
                    </Button>
                  </div>
                  <div className={css["flex-center-left"]} style={{ marginBottom: 12 }}>
                    <label className={css["flex-none-label"]}>字号</label>
                    <Select
                      value={updateData.fontSize}
                      // style={{ width: 60 }}
                      size={"small"}
                      onChange={v => this.fontChange("size", v)}
                      placeholder="字号"
                      disabled={!updateData.balloonVisible}
                      className={css["m-r-md"]}
                    >
                      {new Array(20).fill(12).map((e, i) => {
                        return (
                          <Option value={e + i * 2} key={i}>
                            {e + i * 2}
                          </Option>
                        );
                      })}
                    </Select>
                  </div>
                  <div className={css["flex-center-left"]} style={{ margin: "0 12px 0 0" }}>
                    <label className={css["flex-none-label"]}>颜色</label>
                    <ColorPicker currentColor={updateData.color} colorChange={this.colorChange} />
                  </div>
                </div>
              }
              trigger="hover"
            >
              <Button style={{ padding: "0 5px" }} className={css["m-r-md"]}>
                <VrpIcon
                  iconName={"icon-font-edit"}
                  title={"字体"}
                  style={{ fontSize: "21px", color: "#000" }}
                />
              </Button>
            </Popover>
            <Switch
              checkedChildren="开"
              unCheckedChildren="关"
              checked={updateData.balloonVisible}
              onChange={this.titleVisibleChange}
            />
          </div>
          {/* <div className={css["flex-center-left"]}>
            <label className={css["flex-none-label"]}>文字颜色</label>
            <ul className={css["vrp-color-select"]}>
              {StrConfig.BalloonColorSelect.map((item, index) => {
                return (
                  <li
                    key={index}
                    style={{ backgroundColor: item.color }}
                    className={
                      css["color-circle"] +
                      ` ${item.className} ` +
                      (updateData.color === item.color ? css["active"] : "")
                    }
                    onClick={() => this.colorChange(item.color)}
                  />
                );
              })}
            </ul>
          </div> */}
          <div className={css["flex-center-left"]}>
            <label className={css["flex-none-label"]}>标签图标</label>

            <Cascader
              options={classList}
              expandTrigger="hover"
              onChange={this.classChange}
              placeholder="选择图标"
              className={css["flex-auto"]}
            />
            <InputNumber
              min={0}
              max={500}
              value={updateData.altitude}
              className={css["m-r-md"]}
              style={{ width: 70, marginLeft: "1rem" }}
              title={"离地高度"}
              placeholder={"离地高度"}
              onChange={this.heightChange}
            />
            <span className={css["m-r-md"]}>
              <img src={imgUrl} style={{ height: 30, padding: "0 2px" }} />
            </span>
            <Switch
              checkedChildren="开"
              unCheckedChildren="关"
              checked={updateData.pointVisible}
              onChange={this.pointVisibleChange}
            />
          </div>
          <div
            className={css["vrp-icon-list"]}
            style={{
              minHeight: iconList.length
                ? `${((482 - 12 * 2 - 15 * (this.size / 2 - 1)) / (this.size / 2.0)) * 2 +
                    12 * 2 +
                    15}px`
                : "unset",
              height: "auto",
              padding: "12px 12px",
              gridGap: "15px 15px",
              display: "grid",
              gridTemplateColumns: iconList.length
                ? `repeat(auto-fill, ${(482 - 12 * 2 - 15 * (this.size / 2 - 1)) /
                    (this.size / 2.0)}px)`
                : "unset",
              gridTemplateRows: iconList.length ? "1fr 1fr" : "unset",
              boxShadow: "0 0 0px 1px #eee"
            }}
          >
            {iconList.length > 0 ? (
              iconList.map((item, i) => {
                return (
                  <div
                    className={css["vrp-thumb"] + " "}
                    key={i}
                    style={{
                      margin: 0,
                      width: "unset",
                      height: "unset",
                      backgroundImage: `url(${Config.apiHost + item.url})`,
                      backgroundSize: "inherit"
                    }}
                    title={item.name}
                    onClick={() => this.checkIcon(item.url, item.type)}
                  >
                    {/* <img
                        src={Config.apiHost + item.url}
                        style={{ width: "38px", height: "auto" }}
                      /> */}
                  </div>
                );
              })
            ) : (
              <div className={css["icon-none"]}>该分类暂无图标</div>
            )}
          </div>
          <div className={css["text-center"] + " " + css["m-y-sm"]}>
            <Pagination
              defaultCurrent={1}
              current={page}
              pageSize={this.size}
              total={total}
              size="small"
              onChange={this.paginationChange}
            />
          </div>

          <Collapse
            accordion
            expandIconPosition="right"
            defaultActiveKey={String(panels.length - 1)}
            onChange={(key: string) => this.setState({ panelKey: key })}
            activeKey={[panelKey ? panelKey : panelKey === "" ? String(panels.length - 1) : ""]}
            style={{
              maxHeight: "375px",
              marginBottom: "12px",
              width: "100%",
              border: "1px solid #F0F0F0"
            }}
          >
            {panels.map((panel, i) => (
              <Panel
                header={panel.name || "未命名"}
                key={i}
                className={scss["outer-frame"] + " " + (!panel.id && warn ? scss["warn"] : "")}
                onClick={e => this.setState({ panelKey: String(i) })}
                extra={
                  <>
                    <Icon
                      type="save"
                      theme="twoTone"
                      className={scss["btn-icon"]}
                      onClick={e => {
                        panel.type == ""
                          ? warnHandler(this, "未选择类别😅~")
                          : this.props.dispatch({
                              type: "markerModel/savePlanDataTab",
                              payload: { i, planDataId: updateData.id }
                            });
                        e.stopPropagation();
                      }}
                      title={"保存"}
                    />
                    {/* <Icon
                      type="check-circle"
                      theme="twoTone"
                      twoToneColor="#52c41a"
                      className={newCss["vrp-btn-icon"]}
                    />
                    <Icon type="loading" className={newCss["vrp-btn-icon"]} /> */}
                    {i === panels.length - 1 ? (
                      <Icon
                        type="plus-square"
                        theme="twoTone"
                        twoToneColor="#1890FF"
                        className={scss["btn-icon"]}
                        onClick={e => {
                          if (!panels.filter(e => e.id !== null).every(e => e.id))
                            warnHandler(this);
                          else {
                            dispatch({ type: "markerModel/addPanel" });
                            this.setState({
                              panelKey: String(panels.length - 1)
                            });
                          }
                          e.stopPropagation();
                        }}
                        title={"添加"}
                      />
                    ) : null}

                    <Popconfirm
                      title="确认是否删除?"
                      onConfirm={(e: any) => {
                        dispatch({
                          type: "markerModel/delPlanDataTab",
                          payload: { i, type: panel.type }
                        });
                        e.stopPropagation();
                      }}
                      onCancel={(e: any) => e.stopPropagation()}
                      okText="确定"
                      cancelText="取消"
                    >
                      <Icon
                        type="minus-square"
                        theme="twoTone"
                        twoToneColor="#D9D9D9"
                        className={scss["btn-icon"]}
                        title={"删除"}
                        onClick={e => e.stopPropagation()}
                      />
                    </Popconfirm>
                  </>
                }
              >
                <PanelBase
                  i={i}
                  name={panel.name}
                  type={panel.type}
                  deleteType={"markerModel/delPlanDataTab"}
                  onKeyDown={this.handleOnKeyDown}
                  submit={this.submit}
                  closeModal={this.props.closeModal}
                  append={append}
                />
              </Panel>
            ))}
          </Collapse>
          <div className={css["flex-center-left"]}>
            <label className={css["flex-none-label"]}>信息栏</label>
            <Select
              allowClear
              showSearch
              value={updateData.contentId}
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
              {contents.map(e => (
                <Select.Option key={e.id} value={e.id}>
                  <div className={scss["select-item-tip"] + " " + css["flex-center-between"]}>
                    {e.title}
                    <span>填充</span>
                  </div>
                </Select.Option>
              ))}
            </Select>
          </div>

          <div className={css["flex-center-left"]}>
            <label className={css["flex-none-label"]}>二级菜单动画</label>
            <Select
              allowClear
              showSearch
              value={updateData.subMenuId}
              placeholder={"搜索二级菜单"}
              filterOption={false}
              style={{ width: "100%" }}
              onSearch={debounce(this.searchSubMenu, 500)}
              onChange={this.subMenuChange}
              notFoundContent={null}
              getPopupContainer={triggerNode => triggerNode}
              // optionFilterProp={"children"}
            >
              {subMenus.map(e => (
                <Select.Option key={e.id} value={e.id}>
                  {e.title}
                </Select.Option>
              ))}
            </Select>
          </div>

          <div
            className={css["flex-center-between"]}
            style={{
              padding: "0 0 8px",
              border: "1px solid #f0f0f0",
              borderWidth: "0 0 1px 0"
            }}
          >
            <label className={css["flex-none-label"]}>出现在分享界面</label>
            <Switch
              checkedChildren="开"
              unCheckedChildren="关"
              checked={updateData.whethshare}
              onChange={this.whethshareChange}
            />
          </div>
        </div>
      </VrpModal>
    );
  }
}

export default MarkerModal;
