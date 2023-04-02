import { CSSProperties, ReactNode, useState, useEffect } from "react";
import CardLayout from "./CardLayout";
import { Popover, Icon } from "antd";
import { feature } from "../Components/Header";

// const css = require("../../../styles/custom.css");
const scss = require("../../../styles/scss/sharepage.scss");

let vh = px => (px / 1080) * 100 + "vh";

interface Item {
  name: string;
  value: string;
  icon: string;
  unit: string;
  change?: number | boolean;
  quality?: string;
}
interface AvatarCardProps {
  title?: string;
  enTitle?: string;
  suffixIcon?: ReactNode;
  data: Array<Item>;
  flex?: boolean;
  colWidth?: Array<number>;
  rowHeight?: number;
  style?: CSSProperties;
  className?: string;
  imgHeight?: number;
  imgWidth?: number;
  percent?: boolean;
  arrowIcon?: boolean;
  placement?: "top" | "bottom";
  center?: boolean;
  address?: string;
  dropdownData?: Array<any>;
}

export default function AvatarCardY({
  title,
  enTitle,
  suffixIcon = null,
  data,
  colWidth = [200, 190],
  rowHeight = 90,
  flex = false,
  style = undefined,
  className = "",
  imgHeight = 36,
  imgWidth,
  percent = false,
  arrowIcon = false,
  placement = "top",
  center = false,
  address = "丽水",
  dropdownData
}: AvatarCardProps) {
  const _style = {
    display: "grid",
    gridTemplateColumns: `${colWidth.join("px ") + "px"}`,
    gridTemplateRows: `repeat(auto-fill, ${vh(rowHeight)}`,
    gridAutoRows: vh(rowHeight)
  };
  const hasAlarm =
    window.template &&
    window.template.indexOf("ecology") > -1 &&
    window.currentMenu &&
    window.currentMenu.title != "水利监测";
  return (
    <CardLayout
      title={title}
      enTitle={enTitle}
      suffixIcon={suffixIcon}
      style={style}
      className={className}
    >
      <div
        className={scss["avatar-gridY"]}
        style={
          flex ? { display: "flex", justifyContent: "space-between" } : _style
        }
      >
        {data.map((item, i) => (
          <div className={scss["item"]} key={i}>
            <div className={scss["icon"]}>
              <span
                style={{
                  width: imgWidth ? imgWidth + "px" : "auto",
                  display: "flex"
                }}
              >
                <img
                  src={item.icon}
                  style={{
                    margin: "auto",
                    height: imgWidth ? "auto" : imgHeight + "px"
                  }}
                  className={
                    hasAlarm && i == data.length - 1
                      ? scss["opacity-animation"]
                      : ""
                  }
                />
              </span>
            </div>
            <div>
              {placement === "top" ? (
                <>
                  {item.name.includes("(") ? (
                    <>
                      <h4>{item.name.slice(0, item.name.indexOf("("))}</h4>
                      <h5
                        style={{
                          margin: 0
                        }}
                      >
                        {" "}
                        {item.name.slice(item.name.indexOf("("))}
                      </h5>
                    </>
                  ) : (
                    <h4>{item.name}</h4>
                  )}
                  <div className={scss["flex"]}>
                    {percent ? (
                      <h1>{`${parseInt(item.value * 100)}%`}</h1>
                    ) : i == 0 ? (
                      <h1>
                        {item.value.split("℃")[0]}
                        <span style={{ fontSize: "16px", marginLeft: 0 }}>
                          ℃&nbsp;
                        </span>
                        {item.value.split("℃")[1]}
                        <span style={{ fontSize: "16px", marginLeft: 0 }}>
                          ℃
                        </span>
                      </h1>
                    ) : (
                      <h1>{item.value}</h1>
                    )}

                    <div className={scss["unit"]}>{item.unit}</div>
                    <h2
                      style={{
                        marginLeft: "8px",
                        color: "#02d281",
                        fontSize: "18px"
                      }}
                    >
                      {item.quality || ""}
                    </h2>
                    {arrowIcon ? (
                      <span>
                        <img
                          src={require(`../../../assets/arrow0${Number(
                            item.change
                          )}.png`)}
                          alt=""
                        />
                      </span>
                    ) : null}
                  </div>
                </>
              ) : (
                <>
                  {item.name.includes("(") ? (
                    <>
                      <h4>{item.name.slice(0, item.name.indexOf("("))}</h4>
                      <h4> {item.name.slice(item.name.indexOf("("))}</h4>
                    </>
                  ) : (
                    item.name
                  )}
                  <div className={scss["flex"]}>
                    <h1 style={{ textAlign: center ? "center" : "unset" }}>
                      {percent ? `${parseInt(item.value * 100)}%` : item.value}
                    </h1>
                    <div className={scss["unit"]}>{item.unit}</div>
                    <h2>{item.quality || ""}</h2>
                    {arrowIcon ? (
                      <span>
                        <img
                          src={require(`../../../assets/arrow0${Number(
                            item.change
                          )}.png`)}
                          alt=""
                        />
                      </span>
                    ) : null}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </CardLayout>
  );
}
