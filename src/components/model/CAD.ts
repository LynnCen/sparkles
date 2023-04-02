import { message } from "antd";
import Config from "../../config/Config";
import TransCoordinate from "../tools/Coordinate";
import { PipeLine, Geometry } from "./";
import Tools from "../tools/Tools";
import Mark from "./Mark";

interface base {
  altitude: number;
  color: string;
  isShare: number;
}

interface font extends base {
  size: number;
  iconUrl: string;
  iconIsShow: number;
}

interface line extends base {
  isDepth: number;
  isLevel: number;
  width: number;
  style: string;
}

interface block extends base {
  height: number;
  isLevel: number;
  opacity: number;
}

interface data {
  id: number;
  name: string;
  type: string;
  coordinate: string;
}

interface file {
  id: number;
  fileName: string;
  type: string;
  jsonUrl: string;
  coordinate: string;
}
/**
 * @description Cad数据
 * @author Daryl
 */
export class ExcelData {
  id: number;
  name: string;
  type: string;
  coordinate: string;
  files: any = {};
  static siltData: ExcelData[] = [];
  constructor(data: data) {
    this.id = data.id;
    this.name = data.name;
    this.type = data.type;
    this.coordinate = data.coordinate;
  }

  /**
   * @description 添加子文件对象
   * @param CadFile file对象
   * @author Daryl
   */
  addFile(CadFile: ExcelFile) {
    this.files[CadFile.id] = CadFile;
  }

  static addSilt(data: ExcelData) {
    this.siltData.push(data);
  }

  static getSiltById(id: number) {
    let data: any = null;
    for (let i = 0; i < this.siltData.length; i++) {
      if (this.siltData[i].id === id) {
        data = this.siltData[i];
        break;
      }
    }
    return data;
  }

  getFileById(id: number) {
    return this.files[id];
  }
}

/**
 * @description Cad数据子文件
 * @author Daryl
 */
export class ExcelFile {
  id: number;
  fileName: string;
  type: string;
  jsonUrl: string;
  coordinate: string;
  constructor(file: file) {
    this.id = file.id;
    this.fileName = file.fileName;
    this.type = file.type;
    this.jsonUrl = file.jsonUrl;
    this.coordinate = file.coordinate;
  }
}

/**
 * @description Cad数据面板
 * @author Daryl
 */
export class CadModuleData {
  static datas: any = [];
  title: string;
  position: any = [];
  lookAt: any = [];
  isShow: boolean;
  id: string;
  cadData: any = {};
  font: [];
  attr: {
    font: font;
    line: line;
    block: block;
  };
  layer: {
    font: any;
    line: any;
    block: any;
  };
  newFiles: any = [];
  removeFiles: any = [];
  constructor({
    font = {
      size: 14,
      color: "#fff",
      altitude: 25,
      iconUrl: "/res/image/icon/admin/21971565344686676.jpg",
      iconIsShow: 1,
      isShare: 0
    },
    line = {
      isDepth: 1,
      isLevel: 0,
      style: "flat2d",
      width: 1,
      altitude: 1,
      color: "#fff",
      isShare: 0
    },
    block = {
      isLevel: 0,
      height: 1,
      altitude: 0,
      opacity: 1,
      color: "#7ED321",
      isShare: 0
    },
    isShow = 1,
    title = "未命名",
    position,
    lookAt,
    list
  }) {
    this.id = Tools.createId();
    this.isShow = Boolean(isShow);
    this.title = title;
    this.position = position;
    this.lookAt = lookAt;
    this.attr = {
      font,
      line,
      block
    };
    if (list && list.length)
      list.forEach(item => {
        const cadData = new ExcelData(item);
        item.cadFileVoList.forEach(_item => {
          const file = new ExcelFile(
            Object.assign(_item, { coordinate: item.coordinate })
          );
          cadData.addFile(file);
        });
        this.cadData[item.id] = cadData;
      });
    this.layer = {
      font: {},
      line: {},
      block: {}
    };
  }

  setLineStyle(style: string) {
    const layers = this.layer.line;
    for (const _key in layers) {
      const pipes = layers[_key].data;
      pipes.forEach(pipe => {
        pipe.setLineStyle(style);
      });
    }
  }

  /**
   * @description 相机定位
   * @author Daryl
   */
  focus() {
    const { maps, vrPlanner } = Config;
    const { lookAt, position } = this;
    if (lookAt.length && position.length) {
      const l = new vrPlanner.GeoLocation(lookAt[0], lookAt[1], lookAt[2]);
      const p = new vrPlanner.GeoLocation(
        position[0],
        position[1],
        position[2]
      );
      const camera = maps.getCamera();
      camera.setPosition(p, l);
    } else {
      let layer: any,
        isExist = false;
      for (const key in this.layer) {
        for (const _key in this.layer[key]) {
          if (!isExist) {
            if (this.layer[key][_key]) {
              isExist = true;
              layer = this.layer[key][_key];
            }
          } else break;
        }
        if (isExist) break;
      }
      layer.focus();
    }
  }

