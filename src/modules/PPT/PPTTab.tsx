import {Component, useState} from "react";
import {Button, Checkbox, Icon, message, Radio, Switch, Tabs, Tag, Tooltip} from "antd";
// import FartherMenu from "./FatherMenu";
import ShareService from "../../services/ShareService";
import ComparedData from "./ComparedData";
import {templates} from "../../config/StrConfig";
import SimpleLayer from "./SimpleLayer";
import Layer from "../../components/model/Layer";
import PPTCard from "./PPTCard";

const {TabPane} = Tabs;
const css = require("../../styles/custom.css");
const scss = require("../../styles/scss/ppttab.scss");
const CheckableTag = Tag.CheckableTag;

/**
 * @name Dynamic
 * @create: 2019/3/13
 * @description: 动态模拟
 */

const feature = [
  {
    name: "测量",
    checked: false,
    value: "measure"
  },
  {
    name: "绘制",
    checked: false,
    value: "draw"
  },
  {
    name: "推平",
    checked: false,
    value: "bulldoze"
  },
  {
    name: "阳光",
    checked: false,
    value: "sun"
  },
  {
    name: "水淹",
    checked: false,
    value: "water"
  },
  {
    name: "2D-3D",
    checked: false,
    value: "viewChange"
  },
  {
    name: "地图",
    checked: false,
    value: "map"
  },
  {
    name: "气球",
    checked: false,
    value: "balloon"
  },
  // {
  //   name: "热力图",
  //   checked: false,
  //   value: "thermal"
  // },
  {
    name: "搜索",
    checked: false,
    value: "search"
  },
  {
    name: "视角",
    checked: false,
    value: "view"
  },
  {
    name: "对比",
    checked: false,
    value: "compared"
  },
  {
    name: "框选",
    checked: false,
    value: "select"
  }
];
const oneMenu = {
  title: "一级菜单",
  icon: "",
  isOpen: true,
  sub: []
};

interface Compared {
  id: number;
  title: string;
}

interface PPTProps {
  currentData: any;
}

interface PPTStates {
  onemenuVos: any[];
  selectedTags: any;
  template: string;
  activeKey: string;
  isChange: boolean;
  isOpen: boolean;
  compared: Compared[];
  hasCompared: boolean;
  indeterminate: boolean;
  checkAllTags: boolean;
  selectedTab: number;
  layers: Layer[];
}

export default class PPTTab extends Component<PPTProps, PPTStates> {
  plainOptions = feature.map(e => ({label: e.name, value: e.value}));
  public static handleCompared: (bool: boolean) => void;

  constructor(props: PPTProps) {
    super(props);
    this.state = {
      activeKey: "1",
      onemenuVos: [],
      selectedTags: [],
      template: "null",
      isChange: true,
      isOpen: false,
      compared: [],
      hasCompared: false,
      indeterminate: true,
      checkAllTags: false,
      selectedTab: 1,
      layers: Layer.layers
    };
  }

  componentWillReceiveProps(props) {
    const {currentData} = props;
    const {eleList, onemenuVos, compareTerrain, template} = currentData;
    onemenuVos.sort((a, b) => b.index - a.index);
    let selectedTags = JSON.parse(eleList);
    if (eleList) {
      this.setState({
        selectedTags,
        checkAllTags: selectedTags.length === feature.length,
        indeterminate: selectedTags.length < feature.length,
        hasCompared: !!selectedTags.find(tag => tag == "compared")
      });
    }
    if (!onemenuVos.length) {
      onemenuVos.push({...oneMenu, sub: []});
    }
    this.setState({
      onemenuVos,
      isOpen: currentData.isOpen ? true : false,
      compared: compareTerrain,
      template
    });
  }

  onTagChange = selectedTags => {
    const comparedTag = selectedTags.find(tag => tag == "compared");
    this.setState({
      selectedTags,
      checkAllTags: selectedTags.length === feature.length,
      indeterminate: !!selectedTags.length && selectedTags.length < this.plainOptions.length,
      isChange: false,
      hasCompared: !!comparedTag
    });
  };

  onAllTagChange = e => {
    this.setState({
      selectedTags: e.target.checked ? this.plainOptions.map(e => e.value) : [],
      indeterminate: false,
      checkAllTags: e.target.checked,
      isChange: false
    });
  };

  handleSave = () => {
    const {selectedTags, hasCompared, compared, isChange} = this.state;
    const {
      currentData: {id, compareTerrain}
    } = this.props;
    const data = {
      animationId: id,
      eleList: JSON.stringify(selectedTags)
    };
    const terrainIds = compared.map(e => e.id);
    terrainIds.toString() != compareTerrain.map(e => e.id).toString() &&
    ShareService.setTerrains(
      {
        animationId: id,
        terrainIds: compared.map(e => e.id)
      },
      (success, res) => {
        if (success) {
          !isChange && this.setState({isChange: true});
        }
      }
    );
    ShareService.saveAllMenu(data, (success, res) => {
      if (success) {
        !isChange && this.setState({isChange: true});
      }
    });
  };

  handleTemplateSave = (template: string) => {
    const data = {animationId: this.props.currentData.id, template};
    ShareService.saveTemp(data, (success, res) => {
      !success && message.error(res.message);
    });
  };

