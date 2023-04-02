import AnimateLine from "./Line";
import AnimateModel from "./Model";
import TrackAnimation from "../Track/Animation";
import Mark from "../Mark";
import Config from "../../../config/Config";
import moment from "moment";
import Tools from "../../tools/Tools";

const { vrPlanner, maps } = Config;
/**
 * @description  手绘轨迹动画
 */
export default class Animation extends TrackAnimation {
  static animations: Animation[] = [];

  speed: number;
  interval: number; //间隔播放间距
  isCircle: boolean; //循环播放
  isGap: boolean; //间隔播放
  isActive: any;
  line: AnimateLine;
  models: AnimateModel[] = [];
  type: string;
  triggerAtr: string; //测试方式

  pointClones: any[] = [];

  constructor({
                id = 0,
                interval = 10,
                isCircle = false,
                isGap = false,
                isActive = "finish",
                line,
                models = [],
                speed = 30,
                title,
                showVerticalLine = true,
                verticalLineColor = "#ffffff",
                shareIcon = "/res/image/icon/admin/24971571971028404.png",
                showBalloon = true,
                isReverse = false,
                triggerAtr = "handle",
                createTime = "",
                fontSize = 16,
                fontColor = "#fff",
                balloonBottom = 0,
                balloonHeight = 0,
                iconVisible = true,
                titleVisible = true,
                type = "animation",
                iconUrl = "/res/image/icon/admin/22011565592416553.png",
                balloonTitle = "标签"
              }) {
    super({
      id,
      title,
      isReverse,
      createTime,
      fontSize,
      fontColor,
      shareIcon,
      balloonBottom,
      balloonHeight,
      iconUrl,
      iconVisible,
      titleVisible,
      balloonTitle,
      showVerticalLine,
      verticalLineColor
    });
    this.interval = interval;
    this.isCircle = isCircle;
    this.isGap = isGap;
    this.isActive = isActive;
    this.line = line;
    this.speed = speed;
    this.type = type;
    this.triggerAtr = triggerAtr;

    this.setBalloon();
  }

  static getById(id: number) {
    for (let i = 0; i < this.animations.length; i++) {
      const animate = this.animations[i];
      if (animate.id === id) {
        return animate;
      }
    }
    return null;
  }

  setReverse(isReverse: boolean) {
    this.isReverse = isReverse;
    let endGeo = this.line.vertices[this.line.vertices.length - 1].add(
      new vrPlanner.Math.Double3(0, 0, this.line.altitude)
    );
    let firstGeo = this.line.vertices[0].add(new vrPlanner.Math.Double3(0, 0, this.line.altitude));
    let firstAngle = this.calLineAngleZ(0) + 180;

    let endAngle = this.calLineAngleZ(this.line.vertices.length - 2);

    if (isReverse) {
      this.models[0].point.setGeoLocation(endGeo);
      this.models[0].point.getStyle().setRotation(endAngle);
    } else {
      this.models[0].point.setGeoLocation(firstGeo);
      this.models[0].point.getStyle().setRotation(firstAngle);
    }
  }

  //围绕z轴旋转的角度
  calLineAngleZ(i) {
    let prex = this.line.vertices[i].x();
    let prey = this.line.vertices[i].y();
    //  var prez = this.vertices[i].z();
    let endx = this.line.vertices[i + 1].x();
    let endy = this.line.vertices[i + 1].y();
    //   var endz = this.vertices[i + 1].z();

    //! 这里atan2用错了
    //!atan2 求从 X 轴正向逆时针旋转到点 (x,y) 时经过的角度。
    //!let hudu = Math.atan2(endy - prey, endx - prex);  这个是正确的语序
    //!在正常显示的时候setRotation是从y轴开始旋转的
    //!我在使用return的-angle的时候  有+180度 刚好能够符合正确的角度设定
    //!为了不影响到之前的数据  所以暂时不修改原有算法
    let hudu = Math.atan2(endx - prex, endy - prey);

    //let hudu = Math.atan2(endy - prey, endx - prex);
    let angleXY = (180 * hudu) / Math.PI;

    return -angleXY;
  }

