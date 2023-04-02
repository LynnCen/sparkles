import { Component } from "react";
import VrpIcon from "../../components/VrpIcon";
import VrpModal from "../../components/VrpModal";
import Config from "../../config/Config";
import TransCoordinate from "../../components/tools/Coordinate";
import { Button, Spin } from "antd";
import MapService from "../../services/MapService";
import TerrainService from "../../services/TerrainService";
import { Point, Model, Line, Polygon } from "../../components/model/";

const css = require("../../styles/custom.css");

/**
 * @name Station
 * @author: bubble
 * @create: 2018/12/6
 * @description: 管道
 */

interface StationProps {}

interface StationStates {
  isTest: boolean;
  loading: boolean;
}

class StationTest extends Component<StationProps, StationStates> {
  constructor(props: StationProps) {
    super(props);
    this.state = {
      isTest: false,
      loading: false
    };
  }

  getLocation = () => {
    this.setState({
      loading: true
    });
    let superNear_layer = Config.maps.getLayerById("superNearLayer");
    let near_layer = Config.maps.getLayerById("nearLayer");
    let middle_layer = Config.maps.getLayerById("middleLayer");
    let far_layer = Config.maps.getLayerById("farLayer");
    let superFar_layer = Config.maps.getLayerById("superFarLayer");
    let error_layer = Config.maps.getLayerById("errorLayer");
    // if (!superNear_layer) {
    //     superNear_layer = new Config.vrPlanner.Layer.FeatureLayer("superNearLayer");
    //     superNear_layer.setLodWindowSize(Math.pow(2, 14))
    //     Config.maps.addLayer(superNear_layer);
    // }
    if (!near_layer) {
      near_layer = new Config.vrPlanner.Layer.FeatureLayer("nearLayer");
      near_layer.setLodWindowSize(Math.pow(2, 10));
      Config.maps.addLayer(near_layer);
    }
    // if (!middle_layer) {
    //     middle_layer = new Config.vrPlanner.Layer.FeatureLayer("middleLayer");
    //     middle_layer.setLodWindowSize(Math.pow(2, 8))
    //     Config.maps.addLayer(middle_layer);
    // }
    if (!far_layer) {
      far_layer = new Config.vrPlanner.Layer.FeatureLayer("farLayer");
      far_layer.setLodWindowSize(Math.pow(2, 4));
      Config.maps.addLayer(far_layer);
    }
    if (!superFar_layer) {
      superFar_layer = new Config.vrPlanner.Layer.FeatureLayer("superFarLayer");
      superFar_layer.setLodWindowSize(Math.pow(2, 1));
      Config.maps.addLayer(superFar_layer);
    }
    if (!error_layer) {
      error_layer = new Config.vrPlanner.Layer.FeatureLayer("errorLayer");
      error_layer.setLodWindowSize(Math.pow(2, 4));
      Config.maps.addLayer(error_layer);
    }
    const { maps } = Config;
    const lon_list: any = [];
    const lat_list: any = [];
    maps
      .getGeoLocationAtScreenPos(window.innerWidth, window.innerHeight)
      .done(geo => {
        geo = TransCoordinate.MercatorToWGS84(geo);
        lon_list.push(geo.lon);
        lat_list.push(geo.lat);
      });
    maps.getGeoLocationAtScreenPos(0, window.innerHeight).done(geo => {
      geo = TransCoordinate.MercatorToWGS84(geo);
      lon_list.push(geo.lon);
      lat_list.push(geo.lat);
    });
    maps.getGeoLocationAtScreenPos(window.innerWidth, 0).done(geo => {
      geo = TransCoordinate.MercatorToWGS84(geo);
      lon_list.push(geo.lon);
      lat_list.push(geo.lat);
    });
    maps.getGeoLocationAtScreenPos(0, 0).done(geo => {
      geo = TransCoordinate.MercatorToWGS84(geo);
      lon_list.push(geo.lon);
      lat_list.push(geo.lat);
    });
    const intervale = setInterval(() => {
      if (lon_list.length === 4 && lat_list.length === 4) {
        lon_list.sort();
        lat_list.sort();
        clearInterval(intervale);
        let i = 1;
        const size = 1000;
        const request = setInterval(() => {
          const data = {
            minlon: lon_list[0],
            minlat: lat_list[0],
            maxlon: lon_list[3],
            maxlat: lat_list[3],
            page: i,
            size
          };
          i++;
          MapService.getData(data, (bool, res) => {
            if (bool) {
              const { data } = res;
              if (data.list) {
                if (data.list.length === 0) {
                  clearInterval(request);
                  this.setState({
                    loading: false
                  });
                }
                for (let i = 0; i < data.list.length; i++) {
                  const item = data.list[i];
                  const { longitude, latitude, id, rsrp, pci, earfcndl } = item;
                  if (longitude && latitude) {
                    const geo = TransCoordinate.WGS84ToMercator({
                      x: Number(longitude),
                      y: Number(latitude),
                      z: 0
                    });
                    const point = new Point({
                      geo,
                      pointStyle: "projected",
                      whethshare: false
                    });
                    // point.point.setAltitudeMode(Config.vrPlanner.Feature.ALTITUDE_MODE_RELATIVE_TO_GROUND)
                    point.point.setGeoLocation(geo);
                    point.point.isClick = true;
                    point.point.bindEvent("click", () => {
                      if (pci) {
                        point.point.isClick = !point.point.isClick;
                        if (point.point.isClick) {
                          const balloon = point.point.getBalloon();
                          if (balloon) {
                            balloon.setVisible(false);
                          }
                        }
                        const balloon = new Config.vrPlanner.Balloon();
                        const html = `<div style="
                                                    display: inline-block;
                                                    background-color: #fff;
                                                    padding: 10px;
                                                    border-radius: 8px;
                                                    pointer-events: none;
                                                    ">
                                                        <div style="padding-top: 8px">
                                                            <p>频点：${
                                                              item.earfcndl
                                                            }</p>
                                                            <p>pci：${
                                                              item.pci
                                                            }</p>
                                                            <p>rsrp：${
                                                              item.rsrp
                                                            }</p>
                                                            <p>sinr：${
                                                              item.sinr
                                                            }</p>
                                                            <p>经度：${
                                                              item.longitude
                                                            }</p>
                                                            <p>纬度：${
                                                              item.latitude
                                                            }</p>
                                                        </div>
                                                    </div>`;
                        balloon.setOffsetY(15);
                        balloon.setMessage(html);
                        point.point.setBalloon(balloon);
                        MapService.getPCI(
                          { PCI: pci, earfcndl },
                          (isSuccess, res) => {
                            if (isSuccess) {
                              let dis = 0;
                              let _p: any;
                              let _geo: any;
                              res.data.map((data, index) => {
                                _geo = TransCoordinate.WGS84ToMercator({
                                  x: Number(data.longitude),
                                  y: Number(data.latitude),
                                  z: 0
                                });
                                const _dis = TransCoordinate.getDistance(
                                  geo,
                                  _geo
                                );
                                if (index === 0) {
                                  dis = Number(_dis.a.toFixed(2));
                                  _p = data;
                                } else {
                                  if (Number(_dis.a.toFixed(2)) < dis) {
                                    _p = data;
                                    dis = Number(_dis.a.toFixed(2));
                                  }
                                }
                              });
                              console.log(_p);
                              if (_p) {
                                _geo = TransCoordinate.WGS84ToMercator({
                                  x: Number(_p.longitude),
                                  y: Number(_p.latitude),
                                  z: 0
                                });
                                const model = new Model({
                                  geo: _geo,
                                  title: "",
                                  url:
                                    "/res/source/h631677355/154570795811/m0-154570795811.a3x"
                                });
                                model.point.isClick = true;
                                model.point.bindEvent("click", () => {
                                  model.point.isClick = !model.point.isClick;
                                  if (model.point.isClick) {
                                    const balloon = model.point.getBalloon();
                                    if (balloon) {
                                      balloon.setVisible(false);
                                    }
                                  }
                                  const balloon = new Config.vrPlanner.Balloon();
                                  const html = `<div style="
                                                                    display: inline-block;
                                                                    background-color: #fff;
                                                                    padding: 10px;
                                                                    border-radius: 8px;
                                                                    pointer-events: none;
                                                                    ">
                                                                        <div style="padding-top: 8px">
                                                                            <p>pci：${
                                                                              _p.pci
                                                                            }</p>
                                                                            <p>经度${
                                                                              _p.longitude
                                                                            }</p>
                                                                            <p>纬度：${
                                                                              _p.latitude
                                                                            }</p>
                                                                            <p>频点：${_p.earfcndl ||
                                                                              _p[
                                                                                "频点"
                                                                              ]}</p>
                                                                            <p>小区名：${
                                                                              _p[
                                                                                "小区名"
                                                                              ]
                                                                            }</p>
                                                                            <p>总俯仰角：${
                                                                              _p[
                                                                                "总俯仰角"
                                                                              ]
                                                                            }</p>
                                                                            <p>方位角：${
                                                                              _p[
                                                                                "方位角"
                                                                              ]
                                                                            }</p>
                                                                            <p>机械下倾角:${
                                                                              _p[
                                                                                "机械下倾角"
                                                                              ]
                                                                            }</p>
                                                                            <p>站点号：${
                                                                              _p[
                                                                                "站点号"
                                                                              ]
                                                                            }</p>
                                                                        </div>
                                                                    </div>`;
                                  balloon.setMessage(html);
                                  balloon.setOffsetY(200);
                                  model.point.setBalloon(balloon);
                                });
                                model.setScale([30, 30, 30]);
                                model.setColor("#F8E71C");
                                model.point.setAltitudeMode(
                                  Config.vrPlanner.Feature
                                    .ALTITUDE_MODE_RELATIVE_TO_GROUND
                                );
                                far_layer.addFeature(model.point);
                                const vertices: any = [geo, _geo];
                                const line = new Line({
                                  vertices,
                                  width: 4,
                                  color: "#ffffff"
                                });
                                far_layer.addFeature(line.line);
                              }
                            }
                          }
                        );
                      } else {
                        console.log("无pci信号信息");
                      }
                    });
                    point.setRadius(3);
                    if (!Number(rsrp)) {
                      point.setColor("#C810EA");
                      error_layer.addFeature(point.point);
                      continue;
                    } else {
                      if (Number(rsrp) < -110) {
                        point.setColor("#FF0000");
                        error_layer.addFeature(point.point);
                        continue;
                      } else {
                        if (-110 < Number(rsrp) && Number(rsrp) <= -105) {
                          point.setColor("#FB01F9");
                        }
                        if (-105 < Number(rsrp) && Number(rsrp) <= -100) {
                          point.setColor("#FFFA01");
                        }
                        if (-100 < Number(rsrp) && Number(rsrp) <= -90) {
                          point.setColor("#13EF1D");
                        }
                        if (-90 < Number(rsrp) && Number(rsrp) <= -80) {
                          point.setColor("#54BFC5");
                        }
                        if (Number(rsrp) > -80) {
                          point.setColor("#0004FB");
                        }
                        if (id % 100 === 0) {
                          superFar_layer.addFeature(point.point);
                          continue;
                        }
                        // else {
                        //     near_layer.addFeature(point.point)
                        //     continue;
                        // }
                        // else {
                        //     if (index % 12 === 0) {
                        //         near_layer.addFeature(point.point)
                        //         continue;
                        //     } else {
                        //         if (index % 6 === 0) {
                        //             middle_layer.addFeature(point.point)
                        //             continue;
                        //         } else {
                        //             if (index % 3 === 0) {
                        //                 near_layer.addFeature(point.point)
                        //                 continue;
                        //             } else {
                        //                 superNear_layer.addFeature(point.point)
                        //                 continue;
                        //                 //   if (item[4] % 3 === 0) {
                        //                 //   }
                        //             }
                        //         }
                        //     }
                        // }
                      }
                    }
                  }
                }
              }
            }
          });
        }, 100);
      }
    }, 10);
  };

