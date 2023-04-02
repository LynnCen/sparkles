import React, { useState, useEffect } from "react";
import { Icon, Input, Tree } from "antd";
import TransCoordinate from "../../../components/tools/Coordinate";
import Config from "../../../config/Config";
import ShowData from "../../../components/tools/showData";
import { Terrain } from "../../../components/model";
const scss = require("../../../styles/scss/sharepage.scss");
const { maps, vrPlanner } = Config;
const { Search } = Input;
const { TreeNode } = Tree;

const list = require("../../../../public/js/share/massif.json");

export default function LandSearch({
  children,
  active = false,
  changeVisible,
  ...rest
}) {
  const [key, setKey] = useState("1");
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [selected, setSelected] = useState(null);
  const [listData, setListData] = useState(list.districtList);
  const buttonData = [
    {
      index: "1",
      title: "全局搜索"
    },
    {
      index: "2",
      title: "地块列表"
    }
  ];
  /**
   * @description 全局搜索
   * @param value
   */
  const onChange = value => {
    setSelected(null);
    const newValue = value.target.value;
    const flag = newValue.indexOf("|");
    const keyword = flag > 0 ? newValue.substring(0, flag) : newValue;
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
              setDataSource(newData);
            }
          );
        }
      );
    } else {
      setDataSource([]);
    }
  };
  /**
   * @description 地块搜索
   * @param value
   */
  const onSearch = value => {
    if (value) {
      let newChildData: any = [];
      for (let i in listData) {
        const data = listData[i].terrainList;
        for (let j in data) {
          const index = data[j].title.indexOf(value);
          if (index > -1) {
            const newChild = {
              city: data[j].city,
              district: data[j].district,
              formattedAddress: data[j].formattedAddress,
              id: data[j].id,
              position: data[j].position,
              province: data[j].province,
              title: data[j].title,
              township: data[j].township
            };
            newChildData.push(newChild);
          }
        }
      }
      let dataInfo = {};
      newChildData.forEach(item => {
        let { district } = item;
        if (!dataInfo[district]) {
          dataInfo[district] = {
            title: district,
            terrainList: []
          };
        }
        dataInfo[district].terrainList.push(item);
      });
      let list = Object.values(dataInfo);
      setListData(list);
    } else {
      setListData(list.districtList);
    }
  };
  /**
   * @description 前往选中地点并显示标记
   * @param location
   * @param keyword
   */
  const handleClick = (location, keyword, typecode?) => {
    const geo = TransCoordinate.WGS84ToMercator({
      x: location[0],
      y: location[1],
      z: 0
    });

    const camera = maps.getCamera();
    camera.setPosition(geo.add(new vrPlanner.Math.Double3(0, 0, 1600)), geo);
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
    setTimeout(() => {
      layer.clearFeatures();
    }, 5000);
  };

  const treeClick = (selectedKeys, info) => {
    const value = selectedKeys[0];
    const title = info.node.props.title;
    const id = info.node.props["data-id"];
    console.log(id);
    const newGeo = geo => {
      return new Config.vrPlanner.GeoLocation(geo.x, geo.y, Number(geo.z));
    };
    if (value.substring(value.length - 2) != "no") {
      const newValue = value.split("/")[0];
      const camera = maps.getCamera();
      const position = {
        x: newValue.split(",")[0],
        y: newValue.split(",")[1],
        z: 0
      };
      const geo = newGeo(position);
      camera.setPosition(geo.add(new vrPlanner.Math.Double3(0, 0, 1600)), geo);
      const layer =
        maps.getLayerById("MapSearch") ||
        new vrPlanner.Layer.FeatureLayer("MapSearch");
      layer.clearFeatures();
      const terrain = Terrain.getById(id);
      console.log(terrain);
      if (terrain) {
        terrain.setVisible(true);
      } else {
        let point;
        point = ShowData.renderMapTag({ geo, title: title });
        layer.addFeature(point);
        layer.addFeature(point.line);
        layer.setLodWindowSize(512);
        layer.setRenderTileTree(false);
      }
      maps.addLayer(layer);
      setTimeout(() => {
        layer.clearFeatures();
      }, 5000);
    }
  };
  return (
    <>
      {{
        ...children,
        props: {
          ...rest,
          ...children.props,
          style: { ...children.style, position: "relative" }
          // children: { ...child }
        }
      }}
      {active && (
        <div className={scss["landSearchBox"]}>
          <div className={scss["head"]}>
            <div className={scss["headL"]}>
              {buttonData.map(item => {
                return (
                  <div
                    key={item.index}
                    className={item.index == key && scss["blue"]}
                    onClick={() => {
                      setKey(item.index);
                      setDataSource([]);
                    }}
                  >
                    <span>{item.title}</span>
                  </div>
                );
              })}
            </div>
            <div
              className={scss["headR"]}
              onClick={() => {
                setDataSource([]);
                changeVisible();
                setKey("1");
              }}
            >
              <span>关闭</span>
              <Icon type="close" />
            </div>
          </div>
          <div className={scss["content"]} id={"landSearch"}>
            {key == "1" ? (
              <>
                <Input
                  onChange={onChange}
                  placeholder="请输入关键字查找"
                  suffix={<Icon type="search" />}
                />
                {dataSource.length > 0 ? (
                  <div className={scss["contentList"]}>
                    <div className={scss["listTitle"]}>
                      <span>查找结果</span>
                      <span>{dataSource.length}</span>
                    </div>
                    <div className={scss["listText"]}>
                      {dataSource.map(item => {
                        return (
                          <div
                            key={item.id}
                            className={item.id == selected && scss["blue"]}
                            onClick={() => {
                              handleClick(
                                item.location,
                                item.name,
                                item.typecode
                              );
                              setSelected(item.id);
                            }}
                          >
                            <div title={item.name}>{item.name}</div>
                            <div title={item.pName}>{item.pName}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </>
            ) : (
                <>
                  <Search
                    onSearch={onSearch}
                    onChange={() => setListData(list.districtList)}
                    placeholder="请输入关键字查找"
                  />
                  <div className={scss["contentTree"]}>
                    <Tree onSelect={treeClick}>
                      {listData.map(item => {
                        return (
                          <TreeNode key={item.title + "no"} title={item.title}>
                            {item.terrainList.map(i => {
                              return (
                                <TreeNode
                                  key={i.position + "/" + i.id.toString()}
                                  title={i.title}
                                  data-id={i.id}
                                />
                              );
                            })}
                          </TreeNode>
                        );
                      })}
                    </Tree>
                  </div>
                </>
              )}
          </div>
        </div>
      )}
    </>
  );
}