  init({ font, line, block } = this.attr) {
    const TYPE = {
      L: "line",
      T: "font",
      CL: "block"
    };
    this.fontInit({ font });
    this.lineInit({ line });
    this.blockInit({ block });
    this.newFiles.forEach(file => {
      this.removeFile(file);
    });
    this.newFiles = [];
    this.removeFiles.forEach(file => {
      this.renderAlone(this.attr[TYPE[file.type]], file);
    });
    this.setVisible(this.isShow);
  }

  fontInit({ font = this.attr.font }) {
    this.setFont(font);
    this.setFontAltitude(font.altitude);
  }

  lineInit({ line = this.attr.line }) {
    this.setLine(line);
  }

  blockInit({ block = this.attr.block }) {
    this.setBlockAltitude(block.altitude, Boolean(block.isLevel));
    this.setBlockColor(block.color);
    this.setBlockHeight(block.height);
  }

  /**
   * @description 修改字体样式
   * @param attr interface font
   * @author Daryl
   */
  setFont(attr: font) {
    const { font } = this.layer;
    for (const key in font) {
      font[key].data.forEach(mark => {
        const _attr = {
          fontColor: attr.color,
          title: mark.title,
          fontSize: attr.size,
          icon: attr.iconUrl,
          titleVisible: true,
          iconVisible: Boolean(attr.iconIsShow)
        };
        mark.setIcon(_attr);
      });
    }
  }

  /**
   * @description 修改字体海拔高度
   * @param altitude 海拔
   * @author Daryl
   */
  setFontAltitude(altitude: number) {
    const { font } = this.layer;
    for (const key in font) {
      font[key].data.forEach(mark => {
        mark.setHeight(altitude);
      });
    }
  }

  /**
   * @description 修改线样式
   * @param attr interface line
   * @author Daryl
   */
  setLine(attr: line) {
    const { line } = this.layer;
    for (const key in line) {
      line[key].data.forEach(pipe => {
        const _attr = {
          width: attr.width,
          altitude: attr.altitude,
          style: attr.style,
          isDepth: !Boolean(attr.isDepth),
          color: attr.color,
          isLevel: Boolean(attr.isLevel),
          isShare: Boolean(attr.isShare)
        };
        pipe.set(_attr);
      });
    }
  }

  /**
   * @description 设置体块高度
   * @param height 体块高度
   * @author Daryl
   */
  setBlockHeight(height: number) {
    const { block } = this.layer;
    for (const key in block) {
      block[key].data.forEach(b => {
        b.setHeight(height);
      });
    }
  }
  /**
   * @description 设置体块颜色
   * @param color 体块颜色
   * @author Daryl
   */
  setBlockColor(color: string) {
    const { block } = this.layer;
    for (const key in block) {
      block[key].data.forEach(b => {
        b.setColor(color);
      });
    }
  }

  /**
   * @description 设置体块海拔高度、是否水平
   * @param altitude 体块海拔高度
   * @param level 体块是否水平
   * @author Daryl
   */
  setBlockAltitude(altitude: number, level: boolean) {
    const { block } = this.layer;
    for (const key in block) {
      block[key].data.forEach(b => {
        b.setAltitude(altitude, level);
      });
    }
  }

  /**
   * @description 渲染单个Cad文件
   * @param file CadFile对象
   * @author Daryl
   */
  renderAlone(attr, file: ExcelFile, isNew = false, isShow = true) {
    const { maps, apiHost } = Config;
    const { coordinate } = file;
    fetch(apiHost + file.jsonUrl, {
      mode: "cors"
    })
      .then(res => {
        return res.json();
      })
      .then(res => {
        const layer = this.getLayer(file, isNew);
        layer.setVisible(isShow);
        maps.addLayer(layer);
        res.forEach(item => {
          const position = item.position;
          let positions: any;
          let vertices: any = [];
          switch (file.type) {
            case "L":
              positions = position.split(";");
              if (positions) {
                for (let j = 0; j < positions.length; j++) {
                  const _p = positions[j].split(",");
                  let geo = CadModuleData.getGeo(coordinate, _p);
                  vertices.push(geo);
                }
              }
              const pipe = new PipeLine({
                vertices,
                color: attr.color,
                depthTest: !Boolean(attr.isDepth),
                isClose: false,
                width: Number(attr.width),
                level: Boolean(attr.isLevel),
                altitude: Number(attr.altitude),
                whethshare: Boolean(attr.isShare),
                lineStyle: attr.style
              });
              pipe.init();
              layer.data.push(pipe);
              layer.addFeature(pipe.line);
              break;
            case "T":
              const info = position.split(",");
              let title = "";
              if (info.length > 4) {
                for (let i = 3; i < info.length; i++) {
                  title += info[i];
                  if (i !== info.length - 1) {
                    title += ",";
                  }
                }
              } else {
                title = info[3];
              }
              let geo = CadModuleData.getGeo(coordinate, info);
              const mark = new Mark({
                geo,
                title,
                whethshare: false,
                height: attr.altitude,
                fontColor: attr.color,
                icon: attr.iconUrl,
                iconVisible: Boolean(attr.iconIsShow),
                fontSize: attr.size
              });
              layer.addFeature(mark.point);
              layer.addFeature(mark.line);
              layer.data.push(mark);
              break;
            case "CL":
              positions = position.split(";");
              if (positions) {
                for (let j = 0; j < positions.length; j++) {
                  const _p = positions[j].split(",");
                  let geo = CadModuleData.getGeo(coordinate, _p);
                  vertices.push(geo);
                }
              }
              const block = new Geometry({
                vertices,
                color: attr.color,
                level: Boolean(attr.isLevel),
                altitude: Number(attr.altitude),
                height: attr.height,
                opacity: Number(attr.opacity),
                whethshare: Boolean(attr.isShare)
              });
              layer.addFeature(block.polygon);
              layer.data.push(block);
              break;
          }
          maps.addLayer(layer);
        });
      })
      .catch(err => {
        console.log(err);
        message.error(`${this.title}数据加载失败，请重新设置`);
      });
  }

