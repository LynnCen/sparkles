import { Component } from "react";
import VrpIcon from "../../components/VrpIcon";
import VrpModal from "../../components/VrpModal";
import {
  Button,
  Spin,
  Cascader,
  Radio,
  InputNumber,
  Slider,
  message
} from "antd";
import { CadModuleData } from "../../components/model/CAD";
// import * as XLSX from "xlsx";
import { Line, PipeLine, ModelBase } from "../../components/model/";
import RadioGroup from "antd/lib/radio/group";
import ColorPicker from "../../components/ColorPicker";
import FileReaderTool from "../../components/FileReaderTool";
import Config from "../../config/Config";
import TransCoordinate from "../../components/tools/Coordinate";

const css = require("../../styles/custom.css");

/**
 * @name Pipe
 * @author: bubble
 * @create: 2018/12/6
 * @description: 管道
 */

interface PipeProps {}

interface PipeStates {
  isPipe: boolean;
  color: string;
  width: number;
  loading: boolean;
  fileName: string;
  renderType: string;
}

class PipeTest extends Component<PipeProps, PipeStates> {
  DATA;

  constructor(props: PipeProps) {
    super(props);
    this.state = {
      isPipe: false,
      color: "#ffffff",
      width: 1,
      loading: false,
      fileName: "",
      renderType: "rain"
    };
  }

  setCamera = () => {
    const { maps, vrPlanner } = Config;
    const camera = maps.getCamera();
    const layer = maps.getLayerById("PipeLayer");
    const features = layer.getFeatureList();
    const feature = features[Math.floor(features.length / 2)];
    const geo = feature.getVertex(0);
    const v = new vrPlanner.Math.Double3(500, 600, 5000);
    camera.setPosition(geo.add(v), geo);
  };

  closeModal = () => {
    this.setState({
      isPipe: false
    });
  };

  colorChange = color => {
    this.setState({
      color
    });
  };

  handleClick = () => {
    this.setState({
      isPipe: true
    });
  };

  onImportExcel = file => {
    if (!file) return false;
    const { files } = file.target;
    let name;
    const fileReader = new FileReader();
    if (files.length > 0) {
      fileReader.readAsBinaryString(files[0]);
      name = files[0].name;
    }
    this.setState({ loading: true });
    fileReader.onload = async event => {
      const XLSX = await import(/* webpackChunkName: "xlsx" */ "xlsx")
        .then(r => r)
        .catch(message.error);
      try {
        const { result } = event.target;
        const workbook = XLSX.read(result, { type: "binary" });
        let data = []; // 存储获取到的数据
        for (const sheet in workbook.Sheets) {
          if (workbook.Sheets.hasOwnProperty(sheet)) {
            data = data.concat(
              XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
            );
            break;
          }
        }
        this.DATA = data;
        this.setState({ loading: false, fileName: name });
      } catch (e) {
        console.log(e);
        this.setState({
          loading: false
        });
        console.log("文件类型不正确");
        return;
      }
    };
    this.setState({
      loading: false
    });
  };

  widthChange = width => {
    this.setState({
      width
    });
  };

  componentDidCatch(error, info) {
    console.log(error);
    console.log(info);
  }

  renderPipe = () => {
    try {
      const data = this.DATA;
      let layer = Config.maps.getLayerById("testLayer");
      if (!layer) {
        layer = new Config.vrPlanner.Layer.FeatureLayer("testLayer");
        layer.setLodWindowSize(64);
        Config.maps.addLayer(layer);
      }
      let i = 0;
      const inter = setInterval(() => {
        const title = data[i]["title"];
        const position: string[] = data[i]["position"].split(";");
        let j = 0;
        const line = new Line({
          width: this.state.width,
          lineStyle: "cylinder",
          color: this.state.color
        });
        layer.addFeature(line.line);
        line.line.bindEvent("mouseenter", () => {
          line.setColor("#ffffffcc");
          line.line.bindEvent("mouseLeave", () => {
            line.setColor(line.color);
            line.line.unbindEvent("mouseLeave");
          });
        });
        const draw = setInterval(() => {
          const x = position[j].split(",")[0];
          const y = position[j].split(",")[1];
          const z = 100;
          const geo = TransCoordinate.WGS84ToMercator({ x, y, z });
          let isExist = false;
          if (line.vertices.length > 0) {
            for (let i = 0; i < line.vertices.length - 1; i++) {
              if (geo.distance(line.vertices[i]) < 1) {
                isExist = true;
              }
            }
          }
          if (!isExist) {
            line.addVertex(geo);
          }
          if (j >= position.length - 1) {
            clearInterval(draw);
          }
          j++;
        }, 20);
        if (i >= data.length - 1) {
          clearInterval(inter);
        }
        i++;
      }, 20);
    } catch (e) {
      message.error("文件格式不正确，请选择正确的文件");
    }
  };

