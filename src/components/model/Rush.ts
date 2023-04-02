import { Terrain, PipeLine } from "./";
import Config from "../../config/Config";
import { message } from "antd";
import TransCoordinate from "../tools/Coordinate";
import { CadModuleData, ExcelData } from "./CAD";
import Tools from "../tools/Tools";
// import * as echarts from 'echarts';

interface terrain {
  terrain: Terrain;
  setData: string[];
}

interface line {
  value: string[];
  line: any;
  setData: string[];
}

interface settings {
  width: number;
  deep: number;
  // scale: number,
}

export class Rush {
  static rushs: Rush[] = [];
  title: string;
  terrains: terrain[] = [];
  id: number;
  settings: settings = {
    deep: 0,
    width: 0
  };
  high: [
    {
      name: string;
      height: number;
    }
  ] = [{ name: "", height: 0 }];
  sectionLine: line;
  deputyLine: line[] = [];
  isNew: boolean = false;
  features: any[] = [];
  centerLine: line;
  private temp_data: any;
  constructor({
    terrainSetList = [],
    deep = 0,
    width = 0,
    high = [
      {
        name: "",
        height: 0
      }
    ],
    centerLine = {
      value: [],
      setData: [],
      line: {}
    },
    lineSetList = [],
    sectionLine = {
      value: [],
      setData: [],
      line: {}
    },
    title = "未命名",
    id = 0
  }) {
    terrainSetList.forEach((item: any) => {
      if (item.value) {
        const terrain = Terrain.getById(item.value);
        if (terrain) {
          this.terrains.push({ terrain, setData: [] });
        }
      }
    });
    this.id = id;
    this.title = title;
    this.settings.deep = deep;
    this.settings.width = width;
    high.forEach((item, index) => {
      this.high[index] = item;
    });
    lineSetList.forEach((item: any, index) => {
      this.deputyLine[index] = {
        value: item.value,
        setData: item.setData,
        line: []
      };
    });
    this.sectionLine = sectionLine;
    this.centerLine = centerLine;
  }

  init() {}

  async save(state: any) {
    const {
      name,
      sectionLine,
      configData,
      lineSetList,
      centerLine,
      high
    } = state;
    this.title = name;
    this.sectionLine = sectionLine;
    this.settings = configData;
    this.terrains = state.terrainSetList;
    this.deputyLine = lineSetList;
    this.centerLine = centerLine;
    this.high = high;
    if (this.isNew) {
      this.isNew = false;
    } else {
    }
  }

  preview(state: any) {
    this.calculation(state);
  }

  private calculation = async (state: any) => {
    const {
      terrainSetList: terrains,
      sectionLine,
      lineSetList,
      configData,
      centerLine,
      high,
      isChange
    } = state;
    let temp_sectionLine: any = sectionLine.line;
    if (temp_sectionLine.constructor !== Array) {
      temp_sectionLine = temp_sectionLine.pipes;
    }
    if (isChange) {
      const { maps } = Config;
      let mapIsVisble = false;
      const mapLayer = maps.getLayerById("maps");
      if (mapLayer) {
        mapIsVisble = mapLayer.isVisible();
        if (mapIsVisble) mapLayer.setVisible(false);
      }
      let max = 0,
        min = -5;
      message.loading("计算中...", 0);
      Terrain.terrains.forEach(item => {
        item.setVisible(false);
      });
      const temp_data: any = new Array(temp_sectionLine.length);
      temp_sectionLine.forEach((item, index) => {
        temp_data[index] = {
          title: item.title,
          min,
          max,
          data: [],
          centerIndex: [],
          deputyIndex: [],
          count: 0
        };
      });
      for (let i = 0; i < terrains.length; i++) {
        const _list: any = [];
        terrains[i].terrain.setVisible(true);
        if (i < terrains.length && i > 0)
          terrains[i - 1].terrain.setVisible(false);
        await Promise.all(
          temp_sectionLine.map(async (feature, index) => {
            const array_data = temp_data[index];
            let _index = 0;
            let list: any = [];
            let [...temp] = feature.getVertices();
            let center = this.getCross(temp, centerLine);
            temp = center.temp;
            let deputy: any = [];

            lineSetList.forEach(item => {
              const _deputy = this.getCross(temp, item);
              deputy.push(_deputy);
              temp = _deputy.temp;
            });
            for (let j = 0; j < temp.length - 1; j++) {
              const firstGeo = temp[j];
              const endGeo = temp[j + 1];
              const { dis, unit } = TransCoordinate.getUnitVector(
                firstGeo,
                endGeo
              );
              const { a: levelDis } = TransCoordinate.getDistance(
                firstGeo,
                endGeo
              );
              const count = dis - (dis % 1);
              const unit_dis = levelDis / dis;
              center.vertexList.forEach(item => {
                if (
                  item.vertex.x() === firstGeo.x() &&
                  item.vertex.y() === firstGeo.y()
                ) {
                  array_data.centerIndex.push({
                    index: _index,
                    title: item.title
                  });
                }
              });
              deputy.forEach(item => {
                item.vertexList.forEach(_item => {
                  if (
                    _item.vertex.x() === firstGeo.x() &&
                    _item.vertex.y() === firstGeo.y()
                  ) {
                    array_data.deputyIndex.push({
                      index: _index,
                      title: _item.title
                    });
                  }
                });
              });
              for (let k = 0; k < count; k++) {
                const geo = firstGeo.add(unit.mul(k > dis ? dis : k));
                await new Promise((resolve, reject) => {
                  maps
                    .getElevationPrecise(geo.x(), geo.y())
                    .done(ele => {
                      if (ele) {
                        const val = Math.round(ele * 1000) / 1000;
                        array_data.min = Math.min(array_data.min, val);
                        array_data.max = Math.max(array_data.max, val);
                        list[_index] = val;
                        _index++;
                        resolve();
                      }
                    })
                    .fail(reject);
                });
              }
            }
            _list.push({ title: feature.title, list });
            array_data.count = _index + 1;
            array_data.data.push({ title: terrains[i].terrain.title, list });
          })
        );
      }
      const blob = new Blob([JSON.stringify(temp_data)], {
        type: "application/json"
      });
      const formData = new FormData();
      formData.append("files", blob);
      message.destroy();
      Terrain.terrains.forEach(item => {
        item.setVisible(true);
      });
      if (mapLayer) {
        if (mapIsVisble) mapLayer.setVisible(mapIsVisble);
      }
      this.temp_data = temp_data;
    }
    this.showLayer(temp_sectionLine, configData, high);
  };

