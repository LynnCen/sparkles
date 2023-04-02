import { CSSProperties } from "react";
import CardLayout from "./CardLayout";

const css = require("../../../styles/custom.css");
const scss = require("../../../styles/scss/sharepage.scss");
let vh = px => (px / 1080) * 100 + "vh";

interface Item {
  name: string;
  value: number;
  change?: boolean;
  title?: string;
}
interface TextCardProps {
  title?: string;
  enTitle?: string;
  data: Array<Item>;
  style?: CSSProperties;
  className?: string;
  color?: string;
  itemWidth?: number;
  arrowIcon?: boolean;
}

export default function TextCard({
  title,
  enTitle,
  data,
  style = undefined,
  className = "",
  color = "white",
  itemWidth = 108,
  arrowIcon = false
}: TextCardProps) {
  // console.log(data);
  return (
    <CardLayout
      title={title}
      enTitle={enTitle}
      style={style}
      className={scss["text-card"] + " " + className}
    >
      <div className={css["flex-center-between"] + " " + scss["center"]}>
        {data.map((item, i) => (
          <div key={i}>
            <div
              className={scss["item"]}
              key={i}
              style={{
                borderRadius: "6px",
                border: "1px solid rgba(255,255,255,.5)",
                width: itemWidth
              }}
            >
              {/* <div className={""}> */}
              <h2
                className={css["m-x-sm"]}
                style={{
                  color,
                  borderBottom: item.name
                    ? "1px solid rgba(255,255,255,.4)"
                    : "",
                  marginBottom: 0
                }}
              >
                {item.value}
                {arrowIcon ? (
                  <span>
                    <img
                      src={`./images/water/arrow0${Number(item.change)}.png`}
                      style={{
                        margin: `0 0 0 ${
                          String(item.value).length > 5 ? 0 : "5px"
                        }`
                      }}
                      alt=""
                    />
                  </span>
                ) : null}
              </h2>
              {/* </div> */}
              {/* <div> */}
              <h4 style={{ lineHeight: vh(29) }}>{item.name}</h4>
              {/* </div> */}
            </div>
            <h4 style={{ lineHeight: vh(34) }}>{item.title}</h4>
          </div>
        ))}
      </div>
    </CardLayout>
  );
}
