import { Component, createRef, CSSProperties } from "react";
import { Panel } from "../../stores/markerModel";
import Config from "../../config/Config";
import Video, { VideoLoaded } from "../../components/Video";
import VideoPlayer from "../Share/Components/VideoPlayer";
import { Carousel, Popover, message } from "antd";
import WaterService from "../../services/WaterService";
import { surveyItems } from "../../config/StrConfig";

const scss = require("../../styles/scss/markerBox.scss");

interface Props {
  height?: number;
  initWidth: number;
  tab: Panel;
  isFullScreen?: boolean;
  onVideoLoaded?: VideoLoaded;
  style?: CSSProperties;
}

interface States {
  // id: number;
  tab: { [key: string]: any };
}

export default class TabPaneBase extends Component<Props, States> {
  // frame: RefObject<HTMLIFrameElement> = createRef();
  videoRef = createRef();
  isTableData = false;
  echart;
  constructor(props) {
    super(props);
    this.state = {
      tab: props.tab
    };
  }
  componentDidMount() {
    const tab = this.props.tab;
    if (tab.type == "monitorData") {
      for (let item of tab.items) {
        let source: any = item.source;
        try {
          source = JSON.parse(source);
          const dataKeys = ["monitor", "addr", "type"];
          if (dataKeys.every(k => Object.keys(source).includes(k))) {
            delete source.id;
            WaterService.getValueByAddrAndTableName(source, (f, res) => {
              if (f) {
                res.data.length && ((source.value = res.data[0].value), (source.data = res.data));
                const m = surveyItems.monitors[source.monitor];
                const t = m.type.find(e => e.value == source.type);
                source.addr = m.addr[source.addr];
                source.monitor = m.value;
                source.itemName = t.name;
                item.source = source;
                this.setState({ tab });
              } else {
                message.error("获取水环境监测数据失败~~");
              }
            });
            this.isTableData = true;
          } else {
            console.warn("非表格数据~~");
            break;
          }
        } catch (e) {
          console.error("数据源解析错误~~");
          break;
        }
      }
    }
  }
  componentWillUnmount() {
    if (this.videoRef.current && this.videoRef.current.player.hasStarted()) {
      this.videoRef.current.player.pause();
    }
  }
  showPopover = (visible: boolean, hoverItem) => {
    const { id, monitor, addr, itemName, unit, data } = hoverItem;
    // if (this.echart) this.echart.dispose();
    if (
      !this.echart ||
      !window["echarts"].getInstanceByDom(document.getElementById(`echarts${id}`))
    )
      this.echart = window["echarts"].init(document.getElementById(`echarts${id}`)); // 各初始化一次
    const option = {
      title: {
        text: addr + "-" + monitor + "-" + itemName,
        subtext: `近一天变化值${unit ? `(${unit})` : ""}`,
        left: "center"
      },
      grid: { left: "10%", right: 54, bottom: 32 },
      xAxis: {
        type: "category",
        data: data.reverse().map(e => e.time.slice(e.time.indexOf("-") + 1))
      },
      yAxis: { type: "value" },
      series: [{ type: "line", data: data.map(e => e.value) }]
    };
    this.echart.setOption(option, true);
  };
  verticalItem = (item, i) => (
    <div className={scss["item"]} key={i} onClick={e => {}}>
      <div style={{ backgroundColor: item.color }}>{item.itemName}</div>
      <div>
        <span>{item.source.value}</span>
        {item.source.unit}
      </div>
    </div>
  );
  horizontalItem = (item, i) => (
    <>
      <div
        className={scss["item"]}
        style={{
          backgroundColor: item.color
        }}
        key={2 * i}
      >
        {item.itemName}
      </div>
      <div className={scss["item"]} key={2 * i + 1}>
        <span>{item.source.value}</span>
        {item.source.unit}
      </div>
    </>
  );
  render() {
    const { height, isFullScreen, onVideoLoaded, style } = this.props;
    const { tab } = this.state;
    return (
      <div
        style={{
          minHeight: "224px",
          // minHeight: `${height}px`,
          height: isFullScreen ? "100%" : height ? height : "inherit",
          // maxHeight: `calc(34px * ${tabs.length + 1} + ${
          //   tabs.length
          // }px)`,
          width: "max-content",
          minWidth: "100%",
          padding: /monitorData/.test(tab.type) ? "0" : "10px",
          overflow: "hidden auto",
          textAlign: tab.type == "externalLink" ? "unset" : "center",
          position: "relative",
          maxWidth: tab.type == "monitorData" ? "auto" : "336px",
          // paddingRight: tab.type == "monitorData" ? "38px" : "unset"
          ...style
        }}
      >
        {(() => {
          switch (tab.type) {
            case "monitorData":
              let itemNameWidth = tab.items.length ? tab.items![0].itemName.length : 0;
              tab.items!.forEach(
                e => e.itemName.length > itemNameWidth && (itemNameWidth = e.itemName.length)
              );
              itemNameWidth > 10 && (itemNameWidth = 10);
              return (
                <div style={{}}>
                  <div className={scss["tabContent1"]}>
                    {tab
                      .items!!.filter(e => e.showLarge)
                      .map((item, i) => {
                        let source = "";
                        try {
                          source =
                            typeof item.source == "object"
                              ? item.source
                              : source != ""
                              ? JSON.parse(item.source)
                              : {};
                        } catch (e) {
                          console.warn(e);
                        }
                        return source && this.isTableData ? (
                          <Popover
                            key={i}
                            placement="top"
                            content={
                              <div
                                id={`echarts${item.id}`}
                                style={{ height: "270px", width: "550px" }}
                              />
                            }
                            trigger="hover"
                            onVisibleChange={val => {
                              this.showPopover(val, { ...source, id: item.id });
                            }}
                            overlayClassName={scss["popover-container"]}
                          >
                            {this.verticalItem(item, i, source)}
                          </Popover>
                        ) : (
                          this.verticalItem(item, i, source)
                        );
                      })}
                  </div>
                  {/* <div
                    className={scss["tabContent2"]}
                    style={{
                      gridTemplateColumns: itemNameWidth + 1 + "rem auto"
                    }}
                  > */}
                  {tab
                    .items!!.filter(e => !e.showLarge)
                    .map((item, i) => {
                      let source;
                      try {
                        source =
                          typeof item.source == "object"
                            ? item.source
                            : source != ""
                            ? JSON.parse(item.source)
                            : {};
                      } catch (e) {
                        console.warn(e);
                      }
                      return source && this.isTableData ? (
                        <Popover
                          key={i}
                          placement="top"
                          content={
                            <div
                              id={`echarts${item.id}`}
                              style={{ height: "270px", width: "550px" }}
                            />
                          }
                          trigger="hover"
                          onVisibleChange={val => {
                            this.showPopover(val, { ...source, id: item.id });
                          }}
                          overlayClassName={scss["popover-container"]}
                        >
                          <div
                            className={scss["tabContent2"]}
                            style={{
                              gridTemplateColumns: itemNameWidth + 1 + "rem auto"
                            }}
                          >
                            {this.horizontalItem(item, i, source)}
                          </div>
                        </Popover>
                      ) : (
                        <div
                          className={scss["tabContent2"]}
                          style={{
                            gridTemplateColumns: itemNameWidth + 1 + "rem auto"
                          }}
                        >
                          {this.horizontalItem(item, i, source)}
                        </div>
                      );
                    })}
                </div>
                // </div>
              );
            case "photo":
              return (
                <Carousel autoplay effect="fade" draggable={true} slidesToScroll={1}>
                  {tab.str!!.split(",").map((url, index) => (
                    <div key={index}>
                      {/* <div
                        style={{
                          background: `url(${Config.apiHost +
                            url}) center no-repeat`,
                          height: isFullScreen
                            ? "100%"
                            : height
                            ? height - 20
                            : "inherit",
                          backgroundSize: "contain"
                        }}
                      > */}
                      <div style={{ overflow: "auto" }}>
                        <img
                          src={Config.apiHost + url}
                          className={"width-fill-available"}
                          style={{ margin: "auto" }}
                        />
                      </div>
                      {/* </div> */}
                    </div>
                  ))}
                </Carousel>
              );
            case "video":
              return (
                <div style={{ height: "100%" }}>
                  <Video url={tab.str!!.split(",")[0]} onLoaded={onVideoLoaded} />
                </div>
              );
            case "monitor":
              return (
                <VideoPlayer
                  sources={[
                    {
                      src: tab.str!.indexOf("/res/") == 0 ? Config.apiHost + tab.str : tab.str
                    }
                  ]}
                  // poster={modalProps.thumbnail}
                  triggerRef={ref => (this.videoRef.current = ref)}
                />
              );
              {
                /* <Video
                    url={tab.str!!.split(",")[0]}
                    onLoaded={onVideoLoaded}
                    height={isFullScreen ? "100%" : height - 20}
                  /> */
              }
            case "text":
              return (
                <div
                  dangerouslySetInnerHTML={{ __html: tab.str }}
                  style={{
                    textAlign: "left",
                    fontSize: isFullScreen ? "2em" : "16px"
                  }}
                />
              );
            case "externalLink":
              return (
                <div
                  style={{
                    height: isFullScreen ? "100%" : height ? height * 2 : "inherit",
                    width: `${isFullScreen ? 1 : 2}00%`
                  }}
                  className={isFullScreen ? "" : scss["wrap-iframe"]}
                >
                  {tab.str.indexOf(".swf") > -1 ? (
                    <embed width="100%" height="100%" src={tab.str!!} />
                  ) : (
                    <iframe
                      src={tab.str.indexOf("/") < 0 ? (tab.str += "/") : tab.str!!}
                      width="100%"
                      height="100%"
                      frameBorder="0"
                    />
                  )}
                </div>
              );
            default:
              return <div>{JSON.stringify(tab)}</div>;
          }
        })()}
      </div>
    );
  }
}
