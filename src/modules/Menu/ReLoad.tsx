import { Component } from "react";
import VrpIcon from "../../components/VrpIcon";

const css = require("../../styles/custom.css");

/**
 * @name ReLoad
 * @author: bubble
 * @create: 2018/11/28
 */

interface IReLoadProps {}

interface IReLoadStates {}

class ReLoad extends Component<IReLoadProps, IReLoadStates> {
  constructor(props: IReLoadProps) {
    super(props);
  }

  reLoad = () => {
    window.location.reload();
  };

  render() {
    return (
      <div>
        <VrpIcon
          iconName={"icon-refresh"}
          className={css["vrp-menu-icon"]}
          onClick={this.reLoad}
          title="刷新"
        />
      </div>
    );
  }
}

export default ReLoad;
