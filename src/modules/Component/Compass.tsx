import { Component, CSSProperties, useState, useEffect } from "react";
import Config from "../../config/Config";
import MarkerBox from "../../modules/Modal/MarkerBoxModal";
import ReactDOM from "react-dom";
const { maps, vrPlanner } = Config;
const css = require("../../styles/custom.css");

/**
 * @name Compass
 * @create: 2019/1/7
 * @description: 指南针
 */

const flyToYaw = () => {
  if (maps.getCamera().getYaw() !== 0) {
    let cam = maps.getCamera();
    let dis = cam.getGeoLocation().distance(cam.getLookAt());
    let geo = new vrPlanner.GeoLocation(
      cam.getGeoLocation().x(),
      cam.getGeoLocation().y() + dis,
      cam.getLookAt().z()
    );
    cam.flyTo(cam.getGeoLocation(), geo);
  }
};

interface CompassProps {
  heightPosition?: number;
  style?: CSSProperties;
}

interface CompassStates {
  rotate: number;
}

export default class Compass extends Component<CompassProps, CompassStates> {
  constructor(props: CompassProps) {
    super(props);
    this.state = {
      rotate: 0
    };
  }

  handleCamera = () => {
    const camera = maps.getCamera();
    camera.bindEvent("move", () => {
      this.setState({ rotate: camera.getYaw() });
    });
  };

  componentDidMount() {
    this.handleCamera();
  }

  render() {
    const { heightPosition, style } = this.props;
    return (
      <div
        className={css["vrp-compass"]}
        style={
          heightPosition
            ? { top: heightPosition }
            : { ...style, transform: "rotate(" + this.state.rotate + "deg)" }
        }
        onClick={flyToYaw}
      >
        {/* <img
          className={css["needle"]}
          // src={`${process.env.publicPath}images/compass_needle.svg`}
          src={`${process.env.publicPath}images/newcompass.svg`}
        /> */}
      </div>
    );
  }
}

export const CameraRotate = ({ children, ...props }) => {
  const [rotate, setRotate] = useState(0);
  useEffect(() => {
    handleCamera();
    // console.log(children);
  }, []);

  const handleCamera = () => {
    const camera = maps.getCamera();
    camera.bindEvent("move", () => setRotate(camera.getYaw()));
  };
  return (
    <>
      {{
        ...children,
        props: {
          ...children.props,
          style: { ...children.style, transform: `rotate(${rotate}deg)` },
          onClick: flyToYaw
        }
      }}
    </>
  );
};
