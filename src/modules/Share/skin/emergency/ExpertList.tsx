import { CSSProperties, ReactNode } from "react";
// import { Drawer, Button, Select, Cascader } from "antd";
import CardLayout from "../../Components/CardLayout";
const scss = require("../../../../styles/scss/sharepage.scss");
// let vh = px => (px / 1080) * 100 + "vh";

interface Props {
  title?: string;
  enTitle?: string;
  suffixIcon?: ReactNode;
  data: Array<any>;
  flex?: boolean;
  colWidth?: Array<number>;
  rowHeight?: number;
  style?: CSSProperties;
  className?: string;
}
export default function ExpertList({
  title,
  enTitle,
  suffixIcon = null,
  data,
  style = undefined,
  className = ""
}: Props) {
  return (
    <CardLayout
      title={title}
      enTitle={enTitle}
      suffixIcon={suffixIcon}
      style={style}
      className={className}
    >
      <div className={className} style={{}}>
        {data.map((item, i) => (
          <div
            className={scss["item"] + " " + scss["grid"]}
            key={i}
            style={{
              gridTemplateColumns: "96px 132px auto",
              gridTemplateRows: "35px"
            }}
          >
            <h4>{item.name}</h4>
            <h4>{item.education}</h4>
            <h4>{item.major}</h4>
          </div>
        ))}
      </div>
    </CardLayout>
  );
}