  //围绕x轴旋转的角度
  calLineAngleX(i) {
    let prex = this.line.vertices[i].x();
    let prey = this.line.vertices[i].y();
    let prez = this.line.vertices[i].z();
    //  var prez = this.vertices[i].z();
    let endx = this.line.vertices[i + 1].x();
    let endy = this.line.vertices[i + 1].y();
    let endz = this.line.vertices[i + 1].z();

    let ab = Math.pow(endx - prex, 2) + Math.pow(endy - prey, 2) + Math.pow(endz - prez, 2);
    let a = Math.pow(endz, 2);
    let b = Math.sqrt(Math.abs(ab - a));
    let hudu = Math.atan2(endz - prez, b);
    let angleZ = (180 * hudu) / Math.PI;

    return -angleZ;
  }

  setBalloon() {
    const { vrPlanner, maps } = Config;

    // if (this.line.vertices[0]) {
    let geo = this.line.vertices[0];
    let showBalloon = this.line.showBalloon;
    if (showBalloon === false) {
      this.iconVisible = false;
      this.titleVisible = false;
    } else {
    }
    this.balloon = new Mark({
      geo,
      whethshare: false,
      height: this.balloonHeight,
      title: this.balloonTitle,
      icon: this.iconUrl,
      fontSize: this.fontSize,
      fontColor: this.fontColor,
      titleVisible: this.titleVisible,
      visible: showBalloon,
      iconVisible: this.iconVisible
    });

    this.balloon.setAnimationHeight(
      this.balloonBottom + this.line.altitude,
      this.balloonHeight + this.line.altitude
    );

    let balloonLayer =
      maps.getLayerById("animateBalloonLayer") ||
      new vrPlanner.Layer.FeatureLayer("animateBalloonLayer");
    maps.getLayerById("balloonLayer") || new vrPlanner.Layer.FeatureLayer("balloonLayer");
    maps.addLayer(balloonLayer);
    balloonLayer.addFeature(this.balloon.point);
    balloonLayer.addFeature(this.balloon.line);
  }

  setAltitude() {
    if (this.models) {
      for (let i = 0; i < this.models.length; i++) {
        this.models[i].point.setGeoLocation(
          new Config.vrPlanner.GeoLocation(
            this.models[i].geo.x(),
            this.models[i].geo.y(),
            this.models[i].geo.z() + this.line.altitude
          )
        );
      }
    }
  }

  setChecked(isChecked) {
    this.line.isChecked = isChecked;
  }

  setAnimateLine() {
    Animation.animations.unshift(this);
    Animation.animations.sort(Tools.compare("id"));
    Animation.animations.reverse();
  }

  setAnimateModel(model) {
    this.models.push(model);
  }

  setModelAltitude(altitude) {
    for (let i = 0; i < this.models.length; i++) {
      this.models[i].point.setVertex(
        this.models[i].geo.x(),
        this.models[i].geo.y(),
        this.models[i].geo.z() + altitude
      );
    }

    // this.models[0].point.setVertex(this.models[0].geo.x(), this.models[0].geo.y(), this.models[0].geo.z() + altitude);
  }

  removeModel(model) {
    const layer = maps.getLayerById("animateModelLayer");
    for (var i = 0; i < this.models.length; i++) {
      if (this.models[i].id === model.id) {
        layer.removeFeature(this.models[i].point);
        this.models.splice(i, 1);
      }
    }
  }

  remove() {
    const layer = maps.getLayerById("animateLineLayer");
    layer.removeFeature(this.line.line);
    let a = Animation.animations.find(i => i.id === this.id);

    if (a) {
      let p = Animation.animations.indexOf(a);
      Animation.animations.splice(p, 1);
      this.removeBalloon();
    }
  }

  replaceModel(model, replacedModel) {
    let modelLayer = maps.getLayerById("animateModelLayer");
    let geoBack = replacedModel.point.getGeoLocation();
    console.log(geoBack, model.geo);
    replacedModel.remove();
    for (let i = 0; i < this.models.length; i++) {
      if (this.models[i].id === replacedModel.id) {
        this.models[i] = model;
        modelLayer.addFeature(this.models[i].point);
      }
      this.models[i].point.setVertex(geoBack.x(), geoBack.y(), geoBack.z());
    }
  }

  setAmodel(model) {
    if (this.models[0] === undefined) {
      this.models = [model];
    } else {
      this.models.push(model);
    }
  }

