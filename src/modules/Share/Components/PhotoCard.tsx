import { CSSProperties, ReactNode, useState, useRef, useEffect } from "react";
import { Modal, message } from "antd";
import moment from "moment";
import CardLayout from "./CardLayout";
// import Video from "../../../components/Video";
import VideoPlayer from "../Components/VideoPlayer";
import Config from "../../../config/Config";
import { CSSTransition } from "react-transition-group";
import { addFrameMask } from "../tool/VideoVague";

const css = require("../../../styles/custom.css");
const scss = require("../../../styles/scss/sharepage.scss");

let vh = px => (px / 1080) * 100 + "vh";

interface PhotoCardItem {
  code?: string;
  thumbnail: string;
  name: string;
  url?: string; //video,
  poster?: string;
}
interface PhotoCardProps {
  title?: string;
  enTitle?: string;
  suffixIcon?: ReactNode;
  data: Array<PhotoCardItem>;
  cols?: number; //2列
  colWidth?: string | number;
  rowHeight?: number;
  thumbnailHeight?: number; //单位px
  columnGap?: number;
  time?: boolean;
  mask?: boolean;
  mark?: boolean;
  // flash?: boolean;
  style?: CSSProperties;
  className?: string;
  template?: string;
  children?: ReactNode;
}

export default function PhotoCard({
  title,
  enTitle,
  suffixIcon = null,
  data,
  cols = 2,
  colWidth = "1fr",
  rowHeight,
  thumbnailHeight,
  columnGap = 10,
  time = true,
  mask = true,
  mark = true,
  // flash = false,
  style = undefined,
  className = "",
  template = "",
  children = null
}: PhotoCardProps) {
  const _style = {
    gridTemplateColumns: `repeat(${cols}, ${colWidth})`,
    gridTemplateRows: rowHeight ? `${rowHeight}px` : "unset",
    gridColumnGap: columnGap
  };
  const [_time, setTime] = useState("");
  const [modalProps, setModalProps] = useState({
    title,
    visible: false,
    thumbnail: "",
    url: "",
    code: ""
  });
  const videoRef = useRef(null);
  const videoControl = useRef(null);
  const canvasD = useRef(null);

  const [videourl, setVideourl] = useState("");
  const [isVideo, setIsVideo] = useState(false);
  const [isVideoplay, setIsVideoplay] = useState(false);
  let requestID;

  useEffect(() => {
    setInterval(() => {
      setTime(moment(new Date()).format("HH:mm:ss"));
    });
  }, []);

  const showModal = (e, item: PhotoCardItem) => {
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

  const handleKey = e => {
    if (e.keyCode == 32) {
      canvasCancel();
      window.removeEventListener("keydown", handleKey);
    }
  };

  //水库地块
  const fly = item => {
    const { maps, vrPlanner } = Config;
    const camera = maps.getCamera();

    setTimeout(() => {
      setVideourl(item.url);
      setIsVideo(true);
      controlVideo();
      setTimeout(() => {
        message.info("按空格键关闭视频");
      }, 500);
    }, 3000);
    maps.getCamera().setMinPitch(-3);

    var camPos = new vrPlanner.GeoLocation(
      13063931.904502673,
      3728802.2759930077,
      4.3803768989810985
    );
    var lookAt = new vrPlanner.GeoLocation(
      13063849.556397159,
      3728858.965577326,
      6.634384012024155
    );
    window.addEventListener("keydown", e => handleKey(e));
    const timeTrans = new vrPlanner.Transition(
      3,
      vrPlanner.Interpolation.CubicBezier.LINEAR
    );

    maps.getCamera().flyTo(camPos, lookAt, true, timeTrans);

    maps.setInput(vrPlanner.Input.NONE);
  };
  const controlVideo = () => {
    videoControl.current.oncanplay = play();
  };
  const play = () => {
    if (!isVideoplay) {
      //当前视频暂停
      videoControl.current.play();
      // 调用draw实现视频边缘虚化效果
      requestID = window.requestAnimationFrame(draw);
    } else {
      //暂停视频
      videoControl.current.pause();
      // 暂停时 也停止视频灰度效果
      window.cancelAnimationFrame(requestID);
      // }
    }
  };
  const draw = () => {
    const interval = setInterval(() => {
      var canvas: any = document.getElementById("canvas")!;
      if (canvas) {
        clearInterval(interval);
        const width = window.screen.width;
        const height = window.screen.height;
        //canvas.width = 1152;
        //  canvas.height = 648;
        canvas.width = width * 0.7;
        canvas.height = height * 0.7;

        var ctx = canvas.getContext("2d");
        var video = videoControl.current;
        var ih = canvas.height;
        var iw = canvas.width;
        var value = ((iw + ih) * 0.04) / 2;
        var isize = parseInt(value);

        //绘图
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        //获取画面像素信息，得到一个每个像素点的rgba值得数组，需要运行在服务端
        // var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        ctx.clearRect(0, 0, iw, ih);
        ctx.globalCompositeOperation = "source-over";

        ctx.drawImage(video, 0, 0, iw, ih);

        ctx.save();
        ctx.globalCompositeOperation = "destination-out";
        addFrameMask(ctx, 0, 0, iw, ih, isize, 255);
        ctx.restore();

        //再次调用draw
        requestID = window.requestAnimationFrame(draw);
      }
    }, 100);
  };
  const canvasCancel = () => {
    const { maps, vrPlanner } = Config;

    setIsVideo(false);
    window.cancelAnimationFrame(requestID);
    setTimeout(() => {
      maps.getCamera().setMinPitch(3);
    }, 100);

    maps.setInput(vrPlanner.Input.EXAMINE);
  };
  return (
    <CardLayout
      title={title}
      enTitle={enTitle}
      suffixIcon={suffixIcon}
      style={style}
      className={className}
    >
      {children}
      <div
        className={scss["photo-grid"] + " " + scss["pe-auto"]}
        style={_style}
      >
        {data.map((item, i) => (
          <div
            key={i}
            className={scss["pointer"]}
            onClick={e => {
              if (template == "water" && i == 0) {
                fly(item);
              } else {
                showModal(e, item);
              }
            }}
          >
            {item.code ? <h5>{item.code}</h5> : null}
            <div
              className={scss["bg-item"]}
              style={{
                backgroundImage: `url(${item.thumbnail})`,
                height: thumbnailHeight ? vh(thumbnailHeight) : vh(106)
              }}
            />
            <div className={scss["flex"] + " " + scss["meta"]}>
              <div className={scss["flex"]}>
                {mark ? <span className={scss["mark"]} /> : null}
                <h5>{item.name}</h5>
              </div>
              {time ? <h5>{_time}</h5> : null}
            </div>
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
        <div
          className={scss["modal-content"]}
          style={{
            backgroundImage: modalProps.url
              ? "none"
              : `url(${modalProps.thumbnail})`
          }}
        >
          {modalProps.url ? (
            <VideoPlayer
              sources={[{ src: modalProps.url }]}
              // poster={modalProps.thumbnail}
              triggerRef={ref => (videoRef.current = ref)}
            />
          ) : null}
        </div>
      </Modal>
      <div style={{ height: 0 }}>
        <video
          className={scss["video-show"]}
          ref={videoControl}
          // autoPlay="autoplay"
          controls="controls"
          onEnded={() => {
            window.cancelAnimationFrame(requestID);
          }}
          src={videourl}
          style={{ height: 0 }}
        />

        {/* <CSSTransition
          in={isVideo}
          classNames="trans"
          timeout={2000}
          unmountOnExit
        > */}
        {isVideo ? (
          <canvas id="canvas" className={scss["v-canvas"]} ref={canvasD} />
        ) : null}
        {/* </CSSTransition> */}
      </div>
    </CardLayout>
  );
}
