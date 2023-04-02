import { Component } from "react";
import VrpIcon from "../../components/VrpIcon";
import Handle from "../../components/tools/Handle";

const css = require("../../styles/custom.css");

/**
 * @name InitialView
 * @author: bubble
 * @create: 2018/11/28
 * @param 初始视角
 */

interface IInitialViewProps {}

interface IInitialViewStates {}

class InitialView extends Component<IInitialViewProps, IInitialViewStates> {
  constructor(props: IInitialViewProps) {
    super(props);
  }

  cameraInit = () => {
    Handle.HomeHandle();
  };

  render() {
    return (
      <div>
        <VrpIcon
          className={css["vrp-menu-icon"]}
          iconName={"icon-home"}
          title="初始视角"
          onClick={this.cameraInit}
        />
      </div>
    );
  }
}

export default InitialView;
