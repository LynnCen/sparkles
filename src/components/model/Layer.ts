import Mark from "./Mark";
import Push from "./Push";
import PipeLine from "./PipeLine";
import Geometry from "./Geometry";
import Animation from "./Animate/Animation";
import SimpleLayerService from "../../services/SimpleLayerService";
import Config from "../../config/Config";
import { message } from "antd";
import Model from "./Model";
const { PLANID } = Config;

export default class Layer {
  title: string;
  id: number;
  isNew: boolean;
  marks: Mark[] = [];
  builds: Model[] = [];
  pushs: Push[] = [];
  lines: PipeLine[] = [];
  geometrys: Geometry[] = [];
  animates: Animation[] = [];
  isOpen: boolean = false;
  isVisible: boolean = false;
  static layers: Layer[] = [];
  static resourceMap = {
    marks: Mark.marks,
    builds: Model.models,
    pushs: Push.pushs,
    lines: PipeLine.pipes,
    geometrys: Geometry.geometrys,
    animates: Animation.animations
  };

  constructor({
    marks = [],
    builds = [],
    pushs = [],
    lines = [],
    geometrys = [],
    animates = [],
    id = 0,
    title = "图层" + (Layer.layers.length + 1),
    isNew = false,
    isOpen = true,
    isVisible = true
  }) {
    this.id = id;
    this.title = title;
    this.isNew = isNew;
    this.marks = marks;
    this.builds = builds;
    this.pushs = pushs;
    this.lines = lines;
    this.geometrys = geometrys;
    this.animates = animates;
    this.isOpen = isOpen;
    this.isVisible = isVisible;
    this.init();
  }

  init = (isVisible = this.isVisible) => {
    this.marks.forEach(item => {
      item.setVisible(isVisible);
    });
    this.builds.forEach(item => {
      item.setVisible(isVisible);
    });
    this.pushs.forEach(item => {
      item.setVisible(isVisible);
    });
    this.lines.forEach(item => {
      item.setVisible(isVisible);
    });
    this.geometrys.forEach(item => {
      item.setVisible(isVisible);
    });
  };

  static addLayer = (layer: Layer) => {
    Layer.layers.unshift(layer);
  };

  static removeLayer = (id: number) => {
    const { layers } = Layer;
    for (let i = 0; i < layers.length; i++) {
      if (id === layers[i].id) {
        layers.splice(i, 1);
        break;
      }
    }
  };

  static getById = (id: number) => {
    const { layers } = Layer;
    for (let i = 0; i < layers.length; i++) {
      if (id === layers[i].id) {
        return layers[i];
      }
    }
    return;
  };

  showData = () => {
    this.marks.forEach(item => {
      item.setVisible(item.whethshare);
    });
    this.builds.forEach(item => {
      item.setVisible(item.whethshare);
    });
    this.pushs.forEach(item => {
      item.setVisible(item.whethshare);
    });
    this.lines.forEach(item => {
      item.setVisible(item.whethshare);
    });
    this.geometrys.forEach(item => {
      item.setVisible(item.whethshare);
    });
  };

  addData = (feature: any, type: string) => {
    this[type].push(feature);
  };

  //获取图层
  static getList = (planId = PLANID, isShare = false) => {
    SimpleLayerService.getListAll({ planId }, (success, res) => {
      if (success) {
        const { data } = res;
        const obj = {
          mark: Mark,
          build: Model,
          push: Push,
          line: PipeLine,
          geometry: Geometry,
          animate: Animation
        };
        data.forEach(item => {
          const { data, id, isOpen, isVisible, title } = item;
          const layer = new Layer({
            id,
            isOpen,
            isVisible,
            title
          });
          Layer.addLayer(layer);
          data.forEach(_item => {
            const { type, ids } = _item;
            ids.forEach(id => {
              let d = obj[type].getById(id);
              d && layer.addData(d, type + "s");
            });
          });
          if (!isShare) {
            layer.init(isVisible);
          } else {
            layer.init(false);
          }
        });
      }
    });
  };

  // 保存数据
  save = data => {
    this.isOpen = data.isOpen;
    this.isVisible = data.isVisible;
    this.title = data.title;
    this.marks = data.marks;
    this.builds = data.builds;
    this.pushs = data.pushs;
    this.lines = data.lines;
    this.geometrys = data.geometrys;
    this.animates = data.animates;
    const layerAddModel = {
      data: [
        { ids: data.marksIds, type: "mark" },
        { ids: data.buildsIds, type: "build" },
        { ids: data.pushsIds, type: "push" },
        { ids: data.linesIds, type: "line" },
        { ids: data.geometrysIds, type: "geometry" },
        { ids: data.animatesIds, type: "animate" }
      ],
      title: data.title,
      isOpen: data.isOpen,
      isVisible: data.isVisible,
      planId: PLANID
    };
    if (data.isNew) {
      // console.log(data)
      this.isNew = false;
      // 新数据调用添加接口
      return new Promise((resolve, reject) => {
        SimpleLayerService.add(layerAddModel, (success, res) => {
          if (success) {
            this.id = res.data.id;
            resolve(res.data.id);
            Layer.addLayer(this);
            message.success(res.message);
          } else {
            message.error(res.message);
            resolve(0);
          }
        });
      });
    } else {
      this.isNew = data.isNew;

      const layerUpdateModel = {
        ...layerAddModel,
        id: data.id
      };
      SimpleLayerService.update(layerUpdateModel, (success, res) => {
        if (success) {
          message.success(res.message);
        } else message.error(res.message);
      });
      // 旧数据调用修改接口
    }
  };

  // 删除数据
  del = callback => {
    SimpleLayerService.del({ layerId: this.id }, (success, res) => {
      if (success) {
        Layer.removeLayer(this.id);
        callback && callback();
        message.success(res.message);
      } else {
        message.error(res.message);
      }
    });
  };

  static hideAll() {
    this.layers.forEach(item => {
      item.init(false);
    });
  }
}