  static getGeo(coordinate, position) {
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

  /**
   * @description 渲染Cad数据集
   * @author Daryl
   */
  render({ fontIsShare = true, lineIsShare = true, blockIsShare = true }) {
    for (const key in this.cadData) {
      const data = this.cadData[key];
      for (const _key in data.files) {
        const file = data.files[_key];
        switch (file.type) {
          case "L":
            this.renderAlone(this.attr.line, file, false, lineIsShare);
            break;
          case "T":
            this.renderAlone(this.attr.font, file, false, fontIsShare);
            break;
          case "CL":
            this.renderAlone(this.attr.block, file, false, blockIsShare);
            break;
        }
      }
    }
  }

  save({ fontVo, lineVo, blockVo, title, position, lookAt, isShow }) {
    const _font = JSON.stringify(fontVo);
    const _line = JSON.stringify(lineVo);
    const _block = JSON.stringify(blockVo);
    this.attr = {
      font: JSON.parse(_font),
      line: JSON.parse(_line),
      block: JSON.parse(_block)
    };
    this.title = title;
    this.isShow = Boolean(isShow);
    this.position = position;
    this.lookAt = lookAt;
    this.newFiles = [];
    this.removeFiles = [];
  }

  setVisible(isShow: boolean) {
    this.setFontVisible(isShow);
    this.setLineVisible(isShow);
    this.setBlockVisible(isShow);
  }

  isVisible() {
    const values = Object.values(this.layer);
    for (let v of values) {
      if (Object.keys(v).length) {
        return Object.values(v)[0].isVisible();
      }
    }
    return false;
  }

  setFontVisible(isShow: boolean) {
    const features = this.layer.font;
    for (const _key in features) {
      const feature = features[_key];
      feature.setVisible(isShow);
    }
  }

  setLineVisible(isShow: boolean) {
    const features = this.layer.line;
    for (const _key in features) {
      const feature = features[_key];
      feature.setVisible(isShow);
    }
  }

  setBlockVisible(isShow: boolean) {
    const features = this.layer.block;
    for (const _key in features) {
      const feature = features[_key];
      feature.setVisible(isShow);
    }
  }

  /**
   * @description 获取层Id
   * @param file CadFile对象
   * @author Daryl
   */

  private getLayer(file: ExcelFile, isNew = false) {
    const id = this.id + file.id.toString();
    const { vrPlanner } = Config;
    let layer = new vrPlanner.Layer.FeatureLayer(this.getType(file) + id);
    layer.setLodWindowSize(4);
    switch (file.type) {
      case "L":
        this.layer.line[file.id] = layer;
        break;
      case "T":
        this.layer.font[file.id] = layer;
        break;
      case "CL":
        this.layer.block[file.id] = layer;
        break;
    }
    if (isNew) this.newFiles.push(file);
    // layer.setVisible(this.isShow);
    layer.data = [];
    return layer;
  }

  private getType(file: ExcelFile) {
    let type;
    switch (file.type) {
      case "L":
        type = "CadLineLayer_";
        break;
      case "T":
        type = "CadFontLayer_";
        break;
      case "CL":
        type = "CadBlockLayer_";
        break;
    }
    return type;
  }

  removeFile(file: ExcelFile) {
    const layer = this.getLayer(file);
    Config.maps.removeLayer(layer);
  }

  removeAll() {
    const { cadData } = this;
    for (const key in cadData) {
      const data = cadData[key];
      for (const _key in data.files) {
        const file = data.files[_key];
        this.removeFile(file);
      }
    }
    for (let i = 0; i < CadModuleData.datas.length; i++) {
      if (CadModuleData.datas[i].id === this.id) {
        CadModuleData.datas.splice(i, 1);
      }
    }
  }

  /**
   * @description 添加数据
   * @param CadModuleData 模组对象
   * @author Daryl
   */
  static addData(CadModuleData: CadModuleData) {
    this.datas.unshift(CadModuleData);
  }

  static getDataById(id: string) {
    this.datas.forEach(data => {
      if (data.id === id) {
        return data;
      }
    });
  }
}
