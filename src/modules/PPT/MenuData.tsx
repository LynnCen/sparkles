import { Component } from "react";
import { Icon, Select, Input, Popconfirm, InputNumber, Tooltip, Slider } from "antd";
import Config from "../../config/Config";
import VrpIcon from "../../components/VrpIcon";
import Play from "../../components/tools/Play";
import ImgSelector from "../../components/selector/ImgSelector";
import app from "../../index";
import Mark from "../../components/model/Mark";
import Model from "../../components/model/Model";
import Geometry from "../../components/model/Geometry";
import Push from "../../components/model/Push";
import PipeLine from "../../components/model/PipeLine";
import Layer from "../../components/model/Layer";
import Terrain from "../../components/model/Terrain";
import Animation from "../../components/model/Animate/Animation";
import StrConfig from "../../config/StrConfig";
import Tools from "../../components/tools/Tools";

const css = require("../../styles/custom.css");
const newCss = require("../../styles/new.css");
const scss = require("../../styles/scss/ppttab.scss");
const Option = Select.Option;
const date = new Date();

export const layerTypes = [
  {
    type: "pic",
    name: "图片"
  },
  {
    type: "video",
    name: "视频"
  },
  {
    type: "link",
    name: "外链"
  }
];
const options = [
  {
    type: "balloon",
    name: "标签"
  },
  {
    type: "build",
    name: "模型"
  },
  {
    type: "push",
    name: "塌陷"
  },
  {
    type: "line",
    name: "线条"
  },
  {
    type: "area",
    name: "体块"
  },
  {
    type: "view",
    name: "视角"
  },
  {
    type: "terrain",
    name: "地块"
  },
  {
    type: "animateline",
    name: "轨迹"
  },
  {
    type: "cad",
    name: "CAD"
  },
  {
    type: "night",
    name: "昼夜",
    props: {
      defaultValue: 0
    },
    data: [
      { value: 0, title: "白天" },
      { value: 1, title: "黑夜" },
      { value: 2, title: "白天(延迟渲染-高)" },
      { value: 3, title: "黑夜(延迟渲染-高)" }
    ]
  },
  {
    type: "shadow",
    name: "阴影",
    component: Slider,
    props: {
      defaultValue: 0.5,
      min: 0,
      max: 1,
      step: 0.1
    }
  },
  {
    type: "sun",
    name: "日照",
    component: Slider,
    props: {
      range: true,
      min: 0,
      max: 1440,
      defaultValue: [date.getHours() * 60 + date.getMinutes(), 1440],
      tipFormatter: value => {
        value = parseInt(value || 0);
        let h = (Math.floor(value / 60) + "").padStart(2, "0");
        let m = (Math.floor(value % 60) + "").padStart(2, "0");
        return `${h}:${m}`;
      }
    }
  },
  {
    type: "clear",
    name: "清除",
    component: <Input placeholder="以上动画" disabled />
  }
]
  .filter(Boolean)
  .concat(layerTypes);

interface MenuDataProps {
  index: number;
  isLast: boolean;
  isFirst: boolean;
  feature: any;
  addFeature: () => void;
  delFeature: () => void;
  onChange: () => void;
  moveUp: () => void;
  moveDown: () => void;
  className?: string;
  featureLength: number;
}

interface MenuDataStates {
  feature: any;
  data: any;
  tip: { visible: boolean; title: string };
}

class MenuData extends Component<MenuDataProps, MenuDataStates> {
  constructor(props: MenuDataProps) {
    super(props);
    this.state = {
      feature: props.feature,
      data: [],
      tip: { visible: false, title: StrConfig.viewTips.update }
    };
  }

  componentWillMount() {
    this.getData(this.props.feature);
  }

  componentWillReceiveProps(nextProps) {
    const { feature } = nextProps;
    if (feature) {
      this.setState({ feature });
      this.getData(feature);
    }
  }

  getLayerData = (id, type) => {
    for (const item of Layer.layers) {
      if (item.id === id) {
        return item[type];
      }
    }
  };

