import { CSSProperties, ReactNode } from "react";
import CardLayout from "./CardLayout";
import { Divider } from "antd";

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
  data: any;
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
        {data.data.map((item, i) => (
          <div className={scss["tianqiItem"]} key={i}>
            <div className={scss["icon"]}>
              <span>
                <img src={item.avatar} />
              </span>
            </div>
            <div>
              <div
                className={
                  scss["arial"] +
                  " " +
                  scss["white"] +
                  " " +
                  (item.name == "风向" ? scss["fengxiang"] : "")
                }
                style={{
                  lineHeight: "20px",
                  marginBottom: "5px"
                }}
              >
                {item.value || ""}
              </div>
              <div style={{ opacity: 0.8, fontSize: "12px", color: "#fff" }}>
                {item.name}
              </div>
            </div>
          </div>
        ))}
      </div>
      <Divider className={scss["divider"]}>
        {data.week} <span style={{ fontSize: "12px" }}> {data.day}</span>
      </Divider>
    </CardLayout>
  );
}
