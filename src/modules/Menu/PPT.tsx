import { Component } from "react";
import Config from "../../config/Config";
import PPTTab from "../PPT/PPTTab";
import ShareService from "../../services/ShareService";

/**
 * @name Dynamic
 * @create: 2019/3/13
 * @description: 动态模拟
 */

interface PPTProps {}
interface PPTStates {
  activeKey: string;
  panes: any;
}

class PPT extends Component<PPTProps, PPTStates> {
  newTabIndex = 0;

  constructor(props: PPTProps) {
    super(props);
    this.state = {
      activeKey: "1",
      panes: [{ onemenuVos: [], compareTerrain: [] }]
    };
  }

  componentDidMount() {
    ShareService.get({ planId: Config.PLANID }, (success, res) => {
      if (success) {
        if (res.data.length > 0) {
          this.setState({ panes: res.data });
        } else {
          ShareService.create({ planId: Config.PLANID }, (bool, result) => {
            if (bool) {
              this.setState({ panes: result.data });
            }
          });
        }
      }
    });
  }

  render() {
    return <PPTTab currentData={this.state.panes[0]} />;
  }
}

export default PPT;
