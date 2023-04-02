import React, { Component } from "react";
import VrpIcon from "../../components/VrpIcon";
import GPSModal from "../Modal/GPSModal";
import Config from "../../config/Config";

const css = require("../../styles/custom.css");

interface GPSProps {}

interface GPSState {
  isShow: boolean;
}

export class GPS extends Component<GPSProps, GPSState> {
  constructor(props: GPSProps) {
    super(props);
    this.state = {
      isShow: false
    };
  }
  handleClcik = () => {
    this.setState({
      isShow: !this.state.isShow
    });
  };

  closeModal = () => {
    this.setState(
      {
        isShow: false
      },
      () => {
        const { maps } = Config;
        const modelLayer = maps.getLayerById("GPSLayer");
        if (modelLayer) {
          modelLayer.clearFeatures();
        }
      }
    );
  };
  render() {
    return (
      <div>
        <VrpIcon
          className={css["vrp-menu-icon"]}
          iconName={"icon-gps"}
          title={"获取GPS"}
          onClick={this.handleClcik}
        />
        {this.state.isShow ? <GPSModal closeModal={this.closeModal} /> : null}
      </div>
    );
  }
}

export default GPS;