  handleClick = () => {
    this.setState({
      isTest: true
    });
  };

  closeModal = () => {
    this.setState({
      isTest: false
    });
  };

  clearPoint = () => {
    // // let superNear_layer = Config.maps.getLayerById("superNearLayer");
    // let near_layer = Config.maps.getLayerById("nearLayer");
    // // let middle_layer = Config.maps.getLayerById("middleLayer");
    // let far_layer = Config.maps.getLayerById("farLayer");
    // let superFar_layer = Config.maps.getLayerById("superFarLayer");
    // let error_layer = Config.maps.getLayerById("errorLayer");
    // // superNear_layer && superNear_layer.clearFeatures();
    // near_layer && near_layer.clearFeatures();
    // // middle_layer && middle_layer.clearFeatures();
    // far_layer && far_layer.clearFeatures();
    // superFar_layer && superFar_layer.clearFeatures();
    // error_layer && error_layer.clearFeatures();

    let layer = Config.maps.getLayerById("stationLayer");
    layer.clearFeatures();
  };

  getStation = () => {
    const { maps, vrPlanner } = Config;
    const lon_list: any = [];
    const lat_list: any = [];
    maps
      .getGeoLocationAtScreenPos(window.innerWidth, window.innerHeight)
      .done(geo => {
        geo = TransCoordinate.MercatorToWGS84(geo);
        lon_list.push(geo.lon);
        lat_list.push(geo.lat);
      });
    maps.getGeoLocationAtScreenPos(0, window.innerHeight).done(geo => {
      geo = TransCoordinate.MercatorToWGS84(geo);
      lon_list.push(geo.lon);
      lat_list.push(geo.lat);
    });
    maps.getGeoLocationAtScreenPos(window.innerWidth, 0).done(geo => {
      geo = TransCoordinate.MercatorToWGS84(geo);
      lon_list.push(geo.lon);
      lat_list.push(geo.lat);
    });
    maps.getGeoLocationAtScreenPos(0, 0).done(geo => {
      geo = TransCoordinate.MercatorToWGS84(geo);
      lon_list.push(geo.lon);
      lat_list.push(geo.lat);
    });
    let layer = maps.getLayerById("stationLayer");
    if (!layer) {
      layer = new vrPlanner.Layer.FeatureLayer("stationLayer");
      maps.addLayer(layer);
    }
    const interval = setInterval(() => {
      if (lon_list.length === 4 && lat_list.length === 4) {
        lon_list.sort();
        lat_list.sort();
        clearInterval(interval);
        TerrainService.getData(
          `http://47.96.133.22:1247/baseStation/getBaseStations?Xmin=${
            lon_list[0]
          }&Ymin=${lat_list[0]}&Xmax=${lon_list[3]}&Ymax=${lat_list[3]}`,
          (flag, res) => {
            if (flag) {
              const { data } = res;
              data.forEach(item => {
                const geo = TransCoordinate.WGS84ToMercator({
                  x: item.c_longitude,
                  y: item.c_latitude,
                  z: 10
                });
                const model = new Model({
                  geo,
                  title: item.cellname,
                  url:
                    "/res/source/h631677355/154570795811/m0-154570795811.a3x",
                  id: item.siteid
                });
                model.setScale([30, 30, 30]);
                model.point.isClick = true;
                model.point.bindEvent("click", () => {
                  console.log(model);
                  console.log(item);
                  model.point.isClick = !model.point.isClick;
                  const balloon = model.point.getBalloon();
                  if (balloon) {
                    balloon.setVisible(!model.point.isClick);
                  } else {
                    const balloon = new Config.vrPlanner.Balloon();
                    const html = `<div style="
                                                display: inline-block;
                                                background-color: #fff;
                                                padding: 10px;
                                                border-radius: 8px;
                                                pointer-events: none;
                                            ">
                                                <div style="padding-top: 8px">
                                                    <p>经度${
                                                      item.c_longitude
                                                    }</p>
                                                    <p>纬度：${
                                                      item.c_latitude
                                                    }</p>
                                                    <p>小区名：${
                                                      item.sitename
                                                    }</p>
                                                    <p>站点号：${
                                                      item.siteid
                                                    }</p>
                                                </div>
                                            </div>`;
                    balloon.setMessage(html);
                    balloon.setOffsetY(30);
                    model.point.setBalloon(balloon);
                    if (item.cellIdList) {
                      item.cellIdList.forEach((data, index) => {
                        let color = "#ffffff55";
                        switch (index) {
                          case 0:
                            color = "#ff000055";
                            break;
                          case 1:
                            color = "#00ff0055";
                            break;
                          case 2:
                            color = "#0000ff55";
                            break;
                          case 3:
                            color = "#ffff0055";
                            break;
                          case 4:
                            color = "#ff00ff55";
                            break;
                        }
                        const polygon = new Polygon({
                          color,
                          polygonStyle: "ProjectedFeatureStyle"
                        });
                        layer.addFeature(polygon.polygon);
                        TerrainService.getData(
                          `http://47.96.133.22:1247/samplingPoint/getSamplingPoints?cellid=${data}`,
                          (flag, res) => {
                            if (flag) {
                              const { data } = res;
                              data.forEach((item, index) => {
                                const geo = TransCoordinate.WGS84ToMercator({
                                  x: item.s_longitude,
                                  y: item.s_latitude,
                                  z: 10
                                });
                                const point = new Point({
                                  geo,
                                  pointStyle: "point",
                                  whethshare: false
                                });
                                point.setColor(color);
                                point.setRadius(2);
                                layer.addFeature(point.point);
                              });
                            }
                          }
                        );

                        TerrainService.getData(
                          `http://47.96.133.22:1247/samplingPoint/getBoundaryPoints?cellid=${data}`,
                          (flag, res) => {
                            if (flag) {
                              const { data } = res;
                              data.forEach((item, index) => {
                                const geo = TransCoordinate.WGS84ToMercator({
                                  x: item.s_longitude,
                                  y: item.s_latitude,
                                  z: Math.random() * 9 + 1
                                });
                                polygon.polygon.addVertex(geo);
                              });
                            }
                          }
                        );
                      });
                    }
                  }
                });
                layer.addFeature(model.point);
              });
            }
          }
        );
      }
    }, 100);
  };

