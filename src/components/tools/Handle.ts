import Config from "../../config/Config";
import { message } from "antd";
import PlanService from "../../services/PlanService";
import Play from "./Play";
const { maps, vrPlanner } = Config;
export const transition = (time = 0.1) =>
  new vrPlanner.Transition(time, vrPlanner.Interpolation.CubicBezier.EASE);

export class Handle {
  static HomeHandle() {
    const camera = maps.getCamera();
    camera.isMoving() && this.stopCamera();
    if (Config.CameraPosition) {
      const { cameraLook, cameraPosition } = JSON.parse(Config.CameraPosition);
      if (cameraLook && cameraPosition) {
        const pos = new vrPlanner.GeoLocation(
          new vrPlanner.Math.Double3.create(JSON.parse(cameraPosition))
        );
        const lookAt = new vrPlanner.GeoLocation(
          new vrPlanner.Math.Double3.create(JSON.parse(cameraLook))
        );
        const timer = setInterval(() => {
          let p = camera.getGeoLocation();
          if (p.distance(pos) < 5) {
            clearInterval(timer);
          } else camera.setPosition(pos, lookAt);
        });
      } else {
        message.warning("暂未设置初始视角");
      }
    } else {
      message.warning("暂未设置初始视角");
    }
  }
  static stopCamera = () => {
    const camera = maps.getCamera();
    // camera.unbindEvent("stop");
    const pos = camera.getPosition();
    const look = camera.getLookAt();
    camera.flyTo(pos, look, false, transition());
    clearTimeout(Play.timer as NodeJS.Timeout);
    Play.timer = 0;
  };

  // static MenuMove({
  //   arg = [],
  //   index = 0,
  //   move = 0,
  //   type = 1,
  //   id = 0,
  //   fatherId = 0,
  //   reverse = false
  // }) {
  //   let isMoving = false;
  //   let step = move > 0 ? -1 : 1;
  //   isMoving = arg[index + step].id > 0;
  //   if (id && isMoving) {
  //     const data = { move: reverse ? 1 - move : move, id, fatherId, type };
  //     return new Promise((resolve, reject) =>
  //       PlanService.SortMenu(data, (success, res) => {
  //         if (success) {
  //           arg[index] = arg.splice(index + step, 1, arg[index])[0];
  //           resolve(arg);
  //         } else message.error(res.message), reject();
  //       })
  //     );
  //   } else return Promise.reject();
  // }
}

export default Handle;
