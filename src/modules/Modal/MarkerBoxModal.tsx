import { Component } from "react";
import { Panel } from "../../stores/markerModel";
import Config from "../../config/Config";
import TabPaneBase from "./TabPaneBase";
import TableModal from "./ecology/TableModal";
import GeologyModal from "./ecology/GeologyModal";
import VideoModal from "./ecology/VideoModal";
import IframeModal from "./ecology/IframeModal";
import { Mark, Balloon } from "../../components/model/";
import { Tabs, Icon, Modal } from "antd";
const { TabPane } = Tabs;

const scss = require("../../styles/scss/markerBox.scss");

interface Props {
  data: any;
}

interface States {
  isFullScreen: boolean;
  tabIndex: number;
  tabName: string;
  tabs: Panel[] | null;
  mark: Mark | Balloon;
  modalVisible: boolean;
}

export default class MarkerBox extends Component<Props, States> {
  markerBox;
  initWidth: number;
  videoWidth: number;
  mark: Mark | Balloon;
  minTabHeight = 224;
  modalTemplate: string;

  constructor(props: Props) {
    super(props);
    const { data } = props;
    this.markerBox = document.querySelector(`#markerBox${data.id}`)!!;
    this.initWidth = this.videoWidth = this.markerBox.offsetWidth || 375;
    this.state = {
      isFullScreen: false,
      tabIndex: 0,
      tabName: "",
      tabs: null,
      mark: data,
      modalVisible: false
    };
    if (self["template"] && self["template"].indexOf("ecology") > -1) {
      const tabs = this.state.mark.contents;
      tabs.find(item => {
        if (item.type == "externalLink") {
          if (item.str == "chart") {
            this.modalTemplate = "chart";
          } else {
            this.modalTemplate = "iframe";
          }
        } else if (item.type == "monitorData") {
          this.modalTemplate = "table";
        }
        if (this.modalTemplate) return true;
        else return false;
      });

      if (!this.modalTemplate) {
        tabs.find(item => {
          if (item.type == "video" || item.type == "monitor") {
            this.modalTemplate = "video";
          }
          return item;
        });
      }
      window.chartPlace = data.title;
    }
  }

  onTabChange = key => {
    const {
      mark: { contents }
    } = this.state;
    this.setState({
      tabIndex: Number(key),
      tabName: contents[key].name
    });
    let dom = this.markerBox;
    if (contents[key].type === "video") {
      dom.style.width = `${this.videoWidth}px`;
      if (contents[key].proportion) {
        this.onVideoLoaded({}, contents[key]);
      }
    } else {
      if (dom.offsetWidth > this.initWidth) {
        dom.style.width = "auto";
      }
      dom.style.height =
        Math.max(
          this.minTabHeight,
          34 * contents!.length + contents!.length - 1
        ) +
        32 +
        "px";
    }
  };

  onVideoLoaded = (
    { videoWidth = undefined, videoHeight = undefined },
    tab
  ) => {
    if (videoWidth && videoHeight && tab.proportion) return;
    const {
      mark: { contents }
    } = this.state;
    let p = tab.proportion || this.initWidth / this.minTabHeight;
    if (typeof videoWidth == "number" && typeof videoHeight == "number")
      p = videoWidth / videoHeight;
    let h = Math.max(
      this.minTabHeight,
      34 * contents!.length + contents!.length - 1
    );
    let w = this.initWidth;
    if (p >= this.initWidth / h) {
      // h = Math.min(h, videoHeight);
      w = (h - 20) * p + 20 + 39;
    } else {
      // w = Math.min(this.initWidth, videoWidth);
      // h = (w - 28) / p;
    }
    this.markerBox.style.width = w + "px";
    this.markerBox.style.height = h + 32 + "px";
    !tab.proportion && (tab.proportion = p);
  };

  showModal = e => {
    this.setState({ modalVisible: true });
  };

