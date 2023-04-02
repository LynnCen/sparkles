import React, { Component } from "react";
import VrpIcon from "../../components/VrpIcon";

const css = require("../../styles/custom.css");

interface ScreenProps {
  showHideMenu: () => void;
  isFull: boolean;
  className?: string;
}

interface ScreenState {}

export class FullScreen extends Component<ScreenProps, ScreenState> {
  constructor(props: ScreenProps) {
    super(props);
  }

  render() {
    const { isFull, className } = this.props;
    return (
      <div className={className ? className : css["vrp-full-screen"]}>
        <VrpIcon
          className={css["vrp-menu-icon"]}
          style={{ color: isFull ? "#fff" : "" }}
          iconName={isFull ? "icon-zoom" : "icon-magnify"}
          title={isFull ? "退出全屏" : "全屏"}
          onClick={this.props.showHideMenu}
        />
      </div>
    );
  }
}

export default FullScreen;
