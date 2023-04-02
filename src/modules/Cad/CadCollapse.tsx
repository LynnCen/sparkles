import { Component } from "react";
import {
  Input,
  Button,
  Popconfirm,
  Icon,
  Dropdown,
  Menu,
  Tabs,
  Radio
} from "antd";
import { connect } from "dva";
import { Dispatch } from "redux";
import { Panel, CadSourceDto } from "../../stores/cadModel";
import VrpIcon from "../../components/VrpIcon";
import { SelectRow } from "./SelectRow";
import { FontIconRow } from "./FontIconRow";
import { SwitchRow } from "./SwitchRow";
import { SliderInputRow } from "./SliderInputRow";
import { ColorRow } from "./ColorRow";
import InputRowWithTable from "./InputRowWithTable";
import { ExcelData, ExcelFile } from "../../components/model/CAD";
import Config from "../../config/Config";
const css = require("../../styles/custom.css");
const ppttab = require("../../styles/scss/ppttab.scss");
const scss = require("../../styles/scss/cad.scss");
const themeBlue = "#1890ff";

interface Props {
  i: number;
  unfold?: boolean;
  className?: string;
  warnHandler: Function;
  panel: Panel;
  backups: Panel[];
  dispatch: Dispatch<Object>;
  cadSource: CadSourceDto[];
}
interface States {
  isChange?: boolean;
  onLocation?: boolean;
  unfold?: boolean;
}
@connect(({ cadModel }, ownProps) => ({
  panel: cadModel.panels[ownProps.i],
  backups: cadModel.backups,
  cadSource: cadModel.cadSource
}))
export default class CadCollapse extends Component<Props, States> {
  constructor(props) {
    super(props);
    this.state = {
      isChange: props.panel ? (props.panel.id ? false : true) : true,
      onLocation: false,
      unfold: props.unfold || false
    };
  }
  componentWillReceiveProps(nextProps) {
    const { panel, unfold } = this.props;
    if (!panel.id && nextProps.panel.id && this.state.unfold) {
      this.setState({ isChange: false, unfold: false });
    }
  }
  componentWillUnmount() {
    if (this.state.isChange && this.props.panel.id) {
      this.cancelEdit(this.props.i);
    }
  }
  setChange = (isChange = true) => {
    this.setState({ isChange });
  };
  dispatchProp = ({ ...payload }) =>
    new Promise((resolve, reject) =>
      this.props
        .dispatch({
          type: "cadModel/setPanelProp",
          payload: { i: this.props.i, ...payload }
        })
        .then(() => (this.setChange(), resolve()))
    );

  // 飞到视角
  flyVisualAngle = e => {
    this.props.panel.data.focus();
  };
  // 显示/隐藏
  isShowChange = (e?) => {
    this.dispatchProp({ isShow: !this.props.panel.isShow });
    this.props.panel.data.setVisible(!this.props.panel.isShow);
  };
  // 设定视角
  setVisualAngle = () => {
    const camera = Config.maps.getCamera();
    let position = camera.getGeoLocation();
    let lookAt = camera.getLookAt();
    lookAt = [lookAt.x(), lookAt.y(), lookAt.z()];
    position = [position.x(), position.y(), position.z()];
    this.dispatchProp({ position, lookAt });
    this.setState({ onLocation: true });
  };
  // 数据源
  selectSource = (row, record, selected) => {
    // this.dispatchProp({ cadId: row.id, cadFileId: record.id, selected });
    const { data, lineVo, fontVo, blockVo } = this.props.panel;
    const { cadData } = data;
    const file = new ExcelFile(
      Object.assign(record, { coordinate: row.coordinate })
    );
    console.log(row);
    if (selected) {
      if (!!!cadData[row.id]) {
        cadData[row.id] = new ExcelData(row);
      }
      cadData[row.id].files[record.id] = file;
      switch (file.type) {
        case "L":
          data.renderAlone(lineVo, file, true);
          break;
        case "T":
          data.renderAlone(fontVo, file, true);
          break;
        case "CL":
          data.renderAlone(blockVo, file, true);
          break;
      }
    } else {
      delete cadData[row.id].files[record.id];
      data.removeFiles.push(file);
      data.removeFile(file);
    }
  };
  changeSource = selections => {
    this.dispatchProp({
      list: selections.map(e => ({ ...e, cadFileVoList: e.children }))
    });
  };
  // 取消修改
  cancelEdit = i => {
    this.props
      .dispatch({ type: "cadModel/cancelEdit", payload: { i } })
      .then(() => {
        const { panel } = this.props;
        const { data } = panel;
        data.init();
      });
    this.setChange(false);
  };

