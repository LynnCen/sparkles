import React, { Component, CSSProperties } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.min.css";
import "videojs-flash";

interface VideoPlayerProps {
  autoPlay?: boolean;
  preload?: boolean;
  controls?: boolean;
  loop?: boolean;
  techOrder?: string[];
  poster?: string;
  sources: [
    {
      src: string;
      type?: string; //application/x-mpegURL(.m3u8) video/mp4 rtmp/flv
    }
  ];
  style?: CSSProperties;
  triggerRef?: (ref: any) => any;
  onPip?: (isInPictureInPicture: boolean) => void;
  onEnterPip?: (e) => void;
  onLeavePip?: (e) => void;
}
export default class VideoPlayer extends Component<VideoPlayerProps> {
  videoNode: HTMLElement;
  player;
  static defaultProps = {
    autoPlay: true,
    preload: true, //'metadata'
    controls: true,
    loop: false,
    techOrder: ["html5", "flash"],
    flash: {
      swf: require("../../../assets/video-js.swf")
    },
    style: { height: "100%", width: "100%" },
    onPip: isInPictureInPicture => undefined,
    onEnterPip: e => undefined,
    onLeavePip: e => undefined
  };
  constructor(props) {
    super(props);
  }
  async componentDidMount() {
    const { sources, triggerRef, onPip, onEnterPip, onLeavePip } = this.props;
    triggerRef && triggerRef(this);
    // for (let item of sources) {
    //   if (item.src.length == 20 && item.src.indexOf("3311") > -1) {
    //     const src = await fetch(
    //       `${
    //         process.env.proxyUrl
    //       }/https://218.205.127.176:9999/artemis/api/mss/v1/hls/` + item.src
    //     )
    //       .then(res => res.text())
    //       .catch(err => console.error(err));
    //     item.src = src;
    //   }
    // }
    this.player = videojs(this.videoNode, this.props, () => {
      console.log("onPlayerReady", this.player);
    });
    this.player.on("pause", () => {
      console.log("onpause");
    });
    this.player.on("dispose", () => {
      console.log("ondispose");
    });

    this.player.on("enterpictureinpicture", e => {
      onPip(this.player.isInPictureInPicture());
      onEnterPip(e);
      this.toggleModal();
    });
    this.player.on("leavepictureinpicture", e => {
      onPip(this.player.isInPictureInPicture());
      onLeavePip(e);
      this.toggleModal();
    });
  }
  componentWillReceiveProps(nextProps) {

    if (
      JSON.stringify(nextProps.sources.map(e => e.src)) !=
      JSON.stringify(this.props.sources.map(e => e.src))
    ) {
      this.player.pause();
      this.player.src(nextProps.sources);
      this.player.load(nextProps.sources);
    }
  }
  componentWillUnmount() {
    this.player.dispose();
  }
  toggleModal = () => {
    let modals = Array.from(document.querySelectorAll(".ant-modal") || []);
    let m = modals.find(m => m.contains(this.player.el_));
    m && (m.hidden = this.player.isInPictureInPicture());
  };
  render() {
    const { style, autoPlay, controls, loop } = this.props;
    return (
      <div data-vjs-player>
        <video
          autoPlay={autoPlay}
          controls={controls}
          loop={loop}
          data-setup='{"techOrder": ["html5", "flash"]}'
          ref={node => (this.videoNode = node!)}
          className="video-js"
          style={style}
        >
          {/* <source src="rtmp://62.113.210.250/medienasa-live/ok-merseburg_high"></source> */}
        </video>
      </div>
    );
  }
}
