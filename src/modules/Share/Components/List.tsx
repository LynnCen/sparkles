import { CSSProperties, ReactNode, useState, useRef, useEffect } from "react";
import { Icon } from "antd";
import { feature } from "../Components/Header";
import Play from "../../../components/tools/Play";
const css = require("../../../styles/custom.css");
const scss = require("../../../styles/scss/sharepage.scss");

let vh = px => (px / 1080) * 100 + "vh";
interface Props {
  data?: Array<any>;
  style?: CSSProperties;
  className?: string;
  offset?: number;
}
export default function List({
  data,
  className = "",
  style = undefined,
  offset = 0
}: Props) {
  const handleClick = (e, i) => {
    if (
      window.template &&
      window.template.indexOf("ecology") > -1 &&
      window.currentMenu
    ) {
      // console.log(window.currentMenu.sub, i, play);
      // debugger;
      Play.play(window.currentMenu.sub[offset + i].feature!);
    }
  };
  return (
    <div className={scss["list"] + " " + className} style={style}>
      {data.map((item, i) => (
        <div
          key={i}
          className={scss["flex-center-between"] + " " + scss["pointer"]}
          onClick={e => handleClick(e, i)}
        >
          <h5>{item || item.str}</h5>
          <Icon type="right" />
        </div>
      ))}
    </div>
  );
}
