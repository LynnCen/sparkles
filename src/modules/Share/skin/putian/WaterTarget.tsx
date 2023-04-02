import {
  useEffect,
  useMemo,
  useCallback,
  useState,
  useRef,
  CSSProperties
} from "react";
import CardLayout from "../../Components/CardLayout";
import VideoPlayer from "../../Components/VideoPlayer";
import { Select, Modal } from "antd";
import moment from "moment";
const Option = Select.Option;

const scss = require("../../../../styles/scss/sharepage.scss");
const vh = px => (px / 1080) * 100 + "vh";

interface Props {
  title?: string;
  data?: Array<any>;
  setItem?: (any) => void;
  region?: Array<{ [k: string]: string }>;
  children?: React.ReactNode;
  arrowIcon?: boolean;
  style?: CSSProperties;
  className?: string;
}
export function Monitor({
  title = "",
  region,
  data,
  setItem,
  children,
  style,
  className
}: Props) {
  // const slider = useRef();
  const [visible, setVisible] = useState(false);
  const [place, setPlace] = useState(["", ""]);

  useEffect(
    () => {
      if (region) {
        setPlace([data![0].town, data![0].village]);
      }
    },
    [region]
  );

  const getExceedsLength = () =>
    data!.reduce((count, cur) => {
      if (cur.data.some(e => e.exceed)) ++count;
      return count;
    }, 0);

  const alarmNode = (
    style: CSSProperties = { backgroundPosition: "0 -32px" }
  ) => (
    <i
      style={{
        display: "inline-block",
        width: 24,
        height: 22,
        margin: "0 6px",
        background: `url(./images/water/icons.png)`,
        ...style
      }}
    />
  );
  const dropdown = (
    <div>
      {data!
        .filter(e => e.data.some(e => e.exceed))
        .map((item, i) => (
          <div
            key={i}
            className={scss["flex-center-between"] + " " + scss["pointer"]}
            onClick={e => {
              setVisible(false);
              setPlace([place[0], item.village]);
              setItem && setItem(item);
              // slider.current.goTo(i);
            }}
          >
            <h5>{item.village}</h5>
            {item.data.some(e => e.exceed) &&
              alarmNode({
                backgroundPosition: "0 -54px",
                width: 20,
                height: 18
              })}
          </div>
        ))}
    </div>
  );

  return (
    <CardLayout
      title={
        <div className={scss["flex-center"]} style={{ position: "relative" }}>
          {title}
          <span
            className={scss["flex-center"] + " " + scss["pointer"]}
            onClick={e => getExceedsLength() && setVisible(!visible)}
          >
            {alarmNode()}
            <h3 style={{ color: "#fffc00", fontSize: "16px" }}>
              ({getExceedsLength()})
            </h3>
          </span>
          {visible ? (
            <div
              className={scss["dropdown-box"]}
              style={{ bottom: "28px", top: "auto", width: "377px", left: 0 }}
            >
              <div>{dropdown}</div>
            </div>
          ) : null}
        </div>
      }
      suffixIcon={
        <>
          <Select
            value={place[0]}
            onChange={val => {
              setPlace([val, region![val][0]]);
              setItem && setItem(data.find(e => e.town == val));
            }}
          >
            {region &&
              Object.keys(region).map(item => (
                <Option key={item}>{item}</Option>
              ))}
          </Select>
          <Select
            value={place[1]}
            onChange={val => {
              setPlace([place[0], val]);
              setItem && setItem(data.find(e => e.village == val));
              // const idx = data!.findIndex(e =>
              //   Object.keys(e).some(
              //     k => typeof e[k] == "string" && e[k].indexOf(val) > -1
              //   )
              // );
              // idx > -1 && slider.current.goTo(idx);
            }}
          >
            {place[0] &&
              region![place[0]].map(item => <Option key={item}>{item}</Option>)}
          </Select>
        </>
      }
      style={style}
      className={className}
      // slidesToShow={1}
      // slidesToScroll={1}
      // dropdownVisible={visible}
      // onDropdown={e => setVisible(!visible)}
      // dropdown={dropdown}
      // sliderRef={ref => (slider.current = ref)}
    >
      {children}
    </CardLayout>
  );
}

