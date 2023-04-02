import Config from "../../config/Config";
import Trans from "../../components/tools/Coordinate";
import TransCoordinate from "../../components/tools/Coordinate";
import { loadScript } from "../../utils/common";
import { message } from "antd";
import { Line, Terrain } from "../model/";
import { CadModuleData } from "../model/CAD";

interface line {
  p1: any;
  p2: any;
}
export default class Distance {
  static measureClick = async () => {
    const { maps, vrPlanner } = Config;
    let clickCount = 0;
    let firstClick = false;
    let firstGeo;
    let line: Line;
    let lineLayer;
    lineLayer = maps.getLayerById("auxiliary");
    if (!lineLayer) {
      lineLayer = new vrPlanner.Layer.FeatureLayer("auxiliary");
      maps.addLayer(lineLayer);
    }
    maps.bindEvent("click", async event => {
      const geo = event.getGeoLocation();
      if (geo) {
        if (event.isLeftClick()) {
          if (!clickCount) {
            line = new Line({ depthTest: false });
            lineLayer.addFeature(line.line);
            firstGeo = geo;
            line.addVertex(geo);
            line.addVertex(geo);
            clickCount++;
            maps.bindEvent("mousemove", mouseEvent => {
              if (!firstClick) {
                firstClick = true;
                maps.getGeoLocationAtScreenPos(
                  mouseEvent.getPageX(),
                  mouseEvent.getPageY(),
                  geoLocation => {
                    if (geoLocation.getGeoLocation()) {
                      line.setVertex(
                        line.getNumVertices() - 1,
                        geoLocation.getGeoLocation()
                      );
                    }
                    firstClick = false;
                  }
                );
              }
            });
          } else {
            const endGeo = geo;
            line.addVertex(geo);
            const { dis, unit } = TransCoordinate.getUnitVector(
              firstGeo,
              endGeo
            );
            const count = dis - (dis % 1);
            const unit_dis = dis / count;
            let list: any = [];
            const eles: any = [];
            const { terrains } = Terrain;
            const series: any = [];
            const legend: any = { data: [] };
            // terrains.forEach((item, index) => {
            //   index ? item.setVisible(false) : item.setVisible(true)
            // });
            // message.loading("计算中...", 0);
            // for (let i = 0; i < terrains.length; i++) {
            //   terrains[i].setVisible(true)
            //   if (i < terrains.length && i > 0) terrains[i - 1].setVisible(false);
            //   list = [];
            //   await new Promise((resolve, reject) => {
            //     for (let j = 0; j < count - 1; j++) {
            //       const geo = firstGeo.add(unit.mul(j));
            //       Config.maps.getElevationPrecise(geo.x(), geo.y()).done((ele) => {
            //         // list[j] = Number(ele.toFixed(4));
            //         list[j] = Math.round(ele * 1000) / 1000;
            //         if (j == count - 2) resolve();
            //       }).fail(reject)
            //     }
            //   })
            //   console.log(list + ",");
            //   series[i] = {
            //     type: "line",
            //     name: Terrain.terrains[i].title,
            //     data: list,
            //     areaStyle: {}
            //   }
            //   legend.data[i] = Terrain.terrains[i].title;
            //   eles.push(list);
            // }
            // const centerLine = eles[0].concat(eles[1]).sort((a, b) => a - b);
            // const centerData: any = [];
            // centerData.push([Math.round(count / 2), centerLine[0] - 5])
            // centerData.push([Math.round(count / 2), centerLine[centerLine.length - 1] + 5])
            // series.push({
            //   data: centerData,
            //   name: "航道中心线",
            //   smooth: false,
            //   itemStyle: {
            //     normal: {
            //       lineStyle: {
            //         width: 2,
            //         type: 'dotted'
            //       }
            //     }
            //   },
            //   type: 'line'
            // });
            // legend.data.push('航道中心线');
            // terrains.forEach(item => {
            //   item.setVisible(true)
            // });
            // message.destroy();
            // const layerIndex = Config.layer.index;
            const { a, b, c } = Trans.getDistance(firstGeo, endGeo);
            // const isNorth = firstGeo.y() > endGeo.y();
            // let area = 0;
            // const indexOf = eles[0].indexOf(centerLine[0]) === -1 ? eles[1].indexOf(centerLine[0]) : eles[0].indexOf(centerLine[0]);
            // const lasetOf = eles[0].lastIndexOf(centerLine[0]) === -1 ? eles[1].lastIndexOf(centerLine[0]) : eles[0].lastIndexOf(centerLine[0]);
            // for (let i = 0; i < 2; i++) {
            //   series.push({
            //     data: [
            //       [isNorth ? indexOf : lasetOf, centerLine[0] - 5],
            //       [isNorth ? indexOf : lasetOf, centerLine[centerLine.length - 1] + 5]
            //     ],
            //     markPoint: {
            //       data: [
            //         {
            //           symbolSize: 60,
            //           coord: [isNorth ? indexOf : lasetOf, centerLine[0]],
            //           value: centerLine[0]
            //         }
            //       ]
            //     },
            //     name: "北边线",
            //     smooth: false,
            //     itemStyle: {
            //       normal: {
            //         lineStyle: {
            //           width: 2,
            //           type: 'dotted'
            //         }
            //       }
            //     },
            //     type: 'line'
            //   });
            //   legend.data.push('北边线');
            //   series.push({
            //     data: [
            //       [isNorth ? lasetOf : indexOf, centerLine[0] - 5],
            //       [isNorth ? lasetOf : indexOf, centerLine[centerLine.length - 1] + 5]
            //     ],
            //     markPoint: {
            //       data: [
            //         {
            //           symbolSize: 60,
            //           coord: [isNorth ? lasetOf : indexOf, centerLine[0]],
            //           value: centerLine[0]
            //         }
            //       ]
            //     },
            //     name: "南边线",
            //     smooth: false,
            //     itemStyle: {
            //       normal: {
            //         lineStyle: {
            //           width: 2,
            //           type: 'dotted'
            //         }
            //       }
            //     },
            //     type: 'line'
            //   });
            //   legend.data.push('南边线');
            // }
            // for (let i = 0; i < count; i++) {
            //   if (i < count - 2) {
            //     area += Math.abs(eles[0][i] - eles[1][i]) + Math.abs(eles[0][i + 1] - eles[1][i + 1]) * a / count;
            //   }
            // }
            // Line.pipes.forEach(pipe => {
            //   console.log(pipe);
            // });
            // CadModuleData.datas.forEach(data => {
            //   console.log(data.layer.line);
            //   const { line } = data.layer;
            //   for (let key in line) {
            //     const pipe = line[key];

            //   }
            //   // data.layer.line.forEach(line => {
            //   //   console.log(line);
            //   // })
            // })
            // Config.layer.open({
            //   type: 1,
            //   content: `<div id='mes_box${layerIndex}' style='width:100%;height: inherit !important;'></div>`,
            //   area: [window.innerWidth / 2 + "px", window.innerHeight / 2 + "px"],
            //   shade: 0,
            //   // full: (layero) => {
            //   //   layero.find('iframe')[0].style.height = window.innerHeight - 54 + "px";
            //   //   // setIframeHeight(clientHeight);
            //   // },
            //   // restore: (layero) => {
            //   //   // setIframeHeight(500);
            //   //   layero.find('iframe')[0].style.height = 500 + "px";
            //   // },
            //   // resizing: (layero, index) => {
            //   //   console.log(layero.height());
            //   //   console.log(layero.width());
            //   // },
            //   success: (layero, index) => {
            //     Config.layer.setTop(layero);
            //     terrains.forEach(item => {
            //       item.setVisible(true)
            //     })
            //     const option = {
            //       legend,
            //       tooltip: {
            //         trigger: 'axis',
            //         formatter: () => {
            //           return `<div>面积差:${area.toFixed(1)}平方米</div>`;
            //         }
            //       },
            //       xAxis: [{
            //         type: "category",
            //         boundaryGap: false,
            //         data: series[0].data.map((e, i) => i - Math.round(count / 2))
            //       }],
            //       yAxis: {
            //         type: "value"
            //       },
            //       series
            //     };
            //     if (window.echarts) {
            //       const echarts = window.echarts.init(
            //         document.getElementById(`mes_box${layerIndex}`)
            //       );
            //       echarts.setOption(option, true);
            //     } else {
            //       loadScript(
            //         `${process.env.publicPath}chart/Js/chart/echarts.js`,
            //         "echarts",
            //         window.echarts
            //       )
            //         .then(
            //           () => {
            //             const echarts = window.echarts.init(
            //               document.getElementById(`mes_box${layerIndex}`)
            //             );
            //             echarts.setOption(option, true);
            //           }
            //         )
            //         .catch(err => console.table(err));
            //     }
            //   }
            // })
            const content = `<div>直线距离：${c.toFixed(2)}m</div>`;
            const d = `<div class="result2" style="display:inline-block;padding:6px;color: #fff; text-shadow: 2px 2px #333;background:rgba(0,0,0,0.65)">
                      ${content}<span class="hideText">水平距离：${a.toFixed(
              2
            )}m</br>高度差：${b.toFixed(2)}m</span>
                  </div>`;
            const balloon = new vrPlanner.Balloon(d);
            const midGeo = Trans.getMidPoint(firstGeo, endGeo);
            const midPoint = new vrPlanner.Feature.Point(midGeo);
            midPoint.setBalloon(balloon);
            lineLayer.addFeature(midPoint);
            firstGeo = endGeo;
          }
        }
        if (event.isRightClick()) {
          line.removeVertex(line.getNumVertices() - 1);
          clickCount = 0;
          maps.unbindEvent("mousemove");
        }
      }
    });
  };
}