  setVisible(visible: boolean) {
    if (visible === true) {
      this.line.setVisible(this.line.isShow);
      this.models.forEach(model => {
        model.setVisible(model.isShow);
      });
      this.balloon.setVisible(this.line.showBalloon);
    } else {
      //if (this.line.showBalloon) {
      this.balloon.setVisible(visible);
      //  }
      this.models.forEach(model => {
        model.setVisible(visible);
      });

      this.line.setVisible(visible);
    }
  }

  setAnimation(status) {
    for (let i = 0; i < this.models.length; i++) {
      //  if (this.models[i].timeOut != undefined) {
      this.models[i].clearTime();
      //  }
    }
    switch (status) {
      case "Splay":
        this.setPlay();
        break;
      case "play":
        for (let i = 0; i < this.models.length; i++) {
          this.models[i].animation.play();
        }
        if (this.isGap) {
          this.pointClones.forEach(pointClone => {
            pointClone.animation.play();
          });
        }
        break;
      case "stop":
        for (let i = 0; i < this.models.length; i++) {
          this.models[i].animation.pause();
        }
        if (this.isGap) {
          this.pointClones.forEach(pointClone => {
            pointClone.animation.pause();
          });
        }
        break;
      case "finish":
        for (let i = 0; i < this.models.length; i++) {
          this.models[i].animation.cancel();
          this.models[i].animation.unbindEvent("animationCompleted");
        }

        let tt = setTimeout(() => {
          for (let i = 0; i < this.models.length; i++) {
            this.models[i].setRotation({
              rotateX: this.models[i].rotateX,
              rotateY: this.models[i].rotateY,
              rotateZ: this.models[i].rotateZ
            });
            // this.models[i].point.setPosition(this.line.vertices[0].add(0, 0, this.line.altitude))
          }
        }, 50);

        if (this.isGap) {
          this.pointClones.forEach(pointClone => {
            pointClone.animation.cancel();
          });
          this.pointClones = [];
        }
        break;
    }
  }

  calTime() {
    let sumTime;
    if (this.models[0]) {
      let rotateTime = this.models[0].rotateTime;
      let turnTime = (this.line.vertices.length - 2) * rotateTime;
      let sumDistance = this.line.calLineDistance();
      let lineTime = sumDistance / this.speed;
      sumTime = turnTime + lineTime;
      // for(let i = 0;i<this.line.vertices.length-1;i++){

      // }
    } else {
      sumTime = 0;
    }
    return sumTime;
  }

  setPlay() {
    const { interval } = this.line;
    const { speed } = this.models[0];
    let modelSource = this.models;
    let prepre = this.line.vertices[0].add(0, 0, this.line.altitude);
    let endAngle = this.calLineAngleZ(this.line.vertices.length - 2);
    let firstAngle = this.calLineAngleZ(0) + 180;

    const modelLength = 2 * modelSource[0].calModelSize();
    const intervalTime = (interval + modelLength) / (2 * speed);
    // rotationNum  所需要旋转的节点数
    let rotationNum = this.line.vertices.length - 2;

    if (modelSource.length > 1) {
      for (var i = 0; i < modelSource.length; i++) {
        const modelStyle = modelSource[i].point.getStyle();
        modelStyle.setRotation(firstAngle);
        let Geo = modelSource[i].geo.add(0, 0, this.line.altitude);
        this.TosetSequence(Geo, rotationNum, modelSource[i]);
      }
    } else {
      const point = modelSource[0].point;
      const modelStyle = point.getStyle();

      if (this.isGap) {
        const point = modelSource[0].point;
        const modelStyle = point.getStyle();
        modelStyle.setRotation(firstAngle);
        //  modelSource[0].setEuler(modelSource[0].rotateX);
        modelSource[0].setRotation({
          rotateX: this.models[0].rotateX,
          rotateY: this.models[0].rotateY,
          rotateZ: this.models[0].rotateZ
        });
        this.TosetSequence(prepre, rotationNum, modelSource[0]);
        modelSource[0].timeInterval = setInterval(() => {
          this.TosetSequenceAnimation(prepre, rotationNum, modelSource[0]);
        }, intervalTime * 1000);
      } else {
        if (this.isReverse) {
          modelStyle.setRotation(endAngle);
          // modelSource[0].setEuler(modelSource[0].rotateX + 180);
          modelSource[0].setRotation({
            rotateX: this.models[0].rotateX + 180,
            rotateY: this.models[0].rotateY,
            rotateZ: this.models[0].rotateZ
          });
        } else {
          modelStyle.setRotation(firstAngle);
          //  modelSource[0].setEuler(modelSource[0].rotateX);
          modelSource[0].setRotation({
            rotateX: this.models[0].rotateX,
            rotateY: this.models[0].rotateY,
            rotateZ: this.models[0].rotateZ
          });
        }

        this.TosetSequence(prepre, rotationNum, modelSource[0]);
      }
      this.moveVerticalLine();
    }
  }

