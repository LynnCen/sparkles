import { Component } from "react";
import { Input, AutoComplete, Icon } from "antd";
import VrpModal from "../../components/VrpModal";
import TransCoordinate from "../../components/tools/Coordinate";
import Config from "../../config/Config";
import ShowData from "../../components/tools/showData";

const css = require("../../styles/custom.css");

const Option = AutoComplete.Option;

/**
 * @name SearchResultModal
 * @create: 2019/3/12
 * @description: 地图搜索结果窗口
 */

interface SearchResultModalProps {
  closeModal: () => void;
}

interface SearchResultModalStates {
  dataSource: any;
  keyword: string;
}

class SearchResultModal extends Component<
  SearchResultModalProps,
  SearchResultModalStates
> {
  constructor(props: SearchResultModalProps) {
    super(props);
    this.state = {
      dataSource: [],
      keyword: ""
    };
  }

  onChange = value => {
    const flag = value.indexOf("|");
    const keyword = flag > 0 ? value.substring(0, flag) : value;
    this.setState(
      {
        keyword
      },
      () => {
        this.getDataSource();
      }
    );
  };

  /**
   * @description 获取下拉菜单数据源
   */
  getDataSource = () => {
    const { keyword } = this.state;
    if (keyword) {
      const { maps } = Config;
      const camera = maps.getCamera();
      const lookAt = camera.getLookAt();
      const geo = TransCoordinate.MercatorToWGS84(lookAt);
      const GeoLocation = TransCoordinate.wgs84togcj02(geo.lon, geo.lat);
      TransCoordinate.getLocation(
        {
          location: `${GeoLocation[0]},${GeoLocation[1]}`
        },
        addressComponent => {
          TransCoordinate.getGeoLocation(
            addressComponent.city,
            keyword,
            pois => {
              const newData: any[] = [];
              pois.map((item, index) => {
                newData.push({
                  id: index,
                  name: item.name,
                  pName: item.pname + item.cityname + item.adname,
                  location: TransCoordinate.gcj02towgs84(
                    Number(item.location.split(",")[0]),
                    Number(item.location.split(",")[1])
                  ),
                  typecode: item.typecode
                });
              });
              this.setState({
                dataSource: newData
              });
            }
          );
        }
      );
    } else {
      this.setState({
        dataSource: []
      });
    }
  };

  /**
   *@description 右键点击地图搜索各类地点信息
   */
  handleMapClick = () => {
    const { maps, vrPlanner } = Config;
    maps.bindEvent("click", event => {
      if (event.isRightClick()) {
        const geo = event.getGeoLocation();
        if (geo !== null) {
          const pos = TransCoordinate.MercatorToWGS84(geo);
          const GeoLocation = TransCoordinate.wgs84togcj02(pos.lon, pos.lat);
          const layer =
            maps.getLayerById("MapSearch") ||
            new vrPlanner.Layer.FeatureLayer("MapSearch");
          layer.clearFeatures();
          TransCoordinate.searchNear(
            `${GeoLocation[0]},${GeoLocation[1]}`,
            res => {
              res.map(item => {
                const location = TransCoordinate.gcj02towgs84(
                  Number(item.location.split(",")[0]),
                  Number(item.location.split(",")[1])
                );
                const geo = TransCoordinate.WGS84ToMercator({
                  x: location[0],
                  y: location[1],
                  z: 0
                });
                const point = ShowData.renderMapTag(
                  { geo, title: item.name },
                  item.typecode
                );
                layer.addFeature(point);
                layer.addFeature(point.line);
              });
            }
          );
          layer.setLodWindowSize(512);
          layer.setRenderTileTree(false);
          maps.addLayer(layer);
        }
      }
    });
  };

  /**
   * @description 前往选中地点并显示标记
   * @param location
   * @param keyword
   */
  handleClick = (location, keyword, typecode?) => {
    this.setState(
      {
        keyword
      },
      () => {
        const geo = TransCoordinate.WGS84ToMercator({
          x: location[0],
          y: location[1],
          z: 0
        });
        const { maps, vrPlanner } = Config;
        const camera = maps.getCamera();
        camera.setPosition(geo.add(new vrPlanner.Math.Double3(0, 0, 800)), geo);
        const layer =
          maps.getLayerById("MapSearch") ||
          new vrPlanner.Layer.FeatureLayer("MapSearch");
        layer.clearFeatures();
        // const point = new vrPlanner.Feature.Point(geo.add(new vrPlanner.Math.Double3(0, 0, 100)));
        let point;
        if (typecode) {
          point = ShowData.renderMapTag({ geo, title: keyword }, typecode);
        } else {
          point = ShowData.renderMapTag({ geo, title: keyword });
        }
        layer.addFeature(point);
        layer.addFeature(point.line);
        layer.setLodWindowSize(512);
        layer.setRenderTileTree(false);
        maps.addLayer(layer);
      }
    );
  };

  /**
   * @description 键盘选中并敲回车后
   * @param _
   * @param option
   */
  onSelect = (_, option) => {
    this.handleClick(option.props["data-location"], option.props.title);
  };

  renderOption = item => {
    return (
      <Option
        key={item.id}
        data-location={item.location}
        title={item.name}
        value={item.name + "|" + item.id}
        data-parent={item.pName}
      >
        <div
          onClick={() =>
            this.handleClick(item.location, item.name, item.typecode)
          }
        >
          <a>{item.name}</a>
          <span className={css["m-l-sm"]}>{item.pName}</span>
        </div>
      </Option>
    );
  };

  componentWillMount() {
    this.handleMapClick();
  }

  componentWillUnmount() {
    const { maps, vrPlanner } = Config;
    const layer =
      maps.getLayerById("MapSearch") ||
      new vrPlanner.Layer.FeatureLayer("MapSearch");
    layer.clearFeatures();
    maps.unbindEvent("click");
  }

  render() {
    const { dataSource } = this.state;
    return (
      <VrpModal
        defaultPosition={{ x: 30, y: 95 }}
        title="地图搜索"
        style={{ width: 300 }}
        footer={null}
        fixed={true}
        onClose={this.props.closeModal}
      >
        <AutoComplete
          style={{ width: "100%" }}
          optionLabelProp="title"
          dataSource={dataSource.map(this.renderOption)}
          onChange={this.onChange}
          onSelect={this.onSelect}
        >
          <Input
            placeholder="输入关键词搜索地点"
            suffix={<Icon type="search" />}
          />
        </AutoComplete>
      </VrpModal>
    );
  }
}

export default SearchResultModal;
