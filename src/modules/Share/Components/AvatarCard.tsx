import { CSSProperties, ReactNode } from "react";
import CardLayout from "./CardLayout";
import Play from "../../../components/tools/Play";

// const css = require("../../../styles/custom.css");
const scss = require("../../../styles/scss/sharepage.scss");

let vh = px => (px / 1080) * 100 + "vh";

interface Item {
  name: string;
  value: number;
  icon: string;
  change?: number | boolean;
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
  dropdownData?: Array<any>;
}

export default function AvatarCard({
  title,
  enTitle,
  suffixIcon = null,
  data,
  colWidth = [200, 190],
  rowHeight = 90,
  flex = false,
  style = undefined,
  className = "",
  imgHeight = 50,
  imgWidth,
  percent = false,
  arrowIcon = false,
  placement = "top",
  center = false,
  dropdownData = []
}: AvatarCardProps) {
  const _style = {
    gridTemplateColumns: `${colWidth.join("px ") + "px"}`,
    gridTemplateRows: `repeat(auto-fill, ${vh(rowHeight)}`,
    gridAutoRows: vh(rowHeight)
  };
  const _play = (e, item) => {
    if (
      window.template &&
      window.template.indexOf("ecology") > -1 &&
      window.currentMenu
    ) {
      // play(window.currentMenu.sub[i].feature!);
      const s =
        window.currentMenu.sub.find(s => item.name == s.title) ||
        window.currentMenu.sub.find(
          s => item.name.includes(s.title) || s.title.includes(item.name)
        );
      s && Play.play(s.feature!);
    }
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
        className={scss["avatar-grid"]}
        style={
          flex ? { display: "flex", justifyContent: "space-between" } : _style
        }
      >
        {data.map((item, i) => (
          <div
            className={scss["item"]}
            key={i}
            style={{ alignItems: center ? "center" : "unset" }}
          >
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
                    hasAlarm && i == data.length - 1 && item.value > 0
                      ? scss["opacity-animation"]
                      : ""
                  }
                />
              </span>
            </div>
            <div>
              {placement === "top" ? (
                <>
                  <div
                    className={arrowIcon ? scss["flex"] : ""}
                    style={{ textAlign: center ? "center" : "unset" }}
                  >
                    <h1 style={{ textAlign: center ? "center" : "unset" }}>
                      {percent ? `${parseInt(item.value * 100)}%` : item.value}
                    </h1>
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
                  {item.name.includes("(") ? (
                    <>
                      <h4 style={{ textAlign: center ? "center" : "unset" }}>
                        {item.name.slice(0, item.name.indexOf("("))}
                      </h4>
                      <h5
                        style={{
                          textAlign: center ? "center" : "unset",
                          margin: 0
                        }}
                      >
                        {" "}
                        {item.name.slice(item.name.indexOf("("))}
                      </h5>
                    </>
                  ) : (
                    <h4 style={{ textAlign: center ? "center" : "unset" }}>
                      {item.name}
                    </h4>
                  )}
                </>
              ) : (
                <>
                  {item.name.includes("(") ? (
                    <>
                      <h4 style={{ textAlign: center ? "center" : "unset" }}>
                        {item.name.slice(0, item.name.indexOf("("))}
                      </h4>
                      <h4 style={{ textAlign: center ? "center" : "unset" }}>
                        {" "}
                        {item.name.slice(item.name.indexOf("("))}
                      </h4>
                    </>
                  ) : (
                    item.name
                  )}
                  <div className={arrowIcon ? scss["flex"] : ""}>
                    {/* <div
                      className={
                        hasAlarm && i == data.length - 1
                          ? scss["dropdown-container"]
                          : ""
                      }
                    > */}
                    {hasAlarm && i == data.length - 1 ? (
                      <Popover
                        key={i}
                        placement="right"
                        content={
                          <ul className={scss["popover-box"]}>
                            {dropdownData
                              .slice(0, data[i].value)
                              .map((item, j) => {
                                return (
                                  <li
                                    key={j}
                                    className={
                                      scss["flex-center-between"] +
                                      " " +
                                      scss["pointer"]
                                    }
                                    onClick={e => _play(e, item)}
                                  >
                                    <h5>{item.name}</h5>
                                    {/* <Icon type="right" /> */}
                                  </li>
                                );
                              })}
                          </ul>
                        }
                        trigger="hover"
                        overlayClassName={scss["popover-container"]}
                      >
                        <h1 style={{ textAlign: center ? "center" : "unset" }}>
                          {percent
                            ? `${parseInt(item.value * 100)}%`
                            : item.value}
                        </h1>
                      </Popover>
                    ) : (
                      <h1 style={{ textAlign: center ? "center" : "unset" }}>
                        {percent
                          ? `${parseInt(item.value * 100)}%`
                          : item.value}
                      </h1>
                    )}
                    {/* </div> */}
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