  TosetSequence = (pre, rotationNum, model) => {
    const lineData = this.line;
    let modelSource = this.models;
    //目前还需旋转的节点数
    let currentRotationNum = rotationNum;
    //剩余直线数量
    let lineNum = lineData.vertices.length - 1 - rotationNum;
    let point = model.point;
    const modelStyle = point.getStyle();
    let preAngleZ, preAngleX;
    if (this.isReverse) {
      preAngleZ = this.calLineAngleZ(0);
      preAngleX = this.calLineAngleX(0) + 180;
    } else {
      preAngleZ = this.calLineAngleZ(0) + 180;
      preAngleX = this.calLineAngleX(0);
    }
    //modelStyle.getRotation();
    let endAngleZ, endAngleX;

    //接下来的目标点
    let destinationPoint = 1;

    //直线运动 pre为preGeo，end为endGeo
    let preGeo = pre;

    let endGeo;

    //存放路径
    let aLine: any[] = [];
    //轨迹路程中旋转节点和线路总和
    let len = 2 * currentRotationNum + 1;
    let end;
    let vLength = lineData.vertices.length;

    if (modelSource.length != 1) {
      let ii = modelSource.length - modelSource.indexOf(model) - 1;
      let sumInterval = 0;
      for (var i = modelSource.indexOf(model) + 1; i < modelSource.length; i++) {
        sumInterval = sumInterval + 2 * modelSource[i].lengthY;
      }
      sumInterval = sumInterval + ii * lineData.interval + model.lengthY;
      let lastVertex = lineData.vertices[vLength - 1].asDouble3();
      let lastSecVertex = lineData.vertices[vLength - 2].asDouble3();
      let b = lastVertex.sub(lastSecVertex);
      let bLength = b.magnitude();
      let oneb = b.div(bLength);
      let ee = bLength - sumInterval;
      let en = oneb.mul(ee);
      let endg = lastSecVertex.add(en);
      end = new vrPlanner.GeoLocation(endg.x(), endg.y(), endg.z() + lineData.altitude);
    } else {
      end = lineData.vertices[vLength - 1].add(new vrPlanner.Math.Double3(0, 0, lineData.altitude));
    }

    for (let i = 0; i < len; i++) {
      destinationPoint = lineData.vertices.length - 1 - currentRotationNum;

      endGeo = lineData.vertices[destinationPoint].add(
        new vrPlanner.Math.Double3(0, 0, lineData.altitude)
      );

      if (i % 2 === 1) {
        if (this.isReverse) {
          endAngleZ = this.calLineAngleZ(lineNum);
        } else {
          endAngleZ = this.calLineAngleZ(lineNum) + 180;
          endAngleX = this.calLineAngleX(lineNum);
        }

        aLine.push(this.transRotate(modelStyle, preAngleZ, endAngleZ, preAngleX, endAngleX));

        lineNum = lineNum + 1;
        preAngleZ = endAngleZ;
        preAngleX = endAngleX;
      } else if (i === len - 1) {
        aLine.push(this.transformLine(preGeo, end, model, point));
      } else {
        aLine.push(this.transformLine(preGeo, endGeo, model, point));
        currentRotationNum = currentRotationNum - 1;
      }
      preGeo = lineData.vertices[destinationPoint - 1].add(
        new vrPlanner.Math.Double3(0, 0, lineData.altitude)
      );
    }
    if (this.isReverse) {
      aLine = aLine.reverse();
    }

    let sequenceEffect = new vrPlanner.Animation.SequenceEffect(aLine);

    model.animation = maps.animate(sequenceEffect, true);

    model.animation.play();

    model.animation.bindEvent("animationUpdated", () => {
      if (this.balloon && this.line.showBalloon) {
        this.balloon.setGeoLocation(point.getGeoLocation(), this.balloonHeight);
      }
      // else if (this.line.showBalloon) {
      //   model.mark.setGeoLocation(point.getGeoLocation(), this.balloonHeight);
      // }
    });

    model.animation.bindEvent("animationCompleted", () => {
      if (this.isCircle) {
        model.timeOut = setTimeout(() => {
          this.setPlay();
        }, 2000);
      }
      model.animation.unbindEvent("animationCompleted");
    });
  };