  getData = feature => {
    const dataType = feature.type;
    switch (dataType) {
      case "view":
        break;
      case "terrain":
        this.setState({ data: Terrain.terrains });
        break;
      case "animateline":
        this.setState({
          data: Animation.animations
        });
        break;
      case "cad":
        this.setState({ data: app._store.getState().cadModel.panels });
        break;
      case "balloon":
        this.setState({
          data: Mark.marks,
          feature
        });
        break;
      case "build":
        this.setState({
          data: Model.models,
          feature
        });
        break;
      case "push":
        this.setState({
          data: Push.pushs,
          feature
        });
        break;
      case "line":
        this.setState({
          data: PipeLine.pipes,
          feature
        });
        break;
      case "area":
        this.setState({
          data: Geometry.geometrys,
          feature
        });
        break;
      case "night":
        this.setState({ data: options.find(e => e.type == dataType).data });
    }
    this.setState({ feature });
  };

  handleTypeChange = value => {
    const { feature } = this.props;
    feature.type = value;
    feature.dataId = [];
    if (/night|shadow|sun/.test(feature.type)) {
      const option = options.find(e => e.type == feature.type);
      this.handleTitleChange(option.props.defaultValue);
    }
    this.getData(feature);
    this.setState({ feature }, this.props.onChange);
  };

  handleTitleChange = val => {
    const { feature } = this.props;
    if (Array.isArray(val)) {
      feature.dataId = val; // Select
    } else if (val.target) {
      feature.dataId = [val.target.value]; // Input
    } else {
      feature.dataId = [val];
    }
    feature.data = [];
    this.props.onChange();
  };

  handleView = () => {
    const { feature } = this.props;
    const { maps } = Config;
    const camera = maps.getCamera();
    const lookAt = camera.getLookAt();
    const position = camera.getPosition();
    let data = {
      lookAt: [lookAt.x(), lookAt.y(), lookAt.z()],
      position: [position.x(), position.y(), position.z()]
    };
    if (feature.data[0] && feature.data[0].id) {
      Object.assign(feature.data[0], data);
    } else {
      feature.data[0] = data;
    }
    this.setState({ feature }, this.props.onChange);
    this.showTip(StrConfig.viewTips.updated);
  };

  handleViewTitle = e => {
    const { feature } = this.state;
    feature.title = e.target.value;
    this.setState({ feature });
    this.props.onChange();
  };

  renderInput = () => {
    const { feature, data } = this.state;
    const option = options.find(e => e.type == feature.type);
    if (feature.type === "view") {
      return this.renderView();
    } else if (/pic|video|link/.test(feature.type)) {
      if (feature.type === "link")
        return (
          <Input
            value={feature.dataId[0]}
            style={{ width: 126 }}
            suffix={<VrpIcon iconName={"icon-edit"} />}
            onChange={this.handleTitleChange}
          />
        );
      else
        return (
          <ImgSelector
            onChange={this.handleTitleChange}
            onSelect={this.handleTitleChange}
            value={feature.dataId[0]}
            width={"100%"}
            inputDisabled={false}
            video={feature.type == "video"}
            multi={feature.type == "video"}
            style={{ minWidth: "126px", maxWidth: "200px" }}
          />
        );
    } else if (/night/.test(feature.type)) {
      return (
        <Select
          value={feature.dataId[0] || option.props.defaultValue}
          onChange={this.handleTitleChange}
        >
          {data.map((item, i) => (
            <Option key={i} {...item}>
              {item.title}
            </Option>
          ))}
        </Select>
      );
    } else if (feature.type === "shadow") {
      return (
        <span>
          <option.component
            {...option.props}
            value={feature.dataId.length ? feature.dataId[0] : option.props.defaultValue}
            onChange={v => {
              this.handleTitleChange(v);
              Tools.setShadowOpacity(v || 0);
            }}
          />
        </span>
      );
    } else if (feature.type === "sun") {
      return (
        <span>
          <option.component
            {...option.props}
            value={feature.dataId.length == 2 ? feature.dataId : option.props.defaultValue}
            onChange={v => {
              if (feature.dataId.length) {
                let m = v.find((e, i) => e != feature.dataId[i]);
                m && Tools.setSun(Math.floor(m / 60), Math.floor(m % 60));
              }
              this.handleTitleChange(v);
            }}
          />
        </span>
      );
    } else if (feature.type === "clear") {
      return option.component;
    } else {
      return (
        <Select
          maxTagCount={2}
          maxTagTextLength={1}
          style={{ minWidth: 126, maxWidth: 200 }}
          value={feature.dataId}
          onChange={this.handleTitleChange}
          mode="multiple"
          showSearch={true}
          optionFilterProp={"children"}
        >
          {data.map((item, i) => {
            return (
              <Option key={item.id} value={item.id} title={item.title}>
                {item.title}
              </Option>
            );
          })}
        </Select>
      );
    }
  };