  del = (i: number) => {
    this.props.dispatch({
      type: `cadModel/deleteFormat`,
      payload: { i }
    });
    this.props.panel.data.removeAll();
  };

  //-------------------Font Change------------------//
  fontSizeChange = (size: number) => {
    this.dispatchProp({ fontVo: { size } }).then(() => {
      this.props.panel.data.setFont(this.props.panel.fontVo);
    });
  };
  fontColorChange = (color: string) => {
    this.dispatchProp({ fontVo: { color } });
    const data = this.props.panel.fontVo;
    data.color = color;
    this.props.panel.data.setFont(data);
  };
  fontAltitudeChange = (altitude: number) => {
    this.dispatchProp({ fontVo: { altitude } }).then(() => {
      this.props.panel.data.setFontAltitude(altitude);
    });
  };
  fontIconUrlChange = (iconUrl: string) => {
    this.dispatchProp({ fontVo: { iconUrl } }).then(() => {
      const data = this.props.panel.fontVo;
      data.iconUrl = iconUrl;
      this.props.panel.data.setFont(data);
    });
  };
  fontIconIsShowChange = (iconIsShow: boolean) => {
    this.dispatchProp({ fontVo: { iconIsShow: Number(iconIsShow) } }).then(
      () => {
        const data = this.props.panel.fontVo;
        data.iconIsShow = Number(iconIsShow);
        this.props.panel.data.setFont(data);
      }
    );
  };
  fontIsShareChange = (isShare: boolean) => {
    this.dispatchProp({ fontVo: { isShare: Number(isShare) } });
  };

  // ---------------------Line Change----------------------  //
  lineIsDepthChange = (isDepth: boolean) => {
    this.dispatchProp({ lineVo: { isDepth: Number(isDepth) } });
    const data = this.props.panel.lineVo;
    data.isDepth = Number(isDepth);
    this.props.panel.data.setLine(data);
  };
  lineIsLevelChange = (isLevel: boolean) => {
    this.dispatchProp({ lineVo: { isLevel: Number(isLevel) } });
    const data = this.props.panel.lineVo;
    data.isLevel = Number(isLevel);
    this.props.panel.data.setLine(data);
  };
  lineStyleChange = (style: string) => {
    this.dispatchProp({ lineVo: { style } });
    const data = this.props.panel.lineVo;
    data.style = style;
    this.props.panel.data.setLine(data);
    this.props.panel.data.setLineStyle(style);
  };
  lineWidthChange = (width: number) => {
    this.dispatchProp({ lineVo: { width } });
    const data = this.props.panel.lineVo;
    data.width = width;
    this.props.panel.data.setLine(data);
  };
  lineAltitudeChange = (altitude: number) => {
    this.dispatchProp({ lineVo: { altitude } });
    const data = this.props.panel.lineVo;
    data.altitude = altitude;
    this.props.panel.data.setLine(data);
  };
  lineColorChange = (color: string) => {
    this.dispatchProp({ lineVo: { color } });
    const data = this.props.panel.lineVo;
    data.color = color;
    this.props.panel.data.setLine(data);
  };
  lineIsShareChange = (isShare: boolean) => {
    this.dispatchProp({ lineVo: { isShare: Number(isShare) } });
  };

  // ---------------------Block Change---------------------- //
  blockIsLevelChange = (isLevel: boolean) => {
    this.dispatchProp({ blockVo: { isLevel: Number(isLevel) } });
    const data = this.props.panel.blockVo;
    this.props.panel.data.setBlockAltitude(data.altitude, isLevel);
  };
  blockHeightChange = (height: number) => {
    this.dispatchProp({ blockVo: { height } });
    this.props.panel.data.setBlockHeight(height);
  };
  blockAltitudeChange = (altitude: number) => {
    this.dispatchProp({ blockVo: { altitude } });
    const data = this.props.panel.blockVo;
    this.props.panel.data.setBlockAltitude(altitude, Boolean(data.isLevel));
  };
  blockOpacityChange = (opacity: number) => {
    this.dispatchProp({ blockVo: { opacity } });
    const data = this.props.panel.blockVo;
    const color =
      data.color.toString() + Math.round(Number(opacity) * 255).toString(16);
    this.props.panel.data.setBlockColor(color);
  };
  blockColorChange = (color: string) => {
    this.dispatchProp({ blockVo: { color } });
    const data = this.props.panel.blockVo;
    const _color =
      color.toString() + Math.round(Number(data.opacity) * 255).toString(16);
    this.props.panel.data.setBlockColor(_color);
  };
  blockIsShareChange = (isShare: boolean) => {
    this.dispatchProp({ blockVo: { isShare: Number(isShare) } });
  };