  TosetSequenceAnimation = (pre, rotationNum, model) => {
    const lineData = this.line;
    const point = model.point;
    let pointClone = new vrPlanner.Feature.Point(lineData.vertices[0]);
    const prototypeStyle = point.getStyle();
    let modelUrl = prototypeStyle.getModel().getUrl();
    let rotateX = model.rotateX;
    let firstAngle = this.calLineAngleZ(0) + 180;
    let ps = prototypeStyle.toJson();
    let pst = new vrPlanner.Style.ModelStyle(ps);

    let euler = vrPlanner.Math.Euler(rotateX, 0, firstAngle);
    pst.setEulerRotation(euler);

    const modelReader = new Config.vrPlanner.Model.ModelReader();
    modelReader.read(modelUrl).done(model => {
      pst.setModel(model);
    });

    pointClone.setStyle(pst);

    const modelStyle = pointClone.getStyle();

    let currentRotationNum = rotationNum;
    let d = lineData.vertices.length - 1;
    let lineNum = d - rotationNum;

    let preAngleZ = this.calLineAngleZ(0) + 180;

    let preAngleX = this.calLineAngleX(0);
    let endAngleX;
    let endAngleZ;
    // let cloneModelLayer = new vrPlanner.Layer.FeatureLayer("cloneModelLayer")
    //   || maps.getLayerById("cloneModelLayer");
    let cloneModelLayer = maps.getLayerById("animateModelLayer");
    maps.addLayer(cloneModelLayer);
    //接下来的目标点
    let destinationPoint = 1;
    cloneModelLayer.addFeature(pointClone);
    this.pointClones.push(pointClone);
    // modelLayer.removeFeature(point);
    //直线运动 pre为preGeo，end为endGeo
    let preGeo = pre;

    let endGeo;

    let aLine: any[] = [
      //this.transformLine(object, preGeo, endGeo, rotationNum)
    ];
    //  var aLine2 = this.setaLine2();
    let len = 2 * currentRotationNum + 1;

    for (var i = 0; i < len; i++) {
      destinationPoint = lineData.vertices.length - 1 - currentRotationNum;

      endGeo = new vrPlanner.GeoLocation(
        lineData.vertices[destinationPoint].x(),
        lineData.vertices[destinationPoint].y(),
        lineData.vertices[destinationPoint].z() + lineData.altitude
      );

      if (i % 2 === 1) {
        endAngleZ = this.calLineAngleZ(lineNum) + 180;
        endAngleX = this.calLineAngleX(lineNum);

        aLine.push(this.transRotate(modelStyle, preAngleZ, endAngleZ, preAngleX, endAngleX));

        lineNum = lineNum + 1;
        preAngleZ = endAngleZ;
      } else {
        aLine.push(this.transformLine(preGeo, endGeo, model, pointClone));
        currentRotationNum = currentRotationNum - 1;
      }

      preGeo = new vrPlanner.GeoLocation(
        lineData.vertices[destinationPoint - 1].x(),
        lineData.vertices[destinationPoint - 1].y(),
        lineData.vertices[destinationPoint - 1].z() + lineData.altitude
      );
      pointClone.setGeoLocation(preGeo);
    }

    //aLine.push(this.transRotate(modelStyle, preAngle, endAngle));
    let sequenceEffect = new vrPlanner.Animation.SequenceEffect(aLine);

    pointClone.animation = maps.animate(sequenceEffect, true);

    pointClone.animation.play();

    pointClone.animation.bindEvent("animationCancelled", () => {
      cloneModelLayer.removeFeature(pointClone);
    });

    pointClone.animation.bindEvent("animationCompleted", () => {
      cloneModelLayer.removeFeature(pointClone);
      //   this.setPlay();

      // this.animation.unbindEvent("animationCompleted");

      //var Timeout = setTimeout(()=>{
      //   animationTotal.play();
      //     modelStyle.setOpacity(1);
      //  },jwait*1000)
    });
  };

