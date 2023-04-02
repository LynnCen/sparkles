import React, { Component } from "react";
import VrpIcon from "../../components/VrpIcon";
import Config from "../../config/Config";

const css = require("../../styles/custom.css");

interface SnapshotProps {
  callBack: (obj) => void;
}
interface SnapshotState {}
export class Snapshot extends Component<SnapshotProps, SnapshotState> {
  constructor(props: SnapshotProps) {
    super(props);
  }

  handleClick = () => {
    const { maps } = Config;
    maps.takeScreenshot(264 * 2, 176 * 2).done(imgData => {
      const camera = maps.getCamera();
      const cameraPos = camera.getGeoLocation();
      const cameraLook = camera.getLookAt();
      const yaw = camera.getYaw();
      const canvas = document.createElement("canvas");
      canvas.width = imgData.width;
      canvas.height = imgData.height;
      const ctx: any = canvas.getContext("2d");
      ctx.putImageData(imgData, 0, 0);
      const dataUrl = canvas.toDataURL("image/png", 0.1);
      this.props.callBack({ dataUrl, canvas, cameraPos, cameraLook, yaw });
    });
  };

  render() {
    return (
      <div>
        <VrpIcon
          className={css["vrp-menu-icon"]}
          iconName={"icon-snapshoot"}
          title="记录当前视角"
          onClick={this.handleClick}
        />
      </div>
    );
  }
}

export default Snapshot;
