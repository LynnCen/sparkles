import { CSSProperties, createRef, Component } from "react";
import { Carousel, Modal, message, Spin, Empty } from "antd";
import CardLayout from "../../Components/CardLayout";
const scss = require("../../../../styles/scss/sharepage.scss");
let vh = px => (px / 1080) * 100 + "vh";

interface Props {
  title: string;
  enTitle: string;
  href: string;
}
interface States {
  moralEdu: Array<Object>;
  // modalProps: {
  //   title: string;
  //   visible: boolean;
  //   url: string;
  // };
  // loading: boolean;
}
const year = new Date().getFullYear();
const month = new Date().getMonth();
const grades = [year - 2, year - 1, year].map(y => (month < 8 ? --y : y));
const classes = new Array(18)
  .fill(1)
  .map((n, i) => String(n + i).padStart(2, "0"));

export default class MoralEdu extends Component<Props, States> {
  slider: React.RefObject<any> = createRef();
  constructor(props) {
    super(props);
    this.state = { moralEdu: [] };
  }
  async componentWillMount() {
    const error = { status: false };
    for (let i = 0; i < grades.length; i++) {
      for (let j = 0; j < 3; j++) {
        for (let k = 0; k < 6; k++) {
          setTimeout(async () => {
            await this.getCreditByClass(i, 6 * j + k, error);
          }, (i + 1) * j * 2000);
          if (error.status) break;
        }
        if (error.status) break;
      }
      if (error.status) break;
    }
  }
  getCreditByClass = async (i, j, error) => {
    await fetch(
      `${
        process.env.lizhongProxy
      }/http://10.10.10.21/out/credit_mainclass.php?m=${grades[i]}级${
        classes[j]
      }班`
    )
      .then(res => res.text())
      .then(res => {
        if (/\[.*\]/.test(res)) {
          this.setState({
            moralEdu: this.state.moralEdu.concat(
              JSON.parse(res).map(item => ({
                ...item,
                class: `${grades[i]}级${classes[j]}班`
              }))
            )
          });
        } else if (/error/.test(res)) {
          error.status = true;
        }
      })
      .catch(err => {
        console.table(JSON.stringify(err));
        error.status = true;
      });
  };
  // showModal = item => {
  //   const { modalProps } = this.state;
  //   this.setState({
  //     modalProps: {
  //       ...modalProps,
  //       visible: true,
  //       title: item.RoomName,
  //       url: item.url
  //     }
  //   });
  // };

  next = () => {
    this.slider.current.next();
  };
  previous = () => {
    this.slider.current.prev();
  };

  render() {
    // const { title, enTitle, href } = this.props;
    const { moralEdu } = this.state;
    return (
      <>
        <CardLayout
          {...this.props}
          suffixIcon={
            <img src={require("../../../../assets/icon/icon-rili1.png")} />
          }
        >
          {moralEdu.length ? (
            <Carousel
              autoplay
              autoplaySpeed={1000}
              infinite={true}
              dots={false}
              dotPosition={"right"}
              // vertical={true}
              pauseOnHover={true}
              verticalSwiping={true}
              slidesToShow={Math.min(moralEdu.length, 6)}
              beforeChange={(current, next) => {
                // this.setState({ activeSlide: next })
                // console.log(current);
              }}
              afterChange={current => {
                // this.setState({ activeSlide2: current })
              }}
            >
              {moralEdu.map((e, i) => (
                <div>
                  <div
                    className={scss["flex-between"]}
                    style={{ opacity: 0.8, lineHeight: vh(32) }}
                  >
                    <h4>{e.class}</h4>
                    <h4>{e.stuname}</h4>
                    <h4 style={{ width: "45%" }} className={scss["ellipsis"]}>
                      {e.item}
                    </h4>
                    <h4>{e.points}</h4>
                    <h4>
                      {e.ptime && e.ptime.split(" ")[0].replace(/\d{4}-/, "")}
                    </h4>
                  </div>
                </div>
              ))}
            </Carousel>
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              style={{ color: "#fff" }}
            />
          )}
        </CardLayout>
        {/* <Modal
          {...modalProps}
          footer={null}
          centered
          destroyOnClose={true}
          // forceRender={true}
          onCancel={e => {
            if (this.videoRef.current) {
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
        </Modal> */}
      </>
    );
  }
}
