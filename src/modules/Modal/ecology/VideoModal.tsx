import { Component, createRef } from "react";
import Config from "../../../config/Config";
import VideoPlayer from "../../Share/Components/VideoPlayer";
import { Carousel } from "antd";

// import "../../styles/scss/markerBox.css";
// require("../styles/scss/markerBox.css");
const css = require("../../../styles/custom.css");
const scss = require("../../../styles/scss/markerBox.scss");
let vh = px => (px / 1080) * 100 + "vh";

interface Props {
  address: string;
  monitors: Array<any>;
}

interface States {}
export default class VideoModal extends Component<Props, States> {
  videoRef = createRef();
  constructor(props: Props) {
    super(props);
    this.state = {};
  }
  componentWillUnmount() {
    if (this.videoRef.current && this.videoRef.current.player.hasStarted()) {
      this.videoRef.current.player.pause();
      // videoRef.current.player.dispose();
    }
  }
  render() {
    const { address, monitors } = this.props;
    return (
      <div className={scss["grid"]} style={{ gridTemplateColumns: "100%" }}>
        <div>
          <table style={{ marginBottom: "12px" }}>
            <tbody>
              <tr>
                <td>监测类型</td>
                <td>{window.currentMenu.title}</td>
                <td>位置</td>
                <td>{address}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style={{ height: "600px" }}>
          <Carousel
            dots={false}
            infinite={true}
            speed={500}
            arrows={true}
            slidesToShow={1}
            swipeToSlide={true}
            slidesToScroll={1}
            prevArrow={<img src={"./images/ecology/icon_arrowleft.png"} />}
            nextArrow={<img src={"./images/ecology/icon_arrowright.png"} />}
          >
            {monitors.map((item, i) => (
              <div key={i}>
                <VideoPlayer
                  sources={[{ src: item.str! }]}
                  triggerRef={ref => (this.videoRef.current = ref)}
                  style={{ height: "100%", width: "100%" }}
                />
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    );
  }
}
