import {Component, createRef} from "react";
import {Carousel} from "antd";
import Config from "../../../config/Config";
import VideoPlayer from "../../Share/Components/VideoPlayer";
import {Panel} from "../../../stores/markerModel";
import {CarouselCard} from "./TableModal";

const css = require("../../../styles/custom.css");
const scss = require("../../../styles/scss/markerBox.scss");
let vh = px => (px / 1080) * 100 + "vh";

interface Props {
  address: string;
  tabs: [Panel] | null;
}

interface States {
}

export default class IframeModal extends Component<Props, States> {
  videoRef = createRef();

  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  componentWillUnmount() {
    if (this.videoRef.current && this.videoRef.current.player.hasStarted()) {
      this.videoRef.current.player.pause();
    }
  }

  render() {
    const {address, tabs} = this.props;
    let style = {};
    const hasMonitor = tabs.find(item => item.type == "monitor");
    if (!hasMonitor) {
      Object.assign(style, {gridTemplateColumns: "100%"});
    }
    return (
      <div className={scss["grid"]} style={style}>
        <div>
          <table style={{marginBottom: "12px"}}>
            <tbody>
            <tr>
              <td>监测类型</td>
              <td>{window.currentMenu.title}</td>
              <td>位置</td>
              <td>{address}</td>
            </tr>
            </tbody>
          </table>
          {tabs
            .filter(item => item.type == "externalLink")[0]
            .str.indexOf(".swf") > -1 ? (
            <embed
              width="100%"
              height="278"
              src={tabs.filter(item => item.type == "externalLink")[0].str!!}
            />
          ) : (
            <iframe
              // id={`tabs_${i}_iframe`}
              // name={`tabs_${i}_iframe`}
              src={tabs.filter(item => item.type == "externalLink")[0].str}
              border="0"
              frameBorder="0"
              framespacing="0"
              marginHeight="0"
              marginWidth="0"
              style={{
                width: "100%",
                background: "white"
              }}
            />
          )}
        </div>
        {hasMonitor ? (
          <div
            style={{
              display: "grid",
              // gridTemplateRows: "5fr 3fr",
              height: "100%"
            }}
          >
            <div style={{minWidth: "200px"}}>
              <Carousel
                dots={false}
                infinite={true}
                speed={500}
                arrows={true}
                slidesToShow={1}
                swipeToSlide={true}
                slidesToScroll={1}
                prevArrow={<img src={"./images/ecology/icon_arrowleft.png"}/>}
                nextArrow={<img src={"./images/ecology/icon_arrowright.png"}/>}
              >
                {tabs
                  .filter(item => item.type == "monitor")
                  .map((item, i) => (
                    <div key={i}>
                      <VideoPlayer
                        sources={[{src: item.str!}]}
                        triggerRef={ref => (this.videoRef.current = ref)}
                        style={{height: "100%", width: "100%"}}
                      />
                    </div>
                  ))}
              </Carousel>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}
