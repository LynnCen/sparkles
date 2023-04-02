import { CSSProperties } from "react";
import { Progress } from "antd";
import CardLayout from "./CardLayout";
import { ProgressGradient } from "antd/es/progress/progress";

const css = require("../../../styles/custom.css");
const scss = require("../../../styles/scss/sharepage.scss");

interface Item {
  name: string;
  value: number;
}
interface ProgressCircleCardProps {
  title?: string;
  enTitle?: string;
  data: Array<Item>;
  max?: number;
  strokeColor?: ProgressGradient; // ["#108ee9", "#87d068"]
  style?: CSSProperties;
  className?: string;
}

export default function ProgressCircleCard({
  title,
  enTitle,
  data,
  max = 100,
  strokeColor = { "0%": "#108ee9", "100%": "#87d068" },
  style = undefined,
  className = ""
}: ProgressCircleCardProps) {
  return (
    <CardLayout
      title={title}
      enTitle={enTitle}
      style={style}
      className={scss["progress-circle-card"] + " " + className}
    >
      <div className={scss["flex-center-between"]}>
        {data.map((item, i) => (
          <div key={i} className="">
            <Progress
              type="circle"
              strokeColor={strokeColor}
              width={79}
              strokeWidth={9}
              percent={(item.value / max) * 1.0 * 100}
              format={percent => parseInt((percent / 100) * max)}
            />
            <div className={scss["item-name"]}>{item.name}</div>
          </div>
        ))}
      </div>
    </CardLayout>
  );
}
