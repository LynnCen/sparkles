import { CSSProperties, ReactNode } from "react";
import CardLayout from "../../Components/CardLayout";
import { feature } from "../../Components/Header";

const scss = require("../../../../styles/scss/sharepage.scss");

let vh = px => (px / 1080) * 100 + "vh";

interface Item {
  name: string;
  value: number;
  icon: string;
  change?: number | boolean;
}
interface Props {
  title?: string;
  enTitle?: string;
  suffix?: { name: string; value: number; unit: string } | null;
  suffixIcon?: ReactNode;
  data?: Array<Item>;
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

export default function Overview({
  title,
  enTitle,
  suffix = null,
  suffixIcon = null,
  data,
  colWidth = [132, 132, 116],
  rowHeight = 96,
  flex = false,
  style = undefined,
  className = "",
  imgHeight = 32,
  imgWidth,
  percent = false,
  arrowIcon = false,
  center = false
}: Props) {
  const _style = {
    gridTemplateColumns: `${colWidth.join("px ") + "px"}`,
    gridTemplateRows: "unset",
    gap: `${vh(30)} 0`
    // gridTemplateRows: `repeat(auto-fill, ${vh(rowHeight)}`,
    // gridAutoRows: vh(rowHeight)
  };
  return (
    <CardLayout
      title={title}
      // enTitle={enTitle}
      suffixIcon={
        <div
          className={scss["transparent"]}
          style={{ display: "flex", alignItems: "end" }}
        >
          <span>{suffix.name}：</span>
          <span className={scss["value"]}>{suffix.value}</span>
          <span>{suffix.unit}</span>
        </div>
      }
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
            style={{ alignItems: "center" }}
          >
            <div className={scss["icon"]} style={{ marginRight: "14px" }}>
              <span
                style={{
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  backgroundImage: "url(./images/water/icons.png)"
                }}
              />
            </div>
            <div>
              <div className={arrowIcon ? scss["flex"] : ""}>
                <h1>{item.value}</h1>
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
                <h4>{item.name}</h4>
              )}
            </div>
          </div>
        ))}
      </div>
    </CardLayout>
  );
}