  private showLayer(temp_sectionLine: any, configData: any, high: any) {
    const options: any = [];
    const markData: any = [];
    high &&
      high.forEach(item => {
        item.name &&
          markData.push({
            name: item.name,
            yAxis: item.height,
            label: {
              formatter: "{b} : {c} m",
              position: "insideEndTop"
            }
          });
      });
    this.temp_data.forEach(item => {
      const legend: any = {
        data: []
      };
      const { data, count, centerIndex, deputyIndex, max, min } = item;
      const series: any = [];
      data.forEach((_item, index) => {
        legend.data.push(_item.title);
        series.push({
          type: "line",
          name: _item.title,
          data: _item.list,
          markLine: {
            data: index ? [] : markData,
            label: {
              distance: [10, 8]
            }
          }
        });
      });
      // for (let key in configData) {
      //     const val = configData[key];
      //     let text: string = "";
      //     switch (key) {
      //         case "deep":
      //             text = "计算超深：" + val;
      //             break;
      //         case "width":
      //             text = "计算超宽：" + val;
      //             break;
      //     }

      //     val && series.push({
      //         type: 'custom',
      //         renderItem: (params, api) => this.renderText(params, api, text, min + (max - min) / 10),
      //         name,
      //         itemStyle: {
      //             borderWidth: 0
      //         },
      //     })
      // }

      for (let i = 0; i < data.length - 1; i++) {
        const a = data[i];
        for (let j = i + 1; j < data.length; j++) {
          const b = data[j];
          const polygonData: any = [];
          const name = a.title + "-" + b.title;
          for (let k = 0; k < a.list.length; k++) {
            polygonData.push([k, a.list[k]]);
          }
          for (let k = b.list.length - 1; k > -1; k--) {
            polygonData.push([k, b.list[k]]);
          }
          const serie = {
            type: "custom",
            renderItem: (params, api) =>
              this.renderPolygon(params, api, polygonData),
            data: polygonData,
            name,
            itemStyle: {
              borderWidth: 0
            }
          };
          series.push(serie);
          // legend.data.push(name)
        }
      }
      centerIndex.forEach(_item => {
        const lineData: any = [];
        lineData.push([_item.index, min]);
        lineData.push([_item.index, max]);
        series.push({
          data: lineData,
          name: _item.title,
          smooth: false,
          itemStyle: {
            normal: {
              lineStyle: {
                width: 2,
                type: "dotted"
              }
            }
          },
          type: "line"
        });
        legend.data.push(_item.title);
      });
      deputyIndex.forEach(_item => {
        const lineData: any = [];
        lineData.push([_item.index, min]);
        lineData.push([_item.index, max]);
        series.push({
          data: lineData,
          name: _item.title,
          smooth: false,
          itemStyle: {
            normal: {
              lineStyle: {
                width: 2,
                type: "dotted"
              }
            }
          },
          type: "line"
        });
        legend.data.push(_item.title);
      });
      const option = {
        legend,
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: data[0].list.map(
              (e, i) => i - (centerIndex[0] ? centerIndex[0].index : 0)
            )
          }
        ],
        yAxis: {
          name: "海拔高度(m)",
          type: "value"
        },
        series
      };
      options.push(option);
    });
    const { layer } = Config;

    let _index = 0;
    const layerIndex = layer.index;
    let echart: any;
    layer.open({
      type: 1,
      content: `<div id='mes_box${layerIndex}' style='width:100%;height: inherit !important;'>
                <div id="mes_boxLBtn${layerIndex}" style="
                          position: absolute;
                          top: calc(50% - 50px);
                          width: 30px;
                          height: 50px;
                          line-height: 50px;
                          left:10px;
                          text-align: center;
                          border-radius: 15px;
                          background-color: rgba(108,108,108,.6);
                          cursor: pointer;
                          user-select: none;
                          z-index:2;
                   "><</div>
                  <div id="mes_boxRBtn${layerIndex}" style="
                          position: absolute;
                          top: calc(50% - 50px);
                          width: 30px;
                          height: 50px;
                          right:10px;
                          line-height: 50px;
                          text-align: center;
                          border-radius: 15px;
                          background-color: rgba(108,108,108,.6);
                          cursor: pointer;
                          user-select: none;
                          z-index:2;
                   ">></div>
                   <div id='mes_boxContainer${layerIndex}' style="
                          position:absolute;
                          width:100%;
                          height: inherit !important;">
                    </div>
            </div>`,
      area: [window.innerWidth * 0.5 + "px", window.innerHeight * 0.5 + "px"],
      shade: 0,
      end: () => {
        temp_sectionLine[_index].setWidth(1);
      },
      // maxmin: true,
      // full: (layero) => {
      //   layero.find('iframe')[0].style.height = window.innerHeight - 54 + "px";
      //   // setIframeHeight(clientHeight);
      // },
      // restore: (layero) => {
      //   // setIframeHeight(500);
      //   layero.find('iframe')[0].style.height = 500 + "px";
      // },
      resizing: (layero, index) => {
        const btnL = document.getElementById(`mes_boxLBtn${layerIndex}`);
        const btnR = document.getElementById(`mes_boxRBtn${layerIndex}`);
        btnL && (btnL.style.top = (layero.height() - 54) / 2 + "px");
        btnR && (btnR.style.top = (layero.height() - 54) / 2 + "px");
        echart.resize({
          width: layero.width() + "px",
          height: layero.height() - 54 + "px"
        });
      },
      success: (layero, index) => {
        layer.setTop(layero);
        const btnL = document.getElementById(`mes_boxLBtn${layerIndex}`);
        const btnR = document.getElementById(`mes_boxRBtn${layerIndex}`);
        const container = document.getElementById(
          `mes_boxContainer${layerIndex}`
        );

        echart = window["echarts"].init(container, {
          width: "auto",
          height: "auto"
        });
        echart.setOption(options[_index], true);
        echart.on("click", params => {
          // console.log(params.info);
        });
        layer.title(this.temp_data[_index].title, layerIndex);
        temp_sectionLine[_index].setWidth(5);
        btnL &&
          (btnL.onclick = () => {
            temp_sectionLine[_index].setWidth(1);
            _index--;
            _index = _index < 0 ? options.length - 1 : _index;
            echart.setOption(options[_index], true);
            layer.title(this.temp_data[_index].title, layerIndex);
            temp_sectionLine[_index].setWidth(5);
          });
        btnR &&
          (btnR.onclick = () => {
            temp_sectionLine[_index].setWidth(1);
            _index++;
            _index = _index > options.length - 1 ? 0 : _index;
            echart.setOption(options[_index], true);
            layer.title(this.temp_data[_index].title, layerIndex);
            temp_sectionLine[_index].setWidth(5);
          });
      }
    });
  }
  getCross = (base: any, deputy: any) => {
    let [...temp] = base;
    let temp_deputy = deputy.line;
    if (temp_deputy.constructor !== Array) {
      temp_deputy = temp_deputy.pipes;
    }
    let count = 0;
    let vertexList: any = [];
    for (let i = 0; i < base.length - 1; i++) {
      const geo1 = base[i];
      const geo2 = base[i + 1];
      const line1 = { geo1, geo2 };
      temp_deputy &&
        temp_deputy.forEach(item => {
          const temp_vertices = item.getVertices();
          for (let j = 0; j < temp_vertices.length - 1; j++) {
            const _geo1 = temp_vertices[j];
            const _geo2 = temp_vertices[j + 1];
            const line2 = { geo1: _geo1, geo2: _geo2 };
            const res = this.getIntersection(line1, line2);
            if (res) {
              count++;
              const vertex = new Config.vrPlanner.GeoLocation(res.x, res.y, 0);
              vertexList.push({ vertex, title: item.title });
              temp.splice(i + count, 0, vertex);
            }
          }
        });
    }
    return { temp, vertexList };
  };

  async getLine(data: any) {
    const { maps, vrPlanner } = Config;
    const type = data[0];
    switch (type) {
      case "pipeline":
        return [PipeLine.getById(data[1])];
      case "silt":
        const layer = new vrPlanner.Layer.FeatureLayer(Tools.createId());
        maps.addLayer(layer);
        const excel = ExcelData.getSiltById(data[1]);
        const file = excel.getFileById(data[2]);
        const pipes = await this.getExcel(
          excel.coordinate,
          file.jsonUrl,
          layer
        );
        return { layer, pipes };
    }
  }

  private async getExcel(coordinate, url, layer?) {
    return fetch(Config.apiHost + url, {
      mode: "cors"
    })
      .then(res => {
        return res.json();
      })
      .then(res => {
        let pipes: PipeLine[] = [];
        res.forEach(item => {
          const position = item.position;
          let positions: any;
          positions = position.split(";");
          let temp_vertices: any = [];
          if (positions) {
            for (let j = 0; j < positions.length; j++) {
              const _p = positions[j].split(",");
              let geo = CadModuleData.getGeo(coordinate, _p);
              temp_vertices.push(geo);
            }
          }
          const pipe = new PipeLine({
            vertices: temp_vertices,
            depthTest: false,
            title: item.name
          });
          pipe.init();
          if (layer) {
            layer.addFeature(pipe.line);
          }
          pipes.push(pipe);
        });
        console.log(pipes);
        return pipes;
      });
  }

  private getGeo(coordinate, position) {
    const { vrPlanner } = Config;
    if (coordinate === "84坐标系") {
      return TransCoordinate.WGS84ToMercator({
        x: Number(position[0]),
        y: Number(position[1]),
        z: Number(position[2])
      });
    } else {
      return new vrPlanner.GeoLocation(
        Number(position[0]),
        Number(position[1]),
        Number(position[2])
      );
    }
  }

  private renderPolygon(params, api, data) {
    if (params.context.rendered) {
      return;
    }
    params.context.rendered = true;

    const points = [];
    let area = 0;
    for (let i = 0; i < data.length; i++) {
      points.push(api.coord(data[i]));
      if (i < data.length / 2) {
        area += ((data[i][1] + data[i + data.length / 2][1]) / 2) * 0.82;
      }
    }
    const color = api.visual("color");
    return {
      type: "polygon",
      shape: {
        points: window["echarts"].graphic.clipPointsByRect(points, {
          x: params.coordSys.x,
          y: params.coordSys.y,
          width: params.coordSys.width,
          height: params.coordSys.height
        })
      },
      style: api.style({
        fill: color,
        stroke: window["echarts"].color.lift(color)
      }),
      info: data
    };
  }

  private renderText(params, api, text, val) {
    if (params.context.rendered) {
      return;
    }
    params.context.rendered = true;

    return {
      type: "text",
      style: {
        text,
        font: '16px "Microsoft YaHei"',
        fill: "#f00",
        lineWidth: 0,
        x: params.coordSys.width,
        y: api.coord([params.coordSys.width, val])[1]
      }
    };
  }

  private getFun({ geo1, geo2 }) {
    const k = (geo1.y() - geo2.y()) / (geo1.x() - geo2.x());
    const b = geo1.y() - k * geo1.x();
    return { k, b };
  }

  private getIntersection(line1: any, line2: any) {
    const a = this.getFun(line1);
    const b = this.getFun(line2);
    const x = (a.b - b.b) / (b.k - a.k);
    const y = b.k * x + b.b;
    const maxX1 = Math.max(line1.geo1.x(), line1.geo2.x());
    const minX1 = Math.min(line1.geo1.x(), line1.geo2.x());
    const maxY1 = Math.max(line1.geo1.y(), line1.geo2.y());
    const minY1 = Math.min(line1.geo1.y(), line1.geo2.y());
    const maxX2 = Math.max(line2.geo1.x(), line2.geo2.x());
    const minX2 = Math.min(line2.geo1.x(), line2.geo2.x());
    const maxY2 = Math.max(line2.geo1.y(), line2.geo2.y());
    const minY2 = Math.min(line2.geo1.y(), line2.geo2.y());
    if (
      x > minX1 &&
      x < maxX1 &&
      y > minY1 &&
      y < maxY1 &&
      x > minX2 &&
      x < maxX2 &&
      y > minY2 &&
      y < maxY2
    )
      return { x, y };
    else return false;
  }
  static addRush(rush: Rush) {
    this.rushs.push(rush);
  }

  static getRushById(id: number) {
    for (let i = 0; i < this.rushs.length; i++) {
      if (this.rushs[i].id === id) {
        return this.rushs[i];
      }
    }
    return null;
  }
}