export default function WaterTarget({
  title = "",
  data,
  region,
  arrowIcon = true,
  style = undefined,
  className = ""
}: Props) {
  const [_data, setData] = useState(null);
  useEffect(
    () => {
      data[0] && setData(data[0]);
    },
    [region]
  );

  return (
    <Monitor
      title={title}
      data={data}
      setItem={setData}
      region={region}
      style={style}
      className={className}
    >
      {_data ? (
        <div>
          <h4 style={{ textAlign: "left" }}>{_data.village}</h4>
          <div
            className={scss["avatar-grid"]}
            style={{
              gridTemplateColumns: "35% 34% 32%",
              gridTemplateRows: `repeat(2, ${vh(46)})`,
              gap: `${vh(12)} 0`
            }}
          >
            {_data.data.map((item, i) => (
              <div
                className={scss["item"]}
                key={i}
                style={{ alignItems: "center" }}
              >
                <div className={scss["icon"]} style={{ marginRight: "14px" }}>
                  <span
                    style={{
                      width: "32px",
                      height: "32px",
                      display: "flex",
                      backgroundImage: `url(./images/water/icons.png)`,
                      backgroundPosition: `calc(-32px * ${5 + i}) 0`
                    }}
                  />
                </div>
                <div style={{ textAlign: "left" }}>
                  <div className={arrowIcon ? scss["flex"] : ""}>
                    <h2 style={{ color: item.color || "#fff", margin: 0 }}>
                      {item.value.toFixed(2)}
                    </h2>
                    {arrowIcon ? (
                      <span
                        style={{
                          marginLeft: "2px"
                        }}
                      >
                        {item.change != 0 && (
                          <img
                            src={`./images/water/arrow0${Number(
                              item.change == 1
                            )}.png`}
                            alt=""
                          />
                        )}
                      </span>
                    ) : null}
                  </div>
                  <h5 style={{ margin: 0 }}>{item.name}</h5>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </Monitor>
  );
}

export function MonitorCard({ title, data, region, style, className }: Props) {
  const [_time, setTime] = useState("");
  const [modalProps, setModalProps] = useState({
    title: " ",
    visible: false,
    thumbnail: "",
    url: "",
    code: ""
  });
  const videoRef = useRef(null);
  const [_data, setData] = useState(null);
  useEffect(
    () => {
      setData(data[0]);
      setInterval(() => {
        setTime(moment(new Date()).format("HH:mm:ss"));
      }, 1000);
    },
    [region]
  );
  const onItemClick = (e, i, item) => {
    const { name, thumbnail, url } = item;
    setModalProps({
      ...modalProps,
      visible: true,
      title: name + " " + (item.code || ""),
      thumbnail,
      url,
      code: item.code || ""
    });
  };
  return (
    <>
      <Monitor
        title={title}
        data={data}
        region={region}
        style={style}
        className={className + " " + scss["monitor-card"]}
      >
        {_data ? (
          <div>
            <div
              className={scss["avatar-grid"]}
              style={{
                gridTemplateColumns: "1fr 1fr",
                gridTemplateRows: `unset`,
                gap: `0 10px`
              }}
            >
              {_data.data.map((item, i) => (
                <div
                  key={i}
                  className={scss["pointer"] + " " + scss["monitor-item"]}
                  onClick={e => onItemClick(e, i, item)}
                >
                  {item.code ? <h5>{item.code}</h5> : null}
                  <div
                    className={scss["bg-item"]}
                    style={{
                      backgroundImage: `url(${item.thumbnail})`,
                      height: vh(92)
                    }}
                  />
                  <div className={scss["flex"] + " " + scss["meta"]}>
                    <div className={scss["flex"]}>
                      {<span className={scss["mark"]} />}
                      <h5>{item.name}</h5>
                    </div>
                    {<h5 style={{ fontFamily: "arial" }}>{_time}</h5>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </Monitor>
      <Modal
        {...modalProps}
        footer={null}
        mask={false}
        centered
        destroyOnClose={true}
        // forceRender={true}
        onCancel={e => {
          if (videoRef.current && videoRef.current.player.hasStarted()) {
            videoRef.current.player.pause();
          }
          setTimeout(() => {
            setModalProps({ modalProps: { ...modalProps, visible: false } });
          }, 100);
        }}
        className={scss["custom-modal"]}
      >
        <div className={scss["modal-content"]}>
          {modalProps.url ? (
            <VideoPlayer
              autoplay={true}
              sources={[{ src: modalProps.url }]}
              triggerRef={ref => (videoRef.current = ref)}
            />
          ) : null}
        </div>
      </Modal>
    </>
  );
}
