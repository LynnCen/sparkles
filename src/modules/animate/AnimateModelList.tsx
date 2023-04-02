import { Component } from "react";
import { message } from "antd";
import Config from "../../config/Config";
import AnimationService from "../../services/AnimationService";
import ModelPicker from "../../components/ModelPicker";
import AnimateModel from "../../components/model/Animate/Model";
import GPSModel from "../../components/model/GPS/Model";

interface AnimateModelListProps {
  closeModal: () => void;
  animation: any;
  lineData: any;
  type: string;
  replacedModel: AnimateModel;
  reloadList: (searchValue) => void;

  setInitialUrl?: (modelUrl, imgUrl) => void;
}
interface AnimateModelListStates {
  modelData: any;
  imageUrl: string;
  source: string;
  title: string;
  model: any;
  rotate: number;
}
class AnimateModelList extends Component<
  AnimateModelListProps,
  AnimateModelListStates
> {
  constructor(props: AnimateModelListProps) {
    super(props);
    this.state = {
      modelData: {},
      imageUrl: "/images/model_error.jpg",
      source: "",
      title: "自定义模型库",
      model: {},
      rotate: 0
    };
  }

  //判断是要更换模型还是添加模型
  changeLineModel = value => {
    const { type } = this.props;
    switch (type) {
      case "ADD-MODEL":
        this.addLineModel(value);
        break;
      case "REPLACE-MODEL":
        this.replaceLineModel(value);
        break;
    }
  };

  //添加模型
  addLineModel = value => {
    const { maps, vrPlanner } = Config;
    const { lineData, animation } = this.props;

    //现轨迹起点位置
    let linegeo = lineData.vertices[0].add(
      new vrPlanner.Math.Double3(0, 0, lineData.altitude)
    );

    let linerotate = animation.calLineAngleZ(0) + 180;

    let modelLayer = maps.getLayerById("animateModelLayer");
    if (!modelLayer) {
      modelLayer = new vrPlanner.Layer.FeatureLayer("animateModelLayer");
      maps.addLayer(modelLayer);
    }
    const animateModel = new AnimateModel({
      geo: linegeo,
      url: value.source,
      imgurl: value.img,
      rotateZ: linerotate,
      title: value.title,
      lineId: lineData.id,
      speed: animation.speed,
      isShow: true
    });
    const { point } = animateModel;
    modelLayer.addFeature(point);
    //模型添加至轨迹模型数组中
    animation.setAmodel(animateModel);

    const models = animation.models;
    //判断轨迹模型列表中模型数量，若有多个，则需要按照对应参数放弃模型
    //目前只需考虑一个模型的情况
    const modelsLen = models.length;
    let preModelLen, preModelGeo;
    if (modelsLen === 1) {
      point.setGeoLocation(linegeo);
      this.saveModel(animateModel);
    } else {
      preModelLen = models[modelsLen - 1].calModelSize();
      preModelGeo = models[modelsLen - 1].point.getGeoLocation();

      var ms = point.getStyle();
      ms.setOpacity(0);
    }
    animation.setVerticalLine();
    this.props.closeModal();

    //this.props.reloadList();
  };

  //保存gps模型数据
  saveGPSModel = model => {
    const { lineData } = this.props;
    let mdata: any = {};
    let geo: string = model.geo.x() + "," + model.geo.y() + "," + model.geo.z();

    mdata.title = model.title;
    mdata.rotate = model.rotate.toString();
    mdata.imgUrl = model.imgurl;
    mdata.url = model.url;
    mdata.geo = geo;
    mdata.lat = model.lat.toString();
    mdata.lon = model.lon.toString();
    mdata.gpsId = lineData.id;
    mdata.modelSize = model.scale[0].toString();
    mdata.planId = Config.PLANID;
    mdata.isShow = model.isShow;
    mdata.code = model.code;

    if (this.props.type === "ADD-MODEL") {
      AnimationService.addAModel(mdata, (flag, res) => {
        if (flag) {
          model.id = res.data;
        } else {
        }
      });
    } else {
      //mdata.id = model.id;
      let a = { id: model.id, str: JSON.stringify(mdata) };
      AnimationService.modGPSModel(a, (flag, res) => {
        if (flag) {
          console.log("更换成功");
        } else {
          console.log(res);
        }
      });
    }
  };

  //保存模型数据
  saveModel = model => {
    const { lineData } = this.props;
    let mdata: any = [];
    let geo: string = model.geo.x() + "," + model.geo.y() + "," + model.geo.z();

    mdata.title = model.title;
    mdata.rotateX = model.rotateX;
    mdata.rotateY = model.rotateY;
    mdata.rotateZ = model.rotateZ;
    mdata.imgurl = model.imgurl;
    mdata.url = model.url;
    mdata.geo = geo;
    mdata.speed = model.speed;
    mdata.rotatetime = model.rotateTime;
    mdata.lineid = lineData.id;
    mdata.modelsize = model.scale[0];
    mdata.planId = Config.PLANID;
    mdata.isshow = true;

    if (this.props.type === "ADD-MODEL") {
      AnimationService.addAModel(mdata, (flag, res) => {
        if (flag) {
          model.id = res.data;
        } else {
        }
      });
    } else {
      mdata.id = model.id;
      AnimationService.modAModel(mdata, (flag, res) => {
        if (flag) {
          console.log("更换成功");
        } else {
          console.log(res);
        }
      });
    }
  };
  //在多个模型的情况下  计算模型对应位置
  calModelLength = (animateModel, preModelLen, preModelGeo) => {
    const { lineData } = this.props;
    const { vrPlanner } = Config;
    const modelLength = animateModel.calModelSize();

    let ver = lineData.vertices;
    //前一个模型的坐标加上高度
    let preModelVertex = new vrPlanner.Math.Double3.create(
      preModelGeo.x(),
      preModelGeo.y(),
      preModelGeo.z() + lineData.altitude
    );
    //the second point of the travel
    let secLinePoint = new vrPlanner.Math.Double3.create(
      ver[1].x(),
      ver[1].y(),
      ver[1].z() + lineData.altitude
    );
    //the first point of the travel
    let firstLinePoint = new vrPlanner.Math.Double3.create(
      ver[0].x(),
      ver[0].y(),
      ver[0].z() + lineData.altitude
    );
    //前一个点到轨迹上第二个点的向量
    let b = secLinePoint.sub(preModelVertex);
    //前一个点到轨迹上第二个点的距离
    let lengthToFirst = b.magnitude();
    //前一个点到轨迹上第二个点的向量的单位向量
    let oneb = b.div(lengthToFirst);
    //设定的间隔加上当前和前一个模型在y轴上的半径
    let sumInterval = lineData.interval + modelLength + preModelLen;

    let beishu = oneb.mul(sumInterval);
    let niu = preModelVertex.add(beishu);
    let i;
    let m = niu.sub(firstLinePoint);
    let n = m.magnitude();
    let mm, nn, nniu;

    for (i = 0; i < ver.length - 1; i++) {
      mm = new vrPlanner.Math.Double3.create(
        ver[i + 1].x(),
        ver[i + 1].y(),
        ver[i + 1].z() + lineData.altitude
      );
      let x = new vrPlanner.Math.Double3.create(
        ver[i].x(),
        ver[i].y(),
        ver[i].z() + lineData.altitude
      );
      mm = mm.sub(x);
      nn = mm.magnitude();
      if (n > nn) {
        n = n - nn;
      } else {
        oneb = mm.div(nn);
        beishu = oneb.mul(n);
        let ii = new vrPlanner.Math.Double3.create(
          ver[i].x(),
          ver[i].y(),
          ver[i].z() + lineData.altitude
        );
        nniu = ii.add(beishu);
        n = 0;
        break;
      }
    }
    if (n != 0) {
      message.error("轨迹长度不足");
      animateModel.remove(lineData.id);
      //    this.props.reloadList();
    } else {
      const sss = new vrPlanner.GeoLocation(
        nniu.x(),
        nniu.y(),
        nniu.z() - lineData.altitude
      );
      animateModel.point.setGeoLocation(nniu);
      animateModel.geo = sss;
      let ms = animateModel.point.getStyle();
      ms.setOpacity(1);
      this.saveModel(animateModel);
    }
  };

  //更换模型
  replaceLineModel = value => {
    const { replacedModel, animation, lineData } = this.props;
    if (lineData.lineType === "GPSLine") {
      for (var i = 0; i < animation.models.length; i++) {
        const model = new GPSModel({
          id: animation.models[i].id,
          scale: replacedModel.scale,
          rotateZ: replacedModel.rotateZ,
          geo: animation.models[i].geo,
          url: value.source,
          imgurl: value.img,
          title: value.title,
          lineId: lineData.id,
          code: animation.models[i].code,
          speed: replacedModel.speed
        });
        animation.models[i].remove();
        animation.replaceModel(model);
        // model.point.setGeolocation(animation.models[i].geo.add(0, 0, lineData.altitude))
        this.saveGPSModel(model);
      }
      if (this.props.setInitialUrl) {
        this.props.setInitialUrl(value.source, value.img);
      }
    } else {
      const model = new AnimateModel({
        id: replacedModel.id,
        rotateTime: replacedModel.rotateTime,
        scale: replacedModel.scale,
        rotateX: replacedModel.rotateX,
        rotateY: replacedModel.rotateY,
        rotateZ: replacedModel.rotateZ,
        geo: replacedModel.geo,
        url: value.source,
        imgurl: value.img,
        title: value.title,
        lineId: lineData.id
      });

      replacedModel.remove();
      // model.point.setGeoLocation(
      //   replacedModel.geo.add(
      //     new Config.vrPlanner.Math.Double3(0, 0, animation.altitude)
      //   )
      // );

      animation.replaceModel(model, replacedModel);
      this.saveModel(model);
      animation.setModelAltitude(animation.line.altitude);
    }

    this.props.closeModal();
  };

  render() {
    const { closeModal } = this.props;

    return (
      <ModelPicker onChange={this.changeLineModel} onClose={closeModal} />
      // <VrpModal
      //   className={css["vrp-animate-model-list"]}
      //   defaultPosition={{ x: 10, y: 195 }}
      //   title={dropdown}
      //   style={{ width: 267, height: 420 }}
      //   onClose={this.props.closeModal}
      // >
      //   <div className={css["vrp-animate-modellist-container"]}>
      //     <ul className={css["vrp-animate-model-list"]}>
      //       {modelData[modelType]
      //         ? modelData[modelType].map((value, index) => (
      //           <li className={css["vrp-animate-modellist-li"]} key={index}>
      //             <img
      //               className={css["vrp-animate-model-img"]}
      //               onClick={this.changeLineModel.bind(this, value)}
      //               title={value.title}
      //               src={Config.apiHost + value["img"]}
      //             />
      //           </li>
      //         ))
      //         : null}
      //     </ul>
      //   </div>
      // </VrpModal>
    );
  }
}

export default AnimateModelList;
