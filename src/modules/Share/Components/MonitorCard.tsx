import { CSSProperties, ReactNode, useState, useRef, useEffect } from "react";
import { Modal, Empty } from "antd";
import moment from "moment";
import VideoPlayer from "./VideoPlayer";
import SlideLayout from "./SlideLayout";
import { feature } from "../Components/Header";
import Play from "../../../components/tools/Play";
import VrpIcon from "../../../components/VrpIcon";
import DragModal from "../../../components/DragModal";

const css = require("../../../styles/custom.css");
const scss = require("../../../styles/scss/sharepage.scss");

let vh = px => (px / 1080) * 100 + "vh";

export interface Item {
  code?: string;
  thumbnail: string;
  name: string;
  url?: string; //video,
  poster?: string;
  status?: 1 | 0;
}
interface Props {
  title?: string | ReactNode;
  enTitle?: string;
  prefixIcon?: ReactNode;
  suffixIcon?: ReactNode;
  data: Array<Item>;
  cols?: number; //2列
  colWidth?: string | number;
  rowHeight?: number;
  thumbnailHeight?: number; //单位px
  columnGap?: number;
  time?: boolean;
  mask?: boolean;
  mark?: boolean;
  autoplay?: boolean;
  position?: boolean;
  onClick?: Function;
  onPositonClick?: Function;
  style?: CSSProperties;
  className?: string;
  offset?: number;
  content?: any;
}

export default function MonitorCard({
  title,
  enTitle,
  prefixIcon = null,
  suffixIcon = null,
  data,
  cols = 2,
  colWidth = "1fr",
  rowHeight,
  thumbnailHeight,
  columnGap = 10,
  time = true,
  mask = true,
  autoplay = false,
  mark = true,
  position = false,
  onClick,
  onPositonClick = (item: any) => null,
  style = undefined,
  className = "",
  content: Content = null
}: Props) {
  const [_time, setTime] = useState("");
  const [modalProps, setModalProps] = useState({
    title,
    visible: false,
    thumbnail: "",
    url: "",
    code: ""
  });
  const videoRef = useRef(null);

  useEffect(() => {
    setInterval(() => {
      setTime(moment(new Date()).format("HH:mm:ss"));
    }, 1000);
  }, []);

  const onItemClick = (e, i, item: Item) => {
    if (
      window.template &&
      window.template.indexOf("ecology") > -1 &&
      window.currentMenu
    ) {
      // debugger;
      const s =
        window.currentMenu.sub.find(s => item.name == s.title) ||
        window.currentMenu.sub.find(
          s => item.name.includes(s.title) || s.title.includes(item.name)
        );
      s && Play.play(s.feature!);
      // play(window.currentMenu.sub[offset + i].feature!);
    } else {
      onClick
        ? onClick(item)
        : setModalProps({
            ...modalProps,
            visible: true,
            ...item,
            title: item.name + " " + (item.code || "")
          });
    }
  };

  return (
    <>
      <SlideLayout
        title={title}
        enTitle={enTitle}
        prefixIcon={prefixIcon}
        suffixIcon={suffixIcon}
        style={style}
        className={className + " " + scss["monitor-card"]}
        dropdownData={data}
        onItemClick={onItemClick}
      >
        {data.length ? (
          data.map((item, i) => (
            <div
              key={i}
              className={[
                scss["pointer"],
                scss["monitor-item"],
                typeof item.status == "number" &&
                  !item.status &&
                  scss["inactive"]
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {item.code ? <h5>{item.code}</h5> : null}
              <div
                className={scss["bg-item"]}
                style={{
                  backgroundImage: `url(${item.thumbnail}),url(${
                    process.env.publicPath
                  }images/img-error.png)`,
                  height: vh(thumbnailHeight || 92)
                }}
                onClick={e => onItemClick(e, i, item)}
              />
              <div
                className={
                  scss["flex"] +
                  " " +
                  scss["meta"] +
                  " " +
                  (time ? scss["time"] : "")
                }
              >
                <div className={scss["flex"]}>
                  {mark ? <span className={scss["mark"]} /> : null}
                  <h5 title={item.name}>{item.name}</h5>
                </div>
                {time && item.status != 0 ? (
                  <h5 style={{ fontFamily: "arial" }}>{_time}</h5>
                ) : (
                  position && (
                    <VrpIcon
                      iconName="icon-position2"
                      onClick={e => onPositonClick(item)}
                    />
                  )
                )}
              </div>
            </div>
          ))
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={<span>暂无视频</span>}
          />
        )}
      </SlideLayout>
      {modalProps.visible && (
        // <Modal
        //   {...modalProps}
        //   footer={null}
        //   mask={mask}
        //   centered
        //   destroyOnClose={true}
        //   maskClosable={mask}
        //   onCancel={e => {
        //     if (videoRef.current && videoRef.current.player.hasStarted()) {
        //       videoRef.current.player.pause();
        //     }
        //     setTimeout(() => {
        //       setModalProps({ modalProps: { ...modalProps, visible: false } });
        //     }, 100);
        //   }}
        //   getContainer={node => document.querySelector(".ant-drawer") || node}
        //   className={scss["custom-modal"]}
        // >
        //   <div
        //     className={scss["modal-content"]}
        //     style={{
        //       backgroundImage: modalProps.url
        //         ? "none"
        //         : `url(${modalProps.thumbnail})`
        //     }}
        //   >
        //     {modalProps.url && !Content ? (
        //       <VideoPlayer
        //         autoplay={autoplay}
        //         sources={
        //           Array.isArray(modalProps.url)
        //             ? modalProps.url.map(e => ({ src: e }))
        //             : [{ src: modalProps.url }]
        //         }
        //         // poster={modalProps.thumbnail}
        //         triggerRef={ref => (videoRef.current = ref)}
        //       />
        //     ) : (
        //       <Content {...modalProps} />
        //     )}
        //   </div>
        // </Modal>
        <DragModal
          {...modalProps}
          centered
          onClose={e => {
            if (videoRef.current && videoRef.current.player.hasStarted()) {
              videoRef.current.player.pause();
            }
            setTimeout(() => {
              setModalProps({ modalProps: { ...modalProps, visible: false } });
            }, 100);
          }}
          // getContainer={node => document.querySelector(".ant-drawer") || node}
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
            {modalProps.url && !Content ? (
              <VideoPlayer
                autoplay={autoplay}
                sources={
                  Array.isArray(modalProps.url)
                    ? modalProps.url.map(e => ({ src: e }))
                    : [{ src: modalProps.url }]
                }
                // poster={modalProps.thumbnail}
                triggerRef={ref => (videoRef.current = ref)}
              />
            ) : (
              <Content {...modalProps} />
            )}
          </div>
        </DragModal>
      )}
    </>
  );
}
