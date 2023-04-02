import { Component, Fragment } from "react";
import { Icon, message, Cascader, Pagination, Popover } from "antd";
import { UpdateBalloon } from "../models/DataModel";
import { SketchPicker } from "react-color";
import { FontIconRow } from "../modules/Cad/FontIconRow";
import Data, { default as DataService } from "../services/DataService";
import StrConfig from "../config/StrConfig";
import Config from "../config/Config";

const css = require("../styles/custom.css");

/**
 * @name BalloonPicker
 * @create: 2020/3/3
 * @description: 标签选择器
 */

interface BalloonPickerProps {
  balloonChange: (color: string) => void;
  currentBalloon: string;
  onClear?: () => void;
  balloonNum?: number;
}

interface BalloonPickerStates {
  balloonUrl: string;
  showColor: string;
  isShowPicker: boolean;
  page: number;
  classType: number;
  loading: boolean;
  iconList: IconListModel[];
  classId: any;
  total: number;
  classList: any[];
  UpdateBalloon: UpdateBalloon;
}

export interface IconListModel {
  id: number;
  iconClassId: number;
  iconClassName: string;
  name: string;
  url: string;
  fileName: string;
}

class BalloonPicker extends Component<BalloonPickerProps, BalloonPickerStates> {
  size = 10;
  keyword = "";

  constructor(props: BalloonPickerProps) {
    super(props);
    this.state = {
      balloonUrl: "",
      showColor: "",
      isShowPicker: false,
      page: 1,
      classType: 1,
      loading: false,
      iconList: [],
      classId: undefined,
      total: 0,
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
      UpdateBalloon: {
        title: "",
        id: 0,
        color: "white",
        balloonVisible: true,
        pointVisible: true,
        imageUrl: "",
        altitude: 0,
        fontSize: 16,
        whethshare: false
      }
    };
  }

  componentWillMount() {
    // window.addEventListener("keydown", this.handleOnKeyDown);
    this.getIconList(this.state.page, this.state.classType);
    this.getAllClass();
    this.setState({ balloonUrl: this.props.currentBalloon });
  }

  paginationChange = page => {
    this.getIconList(page, this.state.classType);
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

  getAllClass = () => {
    const typeList = [1, 3];
    for (const key of typeList) {
      const data = { type: key };
      DataService.getAllClass(data, (flag, res) => {
        if (flag) {
          if (data.type === 1) {
            this.getOptions(0, res.data);
          } else {
            this.getOptions(1, res.data);
          }
        } else {
          message.error(res.message);
        }
      });
    }
  };

  showPicker = () => {
    this.setState({ isShowPicker: !this.state.isShowPicker });
  };

  handleChange = balloonUrl => {
    this.setState({ balloonUrl: balloonUrl.hex, showColor: balloonUrl.rgb });
    this.props.balloonChange(balloonUrl.hex);
  };

  handleClose = () => {
    this.setState({ isShowPicker: false });
  };

  checkBalloon = balloonUrl => {
    this.setState({ balloonUrl });
    this.props.balloonChange(balloonUrl);
  };

  getIconList = (page, type, classId?) => {
    this.setState({
      loading: true
    });

    const base = {
      type,
      page,
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
        //  console.log(res.data)
      } else {
        message.error(res.message);
      }
    });
  };
  checkIcon = icon => {
    const { UpdateBalloon } = this.state;
    UpdateBalloon.imageUrl = icon;
    //this.setIcon();
    this.setState({ UpdateBalloon });
  };

  render() {
    const { balloonUrl, iconList, classList, total, page } = this.state;
    const { balloonNum } = this.props;
    let num = balloonUrl.indexOf("/");

    return (
      <div className={css["vrp-balloon-picker"]}>
        <ul className={css["flex-center"]}>
          {balloonUrl ? (
            <div className={css["current"]}>
              <li
                title={"当前标签"}
                className={css["balloon-item"]}
                style={{
                  backgroundImage:
                    num > 1
                      ? `url(${process.env.publicPath + balloonUrl})`
                      : `url(${Config.apiHost + balloonUrl})`,
                  backgroundSize: "cover"
                }}
              />
            </div>
          ) : null}

          {balloonNum
            ? iconList.map((item, i) => {
                if (i < balloonNum) {
                  return (
                    <li
                      key={i}
                      title={item.name}
                      className={css["balloon-item"]}
                      style={{
                        backgroundImage: `url(${Config.apiHost + item.url})`,
                        backgroundSize: "cover"
                      }}
                      onClick={() => this.checkBalloon(item.url)}
                    />
                  );
                }
              })
            : StrConfig.ColorSelect.map((item, i) => {
                return (
                  <li
                    key={i}
                    className={css["balloon-item"]}
                    style={{ backgroundColor: item }}
                    onClick={() => this.checkBalloon(item)}
                  />
                );
              })}

          <Icon
            className={css["balloon-item"] + " " + css["icon-plus"]}
            style={{ padding: "3px 0 0 0" }}
            type={"plus"}
            title={"更多标签"}
            onClick={this.showPicker}
          />

          {this.props.onClear ? (
            <Icon
              className={css["balloon-item"]}
              type="minus-circle"
              style={{ color: "rgb(195, 16, 3)", borderColor: "transparent" }}
              title={"取消颜色"}
              onClick={this.props.onClear}
            />
          ) : null}
        </ul>
        {this.state.isShowPicker ? (
          <div className={css["popover"]}>
            <div className={css["cover"]} onClick={this.handleClose} />
            <div className={css["balloon-picker"]}>
              <div className={css["flex-center-left"]}>
                <label className={css["flex-none-label"]}>标签图标</label>

                <Cascader
                  options={classList}
                  expandTrigger="hover"
                  onChange={this.classChange}
                  placeholder="选择图标"
                  className={css["flex-auto"]}
                />
              </div>
              <div
                className={css["vrp-icon-list"]}
                style={{
                  minHeight: iconList.length
                    ? `${((260 - 10 * 2 - 8 * (this.size / 2 - 1)) /
                        (this.size / 2.0)) *
                        2 +
                        12 * 2 +
                        15}px`
                    : "unset",
                  height: "auto",
                  padding: "10px",
                  gridGap: "8px",
                  display: "grid",
                  gridTemplateColumns: iconList.length
                    ? `repeat(auto-fill, ${(260 -
                        10 * 2 -
                        8 * (this.size / 2 - 1)) /
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
                        onClick={() => this.checkBalloon(item.url)}
                      />
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
            </div>
            {/* <SketchPicker
                className={css["color-picker"] + " " + css[`${pickerClassName}`]}
                color={this.state.showColor}
                disableAlpha={true}
                onChange={this.handleChange}
              /> */}
          </div>
        ) : null}
        {/* // <div className={css["popover"]}>

          // </div> */}
      </div>
    );
  }
}

export default BalloonPicker;
