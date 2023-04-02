import React, { Component } from "react";
import { Dropdown, Input, Menu, Cascader, message, Button } from "antd";
import VrpIcon from "../../components/VrpIcon";
import DataChoose, { CenterLine, ConfigData } from "./DataChoose";
import { Line, Terrain, PipeLine } from "../../components/model/";
import Config from "../../config/Config";
import { CadModuleData, ExcelData } from "../../components/model/CAD";
import TransCoordinate from "../../components/tools/Coordinate";
import { SiltData } from "./index";
import { Rush } from "../../components/model/Rush";

const pStyles = require("../../styles/scss/public.scss");
const styles = require("../../styles/scss/silt.scss");

/**
 * @name RightMenu
 * @author: bubble
 * @create: 2020/4/21
 * @description: 右侧菜单
 */

interface config {
  width: string | number;
  deep: string | number;
  xy?: number;
}

interface option {
  value: string | number;
  label: string;
  children?: any[] | option[];
}
interface Props {
  blockIndex: number;
  rush: Rush;
  onSave: (blockId, data: SiltSetData) => void;
  onDelete: (blockId) => void;
}

export interface SiltSetData {
  // onLocation: boolean;//如果是当前设定的视角，图标不亮;不是当前视角图标亮。
  // isCurrentVisualAngle: boolean;//如果是当前视角是最新设定视角，图标不亮，不是最新设定视角图标则亮。
  name: string;
  terrainSetList: { terrain: Terrain; setData: string[] }[]; //地形选择list
  lineSetList: { value: any[] | number; line: any; setData: string[] }[]; //采样线选择list
  sectionLine: { value: any[]; line: any };
  configData: config;
  centerLine: { value: any[] | number; line: any; setData: string[] };
  high: { name: string; height: number }[];
  isChange: boolean;
}

interface States extends SiltSetData {
  /*----以下为不需保存的数据----*/
  unfold: boolean;
}

export default class SiltBlock extends Component<Props, States> {
  constructor(props) {
    super(props);
    this.state = {
      // onLocation: props.data.onLocation,
      // isCurrentVisualAngle: props.data.isCurrentVisualAngle,
      name: "未命名",
      terrainSetList: [{ terrain: new Terrain({}), setData: [] }],
      lineSetList: [],
      sectionLine: { value: [], line: {} || [] },
      configData: {
        width: 0,
        deep: 0
      },
      high: [{ name: "", height: 0 }],
      centerLine: { value: [], line: {}, setData: [] },
      unfold: false,
      isChange: false
    };
  }

  componentWillMount() {
    // console.log(this.props);
    const { rush: data } = this.props;
    this.setState({
      name: data.title,
      terrainSetList: data.terrains.length
        ? data.terrains.map(item => {
            return Object.assign({}, item);
          })
        : [{ terrain: new Terrain({}), setData: [] }],
      lineSetList: data.deputyLine.length
        ? data.deputyLine
        : [
            {
              value: [],
              setData: [],
              line: []
            }
          ],
      sectionLine: Object.assign({}, data.sectionLine),
      configData: Object.assign({}, data.settings),
      centerLine: Object.assign({}, data.centerLine),
      high: data.high.length
        ? data.high.map(item => {
            return Object.assign({}, item);
          })
        : [{ name: "", height: 0 }]
    });
    // this.getData();
  }

  /**
   * @description 获取手绘数据且构造固定格式
   * @param pipes
   */
  getPipeOptions(pipes) {
    let list: option[] = [];
    pipes.map(item => {
      list.push({
        value: item.id,
        label: item.title
      });
    });
    return list;
  }

  /**
   * @description 设置数据名称
   * @param e
   */
  onNameChange = e => {
    this.setState({
      name: e.target.value
    });
  };

  /**
   * @description 点击后，界面场景可飞到默认视角或设定视角
   */
  flyToLine = () => {};

  /**
   * @description 设置视角
   */
  setVisualAngle = () => {};

  addOrDelItem = (type, index?) => {
    if (type === "terrain") {
      const { terrainSetList } = this.state;
      const defaultTerrain = { terrain: new Terrain({}), setData: [] };
      if (index) {
        terrainSetList.splice(index, 1);
      } else {
        terrainSetList.push(defaultTerrain);
      }
      this.setState({
        terrainSetList
      });
    } else {
      const { lineSetList } = this.state;
      const defaultLine = { value: [], line: {}, setData: [] };
      if (index) {
        lineSetList.splice(index, 1);
      } else {
        lineSetList.push(defaultLine);
      }

      this.setState({
        lineSetList
      });
    }
  };

  getCenterGeo = () => {};

  /**
   * @description 地块或采样线 设定
   * @param value
   * @param type 修改类型
   * @param index 操作对象序号 确定操作哪一项
   */
  checkedChange = (value, type, index) => {
    if (type === "terrain") {
      const { terrainSetList } = this.state;
      terrainSetList[index].setData = value;
      this.setState({
        terrainSetList,
        isChange: true
      });
    } else {
      const { lineSetList } = this.state;
      lineSetList[index].setData = value;
      this.setState({
        lineSetList,
        isChange: true
      });
    }
  };

