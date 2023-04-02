import { Component } from "react";
import VrpIcon from "../../components/VrpIcon";
import Config from "../../config/Config";
import Service from "../../services/TerrainService";
import VrpTips from "../../components/VrpTips";
import { notification } from "antd";
import Terrain from "../../components/model/Terrain";
import CustomFun from "../../config/CustomFun";
import DrawLines from "../../components/tools/DrawInit";

const css = require("../../styles/custom.css");

/**
 * @name Inundate
 * @author: bubble
 * @create: 2018/12/6
 * @description: 淹没
 */

interface IInundateProps {}

interface IInundateStates {
  drowningHeight: number;
  isDrowning: boolean;
  isStop: boolean;
  tempHeight: number;
  maxHeight: number;
  minHeight: number;
}

class Inundate extends Component<IInundateProps, IInundateStates> {
  constructor(props: IInundateProps) {
    super(props);
    this.state = {
      drowningHeight: 4.0,
      isDrowning: false,
      isStop: false,
      tempHeight: 1,
      maxHeight: 1,
      minHeight: 1
    };
  }
  handleKeyDown = e => {
    CustomFun.onKeyDown(e, 27, () => {
      notification.destroy();
      DrawLines.DrawInit();
      window.removeEventListener("keydown", this.handleKeyDown);
    });
  };

  DrowningStart = (_layer, stratHeight) => {
    const vrPlanner = Config.vrPlanner;
    const heightInterPol = vrPlanner.Interpolation.CubicBezier.EASE_OUT;
    const heightTransTime = (this.state.maxHeight - this.state.minHeight) * 2;
    const heightTrans = new vrPlanner.Transition(
      heightTransTime,
      heightInterPol
    );
    const style = new vrPlanner.Style.ExtrudeStyle();
    style.setHeight(stratHeight);
    style.setColor(new vrPlanner.Color("58C3E0CC"));
    style.bindTransition("height", heightTrans);
    return style;
  };

  DrowningStop = e => {
    const { maps } = Config;
    switch (e.key) {
      case " ":
        this.setState(
          {
            isStop: !this.state.isStop
          },
          () => {
            const layer = maps.getLayerById("floodlayer");
            const List = layer.getFeatureList();
            for (const polygon of List) {
              if (this.state.isStop) {
                this.setState(
                  {
                    tempHeight: polygon.getStyle().getHeight()
                  },
                  () => {
                    polygon
                      .getStyle()
                      .setHeight(polygon.getStyle().getHeight());
                  }
                );
              } else {
                polygon.getStyle().setHeight(this.state.maxHeight);
              }
            }
          }
        );
        break;
      case "Escape":
        this.setState(
          {
            isDrowning: false
          },
          () => {
            notification.destroy();
            maps.removeLayer("floodlayer");
            window.removeEventListener("keydown", this.DrowningStop);
          }
        );
        break;
    }
  };

  showTips = () => {
    VrpTips.showTips(
      "淹没",
      <div>
        <p className={css["m-b-sm"]}>淹没模拟已开始，请耐心等待</p>
        <p className={css["m-b-sm"]}>退出淹没（ESC）</p>
      </div>,
      280
    );
  };

  getHeight = (url, terrain) => {
    return new Promise((resolve, reject) => {
      Service.getData(url + "/layer_settings.json", (flag, res) => {
        if (flag) {
          const { center, halfLengths } = res.innerBounds;
          const maxHeight = halfLengths[2] * 1.5 + terrain.altitude;
          const minHeight =
            center[2] - halfLengths[2] + terrain.altitude > 1
              ? center[2] - halfLengths[2] + terrain.altitude
              : 1;
          resolve({ maxHeight, minHeight });
        } else {
          reject({ maxHeight: 1, minHeight: 150 });
        }
      });
    });
  };