  testStation = () => {
    const { maps, vrPlanner } = Config;
    let layer = maps.getLayerById("stationLayer");
    if (!layer) {
      layer = new vrPlanner.Layer.FeatureLayer("stationLayer");
      maps.addLayer(layer);
    }
    TerrainService.getData(
      "http://47.96.133.22:1247/samplingPoint/getSamplingPoints?cellid=106539780",
      (flag, res) => {
        if (flag) {
          const { data } = res;
          let leftPoint;
          data.forEach((item, index) => {
            const geo = TransCoordinate.WGS84ToMercator({
              x: item.s_longitude,
              y: item.s_latitude,
              z: 10
            });
            if (index === 0) {
              const camera = maps.getCamera();
              camera.setPosition(
                geo.add(new vrPlanner.Math.Double3(0, 0, 200)),
                geo
              );
              leftPoint = geo;
            } else {
              if (leftPoint.x() > geo.x()) {
                leftPoint = geo;
              }
            }
            // console.log(geo)
            const point = new Point({
              geo,
              pointStyle: "point",
              whethshare: false
            });
            point.setColor("#ff0000");
            point.setRadius(2);
            layer.addFeature(point.point);
          });
        }
      }
    );

    TerrainService.getData(
      "http://47.96.133.22:1247/samplingPoint/getBoundaryPoints?cellid=106539780",
      (flag, res) => {
        if (flag) {
          const { data } = res;
          const polygon = new Polygon({});
          layer.addFeature(polygon.polygon);
          data.forEach((item, index) => {
            const geo = TransCoordinate.WGS84ToMercator({
              x: item.s_longitude,
              y: item.s_latitude,
              z: 10
            });
            polygon.polygon.addVertex(geo);
          });
        }
      }
    );
  };

  render() {
    const btnGroup = (
      <div className={css["text-center"]}>
        <Button type="primary" onClick={this.testStation}>
          获取
        </Button>
        <Button
          className={css["m-l-md"]}
          type="primary"
          onClick={this.getStation}
        >
          基站
        </Button>
        <Button
          className={css["m-l-md"]}
          type="primary"
          onClick={this.clearPoint}
        >
          清除
        </Button>
      </div>
    );
    return (
      <div>
        <VrpIcon
          iconName={"icon-excel"}
          className={css["vrp-menu-icon"]}
          title={"点位获取"}
          onClick={this.handleClick}
        />
        {this.state.isTest ? (
          <VrpModal
            defaultPosition={{ x: 30, y: 95 }}
            title="管道渲染"
            style={{ width: 300 }}
            footer={btnGroup}
            onClose={this.closeModal}
          >
            <Spin tip="数据正在加载中..." spinning={this.state.loading}>
              <div className={css["vrp-form"]} />
            </Spin>
          </VrpModal>
        ) : null}
      </div>
    );
  }
}

export default StationTest;
