import Config from "../../config/Config";
const { vrPlanner, maps } = Config;
export default class SimpleAnimation {
  static animations: SimpleAnimation[] = [];
  animate: vrPlanner.Animation;
  id?;
  private features: object[] = [];
  private keyframes: vrPlanner.Animation.Keyframe[] = [];
  private motionPath: vrPlanner.Animation.MotionPath3D;
  points: object[];
  curveOption: {
    type: "CatmullRomCurve3D" | "LineCurve3D";
    closed: boolean;
    tension?: number;
  };
  timingOption: { delay; iterations; speed?; duration?; direction; easing };
  timing: vrPlanner.Animation.Timing;
  persistent;
  groupEffect: object;
  status: string;

  constructor({
    id,
    features,
    keyframes,
    points,
    curveOption = { type: "CatmullRomCurve3D", closed: false, tension: 0.5 },
    timingOption = {
      delay: 0,
      iterations: 1,
      duration: 5,
      direction: "alternate",
      easing: "linear"
    },
    persistent = false
  }) {
    this.init({
      id,
      features,
      keyframes,
      points,
      curveOption,
      timingOption,
      persistent
    });
    Object.assign(SimpleAnimation.prototype, this.animate.__proto__);
    SimpleAnimation.animations.push(this);
    return this;
  }

  private init({ ...args }) {
    Object.entries(args).forEach(([k, v]) => (this[k] = v));
    this.setTimingOption();
    this.setPoints();
  }

  setTimingOption() {
    const { speed, duration } = this.timingOption;
    if (typeof duration != "number") {
      let distance = this.points.reduce(
        (d, p, i) => (
          i > 0 &&
            (d += vrPlanner.Math.Vecmath.distance(this.points[i - 1], p)),
          d
        ),
        0
      );
      this.timingOption.duration = distance / speed;
    }
  }

  setPoints(points = this.points) {
    let curve;
    if (this.curveOption.type == "CatmullRomCurve3D") {
      curve = new vrPlanner.Curve.CatmullRomCurve3D(
        points,
        this.curveOption.closed,
        vrPlanner.Curve.CatmullRomCurve3D.Parameterization.createUniform(
          this.curveOption.tension
        )
      );
    } else
      curve = new vrPlanner.Curve.LineCurve3D(points, this.curveOption.closed);
    this.points = points;
    this.motionPath = new vrPlanner.Animation.MotionPath3D([curve]);
    this.setGroupEffect();
  }

  setGroupEffect() {
    let groupEffect = new vrPlanner.Animation.GroupEffect(
      this.features.map(
        feature =>
          new vrPlanner.Animation.KeyframeEffect(
            feature,
            this.keyframes,
            new vrPlanner.Animation.Timing({ ...this.timingOption }),
            {
              position: this.motionPath
            }
          )
      )
    );
    this.animate = maps.animate(groupEffect, this.persistent);
    Object.assign(this, this.animate);
  }
}