  Drowning = () => {
    const maps = Config.maps;
    const vrPlanner = Config.vrPlanner;
    const List = maps.getLayerList();
    const pointArry: any[] = [];
    this.setState(
      {
        isDrowning: !this.state.isDrowning
      },
      () => {
        if (this.state.isDrowning) {
          this.showTips();
          window.addEventListener("keydown", this.DrowningStop);
          // const { minHeight, maxHeight } = this.state;
          let _minHeight = 1;
          let _maxHeight = 1;
          const terrainList: Terrain[] = Terrain.terrains;
          // List.map((item, index) => {
          //   if (item.indexOf("terrain") >= 0) {
          //     terrainList.push(item);
          //   }
          // });
          if (terrainList.length > 0) {
            terrainList.map((item, index) => {
              // const terrain = maps.getLayerById(item);
              const terrain = item;
              pointArry.push(terrain.getInnerBounds());
              const url = terrain.url;
              this.getHeight(url, terrain).then(
                (res: { maxHeight: number; minHeight: number }) => {
                  _minHeight =
                    _minHeight > res.minHeight
                      ? res.minHeight > 1
                        ? res.minHeight
                        : 1
                      : _minHeight;
                  _maxHeight =
                    _maxHeight > res.maxHeight ? _maxHeight : res.maxHeight;
                  if (index === terrainList.length - 1) {
                    this.setState(
                      {
                        minHeight: _minHeight,
                        maxHeight: _maxHeight
                      },
                      () => {
                        const _layer =
                          maps.getLayerById("floodlayer") ||
                          new vrPlanner.Layer.FeatureLayer("floodlayer");
                        const newPointArry = this.getNewPointArry(pointArry);
                        newPointArry.map(item => {
                          const minX = item[0];
                          const minY = item[1];
                          const maxX = item[2];
                          const maxY = item[3];
                          const polygon = new vrPlanner.Feature.Polygon();
                          polygon.addVertex(
                            new vrPlanner.GeoLocation(
                              minX,
                              minY,
                              this.state.minHeight < 1
                                ? 1
                                : this.state.minHeight
                            )
                          );
                          polygon.addVertex(
                            new vrPlanner.GeoLocation(
                              minX,
                              maxY,
                              this.state.minHeight < 1
                                ? 1
                                : this.state.minHeight
                            )
                          );
                          polygon.addVertex(
                            new vrPlanner.GeoLocation(
                              maxX,
                              maxY,
                              this.state.minHeight < 1
                                ? 1
                                : this.state.minHeight
                            )
                          );
                          polygon.addVertex(
                            new vrPlanner.GeoLocation(
                              maxX,
                              minY,
                              this.state.minHeight < 1
                                ? 1
                                : this.state.minHeight
                            )
                          );
                          const style = this.DrowningStart(
                            _layer,
                            this.state.minHeight < 1 ? 1 : this.state.minHeight
                          );
                          polygon.setStyle(style);
                          _layer.addFeature(polygon);
                          style.setHeight(this.state.maxHeight);
                        });
                        maps.addLayer(_layer);
                      }
                    );
                  }
                }
              );
            });
          }
        } else {
          notification.destroy();
          maps.removeLayer("floodlayer");
          window.removeEventListener("keydown", this.DrowningStop);
        }
      }
    );
  };

  getNewPointArry = pointArry => {
    let isFixed = false;
    for (let i = 0; i < pointArry.length - 1; i++) {
      for (let j = i + 1; j < pointArry.length; j++) {
        const minX1 = pointArry[i][0];
        const minY1 = pointArry[i][1];
        const maxX1 = pointArry[i][2];
        const maxY1 = pointArry[i][3];
        const minX2 = pointArry[j][0];
        const minY2 = pointArry[j][1];
        const maxX2 = pointArry[j][2];
        const maxY2 = pointArry[j][3];
        if (
          maxX1 - minX1 + maxX2 - minX2 >=
            Math.abs(minX2 + maxX2 - minX1 - maxX1) &&
          maxY1 - minY1 + maxY2 - minY2 >=
            Math.abs(minY2 + maxY2 - minY1 - maxY1)
        ) {
          isFixed = true;
          const minX = minX1 > minX2 ? minX2 : minX1;
          const maxX = maxX1 > maxX2 ? maxX1 : maxX2;
          const minY = minY1 > minY2 ? minY2 : minY1;
          const maxY = maxY1 > maxY2 ? maxY1 : maxY2;
          const newPoints = [minX, minY, maxX, maxY];
          pointArry.splice(j, 1);
          pointArry.splice(i, 1, newPoints);
        }
      }
    }
    if (isFixed) {
      pointArry = this.getNewPointArry(pointArry);
    }
    return pointArry;
  };

  render() {
    return (
      <div>
        <VrpIcon
          className={
            css["vrp-menu-icon"] +
            " " +
            (this.state.isDrowning ? css["active"] : "")
          }
          onClick={this.Drowning}
          iconName={"icon-submerge"}
          title={"淹没"}
        />
      </div>
    );
  }
}

export default Inundate;