  rendLine = () => {
    try {
      let layer = Config.maps.getLayerById("testLayer");
      if (!layer) {
        layer = new Config.vrPlanner.Layer.FeatureLayer("testLayer");
        layer.setLodWindowSize(64);
        Config.maps.addLayer(layer);
      }
      const data = this.DATA;
      let i = 0;
      const obj: any = {
        line: [],
        model: {}
      };
      if (data) {
        data.map(item => {
          if (item.type === "检修井" || item.type === "水表（井）") {
            let isExist = false;
            for (const key in obj.model) {
              if (item.s_num === key && key) isExist = true;
            }
            if (!isExist) {
              obj.model[item.s_num] = item;
            }
          }
        });
        const interval = setInterval(() => {
          if (i === data.length - 1) {
            clearInterval(interval);
          }
          for (let j = 0; j < data.length; j++) {
            if (
              data[i].s_num === data[j].e_num &&
              data[i].e_num === data[j].s_num
            ) {
              const vertices: any = [
                new Config.vrPlanner.GeoLocation(
                  Number(data[i].x),
                  Number(data[i].y),
                  Number(data[i].h)
                ),
                new Config.vrPlanner.GeoLocation(
                  Number(data[j].x),
                  Number(data[j].y),
                  Number(data[j].h)
                )
              ];
              const line = new Line({
                vertices,
                width: this.state.width,
                color: this.state.color,
                lineStyle: "cylinder"
              });
              const balloon = new Config.vrPlanner.Balloon();
              const html = `<div style="
                          display: inline-block;
                          background-color: #fff;
                          padding: 10px;
                          border-radius: 8px;
                          pointer-events: none;
                          ">
                              <div style="padding-top: 8px">
                                  <p>编号：${data[i].s_num}</p>
                                  <p>连接点：${data[i].e_num}</p>
                                  <p>管径：${data[i].d}</p>
                                  <p>埋深：${data[i].deep}</p>
                                  <p>材料：${data[i].material}</p>
                                  <p>填埋方式：${data[i].buried}</p>
                              </div>
                          </div>`;
              balloon.setOffsetY(15);
              balloon.setMessage(html);
              balloon.setVisible(false);
              line.line.setBalloon(balloon);
              line.line.isShow = false;
              line.line.bindEvent("click", () => {
                line.line.isShow = !line.line.isShow;
                line.line.getBalloon().setVisible(line.line.isShow);
                const color = [
                  line.style.getColor().getRed(),
                  line.style.getColor().getGreen(),
                  line.style.getColor().getBlue()
                ];
                if (line.line.isShow) {
                  line.style.setColor(
                    new Config.vrPlanner.Color(
                      color[0] * 2,
                      color[1] * 2,
                      color[2] * 2
                    )
                  );
                } else {
                  line.style.setColor(
                    new Config.vrPlanner.Color(
                      color[0] * 0.5,
                      color[1] * 0.5,
                      color[2] * 0.5
                    )
                  );
                }
              });
              layer.addFeature(line.line);
              break;
            }
          }
          i++;
        });
        for (const key in obj.model) {
          const item = obj.model[key];
          const model = new ModelBase({
            url: "/res/source/admin/test/pipe.a3x",
            geo: new Config.vrPlanner.GeoLocation(
              Number(item.x),
              Number(item.y),
              Number(item.h) - 2
            )
          });
          const balloon = new Config.vrPlanner.Balloon();
          const html = `<div style="
                          display: inline-block;
                          background-color: #fff;
                          padding: 10px;
                          border-radius: 8px;
                          pointer-events: none;
                          ">
                              <div style="padding-top: 8px">
                                  <p>编号：${item.s_num}</p>
                                  <p>连接点：${item.e_num}</p>
                                  <p>类型：${item.type}</p>
                                  <p>管径：${item.d}</p>
                                  <p>埋深：${item.deep}</p>
                                  <p>材料：${item.material}</p>
                                  <p>填埋方式：${item.buried}</p>
                              </div>
                          </div>`;
          balloon.setOffsetY(15);
          balloon.setMessage(html);
          balloon.setVisible(false);
          model.point.setBalloon(balloon);
          model.point.isShow = false;
          model.point.bindEvent("click", () => {
            model.point.isShow = !model.point.isShow;
            model.point.getBalloon().setVisible(model.point.isShow);
          });
          layer.addFeature(model.point);
        }
      }
    } catch (e) {
      message.error("文件格式不正确，请选择正确的文件");
    }
  };

  clearPipe = () => {
    let layer = Config.maps.getLayerById("testLayer");
    this.DATA = "";
    this.setState({
      fileName: ""
    });
    if (layer) {
      layer.clearFeatures();
    }
  };

  handleRender = () => {
    switch (this.state.renderType) {
      case "rain":
        this.rendLine();
        break;
      case "net":
        this.renderPipe();
        break;
      case "layout":
        this.renderLayout();
        break;
      case "lane":
        this.renderLane();
        break;
    }
  };

