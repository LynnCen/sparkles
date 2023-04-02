import React from "react";
import Config from "../config/Config";

const css = require("../styles/scss/modal.scss");
/**
 * @name ImageShow
 * @author: bubble
 * @create: 2019/4/23
 * @description: ImageShow
 */
const ImageShow = ({imgUrl, title = "", icon, onClick, check = null}) => {
  return imgUrl ? (
    <div
      className={css["vrp-thumb"] + (icon ? " " + css["icon"] : "")}
      title={title}
      style={{backgroundImage: `url(${Config.apiHost + imgUrl})`}}
      onClick={onClick}
    >
      {check ? check : null}
    </div>
  ) : (
    <div className={css["no-thumb"]}>暂无图片</div>
  );
};

export default ImageShow;
