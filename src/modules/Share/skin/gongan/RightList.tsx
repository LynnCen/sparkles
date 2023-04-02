import { CSSProperties, ReactNode, useState, useRef, useEffect } from "react";
import { Modal } from "antd";
import { feature } from "../../Components/Header";
import { useInterval } from "../water";
import VideoPlayer from "../../Components/VideoPlayer";
import Play from "../../../../components/tools/Play";
const css = require("../../../../styles/custom.css");
const scss = require("../../../../styles/scss/sharepage.scss");

let vh = px => (px / 1080) * 100 + "vh";
interface Props {
  data?: Array<any>;
  mask?: boolean;
  style?: CSSProperties;
  className?: string;
}
export default function RightList({
  data,
  mask = true,
  className = "",
  style = undefined
}: Props) {
  const [modalProps, setModalProps] = useState({
    title: "",
    visible: false,
    url: "",
    code: ""
  });
  const videoRef = useRef(null);
  const handleClick = (e, item) => {
    if (window.template && window.currentMenu) {
      const s =
        window.currentMenu.sub.find(s => item.name == s.title) ||
        window.currentMenu.sub.find(
          s => item.name.includes(s.title) || s.title.includes(item.name)
        );
      s && Play.play(s.feature!);
    }
    // setModalProps({ title: item.name, visible: true });
  };
  const showModal = (e, item) => {
    e.stopPropagation();
    const { name, url } = item;
    setModalProps({
      ...modalProps,
      visible: true,
      title: name + " " + (item.code || ""),
      url
    });
  };
  return (
    <>
      <div
        className={scss["right-list"] + " " + scss["pe-auto"] + " " + className}
        style={style}
      >
        {data.map((item, i) => (
          <div key={i} onClick={e => handleClick(e, item)}>
            <a
              href="javascript:;"
              onClick={e => e.preventDefault()}
              className={
                scss["flex"] + " " + scss["item"] + " " + scss["pointer"]
              }
            >
              <div className={""}>
                <div className={scss["flex-between"]}>
                  <h3>{item.name}</h3>
                  {/* <h2>{item.suffix}</h2> */}
                  <h2>{<RemainTime time={item.suffix} />}</h2>
                </div>
                <div className={scss["flex-between"]}>
                  {item.detail.map((item, i) => (
                    <h4>{item.name + item.value}</h4>
                  ))}
                </div>
              </div>
              <div className={scss["operation"] + " " + scss["flex-center"]}>
                <div>
                  {data[0].operation.map((item, i) => (
                    <img
                      key={i}
                      src={item.icon}
                      onClick={e => i == 0 && showModal(e, item)}
                    />
                  ))}
                </div>
              </div>
            </a>
          </div>
        ))}
      </div>
      <Modal
        {...modalProps}
        footer={null}
        mask={mask}
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
        <div className={scss["modal-content"]} style={{}}>
          {modalProps.url ? (
            <VideoPlayer
              sources={[
                {
                  src: modalProps.url
                }
              ]}
              // poster={modalProps.thumbnail}
              triggerRef={ref => (videoRef.current = ref)}
            />
          ) : null}
        </div>
      </Modal>
    </>
  );
}

const RemainTime = ({ time }) => {
  const [remain, setRemain] = useState(time);
  const timer = useInterval(() => {
    if (remain == 0) {
      clearInterval(timer);
    } else {
      setRemain(remain - 1);
    }
  }, 60 * 1000);
  return remain == 0 ? remain : "约" + remain + "分钟";
};

// const RemainTime = ({ time }) => {
//   const [remain, setRemain] = useState(time.split(":").map(n => Number(n)));
//   const timer = useInterval(() => {
//     let [h, m, s] = remain;
//     if (h == 0 && m == 0 && s == 0) {
//       clearInterval(timer);
//     } else {
//       if (s == 0) {
//         s = 59;
//         if (m == 0) {
//           m = 59;
//           --h;
//         } else --m;
//       } else --s;
//       setRemain([h, m, s]);
//     }
//   }, 1000);

//   return <>{remain.map(e => String(e).padStart(2, "0")).join(":")}</>;
// };
