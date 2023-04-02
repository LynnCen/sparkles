import { Component, CSSProperties } from "react";
import Config from "../../config/Config";

interface WatermarkProps {
  picture: string;
  title: string;
  style?: CSSProperties;
}

class Watermark extends Component<WatermarkProps, {}> {
  constructor(props: WatermarkProps) {
    super(props);
  }

  render() {
    const { picture, title, style } = this.props;
    const hasPic = picture && picture != "null";
    return (
      (hasPic || title) && (
        <div className="vrp-watermaker" style={style}>
          {hasPic && (
            <img src={Config.apiHost + picture} style={{ width: "100%" }} />
          )}
          {title && <p style={{ textAlign: "center", margin: 0 }}>{title}</p>}
        </div>
      )
    );
  }
}

export default Watermark;
