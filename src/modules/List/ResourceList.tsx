import { Component } from "react";
import {
  Input,
  Button,
  message,
  Tooltip,
  Icon,
  Skeleton,
  notification,
  Popconfirm
} from "antd";
import { BalloonModel, UpdateBalloon } from "../../models/DataModel";
import DataService from "../../services/DataService";
import Config from "../../config/Config";
import Draw from "../Menu/Draw";
import PushLayer from "../Menu/Bulldoze";
import DrawInit from "../../components/tools/DrawInit";
import OpenTerrain from "../Menu/OpenTerrain";
import ShowData from "../../components/tools/showData";
import ResourceItem from "./ResourceItem";
import CustomFun from "../../config/CustomFun";
import Bulldoze from "../Menu/Bulldoze";
import VrpTips from "../../components/VrpTips";
import Coordinate from "../../components/tools/Coordinate";
import { importExcel } from "../../utils/excel";
import Resource from "../Menu/Resource";
import StrConfig from "../../config/StrConfig";
const ButtonGroup = Button.Group;
const { maps, vrPlanner } = Config;
const css = require("../../styles/custom.css");
const Search = Input.Search;

/**
 * @name ResourceList
 * @create: 2018/12/31
 * @description:
 */

interface ResourceListProps {
  data: BalloonModel[];
  type: string;
  // paginationChange: (page) => void;
  // page: number;
  // total: number;
  // pageSize: number;
  onSearch: (value) => void;
  loading: boolean;
  reloadList: () => void;
}

interface ResourceListStates {
  markerVisible: boolean;
  checkedIds: { [k: string]: { [id: string]: boolean } };
  startNumber: number;
  isShow: boolean;
}
class ResourceList extends Component<ResourceListProps, ResourceListStates> {
  constructor(props: ResourceListProps) {
    super(props);
    this.state = {
      markerVisible: false,
      checkedIds: ["balloon", "build", "push", "line", "area"].reduce(
        (r, c) => ((r[c] = {}), r),
        {}
      ),
      startNumber: 0,
      isShow: false
    };
  }
  componentWillReceiveProps({ type, data }) {
    // this.setMapData(data);
    if (type != this.props.type) {
      this.setState({ isShow: false });
    }
  }
  // setMapData = data => {
  //   const { checkedIds } = this.state;
  //   for (const item of data) {
  //     if (!checkedIds[item.id]) {
  //       checkedIds[item.id] = false;
  //     }
  //   }
  //   this.setState({ checkedIds });
  // };
  /**
   * @description 显示编辑弹窗
   */
  onUpdate = data => {
    const { maps, vrPlanner } = Config;
    switch (this.props.type) {
      case "balloon":
        OpenTerrain.OpenMarkerModal(data);
        break;
      case "build":
        OpenTerrain.OpenModelModal(data);
        break;
      case "area":
        Draw.openBlockLayer(data);
        break;
      case "line":
        Draw.openLineLayer(data);
        break;
      case "push":
        PushLayer.openPushLayer(data);
        let polygonLayer = maps.getLayerById("polygonLayer");
        if (polygonLayer) {
          maps.removeLayer(polygonLayer);
        }
        polygonLayer = DrawInit.PolygonLayerInit(
          "polygonLayer",
          new vrPlanner.Color("FFFFFF88")
        );
        maps.addLayer(polygonLayer);
        const polygon = data.polygon.clone();
        polygonLayer.addFeature(polygon);
        break;
    }
  };

  /**
   * @description 删除
   */
  onDelete = item => {
    const id = item.id;
    const data = { id, planId: Config.PLANID, username: Config.USERNAME };
    DataService.delData(data, (flag, _) => {
      if (flag) this.deleteCallback(item);
      else message.error("删除失败");
    });
  };
  /**
   * @description 删除所选
   */
  onDeleteChecked = items => {
    const data = { ids: items.map(e => e.id).join(",") };
    DataService.delAllPlanData(data, (flag, _) => {
      if (flag) items.forEach(this.deleteCallback);
      else message.error(_.message);
    });
  };

  deleteCallback = item => {
    item.remove();
    switch (this.props.type) {
      case "balloon":
        if (OpenTerrain.CloseMarkerModal) {
          OpenTerrain.CloseMarkerModal();
        }
        break;
      case "build":
        if (OpenTerrain.CloseModelModal) {
          OpenTerrain.CloseModelModal();
        }
        break;
      case "area":
        if (Draw.closeBlockLayer) {
          Draw.closeBlockLayer();
        }
        break;
      case "line":
        if (Draw.closeLineLayer) {
          Draw.closeLineLayer();
        }
        break;
      case "push":
        if (Bulldoze.closePushLayer) {
          Bulldoze.closePushLayer();
        }
        break;
    }
    this.props.reloadList();
  };

