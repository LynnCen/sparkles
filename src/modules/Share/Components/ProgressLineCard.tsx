import { CSSProperties, ReactNode } from "react";
import { Progress } from "antd";
import { ProgressGradient } from "antd/es/progress/progress";
import CardLayout from "./CardLayout";
import DateCardLayout from "./DateCardLayout";

const scss = require("../../../styles/scss/sharepage.scss");

interface Item {
  name: string;
  value: number;
  unit?: string;
  color?: ProgressGradient;
}
interface ProgressLineCardProps {
  title?: string | React.ReactNode;
  enTitle?: string;
  suffixIcon?: ReactNode;
  datePicker?: boolean;
  data: Array<Item>;
  // max: number;
  strokeColor?: ProgressGradient; // ["#108ee9", "#87d068"]
  format?:
    | ((percent?: number, successPercent?: number) => React.ReactNode)
    | boolean;
  style?: CSSProperties;
  className?: string;
}

export default function ProgressLineCard({
  title,
  enTitle,
  suffixIcon = null,
  datePicker = false,
  data,
  strokeColor = { "0%": "#108ee9", "100%": "#87d068" },
  format,
  style = undefined,
  className = ""
}: ProgressLineCardProps) {
  let Component = datePicker ? DateCardLayout : CardLayout;
  let itemNameWidth = data[0].name.length;
  data.forEach(
    e => e.name.length > itemNameWidth && (itemNameWidth = e.name.length)
  );
  return (
    <Component
      title={title}
      enTitle={enTitle}
      suffixIcon={Component == CardLayout ? suffixIcon : null}
      style={style}
      className={scss["progress-line-card"] + " " + className}
    >
      <div style={{ display: "grid", gridRowGap: "12px" }}>
        {data.map((item, i) => (
          <div className={scss["item"] + " " + scss["flex"]} key={i}>
            <div
              className={scss["item-name"]}
              style={{ width: itemNameWidth + 0.1 + "em", textAlign: "right" }}
            >
              <h4 style={{ width: itemNameWidth + 0.1 + "em" }}>{item.name}</h4>
            </div>
            <Progress
              strokeColor={item.color || strokeColor}
              percent={parseInt(item.value * 100)}
              status="active"
              format={
                typeof format === "boolean"
                  ? (percent, successPercent) => <span>{item.unit}</span>
                  : typeof format === "function"
                  ? format
                  : undefined
              }
            />
          </div>
        ))}
      </div>
    </Component>
  );
}