  /**
   * @description 地块或采样线数据选择
   * @param type 类型
   * @param checkedValue 选中的控件值
   * @param index 操作对象序号
   */
  selectChange = async (type, checkedValue, index?) => {
    const { rush } = this.props;
    const {
      terrainSetList,
      lineSetList,
      sectionLine,
      configData,
      centerLine
    } = this.state;
    let line: any = [];
    let layer = Config.maps.getLayerById("siltLayer_" + checkedValue[2]);
    if (checkedValue[0] === "silt" || checkedValue[0] === "pipeline") {
      // const res = this.getSiltDataById(checkedValue[1], checkedValue[2]);
      line = await rush.getLine(checkedValue);
    }
    if (type === "terrain") {
      const terrain = Terrain.getById(checkedValue);
      if (terrain) terrainSetList[index].terrain = terrain;
      this.setState({
        terrainSetList,
        isChange: true
      });
    } else if (type === "line") {
      lineSetList[index].value = checkedValue;
      if (lineSetList[index].line.constructor !== Array) {
        Config.maps.removeLayer(lineSetList[index].line.layer);
      }
      lineSetList[index].line = line;
      this.setState({
        lineSetList,
        isChange: true
      });
    } else if (type === "sectionLine") {
      sectionLine.value = checkedValue;
      if (sectionLine.line.constructor !== Array) {
        Config.maps.removeLayer(sectionLine.line.layer);
      }
      sectionLine.line = line;
      this.setState({
        sectionLine,
        isChange: true
      });
    } else if (type === "centerLine") {
      centerLine.value = checkedValue;
      if (centerLine.line.constructor !== Array) {
        Config.maps.removeLayer(centerLine.line.layer);
      }
      centerLine.line = line;
      this.setState({
        configData,
        isChange: true
      });
    }
  };

  /**
   * @description 计算超深 超宽事件
   * @param field 属性名
   * @param value 控件值
   */
  onWidthDeepChange = (field, value) => {
    const { configData } = this.state;
    configData[field] = value;
    this.setState({
      configData
    });
  };

  /**
   * @description 高程信息change
   * @param field 属性名
   * @param value 控件值
   * @param index 确定操作哪一项
   */
  onHighValueChange = (field, value, index) => {
    const { high } = this.state;
    high[index][field] = value;
    this.setState({
      high
    });
  };

  /**
   * @description 添加或删除高程信息
   * @param index 确定操作哪一项
   */
  onAddOrDelHigh = (index?) => {
    const { high } = this.state;
    if (index) {
      high.splice(index, 1);
    } else {
      high.push({ name: "", height: 0 });
    }
    this.setState({
      high
    });
  };

  /**
   * @description 控件数据源
   * @param type
   */
  getOptions = type => {
    let dataSource: any = [];
    if (type == "terrain") {
      dataSource = Terrain.terrains;
    } else if (type == "silt") {
      ExcelData.siltData.forEach(item => {
        const children = Object.keys(item.files).map(key => ({
          value: item.files[key].id,
          label: item.files[key].fileName,
          ext: item.files[key].jsonUrl
        }));
        dataSource.push({
          value: item.id,
          label: item.name,
          disabled: children.length === 0,
          children
        });
      });
    }
    return dataSource;
  };

  /**
   * @description 预览
   */
  onPreview = () => {
    const { lineSetList } = this.state;
    // this.getData();
    this.setState({ isChange: false });
    const { rush: data } = this.props;
    data.preview(this.state);
  };

  getSiltDataById(siltId: number, fileId: number) {
    const silt = ExcelData.getSiltById(siltId);
    if (silt) {
      return silt.getFileById(fileId);
    } else {
      return null;
    }
  }

  /**
   * @description 取消
   */
  onCancel = () => {};

  onSave = () => {
    const { rush: data } = this.props;
    data.save(this.state);
  };