  /**
   * @description 多选框点击事件
   * @param e
   * @param id
   */
  checkboxChange = (e, id) => {
    const { type } = this.props;
    const { checkedIds } = this.state;
    checkedIds[type][id] = e.target.checked;
    this.setState({ checkedIds });
  };

  /**
   * @description 全选
   */
  allCheckChange = isCheck => {
    const { type, data } = this.props;
    const { checkedIds } = this.state;
    if (isCheck) {
      data.forEach(e => (checkedIds[type][e.id] = isCheck));
    } else {
      data.forEach(e => (checkedIds[type][e.id] = !checkedIds[type][e.id]));
      console.assert(
        Object.keys(checkedIds[type]).length == data.length,
        "checkdedIds are not completed"
      );
    }
    this.setState({ checkedIds });
  };

  /**
   * @description 隐藏或显示所选项
   */
  showHide = () => {
    if (this.checkedData.length) {
      let isShow = this.checkedData[0].isVisible();
      this.checkedData.forEach(item => {
        item.setVisible(!isShow);
      });
      this.forceUpdate();
    }
  };

  deleteChecked = () => {
    const { type, data } = this.props;
    const { checkedIds } = this.state;
    this.onDeleteChecked(data.filter(e => checkedIds[type][e.id]));
  };

  handleEvent = e => {
    CustomFun.onKeyDown(e, 27, () => {
      notification.destroy();
      Config.maps.unbindEvent("click");
      window.removeEventListener("keydown", this.handleEvent);
    });
  };

  showTips() {
    VrpTips.showTips(
      "添加标签",
      <div>
        <p className={css["m-b-sm"]}>1、点击左键在地图中添加标签</p>
        <p className={css["m-b-sm"]}>2、点击右键结束添加</p>
        <p className={css["m-b-sm"]}>3、右键点击标签图标可编辑详情</p>
      </div>,
      320
    );
  }

  addBalloon = () => {
    this.showTips();
    window.addEventListener("keydown", this.handleEvent);
    const { maps, vrPlanner } = Config;
    DrawInit.DrawInit();
    const layer =
      maps.getLayerById("balloonLayer") ||
      new vrPlanner.Layer.FeatureLayer("balloonLayer");
    layer.setRenderTileTree(false);
    maps.addLayer(layer);
    maps.bindEvent("click", e => {
      const geo = e.getGeoLocation();
      if (e.isLeftClick() && geo !== null) {
        ResourceList.addBalloonToMap({ geo });
        maps.unbindEvent("click");
      }
    });
  };

  static addBalloonToMap = ({ title, geo, ...rest }) => {
    const layer =
      maps.getLayerById("balloonLayer") ||
      new vrPlanner.Layer.FeatureLayer("balloonLayer");
    const data = {
      planId: Config.PLANID,
      username: Config.USERNAME,
      position: JSON.stringify([geo.x(), geo.y(), geo.z()]),
      title: title || layer.getFeatureList().length + 1,
      type: "balloon",
      ...StrConfig.balloonSettings
    };
    DataService.addData(data, (flag, res) => {
      if (flag) {
        Object.assign(data, {
          id: res.data,
          settings: StrConfig.balloonSettings
        });
        const mark = ShowData.renderBalloon({ data });
        mark.point.bindEvent("click", e => {
          if (e.isRightClick()) {
            OpenTerrain.OpenMarkerModal(mark);
          }
        });
        layer.addFeature(mark.point);
        if (rest.tabs) {
          const _data = { ...rest, id: res.data };
          DataService.modData(_data, (flag, res) => {
            !flag && message.error(res.message);
          });
        }
        Resource.ReloadList && Resource.ReloadList();
      }
    });
  };

  // handleFileChange = async info => {
  handleFileChange = async (e: React.ChangeEvent<FileReader>) => {
    try {
      // const data = await importExcel(info.file.originFileObj);
      const data = await importExcel(e.target.files[0]);
      ResourceList.handlePointsData(data);
    } catch (error) {
      message.error("批量添加失败~");
    }
  };