  handleClick = () => {
    this.setState({isOpen: !this.state.isOpen}, () => {
      ShareService.setOpen(
        {
          animationId: this.props.currentData.id,
          isOpen: this.state.isOpen ? 1 : 0
        },
        (success, res) => {
          if (success && this.state.isOpen) message.success("分享已开启");
          else message.success("分享已关闭");
        }
      );
    });
  };
  // delCompared = index => {
  //   const { compared } = this.state;
  //   compared.splice(index, 1);
  //   this.setState({ compared }, () => {
  //     this.handleCompared(false);
  //   });
  // };
  // addCompared = () => {
  //   const { compared } = this.state;
  //   const data = {
  //     id: 0,
  //     title: "",
  //     time: new Date()
  //       .getTime()
  //       .toString()
  //       .slice(0, 10)
  //   };
  //   compared.push(data);
  //   this.setState({ compared });
  // };
  // saveCompared = () => {
  //   const data = {
  //     animationId: this.state.id,
  //     chanlist: JSON.stringify(this.state.compared)
  //   };
  //   ShareService.saveCompared(data, (flag, res) => {
  //     if (flag) {
  //       this.handleCompared(true);
  //     }
  //   });
  // };

  handleCompared = (compared: any[]) => {
    if (compared.length == 2 || compared.length == 0) {
      this.setState({compared, isChange: false});
      return;
    }
    this.setState({isChange: true});
  };

  tabChange = () => {
    console.log("tabChange", Layer.layers);
    this.setState({
      layers: Layer.layers
    });
  };

  render() {
    const {
      selectedTags,
      indeterminate,
      checkAllTags,
      template,
      onemenuVos,
      isChange,
      hasCompared,
      compared,
      isOpen
    } = this.state;
    const {currentData} = this.props;
    return (
      <div className={scss["ppt-drawer-body"]}>
        <Tabs defaultActiveKey="1" onChange={this.tabChange}>
          <TabPane tab="演示" key="1">
            <PPTCard
              animationId={currentData.id}
              onemenuVos={onemenuVos}
            />
          </TabPane>
          <TabPane tab="设置" key="2">
            <div className={css["m-sm"] + " " + scss["tabCard"]} role="checkboxgroup">
              <h3 className={css["p-l-sm"]}>自定义显示按钮</h3>
              <div className={css["p-x-sm"]}>
                <div>
                  <Checkbox
                    indeterminate={indeterminate}
                    onChange={this.onAllTagChange}
                    checked={checkAllTags}
                  >
                    全部
                  </Checkbox>
                </div>
                <Checkbox.Group
                  options={this.plainOptions}
                  value={selectedTags}
                  onChange={this.onTagChange}
                />

                {hasCompared ? (
                  <div style={{position: "relative"}} className={" " + css["m-b-sm"]}>
                    <ComparedData handleCompared={this.handleCompared} compared={compared}/>
                  </div>
                ) : null}

                <Button
                  type="primary"
                  shape="round"
                  className={css["m-b-sm"]}
                  onClick={this.handleSave}
                  disabled={isChange}
                >
                  确认
                </Button>
              </div>
            </div>
            <div className={css["m-sm"] + " " + scss["tabCard"]} role="radiogroup">
              <h3 className={css["p-l-sm"]}>行业模板</h3>
              <RadioGroupBtn
                className={css["p-x-sm"]}
                value={template}
                options={Object.values(templates).map(e => ({
                  ...e,
                  disabled: !e.open
                }))}
                onChange={template => this.setState({template})}
                onSave={this.handleTemplateSave}
              />
            </div>
          </TabPane>
          <TabPane tab="图层" key="4">
            <SimpleLayer/>
          </TabPane>
        </Tabs>
        <div
          className={css["flex-center"]}
          style={{
            width: "100%",
            height: "50px",
            bottom: 0,
            position: "absolute",
            zIndex: 1,
            boxShadow: "0px 0px 3px 0px rgba(0, 0, 0, 0.2)"
          }}
        >
          <a
            href={`${process.env.publicPath}#/shareppt/${currentData.url}`}
            target="_blank"
            className={css["m-r-md"]}
          >
            <Button type="primary" ghost>
              预览
            </Button>
          </a>
          <Switch
            title={isOpen ? "分享关闭" : "分享开启"}
            checkedChildren="开启"
            unCheckedChildren="关闭"
            checked={isOpen ? true : false}
            onChange={this.handleClick}
          />
        </div>
      </div>
    );
  }
}

export const RadioGroupBtn = ({
                                options = [{value: "radioTest", name: "radio测试", disabled: false}],
                                value,
                                onChange,
                                onSave,
                                className = "",
                                style = {}
                              }) => {
  const [isChange, setIsChange] = useState(false);
  return (
    <div className={className} style={style}>
      <div style={{overflowY: "auto", maxHeight: "calc(100vh - 436px)"}}>
        <Radio.Group
          value={value}
          buttonStyle="solid"
          onChange={e => {
            setIsChange(true);
            onChange(e.target.value);
          }}
        >
          {options.map((e, i) => {
            const RadioBtn = (
              <Radio.Button key={i} disabled={e.disabled} value={e.value} style={{margin: "5px 0"}}>
                {e.name}
              </Radio.Button>
            );
            return e.disabled ? (
              <Tooltip placement="bottom" title="暂未开放~" key={i}>
                {RadioBtn}
              </Tooltip>
            ) : (
              RadioBtn
            );
          })}
        </Radio.Group>
      </div>
      <div className={css["flex-center"]}>
        <Button
          type="primary"
          shape="round"
          className={css["m-y-sm"]}
          onClick={e => {
            setIsChange(false);
            onSave(value);
          }}
          disabled={!isChange}
        >
          保存
        </Button>
      </div>
    </div>
  );
};