  render() {
    const { data } = this.props;
    const { title } = data;
    const { isFullScreen, tabIndex, mark, modalVisible } = this.state;
    const { contents } = mark;
    let tabHeight = Math.max(
      this.minTabHeight,
      contents ? 34 * contents.length + contents.length - 1 : 0
    );
    const ecologyModals = {
      table: <TableModal address={title} tabs={contents} />,
      chart: <GeologyModal address={title} tabs={contents} />,
      video: (
        <VideoModal
          address={title}
          monitors={contents.filter(item => item.type == "monitor")}
        />
      ),
      iframe: <IframeModal address={title} tabs={contents} />
    };
    return (
      <>
        <div className={scss["popup"]}>
          {contents && contents.length && (
            <div className={scss["popup-container"]}>
              <header>
                <span>
                  {/* {title}-{tabs && tabs.length ? tabs[0].name : ""} */}
                  {title}
                  {`${
                    contents[tabIndex].name.trim()
                      ? `-${contents[tabIndex].name}`
                      : ""
                  }`}
                </span>
                <span>
                  {self["template"] &&
                  self["template"].indexOf("ecology") > -1 ? (
                    <Icon
                      type="more"
                      style={{ transform: "rotate(90deg)" }}
                      onClick={this.showModal}
                    />
                  ) : null}
                  <Icon
                    type={`fullscreen${isFullScreen ? "-exit" : ""}`}
                    onClick={() =>
                      this.setState({ isFullScreen: !isFullScreen })
                    }
                  />
                  <img
                    src={require("../../assets/close.png")}
                    alt="close"
                    className={scss["pointer"]}
                    onClick={e => {
                      mark.showMessage = true;
                      mark.showBalloonData();
                      this.setState({ tabIndex: 0 });
                    }}
                  />
                  {/* <Icon type="close" /> */}
                </span>
              </header>
              <Tabs type="card" tabPosition="right" onChange={this.onTabChange}>
                {contents.map((tab, i) => (
                  <TabPane
                    tab={<img src={Config.apiHost + tab.icon} alt="" />}
                    key={i}
                  >
                    <TabPaneBase
                      tab={tab}
                      height={tabHeight!}
                      onVideoLoaded={arg => this.onVideoLoaded(arg, tab)}
                    />
                  </TabPane>
                ))}
              </Tabs>
              {isFullScreen && (
                <Modal
                  title={
                    <div className={scss["modalHeader"]}>
                      <span>
                        {title}-{contents[tabIndex].name}
                      </span>

                      <Icon
                        type={`fullscreen${isFullScreen ? "-exit" : ""}`}
                        className={scss["pointer"]}
                        onClick={e =>
                          this.setState({
                            isFullScreen: !this.state.isFullScreen
                          })
                        }
                      />
                    </div>
                  }
                  visible={this.state.isFullScreen}
                  centered
                  mask={false}
                  maskClosable={false}
                  footer={null}
                  width={"100%"}
                  height={"100%"}
                  className={`${isFullScreen ? scss["modalFull"] : " "}`}
                  destroyOnClose={true}
                  // forceRender={true}
                  // onCancel={e => this.setState({ isFullScreen: false })}
                  onCancel={e => {
                    this.setState({ isFullScreen: false });
                    mark.showMessage = true;
                    mark.showBalloonData();
                  }}
                >
                  <TabPaneBase
                    tab={contents.find((tab, i) => i === tabIndex)!!}
                    height={tabHeight}
                    isFullScreen={true}
                    onVideoLoaded={this.onVideoLoaded}
                  />
                </Modal>
              )}
            </div>
          )}
          {self["template"] && self["template"].indexOf("ecology") > -1 ? (
            <Modal
              title={title}
              visible={modalVisible}
              footer={null}
              // mask={false}
              centered
              destroyOnClose={true}
              // forceRender={true}
              onCancel={e => this.setState({ modalVisible: false })}
              className={scss["popup-modal"]}
              content={<div>hi</div>}
            >
              {ecologyModals[this.modalTemplate]}
            </Modal>
          ) : null}
        </div>
      </>
    );
  }
}