  static handlePointsData = async data => {
    const offset = [0, -200, 200];
    for (let { lon, lat, title, ...rest } of data) {
      if (lon && lat) {
        let geo = Coordinate.WGS84ToMercator({
          x: lon,
          y: lat,
          z: 0
        });
        const cameraPos = geo.add(new vrPlanner.Math.Double3(...offset));
        await new Promise((resolve, reject) => {
          maps.getCamera().setPosition(cameraPos, geo);
          setTimeout(() => {
            maps
              .getElevationPrecise(geo.x(), geo.y())
              .done(z => {
                console.log(title, z);
                if (typeof z === "number") {
                  geo = geo.add(new vrPlanner.Math.Double3(0, 0, z));
                  ResourceList.addBalloonToMap({
                    title: title || "",
                    geo,
                    ...rest
                  });
                  resolve();
                } else reject();
              })
              .fail(message.error);
          }, 50);
        });
      } else message.error("经纬度字段非法~");
    }
  };

  get checkedData() {
    const { data, type } = this.props;
    const { checkedIds } = this.state;
    return data.filter(e =>
      Object.keys(checkedIds[type])
        .filter(id => checkedIds[type][id])
        .includes(String(e.id))
    );
  }
  render() {
    const { data, loading, type } = this.props;
    const { checkedIds } = this.state;
    return (
      <div className={css["vrp-right-list"]}>
        <div className={css["flex-center-between"] + " " + css["m-b-sm"]}>
          {/*<span className={css['list-title']}>{StrConfig.ResourceList[this.props.type]}</span>*/}
          <Search
            placeholder={"输入查找内容"}
            // style={{ width: 200 }}
            className={css["m-r-sm"]}
            onSearch={this.props.onSearch}
            onChange={e => this.props.onSearch(e.target.value)}
          />
          {type == "balloon" && (
            <Button type="primary" onClick={this.addBalloon}>
              添加
            </Button>
          )}
          {/* <Button
            title="如列表数据与地图有出入，请刷新"
            onClick={this.props.reloadList}
          >
            刷新
          </Button> */}
        </div>
        <Skeleton loading={loading} title={false} paragraph={{ rows: 4 }}>
          <ul className={css["vrp-list-ul"]}>
            {data.map((item, index) => {
              return (
                <ResourceItem
                  key={index}
                  data={item}
                  onUpdate={this.onUpdate}
                  onDelete={this.onDelete}
                  checkedIds={checkedIds[type]}
                  checkboxChange={this.checkboxChange}
                  type={type}
                />
              );
            })}
            {/* <div className={css["vrp-pagination"] + " " + css["m-y-md"]}>
              <Pagination
                defaultCurrent={1}
                type={page}
                pageSize={pageSize}
                total={total}
                size="small"
                onChange={paginationChange}
              />
            </div> */}
          </ul>
        </Skeleton>
        <div className={css["m-t-md"]}>
          <div className={css["flex-center-between"] + " " + css["m-b-md"]}>
            <Button
              onClick={() => this.allCheckChange(true)}
              disabled={!data.length}
            >
              全选
            </Button>
            <Button
              onClick={() => this.allCheckChange(false)}
              disabled={!data.length}
            >
              反选
            </Button>
            <Button
              onClick={this.showHide}
              disabled={
                !Object.values(checkedIds[type]).filter(Boolean).length &&
                !this.checkedData.length
              }
            >
              {!this.checkedData.length || this.checkedData[0].isVisible()
                ? "隐藏"
                : "显示"}
              所选
            </Button>
          </div>
          {type === "balloon" ? (
            <div className={css["flex-center-around"] + " " + css["m-b-md"]}>
              <ButtonGroup>
                {/* <Upload
                action={"https://www.mocky.io/v2/5cc8019d300000980a055e76"}
                onChange={this.handleFileChange}
                fileList={[]}
              >
                <Button>
                  <Icon type="upload" /> 批量增加
                </Button>
              </Upload> */}
                <Button>
                  <input
                    type="file"
                    accept=""
                    onChange={this.handleFileChange}
                    style={{
                      height: "30px",
                      width: "100px",
                      position: "absolute",
                      top: 0,
                      left: 0,
                      opacity: 0,
                      cursor: "pointer"
                    }}
                  />
                  导入文件
                </Button>
                <Tooltip placement="topRight" title={"请先下载模板~"}>
                  <Button>
                    <a
                      target="_blank"
                      href={`${
                        process.env.publicPath
                      }examples/points-example.xlsx`}
                    >
                      <Icon
                        type="download"
                        onClick={e => {
                          e.stopPropagation();
                        }}
                      />
                    </a>
                  </Button>
                </Tooltip>
              </ButtonGroup>
              <Popconfirm
                title={"此操作不可逆，确定删除？"}
                okText={"确定"}
                cancelText={"取消"}
                onConfirm={this.deleteChecked}
              >
                <Button
                  disabled={
                    !Object.values(checkedIds[type]).filter(Boolean).length
                  }
                >
                  删除所选
                </Button>
              </Popconfirm>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

export default ResourceList;
