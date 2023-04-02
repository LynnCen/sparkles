import { CSSProperties, ReactNode } from "react";
import CardLayout from "./CardLayout";

const css = require("../../../styles/custom.css");
const scss = require("../../../styles/scss/sharepage.scss");

interface Item {
  name: string;
  value?: number | string;
  avatar: string;
}
interface AvatarFlexCardProps {
  title?: string;
  enTitle?: string;
  suffixIcon?: ReactNode;
  data: Array<Item>;
  style?: CSSProperties;
  className?: string;
}

export default function AvatarFlexCard({
  title,
  enTitle,
  suffixIcon = null,
  data,
  style = undefined,
  className = ""
}: AvatarFlexCardProps) {
  return (
    <CardLayout
      title={title}
      enTitle={enTitle}
      suffixIcon={suffixIcon}
      style={style}
      className={className}
    >
      <div className={css["flex-center-between"] + " " + scss["center"]}>
        {data.map((item, i) => (
          <div className={scss["item"]} key={i}>
            <div className={scss["icon"]}>
              <span>
                <img src={item.avatar} />
              </span>
            </div>
            <div>
              <h2
                className={scss["arial"] + " " + scss["white"]}
                style={{ lineHeight: "17px", marginBottom: "5px" }}
              >
                {item.value || ""}
              </h2>
              <h4 style={{ opacity: 0.8 }}>{item.name}</h4>
            </div>
          </div>
        ))}
      </div>
    </CardLayout>
  );
}