  transformLine = (preGeo, endGeo, model, point) => {
    //运动距离
    var pointpreX = preGeo.x();
    var pointpreY = preGeo.y();
    var pointpreZ = preGeo.z();
    var pointEndX = endGeo.x();
    var pointEndY = endGeo.y();
    var pointEndZ = endGeo.z();

    var d1 = Math.sqrt(
      Math.pow(pointpreX - pointEndX, 2) +
      Math.pow(pointpreY - pointEndY, 2) +
      Math.pow(pointpreZ - pointEndZ, 2)
    );

    //运动速度
    var v = model.speed;
    //运动时间
    var animationDuration = d1 / v;

    var k0 = new vrPlanner.Animation.Keyframe();
    k0.put("position", 0.0);

    var k1 = new vrPlanner.Animation.Keyframe();
    k1.put("position", 1.0);

    var geo3d = endGeo.asDouble3();

    var preGeo3d = preGeo.asDouble3();

    var posMotionPath3d = new vrPlanner.Animation.MotionPath3D();

    posMotionPath3d.append(new vrPlanner.Curve.LineCurve3D([preGeo3d, geo3d]));
    var motionPaths = {
      position: posMotionPath3d
    };

    var timing = new vrPlanner.Animation.Timing();
    timing.setIterations(1);
    timing.setDelay(0.0);
    timing.setDuration(animationDuration);
    if (this.isReverse) {
      timing.setDirection(vrPlanner.Animation.Timing.DIRECTION_REVERSE);
    } else {
      timing.setDirection(vrPlanner.Animation.Timing.DIRECTION_ALTERNATE);
    }

    timing.setEasing(vrPlanner.Interpolation.CubicBezier.LINEAR);
    var effect = new vrPlanner.Animation.KeyframeEffect(point, [k0, k1], timing, motionPaths);
    return effect;
  };

  //模型旋转
  transRotate = (modelStyle, preAngle, endAngle, preAngleX, endAngleX) => {
    var animationDuration = this.models[0].rotateTime;
    var k0 = new vrPlanner.Animation.Keyframe({
      "rotation.z": preAngle,
      "rotation.x": preAngleX
    });

    var k1 = new vrPlanner.Animation.Keyframe({
      "rotation.z": endAngle,
      "rotation.x": endAngleX
    });

    var timing = new vrPlanner.Animation.Timing();
    timing.setIterations(1);
    timing.setDelay(0.0);
    timing.setDuration(animationDuration);
    if (this.isReverse) {
      timing.setDirection(vrPlanner.Animation.Timing.DIRECTION_REVERSE);
    } else {
      timing.setDirection(vrPlanner.Animation.Timing.DIRECTION_ALTERNATE);
    }
    timing.setEasing(vrPlanner.Interpolation.CubicBezier.LINEAR);
    var effect = new vrPlanner.Animation.KeyframeEffect(modelStyle, [k0, k1], timing);

    return effect;
  };

  setVerticalLine = () => {
    let modelLayer =
      maps.getLayerById("animateLineLayer") || new vrPlanner.Layer.FeatureLayer("animateLineLayer");

    if (this.showVerticalLine && this.models.length) {
      let lineStyle = new vrPlanner.Style.LineStyle();
      let loc = this.models[0].geo;

      lineStyle.setColor(new vrPlanner.Color("ffffff"));

      lineStyle.setWidth(0.1);
      this.verticalLine.setStyle(lineStyle);
      let pointNum = this.verticalLine.getNumVertices();
      if (pointNum === 0) {
        this.verticalLine.addVertex(loc.x(), loc.y(), loc.z());
        this.verticalLine.addVertex(loc.x(), loc.y(), 0);
      }

      modelLayer.addFeature(this.verticalLine);
    } else {
      modelLayer.removeFeature(this.verticalLine);
    }
  };

  moveVerticalLine = () => {
    let a = setInterval(() => {
      let b = this.models[0].point.getGeoLocation();

      this.verticalLine.setVertex(0, b);
      this.verticalLine.setVertex(1, b.x(), b.y(), 0);
    }, 10);
  };
  replaceClones = value => {
    const modelReader = new vrPlanner.Model.ModelReader();
    this.pointClones.forEach(item => {
      modelReader
        .read(Config.apiHost + value.source)
        .done(model => {
          item.getStyle().setModel(model);
        })
        .fail(function(error) {
          var hasNext;
          console.log(error);

          do {
            hasNext = error.hasNext();
            error = error.next();
          } while (hasNext);
        });
    });
  };
}