  renderLane = () => {
    try {
      this.setState({
        loading: true
      });
      const data = this.DATA;
      let layer = Config.maps.getLayerById("testLayer");
      if (!layer) {
        layer = new Config.vrPlanner.Layer.FeatureLayer("testLayer");
        layer.setLodWindowSize(64);
        Config.maps.addLayer(layer);
      }
      for (let i = 0; i < data.length; i++) {
        const line = new PipeLine({
          whethshare: false,
          color: this.state.color,
          width: this.state.width
        });
        layer.addFeature(line.line);
        const { position, type, name } = data[i];
        switch (type) {
          case "L":
            const positions = position.split(";");
            for (let j = 0; j < positions.length; j++) {
              const _p = positions[j].split(",");
              const geo = TransCoordinate.WGS84ToMercator({
                x: Number(_p[0]),
                y: Number(_p[1]),
                z: Number(_p[2]) + 10
              });
              line.addVertex(geo);
            }
            break;
        }
        if (i === data.length - 1) {
          this.setState({
            loading: false
          });
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  renderLayout = () => {
    try {
      this.setState({
        loading: true
      });
      const data = this.DATA;
      let layer = Config.maps.getLayerById("testLayer");
      if (!layer) {
        layer = new Config.vrPlanner.Layer.FeatureLayer("testLayer");
        layer.setLodWindowSize(64);
        Config.maps.addLayer(layer);
      }
      for (let i = 0; i < data.length; i++) {
        const line = new PipeLine({
          whethshare: false,
          color: this.state.color,
          width: this.state.width
        });
        layer.addFeature(line.line);
        const { position, sort, name } = data[i];
        switch (sort) {
          case "L":
            const positions = position.split(";");
            positions.forEach(p => {
              const _p = p.split(",");
              const geo = new Config.vrPlanner.GeoLocation(
                Number(_p[0]),
                Number(_p[1]),
                Number(_p[2]) + 10
              );
              line.addVertex(geo);
            });
            break;
        }
        if (i === data.length) {
          this.setState({
            loading: false
          });
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  handleChange = e => {
    this.setState({
      renderType: e.target.value
    });
  };

  render() {
    const btnGroup = (
      <div className={css["text-center"]}>
        <Button type="primary" onClick={this.handleRender}>
          渲染
        </Button>
        <Button
          className={css["m-l-md"]}
          type="primary"
          onClick={this.setCamera}
        >
          定位
        </Button>
        <Button
          className={css["m-l-md"]}
          type="primary"
          onClick={this.clearPipe}
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
          title={"管道渲染"}
          onClick={this.handleClick}
        />
        {this.state.isPipe ? (
          <VrpModal
            defaultPosition={{ x: 30, y: 95 }}
            title="管道渲染"
            style={{ width: 300 }}
            footer={btnGroup}
            onClose={this.closeModal}
          >
            <Spin tip="数据正在加载中..." spinning={this.state.loading}>
              <div className={css["vrp-form"]}>
                <div className={css["flex-center-left"]}>
                  <label className={css["flex-none-label"]}>Excel文件</label>
                  {/*<input type='file' accept='.xlsx, .xls' onChange={this.onImportExcel}/>*/}
                  <FileReaderTool
                    accept={".xlsx, .xls"}
                    multiple={false}
                    clickDom={
                      <Button type={"primary"} ghost>
                        选择
                      </Button>
                    }
                    fileData={this.onImportExcel}
                  />
                  <span className={css["m-l-sm"]}>{this.state.fileName}</span>
                </div>
                <div className={css["flex-center-left"]}>
                  <label className={css["flex-none-label"]}>线条颜色</label>
                  <ColorPicker
                    currentColor={this.state.color}
                    colorChange={this.colorChange}
                  />
                </div>
                <div className={css["flex-center-left"]}>
                  <label className={css["flex-none-label"]}>宽度</label>
                  <Slider
                    className={css["flex-auto"]}
                    min={1}
                    max={20}
                    step={1}
                    value={
                      typeof this.state.width === "number"
                        ? this.state.width
                        : 1
                    }
                    onChange={this.widthChange}
                  />
                  <InputNumber
                    min={1}
                    max={20}
                    step={1}
                    style={{ marginLeft: 16, width: 60 }}
                    size="small"
                    value={
                      typeof this.state.width === "number"
                        ? this.state.width
                        : 1
                    }
                    onChange={this.widthChange}
                  />
                </div>
                <div className={css["flex-center-left"]}>
                  <label className={css["flex-none-label"]}>数据类型</label>
                  <RadioGroup
                    defaultValue={this.state.renderType}
                    buttonStyle="solid"
                    onChange={this.handleChange}
                  >
                    <Radio.Button value="rain">雨水管道</Radio.Button>
                    <Radio.Button value="net">路线分布</Radio.Button>
                    <Radio.Button value="layout">十五里河</Radio.Button>
                    <Radio.Button value="lane">航道</Radio.Button>
                  </RadioGroup>
                </div>
              </div>
            </Spin>
          </VrpModal>
        ) : null}
      </div>
    );
  }
}

export default PipeTest;
