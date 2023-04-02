import { useState } from "react";
import Config from "../../config/Config";
import { Icon, message } from "antd";
import VrpIcon from "../../components/VrpIcon";
import DataService from "../../services/DataService";
import PlanService from "../../services/PlanService";
const css = require("../../styles/custom.css");
const { maps } = Config;

export default function({ imgList, delShotImg }) {
  const [down, setDown] = useState(true);

  const setPlanCover = i => {
    const { canvas } = imgList[i];
    canvas.toBlob(blob => {
      const formData = new FormData();
      formData.append("type", "plan");
      formData.append("file", blob);
      DataService.upload(formData, "/Open/UploadImg", (flag: boolean, res) => {
        flag
          ? PlanService.updatePlan(
              { id: Config.PLANID, picture: res.data },
              (f, r) => message[f ? "success" : "error"](r.message)
            )
          : message.error(res.message);
      });
    });
  };
  return (
    <div className={css["vrp-shot-img"] + " " + (down ? "" : css["hide"])}>
      <div className={css["shot-img-list"]}>
        <div className={css["img-action"]} onClick={() => setDown(!down)}>
          <Icon type={down ? "down" : "up"} style={{ opacity: 0.8 }} />
        </div>
        {imgList.map((item, i) => {
          return (
            <div className={css["shot-img-item"]} key={i}>
              <img
                src={item.dataUrl}
                className={css["shot-img"]}
                onClick={() =>
                  maps.getCamera().flyTo(item.cameraPos, item.cameraLook)
                }
              />
              <div>
                {Config.loggedIn && (
                  <VrpIcon
                    className={css["vrp-menu-icon"]}
                    iconName={"icon-tupian"}
                    title="设置为方案封面"
                    onClick={() => setPlanCover(i)}
                  />
                )}
                <VrpIcon
                  className={css["vrp-menu-icon"]}
                  iconName={"icon-quit"}
                  title="关闭"
                  onClick={() => delShotImg(i)}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