  render() {
    const {
      name,
      terrainSetList,
      lineSetList,
      sectionLine,
      configData,
      unfold,
      centerLine,
      high
    } = this.state;
    const { blockIndex, onSave, onDelete } = this.props;
    const widthDeep = {
      width: configData.width || 0,
      onWidthChange: value => this.onWidthDeepChange("width", value),
      deep: configData.deep || 0,
      onDeepChange: value => this.onWidthDeepChange("deep", value)
    };
    const highInfo = {
      list: high || [],
      fun: {
        add: this.onAddOrDelHigh,
        del: this.onAddOrDelHigh,
        onNameChange: (value, index) =>
          this.onHighValueChange("name", value, index),
        onHeightChange: (value, index) =>
          this.onHighValueChange("height", value, index)
      }
    };
    const terrainOptions = this.getOptions("terrain");
    const lineOptions = [
      {
        value: "pipeline",
        label: "手绘线条",
        disabled: PipeLine.pipes.length === 0,
        children: this.getPipeOptions(PipeLine.pipes)
      },
      {
        value: "silt",
        label: "冲淤线",
        disabled: ExcelData.siltData.length === 0,
        children: this.getOptions("silt")
      }
    ];
    return (
      <div className={styles["block-style"]}>
        <div className={pStyles["flex-center-between"]}>
          <Input
            placeholder={"请输入数据名称"}
            className={styles["block-search"]}
            value={name}
            onChange={this.onNameChange}
          />
          <div className={styles["block-tools"]}>
            {/* <VrpIcon iconName={'icon-position'} onClick={this.flyToLine} title={"冲淤视角"}
              className={onLocation ? styles["active"] : ""} />
            <Dropdown overlay={ddMenu({
              setVisualAngle: this.setVisualAngle,
              isCurrentVisualAngle
            })}
              placement="bottomRight">
              <div className={""}>
                <VrpIcon
                  iconName={'icon-more'}
                  className={styles["active"]}
                />
              </div>
            </Dropdown> */}
            <VrpIcon
              iconName={"icon-shrinkright"}
              className={unfold ? styles["unfold-icon"] : styles["fold-icon"]}
              onClick={() => {
                this.setState({ unfold: !unfold });
              }}
            />
          </div>
        </div>
        <div className={unfold ? styles["unfold"] : styles["fold"]}>
          <div className={styles["line"]} />
          <div className={pStyles["m-y-sm"]}>
            <h3 className={styles["title"]}>地形选择</h3>
            {terrainSetList.map((item, index) => {
              return (
                <DataChoose
                  key={index}
                  index={index}
                  labelA={"剖切地形"}
                  labelB={"设定"}
                  optionList={terrainOptions}
                  cascader={false}
                  selectedData={item.terrain.title}
                  checkedData={item.setData}
                  onSelectChange={value =>
                    this.selectChange("terrain", value, index)
                  }
                  onCheckboxChange={value =>
                    this.checkedChange(value, "terrain", index)
                  }
                  haveDel={index !== 0}
                  haveAdd={index === terrainSetList.length - 1}
                  add={() => this.addOrDelItem("terrain")}
                  del={() => this.addOrDelItem("terrain", index)}
                />
              );
            })}
          </div>
          <div className={pStyles["m-y-sm"]}>
            <h3 className={styles["title"]}>采样线选择</h3>
            <div
              className={pStyles["flex-center-left"] + " " + pStyles["m-b-sm"]}
            >
              <label className={pStyles["flex-none"]}>剖面线：</label>
              <Cascader
                size="small"
                style={{ fontSize: 12 }}
                options={lineOptions}
                value={sectionLine.value}
                onChange={value => this.selectChange("sectionLine", value)}
                placeholder="请选取"
              />
            </div>
            {lineSetList.map((item, index) => {
              return (
                <DataChoose
                  key={index}
                  index={index}
                  labelA={"参考线"}
                  labelB={"延伸至"}
                  cascader={true}
                  optionList={lineOptions}
                  selectedData={item.value}
                  checkedData={item.setData}
                  onSelectChange={value =>
                    this.selectChange("line", value, index)
                  }
                  onCheckboxChange={value =>
                    this.checkedChange(value, "line", index)
                  }
                  haveDel={index !== 0}
                  haveAdd={index === lineSetList.length - 1}
                  add={() => this.addOrDelItem("line")}
                  del={() => this.addOrDelItem("line", index)}
                />
              );
            })}
          </div>
          <div className={pStyles["m-y-sm"]}>
            <h3 className={styles["title"]}>分析配置</h3>
            <ConfigData widthDeep={widthDeep} highInfo={highInfo} />
            <CenterLine
              optionList={lineOptions}
              value={centerLine.value}
              onChange={value => this.selectChange("centerLine", value)}
            />
          </div>
          <div className={styles["line"]} />
          <div className={pStyles["text-right"]}>
            <Button
              size={"small"}
              type="primary"
              className={pStyles["m-r-sm"]}
              onClick={this.onPreview}
            >
              预览
            </Button>
            <Button
              size={"small"}
              type="primary"
              className={pStyles["m-r-sm"]}
              onClick={this.onSave}
            >
              保存
            </Button>
            <Button
              size={"small"}
              className={pStyles["m-r-sm"]}
              onClick={this.onCancel}
            >
              取消
            </Button>
            <Button
              size={"small"}
              type="danger"
              ghost
              onClick={() => onDelete(blockIndex)}
            >
              删除
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
const ddMenu = (props: {
  setVisualAngle: () => void;
  isCurrentVisualAngle: boolean;
}) => (
  <Menu>
    <Menu.Item
      className={pStyles["flex-center-h"]}
      onClick={props.setVisualAngle}
    >
      <VrpIcon
        iconName={"icon-angle-of-view"}
        title={"设定视角"}
        className={
          pStyles["m-r-sm"] +
          " " +
          (props.isCurrentVisualAngle ? styles["active"] : "")
        }
      />
      {props.isCurrentVisualAngle ? "设定视角" : "更新视角"}
    </Menu.Item>
  </Menu>
);
