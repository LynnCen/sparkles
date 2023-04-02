import { CSSProperties, createRef, Component } from "react";
import { Carousel, Modal, message, Spin } from "antd";
import CardLayout from "../../Components/CardLayout";
import VideoPlayer from "../../Components/VideoPlayer";
import { getWinterTimetable, isDuringDate } from "./tools";
const scss = require("../../../../styles/scss/sharepage.scss");
let vh = px => (px / 1080) * 100 + "vh";

localStorage.setItem("SessionKey", "39e43b25-4663-4284-aee8-251d7407878f");

interface Props {
  title: string;
  enTitle: string;
  href: string;
}
interface States {
  monitors: Array<any>;
  modalProps: {
    title: string;
    visible: boolean;
    url: string;
  };
  loading: boolean;
}
export default class MonitorClass extends Component<Props, States> {
  size = 54;
  sources = [];
  timetable = [];
  videoRef = createRef();
  slider: React.RefObject<any> = createRef();

  constructor(props) {
    super(props);
    this.state = {
      monitors: [],
      modalProps: {
        title: "",
        visible: false,
        url: ""
      },
      loading: false
    };
  }
  async componentWillMount() {
    const results = await Promise.all([
      // fetch(`http://192.168.0.52/monitors.json`).then(res => res.json()),
      fetch(`${process.env.lizhongAPI}/RtmpExcel/getLink`).then(r => r.json()),
      this.authXiaoyang()
    ]);
    this.sources = results[0].data
      .map(item => ({
        ...item,
        roomName: item.roomName.replace(
          /(.*)\((\d+)\)(.*)/,
          (a, b, c, d) => b + c + d
        )
      }))
      .sort((a, b) => a.roomNo - b.roomNo);
    this.setState({
      monitors: this.sources.slice(0, this.size)
    });
    this.timetable = getWinterTimetable();
    if (this.timetable) {
      await this.updateTable();
    }
    setInterval(this.authXiaoyang, 28 * 60 * 1000);
  }
  updateTable = async () => {
    // message.loading("正在加载当前课表...", 6);
    let loadedNum = 0;
    this.setState({ loading: true });
    for (let monitor of this.sources.filter(e => e.roomNo)) {
      await this.getRoomClassTableForCurrent(monitor);
    }
    // for (let i = 0; i < 9; i++) {
    //   for (let j = 0; j < this.sources.length / 9; j++) {
    //     setTimeout(async () => {
    //       await this.getRoomClassTableForCurrent(
    //         this.sources[(i * this.sources.length) / 9 + j]
    //       );
    //       ++loadedNum;
    //       if (loadedNum > 18) {
    //         this.setState({ loading: false });
    //       }
    //     }, i * 2000);
    //   }
    // }
    // this.setState({ monitors: this.sources.slice(0, this.size) });

    let classIndex;
    for (let i = 0; i < this.timetable.length; i++) {
      let idx = isDuringDate.apply(null, this.timetable[i]);
      if (idx == -1) {
        if (classIndex == i - 1) {
          break;
        } else {
          classIndex = -1;
        }
      } else if (i < this.timetable.length - 1) {
        if (idx == 0) {
          classIndex = i;
          break;
        } else {
          classIndex = i;
          continue;
        }
      } else classIndex = -2;
    }
    console.log(classIndex);
    if (classIndex > -2) {
      let now = new Date();
      let nextClassTime = new Date(this.timetable[classIndex + 1][0]);
      console.log((nextClassTime - now) / 1000 / 60);
      setTimeout(this.updateTable, nextClassTime - now);
    }
  };
  authXiaoyang = () =>
    fetch(
      `${
        process.env.lizhongProxy
      }/http://api.xiaoyangedu.com/AuthenticationModular/AuthenticationByUserName/xyapp/xyapp_123/monitorclass/3b000d23-b573-4e04-9156-a6d1290116d9`
    )
      .then(res => res.json())
      .then(res => {
        if (res.data.SessionKey != localStorage.getItem("SessionKey")) {
          localStorage.setItem("SessionKey", res.data.SessionKey);
        }
        return res;
      })
      .catch(err => {
        message.error("排课系统认证失败啦~~");
        console.table(err);
      });
  getRoomClassTableForCurrent = async monitor => {
    // let monitor = this.sources.find(item => item.roomNo == roomNo);
    if (monitor.roomNo && Number(monitor.roomNo).toString() != "NaN") {
      return await fetch(
        `${
          process.env.lizhongProxy
        }/http://api.xiaoyangedu.com/ClassTableModular/GeRoomClassTableForCurrentByRoomNO/${
          monitor.roomNo
        }/3b000d23-b573-4e04-9156-a6d1290116d9/${localStorage.getItem(
          "SessionKey"
        )}?version`
      )
        .then(res => res.json())
        .then(res => {
          if (res.data) {
            monitor["TeacherName"] = res.data.map(
              item => item.TeacherName || ""
            );
            monitor["SubjectName"] = res.data[0].SubjectName;
            console.log(monitor);
          }

          return monitor;
        })
        .catch(err => {
          message.error("获取课表失败啦~~");
          console.table(err);
        });
    }
    return Promise.resolve();
  };