  renderView = () => {
    const { feature, tip } = this.state;
    return (
      <Tooltip placement="topRight" {...tip}>
        <Input
          onChange={this.handleViewTitle}
          value={feature.title || "视角"}
          style={{ width: 116 }}
          suffix={
            <VrpIcon
              iconName={"icon-angle-of-view"}
              title="记录当前视角"
              onClick={this.handleView}
            />
          }
          onClick={this.singlePlay}
          onFocus={this.singlePlay}
        />
      </Tooltip>
    );
  };

  singlePlay = () => {
    const { feature } = this.state;
    if (feature.data.length) Play.analysisData(feature);
    this.showTip();
  };

  showTip = (title = StrConfig.viewTips.update) => {
    this.setState({ tip: { title, visible: true } });
    setTimeout(() => {
      this.setState({ tip: { title, visible: false } });
    }, 1500);
  };

  handleTimeChange = value => {
    const { feature } = this.props;
    feature.time = parseFloat(value);
    this.props.onChange();
    this.setState({ feature });
  };

  render() {
    const { index, isFirst, isLast, className } = this.props;
    const { feature } = this.state;
    return (
      <div className={className}>
        <div
          className={[
            css["flex-center-between"],
            css["p-x-sm"],
            scss["feature-header"],
            className
          ].join(" ")}
        >
          <span>{index + 1}</span>
          <div className={css["flex"]}>
            {feature.id && (
              <Icon
                type="plus"
                className={newCss["vrp-btn-icon"]}
                onClick={this.props.addFeature}
                title={"添加"}
              />
            )}
            {!isFirst && feature.id && (
              <Icon
                type="arrow-up"
                className={newCss["vrp-btn-icon"]}
                onClick={e => this.props.moveUp()}
                title={"上移"}
                style={{ opacity: isFirst ? 0.2 : 0.4 }}
              />
            )}
            {!isLast && feature.id && (
              <Icon
                type="arrow-down"
                className={newCss["vrp-btn-icon"]}
                onClick={e => this.props.moveDown()}
                title={"下移"}
                style={{ opacity: isLast ? 0.2 : 0.4 }}
              />
            )}
            <Popconfirm
              title="确认是否删除"
              okText="确定"
              cancelText="取消"
              onConfirm={this.props.delFeature}
            >
              <Icon type="close" className={newCss["vrp-btn-icon"]} title={"删除"} />
            </Popconfirm>
          </div>
        </div>
        <div
          style={{ display: "flex", alignItems: "center" }}
          className={"ppt-input " + css["p-sm"]}
        >
          <Select
            value={feature.type}
            // style={{ width: 72 }}
            onChange={this.handleTypeChange}
          >
            {options.map(item => {
              return (
                <Option key={item.type} value={item.type} title={item.name}>
                  {item.name}
                </Option>
              );
            })}
          </Select>
          {this.renderInput()}
          <InputNumber
            style={{ maxWidth: 60 }}
            size="small"
            min={feature.type == "view" ? 0.1 : 0}
            max={360}
            value={Number(feature.time.toFixed(1))}
            width={30}
            onChange={this.handleTimeChange}
          />
          {/* {this.renderBtn()} */}
        </div>
      </div>
    );
  }
}

export default MenuData;