  render() {
    const { i, className, panel, dispatch, cadSource } = this.props;
    const { isChange, onLocation, unfold } = this.state;
    const wordProps = {
      font: {
        label: "字号",
        value: panel.fontVo.size,
        onChange: this.fontSizeChange,
        options: new Array((22 - 12) / 2 + 1).fill(12).map((e, i) => e + i * 2)
      },
      altitude: {
        label: "引线高度",
        value: panel.fontVo.altitude,
        onChange: this.fontAltitudeChange,
        options: new Array(500).fill(0).map((e, i) => e + i)
      },
      color: {
        color: panel.fontVo.color,
        onChange: this.fontColorChange
      },
      icon: {
        checked: panel.fontVo.iconIsShow,
        checkedChange: this.fontIconIsShowChange,
        imageUrl: panel.fontVo.iconUrl,
        imageChange: this.fontIconUrlChange
      },
      share: {
        label: "出现在分享界面",
        checked: panel.fontVo.isShare,
        onChange: this.fontIsShareChange
      }
    };
    const lineProps = {
      depth: {
        label: "线条穿透",
        checked: panel.lineVo.isDepth,
        onChange: this.lineIsDepthChange,
        className: css["flex-center-left"]
      },
      level: {
        label: "线条水平",
        checked: panel.lineVo.isLevel,
        onChange: this.lineIsLevelChange,
        className: css["flex-center-left"]
      },
      width: {
        label: "线条宽度",
        value: panel.lineVo.width,
        min: 1,
        max: 80,
        onChange: this.lineWidthChange
      },
      altitude: {
        label: "线条高度",
        value: panel.lineVo.altitude,
        min: -100,
        max: 100,
        onChange: this.lineAltitudeChange
      },
      color: {
        label: "线条颜色",
        color: panel.lineVo.color,
        onChange: this.lineColorChange
      },
      share: {
        label: "出现在分享界面",
        checked: panel.lineVo.isShare,
        onChange: this.lineIsShareChange
      }
    };
    const blockProps = {
      level: {
        label: "体块水平",
        checked: panel.blockVo.isLevel,
        onChange: this.blockIsLevelChange,
        className: css["flex-center-left"]
      },
      height: {
        label: "体块高度",
        min: 1,
        max: 200,
        value: panel.blockVo.height,
        onChange: this.blockHeightChange
      },
      altitude: {
        label: "抬升高度",
        min: -100,
        max: 100,
        value: panel.blockVo.altitude,
        onChange: this.blockAltitudeChange
      },
      opacity: {
        label: "不透明度",
        min: 0.01,
        max: 1,
        step: 0.01,
        formatter: val => (val * 100).toFixed(0) + "%",
        value: panel.blockVo.opacity,
        onChange: this.blockOpacityChange
      },
      color: {
        label: "线条颜色",
        color: panel.blockVo.color,
        onChange: this.blockColorChange
      },
      share: {
        label: "出现在分享界面",
        checked: panel.blockVo.isShare,
        onChange: this.blockIsShareChange
      }
    };
    return (
      <>
        <div className={className + " " + ppttab["right-collapse"]}>
          <div className={"ant-collapse-item " + ppttab["tabpanel"]}>
            <div
              className={"ant-collapse-header"}
              style={{
                borderRadius: `4px 4px ${unfold ? 0 : "4px"} ${
                  unfold ? 0 : "4px"
                }`
              }}
            >
              <div
                className={css["flex-center-between"]}
                style={{ flex: "auto" }}
              >
                <Input
                  onChange={e => {
                    this.dispatchProp({ title: e.target.value });
                  }}
                  placeholder="请输入数据名称"
                  value={panel.title}
                  style={{ width: "100%", borderRadius: 2, height: 24 }}
                  className={ppttab["menu-title"]}
                  disabled={!unfold}
                />
              </div>
              <div className={css["flex"]}>
                <VrpIcon
                  iconName={"icon-position"}
                  title={"CAD数据视角"}
                  style={{ color: onLocation ? "" : themeBlue }}
                  className={css["m-l-sm"]}
                  onClick={this.flyVisualAngle}
                />

                <Dropdown
                  getPopupContainer={triggerNode => triggerNode}
                  overlay={
                    <Menu>
                      <Menu.Item
                        onClick={this.isShowChange}
                        className={css["flex-center-left"]}
                        style={{ color: panel.isShow ? themeBlue : "" }}
                      >
                        <VrpIcon iconName={"icon-visible"} />
                        <span>{`${panel.isShow ? "隐藏" : "显示"}此条`}</span>
                      </Menu.Item>
                      <Menu.Item
                        onClick={this.setVisualAngle}
                        className={css["flex-center-left"]}
                        style={{ color: onLocation ? "" : themeBlue }}
                      >
                        <VrpIcon iconName={"icon-angle-of-view"} />
                        <span>{`${
                          panel.position.length && panel.lookAt.length
                            ? "更新"
                            : "设定"
                        }视角`}</span>
                      </Menu.Item>
                    </Menu>
                  }
                >
                  <div
                    style={{
                      transition: "all 0.4s",
                      animation: `${
                        unfold ? "antFadeIn" : "antFadeOut"
                      } .4s ease`,
                      transform: unfold ? "none" : "rotate(90deg)"
                    }}
                    className={unfold ? css["m-l-sm"] : ""}
                  >
                    <VrpIcon
                      iconName={"icon-more"}
                      style={{ fontSize: unfold ? 20 : 0 }}
                    />
                  </div>
                </Dropdown>
                <Icon
                  type={`right`}
                  style={{
                    transition: "all 0.25s",
                    transform: unfold ? "rotate(90deg)" : "none"
                  }}
                  className={css["m-l-sm"]}
                  onClick={e => this.setState({ unfold: !unfold })}
                />
              </div>
            </div>
            <div
              className={"ant-collapse-content"}
              style={{
                transition: "all 0.25s",
                height: unfold ? "auto" : 0
              }}
            >
              <div className={"ant-collapse-content-box"}>
                <div>
                  <InputRowWithTable
                    label={"数据源"}
                    title={"数据源"}
                    selections={panel.list.map(e => ({
                      ...e,
                      children: e.cadFileVoList.map(e => ({
                        ...e,
                        title: e.fileName
                      }))
                    }))}
                    dataSource={cadSource.map(e => ({
                      ...e,
                      children: e.cadFileVoList.map(e => ({
                        ...e,
                        title: e.fileName
                      }))
                    }))}
                    onSelect={this.selectSource}
                    onChange={this.changeSource}
                  />

                  <Tabs
                    defaultActiveKey="1"
                    onChange={e => {
                      // console.log(e);
                    }}
                  >
                    <Tabs.TabPane tab="文字" key="1">
                      <div className={css["flex-center-between"]}>
                        <SelectRow {...wordProps.font} />
                        <SelectRow {...wordProps.altitude} />
                      </div>
                      <ColorRow {...wordProps.color} />
                      <FontIconRow {...wordProps.icon} />
                      <SwitchRow {...wordProps.share} />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="线条" key="2">
                      <div className={css["flex-center-between"]}>
                        <SwitchRow {...lineProps.depth} />
                        <SwitchRow {...lineProps.level} />
                      </div>
                      <div className={css["flex-center-left"]}>
                        <label className={css["flex-none-label"]}>
                          线条模式
                        </label>
                        <Radio.Group
                          value={panel.lineVo.style}
                          onChange={e => this.lineStyleChange(e.target.value)}
                        >
                          <Radio.Button value="cylinder">管道</Radio.Button>
                          <Radio.Button value="flat2d">平面</Radio.Button>
                          <Radio.Button value="default">投影</Radio.Button>
                        </Radio.Group>
                      </div>
                      <SliderInputRow {...lineProps.width} />
                      <SliderInputRow {...lineProps.altitude} />
                      <ColorRow {...lineProps.color} />
                      <SwitchRow {...lineProps.share} />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="体块" key="3">
                      <SwitchRow {...blockProps.level} />
                      <SliderInputRow {...blockProps.height} />
                      <SliderInputRow {...blockProps.altitude} />
                      <SliderInputRow {...blockProps.opacity} />
                      <ColorRow {...blockProps.color} />
                      <SwitchRow {...blockProps.share} />
                    </Tabs.TabPane>
                  </Tabs>
                </div>

                <div className={scss["panel-footer"]}>
                  <div>
                    <Button
                      type="primary"
                      size="small"
                      disabled={!isChange}
                      onClick={e => {
                        if (panel.list.length) {
                          dispatch({
                            type: `cadModel/saveFormat`,
                            payload: { i }
                          });
                          this.setChange(false);
                        } else this.props.warnHandler("数据源项不得为空😅~");
                      }}
                    >
                      保存
                    </Button>
                    <Button
                      size="small"
                      disabled={panel.id ? !isChange : true}
                      onClick={e => this.cancelEdit(i)}
                    >
                      取消
                    </Button>
                    <Popconfirm
                      title={"确定要删除吗？"}
                      okText={"确定"}
                      cancelText={"取消"}
                      onConfirm={() => this.del(i)}
                    >
                      <Button size="small" style={{ color: "#F5222DFF" }}>
                        删除
                      </Button>
                    </Popconfirm>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
