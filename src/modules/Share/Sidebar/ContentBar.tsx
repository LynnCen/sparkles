import { useState, useEffect, CSSProperties } from "react";
import { Panel } from "../../../stores/markerModel";
import TabPaneBase from "../../Modal/TabPaneBase";
import { VideoLoaded } from "../../../components/Video";
const scss = require("../../../styles/scss/sharepage.scss");

type ContentBarProps = {
  data: Panel[];
  value?: number[];
  mask: boolean;
  onChange: (ids) => void;
  style: CSSProperties;
  className: string;
  itemStyle: CSSProperties;
  itemHeight: number;
  isFullScreen: boolean;
};
export default function ContentBar({
  data,
  value,
  mask,
  onChange,
  style,
  className,
  itemStyle = {},
  isFullScreen = false,
  ...props
}: ContentBarProps) {
  const [checkId, setCheckId] = useState<number[]>(value || []);
  const [_data, setData] = useState<Panel[]>([]);
  useEffect(
    () => {
      setData(data);
    },
    [data]
  );
  useEffect(
    () => {
      setCheckId(value);
    },
    [value]
  );
  const onVideoLoaded: VideoLoaded = ({ videoWidth, videoHeight }) => {
    let p = videoWidth! / videoHeight!;
    let videoW = 235 * p + 28;
    console.log(p);
  };
  const onCheck = (e, id: number) => {
    if (e.target.nodeName == "LI" || e.target.nodeName == "DIV") {
      if (checkId.includes(id)) {
        checkId.splice(checkId.findIndex(_id => _id == id), 1);
      } else {
        checkId.push(id);
      }
      setCheckId([...checkId]);
      onChange && onChange([...checkId]);
    }
  };
  return (
    <ul
      {...props}
      className={scss["sidebar-content"] + " " + className}
      style={{ ...style }}
    >
      {_data.map((tab, i) => (
        <li
          key={tab.id || i}
          data-type={tab.type}
          onClick={e => mask && onCheck(e, tab.id)}
          title={tab.name}
          style={itemStyle}
        >
          <TabPaneBase
            key={tab.id}
            tab={tab}
            height={itemStyle.height}
            onVideoLoaded={onVideoLoaded}
            isFullScreen={isFullScreen}
          />
          {mask && (
            <div
              className={
                scss["mask"] +
                " " +
                (checkId.includes(tab.id) ? scss["active"] : "")
              }
              style={{
                pointerEvents: tab.type == "externalLink" ? "auto" : "none"
              }}
            />
          )}
        </li>
      ))}
    </ul>
  );
}