  showModal = (e, item) => {
    e.stopPropagation();
    const { modalProps } = this.state;
    this.setState({
      modalProps: {
        ...modalProps,
        visible: true,
        title: item.RoomName,
        url: item.url
      }
    });
  };

  next = () => {
    this.slider.current.next();
  };
  previous = () => {
    this.slider.current.prev();
  };

  render() {
    const { title, enTitle, href } = this.props;
    const { monitors, modalProps, loading } = this.state;
    return (
      <>
        <CardLayout
          title={title}
          enTitle={enTitle}
          href={href}
          suffixIcon={
            <>
              <span onClick={this.previous}>
                <img
                  src={require("../../../../assets/icon/icon_left1.png")}
                  alt=""
                />
              </span>
              <span onClick={this.next}>
                <img
                  src={require("../../../../assets/icon/icon_right1.png")}
                  alt=""
                />
              </span>
            </>
          }
          style={{ marginBottom: vh(30) }}
        >
          {/* <Spin spinning={loading}> */}
          <Carousel
            ref={this.slider}
            autoplay
            autoplaySpeed={1000}
            infinite={true}
            dots={false}
            speed={1000}
            draggable
            slidesToShow={5}
            swipeToSlide={true}
            slidesToScroll={1}
            className={scss["pe-auto"]}
          >
            {monitors.map((item, i) => (
              <div className={scss["item"]} key={i}>
                <div
                  className={scss["icon"]}
                  onClick={e => this.showModal(e, item)}
                >
                  <div
                    className={scss["flex-center"]}
                    style={{
                      height: "58px",
                      width: "58px",
                      background:
                        "linear-gradient(to top right, #0089f5,#0095d7, #02bd84, #02cb69)"
                    }}
                  >
                    {(item.SubjectName && item.SubjectName.substr(0, 1)) ||
                      "无"}
                  </div>
                </div>
                <div style={{ opacity: 0.8 }}>
                  <h4
                    className={
                      scss["arial"] +
                      " " +
                      scss["white"] +
                      " " +
                      scss["ellipsis"]
                    }
                    style={{ lineHeight: "17px" }}
                  >
                    {(item.TeacherName && item.TeacherName.join("/")) || "无"}
                  </h4>
                  <h4>{item.roomName}</h4>
                </div>
              </div>
            ))}
          </Carousel>
          {/* </Spin> */}
        </CardLayout>
        <Modal
          {...modalProps}
          footer={null}
          centered
          destroyOnClose={true}
          // forceRender={true}
          onCancel={e => {
            if (
              this.videoRef.current &&
              this.videoRef.current.player.hasStarted()
            ) {
              this.videoRef.current.player.pause();
            }
            setTimeout(() => {
              this.setState({ modalProps: { ...modalProps, visible: false } });
            }, 100);
          }}
          className={scss["campus-modal"]}
        >
          <div
            style={{
              height: "400px"
            }}
          >
            {modalProps.url ? (
              <VideoPlayer
                sources={[{ src: modalProps.url }]}
                triggerRef={ref => (this.videoRef.current = ref)}
              />
            ) : null}
          </div>
        </Modal>
      </>
    );
  }
}
