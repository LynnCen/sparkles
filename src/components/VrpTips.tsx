import {ReactNode} from "react";
import Config from "../config/Config";
import {notification} from "antd";

/**
 * @name VrpTips
 * @create: 2019/01/19
 * @description: 提示面板
 */

export default class VrpTips {

  static showTips = (title: string, content: string | ReactNode, width?: number, duration?: number,) => {
    notification.destroy();
    let count = Config.ActionTipsCount;
    if (count < 50) {
      count = count + 1;
      notification.warning({
        placement: "bottomLeft",
        message: title,
        duration: duration ? duration : 20,
        description: content,
        style: {
          width: width ? width : 260
        }
      });
    }
  }
}


